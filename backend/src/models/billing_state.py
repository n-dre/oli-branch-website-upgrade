# backend/src/models/billing_state.py
"""
Billing state model for subscription and trial management
"""

# backend/src/models/billing_state.py
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Date, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from . import Base
class BillingState(Base):
    __tablename__ = "billing_state"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    
    # Subscription tier
    tier = Column(String, default="trial")  # trial, basic, premium, enterprise
    
    # Trial information
    trial_started_at = Column(DateTime)
    trial_ends_at = Column(DateTime)
    trial_ended_at = Column(DateTime)
    
    # Feedback gate
    requires_feedback = Column(Boolean, default=False)
    feedback_received_at = Column(DateTime)
    
    # Account status
    active = Column(Boolean, default=False)
    paused = Column(Boolean, default=False)
    pause_started_at = Column(DateTime)
    blocked = Column(Boolean, default=False)
    block_reason = Column(Text)
    block_started_at = Column(DateTime)
    
    # Payment information
    card_fingerprint = Column(String)  # For fraud detection
    stripe_customer_id = Column(String)
    stripe_payment_method_id = Column(String)
    stripe_subscription_id = Column(String)
    next_billing_date = Column(Date)
    
    # Timestamps
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="billing_state")
    
    def __repr__(self):
        status = "active" if self.active else "inactive"
        return f"<BillingState(user_id={self.user_id}, tier={self.tier}, status={status})>"
    
    @property
    def is_trial_active(self) -> bool:
        """Check if trial is active"""
        if not self.trial_started_at or self.trial_ended_at:
            return False
        return datetime.utcnow() <= self.trial_ends_at
    
    @property
    def is_paid_active(self) -> bool:
        """Check if paid subscription is active"""
        return self.active and not self.paused and not self.blocked
    
    @property
    def can_access(self) -> bool:
        """Check if user can access the platform"""
        return not self.blocked and (self.is_trial_active or self.is_paid_active)