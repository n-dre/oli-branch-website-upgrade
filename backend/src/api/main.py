# backend/src/api/main.py
"""
Oli-Branch API - The Brain's Interface
Clean, secure, and powerful endpoints
"""

from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
import logging

from core.security import ZeroTrustSecurity
from services.financial_engine import FinancialEngine
from services.leak_engine import LeakDetectionEngine
from services.recommendation_engine import RecommendationEngine
from database.database import get_db, SessionLocal

# Initialize
app = FastAPI(
    title="Oli-Branch Brain API",
    description="Agentic Financial Control System for Small Businesses",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") == "development" else None,
    redoc_url=None
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.oli-branch.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
zero_trust = ZeroTrustSecurity()

# Services
financial_engine = FinancialEngine()
leak_engine = LeakDetectionEngine()
recommendation_engine = RecommendationEngine(ai_service=None)  # Will be initialized

# Dependency
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Zero-trust user authentication"""
    try:
        payload = zero_trust.verify_access_token(credentials.credentials)
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/")
async def root():
    """API Root"""
    return {
        "message": "Oli-Branch Brain API",
        "version": "1.0.0",
        "status": "operational",
        "security": "zero-trust"
    }

@app.get("/health")
async def health_check():
    """System health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "components": {
            "database": "connected",
            "security": "active",
            "ai_services": "available"
        }
    }

# Auth endpoints
@app.post("/v1/auth/register")
async def register_user(user_data: dict):
    """Register new user with zero-trust validation"""
    # Validate EIN uniqueness for fraud prevention
    # Implement your registration logic
    pass

@app.post("/v1/auth/login")
async def login_user(login_data: dict):
    """Login with MFA support"""
    # Implement zero-trust login
    pass

# Business endpoints
@app.post("/v1/businesses")
async def create_business(business_data: dict, 
                         current_user: dict = Depends(get_current_user)):
    """Create business with fraud detection"""
    # Validate EIN
    # Check for duplicates
    # Set fraud score
    pass

# Assessment endpoints
@app.post("/v1/businesses/{business_id}/assessments")
async def submit_assessment(business_id: str, assessment_data: dict,
                           current_user: dict = Depends(get_current_user)):
    """Submit financial assessment"""
    # Store assessment
    # Trigger initial analysis
    pass

# Bank endpoints
@app.post("/v1/businesses/{business_id}/bank/link")
async def link_bank_account(business_id: str, link_data: dict,
                           current_user: dict = Depends(get_current_user)):
    """Link bank account via Plaid"""
    # Generate Plaid link token
    # Store encrypted access token
    # Trigger initial sync
    pass

# Analysis endpoints
@app.post("/v1/businesses/{business_id}/analyze")
async def trigger_analysis(business_id: str, background_tasks: BackgroundTasks,
                          current_user: dict = Depends(get_current_user)):
    """Trigger comprehensive financial analysis"""
    
    # This would:
    # 1. Fetch latest transactions
    # 2. Run financial engine
    # 3. Run leak detection
    # 4. Generate recommendations
    # 5. Create report
    
    background_tasks.add_task(
        run_comprehensive_analysis,
        business_id=business_id,
        user_id=current_user.get("sub")
    )
    
    return {"message": "Analysis started", "job_id": "generated_id"}

# Report endpoints
@app.get("/v1/businesses/{business_id}/reports/latest")
async def get_latest_report(business_id: str,
                           current_user: dict = Depends(get_current_user)):
    """Get latest financial report"""
    
    db = SessionLocal()
    try:
        report = db.query(Report).filter(
            Report.business_id == business_id,
            Report.is_latest == True
        ).first()
        
        if not report:
            raise HTTPException(status_code=404, detail="No report found")
        
        # Decrypt AI-generated content
        decrypted_summary = zero_trust.decrypt_sensitive_data(
            report.executive_summary_enc.encode()
        ) if report.executive_summary_enc else ""
        
        # Get leaks and recommendations
        leaks = db.query(Leak).filter(Leak.report_id == report.id).all()
        recommendations = db.query(Recommendation).filter(
            Recommendation.report_id == report.id
        ).all()
        scores = db.query(Score).filter(Score.report_id == report.id).all()
        
        return {
            "report": {
                "id": report.id,
                "period_start": report.period_start,
                "period_end": report.period_end,
                "scores": {
                    "financial_health": report.financial_health_score,
                    "mismatch": report.mismatch_score,
                    "leak": report.leak_score
                },
                "risk_label": report.risk_label,
                "health_label": report.health_label,
                "executive_summary": decrypted_summary,
                "total_monthly_leaks": float(report.total_monthly_leaks),
                "total_annual_leaks": float(report.total_annual_leaks)
            },
            "leaks": [
                {
                    "title": leak.title,
                    "monthly_cost": float(leak.monthly_cost),
                    "annual_cost": float(leak.annual_cost),
                    "severity": leak.severity,
                    "priority": leak.priority
                }
                for leak in leaks
            ],
            "recommendations": [
                {
                    "type": rec.type,
                    "title": rec.title,
                    "expected_savings_monthly": float(rec.expected_savings_monthly),
                    "implementation_effort": rec.implementation_effort,
                    "priority": rec.priority
                }
                for rec in recommendations
            ],
            "detailed_scores": [
                {
                    "type": score.score_type,
                    "value": score.value,
                    "components": score.components
                }
                for score in scores
            ]
        }
        
    finally:
        db.close()

async def run_comprehensive_analysis(business_id: str, user_id: str):
    """Background task for comprehensive analysis"""
    db = SessionLocal()
    try:
        logger.info(f"Starting comprehensive analysis for business {business_id}")
        
        # 1. Fetch data
        transactions = fetch_transactions(business_id, db)
        assessment = fetch_latest_assessment(business_id, db)
        bank_accounts = fetch_bank_accounts(business_id, db)
        
        # 2. Run financial analysis
        financial_analysis = financial_engine.analyze_business_health(
            transactions, assessment, bank_accounts
        )
        
        # 3. Detect leaks
        leaks = leak_engine.analyze(
            transactions, assessment, bank_accounts
        )
        
        # 4. Generate recommendations
        business_profile = fetch_business_profile(business_id, db)
        recommendations = recommendation_engine.generate_recommendations(
            financial_analysis.__dict__,
            [l.__dict__ for l in leaks],
            assessment,
            business_profile
        )
        
        # 5. Generate AI summary
        ai_summary = generate_ai_summary(
            financial_analysis, leaks, recommendations
        )
        
        # 6. Create report
        report = create_report(
            business_id, assessment, financial_analysis, 
            leaks, recommendations, ai_summary, db
        )
        
        # 7. Update monitoring schedule
        schedule_next_monitoring(business_id, report.id, db)
        
        logger.info(f"Analysis complete for business {business_id}. Report: {report.id}")
        
    except Exception as e:
        logger.error(f"Analysis failed for business {business_id}: {str(e)}")
        # Send alert via n8n
        send_analysis_failure_alert(business_id, user_id, str(e))
    finally:
        db.close()

# Helper functions
def fetch_transactions(business_id: str, db) -> List[Dict]:
    """Fetch transactions for analysis"""
    # Implementation
    return []

def fetch_latest_assessment(business_id: str, db):
    """Fetch latest assessment"""
    # Implementation
    return {}

def generate_ai_summary(financial_analysis, leaks, recommendations) -> str:
    """Generate AI-powered executive summary"""
    # Call OpenAI API
    return "AI-generated summary of financial health and recommendations"

def send_analysis_failure_alert(business_id: str, user_id: str, error: str):
    """Send alert via n8n workflow"""
    # Trigger n8n webhook
    pass