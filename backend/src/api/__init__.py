"""
API Package

This package contains the API layer of the application.
It includes routes, middleware, and API-related functionality.
"""

from .routes import router

# Export the main router
__all__ = ["router"]