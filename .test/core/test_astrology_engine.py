import pytest
from core.astrology_engine import calculate_astrology

def test_calculate_astrology():
    birth_date = "1990-01-01"
    birth_time = "12:00"
    lat = 40.7128 # NYC
    lon = -74.0060
    
    data = calculate_astrology(birth_date, birth_time, lat, lon)
    
    assert "sun" in data
    assert "moon" in data
    assert "ascendant" in data
    assert "houses" in data
    assert data["latitude"] == lat
    assert data["longitude"] == lon
    
    assert "sign" in data["sun"]
    assert "degree" in data["sun"]
    assert "sabian" in data["sun"]
