import os
from PIL import Image, ImageDraw, ImageFont

# Define card IDs based on the structure in constants.ts
MAJOR_ARCANA = [f"maj_{i}" for i in range(22)]
SUITS = ['w', 'c', 's', 'p'] # wands, cups, swords, pentacles
MINOR_ARCANA = [f"{suit}_{i}" for suit in SUITS for i in range(1, 15)]
ALL_CARDS = MAJOR_ARCANA + MINOR_ARCANA

OUTPUT_DIR = "public/assets/cards/tarot"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Colors
BG_COLOR = (15, 15, 20)
TEXT_COLOR = (168, 85, 247) # Purple
BORDER_COLOR = (45, 212, 191) # Teal

def generate_placeholder(card_id):
    width, height = 400, 700
    img = Image.new('RGB', (width, height), color=BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Draw Border
    draw.rectangle([10, 10, width-10, height-10], outline=BORDER_COLOR, width=5)
    
    # Draw Text
    try:
        # Try to load a default font, fallback to default if not found
        font = ImageFont.truetype("arial.ttf", 40)
    except IOError:
        font = ImageFont.load_default()
        
    # Get text bounding box properly in newer Pillow
    text = card_id.upper().replace('_', ' ')
    bbox = draw.textbbox((0, 0), text, font=font)
    textwidth = bbox[2] - bbox[0]
    textheight = bbox[3] - bbox[1]
    
    x = (width - textwidth) / 2
    y = (height - textheight) / 2
    
    draw.text((x, y), text, font=font, fill=TEXT_COLOR)
    
    img.save(os.path.join(OUTPUT_DIR, f"{card_id}.png"))

print(f"Generating {len(ALL_CARDS)} placeholder cards...")
for card in ALL_CARDS:
    generate_placeholder(card)
print("Done!")
