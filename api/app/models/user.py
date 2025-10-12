from sqlalchemy import Column, Integer
from app.db.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    #birthdate = Column(Integer, nullable=True)

    daily_entries = relationship("DailyEntry", back_populates="owner")

