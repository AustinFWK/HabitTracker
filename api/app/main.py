from fastapi import FastAPI
from .api.endpoints import user, entry
from app.db.database import engine, Base

app = FastAPI()
Base.metadata.create_all(bind=engine)


app.include_router(user.router)
app.include_router(entry.router)


