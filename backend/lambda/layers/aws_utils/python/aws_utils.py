"""
AWS Utility Functions for Lambda Layer
"""

import json
import boto3
import os
import time
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Union, Callable
from botocore.exceptions import ClientError
import uuid
import re
import base64

# Initialize AWS clients
s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')
dynamodb_client = boto3.client('dynamodb')
sqs_client = boto3.client('sqs')
sns_client = boto3.client('sns')
secrets_client = boto3.client('secretsmanager')
ssm_client = boto3.client('ssm')
cloudwatch_client = boto3.client('cloudwatch')
lambda_client = boto3.client('lambda')
cognito_client = boto3.client('cognito-idp')

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Constants
MAX_RETRIES = 3
RETRY_DELAY = 1  # seconds
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')

# ============================================================================
# S3 UTILITIES
# ============================================================================

def upload_to_s3(bucket: str, key: str, data: Union[str, bytes], 
                 content_type: str = None, metadata: Dict[str, str] = None) -> Dict[str, Any]:
    """
    Upload data to S3 bucket
    """
    try:
        extra_args = {}
        if content_type:
            extra_args['ContentType'] = content_type
        if metadata:
            extra_args['Metadata'] = metadata
        
        if isinstance(data, str):
            data = data.encode('utf-8')
        
        s3_client.put_object(
            Bucket=bucket,
            Key=key,
            Body=data,
            **extra_args
        )
        
        return {
            'success': True,
            'bucket': bucket,
            'key': key,
            'url': f"s3://{bucket}/{key}"
        }
        
    except ClientError as e:
        logger.error(f"S3 upload failed: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'bucket': bucket,
            'key': key
        }

def download_from_s3(bucket: str, key: str, as_string: bool = True) -> Union[str, bytes, None]:
    """
    Download data from S3 bucket
    """
    try:
        response = s3_client.get_object(Bucket=bucket, Key=key)
        data = response['Body'].read()
        
        if as_string:
            return data.decode('utf-8')
        return data
        
    except ClientError as e:
        logger.error(f"S3 download failed: {str(e)}")
        return None

def generate_presigned_url(bucket: str, key: str, expiration: int = 3600,
                          operation: str = 'get_object') -> Optional[str]:
    """
    Generate presigned URL for S3 object
    """
    try:
        url = s3_client.generate_presigned_url(
            ClientMethod=operation,
            Params={'Bucket': bucket, 'Key': key},
            ExpiresIn=expiration
        )
        return url
    except ClientError as e:
        logger.error(f"Presigned URL generation failed: {str(e)}")
        return None

def list_s3_objects(bucket: str, prefix: str = '', max_keys: int = 1000) -> List[Dict[str, Any]]:
    """
    List objects in S3 bucket with prefix
    """
    try:
        response = s3_client.list_objects_v2(
            Bucket=bucket,
            Prefix=prefix,
            MaxKeys=max_keys
        )
        
        objects = []
        for obj in response.get('Contents', []):
            objects.append({
                'key': obj['Key'],
                'size': obj['Size'],
                'last_modified': obj['LastModified'].isoformat(),
                'etag': obj['ETag']
            })
        
        return objects
        
    except ClientError as e:
        logger.error(f"S3 list objects failed: {str(e)}")
        return []

def delete_s3_object(bucket: str, key: str) -> bool:
    """
    Delete object from S3 bucket
    """
    try:
        s3_client.delete_object(Bucket=bucket, Key=key)
        return True
    except ClientError as e:
        logger.error(f"S3 delete failed: {str(e)}")
        return False

def copy_s3_object(source_bucket: str, source_key: str,
                   dest_bucket: str, dest_key: str) -> bool:
    """
    Copy object within or between S3 buckets
    """
    try:
        copy_source = {'Bucket': source_bucket, 'Key': source_key}
        s3_client.copy_object(
            CopySource=copy_source,
            Bucket=dest_bucket,
            Key=dest_key
        )
        return True
    except ClientError as e:
        logger.error(f"S3 copy failed: {str(e)}")
        return False

# ============================================================================
# DYNAMODB UTILITIES
# ============================================================================

