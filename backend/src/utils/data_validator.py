"""
Data Validator - Validates input data before AI processing
"""

from typing import Dict, List, Any, Optional, Tuple
import re
from datetime import datetime


class DataValidator:
    """Validates and sanitizes audit data before processing"""
    
    def __init__(self):
        self.validation_rules = self._load_rules()
        self.errors = []
        self.warnings = []
    
    def _load_rules(self) -> Dict:
        """Load validation rules"""
        return {
            'max_field_length': 10000,
            'allowed_chars': r'^[a-zA-Z0-9\s\-_.,:;()\[\]{}@#$%&*+=?!\/\\|<>"\']+$',
            'required_fields': ['id', 'created_at', 'source'],
            'field_types': {
                'id': str,
                'created_at': str,
                'updated_at': str,
                'user_id': (str, int),
                'amount': (int, float),
                'status': str,
                'category': str
            }
        }
    
    def validate_record(self, record: Dict) -> Tuple[bool, Dict]:
        """
        Validate a single record
        
        Returns:
            Tuple of (is_valid, validated_record)
        """
        self.errors.clear()
        self.warnings.clear()
        
        # Make a copy to avoid modifying original
        validated = record.copy()
        
        # Check required fields
        for field in self.validation_rules['required_fields']:
            if field not in validated:
                self.errors.append(f"Missing required field: {field}")
        
        # Validate field types
        for field, expected_type in self.validation_rules['field_types'].items():
            if field in validated:
                if not isinstance(validated[field], expected_type):
                    try:
                        # Attempt to convert
                        if expected_type == str:
                            validated[field] = str(validated[field])
                        elif expected_type == int:
                            validated[field] = int(validated[field])
                        elif expected_type == float:
                            validated[field] = float(validated[field])
                    except (ValueError, TypeError):
                        self.errors.append(
                            f"Field {field} has invalid type. Expected {expected_type}"
                        )
        
        # Sanitize string fields
        for field, value in validated.items():
            if isinstance(value, str):
                validated[field] = self._sanitize_string(value)
        
        # Validate date fields
        for field in ['created_at', 'updated_at', 'timestamp']:
            if field in validated:
                validated[field] = self._validate_date(validated[field], field)
        
        # Add validation metadata
        validated['_validation'] = {
            'validated_at': datetime.utcnow().isoformat(),
            'is_valid': len(self.errors) == 0,
            'warnings': self.warnings.copy(),
            'errors': self.errors.copy()
        }
        
        return len(self.errors) == 0, validated
    
    def _sanitize_string(self, value: str) -> str:
        """Sanitize and clean string values"""
        if not value:
            return value
        
        # Remove control characters
        value = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', value)
        
        # Normalize whitespace
        value = ' '.join(value.split())
        
        # Truncate if too long
        max_length = self.validation_rules['max_field_length']
        if len(value) > max_length:
            self.warnings.append(f"String truncated from {len(value)} to {max_length} chars")
            value = value[:max_length]
        
        # Validate allowed characters
        if not re.match(self.validation_rules['allowed_chars'], value):
            self.warnings.append("String contains unexpected characters")
        
        return value
    
    def _validate_date(self, date_str: str, field_name: str) -> str:
        """Validate and normalize date strings"""
        if not date_str:
            return datetime.utcnow().isoformat()
        
        # Try common date formats
        date_formats = [
            '%Y-%m-%d',
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%dT%H:%M:%S',
            '%Y-%m-%dT%H:%M:%S.%fZ',
            '%d/%m/%Y',
            '%m/%d/%Y'
        ]
        
        for fmt in date_formats:
            try:
                dt = datetime.strptime(date_str[:19], fmt)
                return dt.isoformat()
            except (ValueError, TypeError):
                continue
        
        self.warnings.append(f"Could not parse date: {date_str}. Using current time.")
        return datetime.utcnow().isoformat()
    
    def get_errors(self) -> List[str]:
        """Get validation errors"""
        return self.errors.copy()
    
    def get_warnings(self) -> List[str]:
        """Get validation warnings"""
        return self.warnings.copy()