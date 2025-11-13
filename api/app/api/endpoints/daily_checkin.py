from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.daily_checkin import DailyCheckInCreate, DailyCheckInRead, DailyCheckInList
from app.models.entry import DailyEntry
from app.models.mood_entry import MoodEntry
from app.db.database import get_session
from app.core.auth import get_current_user
from datetime import date
from typing import List

router = APIRouter(
    prefix="/check_in",
    tags=["check_in"]
)

#creates a daily check-in entry
@router.post("/create", response_model=DailyCheckInRead)
def create_check_in(check_in: DailyCheckInCreate, session=Depends(get_session), current_user=Depends(get_current_user)) -> DailyCheckInRead:
    clerk_user_id = current_user["sub"]
    db_entry = DailyEntry(entry=check_in.entry, clerk_user_id=clerk_user_id, date=date.today())
    db_mood_entry = MoodEntry(mood_scale=check_in.mood_scale, clerk_user_id=clerk_user_id, date=date.today())

    session.add(db_entry)
    session.add(db_mood_entry)
    session.commit()
    session.refresh(db_entry)
    session.refresh(db_mood_entry)
    return DailyCheckInRead(entry_id=db_entry.id, entry=db_entry.entry, mood_id=db_mood_entry.id, mood_scale=db_mood_entry.mood_scale, date=db_mood_entry.date, created_at=db_mood_entry.created_at)

@router.get("", response_model=List[DailyCheckInList])
def get_all_check_ins(session=Depends(get_session), current_user=Depends(get_current_user)) -> List[DailyCheckInList]:
    clerk_user_id = current_user["sub"]
    result = session.query(DailyEntry, MoodEntry).join(MoodEntry, (MoodEntry.date == DailyEntry.date) & (MoodEntry.clerk_user_id == DailyEntry.clerk_user_id)).filter(DailyEntry.clerk_user_id == clerk_user_id).all()

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No check-ins found for the user.")

    return [DailyCheckInList(
            date=entry.date,
            mood_scale=mood.mood_scale,
            mood_id=mood.id,
            entry=entry.entry,
            entry_id=entry.id
        ) for entry, mood in result]


#get individual check-in by date for the current user
@router.get("/{date}", response_model=List[DailyCheckInList])
def get_check_in_by_date(date: date, session=Depends(get_session), current_user=Depends(get_current_user)) -> List[DailyCheckInList]:
    clerk_user_id = current_user["sub"]
    result = session.query(DailyEntry, MoodEntry).join(MoodEntry, (MoodEntry.date == DailyEntry.date) & (MoodEntry.clerk_user_id == DailyEntry.clerk_user_id)).filter(DailyEntry.clerk_user_id == clerk_user_id, DailyEntry.date == date).all()

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No check-in found for the specified date.")

    return [DailyCheckInList(
            date=entry.date,
            mood_scale=mood.mood_scale,
            mood_id=mood.id,
            entry=entry.entry,
            entry_id=entry.id
        ) for entry, mood in result]