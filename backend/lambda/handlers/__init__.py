"""
Lambda Handlers Package

This package contains AWS Lambda handlers for the assessment platform.
Each handler is designed to be deployed as an independent AWS Lambda function.
"""

from . import assessment_handler
from . import auth_handler
from . import report_handler
from . import webhook_handler

__all__ = [
    "assessment_handler",
    "auth_handler",
    "report_handler",
    "webhook_handler"
]

# Lambda function mappings for easier import
# These can be used when configuring Lambda functions
assessment_lambda = assessment_handler.lambda_handler
auth_lambda = auth_handler.lambda_handler
report_lambda = report_handler.lambda_handler
webhook_lambda = webhook_handler.lambda_handler

# Handler configuration metadata
HANDLERS = {
    "assessment": {
        "handler": "handlers.assessment_handler.lambda_handler",
        "description": "Process assessment submissions and scoring",
        "timeout": 30,
        "memory": 512
    },
    "auth": {
        "handler": "handlers.auth_handler.lambda_handler",
        "description": "Handle authentication and authorization",
        "timeout": 10,
        "memory": 256
    },
    "report": {
        "handler": "handlers.report_handler.lambda_handler",
        "description": "Generate assessment reports and analytics",
        "timeout": 60,
        "memory": 1024
    },
    "webhook": {
        "handler": "handlers.webhook_handler.lambda_handler",
        "description": "Process webhook events from external services",
        "timeout": 15,
        "memory": 256
    }
}