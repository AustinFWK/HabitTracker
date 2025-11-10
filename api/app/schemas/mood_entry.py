from pydantic import BaseModel
from datetime import date, datetime

class MoodEntryCreate(BaseModel):
    mood_scale: int

class MoodEntryRead(BaseModel):
    id: int
    date: date
    clerk_user_id: str
    created_at: datetime
    mood_scale: int

    class Config:
        orm_mode = True