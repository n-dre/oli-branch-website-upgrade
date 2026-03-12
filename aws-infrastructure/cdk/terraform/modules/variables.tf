# Variables for Oli-Branch Terraform configuration

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "oli-branch"
}

variable "environment" {
  description = "Environment name (dev/staging/prod)"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

# Networking Variables
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24"]
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

# Database Variables
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

# Compute Variables
variable "container_image" {
  description = "Container image URL"
  type        = string
}

variable "certificate_arn" {
  description = "ACM Certificate ARN for HTTPS"
  type        = string
  default     = null
}

variable "cpu" {
  description = "CPU units for Fargate task"
  type        = string
  default     = "512"
}

variable "memory" {
  description = "Memory for Fargate task"
  type        = string
  default     = "1024"
}

variable "desired_count" {
  description = "Desired number of tasks"
  type        = number
  default     = 2
}

variable "min_capacity" {
  description = "Minimum capacity for auto scaling"
  type        = number
  default     = 2
}

variable "max_capacity" {
  description = "Maximum capacity for auto scaling"
  type        = number
  default     = 10
}