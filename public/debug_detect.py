"""
Debug probe for detect_hotspots pipeline.

Runs contour detection on a handful of sample cards and outputs:
  - {card}.webp             — copy of the original card image
  - {card}.svg              — transparent SVG (production overlay)
  - {card}_colored.svg      — colored SVG (debug overlay with labels)
  - {card}_overlay.png      — pre-rendered composite (colored zones baked onto the card)

SVGs are saved into a .debug_output/ folder next to this script.

Usage:
    python debug_detect.py                                    # default deck + cards
    python debug_detect.py --deck Hollow_Moon_Arcana_Deck     # pick a deck
    python debug_detect.py --cards cup_01 cup_05 maj_00       # pick specific cards
"""
import argparse
import logging
import os
import shutil
import sys

import cv2
import numpy as np

sys.path.insert(0, ".")

# Force debug level for the detect_hotspots logger
log = logging.getLogger("detect_hotspots")
log.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)
handler.setFormatter(logging.Formatter("%(message)s"))
log.addHandler(handler)

from detect_hotspots import (
    detect_contours,
    generate_overlay_svgs,
    CARD_W,
    CARD_H,
    OUTPUT_DIR,
)

# --- CONFIG ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEBUG_OUTPUT = os.path.join(SCRIPT_DIR, ".debug_output")

DEFAULT_DECK = "Hollow_Moon_Arcana_Deck"
DEFAULT_CARDS = ["cup_01", "cup_05", "maj_00", "maj_01", "maj_20"]

# Color palette matching the colored SVG output
OVERLAY_COLORS = [
    (0, 255, 0),    # Green
    (0, 100, 255),  # Orange (BGR)
    (255, 200, 0),  # Cyan (BGR)
    (255, 0, 255),  # Magenta
    (0, 255, 255),  # Yellow (BGR)
    (255, 100, 100),# Light blue (BGR)
    (150, 150, 255),# Pink (BGR)
]


def render_overlay_image(image_path: str, zones: list[dict]) -> np.ndarray:
    """
    Renders the detected zones directly onto the card image as a flat PNG.

    Draws:
        - Semi-transparent colored contour fills
        - Bright contour outlines
        - Dashed bounding boxes
        - Numbered labels with background badges

    @note: This is the rasterized equivalent of the colored SVG — useful
           for quick visual QA without needing an SVG viewer.
    """
    img = cv2.imread(image_path)
    if img is None:
        return None

    for idx, zone in enumerate(zones):
        color = OVERLAY_COLORS[idx % len(OVERLAY_COLORS)]

        # Semi-transparent filled contour
        overlay = img.copy()
        cv2.drawContours(overlay, [zone["contour"]], -1, color, cv2.FILLED)
        cv2.addWeighted(overlay, 0.25, img, 0.75, 0, img)

        # Contour outline (solid)
        cv2.drawContours(img, [zone["contour"]], -1, color, 3)

        # Bounding box (dashed via dots)
        x, y, bw, bh = zone["bbox"]
        # Draw dashed rectangle by drawing short segments
        for start in range(x, x + bw, 16):
            end = min(start + 10, x + bw)
            cv2.line(img, (start, y), (end, y), color, 2)
            cv2.line(img, (start, y + bh), (end, y + bh), color, 2)
        for start in range(y, y + bh, 16):
            end = min(start + 10, y + bh)
            cv2.line(img, (x, start), (x, end), color, 2)
            cv2.line(img, (x + bw, start), (x + bw, end), color, 2)

        # Label badge
        label = zone.get("label", f"Zone {idx + 1}")
        text = f"{idx + 1}: {label}"
        badge_y = max(0, y - 30)
        text_size = cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)[0]
        cv2.rectangle(img, (x, badge_y), (x + text_size[0] + 12, badge_y + 24),
                      (0, 0, 0), cv2.FILLED)
        cv2.putText(img, text, (x + 6, badge_y + 18),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    return img


def main():
    """
    Run detection on sample cards and save:
      - original .webp copy
      - transparent SVG
      - colored SVG
      - pre-rendered overlay PNG (colored zones baked onto card)

    @note: Does NOT invoke VLM labeling — this is a quick visual QA tool.
    """
    parser = argparse.ArgumentParser(description="Debug hotspot detection with SVG output")
    parser.add_argument("--deck", type=str, default=DEFAULT_DECK,
                        help=f"Deck folder name (default: {DEFAULT_DECK})")
    parser.add_argument("--cards", nargs="+", default=DEFAULT_CARDS,
                        help=f"Card names to test (default: {' '.join(DEFAULT_CARDS)})")
    args = parser.parse_args()

    # Create output directory for debug SVGs
    deck_out = os.path.join(DEBUG_OUTPUT, args.deck)
    os.makedirs(deck_out, exist_ok=True)

    total_zones = 0

    for card in args.cards:
        image_path = os.path.join(
            "assets", "cards", "tarot", "output",
            args.deck, f"{card}.webp"
        )
        print(f"\n{'='*50}")
        print(f"  {card}")
        print(f"{'='*50}")

        if not os.path.exists(image_path):
            print(f"  [MISSING] Image not found: {image_path}")
            continue

        # Copy the original .webp into debug output
        webp_dest = os.path.join(deck_out, f"{card}.webp")
        shutil.copy2(image_path, webp_dest)
        print(f"  [COPIED] {card}.webp")

        # Detect contours
        zones = detect_contours(image_path)
        print(f"  FINAL: {len(zones)} zones")

        for i, z in enumerate(zones):
            bx, by, bw, bh = z["bbox"]
            sol = z.get("solidity", 0)
            print(f"    zone_{i}: bbox=({bx},{by},{bw},{bh}) "
                  f"area={z['area']:.0f} solidity={sol:.2f}")

        total_zones += len(zones)

        if not zones:
            print("  [WARN] No zones to render.")
            continue

        # Generate both SVGs
        svg_transparent, svg_colored = generate_overlay_svgs(
            card, zones, CARD_W, CARD_H
        )

        # Save transparent SVG
        svg_path = os.path.join(deck_out, f"{card}.svg")
        with open(svg_path, "w", encoding="utf-8") as f:
            f.write(svg_transparent)
        print(f"  [SAVED] {card}.svg")

        # Save colored SVG
        colored_path = os.path.join(deck_out, f"{card}_colored.svg")
        with open(colored_path, "w", encoding="utf-8") as f:
            f.write(svg_colored)
        print(f"  [COLOR] Saved: {card}_colored.svg")

        # Render and save the baked overlay PNG
        overlay_img = render_overlay_image(image_path, zones)
        if overlay_img is not None:
            overlay_path = os.path.join(deck_out, f"{card}_overlay.png")
            cv2.imwrite(overlay_path, overlay_img, [cv2.IMWRITE_PNG_COMPRESSION, 6])
            print(f"  [IMAGE] Saved: {card}_overlay.png")

    print(f"\n{'='*50}")
    print(f"  Total: {total_zones} zones across {len(args.cards)} cards")
    print(f"  Output: {deck_out}")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
