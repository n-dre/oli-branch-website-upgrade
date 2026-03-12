"""
Database Module
Exports database components and utilities
"""

from sqlalchemy import text
from .database import (
    Base,
    metadata,
    db_manager,
    DatabaseManager,
    execute_query,
    execute_scalar,
    execute_commit,
    get_session as get_db_session,  # Alias for backward compatibility
)

from .crud import (
    CRUDBase,
    CRUDHelper,
    # Type variables are now properly defined in crud.py
    ModelType,
    CreateSchemaType,
    UpdateSchemaType,
)

# Export all public components
__all__ = [
    # Database
    'Base',
    'metadata',
    'db_manager',
    'DatabaseManager',
    'execute_query',
    'execute_scalar',
    'execute_commit',
    'get_db_session',
    
    # CRUD
    'CRUDBase',
    'CRUDHelper',
    'ModelType',
    'CreateSchemaType',
    'UpdateSchemaType',
]

__version__ = '1.0.0'
__author__ = 'Database Team'

# Initialize database connection
async def init_database():
    """Initialize database connection and create tables if needed"""
    try:
        # Check connection
        is_connected = await db_manager.check_connection()
        
        if is_connected:
            print(f"✅ Database connected successfully")
            
            # Get database info
            db_info = await db_manager.get_database_info()
            print(f"📊 Database Info: {db_info.get('version', 'Unknown')}")
            print(f"💾 Size: {db_info.get('size_mb', 0)} MB")
            print(f"🔗 Connections: {db_info.get('active_connections', 0)} active")
            
            return True
        else:
            print("❌ Database connection failed")
            return False
            
    except Exception as e:
        print(f"⚠️  Database initialization error: {e}")
        return False


async def close_database():
    """Close database connections"""
    await db_manager.close()
    print("🔒 Database connections closed")


# Example usage instructions
if __name__ == "__main__":
    import asyncio
    
    async def example():
        """Example of using the database module"""
        print("Database Module Example")
        print("=" * 50)
        
        # Initialize database
        await init_database()
        
        # Get a session
        async with db_manager.get_session() as session:
            # Use session for database operations
            print("✅ Got database session")
            
            # Example query - FIXED: wrap SQL in text()
            try:
                result = await session.execute(text("SELECT 1 as test"))
                row = result.fetchone()
                print(f"✅ Test query result: {row.test}")
            except Exception as e:
                print(f"⚠️  Test query failed: {e}")
        
        print("=" * 50)
    
    # Run example
    asyncio.run(example())