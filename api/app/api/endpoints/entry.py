from fastapi import APIRouter, Depends, HTTPException
from app.schemas.entry import EntryRead, EntryCreate, EntryUpdate
from app.models.entry import DailyEntry
from app.db.database import get_session
from app.core.auth import get_current_user
from typing import Dict

router = APIRouter(
    prefix="/entry",
    tags=["entry"]
)

@router.post("/", response_model=EntryRead)
def create_entry(entry: EntryCreate, session = Depends(get_session), current_user: Dict = Depends(get_current_user)) -> DailyEntry:
    clerk_user_id = current_user["sub"]
    db_entry = DailyEntry(entry=entry.entry, clerk_user_id=clerk_user_id)
    session.add(db_entry)
    session.commit()
    session.refresh(db_entry)
    return db_entry

    