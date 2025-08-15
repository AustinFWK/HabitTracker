from typing import Union
from fastapi import FastAPI, Depends
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

@app.post("/users/", response_model= UserRead)
def create_user(user: UserCreate, session = Depends(get_session)) -> User:
    db_user = User(**user.model_dump())
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

    