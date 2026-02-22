import pytest
from core.numerology_engine import calculate_numerology, reduce_number

def test_reduce_number():
    assert reduce_number(10) == 1
    assert reduce_number(11) == 11 # Master
    assert reduce_number(22) == 22 # Master
    assert reduce_number(33) == 33 # Master
    assert reduce_number(13) == 4
    assert reduce_number(19) == 1

def test_calculate_numerology():
    # Example birth data
    name = "John Doe"
    birth_date = "1990-01-01"
    data = calculate_numerology(name, birth_date)
    
    assert "lifePath" in data
    assert "soulUrge" in data
    assert "personality" in data
    assert "destiny" in data
    assert "karmicDebts" in data
    
    # Life Path for 1990-01-01: 1+9+9+0 + 0+1 + 0+1 = 19 + 1 + 1 = 21 -> 2+1 = 3
    assert data["lifePath"] == 3
