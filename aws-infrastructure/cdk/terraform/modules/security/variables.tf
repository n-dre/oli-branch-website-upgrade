variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "audit_bucket_arn" {
  description = "ARN of audit bucket"
  type        = string
}

variable "reports_bucket_arn" {
  description = "ARN of reports bucket"
  type        = string
}

variable "dynamodb_table_arns" {
  description = "List of DynamoDB table ARNs"
  type        = list(string)
}