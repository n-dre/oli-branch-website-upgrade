output "cluster_id" {
  description = "MongoDB Cluster ID"
  value       = mongodbatlas_cluster.main.cluster_id
}

output "connection_string" {
  description = "MongoDB connection string"
  value       = "mongodb+srv://${mongodbatlas_database_user.main.username}:${random_password.mongodb_user.result}@${mongodbatlas_cluster.main.connection_strings[0].standard_srv}/olibranch?retryWrites=true&w=majority"
  sensitive   = true
}

output "connection_string_secret_arn" {
  description = "ARN of the connection string secret"
  value       = aws_secretsmanager_secret.mongodb_connection.arn
}

output "project_id" {
  description = "MongoDB Project ID"
  value       = mongodbatlas_project.main.id
}

output "cluster_name" {
  description = "MongoDB Cluster Name"
  value       = mongodbatlas_cluster.main.name
}