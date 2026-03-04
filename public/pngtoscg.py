import os
import json
import cv2
import numpy as np
from PIL import Image
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor

# --- CONFIG ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = os.path.join(SCRIPT_DIR, "assets", "cards", "tarot", "input")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "assets", "cards", "tarot", "output")
MANIFEST_DIR = os.path.join(SCRIPT_DIR, "assets", "cards", "tarot", "manifests")

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(MANIFEST_DIR, exist_ok=True)

def find_hotspots(image_path):
    """Uses edge density to find the most 'interesting' parts of the card."""
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Use Canny to find edges
    edges = cv2.Canny(gray, 50, 150)
    
    # Find contours of the densest areas
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    hotspots = []
    # Sort by area and take the top 5 'interesting' zones
    sorted_contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]
    
    height, width = gray.shape
    for i, cnt in enumerate(sorted_contours):
        x, y, w, h = cv2.boundingRect(cnt)
        # Convert to percentages for responsive SVG placement
        hotspots.append({
            "id": f"zone_{i}",
            "x": round((x + w/2) / width * 100, 2),
            "y": round((y + h/2) / height * 100, 2),
            "width": round(w / width * 100, 2),
            "height": round(h / height * 100, 2)
        })
    return hotspots

def process_card_hybrid(card_path):
    name = Path(card_path).stem
    deck_name = Path(card_path).parent.name
    
    deck_out_dir = os.path.join(OUTPUT_DIR, deck_name)
    deck_manifest_dir = os.path.join(MANIFEST_DIR, deck_name)
    os.makedirs(deck_out_dir, exist_ok=True)
    os.makedirs(deck_manifest_dir, exist_ok=True)

    output_webp = os.path.join(deck_out_dir, f"{name}.webp")
    output_svg = os.path.join(deck_out_dir, f"{name}.svg")
    output_json = os.path.join(deck_manifest_dir, f"{name}.json")

    try:
        # 1. Convert to WebP (Quality 80 is the sweet spot)
        with Image.open(card_path) as img:
            img.save(output_webp, "WEBP", quality=80)
            w, h = img.size

        # 2. Map the Hotspots
        hotspots = find_hotspots(card_path)

        # 3. Create the SVG Wrapper
        # This keeps the image sharp but allows SVG overlays
        svg_content = [
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">',
            f'  <image href="./{name}.webp" width="{w}" height="{h}" />'
        ]
        
        # Add invisible 'detector' rects for the AI Bubs to hit
        for spot in hotspots:
            # Map percentage back to coordinate
            sx = (spot['x'] / 100) * w
            sy = (spot['y'] / 100) * h
            svg_content.append(f'  <circle id="{spot["id"]}" cx="{sx}" cy="{sy}" r="10" fill="transparent" />')
        
        svg_content.append('</svg>')

        with open(output_svg, "w") as f:
            f.write("\n".join(svg_content))

        # 4. Save Metadata for the AI Agent
        with open(output_json, "w") as f:
            json.dump({"name": name, "hotspots": hotspots}, f)

        return f"🔮 {name} mapped and wrapped."
    except Exception as e:
        return f"❌ Error on {name}: {e}"

def main():
    files = []
    for root, _, filenames in os.walk(INPUT_DIR):
        for f in filenames:
            if f.endswith(".png"):
                files.append(os.path.join(root, f))
    
    print(f"Found {len(files)} files to process in {INPUT_DIR}.")
    
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(process_card_hybrid, files))
    for r in results: print(r)

if __name__ == "__main__":
    main()