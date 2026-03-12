output "database_endpoint" {
  description = "Database endpoint"
  value       = aws_db_instance.postgres.address
}

output "database_port" {
  description = "Database port"
  value       = aws_db_instance.postgres.port
}

output "database_name" {
  description = "Database name"
  value       = aws_db_instance.postgres.db_name
}

output "database_username" {
  description = "Database username"
  value       = aws_db_instance.postgres.username
  sensitive   = true
}

output "database_password" {
  description = "Database password"
  value       = random_password.database.result
  sensitive   = true
}

output "database_secret_arn" {
  description = "ARN of database secret"
  value       = aws_secretsmanager_secret.database.arn
}

output "redis_endpoint" {
  description = "Redis endpoint"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "redis_port" {
  description = "Redis port"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].port
}