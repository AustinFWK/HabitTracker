from pydantic import BaseModel
from datetime import date, datetime

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

    class Config:
        orm_mode = True

class DailyCheckInList(BaseModel):
    date: date
    mood_scale: int
    mood_id: int
    entry: str
    entry_id: int

    class Config:
        orm_mode = True