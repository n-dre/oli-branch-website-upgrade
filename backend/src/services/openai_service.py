# backend/src/services/openai_service.py
"""
OpenAI integration service for Oli-Branch
"""

import logging
from typing import Dict, Any, Optional, List
import openai
import os

logger = logging.getLogger(__name__)

class OpenAIService:
    """OpenAI service for natural language generation"""
    
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.api_key = self.config.get("openai_api_key") or os.getenv("OPENAI_API_KEY")
        self.enabled = bool(self.api_key)
        
        if self.enabled:
            openai.api_key = self.api_key
            logger.info("OpenAI service initialized")
        else:
            logger.warning("OpenAI API key not configured - AI summaries disabled")
    
    async def generate_executive_summary(self, business: Dict, leaks: List, scores: Dict) -> Optional[str]:
        """Generate executive summary using OpenAI"""
        if not self.enabled:
            return self._generate_fallback_summary(business, leaks, scores)
        
        try:
            # Format leaks for prompt
            leaks_text = self._format_leaks_for_prompt(leaks[:3])
            
            prompt = f"""
            Business: {business.get('name', 'Unknown')}
            Industry: {business.get('industry', 'Not specified')}
            
            Financial Health Score: {scores.get('financial_health', 0)}/100
            Mismatch Score: {scores.get('mismatch', 0)}/100
            
            Top Issues Found:
            {leaks_text}
            
            Please provide a 2-3 paragraph executive summary highlighting:
            1. Overall financial health
            2. Key issues found
            3. Most important recommendations
            4. Next steps for the business owner
            
            Tone: Professional, supportive, and actionable.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",  # Using 3.5 for cost efficiency
                messages=[
                    {"role": "system", "content": "You are Oli, a helpful financial advisor for small businesses. Provide clear, actionable advice."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return self._generate_fallback_summary(business, leaks, scores)
    
    async def generate_mismatch_explanation(self, mismatch_score: int, leak_count: int) -> Optional[str]:
        """Generate explanation for mismatch score"""
        if not self.enabled:
            return self._generate_fallback_mismatch_explanation(mismatch_score, leak_count)
        
        try:
            prompt = f"""
            Mismatch Score: {mismatch_score}/100
            Leaks Found: {leak_count}
            
            Explain in simple terms what this score means for the business owner.
            Focus on:
            1. What a mismatch score represents
            2. What this specific score indicates
            3. Why it matters for their business
            4. General next steps to improve
            
            Keep it to 2-3 sentences, conversational but professional.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=200,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return self._generate_fallback_mismatch_explanation(mismatch_score, leak_count)
    
    async def generate_recommendation_text(self, leaks: List[Dict]) -> Optional[str]:
        """Generate personalized recommendation text"""
        if not self.enabled or not leaks:
            return "Review your financial leaks and consider implementing the suggested fixes."
        
        try:
            # Format top leak for prompt
            top_leak = leaks[0] if leaks else {}
            leak_text = f"{top_leak.get('title', 'Unknown issue')} - ${top_leak.get('monthly_cost', 0):.2f}/month"
            
            prompt = f"""
            Based on this top financial issue found:
            {leak_text}
            
            Provide a brief, actionable recommendation (2-3 sentences) that:
            1. Acknowledges the issue
            2. Suggests a concrete next step
            3. Mentions potential savings
            
            Keep it encouraging and specific.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=150,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return f"Consider addressing {leaks[0].get('title', 'financial leaks')} to save money."
    
    def _format_leaks_for_prompt(self, leaks: List[Dict]) -> str:
        """Format leaks for inclusion in prompts"""
        if not leaks:
            return "No significant issues found"
        
        lines = []
        for leak in leaks:
            title = leak.get('title', 'Unknown issue')
            cost = leak.get('monthly_cost', 0)
            lines.append(f"- {title}: ${cost:.2f}/month")
        
        return "\n".join(lines)
    
    def _generate_fallback_summary(self, business: Dict, leaks: List, scores: Dict) -> str:
        """Generate fallback summary when OpenAI is unavailable"""
        health_score = scores.get('financial_health', 0)
        mismatch_score = scores.get('mismatch', 0)
        
        if health_score >= 80:
            health_text = "Your business is financially healthy"
        elif health_score >= 60:
            health_text = "Your business has good fundamentals but needs some optimization"
        elif health_score >= 40:
            health_text = "Your business is at risk and needs attention"
        else:
            health_text = "Your business is in critical condition"
        
        if mismatch_score >= 70:
            mismatch_text = "significant banking mismatches"
        elif mismatch_score >= 40:
            mismatch_text = "some banking inefficiencies"
        else:
            mismatch_text = "well-matched banking"
        
        leak_count = len(leaks)
        if leak_count == 0:
            leak_text = "No significant financial leaks detected."
        else:
            total_monthly = sum(l.get('monthly_cost', 0) for l in leaks)
            leak_text = f"We found {leak_count} financial {'leak' if leak_count == 1 else 'leaks'} costing ${total_monthly:.2f}/month."
        
        return f"{health_text} with {mismatch_text}. {leak_text} Review the recommendations below to improve your financial position."
    
    def _generate_fallback_mismatch_explanation(self, mismatch_score: int, leak_count: int) -> str:
        """Generate fallback mismatch explanation"""
        if mismatch_score >= 70:
            return f"Your banking setup has significant mismatches (score: {mismatch_score}). This means you're likely paying too much in fees and using the wrong account types for your business needs."
        elif mismatch_score >= 40:
            return f"Your banking setup has some mismatches (score: {mismatch_score}). There are opportunities to optimize your accounts and reduce fees."
        else:
            return f"Your banking setup is well-matched to your needs (score: {mismatch_score}). Continue monitoring for changes as your business grows."
    
    async def generate_text(self, prompt: str, max_tokens: int = 300, temperature: float = 0.7) -> Optional[str]:
        """Generic text generation method"""
        if not self.enabled:
            return None
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are Oli, a helpful financial advisor for small businesses."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            return None