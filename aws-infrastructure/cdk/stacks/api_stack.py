"""API Stack - Load Balancer and ECS/Fargate Service"""

from aws_cdk import (
    Stack,
    aws_ec2 as ec2,
    aws_ecs as ecs,
    aws_ecs_patterns as ecs_patterns,
    Duration,
    CfnOutput,
)

from constructs import Construct


class ApiStack(Stack):
    """API Infrastructure Stack"""

    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        vpc: ec2.IVpc,
        **kwargs
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # -----------------------------
        # ECS Cluster
        # -----------------------------
        self.cluster = ecs.Cluster(
            self,
            "OliBranchCluster",
            vpc=vpc,
            container_insights=True,
            cluster_name=f"oli-branch-{self.stack_name}",
        )

        # -----------------------------
        # Security Group for API
        # -----------------------------
        self.api_security_group = ec2.SecurityGroup(
            self,
            "ApiSecurityGroup",
            vpc=vpc,
            description="Security group for API service",
            security_group_name=f"oli-branch-api-{self.stack_name}",
        )

        # Allow HTTP traffic
        self.api_security_group.add_ingress_rule(
            peer=ec2.Peer.any_ipv4(),
            connection=ec2.Port.tcp(8000),
            description="Allow inbound HTTP traffic",
        )

        # -----------------------------
        # Fargate Service with Load Balancer
        # -----------------------------
        self.fargate_service = ecs_patterns.ApplicationLoadBalancedFargateService(
            self,
            "OliBranchService",
            cluster=self.cluster,
            cpu=512,
            memory_limit_mib=1024,
            desired_count=2,
            public_load_balancer=True,
            task_image_options=ecs_patterns.ApplicationLoadBalancedTaskImageOptions(
                image=ecs.ContainerImage.from_registry(
                    "oli-branch/backend:latest"
                ),
                container_port=8000,
                environment={
                    "ENVIRONMENT": self.stack_name
                },
            ),
            security_groups=[self.api_security_group],
            task_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS
            ),
        )

        # -----------------------------
        # Health Check
        # -----------------------------
        self.fargate_service.target_group.configure_health_check(
            path="/health",
            healthy_http_codes="200",
            interval=Duration.seconds(30),
            timeout=Duration.seconds(5),
            healthy_threshold_count=2,
            unhealthy_threshold_count=2,
        )

        # -----------------------------
        # Auto Scaling
        # -----------------------------
        scaling = self.fargate_service.service.auto_scale_task_count(
            min_capacity=2,
            max_capacity=10,
        )

        scaling.scale_on_cpu_utilization(
            "CpuScaling",
            target_utilization_percent=70,
            scale_in_cooldown=Duration.seconds(60),
            scale_out_cooldown=Duration.seconds(60),
        )

        # -----------------------------
        # Outputs
        # -----------------------------
        CfnOutput(
            self,
            "LoadBalancerDNS",
            value=self.fargate_service.load_balancer.load_balancer_dns_name,
            description="Load Balancer DNS Name",
        )

        CfnOutput(
            self,
            "ServiceURL",
            value=f"http://{self.fargate_service.load_balancer.load_balancer_dns_name}",
            description="Service URL",
        )

        CfnOutput(
            self,
            "ClusterName",
            value=self.cluster.cluster_name,
            description="ECS Cluster Name",
        )