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
import asyncio
import random
from pathlib import Path
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler
from collections import deque
from dataclasses import dataclass, field

import requests
from dotenv import load_dotenv

try:
    import aiohttp
    ASYNC_AVAILABLE = True
except ImportError:
    ASYNC_AVAILABLE = False
    log = logging.getLogger("TarotGenerator")
    log.warning("aiohttp not available - parallel processing disabled. Install with: pip install aiohttp")

REPLICATE_AVAILABLE = False


# ---------------------------------------------------------------------------
# Path resolution
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
# If this file lives in /scripts, project root is parent; otherwise use this dir.
PROJECT_ROOT = SCRIPT_DIR.parent if SCRIPT_DIR.name == "scripts" else SCRIPT_DIR
ENV_PATH = PROJECT_ROOT / ".env"
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

    def build_batch(self, cards: list[dict]) -> dict[str, str]:
        """
        Build prompts for multiple cards at once.

        Useful for generating prompts for a full deck or subset of cards
        before passing to the image generator.

        Args:
            cards: List of normalized card dicts from TarotDeckLoader.

        Returns:
            Dictionary mapping card ID to prompt string.
        """
        return {card["id"]: self.build(card) for card in cards}


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

    TEXT_API = "https://openrouter.ai/api/v1/chat/completions"
    MAX_REWRITE_ATTEMPTS = 4

    def __init__(self, model: str = None):
        """
        Initialize the rewriter with a specific text model.
        
        Args:
            model: The text model to use (defaults to OPENROUTER_MODEL env or free tier fallback).
        """
        self.api_key = os.getenv("OPENROUTER_API")
        self.model = model or os.getenv("OPENROUTER_MODEL", "openrouter/free")
        
        if not self.api_key:
            log.warning("OPENROUTER_API key not found. Prompt rewriting may fail.")

    # System prompts escalate from light to heavy sanitization
    _SYSTEM_PROMPTS = [
        # Attempt 1 — light reword (guardrail-friendly)
        (
            "You are an image-prompt editor. The user's prompt was rejected by "
            "an AI image generator's content policy. Rephrase it to be safe "
            "and guardrail-friendly while preserving the same artistic theme. "
            "Avoid explicit or graphic content. Remove references to violence, "
            "injury, blood, gore, self-harm, abuse, weapons, or graphic death. "
            "Replace those with symbolic, abstract, or uplifting visual metaphors "
            "(light, texture, atmosphere, nature, geometry). Keep it suitable for "
            "a general audience and family-friendly imagery. "
            "Keep the prompt concise (under 200 words). "
            "Return ONLY the rewritten prompt, nothing else."
        ),
        # Attempt 2 — heavier abstraction
        (
            "You are an image-prompt editor. The user's prompt was TWICE "
            "rejected by an AI image generator. Heavily abstract the concept. "
            "Keep the overall theme but express it only through safe visual cues: "
            "colors, lighting, composition, shapes, textures, symbols, and mood. "
            "No explicit harm, no violence, no bodily injury, no taboo content. "
            "Make it serene, elegant, and clearly safe for general audiences. "
            "Keep it under 150 words. "
            "Return ONLY the rewritten prompt, nothing else."
        ),
        # Attempt 3 — High-Quality Artistic Reinterpretation (Safe but detailed)
        (
            "You are an expert art director. The user's prompt was rejected. "
            "Write a NEW, high-quality, artistic image prompt for a Tarot card. "
            "Focus on: Beautiful Composition (cinematic lighting, rule of thirds, intricate detail), "
            "Safe Symbolism (replace violence/conflict with metaphorical representations like "
            "swords floating in light or resting on stone), and Mood. "
            "Style: Ethereal, surreal, masterpiece, 8k resolution. "
            "Ensure NO explicit violence, blood, or gore. "
            "Keep it under 150 words to avoid truncation. "
            "Return ONLY the rewritten prompt."
        ),
        # Attempt 4 — NUCLEAR OPTION (Abstract Geometry)
        (
            "You are an image-prompt editor. This is the final attempt. "
            "The prompt MUST pass safety filters. "
            "Convert the concept into PURE ABSTRACT GEOMETRY and LIGHT. "
            "Do NOT describe people, bodies, faces, or weapons. "
            "Describe ONLY: fractals, nebulas, crystals, light rays, sacred geometry, "
            "color gradients, and ethereal textures. "
            "Example: 'A glowing golden dodecahedron floating in a nebula of deep violet mist.' "
            "Keep it very short (under 75 words). "
            "Return ONLY the rewritten prompt."
        ),
    ]

    def rewrite(self, original_prompt: str, attempt: int = 1) -> str:
        """
        Rewrite a prompt that was rejected by the image API.

        Args:
            original_prompt: The prompt that was rejected.
            attempt:         Which rewrite attempt (1-4), controls escalation.

        Returns:
            The rewritten prompt string, or the original if rewriting fails.
        """
        # Select prompt based on attempt number (clamped to list size)
        idx = min(attempt, len(self._SYSTEM_PROMPTS)) - 1
        system_msg = self._SYSTEM_PROMPTS[idx]

        log.info(f"  🔄 Rewriting prompt (Attempt {attempt}, strategy {idx+1})...")

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://gridpunk-arcana.com",
                "X-Title": "Gridpunk Arcana Tarot Gen"
            }
            
            payload = {
                "messages": [
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": original_prompt},
                ],
                "model": self.model,
                "temperature": 0.7,
            }
            response = requests.post(
                self.TEXT_API, json=payload, headers=headers, timeout=30
            )

            if response.status_code == 200:
                data = response.json()
                rewritten = data["choices"][0]["message"]["content"].strip()
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
# GlobalRateLimiter
# ---------------------------------------------------------------------------
class GlobalRateLimiter:
    """
    Global rate limiter shared across all ImageGenerator instances.
    Ensures requests are properly spaced out across all workers.
    """
    def __init__(self, min_interval: float = 7.0):
        self.min_interval = min_interval  # Minimum seconds between ANY requests
        self._lock = None
        self._last_request_time = 0.0
    
    def initialize_async(self):
        """Initialize async lock (must be called from async context)."""
        if self._lock is None and ASYNC_AVAILABLE:
            self._lock = asyncio.Lock()
    
    async def acquire(self):
        """Wait until enough time has passed since last request (with jitter)."""
        if not ASYNC_AVAILABLE:
            return
        
        # Ensure lock is initialized
        if self._lock is None:
            self.initialize_async()
        
        if not self._lock:
            return
        
        async with self._lock:
            now = time.time()
            elapsed = now - self._last_request_time
            
            if elapsed < self.min_interval:
                wait_time = self.min_interval - elapsed
                # Add jitter to prevent perfect synchronization
                jitter = random.uniform(0.5, wait_time * 0.5)
                total_wait = wait_time + jitter
                log.debug(f"  🕒 Global rate limit: {total_wait:.1f}s")
                await asyncio.sleep(total_wait)
            else:
                # Even if enough time passed, add jitter
                jitter = random.uniform(0.2, 1.0)
                await asyncio.sleep(jitter)
            
            self._last_request_time = time.time()


# Shared global rate limiter instance
_global_rate_limiter = None


# ---------------------------------------------------------------------------
# ImageProviderFactory
# ---------------------------------------------------------------------------
class ImageProvider:
    """Base class for image providers."""
    
    def __init__(self, model: str = "flux", width: int = 512, height: int = 768, seed: int = 42, dry_run: bool = False):
        self.model = model
        self.width = width
        self.height = height
        self.seed = seed
        self.dry_run = dry_run
        self.generated = 0
        self.skipped = 0
        self.failed = 0
        self.bad_prompt_count = 0
    
    async def generate_async(self, prompt: str, output_path: Path, label: str = "", session=None, worker_id: int = None, force_model: str = None) -> bool | str:
        raise NotImplementedError
    
    def generate(self, prompt: str, output_path: Path, label: str = "") -> bool | str:
        raise NotImplementedError
    
    def print_summary(self, total: int):
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


