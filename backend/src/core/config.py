"""
Configuration Management Module
Handles all application settings and environment variables
"""

import os
from typing import Optional, Dict, Any
from enum import Enum
from pydantic import BaseSettings, Field, PostgresDsn, RedisDsn, validator
from functools import lru_cache


class Environment(str, Enum):
    """Environment types"""
    DEVELOPMENT = "development"
    TESTING = "testing"
    STAGING = "staging"
    PRODUCTION = "production"


class DatabaseConfig(BaseSettings):
    """Database configuration"""
    POSTGRES_HOST: str = Field("localhost", env="POSTGRES_HOST")
    POSTGRES_PORT: int = Field(5432, env="POSTGRES_PORT")
    POSTGRES_USER: str = Field("postgres", env="POSTGRES_USER")
    POSTGRES_PASSWORD: str = Field("password", env="POSTGRES_PASSWORD")
    POSTGRES_DB: str = Field("app_db", env="POSTGRES_DB")
    POSTGRES_POOL_SIZE: int = Field(20, env="POSTGRES_POOL_SIZE")
    POSTGRES_MAX_OVERFLOW: int = Field(10, env="POSTGRES_MAX_OVERFLOW")
    
    @property
    def database_url(self) -> str:
        """Generate database URL"""
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    @property
    def async_database_url(self) -> str:
        """Generate async database URL"""
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"


class RedisConfig(BaseSettings):
    """Redis configuration"""
    REDIS_HOST: str = Field("localhost", env="REDIS_HOST")
    REDIS_PORT: int = Field(6379, env="REDIS_PORT")
    REDIS_PASSWORD: Optional[str] = Field(None, env="REDIS_PASSWORD")
    REDIS_DB: int = Field(0, env="REDIS_DB")
    REDIS_CACHE_TTL: int = Field(300, env="REDIS_CACHE_TTL")  # 5 minutes
    
    @property
    def redis_url(self) -> str:
        """Generate Redis URL"""
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"


class SecurityConfig(BaseSettings):
    """Security configuration"""
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = Field("HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(7, env="REFRESH_TOKEN_EXPIRE_DAYS")
    PASSWORD_HASH_ALGORITHM: str = Field("bcrypt", env="PASSWORD_HASH_ALGORITHM")
    CORS_ORIGINS: list = Field(["http://localhost:3000"], env="CORS_ORIGINS")
    
    @validator('CORS_ORIGINS', pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v


class APIConfig(BaseSettings):
    """API configuration"""
    API_V1_PREFIX: str = Field("/api/v1", env="API_V1_PREFIX")
    PROJECT_NAME: str = Field("Backend API", env="PROJECT_NAME")
    PROJECT_VERSION: str = Field("1.0.0", env="PROJECT_VERSION")
    PROJECT_DESCRIPTION: str = Field("Backend API Service", env="PROJECT_DESCRIPTION")
    DEBUG: bool = Field(False, env="DEBUG")
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")


class Settings(
    APIConfig,
    DatabaseConfig,
    RedisConfig,
    SecurityConfig
):
    """Main settings class combining all configurations"""
    ENVIRONMENT: Environment = Field(Environment.DEVELOPMENT, env="ENVIRONMENT")
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        validate_assignment = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


def get_database_url() -> str:
    """Get database URL from settings"""
    return get_settings().database_url


def get_async_database_url() -> str:
    """Get async database URL from settings"""
    return get_settings().async_database_url


def get_redis_url() -> str:
    """Get Redis URL from settings"""
    return get_settings().redis_url


def load_settings() -> Dict[str, Any]:
    """Load and validate all settings"""
    settings = get_settings()
    
    # Log configuration (without sensitive data)
    config_summary = {
        "environment": settings.ENVIRONMENT,
        "project_name": settings.PROJECT_NAME,
        "api_prefix": settings.API_V1_PREFIX,
        "debug": settings.DEBUG,
        "database_host": settings.POSTGRES_HOST,
        "database_name": settings.POSTGRES_DB,
        "redis_host": settings.REDIS_HOST,
        "cors_origins": settings.CORS_ORIGINS,
    }
    
    return config_summary


# Global settings instance
settings = get_settings()