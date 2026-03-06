"""
Data models and Pydantic schemas used across the application.
Similar to frontend TypeScript interfaces.
"""

from typing import Optional, List, Dict, Any, Union
from datetime import datetime, date
from enum import Enum
from pydantic import BaseModel, Field, EmailStr, validator, HttpUrl
from uuid import UUID

# ============================================================================
# BASE MODELS
# ============================================================================

class BaseResponse(BaseModel):
    """Base response model"""
    success: bool = True
    message: str = "Success"
    timestamp: datetime = Field(default_factory=datetime.now)

class ErrorResponse(BaseResponse):
    """Error response model"""
    success: bool = False
    error: Dict[str, Any]
    status_code: int = 500

class PaginatedResponse(BaseResponse):
    """Paginated response model"""
    data: List[Any]
    pagination: Dict[str, Any]

# ============================================================================
# USER MODELS
# ============================================================================

class UserRole(str, Enum):
    """User roles"""
    STUDENT = "student"
    INSTRUCTOR = "instructor"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

class UserStatus(str, Enum):
    """User status"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"

class UserBase(BaseModel):
    """Base user model"""
    email: EmailStr
    first_name: str = Field(..., min_length=1, max_length=50)
    last_name: str = Field(..., min_length=1, max_length=50)
    phone: Optional[str] = None
    
    @validator('phone')
    def validate_phone(cls, v):
        if v and not v.replace('+', '').replace(' ', '').replace('-', '').isdigit():
            raise ValueError('Invalid phone number')
        return v

class UserCreate(UserBase):
    """User creation model"""
    password: str = Field(..., min_length=8)
    confirm_password: str
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v
    
    @validator('password')
    def password_strength(cls, v):
        import re
        if not re.match(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$', v):
            raise ValueError('Password must contain uppercase, lowercase, number, and special character')
        return v

class UserUpdate(BaseModel):
    """User update model"""
    first_name: Optional[str] = Field(None, min_length=1, max_length=50)
    last_name: Optional[str] = Field(None, min_length=1, max_length=50)
    phone: Optional[str] = None
    avatar_url: Optional[HttpUrl] = None

class UserResponse(UserBase):
    """User response model"""
    id: str
    role: UserRole = UserRole.STUDENT
    status: UserStatus = UserStatus.ACTIVE
    avatar_url: Optional[str] = None
    email_verified: bool = False
    phone_verified: bool = False
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    """User login model"""
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    """Token response model"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserResponse

class PasswordResetRequest(BaseModel):
    """Password reset request model"""
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    """Password reset confirmation model"""
    token: str
    new_password: str
    confirm_password: str
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'new_password' in values and v != values['new_password']:
            raise ValueError('Passwords do not match')
        return v

# ============================================================================
# ASSESSMENT MODELS
# ============================================================================

class QuestionType(str, Enum):
    """Question types"""
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"
    ESSAY = "essay"
    RATING = "rating"

class DifficultyLevel(str, Enum):
    """Difficulty levels"""
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

class QuestionOption(BaseModel):
    """Question option model"""
    id: str
    text: str
    is_correct: bool = False
    explanation: Optional[str] = None

class QuestionBase(BaseModel):
    """Base question model"""
    text: str = Field(..., min_length=1)
    type: QuestionType
    options: Optional[List[QuestionOption]] = None
    correct_answer: Optional[Union[str, List[str]]] = None
    points: int = Field(1, ge=1, le=100)
    difficulty: DifficultyLevel = DifficultyLevel.MEDIUM
    time_limit: Optional[int] = Field(None, ge=0)  # in seconds
    explanation: Optional[str] = None
    
    @validator('options')
    def validate_options(cls, v, values):
        if values.get('type') == QuestionType.MULTIPLE_CHOICE and (not v or len(v) < 2):
            raise ValueError('Multiple choice questions must have at least 2 options')
        return v
    
    @validator('correct_answer')
    def validate_correct_answer(cls, v, values):
        question_type = values.get('type')
        
        if question_type in [QuestionType.MULTIPLE_CHOICE, QuestionType.TRUE_FALSE] and not v:
            raise ValueError(f'Correct answer is required for {question_type} questions')
        
        if question_type == QuestionType.MULTIPLE_CHOICE and values.get('options'):
            option_ids = [option.id for option in values['options']]
            if isinstance(v, list):
                for answer in v:
                    if answer not in option_ids:
                        raise ValueError(f'Correct answer {answer} not found in options')
            elif v not in option_ids:
                raise ValueError(f'Correct answer {v} not found in options')
        
        return v

class AssessmentStatus(str, Enum):
    """Assessment status"""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

class AssessmentSettings(BaseModel):
    """Assessment settings model"""
    shuffle_questions: bool = False
    shuffle_options: bool = False
    show_correct_answers: bool = False
    allow_back_navigation: bool = True
    show_progress: bool = True
    require_fullscreen: bool = False
    enable_proctoring: bool = False
    time_limit: Optional[int] = Field(None, ge=0)  # in minutes

class AssessmentBase(BaseModel):
    """Base assessment model"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    instructions: Optional[str] = None
    settings: AssessmentSettings = Field(default_factory=AssessmentSettings)

class AssessmentCreate(AssessmentBase):
    """Assessment creation model"""
    questions: List[QuestionBase] = Field(..., min_items=1)
    accessible_by: Optional[List[str]] = None  # List of user IDs or "public"

class AssessmentUpdate(BaseModel):
    """Assessment update model"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    instructions: Optional[str] = None
    settings: Optional[AssessmentSettings] = None
    status: Optional[AssessmentStatus] = None

class AssessmentResponse(AssessmentBase):
    """Assessment response model"""
    id: str
    created_by: str
    status: AssessmentStatus = AssessmentStatus.DRAFT
    questions: List[Dict[str, Any]]  # Full question data
    accessible_by: List[str]
    total_points: int
    total_questions: int
    estimated_time: int  # in minutes
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============================================================================
# RESULT & SUBMISSION MODELS
# ============================================================================

class SubmissionAnswer(BaseModel):
    """Submission answer model"""
    question_id: str
    answer: Union[str, List[str], Dict[str, Any]]
    time_spent: int = 0  # in seconds

class AssessmentSubmission(BaseModel):
    """Assessment submission model"""
    assessment_id: str
    answers: List[SubmissionAnswer]
    time_spent: int = 0  # total time in seconds
    metadata: Optional[Dict[str, Any]] = None

class ResultStatus(str, Enum):
    """Result status"""
    PENDING = "pending"
    GRADED = "graded"
    REVIEW_NEEDED = "review_needed"
    INVALID = "invalid"

class ResultResponse(BaseModel):
    """Result response model"""
    id: str
    assessment_id: str
    user_id: str
    score: float = Field(..., ge=0, le=100)
    correct_answers: int
    total_questions: int
    status: ResultStatus
    time_spent: int  # in seconds
    answers: List[Dict[str, Any]]
    feedback: Optional[str] = None
    graded_by: Optional[str] = None
    submitted_at: datetime
    graded_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============================================================================
# REPORT MODELS
# ============================================================================

class ReportType(str, Enum):
    """Report types"""
    DETAILED = "detailed"
    SUMMARY = "summary"
    CERTIFICATE = "certificate"

class ReportStatus(str, Enum):
    """Report status"""
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class ReportGenerate(BaseModel):
    """Report generation request model"""
    result_id: str
    type: ReportType = ReportType.DETAILED
    template_id: Optional[str] = "default"
    include_recommendations: bool = True
    include_comparative_analysis: bool = False

class ReportResponse(BaseModel):
    """Report response model"""
    id: str
    result_id: str
    user_id: str
    assessment_id: str
    type: ReportType
    status: ReportStatus
    download_url: Optional[str] = None
    file_size: Optional[int] = None
    metadata: Dict[str, Any]
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============================================================================
# NOTIFICATION & WEBHOOK MODELS
# ============================================================================

class NotificationType(str, Enum):
    """Notification types"""
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    WEBHOOK = "webhook"

class NotificationStatus(str, Enum):
    """Notification status"""
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    DELIVERED = "delivered"
    READ = "read"

class NotificationCreate(BaseModel):
    """Notification creation model"""
    user_id: str
    type: NotificationType
    title: str
    message: str
    data: Optional[Dict[str, Any]] = None
    priority: int = Field(1, ge=1, le=5)  # 1=lowest, 5=highest

