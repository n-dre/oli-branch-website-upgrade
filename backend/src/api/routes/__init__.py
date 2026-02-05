"""
API Routes Package

This package contains all API route definitions for the application.
Routes are organized by feature/domain for better maintainability.
"""

from fastapi import APIRouter

# Import route modules
from . import auth
from . import assessments
from . import banks

# Create main router
router = APIRouter()

# Include sub-routers
router.include_router(auth.router)
router.include_router(assessments.router)
router.include_router(banks.router)

# Health check endpoint (always available)
@router.get("/health")
async def health_check():
    """Health check endpoint."""
    import datetime
    return {
        "status": "healthy",
        "service": "api",
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z"
    }

# Version endpoint
@router.get("/version")
async def version():
    """API version endpoint."""
    return {
        "version": "1.0.0",
        "name": "Assessment API",
        "description": "Backend API for assessment platform"
    }

# Root endpoint
@router.get("/")
async def root():
    """Root API endpoint."""
    return {
        "message": "Welcome to Assessment API",
        "docs": "/docs",
        "version": "/version",
        "health": "/health",
        "routes": {
            "auth": "/auth",
            "assessments": "/assessments",
            "banks": "/banks"
        }
    }

__all__ = ["router", "auth", "assessments", "banks"]