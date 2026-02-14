# services/scoring.py
"""
Scoring Engine - Exactly matching the pseudocode requirements

Calculates:
1. Mismatch Score (0-100) - How wrong is the banking setup
2. Financial Health Score (0-100) - Overall business financial health
"""

import math
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class ScoringEngine:
    """
    Core scoring engine for Oli-Branch.
    Implements exact scoring formulas from requirements.
    """
    
    def __init__(self):
        logger.info("Scoring Engine initialized")
    
    def calculate_scores(self, context: Dict[str, Any], leaks: List[Dict] = None) -> Dict[str, Any]:
        """
        Calculate all scores for a business
        
        Args:
            context: Analysis context containing business, transaction data
            leaks: Detected leaks (optional)
            
        Returns:
            Dictionary with all scores
        """
        if leaks is None:
            leaks = context.get('leaks', [])
        
        # Extract metrics
        metrics = self._extract_metrics(context, leaks)
        
        # Calculate scores
        mismatch_score = self._calculate_mismatch_score(metrics)
        health_score = self._calculate_financial_health_score(metrics)
        
        # Get labels
        risk_label = self._get_risk_label(mismatch_score)
        health_label = self._get_health_label(health_score)
        
        # Calculate component scores
        component_scores = self._calculate_component_scores(metrics)
        
        return {
            'mismatch': mismatch_score,
            'financial_health': health_score,
            'risk_label': risk_label,
            'health_label': health_label,
            'components': component_scores,
            'metrics': metrics
        }
    
    def _clamp(self, value: float, min_val: float, max_val: float) -> float:
        """Clamp value between min and max"""
        return max(min_val, min(value, max_val))
    
    def _clamp01(self, value: float) -> float:
        """Clamp value between 0 and 1"""
        return self._clamp(value, 0, 1)
    
    def _extract_metrics(self, context: Dict[str, Any], leaks: List[Dict]) -> Dict[str, Any]:
        """
        Extract all metrics needed for scoring from context and leaks
        
        Following the pseudocode inputs:
        - fee_ratio = monthly_fees / monthly_revenue
        - leak_ratio = total_monthly_leak / monthly_revenue
        - cash_intensity_flag
        - transaction_volume
        - account_mismatch_flag
        - nsf_count
        - margin = (revenue - expenses) / revenue
        - debt_ratio
        - volatility
        """
        metrics = {}
        
        # Get business and assessment data
        business = context.get('business', {})
        assessment = context.get('assessment', {})
        transactions = context.get('transactions', [])
        
        # Monthly revenue (prefer actual from transactions, fallback to assessment)
        actual_revenue = sum(
            t.get('amount', 0) for t in transactions 
            if t.get('direction') == 'credit' and t.get('amount', 0) > 0
        ) / 3  # Assuming 90-day window
        
        assessment_revenue = assessment.get('monthly_revenue', 0)
        if isinstance(assessment_revenue, str):
            assessment_revenue = float(assessment_revenue) if assessment_revenue else 0
        elif assessment_revenue is None:
            assessment_revenue = 0
        
        monthly_revenue = max(actual_revenue, assessment_revenue, 1)  # Avoid division by zero
        metrics['monthly_revenue'] = float(monthly_revenue)
        
        # Monthly expenses
        actual_expenses = sum(
            abs(t.get('amount', 0)) for t in transactions 
            if t.get('direction') == 'debit'
        ) / 3
        
        assessment_expenses = assessment.get('monthly_expenses', 0)
        if isinstance(assessment_expenses, str):
            assessment_expenses = float(assessment_expenses) if assessment_expenses else 0
        
        monthly_expenses = max(actual_expenses, assessment_expenses, 0)
        metrics['monthly_expenses'] = float(monthly_expenses)
        
        # Profit margin
        metrics['margin'] = (monthly_revenue - monthly_expenses) / monthly_revenue if monthly_revenue > 0 else 0
        
        # Fee ratio - from leaks
        fee_leaks = [l for l in leaks if l.get('category') == 'fees']
        monthly_fees = sum(l.get('monthly_cost', 0) for l in fee_leaks)
        metrics['fee_ratio'] = monthly_fees / monthly_revenue if monthly_revenue > 0 else 0
        
        # Leak ratio - total leaks
        total_monthly_leaks = sum(l.get('monthly_cost', 0) for l in leaks)
        metrics['leak_ratio'] = total_monthly_leaks / monthly_revenue if monthly_revenue > 0 else 0
        
        # Cash intensity flag
        payment_methods = assessment.get('payment_methods', '')
        if isinstance(payment_methods, str):
            metrics['cash_intensity_flag'] = 1 if 'cash' in payment_methods.lower() else 0
        elif isinstance(payment_methods, list):
            metrics['cash_intensity_flag'] = 1 if any('cash' in m.lower() for m in payment_methods) else 0
        else:
            metrics['cash_intensity_flag'] = 0
        
        # Transaction volume
        metrics['transaction_volume'] = len([t for t in transactions if t.get('direction') == 'debit']) / 3  # Monthly
        
        # Account mismatch flag
        bank_used = assessment.get('bank_used', '')
        if isinstance(bank_used, str):
            metrics['account_mismatch_flag'] = 1 if 'personal' in bank_used.lower() else 0
        else:
            metrics['account_mismatch_flag'] = 0
        
        # NSF count
        nsf_count = 0
        for txn in transactions:
            name = txn.get('name', '').lower()
            if 'nsf' in name or 'insufficient' in name or 'overdraft' in name:
                nsf_count += 1
        metrics['nsf_count'] = nsf_count
        
        # Debt ratio
        loans_taken = assessment.get('loans_taken', '')
        if loans_taken:
            # Estimate debt ratio from loan payments if available
            loan_payments = 0
            for txn in transactions:
                name = txn.get('name', '').lower()
                if 'loan' in name or 'interest' in name:
                    loan_payments += abs(txn.get('amount', 0))
            monthly_loan_payments = loan_payments / 3
            metrics['debt_ratio'] = monthly_loan_payments / monthly_revenue if monthly_revenue > 0 else 0
        else:
            metrics['debt_ratio'] = 0
        
        # Volatility (simplified - would use standard deviation in production)
        # Group revenue by month
        monthly_revenues = {}
        for txn in transactions:
            if txn.get('direction') == 'credit':
                date_str = txn.get('posted_at', '')
                if date_str:
                    month = date_str[:7]  # YYYY-MM
                    monthly_revenues[month] = monthly_revenues.get(month, 0) + txn.get('amount', 0)
        
        if len(monthly_revenues) >= 2:
            revenues = list(monthly_revenues.values())
            avg_revenue = sum(revenues) / len(revenues)
            # Simple volatility measure: max deviation from average
            max_deviation = max(abs(r - avg_revenue) for r in revenues)
            metrics['volatility'] = max_deviation / avg_revenue if avg_revenue > 0 else 0
        else:
            metrics['volatility'] = 0.15  # Default moderate volatility
        
        # Processor friction (same as cash intensity for now)
        metrics['processor_friction'] = metrics['cash_intensity_flag']
        
        return metrics
    
    def _calculate_mismatch_score(self, metrics: Dict[str, Any]) -> int:
        """
        Calculate mismatch score (0-100)
        Higher = worse banking setup
        
        Formula from pseudocode:
        fee_penalty = clamp01(metrics.fee_ratio / 0.03)
        leak_penalty = clamp01(metrics.leak_ratio / 0.05)
        account_penalty = metrics.account_mismatch_flag
        cash_penalty = metrics.cash_intensity_flag
        risk_penalty = clamp01(metrics.nsf_count / 3)
        
        score = (
            35*(0.6*fee_penalty + 0.4*leak_penalty) +
            25*(account_penalty) +
            25*(0.6*cash_penalty + 0.4*metrics.processor_friction) +
            15*(risk_penalty)
        )
        """
        # Calculate penalties
        fee_penalty = self._clamp01(metrics.get('fee_ratio', 0) / 0.03)
        leak_penalty = self._clamp01(metrics.get('leak_ratio', 0) / 0.05)
        account_penalty = metrics.get('account_mismatch_flag', 0)
        cash_penalty = metrics.get('cash_intensity_flag', 0)
        risk_penalty = self._clamp01(metrics.get('nsf_count', 0) / 3)
        
        # Calculate score according to formula
        score = (
            35 * (0.6 * fee_penalty + 0.4 * leak_penalty) +
            25 * account_penalty +
            25 * (0.6 * cash_penalty + 0.4 * metrics.get('processor_friction', 0)) +
            15 * risk_penalty
        )
        
        # Clamp to 0-100
        return int(round(self._clamp(score, 0, 100)))
    
    def _calculate_financial_health_score(self, metrics: Dict[str, Any]) -> int:
        """
        Calculate financial health score (0-100)
        Higher = healthier business
        
        Formula from pseudocode:
        margin_score = clamp01((metrics.margin - (-0.10)) / (0.20 + 0.10))
        burden = clamp01((metrics.fee_ratio + metrics.leak_ratio) / 0.06)
        burden_score = 1 - burden
        debt_score = 1 - clamp01(metrics.debt_ratio / 0.25)
        vol_score = 1 - clamp01(metrics.volatility / 0.30)
        risk_score = 1 - clamp01(metrics.nsf_count / 3)
        
        s = (
            40*margin_score +
            25*burden_score +
            15*debt_score +
            10*vol_score +
            10*risk_score
        )
        """
        # Margin: ideal >= 15%, maps -10%..20% -> 0..1
        margin = metrics.get('margin', 0)
        margin_score = self._clamp01((margin - (-0.10)) / (0.20 + 0.10))
        
        # Burden: lower is better
        fee_ratio = metrics.get('fee_ratio', 0)
        leak_ratio = metrics.get('leak_ratio', 0)
        burden = self._clamp01((fee_ratio + leak_ratio) / 0.06)  # 6% total burden is awful
        burden_score = 1 - burden
        
        # Debt: lower is better
        debt_ratio = metrics.get('debt_ratio', 0)
        debt_score = 1 - self._clamp01(debt_ratio / 0.25)  # 25% debt ratio is heavy
        
        # Volatility: lower is better
        volatility = metrics.get('volatility', 0)
        vol_score = 1 - self._clamp01(volatility / 0.30)  # 30% volatility is bad
        
        # Risk events: fewer is better
        nsf_count = metrics.get('nsf_count', 0)
        risk_score = 1 - self._clamp01(nsf_count / 3)
        
        # Weighted sum
        s = (
            40 * margin_score +
            25 * burden_score +
            15 * debt_score +
            10 * vol_score +
            10 * risk_score
        )
        
        return int(round(self._clamp(s, 0, 100)))
    
    def _calculate_component_scores(self, metrics: Dict[str, Any]) -> Dict[str, int]:
        """
        Calculate individual component scores for detailed breakdown
        """
        return {
            'profit_margin': int(round(self._clamp(metrics.get('margin', 0) * 100, 0, 100))),
            'fee_efficiency': int(round(100 - (metrics.get('fee_ratio', 0) * 100))),
            'debt_health': int(round(100 - (metrics.get('debt_ratio', 0) * 100))),
            'revenue_stability': int(round(100 - (metrics.get('volatility', 0) * 100))),
            'cash_efficiency': int(round(100 - (metrics.get('cash_intensity_flag', 0) * 50)))
        }
    
    def _get_risk_label(self, mismatch_score: int) -> str:
        """
        Get risk label from mismatch score
        
        High: 70–100
        Medium: 40–69
        Low: 0–39
        """
        if mismatch_score >= 70:
            return 'High'
        elif mismatch_score >= 40:
            return 'Medium'
        else:
            return 'Low'
    
    def _get_health_label(self, health_score: int) -> str:
        """
        Get health label from financial health score
        
        80–100: Healthy
        60–79: Needs optimization
        40–59: At risk
        0–39: Critical
        """
        if health_score >= 80:
            return 'Healthy'
        elif health_score >= 60:
            return 'Needs optimization'
        elif health_score >= 40:
            return 'At risk'
        else:
            return 'Critical'
    
    def get_score_explanation(self, score_type: str, score: int, metrics: Dict[str, Any]) -> str:
        """
        Generate human-readable explanation for a score
        """
        if score_type == 'mismatch':
            if score >= 70:
                return f"Your banking setup has significant mismatches (score: {score}). You're likely paying too much in fees and using the wrong account types."
            elif score >= 40:
                return f"Your banking setup has some mismatches (score: {score}). There are opportunities to optimize your accounts and reduce fees."
            else:
                return f"Your banking setup is well-matched to your needs (score: {score}). Keep monitoring for changes."
        
        elif score_type == 'financial_health':
            if score >= 80:
                return f"Your business is financially healthy (score: {score}). Strong profit margins and good financial management."
            elif score >= 60:
                return f"Your business needs some optimization (score: {score}). Good foundation but room for improvement."
            elif score >= 40:
                return f"Your business is at risk (score: {score}). Address leaks and improve cash flow."
            else:
                return f"Your business is in critical condition (score: {score}). Immediate action needed on expenses and cash flow."
        
        return f"Score: {score}"