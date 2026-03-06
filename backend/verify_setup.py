# backend/verify_setup.py
"""
Quick verification script for Oli-Branch setup
"""

import sys
import importlib

def check_module(module_name):
    try:
        importlib.import_module(module_name)
        print(f"✅ {module_name} - installed")
        return True
    except ImportError as e:
        print(f"❌ {module_name} - not installed ({e})")
        return False

def main():
    print("\n" + "="*50)
    print("Oli-Branch Setup Verification")
    print("="*50)
    
    # Check Python version
    python_version = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    print(f"\nPython: {python_version}")
    
    # Check critical modules
    print("\nChecking critical modules:")
    modules = [
        "fastapi",
        "sqlalchemy",
        "pydantic",
        "alembic",
        "psycopg2",
        "redis",
        "jose",
        "passlib",
        "openai",
        "boto3",
        "requests",
        "cryptography"
    ]
    
    for module in modules:
        check_module(module)
    
    # Check development modules
    print("\nChecking development modules:")
    dev_modules = [
        "pytest",
        "black",
        "isort",
        "flake8",
        "mypy",
        "pre_commit",
        "pluggy"
    ]
    
    for module in dev_modules:
        check_module(module)
    
    # Check directory structure
    print("\nChecking directory structure:")
    directories = [
        "src",
        "src/api",
        "src/core",
        "src/database",
        "src/models",
        "src/services",
        "src/agents",
        "src/orchestration",
        "src/utils",
        "tests",
        "tests/unit",
        "tests/integration",
        "tests/fixtures",
        "scripts",
        "alembic",
        "alembic/versions",
        "lambda",
        "lambda/handlers",
        "lambda/layers",
        "docker"
    ]
    
    import os
    for directory in directories:
        if os.path.exists(directory):
            print(f"✅ {directory}/ - exists")
        else:
            print(f"❌ {directory}/ - missing")
    
    print("\n" + "="*50)
    print("Verification complete!")
    print("="*50)

if __name__ == "__main__":
    main()