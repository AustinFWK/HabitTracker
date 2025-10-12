from fastapi import APIRouter, Depends, HTTPException
from api.app.schemas.user import UserRead, UserUpdate, UserCreate
from api.app.models.user import User
from app.db.database import get_session


router = APIRouter(
    prefix="/user",
    tags=["user"]
)

#delete user endpoint
@router.delete("/{user_id}", response_model=None)
def delete_user(user_id: int, session = Depends(get_session)) -> User:
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User does not exist")
    session.delete(db_user)
    session.commit()
    return {"detail": "User succesfully deleted"}

#read user endpoint
@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, session = Depends(get_session)) -> User:
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User does not exist")
    return db_user


