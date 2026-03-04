"""
detect_hotspots.py
==================
OpenCV-based hotspot detector with contour tracing and VLM labeling.

Scans each tarot card image (.webp), detects distinct visual elements using
OpenCV edge/contour detection, traces their outlines as SVG <path> elements
(for CSS glow effects), generates bounding-box manifests, and optionally
labels each region using LM Studio's VLM.

Usage:
    python detect_hotspots.py                                   # All unlabeled cards
    python detect_hotspots.py --deck "Attachment_Theory_Deck"   # Single deck
    python detect_hotspots.py --card "cup_01"                   # Single card (requires --deck)
    python detect_hotspots.py --no-vlm                          # Skip VLM labeling
    python detect_hotspots.py --preview                         # Save debug images
    python detect_hotspots.py --force                           # Re-process already-labeled cards

@note: Requires opencv-python, numpy, Pillow, and (optionally) lmstudio SDK.
"""

import os
import sys
import json
import time
import argparse
import tempfile
import logging
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

import cv2
import numpy as np
from PIL import Image, ImageDraw

# --- Optional LM Studio import ---
try:
    import lmstudio as lms
    HAS_LMS = True
except ImportError:
    HAS_LMS = False

# ============================================================================
# CONFIG
# ============================================================================

SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR   = os.path.join(SCRIPT_DIR, "assets", "cards", "tarot", "output")
MANIFEST_DIR = os.path.join(SCRIPT_DIR, "assets", "cards", "tarot", "manifests")
PREVIEW_DIR  = os.path.join(SCRIPT_DIR, "assets", "cards", "tarot", "previews")

# Card dimensions (standard for all decks)
CARD_W = 768
CARD_H = 1408

# Detection tuning
MIN_AREA_RATIO   = 0.005   # Minimum contour area as % of card (filter noise)
MAX_AREA_RATIO   = 0.50    # Maximum contour area as % of card (filter whole-card)
MERGE_IOU_THRESH = 0.55    # IoU threshold for merging overlapping contours
CONTAIN_THRESH   = 0.80    # If small box ≥80% inside big box, absorb it
MAX_ZONES        = 7       # Maximum hotspot zones per card
MIN_ZONES        = 2       # Minimum zones to keep (if detected)

# Contour simplification — balance between detail and SVG path size
CONTOUR_EPSILON_RATIO = 0.008  # Lower = more detail, higher = smoother

# VLM config (LM Studio)
LMS_MODEL = "qwen/qwen3.5-9b"

VLM_PROMPT = """\
Examine the image carefully. There are bright green numbered boxes drawn over specific elements.
For each numbered box, give a concise 1-to-3 word label describing what is inside it (e.g. 'Goblet', 'Sword Handle', 'Character Face', 'Glowing Symbol').
Reply ONLY with a valid JSON object, nothing else:
{
  "1": "label",
  "2": "label"
}"""

# ============================================================================
# LOGGING
# ============================================================================

LOG_DIR = os.path.join(os.path.dirname(SCRIPT_DIR), ".log", "detect_hotspots")
os.makedirs(LOG_DIR, exist_ok=True)

log_filename = f"detect-{datetime.now().strftime('%m-%d-%Y--%H')}.log"
log_path = os.path.join(LOG_DIR, log_filename)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(log_path, encoding="utf-8"),
    ],
)
logger = logging.getLogger("detect_hotspots")


# ============================================================================
# OPENCV DETECTION
# ============================================================================

