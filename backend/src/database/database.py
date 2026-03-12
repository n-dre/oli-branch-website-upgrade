"""
Database Configuration and Connection Management
Handles database connections, sessions, and engine setup
"""

import logging
from typing import Optional, AsyncGenerator, Generator
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    AsyncEngine,
    create_async_engine,
    async_sessionmaker,
)
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine, text
from sqlalchemy.pool import QueuePool

from core.config import settings

# Logger
logger = logging.getLogger(__name__)

# Base model for ORM
Base = declarative_base()

# Metadata (used by Alembic)
metadata = Base.metadata


class DatabaseManager:
    """
    Manages database engines and session factories
    """

    def __init__(self):
        self._async_engine: Optional[AsyncEngine] = None
        self._async_session_factory: Optional[async_sessionmaker] = None
        self._sync_engine = None
        self._sync_session_factory = None

    @property
    def async_engine(self) -> AsyncEngine:
        """
        Lazy initialization of async engine
        """
        if self._async_engine is None:
            self._async_engine = create_async_engine(
                settings.async_database_url,
                echo=settings.DEBUG,
                poolclass=QueuePool,
                pool_size=settings.POSTGRES_POOL_SIZE,
                max_overflow=settings.POSTGRES_MAX_OVERFLOW,
                pool_pre_ping=True,
                pool_recycle=3600,
                connect_args={
                    "server_settings": {
                        "application_name": settings.PROJECT_NAME,
                        "timezone": "UTC",
                    }
                },
            )
            logger.info("Async database engine initialized")

        return self._async_engine

    @property
    def sync_engine(self):
        """
        Lazy initialization of sync engine
        """
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
        """
        Async session factory
        """
        if self._async_session_factory is None:
            self._async_session_factory = async_sessionmaker(
                self.async_engine,
                class_=AsyncSession,
                expire_on_commit=False,
                autoflush=False,
                autocommit=False,
            )

        return self._async_session_factory

    @property
    def sync_session_factory(self) -> sessionmaker:
        """
        Sync session factory
        """
        if self._sync_session_factory is None:
            self._sync_session_factory = sessionmaker(
                self.sync_engine,
                expire_on_commit=False,
                autoflush=False,
                autocommit=False,
            )

        return self._sync_session_factory

    @asynccontextmanager
    async def get_session(self) -> AsyncGenerator[AsyncSession, None]:
        """
        Async DB session manager
        """
        session = self.async_session_factory()

        try:
            yield session
            await session.commit()

        except Exception as e:
            await session.rollback()
            logger.error(f"Async DB rollback: {e}")
            raise

        finally:
            await session.close()

    def get_sync_session(self) -> Generator:
        """
        Sync DB session manager
        """
        session = self.sync_session_factory()

        try:
            yield session
            session.commit()

        except Exception as e:
            session.rollback()
            logger.error(f"Sync DB rollback: {e}")
            raise

        finally:
            session.close()

    async def create_tables(self):
        """
        Create tables
        """
        async with self.async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

        logger.info("Database tables created")

    async def drop_tables(self):
        """
        Drop tables (used for testing)
        """
        async with self.async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)

        logger.warning("Database tables dropped")

    async def check_connection(self) -> bool:
        """
        Test database connection
        """
        try:
            async with self.async_engine.connect() as conn:
                await conn.execute(text("SELECT 1"))

            logger.debug("Database connection successful")
            return True

        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            return False

    async def close(self):
        """
        Close engines
        """
        if self._async_engine:
            await self._async_engine.dispose()
            self._async_engine = None

        if self._sync_engine:
            self._sync_engine.dispose()
            self._sync_engine = None


# Global database manager
db_manager = DatabaseManager()


# ==============================
# FastAPI Dependency Functions
# ==============================

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency for async session
    """
    async with db_manager.get_session() as session:
        yield session


def get_sync_session():
    """
    FastAPI dependency for sync session
    """
    yield from db_manager.get_sync_session()


# ==============================
# Utility SQL helpers
# ==============================

async def execute_query(query: str, params: dict = None) -> list:
    """
    Execute raw SQL query
    """
    async with db_manager.get_session() as session:
        result = await session.execute(text(query), params or {})
        return result.fetchall()


async def execute_scalar(query: str, params: dict = None):
    """
    Execute query returning scalar
    """
    async with db_manager.get_session() as session:
        result = await session.execute(text(query), params or {})
        return result.scalar()


async def execute_commit(query: str, params: dict = None):
    """
    Execute query and commit
    """
    async with db_manager.get_session() as session:
        await session.execute(text(query), params or {})
        await session.commit()