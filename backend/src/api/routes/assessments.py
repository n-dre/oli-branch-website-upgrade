"""
Assessment Routes

This module contains all API routes related to assessments.
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from pydantic import BaseModel, Field, validator

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/assessments", tags=["assessments"])


# ==================== Pydantic Models ====================
class Question(BaseModel):
    """Question model"""
    id: str
    text: str
    type: str = Field(..., regex="^(multiple_choice|true_false|short_answer|essay)$")
    options: Optional[List[str]] = None
    correct_answer: Optional[str] = None
    points: int = Field(1, ge=1, le=100)
    difficulty: str = Field("medium", regex="^(easy|medium|hard)$")
    
    @validator('options')
    def validate_options(cls, v, values):
        if values.get('type') == 'multiple_choice' and (not v or len(v) < 2):
            raise ValueError('Multiple choice questions require at least 2 options')
        return v
    
    @validator('correct_answer')
    def validate_correct_answer(cls, v, values):
        if values.get('type') in ['multiple_choice', 'true_false', 'short_answer'] and not v:
            raise ValueError('Correct answer is required for this question type')
        return v


class CreateAssessmentRequest(BaseModel):
    """Request model for creating assessment"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    questions: List[Question] = Field(..., min_items=1, max_items=100)
    duration_minutes: Optional[int] = Field(None, ge=1, le=480)
    passing_score: int = Field(70, ge=0, le=100)
    is_public: bool = False
    tags: Optional[List[str]] = None


class SubmitAssessmentRequest(BaseModel):
    """Request model for submitting assessment"""
    assessment_id: str
    answers: Dict[str, Any]  # question_id -> answer
    time_spent_seconds: Optional[int] = None


class AssessmentResponse(BaseModel):
    """Response model for assessment"""
    id: str
    title: str
    description: Optional[str]
    question_count: int
    total_points: int
    duration_minutes: Optional[int]
    passing_score: int
    is_public: bool
    tags: List[str]
    created_at: datetime
    updated_at: datetime


class AssessmentResultResponse(BaseModel):
    """Response model for assessment result"""
    assessment_id: str
    user_id: str
    score: float
    total_points: int
    earned_points: int
    correct_answers: int
    total_questions: int
    time_spent_seconds: Optional[int]
    passed: bool
    completed_at: datetime
    detailed_feedback: List[Dict[str, Any]]


