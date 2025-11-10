from pydantic import BaseModel
from typing import Optional
from datetime import date

class EntryCreate(BaseModel):
    entry: str

    class Config:
        orm_mode = True

class EntryRead(BaseModel):
    id: int
    entry: str
    date: date
    clerk_user_id: str

    class Config:
        orm_mode = True

class EntryUpdate(BaseModel):
    entry: Optional[str] = None