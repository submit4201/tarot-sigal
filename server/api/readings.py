from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from models.schemas import ReadingCreate, ReadingResponse, ReadingUpdate
from models.database_models import Reading, User
from core.database import get_db
from api.deps import get_current_user
from core.logger import app_logger

router = APIRouter()

@router.post("/", response_model=ReadingResponse, status_code=status.HTTP_201_CREATED)
def create_reading(reading_in: ReadingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reading = Reading(**reading_in.dict(), user_id=current_user.id)
    db.add(reading)
    db.commit()
    db.refresh(reading)
    app_logger.info(f"Reading created for user: {current_user.id}")
    return reading

@router.get("/", response_model=List[ReadingResponse])
def get_readings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), skip: int = 0, limit: int = 100):
    readings = db.query(Reading).filter(Reading.user_id == current_user.id).order_by(Reading.created_at.desc()).offset(skip).limit(limit).all()
    return readings

@router.delete("/{reading_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_reading(reading_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reading = db.query(Reading).filter(Reading.id == reading_id, Reading.user_id == current_user.id).first()
    if not reading:
        raise HTTPException(status_code=404, detail="Reading not found or not authorized.")
    db.delete(reading)
    db.commit()
    app_logger.info(f"Reading {reading_id} deleted by user: {current_user.id}")
    return None
@router.patch("/{reading_id}", response_model=ReadingResponse)
def update_reading(reading_id: str, reading_in: ReadingUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reading = db.query(Reading).filter(Reading.id == reading_id, Reading.user_id == current_user.id).first()
    if not reading:
        raise HTTPException(status_code=404, detail="Reading not found.")
    
    reading.notes = reading_in.notes
    db.commit()
    db.refresh(reading)
    app_logger.info(f"Reading {reading_id} updated for user: {current_user.id}")
    return reading
