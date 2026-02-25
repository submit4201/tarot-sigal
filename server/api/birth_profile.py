"""
Birth Profile API — multi-profile CRUD endpoints.

@note Supports multiple birth profiles per user (e.g., "Me", friends' charts).
      Subscription tier is per-account: the depth of analysis depends on the
      logged-in user's tier, not the profile being viewed.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Union

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


def _is_authorized(user: User) -> bool:
    """Check if a user has premium authorization for full birth profile analysis."""
    return (
        user.subscription_tier == "Oracle"
        or (user.is_premium and user.subscription_tier != "Seeker")
    )


def _compute_profile(profile_in: BirthProfileCreate, lat: str, lon: str):
    """
    Run all calculation engines and return the aggregated data dict.
    
    @note This is factored out so both create and update can reuse it.
    """
    num_data = calculate_numerology(profile_in.full_name, profile_in.birth_date)
    astro_data = calculate_astrology(
        profile_in.birth_date, profile_in.birth_time, float(lat), float(lon)
    )
    eastern_data = calculate_eastern(profile_in.birth_date, profile_in.birth_time)
    hd_data = calculate_hd(astro_data)
    progressed_data = calculate_progressed_moon(
        profile_in.birth_date, profile_in.birth_time, float(lat), float(lon)
    )
    return {
        "numerology": num_data,
        "astrology": astro_data,
        "eastern": eastern_data,
        "humanDesign": hd_data,
        "progressedMoon": progressed_data,
    }


# ---------- LIST all profiles for the current user ----------
@router.get("/", response_model=List[BirthProfileResponse])
def list_birth_profiles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return every birth profile owned by the current user.
    
    @note Returns full or teaser data depending on subscription tier.
    """
    profiles = (
        db.query(BirthProfile)
        .filter(BirthProfile.user_id == current_user.id)
        .order_by(BirthProfile.is_primary.desc(), BirthProfile.created_at)
        .all()
    )
    return profiles


# ---------- GET a single profile by ID ----------
@router.get("/{profile_id}", response_model=Union[BirthProfileResponse, BirthProfileTeaser])
def get_birth_profile(
    profile_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Retrieve a specific birth profile by its ID."""
    profile = (
        db.query(BirthProfile)
        .filter(BirthProfile.id == profile_id, BirthProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Birth profile not found.")

    if _is_authorized(current_user):
        return profile
    else:
        # Return teaser from stored profile data
        astro = profile.profile_data.get("astrology", {}) if profile.profile_data else {}
        return {
            "sunSign": astro.get("sun", {}).get("sign", "Unknown"),
            "moonSign": astro.get("moon", {}).get("sign", "Unknown"),
            "ascendantSign": astro.get("ascendant", {}).get("sign", "Unknown"),
            "auraPreview": profile.llm_narrative or "",
            "isPremiumLocked": True,
        }


# ---------- CREATE a new profile ----------
@router.post("/", response_model=Union[BirthProfileResponse, BirthProfileTeaser])
def create_birth_profile(
    profile_in: BirthProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new birth profile for the current user.
    
    @note The first profile created is automatically marked as primary.
          Subsequent profiles are non-primary (friends' charts).
    """
    # Geocode if lat/long missing
    lat, lon = profile_in.latitude, profile_in.longitude
    if not lat or not lon:
        lat_f, lon_f = geocode_location(profile_in.birth_location)
        lat, lon = str(lat_f), str(lon_f)

    # Calculate profile data
    aggregated_data = _compute_profile(profile_in, lat, lon)

    # Check authorization for narrative depth
    is_authorized = _is_authorized(current_user)

    if is_authorized:
        narrative = generate_full_profile(aggregated_data)
        teaser_data = None
    else:
        teaser_obj = generate_teaser_profile(aggregated_data)
        narrative = teaser_obj["auraPreview"]
        teaser_data = teaser_obj

    # Determine if this is the first profile (make it primary)
    existing_count = (
        db.query(BirthProfile)
        .filter(BirthProfile.user_id == current_user.id)
        .count()
    )
    is_first = existing_count == 0

    profile_dict = profile_in.dict()
    profile_dict.update({
        "latitude": lat,
        "longitude": lon,
        "profile_data": aggregated_data,
        "llm_narrative": narrative,
        "user_id": current_user.id,
        "is_primary": is_first,
        "label": profile_in.label or ("Me" if is_first else "Friend"),
    })

    profile = BirthProfile(**profile_dict)
    db.add(profile)
    db.commit()
    db.refresh(profile)

    app_logger.info(
        f"Birth profile created for user: {current_user.id} "
        f"(label={profile.label}, primary={profile.is_primary}, authorized={is_authorized})"
    )

    if is_authorized:
        return profile
    else:
        # Include the profile ID so the frontend can track the newly created profile
        teaser_data["id"] = profile.id
        return teaser_data


# ---------- UPDATE an existing profile ----------
@router.put("/{profile_id}", response_model=Union[BirthProfileResponse, BirthProfileTeaser])
def update_birth_profile(
    profile_id: str,
    profile_in: BirthProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an existing birth profile and recalculate all engine data."""
    profile = (
        db.query(BirthProfile)
        .filter(BirthProfile.id == profile_id, BirthProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Birth profile not found.")

    # Geocode
    lat, lon = profile_in.latitude, profile_in.longitude
    if not lat or not lon:
        lat_f, lon_f = geocode_location(profile_in.birth_location)
        lat, lon = str(lat_f), str(lon_f)

    aggregated_data = _compute_profile(profile_in, lat, lon)
    is_authorized = _is_authorized(current_user)

    if is_authorized:
        narrative = generate_full_profile(aggregated_data)
        teaser_data = None
    else:
        teaser_obj = generate_teaser_profile(aggregated_data)
        narrative = teaser_obj["auraPreview"]
        teaser_data = teaser_obj

    # Update fields
    profile_dict = profile_in.dict()
    profile_dict.update({
        "latitude": lat,
        "longitude": lon,
        "profile_data": aggregated_data,
        "llm_narrative": narrative,
    })

    for key, value in profile_dict.items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)

    app_logger.info(f"Birth profile updated: {profile_id} for user: {current_user.id}")

    if is_authorized:
        return profile
    else:
        return teaser_data


# ---------- DELETE a non-primary profile ----------
@router.delete("/{profile_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_birth_profile(
    profile_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a birth profile. Cannot delete the primary profile.
    
    @note Primary profiles can only be deleted by deleting the entire account.
    """
    profile = (
        db.query(BirthProfile)
        .filter(BirthProfile.id == profile_id, BirthProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Birth profile not found.")
    if profile.is_primary:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete your primary birth profile."
        )

    db.delete(profile)
    db.commit()
    app_logger.info(f"Birth profile deleted: {profile_id} for user: {current_user.id}")
