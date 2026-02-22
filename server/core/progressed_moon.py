"""
progressed_moon.py
==================
* NOTE: Calculates the Secondary Progressed Moon position and phase.
  The Progressed Moon moves ~1° per month (12-13° per year), completing
  a full cycle in ~27.3 years. Each phase lasts ~3.5 years.

  This module determines the user's current "Life Chapter" / Hero's Arc phase
  based on their age and natal Moon position.

! IMPORTANT: This is a simplified "day-for-a-year" progression.
  For astronomical-grade accuracy, a full ephemeris lookup is needed.
"""

import swisseph as swe
from datetime import datetime
from core.logger import app_logger


# ----------------------------------------------------------------
# Progressed Moon Phase Definitions
# Each phase covers ~45° of the 360° cycle (~3.5 years)
# ----------------------------------------------------------------
MOON_PHASES = [
    {
        "name": "New Moon Phase",
        "arc": "GENESIS",
        "description": "You are planting seeds in the dark. This is a time of instinctual beginnings — trust the impulse even if you can't see the path.",
        "action": "Initiate. Dream. Set intentions in stealth mode.",
        "energy": "emergence"
    },
    {
        "name": "Crescent Phase",
        "arc": "SOWING",
        "description": "The seed has cracked open and is pushing through resistance. Old patterns fight back. This is your 'prove it' chapter.",
        "action": "Push through resistance. Build momentum against inertia.",
        "energy": "struggle"
    },
    {
        "name": "First Quarter Phase",
        "arc": "BUILDING",
        "description": "Crisis of action. You must choose a direction and commit. Half the world is illuminated — the other half demands faith.",
        "action": "Make decisive moves. Build structures. Cut what doesn't serve.",
        "energy": "action"
    },
    {
        "name": "Gibbous Phase",
        "arc": "REFINING",
        "description": "Almost full. You're analyzing, perfecting, and preparing for the spotlight. Self-improvement is the obsession.",
        "action": "Refine your craft. Seek mentors. Prepare for visibility.",
        "energy": "refinement"
    },
    {
        "name": "Full Moon Phase",
        "arc": "REAPING",
        "description": "Maximum illumination. What you planted at the New Moon phase is now fully visible. Relationships and external recognition peak.",
        "action": "Harvest results. Embrace visibility. Navigate revelations.",
        "energy": "culmination"
    },
    {
        "name": "Disseminating Phase",
        "arc": "SHARING",
        "description": "You've peaked and now you share the harvest. Teaching, mentoring, and distributing wisdom define this chapter.",
        "action": "Share knowledge. Mentor others. Distribute your gifts.",
        "energy": "distribution"
    },
    {
        "name": "Last Quarter Phase",
        "arc": "ENDING",
        "description": "Crisis of consciousness. Old systems crumble. You must release what no longer aligns with your evolved self.",
        "action": "Release attachments. Dismantle outdated structures. Forgive.",
        "energy": "release"
    },
    {
        "name": "Balsamic Phase",
        "arc": "COMPOSTING",
        "description": "The final phase before rebirth. A time of surrender, solitude, and preparing the soil for the next 27-year cycle.",
        "action": "Rest. Surrender. Distill wisdom from pain. Prepare for rebirth.",
        "energy": "dissolution"
    }
]


def calculate_progressed_moon(dob_str: str, time_str: str, lat: float, lon: float) -> dict:
    """
    Calculates the Secondary Progressed Moon position and determines
    the current Hero's Arc phase.

    The 'day-for-a-year' method: each day after birth = one year of life.
    The Moon moves ~12-13° per day, so each progressed day advances the
    Moon ~12-13° in the progressed chart (= 1 year of real life).

    Args:
        dob_str: Birth date in YYYY-MM-DD format.
        time_str: Birth time in HH:MM format.
        lat: Birth latitude.
        lon: Birth longitude.

    Returns:
        Dictionary containing progressed moon data and Hero's Arc phase.
    """
    try:
        dt_birth = datetime.strptime(f"{dob_str} {time_str}", "%Y-%m-%d %H:%M")
        now = datetime.now()

        # Calculate age in fractional years
        age_days = (now - dt_birth).days
        age_years = age_days / 365.25

        # Julian day of birth
        jd_birth = swe.julday(
            dt_birth.year, dt_birth.month, dt_birth.day,
            dt_birth.hour + dt_birth.minute / 60.0
        )

        # * NOTE: Day-for-a-year progression
        # The progressed date = birth date + (age in years) days
        jd_progressed = jd_birth + age_years

        # Get natal Moon position
        natal_moon, _ = swe.calc_ut(jd_birth, swe.MOON)
        natal_moon_degree = natal_moon[0]

        # Get progressed Moon position
        prog_moon, _ = swe.calc_ut(jd_progressed, swe.MOON)
        prog_moon_degree = prog_moon[0]

        # Calculate phase angle (progressed Moon relative to natal Moon)
        # This determines the "Hero's Arc" phase
        phase_angle = (prog_moon_degree - natal_moon_degree) % 360

        # Determine phase (8 phases, each 45°)
        phase_index = int(phase_angle / 45) % 8
        phase_data = MOON_PHASES[phase_index]

        # Calculate progress within current phase (0-100%)
        phase_progress = ((phase_angle % 45) / 45) * 100

        # Calculate the 2.5-year cycle position
        # Full cycle = ~27.3 years, each phase = ~3.4 years
        cycle_year = (phase_angle / 360) * 27.3

        return {
            "natalMoonDegree": round(natal_moon_degree, 2),
            "progressedMoonDegree": round(prog_moon_degree, 2),
            "phaseAngle": round(phase_angle, 2),
            "phaseName": phase_data["name"],
            "heroArc": phase_data["arc"],
            "phaseDescription": phase_data["description"],
            "phaseAction": phase_data["action"],
            "phaseEnergy": phase_data["energy"],
            "phaseProgress": round(phase_progress, 1),
            "cycleYear": round(cycle_year, 1),
            "ageYears": round(age_years, 1)
        }

    except Exception as e:
        app_logger.error(f"Progressed Moon calculation error: {e}")
        return {
            "natalMoonDegree": 0,
            "progressedMoonDegree": 0,
            "phaseAngle": 0,
            "phaseName": "Unknown Phase",
            "heroArc": "UNKNOWN",
            "phaseDescription": "Unable to calculate progressed moon.",
            "phaseAction": "Seek manual consultation.",
            "phaseEnergy": "neutral",
            "phaseProgress": 0,
            "cycleYear": 0,
            "ageYears": 0
        }
