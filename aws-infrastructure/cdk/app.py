#!/usr/bin/env python3
import os
import aws_cdk as cdk

from stacks.network_stack import NetworkStack
from stacks.api_stack import ApiStack
from stacks.dynamodb_stack import DynamoDbStack
from stacks.s3_stack import S3Stack
from stacks.lambda_stack import LambdaStack
from stacks.cognito_stack import CognitoStack

app = cdk.App()

# -----------------------------
# Define AWS Environment
# -----------------------------
env = cdk.Environment(
    account=os.getenv("CDK_DEFAULT_ACCOUNT"),
    region=os.getenv("CDK_DEFAULT_REGION"),
)

# -----------------------------
# Network Stack
# -----------------------------
network_stack = NetworkStack(
    app,
    "OliBranchNetworkStack",
    env=env
)

# -----------------------------
# DynamoDB Stack
# -----------------------------
dynamodb_stack = DynamoDbStack(
    app,
    "OliBranchDynamoDbStack",
    env=env
)

# -----------------------------
# S3 Storage Stack
# -----------------------------
s3_stack = S3Stack(
    app,
    "OliBranchS3Stack",
    env=env
)

# -----------------------------
# Cognito Authentication Stack
# -----------------------------
cognito_stack = CognitoStack(
    app,
    "OliBranchCognitoStack",
    env=env
)

# -----------------------------
# Lambda Compute Stack
# -----------------------------
lambda_stack = LambdaStack(
    app,
    "OliBranchLambdaStack",
    vpc=network_stack.vpc,
    security_groups=[network_stack.lambda_sg],
    tables=dynamodb_stack.tables,
    buckets=s3_stack.buckets,
    env=env
)

# -----------------------------
# API Gateway Stack
# -----------------------------
api_stack = ApiStack(
    app,
    "OliBranchApiStack",
    vpc=network_stack.vpc,
    env=env
)

# -----------------------------
# Stack Dependencies
# -----------------------------
lambda_stack.add_dependency(network_stack)
lambda_stack.add_dependency(dynamodb_stack)
lambda_stack.add_dependency(s3_stack)

api_stack.add_dependency(lambda_stack)
api_stack.add_dependency(cognito_stack)

# -----------------------------
# Synthesize CloudFormation
# -----------------------------
app.synth()