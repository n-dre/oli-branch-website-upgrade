"""Basic tests to verify setup"""


def test_imports():
    """Test that all major modules can be imported"""
    try:
        import fastapi
        import sqlalchemy
        import pydantic
        import pytest
        assert True
    except ImportError as e:
        assert False, f"Import failed: {e}"


def test_math():
    """Simple math test"""
    assert 1 + 1 == 2
    assert 2 * 3 == 6


def test_string():
    """Simple string test"""
    assert "oli" in "olibranch"
    assert "branch".upper() == "BRANCH"