"""
Database Configuration and Connection Management
Handles database connections, sessions, and engine setup
"""

import logging
from typing import Optional, AsyncGenerator
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import (
    AsyncSession, 
    AsyncEngine, 
    create_async_engine, 
    async_sessionmaker
)
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine, text
from sqlalchemy.pool import QueuePool

from core.config import settings
from core.dependencies import get_async_engine, get_sync_engine

# Set up logger
logger = logging.getLogger(__name__)

# SQLAlchemy Base class for declarative models
Base = declarative_base()

# Metadata for Alembic migrations
metadata = Base.metadata

class DatabaseManager:
    """Manages database connections and sessions"""
    
    def __init__(self):
        self._async_engine: Optional[AsyncEngine] = None
        self._async_session_factory: Optional[async_sessionmaker] = None
        self._sync_engine = None
        self._sync_session_factory = None
    
    @property
    def async_engine(self) -> AsyncEngine:
        """Get async database engine (lazy initialization)"""
        if self._async_engine is None:
            self._async_engine = create_async_engine(
                settings.async_database_url,
                echo=settings.DEBUG,
                poolclass=QueuePool,
                pool_size=settings.POSTGRES_POOL_SIZE,
                max_overflow=settings.POSTGRES_MAX_OVERFLOW,
                pool_pre_ping=True,
                pool_recycle=3600,  # Recycle connections after 1 hour
                connect_args={
                    "server_settings": {
                        "application_name": settings.PROJECT_NAME,
                        "timezone": "UTC"
                    }
                }
            )
            logger.info("Async database engine initialized")
        return self._async_engine
    
    @property
    def sync_engine(self):
        """Get sync database engine (lazy initialization)"""
        if self._sync_engine is None:
            self._sync_engine = create_engine(
                settings.database_url,
                echo=settings.DEBUG,
                poolclass=QueuePool,
                pool_size=settings.POSTGRES_POOL_SIZE,
                max_overflow=settings.POSTGRES_MAX_OVERFLOW,
                pool_pre_ping=True,
                pool_recycle=3600,
            )
            logger.info("Sync database engine initialized")
        return self._sync_engine
    
    @property
    def async_session_factory(self) -> async_sessionmaker:
        """Get async session factory"""
        if self._async_session_factory is None:
            self._async_session_factory = async_sessionmaker(
                self.async_engine,
                class_=AsyncSession,
                expire_on_commit=False,
                autocommit=False,
                autoflush=False,
            )
        return self._async_session_factory
    
    @property
    def sync_session_factory(self) -> sessionmaker:
        """Get sync session factory"""
        if self._sync_session_factory is None:
            self._sync_session_factory = sessionmaker(
                self.sync_engine,
                autocommit=False,
                autoflush=False,
                expire_on_commit=False,
            )
        return self._sync_session_factory
    
    @asynccontextmanager
    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        """
        Context manager for database sessions.
        Automatically handles commit/rollback and session closing.
        """
        session = self.async_session_factory()
        try:
            yield session
            await session.commit()
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session rollback due to error: {e}")
            raise
        finally:
            await session.close()
    
    def get_sync_session(self):
        """Get a sync database session"""
        session = self.sync_session_factory()
        try:
            yield session
            session.commit()
        except Exception as e:
            session.rollback()
            logger.error(f"Sync database session rollback due to error: {e}")
            raise
        finally:
            session.close()
    
    async def create_tables(self):
        """Create all tables defined in models"""
        async with self.async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created")
    
    async def drop_tables(self):
        """Drop all tables (for testing)"""
        async with self.async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
        logger.warning("Database tables dropped")
    
    async def check_connection(self) -> bool:
        """Check database connection"""
        try:
            async with self.async_engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            logger.debug("Database connection successful")
            return True
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            return False
    
    async def get_database_info(self) -> dict:
        """Get database information"""
        try:
            async with self.async_engine.connect() as conn:
                # Get PostgreSQL version
                result = await conn.execute(text("SELECT version()"))
                version = result.scalar()
                
                # Get database size
                result = await conn.execute(
                    text("SELECT pg_database_size(current_database())")
                )
                size_bytes = result.scalar()
                
                # Get active connections
                result = await conn.execute(
                    text("SELECT count(*) FROM pg_stat_activity WHERE datname = current_database()")
                )
                active_connections = result.scalar()
                
                return {
                    "version": version,
                    "size_mb": round(size_bytes / (1024 * 1024), 2),
                    "active_connections": active_connections,
                    "status": "connected",
                    "url": str(self.async_engine.url).replace(
                        settings.POSTGRES_PASSWORD, "***"
                    ) if settings.POSTGRES_PASSWORD else str(self.async_engine.url)
                }
        except Exception as e:
            logger.error(f"Failed to get database info: {e}")
            return {"status": "disconnected", "error": str(e)}
    
    async def close(self):
        """Close database connections"""
        if self._async_engine:
            await self._async_engine.dispose()
            self._async_engine = None
            logger.info("Async database engine disposed")
        
        if self._sync_engine:
            self._sync_engine.dispose()
            self._sync_engine = None
            logger.info("Sync database engine disposed")


# Global database manager instance
db_manager = DatabaseManager()


# Helper functions for common operations
async def execute_query(query: str, params: dict = None) -> list:
    """Execute a raw SQL query"""
    async with db_manager.get_session() as session:
        result = await session.execute(text(query), params or {})
        return result.fetchall()


async def execute_scalar(query: str, params: dict = None):
    """Execute a query and return a scalar result"""
    async with db_manager.get_session() as session:
        result = await session.execute(text(query), params or {})
        return result.scalar()


async def execute_commit(query: str, params: dict = None):
    """Execute a query and commit"""
    async with db_manager.get_session() as session:
        await session.execute(text(query), params or {})
        await session.commit()