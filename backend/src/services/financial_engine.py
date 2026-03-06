# backend/src/services/financial_engine.py
"""
Core financial intelligence engine
The brain that saves users money
"""

from decimal import Decimal
from datetime import datetime, timedelta
from typing import Dict, List, Any, Tuple, Optional
from dataclasses import dataclass
import statistics
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

@dataclass
class FinancialAnalysis:
    """Complete financial analysis"""
    monthly_revenue: Decimal
    monthly_expenses: Decimal
    profit_margin: Decimal
    fee_ratio: Decimal
    cash_efficiency: Decimal
    revenue_volatility: Decimal
    debt_ratio: Decimal
    leak_impact: Decimal
    cash_flow_health: str
    key_metrics: Dict[str, Any]

class FinancialEngine:
    """
    Core financial intelligence
    Calculates everything that matters for small businesses
    """
    
    def __init__(self):
        self.categorizer = TransactionCategorizer()
        self.pattern_detector = PatternDetector()
        
    def analyze_business_health(self, 
                               transactions: List[Dict],
                               assessment: Dict,
                               bank_accounts: List[Dict]) -> FinancialAnalysis:
        """
        Comprehensive financial health analysis
        """
        logger.info("Starting financial health analysis")
        
        # Categorize transactions
        categorized = self.categorizer.categorize_transactions(transactions)
        
        # Calculate core metrics
        metrics = self._calculate_core_metrics(categorized, assessment, bank_accounts)
        
        # Calculate scores
        scores = self._calculate_scores(metrics)
        
        # Generate insights
        insights = self._generate_insights(metrics, scores)
        
        analysis = FinancialAnalysis(
            monthly_revenue=metrics['monthly_revenue'],
            monthly_expenses=metrics['monthly_expenses'],
            profit_margin=metrics['profit_margin'],
            fee_ratio=metrics['fee_ratio'],
            cash_efficiency=metrics['cash_efficiency'],
            revenue_volatility=metrics['revenue_volatility'],
            debt_ratio=metrics['debt_ratio'],
            leak_impact=metrics['leak_impact'],
            cash_flow_health=insights['cash_flow_health'],
            key_metrics=metrics
        )
        
        logger.info(f"Financial analysis complete. Profit margin: {analysis.profit_margin:.1%}")
        
        return analysis
    
    def _calculate_core_metrics(self, 
                               transactions: List[Dict],
                               assessment: Dict,
                               accounts: List[Dict]) -> Dict[str, Any]:
        """Calculate all financial metrics"""
        
        # Separate inflows and outflows
        inflows = [t for t in transactions if t.get('direction') == 'credit']
        outflows = [t for t in transactions if t.get('direction') == 'debit']
        
        # Monthly averages (last 90 days)
        days_ago_90 = datetime.now() - timedelta(days=90)
        recent_txns = [t for t in transactions 
                      if datetime.fromisoformat(t['posted_at'].replace('Z', '+00:00')) > days_ago_90]
        
        recent_inflows = [t for t in recent_txns if t.get('direction') == 'credit']
        recent_outflows = [t for t in recent_txns if t.get('direction') == 'debit']
        
        # Revenue and expenses
        monthly_revenue = self._calculate_monthly_average(recent_inflows)
        monthly_expenses = self._calculate_monthly_average(recent_outflows)
        
        # Fee analysis
        fee_txns = [t for t in recent_outflows if t.get('is_fee')]
        monthly_fees = self._calculate_monthly_average(fee_txns)
        
        # Cash usage
        cash_txns = [t for t in recent_txns 
                    if t.get('payment_method') == 'cash' 
                    or 'cash' in t.get('name', '').lower()]
        cash_ratio = len(cash_txns) / max(len(recent_txns), 1)
        
        # Subscription analysis
        subscriptions = self._identify_subscriptions(recent_outflows)
        subscription_cost = sum(s['monthly_cost'] for s in subscriptions)
        
        # Debt analysis
        loan_payments = [t for t in recent_outflows 
                        if 'loan' in t.get('name', '').lower() 
                        or 'interest' in t.get('name', '').lower()]
        monthly_debt = self._calculate_monthly_average(loan_payments)
        
        # Volatility calculation
        revenue_volatility = self._calculate_volatility(recent_inflows)
        
        return {
            'monthly_revenue': Decimal(str(monthly_revenue)),
            'monthly_expenses': Decimal(str(monthly_expenses)),
            'profit_margin': Decimal(str((monthly_revenue - monthly_expenses) / max(monthly_revenue, 1))),
            'fee_ratio': Decimal(str(monthly_fees / max(monthly_revenue, 1))),
            'cash_efficiency': Decimal(str(1 - cash_ratio)),  # Lower cash usage = more efficient
            'revenue_volatility': Decimal(str(revenue_volatility)),
            'debt_ratio': Decimal(str(monthly_debt / max(monthly_revenue, 1))),
            'subscription_cost': Decimal(str(subscription_cost)),
            'leak_impact': Decimal(str(monthly_fees + subscription_cost)),
            'transaction_count': len(recent_txns),
            'unique_vendors': len(set(t.get('merchant') for t in recent_txns if t.get('merchant'))),
            'avg_transaction_size': statistics.mean([t['amount_abs'] for t in recent_txns]) if recent_txns else 0
        }
    
    def _calculate_scores(self, metrics: Dict[str, Any]) -> Dict[str, int]:
        """Calculate all financial scores"""
        
        # Financial Health Score (0-100)
        health_score = self._calculate_health_score(metrics)
        
        # Fee Efficiency Score (0-100)
        fee_score = self._calculate_fee_score(metrics)
        
        # Cash Efficiency Score (0-100)
        cash_score = self._calculate_cash_score(metrics)
        
        # Revenue Stability Score (0-100)
        stability_score = self._calculate_stability_score(metrics)
        
        # Debt Health Score (0-100)
        debt_score = self._calculate_debt_score(metrics)
        
        return {
            'financial_health': health_score,
            'fee_efficiency': fee_score,
            'cash_efficiency': cash_score,
            'revenue_stability': stability_score,
            'debt_health': debt_score,
            'overall_score': int((health_score * 0.4 + fee_score * 0.25 + 
                                 cash_score * 0.15 + stability_score * 0.1 + 
                                 debt_score * 0.1))
        }
    
    def _calculate_health_score(self, metrics: Dict[str, Any]) -> int:
        """Calculate financial health score (0-100)"""
        margin = float(metrics['profit_margin'])
        fee_ratio = float(metrics['fee_ratio'])
        leak_impact = float(metrics['leak_impact'])
        revenue = float(metrics['monthly_revenue'])
        
        # Margin component (40% weight)
        margin_score = self._scale_value(margin, -0.10, 0.30, inverse=False)  # -10% to 30% range
        
        # Fee burden component (25% weight)
        total_burden = fee_ratio + (leak_impact / revenue if revenue > 0 else 0)
        burden_score = 100 - self._scale_value(total_burden, 0, 0.10, inverse=True)  # 0% to 10% burden
        
        # Debt component (15% weight)
        debt_ratio = float(metrics['debt_ratio'])
        debt_score = 100 - self._scale_value(debt_ratio, 0, 0.40, inverse=True)  # 0% to 40% debt ratio
        
        # Volatility component (10% weight)
        volatility = float(metrics['revenue_volatility'])
        volatility_score = 100 - self._scale_value(volatility, 0, 0.50, inverse=True)  # 0% to 50% volatility
        
        # Cash efficiency component (10% weight)
        cash_efficiency = float(metrics['cash_efficiency'])
        cash_score = self._scale_value(cash_efficiency, 0, 1, inverse=False) * 100
        
        # Weighted sum
        weighted_score = (
            margin_score * 0.4 +
            burden_score * 0.25 +
            debt_score * 0.15 +
            volatility_score * 0.1 +
            cash_score * 0.1
        )
        
        return int(max(0, min(100, weighted_score)))
    
    def _calculate_fee_score(self, metrics: Dict[str, Any]) -> int:
        """Calculate fee efficiency score (0-100)"""
        fee_ratio = float(metrics['fee_ratio'])
        
        # Ideal: < 1% fees
        # Bad: > 5% fees
        if fee_ratio <= 0.01:
            return 100
        elif fee_ratio >= 0.05:
            return 20
        else:
            # Linear scale between 1% and 5%
            return int(100 - ((fee_ratio - 0.01) / 0.04) * 80)
    
    def _generate_insights(self, metrics: Dict[str, Any], 
                          scores: Dict[str, int]) -> Dict[str, Any]:
        """Generate actionable insights"""
        
        insights = {
            'cash_flow_health': 'healthy',
            'key_strengths': [],
            'key_weaknesses': [],
            'immediate_actions': [],
            'strategic_opportunities': []
        }
        
        # Cash flow health assessment
        if float(metrics['profit_margin']) < 0:
            insights['cash_flow_health'] = 'critical'
            insights['key_weaknesses'].append('Negative profit margin')
            insights['immediate_actions'].append('Reduce expenses immediately')
        elif float(metrics['profit_margin']) < 0.10:
            insights['cash_flow_health'] = 'at_risk'
            insights['key_weaknesses'].append('Low profit margin (<10%)')
        elif float(metrics['profit_margin']) < 0.20:
            insights['cash_flow_health'] = 'needs_optimization'
        else:
            insights['cash_flow_health'] = 'healthy'
            insights['key_strengths'].append('Strong profit margin (>20%)')
        
        # Fee insights
        if float(metrics['fee_ratio']) > 0.03:
            insights['key_weaknesses'].append(f'High fee burden ({metrics["fee_ratio"]:.1%} of revenue)')
            insights['immediate_actions'].append('Review and negotiate bank fees')
        
        # Cash efficiency insights
        if float(metrics['cash_efficiency']) < 0.5:
            insights['key_weaknesses'].append('High cash usage reducing efficiency')
            insights['strategic_opportunities'].append('Implement digital payment systems')
        
        # Debt insights
        if float(metrics['debt_ratio']) > 0.30:
            insights['key_weaknesses'].append('High debt burden')
            insights['strategic_opportunities'].append('Explore debt consolidation options')
        
        # Subscription waste
        if float(metrics.get('subscription_cost', 0)) > 100:
            insights['immediate_actions'].append('Audit software subscriptions')
        
        return insights
    
    def _calculate_monthly_average(self, transactions: List[Dict]) -> float:
        """Calculate monthly average from transaction list"""
        if not transactions:
            return 0.0
        
        # Group by month
        monthly_totals = defaultdict(float)
        
        for txn in transactions:
            month = txn['posted_at'][:7]  # YYYY-MM
            monthly_totals[month] += txn['amount_abs']
        
        # Average over available months
        if monthly_totals:
            return statistics.mean(monthly_totals.values())
        
        return 0.0
    
    def _identify_subscriptions(self, transactions: List[Dict]) -> List[Dict]:
        """Identify recurring subscriptions"""
        subscriptions = []
        
        # Group by merchant
        merchant_groups = defaultdict(list)
        for txn in transactions:
            merchant = txn.get('merchant') or txn.get('name', '')
            if merchant:
                merchant_groups[merchant].append(txn)
        
        # Find recurring patterns
        for merchant, txns in merchant_groups.items():
            if len(txns) >= 2:
                # Check for regular intervals and similar amounts
                dates = [datetime.fromisoformat(t['posted_at'].replace('Z', '+00:00')) 
                        for t in txns]
                dates.sort()
                
                intervals = [(dates[i+1] - dates[i]).days for i in range(len(dates)-1)]
                amounts = [t['amount_abs'] for t in txns]
                
                # Check if monthly subscription (20-40 day intervals)
                if (len(intervals) >= 1 and 
                    all(20 <= interval <= 40 for interval in intervals) and
                    statistics.stdev(amounts) / statistics.mean(amounts) < 0.2):  # Similar amounts
                    
                    subscriptions.append({
                        'merchant': merchant,
                        'monthly_cost': statistics.mean(amounts),
                        'frequency': 'monthly',
                        'transaction_count': len(txns),
                        'last_charge': dates[-1].isoformat()
                    })
        
        return subscriptions
    
    def _calculate_volatility(self, transactions: List[Dict]) -> float:
        """Calculate revenue volatility"""
        if len(transactions) < 3:
            return 0.0
        
        # Group by month
        monthly_totals = defaultdict(float)
        for txn in transactions:
            month = txn['posted_at'][:7]
            monthly_totals[month] += txn['amount_abs']
        
        totals = list(monthly_totals.values())
        if len(totals) >= 3:
            cv = statistics.stdev(totals) / statistics.mean(totals)
            return float(cv)
        
        return 0.0
    
    def _scale_value(self, value: float, min_val: float, max_val: float, 
                    inverse: bool = False) -> float:
        """Scale value to 0-100 range"""
        if max_val == min_val:
            return 50.0
        
        scaled = (value - min_val) / (max_val - min_val)
        scaled = max(0, min(1, scaled))  # Clamp to 0-1
        
        if inverse:
            scaled = 1 - scaled
        
        return scaled * 100

