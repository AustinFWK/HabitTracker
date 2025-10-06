from pydantic import BaseModel
from typing import Optional

class EntryCreate(BaseModel):
    entry: str
    #commenting out user id until it's automatically assigned based on the current active user
    user_id: int

    class Config:
        orm_mode = True

class EntryRead(BaseModel):
    id: int
    entry: str
    #commenting out habit date until i configure a way to automatically set the date upon creating an entry
    #habit_date: str
    user_id: int

    class Config:
        orm_mode = True

class EntryUpdate(BaseModel):
    entry: Optional[str] = None