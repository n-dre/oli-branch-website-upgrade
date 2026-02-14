# backend/src/models/score.py
"""
Score model for calculated scores
"""

from sqlalchemy import Column, String, Integer, DateTime, Numeric, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from . import Base

class Score(Base):
    __tablename__ = "scores"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(UUID(as_uuid=True), ForeignKey("reports.id", ondelete="CASCADE"), nullable=False)
    
    # Score identification
    score_type = Column(String, nullable=False)  # mismatch, financial_health, fee_efficiency, etc.
    value = Column(Integer, nullable=False)  # 0-100
    weight = Column(Numeric(3, 2))  # 0-1 weight in overall score
    
    # Component breakdown
    components = Column(JSON)  # {"fee_ratio": 85, "cash_efficiency": 45, ...}
    thresholds = Column(JSON)  # {"good": 80, "warning": 60, "bad": 40}
    
    # Metadata
    calculation_method = Column(String)  # weighted_average, min, max, custom
    version = Column(String, default="1.0")
    
    # Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    report = relationship("Report", back_populates="scores")
    
    def __repr__(self):
        return f"<Score(id={self.id}, type={self.score_type}, value={self.value})>"