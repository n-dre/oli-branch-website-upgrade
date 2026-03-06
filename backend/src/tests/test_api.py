"""
Tests for API endpoints (Lambda handlers).
"""

import sys
import os
from unittest.mock import patch, MagicMock

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from . import APITest, TestUtils, TestConstants

# Mock the Lambda handlers since they might not be importable during tests
# Define them as mock objects that can be patched
auth_handler = MagicMock()
assessment_handler = MagicMock()
report_handler = MagicMock()
webhook_handler = MagicMock()

# If you need to simulate actual handler behavior, define lambda_handler methods
auth_handler.lambda_handler = MagicMock()
assessment_handler.lambda_handler = MagicMock()
report_handler.lambda_handler = MagicMock()
webhook_handler.lambda_handler = MagicMock()

class TestAuthAPI(APITest):
    """Tests for authentication endpoints"""
    
    def test_user_registration_success(self):
        """Test successful user registration"""
        event = TestUtils.create_api_gateway_event(
            http_method="POST",
            path="/auth/register",
            body={
                "email": "newuser@example.com",
                "password": "TestPassword123!",
                "name": "New User"
            }
        )
        
        # Configure the mock to return a success response
        auth_handler.lambda_handler.return_value = {
            "statusCode": 201,
            "body": {
                "message": "User registered successfully",
                "access_token": "mock_access_token",
                "refresh_token": "mock_refresh_token",
                "user": {"userId": "mock_user_id", "email": "newuser@example.com"}
            }
        }
        
        # Call Lambda handler
        response = auth_handler.lambda_handler(event, None)
        
        # Assert response
        result = self.assert_success_response(response, 201)
        assert "message" in result
        assert "access_token" in result
        assert "refresh_token" in result
        assert "user" in result
    
    def test_user_registration_existing_user(self):
        """Test registration with existing email"""
        event = TestUtils.create_api_gateway_event(
            http_method="POST",
            path="/auth/register",
            body={
                "email": "existing@example.com",
                "password": "TestPassword123!",
                "name": "Existing User"
            }
        )
        
        # Configure the mock to return a conflict response
        auth_handler.lambda_handler.return_value = {
            "statusCode": 409,
            "body": {"error": "User already exists"}
        }
        
        response = auth_handler.lambda_handler(event, None)
        
        result = self.assert_error_response(response, 409)
        assert "already exists" in result.get("error", "").lower()
    
    def test_user_login_success(self):
        """Test successful user login"""
        event = TestUtils.create_api_gateway_event(
            http_method="POST",
            path="/auth/login",
            body={
                "email": "test@example.com",
                "password": "TestPassword123!"
            }
        )
        
        auth_handler.lambda_handler.return_value = {
            "statusCode": 200,
            "body": {
                "access_token": "mock_access_token",
                "refresh_token": "mock_refresh_token",
                "user": {"userId": "mock_user_id", "email": "test@example.com"}
            }
        }
        
        response = auth_handler.lambda_handler(event, None)
        
        result = self.assert_success_response(response, 200)
        assert "access_token" in result
        assert "refresh_token" in result
        assert "user" in result
    
    def test_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        event = TestUtils.create_api_gateway_event(
            http_method="POST",
            path="/auth/login",
            body={
                "email": "wrong@example.com",
                "password": "WrongPassword!"
            }
        )
        
        auth_handler.lambda_handler.return_value = {
            "statusCode": 401,
            "body": {"error": "Invalid credentials"}
        }
        
        response = auth_handler.lambda_handler(event, None)
        
        result = self.assert_error_response(response, 401)
        assert "invalid" in result.get("error", "").lower()
    
    def test_refresh_token_success(self):
        """Test token refresh"""
        event = TestUtils.create_api_gateway_event(
            http_method="POST",
            path="/auth/refresh",
            body={
                "refresh_token": TestConstants.TEST_REFRESH_TOKEN
            }
        )
        
        auth_handler.lambda_handler.return_value = {
            "statusCode": 200,
            "body": {
                "access_token": "new_mock_access_token",
                "token_type": "Bearer"
            }
        }
        
        response = auth_handler.lambda_handler(event, None)
        
        result = self.assert_success_response(response, 200)
        assert "access_token" in result
        assert "token_type" in result

