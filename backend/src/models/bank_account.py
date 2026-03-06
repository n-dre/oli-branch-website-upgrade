# backend/src/models/bank_account.py
"""
Bank account model
"""

from sqlalchemy import Column, String, Boolean, Numeric, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from . import Base

class BankAccount(Base):
    __tablename__ = "bank_accounts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bank_connection_id = Column(UUID(as_uuid=True), ForeignKey("bank_connections.id", ondelete="CASCADE"), nullable=False)
    provider_account_id = Column(String, nullable=False)
    name = Column(String)
    official_name = Column(String)
    type = Column(String)
    subtype = Column(String)
    mask = Column(String)
    current_balance = Column(Numeric(14, 2))
    available_balance = Column(Numeric(14, 2))
    currency = Column(String, default="USD")
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    bank_connection = relationship("BankConnection", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="account", cascade="all, delete-orphan")