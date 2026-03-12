variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs"
  type        = list(string)
}

variable "database_security_group_id" {
  description = "Database Security Group ID"
  type        = string
}

variable "redis_security_group_id" {
  description = "Redis Security Group ID"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "olibranch"
}

variable "db_username" {
  description = "Database username"
  type        = string
  default     = "olibranch"
}

variable "db_instance_class" {
  description = "Database instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Database allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_storage_throughput" {
  description = "Database storage throughput"
  type        = number
  default     = 125
}

variable "db_backup_retention" {
  description = "Database backup retention in days"
  type        = number
  default     = 7
}

variable "redis_node_type" {
  description = "Redis node type"
  type        = string
  default     = "cache.t4g.micro"
}