import json
import boto3
import os
import hmac
import hashlib
from datetime import datetime
from typing import Dict, Any, Optional
import urllib.parse

# Initialize AWS clients
dynamodb = boto3.resource('dynamodb')
sqs_client = boto3.client('sqs')
sns_client = boto3.client('sns')

# Initialize DynamoDB tables
webhooks_table = dynamodb.Table(os.getenv('WEBHOOKS_TABLE', 'webhooks'))
events_table = dynamodb.Table(os.getenv('EVENTS_TABLE', 'webhook_events'))

# Webhook secret for signature verification
WEBHOOK_SECRET = os.getenv('WEBHOOK_SECRET', '')

def lambda_handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Handle incoming webhook requests and outgoing webhook dispatches
    """
    try:
        http_method = event.get('httpMethod', '')
        path = event.get('path', '')
        
        # Incoming webhook from external services
        if http_method == 'POST' and '/webhooks/incoming/' in path:
            return handle_incoming_webhook(event)
        
        # Outgoing webhook management
        elif http_method == 'POST' and '/webhooks/register' in path:
            return register_webhook(event)
        elif http_method == 'GET' and '/webhooks' in path:
            return list_webhooks(event)
        elif http_method == 'DELETE' and '/webhooks' in path:
            return delete_webhook(event)
        elif http_method == 'POST' and '/webhooks/test' in path:
            return test_webhook(event)
        elif http_method == 'POST' and '/webhooks/events' in path:
            return trigger_event(event)
        
        # Webhook status and logs
        elif http_method == 'GET' and '/webhooks/events' in path:
            return get_webhook_events(event)
        elif http_method == 'GET' and '/webhooks/deliveries' in path:
            return get_webhook_deliveries(event)
        
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

def handle_incoming_webhook(event: Dict[str, Any]) -> Dict[str, Any]:
    """Handle incoming webhook from external services"""
    headers = event.get('headers', {})
    body = event.get('body', '{}')
    path = event.get('path', '')
    
    # Extract webhook ID from path
    # Path format: /webhooks/incoming/{webhook_id}
    path_parts = path.split('/')
    webhook_id = path_parts[-1] if len(path_parts) > 3 else None
    
    if not webhook_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Webhook ID not found in path'})
        }
    
    # Get webhook configuration
    webhook_response = webhooks_table.get_item(
        Key={'webhookId': webhook_id, 'type': 'incoming'}
    )
    
    if 'Item' not in webhook_response:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Webhook not found'})
        }
    
    webhook_config = webhook_response['Item']
    
    # Verify signature if secret is configured
    if webhook_config.get('secret'):
        signature = headers.get('x-webhook-signature') or headers.get('X-Webhook-Signature')
        if not signature or not verify_signature(body, webhook_config['secret'], signature):
            return {
                'statusCode': 401,
                'body': json.dumps({'error': 'Invalid signature'})
            }
    
    # Parse webhook payload
    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid JSON payload'})
        }
    
    # Extract event type from headers or payload
    event_type = (
        headers.get('x-event-type') or 
        headers.get('X-Event-Type') or
        payload.get('event') or
        payload.get('type') or
        'unknown'
    )
    
    # Generate event ID
    event_id = f"evt_{datetime.now().strftime('%Y%m%d%H%M%S')}_{webhook_id[:8]}"
    
    # Store webhook event
    webhook_event = {
        'eventId': event_id,
        'webhookId': webhook_id,
        'type': 'incoming',
        'eventType': event_type,
        'payload': payload,
        'headers': headers,
        'receivedAt': datetime.now().isoformat(),
        'status': 'received',
        'sourceIp': event.get('requestContext', {}).get('identity', {}).get('sourceIp', ''),
        'userAgent': headers.get('user-agent', headers.get('User-Agent', ''))
    }
    
    events_table.put_item(Item=webhook_event)
    
    # Process webhook based on configuration
    process_incoming_webhook(webhook_config, webhook_event)
    
    # Return success response
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Webhook received successfully',
            'eventId': event_id,
            'status': 'processed'
        })
    }

def register_webhook(event: Dict[str, Any]) -> Dict[str, Any]:
    """Register a new webhook endpoint"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    body = json.loads(event.get('body', '{}'))
    
    # Validate required fields
    required_fields = ['url', 'events']
    for field in required_fields:
        if field not in body:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': f'{field} is required'})
            }
    
    # Generate webhook ID
    webhook_id = f"wh_{datetime.now().strftime('%Y%m%d%H%M%S')}_{user_id[:8]}"
    
    # Generate secret for webhook signature
    secret = generate_secret()
    
    # Create webhook configuration
    webhook_config = {
        'webhookId': webhook_id,
        'userId': user_id,
        'type': 'outgoing',
        'url': body['url'],
        'events': body['events'],  # List of events to subscribe to
        'secret': secret,
        'status': 'active',
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat(),
        'config': {
            'retryPolicy': body.get('retryPolicy', {'maxRetries': 3, 'backoffMultiplier': 2}),
            'timeout': body.get('timeout', 30),
            'headers': body.get('headers', {}),
            'enabled': body.get('enabled', True)
        },
        'metadata': body.get('metadata', {})
    }
    
    # Store webhook configuration
    webhooks_table.put_item(Item=webhook_config)
    
    # Return webhook info (excluding secret in response)
    response_config = webhook_config.copy()
    response_config['secret'] = '***'  # Mask secret in response
    response_config['verificationUrl'] = f"/webhooks/incoming/{webhook_id}"
    
    return {
        'statusCode': 201,
        'body': json.dumps({
            'message': 'Webhook registered successfully',
            'webhook': response_config
        })
    }

