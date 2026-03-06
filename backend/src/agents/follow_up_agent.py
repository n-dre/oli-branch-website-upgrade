"""
Follow-up Agent - Handles deep-dive investigations and follow-up audits
"""

from typing import Dict, List, Any, Optional
import json
from datetime import datetime, timedelta
from ..orchestration.ai_orchestrator import AIAuditOrchestrator
from ..orchestration.validation_layer import AuditValidator


class FollowUpAgent:
    """
    Specialized agent for conducting follow-up investigations
    on previously identified issues
    """
    
    def __init__(self, orchestrator: AIAuditOrchestrator):
        self.orchestrator = orchestrator
        self.validator = AuditValidator()
        self.follow_up_history = []
    
    def investigate_issues(self, audit_report: Dict) -> Dict:
        """
        Perform deep-dive investigation on identified issues
        
        Args:
            audit_report: Previous audit report
            
        Returns:
            Enhanced report with root cause analysis
        """
        issues = audit_report.get('issues_found', [])
        
        if not issues:
            return {
                'message': 'No issues to investigate',
                'original_report': audit_report
            }
        
        # Group issues by category for investigation
        categorized = self._categorize_for_investigation(issues)
        
        investigation_results = []
        for category, category_issues in categorized.items():
            result = self._investigate_category(category, category_issues)
            investigation_results.append(result)
        
        # Merge with original report
        enhanced_report = self._enhance_audit_report(audit_report, investigation_results)
        
        # Store in history
        self.follow_up_history.append({
            'timestamp': datetime.utcnow().isoformat(),
            'original_audit_id': audit_report.get('audit_id'),
            'issues_investigated': len(issues),
            'findings': investigation_results
        })
        
        return enhanced_report
    
    def _categorize_for_investigation(self, issues: List[Dict]) -> Dict[str, List[Dict]]:
        """Categorize issues for systematic investigation"""
        categories = {}
        
        for issue in issues:
            # Determine investigation category
            category = self._determine_investigation_category(issue)
            
            if category not in categories:
                categories[category] = []
            
            categories[category].append(issue)
        
        return categories
    
    def _determine_investigation_category(self, issue: Dict) -> str:
        """Determine which type of investigation is needed"""
        title = issue.get('title', '').lower()
        description = issue.get('description', '').lower()
        
        combined_text = f"{title} {description}"
        
        if any(word in combined_text for word in ['access', 'authentication', 'password', 'login']):
            return 'access_control'
        elif any(word in combined_text for word in ['data', 'privacy', 'pii', 'gdpr']):
            return 'data_privacy'
        elif any(word in combined_text for word in ['financial', 'payment', 'transaction', 'fraud']):
            return 'financial'
        elif any(word in combined_text for word in ['system', 'infrastructure', 'network', 'security']):
            return 'infrastructure'
        elif any(word in combined_text for word in ['process', 'workflow', 'policy', 'procedure']):
            return 'process'
        else:
            return 'general'
    
    def _investigate_category(self, category: str, issues: List[Dict]) -> Dict:
        """
        Perform targeted investigation for a category of issues
        
        Args:
            category: Category of issues to investigate
            issues: List of issues in this category
            
        Returns:
            Investigation findings
        """
        investigation_prompt = f"""
        Conduct a deep-dive investigation into the following {category} issues:
        {json.dumps(issues, indent=2)}
        
        Please analyze:
        1. Root cause analysis for each issue
        2. Interdependencies between issues
        3. Systemic patterns
        4. Business impact quantification
        5. Historical context if applicable
        6. Industry benchmarks
        
        Provide specific, actionable insights with evidence.
        """
        
        response = self.orchestrator._call_ai_with_retry(
            system_prompt="You are an expert forensic auditor.",
            user_content=investigation_prompt
        )
        
        parsed_response = self.orchestrator._parse_ai_response(response)
        
        return {
            'category': category,
            'investigation_timestamp': datetime.utcnow().isoformat(),
            'issues_investigated': issues,
            'findings': parsed_response,
            'root_causes': self._extract_root_causes(parsed_response),
            'impact_analysis': self._extract_impact_analysis(parsed_response),
            'recommendations': parsed_response.get('recommendations', [])
        }
    
    def _extract_root_causes(self, findings: Dict) -> List[str]:
        """Extract root causes from investigation findings"""
        root_causes = []
        
        # Parse findings for root cause statements
        if isinstance(findings, dict):
            text = json.dumps(findings).lower()
            
            # Look for root cause indicators
            lines = text.split('.')
            for line in lines:
                if any(phrase in line for phrase in ['root cause', 'underlying cause', 'fundamental issue']):
                    root_causes.append(line.strip())
        
        return root_causes[:5]  # Limit to top 5
    
    def _extract_impact_analysis(self, findings: Dict) -> Dict:
        """Extract business impact analysis"""
        impact = {
            'financial': None,
            'reputational': None,
            'operational': None,
            'compliance': None,
            'strategic': None
        }
        
        # Parse findings for impact statements
        if isinstance(findings, dict):
            text = json.dumps(findings).lower()
            
            if 'financial' in text or 'cost' in text or 'loss' in text:
                impact['financial'] = 'Significant'
            if 'reputation' in text or 'brand' in text or 'trust' in text:
                impact['reputational'] = 'High'
            if 'operation' in text or 'efficiency' in text or 'productivity' in text:
                impact['operational'] = 'Moderate'
            if 'compliance' in text or 'regulation' in text or 'legal' in text:
                impact['compliance'] = 'Severe'
            if 'strategy' in text or 'long-term' in text or 'future' in text:
                impact['strategic'] = 'Medium'
        
        return impact
    
    def _enhance_audit_report(self, original: Dict, investigations: List[Dict]) -> Dict:
        """Enhance original report with investigation findings"""
        enhanced = original.copy()
        
        # Add investigation section
        enhanced['investigation'] = {
            'conducted_at': datetime.utcnow().isoformat(),
            'categories_investigated': [inv['category'] for inv in investigations],
            'findings': investigations,
            'summary': self._create_investigation_summary(investigations)
        }
        
        # Update recommendations with deeper insights
        enhanced['recommendations'] = self._merge_recommendations(
            original.get('recommendations', []),
            investigations
        )
        
        # Update follow-up flag
        enhanced['requires_follow_up'] = self._determine_additional_follow_up(investigations)
        
        return enhanced
    
    def _create_investigation_summary(self, investigations: List[Dict]) -> Dict:
        """Create summary of investigation findings"""
        return {
            'total_categories': len(investigations),
            'root_causes_identified': sum(
                len(inv.get('root_causes', [])) for inv in investigations
            ),
            'critical_findings': sum(
                1 for inv in investigations 
                if 'critical' in json.dumps(inv.get('findings', {})).lower()
            ),
            'requires_action': any(
                inv.get('recommendations') for inv in investigations
            )
        }
    
    def _merge_recommendations(self, original_recs: List[Dict], investigations: List[Dict]) -> List[Dict]:
        """Merge original and investigation recommendations"""
        all_recs = list(original_recs)
        
        for inv in investigations:
            inv_recs = inv.get('recommendations', [])
            
            # Add category context
            for rec in inv_recs:
                rec['category'] = inv['category']
                rec['investigation_driven'] = True
                all_recs.append(rec)
        
        # Remove duplicates (based on action)
        unique_recs = {}
        for rec in all_recs:
            key = rec.get('action', rec.get('recommendation', ''))[:100]
            if key not in unique_recs:
                unique_recs[key] = rec
        
        return list(unique_recs.values())
    
    def _determine_additional_follow_up(self, investigations: List[Dict]) -> bool:
        """Determine if additional follow-up is needed"""
        for inv in investigations:
            findings = inv.get('findings', {})
            
            # Check for indicators that need more investigation
            if isinstance(findings, dict):
                if findings.get('requires_follow_up'):
                    return True
                
                # Check for unresolved issues
                text = json.dumps(findings).lower()
                if any(phrase in text for phrase in ['unclear', 'unknown', 'further', 'additional']):
                    return True
        
        return False
    
    def schedule_follow_up(self, audit_id: str, days_offset: int = 30) -> Dict:
        """Schedule a future follow-up audit"""
        return {
            'audit_id': audit_id,
            'follow_up_id': f"follow_up_{audit_id}_{datetime.utcnow().timestamp()}",
            'scheduled_for': (datetime.utcnow() + timedelta(days=days_offset)).isoformat(),
            'status': 'scheduled',
            'investigation_areas': self._determine_investigation_areas(audit_id)
        }
    
    def _determine_investigation_areas(self, audit_id: str) -> List[str]:
        """Determine areas to focus on in future follow-up"""
        # Find audit in history
        for entry in self.follow_up_history:
            if entry.get('original_audit_id') == audit_id:
                # Return categories that need more investigation
                return list(set(
                    inv['category'] for inv in entry.get('findings', [])
                    if self._determine_additional_follow_up([inv])
                ))
        
        return ['general']