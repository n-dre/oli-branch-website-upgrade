"""Cognito Stack - User Authentication and Authorization"""

from aws_cdk import (
    Stack,
    aws_cognito as cognito,
    aws_iam as iam,
    aws_certificatemanager as acm,
    aws_route53 as route53,
    aws_route53_targets as targets,
    Duration,
    CfnOutput,
    RemovalPolicy,
)

from constructs import Construct


class CognitoStack(Stack):
    """Cognito User Pool Infrastructure"""

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # -----------------------------
        # User Pool
        # -----------------------------
        self.user_pool = cognito.UserPool(
            self,
            "OliBranchUserPool",
            user_pool_name=f"olibranch-{self.stack_name}",
            self_sign_up_enabled=True,
            sign_in_aliases=cognito.SignInAliases(
                username=True,
                email=True
            ),
            auto_verify=cognito.AutoVerifiedAttrs(
                email=True
            ),
            password_policy=cognito.PasswordPolicy(
                min_length=8,
                require_lowercase=True,
                require_uppercase=True,
                require_digits=True,
                require_symbols=True,
                temp_password_validity=Duration.days(7)
            ),
            account_recovery=cognito.AccountRecovery.EMAIL_ONLY,
            removal_policy=RemovalPolicy.DESTROY,
            mfa=cognito.Mfa.OPTIONAL,
            mfa_second_factor=cognito.MfaSecondFactor(
                sms=True,
                otp=True
            )
        )

        # -----------------------------
        # User Pool Client
        # -----------------------------
        self.user_pool_client = cognito.UserPoolClient(
            self,
            "OliBranchClient",
            user_pool=self.user_pool,
            user_pool_client_name=f"olibranch-client-{self.stack_name}",
            generate_secret=False,
            auth_flows=cognito.AuthFlow(
                user_password=True,
                user_srp=True
            ),
            o_auth=cognito.OAuthSettings(
                flows=cognito.OAuthFlows(
                    authorization_code_grant=True,
                    implicit_code_grant=True
                ),
                scopes=[
                    cognito.OAuthScope.EMAIL,
                    cognito.OAuthScope.OPENID,
                    cognito.OAuthScope.PROFILE
                ],
                callback_urls=[
                    "https://app.oli-branch.com/callback",
                    "http://localhost:3000/callback"
                ],
                logout_urls=[
                    "https://app.oli-branch.com",
                    "http://localhost:3000"
                ]
            ),
            supported_identity_providers=[
                cognito.UserPoolClientIdentityProvider.COGNITO
            ]
        )

        # -----------------------------
        # SSL Certificate for auth.oli-branch.com
        # -----------------------------
        certificate = acm.Certificate(
            self,
            "AuthCertificate",
            domain_name="auth.oli-branch.com",
            validation=acm.CertificateValidation.from_dns()
        )

        # -----------------------------
        # Cognito Custom Domain
        # -----------------------------
        self.domain = cognito.UserPoolDomain(
            self,
            "OliBranchDomain",
            user_pool=self.user_pool,
            custom_domain=cognito.CustomDomainOptions(
                domain_name="auth.oli-branch.com",
                certificate=certificate
            )
        )

        # -----------------------------
        # Route53 Hosted Zone
        # -----------------------------
        hosted_zone = route53.HostedZone.from_lookup(
            self,
            "HostedZone",
            domain_name="oli-branch.com"
        )

        # -----------------------------
        # Route53 Record → Cognito
        # -----------------------------
        route53.ARecord(
            self,
            "AuthSubdomainRecord",
            zone=hosted_zone,
            record_name="auth",
            target=route53.RecordTarget.from_alias(
                targets.UserPoolDomainTarget(self.domain)
            )
        )

        # -----------------------------
        # Identity Pool
        # -----------------------------
        self.identity_pool = cognito.CfnIdentityPool(
            self,
            "OliBranchIdentityPool",
            identity_pool_name=f"olibranch-{self.stack_name}",
            allow_unauthenticated_identities=True,
            cognito_identity_providers=[
                cognito.CfnIdentityPool.CognitoIdentityProviderProperty(
                    client_id=self.user_pool_client.user_pool_client_id,
                    provider_name=self.user_pool.user_pool_provider_name
                )
            ]
        )

        # -----------------------------
        # IAM Roles
        # -----------------------------
        self.authenticated_role = iam.Role(
            self,
            "CognitoAuthenticatedRole",
            assumed_by=iam.FederatedPrincipal(
                "cognito-identity.amazonaws.com",
                conditions={
                    "StringEquals": {
                        "cognito-identity.amazonaws.com:aud": self.identity_pool.ref
                    },
                    "ForAnyValue:StringLike": {
                        "cognito-identity.amazonaws.com:amr": "authenticated"
                    }
                },
                assume_role_action="sts:AssumeRoleWithWebIdentity"
            )
        )

        self.unauthenticated_role = iam.Role(
            self,
            "CognitoUnauthenticatedRole",
            assumed_by=iam.FederatedPrincipal(
                "cognito-identity.amazonaws.com",
                conditions={
                    "StringEquals": {
                        "cognito-identity.amazonaws.com:aud": self.identity_pool.ref
                    },
                    "ForAnyValue:StringLike": {
                        "cognito-identity.amazonaws.com:amr": "unauthenticated"
                    }
                },
                assume_role_action="sts:AssumeRoleWithWebIdentity"
            )
        )

        # -----------------------------
        # Attach roles
        # -----------------------------
        cognito.CfnIdentityPoolRoleAttachment(
            self,
            "IdentityPoolRoleAttachment",
            identity_pool_id=self.identity_pool.ref,
            roles={
                "authenticated": self.authenticated_role.role_arn,
                "unauthenticated": self.unauthenticated_role.role_arn
            }
        )

        # -----------------------------
        # Outputs
        # -----------------------------
        CfnOutput(
            self,
            "UserPoolId",
            value=self.user_pool.user_pool_id
        )

        CfnOutput(
            self,
            "UserPoolClientId",
            value=self.user_pool_client.user_pool_client_id
        )

        CfnOutput(
            self,
            "IdentityPoolId",
            value=self.identity_pool.ref
        )

        CfnOutput(
            self,
            "AuthDomain",
            value="https://auth.oli-branch.com"
        )