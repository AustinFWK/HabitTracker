from fastapi import FastAPI
from .api.endpoints import user, entry

app = FastAPI()

app.include_router(user.router)
app.include_router(entry.router)


