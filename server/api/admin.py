from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

from models.schemas import UserResponse
from models.database_models import User
from core.database import get_db
from api.deps import get_current_admin_user
from core.logger import app_logger

router = APIRouter()

class AddStardustRequest(BaseModel):
    user_email: EmailStr
    amount: int

@router.post("/add-stardust", response_model=UserResponse)
def add_stardust_to_user(
    req: AddStardustRequest,
    db: Session = Depends(get_db),
    admin_user: User = Depends(get_current_admin_user)
):
    """
    Admin-only endpoint to add stardust to a user's account.
    """
    target_user = db.query(User).filter(User.email == req.user_email).first()
    if not target_user:
        app_logger.warning(f"Admin {admin_user.email} tried to add stardust to non-existent user {req.user_email}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this email not found"
        )
    
    target_user.stardust += req.amount
    db.commit()
    db.refresh(target_user)
    
    app_logger.info(f"Admin {admin_user.email} added {req.amount} stardust to {req.user_email}")
    return target_user
