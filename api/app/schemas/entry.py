from pydantic import BaseModel
from typing import Optional

class EntryCreate(BaseModel):
    entry: str
    #user id is manually assigned as of now, need to program a way to automatically assign it based on the logged in user
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