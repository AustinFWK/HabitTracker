from typing import Union
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from app.db.database import engine
from app.db import models
from app.db.models import User
from app.db.database import get_session
from app.db.schema import UserCreate, UserRead

app = FastAPI()

models.Base.metadata.create_all(bind=engine)



@app.get("/")
def read_root():
    return {"Hello": "World"}


#create user endpoint
@app.post("/users/", response_model= UserRead)
def create_user(user: UserCreate, session = Depends(get_session)) -> User:
    db_user = User(**user.model_dump())
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


#delete user endpoint
@app.delete("/users/{user_id}")
def delete_user(user_id: int, session = Depends(get_session)) -> User:
    User = session.get(User, user_id)
    if not User:
        raise HTTPException(status_code=404, detail="User does not exist")
    session.delete(User)
    session.commit()
    return {"detail": "User succesfully deleted"}

#read user endpoint
@app.put("/users/{user_id}", response_model=UserRead)
def update_user(user_id: int, session = Depends(get_session)) -> User:
    User = session.get(User, user_id)
    if not User:
        raise HTTPException(status_code=404, detail="User does not exist")
    return User

