"""
Validation Layer - Enforces schema compliance and business rules
"""

import json
import jsonschema
from typing import Dict, List, Any, Optional, Tuple
import re
from datetime import datetime


class AuditValidator:
    """Validates audit responses against schemas and business rules"""
    
    def __init__(self, schema: Optional[Dict] = None):
        self.schema = schema or self._get_default_schema()
        self.errors = []
        self.warnings = []
    
    def validate_schema(self, response: Dict) -> bool:
        """Validate response against JSON schema"""
        self.errors.clear()
        
        try:
            jsonschema.validate(instance=response, schema=self.schema)
            return True
        except jsonschema.ValidationError as e:
            self.errors.append(f"Schema validation failed: {str(e)}")
            return False
        except Exception as e:
            self.errors.append(f"Validation error: {str(e)}")
            return False
    
    def apply_business_rules(self, response: Dict) -> Dict:
        """
        Apply business rules to clean and enhance audit response
        
        Args:
            response: Raw audit response
            
        Returns:
            Cleaned and enhanced response
        """
        cleaned = response.copy()
        
        # Ensure issues have unique IDs
        if 'issues_found' in cleaned:
            cleaned['issues_found'] = self._normalize_issues(
                cleaned['issues_found']
            )
        
        # Validate and normalize recommendations
        if 'recommendations' in cleaned:
            cleaned['recommendations'] = self._normalize_recommendations(
                cleaned['recommendations']
            )
        
        # Ensure compliance risk is valid
        if 'compliance_risk' in cleaned:
            cleaned['compliance_risk'] = self._normalize_risk_level(
                cleaned['compliance_risk']
            )
        
        # Calculate confidence score if missing
        if 'confidence_score' not in cleaned:
            cleaned['confidence_score'] = self._calculate_confidence(
                cleaned
            )
        
        # Add validation metadata
        cleaned['_validation'] = {
            'validated_at': datetime.utcnow().isoformat(),
            'has_errors': len(self.errors) > 0,
            'has_warnings': len(self.warnings) > 0,
            'error_count': len(self.errors),
            'warning_count': len(self.warnings)
        }
        
        return cleaned
    
    def _normalize_issues(self, issues: List[Dict]) -> List[Dict]:
        """Normalize and validate issues"""
        normalized = []
        seen_ids = set()
        
        for i, issue in enumerate(issues):
            # Ensure ID exists
            if 'id' not in issue:
                issue['id'] = f"issue_{datetime.utcnow().timestamp()}_{i}"
            
            # Ensure unique ID
            if issue['id'] in seen_ids:
                issue['id'] = f"{issue['id']}_{len(seen_ids)}"
            seen_ids.add(issue['id'])
            
            # Ensure required fields
            if 'title' not in issue:
                issue['title'] = f"Unnamed Issue {i+1}"
            
            if 'severity' not in issue:
                issue['severity'] = self._infer_severity(issue)
            
            # Clean description
            if 'description' in issue:
                issue['description'] = self._clean_text(issue['description'])
            
            normalized.append(issue)
        
        return normalized
    
    def _normalize_recommendations(self, recommendations: List[Dict]) -> List[Dict]:
        """Normalize and validate recommendations"""
        normalized = []
        
        for i, rec in enumerate(recommendations):
            # Ensure action exists
            if 'action' not in rec:
                self.warnings.append(f"Recommendation {i} missing action field")
                continue
            
            # Ensure priority
            if 'priority' not in rec:
                rec['priority'] = self._infer_priority(rec)
            
            # Clean action text
            rec['action'] = self._clean_text(rec['action'])
            
            normalized.append(rec)
        
        return normalized
    
    def _normalize_risk_level(self, risk: str) -> str:
        """Normalize compliance risk level"""
        risk = str(risk).strip().title()
        
        valid_risks = ["Critical", "High", "Medium", "Low", "None"]
        
        # Try to match
        for valid_risk in valid_risks:
            if valid_risk.lower() in risk.lower():
                return valid_risk
        
        # Default to Medium if unclear
        self.warnings.append(f"Unclear risk level: '{risk}', defaulting to 'Medium'")
        return "Medium"
    
    def _calculate_confidence(self, response: Dict) -> float:
        """Calculate confidence score based on response quality"""
        score = 1.0
        
        # Penalize missing fields
        required_fields = self.schema.get('required', [])
        for field in required_fields:
            if field not in response:
                score *= 0.8
        
        # Penalize if issues but no evidence
        issues = response.get('issues_found', [])
        if issues:
            issues_with_evidence = sum(1 for i in issues if i.get('evidence'))
            evidence_ratio = issues_with_evidence / len(issues)
            score *= evidence_ratio
        
        # Penalize if recommendations lack details
        recommendations = response.get('recommendations', [])
        if recommendations:
            detailed_recs = sum(1 for r in recommendations if len(r.get('action', '')) > 20)
            detail_ratio = detailed_recs / len(recommendations)
            score *= detail_ratio
        
        return round(max(0.1, min(1.0, score)), 2)
    
    def _infer_severity(self, issue: Dict) -> str:
        """Infer severity from issue content"""
        text = json.dumps(issue).lower()
        
        severity_keywords = {
            "Critical": ["breach", "violation", "illegal", "unauthorized", "data loss"],
            "High": ["risk", "exposure", "vulnerability", "non-compliance"],
            "Medium": ["concern", "improvement", "suggestion", "consider"],
            "Low": ["optimization", "enhancement", "best practice"]
        }
        
        for severity, keywords in severity_keywords.items():
            if any(keyword in text for keyword in keywords):
                return severity
        
        return "Medium"
    
    def _infer_priority(self, recommendation: Dict) -> str:
        """Infer priority from recommendation content"""
        text = recommendation.get('action', '').lower()
        
        if any(word in text for word in ["immediately", "urgent", "critical", "now"]):
            return "High"
        elif any(word in text for word in ["soon", "upcoming", "next month"]):
            return "Medium"
        else:
            return "Low"
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Ensure proper punctuation
        if text and text[-1] not in '.!?':
            text += '.'
        
        return text
    
    def get_errors(self) -> List[str]:
        """Get validation errors"""
        return self.errors.copy()
    
    def get_warnings(self) -> List[str]:
        """Get validation warnings"""
        return self.warnings.copy()
    
    def _get_default_schema(self) -> Dict:
        """Get default JSON schema"""
        return {
            "type": "object",
            "properties": {
                "compliance_risk": {"type": "string"},
                "issues_found": {"type": "array"},
                "confidence_score": {"type": "number"},
                "requires_follow_up": {"type": "boolean"}
            },
            "required": ["compliance_risk", "issues_found", "requires_follow_up"]
        }