def dynamodb_put_item(table_name: str, item: Dict[str, Any]) -> bool:
    """
    Put item into DynamoDB table
    """
    try:
        table = dynamodb.Table(table_name)
        table.put_item(Item=item)
        return True
    except ClientError as e:
        logger.error(f"DynamoDB put item failed: {str(e)}")
        return False

def dynamodb_get_item(table_name: str, key: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Get item from DynamoDB table
    """
    try:
        table = dynamodb.Table(table_name)
        response = table.get_item(Key=key)
        return response.get('Item')
    except ClientError as e:
        logger.error(f"DynamoDB get item failed: {str(e)}")
        return None

def dynamodb_query(table_name: str, key_condition_expression: str,
                   expression_attribute_values: Dict[str, Any],
                   index_name: str = None, limit: int = None,
                   scan_index_forward: bool = True) -> List[Dict[str, Any]]:
    """
    Query DynamoDB table
    """
    try:
        table = dynamodb.Table(table_name)
        
        kwargs = {
            'KeyConditionExpression': key_condition_expression,
            'ExpressionAttributeValues': expression_attribute_values,
            'ScanIndexForward': scan_index_forward
        }
        
        if index_name:
            kwargs['IndexName'] = index_name
        if limit:
            kwargs['Limit'] = limit
        
        response = table.query(**kwargs)
        return response.get('Items', [])
        
    except ClientError as e:
        logger.error(f"DynamoDB query failed: {str(e)}")
        return []

def dynamodb_scan(table_name: str, filter_expression: str = None,
                  expression_attribute_values: Dict[str, Any] = None,
                  limit: int = None) -> List[Dict[str, Any]]:
    """
    Scan DynamoDB table
    """
    try:
        table = dynamodb.Table(table_name)
        
        kwargs = {}
        if filter_expression and expression_attribute_values:
            kwargs['FilterExpression'] = filter_expression
            kwargs['ExpressionAttributeValues'] = expression_attribute_values
        if limit:
            kwargs['Limit'] = limit
        
        response = table.scan(**kwargs)
        return response.get('Items', [])
        
    except ClientError as e:
        logger.error(f"DynamoDB scan failed: {str(e)}")
        return []

def dynamodb_update_item(table_name: str, key: Dict[str, Any],
                         update_expression: str,
                         expression_attribute_values: Dict[str, Any],
                         expression_attribute_names: Dict[str, str] = None) -> bool:
    """
    Update item in DynamoDB table
    """
    try:
        table = dynamodb.Table(table_name)
        
        kwargs = {
            'Key': key,
            'UpdateExpression': update_expression,
            'ExpressionAttributeValues': expression_attribute_values
        }
        
        if expression_attribute_names:
            kwargs['ExpressionAttributeNames'] = expression_attribute_names
        
        table.update_item(**kwargs)
        return True
        
    except ClientError as e:
        logger.error(f"DynamoDB update item failed: {str(e)}")
        return False

def dynamodb_delete_item(table_name: str, key: Dict[str, Any]) -> bool:
    """
    Delete item from DynamoDB table
    """
    try:
        table = dynamodb.Table(table_name)
        table.delete_item(Key=key)
        return True
    except ClientError as e:
        logger.error(f"DynamoDB delete item failed: {str(e)}")
        return False

def dynamodb_batch_write(table_name: str, items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Batch write items to DynamoDB table
    """
    try:
        table = dynamodb.Table(table_name)
        
        with table.batch_writer() as batch:
            for item in items:
                batch.put_item(Item=item)
        
        return {
            'success': True,
            'items_processed': len(items)
        }
        
    except ClientError as e:
        logger.error(f"DynamoDB batch write failed: {str(e)}")
        return {
            'success': False,
            'error': str(e),
            'items_processed': 0
        }

# ============================================================================
# SQS UTILITIES
# ============================================================================

def sqs_send_message(queue_url: str, message_body: Union[str, Dict],
                     message_attributes: Dict[str, Any] = None,
                     delay_seconds: int = 0) -> Optional[str]:
    """
    Send message to SQS queue
    """
    try:
        if isinstance(message_body, dict):
            message_body = json.dumps(message_body)
        
        kwargs = {
            'QueueUrl': queue_url,
            'MessageBody': message_body,
            'DelaySeconds': delay_seconds
        }
        
        if message_attributes:
            kwargs['MessageAttributes'] = message_attributes
        
        response = sqs_client.send_message(**kwargs)
        return response.get('MessageId')
        
    except ClientError as e:
        logger.error(f"SQS send message failed: {str(e)}")
        return None

def sqs_receive_messages(queue_url: str, max_messages: int = 10,
                         wait_time_seconds: int = 0) -> List[Dict[str, Any]]:
    """
    Receive messages from SQS queue
    """
    try:
        response = sqs_client.receive_message(
            QueueUrl=queue_url,
            MaxNumberOfMessages=max_messages,
            WaitTimeSeconds=wait_time_seconds,
            MessageAttributeNames=['All']
        )
        
        messages = []
        for msg in response.get('Messages', []):
            try:
                body = json.loads(msg['Body'])
            except json.JSONDecodeError:
                body = msg['Body']
            
            messages.append({
                'message_id': msg['MessageId'],
                'receipt_handle': msg['ReceiptHandle'],
                'body': body,
                'attributes': msg.get('Attributes', {}),
                'message_attributes': msg.get('MessageAttributes', {})
            })
        
        return messages
        
    except ClientError as e:
        logger.error(f"SQS receive messages failed: {str(e)}")
        return []

def sqs_delete_message(queue_url: str, receipt_handle: str) -> bool:
    """
    Delete message from SQS queue
    """
    try:
        sqs_client.delete_message(
            QueueUrl=queue_url,
            ReceiptHandle=receipt_handle
        )
        return True
    except ClientError as e:
        logger.error(f"SQS delete message failed: {str(e)}")
        return False

def sqs_get_queue_attributes(queue_url: str, attribute_names: List[str] = None) -> Dict[str, Any]:
    """
    Get SQS queue attributes
    """
    try:
        if attribute_names is None:
            attribute_names = ['All']
        
        response = sqs_client.get_queue_attributes(
            QueueUrl=queue_url,
            AttributeNames=attribute_names
        )
        
        return response.get('Attributes', {})
        
    except ClientError as e:
        logger.error(f"SQS get attributes failed: {str(e)}")
        return {}

# ============================================================================
# SNS UTILITIES
# ============================================================================

def sns_publish_message(topic_arn: str, message: Union[str, Dict],
                        subject: str = None, message_attributes: Dict[str, Any] = None) -> Optional[str]:
    """
    Publish message to SNS topic
    """
    try:
        if isinstance(message, dict):
            message = json.dumps(message)
        
        kwargs = {
            'TopicArn': topic_arn,
            'Message': message
        }
        
        if subject:
            kwargs['Subject'] = subject
        if message_attributes:
            kwargs['MessageAttributes'] = message_attributes
        
        response = sns_client.publish(**kwargs)
        return response.get('MessageId')
        
    except ClientError as e:
        logger.error(f"SNS publish failed: {str(e)}")
        return None

def sns_create_topic(topic_name: str) -> Optional[str]:
    """
    Create SNS topic
    """
    try:
        response = sns_client.create_topic(Name=topic_name)
        return response.get('TopicArn')
    except ClientError as e:
        logger.error(f"SNS create topic failed: {str(e)}")
        return None

def sns_subscribe(topic_arn: str, protocol: str, endpoint: str) -> Optional[str]:
    """
    Subscribe to SNS topic
    """
    try:
        response = sns_client.subscribe(
            TopicArn=topic_arn,
            Protocol=protocol,
            Endpoint=endpoint
        )
        return response.get('SubscriptionArn')
    except ClientError as e:
        logger.error(f"SNS subscribe failed: {str(e)}")
        return None

# ============================================================================
# SECRETS MANAGER UTILITIES
# ============================================================================

def get_secret(secret_name: str) -> Optional[Dict[str, Any]]:
    """
    Get secret from Secrets Manager
    """
    try:
        response = secrets_client.get_secret_value(SecretId=secret_name)
        
        if 'SecretString' in response:
            secret = json.loads(response['SecretString'])
        else:
            secret = base64.b64decode(response['SecretBinary']).decode('utf-8')
            try:
                secret = json.loads(secret)
            except json.JSONDecodeError:
                secret = {'value': secret}
        
        return secret
        
    except ClientError as e:
        logger.error(f"Get secret failed: {str(e)}")
        return None

def create_secret(secret_name: str, secret_value: Union[str, Dict]) -> bool:
    """
    Create secret in Secrets Manager
    """
    try:
        if isinstance(secret_value, dict):
            secret_value = json.dumps(secret_value)
        
        secrets_client.create_secret(
            Name=secret_name,
            SecretString=secret_value
        )
        return True
    except ClientError as e:
        logger.error(f"Create secret failed: {str(e)}")
        return False

def update_secret(secret_name: str, secret_value: Union[str, Dict]) -> bool:
    """
    Update secret in Secrets Manager
    """
    try:
        if isinstance(secret_value, dict):
            secret_value = json.dumps(secret_value)
        
        secrets_client.update_secret(
            SecretId=secret_name,
            SecretString=secret_value
        )
        return True
    except ClientError as e:
        logger.error(f"Update secret failed: {str(e)}")
        return False

# ============================================================================
# PARAMETER STORE UTILITIES
# ============================================================================

def get_parameter(parameter_name: str, with_decryption: bool = False) -> Optional[str]:
    """
    Get parameter from Parameter Store
    """
    try:
        response = ssm_client.get_parameter(
            Name=parameter_name,
            WithDecryption=with_decryption
        )
        return response['Parameter']['Value']
    except ClientError as e:
        logger.error(f"Get parameter failed: {str(e)}")
        return None

def put_parameter(parameter_name: str, parameter_value: str,
                  parameter_type: str = 'String', overwrite: bool = True) -> bool:
    """
    Put parameter in Parameter Store
    """
    try:
        ssm_client.put_parameter(
            Name=parameter_name,
            Value=parameter_value,
            Type=parameter_type,
            Overwrite=overwrite
        )
        return True
    except ClientError as e:
        logger.error(f"Put parameter failed: {str(e)}")
        return False

# ============================================================================
# CLOUDWATCH UTILITIES
# ============================================================================

def put_metric(namespace: str, metric_name: str, value: float,
               dimensions: List[Dict[str, str]] = None, unit: str = 'Count') -> bool:
    """
    Put custom metric to CloudWatch
    """
    try:
        metric_data = {
            'MetricName': metric_name,
            'Value': value,
            'Unit': unit,
            'Timestamp': datetime.utcnow()
        }
        
        if dimensions:
            metric_data['Dimensions'] = dimensions
        
        cloudwatch_client.put_metric_data(
            Namespace=namespace,
            MetricData=[metric_data]
        )
        return True
    except ClientError as e:
        logger.error(f"Put metric failed: {str(e)}")
        return False

def log_event(log_group: str, log_stream: str, message: str,
              timestamp: Optional[datetime] = None) -> bool:
    """
    Log event to CloudWatch Logs
    """
    try:
        logs_client = boto3.client('logs')
        
        if timestamp is None:
            timestamp = datetime.utcnow()
        
        # Create log stream if it doesn't exist
        try:
            logs_client.create_log_stream(
                logGroupName=log_group,
                logStreamName=log_stream
            )
        except logs_client.exceptions.ResourceAlreadyExistsException:
            pass
        
        # Put log event
        logs_client.put_log_events(
            logGroupName=log_group,
            logStreamName=log_stream,
            logEvents=[
                {
                    'timestamp': int(timestamp.timestamp() * 1000),
                    'message': message
                }
            ]
        )
        return True
    except ClientError as e:
        logger.error(f"Log event failed: {str(e)}")
        return False

def create_alarm(alarm_name: str, metric_name: str, namespace: str,
                 threshold: float, comparison_operator: str,
                 evaluation_periods: int = 1, period: int = 60,
                 statistic: str = 'Average', dimensions: List[Dict[str, str]] = None) -> bool:
    """
    Create CloudWatch alarm
    """
    try:
        alarm_config = {
            'AlarmName': alarm_name,
            'ComparisonOperator': comparison_operator,
            'EvaluationPeriods': evaluation_periods,
            'MetricName': metric_name,
            'Namespace': namespace,
            'Period': period,
            'Threshold': threshold,
            'Statistic': statistic
        }
        
        if dimensions:
            alarm_config['Dimensions'] = dimensions
        
        cloudwatch_client.put_metric_alarm(**alarm_config)
        return True
    except ClientError as e:
        logger.error(f"Create alarm failed: {str(e)}")
        return False

# ============================================================================
# LAMBDA UTILITIES
# ============================================================================

def invoke_lambda(function_name: str, payload: Dict[str, Any],
                  invocation_type: str = 'RequestResponse') -> Optional[Dict[str, Any]]:
    """
    Invoke Lambda function
    """
    try:
        response = lambda_client.invoke(
            FunctionName=function_name,
            InvocationType=invocation_type,
            Payload=json.dumps(payload)
        )
        
        if invocation_type == 'RequestResponse':
            result = json.loads(response['Payload'].read())
            return result
        
        return {'status': 'invoked'}
        
    except ClientError as e:
        logger.error(f"Invoke Lambda failed: {str(e)}")
        return None

def get_lambda_info(function_name: str) -> Optional[Dict[str, Any]]:
    """
    Get Lambda function information
    """
    try:
        response = lambda_client.get_function(FunctionName=function_name)
        
        config = response['Configuration']
        return {
            'name': config['FunctionName'],
            'arn': config['FunctionArn'],
            'runtime': config.get('Runtime'),
            'handler': config.get('Handler'),
            'memory_size': config.get('MemorySize'),
            'timeout': config.get('Timeout'),
            'last_modified': config.get('LastModified'),
            'state': config.get('State'),
            'environment': config.get('Environment', {}).get('Variables', {})
        }
    except ClientError as e:
        logger.error(f"Get Lambda info failed: {str(e)}")
        return None

# ============================================================================
# COGNITO UTILITIES
# ============================================================================

def cognito_signup(client_id: str, username: str, password: str,
                   email: str, user_attributes: Dict[str, str] = None) -> Optional[Dict[str, Any]]:
    """
    Sign up user in Cognito
    """
    try:
        if user_attributes is None:
            user_attributes = {}
        
        if 'email' not in user_attributes:
            user_attributes['email'] = email
        
        attrs_list = []
        for key, value in user_attributes.items():
            attrs_list.append({'Name': key, 'Value': value})
        
        response = cognito_client.sign_up(
            ClientId=client_id,
            Username=username,
            Password=password,
            UserAttributes=attrs_list
        )
        
        return {
            'user_sub': response['UserSub'],
            'code_delivery_details': response.get('CodeDeliveryDetails'),
            'user_confirmed': response['UserConfirmed']
        }
        
    except ClientError as e:
        logger.error(f"Cognito signup failed: {str(e)}")
        return None

def cognito_confirm_signup(client_id: str, username: str, confirmation_code: str) -> bool:
    """
    Confirm Cognito signup
    """
    try:
        cognito_client.confirm_sign_up(
            ClientId=client_id,
            Username=username,
            ConfirmationCode=confirmation_code
        )
        return True
    except ClientError as e:
        logger.error(f"Cognito confirm signup failed: {str(e)}")
        return False

def cognito_login(client_id: str, username: str, password: str) -> Optional[Dict[str, Any]]:
    """
    Login user with Cognito
    """
    try:
        response = cognito_client.initiate_auth(
            ClientId=client_id,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': username,
                'PASSWORD': password
            }
        )
        
        auth_result = response.get('AuthenticationResult', {})
        
        return {
            'access_token': auth_result.get('AccessToken'),
            'id_token': auth_result.get('IdToken'),
            'refresh_token': auth_result.get('RefreshToken'),
            'expires_in': auth_result.get('ExpiresIn'),
            'token_type': auth_result.get('TokenType')
        }
        
    except ClientError as e:
        logger.error(f"Cognito login failed: {str(e)}")
        return None

