from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from models.schemas import DailyDrawCreate, DailyDrawResponse, DailyDrawUpdate
from models.database_models import DailyDraw, User
from core.database import get_db
from api.deps import get_current_user
from core.logger import app_logger

router = APIRouter()


@router.post("/", response_model=DailyDrawResponse, status_code=status.HTTP_201_CREATED)
def create_daily_draw(
    draw_in: DailyDrawCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new daily draw record for the authenticated user.

    @note Accepts both `insights` (AI blob) and `user_reflection` as top-level fields.
          `user_reflection` is persisted in its own column — NOT embedded inside `insights`.
    """
    draw = DailyDraw(
        user_id=current_user.id,
        card=draw_in.card,
        is_rev=draw_in.is_rev,
        date=draw_in.date,
        insights=draw_in.insights,
        user_reflection=draw_in.user_reflection,
    )
    db.add(draw)
    db.commit()
    db.refresh(draw)
    app_logger.info(f"Daily draw created for user: {current_user.id}")
    return draw


@router.get("/", response_model=List[DailyDrawResponse])
def get_daily_draws(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 30,
):
    """Return the most recent daily draws for the authenticated user, newest first."""
    draws = (
        db.query(DailyDraw)
        .filter(DailyDraw.user_id == current_user.id)
        .order_by(DailyDraw.date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return draws


@router.patch("/{draw_id}", response_model=DailyDrawResponse)
def update_daily_draw(
    draw_id: str,
    draw_in: DailyDrawUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update an existing daily draw.

    @note Both `insights` and `user_reflection` can be patched independently.
          Only fields explicitly provided (non-None) are written to DB.
    """
    draw = (
        db.query(DailyDraw)
        .filter(DailyDraw.id == draw_id, DailyDraw.user_id == current_user.id)
        .first()
    )
    if not draw:
        raise HTTPException(status_code=404, detail="Daily draw not found.")

    # Only overwrite fields that were explicitly provided
    if draw_in.insights is not None:
        draw.insights = draw_in.insights
    if draw_in.user_reflection is not None:
        draw.user_reflection = draw_in.user_reflection

    db.commit()
    db.refresh(draw)
    app_logger.info(f"Daily draw {draw_id} updated for user: {current_user.id}")
    return draw
