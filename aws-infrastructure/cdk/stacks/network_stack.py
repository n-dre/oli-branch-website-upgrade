"""Network Stack - VPC and Security Groups"""

from aws_cdk import (
    Stack,
    aws_ec2 as ec2,
    CfnOutput,
)
from constructs import Construct


class NetworkStack(Stack):
    """Networking Infrastructure"""

    def __init__(self, scope: Construct, construct_id: str, **kwargs):
        super().__init__(scope, construct_id, **kwargs)

        # Create the VPC
        self.vpc = ec2.Vpc(
            self,
            "OliBranchVpc",
            max_azs=2,
            nat_gateways=1,
            subnet_configuration=[
                ec2.SubnetConfiguration(
                    name="Public",
                    subnet_type=ec2.SubnetType.PUBLIC,
                ),
                ec2.SubnetConfiguration(
                    name="Private",
                    subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS,
                ),
            ],
        )

        # Security group for Lambda functions
        self.lambda_sg = ec2.SecurityGroup(
            self,
            "LambdaSecurityGroup",
            vpc=self.vpc,
            allow_all_outbound=True,
            description="Security group for Lambda functions",
        )

        # Security group for database access
        self.database_sg = ec2.SecurityGroup(
            self,
            "DatabaseSecurityGroup",
            vpc=self.vpc,
            allow_all_outbound=True,
            description="Security group for database",
        )

        # Allow Lambda to talk to database
        self.database_sg.add_ingress_rule(
            peer=self.lambda_sg,
            connection=ec2.Port.tcp(5432),
            description="Allow Lambda to access database",
        )

        CfnOutput(self, "VpcId", value=self.vpc.vpc_id)