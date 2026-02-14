# backend/src/models/business.py
"""
Business model
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from . import Base

class Business(Base):
    __tablename__ = "businesses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    business_name = Column(String, nullable=False)
    ein = Column(String, nullable=False, unique=True)
    entity_type = Column(String)  # LLC, Sole Prop, Corp
    industry = Column(String)
    location_state = Column(String)
    location_city = Column(String)
    location_zip = Column(String)
    employee_count = Column(Integer)
    founded_year = Column(Integer)
    is_active = Column(Boolean, default=True)
    fraud_score = Column(Integer, default=0)
    fraud_reason = Column(Text)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="businesses")
    assessments = relationship("Assessment", back_populates="business", cascade="all, delete-orphan")
    bank_connections = relationship("BankConnection", back_populates="business", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="business", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Business(id={self.id}, name={self.business_name}, ein={self.ein})>"