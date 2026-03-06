import json
import boto3
import os
from datetime import datetime
from typing import Dict, Any
import uuid

# Initialize AWS clients
s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
lambda_client = boto3.client('lambda')
sqs_client = boto3.client('sqs')

# Initialize DynamoDB tables
reports_table = dynamodb.Table(os.getenv('REPORTS_TABLE', 'reports'))
results_table = dynamodb.Table(os.getenv('RESULTS_TABLE', 'assessment_results'))

# S3 buckets
REPORTS_BUCKET = os.getenv('REPORTS_BUCKET', 'assessment-reports')
TEMPLATES_BUCKET = os.getenv('TEMPLATES_BUCKET', 'report-templates')

def lambda_handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Handle report generation and retrieval requests
    """
    try:
        http_method = event.get('httpMethod', '')
        path = event.get('path', '')
        path_parts = path.split('/')
        
        # Extract report ID if present
        report_id = None
        if len(path_parts) > 2 and path_parts[-2] == 'reports':
            report_id = path_parts[-1]
        
        if http_method == 'POST' and '/reports/generate' in path:
            return generate_report(event)
        elif http_method == 'GET' and '/reports' in path:
            if report_id:
                return get_report(event, report_id)
            else:
                return list_reports(event)
        elif http_method == 'POST' and '/reports/batch' in path:
            return generate_batch_reports(event)
        elif http_method == 'GET' and '/reports/download' in path:
            return download_report(event)
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

def generate_report(event: Dict[str, Any]) -> Dict[str, Any]:
    """Generate a report for an assessment result"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    body = json.loads(event.get('body', '{}'))
    result_id = body.get('resultId')
    report_type = body.get('type', 'detailed')  # detailed, summary, certificate
    template_id = body.get('templateId', 'default')
    
    if not result_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'resultId is required'})
        }
    
    # Get assessment result
    result_response = results_table.query(
        IndexName='resultId-index',  # Assume GSI on resultId
        KeyConditionExpression='resultId = :rid',
        ExpressionAttributeValues={':rid': result_id}
    )
    
    if not result_response.get('Items'):
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Result not found'})
        }
    
    result = result_response['Items'][0]
    
    # Verify user owns this result
    if result['userId'] != user_id:
        return {
            'statusCode': 403,
            'body': json.dumps({'error': 'Access denied'})
        }
    
    # Check if report already exists
    existing_report = reports_table.query(
        IndexName='resultId-index',
        KeyConditionExpression='resultId = :rid',
        ExpressionAttributeValues={':rid': result_id}
    )
    
    if existing_report.get('Items'):
        report = existing_report['Items'][0]
        
        # Return existing report if it's recent (less than 24 hours old)
        report_time = datetime.fromisoformat(report['createdAt'].replace('Z', '+00:00'))
        if (datetime.now() - report_time).total_seconds() < 86400:  # 24 hours
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': 'Report already exists',
                    'reportId': report['reportId'],
                    'status': report['status'],
                    'downloadUrl': report.get('downloadUrl')
                })
            }
    
    # Generate unique report ID
    report_id = f"report_{uuid.uuid4().hex[:8]}_{datetime.now().strftime('%Y%m%d')}"
    
    # Create report record
    report_data = {
        'reportId': report_id,
        'resultId': result_id,
        'userId': user_id,
        'assessmentId': result['assessmentId'],
        'type': report_type,
        'templateId': template_id,
        'status': 'processing',
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat(),
        'metadata': {
            'score': result['score'],
            'correctAnswers': result['correctAnswers'],
            'totalQuestions': result['totalQuestions'],
            'submittedAt': result['submittedAt']
        }
    }
    
    # Store report metadata in DynamoDB
    reports_table.put_item(Item=report_data)
    
    # Prepare data for report generation
    report_job = {
        'reportId': report_id,
        'resultId': result_id,
        'userId': user_id,
        'assessmentId': result['assessmentId'],
        'reportType': report_type,
        'templateId': template_id,
        'resultData': result,
        'timestamp': datetime.now().isoformat()
    }
    
    # Method 1: Invoke report generator Lambda asynchronously
    if os.getenv('REPORT_GENERATOR_LAMBDA'):
        lambda_client.invoke(
            FunctionName=os.getenv('REPORT_GENERATOR_LAMBDA'),
            InvocationType='Event',  # Asynchronous
            Payload=json.dumps(report_job)
        )
    # Method 2: Send to SQS queue for async processing
    elif os.getenv('REPORT_QUEUE_URL'):
        sqs_client.send_message(
            QueueUrl=os.getenv('REPORT_QUEUE_URL'),
            MessageBody=json.dumps(report_job),
            MessageAttributes={
                'ReportType': {
                    'DataType': 'String',
                    'StringValue': report_type
                }
            }
        )
    # Method 3: Generate inline (for simple reports)
    else:
        # This would generate a simple report
        generate_simple_report(report_id, result, report_type)
    
    return {
        'statusCode': 202,  # Accepted
        'body': json.dumps({
            'message': 'Report generation started',
            'reportId': report_id,
            'status': 'processing',
            'checkStatusUrl': f"/reports/{report_id}/status"
        })
    }

