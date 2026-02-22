from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Union

from models.schemas import BirthProfileCreate, BirthProfileResponse, BirthProfileTeaser
from models.database_models import BirthProfile, User
from core.database import get_db
from api.deps import get_current_user
from core.logger import app_logger

from core.numerology_engine import calculate_numerology
from core.astrology_engine import calculate_astrology
from core.eastern_engine import calculate_eastern
from core.hd_engine import calculate_hd
from core.progressed_moon import calculate_progressed_moon
from core.synthesis_engine import generate_full_profile, generate_teaser_profile

router = APIRouter()

def geocode_location(location_name: str):
    """
    Placeholder for geocoding. In production, use geopy/Google Maps.
    """
    # Placeholder for New York City
    return 40.7128, -74.0060

@router.post("/", response_model=Union[BirthProfileResponse, BirthProfileTeaser])
def create_or_update_birth_profile(
    profile_in: BirthProfileCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Geocode if lat/long missing
    lat, lon = profile_in.latitude, profile_in.longitude
    if not lat or not lon:
        lat_f, lon_f = geocode_location(profile_in.birth_location)
        lat, lon = str(lat_f), str(lon_f)

    # 1. Calc all engine data
    num_data = calculate_numerology(profile_in.full_name, profile_in.birth_date)
    astro_data = calculate_astrology(profile_in.birth_date, profile_in.birth_time, float(lat), float(lon))
    eastern_data = calculate_eastern(profile_in.birth_date, profile_in.birth_time)
    hd_data = calculate_hd(astro_data)
    
    # * NOTE: Progressed Moon for the "Hero's Arc" module
    progressed_data = calculate_progressed_moon(
        profile_in.birth_date, profile_in.birth_time, float(lat), float(lon)
    )
    
    aggregated_data = {
        "numerology": num_data,
        "astrology": astro_data,
        "eastern": eastern_data,
        "humanDesign": hd_data,
        "progressedMoon": progressed_data
    }

    # 2. Check Authorization
    is_authorized = current_user.subscription_tier == "Oracle" or (current_user.is_premium and current_user.subscription_tier != "Seeker")
    
    # 3. Generate Narrative
    if is_authorized:
        narrative = generate_full_profile(aggregated_data)
        teaser_data = None
    else:
        teaser_obj = generate_teaser_profile(aggregated_data)
        narrative = teaser_obj["auraPreview"]
        teaser_data = teaser_obj

    # 4. Persistence
    profile = db.query(BirthProfile).filter(BirthProfile.user_id == current_user.id).first()
    
    profile_dict = profile_in.dict()
    profile_dict.update({
        "latitude": lat,
        "longitude": lon,
        "profile_data": aggregated_data,
        "llm_narrative": narrative,
        "user_id": current_user.id
    })
    
    if not profile:
        profile = BirthProfile(**profile_dict)
        db.add(profile)
    else:
        for key, value in profile_dict.items():
            setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
    
    app_logger.info(f"Birth profile updated for user: {current_user.id} (Authorized: {is_authorized})")
    
    if is_authorized:
        return profile
    else:
        return teaser_data

@router.get("/", response_model=Union[BirthProfileResponse, BirthProfileTeaser])
def get_birth_profile(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    profile = db.query(BirthProfile).filter(BirthProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Birth profile not found.")
    
    is_authorized = current_user.subscription_tier == "Oracle" or (current_user.is_premium and current_user.subscription_tier != "Seeker")
    
    if is_authorized:
        return profile
    else:
        # Return teaser from stored profile data
        return {
            "sunSign": profile.profile_data["astrology"]["sun"]["sign"],
            "moonSign": profile.profile_data["astrology"]["moon"]["sign"],
            "ascendantSign": profile.profile_data["astrology"]["ascendant"]["sign"],
            "auraPreview": profile.llm_narrative, # Stored narrative is teaser for non-prem
            "isPremiumLocked": True
        }
