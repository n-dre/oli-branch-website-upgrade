# MongoDB Module - MongoDB Atlas Configuration

resource "random_password" "mongodb_user" {
  length  = 16
  special = false
}

resource "mongodbatlas_project" "main" {
  name   = "${var.project_name}-${var.environment}"
  org_id = var.mongodb_atlas_org_id
}

resource "mongodbatlas_cluster" "main" {
  project_id = mongodbatlas_project.main.id
  name       = "${var.project_name}-${var.environment}"

  provider_name               = "AWS"
  provider_region_name        = var.mongodb_region
  provider_instance_size_name = var.mongodb_instance_size
  cloud_backup                = true

  tags {
    key   = "Environment"
    value = var.environment
  }
  
  tags {
    key   = "Project"
    value = var.project_name
  }
}

resource "mongodbatlas_database_user" "main" {
  username           = "${var.project_name}_${var.environment}"
  password           = random_password.mongodb_user.result
  project_id         = mongodbatlas_project.main.id
  auth_database_name = "admin"

  roles {
    role_name     = "readWrite"
    database_name = "olibranch"
  }
}

resource "mongodbatlas_project_ip_access_list" "main" {
  project_id = mongodbatlas_project.main.id
  cidr_block = var.vpc_cidr
  comment    = "VPC CIDR block"
}

# Store connection string in AWS Secrets Manager
resource "aws_secretsmanager_secret" "mongodb_connection" {
  name = "${var.project_name}-${var.environment}-mongodb"

  tags = {
    Name        = "${var.project_name}-${var.environment}-mongodb-secret"
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_secretsmanager_secret_version" "mongodb_connection" {
  secret_id = aws_secretsmanager_secret.mongodb_connection.id
  secret_string = jsonencode({
    connection_string = "mongodb+srv://${mongodbatlas_database_user.main.username}:${random_password.mongodb_user.result}@${mongodbatlas_cluster.main.connection_strings[0].standard_srv}/olibranch?retryWrites=true&w=majority"
    username          = mongodbatlas_database_user.main.username
    password          = random_password.mongodb_user.result
    cluster_name      = mongodbatlas_cluster.main.name
  })
}