def get_report(event: Dict[str, Any], report_id: str) -> Dict[str, Any]:
    """Get report details"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    # Get report from DynamoDB
    response = reports_table.get_item(Key={'reportId': report_id})
    
    if 'Item' not in response:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Report not found'})
        }
    
    report = response['Item']
    
    # Check if user owns this report
    if report['userId'] != user_id:
        return {
            'statusCode': 403,
            'body': json.dumps({'error': 'Access denied'})
        }
    
    # Add presigned download URL if report is ready
    if report['status'] == 'completed' and report.get('s3Key'):
        report['downloadUrl'] = generate_presigned_url(report['s3Key'])
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'report': report
        })
    }

def list_reports(event: Dict[str, Any]) -> Dict[str, Any]:
    """List all reports for a user"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    # Get query parameters
    query_params = event.get('queryStringParameters', {})
    assessment_id = query_params.get('assessmentId')
    status = query_params.get('status')
    
    # Build query expression
    key_condition = 'userId = :uid'
    expression_values = {':uid': user_id}
    
    if assessment_id:
        key_condition += ' and assessmentId = :aid'
        expression_values[':aid'] = assessment_id
    
    # Query reports
    response = reports_table.query(
        KeyConditionExpression=key_condition,
        ExpressionAttributeValues=expression_values,
        ScanIndexForward=False  # Most recent first
    )
    
    reports = response.get('Items', [])
    
    # Filter by status if provided
    if status:
        reports = [r for r in reports if r.get('status') == status]
    
    # Generate download URLs for completed reports
    for report in reports:
        if report['status'] == 'completed' and report.get('s3Key'):
            report['downloadUrl'] = generate_presigned_url(report['s3Key'])
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'reports': reports,
            'count': len(reports)
        })
    }

