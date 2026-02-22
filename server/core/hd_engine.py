def get_gene_key(degree):
    """
    Maps 0-359 degrees to 1-64 Gene Keys (I Ching hexagrams).
    """
    idx = int((degree / 360) * 64)
    return idx + 1

def get_hd_type(profile_data):
    """
    Simplified HD Type calculation based on element balance or specific degree patterns.
    """
    # Placeholder logic
    types = ["Manifestor", "Generator", "Manifesting Generator", "Projector", "Reflector"]
    import random
    return random.choice(types)

def calculate_hd(astrology_data):
    """
    Calculates HD and Gene Keys from astrology degree data.
    """
    sun_degree = astrology_data["sun"]["degree"]
    moon_degree = astrology_data["moon"]["degree"]
    
    return {
        "type": get_hd_type(astrology_data),
        "authority": "Sacral", # Placeholder
        "profile": "4/6",      # Placeholder
        "primaryGeneKey": {
            "key": get_gene_key(sun_degree),
            "lines": ["Shadow", "Gift", "Siddhi"] # Conceptual
        }
    }
