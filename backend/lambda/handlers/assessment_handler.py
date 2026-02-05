import json
import boto3
import os
from datetime import datetime
from typing import Dict, Any

# Initialize DynamoDB and S3 clients
dynamodb = boto3.resource('dynamodb')
s3_client = boto3.client('s3')
assessments_table = dynamodb.Table(os.getenv('ASSESSMENTS_TABLE', 'assessments'))
results_table = dynamodb.Table(os.getenv('RESULTS_TABLE', 'assessment_results'))

def lambda_handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Handle assessment-related requests
    """
    try:
        http_method = event.get('httpMethod', '')
        path = event.get('path', '')
        path_parts = path.split('/')
        
        # Extract assessment ID if present
        assessment_id = None
        if len(path_parts) > 2 and path_parts[-2] == 'assessments':
            assessment_id = path_parts[-1]
        
        if http_method == 'GET' and '/assessments' in path:
            if assessment_id:
                return get_assessment(event, assessment_id)
            else:
                return list_assessments(event)
        elif http_method == 'POST' and '/assessments' in path and not assessment_id:
            return create_assessment(event)
        elif http_method == 'POST' and '/assessments' in path and '/submit' in path:
            return submit_assessment(event)
        elif http_method == 'GET' and '/results' in path:
            return get_results(event)
        else:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Endpoint not found'})
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def get_assessment(event: Dict[str, Any], assessment_id: str) -> Dict[str, Any]:
    """Get a specific assessment by ID"""
    # Get user ID from authorization header
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    # Query DynamoDB for assessment
    response = assessments_table.get_item(Key={'assessmentId': assessment_id})
    
    if 'Item' not in response:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Assessment not found'})
        }
    
    assessment = response['Item']
    
    # Check if user has access to this assessment
    if not user_has_access(user_id, assessment):
        return {
            'statusCode': 403,
            'body': json.dumps({'error': 'Access denied'})
        }
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'assessment': assessment
        })
    }

def list_assessments(event: Dict[str, Any]) -> Dict[str, Any]:
    """List all assessments for a user"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    # Query assessments for this user
    # Note: In production, use proper indexing (GSI)
    response = assessments_table.scan(
        FilterExpression='contains(accessibleBy, :uid) OR createdBy = :uid',
        ExpressionAttributeValues={':uid': user_id}
    )
    
    assessments = response.get('Items', [])
    
    # Sort by creation date (newest first)
    assessments.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'assessments': assessments,
            'count': len(assessments)
        })
    }