def cognito_get_user(access_token: str) -> Optional[Dict[str, Any]]:
    """
    Get Cognito user information
    """
    try:
        response = cognito_client.get_user(AccessToken=access_token)
        
        user_attributes = {}
        for attr in response.get('UserAttributes', []):
            user_attributes[attr['Name']] = attr['Value']
        
        return {
            'username': response['Username'],
            'user_attributes': user_attributes,
            'preferred_mfa_setting': response.get('PreferredMfaSetting'),
            'mfa_options': response.get('MFAOptions', [])
        }
        
    except ClientError as e:
        logger.error(f"Cognito get user failed: {str(e)}")
        return None

# ============================================================================
# GENERAL UTILITIES
# ============================================================================

def validate_email(email: str) -> bool:
    """
    Validate email address format
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_phone(phone: str) -> bool:
    """
    Validate phone number format (simple validation)
    """
    # Remove spaces, dashes, parentheses
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)
    
    # Check if it's all digits and has reasonable length
    if cleaned.startswith('+'):
        cleaned = cleaned[1:]
    
    return cleaned.isdigit() and 10 <= len(cleaned) <= 15

def generate_id(prefix: str = 'id') -> str:
    """
    Generate unique ID with prefix
    """
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_part = uuid.uuid4().hex[:8]
    return f"{prefix}_{timestamp}_{random_part}"

def parse_event(event: Dict[str, Any]) -> Dict[str, Any]:
    """
    Parse Lambda event and extract common components
    """
    result = {
        'http_method': event.get('httpMethod'),
        'path': event.get('path'),
        'path_parameters': event.get('pathParameters', {}),
        'query_parameters': event.get('queryStringParameters', {}),
        'headers': event.get('headers', {}),
        'body': None,
        'raw_body': event.get('body'),
        'request_context': event.get('requestContext', {}),
        'stage_variables': event.get('stageVariables', {})
    }
    
    # Parse body if present
    if event.get('body'):
        try:
            result['body'] = json.loads(event['body'])
        except (json.JSONDecodeError, TypeError):
            result['body'] = event['body']
    
    # Extract user information if available
    authorizer = event.get('requestContext', {}).get('authorizer')
    if authorizer:
        result['user'] = {
            'id': authorizer.get('principalId'),
            'claims': authorizer.get('claims', {})
        }
    
    return result

def format_response(status_code: int, body: Any, headers: Dict[str, str] = None) -> Dict[str, Any]:
    """
    Format Lambda response
    """
    if headers is None:
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True
        }
    
    if isinstance(body, dict):
        body = json.dumps(body)
    
    return {
        'statusCode': status_code,
        'headers': headers,
        'body': body
    }

def handle_error(error: Exception, status_code: int = 500) -> Dict[str, Any]:
    """
    Handle error and format error response
    """
    logger.error(f"Error occurred: {str(error)}", exc_info=True)
    
    error_response = {
        'error': type(error).__name__,
        'message': str(error),
        'timestamp': datetime.now().isoformat()
    }
    
    return format_response(status_code, error_response)

def retry_with_backoff(func: Callable, max_retries: int = MAX_RETRIES,
                       base_delay: int = RETRY_DELAY, *args, **kwargs) -> Any:
    """
    Retry function with exponential backoff
    """
    for attempt in range(max_retries + 1):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            if attempt == max_retries:
                raise e
            
            delay = base_delay * (2 ** attempt)
            logger.warning(f"Attempt {attempt + 1} failed, retrying in {delay}s: {str(e)}")
            time.sleep(delay)

def batch_process(items: List[Any], batch_size: int = 25) -> List[List[Any]]:
    """
    Split items into batches
    """
    return [items[i:i + batch_size] for i in range(0, len(items), batch_size)]

def is_json(string: str) -> bool:
    """
    Check if string is valid JSON
    """
    try:
        json.loads(string)
        return True
    except (json.JSONDecodeError, TypeError):
        return False