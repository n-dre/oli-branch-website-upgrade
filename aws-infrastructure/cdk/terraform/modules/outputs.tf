# Outputs for Oli-Branch Terraform configuration

output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "public_subnet_ids" {
  description = "Public subnet IDs"
  value       = module.networking.public_subnet_ids
}

output "private_subnet_ids" {
 description = "Private subnet IDs"
  value       = module.networking.private_subnet_ids
}

output "database_endpoint" {
  description = "Database endpoint"
  value       = module.data.database_endpoint
}

output "database_secret_arn" {
  description = "ARN of database secret"
  value       = module.data.database_secret_arn
}

output "redis_endpoint" {
  description = "Redis endpoint"
  value       = module.data.redis_endpoint
}

output "load_balancer_dns" {
  description = "Load Balancer DNS name"
  value       = module.compute.load_balancer_dns
}

output "ecs_cluster_name" {
  description = "ECS Cluster name"
  value       = module.compute.cluster_name
}

output "ecs_service_name" {
  description = "ECS Service name"
  value       = module.compute.service_name
}

output "kms_key_id" {
  description = "KMS Key ID"
  value       = module.security.kms_key_id
}

output "kms_key_arn" {
  description = "KMS Key ARN"
  value       = module.security.kms_key_arn
}