from fastapi import APIRouter

router = APIRouter()

@router.create("/users/create", response_model=User)