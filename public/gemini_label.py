import os
import json
import time
import threading
import logging
import datetime
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from google import genai
from dotenv import load_dotenv

# load_dotenv() from ROOT
load_dotenv()

# --- CONFIG ---
# @note: Support for multiple keys to bypass RPD limits for large decks.
# List multiple keys in .env as GEMINI_API_KEYS=key1,key2,key3
API_KEYS_RAW = os.getenv("GEMINI_API_KEYS", os.getenv("GEMINI_API_KEY", ""))
API_KEYS = [k.strip() for k in API_KEYS_RAW.split(",") if k.strip()]

# Paths
INPUT_DIR = "public/assets/cards/tarot/output"
SVG_SOURCE_DIR = "public/assets/cards/tarot/output"
OUTPUT_MANIFEST_DIR = "public/assets/cards/tarot/output_labeled/manifests"
OUTPUT_IMAGE_DIR = "public/assets/cards/tarot/output_labeled"
LOG_DIR = ".log/app"

# RPD and RPM Limits (Gemini 1.5 Flash Free Tier)
RPM_LIMIT = 15  
RPD_LIMIT = 1500
# Safety margin for throttling (interval between requests per key)
RPM_INTERVAL = 62 / RPM_LIMIT 

# --- LOGGING SETUP ---
os.makedirs(LOG_DIR, exist_ok=True)
log_descriptor = "GeminiLabeling"
log_time = datetime.datetime.now().strftime("%m-%d-%Y--%H")
log_filename = f"{log_descriptor}-{log_time}.log"
log_path = os.path.join(LOG_DIR, log_filename)

logger = logging.getLogger("GeminiLabel")
logger.setLevel(logging.INFO)

# File Handler with UTF-8 encoding
file_handler = logging.FileHandler(log_path, encoding='utf-8')
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(file_handler)

# Console Handler
import sys
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(logging.Formatter('%(levelname)s: %(message)s'))
logger.addHandler(console_handler)

class KeyManager:
    # ... (rest of KeyManager is the same)
    """
    Manages multiple Gemini API keys, tracking their individual rate limits.
    @note: Ensures RPM (15) and RPD (1500) are strictly respected.
    """
    def __init__(self, keys):
        self.keys = []
        for k in keys:
            self.keys.append({
                "api_key": k,
                "client": genai.Client(api_key=k),
                "rpd_count": 0,
                "last_request": 0,
                "lock": threading.Lock()
            })
        self.current_idx = 0
        self.global_lock = threading.Lock()

    def get_available_key(self):
        """
        Rotates through keys and waits if all are RPM-limited.
        @returns dict: Key configuration or None if all keys exhausted for the day.
        """
        while True:
            with self.global_lock:
                start_idx = self.current_idx
                checked_count = 0
                
                while checked_count < len(self.keys):
                    key_cfg = self.keys[self.current_idx]
                    with key_cfg["lock"]:
                        if key_cfg["rpd_count"] < RPD_LIMIT:
                            now = time.time()
                            wait = key_cfg["last_request"] + RPM_INTERVAL - now
                            if wait <= 0:
                                # Found valid key!
                                key_cfg["last_request"] = time.time()
                                self.current_idx = (self.current_idx + 1) % len(self.keys)
                                return key_cfg
                    
                    # Try next key
                    self.current_idx = (self.current_idx + 1) % len(self.keys)
                    checked_count += 1
                
                # If we checked all keys and none are RPD-limited but all are RPM-limited, wait
                any_working = any(k["rpd_count"] < RPD_LIMIT for k in self.keys)
                if not any_working:
                    return None
            
            time.sleep(0.5) # Brief sleep before re-checking RPM limits

    def increment_rpd(self, key_cfg):
        with key_cfg["lock"]:
            key_cfg["rpd_count"] += 1

def extract_zone_ids(svg_content):
    """
    Extracts zone IDs from SVG content without sending full contour paths.
    @note This dramatically reduces token usage vs sending raw SVG.
    """
    import re
    ids = re.findall(r'id="(zone_\d+)"', svg_content)
    return ids if ids else [f'zone_{i}' for i in range(7)]  # fallback

def generate_manifest_prompt(card_name, zone_ids):
    """
    Constructs a compact prompt for Gemini to analyze the card.
    @note Uses zone ID list instead of full SVG to minimize token usage.
    """
    zones_str = ', '.join(zone_ids)
    return f"""You are the lead architect for the 'Orgit' Oracle system.
I have a tarot card named '{card_name}' with these interactive hotspot zones: {zones_str}

TASK: Analyze the card image and assign labels to each zone.
1. Map each zone ID to a human-readable label based on what you see in that region.
2. Provide a 'base_insight' (1-2 sentences) for each hotspot.
3. Suggest a 'glow_type' (pulse_auric, shimmer_static, or slow_burn) and a 'theme_color' hex code.
4. Return ONLY valid JSON:

{{
  "card_id": "{card_name}",
  "name": "{card_name}",
  "theme_color": "#HEX",
  "hotspots": [
    {{ "id": "zone_id", "label": "Label", "glow_type": "type", "base_insight": "Insight" }}
  ]
}}"""

