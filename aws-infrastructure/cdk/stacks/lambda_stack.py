"""Lambda Stack - Serverless Functions"""

from aws_cdk import (
    Stack,
    aws_lambda as lambda_,
    aws_lambda_python_alpha as lambda_python,
    aws_iam as iam,
    aws_logs as logs,
    aws_s3 as s3,
    aws_dynamodb as dynamodb,
    aws_ec2 as ec2,
    Duration,
    CfnOutput,
)
from constructs import Construct

class LambdaStack(Stack):
    """Lambda Functions Infrastructure"""
    
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        vpc: ec2.IVpc,
        security_groups: list[ec2.ISecurityGroup],
        tables: dict[str, dynamodb.Table],
        buckets: dict[str, s3.Bucket],
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)
        
        # Lambda Execution Role
        self.lambda_role = iam.Role(
            self, "LambdaExecutionRole",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaBasicExecutionRole"
                ),
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaVPCAccessExecutionRole"
                )
            ]
        )
        
        # Grant permissions to DynamoDB tables
        for table in tables.values():
            table.grant_read_write_data(self.lambda_role)
        
        # Grant permissions to S3 buckets
        for bucket in buckets.values():
            bucket.grant_read_write(self.lambda_role)
        
        # Layer for common utilities
        self.common_layer = lambda_python.PythonLayerVersion(
            self, "CommonLayer",
            entry="lambda/layers/common",
            compatible_runtimes=[lambda_.Runtime.PYTHON_3_11],
            description="Common utilities for Lambda functions",
            layer_version_name="oli-branch-common"
        )
        
        # Layer for AI utilities
        self.ai_layer = lambda_python.PythonLayerVersion(
            self, "AILayer",
            entry="lambda/layers/ai",
            compatible_runtimes=[lambda_.Runtime.PYTHON_3_11],
            description="AI utilities for Lambda functions",
            layer_version_name="oli-branch-ai"
        )
        
        # Process Analysis Function
        self.process_analysis = lambda_python.PythonFunction(
            self, "ProcessAnalysisFunction",
            entry="lambda/handlers/process_analysis",
            index="index.py",
            handler="handler",
            runtime=lambda_.Runtime.PYTHON_3_11,
            layers=[self.common_layer, self.ai_layer],
            environment={
                "USERS_TABLE": tables["users"].table_name,
                "BUSINESSES_TABLE": tables["businesses"].table_name,
                "ASSESSMENTS_TABLE": tables["assessments"].table_name,
                "REPORTS_TABLE": tables["reports"].table_name,
                "LEAKS_TABLE": tables["leaks"].table_name,
                "RECOMMENDATIONS_TABLE": tables["recommendations"].table_name,
                "AUDIT_BUCKET": buckets["audit"].bucket_name,
            },
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
            ),
            security_groups=security_groups,
            timeout=Duration.minutes(5),
            memory_size=512,
            log_retention=logs.RetentionDays.ONE_WEEK
        )
        
        # Bank Sync Function
        self.bank_sync = lambda_python.PythonFunction(
            self, "BankSyncFunction",
            entry="lambda/handlers/bank_sync",
            index="index.py",
            handler="handler",
            runtime=lambda_.Runtime.PYTHON_3_11,
            layers=[self.common_layer],
            environment={
                "PLAID_CLIENT_ID": "plaid-client-id",
                "PLAID_ENVIRONMENT": "sandbox",
            },
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
            ),
            security_groups=security_groups,
            timeout=Duration.minutes(15),
            memory_size=1024,
            log_retention=logs.RetentionDays.ONE_WEEK
        )
        
        # Generate Report Function
        self.generate_report = lambda_python.PythonFunction(
            self, "GenerateReportFunction",
            entry="lambda/handlers/generate_report",
            index="index.py",
            handler="handler",
            runtime=lambda_.Runtime.PYTHON_3_11,
            layers=[self.common_layer],
            environment={
                "REPORTS_TABLE": tables["reports"].table_name,
                "REPORT_BUCKET": buckets["reports"].bucket_name,
            },
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
            ),
            security_groups=security_groups,
            timeout=Duration.minutes(2),
            memory_size=256,
            log_retention=logs.RetentionDays.ONE_WEEK
        )
        
        # Webhook Handler Function
        self.webhook_handler = lambda_python.PythonFunction(
            self, "WebhookHandlerFunction",
            entry="lambda/handlers/webhook_handler",
            index="index.py",
            handler="handler",
            runtime=lambda_.Runtime.PYTHON_3_11,
            layers=[self.common_layer],
            environment={
                "PROCESS_ANALYSIS_FUNCTION": self.process_analysis.function_name,
                "BANK_SYNC_FUNCTION": self.bank_sync.function_name,
            },
            timeout=Duration.seconds(30),
            memory_size=256,
            log_retention=logs.RetentionDays.ONE_WEEK
        )
        
        # Grant invoke permissions
        self.process_analysis.grant_invoke(self.webhook_handler)
        self.bank_sync.grant_invoke(self.webhook_handler)
        
        # Outputs
        CfnOutput(
            self, "ProcessAnalysisFunctionArn",
            value=self.process_analysis.function_arn,
            description="Process Analysis Lambda ARN"
        )
        
        CfnOutput(
            self, "BankSyncFunctionArn",
            value=self.bank_sync.function_arn,
            description="Bank Sync Lambda ARN"
        )
        
        CfnOutput(
            self, "GenerateReportFunctionArn",
            value=self.generate_report.function_arn,
            description="Generate Report Lambda ARN"
        )
        
        CfnOutput(
            self, "WebhookHandlerFunctionArn",
            value=self.webhook_handler.function_arn,
            description="Webhook Handler Lambda ARN"
        )