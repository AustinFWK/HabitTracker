from fastapi import APIRouter, Depends, HTTPException
from api.app.db.schema import UserRead, UserUpdate, UserCreate
from app.db.models import User
from app.db.database import get_session


router = APIRouter(
    prefix="/user",
)

@router.post("/", response_model= UserRead)
def create_user(user: UserCreate, session = Depends(get_session)) -> User:
    db_user = User(**user.model_dump())
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


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

#update user endpoint
@router.put("/{user_id}", response_model=UserRead)
def update_user(user_id: int, user: UserUpdate, session = Depends(get_session)) -> User:
    db_user = session.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User does not exist")
    
    update_data = user.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)
    session.commit()
    session.refresh(db_user)
    return db_user
