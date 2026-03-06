# services/__init__.py
"""
Oli-Branch Services - All business logic modules
"""

from .ai_service import AIService
from .assessment_service import AssessmentService
from .bank_service import BankService
from .report_service import ReportService

# NEW SERVICES
from .ai_orchestrator import AIOrchestrator
from .analysis_service import AnalysisService
from .leak_engine import LeakEngine
from .scoring import ScoringEngine
from .openai_service import OpenAIService

# Agent System
from .agents import (
    AgentRegistry,
    AgentOrchestrator,
    BaseAgent
)

__all__ = [
    # Existing
    "AIService",
    "AssessmentService",
    "BankService",
    "ReportService",
    
    # New
    "AIOrchestrator",
    "AnalysisService",
    "LeakEngine",
    "ScoringEngine",
    "OpenAIService",
    
    # Agents
    "AgentRegistry",
    "AgentOrchestrator",
    "BaseAgent"
]