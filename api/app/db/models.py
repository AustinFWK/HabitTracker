from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    #birthdate = Column(Integer, nullable=True)

    daily_entries = relationship("DailyEntry", back_populates="owner")

class DailyEntry(Base):
    __tablename__ = "daily_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    entry = Column(String, index=True)
    #habit_date = Column(String, index=True)

    #commented out date and userid until i program them to be automatically configured

    owner = relationship("User", back_populates="daily_entries")