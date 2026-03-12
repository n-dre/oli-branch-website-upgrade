"""S3 Stack - Storage Buckets"""

from aws_cdk import (
    Stack,
    Aws,
    aws_s3 as s3,
    aws_iam as iam,
    RemovalPolicy,
    Duration,
    CfnOutput,
)

from constructs import Construct


class S3Stack(Stack):
    """S3 Buckets Infrastructure"""

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Safe bucket name prefix
        prefix = f"oli-branch-{Aws.ACCOUNT_ID}-{Aws.REGION}"

        # -----------------------------
        # Audit Bucket - Store audit results
        # -----------------------------
        self.audit_bucket = s3.Bucket(
            self,
            "AuditBucket",
            bucket_name=f"{prefix}-audit",
            versioned=True,
            encryption=s3.BucketEncryption.S3_MANAGED,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
            lifecycle_rules=[
                s3.LifecycleRule(
                    id="ArchiveOldAudits",
                    enabled=True,
                    transitions=[
                        s3.Transition(
                            storage_class=s3.StorageClass.INFREQUENT_ACCESS,
                            transition_after=Duration.days(30),
                        ),
                        s3.Transition(
                            storage_class=s3.StorageClass.GLACIER,
                            transition_after=Duration.days(90),
                        ),
                    ],
                    expiration=Duration.days(365),
                )
            ],
        )

        # -----------------------------
        # Reports Bucket
        # -----------------------------
        self.reports_bucket = s3.Bucket(
            self,
            "ReportsBucket",
            bucket_name=f"{prefix}-reports",
            versioned=True,
            encryption=s3.BucketEncryption.S3_MANAGED,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
            lifecycle_rules=[
                s3.LifecycleRule(
                    id="ExpireOldReports",
                    enabled=True,
                    expiration=Duration.days(90),
                )
            ],
        )

        # -----------------------------
        # Static Assets Bucket
        # -----------------------------
        self.static_bucket = s3.Bucket(
            self,
            "StaticBucket",
            bucket_name=f"{prefix}-static",
            versioned=True,
            encryption=s3.BucketEncryption.S3_MANAGED,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
            cors=[
                s3.CorsRule(
                    allowed_methods=[
                        s3.HttpMethods.GET,
                        s3.HttpMethods.HEAD,
                    ],
                    allowed_origins=["*"],
                    allowed_headers=["*"],
                    max_age=3000,
                )
            ],
        )

        # -----------------------------
        # Public Bucket (for CloudFront)
        # -----------------------------
        self.public_bucket = s3.Bucket(
            self,
            "PublicBucket",
            bucket_name=f"{prefix}-public",
            versioned=True,
            encryption=s3.BucketEncryption.S3_MANAGED,
            public_read_access=False,
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
            cors=[
                s3.CorsRule(
                    allowed_methods=[
                        s3.HttpMethods.GET,
                        s3.HttpMethods.HEAD,
                    ],
                    allowed_origins=["*"],
                    allowed_headers=["*"],
                    max_age=3000,
                )
            ],
        )

        # -----------------------------
        # Bucket policy for CloudFront
        # -----------------------------
        self.public_bucket.add_to_resource_policy(
            iam.PolicyStatement(
                actions=["s3:GetObject"],
                resources=[self.public_bucket.arn_for_objects("*")],
                principals=[iam.ServicePrincipal("cloudfront.amazonaws.com")],
            )
        )

        # -----------------------------
        # Export buckets for other stacks
        # -----------------------------
        self.buckets = {
            "audit": self.audit_bucket,
            "reports": self.reports_bucket,
            "static": self.static_bucket,
            "public": self.public_bucket,
        }

        # -----------------------------
        # Outputs
        # -----------------------------
        CfnOutput(
            self,
            "AuditBucketName",
            value=self.audit_bucket.bucket_name,
            description="Audit S3 Bucket Name",
        )

        CfnOutput(
            self,
            "ReportsBucketName",
            value=self.reports_bucket.bucket_name,
            description="Reports S3 Bucket Name",
        )

        CfnOutput(
            self,
            "StaticBucketName",
            value=self.static_bucket.bucket_name,
            description="Static Assets S3 Bucket Name",
        )

        CfnOutput(
            self,
            "PublicBucketName",
            value=self.public_bucket.bucket_name,
            description="Public S3 Bucket Name",
        )