"""
AI/ML Utility Functions for AWS Lambda Layer
"""

import json
import boto3
import os
from typing import Dict, List, Any, Optional, Tuple
import numpy as np
from datetime import datetime
import logging

# Initialize AWS clients
comprehend = boto3.client('comprehend', region_name=os.getenv('AWS_REGION', 'us-east-1'))
translate = boto3.client('translate', region_name=os.getenv('AWS_REGION', 'us-east-1'))
sagemaker_runtime = boto3.client('sagemaker-runtime', region_name=os.getenv('AWS_REGION', 'us-east-1'))
bedrock_runtime = boto3.client('bedrock-runtime', region_name=os.getenv('AWS_REGION', 'us-east-1'))

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Constants
MAX_TEXT_LENGTH = 5000
SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'pt', 'it', 'ja', 'ko', 'zh', 'ar']

def analyze_text_sentiment(text: str, language_code: str = 'en') -> Dict[str, Any]:
    """
    Analyze sentiment of text using Amazon Comprehend
    """
    if len(text) > MAX_TEXT_LENGTH:
        text = text[:MAX_TEXT_LENGTH]
        logger.warning(f"Text truncated to {MAX_TEXT_LENGTH} characters")
    
    try:
        response = comprehend.detect_sentiment(
            Text=text,
            LanguageCode=language_code
        )
        
        return {
            'sentiment': response['Sentiment'],
            'sentiment_score': response['SentimentScore'],
            'language': language_code,
            'processed_at': datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Sentiment analysis failed: {str(e)}")
        return {
            'sentiment': 'NEUTRAL',
            'sentiment_score': {'Positive': 0.33, 'Negative': 0.33, 'Neutral': 0.33, 'Mixed': 0.01},
            'error': str(e),
            'processed_at': datetime.now().isoformat()
        }

def extract_keywords(text: str, max_keywords: int = 10, language_code: str = 'en') -> List[Dict[str, Any]]:
    """
    Extract key phrases from text
    """
    if len(text) > MAX_TEXT_LENGTH:
        text = text[:MAX_TEXT_LENGTH]
    
    try:
        response = comprehend.detect_key_phrases(
            Text=text,
            LanguageCode=language_code
        )
        
        key_phrases = response['KeyPhrases']
        
        # Sort by score and limit to max_keywords
        key_phrases.sort(key=lambda x: x['Score'], reverse=True)
        limited_phrases = key_phrases[:max_keywords]
        
        return [
            {
                'text': phrase['Text'],
                'score': float(phrase['Score']),
                'begin_offset': phrase.get('BeginOffset', 0),
                'end_offset': phrase.get('EndOffset', 0)
            }
            for phrase in limited_phrases
        ]
    except Exception as e:
        logger.error(f"Keyword extraction failed: {str(e)}")
        return []

def summarize_text(text: str, max_sentences: int = 3) -> Dict[str, Any]:
    """
    Summarize text (simplified implementation - in production use Sagemaker or custom model)
    """
    try:
        # For production, you would use a Sagemaker endpoint or Bedrock
        # This is a simplified implementation
        
        sentences = text.split('. ')
        if len(sentences) <= max_sentences:
            summary = text
        else:
            # Simple extraction-based summarization
            # In production, use proper extractive/abstractive summarization
            summary = '. '.join(sentences[:max_sentences]) + '.'
        
        return {
            'summary': summary,
            'original_length': len(text),
            'summary_length': len(summary),
            'compression_ratio': round(len(summary) / len(text), 2) if text else 0,
            'processed_at': datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Text summarization failed: {str(e)}")
        return {
            'summary': text[:500] if text else '',
            'error': str(e),
            'processed_at': datetime.now().isoformat()
        }

def classify_text(text: str, categories: List[str] = None) -> Dict[str, Any]:
    """
    Classify text into predefined categories
    """
    if categories is None:
        categories = ['education', 'business', 'technology', 'health', 'entertainment', 'other']
    
    try:
        # In production, use a custom classifier or Comprehend Custom Classification
        # This is a simplified version
        
        text_lower = text.lower()
        scores = {}
        
        # Simple keyword-based classification
        category_keywords = {
            'education': ['school', 'learn', 'student', 'teacher', 'education', 'study', 'course'],
            'business': ['business', 'company', 'market', 'finance', 'money', 'invest', 'profit'],
            'technology': ['tech', 'computer', 'software', 'hardware', 'digital', 'code', 'programming'],
            'health': ['health', 'medical', 'doctor', 'hospital', 'medicine', 'wellness', 'fitness'],
            'entertainment': ['movie', 'music', 'game', 'fun', 'entertain', 'show', 'celebrity']
        }
        
        for category, keywords in category_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            scores[category] = score / len(keywords) if keywords else 0
        
        # Normalize scores
        total = sum(scores.values())
        if total > 0:
            scores = {k: v/total for k, v in scores.items()}
        
        # Get top category
        top_category = max(scores.items(), key=lambda x: x[1])
        
        return {
            'categories': scores,
            'top_category': top_category[0],
            'top_score': float(top_category[1]),
            'processed_at': datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Text classification failed: {str(e)}")
        return {
            'categories': {cat: 0.0 for cat in categories},
            'error': str(e),
            'processed_at': datetime.now().isoformat()
        }

def generate_embeddings(text: str, model_id: str = 'amazon.titan-embed-text-v1') -> Optional[List[float]]:
    """
    Generate embeddings for text using Amazon Titan or similar model
    """
    try:
        # Check if using Bedrock
        if model_id.startswith('amazon.'):
            response = bedrock_runtime.invoke_model(
                modelId=model_id,
                body=json.dumps({
                    'inputText': text[:MAX_TEXT_LENGTH]
                })
            )
            
            response_body = json.loads(response['body'].read())
            embeddings = response_body.get('embedding', [])
            
        # Fallback to Sagemaker endpoint
        elif os.getenv('EMBEDDING_ENDPOINT'):
            response = sagemaker_runtime.invoke_endpoint(
                EndpointName=os.getenv('EMBEDDING_ENDPOINT'),
                ContentType='application/json',
                Body=json.dumps({'text': text[:MAX_TEXT_LENGTH]})
            )
            
            result = json.loads(response['Body'].read())
            embeddings = result.get('embeddings', [])
            
        else:
            # Simple fallback: return random embeddings for demo
            logger.warning("Using random embeddings - configure Bedrock or Sagemaker for production")
            np.random.seed(hash(text) % 2**32)
            embeddings = np.random.randn(384).tolist()
        
        return embeddings
        
    except Exception as e:
        logger.error(f"Embedding generation failed: {str(e)}")
        return None

def calculate_similarity(embedding1: List[float], embedding2: List[float]) -> float:
    """
    Calculate cosine similarity between two embeddings
    """
    try:
        if not embedding1 or not embedding2:
            return 0.0
        
        # Convert to numpy arrays
        a = np.array(embedding1)
        b = np.array(embedding2)
        
        # Ensure same dimensions
        if len(a) != len(b):
            min_len = min(len(a), len(b))
            a = a[:min_len]
            b = b[:min_len]
        
        # Calculate cosine similarity
        dot_product = np.dot(a, b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        
        if norm_a == 0 or norm_b == 0:
            return 0.0
        
        similarity = dot_product / (norm_a * norm_b)
        return float(similarity)
        
    except Exception as e:
        logger.error(f"Similarity calculation failed: {str(e)}")
        return 0.0

def detect_language(text: str) -> Dict[str, Any]:
    """
    Detect language of text
    """
    try:
        if len(text) < 20:
            return {
                'language_code': 'en',
                'score': 1.0,
                'language_name': 'English',
                'processed_at': datetime.now().isoformat()
            }
        
        response = comprehend.detect_dominant_language(Text=text[:1000])
        
        if response['Languages']:
            top_lang = max(response['Languages'], key=lambda x: x['Score'])
            
            language_names = {
                'en': 'English',
                'es': 'Spanish',
                'fr': 'French',
                'de': 'German',
                'pt': 'Portuguese',
                'it': 'Italian',
                'ja': 'Japanese',
                'ko': 'Korean',
                'zh': 'Chinese',
                'ar': 'Arabic'
            }
            
            return {
                'language_code': top_lang['LanguageCode'],
                'score': float(top_lang['Score']),
                'language_name': language_names.get(top_lang['LanguageCode'], 'Unknown'),
                'processed_at': datetime.now().isoformat()
            }
        else:
            return {
                'language_code': 'unknown',
                'score': 0.0,
                'language_name': 'Unknown',
                'processed_at': datetime.now().isoformat()
            }
            
    except Exception as e:
        logger.error(f"Language detection failed: {str(e)}")
        return {
            'language_code': 'en',
            'score': 1.0,
            'language_name': 'English',
            'error': str(e),
            'processed_at': datetime.now().isoformat()
        }

def translate_text(text: str, source_lang: str, target_lang: str) -> Dict[str, Any]:
    """
    Translate text between languages
    """
    try:
        if source_lang == target_lang:
            return {
                'translated_text': text,
                'source_language': source_lang,
                'target_language': target_lang,
                'processed_at': datetime.now().isoformat()
            }
        
        response = translate.translate_text(
            Text=text[:5000],
            SourceLanguageCode=source_lang,
            TargetLanguageCode=target_lang
        )
        
        return {
            'translated_text': response['TranslatedText'],
            'source_language': response.get('SourceLanguageCode', source_lang),
            'target_language': target_lang,
            'processed_at': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Translation failed: {str(e)}")
        return {
            'translated_text': text,
            'source_language': source_lang,
            'target_language': target_lang,
            'error': str(e),
            'processed_at': datetime.now().isoformat()
        }

def moderate_content(text: str) -> Dict[str, Any]:
    """
    Moderate content for inappropriate material
    """
    try:
        response = comprehend.detect_toxic_content(
            TextSegments=[{'Text': text[:1000]}],
            LanguageCode='en'
        )
        
        if response['ResultList']:
            result = response['ResultList'][0]
            labels = result.get('Labels', [])
            
            toxic_scores = {label['Name']: label['Score'] for label in labels}
            max_toxicity = max(toxic_scores.values()) if toxic_scores else 0
            
            return {
                'is_toxic': max_toxicity > 0.5,
                'toxicity_score': float(max_toxicity),
                'detailed_scores': {k: float(v) for k, v in toxic_scores.items()},
                'processed_at': datetime.now().isoformat()
            }
        else:
            return {
                'is_toxic': False,
                'toxicity_score': 0.0,
                'processed_at': datetime.now().isoformat()
            }
            
    except Exception as e:
        logger.error(f"Content moderation failed: {str(e)}")
        return {
            'is_toxic': False,
            'toxicity_score': 0.0,
            'error': str(e),
            'processed_at': datetime.now().isoformat()
        }

def generate_ai_response(prompt: str, system_prompt: str = None, max_tokens: int = 500) -> Dict[str, Any]:
    """
    Generate AI response using Bedrock or similar service
    """
    try:
        # Prepare messages
        messages = []
        
        if system_prompt:
            messages.append({
                'role': 'system',
                'content': system_prompt
            })
        
        messages.append({
            'role': 'user',
            'content': prompt
        })
        
        # Check for Bedrock availability
        try:
            # Try Claude on Bedrock
            response = bedrock_runtime.invoke_model(
                modelId='anthropic.claude-v2',
                body=json.dumps({
                    'prompt': f"\n\nHuman: {prompt}\n\nAssistant:",
                    'max_tokens_to_sample': max_tokens,
                    'temperature': 0.7,
                    'top_p': 0.9,
                    'stop_sequences': ["\n\nHuman:"]
                })
            )
            
            response_body = json.loads(response['body'].read())
            ai_response = response_body.get('completion', '').strip()
            
        except Exception as bedrock_error:
            logger.warning(f"Bedrock failed, using fallback: {bedrock_error}")
            
            # Fallback to simple rule-based response
            if 'hello' in prompt.lower() or 'hi' in prompt.lower():
                ai_response = "Hello! How can I help you today?"
            elif 'help' in prompt.lower():
                ai_response = "I'm here to help! What do you need assistance with?"
            else:
                ai_response = "Thank you for your message. This is an AI-generated response."
        
        return {
            'response': ai_response,
            'prompt_length': len(prompt),
            'response_length': len(ai_response),
            'model_used': 'anthropic.claude-v2' if 'bedrock_error' not in locals() else 'fallback',
            'processed_at': datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"AI response generation failed: {str(e)}")
        return {
            'response': "I apologize, but I'm unable to generate a response at the moment.",
            'error': str(e),
            'processed_at': datetime.now().isoformat()
        }

def batch_process_texts(texts: List[str], operation: str, **kwargs) -> List[Dict[str, Any]]:
    """
    Batch process multiple texts with the same operation
    """
    results = []
    
    for text in texts:
        try:
            if operation == 'sentiment':
                result = analyze_text_sentiment(text, **kwargs)
            elif operation == 'keywords':
                result = extract_keywords(text, **kwargs)
            elif operation == 'summarize':
                result = summarize_text(text, **kwargs)
            elif operation == 'classify':
                result = classify_text(text, **kwargs)
            elif operation == 'language':
                result = detect_language(text)
            elif operation == 'moderate':
                result = moderate_content(text)
            else:
                result = {'error': f'Unknown operation: {operation}'}
            
            results.append(result)
            
        except Exception as e:
            logger.error(f"Batch processing failed for text: {str(e)}")
            results.append({
                'error': str(e),
                'processed_at': datetime.now().isoformat()
            })
    
    return results