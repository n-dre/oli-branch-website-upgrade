"""
Bank/Payment Routes

This module contains all API routes related to banking and payments.
"""

import logging
from typing import List, Optional, Dict, Any
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, Query, Body
from pydantic import BaseModel, Field, validator

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/banks", tags=["banks", "payments"])


# ==================== Pydantic Models ====================
class BankAccount(BaseModel):
    """Bank account model"""
    id: str
    bank_name: str
    account_number: str
    account_type: str = Field(..., regex="^(checking|savings|business)$")
    routing_number: Optional[str] = None
    holder_name: str
    is_verified: bool = False
    is_default: bool = False
    created_at: datetime


class PaymentItem(BaseModel):
    """Payment item model"""
    id: str
    name: str
    description: Optional[str]
    amount: float = Field(..., gt=0)
    quantity: int = Field(1, ge=1)
    type: str = Field(..., regex="^(assessment|certificate|report|subscription)$")


class CreatePaymentRequest(BaseModel):
    """Request model for creating payment"""
    items: List[PaymentItem] = Field(..., min_items=1)
    currency: str = Field("USD", regex="^(USD|EUR|GBP|CAD|AUD)$")
    payment_method: str = Field(..., regex="^(credit_card|bank_account|wallet)$")
    save_payment_method: bool = False
    metadata: Optional[Dict[str, Any]] = None


class PaymentResponse(BaseModel):
    """Response model for payment"""
    id: str
    user_id: str
    amount: float
    currency: str
    status: str = Field(..., regex="^(pending|processing|completed|failed|refunded)$")
    payment_method: str
    items: List[Dict[str, Any]]
    metadata: Optional[Dict[str, Any]]
    created_at: datetime
    completed_at: Optional[datetime]


class BankInfo(BaseModel):
    """Bank information model"""
    id: str
    name: str
    code: str
    country: str
    supports_business: bool
    min_deposit: Optional[float]
    features: List[str]
    rating: float = Field(..., ge=0, le=5)


class TransactionResponse(BaseModel):
    """Response model for transaction"""
    id: str
    type: str = Field(..., regex="^(payment|refund|withdrawal|deposit)$")
    amount: float
    currency: str
    status: str
    description: str
    reference_id: Optional[str]
    created_at: datetime


# ==================== Mock Data ====================
mock_banks = [
    {
        "id": "bank_001",
        "name": "Chase Bank",
        "code": "CHASE",
        "country": "US",
        "supports_business": True,
        "min_deposit": 1000.00,
        "features": ["online_banking", "mobile_app", "business_accounts", "international_transfers"],
        "rating": 4.5
    },
    {
        "id": "bank_002",
        "name": "Bank of America",
        "code": "BOFA",
        "country": "US",
        "supports_business": True,
        "min_deposit": 500.00,
        "features": ["online_banking", "mobile_app", "credit_cards", "investment_services"],
        "rating": 4.3
    },
    {
        "id": "bank_003",
        "name": "Wells Fargo",
        "code": "WF",
        "country": "US",
        "supports_business": True,
        "min_deposit": 250.00,
        "features": ["online_banking", "small_business_loans", "merchant_services"],
        "rating": 4.0
    }
]

mock_payments = {}
mock_transactions = {}
next_payment_id = 1
next_transaction_id = 1