def detect_contours(image_path: str) -> list[dict]:
    """
    Detects visually distinct regions in a tarot card image using OpenCV.

    Returns a list of zone dicts, each containing:
        - bbox: (x, y, w, h) in pixels
        - contour: numpy array of contour points
        - area: contour area in pixels
        - center: (cx, cy) center point
        - solidity: contour area / convex hull area (shape quality 0-1)

    Pipeline:
        1. CLAHE contrast equalization → reveals features in dark areas
        2. Bilateral filter → edge-preserving smoothing for cleaner traces
        3. Multi-scale Canny → catches bold AND subtle features
        4. Adaptive threshold → high-contrast element detection
        5. HSV color segmentation → glowing/colorful element detection
        6. Quality filters: area, solidity, aspect ratio
        7. Union-find de-duplication across all approaches

    @note: Uses multi-scale edge detection for robust results across
           different art styles (photorealistic, illustrated, abstract).
    """
    img = cv2.imread(image_path)
    if img is None:
        logger.error(f"Could not load image: {image_path}")
        return []

    h, w = img.shape[:2]
    card_area = h * w
    min_area = card_area * MIN_AREA_RATIO
    max_area = card_area * MAX_AREA_RATIO

    # --- Preprocessing ---

    # CLAHE: dramatically improves contrast for dark/low-contrast cards
    # Without this, many features in shadowy areas are invisible
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    gray_eq = clahe.apply(gray)

    # Bilateral filter: preserves edges while smoothing — gives sharper traces
    # than Gaussian blur which smears edges together
    bilateral = cv2.bilateralFilter(gray_eq, d=9, sigmaColor=75, sigmaSpace=75)

    # Also keep a lighter Gaussian for approaches that prefer it
    blurred = cv2.GaussianBlur(gray_eq, (5, 5), 0)

    # Shared morphology kernels
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    kernel_med = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

    # Maximum contours to keep per detection approach (prevents flooding)
    MAX_PER_APPROACH = 12

    # --- Helper: filter + cap contours from a single approach ---
    def _filter_approach(raw_contours, label):
        """
        Applies area, solidity, dimension, and aspect-ratio filters to one
        approach's raw contours. Returns the top MAX_PER_APPROACH by area.

        @note: Isolating filtering per approach prevents adaptive threshold's
               thousands of contours from drowning out Canny/HSV contributions.
        """
        good = []
        for cnt in raw_contours:
            area = cv2.contourArea(cnt)
            if area < min_area or area > max_area:
                continue
            hull = cv2.convexHull(cnt)
            hull_area = cv2.contourArea(hull)
            solidity = area / hull_area if hull_area > 0 else 0
            if solidity < 0.12:
                continue
            x, y, bw, bh = cv2.boundingRect(cnt)
            if bw < 25 or bh < 25:
                continue
            aspect = max(bw, bh) / (min(bw, bh) + 1)
            if aspect > 6:
                continue
            good.append(cnt)

        # Keep the top N by area — diverse approaches contribute evenly
        good.sort(key=cv2.contourArea, reverse=True)
        kept = good[:MAX_PER_APPROACH]
        logger.debug(f"  {label}: {len(raw_contours)} raw → {len(good)} valid → {len(kept)} kept")
        return kept

    # --- Multi-approach detection for robustness ---
    all_contours = []

    # Approach 1a: Multi-scale Canny (bold features) on bilateral-filtered image
    edges_bold = cv2.Canny(bilateral, 50, 120)
    edges_bold = cv2.dilate(edges_bold, kernel, iterations=1)
    contours_bold, _ = cv2.findContours(
        edges_bold, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )
    all_contours.extend(_filter_approach(contours_bold, "Canny bold"))

    # Approach 1b: Multi-scale Canny (subtle features) — lower thresholds
    # Catches fine detail like filigree, thin symbols, and textures
    edges_subtle = cv2.Canny(bilateral, 25, 70)
    edges_subtle = cv2.dilate(edges_subtle, kernel, iterations=1)
    edges_subtle = cv2.morphologyEx(edges_subtle, cv2.MORPH_CLOSE, kernel_med, iterations=1)
    contours_subtle, _ = cv2.findContours(
        edges_subtle, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )
    all_contours.extend(_filter_approach(contours_subtle, "Canny subtle"))

    # Approach 2: Adaptive threshold for high-contrast elements
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV, 15, 4
    )
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel, iterations=1)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)
    # Using RETR_LIST to catch internal elements (e.g. eyes/symbols inside a face/body)
    contours_thresh, _ = cv2.findContours(
        thresh, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE
    )
    all_contours.extend(_filter_approach(contours_thresh, "Adaptive thresh"))

    # Approach 3: Color-based segmentation (HSV)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    _, sat, val = cv2.split(hsv)

    # High-saturation regions (colorful objects)
    _, sat_mask = cv2.threshold(sat, 110, 255, cv2.THRESH_BINARY)
    sat_mask = cv2.morphologyEx(sat_mask, cv2.MORPH_CLOSE, kernel_med, iterations=2)
    sat_mask = cv2.morphologyEx(sat_mask, cv2.MORPH_OPEN, kernel, iterations=1)
    # Using RETR_LIST here too — catches glowing symbols inside characters
    contours_sat, _ = cv2.findContours(
        sat_mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE
    )
    all_contours.extend(_filter_approach(contours_sat, "HSV saturation"))

    # High-value (bright) regions — catches glows and light sources
    _, val_mask = cv2.threshold(val, 200, 255, cv2.THRESH_BINARY)
    val_mask = cv2.morphologyEx(val_mask, cv2.MORPH_CLOSE, kernel_med, iterations=2)
    contours_val, _ = cv2.findContours(
        val_mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE
    )
    all_contours.extend(_filter_approach(contours_val, "HSV value"))

    # Approach 4: CLAHE gradient magnitude — catches mid-tone boundaries
    grad_x = cv2.Sobel(gray_eq, cv2.CV_16S, 1, 0, ksize=3)
    grad_y = cv2.Sobel(gray_eq, cv2.CV_16S, 0, 1, ksize=3)
    grad_mag = cv2.convertScaleAbs(grad_x) + cv2.convertScaleAbs(grad_y)
    _, grad_mask = cv2.threshold(grad_mag, 80, 255, cv2.THRESH_BINARY)
    grad_mask = cv2.morphologyEx(grad_mask, cv2.MORPH_CLOSE, kernel_med, iterations=2)
    grad_mask = cv2.morphologyEx(grad_mask, cv2.MORPH_OPEN, kernel, iterations=1)
    contours_grad, _ = cv2.findContours(
        grad_mask, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE
    )
    all_contours.extend(_filter_approach(contours_grad, "Gradient"))

    logger.debug(f"  TOTAL filtered contours: {len(all_contours)}")

    if not all_contours:
        logger.warning(f"No valid contours found in {image_path}")
        return []

    # --- Score each contour for NMS ranking ---
    center_x, center_y = w / 2, h / 2
    max_dist = np.sqrt(center_x ** 2 + center_y ** 2)

    scored = []
    for cnt in all_contours:
        area = cv2.contourArea(cnt)
        x, y, bw, bh = cv2.boundingRect(cnt)
        cx, cy = x + bw // 2, y + bh // 2

        # Centrality: closer to center = higher priority
        dist = np.sqrt((cx - center_x) ** 2 + (cy - center_y) ** 2)
        centrality = 1.0 - (dist / max_dist)

        # Solidity bonus
        hull = cv2.convexHull(cnt)
        hull_area = cv2.contourArea(hull)
        solidity = area / hull_area if hull_area > 0 else 0.5

        # Prefer mid-sized elements (e.g. 5% - 20% area) — avoids the 1-giant-bbox issue
        # We penalize those that are essentially whole-card borders
        area_ratio = area / card_area
        area_score = area
        if area_ratio > 0.4:  # Large container
            area_score *= 0.1  # Major penalty
        elif area_ratio < 0.05:  # Small detail
            area_score *= 1.2  # Slight boost to details

        score = area_score * centrality * (0.5 + 0.5 * solidity)

        scored.append({
            "bbox": (x, y, bw, bh),
            "contour": cnt,
            "area": area,
            "center": (cx, cy),
            "solidity": solidity,
            "score": score,
        })

    # --- NMS deduplication ---
    # Sort by score descending — highest-quality contours evaluated first
    zones = _nms_dedup(scored)
    logger.debug(f"  After NMS: {len(zones)} zones")

    zones.sort(key=lambda z: z["score"], reverse=True)

    # Keep top N zones
    zones = zones[:MAX_ZONES]

    logger.info(f"Detected {len(zones)} zones in {Path(image_path).name}")
    return zones


