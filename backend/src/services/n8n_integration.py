# backend/src/services/n8n_integration.py
"""
n8n workflow integration
Orchestrates automation without being the brain
"""

import requests
import json
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class N8NOrchestrator:
    """
    Orchestrates workflows via n8n
    Handles timing and triggering, not intelligence
    """
    
    def __init__(self, n8n_webhook_url: str):
        self.n8n_webhook_url = n8n_webhook_url
    
    def trigger_bank_sync(self, business_id: str, bank_connection_id: str):
        """Trigger bank transaction sync"""
        payload = {
            "event": "bank_sync",
            "business_id": business_id,
            "bank_connection_id": bank_connection_id,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return self._trigger_workflow("bank-sync", payload)
    
    def trigger_analysis(self, business_id: str):
        """Trigger scheduled analysis"""
        payload = {
            "event": "scheduled_analysis",
            "business_id": business_id,
            "frequency": "weekly",
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return self._trigger_workflow("scheduled-analysis", payload)
    
    def trigger_report_generation(self, business_id: str, report_id: str):
        """Trigger report generation and notification"""
        payload = {
            "event": "report_generated",
            "business_id": business_id,
            "report_id": report_id,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return self._trigger_workflow("report-notification", payload)
    
    def trigger_alert(self, business_id: str, alert_type: str, 
                     data: Dict[str, Any]):
        """Trigger alert workflow"""
        payload = {
            "event": "alert",
            "business_id": business_id,
            "alert_type": alert_type,
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return self._trigger_workflow("alerts", payload)
    
    def trigger_learning_assignment(self, business_id: str, 
                                   learning_modules: List[str]):
        """Trigger learning assignment workflow"""
        payload = {
            "event": "learning_assignment",
            "business_id": business_id,
            "modules": learning_modules,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return self._trigger_workflow("learning-assignment", payload)
    
    def _trigger_workflow(self, workflow_name: str, payload: Dict[str, Any]) -> bool:
        """Trigger n8n webhook workflow"""
        try:
            response = requests.post(
                f"{self.n8n_webhook_url}/{workflow_name}",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                logger.info(f"Triggered n8n workflow: {workflow_name}")
                return True
            else:
                logger.error(f"Failed to trigger {workflow_name}: {response.text}")
                return False
                
        except Exception as e:
            logger.error(f"Error triggering n8n workflow {workflow_name}: {str(e)}")
            return False