# ==================== Route Handlers ====================
@router.get("/", response_model=List[BankInfo])
async def get_banks(
    country: Optional[str] = Query(None, description="Filter by country code"),
    supports_business: Optional[bool] = Query(None, description="Filter by business support"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating")
):
    """
    Get list of supported banks.
    
    Args:
        country: Filter by country code
        supports_business: Filter by business support
        min_rating: Minimum bank rating
    """
    logger.info(f"Getting banks with filters: country={country}, business={supports_business}")
    
    filtered_banks = mock_banks.copy()
    
    # Apply filters
    if country:
        filtered_banks = [b for b in filtered_banks if b["country"].upper() == country.upper()]
    
    if supports_business is not None:
        filtered_banks = [b for b in filtered_banks if b["supports_business"] == supports_business]
    
    if min_rating is not None:
        filtered_banks = [b for b in filtered_banks if b["rating"] >= min_rating]
    
    return filtered_banks


@router.get("/{bank_id}", response_model=BankInfo)
async def get_bank(bank_id: str):
    """
    Get bank details by ID.
    
    Args:
        bank_id: Bank identifier
    """
    logger.info(f"Getting bank: {bank_id}")
    
    for bank in mock_banks:
        if bank["id"] == bank_id:
            return bank
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Bank not found"
    )


@router.post("/payments", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED)
async def create_payment(payment_data: CreatePaymentRequest):
    """
    Create a new payment.
    
    Args:
        payment_data: Payment data
    """
    global next_payment_id
    
    logger.info(f"Creating payment with {len(payment_data.items)} items")
    
    # Calculate total amount
    total_amount = sum(item.amount * item.quantity for item in payment_data.items)
    
    # Validate payment amount
    if total_amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid payment amount"
        )
    
    # Create payment record
    payment_id = f"pay_{next_payment_id:06d}"
    next_payment_id += 1
    
    payment = {
        "id": payment_id,
        "user_id": "user_123",  # Would come from authentication
        "amount": total_amount,
        "currency": payment_data.currency,
        "status": "pending",
        "payment_method": payment_data.payment_method,
        "items": [item.dict() for item in payment_data.items],
        "metadata": payment_data.metadata or {},
        "created_at": datetime.utcnow(),
        "completed_at": None
    }
    
    # Store payment (in real app, save to database)
    mock_payments[payment_id] = payment
    
    # In a real application, this would initiate payment processing
    # with a payment gateway (Stripe, PayPal, etc.)
    
    # Simulate payment processing
    import asyncio
    await asyncio.sleep(1)  # Simulate processing delay
    
    # Update payment status to completed
    payment["status"] = "completed"
    payment["completed_at"] = datetime.utcnow()
    
    # Create transaction record
    global next_transaction_id
    transaction_id = f"txn_{next_transaction_id:06d}"
    next_transaction_id += 1
    
    transaction = {
        "id": transaction_id,
        "type": "payment",
        "amount": total_amount,
        "currency": payment_data.currency,
        "status": "completed",
        "description": f"Payment for {len(payment_data.items)} items",
        "reference_id": payment_id,
        "created_at": datetime.utcnow()
    }
    
    mock_transactions[transaction_id] = transaction
    
    logger.info(f"Payment created: {payment_id}, amount: {total_amount} {payment_data.currency}")
    
    return payment


@router.get("/payments/{payment_id}", response_model=PaymentResponse)
async def get_payment(payment_id: str):
    """
    Get payment details by ID.
    
    Args:
        payment_id: Payment identifier
    """
    logger.info(f"Getting payment: {payment_id}")
    
    payment = mock_payments.get(payment_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    return payment


@router.post("/payments/{payment_id}/refund")
async def refund_payment(
    payment_id: str,
    amount: Optional[float] = Body(None, gt=0),
    reason: Optional[str] = Body(None)
):
    """
    Refund a payment.
    
    Args:
        payment_id: Payment identifier
        amount: Refund amount (partial refund if less than original amount)
        reason: Refund reason
    """
    logger.info(f"Processing refund for payment: {payment_id}")
    
    payment = mock_payments.get(payment_id)
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found"
        )
    
    if payment["status"] != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only completed payments can be refunded"
        )
    
    # Determine refund amount
    refund_amount = amount if amount is not None else payment["amount"]
    
    if refund_amount > payment["amount"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Refund amount cannot exceed original payment amount"
        )
    
    # Update payment status
    if refund_amount == payment["amount"]:
        payment["status"] = "refunded"
    else:
        payment["status"] = "partially_refunded"
    
    # Create refund transaction
    global next_transaction_id
    transaction_id = f"txn_{next_transaction_id:06d}"
    next_transaction_id += 1
    
    transaction = {
        "id": transaction_id,
        "type": "refund",
        "amount": refund_amount,
        "currency": payment["currency"],
        "status": "completed",
        "description": f"Refund for payment {payment_id}" + (f" - {reason}" if reason else ""),
        "reference_id": payment_id,
        "created_at": datetime.utcnow()
    }
    
    mock_transactions[transaction_id] = transaction
    
    logger.info(f"Refund processed: {payment_id}, amount: {refund_amount} {payment['currency']}")
    
    return {
        "payment_id": payment_id,
        "refund_id": transaction_id,
        "amount": refund_amount,
        "currency": payment["currency"],
        "status": "completed",
        "reason": reason
    }


