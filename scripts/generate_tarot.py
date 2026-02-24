import os
import requests
import json
import time
import urllib.parse
from dotenv import load_dotenv

script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)
env_path = os.path.join(project_root, ".env.local")
load_dotenv(dotenv_path=env_path)

IMAGE_API = os.getenv("IMAGE_API")
IMAGE_MODEL = os.getenv("IMAGE_MODEL", "flux")


# Load Gridpunk Arcana definitions from JSON
data_file_path = os.path.join(project_root, "src", "data", "gridpunk_deck.json")
try:
    with open(data_file_path, 'r', encoding='utf-8') as f:
        deck_data = json.load(f)
except FileNotFoundError:
    print(f"Error: Could not find deck data at {data_file_path}")
    exit(1)

metadata = deck_data.get("deck_metadata", {})
TAROT_CARDS = deck_data.get("cards", [])

# Extract global theme and visual style
GLOBAL_THEME = metadata.get("theme_overarching", "Cyberpunk tarot.")
GLOBAL_STYLE = metadata.get("physical_specs", {}).get("style", "Neon colors.")
SUITS_METADATA = metadata.get("suits", {})

def generate_and_save(card):
    # Save the new deck to a separate gridpunk-arcana directory
    out_dir = os.path.join(project_root, "public", "assets", "cards", "tarot", "gridpunk-arcana")
    os.makedirs(out_dir, exist_ok=True)
    file_path = os.path.join(out_dir, f"{card['id']}.png")
    
    if os.path.exists(file_path):
        print(f"Skipping {card['name']}, already exists.")
        return

    # Build a powerful, context-aware prompt
    suit_info = card.get("suit", "Major")
    card_desc = card.get("description", "")
    
    # Inject specific suit theming if applicable
    suit_theme = ""
    suit_visuals = ""
    if suit_info in SUITS_METADATA:
        suit_theme = SUITS_METADATA[suit_info].get("theme", "")
        suit_visuals = SUITS_METADATA[suit_info].get("visual_motif", "")
        
    prompt = (
        f"A breathtaking tarot card illustration of '{card['name']}'. "
        f"Subject: {card_desc} "
        f"Theme: {GLOBAL_THEME} {suit_theme} "
        f"Style: {GLOBAL_STYLE} {suit_visuals} "
        f"Highly detailed, masterpiece, 8k resolution, cinematic lighting, neon cyberpunk aesthetics mixed with sacred occult geometry."
    )
    
    # URL encode prompt
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://gen.pollinations.ai/image/{encoded_prompt}?width=512&height=768&model={IMAGE_MODEL}&seed=42"
    
    headers = {}
    if IMAGE_API:
        headers["Authorization"] = f"Bearer {IMAGE_API}"
    
    print(f"Generating {card['name']} with model {IMAGE_MODEL}...")
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = requests.get(url, headers=headers, timeout=60)
            if response.status_code == 200:
                with open(file_path, "wb") as f:
                    f.write(response.content)
                print(f"Saved {card['name']} to {file_path}")
                return
            elif response.status_code in [530, 500, 429]:
                print(f"API Error {response.status_code} for {card['name']}, retrying ({attempt+1}/{max_retries})...")
                time.sleep(5 * (attempt + 1))
            else:
                print(f"Failed to generate {card['name']}: {response.status_code} - {response.text}")
                break
        except Exception as e:
            print(f"Error generating {card['name']} on attempt {attempt+1}: {e}")
            time.sleep(2)
            
    time.sleep(1) # Be nice to the API

if __name__ == "__main__":
    for card in TAROT_CARDS:
        generate_and_save(card)
    print("Done!")
