# backend/src/models/leak.py
"""
Leak model for detected financial leaks
"""

from sqlalchemy import Column, String, Integer, DateTime, Numeric, Text, JSON, Boolean, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from . import Base

class Leak(Base):
    __tablename__ = "leaks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    
    # Leak identification
    code = Column(String, nullable=False, index=True)  # e.g., CASH_DEPOSIT_FEES
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String)  # fees, inefficiency, mismatch, waste
    
    # Financial impact
    monthly_cost = Column(Numeric(14, 2), nullable=False)
    annual_cost = Column(Numeric(14, 2), nullable=False)
    potential_savings = Column(Numeric(14, 2))
    roi_months = Column(Numeric(5, 1))
    
    # Severity and priority
    severity = Column(String, nullable=False)  # critical, high, medium, low
    confidence = Column(Numeric(4, 3), default=0.7)
    priority = Column(Integer, default=3)  # 1-5, 1 = highest
    
    # Evidence and details
    evidence = Column(JSON)  # Transaction IDs, counts, patterns
    evidence_summary = Column(Text)
    pattern_description = Column(Text)
    
    # Fix information
    fix_complexity = Column(String)  # easy, medium, hard
    estimated_fix_time = Column(String)  # hours, days, weeks
    requires_bank_change = Column(Boolean, default=False)
    
    # Status tracking
    is_actionable = Column(Boolean, default=True)
    is_resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime)
    resolution_notes = Column(Text)
    
    # Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    report = relationship("Report", back_populates="leaks")
    
    def __repr__(self):
        return f"<Leak(id={self.id}, code={self.code}, monthly_cost=${self.monthly_cost})>"