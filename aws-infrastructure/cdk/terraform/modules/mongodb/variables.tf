variable "project_name" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "mongodb_atlas_org_id" {
  description = "MongoDB Atlas Organization ID"
  type        = string
}

variable "mongodb_instance_size" {
  description = "MongoDB instance size"
  type        = string
  default     = "M10"
}

variable "mongodb_region" {
  description = "MongoDB region"
  type        = string
  default     = "US_EAST_1"
}

variable "vpc_cidr" {
  description = "VPC CIDR block for IP access list"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for VPC peering"
  type        = list(string)
  default     = []
}

variable "security_group_id" {
  description = "Security group ID for VPC peering"
  type        = string
  default     = ""
}