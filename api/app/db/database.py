from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # this is api/app/db
DB_FILE = os.path.join(BASE_DIR, "db.sqlite3")

database_url = f"sqlite:///{DB_FILE}"

connect_args={"check_same_thread": False}

engine = create_engine(
    database_url, connect_args=connect_args
)

def get_session():
    with Session(engine) as session:
        yield session

Base = declarative_base()