from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base

database_url = "sqlite:///db.sqlite3"

connect_args={"check_same_thread": False}

engine = create_engine(
    database_url, connect_args=connect_args
)

def get_session():
    with Session(engine) as session:
        yield session

Base = declarative_base()