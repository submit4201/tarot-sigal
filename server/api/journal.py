from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from models.schemas import JournalEntryCreate, JournalEntryResponse
from models.database_models import JournalEntry, User
from core.database import get_db
from api.deps import get_current_user
from core.logger import app_logger

router = APIRouter()

@router.post("/", response_model=JournalEntryResponse, status_code=status.HTTP_201_CREATED)
def create_journal_entry(entry_in: JournalEntryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = JournalEntry(**entry_in.dict(), user_id=current_user.id)
    db.add(entry)
    db.commit()
    db.refresh(entry)
    app_logger.info(f"Journal entry created for user: {current_user.id}")
    return entry

@router.get("/", response_model=List[JournalEntryResponse])
def get_journal_entries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user), skip: int = 0, limit: int = 100):
    entries = db.query(JournalEntry).filter(JournalEntry.user_id == current_user.id).order_by(JournalEntry.created_at.desc()).offset(skip).limit(limit).all()
    return entries

@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_journal_entry(entry_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == current_user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found or not authorized.")
    db.delete(entry)
    db.commit()
    app_logger.info(f"Journal entry {entry_id} deleted by user: {current_user.id}")
    return None
