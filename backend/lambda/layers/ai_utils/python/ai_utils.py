# backend/lambda/layers/ai_utils/python/ai_utils.py
"""
AI Utilities for Lambda Layer
Handles AI model interactions, audit storage, and Bedrock operations
"""

import json
import boto3
import os
import time
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional, Union
from botocore.exceptions import ClientError

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Initialize AWS clients
s3_client = boto3.client('s3')
bedrock_client = boto3.client('bedrock-runtime')


class AuditStorageManager:
    """
    Manages audit results storage in S3 and AI model interactions via Bedrock
    """
    
    def __init__(self, s3_bucket: str = None):
        self.s3_client = s3_client
        self.s3_bucket = s3_bucket or os.getenv('AUDIT_BUCKET_NAME', 'oli-branch-audits')
        self.bedrock_client = bedrock_client
        
        if not self.s3_bucket:
            logger.warning("No S3 bucket specified for AuditStorageManager")
    
    def save_audit_result(self, audit_result: Dict[str, Any], client_id: str) -> str:
        """
        Save validated audit results to S3
        
        Args:
            audit_result: The audit result dictionary
            client_id: Client identifier
            
        Returns:
            S3 key of saved object
            
        Raises:
            ValueError: If audit_result is missing required fields
            Exception: If S3 upload fails
        """
        if "compliance_risk" not in audit_result:
            raise ValueError("Cannot save incomplete audit result: missing 'compliance_risk'")
        
        timestamp = datetime.utcnow().isoformat()
        key = f"audits/{client_id}/{timestamp}.json"
        
        try:
            self.s3_client.put_object(
                Bucket=self.s3_bucket,
                Key=key,
                Body=json.dumps(audit_result, default=str),
                ContentType='application/json',
                Metadata={
                    'client_id': client_id,
                    'compliance_risk': audit_result['compliance_risk'],
                    'requires_follow_up': str(audit_result.get('requires_follow_up', False)),
                    'timestamp': timestamp
                }
            )
            logger.info(f"Audit result saved to s3://{self.s3_bucket}/{key}")
            return key
            
        except ClientError as e:
            logger.error(f"Failed to save audit to S3: {str(e)}")
            raise Exception(f"Failed to save audit to S3: {str(e)}")
    
    def call_bedrock_model(self, prompt: str, model_id: str = "anthropic.claude-v2",
                          max_tokens: int = 1000, temperature: float = 0.1) -> Dict[str, Any]:
        """
        Call AWS Bedrock for AI processing
        
        Args:
            prompt: The prompt to send to the model
            model_id: Bedrock model ID (default: anthropic.claude-v2)
            max_tokens: Maximum tokens to generate
            temperature: Temperature for response generation (0-1)
            
        Returns:
            Parsed JSON response from Bedrock
        """
        try:
            # Prepare request body based on model
            if "claude" in model_id:
                request_body = {
                    "prompt": f"\n\nHuman: {prompt}\n\nAssistant:",
                    "max_tokens_to_sample": max_tokens,
                    "temperature": temperature,
                    "top_p": 0.9,
                    "stop_sequences": ["\n\nHuman:"]
                }
            elif "titan" in model_id:
                request_body = {
                    "inputText": prompt,
                    "textGenerationConfig": {
                        "maxTokenCount": max_tokens,
                        "temperature": temperature,
                        "topP": 0.9
                    }
                }
            else:
                request_body = {
                    "prompt": prompt,
                    "max_tokens_to_sample": max_tokens,
                    "temperature": temperature
                }
            
            response = self.bedrock_client.invoke_model(
                modelId=model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(request_body)
            )
            
            result = json.loads(response['body'].read())
            logger.info(f"Bedrock model {model_id} invoked successfully")
            return result
            
        except ClientError as e:
            logger.error(f"Bedrock API call failed: {str(e)}")
            raise Exception(f"Bedrock API call failed: {str(e)}")
    
    def generate_audit_summary(self, audit_data: Dict[str, Any]) -> str:
        """
        Generate a human-readable summary of audit results using Bedrock
        
        Args:
            audit_data: The audit data to summarize
            
        Returns:
            Generated summary text
        """
        prompt = f"""
        Please provide a concise executive summary of this financial audit:
        
        Compliance Risk: {audit_data.get('compliance_risk', 'Unknown')}
        Issues Found: {len(audit_data.get('issues_found', []))}
        Recommendations: {len(audit_data.get('recommendations', []))}
        
        Audit Details: {json.dumps(audit_data, default=str)[:1000]}
        
        Summary should be:
        - 2-3 paragraphs
        - Professional but accessible
        - Highlight key findings
        - Suggest next steps
        """
        
        result = self.call_bedrock_model(prompt)
        
        # Extract text based on model response format
        if 'completion' in result:
            return result['completion']
        elif 'results' in result and result['results']:
            return result['results'][0].get('outputText', '')
        else:
            return str(result)