# ==================== Route Handlers ====================
@router.get("/", response_model=List[AssessmentResponse])
async def get_assessments(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    is_public: Optional[bool] = None,
    search: Optional[str] = None
):
    """
    Get list of assessments with pagination.
    
    Args:
        skip: Number of items to skip
        limit: Maximum number of items to return
        is_public: Filter by public status
        search: Search in title and description
    """
    logger.info(f"Getting assessments: skip={skip}, limit={limit}, search={search}")
    
    # In a real application, this would query a database
    # For now, return mock data
    mock_assessments = [
        {
            "id": "assessment_001",
            "title": "Python Fundamentals Assessment",
            "description": "Test your knowledge of Python basics",
            "question_count": 20,
            "total_points": 100,
            "duration_minutes": 60,
            "passing_score": 70,
            "is_public": True,
            "tags": ["python", "programming", "fundamentals"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "id": "assessment_002",
            "title": "Web Development Quiz",
            "description": "Quiz on HTML, CSS, and JavaScript",
            "question_count": 15,
            "total_points": 75,
            "duration_minutes": 45,
            "passing_score": 65,
            "is_public": True,
            "tags": ["web", "html", "css", "javascript"],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    # Apply filters
    filtered = mock_assessments
    if is_public is not None:
        filtered = [a for a in filtered if a["is_public"] == is_public]
    if search:
        search_lower = search.lower()
        filtered = [
            a for a in filtered 
            if search_lower in a["title"].lower() or 
            (a["description"] and search_lower in a["description"].lower())
        ]
    
    # Apply pagination
    paginated = filtered[skip:skip + limit]
    
    return paginated


@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(assessment_id: str):
    """
    Get assessment by ID.
    
    Args:
        assessment_id: Assessment identifier
    """
    logger.info(f"Getting assessment: {assessment_id}")
    
    # In a real application, this would query a database
    # For now, return mock data
    if assessment_id not in ["assessment_001", "assessment_002"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    return {
        "id": assessment_id,
        "title": "Python Fundamentals Assessment",
        "description": "Test your knowledge of Python basics",
        "question_count": 20,
        "total_points": 100,
        "duration_minutes": 60,
        "passing_score": 70,
        "is_public": True,
        "tags": ["python", "programming", "fundamentals"],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }


@router.post("/", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(assessment_data: CreateAssessmentRequest):
    """
    Create a new assessment.
    
    Args:
        assessment_data: Assessment data
    """
    logger.info(f"Creating assessment: {assessment_data.title}")
    
    # Calculate total points
    total_points = sum(q.points for q in assessment_data.questions)
    
    # In a real application, this would save to a database
    # For now, return mock response
    return {
        "id": f"assessment_{int(datetime.utcnow().timestamp())}",
        "title": assessment_data.title,
        "description": assessment_data.description,
        "question_count": len(assessment_data.questions),
        "total_points": total_points,
        "duration_minutes": assessment_data.duration_minutes,
        "passing_score": assessment_data.passing_score,
        "is_public": assessment_data.is_public,
        "tags": assessment_data.tags or [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }


@router.post("/{assessment_id}/submit", response_model=AssessmentResultResponse)
async def submit_assessment(
    assessment_id: str,
    submission_data: SubmitAssessmentRequest
):
    """
    Submit assessment for grading.
    
    Args:
        assessment_id: Assessment identifier
        submission_data: Submission data including answers
    """
    logger.info(f"Submitting assessment: {assessment_id}")
    
    # Validate assessment exists
    if assessment_id not in ["assessment_001", "assessment_002"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    # In a real application, this would:
    # 1. Get assessment questions from database
    # 2. Calculate score
    # 3. Save result to database
    # 4. Return result
    
    # Mock calculation
    total_questions = 20
    correct_answers = 15
    total_points = 100
    earned_points = 75
    score = (earned_points / total_points) * 100
    passed = score >= 70
    
    return {
        "assessment_id": assessment_id,
        "user_id": "user_123",  # Would come from authentication
        "score": round(score, 2),
        "total_points": total_points,
        "earned_points": earned_points,
        "correct_answers": correct_answers,
        "total_questions": total_questions,
        "time_spent_seconds": submission_data.time_spent_seconds,
        "passed": passed,
        "completed_at": datetime.utcnow(),
        "detailed_feedback": [
            {
                "question_id": str(i),
                "correct": i < correct_answers,
                "feedback": "Good job!" if i < correct_answers else "Review this topic"
            }
            for i in range(total_questions)
        ]
    }


@router.get("/{assessment_id}/results")
async def get_assessment_results(
    assessment_id: str,
    user_id: Optional[str] = None
):
    """
    Get assessment results.
    
    Args:
        assessment_id: Assessment identifier
        user_id: Optional user ID filter
    """
    logger.info(f"Getting results for assessment: {assessment_id}")
    
    # Validate assessment exists
    if assessment_id not in ["assessment_001", "assessment_002"]:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found"
        )
    
    # In a real application, this would query results from database
    mock_results = [
        {
            "user_id": "user_123",
            "score": 85.5,
            "passed": True,
            "completed_at": datetime.utcnow(),
            "time_spent_seconds": 1800
        },
        {
            "user_id": "user_456",
            "score": 65.0,
            "passed": False,
            "completed_at": datetime.utcnow(),
            "time_spent_seconds": 2100
        }
    ]
    
    # Filter by user_id if provided
    if user_id:
        mock_results = [r for r in mock_results if r["user_id"] == user_id]
    
    return {
        "assessment_id": assessment_id,
        "total_submissions": len(mock_results),
        "average_score": sum(r["score"] for r in mock_results) / len(mock_results) if mock_results else 0,
        "pass_rate": sum(1 for r in mock_results if r["passed"]) / len(mock_results) if mock_results else 0,
        "results": mock_results
    }


@router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_assessment(assessment_id: str):
    """
    Delete assessment.
    
    Args:
        assessment_id: Assessment identifier
    """
    logger.info(f"Deleting assessment: {assessment_id}")
    
    # In a real application, this would delete from database
    # For now, just return success
    return


# Export router
__all__ = ["router"]