from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class DailyCheckInCreate(BaseModel):
    entry: str
    mood_scale: int

class DailyCheckInRead(BaseModel):
    entry_id: int
    entry: str

    mood_id: int
    mood_scale: int

    date: date
    created_at: datetime

    ai_feedback: Optional[str] = None


    class Config:
        orm_mode = True

class DailyCheckInList(BaseModel):
    date: date
    mood_scale: int
    mood_id: int
    entry: str
    entry_id: int
    ai_feedback: Optional[str] = None


    class Config:
        orm_mode = True

class DailyCheckInUpdate(BaseModel):
    entry: Optional[str] = None
    mood_scale: Optional[int] = None