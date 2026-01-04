from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.daily_checkin import DailyCheckInCreate, DailyCheckInRead, DailyCheckInList, DailyCheckInUpdate
from app.models.entry import DailyEntry
from app.models.mood_entry import MoodEntry
from app.db.database import get_session
from app.core.auth import get_current_user
from app.services.ai_service import AIService
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

    existing_entry = session.query(DailyEntry).filter(DailyEntry.clerk_user_id == clerk_user_id, DailyEntry.date == date.today()).first()
    if existing_entry:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Check-in for today already exists.")

    try:
        ai_service = AIService()
        ai_feedback = ai_service.generate_feedback(check_in.entry, check_in.mood_scale)
    except Exception as e:
        # AI generation failed
        print(f"Failed to create check-in due to AI error: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="AI service is currently unavailable. Please try again in a moment.")

    db_entry = DailyEntry(entry=check_in.entry, clerk_user_id=clerk_user_id, date=date.today(), ai_feedback=ai_feedback)
    db_mood_entry = MoodEntry(mood_scale=check_in.mood_scale, clerk_user_id=clerk_user_id, date=date.today())

    session.add(db_entry)
    session.add(db_mood_entry)
    session.commit()
    session.refresh(db_entry)
    session.refresh(db_mood_entry)
    return DailyCheckInRead(entry_id=db_entry.id, entry=db_entry.entry, mood_id=db_mood_entry.id, mood_scale=db_mood_entry.mood_scale, date=db_mood_entry.date, created_at=db_mood_entry.created_at, ai_feedback=db_entry.ai_feedback)

#get all check-ins for the current user
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
            entry_id=entry.id,
            ai_feedback=entry.ai_feedback
        ) for entry, mood in result]


#get individual check-in by date for the current user
@router.get("/{date}", response_model=DailyCheckInList)
def get_check_in_by_date(date: date, session=Depends(get_session), current_user=Depends(get_current_user)) -> DailyCheckInList:
    clerk_user_id = current_user["sub"]
    result = session.query(DailyEntry, MoodEntry).join(MoodEntry, (MoodEntry.date == DailyEntry.date) & (MoodEntry.clerk_user_id == DailyEntry.clerk_user_id)).filter(DailyEntry.clerk_user_id == clerk_user_id, DailyEntry.date == date).first()

    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No check-in found for the specified date.")
    
    entry, mood = result

    return DailyCheckInList(
            date=entry.date,
            mood_scale=mood.mood_scale,
            mood_id=mood.id,
            entry=entry.entry,
            entry_id=entry.id,
            ai_feedback=entry.ai_feedback
        )

#updates indvidual daily check-ins through a date parameter
@router.put("/update/{date}", response_model=DailyCheckInList)
def update_check_in_by_date(date: date, check_in_update: DailyCheckInUpdate, session=Depends(get_session), current_user=Depends(get_current_user)) -> DailyCheckInList:
    clerk_user_id = current_user["sub"]
    result = session.query(DailyEntry, MoodEntry).join(MoodEntry, (MoodEntry.date == DailyEntry.date) & (MoodEntry.clerk_user_id == DailyEntry.clerk_user_id)).filter(DailyEntry.clerk_user_id == clerk_user_id, DailyEntry.date == date).first()

    if not result:
        raise HTTPException(status_code=404, detail="No check-in found for this date")

    entry, mood = result

    # Track if we need to regenerate AI feedback
    needs_ai_update = False

    if check_in_update.entry is not None and check_in_update.entry != entry.entry:
        entry.entry = check_in_update.entry
        needs_ai_update = True
    if check_in_update.mood_scale is not None and check_in_update.mood_scale != mood.mood_scale:
        mood.mood_scale = check_in_update.mood_scale
        needs_ai_update = True

    # Regenerate AI feedback only if entry or mood actually changed
    if needs_ai_update:
        try:
            ai_service = AIService()
            entry.ai_feedback = ai_service.generate_feedback(entry.entry, mood.mood_scale)
        except Exception as e:
            print(f"Failed to update AI feedback: {type(e).__name__}: {str(e)}")
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="AI service is currently unavailable. Please try again in a moment.")

    session.commit()

    return DailyCheckInList(
        date=entry.date,
        mood_scale=mood.mood_scale,
        mood_id=mood.id,
        entry=entry.entry,
        entry_id=entry.id,
        ai_feedback=entry.ai_feedback)

@router.delete("/delete/{date}", status_code=status.HTTP_204_NO_CONTENT)
def delete_check_in_by_date(date: date, session=Depends(get_session), current_user=Depends(get_current_user)):
    clerk_user_id = current_user["sub"]
    result = session.query(DailyEntry, MoodEntry).join(MoodEntry, (MoodEntry.date == DailyEntry.date) & (MoodEntry.clerk_user_id == DailyEntry.clerk_user_id)).filter(DailyEntry.clerk_user_id == clerk_user_id, DailyEntry.date == date).first()

    if not result:
        raise HTTPException(status_code=404, detail="No check-in found for this date")
    
    entry, mood = result
    session.delete(entry)
    session.delete(mood)
    session.commit()
