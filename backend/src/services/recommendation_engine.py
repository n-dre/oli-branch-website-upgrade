# backend/src/services/recommendation_engine.py
"""
Intelligent recommendation engine
Personalized suggestions that save money
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)

@dataclass
class Recommendation:
    """Personalized recommendation"""
    type: str  # bank, tool, resource, learning, operational
    category: str
    title: str
    description: str
    expected_savings_monthly: Decimal
    expected_savings_annual: Decimal
    implementation_effort: str  # low, medium, high
    time_to_implement: str  # hours, days, weeks
    priority: int  # 1-5, 1 = highest
    provider_name: Optional[str] = None
    provider_type: Optional[str] = None
    url: Optional[str] = None
    action_steps: Optional[List[str]] = None

class RecommendationEngine:
    """
    AI-powered recommendation engine
    Generates personalized suggestions based on financial analysis
    """
    
    def __init__(self, ai_service):
        self.ai_service = ai_service
        self.bank_database = BankDatabase()
        self.tool_database = ToolDatabase()
        self.resource_database = ResourceDatabase()
    
    def generate_recommendations(self, 
                                analysis: Dict[str, Any],
                                leaks: List[Dict],
                                assessment: Dict,
                                business_profile: Dict) -> List[Recommendation]:
        """
        Generate personalized recommendations
        """
        logger.info("Generating personalized recommendations")
        
        recommendations = []
        
        # 1. Bank recommendations
        bank_recs = self._generate_bank_recommendations(analysis, assessment, business_profile)
        recommendations.extend(bank_recs)
        
        # 2. Tool recommendations
        tool_recs = self._generate_tool_recommendations(analysis, assessment)
        recommendations.extend(tool_recs)
        
        # 3. Operational fixes
        ops_recs = self._generate_operational_recommendations(analysis, leaks)
        recommendations.extend(ops_recs)
        
        # 4. Resource recommendations
        resource_recs = self._generate_resource_recommendations(analysis, business_profile)
        recommendations.extend(resource_recs)
        
        # 5. Learning recommendations
        learning_recs = self._generate_learning_recommendations(analysis, assessment)
        recommendations.extend(learning_recs)
        
        # Sort by priority and impact
        recommendations.sort(key=lambda x: (-x.priority, -float(x.expected_savings_annual)))
        
        logger.info(f"Generated {len(recommendations)} recommendations")
        
        return recommendations
    
    def _generate_bank_recommendations(self, analysis: Dict[str, Any],
                                      assessment: Dict,
                                      business_profile: Dict) -> List[Recommendation]:
        """Generate bank switching recommendations"""
        recommendations = []
        
        # Get current bank info from assessment
        current_bank = assessment.get('current_bank', '').lower()
        
        # Analyze business needs
        needs = self._analyze_banking_needs(analysis, assessment)
        
        # Find better bank matches
        better_banks = self.bank_database.find_better_matches(
            current_bank=current_bank,
            needs=needs,
            business_size=analysis.get('monthly_revenue', 0),
            transaction_volume=analysis.get('transaction_count', 0)
        )
        
        for bank in better_banks[:3]:  # Top 3 matches
            # Calculate potential savings
            current_fees = float(analysis.get('fee_ratio', 0)) * float(analysis.get('monthly_revenue', 1))
            potential_savings = current_fees - bank['estimated_monthly_fees']
            
            if potential_savings > 0:
                recommendation = Recommendation(
                    type="bank",
                    category="banking",
                    title=f"Switch to {bank['name']}",
                    description=f"{bank['name']} offers better rates for businesses like yours. "
                               f"Estimated savings: ${potential_savings:.2f}/month.",
                    expected_savings_monthly=Decimal(str(potential_savings)),
                    expected_savings_annual=Decimal(str(potential_savings * 12)),
                    implementation_effort="medium",
                    time_to_implement="days",
                    priority=2 if potential_savings > 100 else 3,
                    provider_name=bank['name'],
                    provider_type="bank",
                    url=bank.get('url'),
                    action_steps=[
                        f"Open a business account with {bank['name']}",
                        "Transfer automatic payments to new account",
                        "Close old account after 60-day transition"
                    ]
                )
                recommendations.append(recommendation)
        
        return recommendations
    
    def _generate_tool_recommendations(self, analysis: Dict[str, Any],
                                      assessment: Dict) -> List[Recommendation]:
        """Generate tool/software recommendations"""
        recommendations = []
        
        # Check for inefficiencies
        if float(analysis.get('cash_efficiency', 0)) < 0.6:
            # Recommend digital payment tools
            tools = self.tool_database.get_tools_by_category('payment_processing')
            for tool in tools[:2]:
                recommendation = Recommendation(
                    type="tool",
                    category="payments",
                    title=f"Implement {tool['name']}",
                    description=f"Reduce cash handling and streamline payments with {tool['name']}. "
                               f"Estimated time savings: 5-10 hours/month.",
                    expected_savings_monthly=Decimal("150"),  # Time value
                    expected_savings_annual=Decimal("1800"),
                    implementation_effort="low",
                    time_to_implement="hours",
                    priority=3,
                    provider_name=tool['name'],
                    provider_type="fintech",
                    url=tool.get('url'),
                    action_steps=[
                        f"Sign up for {tool['name']} free trial",
                        "Set up payment links for invoices",
                        "Train team on new system"
                    ]
                )
                recommendations.append(recommendation)
        
        # Check subscription waste
        if float(analysis.get('subscription_cost', 0)) > 200:
            recommendation = Recommendation(
                type="tool",
                category="optimization",
                title="Audit Software Subscriptions",
                description="You're spending significant amounts on software. "
                          "Tools like Trim or Truebill can identify and cancel unused subscriptions.",
                expected_savings_monthly=Decimal(str(float(analysis.get('subscription_cost', 0)) * 0.3)),
                expected_savings_annual=Decimal(str(float(analysis.get('subscription_cost', 0)) * 3.6)),
                implementation_effort="low",
                time_to_implement="hours",
                priority=2,
                provider_name="Subscription audit",
                action_steps=[
                    "Export all subscription payments",
                    "Identify unused or duplicate services",
                    "Cancel unnecessary subscriptions",
                    "Negotiate better rates for essential tools"
                ]
            )
            recommendations.append(recommendation)
        
        return recommendations
    
    def _generate_operational_recommendations(self, analysis: Dict[str, Any],
                                            leaks: List[Dict]) -> List[Recommendation]:
        """Generate operational improvement recommendations"""
        recommendations = []
        
        # Based on detected leaks
        for leak in leaks[:5]:  # Top 5 leaks
            if leak['monthly_cost'] > 50:
                recommendation = Recommendation(
                    type="operational",
                    category=leak.get('category', 'efficiency'),
                    title=f"Fix {leak['title']}",
                    description=leak.get('description', ''),
                    expected_savings_monthly=Decimal(str(leak['monthly_cost'])),
                    expected_savings_annual=Decimal(str(leak['annual_cost'])),
                    implementation_effort=leak.get('fix_complexity', 'medium'),
                    time_to_implement=leak.get('estimated_fix_time', 'days'),
                    priority=1 if leak['severity'] == 'critical' else 2,
                    action_steps=self._generate_fix_steps(leak)
                )
                recommendations.append(recommendation)
        
        return recommendations
    
    def _generate_resource_recommendations(self, analysis: Dict[str, Any],
                                         business_profile: Dict) -> List[Recommendation]:
        """Generate government/community resource recommendations"""
        recommendations = []
        
        # SBA loans for growth
        if (float(analysis.get('profit_margin', 0)) > 0.10 and 
            float(analysis.get('monthly_revenue', 0)) < 50000):
            
            recommendation = Recommendation(
                type="resource",
                category="funding",
                title="Explore SBA Loan Programs",
                description="Your business qualifies for Small Business Administration loans "
                          "with favorable rates for expansion or equipment.",
                expected_savings_monthly=Decimal("0"),  # Not direct savings
                expected_savings_annual=Decimal("0"),
                implementation_effort="high",
                time_to_implement="weeks",
                priority=4,
                provider_name="U.S. Small Business Administration",
                provider_type="government",
                url="https://www.sba.gov/funding-programs/loans",
                action_steps=[
                    "Complete SBA loan eligibility assessment",
                    "Prepare business plan and financial statements",
                    "Contact SBA-approved lenders"
                ]
            )
            recommendations.append(recommendation)
        
        # Local business grants
        if business_profile.get('employee_count', 0) < 10:
            recommendation = Recommendation(
                type="resource",
                category="funding",
                title="Check Local Business Grants",
                description=f"Your {business_profile.get('entity_type', 'business')} may qualify "
                          "for local economic development grants.",
                expected_savings_monthly=Decimal("0"),
                expected_savings_annual=Decimal("0"),
                implementation_effort="medium",
                time_to_implement="weeks",
                priority=4,
                provider_name="Local Economic Development",
                provider_type="government",
                action_steps=[
                    "Search for grants in your county",
                    "Review eligibility requirements",
                    "Prepare grant application"
                ]
            )
            recommendations.append(recommendation)
        
        return recommendations
    
    def _generate_learning_recommendations(self, analysis: Dict[str, Any],
                                         assessment: Dict) -> List[Recommendation]:
        """Generate personalized learning path"""
        recommendations = []
        
        # Based on assessment goals
        primary_goal = assessment.get('primary_goal', '')
        
        learning_map = {
            'reduce_fees': {
                'title': 'Bank Fee Negotiation Course',
                'description': 'Learn how to negotiate better banking terms and reduce fees.',
                'priority': 2
            },
            'grow_cash': {
                'title': 'Cash Flow Management Fundamentals',
                'description': 'Master techniques to improve cash flow and build reserves.',
                'priority': 2
            },
            'optimize_operations': {
                'title': 'Business Process Automation',
                'description': 'Learn to automate repetitive tasks and improve efficiency.',
                'priority': 3
            }
        }
        
        if primary_goal in learning_map:
            learning = learning_map[primary_goal]
            recommendation = Recommendation(
                type="learning",
                category="education",
                title=learning['title'],
                description=learning['description'],
                expected_savings_monthly=Decimal("100"),  # Estimated value
                expected_savings_annual=Decimal("1200"),
                implementation_effort="low",
                time_to_implement="hours",
                priority=learning['priority'],
                provider_name="Oli-Branch Learning",
                provider_type="education",
                action_steps=[
                    "Enroll in the free course",
                    "Complete core modules (2-3 hours)",
                    "Implement one technique each week"
                ]
            )
            recommendations.append(recommendation)
        
        return recommendations
    
    def _analyze_banking_needs(self, analysis: Dict[str, Any],
                              assessment: Dict) -> Dict[str, Any]:
        """Analyze business banking needs"""
        needs = {
            'low_fees': True,
            'high_transaction_limit': False,
            'cash_deposit_support': False,
            'international_transfers': False,
            'integrated_accounting': True
        }
        
        # Transaction volume
        if analysis.get('transaction_count', 0) > 200:
            needs['high_transaction_limit'] = True
        
        # Cash business
        payment_methods = assessment.get('payment_methods', [])
        if isinstance(payment_methods, list) and 'cash' in payment_methods:
            needs['cash_deposit_support'] = True
        
        # International business
        if assessment.get('has_international_sales', False):
            needs['international_transfers'] = True
        
        return needs
    
    def _generate_fix_steps(self, leak: Dict[str, Any]) -> List[str]:
        """Generate actionable fix steps for a leak"""
        steps = []
        
        if leak['code'] == 'MONTHLY_MAINTENANCE_FEE':
            steps = [
                "Call your bank's business services department",
                "Ask about fee waiver options (minimum balance, transaction volume)",
                "If no waiver, request account downgrade to no-fee option",
                "Consider switching to a business account with no monthly fees"
            ]
        elif leak['code'] == 'CASH_DEPOSIT_FEES':
            steps = [
                "Find local banks with free cash deposit programs",
                "Open a business account with free cash deposits",
                "Consolidate cash deposits to weekly instead of daily",
                "Implement digital payments to reduce cash handling"
            ]
        elif leak['code'] == 'SUBSCRIPTION_WASTE':
            steps = [
                "Export list of all subscription charges",
                "Identify unused or duplicate services",
                "Cancel unnecessary subscriptions immediately",
                "Renegotiate rates for essential tools"
            ]
        else:
            steps = [
                "Review the identified transactions",
                "Contact service provider for explanation",
                "Negotiate better terms or switch providers",
                "Monitor for recurrence"
            ]
        
        return steps

class BankDatabase:
    """Database of business banking options"""
    
    def find_better_matches(self, current_bank: str, needs: Dict[str, bool],
                           business_size: float, transaction_volume: int) -> List[Dict]:
        """Find better bank matches for business needs"""
        
        # Simplified example - in production, this would query a real database
        banks = [
            {
                'name': 'Chase Business Complete Banking',
                'estimated_monthly_fees': 15,
                'features': ['unlimited transactions', 'cash deposit support', 'integrated payments'],
                'min_balance': 2000,
                'url': 'https://www.chase.com/business/business-checking'
            },
            {
                'name': 'BlueVine Business Checking',
                'estimated_monthly_fees': 0,
                'features': ['no monthly fees', 'unlimited transactions', '1% interest'],
                'min_balance': 0,
                'url': 'https://www.bluevine.com/business-checking'
            },
            {
                'name': 'Novo',
                'estimated_monthly_fees': 0,
                'features': ['no fees', 'free ACH transfers', 'integrated tools'],
                'min_balance': 0,
                'url': 'https://banknovo.com'
            }
        ]
        
        # Filter by needs
        filtered_banks = []
        for bank in banks:
            matches_needs = True
            
            if needs.get('cash_deposit_support') and 'cash deposit support' not in bank['features']:
                matches_needs = False
            
            if needs.get('high_transaction_limit') and 'unlimited transactions' not in bank['features']:
                matches_needs = False
            
            if matches_needs:
                filtered_banks.append(bank)
        
        return filtered_banks

class ToolDatabase:
    """Database of business tools and software"""
    
    def get_tools_by_category(self, category: str) -> List[Dict]:
        """Get tools by category"""
        
        tools = {
            'payment_processing': [
                {'name': 'Square', 'url': 'https://squareup.com'},
                {'name': 'Stripe', 'url': 'https://stripe.com'},
                {'name': 'PayPal Business', 'url': 'https://paypal.com/business'}
            ],
            'accounting': [
                {'name': 'QuickBooks Online', 'url': 'https://quickbooks.intuit.com'},
                {'name': 'Xero', 'url': 'https://xero.com'},
                {'name': 'FreshBooks', 'url': 'https://freshbooks.com'}
            ],
            'payroll': [
                {'name': 'Gusto', 'url': 'https://gusto.com'},
                {'name': 'ADP Run', 'url': 'https://adp.com'},
                {'name': 'Paychex', 'url': 'https://paychex.com'}
            ]
        }
        
        return tools.get(category, [])

class ResourceDatabase:
    """Database of business resources"""
    
    def get_resources(self) -> List[Dict]:
        """Get business resources"""
        return [
            {
                'name': 'SBA Learning Center',
                'type': 'education',
                'url': 'https://www.sba.gov/learning-center'
            },
            {
                'name': 'SCORE Business Mentoring',
                'type': 'mentoring',
                'url': 'https://www.score.org'
            },
            {
                'name': 'IRS Small Business Tax Center',
                'type': 'tax',
                'url': 'https://www.irs.gov/businesses/small-businesses-self-employed'
            }
        ]