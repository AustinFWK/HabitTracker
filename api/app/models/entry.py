from sqlalchemy import Column, Integer, String, ForeignKey
from datetime import date
from app.db.database import Base
from sqlalchemy.orm import relationship

class DailyEntry(Base):
    __tablename__ = "daily_entries"

    id = Column(Integer, primary_key=True, index=True)
    clerk_user_id = Column(String, ForeignKey("users.clerk_user_id")) 
    entry = Column(String, index=True)
    habit_date = Column(date, index=True)

    #commented out date and userid until i program them to be automatically configured

    owner = relationship("User", back_populates="daily_entries")