def list_webhooks(event: Dict[str, Any]) -> Dict[str, Any]:
    """List all webhooks for a user"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    # Get query parameters
    query_params = event.get('queryStringParameters', {})
    webhook_type = query_params.get('type', 'outgoing')  # outgoing or incoming
    
    # Query webhooks
    response = webhooks_table.query(
        KeyConditionExpression='userId = :uid AND #type = :tp',
        ExpressionAttributeNames={'#type': 'type'},
        ExpressionAttributeValues={
            ':uid': user_id,
            ':tp': webhook_type
        }
    )
    
    webhooks = response.get('Items', [])
    
    # Mask secrets in response
    for wh in webhooks:
        if 'secret' in wh:
            wh['secret'] = '***'
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'webhooks': webhooks,
            'count': len(webhooks)
        })
    }

def delete_webhook(event: Dict[str, Any]) -> Dict[str, Any]:
    """Delete a webhook"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    query_params = event.get('queryStringParameters', {})
    webhook_id = query_params.get('webhookId')
    
    if not webhook_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'webhookId is required'})
        }
    
    # Get webhook to verify ownership
    webhook_response = webhooks_table.get_item(
        Key={'webhookId': webhook_id, 'userId': user_id}
    )
    
    if 'Item' not in webhook_response:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Webhook not found'})
        }
    
    # Delete webhook
    webhooks_table.delete_item(
        Key={'webhookId': webhook_id, 'userId': user_id}
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Webhook deleted successfully',
            'webhookId': webhook_id
        })
    }

