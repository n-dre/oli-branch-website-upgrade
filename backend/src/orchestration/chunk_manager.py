"""
Chunk Manager - Handles intelligent data chunking for AI processing
"""

from typing import List, Dict, Any, Generator
import hashlib
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class ChunkManager:
    """
    Manages intelligent chunking of audit data for optimal AI processing
    """
    
    def __init__(self, max_chunk_size: int = 1000, max_token_estimate: int = 4000):
        self.max_chunk_size = max_chunk_size
        self.max_token_estimate = max_token_estimate
        self.chunking_strategies = {
            'temporal': self._chunk_by_time,
            'categorical': self._chunk_by_category,
            'risk_based': self._chunk_by_risk,
            'hybrid': self._hybrid_chunking
        }
    
    def create_chunks(self, data: List[Dict], strategy: str = 'hybrid') -> List[List[Dict]]:
        """
        Create intelligent chunks from raw data
        
        Args:
            data: Raw audit data
            strategy: Chunking strategy to use
            
        Returns:
            List of data chunks
        """
        if not data:
            return []
        
        # Choose chunking strategy
        chunk_func = self.chunking_strategies.get(strategy, self._hybrid_chunking)
        
        # Apply strategy
        chunks = chunk_func(data)
        
        # Validate chunk sizes
        validated_chunks = []
        for chunk in chunks:
            if self._validate_chunk_size(chunk):
                validated_chunks.append(chunk)
            else:
                # Split oversized chunks
                sub_chunks = self._split_oversized_chunk(chunk)
                validated_chunks.extend(sub_chunks)
        
        # Add metadata to each chunk
        enriched_chunks = []
        for i, chunk in enumerate(validated_chunks):
            enriched_chunks.append(self._enrich_chunk(chunk, i, len(validated_chunks)))
        
        logger.info(f"Created {len(enriched_chunks)} chunks using {strategy} strategy")
        return enriched_chunks
    
    def _hybrid_chunking(self, data: List[Dict]) -> List[List[Dict]]:
        """Hybrid chunking combining multiple strategies"""
        # First, group by high-level categories
        categorized = {}
        for record in data:
            category = self._extract_category(record)
            if category not in categorized:
                categorized[category] = []
            categorized[category].append(record)
        
        # Then apply time-based chunking within categories
        chunks = []
        for category, records in categorized.items():
            if len(records) <= self.max_chunk_size:
                chunks.append(records)
            else:
                # Too many records for one chunk, split by time
                time_chunks = self._chunk_by_time(records)
                chunks.extend(time_chunks)
        
        return chunks
    
    def _chunk_by_time(self, data: List[Dict]) -> List[List[Dict]]:
        """Chunk data by time periods"""
        # Sort by timestamp if available
        sorted_data = sorted(
            data,
            key=lambda x: x.get('timestamp', x.get('created_at', '')),
            reverse=True
        )
        
        chunks = []
        current_chunk = []
        
        for record in sorted_data:
            if len(current_chunk) >= self.max_chunk_size:
                chunks.append(current_chunk)
                current_chunk = []
            
            current_chunk.append(record)
        
        if current_chunk:
            chunks.append(current_chunk)
        
        return chunks
    
    def _chunk_by_category(self, data: List[Dict]) -> List[List[Dict]]:
        """Chunk data by categories"""
        categories = {}
        
        for record in data:
            category = self._extract_category(record)
            if category not in categories:
                categories[category] = []
            categories[category].append(record)
        
        # Convert to list of chunks
        chunks = list(categories.values())
        
        # Merge small chunks
        merged_chunks = []
        current_merge = []
        
        for chunk in chunks:
            if len(current_merge) + len(chunk) <= self.max_chunk_size:
                current_merge.extend(chunk)
            else:
                if current_merge:
                    merged_chunks.append(current_merge)
                current_merge = chunk
        
        if current_merge:
            merged_chunks.append(current_merge)
        
        return merged_chunks
    
    def _chunk_by_risk(self, data: List[Dict]) -> List[List[Dict]]:
        """Chunk data by risk level"""
        risk_levels = {}
        
        for record in data:
            risk = self._extract_risk_level(record)
            if risk not in risk_levels:
                risk_levels[risk] = []
            risk_levels[risk].append(record)
        
        # Prioritize high-risk chunks
        priority_order = ['critical', 'high', 'medium', 'low', 'unknown']
        chunks = []
        
        for risk in priority_order:
            if risk in risk_levels:
                # Split if too large
                records = risk_levels[risk]
                for i in range(0, len(records), self.max_chunk_size):
                    chunks.append(records[i:i + self.max_chunk_size])
        
        return chunks
    
    def _extract_category(self, record: Dict) -> str:
        """Extract category from record"""
        return record.get('category', 
                record.get('department',
                record.get('type', 'general')))
    
    def _extract_risk_level(self, record: Dict) -> str:
        """Extract risk level from record"""
        return record.get('risk_level',
                record.get('severity',
                record.get('priority', 'unknown'))).lower()
    
    def _validate_chunk_size(self, chunk: List[Dict]) -> bool:
        """Validate chunk size"""
        # Check record count
        if len(chunk) > self.max_chunk_size:
            return False
        
        # Estimate token count (rough approximation)
        estimated_tokens = self._estimate_tokens(chunk)
        if estimated_tokens > self.max_token_estimate:
            return False
        
        return True
    
    def _estimate_tokens(self, chunk: List[Dict]) -> int:
        """Estimate token count for chunk"""
        total_text = ''
        for record in chunk:
            total_text += json.dumps(record)
        
        # Rough approximation: 1 token ≈ 4 characters
        return len(total_text) // 4
    
    def _split_oversized_chunk(self, chunk: List[Dict]) -> List[List[Dict]]:
        """Split an oversized chunk into smaller ones"""
        mid_point = len(chunk) // 2
        return [chunk[:mid_point], chunk[mid_point:]]
    
    def _enrich_chunk(self, chunk: List[Dict], index: int, total: int) -> List[Dict]:
        """Add metadata to chunk"""
        # Create chunk fingerprint
        chunk_fingerprint = hashlib.md5(
            json.dumps(chunk, sort_keys=True).encode()
        ).hexdigest()[:8]
        
        # Add chunk metadata as first record
        metadata = {
            '_chunk_metadata': {
                'chunk_id': f"{chunk_fingerprint}_{index}",
                'chunk_index': index,
                'total_chunks': total,
                'record_count': len(chunk),
                'created_at': datetime.utcnow().isoformat(),
                'estimated_tokens': self._estimate_tokens(chunk),
                'strategy_used': 'hybrid'
            }
        }
        
        return [metadata] + chunk
    
    def stream_chunks(self, chunks: List[List[Dict]]) -> Generator:
        """Stream chunks one by one"""
        for i, chunk in enumerate(chunks):
            logger.debug(f"Yielding chunk {i+1}/{len(chunks)}")
            yield {
                'chunk_number': i + 1,
                'total_chunks': len(chunks),
                'data': chunk,
                'metadata': chunk[0].get('_chunk_metadata', {}) if chunk else {}
            }
    
    def get_chunk_statistics(self, chunks: List[List[Dict]]) -> Dict:
        """Get statistics about chunks"""
        if not chunks:
            return {}
        
        total_records = sum(len(chunk) for chunk in chunks)
        
        return {
            'total_chunks': len(chunks),
            'total_records': total_records,
            'avg_records_per_chunk': total_records / len(chunks),
            'min_records_per_chunk': min(len(chunk) for chunk in chunks),
            'max_records_per_chunk': max(len(chunk) for chunk in chunks),
            'estimated_total_tokens': sum(
                self._estimate_tokens(chunk) for chunk in chunks
            )
        }