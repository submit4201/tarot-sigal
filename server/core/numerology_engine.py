import re

def reduce_number(n, master_numbers=[11, 22, 33], keep_master=True):
    """
    Reduces a number to a single digit or a master number.
    """
    if n == 0:
        return 0
    if keep_master and n in master_numbers:
        return n
    
    while n > 9:
        if keep_master and n in master_numbers:
            return n
        n = sum(int(digit) for digit in str(n))
    return n

def get_karmic_debt(nums):
    """
    Checks if any number in the intermediate sums is a karmic debt number (13, 14, 16, 19).
    """
    debts = []
    for n in nums:
        if n in [13, 14, 16, 19]:
            debts.append(n)
    return debts

def calculate_life_path(dob_str):
    """
    Calculates Life Path from YYYY-MM-DD.
    """
    match = re.search(r'(\d{4})-(\d{2})-(\d{2})', dob_str)
    if not match:
        return None, []
    
    year, month, day = map(int, match.groups())
    
    # Standard reduction method: reduce each component first
    r_month = reduce_number(month)
    r_day = reduce_number(day)
    r_year = reduce_number(year)
    
    total = r_month + r_day + r_year
    lp = reduce_number(total)
    
    # Check for karmic debts in intermediate totals
    # (Though traditional methods vary on where to check)
    intermediate_sums = [month, day, year, total]
    karmic_debts = get_karmic_debt(intermediate_sums)
    
    return lp, list(set(karmic_debts))

def name_reduction(name, type='soul'):
    """
    Calculates reduction for Soul Urge (vowels) or Personality (consonants).
    Uses Pythagorean system.
    """
    mapping = {
        'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
        'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
        'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    }
    vowels = "AEIOU"
    consonants = "BCDFGHJKLMNPQRSTVWXYZ"
    
    name = name.upper()
    total = 0
    intermediate_sums = []
    
    for char in name:
        if char in mapping:
            is_vowel = char in vowels
            if type == 'soul' and is_vowel:
                total += mapping[char]
            elif type == 'personality' and not is_vowel:
                total += mapping[char]
            elif type == 'destiny':
                total += mapping[char]
    
    reduced = reduce_number(total)
    karmic_debts = get_karmic_debt([total])
    
    return reduced, karmic_debts

def calculate_numerology(name, dob_str):
    """
    High level call for all numerology components.
    """
    lp, lp_debts = calculate_life_path(dob_str)
    soul_urge, soul_debts = name_reduction(name, 'soul')
    personality, pers_debts = name_reduction(name, 'personality')
    destiny, dest_debts = name_reduction(name, 'destiny')
    
    bridge = abs(soul_urge - personality)
    
    all_debts = list(set(lp_debts + soul_debts + pers_debts + dest_debts))
    
    return {
        "lifePath": lp,
        "soulUrge": soul_urge,
        "personality": personality,
        "destiny": destiny,
        "bridge": bridge,
        "karmicDebts": all_debts
    }
