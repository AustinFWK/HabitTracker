from typing import Union
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from app.db.database import engine
from app.db import models
from app.db.models import User
from app.db.database import get_session
from app.db.schema import UserCreate, UserRead, UserUpdate

app = FastAPI()


