output "cluster_id" {
  description = "ECS Cluster ID"
  value       = aws_ecs_cluster.main.id
}

output "cluster_name" {
  description = "ECS Cluster Name"
  value       = aws_ecs_cluster.main.name
}

output "service_name" {
  description = "ECS Service Name"
  value       = aws_ecs_service.app.name
}

output "load_balancer_arn" {
  description = "Load Balancer ARN"
  value       = aws_lb.main.arn
}

output "load_balancer_dns" {
  description = "Load Balancer DNS Name"
  value       = aws_lb.main.dns_name
}

output "target_group_arn" {
  description = "Target Group ARN"
  value       = aws_lb_target_group.main.arn
}

output "task_definition_arn" {
  description = "Task Definition ARN"
  value       = aws_ecs_task_definition.app.arn
}

output "cloudwatch_log_group" {
  description = "CloudWatch Log Group Name"
  value       = aws_cloudwatch_log_group.ecs.name
}