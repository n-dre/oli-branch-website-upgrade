# backend/src/models/analysis_job.py
"""
Analysis job model
"""

from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from . import Base

class AnalysisJob(Base):
    __tablename__ = "analysis_jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(UUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, nullable=False, default="queued")
    started_at = Column(DateTime)
    finished_at = Column(DateTime)
    error_message = Column(String)
    result_summary = Column(JSON)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    business = relationship("Business")