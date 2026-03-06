# backend/src/utils/schema_enforcer.py
"""
Schema Enforcer - Enforces JSON schema validation
"""

import json
import logging
from typing import Dict, Any, Optional, Tuple

# Try to import jsonschema, but provide fallback
try:
    import jsonschema
    from jsonschema import validate, ValidationError
    HAS_JSONSCHEMA = True
except ImportError:
    HAS_JSONSCHEMA = False
    logging.warning("jsonschema not installed - using basic validation")

logger = logging.getLogger(__name__)

class SchemaEnforcer:
    """Enforces JSON schema validation for AI responses"""
    
    def __init__(self):
        self.schemas = self._load_schemas()
    
    def _load_schemas(self) -> Dict[str, Dict[str, Any]]:
        """Load validation schemas"""
        return {
            "audit": {
                "type": "object",
                "properties": {
                    "compliance_risk": {"type": "string"},
                    "issues_found": {"type": "array"},
                    "confidence_score": {"type": "number"},
                    "recommendations": {"type": "array"},
                    "requires_follow_up": {"type": "boolean"}
                },
                "required": ["compliance_risk", "issues_found", "requires_follow_up"]
            },
            "leak": {
                "type": "object",
                "properties": {
                    "code": {"type": "string"},
                    "title": {"type": "string"},
                    "monthly_cost": {"type": "number"},
                    "severity": {"type": "string"}
                },
                "required": ["code", "title", "monthly_cost", "severity"]
            }
        }
    
    def enforce_schema(self, data: Dict[str, Any], schema_name: str) -> Tuple[bool, Optional[Dict[str, Any]]]:
        """Enforce schema on data"""
        try:
            schema = self.schemas.get(schema_name)
            if not schema:
                logger.error(f"Schema not found: {schema_name}")
                return False, None
            
            if HAS_JSONSCHEMA:
                validate(instance=data, schema=schema)
            else:
                if not self._basic_validation(data, schema_name):
                    return False, None
            
            logger.info(f"✅ Schema enforcement passed for {schema_name}")
            return True, data
            
        except Exception as e:
            logger.error(f"❌ Schema enforcement failed: {str(e)}")
            return False, None
    
    def _basic_validation(self, data: Dict[str, Any], schema_name: str) -> bool:
        """Basic validation fallback"""
        schema = self.schemas.get(schema_name, {})
        required = schema.get("required", [])
        
        for field in required:
            if field not in data:
                logger.error(f"Missing required field: {field}")
                return False
        
        return True
    
    def validate_field_types(self, data: Dict[str, Any], schema_name: str) -> bool:
        """Validate field types"""
        schema = self.schemas.get(schema_name, {})
        properties = schema.get("properties", {})
        
        for field, field_schema in properties.items():
            if field in data:
                field_type = field_schema.get("type")
                value = data[field]
                
                if field_type == "string" and not isinstance(value, str):
                    logger.error(f"Field {field} should be string, got {type(value)}")
                    return False
                elif field_type == "number" and not isinstance(value, (int, float)):
                    logger.error(f"Field {field} should be number, got {type(value)}")
                    return False
                elif field_type == "boolean" and not isinstance(value, bool):
                    logger.error(f"Field {field} should be boolean, got {type(value)}")
                    return False
                elif field_type == "array" and not isinstance(value, list):
                    logger.error(f"Field {field} should be array, got {type(value)}")
                    return False
        
        return True