def create_image_generator(provider_name: str = None, **kwargs) -> ImageProvider:
    """Factory function to create the appropriate image provider, supports chaining."""
    if provider_name is None:
        provider_name = os.getenv("IMAGE_PROVIDER", "huggingface,pollinations,openrouter,replicate")

    # Support multiple providers separated by comma
    providers_list = [p.strip().lower() for p in provider_name.split(",") if p.strip()]
    
    if len(providers_list) > 1:
        log.info(f"🛠️  Initializing Failover Chain: {' -> '.join(providers_list)}")
        instantiated_providers = []
        for p in providers_list:
            instantiated_providers.append(create_image_generator(p, **kwargs))
        return FailoverImageProvider(instantiated_providers, dry_run=kwargs.get("dry_run", False))

    # Single provider logic
    p = providers_list[0]
    if p == "replicate":
        kwargs.pop("api_key", None)
        return ReplicateImageGenerator(api_key=os.getenv("REPLICATE_API_KEY"), **kwargs)
    elif p == "openrouter":
        kwargs.pop("api_key", None)
        return OpenRouterImageGenerator(api_key=os.getenv("OPENROUTER_API"), **kwargs)
    elif p == "huggingface":
        kwargs.pop("api_key", None)
        return HuggingFaceGenerator(api_key=os.getenv("HUGGINGFACE_API_KEY"), **kwargs)
    elif p == "freepik":
        kwargs.pop("api_key", None)
        return FreepikGenerator(api_key=os.getenv("FREEPIK_API_KEY"), **kwargs)
    else:  # Default to Pollinations
        kwargs.pop("api_key", None)
        return ImageGenerator(api_key=os.getenv("IMAGE_API"), **kwargs)


def resolve_provider_name(provider_name: str | None = None) -> str:
    """Resolve the effective provider name using env fallbacks."""
    if provider_name:
        return provider_name.lower()
    env_provider = os.getenv("IMAGE_PROVIDER")
    if env_provider:
        return env_provider.lower()
    return "replicate" if os.getenv("REPLICATE_API_KEY") else "pollinations"


# ---------------------------------------------------------------------------
# ReplicateImageGenerator
# ---------------------------------------------------------------------------
class ReplicateImageGenerator(ImageProvider):
    """Image generation via Replicate.com API using direct HTTP (no SDK dependency)."""
    
    API_BASE = "https://api.replicate.com/v1/predictions"
    MAX_RETRIES = 5
    MIN_REQUEST_INTERVAL = 2.0
    
    # Stable models with good tarot art results
    REPLICATE_MODELS = {
        "flux": "black-forest-labs/flux-pro",
        "flux-schnell": "black-forest-labs/flux-schnell",
        "sdxl": "stability-ai/sdxl",
        "proteus": "stability-ai/proteus",
    }
    
    def __init__(self, model: str = "flux", width: int = 512, height: int = 768, seed: int = 42, dry_run: bool = False, api_key: str = None):
        super().__init__(model, width, height, seed, dry_run)
        self.api_key = api_key or os.getenv("REPLICATE_API_KEY")
        self.replicate_model = os.getenv("REPLICATE_MODEL") or self.REPLICATE_MODELS.get(model, "black-forest-labs/flux-pro")
        
        global REPLICATE_AVAILABLE
        if not self.api_key:
            log.warning("⚠️  REPLICATE_API_KEY not set. Get one from https://replicate.com/account/api-tokens")
            REPLICATE_AVAILABLE = False
            return

        REPLICATE_AVAILABLE = True
    
    async def generate_async(self, prompt: str, output_path: Path, label: str = "", session=None, worker_id: int = None, force_model: str = None) -> bool | str:
        """Generate image via Replicate API using direct HTTP."""
        if output_path.exists():
            log.info(f"  ⏭  Skipping '{label}' — already exists at {output_path.name}")
            self.skipped += 1
            return True
        
        if self.dry_run:
            log.info(f"  🔍 [DRY-RUN] '{label}'")
            log.debug(f"     Prompt: {prompt[:200]}...")
            self.generated += 1
            return True
        
        if not REPLICATE_AVAILABLE or not self.api_key:
            log.error("  ❌ Replicate not available in this Python environment")
            self.failed += 1
            return False
        
        for attempt in range(1, self.MAX_RETRIES + 1):
            # Global rate limiting
            if _global_rate_limiter:
                _global_rate_limiter.initialize_async()
                await _global_rate_limiter.acquire()
            
            if attempt > 1:
                base_delay = 5 * (2 ** (attempt - 2))
                jitter = random.uniform(0, base_delay * 0.3)
                delay = base_delay + jitter
                log.info(f"  ⏳ Retry {attempt-1}/{self.MAX_RETRIES-1} after {delay:.1f}s...")
                await asyncio.sleep(delay)
            
            try:
                log.debug(f"  📡 Replicate API request attempt {attempt}/{self.MAX_RETRIES}")

                model_slug = self.REPLICATE_MODELS.get(force_model, self.replicate_model) if force_model else self.replicate_model

                # Build inputs based on model schema
                if model_slug.startswith("google/imagen-4"):
                    input_payload = {
                        "prompt": prompt,
                        "image_size": "1K",
                        "aspect_ratio": "2:3",
                        "output_format": "png",
                        "safety_filter_level": "block_medium_and_above",
                    }
                else:
                    input_payload = {
                        "prompt": prompt,
                        "width": self.width,
                        "height": self.height,
                        "seed": self.seed,
                    }

                # Direct HTTP call to Replicate API - no SDK needed!
                if session is None:
                    async with aiohttp.ClientSession() as tmp_session:
                        headers = {
                            "Authorization": f"Token {self.api_key}",
                            "Content-Type": "application/json",
                        }
                        async with tmp_session.post(
                            f"{self.API_BASE}",
                            json={"version": model_slug, "input": input_payload},
                            headers=headers,
                        ) as resp:
                            if resp.status != 201:
                                log.warning(f"  ⚠️  Replicate API error: {resp.status}")
                                if attempt >= self.MAX_RETRIES:
                                    self.failed += 1
                                    return False
                                continue

                            prediction = await resp.json()
                            prediction_id = prediction.get("id")
                            if not prediction_id:
                                log.warning(f"  ⚠️  No prediction ID from Replicate")
                                self.failed += 1
                                return False

                        # Poll for completion
                        output_url = await self._poll_prediction(tmp_session, prediction_id)
                        if not output_url:
                            if attempt >= self.MAX_RETRIES:
                                self.failed += 1
                                return False
                            continue

                        # Download image
                        async with tmp_session.get(output_url) as img_response:
                            if img_response.status == 200:
                                output_path.parent.mkdir(parents=True, exist_ok=True)
                                with open(output_path, "wb") as f:
                                    f.write(await img_response.read())
                                log.info(f"  ✅ Saved '{label}' → {output_path.name}")
                                self.generated += 1
                                return True
                else:
                    headers = {
                        "Authorization": f"Token {self.api_key}",
                        "Content-Type": "application/json",
                    }
                    async with session.post(
                        f"{self.API_BASE}",
                        json={"version": model_slug, "input": input_payload},
                        headers=headers,
                    ) as resp:
                        if resp.status != 201:
                            log.warning(f"  ⚠️  Replicate API error: {resp.status}")
                            if attempt >= self.MAX_RETRIES:
                                self.failed += 1
                                return False
                            continue

                        prediction = await resp.json()
                        prediction_id = prediction.get("id")
                        if not prediction_id:
                            log.warning(f"  ⚠️  No prediction ID from Replicate")
                            self.failed += 1
                            return False

                    # Poll for completion
                    output_url = await self._poll_prediction(session, prediction_id)
                    if not output_url:
                        if attempt >= self.MAX_RETRIES:
                            self.failed += 1
                            return False
                        continue

                    # Download image
                    async with session.get(output_url) as img_response:
                        if img_response.status == 200:
                            output_path.parent.mkdir(parents=True, exist_ok=True)
                            with open(output_path, "wb") as f:
                                f.write(await img_response.read())
                            log.info(f"  ✅ Saved '{label}' → {output_path.name}")
                            self.generated += 1
                            return True

                log.warning(f"  ⚠️  Failed to generate image for '{label}'")
                self.failed += 1
                return False
            
            except asyncio.TimeoutError:
                log.warning(f"  ⏱  Timeout for '{label}' (attempt {attempt}/{self.MAX_RETRIES})")
            except Exception as e:
                log.warning(f"  ❌ Network error for '{label}': {e}")
                if attempt >= self.MAX_RETRIES:
                    self.failed += 1
                    return False
        
        log.error(f"  ❌ Exhausted retries for '{label}'")
        self.failed += 1
        return False
    
    async def _poll_prediction(self, session, prediction_id: str, max_wait: int = 300) -> str | None:
        """Poll Replicate API until prediction completes or times out."""
        start_time = asyncio.get_event_loop().time()
        
        while True:
            elapsed = asyncio.get_event_loop().time() - start_time
            if elapsed > max_wait:
                log.warning(f"  ⏱  Prediction polling timeout after {max_wait}s")
                return None
            
            try:
                headers = {"Authorization": f"Token {self.api_key}"}
                async with session.get(
                    f"{self.API_BASE}/{prediction_id}",
                    headers=headers,
                ) as resp:
                    if resp.status != 200:
                        log.warning(f"  ⚠️  Failed to get prediction status: {resp.status}")
                        return None
                    
                    prediction = await resp.json()
                    status = prediction.get("status")
                    
                    if status == "succeeded":
                        outputs = prediction.get("output")
                        if outputs:
                            # Output can be a list or a string
                            if isinstance(outputs, list) and outputs:
                                return outputs[0]
                            elif isinstance(outputs, str):
                                return outputs
                        return None
                    
                    elif status == "failed":
                        error = prediction.get("error", "Unknown error")
                        log.warning(f"  ⚠️  Prediction failed: {error}")
                        return None
                    
                    elif status in ("processing", "starting"):
                        await asyncio.sleep(2)  # Poll every 2 seconds
                    
                    else:
                        log.debug(f"  📊 Prediction status: {status}")
                        await asyncio.sleep(2)
            
            except Exception as e:
                log.warning(f"  ❌ Error polling prediction: {e}")
                return None
    
    def generate(self, prompt: str, output_path: Path, label: str = "") -> bool | str:
        """Synchronous wrapper (Replicate is async-only in this script)."""
        if output_path.exists():
            log.info(f"  ⏭  Skipping '{label}' — already exists at {output_path.name}")
            self.skipped += 1
            return True
        
        if self.dry_run:
            log.info(f"  🔍 [DRY-RUN] '{label}'")
            self.generated += 1
            return True
        
        log.error("  ❌ Use async mode for Replicate (--parallel or --sequential)")
        self.failed += 1
        return False


