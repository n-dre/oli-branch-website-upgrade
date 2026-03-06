"""
CRUD Operations Base Class and Utilities
Provides reusable CRUD operations for all models
"""

import logging
from typing import Any, Dict, List, Optional, Union, Tuple
from datetime import datetime
from uuid import UUID

from sqlalchemy import inspect, func, select, update, delete, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from .database import Base, db_manager

# Set up logger
logger = logging.getLogger(__name__)


class CRUDBase:
    """Base class for CRUD operations"""
    
    def __init__(self, model):
        """
        Initialize CRUD operations for a specific model.
        
        Args:
            model: SQLAlchemy model class
        """
        self.model = model
    
    async def get(self, db: AsyncSession, id: Union[int, str, UUID]) -> Optional[Any]:
        """
        Get a single record by ID.
        
        Args:
            db: Database session
            id: Record ID
        
        Returns:
            Model instance or None
        """
        try:
            result = await db.get(self.model, id)
            if result:
                logger.debug(f"Retrieved {self.model.__name__} with id={id}")
            return result
        except SQLAlchemyError as e:
            logger.error(f"Error retrieving {self.model.__name__} with id={id}: {e}")
            return None
    
    async def get_multi(
        self, 
        db: AsyncSession, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        filters: Optional[List[Any]] = None,
        order_by: Optional[List[Any]] = None
    ) -> List[Any]:
        """
        Get multiple records with pagination.
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            filters: List of filter conditions
            order_by: List of ordering conditions
        
        Returns:
            List of model instances
        """
        try:
            query = select(self.model)
            
            # Apply filters
            if filters:
                for filter_condition in filters:
                    query = query.where(filter_condition)
            
            # Apply ordering
            if order_by:
                query = query.order_by(*order_by)
            
            # Apply pagination
            query = query.offset(skip).limit(limit)
            
            result = await db.execute(query)
            items = result.scalars().all()
            
            logger.debug(f"Retrieved {len(items)} {self.model.__name__} records")
            return items
        except SQLAlchemyError as e:
            logger.error(f"Error retrieving multiple {self.model.__name__}: {e}")
            return []
    
    async def create(self, db: AsyncSession, *, obj_in: Any) -> Optional[Any]:
        """
        Create a new record.
        
        Args:
            db: Database session
            obj_in: Pydantic schema or dict with data to create
        
        Returns:
            Created model instance or None
        """
        try:
            # Convert to dict if it's a Pydantic model
            if hasattr(obj_in, "dict"):
                obj_in_data = obj_in.dict(exclude_unset=True)
            else:
                obj_in_data = dict(obj_in)
            
            # Create model instance
            db_obj = self.model(**obj_in_data)
            
            # Add to session and commit
            db.add(db_obj)
            await db.commit()
            await db.refresh(db_obj)
            
            logger.debug(f"Created {self.model.__name__} with id={self._get_id(db_obj)}")
            return db_obj
        except SQLAlchemyError as e:
            await db.rollback()
            logger.error(f"Error creating {self.model.__name__}: {e}")
            return None
    
    async def update(
        self, 
        db: AsyncSession, 
        *, 
        db_obj: Any, 
        obj_in: Any
    ) -> Optional[Any]:
        """
        Update a record.
        
        Args:
            db: Database session
            db_obj: Existing model instance
            obj_in: Pydantic schema or dict with data to update
        
        Returns:
            Updated model instance or None
        """
        try:
            # Convert to dict if it's a Pydantic model
            if hasattr(obj_in, "dict"):
                update_data = obj_in.dict(exclude_unset=True)
            else:
                update_data = dict(obj_in)
            
            # Update each field
            for field, value in update_data.items():
                if hasattr(db_obj, field):
                    setattr(db_obj, field, value)
            
            # Update updated_at timestamp if field exists
            if hasattr(db_obj, "updated_at"):
                setattr(db_obj, "updated_at", datetime.utcnow())
            
            await db.commit()
            await db.refresh(db_obj)
            
            logger.debug(f"Updated {self.model.__name__} with id={self._get_id(db_obj)}")
            return db_obj
        except SQLAlchemyError as e:
            await db.rollback()
            logger.error(f"Error updating {self.model.__name__} with id={self._get_id(db_obj)}: {e}")
            return None
    
    async def delete(self, db: AsyncSession, *, id: Union[int, str, UUID]) -> bool:
        """
        Delete a record by ID.
        
        Args:
            db: Database session
            id: Record ID
        
        Returns:
            True if deleted, False otherwise
        """
        try:
            db_obj = await self.get(db, id=id)
            if not db_obj:
                return False
            
            await db.delete(db_obj)
            await db.commit()
            
            logger.debug(f"Deleted {self.model.__name__} with id={id}")
            return True
        except SQLAlchemyError as e:
            await db.rollback()
            logger.error(f"Error deleting {self.model.__name__} with id={id}: {e}")
            return False
    
    async def count(self, db: AsyncSession, filters: Optional[List[Any]] = None) -> int:
        """
        Count records with optional filters.
        
        Args:
            db: Database session
            filters: List of filter conditions
        
        Returns:
            Count of records
        """
        try:
            query = select(func.count()).select_from(self.model)
            
            if filters:
                for filter_condition in filters:
                    query = query.where(filter_condition)
            
            result = await db.execute(query)
            count = result.scalar()
            
            return count
        except SQLAlchemyError as e:
            logger.error(f"Error counting {self.model.__name__}: {e}")
            return 0
    
    async def exists(self, db: AsyncSession, id: Union[int, str, UUID]) -> bool:
        """
        Check if a record exists by ID.
        
        Args:
            db: Database session
            id: Record ID
        
        Returns:
            True if exists, False otherwise
        """
        obj = await self.get(db, id=id)
        return obj is not None
    
    async def get_by_field(
        self, 
        db: AsyncSession, 
        *, 
        field_name: str, 
        field_value: Any
    ) -> Optional[Any]:
        """
        Get a record by a specific field value.
        
        Args:
            db: Database session
            field_name: Name of the field to filter by
            field_value: Value to match
        
        Returns:
            Model instance or None
        """
        try:
            if not hasattr(self.model, field_name):
                logger.error(f"Field {field_name} not found in {self.model.__name__}")
                return None
            
            query = select(self.model).where(getattr(self.model, field_name) == field_value)
            result = await db.execute(query)
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            logger.error(f"Error retrieving {self.model.__name__} by {field_name}={field_value}: {e}")
            return None
    
    async def get_or_create(
        self, 
        db: AsyncSession, 
        *, 
        defaults: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> Tuple[Optional[Any], bool]:
        """
        Get a record or create it if it doesn't exist.
        
        Args:
            db: Database session
            defaults: Default values for creation
            **kwargs: Filter criteria
        
        Returns:
            Tuple of (model instance, created flag)
        """
        try:
            # Try to get existing record
            obj = await self.get_by_fields(db, **kwargs)
            
            if obj:
                return obj, False
            
            # Create new record
            create_data = {**kwargs, **(defaults or {})}
            new_obj = await self.create(db, obj_in=create_data)
            
            if new_obj:
                return new_obj, True
            
            return None, False
        except SQLAlchemyError as e:
            logger.error(f"Error in get_or_create for {self.model.__name__}: {e}")
            return None, False
    
    async def get_by_fields(
        self, 
        db: AsyncSession, 
        **kwargs
    ) -> Optional[Any]:
        """
        Get a record by multiple field values.
        
        Args:
            db: Database session
            **kwargs: Field names and values to filter by
        
        Returns:
            Model instance or None
        """
        try:
            query = select(self.model)
            
            for field_name, field_value in kwargs.items():
                if hasattr(self.model, field_name):
                    query = query.where(getattr(self.model, field_name) == field_value)
                else:
                    logger.warning(f"Field {field_name} not found in {self.model.__name__}")
            
            result = await db.execute(query)
            return result.scalar_one_or_none()
        except SQLAlchemyError as e:
            logger.error(f"Error retrieving {self.model.__name__} by fields {kwargs}: {e}")
            return None
    
    async def bulk_create(
        self, 
        db: AsyncSession, 
        objs_in: List[Any]
    ) -> List[Any]:
        """
        Create multiple records in bulk.
        
        Args:
            db: Database session
            objs_in: List of schemas or dicts to create
        
        Returns:
            List of created model instances
        """
        try:
            db_objs = []
            
            for obj_in in objs_in:
                # Convert to dict if it's a Pydantic model
                if hasattr(obj_in, "dict"):
                    obj_in_data = obj_in.dict(exclude_unset=True)
                else:
                    obj_in_data = dict(obj_in)
                
                db_obj = self.model(**obj_in_data)
                db_objs.append(db_obj)
            
            db.add_all(db_objs)
            await db.commit()
            
            # Refresh all objects
            for db_obj in db_objs:
                await db.refresh(db_obj)
            
            logger.debug(f"Bulk created {len(db_objs)} {self.model.__name__} records")
            return db_objs
        except SQLAlchemyError as e:
            await db.rollback()
            logger.error(f"Error bulk creating {self.model.__name__}: {e}")
            return []
    
    async def bulk_update(
        self, 
        db: AsyncSession, 
        *, 
        ids: List[Union[int, str, UUID]], 
        update_data: Dict[str, Any]
    ) -> int:
        """
        Update multiple records in bulk.
        
        Args:
            db: Database session
            ids: List of record IDs to update
            update_data: Dictionary of fields to update
        
        Returns:
            Number of updated records
        """
        try:
            # Update updated_at timestamp if field exists
            if hasattr(self.model, "updated_at") and "updated_at" not in update_data:
                update_data["updated_at"] = datetime.utcnow()
            
            # Create update statement
            stmt = (
                update(self.model)
                .where(self.model.id.in_(ids))
                .values(**update_data)
                .execution_options(synchronize_session="fetch")
            )
            
            result = await db.execute(stmt)
            await db.commit()
            
            updated_count = result.rowcount
            logger.debug(f"Bulk updated {updated_count} {self.model.__name__} records")
            
            return updated_count
        except SQLAlchemyError as e:
            await db.rollback()
            logger.error(f"Error bulk updating {self.model.__name__}: {e}")
            return 0
    
    async def bulk_delete(
        self, 
        db: AsyncSession, 
        ids: List[Union[int, str, UUID]]
    ) -> int:
        """
        Delete multiple records in bulk.
        
        Args:
            db: Database session
            ids: List of record IDs to delete
        
        Returns:
            Number of deleted records
        """
        try:
            stmt = (
                delete(self.model)
                .where(self.model.id.in_(ids))
                .execution_options(synchronize_session="fetch")
            )
            
            result = await db.execute(stmt)
            await db.commit()
            
            deleted_count = result.rowcount
            logger.debug(f"Bulk deleted {deleted_count} {self.model.__name__} records")
            
            return deleted_count
        except SQLAlchemyError as e:
            await db.rollback()
            logger.error(f"Error bulk deleting {self.model.__name__}: {e}")
            return 0
    
    def _get_id(self, obj: Any) -> Union[int, str, UUID, None]:
        """Get the ID of a model instance"""
        if hasattr(obj, "id"):
            return getattr(obj, "id")
        elif hasattr(obj, "uuid"):
            return getattr(obj, "uuid")
        
        # Try to get primary key
        mapper = inspect(obj.__class__)
        pk_columns = mapper.primary_key
        
        if pk_columns:
            pk_column = pk_columns[0].name
            return getattr(obj, pk_column)
        
        return None


class CRUDHelper:
    """Helper functions for common CRUD patterns"""
    
    @staticmethod
    async def paginate_query(
        db: AsyncSession,
        query,
        page: int = 1,
        page_size: int = 20
    ) -> Dict[str, Any]:
        """
        Paginate a SQLAlchemy query.
        
        Args:
            db: Database session
            query: SQLAlchemy query
            page: Page number (1-indexed)
            page_size: Number of items per page
        
        Returns:
            Dictionary with paginated results and metadata
        """
        try:
            # Calculate offset
            offset = (page - 1) * page_size
            
            # Get total count
            count_query = select(func.count()).select_from(query.subquery())
            total_result = await db.execute(count_query)
            total = total_result.scalar()
            
            # Get paginated results
            paginated_query = query.offset(offset).limit(page_size)
            result = await db.execute(paginated_query)
            items = result.scalars().all()
            
            # Calculate pagination metadata
            total_pages = (total + page_size - 1) // page_size if total > 0 else 0
            
            return {
                "items": items,
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_prev": page > 1,
            }
        except SQLAlchemyError as e:
            logger.error(f"Error paginating query: {e}")
            return {
                "items": [],
                "total": 0,
                "page": page,
                "page_size": page_size,
                "total_pages": 0,
                "has_next": False,
                "has_prev": False,
            }
    
    @staticmethod
    async def search_query(
        db: AsyncSession,
        model,
        search_term: str,
        search_fields: List[str],
        filters: Optional[List[Any]] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Any]:
        """
        Search across multiple fields.
        
        Args:
            db: Database session
            model: SQLAlchemy model class
            search_term: Term to search for
            search_fields: List of field names to search in
            filters: Additional filter conditions
            skip: Number of records to skip
            limit: Maximum number of records to return
        
        Returns:
            List of matching model instances
        """
        try:
            query = select(model)
            
            # Build search conditions
            search_conditions = []
            for field_name in search_fields:
                if hasattr(model, field_name):
                    field = getattr(model, field_name)
                    search_conditions.append(field.ilike(f"%{search_term}%"))
            
            if search_conditions:
                query = query.where(or_(*search_conditions))
            
            # Apply additional filters
            if filters:
                for filter_condition in filters:
                    query = query.where(filter_condition)
            
            # Apply pagination
            query = query.offset(skip).limit(limit)
            
            result = await db.execute(query)
            return result.scalars().all()
        except SQLAlchemyError as e:
            logger.error(f"Error searching {model.__name__}: {e}")
            return []


# Now let's also update the __init__.py file to remove the type variable exports:

"""
Database Module
Exports database components and utilities
"""

from .database import (
    Base,
    metadata,
    db_manager,
    DatabaseManager,
    execute_query,
    execute_scalar,
    execute_commit,
    get_session as get_db_session,
)

from .crud import (
    CRUDBase,
    CRUDHelper,
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
            
            # Example query
            try:
                result = await session.execute("SELECT 1 as test")
                row = result.fetchone()
                print(f"✅ Test query result: {row.test}")
            except:
                print("⚠️  Test query failed - check database configuration")
        
        print("=" * 50)
    
    # Run example
    asyncio.run(example())