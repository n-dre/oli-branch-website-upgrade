"""
Utility functions used across the backend.
Similar to frontend utility functions.
"""

import os
import json
import logging
import hashlib
import uuid
import re
import random
import string
from typing import Any, Dict, List, Optional, Union, Callable, TypeVar, Tuple
from datetime import datetime, timedelta, date
from functools import wraps
from decimal import Decimal
import base64
import time

# Type variable for generic functions
T = TypeVar('T')
R = TypeVar('R')

# Configure logging
logger = logging.getLogger(__name__)

# ============================================================================
# STRING UTILITIES
# ============================================================================

def generate_id(prefix: str = "", length: int = 12) -> str:
    """
    Generate a unique ID with optional prefix.
    Similar to frontend generateId() utility.
    """
    if length < 1:
        length = 12
    
    # Generate random string
    chars = string.ascii_lowercase + string.digits
    random_part = ''.join(random.choices(chars, k=length))
    
    # Add timestamp for uniqueness
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    
    if prefix:
        return f"{prefix}_{timestamp}_{random_part}"
    return f"{timestamp}_{random_part}"

def generate_slug(text: str, max_length: int = 50) -> str:
    """
    Generate a URL-friendly slug from text.
    """
    # Convert to lowercase
    slug = text.lower()
    
    # Replace spaces and special characters
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    
    # Trim to max length
    if len(slug) > max_length:
        slug = slug[:max_length].rstrip('-')
    
    return slug

def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """
    Truncate text to specified length with ellipsis.
    """
    if len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)] + suffix

def mask_email(email: str) -> str:
    """
    Mask email for privacy (e.g., j***@example.com).
    """
    if '@' not in email:
        return email
    
    local_part, domain = email.split('@')
    
    if len(local_part) <= 2:
        masked_local = local_part[0] + '*' * (len(local_part) - 1)
    else:
        masked_local = local_part[0] + '*' * (len(local_part) - 2) + local_part[-1]
    
    return f"{masked_local}@{domain}"

def mask_phone(phone: str) -> str:
    """
    Mask phone number for privacy (e.g., +1 ***-***-1234).
    """
    # Remove all non-digits
    digits = re.sub(r'\D', '', phone)
    
    if len(digits) < 10:
        return phone
    
    # Keep last 4 digits visible
    visible_digits = 4
    masked = '*' * (len(digits) - visible_digits) + digits[-visible_digits:]
    
    # Format with dashes
    if len(masked) == 10:
        return f"({masked[:3]}) ***-{masked[6:]}"
    elif len(masked) > 10:
        return f"+{masked[:-10]} ***-***-{masked[-4:]}"
    
    return phone

