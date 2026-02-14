# backend/src/services/analysis_service.py
"""
Main analysis service - Entry point for business analysis
"""

import logging
from typing import Dict, Any
from datetime import datetime

from .ai_orchestrator import AIOrchestrator
from ..database.repositories import AnalysisJobRepository

logger = logging.getLogger(__name__)

class AnalysisService:
    """Main analysis service"""
    
    def __init__(self, db_session, config):
        self.db = db_session
        self.config = config
        self.ai_orchestrator = AIOrchestrator(db_session, config)
        self.job_repo = AnalysisJobRepository(db_session)
    
    async def run_analysis(self, business_id: str, user_id: str) -> Dict[str, Any]:
        """Run complete analysis"""
        logger.info(f"AnalysisService: Starting analysis for business {business_id}")
        
        # Create job record
        job = await self.job_repo.create_job(
            business_id=business_id,
            user_id=user_id,
            status="processing"
        )
        
        try:
            # Run AI orchestration
            result = await self.ai_orchestrator.analyze_business(business_id, user_id)
            
            # Update job
            await self.job_repo.update_job(
                job_id=job.id,
                status="completed",
                result=result
            )
            
            return result
            
        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            
            await self.job_repo.update_job(
                job_id=job.id,
                status="failed",
                error=str(e)
            )
            
            return {"success": False, "error": str(e)}