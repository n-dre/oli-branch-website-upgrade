"""
Security Management Module
Handles authentication, authorization, and security utilities
"""

import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Union
from passlib.context import CryptContext
from jose import JWTError, jwt as jose_jwt
from pydantic import BaseModel
import secrets
import hashlib
import hmac
import base64

from .config import settings


# Password hashing context
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
)


class TokenData(BaseModel):
    """Token payload data model"""
    sub: str  # subject (user ID)
    username: Optional[str] = None
    email: Optional[str] = None
    roles: list = []
    permissions: list = []
    exp: datetime
    iat: datetime
    jti: str  # JWT ID for revocation tracking


class SecurityManager:
    """Main security manager class"""
    
    def __init__(self, secret_key: str, algorithm: str = "HS256"):
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.token_blacklist = set()  # In production, use Redis
    
    def hash_password(self, password: str) -> str:
        """Hash a password"""
        return pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    def create_access_token(
        self,
        data: Dict[str, Any],
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create a JWT access token"""
        to_encode = data.copy()
        
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        
        # Add standard JWT claims
        to_encode.update({
            "exp": expire,
            "iat": datetime.utcnow(),
            "jti": secrets.token_urlsafe(32),  # Unique token ID
            "type": "access",
        })
        
        # Encode the token
        encoded_jwt = jose_jwt.encode(
            to_encode,
            self.secret_key,
            algorithm=self.algorithm
        )
        
        return encoded_jwt
    
    def create_refresh_token(
        self,
        user_id: str,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create a refresh token"""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                days=settings.REFRESH_TOKEN_EXPIRE_DAYS
            )
        
        refresh_data = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.utcnow(),
            "jti": secrets.token_urlsafe(32),
            "type": "refresh",
        }
        
        encoded_jwt = jose_jwt.encode(
            refresh_data,
            self.secret_key,
            algorithm=self.algorithm
        )
        
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode a JWT token"""
        try:
            # Check if token is blacklisted
            if self.is_token_revoked(token):
                return None
            
            # Decode the token
            payload = jose_jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm]
            )
            
            # Validate required claims
            if not all(key in payload for key in ["sub", "exp", "iat", "jti"]):
                return None
            
            # Check expiration
            if datetime.utcnow() > datetime.fromtimestamp(payload["exp"]):
                return None
            
            return payload
            
        except JWTError:
            return None
        except Exception:
            return None
    
    def revoke_token(self, token: str) -> bool:
        """Revoke/blacklist a token"""
        try:
            payload = self.verify_token(token)
            if payload and "jti" in payload:
                self.token_blacklist.add(payload["jti"])
                return True
        except Exception:
            pass
        return False
    
    def is_token_revoked(self, token: str) -> bool:
        """Check if a token is revoked"""
        try:
            payload = self.verify_token(token)
            if payload and "jti" in payload:
                return payload["jti"] in self.token_blacklist
        except Exception:
            pass
        return False
    
    def generate_api_key(self, prefix: str = "api") -> str:
        """Generate a secure API key"""
        # Generate random bytes
        random_bytes = secrets.token_bytes(32)
        
        # Create a prefix
        key_prefix = f"{prefix}_"
        
        # Encode with URL-safe base64
        key_suffix = base64.urlsafe_b64encode(random_bytes).decode()
        
        # Combine prefix and suffix
        api_key = f"{key_prefix}{key_suffix}"
        
        # Hash for storage
        api_key_hash = self.hash_api_key(api_key)
        
        return api_key, api_key_hash
    
    def hash_api_key(self, api_key: str) -> str:
        """Hash an API key for storage"""
        return hashlib.sha256(api_key.encode()).hexdigest()
    
    def verify_api_key(self, api_key: str, hashed_api_key: str) -> bool:
        """Verify an API key"""
        return hmac.compare_digest(
            self.hash_api_key(api_key),
            hashed_api_key
        )
    
    def create_password_reset_token(self, email: str) -> str:
        """Create a password reset token"""
        reset_data = {
            "email": email,
            "exp": datetime.utcnow() + timedelta(hours=1),
            "iat": datetime.utcnow(),
            "purpose": "password_reset",
        }
        
        return jose_jwt.encode(
            reset_data,
            self.secret_key,
            algorithm=self.algorithm
        )
    
    def verify_password_reset_token(self, token: str) -> Optional[str]:
        """Verify a password reset token and return email"""
        try:
            payload = jose_jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm]
            )
            
            if payload.get("purpose") != "password_reset":
                return None
            
            email = payload.get("email")
            if not email:
                return None
            
            return email
            
        except JWTError:
            return None


# Helper Functions
def hash_password(password: str) -> str:
    """Helper function to hash password"""
    return security_manager.hash_password(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Helper function to verify password"""
    return security_manager.verify_password(plain_password, hashed_password)


def create_access_token(data: Dict[str, Any]) -> str:
    """Helper function to create access token"""
    return security_manager.create_access_token(data)


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Helper function to verify token"""
    return security_manager.verify_token(token)


def create_refresh_token(user_id: str) -> str:
    """Helper function to create refresh token"""
    return security_manager.create_refresh_token(user_id)


def get_current_user_from_token(token: str) -> Optional[Dict[str, Any]]:
    """Extract current user from token"""
    payload = verify_token(token)
    if not payload:
        return None
    
    return {
        "id": payload.get("sub"),
        "username": payload.get("username"),
        "email": payload.get("email"),
        "roles": payload.get("roles", []),
        "permissions": payload.get("permissions", []),
    }


# Rate limiting utilities
class RateLimiter:
    """Simple rate limiter using token bucket algorithm"""
    
    def __init__(self, redis_client, key_prefix: str = "rate_limit"):
        self.redis = redis_client
        self.key_prefix = key_prefix
    
    async def is_rate_limited(
        self,
        identifier: str,
        limit: int,
        window: int
    ) -> bool:
        """
        Check if request is rate limited.
        
        Args:
            identifier: User/IP identifier
            limit: Maximum requests in window
            window: Time window in seconds
        
        Returns:
            True if rate limited, False otherwise
        """
        key = f"{self.key_prefix}:{identifier}"
        
        # Get current count
        current = await self.redis.get(key)
        current_count = int(current) if current else 0
        
        if current_count >= limit:
            return True
        
        # Increment count
        pipe = self.redis.pipeline()
        pipe.incr(key)
        if current_count == 0:
            pipe.expire(key, window)
        await pipe.execute()
        
        return False


# Initialize security manager
security_manager = SecurityManager(
    secret_key=settings.SECRET_KEY,
    algorithm=settings.ALGORITHM
)


def init_security(settings) -> SecurityManager:
    """Initialize security manager with settings"""
    return SecurityManager(
        secret_key=settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )