# backend/src/models/assessment.py
"""
Assessment Model
Comprehensive assessment model for Oli-Branch
Combines simplified financial assessment with detailed questionnaire capabilities
"""

import uuid
from datetime import datetime
from typing import Optional, List
from enum import Enum as PyEnum

from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime, 
    Text, ForeignKey, Float, Enum, JSON, Numeric
)
from sqlalchemy.orm import relationship, validates
from sqlalchemy.dialects.postgresql import UUID as PGUUID

from . import Base


class AssessmentStatus(str, PyEnum):
    """Assessment status enumeration"""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"
    COMPLETED = "completed"


class QuestionType(str, PyEnum):
    """Question type enumeration"""
    MULTIPLE_CHOICE = "multiple_choice"
    SINGLE_CHOICE = "single_choice"
    TEXT = "text"
    RATING = "rating"
    LIKERT_SCALE = "likert_scale"
    YES_NO = "yes_no"
    NUMERIC = "numeric"  # For financial numbers
    CURRENCY = "currency"  # For dollar amounts


class Assessment(Base):
    """
    Comprehensive Assessment model for Oli-Branch
    
    Handles:
    - Financial intake assessments (simplified version)
    - Detailed questionnaires with multiple question types
    - Scoring and result tracking
    - Business relationship management
    """
    __tablename__ = "assessments"
    
    # ==================== PRIMARY KEY ====================
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # ==================== BASIC INFORMATION ====================
    title = Column(String(500), nullable=False, default="Financial Assessment")
    description = Column(Text)
    code = Column(String(50), unique=True, index=True, nullable=True)  # Human-readable identifier
    
    # ==================== FINANCIAL DATA (From simplified version) ====================
    business_type = Column(String)
    monthly_revenue = Column(Numeric(14, 2))
    monthly_expenses = Column(Numeric(14, 2))
    bank_used = Column(String)
    fees_paid = Column(Text)  # Raw user input
    payment_methods = Column(Text)  # Raw user input
    loans_taken = Column(Text)  # Raw user input
    services_used = Column(Text)  # Raw user input
    
    # ==================== ADDITIONAL FINANCIAL FIELDS ====================
    cash_balance = Column(Numeric(14, 2))
    has_employees = Column(Boolean, default=False)
    employee_count = Column(Integer)
    account_types = Column(JSON)  # ["checking", "savings", "credit"]
    fee_comfort_level = Column(String)  # low, medium, high
    payment_methods_json = Column(JSON)  # Structured payment methods
    card_processor = Column(String)
    ach_volume_monthly = Column(Integer)
    wire_volume_monthly = Column(Integer)
    has_business_loan = Column(Boolean, default=False)
    loan_amount = Column(Numeric(14, 2))
    loan_interest_rate = Column(Numeric(5, 3))
    has_personal_loan_for_business = Column(Boolean, default=False)
    software_spend_monthly = Column(Numeric(10, 2))
    
    # ==================== GOALS ====================
    primary_goal = Column(String)  # reduce_fees, grow_cash, optimize_operations
    time_horizon = Column(String)  # immediate, quarterly, annual
    
    # ==================== ASSESSMENT CONFIGURATION ====================
    instructions = Column(Text)
    duration_minutes = Column(Integer)  # Optional time limit
    passing_score = Column(Float)  # Optional passing score threshold
    max_attempts = Column(Integer, default=1)  # Number of allowed attempts
    
    # ==================== STATUS AND VISIBILITY ====================
    status = Column(Enum(AssessmentStatus), default=AssessmentStatus.DRAFT, index=True)
    is_public = Column(Boolean, default=False)
    requires_login = Column(Boolean, default=True)
    
    # ==================== METADATA ====================
    tags = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)  # Additional configuration
    
    # ==================== TIMESTAMPS ====================
    submitted_at = Column(DateTime, default=datetime.utcnow)  # From simplified version
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime, nullable=True)
    
    # ==================== FOREIGN KEYS ====================
    business_id = Column(PGUUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    created_by = Column(PGUUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    
    # ==================== RELATIONSHIPS ====================
    business = relationship("Business", back_populates="assessments")
    user = relationship("User", foreign_keys=[created_by])
    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan", order_by="Question.order")
    results = relationship("AssessmentResult", back_populates="assessment", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="assessment")
    
    # ==================== METHODS ====================
    
    def __repr__(self):
        return f"<Assessment(id={self.id}, title={self.title}, business_id={self.business_id}, status={self.status})>"
    
    @validates('code')
    def validate_code(self, key, code):
        """Validate assessment code format"""
        if code and not code.replace('_', '').replace('-', '').isalnum():
            raise ValueError("Assessment code can only contain alphanumeric characters, underscores, and hyphens")
        return code.lower() if code else code
    
    @property
    def question_count(self) -> int:
        """Get number of questions"""
        return len(self.questions) if self.questions else 0
    
    @property
    def total_points(self) -> float:
        """Calculate total possible points"""
        return sum(q.points for q in self.questions) if self.questions else 0
    
    def is_published(self) -> bool:
        """Check if assessment is published"""
        return self.status == AssessmentStatus.PUBLISHED
    
    def is_completed(self) -> bool:
        """Check if assessment is completed"""
        return self.status == AssessmentStatus.COMPLETED
    
    def can_take_assessment(self, user_attempts: int = 0) -> bool:
        """Check if assessment can be taken"""
        if not self.is_published():
            return False
        if self.max_attempts and user_attempts >= self.max_attempts:
            return False
        return True
    
    def get_financial_summary(self) -> dict:
        """Get financial data summary (from simplified version)"""
        return {
            "business_type": self.business_type,
            "monthly_revenue": float(self.monthly_revenue) if self.monthly_revenue else None,
            "monthly_expenses": float(self.monthly_expenses) if self.monthly_expenses else None,
            "bank_used": self.bank_used,
            "fees_paid": self.fees_paid,
            "payment_methods": self.payment_methods,
            "loans_taken": self.loans_taken,
            "services_used": self.services_used,
            "primary_goal": self.primary_goal
        }
    
    def get_detailed_financials(self) -> dict:
        """Get detailed financial data"""
        return {
            "cash_balance": float(self.cash_balance) if self.cash_balance else None,
            "has_employees": self.has_employees,
            "employee_count": self.employee_count,
            "account_types": self.account_types,
            "fee_comfort_level": self.fee_comfort_level,
            "payment_methods_json": self.payment_methods_json,
            "card_processor": self.card_processor,
            "ach_volume_monthly": self.ach_volume_monthly,
            "wire_volume_monthly": self.wire_volume_monthly,
            "has_business_loan": self.has_business_loan,
            "loan_amount": float(self.loan_amount) if self.loan_amount else None,
            "loan_interest_rate": float(self.loan_interest_rate) if self.loan_interest_rate else None,
            "has_personal_loan_for_business": self.has_personal_loan_for_business,
            "software_spend_monthly": float(self.software_spend_monthly) if self.software_spend_monthly else None,
            "time_horizon": self.time_horizon
        }


class Question(Base):
    """
    Question model for assessment questions
    """
    __tablename__ = "questions"
    
    # Primary key
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Question content
    text = Column(Text, nullable=False)
    description = Column(Text)  # Additional context or instructions
    
    # Question configuration
    type = Column(Enum(QuestionType), nullable=False, index=True)
    order = Column(Integer, default=0)  # For ordering questions
    points = Column(Float, default=1.0)  # Points for correct answer
    is_required = Column(Boolean, default=True)
    
    # Options for multiple/single choice questions
    options = Column(JSON, default=list)  # List of option dicts: {"id": 1, "text": "Option", "points": 1.0, "is_correct": false}
    
    # Validation and constraints
    min_length = Column(Integer)  # For text questions
    max_length = Column(Integer)  # For text questions
    min_value = Column(Float)  # For rating questions
    max_value = Column(Float)  # For rating questions
    
    # For financial questions
    currency = Column(String(3), default="USD")  # For currency type questions
    format_pattern = Column(String)  # Regex pattern for validation
    
    # Metadata
    tags = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    assessment_id = Column(PGUUID(as_uuid=True), ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Relationships
    assessment = relationship("Assessment", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")
    
    # Methods
    def __repr__(self):
        return f"<Question(id={self.id}, type={self.type}, assessment_id={self.assessment_id})>"
    
    @property
    def is_multiple_choice(self) -> bool:
        """Check if question is multiple choice"""
        return self.type in [QuestionType.MULTIPLE_CHOICE, QuestionType.SINGLE_CHOICE]
    
    @property
    def correct_options(self) -> List[dict]:
        """Get correct options for scoring"""
        if not self.is_multiple_choice:
            return []
        return [opt for opt in self.options if opt.get("is_correct", False)]
    
    def validate_answer(self, answer_data: dict) -> bool:
        """Validate answer data based on question type"""
        if self.type == QuestionType.TEXT:
            text = answer_data.get("text", "").strip()
            if self.min_length and len(text) < self.min_length:
                return False
            if self.max_length and len(text) > self.max_length:
                return False
            return True
        
        elif self.type == QuestionType.CURRENCY:
            amount = answer_data.get("amount")
            if amount is None:
                return not self.is_required
            try:
                float(amount)
                return True
            except (ValueError, TypeError):
                return False
        
        elif self.type in [QuestionType.MULTIPLE_CHOICE, QuestionType.SINGLE_CHOICE]:
            selected_ids = answer_data.get("selected_ids", [])
            if not selected_ids:
                return not self.is_required
            
            # Validate that selected IDs exist in options
            valid_ids = [opt["id"] for opt in self.options]
            return all(sid in valid_ids for sid in selected_ids)
        
        elif self.type == QuestionType.RATING:
            rating = answer_data.get("rating")
            if rating is None:
                return not self.is_required
            if self.min_value and rating < self.min_value:
                return False
            if self.max_value and rating > self.max_value:
                return False
            return True
        
        elif self.type == QuestionType.NUMERIC:
            value = answer_data.get("value")
            if value is None:
                return not self.is_required
            try:
                float(value)
                return True
            except (ValueError, TypeError):
                return False
        
        return True  # Default validation


class Answer(Base):
    """
    Answer model for user responses to questions
    """
    __tablename__ = "answers"
    
    # Primary key
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Answer data (stored based on question type)
    text = Column(Text)  # For text questions
    selected_ids = Column(JSON, default=list)  # For multiple/single choice
    rating = Column(Float)  # For rating questions
    amount = Column(Numeric(14, 2))  # For currency questions
    numeric_value = Column(Float)  # For numeric questions
    answer_data = Column(JSON, default=dict)  # Flexible storage for all types
    
    # Scoring
    points_awarded = Column(Float, default=0.0)
    is_correct = Column(Boolean, default=False)
    feedback = Column(Text)  # Automated or manual feedback
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    question_id = Column(PGUUID(as_uuid=True), ForeignKey('questions.id', ondelete='CASCADE'), nullable=False, index=True)
    result_id = Column(PGUUID(as_uuid=True), ForeignKey('assessment_results.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Relationships
    question = relationship("Question", back_populates="answers")
    result = relationship("AssessmentResult", back_populates="answers")
    
    # Methods
    def __repr__(self):
        return f"<Answer(id={self.id}, question_id={self.question_id}, points={self.points_awarded})>"
    
    def calculate_score(self) -> float:
        """Calculate score for this answer"""
        if not self.question:
            return 0.0
        
        question = self.question
        
        if question.type == QuestionType.MULTIPLE_CHOICE:
            correct_ids = {opt["id"] for opt in question.correct_options}
            selected_ids = set(self.selected_ids)
            
            if correct_ids == selected_ids:
                return question.points
            elif selected_ids.issubset(correct_ids):
                # Partial credit for partially correct answers
                return (len(selected_ids) / len(correct_ids)) * question.points
            else:
                return 0.0
        
        elif question.type == QuestionType.SINGLE_CHOICE:
            if not self.selected_ids:
                return 0.0
            
            selected_id = self.selected_ids[0]
            correct_option = next((opt for opt in question.correct_options if opt["id"] == selected_id), None)
            return question.points if correct_option else 0.0
        
        elif question.type == QuestionType.RATING:
            if self.rating is None:
                return 0.0
            max_value = question.max_value or 5
            return (self.rating / max_value) * question.points
        
        elif question.type == QuestionType.CURRENCY:
            if self.amount is None:
                return 0.0
            # For financial questions, scoring might be based on ranges
            return question.points
        
        return 0.0


class AssessmentResult(Base):
    """
    Assessment result model for completed assessments
    """
    __tablename__ = "assessment_results"
    
    # Primary key
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Result data
    score = Column(Float, default=0.0)
    total_points = Column(Float, default=0.0)
    percentage = Column(Float, default=0.0)  # score / total_points * 100
    passed = Column(Boolean, default=False)
    
    # Financial results (from simplified version)
    financial_health_score = Column(Integer)  # 0-100
    mismatch_score = Column(Integer)  # 0-100
    risk_label = Column(String)  # High/Medium/Low
    health_label = Column(String)  # Healthy/Needs optimization/At risk/Critical
    total_monthly_leaks = Column(Numeric(14, 2))
    total_annual_leaks = Column(Numeric(14, 2))
    
    # Completion data
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    duration_seconds = Column(Integer)  # Time taken in seconds
    
    # Attempt information
    attempt_number = Column(Integer, default=1)
    is_final = Column(Boolean, default=True)
    
    # Feedback and review
    feedback = Column(Text)
    reviewed_by = Column(PGUUID(as_uuid=True), ForeignKey('users.id'), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    
    # Metadata
    metadata = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    assessment_id = Column(PGUUID(as_uuid=True), ForeignKey('assessments.id', ondelete='CASCADE'), nullable=False, index=True)
    user_id = Column(PGUUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    
    # Relationships
    assessment = relationship("Assessment", back_populates="results")
    user = relationship("User")
    answers = relationship("Answer", back_populates="result", cascade="all, delete-orphan")
    
    # Methods
    def __repr__(self):
        return f"<AssessmentResult(id={self.id}, assessment_id={self.assessment_id}, score={self.score})>"
    
    def calculate_score(self):
        """Calculate total score from answers"""
        if not self.answers:
            self.score = 0.0
            self.total_points = self.assessment.total_points if self.assessment else 0.0
        else:
            self.score = sum(answer.points_awarded for answer in self.answers)
            self.total_points = self.assessment.total_points if self.assessment else 0.0
        
        # Calculate percentage
        if self.total_points > 0:
            self.percentage = (self.score / self.total_points) * 100
        
        # Check if passed
        if self.assessment and self.assessment.passing_score:
            self.passed = self.percentage >= self.assessment.passing_score
    
    def get_duration(self) -> Optional[int]:
        """Get duration in seconds if completed"""
        if self.started_at and self.completed_at:
            return int((self.completed_at - self.started_at).total_seconds())
        return None
    
    def get_financial_summary(self) -> dict:
        """Get financial results summary"""
        return {
            "financial_health_score": self.financial_health_score,
            "mismatch_score": self.mismatch_score,
            "risk_label": self.risk_label,
            "health_label": self.health_label,
            "total_monthly_leaks": float(self.total_monthly_leaks) if self.total_monthly_leaks else 0,
            "total_annual_leaks": float(self.total_annual_leaks) if self.total_annual_leaks else 0
        }