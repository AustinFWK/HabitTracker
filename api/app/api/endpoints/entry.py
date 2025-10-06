from fastapi import APIRouter, Depends, HTTPException
from api.app.schemas.user import EntryRead, EntryCreate, EntryUpdate
from api.app.models.models import DailyEntry
from app.db.database import get_session

router = APIRouter(
    prefix="/entry",
    tags=["entry"]
)

@router.post("/", response_model=EntryRead)
def create_entry(entry: EntryCreate, session = Depends(get_session)) -> DailyEntry:
    db_entry = DailyEntry(**entry.model_dump())
    session.add(db_entry)
    session.commit()
    session.refresh(db_entry)
    return db_entry
    