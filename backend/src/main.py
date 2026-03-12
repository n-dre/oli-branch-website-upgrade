"""
Main FastAPI application for the Assessment Backend.
"""

import os
import sys
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn
from dotenv import load_dotenv

# Add src to Python path so we can import from services
src_path = os.path.join(os.path.dirname(__file__), 'src')
if src_path not in sys.path:
    sys.path.insert(0, src_path)

# Load environment variables
env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

# Create FastAPI app
app = FastAPI(
    title=os.getenv("APP_NAME", "Assessment Backend"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="A backend API for assessment and evaluation systems",
    docs_url="/docs" if os.getenv("DEBUG", "True").lower() == "true" else None,
    redoc_url="/redoc" if os.getenv("DEBUG", "True").lower() == "true" else None,
)

# Configure CORS - IMPORTANT: Add your frontend URL here
# Get allowed origins from env or use defaults that include your frontend
default_origins = "http://localhost:3000,http://localhost:8000,http://localhost:5173,http://127.0.0.1:5173"
origins = os.getenv("ALLOWED_ORIGINS", default_origins).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=os.getenv("ALLOW_CREDENTIALS", "True").lower() == "true",
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer(auto_error=False)  # Set to False to allow unauthenticated requests in development

# Mount static files if upload folder exists
upload_folder = os.getenv("UPLOAD_FOLDER", "./uploads")
if os.path.exists(upload_folder):
    app.mount("/uploads", StaticFiles(directory=upload_folder), name="uploads")

# Health check endpoint - PUBLIC (no auth required)
@app.get("/")
async def root():
    """Root endpoint returning API information."""
    return {
        "message": "Welcome to Oli-Branch Backend API",
        "version": app.version,
        "docs": "/docs" if app.docs_url else None,
        "health": "/health",
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "service": app.title,
        "version": app.version
    }

# Import and include service-based routers
# CORRECTED: Import from services module directly (since src is in path)
# Assessment service router
try:
    from services.assessment_service import router as assessment_router
    app.include_router(
        assessment_router,
        prefix="/api/v1/assessments",
        tags=["assessments"],
        # Only add dependency if we have security enabled
        dependencies=[Depends(security)] if os.getenv("ENABLE_AUTH", "False").lower() == "true" else []
    )
    print("✓ Assessment service router loaded")
except ImportError as e:
    print(f"⚠ Assessment router not loaded: {e}")
    # Create a placeholder router
    assessment_router = APIRouter()
    
    @assessment_router.get("/")
    async def get_assessments():
        return {"message": "Assessment service is under development", "data": []}
    
    @assessment_router.post("/")
    async def create_assessment():
        return {"message": "Create assessment endpoint placeholder", "id": "placeholder-id"}
    
    app.include_router(assessment_router, prefix="/api/v1/assessments", tags=["assessments"])

# Report service router
try:
    from services.report_service import router as report_router
    app.include_router(
        report_router,
        prefix="/api/v1/reports",
        tags=["reports"],
        dependencies=[Depends(security)] if os.getenv("ENABLE_AUTH", "False").lower() == "true" else []
    )
    print("✓ Report service router loaded")
except ImportError as e:
    print(f"⚠ Report router not loaded: {e}")
    report_router = APIRouter()
    
    @report_router.get("/")
    async def get_reports():
        return {"message": "Report service is under development", "data": []}
    
    @report_router.post("/generate")
    async def generate_report():
        return {"message": "Generate report endpoint placeholder", "report_id": "placeholder"}
    
    app.include_router(report_router, prefix="/api/v1/reports", tags=["reports"])

# AI service router
try:
    from services.ai_service import router as ai_router
    app.include_router(
        ai_router,
        prefix="/api/v1/ai",
        tags=["ai"],
        dependencies=[Depends(security)] if os.getenv("ENABLE_AUTH", "False").lower() == "true" else []
    )
    print("✓ AI service router loaded")
except ImportError as e:
    print(f"⚠ AI router not loaded: {e}")
    ai_router = APIRouter()
    
    @ai_router.get("/")
    async def get_ai_status():
        return {"message": "AI service is under development", "status": "available"}
    
    @ai_router.post("/analyze")
    async def analyze_text():
        return {"message": "AI analysis endpoint placeholder", "analysis": {}}
    
    app.include_router(ai_router, prefix="/api/v1/ai", tags=["ai"])

# Bank/Payment service router
try:
    from services.bank_service import router as bank_router
    app.include_router(
        bank_router,
        prefix="/api/v1/payments",
        tags=["payments"],
        dependencies=[Depends(security)] if os.getenv("ENABLE_AUTH", "False").lower() == "true" else []
    )
    print("✓ Bank/Payment service router loaded")
except ImportError as e:
    print(f"⚠ Bank router not loaded: {e}")
    bank_router = APIRouter()
    
    @bank_router.get("/")
    async def get_payments():
        return {"message": "Payment service is under development", "data": []}
    
    @bank_router.post("/checkout")
    async def create_checkout():
        return {"message": "Create checkout endpoint placeholder", "checkout_url": ""}
    
    app.include_router(bank_router, prefix="/api/v1/payments", tags=["payments"])

# Financial Health endpoints - Add these for your frontend
financial_router = APIRouter(prefix="/api/v1/financial", tags=["financial"])

@financial_router.get("/health-score")
async def get_health_score():
    """Get financial health score data"""
    # This is a placeholder - replace with actual logic
    return {
        "score": 75,
        "metrics": {
            "profitability": 80,
            "efficiency": 80,
            "liquidity": 22,
            "growth": 100
        },
        "status": "success"
    }

@financial_router.post("/analyze")
async def analyze_financial_data(data: dict = {}):
    """Analyze financial data and return insights"""
    # This is a placeholder - replace with actual analysis
    return {
        "score": 75,
        "insights": [
            "Your profitability is strong",
            "Liquidity needs improvement",
            "Growth potential is excellent"
        ],
        "recommendations": [
            "Review cash flow management",
            "Consider optimizing expenses",
            "Explore investment opportunities"
        ]
    }

app.include_router(financial_router)

# Error handlers
@app.exception_handler(404)
async def not_found(request, exc):
    return JSONResponse(
        status_code=404,
        content={"message": "Resource not found", "detail": str(exc)},
    )

@app.exception_handler(500)
async def server_error(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "detail": str(exc)},
    )

