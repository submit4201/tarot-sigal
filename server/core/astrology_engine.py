import swisseph as swe
from datetime import datetime
import math
from core.sabian_symbols import get_sabian_symbol, get_decan_tarot

def get_zodiac_sign(degree):
    """
    Returns the sign index (0-11) and name for a given degree (0-359).
    """
    signs = [
        "Aries", "Taurus", "Gemini", "Cancer",
        "Leo", "Virgo", "Libra", "Scorpio",
        "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    idx = int(degree / 30)
    return signs[idx], idx

def get_degree_in_sign(degree):
    """
    Returns the degree within the current sign (0-29).
    """
    return round(degree % 30, 2)

def calculate_astrology(dob_str, time_str, lat, lon):
    """
    Calculates the Big Three (Sun, Moon, Ascendant) with Sabian Symbols
    and Decan-Tarot cards, plus Houses.

    Args:
        dob_str: YYYY-MM-DD
        time_str: HH:MM
        lat: float
        lon: float
    """
    # Parse date and time
    dt = datetime.strptime(f"{dob_str} {time_str}", "%Y-%m-%d %H:%M")
    
    # Calculate Julian Day
    jd = swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute / 60.0)
    
    # Get Sun position
    sun_res, _ = swe.calc_ut(jd, swe.SUN)
    sun_degree = sun_res[0]
    sun_sign, _ = get_zodiac_sign(sun_degree)
    
    # Get Moon position
    moon_res, _ = swe.calc_ut(jd, swe.MOON)
    moon_degree = moon_res[0]
    moon_sign, _ = get_zodiac_sign(moon_degree)
    
    # Get Ascendant and Houses (Placidus system)
    houses, ascmc = swe.houses(jd, lat, lon, b'P')
    ascendant_degree = ascmc[0]
    ascendant_sign, _ = get_zodiac_sign(ascendant_degree)

    # * NOTE: Build rich planetary data with Sabian Symbols and Decan-Tarot
    return {
        "sun": {
            "sign": sun_sign, 
            "degree": sun_degree,
            "degreeInSign": get_degree_in_sign(sun_degree),
            "sabian": get_sabian_symbol(sun_degree),
            "decanTarot": get_decan_tarot(sun_degree)
        },
        "moon": {
            "sign": moon_sign, 
            "degree": moon_degree,
            "degreeInSign": get_degree_in_sign(moon_degree),
            "sabian": get_sabian_symbol(moon_degree),
            "decanTarot": get_decan_tarot(moon_degree)
        },
        "ascendant": {
            "sign": ascendant_sign, 
            "degree": ascendant_degree,
            "degreeInSign": get_degree_in_sign(ascendant_degree),
            "sabian": get_sabian_symbol(ascendant_degree),
            "decanTarot": get_decan_tarot(ascendant_degree)
        },
        "houses": [float(h) for h in houses],
        "sixthHouse": float(houses[5]),  # ! For Medical Astrology / Bio-Resonance
        "secondHouse": float(houses[1]), # ! For Prosperity Map
        "tenthHouse": float(houses[9]),  # ! For Career / Prosperity Map
        "latitude": lat,
        "longitude": lon
    }