def _nms_dedup(scored: list[dict]) -> list[dict]:
    """
    Non-Maximum Suppression deduplication for contour zones.
    """
    NMS_IOU_THRESH = 0.55  # Higher = keep more overlapping zones apart

    scored.sort(key=lambda z: z["score"], reverse=True)

    kept = []
    for candidate in scored:
        cx, cy, cw, ch = candidate["bbox"]
        suppressed = False

        for existing in kept:
            ex, ey, ew, eh = existing["bbox"]

            iou = _compute_iou(cx, cy, cw, ch, ex, ey, ew, eh)
            if iou > NMS_IOU_THRESH:
                suppressed = True
                break
        
        # Containment check removed — allows B inside A to exist as its own hotspot
        # if the border (A) isn't almost identical to B's area (deduped by IoU).

        if not suppressed:
            kept.append(candidate)

    return kept


def _compute_iou(ax, ay, aw, ah, bx, by, bw, bh) -> float:
    """Compute Intersection over Union for two bounding boxes."""
    x1 = max(ax, bx)
    y1 = max(ay, by)
    x2 = min(ax + aw, bx + bw)
    y2 = min(ay + ah, by + bh)

    inter = max(0, x2 - x1) * max(0, y2 - y1)
    area_a = aw * ah
    area_b = bw * bh
    union = area_a + area_b - inter

    return inter / union if union > 0 else 0.0


