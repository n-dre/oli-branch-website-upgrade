"""
AWS Utilities Lambda Layer
Shared AWS utilities for Lambda functions
"""

from .aws_utils import (
    # S3 Utilities
    upload_to_s3,
    download_from_s3,
    generate_presigned_url,
    list_s3_objects,
    delete_s3_object,
    copy_s3_object,
    
    # DynamoDB Utilities
    dynamodb_put_item,
    dynamodb_get_item,
    dynamodb_query,
    dynamodb_scan,
    dynamodb_update_item,
    dynamodb_delete_item,
    dynamodb_batch_write,
    
    # SQS Utilities
    sqs_send_message,
    sqs_receive_messages,
    sqs_delete_message,
    sqs_get_queue_attributes,
    
    # SNS Utilities
    sns_publish_message,
    sns_create_topic,
    sns_subscribe,
    
    # Secrets Manager
    get_secret,
    create_secret,
    update_secret,
    
    # Parameter Store
    get_parameter,
    put_parameter,
    
    # CloudWatch
    put_metric,
    log_event,
    create_alarm,
    
    # Lambda
    invoke_lambda,
    get_lambda_info,
    
    # Cognito
    cognito_signup,
    cognito_confirm_signup,
    cognito_login,
    cognito_get_user,
    
    # General Utilities
    validate_email,
    validate_phone,
    generate_id,
    parse_event,
    format_response,
    handle_error,
    retry_with_backoff
)

__version__ = "1.0.0"
__all__ = [
    # S3
    'upload_to_s3',
    'download_from_s3',
    'generate_presigned_url',
    'list_s3_objects',
    'delete_s3_object',
    'copy_s3_object',
    
    # DynamoDB
    'dynamodb_put_item',
    'dynamodb_get_item',
    'dynamodb_query',
    'dynamodb_scan',
    'dynamodb_update_item',
    'dynamodb_delete_item',
    'dynamodb_batch_write',
    
    # SQS
    'sqs_send_message',
    'sqs_receive_messages',
    'sqs_delete_message',
    'sqs_get_queue_attributes',
    
    # SNS
    'sns_publish_message',
    'sns_create_topic',
    'sns_subscribe',
    
    # Secrets
    'get_secret',
    'create_secret',
    'update_secret',
    
    # Parameter Store
    'get_parameter',
    'put_parameter',
    
    # CloudWatch
    'put_metric',
    'log_event',
    'create_alarm',
    
    # Lambda
    'invoke_lambda',
    'get_lambda_info',
    
    # Cognito
    'cognito_signup',
    'cognito_confirm_signup',
    'cognito_login',
    'cognito_get_user',
    
    # General
    'validate_email',
    'validate_phone',
    'generate_id',
    'parse_event',
    'format_response',
    'handle_error',
    'retry_with_backoff'
]