from sqlalchemy.orm import Session
from api.app.models.user import User
from api.app.schemas.user import UserCreate

def create_user(db: Session, user: UserCreate):
    db_user = User(username=user.username, email=user.email, birthdate=user.birthdate)