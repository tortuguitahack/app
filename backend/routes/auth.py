from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
import jwt
import os

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Simple auth for demo - in production use proper password hashing
DEMO_USERS = {
    "tambar": {
        "username": "tambar",
        "password": "tambar",
        "name": "Tambar Admin",
        "role": "admin"
    }
}

SECRET_KEY = "tambar_liquor_store_secret_key_2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict


class User(BaseModel):
    username: str
    name: str
    role: str


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            return None
        return username
    except jwt.PyJWTError:
        return None


@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """Authenticate user and return access token"""
    try:
        # Check credentials
        user = DEMO_USERS.get(login_data.username)
        if not user or user["password"] != login_data.password:
            raise HTTPException(
                status_code=401,
                detail="Incorrect username or password"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["username"]}, expires_delta=access_token_expires
        )
        
        # Return token and user info
        return LoginResponse(
            access_token=access_token,
            token_type="bearer",
            user={
                "username": user["username"],
                "name": user["name"],
                "role": user["role"]
            }
        )
        
    except Exception as e:
        if "Incorrect username" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Login error: {str(e)}")


@router.post("/verify")
async def verify_user_token(token: str):
    """Verify user token"""
    try:
        username = verify_token(token)
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        user = DEMO_USERS.get(username)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        return {
            "username": user["username"],
            "name": user["name"],
            "role": user["role"],
            "valid": True
        }
        
    except Exception as e:
        if "Invalid token" in str(e) or "User not found" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Token verification error: {str(e)}")


@router.post("/logout")
async def logout():
    """Logout user (client should discard token)"""
    return {"message": "Successfully logged out"}