# ---------------------------------------------------------------------------
# OpenRouterImageGenerator
# ---------------------------------------------------------------------------
class OpenRouterImageGenerator(ImageProvider):
    """Image generation via OpenRouter (text-to-image models)."""
    
    API_BASE = "https://openrouter.ai/api/v1/images/generations"
    MAX_RETRIES = 5
    MIN_REQUEST_INTERVAL = 3.0
    
    def __init__(self, model: str = "flux", width: int = 512, height: int = 768, seed: int = 42, dry_run: bool = False, api_key: str = None):
        super().__init__(model, width, height, seed, dry_run)
        self.api_key = api_key or os.getenv("OPENROUTER_API")
        self.openrouter_model = os.getenv("OPENROUTER_IMAGE_MODEL", "nvidia/llama-nemotron-embed-vl-1b-v2:free")
        
        if not self.api_key:
            log.warning("⚠️  OPENROUTER_API not set")
    
    async def generate_async(self, prompt: str, output_path: Path, label: str = "", session=None, worker_id: int = None, force_model: str = None) -> bool | str:
        """Generate image via OpenRouter API."""
        if output_path.exists():
            log.info(f"  ⏭  Skipping '{label}' — already exists at {output_path.name}")
            self.skipped += 1
            return True
        
        if self.dry_run:
            log.info(f"  🔍 [DRY-RUN] '{label}'")
            self.generated += 1
            return True
        
        if not self.api_key:
            log.error(f"  ❌ OPENROUTER_API not configured")
            self.failed += 1
            return False
        
        for attempt in range(1, self.MAX_RETRIES + 1):
            if _global_rate_limiter:
                _global_rate_limiter.initialize_async()
                await _global_rate_limiter.acquire()
            
            if attempt > 1:
                base_delay = 5 * (2 ** (attempt - 2))
                jitter = random.uniform(0, base_delay * 0.3)
                delay = base_delay + jitter
                log.info(f"  ⏳ Retry {attempt-1}/{self.MAX_RETRIES-1} after {delay:.1f}s...")
                await asyncio.sleep(delay)
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://gridpunk-arcana.com",
                "X-Title": "Gridpunk Arcana"
            }
            
            payload = {
                "model": self.openrouter_model,
                "prompt": prompt,
                "width": self.width,
                "height": self.height,
            }
            
            try:
                async with session.post(self.API_BASE, json=payload, headers=headers, timeout=aiohttp.ClientTimeout(total=120)) as response:
                    if response.status == 200:
                        data = await response.json()
                        img_url = data.get("data", [{}])[0].get("url")
                        
                        if img_url:
                            async with session.get(img_url) as img_response:
                                if img_response.status == 200:
                                    output_path.parent.mkdir(parents=True, exist_ok=True)
                                    with open(output_path, "wb") as f:
                                        f.write(await img_response.read())
                                    log.info(f"  ✅ Saved '{label}' → {output_path.name}")
                                    self.generated += 1
                                    return True
                        
                        log.warning(f"  ⚠️  No image URL from OpenRouter for '{label}'")
                        self.failed += 1
                        return False
                    
                    elif response.status in (429, 500, 502, 503, 530):
                        log.warning(f"  ⚠️  API {response.status} for '{label}' (attempt {attempt}/{self.MAX_RETRIES})")
                    else:
                        log.error(f"  ❌ Failed '{label}': HTTP {response.status}")
                        self.failed += 1
                        return False
            
            except Exception as e:
                log.warning(f"  ❌ Error for '{label}': {e}")
                if attempt >= self.MAX_RETRIES:
                    self.failed += 1
                    return False
        
        log.error(f"  ❌ Exhausted retries for '{label}'")
        self.failed += 1
        return False
    
    def generate(self, prompt: str, output_path: Path, label: str = "") -> bool | str:
        if output_path.exists():
            self.skipped += 1
            return True
        if self.dry_run:
            self.generated += 1
            return True
        log.error("  ❌ Use async mode for OpenRouter")
        self.failed += 1
        return False