# Database initialization
def init_database():
    """Initialize database connection and tables."""
    try:
        # Try to import from database module
        # First check if it's in src/database or somewhere else
        try:
            from database import init_db
        except ImportError:
            try:
                from src.database import init_db
            except ImportError:
                print("⚠ Database module not found")
                return
        
        init_db()
        print("✓ Database initialized")
    except ImportError as e:
        print(f"⚠ Database module not available: {e}")
    except Exception as e:
        print(f"⚠ Database initialization failed: {e}")

# Application startup event
@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    print(f"🚀 Starting {app.title} v{app.version}...")
    print(f"📁 Environment: {os.getenv('ENVIRONMENT', 'development')}")
    print(f"🔧 Debug mode: {os.getenv('DEBUG', 'True')}")
    print(f"📂 Python path: {sys.path}")
    print(f"🔓 CORS allowed origins: {origins}")
    
    # Initialize database
    init_database()
    
    # Create necessary directories
    directories = ["logs", upload_folder]
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✓ Directory ensured: {directory}")
    
    print("✅ Application startup complete")

# Application shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown."""
    print("🛑 Application shutting down...")

# Run the application
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    reload = os.getenv("DEBUG", "True").lower() == "true"
    
    print(f"🌐 Starting server on {host}:{port} (reload={reload})")
    uvicorn.run(
        "src.main:app",  # Changed from "main:app" to "src.main:app"
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )