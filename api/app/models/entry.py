from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime
from app.db.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class DailyEntry(Base):
    __tablename__ = "daily_entries"

    id = Column(Integer, primary_key=True, index=True)
    clerk_user_id = Column(String, ForeignKey("users.clerk_user_id")) 
    entry = Column(String, index=True)
    date = Column(Date, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="daily_entries")