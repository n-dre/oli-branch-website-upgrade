"""
Test suite for the Oli-Branch backend application.
This module initializes the test environment and provides common test utilities.
"""

import os
import sys
import pytest
import json
from typing import Dict, Any, Optional, List
from unittest.mock import Mock, patch, MagicMock

# Add the parent directory to the Python path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Test configuration
TEST_ENV = "test"
TEST_DB_URL = "sqlite:///./test.db"
TEST_API_PREFIX = "/api/v1"

# ============================================================================
# TEST CONSTANTS
# ============================================================================

class TestConstants:
    """Constants for testing"""
    # Test user data
    TEST_USER_ID = "test_user_123"
    TEST_USER_EMAIL = "test@example.com"
    TEST_USER_PASSWORD = "TestPassword123!"
    TEST_USER_NAME = "Test User"
    
    # Test assessment data
    TEST_ASSESSMENT_ID = "test_assessment_123"
    TEST_ASSESSMENT_TITLE = "Sample Assessment"
    TEST_QUESTION_ID = "test_question_123"
    
    # Test result data
    TEST_RESULT_ID = "test_result_123"
    TEST_REPORT_ID = "test_report_123"
    
    # Test webhook data
    TEST_WEBHOOK_ID = "test_webhook_123"
    TEST_WEBHOOK_URL = "https://webhook.test.com/callback"
    
    # Test tokens
    TEST_ACCESS_TOKEN = "test_access_token_123"
    TEST_REFRESH_TOKEN = "test_refresh_token_123"
    
    # Test file data
    TEST_FILE_NAME = "test_file.pdf"
    TEST_FILE_SIZE = 1024  # 1KB
    TEST_FILE_TYPE = "application/pdf"

# ============================================================================
# TEST FIXTURES & UTILITIES
# ============================================================================

