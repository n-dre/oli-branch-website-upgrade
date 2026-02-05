"""
Assessment Models
Assessment, questions, answers, and results models
"""

import uuid
from datetime import datetime
from typing import Optional, List
from enum import Enum as PyEnum

from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime, 
    Text, ForeignKey, Float, Enum, JSON, UUID
)
from sqlalchemy.orm import relationship, validates
from sqlalchemy.dialects.postgresql import UUID as PGUUID

from database.database import Base


class AssessmentStatus(str, PyEnum):
    """Assessment status enumeration"""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class QuestionType(str, PyEnum):
    """Question type enumeration"""
    MULTIPLE_CHOICE = "multiple_choice"
    SINGLE_CHOICE = "single_choice"
    TEXT = "text"
    RATING = "rating"
    LIKERT_SCALE = "likert_scale"
    YES_NO = "yes_no"


class Assessment(Base):
    """
    Assessment model representing a survey or test
    """
    __tablename__ = "assessments"
    
    # Primary key
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Basic information
    title = Column(String(500), nullable=False, index=True)
    description = Column(Text)
    code = Column(String(50), unique=True, index=True)  # Human-readable identifier
    
    # Assessment configuration
    instructions = Column(Text)
    duration_minutes = Column(Integer)  # Optional time limit
    passing_score = Column(Float)  # Optional passing score threshold
    max_attempts = Column(Integer, default=1)  # Number of allowed attempts
    
    # Status and visibility
    status = Column(Enum(AssessmentStatus), default=AssessmentStatus.DRAFT, index=True)
    is_public = Column(Boolean, default=False)
    requires_login = Column(Boolean, default=True)
    
    # Metadata
    tags = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)  # Additional configuration
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime, nullable=True)
    
    # Foreign keys
    created_by = Column(PGUUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    
    # Relationships
    user = relationship("User", back_populates="assessments")
    questions = relationship("Question", back_populates="assessment", cascade="all, delete-orphan", order_by="Question.order")
    results = relationship("AssessmentResult", back_populates="assessment", cascade="all, delete-orphan")
    
    # Methods
    def __repr__(self):
        return f"<Assessment(id={self.id}, title={self.title}, status={self.status})>"
    
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
    
    def can_take_assessment(self, user_attempts: int = 0) -> bool:
        """Check if assessment can be taken"""
        if not self.is_published():
            return False
        if self.max_attempts and user_attempts >= self.max_attempts:
            return False
        return True


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
    options = Column(JSON, default=list)  # List of option dicts: {"id": 1, "text": "Option", "points": 1.0}
    
    # Validation and constraints
    min_length = Column(Integer)  # For text questions
    max_length = Column(Integer)  # For text questions
    min_value = Column(Float)  # For rating questions
    max_value = Column(Float)  # For rating questions
    
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
            # For rating questions, points are based on percentage of max
            max_value = question.max_value or 5
            return (self.rating / max_value) * question.points
        
        # For text and other question types, scoring might be manual
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