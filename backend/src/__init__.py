"""
Source package for the backend application.

This package contains all the source code for the application.
It's organized into sub-packages like api, core, utils, etc.
"""

import os
import sys

# Add the src directory itself to Python path
current_dir = os.path.dirname(__file__)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Package metadata
__version__ = "1.0.0"
__author__ = "Your Name/Team"
__description__ = "Source code for the backend application"

# This makes src a proper Python package
__all__ = []

# Optional: Helper function to get absolute paths
def get_project_root():
    """Get the absolute path to the project root (backend directory)."""
    return os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def get_src_path():
    """Get the absolute path to the src directory."""
    return os.path.abspath(os.path.dirname(__file__))

# Optional: Setup function
def setup():
    """Setup the source package."""
    print(f"Setting up {__description__} v{__version__}")
    print(f"Project root: {get_project_root()}")
    print(f"Source path: {get_src_path()}")
    print(f"Python path: {sys.path}")
    return True

# Simple main for testing
def main():
    """Test if the source package can be imported."""
    import argparse
    
    parser = argparse.ArgumentParser(description=__description__)
    parser.add_argument('--version', action='version', version=f'%(prog)s {__version__}')
    parser.add_argument('--setup', action='store_true', help='Run setup')
    
    args = parser.parse_args()
    
    if args.setup:
        setup()
    else:
        print(f"{__description__} v{__version__}")
        print(f"Available modules in src:")
        
        # List available modules
        for item in os.listdir(current_dir):
            if os.path.isdir(os.path.join(current_dir, item)) and not item.startswith('.'):
                print(f"  - {item}/")
            elif item.endswith('.py') and item != '__init__.py':
                print(f"  - {item}")
    
    return 0

if __name__ == "__main__":
    exit(main())