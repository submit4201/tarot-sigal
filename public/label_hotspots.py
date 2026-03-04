import os
import json
import time
import tempfile
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

try:
    import lmstudio as lms
except ImportError:
    print("Please install the lmstudio SDK first:")
    print("  pip install lmstudio>=1.1.0")
    exit(1)

from PIL import Image, ImageDraw

# --- CONFIG ---
SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR   = os.path.join(SCRIPT_DIR, "assets", "cards", "tarot", "output")
MANIFEST_DIR = os.path.join(SCRIPT_DIR, "assets", "cards", "tarot", "manifests")

# Model loaded in LM Studio — qwen3.5-9b is a VLM (vision-language model)
LMS_MODEL = "qwen/qwen3.5-9b"

prompt_text = """\
Examine the image carefully. There are bright green numbered boxes drawn over specific elements.
For each numbered box, give a concise 1-to-3 word label describing what is inside it (e.g. 'Goblet', 'Sword Handle', 'Character Face').
Reply ONLY with a valid JSON object, nothing else:
{
  "1": "label",
  "2": "label"
}"""


def draw_hotspots(image_path: str, hotspots: list) -> Image.Image:
    """
    Opens the card image and draws bright green numbered boxes over each hotspot.
    Returns the annotated PIL Image (RGB, kept in memory — not saved to disk).
    """
    with Image.open(image_path) as img:
        if img.mode != "RGB":
            img = img.convert("RGB")
        draw  = ImageDraw.Draw(img)
        W, H  = img.size

        for idx, spot in enumerate(hotspots, start=1):
            # Hotspot coordinates are stored as percentages
            cx = (spot["x"]      / 100.0) * W
            cy = (spot["y"]      / 100.0) * H
            bw = (spot["width"]  / 100.0) * W
            bh = (spot["height"] / 100.0) * H

            x0, y0 = cx - bw / 2, cy - bh / 2
            x1, y1 = cx + bw / 2, cy + bh / 2

            # Green bounding box
            draw.rectangle([x0, y0, x1, y1], outline="#00FF00", width=4)
            # Dark label badge
            draw.rectangle([x0, max(0, y0 - 28), x0 + 28, max(28, y0)], fill="black")
            draw.text((x0 + 6, max(4, y0 - 22)), str(idx), fill="white", font_size=18)

        return img.copy()


def _parse_json(text: str) -> dict:
    """
    Parse JSON from model output, stripping markdown fences if present.
    Raises json.JSONDecodeError on total failure.
    """
    text = text.strip()
    if "```" in text:
        # Extract content between the first pair of backtick fences
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()
    return json.loads(text)


def generate_labels(annotated_img: Image.Image, num_zones: int) -> dict:
    """
    Sends the annotated image to LM Studio's qwen3.5-9b (VLM) via the
    native lmstudio Python SDK and returns a label dict like:
      {"1": "Goblet", "2": "Sword", ...}

    Falls back to empty dict if LM Studio is unreachable or inference fails.
    """
    # Save the annotated image to a temp JPEG so lms.prepare_image() can read it
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
        tmp_path = tmp.name
        annotated_img.save(tmp, format="JPEG", quality=85)

    try:
        image_handle = lms.prepare_image(tmp_path)
        model        = lms.llm(LMS_MODEL)

        chat = lms.Chat()
        chat.add_user_message(prompt_text, images=[image_handle])

        for attempt in range(3):
            try:
                print(f"  → LM Studio ({LMS_MODEL}) attempt {attempt + 1}/3 ...")
                t0         = time.time()
                # Disable Qwen thinking mode for fast, direct JSON output (no reasoning chain)
                prediction = model.respond(chat, config={"enable_thinking": False})
                content    = str(prediction)
                elapsed    = time.time() - t0
                print(f"  ✓ Done in {elapsed:.1f}s | {content[:120]}")
                return _parse_json(content)

            except json.JSONDecodeError:
                print(f"  ⚠ JSON parse failed on attempt {attempt + 1}. Raw: {content[:200]}")
                # Don't retry on parse failure — model responded but output was bad
                return {}
            except Exception as e:
                print(f"  ✗ Attempt {attempt + 1} failed: {str(e)[:120]}")
                time.sleep(3)

        return {}

    except Exception as e:
        err = str(e)
        if "refused" in err.lower() or "connect" in err.lower():
            print("⚠ Cannot reach LM Studio — is it running at localhost:1234?")
        else:
            print(f"⚠ LM Studio SDK error: {err}")
        return {}
    finally:
        # Always clean up the temp file
        try:
            os.unlink(tmp_path)
        except OSError:
            pass


def process_card_manifest(manifest_path: str) -> str:
    """
    Reads a JSON manifest, draws annotated image in memory, queries the VLM,
    and writes the labels back into the manifest JSON file.
    """
    deck_name  = Path(manifest_path).parent.name
    card_name  = Path(manifest_path).stem
    image_path = os.path.join(OUTPUT_DIR, deck_name, f"{card_name}.webp")

    if not os.path.exists(image_path):
        return f"❌ Skipped {deck_name}/{card_name}: image not found."

    with open(manifest_path, "r") as f:
        data = json.load(f)

    hotspots = data.get("hotspots", [])
    if not hotspots:
        return f"⏭️  Skipped {deck_name}/{card_name}: no hotspots defined."

    if all("label" in spot for spot in hotspots):
        return f"✅ Skipped {deck_name}/{card_name}: already labeled."

    # 1. Draw numbered boxes on the image (in memory only)
    annotated = draw_hotspots(image_path, hotspots)

    # 2. Ask the VLM what each box contains
    labels = generate_labels(annotated, len(hotspots))

    # 3. Write labels back into the hotspot objects
    for idx, spot in enumerate(hotspots, start=1):
        spot["label"] = labels.get(str(idx), "Unknown Feature")

    # 4. Save the updated manifest
    with open(manifest_path, "w") as f:
        json.dump(data, f, indent=2)

    return f"✨ Labeled {len(labels)}/{len(hotspots)} zones for {deck_name}/{card_name}"


def main():
    """Find all unlabeled manifests and label them via LM Studio."""
    manifest_files = []
    for root, _, filenames in os.walk(MANIFEST_DIR):
        for fname in filenames:
            if fname.endswith(".json"):
                manifest_files.append(os.path.join(root, fname))

    # Only queue files that still have unlabeled hotspots
    unlabeled = []
    for path in manifest_files:
        try:
            with open(path) as f:
                data = json.load(f)
            spots = data.get("hotspots", [])
            if spots and not all("label" in s for s in spots):
                unlabeled.append(path)
        except Exception:
            pass

    print(f"Found {len(unlabeled)} unlabeled manifests to process.")
    if not unlabeled:
        print("Nothing to do!")
        return

    # @note: LM Studio runs one inference at a time locally, so 1 worker is optimal.
    # Increase max_workers only if you have multiple GPUs or models loaded.
    with ThreadPoolExecutor(max_workers=1) as executor:
        results = list(executor.map(process_card_manifest, unlabeled))

    for r in results:
        print(r)

    print("\nAll done.")


if __name__ == "__main__":
    main()