def _compute_containment(ax, ay, aw, ah, bx, by, bw, bh) -> float:
    """
    Compute what fraction of the **smaller** box is inside the **larger** box.
    Returns 0.0 – 1.0.  Values ≥ CONTAIN_THRESH mean the small box is
    essentially inside the big one and should be absorbed.
    """
    x1 = max(ax, bx)
    y1 = max(ay, by)
    x2 = min(ax + aw, bx + bw)
    y2 = min(ay + ah, by + bh)

    inter = max(0, x2 - x1) * max(0, y2 - y1)
    smaller_area = min(aw * ah, bw * bh)

    return inter / smaller_area if smaller_area > 0 else 0.0


# ============================================================================
# CONTOUR → SVG PATH CONVERSION
# ============================================================================

def contour_to_svg_path(contour: np.ndarray, img_w: int, img_h: int) -> str:
    """
    Converts an OpenCV contour to an SVG <path> `d` attribute string.

    Simplifies the contour using Douglas-Peucker to keep the SVG lightweight,
    while preserving the object's shape well enough for glow effects.

    @note: Coordinates are kept in pixel space (matching the SVG viewBox).
    """
    # Simplify contour to reduce point count
    perimeter = cv2.arcLength(contour, closed=True)
    epsilon = perimeter * CONTOUR_EPSILON_RATIO
    simplified = cv2.approxPolyDP(contour, epsilon, closed=True)

    if len(simplified) < 3:
        # Fallback: use bounding rect as a path
        x, y, w, h = cv2.boundingRect(contour)
        return f"M {x} {y} L {x+w} {y} L {x+w} {y+h} L {x} {y+h} Z"

    # Build SVG path string
    points = simplified.reshape(-1, 2)
    parts = [f"M {points[0][0]} {points[0][1]}"]

    for pt in points[1:]:
        parts.append(f"L {pt[0]} {pt[1]}")

    parts.append("Z")
    return " ".join(parts)


def contour_to_smooth_svg_path(contour: np.ndarray) -> str:
    """
    Converts a contour to a smooth SVG path using cubic Bezier curves.
    Produces nicer-looking glow outlines than straight-line segments.

    @note: Uses Catmull-Rom → Bezier conversion for smooth curves through points.
    """
    perimeter = cv2.arcLength(contour, closed=True)
    epsilon = perimeter * CONTOUR_EPSILON_RATIO * 1.5  # Slightly more simplified for curves
    simplified = cv2.approxPolyDP(contour, epsilon, closed=True)

    points = simplified.reshape(-1, 2).tolist()
    n = len(points)

    if n < 3:
        x, y, w, h = cv2.boundingRect(contour)
        return f"M {x} {y} L {x+w} {y} L {x+w} {y+h} L {x} {y+h} Z"

    # Start the path at the first point
    path = [f"M {points[0][0]:.1f} {points[0][1]:.1f}"]

    # Generate smooth cubic Bezier curves through each segment
    for i in range(n):
        p0 = points[(i - 1) % n]
        p1 = points[i]
        p2 = points[(i + 1) % n]
        p3 = points[(i + 2) % n]

        # Catmull-Rom to Bezier control points
        cp1x = p1[0] + (p2[0] - p0[0]) / 6
        cp1y = p1[1] + (p2[1] - p0[1]) / 6
        cp2x = p2[0] - (p3[0] - p1[0]) / 6
        cp2y = p2[1] - (p3[1] - p1[1]) / 6

        path.append(f"C {cp1x:.1f} {cp1y:.1f} {cp2x:.1f} {cp2y:.1f} {p2[0]:.1f} {p2[1]:.1f}")

    path.append("Z")
    return " ".join(path)


# ============================================================================
# SVG GENERATION
# ============================================================================