# ---------------------------------------------------------------------------
# HuggingFaceGenerator
# ---------------------------------------------------------------------------
class HuggingFaceGenerator(ImageProvider):
    """Image generation via Hugging Face Inference API."""
    
    API_URL = "https://api-inference.huggingface.co/models/"
    MAX_RETRIES = 5
    
    def __init__(self, model: str = "black-forest-labs/FLUX.1-schnell", width: int = 512, height: int = 768, seed: int = 42, dry_run: bool = False, api_key: str = None):
        super().__init__(model, width, height, seed, dry_run)
        self.api_key = api_key or os.getenv("HUGGINGFACE_API_KEY")
        if not self.api_key:
            log.warning("⚠️  HUGGINGFACE_API_KEY not set. Images may fail if model is gated.")

    async def generate_async(self, prompt: str, output_path: Path, label: str = "", session=None, worker_id: int = None, force_model: str = None) -> bool | str:
        if output_path.exists():
            log.info(f"  ⏭  Skipping '{label}' — already exists at {output_path.name}")
            self.skipped += 1
            return True
        
        if self.dry_run:
            log.info(f"  🔍 [DRY-RUN] [HF] '{label}'")
            self.generated += 1
            return True

        model_id = force_model or self.model
        url = f"{self.API_URL}{model_id}"
        
        headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
        payload = {
            "inputs": prompt,
            "parameters": {
                "width": self.width,
                "height": self.height,
                "seed": self.seed,
            }
        }

        for attempt in range(1, self.MAX_RETRIES + 1):
            if _global_rate_limiter:
                await _global_rate_limiter.acquire()

            try:
                async with session.post(url, json=payload, headers=headers, timeout=120) as resp:
                    if resp.status == 200:
                        image_data = await resp.read()
                        output_path.parent.mkdir(parents=True, exist_ok=True)
                        with open(output_path, "wb") as f:
                            f.write(image_data)
                        log.info(f"  ✅ [HF] Saved '{label}' -> {output_path.name}")
                        self.generated += 1
                        return True
                    elif resp.status == 503: # Loading
                        try:
                            data = await resp.json()
                            wait_time = data.get("estimated_time", 10)
                        except:
                            wait_time = 10
                        log.info(f"  ⏳ [HF] Model loading, waiting {wait_time:.1f}s...")
                        await asyncio.sleep(min(wait_time, 20))
                    elif resp.status == 429: # Rate limit
                        log.warning(f"  ⚠️  [HF] Rate limit exceeded (attempt {attempt})")
                        await asyncio.sleep(10 * attempt)
                    else:
                        log.warning(f"  ❌ [HF] Error {resp.status} for '{label}'")
                        if attempt == self.MAX_RETRIES:
                            self.failed += 1
                            return False
            except Exception as e:
                log.warning(f"  ❌ [HF] Request error: {e}")
                if attempt == self.MAX_RETRIES:
                    self.failed += 1
                    return False
        
        return False

    def generate(self, prompt: str, output_path: Path, label: str = "") -> bool | str:
        log.error("  ❌ [HF] Use async mode for Hugging Face")
        return False


# ---------------------------------------------------------------------------
# FreepikGenerator
# ---------------------------------------------------------------------------
class FreepikGenerator(ImageProvider):
    """Image generation via Freepik Mystic API."""
    
    API_URL = "https://api.freepik.com/v1/ai/text-to-image"
    
    def __init__(self, model: str = "mystic", width: int = 512, height: int = 768, seed: int = 42, dry_run: bool = False, api_key: str = None):
        super().__init__(model, width, height, seed, dry_run)
        self.api_key = api_key or os.getenv("FREEPIK_API_KEY")

    async def generate_async(self, prompt: str, output_path: Path, label: str = "", session=None, worker_id: int = None, force_model: str = None) -> bool | str:
        if output_path.exists():
            log.info(f"  ⏭  Skipping '{label}' — already exists at {output_path.name}")
            self.skipped += 1
            return True
        
        if self.dry_run:
            log.info(f"  🔍 [DRY-RUN] [Freepik] '{label}'")
            self.generated += 1
            return True

        if not self.api_key:
            log.error("  ❌ [Freepik] FREEPIK_API_KEY not set")
            return False

        headers = {
            "x-freepik-api-key": self.api_key,
            "Content-Type": "application/json"
        }
        
        payload = {
            "prompt": prompt,
            "model": self.model,
            "width": self.width,
            "height": self.height,
            "seed": self.seed,
        }

        try:
            async with session.post(self.API_URL, json=payload, headers=headers) as resp:
                if resp.status == 200:
                    data = await resp.json()
                    images = data.get("data", [])
                    if images and "url" in images[0]:
                        img_url = images[0]["url"]
                        async with session.get(img_url) as img_resp:
                            if img_resp.status == 200:
                                output_path.parent.mkdir(parents=True, exist_ok=True)
                                with open(output_path, "wb") as f:
                                    f.write(await img_resp.read())
                                log.info(f"  ✅ [Freepik] Saved '{label}' -> {output_path.name}")
                                self.generated += 1
                                return True
                log.warning(f"  ❌ [Freepik] Error {resp.status} for '{label}'")
                return False
        except Exception as e:
            log.warning(f"  ❌ [Freepik] Request error: {e}")
            return False

    def generate(self, prompt: str, output_path: Path, label: str = "") -> bool | str:
        log.error("  ❌ [Freepik] Use async mode for Freepik")
        return False


# ---------------------------------------------------------------------------
# FailoverImageProvider
# ---------------------------------------------------------------------------
class FailoverImageProvider(ImageProvider):
    """A composite provider that chains multiple generators with failover logic."""
    
    def __init__(self, providers: list[ImageProvider], dry_run: bool = False):
        super().__init__("failover", dry_run=dry_run)
        self.providers = providers
        
    async def generate_async(self, prompt: str, output_path: Path, label: str = "", session=None, worker_id: int = None, force_model: str = None) -> bool | str:
        for i, provider in enumerate(self.providers):
            log.info(f"  🔗 [Failover] Attempting with {provider.__class__.__name__} ({i+1}/{len(self.providers)})")
            
            provider.dry_run = self.dry_run
            
            result = await provider.generate_async(prompt, output_path, label, session, worker_id, force_model)
            
            if result is True:
                self.generated += 1
                return True
            elif result == "BAD_PROMPT":
                log.warning(f"  🚫 [Failover] {provider.__class__.__name__} rejected prompt for '{label}'")
                continue
            else:
                log.warning(f"  ⚠️  [Failover] {provider.__class__.__name__} failed for '{label}'")
        
        log.error(f"  💀 [Failover] All providers failed for '{label}'")
        self.failed += 1
        return False

    def print_summary(self, total: int):
        super().print_summary(total)
        log.info("  Provider Breakdowns:")
        for p in self.providers:
            log.info(f"    - {p.__class__.__name__}: {p.generated} gen, {p.failed} fail")


