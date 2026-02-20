from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from models.schemas import PurchaseCreate, PurchaseResponse
from models.database_models import Purchase, User
from core.database import get_db
from api.deps import get_current_user
from core.logger import app_logger

router = APIRouter()

@router.post("/", response_model=PurchaseResponse, status_code=status.HTTP_201_CREATED)
def create_purchase(purchase_in: PurchaseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    purchase = Purchase(**purchase_in.dict(), user_id=current_user.id)
    db.add(purchase)
    db.commit()
    db.refresh(purchase)
    app_logger.info(f"Purchase record created for user: {current_user.id}")
    return purchase

@router.get("/", response_model=List[PurchaseResponse])
def get_purchases(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    purchases = db.query(Purchase).filter(Purchase.user_id == current_user.id).order_by(Purchase.created_at.desc()).all()
    return purchases
