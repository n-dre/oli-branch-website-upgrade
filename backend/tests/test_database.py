"""Database tests"""

from sqlalchemy import text


def test_db_session(db_session):
    """Test database session"""
    assert db_session is not None

    result = db_session.execute(text("SELECT 1")).scalar()
    assert result == 1


def test_settings(settings):
    """Test settings"""

    # Ensure settings object loads
    assert settings is not None

    # Ensure database URL exists
    assert settings.database_url is not None
    assert "postgresql" in settings.database_url

    # Ensure environment exists
    assert settings.ENVIRONMENT is not None

    # Ensure secret key exists
    assert settings.SECRET_KEY is not None