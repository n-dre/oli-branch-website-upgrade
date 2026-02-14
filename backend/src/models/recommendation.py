# backend/src/models/recommendation.py
"""
Recommendation model for generated recommendations
"""

from sqlalchemy import Column, String, Integer, DateTime, Numeric, Text, JSON, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from . import Base

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    
    # Recommendation details
    type = Column(String, nullable=False)  # bank, tool, resource, learning, operational
    category = Column(String)  # banking, payments, accounting, compliance
    title = Column(String, nullable=False)
    description = Column(Text)
    
    # Action details
    action_steps = Column(JSON)  # Step-by-step instructions
    expected_savings_monthly = Column(Numeric(14, 2))
    expected_savings_annual = Column(Numeric(14, 2))
    implementation_effort = Column(String)  # low, medium, high
    time_to_implement = Column(String)  # hours, days, weeks
    
    # Provider information
    provider_name = Column(String)
    provider_type = Column(String)  # bank, fintech, software, government
    url = Column(Text)
    referral_code = Column(String)
    
    # Priority and status
    priority = Column(Integer, nullable=False, default=3)  # 1-5, 1 = highest
    urgency = Column(String)  # immediate, soon, eventually
    status = Column(String, default="pending")  # pending, in_progress, completed, dismissed
    
    # AI generation metadata
    ai_generated = Column(Boolean, default=True)
    reasoning = Column(Text)  # AI's reasoning
    
    # Evidence
    evidence = Column(JSON)
    
    # Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    report = relationship("Report", back_populates="recommendations")
    
    def __repr__(self):
        return f"<Recommendation(id={self.id}, type={self.type}, title={self.title})>"