class ImageGenerator(ImageProvider):
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

    API_BASE = "https://image.pollinations.ai/prompt"
    MAX_RETRIES = 5
    RATE_LIMIT_DELAY = 3.0  # seconds between requests
    MIN_REQUEST_INTERVAL = 7.0  # Minimum seconds between ANY requests globally (conservative for overloaded APIs)

    def __init__(
        self,
        model: str = "flux",
        width: int = 512,
        height: int = 768,
        seed: int = 42,
        dry_run: bool = False,
        api_key: str | list[str] | None = None,
    ):
        """
        Configure the image generator.

        Args:
            model:   Pollinations model slug.
            width:   Output image width.
            height:  Output image height.
            seed:    Deterministic seed.
            dry_run: Skip API calls, only log prompts.
            api_key: Optional API bearer token (or list of tokens).
        """
        super().__init__(model, width, height, seed, dry_run)
        
        # Normalize api_key to a list
        if isinstance(api_key, str):
            self.api_keys = [k.strip() for k in api_key.split(",") if k.strip()]
        elif isinstance(api_key, list):
            self.api_keys = [k for k in api_key if k]
        else:
            self.api_keys = []
            
        self._key_cycle = 0
        self._key_lock = asyncio.Lock() if ASYNC_AVAILABLE else None
        
        # Initialize global rate limiter (shared across all instances)
        global _global_rate_limiter
        if _global_rate_limiter is None and ASYNC_AVAILABLE:
            _global_rate_limiter = GlobalRateLimiter(min_interval=self.MIN_REQUEST_INTERVAL)



    def get_key_for_worker(self, worker_id: int) -> str | None:
        """
        Get the specific key assigned to this worker index.
        This ensures Worker 1 ALWAYS uses Key 1, Worker 2 ALWAYS uses Key 2, etc.
        It does NOT rotate per request.
        """
        if not self.api_keys:
            return None
        # Use modulo to assign keys round-robin to workers if we have fewer keys than workers
        return self.api_keys[worker_id % len(self.api_keys)]

    def _get_next_key(self) -> str | None:
        """Get the next API key in rotation (legacy/single-threaded usage)."""
        if not self.api_keys:
            return None
            
        # Simple round-robin without lock for sync usage is fine,
        # but for async we might have race conditions on _key_cycle.
        # Given it's just an integer increment, the impact is minimal (skipping a key in rotation order),
        # so strict locking isn't critical for correctness, just for perfect distribution.
        
        idx = self._key_cycle % len(self.api_keys)
        self._key_cycle += 1
        return self.api_keys[idx]

    async def generate_async(self, prompt: str, output_path: Path, label: str = "", session: 'aiohttp.ClientSession' = None, worker_id: int = None, force_model: str = None) -> bool | str:
        """
        Async version of generate() for parallel processing.

        Args:
            prompt:      The full text prompt.
            output_path: Where to save the resulting PNG.
            label:       Human-readable label for logging.
            session:     Shared aiohttp ClientSession.
            worker_id:   Optional ID of the worker processing this request, for sticky key assignment.
            force_model: Optional override model (e.g. 'flux') to try if primary fails.

        Returns:
            True if successful, False on failure, "BAD_PROMPT" if rejected.
        """
        if not ASYNC_AVAILABLE:
            return self.generate(prompt, output_path, label)

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

        # Determine effective model
        current_model = force_model if force_model else self.model

        # Build API URL
        # We use POST now to avoid URL length limits with long prompts
        # The prompt will be sent in the body, so the URL is just the base
        url = f"{self.API_BASE}" 

        # Retry loop with exponential backoff plus jitter
        for attempt in range(1, self.MAX_RETRIES + 1):
            # ALWAYS use global rate limiter to space out ALL requests
            if _global_rate_limiter:
                _global_rate_limiter.initialize_async()  # Ensure initialized
                await _global_rate_limiter.acquire()
            
            if attempt > 1:
                # Additional exponential backoff for retries
                base_delay = 5 * (2 ** (attempt - 2))  # 5, 10, 20, 40 seconds
                jitter = random.uniform(0, base_delay * 0.3)  # 0-30% jitter
                delay = base_delay + jitter
                log.info(f"  ⏳ Retry {attempt-1}/{self.MAX_RETRIES-1} after {delay:.1f}s...")
                await asyncio.sleep(delay)

            # Determine key strategy: sticky per worker OR rotation
            if worker_id is not None:
                current_key = self.get_key_for_worker(worker_id)
            else:
                current_key = self._get_next_key()
                
            headers = {"Content-Type": "application/json"}
            if current_key:
                headers["Authorization"] = f"Bearer {current_key}"

            # Prepare POST body
            payload = {
                "prompt": prompt,
                "width": self.width,
                "height": self.height,
                "model": current_model,
                "seed": self.seed
            }

            try:
                log.debug(f"  📡 Async API request attempt {attempt}/{self.MAX_RETRIES}")
                async with session.post(url, json=payload, headers=headers, timeout=aiohttp.ClientTimeout(total=120)) as response:
                    if response.status == 200:
                        output_path.parent.mkdir(parents=True, exist_ok=True)
                        content = await response.read()
                        with open(output_path, "wb") as f:
                            f.write(content)

                        # Validate image dimensions
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
                        return True

                    elif response.status == 400:
                        # Specific handling for 400 Bad Request to debug cause
                        try:
                            err_text = await response.text()
                            log.warning(f"  ⚠️  API 400 for '{label}': {err_text[:200]}")
                        except:
                            log.warning(f"  ⚠️  API 400 for '{label}'")
                        # Will retry with backoff on next iteration

                    elif response.status in (429, 500, 502, 503, 530):
                        log.warning(
                            f"  ⚠️  API {response.status} for '{label}' "
                            f"(attempt {attempt}/{self.MAX_RETRIES})"
                        )
                        # Will retry with exponential backoff on next iteration
                    else:
                        log.error(
                            f"  ❌ Failed '{label}': HTTP {response.status}"
                        )
                        self.failed += 1
                        return False

            except asyncio.TimeoutError:
                log.warning(
                    f"  ⏱  Timeout for '{label}' (attempt {attempt}/{self.MAX_RETRIES})"
                )
                # Will retry with exponential backoff on next iteration

            except Exception as e:
                log.warning(f"  ❌ Network error for '{label}': {e}")
                if attempt >= self.MAX_RETRIES:
                    self.failed += 1
                    return False
                # Will retry with exponential backoff on next iteration

        log.error(f"  ❌ Exhausted retries for '{label}'")
        self.failed += 1
        return False

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
        # We use POST now to avoid URL length limits with long prompts
        # The prompt will be sent in the body, so the URL is just the base
        url = f"{self.API_BASE}"

        # Retry loop with exponential backoff
        for attempt in range(1, self.MAX_RETRIES + 1):
            # Rotate key
            current_key = self._get_next_key()
            headers = {"Content-Type": "application/json"}
            if current_key:
                headers["Authorization"] = f"Bearer {current_key}"
            
            # Prepare POST body
            payload = {
                "prompt": prompt,
                "width": self.width,
                "height": self.height,
                "model": self.model,
                "seed": self.seed
            }

            try:
                log.debug(f"  📡 API request attempt {attempt}/{self.MAX_RETRIES}")
                response = requests.post(url, json=payload, headers=headers, timeout=120)

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
            "  python scripts/generate_tarot.py --batch --deck src/data/new/\n"
            "  python scripts/generate_tarot.py --parallel 5 --deck my_deck.json\n"
            "  python scripts/generate_tarot.py --batch --parallel 3 --deck src/data/new/\n"
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
        "--text-model",
        type=str,
        default=None,
        help="Text model to use for prompt rewriting (default: from .env or free tier)",
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
    parser.add_argument(
        "--batch",
        action="store_true",
        help="Process all deck JSON files in the --deck directory",
    )
    parser.add_argument(
        "--parallel",
        type=int,
        default=0,
        metavar="N",
        help="Enable parallel processing with N concurrent requests (requires aiohttp)",
    )
    parser.add_argument(
        "--sequential",
        action="store_true",
        help="Use strict sequential processing (slowest but most reliable with overloaded APIs)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Regenerate even if deck appears complete (79 images incl back.png)",
    )

    return parser


