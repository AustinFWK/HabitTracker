from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import user, entry
from app.db.database import engine, Base

app = FastAPI()
Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:5173",  # Frontend (Vite)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user.router)
app.include_router(entry.router)


