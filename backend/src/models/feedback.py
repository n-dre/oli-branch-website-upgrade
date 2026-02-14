# backend/src/models/feedback.py
"""
Feedback model for user feedback and ratings
"""

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from . import Base

class Feedback(Base):
    __tablename__ = "feedback"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    business_id = Column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="SET NULL"), nullable=True)
    report_id = Column(UUID(as_uuid=True), ForeignKey("reports.id", ondelete="SET NULL"), nullable=True)
    
    # Feedback content
    rating = Column(Integer)  # 1-5 stars
    text = Column(Text)
    category = Column(String)  # general, bug, feature_request, support
    
    # Follow-up tracking
    follow_up_required = Column(Boolean, default=False)
    follow_up_completed = Column(Boolean, default=False)
    follow_up_notes = Column(Text)
    
    # Metadata
    user_email = Column(String)  # Captured at time of feedback
    page_url = Column(String)
    browser_info = Column(String)
    
    # Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="feedback")
    
    def __repr__(self):
        return f"<Feedback(id={self.id}, rating={self.rating}, user_id={self.user_id})>"