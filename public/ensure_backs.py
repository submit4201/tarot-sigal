import os
import sys
import json
import asyncio
from PIL import Image
from pathlib import Path
from dotenv import load_dotenv

# Ensure we can import from the root directory
sys.path.append(os.getcwd())

from tarot_gen.providers.pollinations import PollinationsProvider

# Load .env file
load_dotenv()

# --- CONFIG ---
TARGET_BASE_DIR = "public/assets/cards/tarot/output_labeled"
DECKS_JSON_PATH = "src/data/decks.json"

def generate_blank_svg(width, height):
    """Generates a blank SVG string with the given dimensions."""
    return f'''<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Blank overlay for card back -->
</svg>'''

def get_deck_dimensions(deck_path):
    """Finds the first WebP in the deck and returns its dimensions."""
    for f in os.listdir(deck_path):
        if f.lower().endswith(".webp") and f != "back.webp":
            try:
                with Image.open(os.path.join(deck_path, f)) as img:
                    return img.size
            except Exception:
                continue
    return (768, 1408)  # Default fallback

def load_deck_data():
    """Loads deck descriptions from decks.json."""
    if not os.path.exists(DECKS_JSON_PATH):
        print(f"⚠️ Warning: {DECKS_JSON_PATH} not found. Falling back to deck names.")
        return {}
    try:
        with open(DECKS_JSON_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return {d["path"]: d.get("description", "") for d in data if "path" in d}
    except Exception as e:
        print(f"⚠️ Warning: Failed to parse decks.json: {e}")
        return {}

async def ensure_backs(force=False):
    """Main logic to ensure every deck has a themed back.webp and back.svg."""
    if not os.path.exists(TARGET_BASE_DIR):
        print(f"❌ Error: {TARGET_BASE_DIR} not found.")
        return

    # Use the existing PollinationsProvider for correct auth
    api_key = os.getenv("POLLINATIONS_API_KEY")
    provider = PollinationsProvider(api_key=api_key, model="flux", delay=2.0)
    
    deck_data = load_deck_data()
    decks = [d for d in os.listdir(TARGET_BASE_DIR) 
             if os.path.isdir(os.path.join(TARGET_BASE_DIR, d)) and d != "manifests"]
    decks.sort()

    print(f"🔍 Monitoring {len(decks)} decks for themed backs...")

    for deck in decks:
        deck_path = os.path.join(TARGET_BASE_DIR, deck)
        back_webp_path = Path(deck_path) / "back.webp"
        back_svg_path = os.path.join(deck_path, "back.svg")

        w, h = get_deck_dimensions(deck_path)

        # 1. Ensure back.webp
        if force and back_webp_path.exists():
            print(f"  🗑️  Removing existing back for {deck} (force enabled)...")
            os.remove(back_webp_path)

        if not back_webp_path.exists() or force:
            description = deck_data.get(deck, "")
            if "featuring unique thematic imagery" in description:
                description = "" 
                
            clean_name = deck.replace("_Deck", "").replace("_", " ")
            theme_context = description if description else clean_name
            
            # Refined prompt for card backs
            prompt = f"Professional mystical tarot card back design. Theme: {theme_context}. Symmetrical intricate ornate vector patterns, magical occult aesthetic, luxury gold and deep colors, centered composition, high resolution digital art, 8k, sharp focus."
            
            print(f"➕ Generating themed back for {deck}...")
            print(f"  📝 Theme: {theme_context[:100]}...")
            
            # Using the provider's generate method which handles auth and validation
            success = await provider.generate(
                prompt=prompt,
                output_path=back_webp_path,
                width=w,
                height=h,
                label=deck
            )
            
            if not success:
                print(f"  ❌ Failed to generate back for {deck}.")

        # 2. Ensure back.svg
        if not os.path.exists(back_svg_path) or force:
            try:
                with open(back_svg_path, "w") as f:
                    f.write(generate_blank_svg(w, h))
            except Exception as e:
                print(f"  ❌ Failed to generate svg for {deck}: {e}")

    print("✅ Finished ensuring backs.")
    print(f"Stats: {provider.stats()}")

if __name__ == "__main__":
    import sys
    force_gen = "--force" in sys.argv
    asyncio.run(ensure_backs(force=force_gen))