def generate_svg(card_name: str, zones: list[dict], img_w: int, img_h: int) -> str:
    """
    Generates an SVG string with the card image and traced contour paths.

    Each zone becomes a `<path>` element with:
        - `id="zone_N"` for targeting
        - `class="hotspot-contour"` for CSS styling
        - `data-label` attribute for the label (if available)
        - `fill="transparent"` and `stroke="transparent"` by default
        - The actual traced contour as the `d` attribute

    @note: The frontend can style these with CSS filters for glows:
           .hotspot-contour:hover { filter: drop-shadow(0 0 12px #ff66ff); }
    """
    lines = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {img_w} {img_h}">',
        f'  <image href="./{card_name}.webp" width="{img_w}" height="{img_h}" />',
    ]

    for idx, zone in enumerate(zones):
        path_d = contour_to_smooth_svg_path(zone["contour"])
        label = zone.get("label", "")
        label_attr = f' data-label="{label}"' if label else ""

        lines.append(
            f'  <path id="zone_{idx}" class="hotspot-contour"'
            f' d="{path_d}"'
            f' fill="transparent" stroke="transparent"{label_attr} />'
        )

    lines.append("</svg>")
    return "\n".join(lines)


def generate_colored_svg(card_name: str, zones: list[dict],
                         img_w: int, img_h: int) -> str:
    """
    Generates a colored SVG overlay for visual debugging / QA overlay.

    Each zone is rendered with:
        - Semi-transparent colored fill (0.25 opacity)
        - Bright colored stroke (3px)
        - Numbered label text at top-left of each zone's bounding box

    @note: Uses a fixed palette of 7 high-contrast colors that cycle.
    """
    # High-contrast color palette (hex) — matches preview image palette
    palette = [
        ("#00FF00", "Green"),
        ("#FF6400", "Orange"),
        ("#00C8FF", "Cyan"),
        ("#FF00FF", "Magenta"),
        ("#FFFF00", "Yellow"),
        ("#6464FF", "Blue"),
        ("#FF9696", "Pink"),
    ]

    lines = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {img_w} {img_h}">',
        f'  <image href="./{card_name}.webp" width="{img_w}" height="{img_h}" />',
    ]

    for idx, zone in enumerate(zones):
        color_hex, _ = palette[idx % len(palette)]
        path_d = contour_to_smooth_svg_path(zone["contour"])
        label = zone.get("label", f"Zone {idx + 1}")

        # Semi-transparent filled contour
        lines.append(
            f'  <path id="zone_{idx}_fill" class="hotspot-colored"'
            f' d="{path_d}"'
            f' fill="{color_hex}" fill-opacity="0.25"'
            f' stroke="{color_hex}" stroke-width="3" />'
        )

        # Bounding box rectangle (dashed outline)
        x, y, bw, bh = zone["bbox"]
        lines.append(
            f'  <rect x="{x}" y="{y}" width="{bw}" height="{bh}"'
            f' fill="none" stroke="{color_hex}" stroke-width="2"'
            f' stroke-dasharray="8,4" opacity="0.7" />'
        )

        # Label badge background
        badge_y = max(0, y - 28)
        text_w = max(80, len(label) * 10 + 20)
        lines.append(
            f'  <rect x="{x}" y="{badge_y}" width="{text_w}" height="24"'
            f' rx="4" fill="black" fill-opacity="0.8" />'
        )

        # Label text
        lines.append(
            f'  <text x="{x + 6}" y="{badge_y + 17}"'
            f' font-family="monospace" font-size="14" fill="{color_hex}"'
            f' font-weight="bold">{idx + 1}: {label}</text>'
        )

    lines.append("</svg>")
    return "\n".join(lines)


def generate_overlay_svgs(card_name: str, zones: list[dict],
                          img_w: int, img_h: int) -> tuple[str, str]:
    """
    Convenience wrapper — returns (transparent_svg, colored_svg) tuple.

    - transparent_svg: production-ready, invisible paths for CSS hover effects
    - colored_svg: debug/QA overlay with visible fills, strokes, and labels

    @note: Both share the same viewBox and zone IDs for consistency.
    """
    transparent = generate_svg(card_name, zones, img_w, img_h)
    colored = generate_colored_svg(card_name, zones, img_w, img_h)
    return transparent, colored


# ============================================================================
# MANIFEST GENERATION
# ============================================================================

