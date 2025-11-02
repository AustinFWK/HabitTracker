from pydantic import BaseModel
from typing import Optional

class EntryCreate(BaseModel):
    entry: str

    class Config:
        orm_mode = True

class EntryRead(BaseModel):
    id: int
    entry: str
    #commenting out habit date until i configure a way to automatically set the date upon creating an entry
    #habit_date: str
    clerk_user_id: str

    class Config:
        orm_mode = True

class EntryUpdate(BaseModel):
    entry: Optional[str] = None