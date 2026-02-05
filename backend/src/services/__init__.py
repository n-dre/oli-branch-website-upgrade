"""
Services package initializer.

This file makes the services directory a proper Python package
and explicitly exposes service modules for clean imports.
"""

from . import ai_service
from . import assessment_service
from . import bank_service
from . import report_service

# You can also expose specific classes/functions if desired
# Example:
# from .ai_service import AIService
# from .assessment_service import AssessmentService
# from .bank_service import BankService
# from .report_service import ReportService

__all__ = [
    "ai_service",
    "assessment_service",
    "bank_service",
    "report_service",
    # Add class names here if you expose specific classes
]