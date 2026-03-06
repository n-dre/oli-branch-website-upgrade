import json
import boto3
import os
from datetime import datetime, timedelta
import jwt
from typing import Dict, Any

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')
users_table = dynamodb.Table(os.getenv('USERS_TABLE', 'users'))
jwt_secret = os.getenv('JWT_SECRET', 'your-secret-key-change-in-production')

def lambda_handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """
    Handle authentication requests
    Expected event format for login:
    {
        "path": "/auth/login",
        "httpMethod": "POST",
        "body": "{\"email\": \"user@example.com\", \"password\": \"password123\"}"
    }
    """
    try:
        http_method = event.get('httpMethod', '')
        path = event.get('path', '')
        
        if path.endswith('/login') and http_method == 'POST':
            return handle_login(event)
        elif path.endswith('/register') and http_method == 'POST':
            return handle_register(event)
        elif path.endswith('/refresh') and http_method == 'POST':
            return handle_refresh_token(event)
        elif path.endswith('/verify') and http_method == 'POST':
            return handle_verify_token(event)
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

def handle_login(event: Dict[str, Any]) -> Dict[str, Any]:
    """Handle user login"""
    body = json.loads(event.get('body', '{}'))
    email = body.get('email')
    password = body.get('password')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Email and password required'})
        }
    
    # Query DynamoDB for user
    response = users_table.get_item(Key={'email': email})
    
    if 'Item' not in response:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Invalid credentials'})
        }
    
    user = response['Item']
    
    # In production, use proper password hashing (bcrypt, argon2)
    if user['password'] != password:  # This should be hashed password comparison
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Invalid credentials'})
        }
    
    # Generate JWT tokens
    access_token = generate_jwt_token(user['userId'], 'access', expires_minutes=15)
    refresh_token = generate_jwt_token(user['userId'], 'refresh', expires_hours=24)
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer',
            'expires_in': 900,  # 15 minutes in seconds
            'user': {
                'id': user['userId'],
                'email': user['email'],
                'name': user.get('name', '')
            }
        })
    }

def handle_register(event: Dict[str, Any]) -> Dict[str, Any]:
    """Handle user registration"""
    body = json.loads(event.get('body', '{}'))
    email = body.get('email')
    password = body.get('password')
    name = body.get('name', '')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Email and password required'})
        }
    
    # Check if user exists
    response = users_table.get_item(Key={'email': email})
    
    if 'Item' in response:
        return {
            'statusCode': 409,
            'body': json.dumps({'error': 'User already exists'})
        }
    
    # Create new user
    user_id = f"user_{datetime.now().strftime('%Y%m%d%H%M%S')}"
    new_user = {
        'userId': user_id,
        'email': email,
        'password': password,  # Hash this in production!
        'name': name,
        'createdAt': datetime.now().isoformat(),
        'updatedAt': datetime.now().isoformat()
    }
    
    users_table.put_item(Item=new_user)
    
    # Generate tokens
    access_token = generate_jwt_token(user_id, 'access', expires_minutes=15)
    refresh_token = generate_jwt_token(user_id, 'refresh', expires_hours=24)
    
    return {
        'statusCode': 201,
        'body': json.dumps({
            'message': 'User registered successfully',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'token_type': 'Bearer',
            'user': {
                'id': user_id,
                'email': email,
                'name': name
            }
        })
    }

def handle_refresh_token(event: Dict[str, Any]) -> Dict[str, Any]:
    """Refresh access token using refresh token"""
    body = json.loads(event.get('body', '{}'))
    refresh_token = body.get('refresh_token')
    
    if not refresh_token:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Refresh token required'})
        }
    
    try:
        # Verify refresh token
        payload = jwt.decode(refresh_token, jwt_secret, algorithms=['HS256'])
        
        if payload.get('type') != 'refresh':
            return {
                'statusCode': 401,
                'body': json.dumps({'error': 'Invalid token type'})
            }
        
        user_id = payload.get('sub')
        
        # Generate new access token
        new_access_token = generate_jwt_token(user_id, 'access', expires_minutes=15)
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'access_token': new_access_token,
                'token_type': 'Bearer',
                'expires_in': 900
            })
        }
        
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Refresh token expired'})
        }
    except jwt.InvalidTokenError:
        return {
            'statusCode': 401,
            'body': json.dumps({'error': 'Invalid refresh token'})
        }

def handle_verify_token(event: Dict[str, Any]) -> Dict[str, Any]:
    """Verify JWT token"""
    body = json.loads(event.get('body', '{}'))
    token = body.get('token')
    
    if not token:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Token required'})
        }
    
    try:
        payload = jwt.decode(token, jwt_secret, algorithms=['HS256'])
        return {
            'statusCode': 200,
            'body': json.dumps({
                'valid': True,
                'payload': payload
            })
        }
    except jwt.ExpiredSignatureError:
        return {
            'statusCode': 401,
            'body': json.dumps({'valid': False, 'error': 'Token expired'})
        }
    except jwt.InvalidTokenError:
        return {
            'statusCode': 401,
            'body': json.dumps({'valid': False, 'error': 'Invalid token'})
        }

def generate_jwt_token(user_id: str, token_type: str, expires_minutes: int = None, expires_hours: int = None) -> str:
    """Generate JWT token"""
    now = datetime.utcnow()
    
    if expires_minutes:
        expiry = now + timedelta(minutes=expires_minutes)
    elif expires_hours:
        expiry = now + timedelta(hours=expires_hours)
    else:
        expiry = now + timedelta(hours=1)
    
    payload = {
        'sub': user_id,
        'type': token_type,
        'iat': now,
        'exp': expiry
    }
    
    return jwt.encode(payload, jwt_secret, algorithm='HS256')