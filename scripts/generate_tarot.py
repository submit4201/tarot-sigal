"""
Tarot Card Image Generation Automator
======================================

Generates themed tarot card art using the Pollinations.ai image API.
Reads deck theme JSON files (major + minor arcana) and produces high-quality
card images with contextual prompts built from deck metadata, suit visuals,
and per-card descriptions.

Includes bad-prompt detection and LLM-powered prompt rewriting to handle
content policy rejections automatically.

Usage:
    python scripts/generate_tarot.py --dry-run
    python scripts/generate_tarot.py --card maj_00
    python scripts/generate_tarot.py --deck src/data/new/my_deck.json
    python scripts/generate_tarot.py --backofcard
    python scripts/generate_tarot.py --scan

@note: Requires IMAGE_API and IMAGE_MODEL in .env.local
"""

import os
import sys
import json
import time
import logging
import argparse
import urllib.parse
from pathlib import Path
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler

import requests
from dotenv import load_dotenv


# ---------------------------------------------------------------------------
# Path resolution
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
ENV_PATH = PROJECT_ROOT / ".env.local"
DEFAULT_DECK_PATH = PROJECT_ROOT / "src" / "data" / "new" / "new_deck_example.json"
DEFAULT_REG_PATH = PROJECT_ROOT / "src" / "data" / "tarot_deck_reg.json"
LOG_DIR = PROJECT_ROOT / ".log" / "generator"

load_dotenv(dotenv_path=str(ENV_PATH))


