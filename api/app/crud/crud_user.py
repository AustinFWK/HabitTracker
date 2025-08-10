from sqlalchemy.orm import Session
from db.models import User
from db.schema import UserCreate

def create_user(db: Session, user: UserCreate):
    db_user = User(username=user.username, email=user.email, birthdate=user.birthdate)