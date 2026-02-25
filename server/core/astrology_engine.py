import swisseph as swe
from datetime import datetime
import math
from core.sabian_symbols import get_sabian_symbol, get_decan_tarot

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

def get_zodiac_sign(degree):
    """Returns (SignName, SignIndex) for a given ecliptic degree."""
    index = int(degree / 30) % 12
    return ZODIAC_SIGNS[index], index

def get_degree_in_sign(degree):
    """Returns the degree within its current 30-degree sign."""
    return round(degree % 30, 2)

def calculate_aspects(planets):
    """
    Calculates major aspects (Conjunction, Square, Trine, Opposition, Sextile)
    between personal and outer planets.
    """
    aspects = []
    planet_list = list(planets.items())
    
    # Standard major aspects and their orbs
    MAJOR_ASPECTS = [
        {"name": "Conjunction", "angle": 0, "orb": 8},
        {"name": "Opposition", "angle": 180, "orb": 8},
        {"name": "Trine", "angle": 120, "orb": 8},
        {"name": "Square", "angle": 90, "orb": 7},
        {"name": "Sextile", "angle": 60, "orb": 5},
    ]

    for i in range(len(planet_list)):
        for j in range(i + 1, len(planet_list)):
            p1_name, p1_data = planet_list[i]
            p2_name, p2_data = planet_list[j]
            
            diff = abs(p1_data["degree"] - p2_data["degree"])
            if diff > 180:
                diff = 360 - diff
                
            for asp in MAJOR_ASPECTS:
                if abs(diff - asp["angle"]) <= asp["orb"]:
                    aspects.append({
                        "p1": p1_name.capitalize(),
                        "p2": p2_name.capitalize(),
                        "aspect": asp["name"],
                        "orb": round(abs(diff - asp["angle"]), 2)
                    })
    return aspects

def calculate_astrology(dob_str, time_str, lat, lon):
    """
    Calculates planets (Sun-Pluto) with Sabian Symbols, 
    Decan-Tarot cards, Houses, and Aspects.
    """
    dt = datetime.strptime(f"{dob_str} {time_str}", "%Y-%m-%d %H:%M")
    jd = swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute / 60.0)
    
    # Planet mapping for Swiss Ephemeris
    PLANET_MAP = {
        "sun": swe.SUN,
        "moon": swe.MOON,
        "mercury": swe.MERCURY,
        "venus": swe.VENUS,
        "mars": swe.MARS,
        "jupiter": swe.JUPITER,
        "saturn": swe.SATURN,
        "uranus": swe.URANUS,
        "neptune": swe.NEPTUNE,
        "pluto": swe.PLUTO
    }

    planets_data = {}
    for name, swe_id in PLANET_MAP.items():
        res, _ = swe.calc_ut(jd, swe_id)
        deg = res[0]
        sign, _ = get_zodiac_sign(deg)
        planets_data[name] = {
            "sign": sign,
            "degree": deg,
            "degreeInSign": get_degree_in_sign(deg),
            "sabian": get_sabian_symbol(deg),
            "decanTarot": get_decan_tarot(deg)
        }

    # Get Ascendant and Houses (Placidus system)
    houses, ascmc = swe.houses(jd, lat, lon, b'P')
    ascendant_degree = ascmc[0]
    ascendant_sign, _ = get_zodiac_sign(ascendant_degree)
    
    planets_data["ascendant"] = {
        "sign": ascendant_sign,
        "degree": ascendant_degree,
        "degreeInSign": get_degree_in_sign(ascendant_degree),
        "sabian": get_sabian_symbol(ascendant_degree),
        "decanTarot": get_decan_tarot(ascendant_degree)
    }

    # Calculate aspects
    aspects = calculate_aspects(planets_data)

    return {
        **planets_data,
        "aspects": aspects,
        "houses": [float(h) for h in houses],
        "sixthHouse": float(houses[5]),
        "secondHouse": float(houses[1]),
        "tenthHouse": float(houses[9]),
        "latitude": lat,
        "longitude": lon
    }
