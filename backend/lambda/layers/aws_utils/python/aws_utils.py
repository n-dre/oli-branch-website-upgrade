# backend/lambda/layers/aws_utils/python/aws_utils.py
"""
AWS Utility Functions for Lambda Layer
Comprehensive utilities for all AWS services used by Oli-Branch
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

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Constants
MAX_RETRIES = 3
RETRY_DELAY = 1  # seconds
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')

# Initialize AWS clients (lazy initialization to avoid cold start issues)
_clients = {}


def get_client(service_name: str):
    """Lazy initialize AWS clients"""
    if service_name not in _clients:
        _clients[service_name] = boto3.client(service_name, region_name=AWS_REGION)
    return _clients[service_name]


# ============================================================================
# S3 UTILITIES
# ============================================================================

class S3Manager:
    """S3 operations manager"""
    
    def __init__(self, bucket_name: Optional[str] = None):
        self.client = get_client('s3')
        self.bucket = bucket_name or os.getenv('S3_BUCKET_NAME')
    
    def upload(self, key: str, data: Union[str, bytes], 
               content_type: str = None, metadata: Dict[str, str] = None) -> Dict[str, Any]:
        """Upload data to S3"""
        try:
            extra_args = {}
            if content_type:
                extra_args['ContentType'] = content_type
            if metadata:
                extra_args['Metadata'] = metadata
            
            if isinstance(data, str):
                data = data.encode('utf-8')
            
            self.client.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=data,
                **extra_args
            )
            
            return {
                'success': True,
                'bucket': self.bucket,
                'key': key,
                'url': f"s3://{self.bucket}/{key}"
            }
            
        except ClientError as e:
            logger.error(f"S3 upload failed: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def download(self, key: str, as_string: bool = True) -> Optional[Union[str, bytes]]:
        """Download data from S3"""
        try:
            response = self.client.get_object(Bucket=self.bucket, Key=key)
            data = response['Body'].read()
            
            if as_string:
                return data.decode('utf-8')
            return data
            
        except ClientError as e:
            logger.error(f"S3 download failed: {str(e)}")
            return None
    
    def generate_presigned_url(self, key: str, expiration: int = 3600,
                               operation: str = 'get_object') -> Optional[str]:
        """Generate presigned URL for S3 object"""
        try:
            url = self.client.generate_presigned_url(
                ClientMethod=operation,
                Params={'Bucket': self.bucket, 'Key': key},
                ExpiresIn=expiration
            )
            return url
        except ClientError as e:
            logger.error(f"Presigned URL generation failed: {str(e)}")
            return None
    
    def list_objects(self, prefix: str = '', max_keys: int = 1000) -> List[Dict[str, Any]]:
        """List objects in bucket with prefix"""
        try:
            response = self.client.list_objects_v2(
                Bucket=self.bucket,
                Prefix=prefix,
                MaxKeys=max_keys
            )
            
            objects = []
            for obj in response.get('Contents', []):
                objects.append({
                    'key': obj['Key'],
                    'size': obj['Size'],
                    'last_modified': obj['LastModified'].isoformat(),
                    'etag': obj['ETag'].strip('"')
                })
            
            return objects
            
        except ClientError as e:
            logger.error(f"S3 list objects failed: {str(e)}")
            return []
    
    def delete(self, key: str) -> bool:
        """Delete object from S3"""
        try:
            self.client.delete_object(Bucket=self.bucket, Key=key)
            return True
        except ClientError as e:
            logger.error(f"S3 delete failed: {str(e)}")
            return False
    
    def copy(self, source_key: str, dest_key: str, dest_bucket: Optional[str] = None) -> bool:
        """Copy object within or between buckets"""
        try:
            dest_bucket = dest_bucket or self.bucket
            copy_source = {'Bucket': self.bucket, 'Key': source_key}
            self.client.copy_object(
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

class DynamoDBManager:
    """DynamoDB operations manager"""
    
    def __init__(self, table_name: str):
        self.table_name = table_name
        self.resource = boto3.resource('dynamodb', region_name=AWS_REGION)
        self.client = get_client('dynamodb')
        self.table = self.resource.Table(table_name)
    
    def put_item(self, item: Dict[str, Any]) -> bool:
        """Put item into DynamoDB table"""
        try:
            self.table.put_item(Item=item)
            return True
        except ClientError as e:
            logger.error(f"DynamoDB put item failed: {str(e)}")
            return False
    
    def get_item(self, key: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Get item from DynamoDB table"""
        try:
            response = self.table.get_item(Key=key)
            return response.get('Item')
        except ClientError as e:
            logger.error(f"DynamoDB get item failed: {str(e)}")
            return None
    
    def query(self, key_condition_expression: str,
              expression_attribute_values: Dict[str, Any],
              index_name: str = None, limit: int = None,
              scan_index_forward: bool = True) -> List[Dict[str, Any]]:
        """Query DynamoDB table"""
        try:
            kwargs = {
                'KeyConditionExpression': key_condition_expression,
                'ExpressionAttributeValues': expression_attribute_values,
                'ScanIndexForward': scan_index_forward
            }
            
            if index_name:
                kwargs['IndexName'] = index_name
            if limit:
                kwargs['Limit'] = limit
            
            response = self.table.query(**kwargs)
            return response.get('Items', [])
            
        except ClientError as e:
            logger.error(f"DynamoDB query failed: {str(e)}")
            return []
    
    def scan(self, filter_expression: str = None,
             expression_attribute_values: Dict[str, Any] = None,
             limit: int = None) -> List[Dict[str, Any]]:
        """Scan DynamoDB table"""
        try:
            kwargs = {}
            if filter_expression and expression_attribute_values:
                kwargs['FilterExpression'] = filter_expression
                kwargs['ExpressionAttributeValues'] = expression_attribute_values
            if limit:
                kwargs['Limit'] = limit
            
            response = self.table.scan(**kwargs)
            return response.get('Items', [])
            
        except ClientError as e:
            logger.error(f"DynamoDB scan failed: {str(e)}")
            return []
    
    def update_item(self, key: Dict[str, Any],
                    update_expression: str,
                    expression_attribute_values: Dict[str, Any],
                    expression_attribute_names: Dict[str, str] = None) -> bool:
        """Update item in DynamoDB table"""
        try:
            kwargs = {
                'Key': key,
                'UpdateExpression': update_expression,
                'ExpressionAttributeValues': expression_attribute_values
            }
            
            if expression_attribute_names:
                kwargs['ExpressionAttributeNames'] = expression_attribute_names
            
            self.table.update_item(**kwargs)
            return True
            
        except ClientError as e:
            logger.error(f"DynamoDB update item failed: {str(e)}")
            return False
    
    def delete_item(self, key: Dict[str, Any]) -> bool:
        """Delete item from DynamoDB table"""
        try:
            self.table.delete_item(Key=key)
            return True
        except ClientError as e:
            logger.error(f"DynamoDB delete item failed: {str(e)}")
            return False
    
    def batch_write(self, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Batch write items to DynamoDB table"""
        try:
            with self.table.batch_writer() as batch:
                for item in items:
                    batch.put_item(Item=item)
            
            return {'success': True, 'items_processed': len(items)}
            
        except ClientError as e:
            logger.error(f"DynamoDB batch write failed: {str(e)}")
            return {'success': False, 'error': str(e), 'items_processed': 0}


# ============================================================================
# SQS UTILITIES
# ============================================================================

class SQSManager:
    """SQS operations manager"""
    
    def __init__(self, queue_url: Optional[str] = None):
        self.client = get_client('sqs')
        self.queue_url = queue_url or os.getenv('SQS_QUEUE_URL')
    
    def send_message(self, message_body: Union[str, Dict],
                     message_attributes: Dict[str, Any] = None,
                     delay_seconds: int = 0) -> Optional[str]:
        """Send message to SQS queue"""
        try:
            if isinstance(message_body, dict):
                message_body = json.dumps(message_body)
            
            kwargs = {
                'QueueUrl': self.queue_url,
                'MessageBody': message_body,
                'DelaySeconds': delay_seconds
            }
            
            if message_attributes:
                kwargs['MessageAttributes'] = message_attributes
            
            response = self.client.send_message(**kwargs)
            return response.get('MessageId')
            
        except ClientError as e:
            logger.error(f"SQS send message failed: {str(e)}")
            return None
    
    def receive_messages(self, max_messages: int = 10,
                         wait_time_seconds: int = 0) -> List[Dict[str, Any]]:
        """Receive messages from SQS queue"""
        try:
            response = self.client.receive_message(
                QueueUrl=self.queue_url,
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
    
    def delete_message(self, receipt_handle: str) -> bool:
        """Delete message from SQS queue"""
        try:
            self.client.delete_message(
                QueueUrl=self.queue_url,
                ReceiptHandle=receipt_handle
            )
            return True
        except ClientError as e:
            logger.error(f"SQS delete message failed: {str(e)}")
            return False


# ============================================================================
# SECRETS MANAGER UTILITIES
# ============================================================================

class SecretsManager:
    """Secrets Manager operations"""
    
    def __init__(self):
        self.client = get_client('secretsmanager')
    
    def get_secret(self, secret_name: str) -> Optional[Dict[str, Any]]:
        """Get secret from Secrets Manager"""
        try:
            response = self.client.get_secret_value(SecretId=secret_name)
            
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
    
    def create_secret(self, secret_name: str, secret_value: Union[str, Dict]) -> bool:
        """Create secret in Secrets Manager"""
        try:
            if isinstance(secret_value, dict):
                secret_value = json.dumps(secret_value)
            
            self.client.create_secret(
                Name=secret_name,
                SecretString=secret_value
            )
            return True
        except ClientError as e:
            logger.error(f"Create secret failed: {str(e)}")
            return False
    
    def update_secret(self, secret_name: str, secret_value: Union[str, Dict]) -> bool:
        """Update secret in Secrets Manager"""
        try:
            if isinstance(secret_value, dict):
                secret_value = json.dumps(secret_value)
            
            self.client.update_secret(
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

class ParameterStore:
    """SSM Parameter Store operations"""
    
    def __init__(self):
        self.client = get_client('ssm')
    
    def get_parameter(self, parameter_name: str, with_decryption: bool = False) -> Optional[str]:
        """Get parameter from Parameter Store"""
        try:
            response = self.client.get_parameter(
                Name=parameter_name,
                WithDecryption=with_decryption
            )
            return response['Parameter']['Value']
        except ClientError as e:
            logger.error(f"Get parameter failed: {str(e)}")
            return None
    
    def put_parameter(self, parameter_name: str, parameter_value: str,
                      parameter_type: str = 'String', overwrite: bool = True) -> bool:
        """Put parameter in Parameter Store"""
        try:
            self.client.put_parameter(
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

class CloudWatchManager:
    """CloudWatch operations"""
    
    def __init__(self):
        self.client = get_client('cloudwatch')
        self.logs_client = get_client('logs')
    
    def put_metric(self, namespace: str, metric_name: str, value: float,
                   dimensions: List[Dict[str, str]] = None, unit: str = 'Count') -> bool:
        """Put custom metric to CloudWatch"""
        try:
            metric_data = {
                'MetricName': metric_name,
                'Value': value,
                'Unit': unit,
                'Timestamp': datetime.utcnow()
            }
            
            if dimensions:
                metric_data['Dimensions'] = dimensions
            
            self.client.put_metric_data(
                Namespace=namespace,
                MetricData=[metric_data]
            )
            return True
        except ClientError as e:
            logger.error(f"Put metric failed: {str(e)}")
            return False
    
    def log_event(self, log_group: str, log_stream: str, message: str,
                  timestamp: Optional[datetime] = None) -> bool:
        """Log event to CloudWatch Logs"""
        try:
            if timestamp is None:
                timestamp = datetime.utcnow()
            
            # Create log stream if it doesn't exist
            try:
                self.logs_client.create_log_stream(
                    logGroupName=log_group,
                    logStreamName=log_stream
                )
            except self.logs_client.exceptions.ResourceAlreadyExistsException:
                pass
            
            # Put log event
            self.logs_client.put_log_events(
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


# ============================================================================
# LAMBDA UTILITIES
# ============================================================================

class LambdaManager:
    """Lambda operations"""
    
    def __init__(self):
        self.client = get_client('lambda')
    
    def invoke(self, function_name: str, payload: Dict[str, Any],
               invocation_type: str = 'RequestResponse') -> Optional[Dict[str, Any]]:
        """Invoke Lambda function"""
        try:
            response = self.client.invoke(
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


# ============================================================================
# COGNITO UTILITIES
# ============================================================================

class CognitoManager:
    """Cognito operations"""
    
    def __init__(self, user_pool_id: Optional[str] = None, client_id: Optional[str] = None):
        self.client = get_client('cognito-idp')
        self.user_pool_id = user_pool_id or os.getenv('COGNITO_USER_POOL_ID')
        self.client_id = client_id or os.getenv('COGNITO_CLIENT_ID')
    
    def signup(self, username: str, password: str, email: str,
               user_attributes: Dict[str, str] = None) -> Optional[Dict[str, Any]]:
        """Sign up user in Cognito"""
        try:
            if user_attributes is None:
                user_attributes = {}
            
            if 'email' not in user_attributes:
                user_attributes['email'] = email
            
            attrs_list = [{'Name': k, 'Value': v} for k, v in user_attributes.items()]
            
            response = self.client.sign_up(
                ClientId=self.client_id,
                Username=username,
                Password=password,
                UserAttributes=attrs_list
            )
            
            return {
                'user_sub': response['UserSub'],
                'user_confirmed': response['UserConfirmed']
            }
            
        except ClientError as e:
            logger.error(f"Cognito signup failed: {str(e)}")
            return None
    
    def login(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """Login user with Cognito"""
        try:
            response = self.client.initiate_auth(
                ClientId=self.client_id,
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
                'expires_in': auth_result.get('ExpiresIn')
            }
            
        except ClientError as e:
            logger.error(f"Cognito login failed: {str(e)}")
            return None
    
    def get_user(self, access_token: str) -> Optional[Dict[str, Any]]:
        """Get Cognito user information"""
        try:
            response = self.client.get_user(AccessToken=access_token)
            
            user_attributes = {}
            for attr in response.get('UserAttributes', []):
                user_attributes[attr['Name']] = attr['Value']
            
            return {
                'username': response['Username'],
                'user_attributes': user_attributes
            }
            
        except ClientError as e:
            logger.error(f"Cognito get user failed: {str(e)}")
            return None


# ============================================================================
# GENERAL UTILITIES
# ============================================================================

def validate_email(email: str) -> bool:
    """Validate email address format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def generate_id(prefix: str = 'id') -> str:
    """Generate unique ID with prefix"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_part = uuid.uuid4().hex[:8]
    return f"{prefix}_{timestamp}_{random_part}"


def parse_lambda_event(event: Dict[str, Any]) -> Dict[str, Any]:
    """Parse Lambda event and extract common components"""
    result = {
        'http_method': event.get('httpMethod'),
        'path': event.get('path'),
        'path_parameters': event.get('pathParameters', {}),
        'query_parameters': event.get('queryStringParameters', {}),
        'headers': event.get('headers', {}),
        'body': None,
        'raw_body': event.get('body'),
        'request_context': event.get('requestContext', {})
    }
    
    # Parse body if present
    if event.get('body'):
        try:
            result['body'] = json.loads(event['body'])
        except (json.JSONDecodeError, TypeError):
            result['body'] = event['body']
    
    return result


def format_response(status_code: int, body: Any, 
                   headers: Dict[str, str] = None) -> Dict[str, Any]:
    """Format Lambda response"""
    if headers is None:
        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true'
        }
    
    if isinstance(body, (dict, list)):
        body = json.dumps(body, default=str)
    
    return {
        'statusCode': status_code,
        'headers': headers,
        'body': body
    }


def retry_with_backoff(func: Callable, max_retries: int = MAX_RETRIES,
                       base_delay: int = RETRY_DELAY, *args, **kwargs) -> Any:
    """Retry function with exponential backoff"""
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