import sys
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.database.database import Base
from src.core.config import Settings


@pytest.fixture
def db_session():
    """Create a test database session"""
    engine = create_engine("sqlite:///:memory:")
    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )

    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def settings():
    """Return test settings"""
    return Settings(
        database_url="sqlite:///:memory:",
        secret_key="test-secret-key",
        environment="test"
    )


@pytest.fixture
def client():
    """Create a test client"""
    from fastapi.testclient import TestClient
    from src.main import app
    return TestClient(app)