@router.get("/transactions", response_model=List[TransactionResponse])
async def get_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    type: Optional[str] = Query(None, regex="^(payment|refund|withdrawal|deposit)$"),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None)
):
    """
    Get transaction history with filters.
    
    Args:
        skip: Number of items to skip
        limit: Maximum number of items to return
        type: Filter by transaction type
        start_date: Filter by start date
        end_date: Filter by end date
    """
    logger.info(f"Getting transactions: skip={skip}, limit={limit}, type={type}")
    
    # Get user transactions (in real app, filter by user_id from authentication)
    user_transactions = list(mock_transactions.values())
    
    # Apply filters
    if type:
        user_transactions = [t for t in user_transactions if t["type"] == type]
    
    if start_date:
        user_transactions = [t for t in user_transactions if t["created_at"] >= start_date]
    
    if end_date:
        user_transactions = [t for t in user_transactions if t["created_at"] <= end_date]
    
    # Sort by creation date (newest first)
    user_transactions.sort(key=lambda x: x["created_at"], reverse=True)
    
    # Apply pagination
    paginated = user_transactions[skip:skip + limit]
    
    return paginated


@router.get("/transactions/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(transaction_id: str):
    """
    Get transaction details by ID.
    
    Args:
        transaction_id: Transaction identifier
    """
    logger.info(f"Getting transaction: {transaction_id}")
    
    transaction = mock_transactions.get(transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    return transaction


@router.get("/balance")
async def get_balance():
    """
    Get user account balance.
    """
    logger.info("Getting user balance")
    
    # In a real application, calculate balance from transactions
    # For now, return mock data
    return {
        "available_balance": 1500.75,
        "pending_balance": 250.50,
        "currency": "USD",
        "last_updated": datetime.utcnow()
    }


@router.post("/webhooks/stripe")
async def stripe_webhook(
    payload: Dict[str, Any],
    stripe_signature: str = Body(..., embed=True, alias="stripe-signature")
):
    """
    Handle Stripe webhook events.
    
    Args:
        payload: Webhook payload from Stripe
        stripe_signature: Stripe signature for verification
    """
    logger.info("Received Stripe webhook")
    
    # In a real application:
    # 1. Verify webhook signature
    # 2. Parse event type
    # 3. Handle different event types (payment_intent.succeeded, etc.)
    # 4. Update payment status in database
    
    event_type = payload.get("type", "unknown")
    logger.info(f"Stripe webhook event: {event_type}")
    
    # Handle specific event types
    if event_type == "payment_intent.succeeded":
        payment_intent = payload.get("data", {}).get("object", {})
        payment_id = payment_intent.get("metadata", {}).get("payment_id")
        
        if payment_id and payment_id in mock_payments:
            mock_payments[payment_id]["status"] = "completed"
            mock_payments[payment_id]["completed_at"] = datetime.utcnow()
            logger.info(f"Payment {payment_id} marked as completed via webhook")
    
    return {"received": True, "event": event_type}


# Export router
__all__ = ["router"]