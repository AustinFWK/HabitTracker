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