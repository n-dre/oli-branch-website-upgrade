import time
from functools import wraps
from typing import Callable, Any
import logging

logger = logging.getLogger(__name__)

class AIAuditError(Exception):
    """Custom exception for audit failures"""
    pass

def retry_with_backoff(
    max_retries: int = 3,
    initial_delay: float = 1.0,
    backoff_factor: float = 2.0
):
    """Decorator for retrying AI calls with exponential backoff"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            delay = initial_delay
            last_exception = None
            
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    if attempt < max_retries - 1:
                        logger.warning(f"Attempt {attempt + 1} failed: {str(e)}. Retrying in {delay}s...")
                        time.sleep(delay)
                        delay *= backoff_factor
                    else:
                        logger.error(f"All {max_retries} attempts failed")
                        raise AIAuditError(f"Operation failed after {max_retries} attempts: {str(last_exception)}")
            
            raise AIAuditError(f"Max retries exceeded: {str(last_exception)}")
        return wrapper
    return decorator