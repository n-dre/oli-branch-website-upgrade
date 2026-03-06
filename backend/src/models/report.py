# backend/src/models/report.py
"""
Report Model
Comprehensive report model combining both detailed and simplified versions
"""

import uuid
from datetime import datetime
from typing import Optional
from enum import Enum as PyEnum

from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime, Date,
    Text, ForeignKey, Enum, JSON, Float, Numeric
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID as PGUUID

from . import Base


class ReportType(str, PyEnum):
    """Report type enumeration"""
    ASSESSMENT = "assessment"
    PROGRESS = "progress"
    ANALYTICS = "analytics"
    SUMMARY = "summary"
    CUSTOM = "custom"


class ReportStatus(str, PyEnum):
    """Report status enumeration"""
    DRAFT = "draft"
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"
    ARCHIVED = "archived"


class ReportFormat(str, PyEnum):
    """Report format enumeration"""
    HTML = "html"
    PDF = "pdf"
    EXCEL = "excel"
    JSON = "json"
    CSV = "csv"


class Report(Base):
    """
    Comprehensive Report model for Oli-Branch
    
    Combines:
    - Detailed report structure with sections and data sources
    - Simplified analysis report with scores and leaks
    - Export and scheduling capabilities
    """
    __tablename__ = "reports"
    
    # ==================== PRIMARY KEY ====================
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # ==================== REPORT IDENTIFICATION ====================
    title = Column(String(500), nullable=False, index=True)
    description = Column(Text)
    code = Column(String(100), unique=True, index=True)  # Human-readable identifier
    
    # ==================== REPORT CONFIGURATION ====================
    type = Column(Enum(ReportType), nullable=False, index=True)
    format = Column(Enum(ReportFormat), default=ReportFormat.HTML, index=True)
    template = Column(String(255))  # Template name or path
    parameters = Column(JSON, default=dict)  # Report generation parameters
    
    # ==================== STATUS AND VISIBILITY ====================
    status = Column(Enum(ReportStatus), default=ReportStatus.DRAFT, index=True)
    is_public = Column(Boolean, default=False)
    is_scheduled = Column(Boolean, default=False)
    is_latest = Column(Boolean, default=True, index=True)  # From simplified version
    
    # ==================== GENERATION DATA ====================
    generated_at = Column(DateTime, nullable=True)
    generation_duration = Column(Float)  # Seconds taken to generate
    file_size = Column(Integer)  # Size in bytes
    file_path = Column(String(1000))  # Storage path
    file_url = Column(String(1000))  # Download URL
    
    # ==================== ERROR HANDLING ====================
    error_message = Column(Text)
    error_details = Column(JSON, default=dict)
    retry_count = Column(Integer, default=0)
    
    # ==================== SCHEDULE INFORMATION ====================
    schedule_cron = Column(String(50))  # Cron expression
    next_scheduled_at = Column(DateTime, nullable=True)
    
    # ==================== SCORES AND METRICS (From simplified version) ====================
    mismatch_score = Column(Integer, nullable=True)  # 0-100
    financial_health_score = Column(Integer, nullable=True)  # 0-100
    risk_label = Column(String, nullable=True)  # High/Medium/Low
    health_label = Column(String, nullable=True)  # Healthy/Needs optimization/At risk/Critical
    
    # ==================== FINANCIAL TOTALS ====================
    total_monthly_leaks = Column(Numeric(14, 2), default=0)
    total_annual_leaks = Column(Numeric(14, 2), default=0)
    fee_to_revenue_ratio = Column(Numeric(5, 4), nullable=True)
    cash_efficiency_score = Column(Numeric(5, 2), nullable=True)
    
    # ==================== CONTENT SECTIONS ====================
    executive_summary = Column(Text)  # From simplified version
    key_findings = Column(Text)  # From simplified version
    recommendations_summary = Column(Text)  # From simplified version
    next_actions = Column(Text)  # From simplified version
    
    # ==================== METADATA ====================
    tags = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)
    
    # ==================== TIMESTAMPS ====================
    period_start = Column(Date, nullable=True)  # From simplified version
    period_end = Column(Date, nullable=True)  # From simplified version
    analysis_date = Column(DateTime, default=datetime.utcnow)  # From simplified version
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)  # Auto-delete after this date
    
    # ==================== FOREIGN KEYS ====================
    # User/business ownership
    created_by = Column(PGUUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    business_id = Column(PGUUID(as_uuid=True), ForeignKey("businesses.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Related entities
    assessment_id = Column(PGUUID(as_uuid=True), ForeignKey('assessments.id'), nullable=True, index=True)
    result_id = Column(PGUUID(as_uuid=True), ForeignKey('assessment_results.id'), nullable=True, index=True)
    
    # ==================== RELATIONSHIPS ====================
    # User and business
    user = relationship("User", back_populates="reports")
    business = relationship("Business", back_populates="reports")
    
    # Related entities
    assessment = relationship("Assessment", back_populates="reports")
    result = relationship("AssessmentResult")
    
    # Report components (from detailed version)
    sections = relationship("ReportSection", back_populates="report", cascade="all, delete-orphan")
    data_sources = relationship("ReportData", back_populates="report", cascade="all, delete-orphan")
    
    # Analysis components (from simplified version)
    leaks = relationship("Leak", back_populates="report", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="report", cascade="all, delete-orphan")
    scores = relationship("Score", back_populates="report", cascade="all, delete-orphan")
    
    # ==================== METHODS ====================
    
    def __repr__(self):
        return f"<Report(id={self.id}, title={self.title}, type={self.type}, status={self.status})>"
    
    @property
    def is_generated(self) -> bool:
        """Check if report is generated"""
        return self.status == ReportStatus.COMPLETED and self.generated_at is not None
    
    @property
    def is_failed(self) -> bool:
        """Check if report generation failed"""
        return self.status == ReportStatus.FAILED
    
    @property
    def file_info(self) -> dict:
        """Get file information"""
        return {
            "path": self.file_path,
            "url": self.file_url,
            "size": self.file_size,
            "format": self.format.value if self.format else None,
            "generated_at": self.generated_at.isoformat() if self.generated_at else None
        }
    
    @property
    def score_summary(self) -> dict:
        """Get score summary from simplified version"""
        return {
            "mismatch_score": self.mismatch_score,
            "financial_health_score": self.financial_health_score,
            "risk_label": self.risk_label,
            "health_label": self.health_label,
            "total_monthly_leaks": float(self.total_monthly_leaks) if self.total_monthly_leaks else 0,
            "total_annual_leaks": float(self.total_annual_leaks) if self.total_annual_leaks else 0
        }
    
    def can_regenerate(self) -> bool:
        """Check if report can be regenerated"""
        return self.status not in [ReportStatus.GENERATING]
    
    def get_download_url(self) -> Optional[str]:
        """Get download URL if available"""
        if self.is_generated and self.file_url:
            return self.file_url
        return None
    
    def mark_as_latest(self):
        """Mark this report as the latest for its business"""
        self.is_latest = True
    
    def unmark_as_latest(self):
        """Unmark this report as latest"""
        self.is_latest = False


class ReportSection(Base):
    """
    Report section model for structured reports
    """
    __tablename__ = "report_sections"
    
    # Primary key
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Section content
    title = Column(String(500), nullable=False)
    content = Column(Text)
    content_html = Column(Text)  # HTML formatted content
    
    # Section configuration
    order = Column(Integer, default=0)
    section_type = Column(String(50))  # text, chart, table, summary, etc.
    is_collapsible = Column(Boolean, default=False)
    is_expanded = Column(Boolean, default=True)
    
    # Visual configuration
    icon = Column(String(100))
    color = Column(String(50))
    
    # Data configuration
    data_source = Column(String(255))  # Reference to data source
    chart_config = Column(JSON, default=dict)  # Chart.js configuration
    table_data = Column(JSON, default=list)  # Table data
    
    # Metadata
    tags = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    report_id = Column(PGUUID(as_uuid=True), ForeignKey('reports.id', ondelete='CASCADE'), nullable=False, index=True)
    parent_section_id = Column(PGUUID(as_uuid=True), ForeignKey('report_sections.id'), nullable=True, index=True)
    
    # Relationships
    report = relationship("Report", back_populates="sections")
    parent_section = relationship("ReportSection", remote_side=[id], backref="child_sections")
    
    def __repr__(self):
        return f"<ReportSection(id={self.id}, title={self.title}, report_id={self.report_id})>"
    
    @property
    def has_children(self) -> bool:
        """Check if section has child sections"""
        return len(self.child_sections) > 0 if hasattr(self, 'child_sections') else False
    
    def get_content_preview(self, max_length: int = 200) -> str:
        """Get content preview"""
        if self.content:
            text = self.content.strip()
            if len(text) > max_length:
                return text[:max_length] + "..."
            return text
        return ""


class ReportData(Base):
    """
    Report data model for storing raw data used in reports
    """
    __tablename__ = "report_data"
    
    # Primary key
    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Data identification
    data_key = Column(String(255), nullable=False, index=True)
    data_type = Column(String(50), index=True)  # json, csv, array, object, etc.
    
    # Data storage
    raw_data = Column(JSON)  # For JSON data
    text_data = Column(Text)  # For text/CSV data
    binary_data = Column(Text)  # Base64 encoded binary data
    
    # Data description
    description = Column(Text)
    source = Column(String(500))  # Data source (query, API, file, etc.)
    
    # Statistics (for numeric data)
    row_count = Column(Integer)
    column_count = Column(Integer)
    stats = Column(JSON, default=dict)  # Statistical information
    
    # Metadata
    tags = Column(JSON, default=list)
    metadata = Column(JSON, default=dict)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    report_id = Column(PGUUID(as_uuid=True), ForeignKey('reports.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Relationships
    report = relationship("Report", back_populates="data_sources")
    
    def __repr__(self):
        return f"<ReportData(id={self.id}, data_key={self.data_key}, report_id={self.report_id})>"
    
    @property
    def data(self):
        """Get data based on type"""
        if self.data_type == "json":
            return self.raw_data
        elif self.data_type in ["csv", "text"]:
            return self.text_data
        elif self.data_type == "binary":
            return self.binary_data
        return None
    
    def get_stats_summary(self) -> dict:
        """Get statistical summary"""
        if self.stats:
            return self.stats
        
        # Calculate basic stats if data is numeric
        if self.raw_data and isinstance(self.raw_data, list):
            numeric_data = [item for item in self.raw_data if isinstance(item, (int, float))]
            if numeric_data:
                return {
                    "count": len(numeric_data),
                    "mean": sum(numeric_data) / len(numeric_data),
                    "min": min(numeric_data),
                    "max": max(numeric_data),
                    "sum": sum(numeric_data)
                }
        
        return {"count": self.row_count or 0}