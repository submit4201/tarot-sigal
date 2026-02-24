import os
import requests
from core.logger import app_logger

# Removed global API key to ensure runtime fetching

# ----------------------------------------------------------------
# Solfeggio Frequency Mapping (Life Path -> Hz)
# Used for Audio Resonance integration on the frontend
# ----------------------------------------------------------------
SOLFEGGIO_MAP = {
    1: 174, 2: 285, 3: 396, 4: 417, 5: 528,
    6: 639, 7: 741, 8: 852, 9: 963,
    11: 528, 22: 432, 33: 963
}

SYSTEM_PROMPT = """
You are a MASTER SYNTHESIST of Western and Eastern Esotericism, operating as a high-level 
mentor intelligence. Your goal is to write a LIFE NARRATIVE that feels like a private session 
with a world-class mystical advisor who also speaks the language of modern strategy and 
biohacking.

RULES:
- Write in 2nd person (You/Your). Be DIRECT, zero-BS, encouraging, and visionary.
- Focus on INTERSECTIONS: "As a Life Path 7 with a Wood Dragon BaZi, your logic is sharp, 
  but your roots are ancient."
- Each section must contain SPECIFIC, ACTIONABLE insights. No generic fluff.
- Reference the Sabian Symbols by name when relevant — they are poetic keys to the user's 
  degrees.
- Reference the Decan-Tarot card to add archetypal depth.
- NEVER pad your response. Every sentence must add value.

STRUCTURE YOUR RESPONSE EXACTLY AS FOLLOWS:

### [ARCHETYPE_DESIGNATION]
A 3-word UPPERCASE title that captures their core essence. This is their "cosmic codename."
Example formats: THE RADIANT ARCHITECT, NEURAL VOYAGER PRIME, THE SOVEREIGN ALCHEMIST.
Write ONLY the title — no explanation.

### [CORE_SYNTHESIS]
(3-4 paragraphs) The user's "Core Operating System." Synthesize:
- **The Big Three**: Sun (Identity), Moon (Emotion), Ascendant (Mask).
- **Planetary Distribution**: Briefly mention the presence of outer planets (Uranus, Neptune, Pluto) if they form powerful aspects.
- **Dynamic Aspects**: Analyze Conjunctions, Squares, and Trines as internal gears.
- **Tarot/Sabian Overlays**: Use the Sun's Sabian Symbol and Decan card as the primary archetypal lens.
This section should feel like we are peeling back the layers of their soul.

### [CROSS_SYSTEM_HARMONICS]
(2 paragraphs) Analyze the resonance between disparate systems:
- How does their **Life Path** energy support or conflict with their **Human Design Type**?
- How does their **Day Master** element (BaZi) interact with their **Sun Sign** element?
- Example: "A Life Path 1 (Leadership) with a Projector aura (Waiting for the Invitation) creates a unique tension where leadership must be invited, not forced."

### [THE_NEURAL_BLUEPRINT]
(2 paragraphs) Practical application. Combine:
- **10th House (Career)** + **Destiny Number** + **Human Design Authority**.
- How should they navigate the world to achieve maximum alignment?
- Provide a specific "Protocol for High Alignment."
- BaZi Day Master element (what grounds their instincts).
Give 2-3 concrete decision-making strategies they can use TODAY.

### [THE_PROSPERITY_MAP]
(Bullet points + 1 paragraph) Where abundance lives for them. Combine:
- 2nd House (personal resources) and 10th House (career zenith) placements.
- BaZi Wealth Element (the element that produces wealth for their Day Master).
- Astrocartography: mention the Sun/Venus/Jupiter "power lines" concept.
Include 2-3 actionable prosperity triggers: cities, industries, timing.

### [BIO_RESONANCE_PROTOCOLS]
(Bullet points) Body-mind optimization. Use "The Healer's Lens":
- 6th House sign for health tendencies.
- Mars/Saturn aspects (if inferrable) for physical vulnerabilities.
- Celtic Tree archetype for herbal/nature-based recommendations.
- Solfeggio frequency for their Life Path (provided in data).
Frame as "system maintenance" or "hardware optimization." 3-5 concrete protocols.

### [ANCESTRAL_ENCRYPTION]
(1-2 paragraphs) The "tough love" section. Combine:
- Saturn Sign (karmic lessons inherited from family lineage).
- Karmic Debt numbers (if any) as specific "bugs in the legacy code."
- Celtic Tree archetype's shadow side.
What patterns must they break? What family cycles are they here to end?

### [THE_HEROS_ARC]
(1-2 paragraphs) Their CURRENT life chapter. Use:
- Progressed Moon Phase name and description.
- The Hero's Arc designation (GENESIS, SOWING, BUILDING, etc.).
- Phase progress percentage.
Tell them exactly where they are in their ~27-year cycle. What to expect in the next 2-3 years.
Are they sowing, reaping, or composting? Make this feel like GPS for their soul.

### [THE_GENE_KEY_TRANSMISSION]
(1 paragraph) A brief, poetic "download" based on their Primary Gene Key.
- Name the Shadow, Gift, and Siddhi frequencies.
- Write it as if transmitting a frequency upgrade.
"""

