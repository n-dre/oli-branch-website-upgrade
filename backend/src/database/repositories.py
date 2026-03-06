# backend/src/database/repositories.py
"""
Database repositories for Oli-Branch
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc
from datetime import datetime, date, timedelta
import uuid

# Import models from the models package
from ..models import (
    User, UserProfile, Business, Assessment, BankConnection, BankAccount,
    Transaction, AnalysisJob, Report, Leak, Recommendation, Score,
    Feedback, BillingState, AdminAuditLog
)

class BusinessRepository:
    """Repository for business operations"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    async def get_business(self, business_id: str) -> Optional[Business]:
        """Get business by ID"""
        try:
            return self.db.query(Business).filter(Business.id == business_id).first()
        except Exception as e:
            print(f"Error getting business: {e}")
            return None
    
    async def get_business_by_ein(self, ein: str) -> Optional[Business]:
        """Get business by EIN"""
        try:
            return self.db.query(Business).filter(Business.ein == ein).first()
        except Exception as e:
            print(f"Error getting business by EIN: {e}")
            return None
    
    async def create_business(self, user_id: str, business_data: Dict[str, Any]) -> Optional[Business]:
        """Create a new business"""
        try:
            business = Business(
                id=uuid.uuid4(),
                user_id=user_id,
                **business_data
            )
            self.db.add(business)
            self.db.commit()
            self.db.refresh(business)
            return business
        except Exception as e:
            print(f"Error creating business: {e}")
            self.db.rollback()
            return None
    
    async def update_business(self, business_id: str, updates: Dict[str, Any]) -> Optional[Business]:
        """Update business"""
        try:
            business = self.db.query(Business).filter(Business.id == business_id).first()
            if business:
                for key, value in updates.items():
                    if hasattr(business, key):
                        setattr(business, key, value)
                business.updated_at = datetime.utcnow()
                self.db.commit()
                self.db.refresh(business)
            return business
        except Exception as e:
            print(f"Error updating business: {e}")
            self.db.rollback()
            return None

class TransactionRepository:
    """Repository for transaction operations"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    async def get_business_transactions(self, business_id: str, days: int = 90) -> List[Dict[str, Any]]:
        """Get transactions for a business"""
        try:
            cutoff_date = date.today() - timedelta(days=days)
            
            transactions = self.db.query(Transaction).join(
                BankAccount
            ).join(
                BankConnection
            ).filter(
                and_(
                    BankConnection.business_id == business_id,
                    Transaction.posted_at >= cutoff_date
                )
            ).all()
            
            return [
                {
                    'id': str(t.id),
                    'name': t.name,
                    'merchant': t.merchant,
                    'amount': float(t.amount) if t.amount else 0,
                    'direction': t.direction,
                    'category': t.category,
                    'is_fee': t.is_fee,
                    'fee_type': t.fee_type,
                    'posted_at': t.posted_at.isoformat() if t.posted_at else None,
                    'bank_account_id': str(t.bank_account_id) if t.bank_account_id else None
                }
                for t in transactions
            ]
        except Exception as e:
            print(f"Error getting transactions: {e}")
            return []
    
    async def get_business_accounts(self, business_id: str) -> List[Dict[str, Any]]:
        """Get bank accounts for a business"""
        try:
            accounts = self.db.query(BankAccount).join(
                BankConnection
            ).filter(
                BankConnection.business_id == business_id
            ).all()
            
            return [
                {
                    'id': str(a.id),
                    'name': a.name,
                    'type': a.type,
                    'subtype': a.subtype,
                    'current_balance': float(a.current_balance) if a.current_balance else 0,
                    'is_primary': a.is_primary
                }
                for a in accounts
            ]
        except Exception as e:
            print(f"Error getting accounts: {e}")
            return []
    
    async def create_transaction(self, transaction_data: Dict[str, Any]) -> Optional[Transaction]:
        """Create a new transaction"""
        try:
            transaction = Transaction(
                id=uuid.uuid4(),
                **transaction_data
            )
            self.db.add(transaction)
            self.db.commit()
            self.db.refresh(transaction)
            return transaction
        except Exception as e:
            print(f"Error creating transaction: {e}")
            self.db.rollback()
            return None

class AssessmentRepository:
    """Repository for assessment operations"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    async def get_latest_assessment(self, business_id: str) -> Optional[Dict[str, Any]]:
        """Get latest assessment for a business"""
        try:
            assessment = self.db.query(Assessment).filter(
                Assessment.business_id == business_id
            ).order_by(desc(Assessment.submitted_at)).first()
            
            if assessment:
                return {
                    'id': str(assessment.id),
                    'business_id': str(assessment.business_id),
                    'monthly_revenue': float(assessment.monthly_revenue) if assessment.monthly_revenue else 0,
                    'monthly_expenses': float(assessment.monthly_expenses) if assessment.monthly_expenses else 0,
                    'bank_used': assessment.bank_used,
                    'payment_methods': assessment.payment_methods,
                    'services_used': assessment.services_used,
                    'loans_taken': assessment.loans_taken,
                    'primary_goal': assessment.primary_goal
                }
            return None
        except Exception as e:
            print(f"Error getting assessment: {e}")
            return None
    
    async def create_assessment(self, business_id: str, assessment_data: Dict[str, Any]) -> Optional[Assessment]:
        """Create a new assessment"""
        try:
            assessment = Assessment(
                id=uuid.uuid4(),
                business_id=business_id,
                **assessment_data
            )
            self.db.add(assessment)
            self.db.commit()
            self.db.refresh(assessment)
            return assessment
        except Exception as e:
            print(f"Error creating assessment: {e}")
            self.db.rollback()
            return None