def generate_batch_reports(event: Dict[str, Any]) -> Dict[str, Any]:
    """Generate multiple reports in batch"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    body = json.loads(event.get('body', '{}'))
    result_ids = body.get('resultIds', [])
    report_type = body.get('type', 'summary')
    
    if not result_ids:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'resultIds array is required'})
        }
    
    if len(result_ids) > 50:  # Limit batch size
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Maximum 50 results per batch'})
        }
    
    batch_id = f"batch_{uuid.uuid4().hex[:8]}_{datetime.now().strftime('%Y%m%d')}"
    generated_reports = []
    
    # Create batch record (optional)
    batch_data = {
        'batchId': batch_id,
        'userId': user_id,
        'resultIds': result_ids,
        'reportType': report_type,
        'status': 'processing',
        'total': len(result_ids),
        'completed': 0,
        'failed': 0,
        'createdAt': datetime.now().isoformat()
    }
    
    # For each result, trigger report generation
    for result_id in result_ids:
        # Trigger individual report generation
        report_job = {
            'resultId': result_id,
            'userId': user_id,
            'reportType': report_type,
            'batchId': batch_id,
            'timestamp': datetime.now().isoformat()
        }
        
        # Send to SQS for async processing
        if os.getenv('BATCH_REPORT_QUEUE_URL'):
            sqs_client.send_message(
                QueueUrl=os.getenv('BATCH_REPORT_QUEUE_URL'),
                MessageBody=json.dumps(report_job)
            )
        
        generated_reports.append({
            'resultId': result_id,
            'status': 'queued'
        })
    
    return {
        'statusCode': 202,
        'body': json.dumps({
            'message': 'Batch report generation started',
            'batchId': batch_id,
            'total': len(result_ids),
            'reports': generated_reports,
            'checkStatusUrl': f"/reports/batch/{batch_id}/status"
        })
    }

def download_report(event: Dict[str, Any]) -> Dict[str, Any]:
    """Generate download URL for a report"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    query_params = event.get('queryStringParameters', {})
    report_id = query_params.get('reportId')
    
    if not report_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'reportId is required'})
        }
    
    # Get report from DynamoDB
    response = reports_table.get_item(Key={'reportId': report_id})
    
    if 'Item' not in response:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Report not found'})
        }
    
    report = response['Item']
    
    # Check if user owns this report
    if report['userId'] != user_id:
        return {
            'statusCode': 403,
            'body': json.dumps({'error': 'Access denied'})
        }
    
    # Check if report is ready
    if report['status'] != 'completed':
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Report is not ready yet', 'status': report['status']})
        }
    
    # Generate presigned URL
    if not report.get('s3Key'):
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Report file not found'})
        }
    
    download_url = generate_presigned_url(report['s3Key'])
    
    # Track download (optional)
    reports_table.update_item(
        Key={'reportId': report_id},
        UpdateExpression='SET downloadCount = if_not_exists(downloadCount, :zero) + :inc, lastDownloadedAt = :now',
        ExpressionAttributeValues={
            ':zero': 0,
            ':inc': 1,
            ':now': datetime.now().isoformat()
        }
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'downloadUrl': download_url,
            'expiresIn': 3600,  # 1 hour
            'filename': report.get('filename', f'report_{report_id}.pdf')
        })
    }

def generate_simple_report(report_id: str, result: Dict[str, Any], report_type: str):
    """Generate a simple text-based report (placeholder for actual implementation)"""
    # This is a placeholder - in production, use a proper PDF generation library
    # like ReportLab, WeasyPrint, or generate HTML
    
    report_content = f"""
    ASSESSMENT REPORT
    =================
    
    Report ID: {report_id}
    Assessment ID: {result['assessmentId']}
    User ID: {result['userId']}
    Date: {result['submittedAt']}
    
    SCORE SUMMARY
    -------------
    Score: {result['score']}%
    Correct Answers: {result['correctAnswers']}/{result['totalQuestions']}
    
    DETAILS
    -------
    Time Spent: {result.get('timeSpent', 'N/A')} seconds
    
    This is a sample report. In production, this would include:
    - Detailed question-by-question analysis
    - Charts and graphs
    - Recommendations
    - Comparative analysis
    """
    
    # Upload to S3
    s3_key = f"reports/{report_id}.txt"
    s3_client.put_object(
        Bucket=REPORTS_BUCKET,
        Key=s3_key,
        Body=report_content.encode('utf-8'),
        ContentType='text/plain',
        Metadata={
            'report-id': report_id,
            'report-type': report_type
        }
    )
    
    # Update report record
    reports_table.update_item(
        Key={'reportId': report_id},
        UpdateExpression='SET #status = :status, s3Key = :s3key, updatedAt = :now',
        ExpressionAttributeNames={'#status': 'status'},
        ExpressionAttributeValues={
            ':status': 'completed',
            ':s3key': s3_key,
            ':now': datetime.now().isoformat()
        }
    )

def generate_presigned_url(s3_key: str, expires_in: int = 3600) -> str:
    """Generate presigned URL for S3 object"""
    return s3_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': REPORTS_BUCKET,
            'Key': s3_key
        },
        ExpiresIn=expires_in
    )

def get_user_id_from_event(event: Dict[str, Any]) -> str:
    """Extract user ID from authorization header"""
    headers = event.get('headers', {})
    auth_header = headers.get('authorization', headers.get('Authorization', ''))
    
    if not auth_header.startswith('Bearer '):
        return None
    
    # In production, decode JWT to get user ID
    # For now, return mock user ID
    token = auth_header[7:]
    
    # Mock JWT decoding - replace with actual implementation
    if 'user_' in token:
        return 'user_123'
    
    return None