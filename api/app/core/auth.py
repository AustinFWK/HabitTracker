from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from functools import lru_cache
from typing import Dict
import os
import requests

security = HTTPBearer()

@lru_cache(maxsize=1)
def get_jwks() -> Dict:
    jwks_clerk_url = os.getenv("CLERK_JWKS_URL")
    if not jwks_clerk_url:
        raise ValueError("CLERK_JWKS_URL environment variable not set")
    
    response = requests.get(jwks_clerk_url)
    response.raise_for_status()
    return response.json()

