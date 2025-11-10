from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.daily_checkin import DailyCheckInCreate, DailyCheckInRead
from app.models.entry import DailyEntry
from app.models.mood_entry import MoodEntry
from app.db.database import get_session
from app.core.auth import get_current_user
from datetime import date

router = APIRouter(
    prefix="/check_in",
    tags=["check_in"]
)

@router.post("/create", response_model=DailyCheckInRead)
def create_check_in(check_in: DailyCheckInCreate, session=Depends(get_session), current_user=Depends(get_current_user)) -> DailyCheckInRead:
    clerk_user_id = current_user["sub"]
    db_entry = DailyEntry(entry=check_in.entry, clerk_user_id=clerk_user_id)
    db_mood_entry = MoodEntry(mood_scale=check_in.mood_scale, clerk_user_id=clerk_user_id, date=date.today())

    session.add(db_entry)
    session.add(db_mood_entry)
    session.commit()
    session.refresh(db_entry)
    session.refresh(db_mood_entry)
    return DailyCheckInRead(entry_id=db_entry.id, entry=db_entry.entry, mood_id=db_mood_entry.id, mood_scale=db_mood_entry.mood_scale, date=db_mood_entry.date, created_at=db_mood_entry.created_at)