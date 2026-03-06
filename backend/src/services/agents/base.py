# services/agents/base.py
"""Base agent class"""

from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class BaseAgent(ABC):
    """Base class for all agents"""
    
    def __init__(self, db_session=None, config=None):
        self.db = db_session
        self.config = config or {}
        self.logger = logging.getLogger(f"{__name__}.{self.__class__.__name__}")
    
    @abstractmethod
    def run(self, **kwargs) -> Dict[str, Any]:
        """Execute agent logic"""
        pass
    
    def validate_inputs(self, required: list, inputs: Dict) -> bool:
        """Validate required inputs"""
        missing = [r for r in required if r not in inputs]
        if missing:
            self.logger.warning(f"Missing inputs: {missing}")
            return False
        return True