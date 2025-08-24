from fastapi import FastAPI
from .api.endpoints.user import router

app = FastAPI()

app.include_router(router)