TEASER_PROMPT = """
Write a 2-paragraph "Aura Preview" for a non-premium user based on their Big Three signs.
First paragraph: A vivid, poetic description of their energetic signature.
Second paragraph: Mention ONE specific Gift they possess and tease that the full profile 
contains their Decision Engine, Prosperity Map, Hero's Arc, and 5 other deep modules.
Make them NEED the full profile. Tone: Mysterious, premium, irresistible.
"""


def build_structured_prompt(aggregated_data: dict) -> str:
    """
    Builds a structured, information-dense prompt from all engine outputs.
    This gives the LLM maximum context for a premium synthesis.

    Args:
        aggregated_data: Combined output from all calculation engines.

    Returns:
        Formatted prompt string.
    """
    num = aggregated_data.get("numerology", {})
    astro = aggregated_data.get("astrology", {})
    eastern = aggregated_data.get("eastern", {})
    hd = aggregated_data.get("humanDesign", {})
    prog = aggregated_data.get("progressedMoon", {})

    # * NOTE: Solfeggio frequency for this Life Path
    lp = num.get("lifePath", 5)
    solfeggio_hz = SOLFEGGIO_MAP.get(lp, 432)

    planets = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "ascendant"]
    planet_lines = []
    for p in planets:
        p_data = astro.get(p, {})
        if p_data:
            line = f"{p.capitalize()}: {p_data.get('sign', '?')} at {p_data.get('degreeInSign', '?')}° | Sabian: \"{p_data.get('sabian', '?')}\" | Tarot: {p_data.get('decanTarot', '?')}"
            planet_lines.append(line)
    
    planets_str = "\n".join(planet_lines)
    
    aspects = astro.get("aspects", [])
    aspect_lines = [f"{a['p1']} {a['aspect']} {a['p2']} (Orb: {a['orb']}°)" for a in aspects]
    aspects_str = "\n".join(aspect_lines) if aspect_lines else "None detected."

    hd_data = aggregated_data.get("humanDesign", {})
    bazi = eastern.get("baZi", {})
    gene_key = hd_data.get("primaryGeneKey", {})

    prompt = f"""
=== BIRTH PROFILE DATA ===

[NUMEROLOGY]
Life Path: {lp}
Soul Urge: {num.get('soulUrge', '?')}
Personality: {num.get('personality', '?')}
Destiny: {num.get('destiny', '?')}
Karmic Debts: {num.get('karmicDebts', 'None')}
Solfeggio Resonance: {solfeggio_hz}Hz

[ASTROLOGY - PLANETARY PLACEMENTS]
{planets_str}

[DYNAMIC ASPECTS]
{aspects_str}

[KEY HOUSES]
2nd House (Resources): {astro.get('secondHouse', '?')}°
6th House (Health): {astro.get('sixthHouse', '?')}°
10th House (Career): {astro.get('tenthHouse', '?')}°

[EASTERN / BAZI]
Day Master Element: {bazi.get('dayMaster', '?')}
Celtic Tree: {eastern.get('celticTree', '?')}

[HUMAN DESIGN]
Type: {hd_data.get('type', '?')}
Authority: {hd_data.get('authority', '?')}
Profile: {hd_data.get('profile', '?')}
Primary Gene Key: {gene_key.get('key', '?')} (Shadow → Gift → Siddhi)

[PROGRESSED MOON / HERO'S ARC]
Current Phase: {prog.get('phaseName', '?')}
Hero's Arc: {prog.get('heroArc', '?')}
Phase Progress: {prog.get('phaseProgress', '?')}%
Cycle Year: {prog.get('cycleYear', '?')} of 27.3
Age: {prog.get('ageYears', '?')} years
"""
    return prompt


