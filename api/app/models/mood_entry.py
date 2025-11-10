from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime
from app.db.database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id = Column(Integer, primary_key=True, index=True)
    clerk_user_id = Column(String, ForeignKey("users.clerk_user_id")) 
    mood_score = Column(Integer, index=True)
    date = Column(Date, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    mood_scale = Column(Integer, nullable=False)

    owner = relationship("User", back_populates="mood_entries")