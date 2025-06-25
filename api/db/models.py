from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base
from sqlachemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)

    daily_habits = relationship("Daily Habits", back_populates="owner")

class DailyHabits(Base):
    __tablename__ = "daily_habits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey="users.id")
    habit_entry = Column(String, index=True)
    habit_date = Column(String, index=True)

    owner = relationship("User", back_populates="daily_habits")