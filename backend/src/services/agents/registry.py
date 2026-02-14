# services/agents/registry.py
"""Agent registry - defines all 61 agents"""

from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class AgentDefinition:
    """Agent definition"""
    id: str
    name: str
    category: str
    description: str
    triggers: List[str]
    inputs: List[str]
    outputs: List[str]

class AgentRegistry:
    """Registry of all 61 agents"""
    
    def __init__(self):
        self.agents = self._define_agents()
    
    def _define_agents(self) -> Dict[str, AgentDefinition]:
        """Define all 61 agents"""
        agents = {}
        
        # Onboarding Agents (12)
        agents["signup_intake"] = AgentDefinition(
            id="agent_001",
            name="Signup Intake Agent",
            category="onboarding",
            description="Creates user shell and starts onboarding",
            triggers=["user.signup.started"],
            inputs=["email", "password"],
            outputs=["user_id", "onboarding_step"]
        )
        
        agents["email_verification"] = AgentDefinition(
            id="agent_002",
            name="Email Verification Agent",
            category="onboarding",
            description="Verifies email address",
            triggers=["user.created"],
            inputs=["user_id", "email"],
            outputs=["email_verified", "verification_token"]
        )
        
        agents["business_profile"] = AgentDefinition(
            id="agent_003",
            name="Business Profile Agent",
            category="onboarding",
            description="Collects business information",
            triggers=["user.onboarding.step.business_profile"],
            inputs=["business_name", "entity_type", "industry"],
            outputs=["business_profile", "validation_result"]
        )
        
        agents["ein_collector"] = AgentDefinition(
            id="agent_004",
            name="EIN Collector Agent",
            category="onboarding",
            description="Collects and validates EIN",
            triggers=["user.onboarding.step.business_profile"],
            inputs=["ein", "business_name"],
            outputs=["ein_valid", "fraud_score"]
        )
        
        agents["ein_reuse_detector"] = AgentDefinition(
            id="agent_005",
            name="EIN Reuse Detector",
            category="security",
            description="Detects EIN reuse across accounts",
            triggers=["user.signup.completed"],
            inputs=["ein", "business_name"],
            outputs=["fraud_detected", "block_reason"]
        )
        
        agents["onboarding_progress"] = AgentDefinition(
            id="agent_006",
            name="Onboarding Progress Agent",
            category="onboarding",
            description="Tracks onboarding progress",
            triggers=["user.onboarding.step.*"],
            inputs=["user_id", "current_step"],
            outputs=["next_step", "completion_percentage"]
        )
        
        agents["consent_disclosure"] = AgentDefinition(
            id="agent_007",
            name="Consent & Disclosure Agent",
            category="onboarding",
            description="Manages legal consents",
            triggers=["user.onboarding.step.consent"],
            inputs=["user_id", "consent_types"],
            outputs=["consent_recorded", "disclosures_accepted"]
        )
        
        agents["role_permissions"] = AgentDefinition(
            id="agent_008",
            name="Role/Permissions Agent",
            category="identity",
            description="Manages user roles",
            triggers=["user.created", "business.created"],
            inputs=["user_id", "business_id"],
            outputs=["permissions_granted", "access_level"]
        )
        
        agents["profile_preferences"] = AgentDefinition(
            id="agent_009",
            name="Profile Preferences Agent",
            category="onboarding",
            description="Collects user preferences",
            triggers=["user.onboarding.step.preferences"],
            inputs=["goals", "risk_tolerance"],
            outputs=["preferences_saved"]
        )
        
        agents["outboarding_initiator"] = AgentDefinition(
            id="agent_010",
            name="Outboarding Initiator",
            category="onboarding",
            description="Handles account cancellation",
            triggers=["account.cancel.requested"],
            inputs=["reason", "feedback"],
            outputs=["cancellation_initiated", "export_scheduled"]
        )
        
        agents["data_export"] = AgentDefinition(
            id="agent_011",
            name="Data Export Agent",
            category="admin",
            description="Exports user data",
            triggers=["data.export.requested"],
            inputs=["user_id", "export_types"],
            outputs=["export_url", "expires_at"]
        )
        
        agents["deletion_retention"] = AgentDefinition(
            id="agent_012",
            name="Deletion/Retention Agent",
            category="security",
            description="Manages data retention",
            triggers=["data.retention.check"],
            inputs=["user_id", "retention_policy"],
            outputs=["deletion_scheduled"]
        )
        
        # Bank Agents (10)
        agents["bank_link_session"] = AgentDefinition(
            id="agent_013",
            name="Bank Link Session Agent",
            category="bank",
            description="Creates bank link session",
            triggers=["bank.link.start"],
            inputs=["user_id", "business_id"],
            outputs=["link_token", "session_id"]
        )
        
        agents["token_vault"] = AgentDefinition(
            id="agent_014",
            name="Token Vault Agent",
            category="security",
            description="Stores bank tokens securely",
            triggers=["bank.link.success"],
            inputs=["public_token"],
            outputs=["access_token_stored"]
        )
        
        agents["account_discovery"] = AgentDefinition(
            id="agent_015",
            name="Account Discovery Agent",
            category="bank",
            description="Discovers bank accounts",
            triggers=["bank.link.success"],
            inputs=["access_token"],
            outputs=["accounts_discovered", "primary_account"]
        )
        
        agents["data_sync_scheduler"] = AgentDefinition(
            id="agent_016",
            name="Data Sync Scheduler",
            category="bank",
            description="Schedules transaction syncs",
            triggers=["bank.link.success"],
            inputs=["business_id", "account_ids"],
            outputs=["sync_scheduled", "next_sync_time"]
        )
        
        agents["transaction_sync"] = AgentDefinition(
            id="agent_017",
            name="Transaction Sync Agent",
            category="bank",
            description="Syncs transactions from bank",
            triggers=["sync.job.triggered"],
            inputs=["access_token", "account_ids"],
            outputs=["transactions_synced"]
        )
        
        agents["merchant_normalization"] = AgentDefinition(
            id="agent_018",
            name="Merchant Normalization",
            category="bank",
            description="Normalizes merchant names",
            triggers=["transactions.synced"],
            inputs=["raw_transactions"],
            outputs=["normalized_transactions"]
        )
        
        agents["fee_tagging"] = AgentDefinition(
            id="agent_019",
            name="Fee Tagging Agent",
            category="bank",
            description="Tags fee transactions",
            triggers=["transactions.normalized"],
            inputs=["transactions"],
            outputs=["fee_transactions"]
        )
        
        agents["duplicate_gap_detection"] = AgentDefinition(
            id="agent_020",
            name="Duplicate/Gap Detection",
            category="bank",
            description="Detects data gaps",
            triggers=["transactions.synced"],
            inputs=["transactions", "sync_history"],
            outputs=["gaps_detected", "data_quality_score"]
        )
        
        agents["balance_snapshot"] = AgentDefinition(
            id="agent_021",
            name="Balance Snapshot Agent",
            category="bank",
            description="Captures balance snapshots",
            triggers=["periodic.balance_check"],
            inputs=["account_ids"],
            outputs=["balance_snapshots", "cash_position"]
        )
        
        agents["data_freshness_monitor"] = AgentDefinition(
            id="agent_022",
            name="Data Freshness Monitor",
            category="bank",
            description="Monitors sync freshness",
            triggers=["periodic.monitoring"],
            inputs=["sync_history"],
            outputs=["freshness_score", "alerts"]
        )
        
        # Leak Agents (12)
        agents["leak_detector"] = AgentDefinition(
            id="agent_023",
            name="Leak Detector Agent",
            category="leak",
            description="Core leak detection",
            triggers=["analysis.requested"],
            inputs=["transactions", "business_profile"],
            outputs=["leaks_found", "leak_categories"]
        )
        
        agents["fee_waste_quantifier"] = AgentDefinition(
            id="agent_024",
            name="Fee Waste Quantifier",
            category="leak",
            description="Quantifies fee waste",
            triggers=["leaks.found"],
            inputs=["fee_transactions"],
            outputs=["monthly_fee_waste", "annual_fee_waste"]
        )
        
        agents["subscription_waste"] = AgentDefinition(
            id="agent_025",
            name="Subscription Waste Agent",
            category="leak",
            description="Detects subscription waste",
            triggers=["leaks.found"],
            inputs=["recurring_transactions"],
            outputs=["subscription_waste", "duplicate_services"]
        )
        
        agents["payment_rails_mismatch"] = AgentDefinition(
            id="agent_026",
            name="Payment Rails Mismatch",
            category="leak",
            description="Detects payment method issues",
            triggers=["leaks.found"],
            inputs=["payment_methods", "transaction_patterns"],
            outputs=["mismatch_detected", "recommended_rails"]
        )
        
        agents["account_type_mismatch"] = AgentDefinition(
            id="agent_027",
            name="Account Type Mismatch",
            category="leak",
            description="Detects wrong account types",
            triggers=["leaks.found"],
            inputs=["account_types", "transaction_volume"],
            outputs=["mismatch_score", "recommended_account_type"]
        )
        
        agents["liquidity_risk"] = AgentDefinition(
            id="agent_028",
            name="Liquidity Risk Agent",
            category="scoring",
            description="Analyzes liquidity",
            triggers=["analysis.requested"],
            inputs=["cash_flow", "balances"],
            outputs=["liquidity_score", "runway_days"]
        )
        
        agents["pricing_pressure"] = AgentDefinition(
            id="agent_029",
            name="Pricing Pressure Agent",
            category="scoring",
            description="Analyzes margin pressure",
            triggers=["analysis.requested"],
            inputs=["revenue", "expenses"],
            outputs=["margin_pressure", "pricing_recommendations"]
        )
        
        agents["loan_burden"] = AgentDefinition(
            id="agent_030",
            name="Loan Burden Agent",
            category="scoring",
            description="Analyzes debt burden",
            triggers=["analysis.requested"],
            inputs=["loan_details", "cash_flow"],
            outputs=["debt_burden_score", "refinancing_options"]
        )
        
        agents["seasonality"] = AgentDefinition(
            id="agent_031",
            name="Seasonality Agent",
            category="scoring",
            description="Analyzes seasonal patterns",
            triggers=["analysis.requested"],
            inputs=["historical_transactions"],
            outputs=["seasonal_patterns", "cash_buffer_recommendation"]
        )
        
        agents["financial_health_score"] = AgentDefinition(
            id="agent_032",
            name="Financial Health Score",
            category="scoring",
            description="Calculates health score",
            triggers=["analysis.requested"],
            inputs=["all_metrics"],
            outputs=["health_score", "health_category"]
        )
        
        agents["mismatch_score"] = AgentDefinition(
            id="agent_033",
            name="Mismatch Score Agent",
            category="scoring",
            description="Calculates mismatch score",
            triggers=["analysis.requested"],
            inputs=["leaks", "business_profile"],
            outputs=["mismatch_score", "risk_label"]
        )
        
        agents["score_explainer"] = AgentDefinition(
            id="agent_034",
            name="Score Explainer Agent",
            category="scoring",
            description="Explains scores",
            triggers=["scores.calculated"],
            inputs=["scores", "metrics"],
            outputs=["score_explanations", "insights"]
        )
        
        # Recommendation Agents (12)
        agents["bank_fit_recommender"] = AgentDefinition(
            id="agent_035",
            name="Bank Fit Recommender",
            category="recommendation",
            description="Recommends banks",
            triggers=["analysis.completed"],
            inputs=["business_profile", "leaks", "location"],
            outputs=["bank_recommendations", "match_reasons"]
        )
        
        agents["bank_product_recommender"] = AgentDefinition(
            id="agent_036",
            name="Bank Product Recommender",
            category="recommendation",
            description="Recommends bank products",
            triggers=["analysis.completed"],
            inputs=["business_needs", "bank_options"],
            outputs=["product_recommendations", "feature_comparison"]
        )
        
        agents["negotiation_script"] = AgentDefinition(
            id="agent_037",
            name="Negotiation Script Agent",
            category="recommendation",
            description="Generates negotiation scripts",
            triggers=["fee_leaks.found"],
            inputs=["fee_details"],
            outputs=["negotiation_scripts", "talking_points"]
        )
        
        agents["government_resources"] = AgentDefinition(
            id="agent_038",
            name="Government Resources Agent",
            category="resource",
            description="Finds government programs",
            triggers=["analysis.completed"],
            inputs=["business_profile", "location"],
            outputs=["government_programs", "eligibility_status"]
        )
        
        agents["local_resource_finder"] = AgentDefinition(
            id="agent_039",
            name="Local Resource Finder",
            category="resource",
            description="Finds local resources",
            triggers=["analysis.completed"],
            inputs=["location", "business_type"],
            outputs=["local_resources", "contact_info"]
        )
        
        agents["compliance_guidance"] = AgentDefinition(
            id="agent_040",
            name="Compliance Guidance",
            category="resource",
            description="Provides compliance checklists",
            triggers=["business.created"],
            inputs=["business_type", "location"],
            outputs=["compliance_checklist", "filing_deadlines"]
        )
        
        agents["learning_path_general"] = AgentDefinition(
            id="agent_041",
            name="Learning Path General",
            category="learning",
            description="Creates general learning path",
            triggers=["user.onboarding.completed"],
            inputs=["business_type"],
            outputs=["learning_path", "modules"]
        )
        
        agents["learning_path_personalized"] = AgentDefinition(
            id="agent_042",
            name="Learning Path Personalized",
            category="learning",
            description="Creates personalized path",
            triggers=["analysis.completed"],
            inputs=["leaks", "scores", "preferences"],
            outputs=["personalized_path", "priority_modules"]
        )
        
        agents["operational_fixes"] = AgentDefinition(
            id="agent_043",
            name="Operational Fixes",
            category="recommendation",
            description="Recommends operational improvements",
            triggers=["analysis.completed"],
            inputs=["process_inefficiencies"],
            outputs=["operational_recommendations"]
        )
        
        agents["next_actions"] = AgentDefinition(
            id="agent_044",
            name="Next Actions Composer",
            category="recommendation",
            description="Creates next actions",
            triggers=["analysis.completed"],
            inputs=["recommendations", "priority"],
            outputs=["action_plan", "timeline"]
        )
        
        agents["resource_card_builder"] = AgentDefinition(
            id="agent_045",
            name="Resource Card Builder",
            category="resource",
            description="Builds UI-ready resource cards",
            triggers=["resources.found"],
            inputs=["resource_data"],
            outputs=["resource_cards", "display_rules"]
        )
        
        agents["evidence_explainer"] = AgentDefinition(
            id="agent_046",
            name="Evidence Explainer",
            category="recommendation",
            description="Explains evidence",
            triggers=["recommendations.generated"],
            inputs=["evidence"],
            outputs=["explanations", "contextual_insights"]
        )
        
        # Reporting Agents (7)
        agents["report_assembler"] = AgentDefinition(
            id="agent_047",
            name="Report Assembler",
            category="reporting",
            description="Assembles final report",
            triggers=["analysis.completed"],
            inputs=["all_findings", "scores"],
            outputs=["report_object"]
        )
        
        agents["narrative_summary"] = AgentDefinition(
            id="agent_048",
            name="Narrative Summary",
            category="reporting",
            description="Creates narrative summary",
            triggers=["report.assembled"],
            inputs=["report_data"],
            outputs=["executive_summary"]
        )
        
        agents["mismatch_explanation"] = AgentDefinition(
            id="agent_049",
            name="Mismatch Explanation",
            category="reporting",
            description="Explains mismatches",
            triggers=["report.assembled"],
            inputs=["mismatch_details"],
            outputs=["mismatch_explanation"]
        )
        
        agents["leak_list_formatter"] = AgentDefinition(
            id="agent_050",
            name="Leak List Formatter",
            category="reporting",
            description="Formats leak list",
            triggers=["report.assembled"],
            inputs=["leaks"],
            outputs=["formatted_leaks", "total_calculations"]
        )
        
        agents["recommendations_formatter"] = AgentDefinition(
            id="agent_051",
            name="Recommendations Formatter",
            category="reporting",
            description="Formats recommendations",
            triggers=["report.assembled"],
            inputs=["recommendations"],
            outputs=["formatted_recommendations"]
        )
        
        agents["export_generator"] = AgentDefinition(
            id="agent_052",
            name="Export Generator",
            category="reporting",
            description="Generates exports",
            triggers=["export.requested"],
            inputs=["report_data", "export_format"],
            outputs=["export_file", "download_url"]
        )
        
        agents["insight_consistency"] = AgentDefinition(
            id="agent_053",
            name="Insight Consistency",
            category="reporting",
            description="Ensures insight consistency",
            triggers=["report.finalized"],
            inputs=["report_data"],
            outputs=["consistency_report"]
        )
        
        # Billing Agents (6)
        agents["trial_lifecycle"] = AgentDefinition(
            id="agent_054",
            name="Trial Lifecycle",
            category="billing",
            description="Manages trial lifecycle",
            triggers=["trial.started"],
            inputs=["trial_details"],
            outputs=["trial_status", "reminders_scheduled"]
        )
        
        agents["feedback_gatekeeper"] = AgentDefinition(
            id="agent_055",
            name="Feedback Gatekeeper",
            category="billing",
            description="Manages feedback requirement",
            triggers=["trial.ended"],
            inputs=["feedback_status"],
            outputs=["requires_feedback", "block_status"]
        )
        
        agents["payment_authorization"] = AgentDefinition(
            id="agent_056",
            name="Payment Authorization",
            category="billing",
            description="Authorizes payments",
            triggers=["trial.started"],
            inputs=["payment_details"],
            outputs=["authorization_result"]
        )
        
        agents["payment_capture"] = AgentDefinition(
            id="agent_057",
            name="Payment Capture",
            category="billing",
            description="Captures payments",
            triggers=["payment.due"],
            inputs=["payment_method_id", "amount"],
            outputs=["payment_result", "receipt_url"]
        )
        
        agents["account_pause_lock"] = AgentDefinition(
            id="agent_058",
            name="Account Pause/Lock",
            category="billing",
            description="Pauses/locks accounts",
            triggers=["trial.ended.no_feedback"],
            inputs=["account_status"],
            outputs=["pause_status", "lock_status"]
        )
        
        agents["resignup_fraud"] = AgentDefinition(
            id="agent_059",
            name="Re-signup Fraud",
            category="security",
            description="Detects re-signup fraud",
            triggers=["user.signup.started"],
            inputs=["user_details", "business_details"],
            outputs=["fraud_detected", "block_reason"]
        )
        
        # Security Agents (4)
        agents["zero_trust_policy"] = AgentDefinition(
            id="agent_060",
            name="Zero Trust Policy",
            category="security",
            description="Enforces zero trust",
            triggers=["access.requested"],
            inputs=["user_context", "resource_type"],
            outputs=["access_granted", "permissions"]
        )
        
        agents["pii_redaction"] = AgentDefinition(
            id="agent_061",
            name="PII Redaction",
            category="security",
            description="Redacts PII",
            triggers=["log.generated", "export.created"],
            inputs=["raw_data"],
            outputs=["redacted_data", "compliance_check"]
        )
        
        agents["audit_log"] = AgentDefinition(
            id="agent_062",
            name="Audit Log Agent",
            category="security",
            description="Creates audit logs",
            triggers=["system.event", "user.action"],
            inputs=["event_data", "user_context"],
            outputs=["audit_entry", "anomaly_alerts"]
        )
        
        agents["data_retention"] = AgentDefinition(
            id="agent_063",
            name="Data Retention Agent",
            category="security",
            description="Manages data retention",
            triggers=["periodic.retention_check"],
            inputs=["data_types", "retention_policies"],
            outputs=["deletion_schedule", "compliance_status"]
        )
        
        # Voice Agent
        agents["voice_command"] = AgentDefinition(
            id="agent_064",
            name="Voice Command Processor",
            category="voice",
            description="Processes voice commands",
            triggers=["voice.command.received"],
            inputs=["audio_data", "user_context"],
            outputs=["command_parsed", "intent_detected"]
        )
        
        # Admin Agents
        agents["admin_dashboard"] = AgentDefinition(
            id="agent_065",
            name="Admin Dashboard Metrics",
            category="admin",
            description="Generates admin metrics",
            triggers=["periodic.metrics_refresh"],
            inputs=["system_data"],
            outputs=["dashboard_metrics", "anomaly_alerts"]
        )
        
        return agents
    
    def get_agent(self, agent_id: str) -> Optional[AgentDefinition]:
        """Get agent by ID"""
        return self.agents.get(agent_id)
    
    def get_agents_by_category(self, category: str) -> List[AgentDefinition]:
        """Get all agents in a category"""
        return [a for a in self.agents.values() if a.category == category]
    
    def get_agents_by_trigger(self, trigger: str) -> List[AgentDefinition]:
        """Get agents that respond to a trigger"""
        return [a for a in self.agents.values() if trigger in a.triggers]
    
    def list_all_agents(self) -> List[AgentDefinition]:
        """List all agents"""
        return list(self.agents.values())