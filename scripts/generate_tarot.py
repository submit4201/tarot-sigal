import os
import requests
import json
import time

TAROT_CARDS = [
  {"id": "maj_0", "name": "The Fool", "keywords": ["Beginnings", "Innocence", "Spontaneity"]},
  {"id": "maj_1", "name": "The Magician", "keywords": ["Manifestation", "Power", "Inspired Action"]},
  {"id": "maj_2", "name": "The High Priestess", "keywords": ["Intuition", "Unconscious", "Inner Voice"]},
  {"id": "maj_3", "name": "The Empress", "keywords": ["Fertility", "Nurturing", "Abundance"]},
  {"id": "maj_4", "name": "The Emperor", "keywords": ["Authority", "Structure", "Control"]},
  {"id": "maj_5", "name": "The Hierophant", "keywords": ["Tradition", "Morality", "Ethics"]},
  {"id": "maj_6", "name": "The Lovers", "keywords": ["Love", "Harmony", "Choices"]},
  {"id": "maj_7", "name": "The Chariot", "keywords": ["Control", "Willpower", "Victory"]},
  {"id": "maj_8", "name": "Strength", "keywords": ["Courage", "Patience", "Compassion"]},
  {"id": "maj_9", "name": "The Hermit", "keywords": ["Soul-searching", "Introspection", "Solitude"]},
  {"id": "maj_10", "name": "Wheel of Fortune", "keywords": ["Luck", "Karma", "Cycles"]},
  {"id": "maj_11", "name": "Justice", "keywords": ["Truth", "Fairness", "Cause/Effect"]},
  {"id": "maj_12", "name": "The Hanged Man", "keywords": ["Pause", "Surrender", "Perspectives"]},
  {"id": "maj_13", "name": "Death", "keywords": ["Endings", "Change", "Transformation"]},
  {"id": "maj_14", "name": "Temperance", "keywords": ["Balance", "Moderation", "Patience"]},
  {"id": "maj_15", "name": "The Devil", "keywords": ["Bondage", "Addiction", "Materialism"]},
  {"id": "maj_16", "name": "The Tower", "keywords": ["Upheaval", "Chaos", "Revelation"]},
  {"id": "maj_17", "name": "The Star", "keywords": ["Hope", "Faith", "Rejuvenation"]},
  {"id": "maj_18", "name": "The Moon", "keywords": ["Illusion", "Fear", "Intuition"]},
  {"id": "maj_19", "name": "The Sun", "keywords": ["Positivity", "Success", "Vitality"]},
  {"id": "maj_20", "name": "Judgement", "keywords": ["Awakening", "Rebirth", "Calling"]},
  {"id": "maj_21", "name": "The World", "keywords": ["Completion", "Integration", "Travel"]},

  # Wands
  {"id": "w_1", "name": "Ace of Wands"}, {"id": "w_2", "name": "Two of Wands"}, {"id": "w_3", "name": "Three of Wands"}, {"id": "w_4", "name": "Four of Wands"},
  {"id": "w_5", "name": "Five of Wands"}, {"id": "w_6", "name": "Six of Wands"}, {"id": "w_7", "name": "Seven of Wands"}, {"id": "w_8", "name": "Eight of Wands"},
  {"id": "w_9", "name": "Nine of Wands"}, {"id": "w_10", "name": "Ten of Wands"}, {"id": "w_11", "name": "Page of Wands"}, {"id": "w_12", "name": "Knight of Wands"},
  {"id": "w_13", "name": "Queen of Wands"}, {"id": "w_14", "name": "King of Wands"},

  # Cups
  {"id": "c_1", "name": "Ace of Cups"}, {"id": "c_2", "name": "Two of Cups"}, {"id": "c_3", "name": "Three of Cups"}, {"id": "c_4", "name": "Four of Cups"},
  {"id": "c_5", "name": "Five of Cups"}, {"id": "c_6", "name": "Six of Cups"}, {"id": "c_7", "name": "Seven of Cups"}, {"id": "c_8", "name": "Eight of Cups"},
  {"id": "c_9", "name": "Nine of Cups"}, {"id": "c_10", "name": "Ten of Cups"}, {"id": "c_11", "name": "Page of Cups"}, {"id": "c_12", "name": "Knight of Cups"},
  {"id": "c_13", "name": "Queen of Cups"}, {"id": "c_14", "name": "King of Cups"},

  # Swords
  {"id": "s_1", "name": "Ace of Swords"}, {"id": "s_2", "name": "Two of Swords"}, {"id": "s_3", "name": "Three of Swords"}, {"id": "s_4", "name": "Four of Swords"},
  {"id": "s_5", "name": "Five of Swords"}, {"id": "s_6", "name": "Six of Swords"}, {"id": "s_7", "name": "Seven of Swords"}, {"id": "s_8", "name": "Eight of Swords"},
  {"id": "s_9", "name": "Nine of Swords"}, {"id": "s_10", "name": "Ten of Swords"}, {"id": "s_11", "name": "Page of Swords"}, {"id": "s_12", "name": "Knight of Swords"},
  {"id": "s_13", "name": "Queen of Swords"}, {"id": "s_14", "name": "King of Swords"},

  # Pentacles
  {"id": "p_1", "name": "Ace of Pentacles"}, {"id": "p_2", "name": "Two of Pentacles"}, {"id": "p_3", "name": "Three of Pentacles"}, {"id": "p_4", "name": "Four of Pentacles"},
  {"id": "p_5", "name": "Five of Pentacles"}, {"id": "p_6", "name": "Six of Pentacles"}, {"id": "p_7", "name": "Seven of Pentacles"}, {"id": "p_8", "name": "Eight of Pentacles"},
  {"id": "p_9", "name": "Nine of Pentacles"}, {"id": "p_10", "name": "Ten of Pentacles"}, {"id": "p_11", "name": "Page of Pentacles"}, {"id": "p_12", "name": "Knight of Pentacles"},
  {"id": "p_13", "name": "Queen of Pentacles"}, {"id": "p_14", "name": "King of Pentacles"},
]

def generate_and_save(card):
    out_dir = "../public/assets/cards/tarot"
    os.makedirs(out_dir, exist_ok=True)
    file_path = os.path.join(out_dir, f"{card['id']}.png")
    
    if os.path.exists(file_path):
        print(f"Skipping {card['name']}, already exists.")
        return

    # Create a highly stylized prompt
    keywords = ", ".join(card.get("keywords", []))
    prompt = f"A vivid, gorgeous cyberpunk mystical tarot card illustration of {card['name']}. Neon lights, futuristic dystopian magic, intricate details, masterpiece aesthetic. {keywords}"
    
    # URL encode prompt
    import urllib.parse
    encoded_prompt = urllib.parse.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=512&height=768&model=flux&nologo=true&seed=42"
    
    print(f"Generating {card['name']}...")
    
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = requests.get(url, timeout=60)
            if response.status_code == 200:
                with open(file_path, "wb") as f:
                    f.write(response.content)
                print(f"Saved {card['name']} to {file_path}")
                return
            elif response.status_code == 530 or response.status_code == 500:
                print(f"API Error {response.status_code} for {card['name']}, retrying ({attempt+1}/{max_retries})...")
                time.sleep(5 * (attempt + 1))
            else:
                print(f"Failed to generate {card['name']}: {response.status_code}")
                break
        except Exception as e:
            print(f"Error generating {card['name']} on attempt {attempt+1}: {e}")
            time.sleep(2)
            
    time.sleep(1) # Be nice to the API

if __name__ == "__main__":
    for card in TAROT_CARDS:
        generate_and_save(card)
    print("Done!")