def call_llm(prompt, system=SYSTEM_PROMPT):
    """
    Calls the LLM via OpenRouter API.

    Args:
        prompt: The user data prompt.
        system: The system prompt defining output structure.

    Returns:
        LLM response text.
    """
    api_key = os.getenv("OPENROUTER_API", "").strip()
    if not api_key:
        app_logger.error("Synthesis LLM call failed: OPENROUTER_API key missing.")
        return "Synthesis unavailable (API config missing)."
    
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # * NOTE: We use a retry loop across several free models for robustness.
    # Some models 404 on 'system' roles or specific headers, so we keep it minimal.
    models = [
        "arcee-ai/trinity-large-preview:free",
        "nvidia/nemotron-3-nano-30b-a3b:free",
        "stepfun/step-3.5-flash:free"
    ]
    
    last_error = ""
    merged_prompt = f"{system}\n\nUSER DATA:\n{prompt}"
    for model_id in models:
        payload = {
            "model": model_id,
            "messages": [{"role": "user", "content": merged_prompt}],
            "temperature": 0.8
        }
        
        app_logger.info(f"Synthesis Attempt: {model_id}")
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            last_error = str(e)
            error_msg = f"Synthesis attempt failed for {model_id}: {e}"
            if hasattr(e, 'response') and e.response is not None:
                error_msg += f" | Body: {e.response.text}"
            app_logger.warning(error_msg)
            continue
            
    return f"The cosmic strings are tangled. All models failed. (Last Error: {last_error})"

def generate_full_profile(aggregated_data):
    """
    Generates the complete premium profile narrative.

    Args:
        aggregated_data: Combined JSON from all engines.

    Returns:
        Full LLM narrative string.
    """
    prompt = build_structured_prompt(aggregated_data)
    narrative = call_llm(prompt)
    return narrative

def generate_teaser_profile(aggregated_data):
    """
    Generate only the 'aura preview' for non-premium users.

    Args:
        aggregated_data: Combined JSON from all engines.

    Returns:
        Teaser dictionary with Big Three and preview text.
    """
    big_three = {
        "sun": aggregated_data["astrology"]["sun"]["sign"],
        "moon": aggregated_data["astrology"]["moon"]["sign"],
        "ascendant": aggregated_data["astrology"]["ascendant"]["sign"]
    }
    # * NOTE: Give the teaser LLM a taste of the data to make the preview more specific
    prompt = f"Signs: {str(big_three)}. Life Path: {aggregated_data['numerology']['lifePath']}."
    preview = call_llm(prompt, system=TEASER_PROMPT)
    
    return {
        "sunSign": big_three["sun"],
        "moonSign": big_three["moon"],
        "ascendantSign": big_three["ascendant"],
        "auraPreview": preview,
        "isPremiumLocked": True
    }
