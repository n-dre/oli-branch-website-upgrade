"""
Dependency Injection Module
Manages application dependencies and their lifecycle
"""

from typing import (
    Generator,
    AsyncGenerator,
    Optional,
    Any,
    TYPE_CHECKING,
)
from contextlib import asynccontextmanager, contextmanager
from functools import lru_cache

# -------------------------------------------------
# Optional external dependencies (typed safely)
# -------------------------------------------------

try:
    import redis.asyncio as redis_async
except ImportError:
    redis_async = None  # type: ignore

try:
    from sqlalchemy import create_engine, text
    from sqlalchemy.ext.asyncio import (
        AsyncSession,
        create_async_engine,
        async_sessionmaker,
    )
    from sqlalchemy.orm import sessionmaker, Session
except ImportError:
    create_engine = None  # type: ignore
    create_async_engine = None  # type: ignore
    async_sessionmaker = None  # type: ignore
    sessionmaker = None  # type: ignore
    AsyncSession = None  # type: ignore
    Session = None  # type: ignore
    text = None  # type: ignore

# -------------------------------------------------
# Local imports
# -------------------------------------------------

from .config import settings, get_async_database_url, get_redis_url
from .security import SecurityManager

# -------------------------------------------------
# Database Engines
# -------------------------------------------------

@lru_cache()
def get_async_engine():
    if create_async_engine is None:
        raise ImportError("SQLAlchemy async not installed")

    return create_async_engine(
        get_async_database_url(),
        echo=settings.DEBUG,
        pool_size=settings.POSTGRES_POOL_SIZE,
        max_overflow=settings.POSTGRES_MAX_OVERFLOW,
        pool_pre_ping=True,
    )


@lru_cache()
def get_sync_engine():
    if create_engine is None:
        raise ImportError("SQLAlchemy not installed")

    return create_engine(
        settings.database_url,
        echo=settings.DEBUG,
        pool_size=settings.POSTGRES_POOL_SIZE,
        max_overflow=settings.POSTGRES_MAX_OVERFLOW,
        pool_pre_ping=True,
    )

# -------------------------------------------------
# Session factories
# -------------------------------------------------

AsyncSessionLocal: Optional[Any] = None
SyncSessionLocal: Optional[Any] = None

if async_sessionmaker and AsyncSession:
    AsyncSessionLocal = async_sessionmaker(
        bind=get_async_engine(),
        class_=AsyncSession,
        expire_on_commit=False,
    )

if sessionmaker and Session:
    SyncSessionLocal = sessionmaker(
        bind=get_sync_engine(),
        class_=Session,
        expire_on_commit=False,
    )

# -------------------------------------------------
# Redis
# -------------------------------------------------

@lru_cache()
def get_redis_client():
    if redis_async is None:
        raise ImportError("Redis not installed")

    return redis_async.from_url(
        get_redis_url(),
        encoding="utf-8",
        decode_responses=True,
    )

# -------------------------------------------------
# Database dependencies
# -------------------------------------------------

async def get_db() -> AsyncGenerator[Any, None]:
    if AsyncSessionLocal is None:
        raise ImportError("Async DB not initialized")

    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


def get_sync_db() -> Generator[Any, None, None]:
    if SyncSessionLocal is None:
        raise ImportError("Sync DB not initialized")

    db = SyncSessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

# -------------------------------------------------
# Security
# -------------------------------------------------

def get_security_manager() -> SecurityManager:
    from .security import security_manager
    return security_manager


async def get_current_user(
    token: Optional[str] = None,
    security_manager: Optional[SecurityManager] = None,
) -> Optional[dict]:
    if token is None:
        return None

    if security_manager is None:
        security_manager = get_security_manager()

    payload = security_manager.verify_token(token)
    if not payload:
        return None

    return {
        "id": payload.get("sub"),
        "username": payload.get("username"),
        "email": payload.get("email"),
        "roles": payload.get("roles", []),
        "permissions": payload.get("permissions", []),
    }


async def get_current_active_user(
    current_user: Optional[dict],
) -> Optional[dict]:
    return current_user

# -------------------------------------------------
# Cache
# -------------------------------------------------

async def get_cache() -> AsyncGenerator[Any, None]:
    client = get_redis_client()
    try:
        yield client
    finally:
        await client.aclose()

# -------------------------------------------------
# Context managers
# -------------------------------------------------

@contextmanager
def db_session():
    if SyncSessionLocal is None:
        raise ImportError("Sync DB not initialized")

    db = SyncSessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@asynccontextmanager
async def async_db_session():
    if AsyncSessionLocal is None:
        raise ImportError("Async DB not initialized")

    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

# -------------------------------------------------
# Health checks
# -------------------------------------------------

async def check_database_health() -> dict:
    if AsyncSessionLocal is None or text is None:
        return {"database": "unavailable"}

    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        return {"database": "healthy"}
    except Exception as e:
        return {"database": "unhealthy", "error": str(e)}


async def check_redis_health() -> dict:
    if redis_async is None:
        return {"redis": "unavailable"}

    try:
        client = get_redis_client()
        await client.ping()
        return {"redis": "healthy"}
    except Exception as e:
        return {"redis": "unhealthy", "error": str(e)}


async def health_check() -> dict:
    db = await check_database_health()
    redis = await check_redis_health()

    healthy = (
        db.get("database") == "healthy"
        and redis.get("redis") == "healthy"
    )

    return {
        "status": "healthy" if healthy else "unhealthy",
        "services": {**db, **redis},
    }

# -------------------------------------------------
# Simple test-only fallbacks
# -------------------------------------------------

class SimpleDependencies:
    @staticmethod
    async def get_db_simple() -> AsyncGenerator[dict, None]:
        yield {"db": "mock"}

    @staticmethod
    def get_redis_simple() -> dict:
        return {"redis": "mock"}

    @staticmethod
    async def health_check_simple() -> dict:
        return {
            "status": "healthy",
            "services": {"database": "healthy", "redis": "healthy"},
        }