def is_valid_email(email: str) -> bool:
    """
    Validate email address format.
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def is_valid_phone(phone: str) -> bool:
    """
    Validate phone number format.
    """
    # Remove spaces, dashes, parentheses
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)
    
    # Check if it's all digits and has reasonable length
    if cleaned.startswith('+'):
        cleaned = cleaned[1:]
    
    return cleaned.isdigit() and 10 <= len(cleaned) <= 15

def is_valid_url(url: str) -> bool:
    """
    Validate URL format.
    """
    pattern = r'^https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+(?::\d+)?(?:/[-\w.%?=&]*)?$'
    return bool(re.match(pattern, url))

# ============================================================================
# DATE & TIME UTILITIES
# ============================================================================

def format_date(dt: datetime, format_str: str = "%Y-%m-%d") -> str:
    """
    Format datetime to string.
    """
    return dt.strftime(format_str)

def parse_date(date_str: str, format_str: str = "%Y-%m-%d") -> Optional[datetime]:
    """
    Parse string to datetime.
    """
    try:
        return datetime.strptime(date_str, format_str)
    except (ValueError, TypeError):
        return None

def get_time_ago(dt: datetime) -> str:
    """
    Get human-readable time difference (e.g., "2 hours ago").
    """
    now = datetime.now()
    diff = now - dt
    
    if diff.days > 365:
        years = diff.days // 365
        return f"{years} year{'s' if years > 1 else ''} ago"
    elif diff.days > 30:
        months = diff.days // 30
        return f"{months} month{'s' if months > 1 else ''} ago"
    elif diff.days > 0:
        return f"{diff.days} day{'s' if diff.days > 1 else ''} ago"
    elif diff.seconds > 3600:
        hours = diff.seconds // 3600
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif diff.seconds > 60:
        minutes = diff.seconds // 60
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
    else:
        return "just now"

def is_expired(expiry_date: datetime) -> bool:
    """
    Check if a date has expired.
    """
    return datetime.now() > expiry_date

def get_days_until(date: Union[datetime, date]) -> int:
    """
    Get number of days until a date.
    """
    if isinstance(date, date):
        date = datetime.combine(date, datetime.min.time())
    
    return (date - datetime.now()).days

def get_date_range(start_date: date, end_date: date) -> List[date]:
    """
    Get list of dates between start and end dates (inclusive).
    """
    dates = []
    current = start_date
    
    while current <= end_date:
        dates.append(current)
        current += timedelta(days=1)
    
    return dates

# ============================================================================
# NUMERIC UTILITIES
# ============================================================================

def format_number(number: Union[int, float], decimals: int = 0) -> str:
    """
    Format number with thousands separators.
    """
    if isinstance(number, float):
        return f"{number:,.{decimals}f}"
    else:
        return f"{number:,}"

def calculate_percentage(part: Union[int, float], whole: Union[int, float]) -> float:
    """
    Calculate percentage.
    """
    if whole == 0:
        return 0.0
    return (part / whole) * 100

def round_to_nearest(value: float, nearest: float = 0.5) -> float:
    """
    Round to nearest specified value.
    """
    return round(value / nearest) * nearest

def clamp(value: Union[int, float], min_val: Union[int, float], max_val: Union[int, float]) -> Union[int, float]:
    """
    Clamp value between min and max.
    """
    return max(min_val, min(value, max_val))

def calculate_average(values: List[Union[int, float]]) -> float:
    """
    Calculate average of values.
    """
    if not values:
        return 0.0
    return sum(values) / len(values)

def calculate_median(values: List[Union[int, float]]) -> float:
    """
    Calculate median of values.
    """
    if not values:
        return 0.0
    
    sorted_values = sorted(values)
    n = len(sorted_values)
    
    if n % 2 == 0:
        return (sorted_values[n // 2 - 1] + sorted_values[n // 2]) / 2
    else:
        return sorted_values[n // 2]

# ============================================================================
# DATA TRANSFORMATION UTILITIES
# ============================================================================

def to_camel_case(snake_str: str) -> str:
    """
    Convert snake_case to camelCase.
    """
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

def to_snake_case(camel_str: str) -> str:
    """
    Convert camelCase to snake_case.
    """
    snake_str = re.sub(r'(?<!^)(?=[A-Z])', '_', camel_str)
    return snake_str.lower()

def flatten_dict(d: Dict[str, Any], parent_key: str = '', sep: str = '.') -> Dict[str, Any]:
    """
    Flatten nested dictionary.
    """
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

def nest_dict(flat_dict: Dict[str, Any], sep: str = '.') -> Dict[str, Any]:
    """
    Convert flat dictionary to nested dictionary.
    """
    result = {}
    for key, value in flat_dict.items():
        parts = key.split(sep)
        d = result
        for part in parts[:-1]:
            if part not in d:
                d[part] = {}
            d = d[part]
        d[parts[-1]] = value
    return result

def filter_dict(data: Dict[str, Any], keys: List[str]) -> Dict[str, Any]:
    """
    Filter dictionary to include only specified keys.
    """
    return {k: v for k, v in data.items() if k in keys}

def exclude_dict(data: Dict[str, Any], keys: List[str]) -> Dict[str, Any]:
    """
    Filter dictionary to exclude specified keys.
    """
    return {k: v for k, v in data.items() if k not in keys}

def deep_merge(dict1: Dict[str, Any], dict2: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deep merge two dictionaries.
    """
    result = dict1.copy()
    for key, value in dict2.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = deep_merge(result[key], value)
        else:
            result[key] = value
    return result

# ============================================================================
# SECURITY & ENCRYPTION UTILITIES
# ============================================================================

def generate_hash(data: str, algorithm: str = 'sha256') -> str:
    """
    Generate hash of data.
    """
    if algorithm == 'md5':
        return hashlib.md5(data.encode()).hexdigest()
    elif algorithm == 'sha1':
        return hashlib.sha1(data.encode()).hexdigest()
    elif algorithm == 'sha256':
        return hashlib.sha256(data.encode()).hexdigest()
    elif algorithm == 'sha512':
        return hashlib.sha512(data.encode()).hexdigest()
    else:
        raise ValueError(f"Unsupported algorithm: {algorithm}")

def generate_random_string(length: int = 32) -> str:
    """
    Generate cryptographically secure random string.
    """
    chars = string.ascii_letters + string.digits
    return ''.join(random.SystemRandom().choice(chars) for _ in range(length))

def base64_encode(data: Union[str, bytes]) -> str:
    """
    Base64 encode data.
    """
    if isinstance(data, str):
        data = data.encode('utf-8')
    return base64.b64encode(data).decode('utf-8')