def create_assessment(event: Dict[str, Any]) -> Dict[str, Any]:
    """Create a new assessment"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    body = json.loads(event.get('body', '{}'))
    
    # Validate required fields
    required_fields = ['title', 'questions']
    for field in required_fields:
        if field not in body:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': f'{field} is required'})
            }
    
    # Generate assessment ID
    assessment_id = f"assessment_{datetime.now().strftime('%Y%m%d%H%M%S')}_{user_id[-6:]}"
    
    # Create assessment object
    assessment = {
        'assessmentId': assessment_id,
        'title': body['title'],
        'description': body.get('description', ''),
        'questions': body['questions'],  # List of question objects
        'createdBy': user_id,
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat(),
        'settings': body.get('settings', {}),
        'accessibleBy': body.get('accessibleBy', [user_id]),  # List of user IDs who can access
        'status': 'draft'  # draft, published, archived
    }
    
    # Store in DynamoDB
    assessments_table.put_item(Item=assessment)
    
    return {
        'statusCode': 201,
        'body': json.dumps({
            'message': 'Assessment created successfully',
            'assessmentId': assessment_id,
            'assessment': assessment
        })
    }

def submit_assessment(event: Dict[str, Any]) -> Dict[str, Any]:
    """Submit assessment answers"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    body = json.loads(event.get('body', '{}'))
    
    # Validate required fields
    required_fields = ['assessmentId', 'answers']
    for field in required_fields:
        if field not in body:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': f'{field} is required'})
            }
    
    assessment_id = body['assessmentId']
    
    # Get assessment to validate
    assessment_response = assessments_table.get_item(Key={'assessmentId': assessment_id})
    
    if 'Item' not in assessment_response:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Assessment not found'})
        }
    
    assessment = assessment_response['Item']
    
    # Check if assessment is published
    if assessment.get('status') != 'published':
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Assessment is not available for submission'})
        }
    
    # Check if user has already submitted
    existing_result = results_table.get_item(
        Key={
            'assessmentId': assessment_id,
            'userId': user_id
        }
    )
    
    if 'Item' in existing_result:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Assessment already submitted'})
        }
    
    # Calculate score (simplified - in production, use proper scoring logic)
    total_questions = len(assessment['questions'])
    correct_answers = 0
    
    for i, question in enumerate(assessment['questions']):
        user_answer = body['answers'].get(str(i), '')
        correct_answer = question.get('correctAnswer', '')
        
        if user_answer == correct_answer:
            correct_answers += 1
    
    score = (correct_answers / total_questions * 100) if total_questions > 0 else 0
    
    # Create result record
    result_id = f"result_{datetime.now().strftime('%Y%m%d%H%M%S')}_{user_id[-6:]}"
    
    result = {
        'resultId': result_id,
        'assessmentId': assessment_id,
        'userId': user_id,
        'answers': body['answers'],
        'score': score,
        'correctAnswers': correct_answers,
        'totalQuestions': total_questions,
        'submittedAt': datetime.now().isoformat(),
        'timeSpent': body.get('timeSpent', 0),  # in seconds
        'metadata': body.get('metadata', {})
    }
    
    # Store result in DynamoDB
    results_table.put_item(Item=result)
    
    # Generate presigned URL for report if needed
    report_url = None
    if body.get('generateReport', False):
        report_url = generate_report_url(result_id)
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Assessment submitted successfully',
            'resultId': result_id,
            'score': score,
            'correctAnswers': correct_answers,
            'totalQuestions': total_questions,
            'reportUrl': report_url
        })
    }

def get_results(event: Dict[str, Any]) -> Dict[str, Any]:
    """Get assessment results for a user"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    # Get query parameters
    query_params = event.get('queryStringParameters', {})
    assessment_id = query_params.get('assessmentId')
    
    # Query results
    if assessment_id:
        # Get specific result for this assessment
        response = results_table.get_item(
            Key={
                'assessmentId': assessment_id,
                'userId': user_id
            }
        )
        
        if 'Item' not in response:
            return {
                'statusCode': 404,
                'body': json.dumps({'error': 'Result not found'})
            }
        
        results = [response['Item']]
    else:
        # Get all results for this user
        response = results_table.query(
            KeyConditionExpression='userId = :uid',
            ExpressionAttributeValues={':uid': user_id}
        )
        
        results = response.get('Items', [])
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'results': results,
            'count': len(results)
        })
    }

def get_user_id_from_event(event: Dict[str, Any]) -> str:
    """Extract user ID from authorization header"""
    headers = event.get('headers', {})
    auth_header = headers.get('authorization', headers.get('Authorization', ''))
    
    if not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header[7:]  # Remove 'Bearer ' prefix
    
    # In production, decode and verify JWT token
    # For now, return a mock user ID
    return 'user_123'  # Replace with actual JWT decoding

def user_has_access(user_id: str, assessment: Dict[str, Any]) -> bool:
    """Check if user has access to assessment"""
    created_by = assessment.get('createdBy')
    accessible_by = assessment.get('accessibleBy', [])
    
    return user_id == created_by or user_id in accessible_by

def generate_report_url(result_id: str) -> str:
    """Generate presigned S3 URL for report"""
    bucket_name = os.getenv('REPORTS_BUCKET', 'assessment-reports')
    key = f"reports/{result_id}.pdf"
    
    # Generate presigned URL (expires in 1 hour)
    url = s3_client.generate_presigned_url(
        'get_object',
        Params={'Bucket': bucket_name, 'Key': key},
        ExpiresIn=3600
    )
    
    return url