class TransactionCategorizer:
    """Intelligent transaction categorization"""
    
    def __init__(self):
        self.categories = self._load_categories()
    
    def _load_categories(self) -> Dict[str, List[str]]:
        """Load categorization rules"""
        return {
            'revenue': ['payment', 'deposit', 'transfer from', 'refund', 'income'],
            'expense': ['purchase', 'payment to', 'withdrawal', 'fee', 'charge'],
            'fee': ['fee', 'service charge', 'maintenance', 'overdraft', 'nsf'],
            'cash': ['cash', 'atm', 'withdrawal'],
            'subscription': ['subscription', 'membership', 'monthly', 'annual'],
            'loan': ['loan', 'interest', 'principal', 'financing'],
            'payroll': ['payroll', 'salary', 'wages', 'paycheck'],
            'tax': ['tax', 'irs', 'federal', 'state', 'property tax']
        }
    
    def categorize_transactions(self, transactions: List[Dict]) -> List[Dict]:
        """Categorize transactions intelligently"""
        categorized = []
        
        for txn in transactions:
            name = txn.get('name', '').lower()
            merchant = txn.get('merchant', '').lower()
            
            categories = []
            is_fee = False
            
            # Check each category
            for category, keywords in self.categories.items():
                for keyword in keywords:
                    if keyword in name or keyword in merchant:
                        categories.append(category)
                        if category == 'fee':
                            is_fee = True
                        break
            
            # Add categorization to transaction
            categorized_txn = txn.copy()
            categorized_txn['categories'] = list(set(categories))
            categorized_txn['is_fee'] = is_fee
            
            categorized.append(categorized_txn)
        
        return categorized

class PatternDetector:
    """Detect financial patterns and anomalies"""
    
    def detect_spending_patterns(self, transactions: List[Dict]) -> Dict[str, Any]:
        """Detect spending patterns and anomalies"""
        
        patterns = {
            'large_transactions': [],
            'unusual_spending': [],
            'recurring_patterns': [],
            'seasonality': []
        }
        
        if not transactions:
            return patterns
        
        # Detect large transactions (> 3x average)
        amounts = [t['amount_abs'] for t in transactions if t.get('direction') == 'debit']
        if amounts:
            avg_amount = statistics.mean(amounts)
            std_amount = statistics.stdev(amounts) if len(amounts) > 1 else 0
            
            for txn in transactions:
                if (txn.get('direction') == 'debit' and 
                    txn['amount_abs'] > avg_amount + 2 * std_amount):
                    patterns['large_transactions'].append({
                        'transaction_id': txn['id'],
                        'amount': txn['amount_abs'],
                        'date': txn['posted_at'],
                        'reason': 'Significantly above average'
                    })
        
        return patterns