def base64_decode(data: str) -> str:
    """
    Base64 decode data.
    """
    decoded = base64.b64decode(data.encode('utf-8'))
    return decoded.decode('utf-8')

def mask_sensitive_data(data: Dict[str, Any], sensitive_fields: List[str] = None) -> Dict[str, Any]:
    """
    Mask sensitive data in dictionary.
    """
    if sensitive_fields is None:
        sensitive_fields = ['password', 'token', 'secret', 'key', 'authorization']
    
    masked = data.copy()
    for key, value in masked.items():
        if any(sensitive in key.lower() for sensitive in sensitive_fields):
            if isinstance(value, str) and len(value) > 0:
                masked[key] = '***' + value[-4:] if len(value) > 4 else '***'
    return masked

# ============================================================================
# VALIDATION UTILITIES
# ============================================================================

def validate_required_fields(data: Dict[str, Any], required_fields: List[str]) -> List[str]:
    """
    Validate that required fields are present.
    Returns list of missing fields.
    """
    missing = []
    for field in required_fields:
        if field not in data or data[field] is None:
            missing.append(field)
        elif isinstance(data[field], str) and data[field].strip() == '':
            missing.append(field)
    return missing

def validate_field_types(data: Dict[str, Any], field_types: Dict[str, type]) -> List[str]:
    """
    Validate field types.
    Returns list of fields with incorrect types.
    """
    incorrect = []
    for field, expected_type in field_types.items():
        if field in data and data[field] is not None:
            if not isinstance(data[field], expected_type):
                incorrect.append(field)
    return incorrect

def validate_email_list(emails: List[str]) -> Tuple[List[str], List[str]]:
    """
    Validate list of email addresses.
    Returns tuple of (valid_emails, invalid_emails).
    """
    valid = []
    invalid = []
    for email in emails:
        if is_valid_email(email):
            valid.append(email)
        else:
            invalid.append(email)
    return valid, invalid

def validate_phone_list(phones: List[str]) -> Tuple[List[str], List[str]]:
    """
    Validate list of phone numbers.
    Returns tuple of (valid_phones, invalid_phones).
    """
    valid = []
    invalid = []
    for phone in phones:
        if is_valid_phone(phone):
            valid.append(phone)
        else:
            invalid.append(phone)
    return valid, invalid

# ============================================================================
# ERROR HANDLING UTILITIES
# ============================================================================

def retry_with_backoff(func: Callable[..., T], max_retries: int = 3, 
                       base_delay: float = 1.0, max_delay: float = 30.0) -> Callable[..., T]:
    """
    Decorator for retrying functions with exponential backoff.
    """
    @wraps(func)
    def wrapper(*args, **kwargs) -> T:
        retries = 0
        while retries <= max_retries:
            try:
                return func(*args, **kwargs)
            except Exception as e:
                retries += 1
                if retries > max_retries:
                    logger.error(f"Function {func.__name__} failed after {max_retries} retries: {str(e)}")
                    raise
                
                # Calculate delay with exponential backoff and jitter
                delay = min(base_delay * (2 ** (retries - 1)), max_delay)
                jitter = random.uniform(0, delay * 0.1)
                total_delay = delay + jitter
                
                logger.warning(f"Function {func.__name__} failed (attempt {retries}/{max_retries}), "
                             f"retrying in {total_delay:.2f}s: {str(e)}")
                time.sleep(total_delay)
        
        # This should never be reached
        raise RuntimeError(f"Function {func.__name__} failed unexpectedly")
    
    return wrapper

def handle_errors(default_value: Any = None, log_error: bool = True):
    """
    Decorator for handling errors in functions.
    """
    def decorator(func: Callable[..., T]) -> Callable[..., Union[T, Any]]:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Union[T, Any]:
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if log_error:
                    logger.error(f"Error in {func.__name__}: {str(e)}", exc_info=True)
                return default_value
        return wrapper
    return decorator

def safe_get(data: Dict[str, Any], key_path: str, default: Any = None) -> Any:
    """
    Safely get nested dictionary value using dot notation.
    """
    keys = key_path.split('.')
    current = data
    
    for key in keys:
        if isinstance(current, dict) and key in current:
            current = current[key]
        else:
            return default
    
    return current

def safe_set(data: Dict[str, Any], key_path: str, value: Any) -> Dict[str, Any]:
    """
    Safely set nested dictionary value using dot notation.
    """
    keys = key_path.split('.')
    current = data
    
    for i, key in enumerate(keys[:-1]):
        if key not in current or not isinstance(current[key], dict):
            current[key] = {}
        current = current[key]
    
    current[keys[-1]] = value
    return data