class AIAuditProcessor:
    """
    High-level processor for AI-powered audit operations
    """
    
    def __init__(self, storage_manager: Optional[AuditStorageManager] = None):
        self.storage = storage_manager or AuditStorageManager()
    
    def process_audit_request(self, client_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process an audit request end-to-end
        
        Args:
            client_data: Client data to audit
            
        Returns:
            Complete audit result with storage info
        """
        # Step 1: Prepare audit prompt
        prompt = self._prepare_audit_prompt(client_data)
        
        # Step 2: Call Bedrock
        ai_response = self.storage.call_bedrock_model(prompt)
        
        # Step 3: Parse and validate response
        audit_result = self._parse_audit_response(ai_response, client_data)
        
        # Step 4: Save to S3
        client_id = client_data.get('client_id', 'unknown')
        s3_key = self.storage.save_audit_result(audit_result, client_id)
        
        # Step 5: Generate summary
        summary = self.storage.generate_audit_summary(audit_result)
        audit_result['summary'] = summary
        
        return {
            'audit_result': audit_result,
            'storage_location': f"s3://{self.storage.s3_bucket}/{s3_key}",
            'processed_at': datetime.utcnow().isoformat()
        }
    
    def _prepare_audit_prompt(self, client_data: Dict[str, Any]) -> str:
        """Prepare audit prompt from client data"""
        return f"""
        You are an AI auditor for Oli-Branch Financial Control System.
        
        Analyze this client data for compliance gaps, hidden fees, and operational inefficiencies:
        
        {json.dumps(client_data, default=str, indent=2)}
        
        Provide your analysis in JSON format with:
        1. compliance_risk (High/Medium/Low)
        2. issues_found (array of issues with severity and description)
        3. recommendations (array of actionable recommendations)
        4. requires_follow_up (boolean)
        5. confidence_score (0-1)
        """
    
    def _parse_audit_response(self, ai_response: Dict[str, Any], 
                             client_data: Dict[str, Any]) -> Dict[str, Any]:
        """Parse and validate AI response"""
        
        # Extract text from response
        if 'completion' in ai_response:
            response_text = ai_response['completion']
        elif 'results' in ai_response:
            response_text = ai_response['results'][0].get('outputText', '')
        else:
            response_text = str(ai_response)
        
        # Try to extract JSON from response
        try:
            # Find JSON in response (handles text before/after JSON)
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx >= 0 and end_idx > start_idx:
                json_str = response_text[start_idx:end_idx]
                result = json.loads(json_str)
            else:
                # Fallback: create structured result
                result = {
                    'compliance_risk': 'Medium',
                    'issues_found': [],
                    'recommendations': [],
                    'requires_follow_up': False,
                    'confidence_score': 0.5,
                    'raw_response': response_text
                }
        except json.JSONDecodeError:
            # Fallback for invalid JSON
            result = {
                'compliance_risk': 'Medium',
                'issues_found': [{'description': response_text[:200]}],
                'recommendations': [],
                'requires_follow_up': True,
                'confidence_score': 0.5,
                'raw_response': response_text
            }
        
        # Add metadata
        result['client_id'] = client_data.get('client_id')
        result['processed_at'] = datetime.utcnow().isoformat()
        
        return result