def generate_manifest(card_name: str, zones: list[dict],
                      img_w: int, img_h: int) -> dict:
    """
    Generates a manifest dict with percentage-based bounding boxes and
    contour path data for each detected zone.

    Coordinates are stored as percentages of the card dimensions to match
    the existing manifest format used by the frontend.
    """
    hotspots = []
    for idx, zone in enumerate(zones):
        x, y, bw, bh = zone["bbox"]

        # Convert to percentage coordinates (center-based, matching existing format)
        cx_pct = ((x + bw / 2) / img_w) * 100
        cy_pct = ((y + bh / 2) / img_h) * 100
        w_pct  = (bw / img_w) * 100
        h_pct  = (bh / img_h) * 100

        hotspot = {
            "id": f"zone_{idx}",
            "x": round(cx_pct, 2),
            "y": round(cy_pct, 2),
            "width": round(w_pct, 2),
            "height": round(h_pct, 2),
            "label": zone.get("label", ""),
            "contour": contour_to_smooth_svg_path(zone["contour"]),
        }
        hotspots.append(hotspot)

    return {"name": card_name, "hotspots": hotspots}


# ============================================================================
# VLM LABELING (LM Studio)
# ============================================================================

def draw_annotated_image(image_path: str, zones: list[dict]) -> Image.Image:
    """
    Draws bright green numbered boxes over each detected zone on the card.
    Returns the annotated PIL Image for VLM analysis.

    @note: Reuses the visual style from label_hotspots.py for consistency.
    """
    with Image.open(image_path) as img:
        if img.mode != "RGB":
            img = img.convert("RGB")
        draw = ImageDraw.Draw(img)

        for idx, zone in enumerate(zones):
            x, y, bw, bh = zone["bbox"]
            x0, y0 = x, y
            x1, y1 = x + bw, y + bh

            # Green bounding box
            draw.rectangle([x0, y0, x1, y1], outline="#00FF00", width=4)
            # Dark label badge
            draw.rectangle([x0, max(0, y0 - 28), x0 + 32, max(28, y0)], fill="black")
            draw.text((x0 + 6, max(4, y0 - 22)), str(idx + 1), fill="white", font_size=18)

        return img.copy()


def _parse_json(text: str) -> dict:
    """
    Parse JSON from model output, stripping markdown fences if present.
    Raises json.JSONDecodeError on total failure.
    """
    text = text.strip()
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()
    return json.loads(text)


def label_zones_vlm(image_path: str, zones: list[dict]) -> dict:
    """
    Sends an annotated image to LM Studio's VLM and returns labels.

    Returns a dict like: {"1": "Lotus Flower", "2": "Baby Face", ...}

    Falls back to empty dict if LM Studio is unreachable.

    @note: Requires LM Studio running at localhost:1234 with qwen3.5-9b loaded.
    """
    if not HAS_LMS:
        logger.warning("lmstudio SDK not installed — skipping VLM labeling")
        return {}

    annotated = draw_annotated_image(image_path, zones)

    # Save annotated image to temp file for lms.prepare_image()
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        tmp_path = tmp.name
        annotated.save(tmp, format="JPEG", quality=85)

    try:
        image_handle = lms.prepare_image(tmp_path)
        model = lms.llm(LMS_MODEL)

        chat = lms.Chat()
        chat.add_user_message(VLM_PROMPT, images=[image_handle])

        for attempt in range(3):
            try:
                logger.info(f"  -> VLM ({LMS_MODEL}) attempt {attempt + 1}/3 ...")
                t0 = time.time()
                prediction = model.respond(chat, config={"enable_thinking": False})
                content = str(prediction)
                elapsed = time.time() - t0
                logger.info(f"  [DONE] in {elapsed:.1f}s | {content[:120]}")
                return _parse_json(content)

            except json.JSONDecodeError:
                logger.warning(f"  [WARN] JSON parse failed. Raw: {content[:200]}")
                return {}
            except Exception as e:
                logger.warning(f"  [FAIL] Attempt {attempt + 1} failed: {str(e)[:120]}")
                time.sleep(3)

        return {}

    except Exception as e:
        err = str(e)
        if "refused" in err.lower() or "connect" in err.lower():
            logger.warning("[WARN] Cannot reach LM Studio — is it running at localhost:1234?")
        else:
            logger.warning(f"[WARN] LM Studio SDK error: {err}")
        return {}
    finally:
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


# ============================================================================
# PREVIEW / DEBUG IMAGE
# ============================================================================

