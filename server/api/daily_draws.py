from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from models.schemas import DailyDrawCreate, DailyDrawResponse
from models.database_models import DailyDraw, User
from core.database import get_db
from api.deps import get_current_user
from core.logger import app_logger

router = APIRouter()

@router.post("/", response_model=DailyDrawResponse, status_code=status.HTTP_201_CREATED)
def create_daily_draw(draw_in: DailyDrawCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draw = DailyDraw(**draw_in.dict(), user_id=current_user.id)
    db.add(draw)
    db.commit()
    db.refresh(draw)
    app_logger.info(f"Daily draw created for user: {current_user.id}")
    return draw

@router.get("/", response_model=List[DailyDrawResponse])
def get_daily_draws(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), skip: int = 0, limit: int = 30):
    draws = db.query(DailyDraw).filter(DailyDraw.user_id == current_user.id).order_by(DailyDraw.date.desc()).offset(skip).limit(limit).all()
    return draws