def test_webhook(event: Dict[str, Any]) -> Dict[str, Any]:
    """Test a webhook endpoint"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    body = json.loads(event.get('body', '{}'))
    webhook_id = body.get('webhookId')
    test_payload = body.get('payload', {'test': True, 'timestamp': datetime.now().isoformat()})
    
    if not webhook_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'webhookId is required'})
        }
    
    # Get webhook configuration
    webhook_response = webhooks_table.get_item(
        Key={'webhookId': webhook_id, 'userId': user_id}
    )
    
    if 'Item' not in webhook_response:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Webhook not found'})
        }
    
    webhook_config = webhook_response['Item']
    
    # Send test webhook
    test_event = {
        'eventId': f"test_{datetime.now().strftime('%Y%m%d%H%M%S')}",
        'webhookId': webhook_id,
        'type': 'test',
        'eventType': 'webhook.test',
        'payload': test_payload,
        'sentAt': datetime.now().isoformat()
    }
    
    # Dispatch webhook
    delivery_result = dispatch_webhook(webhook_config, test_event)
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Webhook test completed',
            'webhookId': webhook_id,
            'result': delivery_result
        })
    }

def trigger_event(event: Dict[str, Any]) -> Dict[str, Any]:
    """Trigger an event to notify registered webhooks"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    body = json.loads(event.get('body', '{}'))
    event_type = body.get('eventType')
    event_data = body.get('data', {})
    
    if not event_type:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'eventType is required'})
        }
    
    # Create event record
    event_id = f"evt_{datetime.now().strftime('%Y%m%d%H%M%S')}_{event_type[:8]}"
    
    event_record = {
        'eventId': event_id,
        'userId': user_id,
        'eventType': event_type,
        'data': event_data,
        'triggeredAt': datetime.now().isoformat(),
        'status': 'triggered'
    }
    
    events_table.put_item(Item=event_record)
    
    # Find webhooks subscribed to this event type
    response = webhooks_table.query(
        IndexName='events-index',
        KeyConditionExpression='userId = :uid',
        FilterExpression='contains(events, :event) AND #status = :active',
        ExpressionAttributeNames={'#status': 'status'},
        ExpressionAttributeValues={
            ':uid': user_id,
            ':event': event_type,
            ':active': 'active'
        }
    )
    
    webhooks = response.get('Items', [])
    
    # Prepare webhook payload
    webhook_payload = {
        'event': event_type,
        'eventId': event_id,
        'timestamp': datetime.now().isoformat(),
        'data': event_data,
        'metadata': {
            'userId': user_id,
            'source': 'assessment-platform'
        }
    }
    
    # Dispatch to each webhook
    delivery_results = []
    for webhook in webhooks:
        delivery_result = dispatch_webhook(webhook, webhook_payload)
        delivery_results.append({
            'webhookId': webhook['webhookId'],
            'url': webhook['url'],
            'success': delivery_result['success'],
            'statusCode': delivery_result.get('statusCode'),
            'message': delivery_result.get('message')
        })
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': 'Event triggered successfully',
            'eventId': event_id,
            'eventType': event_type,
            'webhooksNotified': len(webhooks),
            'deliveries': delivery_results
        })
    }

