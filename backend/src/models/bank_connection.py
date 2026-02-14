# backend/src/models/bank_connection.py
"""
Bank connection model
"""

from sqlalchemy import Column, String, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from . import Base

class BankConnection(Base):
    __tablename__ = "bank_connections"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String, nullable=False)
    provider_item_id = Column(String)
    institution_name = Column(String)
    access_token_enc = Column(Text, nullable=False)
    status = Column(String, nullable=False, default="connected")
    last_successful_sync = Column(DateTime)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    business = relationship("Business", back_populates="bank_connections")
    accounts = relationship("BankAccount", back_populates="bank_connection", cascade="all, delete-orphan")