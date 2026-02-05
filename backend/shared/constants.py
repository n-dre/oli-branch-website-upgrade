"""
Application-wide constants and configuration.
Similar to frontend constants files.
"""

from enum import Enum
from typing import Dict, Any, List

# ============================================================================
# API CONSTANTS
# ============================================================================

class HTTPStatus:
    """HTTP status codes"""
    OK = 200
    CREATED = 201
    ACCEPTED = 202
    NO_CONTENT = 204
    BAD_REQUEST = 400
    UNAUTHORIZED = 401
    FORBIDDEN = 403
    NOT_FOUND = 404
    METHOD_NOT_ALLOWED = 405
    CONFLICT = 409
    UNPROCESSABLE_ENTITY = 422
    INTERNAL_SERVER_ERROR = 500
    SERVICE_UNAVAILABLE = 503

class APIVersion:
    """API versions"""
    V1 = "v1"
    CURRENT = V1

# ============================================================================
# APPLICATION CONSTANTS
# ============================================================================

class AppConstants:
    """Core application constants"""
    APP_NAME = "Oli-Branch"
    APP_VERSION = "1.0.0"
    API_PREFIX = "/api"
    
    # Environment
    ENV_DEVELOPMENT = "development"
    ENV_STAGING = "staging"
    ENV_PRODUCTION = "production"
    
    # Time constants (in seconds)
    ONE_MINUTE = 60
    ONE_HOUR = 60 * ONE_MINUTE
    ONE_DAY = 24 * ONE_HOUR
    ONE_WEEK = 7 * ONE_DAY
    
    # Pagination
    DEFAULT_PAGE_SIZE = 20
    MAX_PAGE_SIZE = 100

# ============================================================================
# DATABASE CONSTANTS
# ============================================================================

class DatabaseConstants:
    """Database related constants"""
    # DynamoDB table names
    USERS_TABLE = "users"
    ASSESSMENTS_TABLE = "assessments"
    RESULTS_TABLE = "assessment_results"
    REPORTS_TABLE = "reports"
    WEBHOOKS_TABLE = "webhooks"
    EVENTS_TABLE = "webhook_events"
    
    # Index names
    USER_EMAIL_INDEX = "email-index"
    ASSESSMENT_CREATED_BY_INDEX = "createdBy-index"
    RESULT_USER_INDEX = "userId-index"
    REPORT_RESULT_INDEX = "resultId-index"
    
    # Field names
    CREATED_AT = "createdAt"
    UPDATED_AT = "updatedAt"
    DELETED_AT = "deletedAt"

# ============================================================================
# AUTHENTICATION & SECURITY
# ============================================================================

class AuthConstants:
    """Authentication constants"""
    # JWT
    JWT_ALGORITHM = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES = 15
    JWT_REFRESH_TOKEN_EXPIRE_DAYS = 30
    
    # Token types
    TOKEN_TYPE_ACCESS = "access"
    TOKEN_TYPE_REFRESH = "refresh"
    
    # Password requirements
    MIN_PASSWORD_LENGTH = 8
    PASSWORD_REGEX = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    
    # Security headers
    CORS_HEADERS = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": True,
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
    }

# ============================================================================
# ASSESSMENT & REPORTING
# ============================================================================

class AssessmentConstants:
    """Assessment related constants"""
    # Assessment status
    STATUS_DRAFT = "draft"
    STATUS_PUBLISHED = "published"
    STATUS_ARCHIVED = "archived"
    
    # Question types
    QUESTION_TYPE_MULTIPLE_CHOICE = "multiple_choice"
    QUESTION_TYPE_TRUE_FALSE = "true_false"
    QUESTION_TYPE_SHORT_ANSWER = "short_answer"
    QUESTION_TYPE_ESSAY = "essay"
    QUESTION_TYPE_RATING = "rating"
    
    # Scoring
    MAX_SCORE = 100
    PASSING_SCORE = 70
    
    # Time limits (in minutes)
    DEFAULT_TIME_LIMIT = 60
    NO_TIME_LIMIT = 0
    
    # Report types
    REPORT_TYPE_DETAILED = "detailed"
    REPORT_TYPE_SUMMARY = "summary"
    REPORT_TYPE_CERTIFICATE = "certificate"
    
    # Report status
    REPORT_STATUS_PROCESSING = "processing"
    REPORT_STATUS_COMPLETED = "completed"
    REPORT_STATUS_FAILED = "failed"

