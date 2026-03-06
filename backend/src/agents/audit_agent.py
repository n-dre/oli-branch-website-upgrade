"""
Audit Agent - Primary AI agent for compliance auditing
"""

from typing import Dict, List, Any, Optional
import json
from datetime import datetime
from ..orchestration.ai_orchestrator import AIAuditOrchestrator
from ..orchestration.chunk_manager import ChunkManager


class AuditAgent:
    """
    Primary AI agent responsible for compliance auditing
    """
    
    def __init__(self, model_config: Optional[Dict] = None):
        self.model_config = model_config or {}
        self.orchestrator = None
        self.chunk_manager = ChunkManager()
        self.audit_history = []
        
        # Configure AI model parameters
        self.model_params = {
            'temperature': 0.1,  # Low for consistent outputs
            'max_tokens': 2000,
            'top_p': 0.9,
            'frequency_penalty': 0.1,
            'presence_penalty': 0.1
        }
        self.model_params.update(self.model_config)
    
    def initialize_for_client(self, client_id: str) -> None:
        """Initialize agent for specific client"""
        self.orchestrator = AIAuditOrchestrator(client_id)
    
    async def perform_audit(self, audit_data: List[Dict]) -> Dict:
        """
        Perform comprehensive audit on provided data
        
        Args:
            audit_data: Raw audit data to analyze
            
        Returns:
            Complete audit report
        """
        if not self.orchestrator:
            raise ValueError("Agent not initialized. Call initialize_for_client first.")
        
        # Step 1: Prepare data chunks
        chunks = self.chunk_manager.create_chunks(audit_data)
        
        # Step 2: Execute audit on each chunk
        audit_results = await self._audit_chunks(chunks)
        
        # Step 3: Synthesize results
        final_report = self._synthesize_report(audit_results)
        
        # Step 4: Add recommendations
        final_report['recommendations'] = self._generate_recommendations(audit_results)
        
        # Step 5: Store in history
        self.audit_history.append({
            'timestamp': datetime.utcnow().isoformat(),
            'report_summary': final_report['summary'],
            'issue_count': len(final_report['issues_found'])
        })
        
        return final_report
    
    async def _audit_chunks(self, chunks: List[List[Dict]]) -> List[Dict]:
        """Process each chunk through the orchestrator"""
        results = []
        
        for chunk in chunks:
            chunk_result = self.orchestrator.execute_agentic_audit([chunk])
            results.append(chunk_result)
        
        return results
    
    def _synthesize_report(self, chunk_results: List[Dict]) -> Dict:
        """Synthesize individual chunk results into comprehensive report"""
        if not chunk_results:
            return self._create_empty_report()
        
        # Aggregate all issues
        all_issues = []
        all_recommendations = []
        
        for result in chunk_results:
            all_issues.extend(result.get('issues_found', []))
            all_recommendations.extend(result.get('recommendations', []))
        
        # Categorize issues by severity
        categorized_issues = {
            'critical': [],
            'high': [],
            'medium': [],
            'low': []
        }
        
        for issue in all_issues:
            severity = issue.get('severity', 'medium').lower()
            if severity in categorized_issues:
                categorized_issues[severity].append(issue)
        
        # Generate summary
        summary = {
            'total_issues': len(all_issues),
            'critical_count': len(categorized_issues['critical']),
            'high_count': len(categorized_issues['high']),
            'medium_count': len(categorized_issues['medium']),
            'low_count': len(categorized_issues['low']),
            'overall_risk': self._calculate_overall_risk(categorized_issues)
        }
        
        return {
            'audit_id': f"audit_{datetime.utcnow().timestamp()}",
            'timestamp': datetime.utcnow().isoformat(),
            'summary': summary,
            'issues_found': all_issues,
            'categorized_issues': categorized_issues,
            'recommendations': all_recommendations,
            'requires_follow_up': any(r.get('requires_follow_up') for r in chunk_results),
            'metadata': {
                'chunks_processed': len(chunk_results),
                'audit_duration': 'complete',
                'agent_version': '1.0.0'
            }
        }
    
    def _generate_recommendations(self, audit_results: List[Dict]) -> List[Dict]:
        """Generate prioritized recommendations"""
        all_recommendations = []
        
        for result in audit_results:
            recommendations = result.get('recommendations', [])
            all_recommendations.extend(recommendations)
        
        # Sort by priority
        priority_weight = {'critical': 4, 'high': 3, 'medium': 2, 'low': 1}
        
        sorted_recommendations = sorted(
            all_recommendations,
            key=lambda x: priority_weight.get(x.get('priority', 'medium').lower(), 0),
            reverse=True
        )
        
        return sorted_recommendations
    
    def _calculate_overall_risk(self, categorized_issues: Dict) -> str:
        """Calculate overall risk level"""
        if categorized_issues['critical']:
            return 'Critical'
        elif categorized_issues['high']:
            return 'High'
        elif categorized_issues['medium']:
            return 'Medium'
        elif categorized_issues['low']:
            return 'Low'
        else:
            return 'None'
    
    def _create_empty_report(self) -> Dict:
        """Create empty audit report"""
        return {
            'audit_id': f"audit_{datetime.utcnow().timestamp()}",
            'timestamp': datetime.utcnow().isoformat(),
            'summary': {
                'total_issues': 0,
                'critical_count': 0,
                'high_count': 0,
                'medium_count': 0,
                'low_count': 0,
                'overall_risk': 'None'
            },
            'issues_found': [],
            'categorized_issues': {
                'critical': [], 'high': [], 'medium': [], 'low': []
            },
            'recommendations': [],
            'requires_follow_up': False,
            'metadata': {
                'chunks_processed': 0,
                'audit_duration': 'complete',
                'agent_version': '1.0.0'
            }
        }