class AnalysisJobRepository:
    """Repository for analysis job operations"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    async def create_job(self, business_id: str, user_id: str, status: str = "queued") -> AnalysisJob:
        """Create a new analysis job"""
        try:
            job = AnalysisJob(
                id=uuid.uuid4(),
                business_id=business_id,
                status=status
            )
            self.db.add(job)
            self.db.commit()
            self.db.refresh(job)
            return job
        except Exception as e:
            print(f"Error creating job: {e}")
            self.db.rollback()
            # Return a mock job for now
            return type('Job', (), {'id': 'mock-job-id'})
    
    async def update_job(self, job_id: str, status: str, result: Dict = None, error: str = None):
        """Update job status"""
        try:
            job = self.db.query(AnalysisJob).filter(AnalysisJob.id == job_id).first()
            if job:
                job.status = status
                job.finished_at = datetime.utcnow()
                if result:
                    job.result_summary = result
                if error:
                    job.error_message = error
                self.db.commit()
        except Exception as e:
            print(f"Error updating job: {e}")
            self.db.rollback()
    
    async def get_latest_job(self, business_id: str) -> Optional[AnalysisJob]:
        """Get latest job for a business"""
        try:
            return self.db.query(AnalysisJob).filter(
                AnalysisJob.business_id == business_id
            ).order_by(desc(AnalysisJob.created_at)).first()
        except Exception as e:
            print(f"Error getting latest job: {e}")
            return None

class ReportRepository:
    """Repository for report operations"""
    
    def __init__(self, db_session: Session):
        self.db = db_session
    
    async def get_latest_report(self, business_id: str) -> Optional[Report]:
        """Get latest report for a business"""
        try:
            return self.db.query(Report).filter(
                Report.business_id == business_id,
                Report.is_latest == True
            ).order_by(desc(Report.created_at)).first()
        except Exception as e:
            print(f"Error getting latest report: {e}")
            return None
    
    async def create_report(self, report_data: Dict[str, Any]) -> Report:
        """Create a new report"""
        try:
            # Set any previous reports as not latest
            self.db.query(Report).filter(
                Report.business_id == report_data['business_id'],
                Report.is_latest == True
            ).update({"is_latest": False})
            
            report = Report(
                id=uuid.uuid4(),
                **report_data
            )
            self.db.add(report)
            self.db.commit()
            self.db.refresh(report)
            return report
        except Exception as e:
            print(f"Error creating report: {e}")
            self.db.rollback()
            # Return a mock report for now
            return type('Report', (), {'id': 'mock-report-id'})
    
    async def create_leak(self, leak_data: Dict[str, Any]) -> Optional[Leak]:
        """Create a new leak record"""
        try:
            leak = Leak(
                id=uuid.uuid4(),
                **leak_data
            )
            self.db.add(leak)
            self.db.commit()
            self.db.refresh(leak)
            return leak
        except Exception as e:
            print(f"Error creating leak: {e}")
            self.db.rollback()
            return None
    
    async def create_recommendation(self, rec_data: Dict[str, Any]) -> Optional[Recommendation]:
        """Create a new recommendation"""
        try:
            rec = Recommendation(
                id=uuid.uuid4(),
                **rec_data
            )
            self.db.add(rec)
            self.db.commit()
            self.db.refresh(rec)
            return rec
        except Exception as e:
            print(f"Error creating recommendation: {e}")
            self.db.rollback()
            return None
    
    async def create_score(self, score_data: Dict[str, Any]) -> Optional[Score]:
        """Create a new score record"""
        try:
            score = Score(
                id=uuid.uuid4(),
                **score_data
            )
            self.db.add(score)
            self.db.commit()
            self.db.refresh(score)
            return score
        except Exception as e:
            print(f"Error creating score: {e}")
            self.db.rollback()
            return None