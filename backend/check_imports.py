# backend/check_imports.py
"""
Check all model files for proper SQLAlchemy imports
"""

import os
import glob

def check_model_imports():
    """Check all model files for required imports"""
    
    # Get all model files
    model_files = glob.glob("src/models/*.py")
    
    required_imports = [
        "from sqlalchemy import",
        "from sqlalchemy.dialects.postgresql import UUID",
        "from sqlalchemy.orm import relationship",
        "from . import Base"
    ]
    
    print("=" * 60)
    print("CHECKING MODEL FILES FOR IMPORTS")
    print("=" * 60)
    
    all_good = True
    
    for file_path in model_files:
        if "__init__" in file_path:
            continue
        
        filename = os.path.basename(file_path)
        print(f"\n📄 Checking {filename}...")
        
        with open(file_path, 'r') as f:
            content = f.read()
        
        file_ok = True
        
        for imp in required_imports:
            if imp not in content:
                print(f"  ❌ Missing: {imp}")
                file_ok = False
                all_good = False
        
        # Check for Boolean specifically
        if "Boolean" in content and "from sqlalchemy import" not in content:
            print(f"  ❌ File uses Boolean but missing sqlalchemy import")
            file_ok = False
            all_good = False
        
        # Check for Column
        if "Column(" in content and "from sqlalchemy import" not in content:
            print(f"  ❌ File uses Column() but missing sqlalchemy import")
            file_ok = False
            all_good = False
        
        if file_ok:
            print(f"  ✅ All imports OK")
    
    print("\n" + "=" * 60)
    if all_good:
        print("✅ ALL MODEL FILES HAVE CORRECT IMPORTS")
    else:
        print("❌ SOME FILES ARE MISSING IMPORTS - SEE ABOVE")
    print("=" * 60)

def fix_imports():
    """Fix common import issues in model files"""
    
    model_files = glob.glob("src/models/*.py")
    
    for file_path in model_files:
        if "__init__" in file_path:
            continue
        
        filename = os.path.basename(file_path)
        print(f"\n🔧 Fixing {filename}...")
        
        with open(file_path, 'r') as f:
            lines = f.readlines()
        
        # Check if file has imports
        has_sqlalchemy_import = any("from sqlalchemy import" in line for line in lines)
        has_uuid_import = any("from sqlalchemy.dialects.postgresql import UUID" in line for line in lines)
        has_relationship_import = any("from sqlalchemy.orm import relationship" in line for line in lines)
        has_base_import = any("from . import Base" in line for line in lines)
        
        # If missing imports, add them
        if not all([has_sqlalchemy_import, has_uuid_import, has_relationship_import, has_base_import]):
            
            # Find where to insert imports (after docstring)
            insert_line = 0
            for i, line in enumerate(lines):
                if line.startswith('"""'):
                    insert_line = i + 1
                    while insert_line < len(lines) and lines[insert_line].strip() == '':
                        insert_line += 1
                    break
            
            # Build new imports
            new_imports = []
            if not has_sqlalchemy_import:
                new_imports.append("from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, JSON, Numeric\n")
            if not has_uuid_import:
                new_imports.append("from sqlalchemy.dialects.postgresql import UUID\n")
            if not has_relationship_import:
                new_imports.append("from sqlalchemy.orm import relationship\n")
            if not has_base_import:
                new_imports.append("from . import Base\n")
            
            # Insert imports
            if new_imports:
                lines[insert_line:insert_line] = ['\n'] + new_imports + ['\n']
                
                # Write back to file
                with open(file_path, 'w') as f:
                    f.writelines(lines)
                
                print(f"  ✅ Added missing imports to {filename}")
            else:
                print(f"  ✅ {filename} already has all imports")
        else:
            print(f"  ✅ {filename} already has all imports")

def add_boolean_imports():
    """Specifically add Boolean import to files that need it"""
    
    model_files = glob.glob("src/models/*.py")
    
    for file_path in model_files:
        if "__init__" in file_path:
            continue
        
        with open(file_path, 'r') as f:
            content = f.read()
        
        # Check if file uses Boolean but doesn't import it
        if "Boolean" in content and "from sqlalchemy import" in content:
            # Check if Boolean is in the import line
            import_lines = []
            with open(file_path, 'r') as f:
                lines = f.readlines()
            
            modified = False
            for i, line in enumerate(lines):
                if "from sqlalchemy import" in line and "Boolean" not in line:
                    # Add Boolean to the import
                    lines[i] = line.strip() + ", Boolean\n"
                    modified = True
                    print(f"✅ Added Boolean to imports in {os.path.basename(file_path)}")
                    break
            
            if modified:
                with open(file_path, 'w') as f:
                    f.writelines(lines)

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--fix":
            print("Fixing import issues...")
            fix_imports()
        elif sys.argv[1] == "--add-boolean":
            print("Adding Boolean imports...")
            add_boolean_imports()
        else:
            check_model_imports()
    else:
        check_model_imports()