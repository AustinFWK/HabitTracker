from sqlalchemy import Column, String
from app.db.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    #i believe clerk provides its own unique id for each user, so i have to check how to integrate that here
    clerk_user_id = Column(String, primary_key=True, index=True)

    daily_entries = relationship("DailyEntry", back_populates="owner")

