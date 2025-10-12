from sqlalchemy import Column, Integer
from app.db.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    #i believe clerk provides its own unique id for each user, so i have to check how to integrate that here
    id = Column(Integer, primary_key=True, index=True)

    daily_entries = relationship("DailyEntry", back_populates="owner")

