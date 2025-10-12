from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

class UserRead(BaseModel):
    id: int
    model_config = ConfigDict(from_attributes=True)

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None


    
    