# ============================================================================
# FILE & STORAGE UTILITIES
# ============================================================================

def get_file_extension(filename: str) -> str:
    """
    Get file extension from filename.
    """
    return os.path.splitext(filename)[1].lower().lstrip('.')

def get_file_size_str(size_bytes: int) -> str:
    """
    Convert file size in bytes to human-readable string.
    """
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} PB"

def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to remove unsafe characters.
    """
    # Remove directory traversal attempts
    filename = os.path.basename(filename)
    
    # Remove unsafe characters
    filename = re.sub(r'[^\w\s.-]', '', filename)
    
    # Replace spaces with underscores
    filename = re.sub(r'\s+', '_', filename)
    
    # Limit length
    if len(filename) > 255:
        name, ext = os.path.splitext(filename)
        filename = name[:255 - len(ext)] + ext
    
    return filename

def generate_filename(original_filename: str, prefix: str = "", suffix: str = "") -> str:
    """
    Generate unique filename with optional prefix/suffix.
    """
    name, ext = os.path.splitext(original_filename)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    random_str = generate_random_string(8)
    
    parts = []
    if prefix:
        parts.append(prefix)
    parts.append(timestamp)
    parts.append(random_str)
    if suffix:
        parts.append(suffix)
    
    new_name = '_'.join(parts)
    return f"{new_name}{ext}"

# ============================================================================
# LOGGING UTILITIES
# ============================================================================

def setup_logging(level: str = "INFO", log_file: str = None):
    """
    Setup logging configuration.
    """
    log_level = getattr(logging, level.upper(), logging.INFO)
    
    handlers = [logging.StreamHandler()]
    if log_file:
        handlers.append(logging.FileHandler(log_file))
    
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=handlers
    )

def log_performance(func: Callable[..., R]) -> Callable[..., R]:
    """
    Decorator to log function performance.
    """
    @wraps(func)
    def wrapper(*args, **kwargs) -> R:
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            return result
        finally:
            end_time = time.time()
            duration = (end_time - start_time) * 1000  # Convert to milliseconds
            logger.debug(f"Function {func.__name__} took {duration:.2f}ms")
    return wrapper

# ============================================================================
# ENVIRONMENT UTILITIES
# ============================================================================

def get_env_variable(key: str, default: Any = None, required: bool = False) -> Any:
    """
    Get environment variable with optional default and required flag.
    """
    value = os.getenv(key, default)
    
    if required and value is None:
        raise ValueError(f"Environment variable {key} is required but not set")
    
    return value

def get_env_bool(key: str, default: bool = False) -> bool:
    """
    Get boolean environment variable.
    """
    value = os.getenv(key, str(default)).lower()
    return value in ('true', '1', 'yes', 'y', 'on')

def get_env_int(key: str, default: int = 0) -> int:
    """
    Get integer environment variable.
    """
    try:
        return int(os.getenv(key, default))
    except (ValueError, TypeError):
        return default

def get_env_list(key: str, default: List[str] = None, separator: str = ',') -> List[str]:
    """
    Get list environment variable.
    """
    if default is None:
        default = []
    
    value = os.getenv(key)
    if value is None:
        return default
    
    return [item.strip() for item in value.split(separator) if item.strip()]

# ============================================================================
# MISC UTILITIES
# ============================================================================

def chunk_list(lst: List[T], chunk_size: int) -> List[List[T]]:
    """
    Split list into chunks of specified size.
    """
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]

def batch_process(items: List[T], batch_size: int, 
                  process_func: Callable[[List[T]], Any]) -> List[Any]:
    """
    Process items in batches.
    """
    results = []
    for i in range(0, len(items), batch_size):
        batch = items[i:i + batch_size]
        result = process_func(batch)
        results.append(result)
    return results

def get_duplicates(items: List[T]) -> List[T]:
    """
    Find duplicate items in list.
    """
    seen = set()
    duplicates = set()
    
    for item in items:
        if item in seen:
            duplicates.add(item)
        else:
            seen.add(item)
    
    return list(duplicates)

def remove_duplicates(items: List[T]) -> List[T]:
    """
    Remove duplicates from list while preserving order.
    """
    seen = set()
    result = []
    
    for item in items:
        if item not in seen:
            seen.add(item)
            result.append(item)
    
    return result

def get_random_item(items: List[T]) -> Optional[T]:
    """
    Get random item from list.
    """
    if not items:
        return None
    return random.choice(items)

def get_random_items(items: List[T], count: int) -> List[T]:
    """
    Get random items from list.
    """
    if count >= len(items):
        return items.copy()
    return random.sample(items, count)