from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import date

class UserCreate(BaseModel):
    username: str
    email: str
   #birthdate: Optional[int] = None

    class Config:
        orm_mode = True

class UserRead(BaseModel):
    id: int
    username: str
    email: EmailStr
    #birthdate: date
    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None

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
    
    