def save_preview(image_path: str, zones: list[dict], deck_name: str,
                 card_name: str) -> str:
    """
    Saves a debug preview image showing detected zones with colored contours
    and numbered labels. Useful for visual verification of detection quality.
    """
    img = cv2.imread(image_path)
    if img is None:
        return ""

    # Color palette for zones
    colors = [
        (0, 255, 0),    # Green
        (255, 100, 0),  # Orange
        (0, 200, 255),  # Cyan
        (255, 0, 255),  # Magenta
        (255, 255, 0),  # Yellow
        (100, 100, 255),# Light blue
        (255, 150, 150),# Pink
    ]

    for idx, zone in enumerate(zones):
        color = colors[idx % len(colors)]

        # Draw filled contour with transparency
        overlay = img.copy()
        cv2.drawContours(overlay, [zone["contour"]], -1, color, cv2.FILLED)
        cv2.addWeighted(overlay, 0.2, img, 0.8, 0, img)

        # Draw contour outline
        cv2.drawContours(img, [zone["contour"]], -1, color, 3)

        # Draw bounding box
        x, y, bw, bh = zone["bbox"]
        cv2.rectangle(img, (x, y), (x + bw, y + bh), color, 2)

        # Label number
        label = zone.get("label", f"Zone {idx + 1}")
        cv2.putText(img, f"{idx+1}: {label}", (x, max(20, y - 8)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    # Save preview
    preview_deck_dir = os.path.join(PREVIEW_DIR, deck_name)
    os.makedirs(preview_deck_dir, exist_ok=True)
    preview_path = os.path.join(preview_deck_dir, f"{card_name}_preview.jpg")

    cv2.imwrite(preview_path, img, [cv2.IMWRITE_JPEG_QUALITY, 85])
    return preview_path


# ============================================================================
# CARD PROCESSING
# ============================================================================

def process_card(deck_name: str, card_name: str, *,
                 use_vlm: bool = True, save_previews: bool = False,
                 force: bool = False) -> str:
    """
    Processes a single card: detect → trace → label → save SVG + manifest.

    Args:
        deck_name: Name of the deck folder
        card_name: Name of the card (without extension)
        use_vlm: Whether to use LM Studio for labeling
        save_previews: Whether to save debug preview images
        force: Whether to re-process already-labeled cards

    Returns:
        A status message string.
    """
    image_path = os.path.join(OUTPUT_DIR, deck_name, f"{card_name}.webp")
    svg_path = os.path.join(OUTPUT_DIR, deck_name, f"{card_name}.svg")
    manifest_path = os.path.join(MANIFEST_DIR, deck_name, f"{card_name}.json")

    # Check if image exists
    if not os.path.exists(image_path):
        return f"[SKIP] {deck_name}/{card_name}: image not found"

    # Check if already processed (unless --force)
    if not force and os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r") as f:
                existing = json.load(f)
            spots = existing.get("hotspots", [])
            has_contours = any("contour" in s for s in spots)
            has_labels = all(
                s.get("label") and s["label"] != "Unknown Feature"
                for s in spots
            )
            if has_contours and (has_labels or not use_vlm):
                return f"✅ Skipped {deck_name}/{card_name}: already processed"
        except (json.JSONDecodeError, KeyError):
            pass  # Re-process broken manifests

    # 1. Detect contours with OpenCV
    logger.info(f"🔍 Detecting zones in {deck_name}/{card_name} ...")
    zones = detect_contours(image_path)

    if not zones:
        # Fallback: create a single whole-card zone
        logger.warning(f"  → No zones detected, using full-card fallback")
        zones = [{
            "bbox": (int(CARD_W * 0.025), int(CARD_H * 0.015),
                     int(CARD_W * 0.95), int(CARD_H * 0.97)),
            "contour": np.array([
                [[int(CARD_W * 0.025), int(CARD_H * 0.015)]],
                [[int(CARD_W * 0.975), int(CARD_H * 0.015)]],
                [[int(CARD_W * 0.975), int(CARD_H * 0.985)]],
                [[int(CARD_W * 0.025), int(CARD_H * 0.985)]],
            ]),
            "area": CARD_W * CARD_H * 0.93,
            "center": (CARD_W // 2, CARD_H // 2),
        }]

    # 2. VLM Labeling (optional)
    if use_vlm:
        labels = label_zones_vlm(image_path, zones)
        for idx, zone in enumerate(zones):
            zone["label"] = labels.get(str(idx + 1), "")
    else:
        for zone in zones:
            zone["label"] = ""

    # 3. Save debug preview (optional)
    if save_previews:
        preview_path = save_preview(image_path, zones, deck_name, card_name)
        if preview_path:
            logger.info(f"  📷 Preview saved: {preview_path}")

    # 4. Generate and save SVGs (transparent + colored overlay)
    svg_transparent, svg_colored = generate_overlay_svgs(
        card_name, zones, CARD_W, CARD_H
    )
    os.makedirs(os.path.dirname(svg_path), exist_ok=True)

    # Production SVG: invisible paths for CSS hover effects
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_transparent)

    # Debug/QA SVG: colored fills, strokes, numbered labels for overlay
    colored_svg_path = svg_path.replace(".svg", "_colored.svg")
    with open(colored_svg_path, "w", encoding="utf-8") as f:
        f.write(svg_colored)
    logger.info(f"  🎨 SVGs saved: {Path(svg_path).name} + {Path(colored_svg_path).name}")

    # 5. Generate and save manifest JSON
    manifest = generate_manifest(card_name, zones, CARD_W, CARD_H)
    os.makedirs(os.path.dirname(manifest_path), exist_ok=True)
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    label_count = sum(1 for z in zones if z.get("label"))
    return (
        f"✨ Processed {deck_name}/{card_name}: "
        f"{len(zones)} zones detected, {label_count} labeled"
    )


# ============================================================================
# MAIN
# ============================================================================

def collect_cards(deck_filter: str = None, card_filter: str = None) -> list[tuple[str, str]]:
    """
    Collects all (deck_name, card_name) pairs to process.

    Args:
        deck_filter: If set, only process this deck
        card_filter: If set, only process this card (requires deck_filter)

    Returns:
        List of (deck_name, card_name) tuples.
    """
    cards = []

    for deck_name in sorted(os.listdir(OUTPUT_DIR)):
        deck_path = os.path.join(OUTPUT_DIR, deck_name)
        if not os.path.isdir(deck_path):
            continue
        if deck_filter and deck_name != deck_filter:
            continue

        for fname in sorted(os.listdir(deck_path)):
            if not fname.endswith(".webp"):
                continue

            card_name = fname.replace(".webp", "")
            if card_filter and card_name != card_filter:
                continue

            cards.append((deck_name, card_name))

    return cards


def main():
    """
    Main entry point. Parses CLI arguments and processes cards.

    @note: VLM labeling runs sequentially (1 worker) since LM Studio
           handles one inference at a time. OpenCV detection is fast enough
           that parallelism isn't needed there either.
    """
    parser = argparse.ArgumentParser(
        description="OpenCV hotspot detector with contour tracing and VLM labeling"
    )
    parser.add_argument("--deck", type=str, default=None,
                        help="Process only this deck (folder name)")
    parser.add_argument("--card", type=str, default=None,
                        help="Process only this card (requires --deck)")
    parser.add_argument("--no-vlm", action="store_true",
                        help="Skip VLM labeling (detection + tracing only)")
    parser.add_argument("--preview", action="store_true",
                        help="Save debug preview images to previews/ folder")
    parser.add_argument("--force", action="store_true",
                        help="Re-process cards that already have contours")

    args = parser.parse_args()

    if args.card and not args.deck:
        parser.error("--card requires --deck to be specified")

    # Collect cards to process
    cards = collect_cards(deck_filter=args.deck, card_filter=args.card)
    logger.info(f"Found {len(cards)} cards to process.")

    if not cards:
        logger.info("Nothing to do!")
        return

    use_vlm = not args.no_vlm
    if use_vlm and not HAS_LMS:
        logger.warning("lmstudio SDK not available — running without VLM labeling")
        use_vlm = False

    # Process cards sequentially (LM Studio is single-threaded anyway)
    results = []
    for i, (deck_name, card_name) in enumerate(cards, 1):
        logger.info(f"[{i}/{len(cards)}] Processing {deck_name}/{card_name} ...")
        result = process_card(
            deck_name, card_name,
            use_vlm=use_vlm,
            save_previews=args.preview,
            force=args.force,
        )
        results.append(result)
        logger.info(result)

    # Summary
    processed = sum(1 for r in results if r.startswith("✨"))
    skipped = sum(1 for r in results if r.startswith("✅") or r.startswith("❌"))
    logger.info(f"\n{'='*60}")
    logger.info(f"Done! Processed: {processed} | Skipped: {skipped} | Total: {len(cards)}")
    logger.info(f"{'='*60}")


if __name__ == "__main__":
    main()
