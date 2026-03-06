"""
Authentication Middleware for FastAPI

This module provides authentication middleware for protecting API routes.
It handles JWT token validation, user extraction, and permission checking.
"""

import logging
from typing import Dict, Any, Optional, Tuple
from datetime import datetime, timedelta

from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt.exceptions import InvalidTokenError

logger = logging.getLogger(__name__)


class AuthMiddleware:
    """Authentication middleware for JWT token validation"""
    
    def __init__(
        self,
        secret_key: str,
        algorithm: str = "HS256",
        token_prefix: str = "Bearer"
    ):
        """
        Initialize authentication middleware.
        
        Args:
            secret_key: Secret key for JWT token validation
            algorithm: JWT algorithm (default: HS256)
            token_prefix: Token prefix in Authorization header (default: Bearer)
        """
        self.secret_key = secret_key
        self.algorithm = algorithm
        self.token_prefix = token_prefix
        self.security = HTTPBearer()
    
    async def __call__(self, request: Request):
        """
        Authenticate incoming request.
        
        Args:
            request: FastAPI request object
            
        Returns:
            Tuple of (user_id, user_role) if authentication successful
            
        Raises:
            HTTPException: If authentication fails
        """
        try:
            # Extract token from Authorization header
            auth_header = request.headers.get("Authorization")
            if not auth_header:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authorization header missing"
                )
            
            # Check token prefix
            if not auth_header.startswith(f"{self.token_prefix} "):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Invalid token prefix. Expected '{self.token_prefix}'"
                )
            
            # Extract token
            token = auth_header[len(f"{self.token_prefix} "):].strip()
            if not token:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token missing"
                )
            
            # Validate token
            payload = self.validate_token(token)
            
            # Extract user information
            user_id = payload.get("sub")
            user_role = payload.get("role", "user")
            
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token: user ID missing"
                )
            
            # Add user info to request state
            request.state.user_id = user_id
            request.state.user_role = user_role
            request.state.token_payload = payload
            
            logger.debug(f"Authenticated user: {user_id}, role: {user_role}")
            
            return user_id, user_role
            
        except HTTPException:
            raise
        except InvalidTokenError as e:
            logger.warning(f"Invalid token: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Internal authentication error"
            )
    
    def validate_token(self, token: str) -> Dict[str, Any]:
        """
        Validate JWT token.
        
        Args:
            token: JWT token string
            
        Returns:
            Token payload if valid
            
        Raises:
            InvalidTokenError: If token is invalid or expired
        """
        try:
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm]
            )
            
            # Check expiration
            exp = payload.get("exp")
            if exp and datetime.utcfromtimestamp(exp) < datetime.utcnow():
                raise InvalidTokenError("Token expired")
            
            return payload
            
        except jwt.ExpiredSignatureError:
            raise InvalidTokenError("Token expired")
        except jwt.InvalidTokenError as e:
            raise InvalidTokenError(f"Invalid token: {str(e)}")
    
    def create_token(
        self,
        user_id: str,
        user_role: str = "user",
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create JWT token for user.
        
        Args:
            user_id: User identifier
            user_role: User role (default: "user")
            expires_delta: Token expiration time (default: 24 hours)
            
        Returns:
            JWT token string
        """
        if expires_delta is None:
            expires_delta = timedelta(hours=24)
        
        expire = datetime.utcnow() + expires_delta
        
        payload = {
            "sub": user_id,
            "role": user_role,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "access"
        }
        
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        
        # jwt.encode returns bytes in some versions, string in others
        if isinstance(token, bytes):
            token = token.decode("utf-8")
        
        return token
    
    def create_refresh_token(
        self,
        user_id: str,
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create refresh token for user.
        
        Args:
            user_id: User identifier
            expires_delta: Token expiration time (default: 30 days)
            
        Returns:
            Refresh token string
        """
        if expires_delta is None:
            expires_delta = timedelta(days=30)
        
        expire = datetime.utcnow() + expires_delta
        
        payload = {
            "sub": user_id,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "refresh"
        }
        
        token = jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
        
        if isinstance(token, bytes):
            token = token.decode("utf-8")
        
        return token
    
    def refresh_access_token(self, refresh_token: str) -> Tuple[str, str]:
        """
        Refresh access token using refresh token.
        
        Args:
            refresh_token: Valid refresh token
            
        Returns:
            Tuple of (new_access_token, new_refresh_token)
            
        Raises:
            InvalidTokenError: If refresh token is invalid
        """
        try:
            # Validate refresh token
            payload = self.validate_token(refresh_token)
            
            if payload.get("type") != "refresh":
                raise InvalidTokenError("Not a refresh token")
            
            user_id = payload.get("sub")
            if not user_id:
                raise InvalidTokenError("Invalid refresh token: user ID missing")
            
            # Create new tokens
            new_access_token = self.create_token(user_id)
            new_refresh_token = self.create_refresh_token(user_id)
            
            return new_access_token, new_refresh_token
            
        except InvalidTokenError:
            raise


# Factory function to create auth middleware instance
def create_auth_middleware(
    secret_key: Optional[str] = None,
    algorithm: str = "HS256",
    token_prefix: str = "Bearer"
) -> AuthMiddleware:
    """
    Create authentication middleware instance.
    
    Args:
        secret_key: Secret key for JWT (if None, will try to get from env)
        algorithm: JWT algorithm
        token_prefix: Token prefix
        
    Returns:
        AuthMiddleware instance
    """
    import os
    from dotenv import load_dotenv
    
    load_dotenv()
    
    if secret_key is None:
        secret_key = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
    
    return AuthMiddleware(
        secret_key=secret_key,
        algorithm=algorithm,
        token_prefix=token_prefix
    )


# Global middleware instance (can be imported directly)
auth_middleware = create_auth_middleware()