# ---------------------------------------------------------------------------
# Batch Processing Utilities
# ---------------------------------------------------------------------------
def find_deck_files(directory: Path) -> list[Path]:
    """
    Find all JSON deck files in a directory.

    Args:
        directory: Directory to search.

    Returns:
        List of Path objects for JSON files.
    """
    if directory.is_file():
        return [directory]
    return sorted(directory.glob("*.json"))


def get_expected_filenames(cards: list[dict], include_back: bool = True) -> set[str]:
    """
    Build the expected output filenames for a deck.

    Args:
        cards: List of normalized card dicts.
        include_back: Whether to require back.png.

    Returns:
        Set of expected PNG filenames.
    """
    expected = {f"{card['id']}.png" for card in cards}
    if include_back:
        expected.add("back.png")
    return expected


def check_deck_completion(out_dir: Path, cards: list[dict], include_back: bool = True) -> tuple[bool, list[str]]:
    """
    Check whether a deck output directory is complete.

    Args:
        out_dir: Output directory for the deck images.
        cards: List of normalized card dicts.
        include_back: Whether to require back.png for completion (79 total).

    Returns:
        (is_complete, missing_files)
    """
    expected = get_expected_filenames(cards, include_back=include_back)
    if not out_dir.exists():
        return False, sorted(expected)

    actual = {p.name for p in out_dir.glob("*.png")}
    missing = sorted(expected - actual)
    return len(missing) == 0, missing


def validate_provider(generator: ImageProvider, provider_name: str) -> bool:
    """
    Validate provider configuration before generation.

    Args:
        generator: The image provider instance.
        provider_name: Resolved provider name.

    Returns:
        True if provider is ready, False otherwise.
    """
    if provider_name == "replicate":
        api_key = getattr(generator, "api_key", None)
        if not api_key:
            log.error("❌ Replicate selected but REPLICATE_API_KEY is missing.")
            log.error("   Set REPLICATE_API_KEY in the repo .env file and try again.")
            return False
    if provider_name == "openrouter":
        api_key = getattr(generator, "api_key", None)
        if not api_key:
            log.error("❌ OpenRouter selected but OPENROUTER_API is missing.")
            log.error("   Set OPENROUTER_API in the repo .env file and try again.")
            return False
    if provider_name == "pollinations":
        api_key = getattr(generator, "api_keys", None)
        if isinstance(api_key, list) and not api_key:
            log.warning("⚠️  Pollinations selected without IMAGE_API. Public endpoint may be rate-limited.")
    return True


async def generate_cards_parallel(
    cards: list[dict],
    builder: PromptBuilder,
    generator: ImageGenerator,
    out_dir: Path,
    concurrency: int,
    rewriter: PromptRewriter | None = None,
) -> None:
    """
    Generate card images in parallel with limited concurrency.

    Args:
        cards:       List of card dicts from TarotDeckLoader.
        builder:     PromptBuilder instance.
        generator:   ImageGenerator instance.
        out_dir:     Output directory for images.
        concurrency: Maximum concurrent requests.
        rewriter:    Optional PromptRewriter for bad-prompt recovery.
    """
    if not ASYNC_AVAILABLE:
        log.error("Parallel processing requires aiohttp. Install with: pip install aiohttp")
        return

    # Limit concurrency to avoid overwhelming API
    effective_concurrency = min(concurrency, 2)
    if effective_concurrency != concurrency:
        log.warning(f"⚠️  Limiting concurrency from {concurrency} to {effective_concurrency} to prevent API overload")
    
    semaphore = asyncio.Semaphore(effective_concurrency)
    
    # Create worker ID queue for sticky key assignment
    worker_id_queue = asyncio.Queue()
    for i in range(effective_concurrency):
        worker_id_queue.put_nowait(i)

    async def generate_with_limit(idx: int, card: dict, session: 'aiohttp.ClientSession'):
        async with semaphore:
            worker_id = await worker_id_queue.get()
            try:
                # Stagger worker startup to prevent initial thundering herd
                if idx <= effective_concurrency:
                    startup_delay = worker_id * 4.0  # 0s, 4s, 8s for workers 0,1,2
                    if startup_delay > 0:
                        log.info(f"  🕒 Worker {worker_id} startup delay: {startup_delay}s")
                        await asyncio.sleep(startup_delay)
                
                progress = f"[{idx}/{len(cards)}]"
                label = f"{card['name']} ({card['id']})"
                log.info(f"{progress} {label}")

                prompt = builder.build(card)
                file_path = out_dir / f"{card['id']}.png"

                result = await generator.generate_async(prompt, file_path, label=label, session=session, worker_id=worker_id)

                # Bad-prompt auto-retry with LLM rewriting
                if result == "BAD_PROMPT" and rewriter:
                    original_prompt = prompt
                    for rewrite_attempt in range(1, PromptRewriter.MAX_REWRITE_ATTEMPTS + 1):
                        # Add backoff between rewrite attempts
                        wait_time = 2.0 ** rewrite_attempt
                        log.info(f"  ⏳ Waiting {wait_time:.1f}s before rewrite {rewrite_attempt}...")
                        await asyncio.sleep(wait_time)
                        
                        # Run rewriter in executor to not block
                        loop = asyncio.get_running_loop()
                        current_prompt = await loop.run_in_executor(
                            None, rewriter.rewrite, original_prompt, rewrite_attempt
                        )
                        log.info(
                            f"  🔁 Retry {rewrite_attempt}/{PromptRewriter.MAX_REWRITE_ATTEMPTS} "
                            f"for '{label}' with rewritten prompt"
                        )
                        retry_result = await generator.generate_async(
                            current_prompt, file_path, label=f"{label} [rewrite {rewrite_attempt}]", session=session, worker_id=worker_id
                        )
                        if retry_result is True:
                            log.info(f"  🎉 Rewrite succeeded for '{label}' on attempt {rewrite_attempt}")
                            break
                        elif retry_result == "BAD_PROMPT":
                            log.warning(
                                f"  🚫 Rewrite {rewrite_attempt} still rejected for '{label}'"
                            )
                        else:
                            break
                    else:
                        log.error(
                            f"  ❌ All rewrite attempts exhausted for '{label}'"
                        )
            finally:
                worker_id_queue.put_nowait(worker_id)

    async with aiohttp.ClientSession() as session:
        tasks = [
            generate_with_limit(idx, card, session)
            for idx, card in enumerate(cards, start=1)
        ]
        await asyncio.gather(*tasks)


