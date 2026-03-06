"""
AI Utilities Lambda Layer
Shared AI/ML utilities for Lambda functions
"""

from .ai_utils import (
    analyze_text_sentiment,
    extract_keywords,
    summarize_text,
    classify_text,
    generate_embeddings,
    calculate_similarity,
    detect_language,
    translate_text,
    moderate_content,
    generate_ai_response
)

__version__ = "1.0.0"
__all__ = [
    'analyze_text_sentiment',
    'extract_keywords',
    'summarize_text',
    'classify_text',
    'generate_embeddings',
    'calculate_similarity',
    'detect_language',
    'translate_text',
    'moderate_content',
    'generate_ai_response'
]