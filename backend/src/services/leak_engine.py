# services/leak_engine.py
"""
Leak Detection Engine - Exactly matching the pseudocode requirements

Detects financial leaks:
- Monthly maintenance fees
- Cash deposit fees
- Wire/ACH fees
- ATM fees
- Overdraft/NSF fees
- Subscription waste
- Payment processor friction
- Account type mismatch
"""

import re
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from collections import defaultdict
import statistics
import logging

logger = logging.getLogger(__name__)

class LeakEngine:
    """
    Core leak detection engine with modular detectors.
    Implements the exact pseudocode structure from requirements.
    """
    
    def __init__(self):
        self.fee_keywords = [
            "fee", "service charge", "maintenance", "wire", "nsf",
            "overdraft", "monthly", "atm", "cash deposit", "penalty",
            "minimum balance", "account analysis", "return item",
            "stop payment", "account research", "inactivity"
        ]
        logger.info("Leak Engine initialized")
    
    def detect_leaks(self, txns: List[Dict], assessment: Dict = None, 
                    accounts: List[Dict] = None, window_days: int = 90) -> List[Dict]:
        """
        Main leak detection pipeline - exact match to pseudocode
        
        Args:
            txns: List of transactions
            assessment: Business assessment data
            accounts: Bank account metadata
            window_days: Analysis window in days
            
        Returns:
            List of ranked leak findings
        """
        if assessment is None:
            assessment = {}
        if accounts is None:
            accounts = []
            
        logger.info(f"Running leak detection on {len(txns)} transactions over {window_days} days")
        
        # Step 1: Normalize transactions
        norm = self._normalize(txns)
        
        # Step 2: Run all detectors
        findings = []
        findings += self._detect_monthly_maintenance(norm, accounts)
        findings += self._detect_cash_deposit_fees(norm, assessment, accounts)
        findings += self._detect_wire_ach_fees(norm)
        findings += self._detect_overdraft_nsf(norm)
        findings += self._detect_atm_fees(norm)
        findings += self._detect_subscription_waste(norm, assessment)
        findings += self._detect_processor_friction(norm, assessment)
        findings += self._detect_account_type_mismatch(norm, assessment, accounts)
        
        # Step 3: Cost and annualize
        findings = self._cost_and_annualize(findings, window_days)
        
        # Step 4: Rank findings
        findings = self._rank_findings(findings)
        
        logger.info(f"Leak detection complete: {len(findings)} leaks found")
        return findings
    
    def _normalize(self, txns: List[Dict]) -> List[Dict]:
        """
        Normalization layer - converts provider transactions into standardized format
        
        Steps:
        1. Standardize direction (debit/credit)
        2. Extract candidate fee transactions
        3. Add normalized categories
        """
        normalized = []
        
        for txn in txns:
            normalized_txn = txn.copy()
            
            # Standardize direction if not present
            if 'direction' not in txn:
                amount = abs(txn.get('amount', 0))
                # Assume positive = outflow (debit) for business accounts
                normalized_txn['direction'] = 'debit' if txn.get('amount', 0) > 0 else 'credit'
            
            # Get transaction name for keyword matching
            name = txn.get('name', '').lower()
            merchant = txn.get('merchant', '').lower()
            combined_text = f"{name} {merchant}"
            
            # Check if it's a fee transaction
            is_fee = any(keyword in combined_text for keyword in self.fee_keywords)
            normalized_txn['is_fee'] = is_fee
            
            # Categorize fee type if applicable
            if is_fee:
                if any(k in combined_text for k in ['monthly', 'maintenance', 'service charge']):
                    normalized_txn['fee_type'] = 'monthly_maintenance'
                elif 'cash deposit' in combined_text:
                    normalized_txn['fee_type'] = 'cash_deposit'
                elif any(k in combined_text for k in ['wire', 'ach', 'transfer']):
                    normalized_txn['fee_type'] = 'wire_ach'
                elif any(k in combined_text for k in ['overdraft', 'nsf', 'insufficient']):
                    normalized_txn['fee_type'] = 'overdraft_nsf'
                elif 'atm' in combined_text:
                    normalized_txn['fee_type'] = 'atm_fee'
            
            # Add absolute amount for calculations
            normalized_txn['amount_abs'] = abs(txn.get('amount', 0))
            
            normalized.append(normalized_txn)
        
        return normalized
    
    def _detect_monthly_maintenance(self, txns: List[Dict], accounts: List[Dict]) -> List[Dict]:
        """
        Detect monthly maintenance fees
        
        Looks for recurring monthly fees charged by the bank
        """
        findings = []
        
        # Group fees by account
        account_fees = defaultdict(list)
        
        for txn in txns:
            if txn.get('fee_type') == 'monthly_maintenance':
                account_id = txn.get('bank_account_id')
                if account_id:
                    account_fees[account_id].append(txn)
        
        for account_id, fees in account_fees.items():
            if len(fees) < 2:  # Need at least 2 months to detect pattern
                continue
            
            # Get account details
            account = next((a for a in accounts if a.get('id') == account_id), {})
            account_name = account.get('name', 'Unknown Account')
            
            # Group by month to check pattern
            monthly_totals = defaultdict(float)
            for fee in fees:
                month = fee.get('posted_at', '')[:7]  # YYYY-MM format
                if month:
                    monthly_totals[month] += fee.get('amount_abs', 0)
            
            # Need at least 2 months of fees
            if len(monthly_totals) < 2:
                continue
            
            # Calculate average monthly fee
            avg_monthly = statistics.mean(monthly_totals.values())
            
            # Determine severity based on monthly cost
            severity = 'low'
            if avg_monthly >= 250:
                severity = 'high'
            elif avg_monthly >= 50:
                severity = 'medium'
            
            # Create evidence object
            evidence = {
                'account_id': account_id,
                'account_name': account_name,
                'months_detected': list(monthly_totals.keys()),
                'monthly_amounts': {m: float(v) for m, v in monthly_totals.items()},
                'pattern': 'monthly' if len(monthly_totals) >= 2 else 'irregular'
            }
            
            findings.append({
                'code': 'MONTHLY_MAINTENANCE_FEE',
                'title': f'Monthly Account Maintenance Fee',
                'description': f'Your {account_name} charges a monthly maintenance fee of ${avg_monthly:.2f}. Many business accounts waive this fee with minimum balance or transaction volume.',
                'category': 'fees',
                'monthly_cost': avg_monthly,
                'annual_cost': avg_monthly * 12,
                'confidence': 0.9 if len(monthly_totals) >= 3 else 0.7,
                'severity': severity,
                'fix_complexity': 'easy',
                'requires_bank_change': False,
                'evidence': evidence
            })
        
        return findings
    
    def _detect_cash_deposit_fees(self, txns: List[Dict], assessment: Dict, accounts: List[Dict]) -> List[Dict]:
        """
        Detect cash deposit fees
        
        Identifies businesses that handle cash and are paying deposit fees
        """
        findings = []
        
        # Check if business handles cash
        uses_cash = False
        payment_methods = assessment.get('payment_methods', '')
        if isinstance(payment_methods, str):
            uses_cash = 'cash' in payment_methods.lower()
        elif isinstance(payment_methods, list):
            uses_cash = 'cash' in [p.lower() for p in payment_methods]
        
        # If not a cash business, skip
        if not uses_cash:
            return findings
        
        # Find cash deposit fees
        cash_fees = []
        for txn in txns:
            name = txn.get('name', '').lower()
            if 'cash deposit' in name and 'fee' in name:
                cash_fees.append(txn)
        
        if not cash_fees:
            return findings
        
        # Calculate total and monthly average
        total_fees = sum(t.get('amount_abs', 0) for t in cash_fees)
        monthly_estimate = total_fees / 3  # Assuming 90-day window
        
        # Find cash deposit transactions for evidence
        cash_deposits = []
        for txn in txns:
            name = txn.get('name', '').lower()
            if 'deposit' in name and txn.get('direction') == 'credit':
                cash_deposits.append(txn)
        
        # Determine severity
        severity = 'low'
        if monthly_estimate >= 250:
            severity = 'high'
        elif monthly_estimate >= 50:
            severity = 'medium'
        
        # Create evidence
        evidence = {
            'fee_count': len(cash_fees),
            'total_fees': float(total_fees),
            'deposit_count': len(cash_deposits),
            'avg_fee_per_deposit': float(total_fees / len(cash_fees)) if cash_fees else 0
        }
        
        findings.append({
            'code': 'CASH_DEPOSIT_FEES',
            'title': f'Cash Deposit Fees',
            'description': f'Your business handles cash and is paying ${monthly_estimate:.2f}/month in cash deposit fees. Many banks offer free cash deposits for business accounts.',
            'category': 'fees',
            'monthly_cost': monthly_estimate,
            'annual_cost': monthly_estimate * 12,
            'confidence': 0.8,
            'severity': severity,
            'fix_complexity': 'medium',
            'requires_bank_change': True,
            'evidence': evidence
        })
        
        return findings
    
    def _detect_wire_ach_fees(self, txns: List[Dict]) -> List[Dict]:
        """
        Detect wire and ACH transfer fees
        """
        findings = []
        
        wire_fees = []
        ach_fees = []
        
        for txn in txns:
            if txn.get('fee_type') == 'wire_ach':
                name = txn.get('name', '').lower()
                if 'wire' in name:
                    wire_fees.append(txn)
                else:
                    ach_fees.append(txn)
        
        # Process wire fees
        if wire_fees:
            total_wire_fees = sum(t.get('amount_abs', 0) for t in wire_fees)
            monthly_wire = total_wire_fees / 3
            
            severity = 'low'
            if monthly_wire >= 250:
                severity = 'high'
            elif monthly_wire >= 50:
                severity = 'medium'
            
            findings.append({
                'code': 'WIRE_TRANSFER_FEES',
                'title': f'Wire Transfer Fees',
                'description': f'You\'re paying ${monthly_wire:.2f}/month in wire transfer fees. Consider using ACH transfers or banks with free wires.',
                'category': 'fees',
                'monthly_cost': monthly_wire,
                'annual_cost': monthly_wire * 12,
                'confidence': 0.9,
                'severity': severity,
                'fix_complexity': 'medium',
                'requires_bank_change': True,
                'evidence': {
                    'fee_count': len(wire_fees),
                    'total_fees': float(total_wire_fees),
                    'avg_fee': float(total_wire_fees / len(wire_fees)) if wire_fees else 0
                }
            })
        
        # Process ACH fees
        if ach_fees:
            total_ach_fees = sum(t.get('amount_abs', 0) for t in ach_fees)
            monthly_ach = total_ach_fees / 3
            
            if monthly_ach > 10:  # Only report if significant
                severity = 'low'
                if monthly_ach >= 50:
                    severity = 'medium'
                
                findings.append({
                    'code': 'ACH_TRANSFER_FEES',
                    'title': f'ACH Transfer Fees',
                    'description': f'You\'re paying ${monthly_ach:.2f}/month in ACH transfer fees. Many business accounts offer free ACH.',
                    'category': 'fees',
                    'monthly_cost': monthly_ach,
                    'annual_cost': monthly_ach * 12,
                    'confidence': 0.85,
                    'severity': severity,
                    'fix_complexity': 'easy',
                    'requires_bank_change': True,
                    'evidence': {
                        'fee_count': len(ach_fees),
                        'total_fees': float(total_ach_fees),
                        'avg_fee': float(total_ach_fees / len(ach_fees)) if ach_fees else 0
                    }
                })
        
        return findings
    
    def _detect_overdraft_nsf(self, txns: List[Dict]) -> List[Dict]:
        """
        Detect overdraft and NSF (non-sufficient funds) fees
        """
        findings = []
        
        overdraft_fees = []
        
        for txn in txns:
            if txn.get('fee_type') == 'overdraft_nsf':
                overdraft_fees.append(txn)
        
        if not overdraft_fees:
            return findings
        
        total_fees = sum(t.get('amount_abs', 0) for t in overdraft_fees)
        monthly_estimate = total_fees / 3
        
        # Count occurrences
        occurrence_count = len(overdraft_fees)
        
        # Overdraft fees are always high severity - indicates cash flow problems
        findings.append({
            'code': 'OVERDRAFT_NSF_FEES',
            'title': f'Overdraft/NSF Fees',
            'description': f'Your account has been charged {occurrence_count} overdraft/NSF fees totaling ${monthly_estimate:.2f}/month. This indicates cash flow issues and expensive penalties.',
            'category': 'fees',
            'monthly_cost': monthly_estimate,
            'annual_cost': monthly_estimate * 12,
            'confidence': 0.95,
            'severity': 'high',
            'fix_complexity': 'hard',
            'requires_bank_change': False,
            'evidence': {
                'fee_count': occurrence_count,
                'total_fees': float(total_fees),
                'avg_fee': float(total_fees / occurrence_count) if overdraft_fees else 0
            }
        })
        
        return findings
    
    def _detect_atm_fees(self, txns: List[Dict]) -> List[Dict]:
        """
        Detect ATM withdrawal fees
        """
        findings = []
        
        atm_fees = []
        
        for txn in txns:
            if txn.get('fee_type') == 'atm_fee':
                atm_fees.append(txn)
        
        if not atm_fees:
            return findings
        
        total_fees = sum(t.get('amount_abs', 0) for t in atm_fees)
        monthly_estimate = total_fees / 3
        
        severity = 'low'
        if monthly_estimate >= 50:
            severity = 'medium'
        elif monthly_estimate >= 25:
            severity = 'low'
        
        findings.append({
            'code': 'ATM_FEES',
            'title': f'ATM Withdrawal Fees',
            'description': f'You\'re paying ${monthly_estimate:.2f}/month in ATM fees. Use in-network ATMs or switch to a bank that reimburses ATM fees.',
            'category': 'fees',
            'monthly_cost': monthly_estimate,
            'annual_cost': monthly_estimate * 12,
            'confidence': 0.9,
            'severity': severity,
            'fix_complexity': 'easy',
            'requires_bank_change': True,
            'evidence': {
                'fee_count': len(atm_fees),
                'total_fees': float(total_fees),
                'avg_fee': float(total_fees / len(atm_fees)) if atm_fees else 0
            }
        })
        
        return findings
    
    def _detect_subscription_waste(self, txns: List[Dict], assessment: Dict) -> List[Dict]:
        """
        Detect subscription waste and duplicate services
        """
        findings = []
        
        # Group transactions by merchant for recurring pattern detection
        merchant_groups = defaultdict(list)
        
        for txn in txns:
            if txn.get('direction') == 'debit':  # Outflows only
                merchant = txn.get('merchant') or txn.get('name')
                if merchant:
                    merchant_groups[merchant].append(txn)
        
        subscriptions = []
        
        for merchant, txns_list in merchant_groups.items():
            if len(txns_list) >= 2:  # Multiple occurrences
                # Check for regular intervals (monthly pattern)
                dates = []
                for txn in txns_list:
                    if 'posted_at' in txn:
                        try:
                            date_str = txn['posted_at']
                            if isinstance(date_str, str):
                                dates.append(datetime.fromisoformat(date_str.replace('Z', '+00:00')))
                        except (ValueError, TypeError):
                            continue
                
                if len(dates) >= 2:
                    dates.sort()
                    intervals = [(dates[i+1] - dates[i]).days for i in range(len(dates)-1)]
                    
                    # Check if monthly (20-40 day intervals)
                    if all(20 <= interval <= 40 for interval in intervals):
                        avg_amount = statistics.mean([abs(t.get('amount', 0)) for t in txns_list])
                        
                        # Check if this is a known business service
                        is_business_service = any(keyword in merchant.lower() for keyword in 
                            ['software', 'saas', 'subscription', 'monthly', 'cloud', 'app'])
                        
                        subscriptions.append({
                            'merchant': merchant,
                            'monthly_cost': avg_amount,
                            'transaction_count': len(txns_list),
                            'is_business_service': is_business_service
                        })
        
        if not subscriptions:
            return findings
        
        # Calculate total monthly subscription cost
        total_monthly = sum(s['monthly_cost'] for s in subscriptions)
        
        # Check for potential duplicates (similar services)
        service_categories = {
            'accounting': ['quickbooks', 'xero', 'freshbooks', 'wave'],
            'payroll': ['gusto', 'adp', 'paychex'],
            'payment': ['stripe', 'square', 'paypal'],
            'crm': ['salesforce', 'hubspot', 'pipedrive'],
            'marketing': ['mailchimp', 'constant contact', 'klaviyo']
        }
        
        duplicates = []
        for category, services in service_categories.items():
            category_subs = [s for s in subscriptions 
                           if any(service in s['merchant'].lower() for service in services)]
            if len(category_subs) > 1:
                duplicates.append({
                    'category': category,
                    'services': category_subs,
                    'total_cost': sum(s['monthly_cost'] for s in category_subs)
                })
        
        severity = 'low'
        if total_monthly >= 250:
            severity = 'high'
        elif total_monthly >= 100:
            severity = 'medium'
        
        findings.append({
            'code': 'SUBSCRIPTION_WASTE',
            'title': f'Subscription Waste',
            'description': f'You\'re spending ${total_monthly:.2f}/month on subscriptions. Review for unused or duplicate services.',
            'category': 'waste',
            'monthly_cost': total_monthly,
            'annual_cost': total_monthly * 12,
            'confidence': 0.7,
            'severity': severity,
            'fix_complexity': 'easy',
            'requires_bank_change': False,
            'evidence': {
                'subscriptions': subscriptions,
                'total_monthly': float(total_monthly),
                'duplicates_found': duplicates
            }
        })
        
        return findings
    
    def _detect_processor_friction(self, txns: List[Dict], assessment: Dict) -> List[Dict]:
        """
        Detect payment processor friction (cash-heavy, manual processes)
        """
        findings = []
        
        # Check payment methods from assessment
        payment_methods = assessment.get('payment_methods', '')
        if isinstance(payment_methods, str):
            methods = [m.strip().lower() for m in payment_methods.split(',')] if payment_methods else []
        elif isinstance(payment_methods, list):
            methods = [m.lower() for m in payment_methods]
        else:
            methods = []
        
        # Check for cash-heavy business
        if 'cash' in methods:
            # Count cash transactions
            cash_txns = []
            for txn in txns:
                name = txn.get('name', '').lower()
                if 'cash' in name or 'atm' in name:
                    cash_txns.append(txn)
            
            cash_ratio = len(cash_txns) / max(len(txns), 1)
            
            if cash_ratio > 0.3:  # More than 30% cash transactions
                findings.append({
                    'code': 'CASH_HEAVY_OPERATIONS',
                    'title': f'Cash-Heavy Operations',
                    'description': f'{cash_ratio*100:.0f}% of your transactions involve cash. This increases risk and reduces efficiency.',
                    'category': 'inefficiency',
                    'monthly_cost': 50,  # Estimated efficiency cost
                    'annual_cost': 600,
                    'confidence': 0.6,
                    'severity': 'medium' if cash_ratio > 0.5 else 'low',
                    'fix_complexity': 'hard',
                    'requires_bank_change': False,
                    'evidence': {
                        'cash_transaction_count': len(cash_txns),
                        'total_transactions': len(txns),
                        'cash_ratio': float(cash_ratio)
                    }
                })
        
        # Check for manual invoicing (proxied by lack of digital payment methods)
        digital_methods = ['card', 'ach', 'wire', 'online', 'paypal', 'stripe']
        has_digital = any(method in methods for method in digital_methods)
        
        if not has_digital and methods:  # Has payment methods but no digital
            findings.append({
                'code': 'MANUAL_PROCESSING',
                'title': f'Manual Payment Processing',
                'description': 'Your business relies on manual payment methods, which is inefficient and error-prone.',
                'category': 'inefficiency',
                'monthly_cost': 75,  # Estimated efficiency cost
                'annual_cost': 900,
                'confidence': 0.5,
                'severity': 'medium',
                'fix_complexity': 'medium',
                'requires_bank_change': False,
                'evidence': {
                    'payment_methods': methods,
                    'has_digital': False
                }
            })
        
        return findings
    
    def _detect_account_type_mismatch(self, txns: List[Dict], assessment: Dict, accounts: List[Dict]) -> List[Dict]:
        """
        Detect account type mismatch (business using personal accounts, wrong account tier)
        """
        findings = []
        
        # Check if using personal account for business
        bank_used = assessment.get('bank_used', '').lower()
        account_types = [a.get('type', '').lower() for a in accounts]
        account_subtypes = [a.get('subtype', '').lower() for a in accounts]
        
        is_personal_account = False
        if 'personal' in bank_used or 'chase' in bank_used:  # Chase as example
            # Check if it's a personal account type
            if 'checking' in account_subtypes and 'business' not in bank_used:
                is_personal_account = True
        
        if is_personal_account:
            findings.append({
                'code': 'PERSONAL_ACCOUNT_USAGE',
                'title': f'Using Personal Account for Business',
                'description': 'You appear to be using a personal bank account for business. This can cause tax issues, liability risks, and missing business features.',
                'category': 'mismatch',
                'monthly_cost': 100,  # Estimated cost of issues
                'annual_cost': 1200,
                'confidence': 0.8,
                'severity': 'high',
                'fix_complexity': 'medium',
                'requires_bank_change': True,
                'evidence': {
                    'bank_used': bank_used,
                    'account_types': account_types,
                    'account_subtypes': account_subtypes
                }
            })
        
        # Check transaction volume vs account tier
        transaction_count = len([t for t in txns if t.get('direction') == 'debit'])
        monthly_txns = transaction_count / 3  # Assuming 90-day window
        
        if monthly_txns > 100:  # High transaction volume
            # Check if account is basic (limited transactions)
            is_basic_account = any('basic' in a.get('name', '').lower() or 
                                  'free' in a.get('name', '').lower() 
                                  for a in accounts)
            
            if is_basic_account:
                findings.append({
                    'code': 'ACCOUNT_TIER_MISMATCH',
                    'title': f'Account Tier Mismatch',
                    'description': f'Your business processes {monthly_txns:.0f} transactions per month, but you have a basic account with limited transactions.',
                    'category': 'mismatch',
                    'monthly_cost': 50,  # Estimated excess fee cost
                    'annual_cost': 600,
                    'confidence': 0.7,
                    'severity': 'medium',
                    'fix_complexity': 'easy',
                    'requires_bank_change': True,
                    'evidence': {
                        'monthly_transactions': int(monthly_txns),
                        'account_tier': 'basic',
                        'recommended_tier': 'business'
                    }
                })
        
        return findings
    
    def _cost_and_annualize(self, findings: List[Dict], window_days: int) -> List[Dict]:
        """
        Calculate monthly and annual costs based on window
        
        monthly_cost = sum(fees) / months_in_window
        annual_cost = monthly_cost * 12
        """
        months_in_window = window_days / 30.0
        
        for finding in findings:
            if 'monthly_cost' in finding:
                # Already have monthly cost, just ensure annual is calculated
                finding['annual_cost'] = finding['monthly_cost'] * 12
            else:
                # Calculate from evidence if needed
                evidence = finding.get('evidence', {})
                total_fees = evidence.get('total_fees', 0)
                if total_fees and months_in_window > 0:
                    finding['monthly_cost'] = total_fees / months_in_window
                    finding['annual_cost'] = finding['monthly_cost'] * 12
        
        return findings
    
    def _rank_findings(self, findings: List[Dict]) -> List[Dict]:
        """
        Rank findings by:
        1. Monthly cost (descending)
        2. Confidence (descending)
        3. Severity (descending)
        """
        severity_weights = {'high': 3, 'medium': 2, 'low': 1}
        
        def ranking_key(finding):
            monthly_cost = finding.get('monthly_cost', 0)
            confidence = finding.get('confidence', 0)
            severity = finding.get('severity', 'low')
            
            return (
                -monthly_cost,  # Higher cost first
                -confidence,     # Higher confidence first
                -severity_weights.get(severity, 1)  # Higher severity first
            )
        
        return sorted(findings, key=ranking_key)
    
    def get_summary_stats(self, findings: List[Dict]) -> Dict[str, Any]:
        """Get summary statistics for findings"""
        if not findings:
            return {
                'total_leaks': 0,
                'total_monthly_cost': 0,
                'total_annual_cost': 0,
                'by_severity': {},
                'by_category': {}
            }
        
        total_monthly = sum(f.get('monthly_cost', 0) for f in findings)
        
        by_severity = {}
        by_category = {}
        
        for f in findings:
            severity = f.get('severity', 'unknown')
            by_severity[severity] = by_severity.get(severity, 0) + 1
            
            category = f.get('category', 'unknown')
            by_category[category] = by_category.get(category, 0) + 1
        
        return {
            'total_leaks': len(findings),
            'total_monthly_cost': float(total_monthly),
            'total_annual_cost': float(total_monthly * 12),
            'by_severity': by_severity,
            'by_category': by_category
        }