class TestUtils:
    """Utility functions for testing"""
    
    @staticmethod
    def create_mock_context() -> Mock:
        """Create a mock AWS Lambda context"""
        context = Mock()
        context.function_name = "test_function"
        context.function_version = "$LATEST"
        context.invoked_function_arn = "arn:aws:lambda:us-east-1:123456789012:function:test_function"
        context.memory_limit_in_mb = 128
        context.aws_request_id = "test-request-id"
        context.log_group_name = "/aws/lambda/test_function"
        context.log_stream_name = "2024/01/01/[$LATEST]test_stream"
        context.identity = None
        context.client_context = None
        
        # Add get_remaining_time_in_millis method
        context.get_remaining_time_in_millis.return_value = 30000
        
        return context
    
    @staticmethod
    def create_api_gateway_event(
        http_method: str = "GET",
        path: str = "/test",
        body: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
        query_params: Optional[Dict[str, str]] = None,
        path_params: Optional[Dict[str, str]] = None,
        stage_vars: Optional[Dict[str, str]] = None,
        authorizer: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a mock API Gateway event"""
        event = {
            "resource": "/test",
            "path": path,
            "httpMethod": http_method,
            "headers": headers or {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Host": "api.test.com",
                "User-Agent": "Test/1.0"
            },
            "multiValueHeaders": {},
            "queryStringParameters": query_params or {},
            "multiValueQueryStringParameters": {},
            "pathParameters": path_params or {},
            "stageVariables": stage_vars or {},
            "requestContext": {
                "resourceId": "test-resource-id",
                "resourcePath": path,
                "httpMethod": http_method,
                "extendedRequestId": "test-extended-request-id",
                "requestTime": "01/Jan/2024:12:00:00 +0000",
                "path": path,
                "accountId": "123456789012",
                "protocol": "HTTP/1.1",
                "stage": "test",
                "domainPrefix": "api",
                "requestTimeEpoch": 1704110400000,
                "requestId": "test-request-id",
                "identity": {
                    "cognitoIdentityPoolId": None,
                    "accountId": None,
                    "cognitoIdentityId": None,
                    "caller": None,
                    "apiKey": None,
                    "apiKeyId": None,
                    "accessKey": None,
                    "sourceIp": "127.0.0.1",
                    "cognitoAuthenticationType": None,
                    "cognitoAuthenticationProvider": None,
                    "userArn": None,
                    "userAgent": "Test/1.0",
                    "user": None
                },
                "domainName": "api.test.com",
                "apiId": "test-api-id"
            },
            "body": json.dumps(body) if body else None,
            "isBase64Encoded": False
        }
        
        if authorizer:
            event["requestContext"]["authorizer"] = authorizer
        
        return event
    
    @staticmethod
    def create_lambda_event(
        source: str = "aws:api-gateway",
        detail_type: str = "test.event",
        detail: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a mock Lambda event (non-API Gateway)"""
        return {
            "version": "0",
            "id": "test-event-id",
            "detail-type": detail_type,
            "source": source,
            "account": "123456789012",
            "time": "2024-01-01T12:00:00Z",
            "region": "us-east-1",
            "resources": [],
            "detail": detail or {}
        }
    
    @staticmethod
    def create_dynamodb_item(
        table_name: str,
        item: Dict[str, Any],
        operation: str = "INSERT"
    ) -> Dict[str, Any]:
        """Create a mock DynamoDB stream event item"""
        return {
            "eventID": "test-event-id",
            "eventName": operation,
            "eventVersion": "1.1",
            "eventSource": "aws:dynamodb",
            "awsRegion": "us-east-1",
            "dynamodb": {
                "ApproximateCreationDateTime": 1704110400,
                "Keys": {k: {"S": str(v)} for k, v in item.items() if k in ["id", "pk", "sk"]},
                "NewImage": {k: {"S": str(v)} for k, v in item.items()},
                "SequenceNumber": "1234567890",
                "SizeBytes": 100,
                "StreamViewType": "NEW_IMAGE"
            },
            "eventSourceARN": f"arn:aws:dynamodb:us-east-1:123456789012:table/{table_name}/stream/2024-01-01T12:00:00.000"
        }
    
    @staticmethod
    def create_s3_event(
        bucket: str = "test-bucket",
        key: str = "test/file.pdf",
        event_name: str = "ObjectCreated:Put"
    ) -> Dict[str, Any]:
        """Create a mock S3 event"""
        return {
            "Records": [
                {
                    "eventVersion": "2.1",
                    "eventSource": "aws:s3",
                    "awsRegion": "us-east-1",
                    "eventTime": "2024-01-01T12:00:00.000Z",
                    "eventName": event_name,
                    "userIdentity": {
                        "principalId": "AWS:ABCDEFGHIJKLMNOPQRSTU"
                    },
                    "requestParameters": {
                        "sourceIPAddress": "127.0.0.1"
                    },
                    "responseElements": {
                        "x-amz-request-id": "TEST123456789",
                        "x-amz-id-2": "TESTabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                    },
                    "s3": {
                        "s3SchemaVersion": "1.0",
                        "configurationId": "test-config-id",
                        "bucket": {
                            "name": bucket,
                            "ownerIdentity": {
                                "principalId": "ABCDEFGHIJKLMN"
                            },
                            "arn": f"arn:aws:s3:::{bucket}"
                        },
                        "object": {
                            "key": key,
                            "size": 1024,
                            "eTag": "0123456789abcdef0123456789abcdef",
                            "sequencer": "0A1B2C3D4E5F678901"
                        }
                    }
                }
            ]
        }
    
    @staticmethod
    def create_sqs_event(
        queue_arn: str = "arn:aws:sqs:us-east-1:123456789012:test-queue",
        body: Optional[Dict[str, Any]] = None,
        message_attributes: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a mock SQS event"""
        return {
            "Records": [
                {
                    "messageId": "test-message-id",
                    "receiptHandle": "test-receipt-handle",
                    "body": json.dumps(body) if body else "{}",
                    "attributes": {
                        "ApproximateReceiveCount": "1",
                        "SentTimestamp": "1704110400000",
                        "SenderId": "123456789012",
                        "ApproximateFirstReceiveTimestamp": "1704110400000"
                    },
                    "messageAttributes": message_attributes or {},
                    "md5OfBody": "0123456789abcdef0123456789abcdef",
                    "eventSource": "aws:sqs",
                    "eventSourceARN": queue_arn,
                    "awsRegion": "us-east-1"
                }
            ]
        }
    
    @staticmethod
    def assert_response_structure(response: Dict[str, Any]) -> None:
        """Assert that a response has the correct structure"""
        assert "statusCode" in response
        assert "headers" in response
        assert "body" in response
        
        # Parse body if it's a string
        if isinstance(response["body"], str):
            body = json.loads(response["body"])
        else:
            body = response["body"]
        
        # Check for success/error structure
        if response["statusCode"] < 400:
            assert "success" in body or "data" in body or "message" in body
        else:
            assert "error" in body or "message" in body
    
    @staticmethod
    def mock_dynamodb_response(
        item: Optional[Dict[str, Any]] = None,
        items: Optional[List[Dict[str, Any]]] = None,
        count: int = 0
    ) -> Dict[str, Any]:
        """Create a mock DynamoDB response"""
        if item is not None:
            return {"Item": item}
        elif items is not None:
            return {"Items": items, "Count": count}
        else:
            return {}

# ============================================================================
# TEST DECORATORS
# ============================================================================

def skip_if_no_env(var_name: str, reason: str = "Environment variable not set"):
    """Skip test if environment variable is not set"""
    def decorator(func):
        @pytest.mark.skipif(
            not os.getenv(var_name),
            reason=f"{reason}: {var_name}"
        )
        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)
        return wrapper
    return decorator

def integration_test(func):
    """Mark a test as an integration test"""
    func._is_integration_test = True
    return func

def unit_test(func):
    """Mark a test as a unit test"""
    func._is_unit_test = True
    return func

def slow_test(func):
    """Mark a test as slow-running"""
    func._is_slow_test = True
    return func

# ============================================================================
# TEST CLASSES
# ============================================================================

class BaseTest:
    """Base test class with common setup/teardown and utilities"""
    
    def setup_method(self, method):
        """Setup before each test method"""
        self.mocks = {}
        
        # Common environment variables for testing
        os.environ["AWS_REGION"] = "us-east-1"
        os.environ["STAGE"] = "test"
        os.environ["LOG_LEVEL"] = "DEBUG"
        
        # Disable AWS credentials for testing
        os.environ["AWS_ACCESS_KEY_ID"] = "testing"
        os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
        os.environ["AWS_SECURITY_TOKEN"] = "testing"
        os.environ["AWS_SESSION_TOKEN"] = "testing"
        
        # Test-specific environment variables
        os.environ["USERS_TABLE"] = "test-users"
        os.environ["ASSESSMENTS_TABLE"] = "test-assessments"
        os.environ["RESULTS_TABLE"] = "test-results"
        os.environ["REPORTS_TABLE"] = "test-reports"
        os.environ["WEBHOOKS_TABLE"] = "test-webhooks"
        os.environ["EVENTS_TABLE"] = "test-events"
        
        os.environ["ASSESSMENTS_BUCKET"] = "test-assessments-bucket"
        os.environ["REPORTS_BUCKET"] = "test-reports-bucket"
        os.environ["TEMPLATES_BUCKET"] = "test-templates-bucket"
        
        os.environ["JWT_SECRET"] = "test-secret-key-change-in-production"
        os.environ["JWT_ALGORITHM"] = "HS256"
        
        print(f"\nSetting up test: {method.__name__}")
    
    def teardown_method(self, method):
        """Teardown after each test method"""
        # Clean up mocks
        for mock in self.mocks.values():
            if hasattr(mock, 'stop'):
                mock.stop()
        
        # Clear test environment variables
        test_vars = [
            "USERS_TABLE", "ASSESSMENTS_TABLE", "RESULTS_TABLE",
            "REPORTS_TABLE", "WEBHOOKS_TABLE", "EVENTS_TABLE",
            "ASSESSMENTS_BUCKET", "REPORTS_BUCKET", "TEMPLATES_BUCKET",
            "JWT_SECRET", "JWT_ALGORITHM"
        ]
        
        for var in test_vars:
            if var in os.environ and var.startswith("test"):
                del os.environ[var]
        
        print(f"\nTearing down test: {method.__name__}")
    
    def mock_aws_service(self, service_name: str, **kwargs):
        """Mock an AWS service"""
        patcher = patch(f"boto3.client.{service_name}", **kwargs)
        mock = patcher.start()
        self.mocks[service_name] = patcher
        return mock
    
    def mock_module(self, module_path: str, **kwargs):
        """Mock a module or function"""
        patcher = patch(module_path, **kwargs)
        mock = patcher.start()
        self.mocks[module_path] = patcher
        return mock
    
    def assert_called_with_json(self, mock_call, expected_data: Dict[str, Any]):
        """Assert that a mock was called with specific JSON data"""
        call_args = mock_call.call_args
        
        # Handle different call formats
        if call_args:
            args, kwargs = call_args
            
            # Check in args
            for arg in args:
                if isinstance(arg, str):
                    try:
                        actual_data = json.loads(arg)
                        if actual_data == expected_data:
                            return
                    except json.JSONDecodeError:
                        continue
            
            # Check in kwargs
            for key, value in kwargs.items():
                if isinstance(value, str):
                    try:
                        actual_data = json.loads(value)
                        if actual_data == expected_data:
                            return
                    except json.JSONDecodeError:
                        continue
        
        # If we get here, the assertion failed
        pytest.fail(f"Mock was not called with expected JSON data: {expected_data}")

class APITest(BaseTest):
    """Base class for API endpoint tests"""
    
    def setup_method(self, method):
        """Setup before each API test"""
        super().setup_method(method)
        
        # Additional setup for API tests
        os.environ["API_GATEWAY_URL"] = "https://api.test.com/test"
        os.environ["ALLOWED_ORIGINS"] = "http://localhost:3000,http://127.0.0.1:3000"
    
    def assert_success_response(self, response: Dict[str, Any], status_code: int = 200):
        """Assert that a response indicates success"""
        assert response["statusCode"] == status_code
        
        body = json.loads(response["body"])
        assert "success" in body or "data" in body or "message" in body
        
        return body
    
    def assert_error_response(self, response: Dict[str, Any], status_code: int = 400):
        """Assert that a response indicates an error"""
        assert response["statusCode"] == status_code
        
        body = json.loads(response["body"])
        assert "error" in body or "message" in body
        
        return body
    
    def assert_validation_error(self, response: Dict[str, Any], field: str = None):
        """Assert that a response is a validation error"""
        body = self.assert_error_response(response, 400)
        
        if field:
            assert field in str(body).lower()
        
        return body

class LambdaTest(BaseTest):
    """Base class for Lambda function tests"""
    
    def setup_method(self, method):
        """Setup before each Lambda test"""
        super().setup_method(method)
        
        # Additional setup for Lambda tests
        os.environ["LAMBDA_TASK_ROOT"] = "/var/task"
        os.environ["LAMBDA_RUNTIME_DIR"] = "/var/runtime"
    
    def create_test_context(self) -> Mock:
        """Create a test Lambda context"""
        return TestUtils.create_mock_context()

# ============================================================================
# TEST CONFIGURATION
# ============================================================================

def pytest_configure(config):
    """Configure pytest"""
    # Register custom markers
    config.addinivalue_line("markers", "integration: mark test as integration test")
    config.addinivalue_line("markers", "unit: mark test as unit test")
    config.addinivalue_line("markers", "slow: mark test as slow-running")
    config.addinivalue_line("markers", "api: mark test as API test")
    config.addinivalue_line("markers", "lambda: mark test as Lambda function test")

def pytest_collection_modifyitems(config, items):
    """Modify test collection based on markers"""
    skip_integration = pytest.mark.skip(reason="Integration tests disabled")
    skip_slow = pytest.mark.skip(reason="Slow tests disabled")
    
    for item in items:
        # Skip integration tests if --no-integration flag is set
        if "integration" in item.keywords and config.getoption("--no-integration"):
            item.add_marker(skip_integration)
        
        # Skip slow tests if --no-slow flag is set
        if "slow" in item.keywords and config.getoption("--no-slow"):
            item.add_marker(skip_slow)

# ============================================================================
# EXPORTS
# ============================================================================

__all__ = [
    # Test constants
    "TestConstants",
    
    # Test utilities
    "TestUtils",
    
    # Test decorators
    "skip_if_no_env",
    "integration_test",
    "unit_test",
    "slow_test",
    
    # Test classes
    "BaseTest",
    "APITest",
    "LambdaTest",
    
    # Test configuration
    "TEST_ENV",
    "TEST_DB_URL",
    "TEST_API_PREFIX",
    
    # Pytest configuration
    "pytest_configure",
    "pytest_collection_modifyitems",
]

# ============================================================================
# TEST DISCOVERY
# ============================================================================

# This allows pytest to discover tests in this directory
# Tests should be placed in files matching test_*.py or *_test.py

print(f"Test environment: {TEST_ENV}")
print(f"Python path: {sys.path}")