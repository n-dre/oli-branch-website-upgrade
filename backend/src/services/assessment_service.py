"""
Assessment Service - Core business logic for processing assessments
"""
import logging
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
from dataclasses import dataclass
import asyncio
import random

logger = logging.getLogger(__name__)

@dataclass
class AssessmentResult:
    """Assessment result data structure"""
    assessment_id: str
    questions: List[Dict[str, Any]]
    answers: Dict[str, Any]
    score: float
    total_points: float
    earned_points: float
    correct_answers: int
    total_questions: int
    time_spent: Optional[int]  # in seconds
    generated_at: datetime
    detailed_feedback: List[Dict[str, Any]]

class AssessmentService:
    """Service for processing assessments and calculating scores"""
    
    def __init__(self):
        self._cache = {}
    
    async def process_assessment(
        self,
        questions: List[Dict[str, Any]],
        answers: Dict[str, Any],
        time_spent: Optional[int] = None
    ) -> AssessmentResult:
        """
        Process an assessment submission
        
        Args:
            questions: List of assessment questions
            answers: User's answers
            time_spent: Time spent on assessment in seconds
        
        Returns:
            Assessment result
        """
        logger.info(f"Processing assessment with {len(questions)} questions")
        
        try:
            # Generate assessment ID
            assessment_id = self._generate_assessment_id(questions, answers)
            
            # Calculate score
            total_points = sum(q.get('points', 1) for q in questions)
            earned_points = 0
            correct_answers = 0
            
            # Calculate detailed results
            detailed_feedback = []
            
            for i, question in enumerate(questions):
                question_id = str(i)
                user_answer = answers.get(question_id)
                correct_answer = question.get('correctAnswer')
                question_points = question.get('points', 1)
                question_type = question.get('type', 'multiple_choice')
                
                is_correct = self._check_answer(
                    user_answer, 
                    correct_answer, 
                    question_type
                )
                
                if is_correct:
                    earned_points += question_points
                    correct_answers += 1
                
                # Create detailed feedback for this question
                feedback = {
                    'question_id': question_id,
                    'question_text': question.get('text', f'Question {i+1}'),
                    'question_type': question_type,
                    'user_answer': user_answer,
                    'correct_answer': correct_answer,
                    'is_correct': is_correct,
                    'points_earned': question_points if is_correct else 0,
                    'total_points': question_points,
                    'explanation': question.get('explanation', '')
                }
                detailed_feedback.append(feedback)
            
            # Calculate final score
            score = (earned_points / total_points * 100) if total_points > 0 else 0
            
            # Create result
            result = AssessmentResult(
                assessment_id=assessment_id,
                questions=questions,
                answers=answers,
                score=round(score, 2),
                total_points=total_points,
                earned_points=earned_points,
                correct_answers=correct_answers,
                total_questions=len(questions),
                time_spent=time_spent,
                generated_at=datetime.utcnow(),
                detailed_feedback=detailed_feedback
            )
            
            # Cache result
            self._cache[assessment_id] = result
            
            logger.info(f"Assessment completed: {assessment_id}, Score: {score}%")
            return result
            
        except Exception as e:
            logger.error(f"Assessment processing failed: {str(e)}", exc_info=True)
            raise
    
    def calculate_score(
        self,
        questions: List[Dict[str, Any]],
        answers: Dict[str, Any]
    ) -> float:
        """
        Calculate score from questions and answers
        
        Args:
            questions: List of questions with correct answers and points
            answers: User's answers
            
        Returns:
            Score percentage (0-100)
        """
        total_points = sum(q.get('points', 1) for q in questions)
        earned_points = 0
        
        for i, question in enumerate(questions):
            question_id = str(i)
            user_answer = answers.get(question_id)
            correct_answer = question.get('correctAnswer')
            question_type = question.get('type', 'multiple_choice')
            
            if self._check_answer(user_answer, correct_answer, question_type):
                earned_points += question.get('points', 1)
        
        if total_points > 0:
            return (earned_points / total_points) * 100
        return 0
    
    def generate_summary(
        self,
        assessment_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate assessment summary
        
        Args:
            assessment_data: Assessment information
            
        Returns:
            Assessment summary
        """
        questions = assessment_data.get('questions', [])
        
        # Count question types
        question_types = {}
        for q in questions:
            q_type = q.get('type', 'unknown')
            question_types[q_type] = question_types.get(q_type, 0) + 1
        
        # Calculate estimated time (assuming different times per question type)
        time_per_question = {
            'multiple_choice': 1,  # minutes
            'true_false': 0.5,
            'short_answer': 2,
            'essay': 10,
            'coding': 15,
            'unknown': 1
        }
        
        estimated_time = sum(
            time_per_question.get(q.get('type', 'unknown'), 1)
            for q in questions
        )
        
        # Calculate difficulty distribution
        difficulties = {}
        for q in questions:
            difficulty = q.get('difficulty', 'medium')
            difficulties[difficulty] = difficulties.get(difficulty, 0) + 1
        
        return {
            'total_questions': len(questions),
            'question_types': question_types,
            'estimated_time_minutes': estimated_time,
            'difficulty_distribution': difficulties,
            'title': assessment_data.get('title', 'Untitled Assessment'),
            'description': assessment_data.get('description', ''),
            'passing_score': assessment_data.get('passing_score', 70),
            'has_time_limit': assessment_data.get('time_limit_minutes', 0) > 0,
            'time_limit_minutes': assessment_data.get('time_limit_minutes', 0)
        }
    
    def create_assessment(
        self,
        title: str,
        description: str,
        questions: List[Dict[str, Any]],
        settings: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create a new assessment
        
        Args:
            title: Assessment title
            description: Assessment description
            questions: List of questions
            settings: Additional settings
            
        Returns:
            Assessment data
        """
        if settings is None:
            settings = {}
        
        # Validate questions
        validated_questions = []
        for i, q in enumerate(questions):
            validated_q = self._validate_question(q, i)
            validated_questions.append(validated_q)
        
        assessment_id = f"assessment_{int(datetime.utcnow().timestamp())}_{random.randint(1000, 9999)}"
        
        return {
            'id': assessment_id,
            'title': title,
            'description': description,
            'questions': validated_questions,
            'settings': {
                'shuffle_questions': settings.get('shuffle_questions', False),
                'show_correct_answers': settings.get('show_correct_answers', True),
                'allow_retake': settings.get('allow_retake', False),
                'max_attempts': settings.get('max_attempts', 1),
                'passing_score': settings.get('passing_score', 70),
                'time_limit_minutes': settings.get('time_limit_minutes', 0),
                'require_fullscreen': settings.get('require_fullscreen', False),
                'enable_proctoring': settings.get('enable_proctoring', False)
            },
            'metadata': {
                'created_at': datetime.utcnow().isoformat(),
                'question_count': len(validated_questions),
                'total_points': sum(q.get('points', 1) for q in validated_questions),
                'version': '1.0'
            }
        }
    
    def get_question_statistics(
        self,
        question_id: str,
        submissions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Get statistics for a specific question
        
        Args:
            question_id: Question identifier
            submissions: List of assessment submissions
            
        Returns:
            Question statistics
        """
        total_attempts = len(submissions)
        correct_attempts = 0
        answer_distribution = {}
        
        for submission in submissions:
            answers = submission.get('answers', {})
            user_answer = answers.get(question_id)
            
            if user_answer is not None:
                answer_distribution[user_answer] = answer_distribution.get(user_answer, 0) + 1
                
                # Check if correct (would need the original questions for this)
                # For now, we'll assume we can't determine correctness without the questions
        
        return {
            'question_id': question_id,
            'total_attempts': total_attempts,
            'correct_attempts': correct_attempts,
            'accuracy_rate': (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0,
            'answer_distribution': answer_distribution,
            'discrimination_index': self._calculate_discrimination_index(question_id, submissions)
        }
    
    def _check_answer(
        self,
        user_answer: Any,
        correct_answer: Any,
        question_type: str
    ) -> bool:
        """
        Check if user's answer is correct
        
        Args:
            user_answer: User's answer
            correct_answer: Correct answer
            question_type: Type of question
            
        Returns:
            True if correct, False otherwise
        """
        if user_answer is None:
            return False
        
        # Handle different question types
        if question_type in ['multiple_choice', 'true_false', 'short_answer']:
            return str(user_answer).strip().lower() == str(correct_answer).strip().lower()
        
        elif question_type == 'essay':
            # For essay questions, we might want more complex checking
            # For now, just check if answer is provided
            return bool(str(user_answer).strip())
        
        elif question_type == 'coding':
            # For coding questions, would need to run tests
            # For now, just check if code is provided
            return bool(str(user_answer).strip())
        
        # Default: exact match
        return user_answer == correct_answer
    
    def _generate_assessment_id(
        self,
        questions: List[Dict[str, Any]],
        answers: Dict[str, Any]
    ) -> str:
        """Generate unique assessment ID"""
        import hashlib
        import json
        
        data = {
            'questions': questions,
            'answers': answers,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        data_str = json.dumps(data, sort_keys=True)
        hash_obj = hashlib.md5(data_str.encode())
        return f"assess_{hash_obj.hexdigest()[:12]}"
    
    def _validate_question(
        self,
        question: Dict[str, Any],
        index: int
    ) -> Dict[str, Any]:
        """Validate and normalize a question"""
        validated = question.copy()
        
        # Ensure required fields
        if 'text' not in validated:
            validated['text'] = f'Question {index + 1}'
        
        if 'type' not in validated:
            validated['type'] = 'multiple_choice'
        
        if 'points' not in validated:
            validated['points'] = 1
        
        if 'difficulty' not in validated:
            validated['difficulty'] = 'medium'
        
        # Validate question type
        valid_types = ['multiple_choice', 'true_false', 'short_answer', 'essay', 'coding']
        if validated['type'] not in valid_types:
            validated['type'] = 'multiple_choice'
        
        # Validate points
        if not isinstance(validated['points'], (int, float)) or validated['points'] < 0:
            validated['points'] = 1
        
        # Validate difficulty
        valid_difficulties = ['easy', 'medium', 'hard']
        if validated['difficulty'] not in valid_difficulties:
            validated['difficulty'] = 'medium'
        
        # For multiple choice, ensure options exist
        if validated['type'] == 'multiple_choice' and 'options' not in validated:
            validated['options'] = ['Option A', 'Option B', 'Option C', 'Option D']
        
        return validated
    
    def _calculate_discrimination_index(
        self,
        question_id: str,
        submissions: List[Dict[str, Any]]
    ) -> float:
        """
        Calculate discrimination index for a question
        
        Returns a value between -1 and 1 where:
        - Positive: Question discriminates well (high scorers get it right, low scorers get it wrong)
        - Near 0: Question doesn't discriminate
        - Negative: Question discriminates poorly (high scorers get it wrong, low scorers get it right)
        """
        # This is a simplified implementation
        # In a real system, you'd compare high-scoring vs low-scoring groups
        
        if len(submissions) < 2:
            return 0.0
        
        # For now, return a placeholder value
        return 0.0
    
    # Additional helper methods for your tests
    def get_cached_result(self, assessment_id: str) -> Optional[AssessmentResult]:
        """Get cached assessment result"""
        return self._cache.get(assessment_id)
    
    def clear_cache(self):
        """Clear the cache"""
        self._cache.clear()


# Create a global instance for easy import
assessment_service = AssessmentService()