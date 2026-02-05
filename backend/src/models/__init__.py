"""
Models Module
SQLAlchemy models for the application
"""

from .user import User, UserProfile, UserRole
from .assessment import Assessment, Question, Answer, AssessmentResult
from .report import Report, ReportSection, ReportData

# Export all models
__all__ = [
    # User models
    'User',
    'UserProfile',
    'UserRole',
    
    # Assessment models
    'Assessment',
    'Question',
    'Answer',
    'AssessmentResult',
    
    # Report models
    'Report',
    'ReportSection',
    'ReportData',
]

# Convenience imports for common use cases
def get_all_models():
    """Get all SQLAlchemy models"""
    return [
        User,
        UserProfile,
        UserRole,
        Assessment,
        Question,
        Answer,
        AssessmentResult,
        Report,
        ReportSection,
        ReportData,
    ]

def get_model_by_name(model_name: str):
    """Get a model class by its name"""
    models_dict = {
        'User': User,
        'UserProfile': UserProfile,
        'UserRole': UserRole,
        'Assessment': Assessment,
        'Question': Question,
        'Answer': Answer,
        'AssessmentResult': AssessmentResult,
        'Report': Report,
        'ReportSection': ReportSection,
        'ReportData': ReportData,
    }
    return models_dict.get(model_name)

# Model relationships helper
def setup_model_relationships():
    """Helper to ensure all relationships are properly set up"""
    # This function doesn't need to do anything if relationships are properly defined
    # in the model classes, but it can be used to verify or debug relationships
    pass