async def generate_cards_sequential_async(
    cards: list[dict],
    builder: PromptBuilder,
    generator: ImageProvider,
    out_dir: Path,
    rewriter: PromptRewriter | None = None,
    include_back: bool = False,
) -> None:
    """Generate card images sequentially using async provider."""
    if not ASYNC_AVAILABLE:
        log.error("Async sequential processing requires aiohttp. Install with: pip install aiohttp")
        return

    async with aiohttp.ClientSession() as session:
        for idx, card in enumerate(cards, start=1):
            progress = f"[{idx}/{len(cards)}]"
            label = f"{card['name']} ({card['id']})"
            log.info(f"{progress} {label}")

            prompt = builder.build(card)
            file_path = out_dir / f"{card['id']}.png"

            result = await generator.generate_async(prompt, file_path, label=label, session=session)

            if result == "BAD_PROMPT" and rewriter:
                original_prompt = prompt
                for rewrite_attempt in range(1, PromptRewriter.MAX_REWRITE_ATTEMPTS + 1):
                    wait_time = 2.0 ** rewrite_attempt
                    log.info(f"  ⏳ Waiting {wait_time:.1f}s before rewrite {rewrite_attempt}...")
                    await asyncio.sleep(wait_time)

                    loop = asyncio.get_running_loop()
                    current_prompt = await loop.run_in_executor(
                        None, rewriter.rewrite, original_prompt, rewrite_attempt
                    )

                    rewrite_label = f"{label} [rewrite {rewrite_attempt}]"
                    log.info(f"  🔁 Attempting {rewrite_label}...")

                    retry_result = await generator.generate_async(
                        current_prompt, file_path, label=rewrite_label, session=session
                    )

                    if retry_result is True:
                        log.info(f"  🎉 Rewrite {rewrite_attempt} succeeded for '{label}'")
                        break
                    elif retry_result == "BAD_PROMPT":
                        log.warning(
                            f"  🚫 Rewrite {rewrite_attempt} still rejected for '{label}'"
                        )
                    else:
                        break
                else:
                    log.error(f"  ❌ All rewrite attempts exhausted for '{label}'")

        if include_back:
            log.info(f"[{len(cards)+1}/{len(cards)+1}] Back of Card")
            back_prompt = builder.build_backofcard()
            back_path = out_dir / "back.png"
            await generator.generate_async(back_prompt, back_path, label="Back of Card", session=session)


# ---------------------------------------------------------------------------
# Main Orchestrator
# ---------------------------------------------------------------------------
def run(args: argparse.Namespace):
    """
    Main execution pipeline.

    Loads the deck, builds prompts, and generates images according
    to the CLI arguments provided. Supports batch processing and
    parallel generation.

    Args:
        args: Parsed CLI namespace.
    """
    # --- Validate parallel mode ---
    if args.parallel > 0 and not ASYNC_AVAILABLE:
        log.error("Parallel processing requires aiohttp. Install with: pip install aiohttp")
        sys.exit(1)
    
    # Sequential mode takes priority (most reliable)
    if args.sequential and args.parallel > 0:
        log.warning("⚠️  --sequential specified, disabling --parallel")
        args.parallel = 0

    # --- Batch mode: process all decks in directory ---
    if args.batch:
        deck_dir = Path(args.deck)
        if not deck_dir.is_absolute():
            deck_dir = PROJECT_ROOT / deck_dir

        if deck_dir.is_file():
            deck_dir = deck_dir.parent

        if not deck_dir.exists():
            log.error(f"❌ Deck directory not found: {deck_dir}")
            return

        deck_files = find_deck_files(deck_dir)
        if not deck_files:
            log.error(f"❌ No deck JSON files found in: {deck_dir}")
            return
        log.info(f"🎴 Batch mode: found {len(deck_files)} deck(s) in {deck_dir}")

        if args.sequential:
            log.info(f"📊 Sequential mode (most reliable, slowest)")
            for deck_idx, deck_path in enumerate(deck_files, start=1):
                log.info("="*60)
                log.info(f"DECK {deck_idx}/{len(deck_files)}: {deck_path.name}")
                log.info("="*60)
                single_args = argparse.Namespace(**vars(args))
                single_args.deck = str(deck_path)
                single_args.batch = False
                try:
                    run_single_deck(single_args)
                except Exception as e:
                    log.error(f"Failed to process {deck_path.name}: {e}")
                    continue
            log.info("="*60)
            log.info(f"✅ Batch processing complete: {len(deck_files)} deck(s)")
            log.info("="*60)
            return

        if args.parallel > 0 and ASYNC_AVAILABLE:
            log.info(f"⚡ Global Parallel mode: {args.parallel} concurrent requests across {len(deck_files)} decks")
            asyncio.run(run_batch_parallel(deck_files, args))
            return

        for deck_idx, deck_path in enumerate(deck_files, start=1):
            log.info("="*60)
            log.info(f"DECK {deck_idx}/{len(deck_files)}: {deck_path.name}")
            log.info("="*60)

            # Create a modified args object for single-deck processing
            single_args = argparse.Namespace(**vars(args))
            single_args.deck = str(deck_path)
            single_args.batch = False  # Prevent recursion

            try:
                run_single_deck(single_args)
            except Exception as e:
                log.error(f"Failed to process {deck_path.name}: {e}")
                continue

        log.info("="*60)
        log.info(f"✅ Batch processing complete: {len(deck_files)} deck(s)")
        log.info("="*60)
        return

    # --- Single deck mode ---
    run_single_deck(args)



async def run_batch_parallel(deck_files: list[Path], args: argparse.Namespace):
    """
    Process multiple decks in parallel sharing a global semaphore.
    Uses conservative concurrency settings to avoid overwhelming the API.
    """
    # Enforce conservative max concurrency to avoid 530 errors
    effective_parallel = min(args.parallel, 3)  # Max 3 concurrent to avoid overwhelming API
    if effective_parallel != args.parallel:
        log.warning(f"\u26a0\ufe0f  Limiting concurrency from {args.parallel} to {effective_parallel} to prevent API overload")
    
    # Create a single shared session and semaphore for all decks
    semaphore = asyncio.Semaphore(effective_parallel)
    
    # We need to track worker IDs to assign sticky keys.
    # A simple queue of IDs [0, 1, 2...] that workers check out and return.
    worker_id_queue = asyncio.Queue()
    for i in range(effective_parallel):
        worker_id_queue.put_nowait(i)
    
    # Create a single generator instance to share API key rotation state across all decks
    generator = create_image_generator(
        model=args.model,
        width=args.width,
        height=args.height,
        seed=args.seed,
        dry_run=args.dry_run,
    )
    
    # Pre-calculate all tasks
    tasks = []
    
    async with aiohttp.ClientSession() as session:
        for deck_path in deck_files:
            # Setup for this specific deck
            single_args = argparse.Namespace(**vars(args))
            single_args.deck = str(deck_path)
            single_args.batch = False
            
            # We need to replicate some of run_single_deck logic here but adapted for shared session/sem
            try:
                # Load deck
                loader = TarotDeckLoader(deck_path)
                builder = PromptBuilder(loader)

                # Resolve output directory
                if args.output:
                    out_dir = Path(args.output)
                else:
                    out_dir = PROJECT_ROOT / "public" / "assets" / "cards" / "tarot" / loader.deck_slug

                # Skip complete decks unless forced
                if not args.force:
                    is_complete, missing = check_deck_completion(out_dir, loader.cards, include_back=True)
                    if is_complete:
                        log.info(f"✅ Deck already complete (79 images incl back.png): {loader.deck_name}. Skipping.")
                        continue
                    if missing:
                        log.info(f"📌 Deck incomplete ({loader.deck_name}): missing {len(missing)} file(s).")
                
                # Output dir
                if args.output:
                    out_dir = Path(args.output)
                else:
                    out_dir = PROJECT_ROOT / "public" / "assets" / "cards" / "tarot" / loader.deck_slug
                out_dir.mkdir(parents=True, exist_ok=True)

                # Check if deck is already complete (skip if file count matches expected)
                # Only apply this optimization if we are generating the full deck (no specific card requested)
                if not args.card:
                    expected_count = len(loader.cards) + (1 if args.backofcard else 0)
                    existing_count = len(list(out_dir.glob("*.png")))
                    
                    # If we have at least the expected number of images (78 or 79), skip entirely
                    if existing_count >= expected_count:
                        log.info(f"⏭  Skipping deck '{loader.deck_name}' — found {existing_count} images (expected {expected_count}).")
                        continue
                
                # Generator
                # We use the shared generator instance created outside the loop
                
                # Determine cards to generate
                if args.card:
                    cards = [c for c in loader.cards if c["id"] == args.card]
                    # If specific card requested, don't skip entire deck based on count
                else:
                    cards = loader.cards
                    
                rewriter = None if args.no_rewrite else PromptRewriter(model=args.text_model)
                
                # Create tasks for this deck's cards
                for idx, card in enumerate(cards, start=1):
                    tasks.append(
                        generate_card_task(
                            card, builder, generator, out_dir, semaphore, session, rewriter, worker_id_queue, 
                            deck_name=loader.deck_name, task_index=len(tasks), total_workers=effective_parallel
                        )
                    )
                    
                # Back of card
                if args.backofcard:
                    back_prompt = builder.build_backofcard()
                    back_path = out_dir / "back.png"
                    tasks.append(
                        generate_single_image_task(
                            back_prompt, back_path, "Back of Card", generator, semaphore, session, worker_id_queue, deck_name=loader.deck_name
                        )
                    )
                    
            except Exception as e:
                log.error(f"Failed to prepare deck {deck_path.name}: {e}")
                continue

        log.info(f"🚀 Launching {len(tasks)} generation tasks across {len(deck_files)} decks...")
        await asyncio.gather(*tasks)
        
    generator.print_summary(len(tasks))