# ---------------------------------------------------------------------------
# Logging Setup (dual-stream: console + rotating file)
# ---------------------------------------------------------------------------
def setup_logger(name: str = "TarotGenerator") -> logging.Logger:
    """
    Configure dual-stream logger with console and rotating file output.

    Log files follow the global naming convention:
        generate-MM-DD-YYYY--HH.log

    Rotation occurs every 2 hours per project guidelines.

    Args:
        name: Logger name identifier.

    Returns:
        Configured logging.Logger instance.
    """
    logger = logging.getLogger(name)
    if logger.handlers:
        return logger  # Already configured

    logger.setLevel(logging.DEBUG)
    formatter = logging.Formatter(
        "[%(asctime)s] %(levelname)-8s %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Console handler (force UTF-8 on Windows to support unicode log messages)
    if sys.platform == "win32":
        import io
        console_stream = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    else:
        console_stream = sys.stdout
    console_handler = logging.StreamHandler(console_stream)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # File handler (rotating every 2 hours)
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    now = datetime.now()
    log_filename = f"generate-{now.strftime('%m-%d-%Y--%H')}.log"
    file_handler = TimedRotatingFileHandler(
        filename=str(LOG_DIR / log_filename),
        when="H",
        interval=2,
        backupCount=12,
        encoding="utf-8",
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger


log = setup_logger()


# ---------------------------------------------------------------------------
# TarotDeckLoader
# ---------------------------------------------------------------------------
class TarotDeckLoader:
    """
    Loads and normalizes a themed tarot deck JSON into a flat card list.

    The new deck format has:
        - cards.major[]       → list of {id, name, legacy, prompt}
        - cards.minor.{suit}[] → list of {id, name, desc}

    Each card is normalized to a dict with keys:
        id, name, legacy, prompt, suit, category

    Attributes:
        metadata: The deck_metadata section of the JSON.
        cards:    Flat list of normalized card dicts.
    """

    def __init__(self, deck_path: str | Path):
        """
        Load and parse a deck JSON file.

        Args:
            deck_path: Absolute or relative path to the deck JSON.

        Raises:
            FileNotFoundError: If the deck file does not exist.
            json.JSONDecodeError: If the JSON is malformed.
        """
        deck_path = Path(deck_path)
        if not deck_path.exists():
            raise FileNotFoundError(f"Deck file not found: {deck_path}")

        log.info(f"Loading deck from: {deck_path}")
        with open(deck_path, "r", encoding="utf-8") as f:
            raw = json.load(f)

        self.metadata = raw.get("deck_metadata", {})
        self.cards = self._normalize_cards(raw.get("cards", {}))
        log.info(
            f"Loaded deck '{self.deck_name}' — "
            f"{len(self.major_cards)} major, {len(self.minor_cards)} minor, "
            f"{len(self.cards)} total"
        )

    # -- Public properties --------------------------------------------------

    @property
    def deck_name(self) -> str:
        """The human-readable deck name."""
        return self.metadata.get("deck_name", self.metadata.get("name", "Unknown Deck"))

    @property
    def deck_slug(self) -> str:
        """
        A filesystem-safe slug derived from the deck name.

        Example: 'Eternal Grove Tarot' → 'Eternal_Grove_Tarot_Deck'
        """
        return self.deck_name.replace(" ", "_") + "_Deck"

    @property
    def suits(self) -> dict:
        """Suit metadata (theme, visuals, legacy name, element)."""
        return self.metadata.get("suits", {})

    @property
    def major_cards(self) -> list[dict]:
        """Only the 22 Major Arcana cards."""
        return [c for c in self.cards if c["category"] == "major"]

    @property
    def minor_cards(self) -> list[dict]:
        """Only the 56 Minor Arcana cards."""
        return [c for c in self.cards if c["category"] == "minor"]

    # -- Internal -----------------------------------------------------------

    @staticmethod
    def _normalize_cards(cards_section: dict) -> list[dict]:
        """
        Flatten the nested major/minor structure into a uniform card list.

        Args:
            cards_section: The 'cards' dict from the deck JSON.

        Returns:
            List of normalized card dicts.
        """
        normalized = []

        # Major Arcana
        for card in cards_section.get("major", []):
            normalized.append({
                "id": card["id"],
                "name": card.get("name", ""),
                "legacy": card.get("legacy", ""),
                "prompt": card.get("prompt", card.get("desc", "")),
                "suit": "major",
                "category": "major",
            })

        # Minor Arcana — organized by suit
        minor = cards_section.get("minor", {})
        for suit_name, suit_cards in minor.items():
            for card in suit_cards:
                normalized.append({
                    "id": card["id"],
                    "name": card.get("name", ""),
                    "legacy": card.get("legacy", ""),
                    "prompt": card.get("prompt", card.get("desc", "")),
                    "suit": suit_name,
                    "category": "minor",
                })

        return normalized


# ---------------------------------------------------------------------------
# PromptBuilder
# ---------------------------------------------------------------------------
class PromptBuilder:
    """
    Constructs rich, context-aware image generation prompts.

    Combines global deck metadata with per-suit visuals and per-card
    descriptions into a single optimized prompt string.
    """

    def __init__(self, loader: TarotDeckLoader):
        """
        Initialize with a loaded deck.

        Args:
            loader: A TarotDeckLoader instance with parsed deck data.
        """
        self.loader = loader
        self._meta = loader.metadata
        self._spec = self._meta.get("card_spec", {})

    def build(self, card: dict) -> str:
        """
        Build the full generation prompt for a single card.

        The prompt layers information in priority order:
        1. Global deck theme and mood
        2. Card-specific subject and description
        3. Suit-specific visual motifs (if applicable)
        4. Technical quality modifiers

        Args:
            card: Normalized card dict from TarotDeckLoader.

        Returns:
            Complete prompt string ready for the image API.
        """
        deck_name = self.loader.deck_name
        theme = self._meta.get("theme_overarching", "")
        mood = self._meta.get("mood", "")
        details = self._meta.get("details", "")
        style = self._spec.get("style", "")
        technical = self._spec.get("technical_details", "")
        border = self._spec.get("border", "")

        # Suit-specific visuals
        suit_info = self.loader.suits.get(card["suit"], {})
        suit_visuals = suit_info.get("visuals", "")
        suit_element = suit_info.get("element", "")

        # Card-specific content
        card_name = card["name"]
        card_legacy = card.get("legacy", "")
        card_prompt = card.get("prompt", "")

        # Assemble the prompt
        parts = [
            f"[{deck_name}] A breathtaking tarot card illustration of '{card_name}'.",
        ]

        if card_legacy:
            parts.append(f"Traditionally '{card_legacy}'.")

        if card_prompt:
            parts.append(f"Subject: {card_prompt}")

        if theme:
            parts.append(f"Theme: {theme}.")

        if suit_visuals:
            parts.append(f"Suit visuals: {suit_visuals}.")

        if suit_element:
            parts.append(f"Element: {suit_element}.")

        if mood:
            parts.append(f"Mood: {mood}.")

        if details:
            parts.append(f"Details: {details}.")

        if style:
            parts.append(f"Style: {style}.")

        if border:
            parts.append(f"Border: {border}.")

        # Quality modifiers
        parts.append(
            f"Highly detailed, masterpiece quality. {technical}"
        )

        return " ".join(parts)

    def build_backofcard(self) -> str:
        """
        Build a prompt for the back-of-card design.

        Returns:
            Prompt string for generating the card back image.
        """
        deck_name = self.loader.deck_name
        back_desc = self._meta.get("backofcard", "")
        theme = self._meta.get("theme_overarching", "")
        style = self._spec.get("style", "")
        technical = self._spec.get("technical_details", "")
        border = self._spec.get("border", "")

        parts = [
            f"[{deck_name}] The back design of a tarot card deck.",
            f"Design: {back_desc}" if back_desc else "",
            f"Theme: {theme}." if theme else "",
            f"Style: {style}." if style else "",
            f"Border: {border}." if border else "",
            f"Seamlessly tileable, symmetrical, ornate. {technical}",
        ]
        return " ".join(p for p in parts if p)


# ---------------------------------------------------------------------------
# PromptRewriter
# ---------------------------------------------------------------------------
class PromptRewriter:
    """
    Rewrites prompts that trigger content-policy rejections.

    Uses the free Pollinations text API to sanitize prompts while
    preserving artistic intent. Each retry attempt escalates the
    level of abstraction.

    @note The Pollinations text API requires no API key.
    """

    TEXT_API = "https://text.pollinations.ai/"
    MAX_REWRITE_ATTEMPTS = 3

    # System prompts escalate from light to heavy sanitization
    _SYSTEM_PROMPTS = [
        # Attempt 1 — light reword
        (
            "You are an image-prompt editor. The user's prompt was rejected by "
            "an AI image generator's content policy. Rephrase it to be safe "
            "while keeping the same artistic concept. Remove references to "
            "violence, trauma, self-harm, abuse, rage, blood, death imagery, "
            "and religious judgment. Replace with metaphorical or abstract "
            "artistic language. Return ONLY the rewritten prompt, nothing else."
        ),
        # Attempt 2 — heavier abstraction
        (
            "You are an image-prompt editor. The user's prompt was TWICE "
            "rejected by an AI image generator. Heavily abstract the concept. "
            "Replace ALL psychological, emotional, or dark themes with purely "
            "visual/artistic descriptions: colors, compositions, lighting, "
            "textures. Keep it as a beautiful tarot card description. "
            "Return ONLY the rewritten prompt, nothing else."
        ),
        # Attempt 3 — minimal safe prompt
        (
            "You are an image-prompt editor. The user's prompt keeps getting "
            "rejected. Create a MINIMAL, completely safe artistic description "
            "for a tarot card. Focus only on: a figure, colors, lighting, "
            "and composition. No emotions, no psychology, no metaphors about "
            "pain or darkness. Make it a beautiful, serene illustration. "
            "Return ONLY the rewritten prompt, nothing else."
        ),
    ]

    def rewrite(self, original_prompt: str, attempt: int = 1) -> str:
        """
        Rewrite a prompt that was rejected by the image API.

        Args:
            original_prompt: The prompt that was rejected.
            attempt:         Which rewrite attempt (1-3), controls escalation.

        Returns:
            The rewritten prompt string, or the original if rewriting fails.
        """
        idx = min(attempt - 1, len(self._SYSTEM_PROMPTS) - 1)
        system_msg = self._SYSTEM_PROMPTS[idx]

        log.info(f"  🔄 Rewriting prompt (attempt {attempt}/{self.MAX_REWRITE_ATTEMPTS})...")

        try:
            payload = {
                "messages": [
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": original_prompt},
                ],
                "model": "openai",
                "seed": 42,
            }
            response = requests.post(
                self.TEXT_API, json=payload, timeout=15
            )

            if response.status_code == 200:
                rewritten = response.text.strip()
                # Remove wrapping quotes if the LLM added them
                if rewritten.startswith('"') and rewritten.endswith('"'):
                    rewritten = rewritten[1:-1]
                log.info(f"  ✏️  Rewritten prompt ({len(rewritten)} chars)")
                log.debug(f"     Original:  {original_prompt[:120]}...")
                log.debug(f"     Rewritten: {rewritten[:120]}...")
                return rewritten
            else:
                log.warning(
                    f"  ⚠️  Rewrite API returned {response.status_code}, "
                    f"using original prompt"
                )
                return original_prompt

        except requests.exceptions.RequestException as e:
            log.warning(f"  ⚠️  Rewrite API error: {e}, using original prompt")
            return original_prompt


# ---------------------------------------------------------------------------
# ImageGenerator
# ---------------------------------------------------------------------------
class ImageGenerator:
    """
    Handles image generation via the Pollinations.ai API.

    Supports dry-run mode, skip-if-exists, and exponential backoff retries.

    Attributes:
        model:    Image model slug (e.g. 'imagen-4', 'flux').
        width:    Image width in pixels.
        height:   Image height in pixels.
        seed:     Random seed for reproducibility.
        dry_run:  If True, log prompts without calling the API.
        api_key:  Optional bearer token for authenticated requests.
    """

    API_BASE = "https://gen.pollinations.ai/image"
    MAX_RETRIES = 3
    RATE_LIMIT_DELAY = 1.5  # seconds between requests

    def __init__(
        self,
        model: str = "flux",
        width: int = 512,
        height: int = 768,
        seed: int = 42,
        dry_run: bool = False,
        api_key: str | None = None,
    ):
        """
        Configure the image generator.

        Args:
            model:   Pollinations model slug.
            width:   Output image width.
            height:  Output image height.
            seed:    Deterministic seed.
            dry_run: Skip API calls, only log prompts.
            api_key: Optional API bearer token.
        """
        self.model = model
        self.width = width
        self.height = height
        self.seed = seed
        self.dry_run = dry_run
        self.api_key = api_key

        # Stats
        self.generated = 0
        self.skipped = 0
        self.failed = 0
        self.bad_prompt_count = 0

    def generate(self, prompt: str, output_path: Path, label: str = "") -> bool | str:
        """
        Generate a single image from a prompt.

        Args:
            prompt:      The full text prompt.
            output_path: Where to save the resulting PNG.
            label:       Human-readable label for logging (e.g. card name).

        Returns:
            True if the image was generated/skipped successfully, False on failure,
            or "BAD_PROMPT" if the API returned a content-policy placeholder image.
        """
        # Skip if already exists
        if output_path.exists():
            log.info(f"  ⏭  Skipping '{label}' — already exists at {output_path.name}")
            self.skipped += 1
            return True

        # Dry-run mode
        if self.dry_run:
            log.info(f"  🔍 [DRY-RUN] '{label}'")
            log.debug(f"     Prompt: {prompt[:200]}...")
            log.debug(f"     Output: {output_path}")
            self.generated += 1
            return True

        # Build API URL
        encoded_prompt = urllib.parse.quote(prompt)
        url = (
            f"{self.API_BASE}/{encoded_prompt}"
            f"?width={self.width}&height={self.height}"
            f"&model={self.model}&seed={self.seed}"
        )

        headers = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        # Retry loop with exponential backoff
        for attempt in range(1, self.MAX_RETRIES + 1):
            try:
                log.debug(f"  📡 API request attempt {attempt}/{self.MAX_RETRIES}")
                response = requests.get(url, headers=headers, timeout=120)

                if response.status_code == 200:
                    output_path.parent.mkdir(parents=True, exist_ok=True)
                    with open(output_path, "wb") as f:
                        f.write(response.content)

                    # Validate image dimensions — bad-prompt responses are
                    # 1024x1024 placeholders instead of the requested size.
                    # _validate_image returns True (valid), False (confirmed bad),
                    # or None (couldn't validate — treat as suspicious and skip).
                    validation = self._validate_image(output_path)
                    if validation is False:
                        output_path.unlink(missing_ok=True)
                        log.warning(
                            f"  🚫 Bad-prompt detected for '{label}' — "
                            f"image dimensions don't match {self.width}x{self.height}"
                        )
                        self.bad_prompt_count += 1
                        return "BAD_PROMPT"
                    elif validation is None:
                        log.warning(
                            f"  ⚠️  Could not validate '{label}' — keeping image but flagging"
                        )

                    log.info(f"  ✅ Saved '{label}' → {output_path.name}")
                    self.generated += 1
                    time.sleep(self.RATE_LIMIT_DELAY)
                    return True

                elif response.status_code in (429, 500, 502, 503, 530):
                    wait = 5 * attempt
                    log.warning(
                        f"  ⚠️  API {response.status_code} for '{label}', "
                        f"retrying in {wait}s ({attempt}/{self.MAX_RETRIES})"
                    )
                    time.sleep(wait)
                else:
                    log.error(
                        f"  ❌ Failed '{label}': HTTP {response.status_code} — "
                        f"{response.text[:200]}"
                    )
                    self.failed += 1
                    return False

            except requests.exceptions.Timeout:
                wait = 10 * attempt
                log.warning(
                    f"  ⏱  Timeout for '{label}', retrying in {wait}s "
                    f"({attempt}/{self.MAX_RETRIES})"
                )
                time.sleep(wait)

            except requests.exceptions.RequestException as e:
                log.error(f"  ❌ Network error for '{label}': {e}")
                if attempt < self.MAX_RETRIES:
                    time.sleep(3 * attempt)
                else:
                    self.failed += 1
                    return False

        log.error(f"  ❌ Exhausted retries for '{label}'")
        self.failed += 1
        return False

    def _validate_image(self, path: Path) -> bool:
        """
        Validate that a saved image is NOT a bad-prompt placeholder.

        The Pollinations API returns a 1024x1024 "Bad Prompt Buddy"
        placeholder image when it rejects a prompt for content policy
        violations. This check catches those by looking for the
        characteristic square dimensions.

        Args:
            path: Path to the saved image file.

        Returns:
            True if image is valid (not a placeholder), False if confirmed bad,
            None if the image could not be opened/validated.
        """
        try:
            from PIL import Image
            with Image.open(path) as img:
                w, h = img.size
            if (w, h) == BAD_PROMPT_SIZE:
                log.debug(
                    f"     Image is {w}x{h} — matches bad-prompt signature"
                )
                return False
            return True
        except Exception as e:
            log.warning(f"  ⚠️  Could not validate image {path.name}: {e}")
            return None

    def print_summary(self, total: int):
        """
        Print a final generation summary report.

        Args:
            total: Total number of cards that were scheduled.
        """
        log.info("=" * 60)
        log.info("GENERATION SUMMARY")
        log.info(f"  Total scheduled  : {total}")
        log.info(f"  Generated        : {self.generated}")
        log.info(f"  Skipped (exist)  : {self.skipped}")
        log.info(f"  Bad-prompt fixes : {self.bad_prompt_count}")
        log.info(f"  Failed           : {self.failed}")
        mode_label = "DRY-RUN" if self.dry_run else "LIVE"
        log.info(f"  Mode             : {mode_label}")
        log.info("=" * 60)


# ---------------------------------------------------------------------------
# Scan Utility
# ---------------------------------------------------------------------------
BAD_PROMPT_SIZE = (1024, 1024)  # Pollinations bad-prompt placeholder dims


def scan_bad_images(directory: Path):
    """
    Scan a directory for bad-prompt placeholder images and delete them.

    The Pollinations API returns a 1024×1024 square "Bad Prompt Buddy"
    placeholder when a prompt is rejected for content-policy violations.
    Normal tarot card images are always rectangular (e.g. 512×768,
    768×1408), so a square 1024×1024 image is a reliable bad-prompt
    indicator.

    Args:
        directory: Path to the directory to scan.
    """
    from PIL import Image

    png_files = sorted(directory.glob("*.png"))
    if not png_files:
        log.info(f"No PNG files found in {directory}")
        return

    log.info(f"Scanning {len(png_files)} images in {directory}...")
    log.info(f"Bad-prompt signature: {BAD_PROMPT_SIZE[0]}x{BAD_PROMPT_SIZE[1]}")
    log.info("-" * 60)

    bad_files = []
    good_count = 0

    for img_path in png_files:
        try:
            with Image.open(img_path) as img:
                w, h = img.size
            if (w, h) == BAD_PROMPT_SIZE:
                bad_files.append((img_path, w, h))
                log.warning(f"  🚫 {img_path.name}: {w}x{h} (BAD PROMPT)")
            else:
                good_count += 1
        except Exception as e:
            log.warning(f"  ⚠️  Could not open {img_path.name}: {e}")

    log.info("-" * 60)
    log.info(f"Good images:  {good_count}")
    log.info(f"Bad images:   {len(bad_files)}")

    if bad_files:
        try:
            answer = input(f"Delete {len(bad_files)} bad image(s)? [y/N] ").strip().lower()
        except (EOFError, KeyboardInterrupt):
            answer = ""
        if answer == "y":
            for path, w, h in bad_files:
                path.unlink()
                log.info(f"  🗑  Deleted {path.name} ({w}x{h})")
            log.info(
                f"✅ Deleted {len(bad_files)} bad image(s). "
                f"Re-run without --scan to regenerate them."
            )
        else:
            log.info("Deletion cancelled — no files were removed.")
    else:
        log.info("✅ All images look good — no bad-prompt placeholders found.")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------
def build_cli() -> argparse.ArgumentParser:
    """
    Build the argparse CLI interface.

    Returns:
        Configured ArgumentParser.
    """
    parser = argparse.ArgumentParser(
        prog="generate_tarot",
        description="🃏 Tarot Card Image Generation Automator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  python scripts/generate_tarot.py --dry-run\n"
            "  python scripts/generate_tarot.py --card maj_00\n"
            "  python scripts/generate_tarot.py --deck src/data/new/my_deck.json\n"
            "  python scripts/generate_tarot.py --backofcard --model imagen-4\n"
        ),
    )

    parser.add_argument(
        "--deck",
        type=str,
        default=str(DEFAULT_DECK_PATH),
        help="Path to the theme deck JSON file (default: new_deck_example.json)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Output directory for generated images (auto-derived from deck name if omitted)",
    )
    parser.add_argument(
        "--model",
        type=str,
        default=os.getenv("IMAGE_MODEL", "flux"),
        help="Image model to use (default: from IMAGE_MODEL env or 'flux')",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print prompts without generating images",
    )
    parser.add_argument(
        "--card",
        type=str,
        default=None,
        help="Generate only a single card by its ID (e.g. maj_00, sun_05)",
    )
    parser.add_argument(
        "--width",
        type=int,
        default=512,
        help="Image width in pixels (default: 512)",
    )
    parser.add_argument(
        "--height",
        type=int,
        default=768,
        help="Image height in pixels (default: 768)",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for reproducibility (default: 42)",
    )
    parser.add_argument(
        "--backofcard",
        action="store_true",
        help="Also generate (or only generate) the back-of-card image",
    )
    parser.add_argument(
        "--scan",
        action="store_true",
        help="Scan output directory for bad-prompt images and delete them",
    )
    parser.add_argument(
        "--no-rewrite",
        action="store_true",
        help="Disable automatic prompt rewriting on bad-prompt detection",
    )

    return parser


# ---------------------------------------------------------------------------
# Main Orchestrator
# ---------------------------------------------------------------------------
def run(args: argparse.Namespace):
    """
    Main execution pipeline.

    Loads the deck, builds prompts, and generates images according
    to the CLI arguments provided.

    Args:
        args: Parsed CLI namespace.
    """
    # --- Load deck ---
    deck_path = Path(args.deck)
    if not deck_path.is_absolute():
        deck_path = PROJECT_ROOT / deck_path

    loader = TarotDeckLoader(deck_path)
    builder = PromptBuilder(loader)

    # --- Resolve output directory ---
    if args.output:
        out_dir = Path(args.output)
    else:
        out_dir = PROJECT_ROOT / "public" / "assets" / "cards" / "tarot" / loader.deck_slug

    out_dir.mkdir(parents=True, exist_ok=True)
    log.info(f"Output directory: {out_dir}")

    # --- Create generator ---
    generator = ImageGenerator(
        model=args.model,
        width=args.width,
        height=args.height,
        seed=args.seed,
        dry_run=args.dry_run,
        api_key=os.getenv("IMAGE_API"),
    )

    # --- Determine card list ---
    if args.card:
        cards = [c for c in loader.cards if c["id"] == args.card]
        if not cards:
            log.error(f"Card ID '{args.card}' not found in deck. Available IDs:")
            for c in loader.cards[:5]:
                log.error(f"  {c['id']}: {c['name']}")
            log.error(f"  ... and {len(loader.cards) - 5} more")
            sys.exit(1)
    else:
        cards = loader.cards

    total = len(cards) + (1 if args.backofcard else 0)
    log.info(f"{'DRY-RUN ' if args.dry_run else ''}Generating {total} image(s) with model '{args.model}'")
    log.info("-" * 60)

    # --- Scan mode: find and delete bad images ---
    if args.scan:
        scan_bad_images(out_dir)
        return

    # --- Prompt rewriter (for bad-prompt recovery) ---
    rewriter = None if args.no_rewrite else PromptRewriter()

    # --- Generate card images ---
    for idx, card in enumerate(cards, start=1):
        progress = f"[{idx}/{total}]"
        label = f"{card['name']} ({card['id']})"
        log.info(f"{progress} {label}")

        prompt = builder.build(card)
        file_path = out_dir / f"{card['id']}.png"

        result = generator.generate(prompt, file_path, label=label)

        # --- Bad-prompt auto-retry with LLM rewriting ---
        # Each attempt rewrites from the *original* prompt to avoid cumulative
        # drift from the card's artistic intent.
        if result == "BAD_PROMPT" and rewriter:
            original_prompt = prompt
            for rewrite_attempt in range(1, PromptRewriter.MAX_REWRITE_ATTEMPTS + 1):
                current_prompt = rewriter.rewrite(original_prompt, rewrite_attempt)
                log.info(
                    f"  🔁 Retry {rewrite_attempt}/{PromptRewriter.MAX_REWRITE_ATTEMPTS} "
                    f"for '{label}' with rewritten prompt"
                )
                retry_result = generator.generate(
                    current_prompt, file_path, label=f"{label} [rewrite {rewrite_attempt}]"
                )
                if retry_result is True:
                    log.info(f"  🎉 Rewrite succeeded for '{label}' on attempt {rewrite_attempt}")
                    break
                elif retry_result == "BAD_PROMPT":
                    log.warning(
                        f"  🚫 Rewrite {rewrite_attempt} still rejected for '{label}'"
                    )
                else:
                    # Network/other failure
                    break
            else:
                log.error(
                    f"  ❌ All rewrite attempts exhausted for '{label}'"
                )

    # --- Back-of-card ---
    if args.backofcard:
        log.info(f"[{total}/{total}] Back of Card")
        back_prompt = builder.build_backofcard()
        back_path = out_dir / "back.png"
        generator.generate(back_prompt, back_path, label="Back of Card")

    # --- Summary ---
    generator.print_summary(total)


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    try:
        parser = build_cli()
        args = parser.parse_args()
        run(args)
    except KeyboardInterrupt:
        log.warning("\n⛔ Interrupted by user.")
        sys.exit(130)
    except Exception as e:
        log.exception(f"Fatal error: {e}")
        sys.exit(1)
