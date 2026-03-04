import os
import json
import logging
import shutil
from datetime import datetime

# ============================================================================
# CONFIGURATION
# ============================================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TAROT_ROOT = os.path.join(BASE_DIR, "assets", "cards", "tarot")
MANIFESTS_DIR = os.path.join(TAROT_ROOT, "manifests")
SOURCE_MANIFEST = os.path.join(BASE_DIR, "..", "src", "data", "tarot-manifest.json")
OUTPUT_MANIFEST = os.path.join(TAROT_ROOT, "all_cards_manifest.json")

# User Global Rules: Logging
LOG_DIR = os.path.join(BASE_DIR, "..", ".log", "app")
os.makedirs(LOG_DIR, exist_ok=True)
log_filename = f"consolidate-{datetime.now().strftime('%m-%d-%Y--%H')}.log"
log_path = os.path.join(LOG_DIR, log_filename)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(log_path, encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("consolidate")

# ============================================================================
# MAIN
# ============================================================================

def main():
    logger.info("Starting production manifest consolidation...")

    # 1. Load source metadata (the "master list")
    if not os.path.exists(SOURCE_MANIFEST):
        logger.error(f"Source manifest not found: {SOURCE_MANIFEST}")
        return

    with open(SOURCE_MANIFEST, "r", encoding="utf-8") as f:
        source_data = json.load(f)
    
    # Assume source_data is a dictionary where keys are "00", "01", etc.
    # or a list of card objects. Let's check structure if possible, but
    # usually these projects have a flat list or an object.
    
    # 2. Collect all individual hotspots from manifests/
    hotspot_data = {}
    if os.path.exists(MANIFESTS_DIR):
        for deck in os.listdir(MANIFESTS_DIR):
            deck_path = os.path.join(MANIFESTS_DIR, deck)
            if not os.path.isdir(deck_path):
                continue
            
            for file in os.listdir(deck_path):
                if file.endswith(".json"):
                    card_id = file.replace(".json", "")
                    file_path = os.path.join(deck_path, file)
                    with open(file_path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        hotspot_data[card_id] = data.get("hotspots", [])

    logger.info(f"Collected hotspots for {len(hotspot_data)} cards.")

    # 3. Merge and Build Final Manifest
    final_cards = []
    
    # If source_data is a list
    if isinstance(source_data, list):
        iterator = source_data
    elif isinstance(source_data, dict):
        # If it's a map of id -> card
        iterator = source_data.values()
    else:
        logger.error("Unknown source manifest structure.")
        return

    for card in iterator:
        c_id = card.get("id")
        if not c_id:
            continue
            
        # Get hotspots
        spots = hotspot_data.get(c_id, [])
        
        # Build production card object
        prod_card = {
            "id": c_id,
            "name": card.get("name", "Unknown"),
            "description": card.get("description", ""),
            "deck": card.get("deck", "tarot"),
            "image": f"assets/cards/tarot/output/{card.get('deck', 'arcana')}/{c_id}.webp",
            "overlay": f"assets/cards/tarot/output/{card.get('deck', 'arcana')}/{c_id}.svg",
            "hotspots": spots
        }
        final_cards.append(prod_card)

    # 4. Save Final Output
    with open(OUTPUT_MANIFEST, "w", encoding="utf-8") as f:
        json.dump({
            "generated_at": datetime.now().isoformat(),
            "count": len(final_cards),
            "cards": final_cards
        }, f, indent=2)

    logger.info(f"Consolidation complete. Manifest saved to: {OUTPUT_MANIFEST}")
    logger.info(f"Total cards processed: {len(final_cards)}")

if __name__ == "__main__":
    main()
