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

def verify_token(token: str) -> Dict:
    try:
        jwks = get_jwks()
        payload = jwt.decode(token, jwks, algorithms=["RS256"], issuer=os.getenv("CLERK_ISSUER"), options={"verify_signature": True, "verify_exp": True, "verify_iss": True})
        return payload
    
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication error: {str(e)}"
        )
