"""DynamoDB Stack - NoSQL Database Tables"""

from aws_cdk import (
    Stack,
    aws_dynamodb as dynamodb,
    RemovalPolicy,
    CfnOutput,
    Duration,
)
from constructs import Construct


class DynamoDbStack(Stack):
    """DynamoDB Tables Infrastructure"""

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # -----------------------------
        # Users Table
        # -----------------------------
        self.users_table = dynamodb.Table(
            self,
            "UsersTable",
            table_name=f"oli-branch-users-{self.stack_name.lower()}",
            partition_key=dynamodb.Attribute(
                name="userId",
                type=dynamodb.AttributeType.STRING,
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
            point_in_time_recovery_specification=dynamodb.PointInTimeRecoverySpecification(
                point_in_time_recovery_enabled=True
            ),
            time_to_live_attribute="ttl",
        )

        self.users_table.add_global_secondary_index(
            index_name="EmailIndex",
            partition_key=dynamodb.Attribute(
                name="email",
                type=dynamodb.AttributeType.STRING,
            ),
        )

        # -----------------------------
        # Businesses Table
        # -----------------------------
        self.businesses_table = dynamodb.Table(
            self,
            "BusinessesTable",
            table_name=f"oli-branch-businesses-{self.stack_name.lower()}",
            partition_key=dynamodb.Attribute(
                name="businessId",
                type=dynamodb.AttributeType.STRING,
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
            point_in_time_recovery_specification=dynamodb.PointInTimeRecoverySpecification(
                point_in_time_recovery_enabled=True
            ),
        )

        self.businesses_table.add_global_secondary_index(
            index_name="UserIdIndex",
            partition_key=dynamodb.Attribute(
                name="userId",
                type=dynamodb.AttributeType.STRING,
            ),
        )

        self.businesses_table.add_global_secondary_index(
            index_name="EinIndex",
            partition_key=dynamodb.Attribute(
                name="ein",
                type=dynamodb.AttributeType.STRING,
            ),
        )

        # -----------------------------
        # Assessments Table
        # -----------------------------
        self.assessments_table = dynamodb.Table(
            self,
            "AssessmentsTable",
            table_name=f"oli-branch-assessments-{self.stack_name.lower()}",
            partition_key=dynamodb.Attribute(
                name="assessmentId",
                type=dynamodb.AttributeType.STRING,
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
            point_in_time_recovery_specification=dynamodb.PointInTimeRecoverySpecification(
                point_in_time_recovery_enabled=True
            ),
        )

        self.assessments_table.add_global_secondary_index(
            index_name="BusinessIdIndex",
            partition_key=dynamodb.Attribute(
                name="businessId",
                type=dynamodb.AttributeType.STRING,
            ),
            sort_key=dynamodb.Attribute(
                name="submittedAt",
                type=dynamodb.AttributeType.STRING,
            ),
        )

        # -----------------------------
        # Reports Table
        # -----------------------------
        self.reports_table = dynamodb.Table(
            self,
            "ReportsTable",
            table_name=f"oli-branch-reports-{self.stack_name.lower()}",
            partition_key=dynamodb.Attribute(
                name="reportId",
                type=dynamodb.AttributeType.STRING,
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
            point_in_time_recovery_specification=dynamodb.PointInTimeRecoverySpecification(
                point_in_time_recovery_enabled=True
            ),
        )

        self.reports_table.add_global_secondary_index(
            index_name="BusinessIdIndex",
            partition_key=dynamodb.Attribute(
                name="businessId",
                type=dynamodb.AttributeType.STRING,
            ),
            sort_key=dynamodb.Attribute(
                name="createdAt",
                type=dynamodb.AttributeType.STRING,
            ),
        )

        # -----------------------------
        # Leaks Table
        # -----------------------------
        self.leaks_table = dynamodb.Table(
            self,
            "LeaksTable",
            table_name=f"oli-branch-leaks-{self.stack_name.lower()}",
            partition_key=dynamodb.Attribute(
                name="leakId",
                type=dynamodb.AttributeType.STRING,
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
            point_in_time_recovery_specification=dynamodb.PointInTimeRecoverySpecification(
                point_in_time_recovery_enabled=True
            ),
        )

        self.leaks_table.add_global_secondary_index(
            index_name="ReportIdIndex",
            partition_key=dynamodb.Attribute(
                name="reportId",
                type=dynamodb.AttributeType.STRING,
            ),
        )

        # -----------------------------
        # Recommendations Table
        # -----------------------------
        self.recommendations_table = dynamodb.Table(
            self,
            "RecommendationsTable",
            table_name=f"oli-branch-recommendations-{self.stack_name.lower()}",
            partition_key=dynamodb.Attribute(
                name="recommendationId",
                type=dynamodb.AttributeType.STRING,
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
            point_in_time_recovery_specification=dynamodb.PointInTimeRecoverySpecification(
                point_in_time_recovery_enabled=True
            ),
        )

        self.recommendations_table.add_global_secondary_index(
            index_name="ReportIdIndex",
            partition_key=dynamodb.Attribute(
                name="reportId",
                type=dynamodb.AttributeType.STRING,
            ),
        )

        # -----------------------------
        # Expose tables for other stacks
        # -----------------------------
        self.tables = {
            "users": self.users_table,
            "businesses": self.businesses_table,
            "assessments": self.assessments_table,
            "reports": self.reports_table,
            "leaks": self.leaks_table,
            "recommendations": self.recommendations_table,
        }

        # -----------------------------
        # Outputs
        # -----------------------------
        CfnOutput(
            self,
            "UsersTableName",
            value=self.users_table.table_name,
            description="Users DynamoDB Table Name",
        )

        CfnOutput(
            self,
            "BusinessesTableName",
            value=self.businesses_table.table_name,
            description="Businesses DynamoDB Table Name",
        )

        CfnOutput(
            self,
            "AssessmentsTableName",
            value=self.assessments_table.table_name,
            description="Assessments DynamoDB Table Name",
        )

        CfnOutput(
            self,
            "ReportsTableName",
            value=self.reports_table.table_name,
            description="Reports DynamoDB Table Name",
        )