class WebhookEventType(str, Enum):
    """Webhook event types"""
    USER_REGISTERED = "user.registered"
    ASSESSMENT_CREATED = "assessment.created"
    ASSESSMENT_SUBMITTED = "assessment.submitted"
    REPORT_GENERATED = "report.generated"
    PAYMENT_RECEIVED = "payment.received"
    WEBHOOK_TEST = "webhook.test"

class WebhookCreate(BaseModel):
    """Webhook creation model"""
    url: HttpUrl
    events: List[WebhookEventType]
    secret: Optional[str] = None
    enabled: bool = True
    headers: Optional[Dict[str, str]] = None
    retry_policy: Optional[Dict[str, Any]] = None

class WebhookResponse(BaseModel):
    """Webhook response model"""
    id: str
    user_id: str
    url: str
    events: List[WebhookEventType]
    status: str  # active, inactive, suspended
    delivery_count: int = 0
    success_count: int = 0
    last_delivery_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# ============================================================================
# FILE & MEDIA MODELS
# ============================================================================

class FileUploadRequest(BaseModel):
    """File upload request model"""
    filename: str
    content_type: str
    file_size: int = Field(..., ge=1)
    folder: Optional[str] = None
    
    @validator('content_type')
    def validate_content_type(cls, v):
        allowed_types = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        if v not in allowed_types:
            raise ValueError(f'Content type {v} not allowed')
        return v
    
    @validator('file_size')
    def validate_file_size(cls, v):
        max_size = 10 * 1024 * 1024  # 10MB
        if v > max_size:
            raise ValueError(f'File size exceeds maximum of {max_size} bytes')
        return v

class FileUploadResponse(BaseModel):
    """File upload response model"""
    upload_url: str
    file_url: str
    fields: Dict[str, str]
    expires_at: datetime

# ============================================================================
# SEARCH & FILTER MODELS
# ============================================================================

class SearchParams(BaseModel):
    """Search parameters model"""
    query: Optional[str] = None
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)
    sort_by: Optional[str] = None
    sort_order: Optional[str] = Field("desc", regex="^(asc|desc)$")

class AssessmentFilter(SearchParams):
    """Assessment filter model"""
    category: Optional[str] = None
    difficulty: Optional[DifficultyLevel] = None
    status: Optional[AssessmentStatus] = None
    created_by: Optional[str] = None
    tags: Optional[List[str]] = None
    min_points: Optional[int] = Field(None, ge=1)
    max_points: Optional[int] = Field(None, ge=1)

class UserFilter(SearchParams):
    """User filter model"""
    role: Optional[UserRole] = None
    status: Optional[UserStatus] = None
    email_verified: Optional[bool] = None
    date_from: Optional[date] = None
    date_to: Optional[date] = None

# ============================================================================
# ANALYTICS MODELS
# ============================================================================

class AnalyticsTimeRange(str, Enum):
    """Analytics time ranges"""
    TODAY = "today"
    YESTERDAY = "yesterday"
    LAST_7_DAYS = "last_7_days"
    LAST_30_DAYS = "last_30_days"
    THIS_MONTH = "this_month"
    LAST_MONTH = "last_month"
    CUSTOM = "custom"

class AnalyticsRequest(BaseModel):
    """Analytics request model"""
    time_range: AnalyticsTimeRange = AnalyticsTimeRange.LAST_7_DAYS
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    group_by: Optional[str] = Field(None, regex="^(day|week|month|year)$")
    
    @validator('end_date')
    def validate_dates(cls, v, values):
        if v and values.get('start_date') and v < values['start_date']:
            raise ValueError('End date must be after start date')
        return v

class AnalyticsResponse(BaseModel):
    """Analytics response model"""
    period: Dict[str, date]
    metrics: Dict[str, Any]
    trends: Dict[str, List[Dict[str, Any]]]
    top_items: Dict[str, List[Dict[str, Any]]]

# ============================================================================
# SYSTEM HEALTH MODELS
# ============================================================================

class HealthStatus(str, Enum):
    """Health status"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"

class ServiceHealth(BaseModel):
    """Service health model"""
    service: str
    status: HealthStatus
    response_time: Optional[int] = None  # in milliseconds
    error: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

class SystemHealthResponse(BaseModel):
    """System health response model"""
    status: HealthStatus
    timestamp: datetime
    uptime: float  # in seconds
    version: str
    services: List[ServiceHealth]