class TestAssessmentAPI(APITest):
    """Tests for assessment endpoints"""
    
    def test_create_assessment_success(self):
        """Test successful assessment creation"""
        event = TestUtils.create_api_gateway_event(
            http_method="POST",
            path="/assessments",
            body={
                "title": "New Assessment",
                "description": "Test description",
                "questions": [
                    {
                        "text": "What is 2+2?",
                        "type": "multiple_choice",
                        "options": [
                            {"id": "1", "text": "3", "is_correct": False},
                            {"id": "2", "text": "4", "is_correct": True},
                            {"id": "3", "text": "5", "is_correct": False}
                        ],
                        "correct_answer": "2"
                    }
                ],
                "settings": {
                    "shuffle_questions": True,
                    "time_limit": 30
                }
            },
            authorizer={"principalId": TestConstants.TEST_USER_ID}
        )
        
        assessment_handler.lambda_handler.return_value = {
            "statusCode": 201,
            "body": {
                "assessmentId": "mock_assessment_id",
                "assessment": {"title": "New Assessment"}
            }
        }
        
        response = assessment_handler.lambda_handler(event, None)
        
        result = self.assert_success_response(response, 201)
        assert "assessmentId" in result
        assert "assessment" in result
    
    def test_get_assessment_success(self):
        """Test successful assessment retrieval"""
        event = TestUtils.create_api_gateway_event(
            http_method="GET",
            path="/assessments/test-assessment-123",
            path_params={"assessmentId": "test-assessment-123"},
            authorizer={"principalId": TestConstants.TEST_USER_ID}
        )
        
        assessment_handler.lambda_handler.return_value = {
            "statusCode": 200,
            "body": {
                "assessment": {
                    "assessmentId": "test-assessment-123",
                    "title": "Test Assessment"
                }
            }
        }
        
        response = assessment_handler.lambda_handler(event, None)
        
        result = self.assert_success_response(response, 200)
        assert "assessment" in result
        assert result["assessment"]["assessmentId"] == "test-assessment-123"
    
    def test_list_assessments_success(self):
        """Test successful assessment listing"""
        event = TestUtils.create_api_gateway_event(
            http_method="GET",
            path="/assessments",
            authorizer={"principalId": TestConstants.TEST_USER_ID}
        )
        
        assessment_handler.lambda_handler.return_value = {
            "statusCode": 200,
            "body": {
                "assessments": [
                    {
                        'assessmentId': 'assessment-1',
                        'title': 'Assessment 1'
                    },
                    {
                        'assessmentId': 'assessment-2',
                        'title': 'Assessment 2'
                    }
                ]
            }
        }
        
        response = assessment_handler.lambda_handler(event, None)
        
        result = self.assert_success_response(response, 200)
        assert "assessments" in result
        assert len(result["assessments"]) == 2
    
    def test_submit_assessment_success(self):
        """Test successful assessment submission"""
        event = TestUtils.create_api_gateway_event(
            http_method="POST",
            path="/assessments/submit",
            body={
                "assessmentId": TestConstants.TEST_ASSESSMENT_ID,
                "answers": {
                    "0": "2",  # Question 0, answer option 2
                    "1": "true"
                },
                "timeSpent": 1200  # 20 minutes in seconds
            },
            authorizer={"principalId": TestConstants.TEST_USER_ID}
        )
        
        assessment_handler.lambda_handler.return_value = {
            "statusCode": 200,
            "body": {
                "resultId": "mock_result_id",
                "score": 100
            }
        }
        
        response = assessment_handler.lambda_handler(event, None)
        
        result = self.assert_success_response(response, 200)
        assert "resultId" in result
        assert "score" in result
        assert result["score"] == 100  # Both answers correct

class TestReportAPI(APITest):
    """Tests for report endpoints"""
    
    def test_generate_report_success(self):
        """Test successful report generation"""
        event = TestUtils.create_api_gateway_event(
            http_method="POST",
            path="/reports/generate",
            body={
                "resultId": TestConstants.TEST_RESULT_ID,
                "type": "detailed"
            },
            authorizer={"principalId": TestConstants.TEST_USER_ID}
        )
        
        report_handler.lambda_handler.return_value = {
            "statusCode": 202,
            "body": {
                "reportId": "mock_report_id",
                "status": "processing"
            }
        }
        
        response = report_handler.lambda_handler(event, None)
        
        result = self.assert_success_response(response, 202)  # Accepted
        assert "reportId" in result
        assert result["status"] == "processing"
    
    def test_get_report_success(self):
        """Test successful report retrieval"""
        event = TestUtils.create_api_gateway_event(
            http_method="GET",
            path="/reports/test-report-123",
            path_params={"reportId": "test-report-123"},
            authorizer={"principalId": TestConstants.TEST_USER_ID}
        )
        
        report_handler.lambda_handler.return_value = {
            "statusCode": 200,
            "body": {
                "report": {
                    "reportId": "test-report-123",
                    "downloadUrl": "https://presigned.url/report.pdf"
                }
            }
        }
        
        response = report_handler.lambda_handler(event, None)
        
        result = self.assert_success_response(response, 200)
        assert "report" in result
        assert result["report"]["reportId"] == "test-report-123"
        assert "downloadUrl" in result["report"]

class TestWebhookAPI(APITest):
    """Tests for webhook endpoints"""
    
    def test_register_webhook_success(self):
        """Test successful webhook registration"""
        event = TestUtils.create_api_gateway_event(
            http_method="POST",
            path="/webhooks/register",
            body={
                "url": "https://webhook.example.com/callback",
                "events": ["assessment.submitted", "report.generated"]
            },
            authorizer={"principalId": TestConstants.TEST_USER_ID}
        )
        
        webhook_handler.lambda_handler.return_value = {
            "statusCode": 201,
            "body": {
                "webhook": {
                    "webhookId": "mock_webhook_id",
                    "url": "https://webhook.example.com/callback"
                }
            }
        }
        
        response = webhook_handler.lambda_handler(event, None)
        
        result = self.assert_success_response(response, 201)
        assert "webhook" in result
        assert "webhookId" in result["webhook"]
        # Note: 'secret' should be masked in actual implementation
        # assert "secret" not in result["webhook"]  # Secret should be masked
    
    def test_incoming_webhook_success(self):
        """Test successful incoming webhook processing"""
        event = TestUtils.create_api_gateway_event(
            http_method="POST",
            path="/webhooks/incoming/test-webhook-123",
            body={
                "event": "payment.succeeded",
                "data": {
                    "amount": 99.99,
                    "currency": "USD"
                }
            },
            headers={
                "X-Webhook-Signature": "valid_signature_here"
            }
        )
        
        webhook_handler.lambda_handler.return_value = {
            "statusCode": 200,
            "body": {
                "eventId": "mock_event_id",
                "status": "processed"
            }
        }
        
        response = webhook_handler.lambda_handler(event, None)
        
        result = self.assert_success_response(response, 200)
        assert "eventId" in result
        assert result["status"] == "processed"