def get_webhook_events(event: Dict[str, Any]) -> Dict[str, Any]:
    """Get webhook events for a user"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    query_params = event.get('queryStringParameters', {})
    webhook_id = query_params.get('webhookId')
    event_type = query_params.get('eventType')
    limit = int(query_params.get('limit', 50))
    
    # Build query
    key_condition = 'userId = :uid'
    expression_values = {':uid': user_id}
    
    if webhook_id:
        key_condition += ' AND webhookId = :wid'
        expression_values[':wid'] = webhook_id
    
    # Query events
    response = events_table.query(
        KeyConditionExpression=key_condition,
        ExpressionAttributeValues=expression_values,
        Limit=limit,
        ScanIndexForward=False  # Most recent first
    )
    
    events = response.get('Items', [])
    
    # Filter by event type if provided
    if event_type:
        events = [e for e in events if e.get('eventType') == event_type]
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'events': events,
            'count': len(events)
        })
    }

def dispatch_webhook(webhook_config: Dict[str, Any], payload: Dict[str, Any]) -> Dict[str, Any]:
    """Dispatch webhook to target URL"""
    import requests
    
    url = webhook_config['url']
    secret = webhook_config.get('secret')
    timeout = webhook_config.get('config', {}).get('timeout', 30)
    headers = webhook_config.get('config', {}).get('headers', {})
    
    # Add signature if secret is provided
    if secret:
        signature = generate_signature(payload, secret)
        headers['X-Webhook-Signature'] = signature
    
    # Add webhook headers
    headers.update({
        'User-Agent': 'Assessment-Platform-Webhook/1.0',
        'Content-Type': 'application/json',
        'X-Webhook-Id': webhook_config['webhookId'],
        'X-Event-Type': payload.get('event', 'unknown')
    })
    
    try:
        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=timeout
        )
        
        # Log delivery attempt
        log_delivery_attempt(webhook_config['webhookId'], payload, response.status_code, response.text)
        
        return {
            'success': response.status_code in [200, 201, 202],
            'statusCode': response.status_code,
            'message': response.text[:500] if response.text else 'No response body'
        }
        
    except requests.exceptions.Timeout:
        log_delivery_attempt(webhook_config['webhookId'], payload, 408, 'Request timeout')
        return {
            'success': False,
            'statusCode': 408,
            'message': 'Request timeout'
        }
    except requests.exceptions.RequestException as e:
        log_delivery_attempt(webhook_config['webhookId'], payload, 500, str(e))
        return {
            'success': False,
            'statusCode': 500,
            'message': str(e)
        }

def process_incoming_webhook(webhook_config: Dict[str, Any], webhook_event: Dict[str, Any]):
    """Process incoming webhook based on configuration"""
    # This function would contain business logic for handling incoming webhooks
    # Examples:
    # - Update assessment status
    # - Process payment notifications
    # - Sync data with external systems
    # - Trigger notifications
    
    event_type = webhook_event['eventType']
    payload = webhook_event['payload']
    
    # Example: Handle payment webhook
    if event_type == 'payment.succeeded':
        # Update assessment access for paid user
        pass
    elif event_type == 'assessment.completed':
        # Trigger certificate generation
        pass
    elif event_type == 'user.registered':
        # Sync user with CRM
        pass
    
    # Update event status
    events_table.update_item(
        Key={'eventId': webhook_event['eventId']},
        UpdateExpression='SET #status = :status, processedAt = :now',
        ExpressionAttributeNames={'#status': 'status'},
        ExpressionAttributeValues={
            ':status': 'processed',
            ':now': datetime.now().isoformat()
        }
    )

def verify_signature(payload: str, secret: str, signature: str) -> bool:
    """Verify webhook signature"""
    expected_signature = generate_signature(payload, secret)
    return hmac.compare_digest(expected_signature, signature)

def generate_signature(payload: Any, secret: str) -> str:
    """Generate HMAC signature for webhook"""
    if isinstance(payload, dict):
        payload_str = json.dumps(payload, sort_keys=True)
    else:
        payload_str = str(payload)
    
    return hmac.new(
        secret.encode('utf-8'),
        payload_str.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

def generate_secret() -> str:
    """Generate random webhook secret"""
    import secrets
    return secrets.token_urlsafe(32)

def log_delivery_attempt(webhook_id: str, payload: Dict[str, Any], status_code: int, response: str):
    """Log webhook delivery attempt"""
    delivery_id = f"delivery_{datetime.now().strftime('%Y%m%d%H%M%S')}_{webhook_id[:8]}"
    
    delivery_log = {
        'deliveryId': delivery_id,
        'webhookId': webhook_id,
        'payload': payload,
        'statusCode': status_code,
        'response': response[:1000],  # Limit response size
        'deliveredAt': datetime.now().isoformat(),
        'success': 200 <= status_code < 300
    }
    
    # Store in DynamoDB or send to CloudWatch Logs
    events_table.put_item(Item=delivery_log)

def get_user_id_from_event(event: Dict[str, Any]) -> Optional[str]:
    """Extract user ID from authorization header"""
    headers = event.get('headers', {})
    auth_header = headers.get('authorization', headers.get('Authorization', ''))
    
    if not auth_header.startswith('Bearer '):
        return None
    
    # In production, decode JWT to get user ID
    # For now, return mock user ID
    return 'user_123'

def get_webhook_deliveries(event: Dict[str, Any]) -> Dict[str, Any]:
    """Get webhook delivery logs"""
    user_id = get_user_id_from_event(event)
    
    if not user_id:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    query_params = event.get('queryStringParameters', {})
    webhook_id = query_params.get('webhookId')
    limit = int(query_params.get('limit', 50))
    
    # Query delivery logs
    # Note: This assumes deliveries are stored in events_table with a type field
    response = events_table.query(
        KeyConditionExpression='userId = :uid',
        FilterExpression='attribute_exists(deliveryId)',
        ExpressionAttributeValues={':uid': user_id},
        Limit=limit,
        ScanIndexForward=False
    )
    
    deliveries = response.get('Items', [])
    
    # Filter by webhook ID if provided
    if webhook_id:
        deliveries = [d for d in deliveries if d.get('webhookId') == webhook_id]
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'deliveries': deliveries,
            'count': len(deliveries)
        })
    }