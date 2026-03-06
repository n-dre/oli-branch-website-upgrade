"""
Authentication Routes

This module contains all API routes related to authentication and user management.
"""

import logging
from typing import Optional, Dict, Any
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr, validator

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/auth", tags=["authentication"])

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# ==================== Pydantic Models ====================
class UserBase(BaseModel):
    """Base user model"""
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    

class UserCreate(UserBase):
    """Request model for user registration"""
    password: str = Field(..., min_length=8, max_length=100)
    confirm_password: str = Field(..., min_length=8, max_length=100)
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v


class UserLogin(BaseModel):
    """Request model for user login"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Response model for token"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user_id: str
    email: str
    name: str
    role: str


class UserResponse(UserBase):
    """Response model for user"""
    id: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class PasswordResetRequest(BaseModel):
    """Request model for password reset"""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Request model for password reset confirmation"""
    token: str
    new_password: str = Field(..., min_length=8, max_length=100)
    confirm_password: str = Field(..., min_length=8, max_length=100)
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v


# ==================== Mock Database ====================
# In a real application, this would be a database
mock_users_db = {
    "user_123": {
        "id": "user_123",
        "email": "admin@example.com",
        "name": "Admin User",
        "hashed_password": "hashed_password_123",  # In real app, would be properly hashed
        "role": "admin",
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    },
    "user_456": {
        "id": "user_456",
        "email": "user@example.com",
        "name": "Regular User",
        "hashed_password": "hashed_password_456",
        "role": "user",
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
}

mock_tokens_db = {}


# ==================== Helper Functions ====================
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password (mock implementation)"""
    # In a real application, use proper password hashing (bcrypt, etc.)
    return f"hashed_{plain_password}" == hashed_password


def get_password_hash(password: str) -> str:
    """Hash password (mock implementation)"""
    # In a real application, use proper password hashing
    return f"hashed_{password}"


def create_access_token(user_id: str, expires_delta: Optional[timedelta] = None) -> str:
    """Create access token (mock implementation)"""
    # In a real application, use JWT tokens
    if expires_delta is None:
        expires_delta = timedelta(hours=24)
    
    expire = datetime.utcnow() + expires_delta
    token = f"access_token_{user_id}_{int(expire.timestamp())}"
    
    # Store token
    mock_tokens_db[token] = {
        "user_id": user_id,
        "type": "access",
        "expires_at": expire
    }
    
    return token


def create_refresh_token(user_id: str) -> str:
    """Create refresh token (mock implementation)"""
    expire = datetime.utcnow() + timedelta(days=30)
    token = f"refresh_token_{user_id}_{int(expire.timestamp())}"
    
    # Store token
    mock_tokens_db[token] = {
        "user_id": user_id,
        "type": "refresh",
        "expires_at": expire
    }
    
    return token


def validate_token(token: str) -> Optional[Dict[str, Any]]:
    """Validate token (mock implementation)"""
    token_data = mock_tokens_db.get(token)
    if not token_data:
        return None
    
    if token_data["expires_at"] < datetime.utcnow():
        # Token expired, remove it
        mock_tokens_db.pop(token, None)
        return None
    
    return token_data


def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """Get current user from token"""
    token_data = validate_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user_id = token_data["user_id"]
    user = mock_users_db.get(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    return user


# ==================== Route Handlers ====================
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Register a new user.
    
    Args:
        user_data: User registration data
    """
    logger.info(f"Registering user: {user_data.email}")
    
    # Check if user already exists
    for user in mock_users_db.values():
        if user["email"] == user_data.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
    
    # Create new user
    user_id = f"user_{int(datetime.utcnow().timestamp())}"
    new_user = {
        "id": user_id,
        "email": user_data.email,
        "name": user_data.name,
        "hashed_password": get_password_hash(user_data.password),
        "role": "user",  # Default role
        "is_active": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Save user (in real app, save to database)
    mock_users_db[user_id] = new_user
    
    # Return user without password
    response_user = new_user.copy()
    response_user.pop("hashed_password")
    
    return response_user


@router.post("/login", response_model=TokenResponse)
async def login(login_data: UserLogin):
    """
    Login user and return tokens.
    
    Args:
        login_data: User login credentials
    """
    logger.info(f"Login attempt for: {login_data.email}")
    
    # Find user by email
    user = None
    for u in mock_users_db.values():
        if u["email"] == login_data.email:
            user = u
            break
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create tokens
    access_token = create_access_token(user["id"])
    refresh_token = create_refresh_token(user["id"])
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": 86400,  # 24 hours in seconds
        "user_id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(refresh_token: str = Body(..., embed=True)):
    """
    Refresh access token using refresh token.
    
    Args:
        refresh_token: Valid refresh token
    """
    logger.info("Refreshing token")
    
    # Validate refresh token
    token_data = validate_token(refresh_token)
    if not token_data or token_data["type"] != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = token_data["user_id"]
    user = mock_users_db.get(user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Create new tokens
    access_token = create_access_token(user_id)
    new_refresh_token = create_refresh_token(user_id)
    
    # Invalidate old refresh token
    mock_tokens_db.pop(refresh_token, None)
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer",
        "expires_in": 86400,
        "user_id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Get current user profile.
    
    Args:
        current_user: Current authenticated user (from token)
    """
    logger.info(f"Getting profile for user: {current_user['id']}")
    
    # Return user without password
    response_user = current_user.copy()
    response_user.pop("hashed_password", None)
    
    return response_user


@router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    """
    Logout user by invalidating token.
    
    Args:
        token: Current access token
    """
    logger.info("Logging out user")
    
    # Invalidate token
    mock_tokens_db.pop(token, None)
    
    return {"message": "Successfully logged out"}


@router.post("/password/reset-request")
async def request_password_reset(reset_request: PasswordResetRequest):
    """
    Request password reset.
    
    Args:
        reset_request: Password reset request data
    """
    logger.info(f"Password reset requested for: {reset_request.email}")
    
    # Check if user exists
    user = None
    for u in mock_users_db.values():
        if u["email"] == reset_request.email:
            user = u
            break
    
    if user:
        # In a real application, send password reset email
        # For now, just log the request
        logger.info(f"Would send password reset email to: {reset_request.email}")
    
    # Always return success (for security, don't reveal if email exists)
    return {"message": "If your email is registered, you will receive reset instructions"}


@router.post("/password/reset")
async def reset_password(reset_data: PasswordResetConfirm):
    """
    Reset password using reset token.
    
    Args:
        reset_data: Password reset confirmation data
    """
    logger.info("Processing password reset")
    
    # In a real application:
    # 1. Validate reset token
    # 2. Update user password
    # 3. Invalidate all existing tokens for security
    
    # For now, just return success
    return {"message": "Password reset successful. Please login with your new password."}


@router.put("/me", response_model=UserResponse)
async def update_profile(
    name: Optional[str] = Body(None),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Update user profile.
    
    Args:
        name: New name (optional)
        current_user: Current authenticated user
    """
    logger.info(f"Updating profile for user: {current_user['id']}")
    
    # Update user data
    if name is not None:
        current_user["name"] = name
        current_user["updated_at"] = datetime.utcnow()
    
    # In a real application, save to database
    
    # Return updated user without password
    response_user = current_user.copy()
    response_user.pop("hashed_password", None)
    
    return response_user


# Export router
__all__ = ["router", "get_current_user"]