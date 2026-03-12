output "kms_key_id" {
  description = "KMS Key ID"
  value       = aws_kms_key.main.key_id
}

output "kms_key_arn" {
  description = "KMS Key ARN"
  value       = aws_kms_key.main.arn
}

output "load_balancer_security_group_id" {
  description = "Load Balancer Security Group ID"
  value       = aws_security_group.load_balancer.id
}

output "ecs_tasks_security_group_id" {
  description = "ECS Tasks Security Group ID"
  value       = aws_security_group.ecs_tasks.id
}

output "database_security_group_id" {
  description = "Database Security Group ID"
  value       = aws_security_group.database.id
}

output "ecs_task_execution_role_arn" {
  description = "ECS Task Execution Role ARN"
  value       = aws_iam_role.ecs_task_execution.arn
}

output "ecs_task_role_arn" {
  description = "ECS Task Role ARN"
  value       = aws_iam_role.ecs_task.arn
}