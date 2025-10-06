from sqlalchemy import Column, Integer, String
from app.db.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    #birthdate = Column(Integer, nullable=True)

    daily_entries = relationship("DailyEntry", back_populates="owner")

