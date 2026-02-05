"""
AI/ML Service for business analysis and recommendations
"""
import json
import logging
from typing import Dict, Any, Optional, List

# Try to import optional AI packages
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False
    openai = None

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    anthropic = None

try:
    from tenacity import retry, stop_after_attempt, wait_exponential
    TENACITY_AVAILABLE = True
except ImportError:
    TENACITY_AVAILABLE = False
    # Create dummy decorator if tenacity not available
    def retry(*args, **kwargs):
        def decorator(func):
            return func
        return decorator
    
    def stop_after_attempt(*args, **kwargs):
        pass
    
    def wait_exponential(*args, **kwargs):
        pass

from core.config import settings

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.openai_api_key = settings.OPENAI_API_KEY
        self.anthropic_api_key = settings.ANTHROPIC_API_KEY
        
        if OPENAI_AVAILABLE and self.openai_api_key:
            openai.api_key = self.openai_api_key
            logger.info("OpenAI API configured")
        elif self.openai_api_key:
            logger.warning("OpenAI API key provided but openai package not installed")
        
        if ANTHROPIC_AVAILABLE and self.anthropic_api_key:
            self.anthropic_client = anthropic.Anthropic(api_key=self.anthropic_api_key)
            logger.info("Anthropic API configured")
        elif self.anthropic_api_key:
            logger.warning("Anthropic API key provided but anthropic package not installed")
    
    if TENACITY_AVAILABLE:
        @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
        async def analyze_business(
            self,
            business_data: Dict[str, Any],
            analysis_type: str = "comprehensive"
        ) -> Dict[str, Any]:
            return await self._analyze_business_impl(business_data, analysis_type)
    else:
        async def analyze_business(
            self,
            business_data: Dict[str, Any],
            analysis_type: str = "comprehensive"
        ) -> Dict[str, Any]:
            return await self._analyze_business_impl(business_data, analysis_type)
    
    async def _analyze_business_impl(
        self,
        business_data: Dict[str, Any],
        analysis_type: str = "comprehensive"
    ) -> Dict[str, Any]:
        """
        Analyze business data using AI
        
        Args:
            business_data: Business information
            analysis_type: Type of analysis (comprehensive, financial, risk, market)
        
        Returns:
            Analysis results
        """
        try:
            prompt = self._create_analysis_prompt(business_data, analysis_type)
            
            if ANTHROPIC_AVAILABLE and self.anthropic_api_key:
                response = await self._call_claude(prompt)
            elif OPENAI_AVAILABLE and self.openai_api_key:
                response = await self._call_openai(prompt)
            else:
                response = self._local_analysis(business_data, analysis_type)
            
            return self._parse_ai_response(response, analysis_type)
            
        except Exception as e:
            logger.error(f"AI analysis failed: {str(e)}")
            return self._fallback_analysis(business_data, analysis_type)
    
    async def generate_recommendations(
        self,
        analysis_results: Dict[str, Any],
        context: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """
        Generate business recommendations based on analysis
        
        Args:
            analysis_results: Results from business analysis
            context: Additional context (country, industry, etc.)
        
        Returns:
            List of recommendations
        """
        prompt = self._create_recommendation_prompt(analysis_results, context)
        
        if ANTHROPIC_AVAILABLE and self.anthropic_api_key:
            response = await self._call_claude(prompt)
        elif OPENAI_AVAILABLE and self.openai_api_key:
            response = await self._call_openai(prompt)
        else:
            response = self._local_recommendations(analysis_results, context)
        
        return self._parse_recommendations(response)
    
    async def assess_risk(
        self,
        business_data: Dict[str, Any],
        financial_metrics: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Assess business risk
        
        Args:
            business_data: Business information
            financial_metrics: Financial metrics
        
        Returns:
            Risk assessment results
        """
        prompt = self._create_risk_assessment_prompt(business_data, financial_metrics)
        
        if ANTHROPIC_AVAILABLE and self.anthropic_api_key:
            response = await self._call_claude(prompt)
        elif OPENAI_AVAILABLE and self.openai_api_key:
            response = await self._call_openai(prompt)
        else:
            response = self._local_risk_assessment(business_data, financial_metrics)
        
        return self._parse_risk_assessment(response)
    
    def _create_analysis_prompt(
        self,
        business_data: Dict[str, Any],
        analysis_type: str
    ) -> str:
        """Create prompt for business analysis"""
        analysis_types = {
            "comprehensive": """
                Provide a comprehensive business analysis covering:
                1. Business Model & Value Proposition
                2. Market Position & Competitive Landscape
                3. Financial Health & Stability
                4. Growth Potential & Opportunities
                5. Risk Factors & Challenges
                6. Strategic Recommendations
                
                Format as structured JSON with these sections.
            """,
            "financial": """
                Provide financial analysis covering:
                1. Revenue Streams & Profitability
                2. Cost Structure & Efficiency
                3. Cash Flow Analysis
                4. Financial Ratios & Benchmarks
                5. Financial Risk Assessment
                6. Financial Recommendations
                
                Format as structured JSON with these sections.
            """,
            "risk": """
                Provide risk assessment covering:
                1. Business Risk Factors
                2. Financial Risk Factors
                3. Operational Risk Factors
                4. Market Risk Factors
                5. Compliance Risk Factors
                6. Risk Mitigation Strategies
                
                Format as structured JSON with these sections.
            """,
            "market": """
                Provide market analysis covering:
                1. Market Size & Growth Rate
                2. Target Market Segmentation
                3. Competitive Analysis
                4. Market Trends & Opportunities
                5. Customer Analysis
                6. Market Entry/Expansion Strategy
                
                Format as structured JSON with these sections.
            """
        }
        
        analysis_instructions = analysis_types.get(
            analysis_type,
            analysis_types["comprehensive"]
        )
        
        return f"""
        Analyze the following business data:
        
        Business Information:
        {json.dumps(business_data, indent=2)}
        
        {analysis_instructions}
        
        Provide clear, actionable insights based on the data provided.
        """
    
    def _create_recommendation_prompt(
        self,
        analysis_results: Dict[str, Any],
        context: Dict[str, Any] = None
    ) -> str:
        """Create prompt for recommendations"""
        context_str = ""
        if context:
            context_str = f"\nAdditional Context:\n{json.dumps(context, indent=2)}"
        
        return f"""
        Based on the following business analysis, provide specific, actionable recommendations:
        
        Analysis Results:
        {json.dumps(analysis_results, indent=2)}
        {context_str}
        
        Provide recommendations in these categories:
        1. Immediate Actions (1-2 weeks)
        2. Short-term Initiatives (1-3 months)
        3. Medium-term Strategies (3-12 months)
        4. Long-term Planning (1-3 years)
        
        For each recommendation, include:
        - Priority (High/Medium/Low)
        - Estimated Impact
        - Required Resources
        - Expected Timeline
        
        Format as structured JSON.
        """
    
    def _create_risk_assessment_prompt(
        self,
        business_data: Dict[str, Any],
        financial_metrics: Dict[str, Any]
    ) -> str:
        """Create prompt for risk assessment"""
        return f"""
        Assess the risk profile for this business:
        
        Business Information:
        {json.dumps(business_data, indent=2)}
        
        Financial Metrics:
        {json.dumps(financial_metrics, indent=2)}
        
        Provide a comprehensive risk assessment covering:
        
        1. Risk Categories:
           - Credit Risk
           - Market Risk
           - Operational Risk
           - Compliance Risk
           - Strategic Risk
        
        2. Risk Scoring (0-100):
           - Likelihood
           - Impact
           - Overall Risk Score
        
        3. Risk Factors:
           - For each category, list specific risk factors
        
        4. Mitigation Strategies:
           - Recommended actions to mitigate each risk
        
        5. Risk Monitoring:
           - Key risk indicators to monitor
        
        Format as structured JSON.
        """
    
    async def _call_claude(self, prompt: str) -> str:
        """Call Claude API"""
        if not ANTHROPIC_AVAILABLE:
            raise ImportError("anthropic package not installed")
        
        response = self.anthropic_client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=4000,
            temperature=0.2,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text
    
    async def _call_openai(self, prompt: str) -> str:
        """Call OpenAI API"""
        if not OPENAI_AVAILABLE:
            raise ImportError("openai package not installed")
        
        response = openai.ChatCompletion.create(
            model="gpt-4-turbo-preview",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=3000
        )
        return response.choices[0].message.content
    
    def _local_analysis(
        self,
        business_data: Dict[str, Any],
        analysis_type: str
    ) -> Dict[str, Any]:
        """Local fallback analysis"""
        return {
            "analysis_type": analysis_type,
            "business_overview": {
                "name": business_data.get("business_name", "Unknown"),
                "industry": business_data.get("industry", "Unknown"),
                "country": business_data.get("country", "Unknown"),
                "business_type": business_data.get("business_type", "Unknown")
            },
            "summary": "Analysis performed locally (AI services not configured)",
            "confidence_score": 0.6,
            "recommendations": ["Configure AI services for enhanced analysis"]
        }
    
    def _fallback_analysis(
        self,
        business_data: Dict[str, Any],
        analysis_type: str
    ) -> Dict[str, Any]:
        """Fallback analysis when AI service fails"""
        return self._local_analysis(business_data, analysis_type)
    
    def _local_recommendations(
        self,
        analysis_results: Dict[str, Any],
        context: Dict[str, Any] = None
    ) -> List[Dict[str, Any]]:
        """Local fallback recommendations"""
        return [
            {
                "category": "general",
                "priority": "medium",
                "action": "Consult with business advisor",
                "impact": "medium",
                "timeline": "1-2 weeks",
                "resources": "Business consultant time"
            },
            {
                "category": "financial",
                "priority": "high",
                "action": "Review financial statements with accountant",
                "impact": "high",
                "timeline": "immediate",
                "resources": "Accountant review"
            }
        ]
    
    def _local_risk_assessment(
        self,
        business_data: Dict[str, Any],
        financial_metrics: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Local fallback risk assessment"""
        return {
            "overall_risk_score": 50,
            "risk_level": "medium",
            "categories": {
                "credit_risk": {"score": 50, "level": "medium"},
                "market_risk": {"score": 50, "level": "medium"},
                "operational_risk": {"score": 50, "level": "medium"}
            },
            "recommendations": ["Perform detailed risk assessment with AI services enabled"]
        }
    
    def _parse_ai_response(
        self,
        response: str,
        analysis_type: str
    ) -> Dict[str, Any]:
        """Parse AI response into structured data"""
        try:
            # Try to extract JSON from response
            if "```json" in response:
                json_str = response.split("```json")[1].split("```")[0].strip()
            elif "```" in response:
                json_str = response.split("```")[1].strip()
            else:
                json_str = response
            
            parsed = json.loads(json_str)
            parsed["analysis_type"] = analysis_type
            parsed["processed_with_ai"] = True
            
            return parsed
            
        except json.JSONDecodeError:
            # If not valid JSON, return as text
            return {
                "analysis_type": analysis_type,
                "raw_analysis": response,
                "processed_with_ai": True,
                "parse_error": "Could not parse as JSON"
            }
    
    def _parse_recommendations(self, response: str) -> List[Dict[str, Any]]:
        """Parse recommendations response"""
        try:
            if "```json" in response:
                json_str = response.split("```json")[1].split("```")[0].strip()
            elif "```" in response:
                json_str = response.split("```")[1].strip()
            else:
                json_str = response
            
            parsed = json.loads(json_str)
            
            # Ensure it's a list
            if isinstance(parsed, list):
                return parsed
            elif isinstance(parsed, dict) and "recommendations" in parsed:
                return parsed["recommendations"]
            else:
                return [parsed]
                
        except json.JSONDecodeError:
            return self._local_recommendations({})
    
    def _parse_risk_assessment(self, response: str) -> Dict[str, Any]:
        """Parse risk assessment response"""
        try:
            if "```json" in response:
                json_str = response.split("```json")[1].split("```")[0].strip()
            elif "```" in response:
                json_str = response.split("```")[1].strip()
            else:
                json_str = response
            
            parsed = json.loads(json_str)
            parsed["assessed_with_ai"] = True
            
            return parsed
            
        except json.JSONDecodeError:
            return self._local_risk_assessment({}, {})
    
    async def generate_report_summary(
        self,
        analysis_results: Dict[str, Any],
        recommendations: List[Dict[str, Any]],
        risk_assessment: Dict[str, Any]
    ) -> str:
        """
        Generate executive summary for reports
        
        Args:
            analysis_results: Business analysis
            recommendations: Business recommendations
            risk_assessment: Risk assessment
        
        Returns:
            Executive summary text
        """
        prompt = f"""
        Generate an executive summary for a business assessment report.
        
        Business Analysis:
        {json.dumps(analysis_results, indent=2)}
        
        Key Recommendations:
        {json.dumps(recommendations[:5], indent=2)}  # Top 5 recommendations
        
        Risk Assessment:
        {json.dumps(risk_assessment, indent=2)}
        
        Create a 3-paragraph executive summary covering:
        1. Overall business health and position
        2. Key risks and opportunities
        3. Priority recommendations
        
        Use professional, concise business language.
        """
        
        if ANTHROPIC_AVAILABLE and self.anthropic_api_key:
            return await self._call_claude(prompt)
        elif OPENAI_AVAILABLE and self.openai_api_key:
            return await self._call_openai(prompt)
        else:
            return "Executive summary requires AI services to be configured."