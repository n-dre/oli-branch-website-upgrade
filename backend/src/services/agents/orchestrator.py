# services/agents/orchestrator.py
"""Agent orchestrator - runs the agent system"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

from .registry import AgentRegistry

logger = logging.getLogger(__name__)

class AgentOrchestrator:
    """Orchestrates the 61-agent system"""
    
    def __init__(self, db_session, config):
        self.db = db_session
        self.config = config
        self.registry = AgentRegistry()
        self.agent_instances = {}
        
        logger.info(f"Agent orchestrator initialized with {len(self.registry.list_all_agents())} agents")
    
    async def run_analysis_pipeline(self, business_id: str) -> Dict[str, Any]:
        """Run complete analysis pipeline"""
        
        context = {
            "business_id": business_id,
            "analysis_started": datetime.utcnow().isoformat()
        }
        
        # Run agents in sequence
        agent_sequence = [
            "leak_detector",
            "fee_waste_quantifier",
            "subscription_waste",
            "payment_rails_mismatch",
            "account_type_mismatch",
            "liquidity_risk",
            "financial_health_score",
            "mismatch_score",
            "bank_fit_recommender",
            "government_resources",
            "local_resource_finder",
            "learning_path_personalized",
            "operational_fixes",
            "next_actions"
        ]
        
        results = {}
        
        for agent_id in agent_sequence:
            try:
                agent_def = self.registry.get_agent(agent_id)
                if agent_def:
                    logger.info(f"Running agent: {agent_def.name}")
                    
                    # In production, would instantiate and run actual agent
                    # For now, simulate successful run
                    results[agent_id] = {
                        "success": True,
                        "agent_id": agent_id,
                        "outputs": {}
                    }
                    
            except Exception as e:
                logger.error(f"Agent {agent_id} failed: {str(e)}")
                results[agent_id] = {
                    "success": False,
                    "error": str(e)
                }
        
        return {
            "success": True,
            "agent_results": results,
            "context": context
        }
    
    async def trigger_event(self, event: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Trigger an event to relevant agents"""
        
        agents = self.registry.get_agents_by_trigger(event)
        
        if not agents:
            logger.info(f"No agents registered for event: {event}")
            return {"success": True, "agents_run": 0}
        
        results = {}
        
        for agent_def in agents:
            try:
                logger.info(f"Event {event} triggering agent: {agent_def.name}")
                
                # Would run actual agent here
                results[agent_def.id] = {
                    "success": True,
                    "agent_id": agent_def.id,
                    "name": agent_def.name
                }
                
            except Exception as e:
                logger.error(f"Agent {agent_def.id} failed: {str(e)}")
                results[agent_def.id] = {
                    "success": False,
                    "error": str(e)
                }
        
        return {
            "success": True,
            "event": event,
            "agents_run": len(results),
            "results": results
        }
    
    def get_agent_status(self) -> Dict[str, Any]:
        """Get status of all agents"""
        all_agents = self.registry.list_all_agents()
        
        return {
            "total_agents": len(all_agents),
            "categories": self._group_by_category(all_agents),
            "by_category": {
                category: len(self.registry.get_agents_by_category(category))
                for category in set(a.category for a in all_agents)
            }
        }
    
    def _group_by_category(self, agents: List) -> Dict:
        """Group agents by category"""
        grouped = {}
        for agent in agents:
            if agent.category not in grouped:
                grouped[agent.category] = []
            grouped[agent.category].append({
                "id": agent.id,
                "name": agent.name,
                "triggers": agent.triggers
            })
        return grouped