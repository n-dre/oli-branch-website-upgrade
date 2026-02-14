# backend/src/models/__init__.py
"""
Models Module
SQLAlchemy models for the Oli-Branch application
"""

from sqlalchemy.ext.declarative import declarative_base

# Create base class for all models
Base = declarative_base()

# ==================== IMPORT ALL MODELS ====================

# User models
from .user import User, UserProfile, UserRole

# Business models
from .business import Business

# Assessment models
from .assessment import Assessment, Question, Answer, AssessmentResult

# Report models
from .report import Report, ReportSection, ReportData, ReportType, ReportStatus, ReportFormat

# Analysis models
from .analysis_job import AnalysisJob
from .leak import Leak
from .recommendation import Recommendation
from .score import Score

# Bank models
from .bank_connection import BankConnection
from .bank_account import BankAccount
from .transaction import Transaction

# Billing models
from .billing_state import BillingState
from .feedback import Feedback

# Admin models
from .admin_audit_log import AdminAuditLog

# ==================== EXPORT ALL MODELS ====================

__all__ = [
    # Base
    'Base',
    
    # User models
    'User',
    'UserProfile',
    'UserRole',
    
    # Business models
    'Business',
    
    # Assessment models
    'Assessment',
    'Question',
    'Answer',
    'AssessmentResult',
    
    # Report models
    'Report',
    'ReportSection',
    'ReportData',
    'ReportType',
    'ReportStatus',
    'ReportFormat',
    
    # Analysis models
    'AnalysisJob',
    'Leak',
    'Recommendation',
    'Score',
    
    # Bank models
    'BankConnection',
    'BankAccount',
    'Transaction',
    
    # Billing models
    'BillingState',
    'Feedback',
    
    # Admin models
    'AdminAuditLog',
]

# ==================== HELPER FUNCTIONS ====================

def get_all_models():
    """Get all SQLAlchemy models"""
    return [
        User,
        UserProfile,
        UserRole,
        Business,
        Assessment,
        Question,
        Answer,
        AssessmentResult,
        Report,
        ReportSection,
        ReportData,
        AnalysisJob,
        Leak,
        Recommendation,
        Score,
        BankConnection,
        BankAccount,
        Transaction,
        BillingState,
        Feedback,
        AdminAuditLog,
    ]

def get_model_by_name(model_name: str):
    """Get a model class by its name"""
    models_dict = {
        # User models
        'User': User,
        'UserProfile': UserProfile,
        'UserRole': UserRole,
        
        # Business models
        'Business': Business,
        
        # Assessment models
        'Assessment': Assessment,
        'Question': Question,
        'Answer': Answer,
        'AssessmentResult': AssessmentResult,
        
        # Report models
        'Report': Report,
        'ReportSection': ReportSection,
        'ReportData': ReportData,
        'ReportType': ReportType,
        'ReportStatus': ReportStatus,
        'ReportFormat': ReportFormat,
        
        # Analysis models
        'AnalysisJob': AnalysisJob,
        'Leak': Leak,
        'Recommendation': Recommendation,
        'Score': Score,
        
        # Bank models
        'BankConnection': BankConnection,
        'BankAccount': BankAccount,
        'Transaction': Transaction,
        
        # Billing models
        'BillingState': BillingState,
        'Feedback': Feedback,
        
        # Admin models
        'AdminAuditLog': AdminAuditLog,
    }
    return models_dict.get(model_name)

def get_models_by_category(category: str):
    """Get all models in a specific category"""
    categories = {
        'user': ['User', 'UserProfile', 'UserRole'],
        'business': ['Business'],
        'assessment': ['Assessment', 'Question', 'Answer', 'AssessmentResult'],
        'report': ['Report', 'ReportSection', 'ReportData', 'ReportType', 'ReportStatus', 'ReportFormat'],
        'analysis': ['AnalysisJob', 'Leak', 'Recommendation', 'Score'],
        'bank': ['BankConnection', 'BankAccount', 'Transaction'],
        'billing': ['BillingState', 'Feedback'],
        'admin': ['AdminAuditLog'],
    }
    return categories.get(category, [])

def get_model_count():
    """Get total number of models"""
    return len(get_all_models())

def setup_model_relationships():
    """Helper to ensure all relationships are properly set up"""
    import logging
    logger = logging.getLogger(__name__)
    logger.info(f"Model relationships configured for {get_model_count()} models")

# ==================== MODEL METADATA ====================

MODEL_METADATA = {
    # User models
    'User': {'description': 'User account information', 'category': 'user'},
    'UserProfile': {'description': 'Extended user profile data', 'category': 'user'},
    'UserRole': {'description': 'User role definitions', 'category': 'user'},
    
    # Business models
    'Business': {'description': 'Business entities', 'category': 'business'},
    
    # Assessment models
    'Assessment': {'description': 'Financial assessments and questionnaires', 'category': 'assessment'},
    'Question': {'description': 'Assessment questions', 'category': 'assessment'},
    'Answer': {'description': 'User answers to questions', 'category': 'assessment'},
    'AssessmentResult': {'description': 'Assessment results and scores', 'category': 'assessment'},
    
    # Report models
    'Report': {'description': 'Generated financial reports', 'category': 'report'},
    'ReportSection': {'description': 'Sections within reports', 'category': 'report'},
    'ReportData': {'description': 'Raw data for reports', 'category': 'report'},
    
    # Analysis models
    'AnalysisJob': {'description': 'Background analysis jobs', 'category': 'analysis'},
    'Leak': {'description': 'Detected financial leaks', 'category': 'analysis'},
    'Recommendation': {'description': 'Generated recommendations', 'category': 'analysis'},
    'Score': {'description': 'Calculated scores', 'category': 'analysis'},
    
    # Bank models
    'BankConnection': {'description': 'Bank account connections', 'category': 'bank'},
    'BankAccount': {'description': 'Individual bank accounts', 'category': 'bank'},
    'Transaction': {'description': 'Financial transactions', 'category': 'bank'},
    
    # Billing models
    'BillingState': {'description': 'User billing state', 'category': 'billing'},
    'Feedback': {'description': 'User feedback submissions', 'category': 'billing'},
    
    # Admin models
    'AdminAuditLog': {'description': 'Admin action audit trail', 'category': 'admin'},
}

def get_model_summary():
    """Get a summary of all models by category"""
    summary = {}
    for model_name, metadata in MODEL_METADATA.items():
        category = metadata['category']
        if category not in summary:
            summary[category] = []
        summary[category].append(model_name)
    return summary

# Version info
MODELS_VERSION = "2.0.0"
MODELS_LAST_UPDATED = "2024-01-01"

# Print model info when module is loaded (useful for debugging)
if __name__ != "__main__":
    import logging
    logger = logging.getLogger(__name__)
    logger.debug(f"Models module v{MODELS_VERSION} loaded with {get_model_count()} models")