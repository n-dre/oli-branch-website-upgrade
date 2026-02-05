"""
Backend Core Module
Main initialization file that exports core components
"""

from .config import settings, get_database_url, Environment
from .dependencies import get_db, get_current_user, get_redis_client
from .security import (
    SecurityManager, 
    hash_password, 
    verify_password, 
    create_access_token, 
    verify_token
)

__all__ = [
    # Config
    'settings',
    'get_database_url',
    'Environment',
    
    # Dependencies
    'get_db',
    'get_current_user',
    'get_redis_client',
    
    # Security
    'SecurityManager',
    'hash_password',
    'verify_password',
    'create_access_token',
    'verify_token',
]

__version__ = '1.0.0'
__author__ = 'Backend Team'

# Initialize core components
def init_core():
    """Initialize all core components"""
    from .config import load_settings
    from .security import init_security
    
    # Load settings first
    settings = load_settings()
    
    # Initialize security
    security_manager = init_security(settings)
    
    return {
        'settings': settings,
        'security_manager': security_manager
    }

print(f"Backend Core Module v{__version__} initialized")