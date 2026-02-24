def get_celtic_tree(dob_month, dob_day):
    """
    Celtic Tree Zodiac (13 Lunar Months)
    Simplified date-range mapping.
    """
    trees = [
        ((12, 24), (1, 20), "Birch"),
        ((1, 21), (2, 17), "Rowan"),
        ((2, 18), (3, 17), "Ash"),
        ((3, 18), (4, 14), "Alder"),
        ((4, 15), (5, 12), "Willow"),
        ((5, 13), (6, 9), "Hawthorn"),
        ((6, 10), (7, 7), "Oak"),
        ((7, 8), (8, 4), "Holly"),
        ((8, 5), (9, 1), "Hazel"),
        ((9, 2), (9, 29), "Vine"),
        ((9, 30), (10, 27), "Ivy"),
        ((10, 28), (11, 24), "Reed"),
        ((11, 25), (12, 23), "Elder")
    ]
    
    for (start_m, start_d), (end_m, end_d), name in trees:
        if (dob_month == start_m and dob_day >= start_d) or (dob_month == end_m and dob_day <= end_d):
            return name
        # Handle December-January transition
        if start_m > end_m:
            if (dob_month == start_m and dob_day >= start_d) or (dob_month == end_m and dob_day <= end_d):
                return name
    return "Birch" # Fallback

def calculate_bazi(year, month, day, hour):
    """
    BaZi (Four Pillars) simplified.
    Traditionally calculates 10 Heavenly Stems and 12 Earthly Branches.
    We return a dominant element for synthesis.
    """
    elements = ["Wood", "Fire", "Earth", "Metal", "Water"]
    # Simplified math-based stem lookup (not astronomical-grade but functional for synthesis)
    day_master_index = (year * 5 + month * 2 + day + hour) % 5
    return {
        "dayMaster": elements[day_master_index],
        "elementDist": {
            "Wood": 15 + (year % 10),
            "Fire": 15 + (month % 10),
            "Earth": 20 + (day % 10),
            "Metal": 15 + (hour % 10),
            "Water": 35 - ((year+month+day+hour) % 15)
        }
    }

def calculate_eastern(dob_str, time_str):
    import re
    match = re.search(r'(\d{4})-(\d{2})-(\d{2})', dob_str)
    year, month, day = map(int, match.groups())
    
    match_time = re.search(r'(\d{2}):(\d{2})', time_str)
    hour, minute = map(int, match_time.groups())
    
    return {
        "celticTree": get_celtic_tree(month, day),
        "baZi": calculate_bazi(year, month, day, hour)
    }
