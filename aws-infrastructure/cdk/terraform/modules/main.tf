# Main Terraform configuration for Oli-Branch

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  backend "s3" {
    bucket         = "oli-branch-terraform-state"
    key            = "terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Networking Module
module "networking" {
  source = "./modules/networking"

  project_name         = var.project_name
  environment          = var.environment
  aws_region          = var.aws_region
  vpc_cidr            = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = var.availability_zones
}

# Security Module
module "security" {
  source = "./modules/security"

  project_name         = var.project_name
  environment          = var.environment
  vpc_id               = module.networking.vpc_id
  audit_bucket_arn     = module.storage.audit_bucket_arn
  reports_bucket_arn   = module.storage.reports_bucket_arn
  dynamodb_table_arns  = module.storage.dynamodb_table_arns
}

# Storage Module (S3 + DynamoDB)
module "storage" {
  source = "./modules/storage"

  project_name = var.project_name
  environment  = var.environment
}

# Data Module (RDS + Redis)
module "data" {
  source = "./modules/data"

  project_name              = var.project_name
  environment               = var.environment
  private_subnet_ids        = module.networking.private_subnet_ids
  database_security_group_id = module.security.database_security_group_id
  redis_security_group_id    = module.security.ecs_tasks_security_group_id
  db_name                   = var.db_name
  db_username               = var.db_username
}

# Compute Module (ECS + Load Balancer)
module "compute" {
  source = "./modules/compute"

  project_name                  = var.project_name
  environment                   = var.environment
  aws_region                    = var.aws_region
  vpc_id                        = module.networking.vpc_id
  public_subnet_ids             = module.networking.public_subnet_ids
  private_subnet_ids            = module.networking.private_subnet_ids
  load_balancer_security_group_id = module.security.load_balancer_security_group_id
  ecs_tasks_security_group_id   = module.security.ecs_tasks_security_group_id
  ecs_task_execution_role_arn   = module.security.ecs_task_execution_role_arn
  ecs_task_role_arn             = module.security.ecs_task_role_arn
  container_image               = var.container_image
  database_host                 = module.data.database_endpoint
  database_port                 = module.data.database_port
  database_name                 = module.data.database_name
  certificate_arn               = var.certificate_arn
  cpu                           = var.cpu
  memory                        = var.memory
  desired_count                 = var.desired_count
  min_capacity                  = var.min_capacity
  max_capacity                  = var.max_capacity
}