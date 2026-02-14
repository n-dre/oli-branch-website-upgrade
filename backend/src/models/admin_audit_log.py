# backend/src/models/admin_audit_log.py
"""
Admin audit log model for tracking admin actions
"""

from sqlalchemy import Column, String, Integer, DateTime, JSON, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from . import Base

class AdminAuditLog(Base):
    __tablename__ = "admin_audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    admin_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    target_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    business_id = Column(UUID(as_uuid=True), ForeignKey("businesses.id"), nullable=True)
    
    # Action details
    action = Column(String, nullable=False)  # e.g., user_view, user_update, report_generate
    resource_type = Column(String)  # user, business, report, assessment
    resource_id = Column(String)
    
    # State changes
    before_state = Column(JSON)
    after_state = Column(JSON)
    changes = Column(JSON)
    
    # Context
    ip_address = Column(String)
    user_agent = Column(Text)
    reason = Column(String)  # Why the admin performed this action
    
    # Timestamp
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)
    
    # Relationships
    admin_user = relationship("User", foreign_keys=[admin_user_id])
    target_user = relationship("User", foreign_keys=[target_user_id])
    business = relationship("Business")
    
    def __repr__(self):
        return f"<AdminAuditLog(id={self.id}, admin={self.admin_user_id}, action={self.action})>"