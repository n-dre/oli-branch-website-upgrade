# backend/src/services/ai_orchestrator.py
"""
AI Orchestrator - Coordinates all AI operations
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

from .openai_service import OpenAIService
from .leak_engine import LeakEngine
from .scoring import ScoringEngine
from .agents.orchestrator import AgentOrchestrator
from .agents.registry import AgentRegistry
from ..database.repositories import (
    BusinessRepository,
    TransactionRepository,
    AssessmentRepository
)

logger = logging.getLogger(__name__)

class AIOrchestrator:
    """
    Master orchestrator for all AI operations.
    
    This service coordinates:
    1. OpenAI for natural language
    2. 61 specialized agents for decision-making
    3. Leak detection engine
    4. Scoring engine
    """
    
    def __init__(self, db_session, config):
        self.db = db_session
        self.config = config
        
        # Initialize components
        self.openai = OpenAIService(config)
        self.leak_engine = LeakEngine()
        self.scoring_engine = ScoringEngine()
        self.agent_registry = AgentRegistry()
        self.agent_orchestrator = AgentOrchestrator(db_session, config)
        
        # Repositories
        self.business_repo = BusinessRepository(db_session)
        self.transaction_repo = TransactionRepository(db_session)
        self.assessment_repo = AssessmentRepository(db_session)
        
        logger.info("AI Orchestrator initialized with 61-agent system")
    
    async def analyze_business(self, business_id: str, user_id: str) -> Dict[str, Any]:
        """Complete business analysis"""
        logger.info(f"Starting analysis for business: {business_id}")
        
        try:
            # 1. Fetch business data
            business = await self._fetch_business(business_id)
            if not business:
                return {"success": False, "error": "Business not found"}
            
            # 2. Fetch transactions and assessment
            transactions = await self._fetch_transactions(business_id)
            assessment = await self._fetch_assessment(business_id)
            
            # 3. Build context
            context = await self._build_context(business, transactions, assessment)
            
            # 4. Run leak detection
            leaks = self.leak_engine.detect_leaks(
                txns=transactions,
                assessment=assessment,
                accounts=[]  # Would fetch accounts if available
            )
            context["leaks"] = leaks
            
            # 5. Run scoring
            scores = self.scoring_engine.calculate_scores(context, leaks)
            context["scores"] = scores
            
            # 6. Run agent system
            agent_results = await self.agent_orchestrator.run_analysis_pipeline(business_id)
            context.update(agent_results.get("context", {}))
            
            # 7. Generate AI summaries
            summaries = await self._generate_summaries(business, leaks, scores)
            
            # 8. Build result
            return {
                "success": True,
                "business_id": business_id,
                "financial_health_score": scores.get("financial_health", 0),
                "mismatch_score": scores.get("mismatch", 0),
                "leaks": leaks,
                "recommendations": context.get("recommendations", []),
                "executive_summary": summaries.get("executive", ""),
                "mismatch_explanation": summaries.get("mismatch_explanation", ""),
                "resources": context.get("resources", []),
                "learning_path": context.get("learning_path", [])
            }
            
        except Exception as e:
            logger.error(f"Analysis failed: {str(e)}")
            return {"success": False, "error": str(e)}
    
    async def _fetch_business(self, business_id: str) -> Optional[Dict]:
        """Fetch business data"""
        business = await self.business_repo.get_business(business_id)
        if business:
            return {
                "id": str(business.id),
                "name": getattr(business, 'business_name', 'Unknown'),
                "industry": getattr(business, 'industry', None)
            }
        return None
    
    async def _fetch_transactions(self, business_id: str) -> List[Dict]:
        """Fetch transactions"""
        return await self.transaction_repo.get_business_transactions(business_id)
    
    async def _fetch_assessment(self, business_id: str) -> Dict:
        """Fetch latest assessment"""
        assessment = await self.assessment_repo.get_latest_assessment(business_id)
        return assessment or {}
    
    async def _build_context(self, business: Dict, transactions: List, assessment: Dict) -> Dict:
        """Build analysis context"""
        return {
            "business": business,
            "transactions": transactions,
            "assessment": assessment,
            "analysis_timestamp": datetime.utcnow().isoformat(),
            "transaction_count": len(transactions),
            "total_revenue": sum(t.get("amount", 0) for t in transactions if t.get("direction") == "credit"),
            "total_expenses": sum(t.get("amount", 0) for t in transactions if t.get("direction") == "debit")
        }
    
    async def _generate_summaries(self, business: Dict, leaks: List, scores: Dict) -> Dict:
        """Generate AI summaries"""
        summaries = {}
        
        if self.openai and self.openai.enabled:
            try:
                summaries["executive"] = await self.openai.generate_executive_summary(
                    business=business,
                    leaks=leaks,
                    scores=scores
                )
                
                summaries["mismatch_explanation"] = await self.openai.generate_mismatch_explanation(
                    mismatch_score=scores.get("mismatch", 0),
                    leak_count=len(leaks)
                )
            except Exception as e:
                logger.error(f"Error generating summaries: {str(e)}")
        
        return summaries
    
    def get_agent_status(self) -> Dict:
        """Get status of all 61 agents"""
        return self.agent_orchestrator.get_agent_status() if self.agent_orchestrator else {
            "total_agents": 0,
            "categories": {}
        }