# ============================================================================
# FILE & STORAGE
# ============================================================================

class FileConstants:
    """File and storage constants"""
    # S3 buckets
    ASSESSMENTS_BUCKET = "oli-branch-assessments"
    REPORTS_BUCKET = "oli-branch-reports"
    TEMPLATES_BUCKET = "oli-branch-templates"
    USER_UPLOADS_BUCKET = "oli-branch-uploads"
    
    # File paths
    ASSESSMENT_IMAGES_PATH = "assessments/images/"
    USER_AVATARS_PATH = "users/avatars/"
    REPORT_PDFS_PATH = "reports/pdf/"
    TEMPLATES_PATH = "templates/"
    
    # File size limits (in bytes)
    MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB
    MAX_PDF_SIZE = 10 * 1024 * 1024   # 10MB
    MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB
    
    # Allowed MIME types
    ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    ALLOWED_DOCUMENT_TYPES = ["application/pdf", "application/msword", 
                              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

# ============================================================================
# NOTIFICATIONS & WEBHOOKS
# ============================================================================

class NotificationConstants:
    """Notification and webhook constants"""
    # Event types
    EVENT_USER_REGISTERED = "user.registered"
    EVENT_ASSESSMENT_CREATED = "assessment.created"
    EVENT_ASSESSMENT_SUBMITTED = "assessment.submitted"
    EVENT_REPORT_GENERATED = "report.generated"
    EVENT_PAYMENT_RECEIVED = "payment.received"
    EVENT_WEBHOOK_TEST = "webhook.test"
    
    # Notification channels
    CHANNEL_EMAIL = "email"
    CHANNEL_SMS = "sms"
    CHANNEL_PUSH = "push"
    CHANNEL_WEBHOOK = "webhook"
    
    # Webhook status
    WEBHOOK_STATUS_ACTIVE = "active"
    WEBHOOK_STATUS_INACTIVE = "inactive"
    WEBHOOK_STATUS_SUSPENDED = "suspended"
    
    # Retry policy
    MAX_WEBHOOK_RETRIES = 3
    WEBHOOK_TIMEOUT = 30  # seconds

# ============================================================================
# ERROR CODES & MESSAGES
# ============================================================================

class ErrorCodes:
    """Application error codes"""
    # Generic errors
    VALIDATION_ERROR = "VALIDATION_ERROR"
    AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR"
    AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR"
    NOT_FOUND_ERROR = "NOT_FOUND_ERROR"
    CONFLICT_ERROR = "CONFLICT_ERROR"
    RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR"
    INTERNAL_ERROR = "INTERNAL_ERROR"
    
    # Domain-specific errors
    ASSESSMENT_NOT_FOUND = "ASSESSMENT_NOT_FOUND"
    ASSESSMENT_EXPIRED = "ASSESSMENT_EXPIRED"
    ASSESSMENT_ALREADY_SUBMITTED = "ASSESSMENT_ALREADY_SUBMITTED"
    REPORT_GENERATION_FAILED = "REPORT_GENERATION_FAILED"
    PAYMENT_FAILED = "PAYMENT_FAILED"
    USER_LIMIT_EXCEEDED = "USER_LIMIT_EXCEEDED"

class ErrorMessages:
    """Common error messages"""
    # Authentication
    INVALID_CREDENTIALS = "Invalid email or password"
    TOKEN_EXPIRED = "Token has expired"
    TOKEN_INVALID = "Invalid token"
    ACCESS_DENIED = "Access denied"
    
    # Validation
    REQUIRED_FIELD = "This field is required"
    INVALID_EMAIL = "Invalid email address"
    INVALID_PHONE = "Invalid phone number"
    PASSWORD_TOO_WEAK = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    
    # Resources
    RESOURCE_NOT_FOUND = "Resource not found"
    RESOURCE_ALREADY_EXISTS = "Resource already exists"
    RESOURCE_IN_USE = "Resource is in use and cannot be deleted"
    
    # System
    INTERNAL_SERVER_ERROR = "Internal server error"
    SERVICE_UNAVAILABLE = "Service temporarily unavailable"
    RATE_LIMIT_EXCEEDED = "Rate limit exceeded. Please try again later."

# ============================================================================
# ENVIRONMENT CONFIGURATION
# ============================================================================

class EnvironmentConfig:
    """Environment-specific configuration"""
    
    @staticmethod
    def get_config(env: str) -> Dict[str, Any]:
        """Get configuration for environment"""
        configs = {
            AppConstants.ENV_DEVELOPMENT: {
                "debug": True,
                "cors_origins": ["http://localhost:3000", "http://127.0.0.1:3000"],
                "database_url": "sqlite:///./dev.db",
                "log_level": "DEBUG",
                "enable_docs": True,
            },
            AppConstants.ENV_STAGING: {
                "debug": False,
                "cors_origins": ["https://staging.oli-branch.com"],
                "database_url": None,  # Use environment variables
                "log_level": "INFO",
                "enable_docs": False,
            },
            AppConstants.ENV_PRODUCTION: {
                "debug": False,
                "cors_origins": ["https://oli-branch.com", "https://www.oli-branch.com"],
                "database_url": None,  # Use environment variables
                "log_level": "WARNING",
                "enable_docs": False,
            }
        }
        return configs.get(env, configs[AppConstants.ENV_DEVELOPMENT])

# ============================================================================
# FEATURE FLAGS
# ============================================================================

class FeatureFlags:
    """Feature flags for gradual rollout"""
    
    # Assessment features
    ENABLE_AI_SCORING = "enable_ai_scoring"
    ENABLE_PROCTORING = "enable_proctoring"
    ENABLE_CERTIFICATES = "enable_certificates"
    
    # User features
    ENABLE_SOCIAL_LOGIN = "enable_social_login"
    ENABLE_TWO_FACTOR_AUTH = "enable_two_factor_auth"
    ENABLE_PROFILE_CUSTOMIZATION = "enable_profile_customization"
    
    # Payment features
    ENABLE_SUBSCRIPTIONS = "enable_subscriptions"
    ENABLE_COUPONS = "enable_coupons"
    ENABLE_REFERRALS = "enable_referrals"
    
    @staticmethod
    def is_enabled(feature: str, user_id: str = None) -> bool:
        """Check if a feature is enabled for a user"""
        # In production, this would check a feature flag service
        # For now, return True for all features
        return True

# ============================================================================
# API RESPONSE FORMATS
# ============================================================================

class ResponseFormats:
    """Standard API response formats"""
    
    @staticmethod
    def success(data: Any = None, message: str = "Success", meta: Dict = None) -> Dict:
        """Success response format"""
        response = {
            "success": True,
            "message": message,
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
        
        if meta:
            response["meta"] = meta
            
        return response
    
    @staticmethod
    def error(message: str, code: str = ErrorCodes.INTERNAL_ERROR, 
              details: Any = None, status_code: int = HTTPStatus.INTERNAL_SERVER_ERROR) -> Dict:
        """Error response format"""
        return {
            "success": False,
            "error": {
                "code": code,
                "message": message,
                "details": details,
                "timestamp": datetime.now().isoformat()
            },
            "status_code": status_code
        }
    
    @staticmethod
    def paginated(data: List, total: int, page: int = 1, 
                  page_size: int = AppConstants.DEFAULT_PAGE_SIZE, **kwargs) -> Dict:
        """Paginated response format"""
        total_pages = (total + page_size - 1) // page_size
        
        return {
            "success": True,
            "data": data,
            "pagination": {
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_previous": page > 1
            },
            "timestamp": datetime.now().isoformat(),
            **kwargs
        }

# ============================================================================
# DATETIME FORMATS
# ============================================================================

class DateTimeFormats:
    """Standard datetime formats"""
    ISO_8601 = "%Y-%m-%dT%H:%M:%S.%fZ"
    DATE_ONLY = "%Y-%m-%d"
    TIME_ONLY = "%H:%M:%S"
    DISPLAY_DATE = "%B %d, %Y"
    DISPLAY_DATETIME = "%B %d, %Y at %I:%M %p"

# Import datetime at the end to avoid circular imports
from datetime import datetime