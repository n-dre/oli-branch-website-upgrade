# backend/src/models/transaction.py
"""
Transaction model
"""

from sqlalchemy import Column, String, Date, DateTime, Numeric, Boolean, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from . import Base

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    bank_account_id = Column(UUID(as_uuid=True), ForeignKey("bank_accounts.id", ondelete="CASCADE"), nullable=False)
    provider_txn_id = Column(String, nullable=False)
    posted_at = Column(Date, nullable=False)
    name = Column(String)
    merchant = Column(String)
    amount = Column(Numeric(14, 2), nullable=False)
    direction = Column(String, nullable=False)
    category = Column(String)
    is_fee = Column(Boolean, default=False)
    fee_type = Column(String)
    raw_data = Column(JSON)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    
    # Relationships
    account = relationship("BankAccount", back_populates="transactions")