async def generate_card_task(
    card: dict, 
    builder: PromptBuilder, 
    generator: ImageGenerator, 
    out_dir: Path, 
    semaphore: asyncio.Semaphore, 
    session: aiohttp.ClientSession,
    rewriter: PromptRewriter | None,
    worker_queue: asyncio.Queue,
    deck_name: str = "",
    task_index: int = 0,
    total_workers: int = 3
):
    # Acquire semaphore (limit parallelism)
    async with semaphore:
        # Acquire a worker ID (0..N) to get a sticky key
        worker_id = await worker_queue.get()
        try:
            # Stagger initial worker startup to prevent thundering herd
            if task_index < total_workers:
                startup_delay = worker_id * 4.0
                if startup_delay > 0:
                    log.info(f"  🕒 Worker {worker_id} startup delay: {startup_delay:.1f}s")
                    await asyncio.sleep(startup_delay)
            
            label = f"[{deck_name}] {card['name']}"
            prompt = builder.build(card)
            file_path = out_dir / f"{card['id']}.png"
            
            try:
                result = await generator.generate_async(prompt, file_path, label=label, session=session, worker_id=worker_id)

                # Bad-prompt auto-retry (Sequential with backoff)
                if result == "BAD_PROMPT" and rewriter:
                    log.info(f"  ⚠️  '{label}' triggered safety filter. Starting sequential rewrite attempts...")
                    
                    original_prompt = prompt
                    for rewrite_attempt in range(1, PromptRewriter.MAX_REWRITE_ATTEMPTS + 1):
                        # Exponential backoff before starting next attempt
                        wait_time = 2.0 ** rewrite_attempt
                        log.info(f"  ⏳ Waiting {wait_time:.1f}s before rewrite {rewrite_attempt}...")
                        await asyncio.sleep(wait_time)

                        # Generate rewrite (text API)
                        loop = asyncio.get_running_loop()
                        current_prompt = await loop.run_in_executor(
                            None, rewriter.rewrite, original_prompt, rewrite_attempt
                        )
                        
                        # Try generation (image API)
                        rewrite_label = f"{label} [rewrite {rewrite_attempt}]"
                        log.info(f"  🔁 Attempting {rewrite_label}...")
                        
                        # On the final attempts, try forcing 'flux' or 'turbo' model which might be more lenient
                        force_model = None
                        if rewrite_attempt == 3:
                            force_model = "flux"
                            log.info(f"  ☢️  Using fallback model 'flux' for {rewrite_label}")
                        elif rewrite_attempt >= 4:
                            force_model = "turbo" # Even simpler/faster model often has fewer filters
                            log.info(f"  ☢️  Using fallback model 'turbo' for {rewrite_label}")

                        retry_result = await generator.generate_async(
                            current_prompt, file_path, label=rewrite_label, session=session, worker_id=worker_id, force_model=force_model
                        )
                        
                        if retry_result is True:
                            log.info(f"  🎉 Rewrite {rewrite_attempt} succeeded for '{label}'")
                            break
                        elif retry_result != "BAD_PROMPT":
                            # If it failed for network reasons (not safety), we might want to stop or continue?
                            pass 
                    else:
                        log.error(f"  ❌ All rewrite attempts exhausted for '{label}'")

            except Exception as e:
                log.error(f"Error generating {label}: {e}")
        finally:
            # Always return the worker ID to the pool
            worker_queue.put_nowait(worker_id)

async def generate_single_image_task(
    prompt: str,
    path: Path,
    label: str,
    generator: ImageGenerator,
    semaphore: asyncio.Semaphore,
    session: aiohttp.ClientSession,
    worker_queue: asyncio.Queue,
    deck_name: str = ""
):
    async with semaphore:
        worker_id = await worker_queue.get()
        try:
            full_label = f"[{deck_name}] {label}"
            try:
                # Add basic retry logic with model fallback for single images too (like back of card)
                result = await generator.generate_async(prompt, path, label=full_label, session=session, worker_id=worker_id)
                
                if result == "BAD_PROMPT":
                    log.info(f"  ⚠️  '{full_label}' triggered safety filter. Retrying with fallback model...")
                    await asyncio.sleep(2.0)
                    # Try once with flux as fallback for single images
                    await generator.generate_async(prompt, path, label=full_label + " [fallback]", session=session, worker_id=worker_id, force_model="flux")
                    
            except Exception as e:
                log.error(f"Error generating {full_label}: {e}")
        finally:
            worker_queue.put_nowait(worker_id)


def run_single_deck(args: argparse.Namespace):
    """
    Process a single deck (called by run() for each deck).

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

    # --- Provider/model highlight ---
    provider_name = resolve_provider_name()
    log.info(f"🔧 Image provider: {provider_name}")
    log.info(f"🎯 Image model   : {args.model}")

    # --- Completion check (79 images incl back.png) ---
    if not args.force:
        is_complete, missing = check_deck_completion(out_dir, loader.cards, include_back=True)
        if is_complete:
            log.info("✅ Deck already complete (79 images incl back.png). Skipping regeneration.")
            return
        if missing:
            log.info(f"📌 Deck incomplete: missing {len(missing)} file(s).")

    # --- Create generator ---
    generator = create_image_generator(
        model=args.model,
        width=args.width,
        height=args.height,
        seed=args.seed,
        dry_run=args.dry_run,
    )

    if not validate_provider(generator, provider_name):
        return

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
    rewriter = None if args.no_rewrite else PromptRewriter(model=args.text_model)

    # --- Generate card images ---
    if args.parallel > 0 and ASYNC_AVAILABLE:
        log.info(f"⚡ Parallel mode: {args.parallel} concurrent requests")
        asyncio.run(
            generate_cards_parallel(
                cards, builder, generator, out_dir, args.parallel, rewriter
            )
        )
    elif args.sequential or provider_name in ("openrouter", "replicate"):
        log.info("📊 Sequential async mode")
        asyncio.run(
            generate_cards_sequential_async(
                cards, builder, generator, out_dir, rewriter, include_back=args.backofcard
            )
        )
    else:
        # Sequential generation (original behavior)
        for idx, card in enumerate(cards, start=1):
            progress = f"[{idx}/{len(cards)}]"
            label = f"{card['name']} ({card['id']})"
            log.info(f"{progress} {label}")

            prompt = builder.build(card)
            file_path = out_dir / f"{card['id']}.png"

            result = generator.generate(prompt, file_path, label=label)

            # --- Bad-prompt auto-retry with LLM rewriting ---
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