def process_single_card(key_manager, deck_name, card_filename, force=False):
    """
    Processes a single tarot card using the multi-key rotation engine.
    """
    name = Path(card_filename).stem
    deck_output_dir = os.path.join(OUTPUT_MANIFEST_DIR, deck_name)
    os.makedirs(deck_output_dir, exist_ok=True)
    
    json_path = os.path.join(deck_output_dir, f"{name}.json")
    
    # Skip if already VLM-labeled unless force is True
    if os.path.exists(json_path) and not force:
        try:
            with open(json_path, 'r') as f:
                existing = json.load(f)
            # Check if any hotspot has a non-empty label (i.e., VLM-labeled)
            hotspots = existing.get('hotspots', [])
            has_labels = any(h.get('label', '') != '' for h in hotspots)
            if has_labels:
                return f"⏭️ {name} skipped (labeled)"
            else:
                logger.info(f"🔄 {name} has empty labels, re-processing...")
        except (json.JSONDecodeError, KeyError):
            pass  # Corrupted file, re-process it

    max_retries = 3
    for attempt in range(max_retries):
        # Get a key (waits if throttled)
        key_cfg = key_manager.get_available_key()
        if not key_cfg:
            return f"🛑 {name} aborted (RPD limits hit for all keys)"

        try:
            img_path = os.path.join(INPUT_DIR, deck_name, card_filename)
            svg_path = os.path.join(SVG_SOURCE_DIR, deck_name, f"{name}.svg")
            
            if not os.path.exists(svg_path):
                return f"❌ {name} failed: SVG missing at {svg_path}"

            with open(svg_path, 'r') as f:
                svg_data = f.read()
            
            # Extract just zone IDs to minimize token usage
            zone_ids = extract_zone_ids(svg_data)
                
            # SDK Call
            client = key_cfg["client"]
            user_image = client.files.upload(file=img_path)
            
            response = client.models.generate_content(
                model='gemma-3-27b-it',
                contents=[generate_manifest_prompt(name, zone_ids), user_image]
            )
            
            # Parse & Save
            raw_text = response.text.replace('```json', '').replace('```', '').strip()
            json_data = json.loads(raw_text) # Validate JSON
            
            if os.path.exists(json_path):
                with open(json_path, 'r') as f:
                    original_data = json.load(f)
                contours = {h['id']: h.get('contour', '') for h in original_data.get('hotspots', [])}
                for h in json_data.get('hotspots', []):
                    if h['id'] in contours:
                        h['contour'] = contours[h['id']]
            
            with open(json_path, "w") as f:
                json.dump(json_data, f, indent=2)
            
            # Copy image + SVG to output_labeled
            img_out_dir = os.path.join(OUTPUT_IMAGE_DIR, deck_name)
            os.makedirs(img_out_dir, exist_ok=True)
            img_out_path = os.path.join(img_out_dir, card_filename)
            import shutil
            shutil.copy2(img_path, img_out_path)
            
            # Copy the transparent SVG overlay alongside the image (skip debug _colored ones)
            svg_out_path = os.path.join(img_out_dir, f"{name}.svg")
            if os.path.exists(svg_path) and '_colored' not in svg_path:
                shutil.copy2(svg_path, svg_out_path)
                
            key_manager.increment_rpd(key_cfg)
            return f"✅ {name} processed"
            
        except Exception as e:
            error_str = str(e)
            if "429" in error_str:
                logger.warning(f"⚠️ {name} hit rate limit (429). Retry {attempt+1}/{max_retries}...")
                time.sleep(30 * (attempt + 1)) # More aggressive backoff
                continue
            return f"❌ {name} error: {error_str}"
            
    return f"❌ {name} failed after {max_retries} retries"

def process_all_decks(target_deck=None, force=False):
    """
    Main entry point for multi-threaded processing.
    """
    if not API_KEYS:
        logger.error("❌ No GEMINI_API_KEYS found in .env")
        return

    logger.info(f"🚀 Initializing engine with {len(API_KEYS)} API keys...")
    km = KeyManager(API_KEYS)
    
    if not os.path.exists(INPUT_DIR):
        logger.error(f"❌ INPUT_DIR {INPUT_DIR} not found.")
        return

    # Gather all cards across all decks or target deck
    all_tasks = []
    if target_deck:
        deck_names = [target_deck]
    else:
        deck_names = [f for f in os.listdir(INPUT_DIR) if os.path.isdir(os.path.join(INPUT_DIR, f))]
    
    for deck in deck_names:
        deck_path = os.path.join(INPUT_DIR, deck)
        if not os.path.exists(deck_path):
            logger.warning(f"⚠️ Deck {deck} not found in input.")
            continue
        cards = [f for f in os.listdir(deck_path) if f.lower().endswith((".webp", ".png", ".jpg"))]
        for card in cards:
            all_tasks.append((deck, card))

    logger.info(f"📈 Found {len(all_tasks)} total cards to process.")

    # Parallel Execution - Using all 4 available API keys
    num_workers = 3
    logger.info(f"⚙️ Running with {num_workers} parallel workers.")
    
    with ThreadPoolExecutor(max_workers=num_workers) as executor:
        futures = [executor.submit(process_single_card, km, deck, card, force) for deck, card in all_tasks]
        
        for future in as_completed(futures):
            result = future.result()
            logger.info(result)

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Label tarot cards using Gemini VLM.")
    parser.add_argument("deck", nargs="?", default=None, help="Deck name to process. Omit to process ALL decks.")
    parser.add_argument("--force", action="store_true", help="Force overwrite existing manifests.")
    args = parser.parse_args()
    
    process_all_decks(args.deck, args.force)
