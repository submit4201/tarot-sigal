from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from models.schemas import UserCreate, UserResponse, Token, ProfileUpdate
from models.database_models import User
from core.database import get_db
from core.security import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from api.deps import get_current_user
from core.logger import app_logger

router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        app_logger.info(f"Failed registration attempt for existing email: {user_in.email}")
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        given_name=user_in.given_name,
        subscription_tier="free"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    app_logger.info(f"New user registered: {user.email}")
    return user


@router.post("/login", response_model=Token)
def login_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        app_logger.warning(f"Failed login attempt for: {form_data.username}")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    app_logger.info(f"User logged in: {user.email}")
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserResponse)
def update_current_user(
    profile_in: ProfileUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    update_data = profile_in.model_dump(exclude_unset=True)
    app_logger.info(f"[DEBUG] ProfileUpdate raw model: {profile_in}")
    app_logger.info(f"[DEBUG] model_dump(exclude_unset=True) => {update_data}")
    for field, value in update_data.items():
        app_logger.info(f"[DEBUG] Setting {field} = {repr(value)}")
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    app_logger.info(f"User {current_user.email} updated profile. Fields: {list(update_data.keys())}")
    return current_user
