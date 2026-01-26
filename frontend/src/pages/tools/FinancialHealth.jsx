// frontend/src/pages/tools/FinancialHealth.jsx
import React, { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Legend,
} from "recharts";
import { toast } from "sonner";
import {
  Heart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Target,
  BarChart3,
  Lightbulb,
  Calculator,
  RefreshCw,
  TrendingDown,
  Shield,
  Users,
  Calendar,
  Building,
  Briefcase,
  Database,
  FileText,
  Share2,
  Filter,
  Clock,
  Target as TargetIcon,
  Globe,
  Cpu,
  BarChart as BarChartIcon,
  Lock,
  Users as UsersIcon,
  LineChart as LineChartIcon,
  Percent,
  Wallet,
  Save,
  Trash2,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { useData } from "../../context/DataContext";

const COLOR_SCHEME = {
  primary: "hsl(var(--primary))",
  primaryLight: "hsl(var(--primary-light))",
  secondary: "hsl(var(--secondary))",
  tertiary: "hsl(var(--tertiary))",
  light: "hsl(var(--light))",
  success: "hsl(var(--success))",
  warning: "hsl(var(--warning))",
  danger: "hsl(var(--danger))",
  info: "hsl(var(--info))",
  gold: "#D4AF37",
};

const CHART_COLORS = {
  revenue: COLOR_SCHEME.gold,
  expenses: COLOR_SCHEME.primary,
  net: COLOR_SCHEME.success,
  cash: COLOR_SCHEME.info,
  debt: COLOR_SCHEME.warning,
  margin: COLOR_SCHEME.success,
  runway: COLOR_SCHEME.info,
  debtLoad: COLOR_SCHEME.warning,
};

// REPLACE your existing INDUSTRY_BENCHMARKS with this (ONLY adds the full category list)

const INDUSTRY_BENCHMARKS = {
  // Core Small Business Categories
  saas: { margin: 0.25, runway: 18, debtLoad: 0.2, churn: 0.05, name: "SaaS / Software" },
  ecommerce: { margin: 0.15, runway: 6, debtLoad: 0.3, churn: 0.15, name: "E-commerce" },
  retail: { margin: 0.08, runway: 4, debtLoad: 0.35, churn: 0.12, name: "Retail (Brick & Mortar)" },
  manufacturing: { margin: 0.12, runway: 9, debtLoad: 0.4, churn: 0.08, name: "Manufacturing" },
  wholesale_distribution: { margin: 0.10, runway: 7, debtLoad: 0.35, churn: 0.10, name: "Wholesale / Distribution" },
  professional_services: { margin: 0.20, runway: 8, debtLoad: 0.15, churn: 0.06, name: "Professional Services" },
  consulting: { margin: 0.35, runway: 12, debtLoad: 0.1, churn: 0.02, name: "Consulting" },
  marketing_advertising: { margin: 0.22, runway: 10, debtLoad: 0.15, churn: 0.08, name: "Marketing / Advertising" },
  it_services_managed: { margin: 0.18, runway: 9, debtLoad: 0.2, churn: 0.07, name: "IT Services / Managed Services" },
  fintech: { margin: 0.28, runway: 15, debtLoad: 0.25, churn: 0.03, name: "FinTech" },
  healthtech: { margin: 0.22, runway: 20, debtLoad: 0.15, churn: 0.04, name: "HealthTech" },
  healthcare_services: { margin: 0.14, runway: 10, debtLoad: 0.3, churn: 0.05, name: "Healthcare Services (Clinics, Practices)" },
  construction: { margin: 0.10, runway: 5, debtLoad: 0.45, churn: 0.09, name: "Construction" },
  real_estate: { margin: 0.16, runway: 8, debtLoad: 0.4, churn: 0.06, name: "Real Estate (Brokerage, Property Management)" },
  logistics_transportation: { margin: 0.08, runway: 4, debtLoad: 0.5, churn: 0.08, name: "Logistics / Transportation" },
  trucking: { margin: 0.07, runway: 4, debtLoad: 0.55, churn: 0.08, name: "Trucking" },
  warehousing_fulfillment: { margin: 0.09, runway: 6, debtLoad: 0.45, churn: 0.07, name: "Warehousing / Fulfillment" },

  // Consumer-Facing Services
  restaurants_food_service: { margin: 0.06, runway: 3, debtLoad: 0.5, churn: 0.12, name: "Restaurants / Food Service" },
  cafes_coffee_shops: { margin: 0.08, runway: 3, debtLoad: 0.45, churn: 0.12, name: "Cafés / Coffee Shops" },
  food_trucks: { margin: 0.07, runway: 3, debtLoad: 0.4, churn: 0.14, name: "Food Trucks" },
  hospitality: { margin: 0.10, runway: 6, debtLoad: 0.55, churn: 0.08, name: "Hospitality (Hotels, Short-Stay Operators)" },
  personal_care: { margin: 0.18, runway: 6, debtLoad: 0.25, churn: 0.08, name: "Personal Care (Salon, Barber, Spa)" },
  fitness_wellness: { margin: 0.16, runway: 6, debtLoad: 0.3, churn: 0.10, name: "Fitness / Wellness" },
  childcare_education: { margin: 0.12, runway: 7, debtLoad: 0.35, churn: 0.06, name: "Childcare / Education Services" },
  cleaning_janitorial: { margin: 0.14, runway: 6, debtLoad: 0.2, churn: 0.08, name: "Cleaning / Janitorial Services" },
  home_services: { margin: 0.15, runway: 6, debtLoad: 0.3, churn: 0.07, name: "Home Services (Plumbing, HVAC, Electrical)" },
  landscaping_lawn: { margin: 0.12, runway: 5, debtLoad: 0.3, churn: 0.08, name: "Landscaping / Lawn Care" },
  pest_control: { margin: 0.14, runway: 6, debtLoad: 0.25, churn: 0.07, name: "Pest Control" },

  // Trades & Specialized Operations
  auto_repair_body: { margin: 0.12, runway: 5, debtLoad: 0.35, churn: 0.07, name: "Auto Repair / Body Shop" },
  equipment_rental: { margin: 0.14, runway: 7, debtLoad: 0.5, churn: 0.06, name: "Equipment Rental" },
  printing_signage: { margin: 0.12, runway: 6, debtLoad: 0.35, churn: 0.08, name: "Printing / Signage" },
  construction_subcontractor: { margin: 0.10, runway: 5, debtLoad: 0.45, churn: 0.09, name: "Construction Subcontractor" },
  maintenance_repair: { margin: 0.13, runway: 6, debtLoad: 0.3, churn: 0.07, name: "Maintenance & Repair Services" },
  security_services: { margin: 0.11, runway: 6, debtLoad: 0.3, churn: 0.06, name: "Security Services" },

  // Creative & Digital
  media_content_creation: { margin: 0.20, runway: 8, debtLoad: 0.2, churn: 0.09, name: "Media / Content Creation" },
  design_creative_studio: { margin: 0.22, runway: 9, debtLoad: 0.15, churn: 0.08, name: "Design / Creative Studio" },
  photography_videography: { margin: 0.18, runway: 7, debtLoad: 0.2, churn: 0.10, name: "Photography / Videography" },
  publishing_education_products: { margin: 0.24, runway: 10, debtLoad: 0.2, churn: 0.08, name: "Publishing / Education Products" },

  // Finance & Advisory
  accounting_bookkeeping: { margin: 0.28, runway: 10, debtLoad: 0.1, churn: 0.04, name: "Accounting / Bookkeeping" },
  tax_services: { margin: 0.30, runway: 9, debtLoad: 0.1, churn: 0.05, name: "Tax Services" },
  financial_advisory_nonbank: { margin: 0.26, runway: 10, debtLoad: 0.12, churn: 0.04, name: "Financial Advisory (Non-Bank)" },
  insurance_brokerage: { margin: 0.20, runway: 9, debtLoad: 0.15, churn: 0.05, name: "Insurance Brokerage" },

  // Other / Catch-All
  nonprofit_social: { margin: 0.08, runway: 8, debtLoad: 0.2, churn: 0.03, name: "Nonprofit / Social Enterprise" },
  franchise_operator: { margin: 0.10, runway: 6, debtLoad: 0.45, churn: 0.08, name: "Franchise Operator" },
  import_export: { margin: 0.11, runway: 7, debtLoad: 0.4, churn: 0.07, name: "Import / Export" },
  other: { margin: 0.15, runway: 6, debtLoad: 0.3, churn: 0.08, name: "Other" },
};

const formatCurrency = (value, compact = false) => {
  if (value === 0 || !value) return "$0";
  if (compact) {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
};

const formatPercent = (value) => {
  if (!value && value !== 0) return "0%";
  return `${(value * 100).toFixed(1)}%`;
};

export default function FinancialHealth() {
  const {
    healthInputs,
    updateHealthInputs,
    healthHistory,
    addHealthHistory,
    computeHealthScore,
    healthLabel,
    clearHealthData,
  } = useData();

  const [formData, setFormData] = useState({
    revenue: "",
    expenses: "",
    debt: "",
    cash: "",
    industry: "saas",
    teamSize: "",
    customers: "",
    companyName: "",
    location: "",
  });

  const [activeView, setActiveView] = useState("input");
  const [isCalculating, setIsCalculating] = useState(false);
  const [timeframe, setTimeframe] = useState("monthly");
  const [comparisonMode, setComparisonMode] = useState("industry");
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState("saas");

  const calcTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (calcTimerRef.current) clearTimeout(calcTimerRef.current);
    };
  }, []);

  const metrics = useMemo(() => {
    const revenue = Number(formData.revenue || 0);
    const expenses = Number(formData.expenses || 0);
    const debt = Number(formData.debt || 0);
    const cash = Number(formData.cash || 0);
    const customers = Number(formData.customers || 1);
    const teamSize = Number(formData.teamSize || 1);

    const netProfit = revenue - expenses;
    const profitMargin = revenue > 0 ? netProfit / revenue : 0;
    const burnRate = Math.max(0, expenses - revenue);
    const monthlyBurn = burnRate > 0 ? burnRate : expenses / 12;
    const runway = monthlyBurn > 0 ? cash / monthlyBurn : (cash > 0 ? 999 : 0);
    const debtToRevenue = revenue > 0 ? debt / revenue : (debt > 0 ? 1 : 0);
    const arpu = customers > 0 ? revenue / customers : 0;
    const cac = customers > 0 ? (expenses * 0.3) / customers : 0;
    const ltv = arpu > 0 ? arpu * 12 * 3 : 0;
    const ltvCacRatio = cac > 0 ? ltv / cac : 0;
    const employeeProductivity = teamSize > 0 ? revenue / teamSize : 0;
    const revenuePerEmployee = teamSize > 0 ? (revenue * 12) / teamSize : 0;

    return {
      revenue,
      expenses,
      debt,
      cash,
      customers,
      teamSize,
      netProfit,
      profitMargin,
      burnRate,
      runway: Math.min(runway, 999),
      debtToRevenue,
      arpu,
      cac,
      ltv,
      ltvCacRatio,
      employeeProductivity,
      revenuePerEmployee,
      hasData: revenue > 0 || expenses > 0 || debt > 0 || cash > 0,
    };
  }, [formData]);

  const kpiMetrics = useMemo(() => {
    if (!metrics.hasData) return [];
    
    return [
      {
        id: "mrr",
        label: "Monthly Revenue",
        value: formatCurrency(metrics.revenue, true),
        rawValue: metrics.revenue,
        change: null,
        icon: DollarSign,
        color: COLOR_SCHEME.gold,
        description: "Total monthly revenue",
      },
      {
        id: "netProfit",
        label: "Net Profit/Loss",
        value: formatCurrency(metrics.netProfit, true),
        rawValue: metrics.netProfit,
        change: null,
        icon: metrics.netProfit >= 0 ? TrendingUp : TrendingDown,
        color: metrics.netProfit >= 0 ? COLOR_SCHEME.success : COLOR_SCHEME.danger,
        description: "Revenue minus expenses",
      },
      {
        id: "margin",
        label: "Profit Margin",
        value: formatPercent(metrics.profitMargin),
        rawValue: metrics.profitMargin,
        change: null,
        icon: Percent,
        color: metrics.profitMargin >= 0.2 ? COLOR_SCHEME.success : metrics.profitMargin >= 0.1 ? COLOR_SCHEME.warning : COLOR_SCHEME.danger,
        description: "Net profit as % of revenue",
      },
      {
        id: "runway",
        label: "Runway",
        value: metrics.runway >= 999 ? "∞" : `${metrics.runway.toFixed(1)} mo`,
        rawValue: metrics.runway,
        change: null,
        icon: Calendar,
        color: metrics.runway >= 12 ? COLOR_SCHEME.success : metrics.runway >= 6 ? COLOR_SCHEME.warning : COLOR_SCHEME.danger,
        description: "Months of cash remaining",
      },
      {
        id: "arpu",
        label: "ARPU",
        value: formatCurrency(metrics.arpu),
        rawValue: metrics.arpu,
        change: null,
        icon: UsersIcon,
        color: COLOR_SCHEME.info,
        description: "Avg revenue per customer",
      },
      {
        id: "ltv_cac",
        label: "LTV:CAC Ratio",
        value: metrics.ltvCacRatio > 0 ? `${metrics.ltvCacRatio.toFixed(1)}x` : "N/A",
        rawValue: metrics.ltvCacRatio,
        change: null,
        icon: TargetIcon,
        color: metrics.ltvCacRatio >= 3 ? COLOR_SCHEME.success : metrics.ltvCacRatio >= 1 ? COLOR_SCHEME.warning : COLOR_SCHEME.danger,
        description: "Customer value vs acquisition cost",
      },
    ];
  }, [metrics]);

  const enterpriseKPIs = useMemo(() => {
    if (!metrics.hasData) return [];
    
    return [
      {
        id: "profitability",
        label: "Profitability",
        value: Math.min(100, Math.max(0, (metrics.profitMargin + 0.5) * 100)),
        target: 85,
        status: metrics.profitMargin > 0.2 ? "exceeds" : metrics.profitMargin > 0.1 ? "meets" : "below",
      },
      {
        id: "efficiency",
        label: "Efficiency",
        value: Math.min(100, Math.max(0, metrics.revenue > 0 ? (1 - metrics.expenses / metrics.revenue) * 100 + 50 : 0)),
        target: 75,
        status: metrics.expenses / Math.max(1, metrics.revenue) < 0.7 ? "exceeds" : metrics.expenses / Math.max(1, metrics.revenue) < 0.85 ? "meets" : "below",
      },
      {
        id: "liquidity",
        label: "Liquidity",
        value: Math.min(100, Math.max(0, (metrics.runway / 24) * 100)),
        target: 80,
        status: metrics.runway > 12 ? "exceeds" : metrics.runway > 6 ? "meets" : "below",
      },
      {
        id: "growth",
        label: "Growth Ready",
        value: Math.min(100, Math.max(0, metrics.netProfit > 0 ? 70 + (metrics.profitMargin * 100) : 30)),
        target: 70,
        status: metrics.netProfit > metrics.revenue * 0.15 ? "exceeds" : metrics.netProfit > 0 ? "meets" : "below",
      },
    ];
  }, [metrics]);

  const comparisonData = useMemo(() => {
    const benchmark = INDUSTRY_BENCHMARKS[selectedIndustry] || INDUSTRY_BENCHMARKS.saas;
    return [
      { metric: "Profit Margin", you: metrics.profitMargin * 100, industry: benchmark.margin * 100, unit: "%" },
      { metric: "Runway (months)", you: Math.min(metrics.runway, 36), industry: benchmark.runway, unit: "mo" },
      { metric: "Debt Load", you: metrics.debtToRevenue * 100, industry: benchmark.debtLoad * 100, unit: "%" },
    ];
  }, [metrics, selectedIndustry]);

  const radarData = useMemo(() => {
    const benchmark = INDUSTRY_BENCHMARKS[selectedIndustry] || INDUSTRY_BENCHMARKS.saas;
    return [
      { metric: "Profitability", you: Math.max(0, (metrics.profitMargin + 0.5) * 100), industry: (benchmark.margin + 0.5) * 100 },
      { metric: "Efficiency", you: Math.max(0, metrics.revenue > 0 ? (1 - metrics.expenses / metrics.revenue) * 100 + 50 : 50), industry: 75 },
      { metric: "Liquidity", you: Math.min(100, (metrics.runway / 24) * 100), industry: (benchmark.runway / 24) * 100 },
      { metric: "Growth", you: Math.max(0, metrics.netProfit > 0 ? 70 + (metrics.profitMargin * 50) : 30), industry: 70 },
      { metric: "Stability", you: Math.max(0, (1 - Math.min(1, metrics.debtToRevenue)) * 100), industry: (1 - benchmark.debtLoad) * 100 },
    ];
  }, [metrics, selectedIndustry]);

  const trendData = useMemo(() => {
    if (!metrics.hasData) return [];
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentMonth = new Date().getMonth();
    
    return monthNames.map((_, idx) => ({
      month: monthNames[(currentMonth - 5 + idx + 12) % 12],
      revenue: Math.round(metrics.revenue * (0.9 + idx * 0.04)),
      expenses: Math.round(metrics.expenses * (0.92 + idx * 0.02)),
      profit: Math.round(metrics.netProfit * (0.85 + idx * 0.05)),
    }));
  }, [metrics]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const inputs = {
      revenue: Number(formData.revenue || 0),
      expenses: Number(formData.expenses || 0),
      debt: Number(formData.debt || 0),
      cash: Number(formData.cash || 0),
      industry: formData.industry,
      teamSize: Number(formData.teamSize || 0),
      customers: Number(formData.customers || 0),
      companyName: formData.companyName,
      location: formData.location,
    };

    if (!inputs.revenue && !inputs.expenses && !inputs.debt && !inputs.cash) {
      toast.error("Cannot save empty data", {
        description: "Please enter financial data first",
      });
      return;
    }

    updateHealthInputs(inputs);
    toast.success("Data saved successfully", {
      description: "Your financial data has been saved to history",
    });
  };

  const handleClearInputs = () => {
    setFormData({
      revenue: "",
      expenses: "",
      debt: "",
      cash: "",
      industry: "saas",
      teamSize: "",
      customers: "",
      companyName: "",
      location: "",
    });
    toast.info("Inputs cleared", {
      description: "Unsaved data has been cleared",
    });
  };

  const handleDeleteSavedData = () => {
    clearHealthData();
    setFormData({
      revenue: "",
      expenses: "",
      debt: "",
      cash: "",
      industry: "saas",
      teamSize: "",
      customers: "",
      companyName: "",
      location: "",
    });
    setActiveView("input");
    toast.success("All data deleted", {
      description: "Saved data and history have been cleared",
    });
  };

  const handleCalculate = () => {
    if (isCalculating) return;

    const inputs = {
      revenue: Number(formData.revenue || 0),
      expenses: Number(formData.expenses || 0),
      debt: Number(formData.debt || 0),
      cash: Number(formData.cash || 0),
      industry: formData.industry,
      teamSize: Number(formData.teamSize || 0),
      customers: Number(formData.customers || 0),
      companyName: formData.companyName,
      location: formData.location,
    };

    if (!inputs.revenue && !inputs.expenses && !inputs.debt && !inputs.cash) {
      toast.error("Please enter financial data", {
        description: "At least one financial metric is required",
      });
      return;
    }

    if (calcTimerRef.current) clearTimeout(calcTimerRef.current);

    setIsCalculating(true);
    calcTimerRef.current = setTimeout(() => {
      try {
        const result = computeHealthScore(inputs);
        addHealthHistory(result.score);

        toast.success("Analysis Complete", {
          description: `Financial Health Score: ${result.score}/100`,
        });

        setActiveView("dashboard");
      } catch (error) {
        toast.error("Analysis Failed", {
          description: error.message || "Please check your inputs",
        });
      } finally {
        setIsCalculating(false);
        calcTimerRef.current = null;
      }
    }, 800);
  };

  const handleExportReport = (format = "pdf") => {
    if (!metrics.hasData) {
      toast.error("No data to export", { description: "Please enter financial data first" });
      return;
    }
    
    const reportData = {
      company: formData.companyName || "Your Company",
      industry: INDUSTRY_BENCHMARKS[formData.industry]?.name || formData.industry,
      date: new Date().toISOString(),
      metrics: {
        revenue: metrics.revenue,
        expenses: metrics.expenses,
        netProfit: metrics.netProfit,
        profitMargin: metrics.profitMargin,
        runway: metrics.runway,
        debtToRevenue: metrics.debtToRevenue,
      },
    };
    
    console.log("Export data:", reportData);
    toast.success(`Report exported as ${format.toUpperCase()}`, {
      description: "Your financial report is ready for download",
    });
  };

  const handleShareAnalysis = () => {
    if (!metrics.hasData) {
      toast.error("No analysis to share", { description: "Please run an analysis first" });
      return;
    }
    navigator.clipboard?.writeText(window.location.href);
    toast.info("Share link copied", {
      description: "Analysis link copied to clipboard",
    });
  };

  const handleSetAlert = () => {
    setAlertsEnabled(!alertsEnabled);
    toast.success(alertsEnabled ? "Alerts disabled" : "Alerts enabled", {
      description: "You'll be notified when metrics change significantly",
    });
  };

  const quickInsights = useMemo(() => {
    if (!metrics.hasData) return [];
    
    const insights = [];
    const benchmark = INDUSTRY_BENCHMARKS[selectedIndustry] || INDUSTRY_BENCHMARKS.saas;
    
    if (metrics.profitMargin < 0) {
      insights.push({
        title: "Operating at a Loss",
        description: `Your expenses exceed revenue by ${formatCurrency(Math.abs(metrics.netProfit))}. Immediate action required.`,
        severity: "critical",
        action: "Review Cost Structure",
        impact: "Survival",
        timeframe: "Immediate",
      });
    } else if (metrics.profitMargin < benchmark.margin * 0.5) {
      insights.push({
        title: "Below Industry Margin",
        description: `Your ${formatPercent(metrics.profitMargin)} margin is below the ${formatPercent(benchmark.margin)} industry average.`,
        severity: "high",
        action: "Optimize Pricing",
        impact: "Profitability",
        timeframe: "1-3 months",
      });
    } else if (metrics.profitMargin > benchmark.margin * 1.5) {
      insights.push({
        title: "Strong Profit Margin",
        description: `Your ${formatPercent(metrics.profitMargin)} margin exceeds the industry average of ${formatPercent(benchmark.margin)}.`,
        severity: "positive",
        action: "Reinvest for Growth",
        impact: "Growth",
        timeframe: "Strategic",
      });
    }
    
    if (metrics.burnRate > 0 && metrics.runway < 3) {
      insights.push({
        title: "Critical: Low Runway",
        description: `Only ${metrics.runway.toFixed(1)} months of cash remaining at current burn rate.`,
        severity: "critical",
        action: "Extend Runway Now",
        impact: "Survival",
        timeframe: "Immediate",
      });
    } else if (metrics.burnRate > 0 && metrics.runway < 6) {
      insights.push({
        title: "Short Runway Warning",
        description: `${metrics.runway.toFixed(1)} months runway. Consider fundraising or cost reduction.`,
        severity: "high",
        action: "Plan Fundraise",
        impact: "Sustainability",
        timeframe: "1-2 months",
      });
    }
    
    if (metrics.debtToRevenue > 0.6) {
      insights.push({
        title: "High Debt Load",
        description: `Debt is ${formatPercent(metrics.debtToRevenue)} of revenue. Industry avg: ${formatPercent(benchmark.debtLoad)}.`,
        severity: "high",
        action: "Debt Restructuring",
        impact: "Financial Risk",
        timeframe: "3-6 months",
      });
    } else if (metrics.debtToRevenue > benchmark.debtLoad) {
      insights.push({
        title: "Above Average Debt",
        description: `Debt ratio of ${formatPercent(metrics.debtToRevenue)} exceeds industry average.`,
        severity: "medium",
        action: "Monitor Debt Levels",
        impact: "Financial Health",
        timeframe: "6 months",
      });
    }
    
    if (metrics.ltvCacRatio > 0 && metrics.ltvCacRatio < 1) {
      insights.push({
        title: "Unsustainable Unit Economics",
        description: `LTV:CAC of ${metrics.ltvCacRatio.toFixed(1)}x means you're losing money on each customer.`,
        severity: "critical",
        action: "Fix Unit Economics",
        impact: "Business Model",
        timeframe: "Immediate",
      });
    } else if (metrics.ltvCacRatio > 0 && metrics.ltvCacRatio < 3) {
      insights.push({
        title: "Improve Unit Economics",
        description: `LTV:CAC of ${metrics.ltvCacRatio.toFixed(1)}x is below the ideal 3x benchmark.`,
        severity: "medium",
        action: "Reduce CAC or Increase LTV",
        impact: "Growth Efficiency",
        timeframe: "3-6 months",
      });
    }
    
    if (metrics.revenuePerEmployee > 0 && metrics.revenuePerEmployee < 100000) {
      insights.push({
        title: "Low Revenue per Employee",
        description: `${formatCurrency(metrics.revenuePerEmployee, true)}/employee annually. Consider automation or team optimization.`,
        severity: "low",
        action: "Improve Productivity",
        impact: "Efficiency",
        timeframe: "6-12 months",
      });
    }
    
    return insights;
  }, [metrics, selectedIndustry]);

  const chartData = (healthHistory || []).map((h) => {
    const d = new Date(h.t);
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      score: h.score,
    };
  });

  const currentScore = useMemo(() => {
    if (typeof computeHealthScore === "function" && metrics.hasData) {
      const inputs = {
        revenue: metrics.revenue,
        expenses: metrics.expenses,
        debt: metrics.debt,
        cash: metrics.cash,
      };
      const result = computeHealthScore(inputs);
      return result?.score || 0;
    }
    return 0;
  }, [metrics, computeHealthScore]);

  const getHealthBadgeColor = (score) => {
    if (score >= 80) return "bg-success/20 text-success border-success/30";
    if (score >= 60) return "bg-warning/20 text-warning border-warning/30";
    return "bg-destructive/20 text-destructive border-destructive/30";
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/10 border-destructive/20';
      case 'high': return 'bg-warning/10 border-warning/20';
      case 'positive': return 'bg-success/10 border-success/20';
      default: return 'bg-success/10 border-success/20';
    }
  };

  return (
    <DashboardLayout 
      title="FinHealth" 
      subtitle="Comprehensive financial intelligence for your business"
    >
      <style>{`
        .hero-gradient {
          background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-light)) 100%);
        }

        .btn-primary {
          background: hsl(var(--primary)) !important;
          color: hsl(var(--light)) !important;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: hsl(var(--primary-light)) !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(var(--primary-rgb), 0.3);
        }

        .btn-secondary {
          border: 2px solid hsl(var(--primary)) !important;
          color: hsl(var(--primary)) !important;
          background: transparent !important;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: hsl(var(--primary)) !important;
          color: hsl(var(--light)) !important;
        }

        .achievement-card {
          border-left: 4px solid hsl(var(--primary)) !important;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.05) 0%, rgba(var(--primary-light-rgb), 0.05) 100%);
        }

        .stats-card {
          background: hsl(var(--card-bg)) !important;
          color: hsl(var(--card-text)) !important;
          border: 1px solid hsl(var(--border)) !important;
          transition: all 0.3s ease;
        }

        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .progress-gradient {
          background: linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary-light)) 100%);
        }

        .chart-container {
          background: hsl(var(--card-bg)) !important;
          color: hsl(var(--card-text)) !important;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .health-score-card {
          background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.1) 0%, rgba(var(--primary-light-rgb), 0.1) 100%);
          border: 2px solid rgba(var(--primary-rgb), 0.2);
          color: hsl(var(--card-text));
        }

        .metric-card-green {
          background: linear-gradient(135deg, rgba(var(--success-rgb), 0.1) 0%, rgba(var(--success-light-rgb), 0.1) 100%);
          border: 1px solid rgba(var(--success-rgb), 0.2);
          color: hsl(var(--card-text));
        }

        .metric-card-blue {
          background: linear-gradient(135deg, rgba(var(--info-rgb), 0.1) 0%, rgba(var(--info-light-rgb), 0.1) 100%);
          border: 1px solid rgba(var(--info-rgb), 0.2);
          color: hsl(var(--card-text));
        }

        .metric-card-amber {
          background: linear-gradient(135deg, rgba(var(--warning-rgb), 0.1) 0%, rgba(var(--warning-light-rgb), 0.1) 100%);
          border: 1px solid rgba(var(--warning-rgb), 0.2);
          color: hsl(var(--card-text));
        }

        .empty-state {
          background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.02) 0%, rgba(var(--primary-light-rgb), 0.02) 100%);
          border: 2px dashed rgba(var(--primary-light-rgb), 0.3);
          color: hsl(var(--card-text));
        }
      `}</style>

      <div className="hero-gradient rounded-2xl p-6 mb-6 text-light">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-light mb-2">
              <Building className="h-8 w-8" />
              {formData.companyName || "Financial Health Analysis"}
            </h1>
            <p className="text-light/90 mt-2">
              {metrics.hasData 
                ? `${INDUSTRY_BENCHMARKS[formData.industry]?.name || 'Business'} • Last updated: ${new Date().toLocaleDateString()}`
                : "Enter your financial data to get started"
              }
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="bg-light/10 border-light/20 text-light hover:bg-light/20"
              onClick={handleShareAnalysis}
              disabled={!metrics.hasData}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              className="bg-light/10 border-light/20 text-light hover:bg-light/20"
              onClick={() => handleExportReport("pdf")}
              disabled={!metrics.hasData}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              className="bg-light text-primary hover:bg-light/90"
              onClick={() => setActiveView("input")}
            >
              <Calculator className="h-4 w-4 mr-2" />
              {metrics.hasData ? "Update Data" : "Enter Data"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-card text-card border-border rounded-xl shadow-sm">
        <div className="flex-1 flex flex-wrap gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px] bg-surface text-text">
              <Clock className="h-4 w-4 mr-2 text-tertiary" />
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-surface text-text">
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Select value={comparisonMode} onValueChange={setComparisonMode}>
            <SelectTrigger className="w-[180px] bg-surface text-text">
              <Globe className="h-4 w-4 mr-2 text-tertiary" />
              <SelectValue placeholder="Compare With" />
            </SelectTrigger>
            <SelectContent className="bg-surface text-text">
              <SelectItem value="industry">Industry Benchmark</SelectItem>
              <SelectItem value="past">Past Performance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedIndustry} onValueChange={(v) => { setSelectedIndustry(v); updateField("industry", v); }}>
            <SelectTrigger className="w-[200px] bg-surface text-text">
              <Briefcase className="h-4 w-4 mr-2 text-tertiary" />
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent className="bg-surface text-text">
              {Object.entries(INDUSTRY_BENCHMARKS).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={alertsEnabled} onCheckedChange={handleSetAlert} />
            <Label className="text-sm text-text">Alerts</Label>
          </div>
          <Button variant="outline" size="sm" className="btn-secondary">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 bg-surface border-border">
          <TabsTrigger value="input" className="flex items-center gap-2 text-text data-[state=active]:bg-primary data-[state=active]:text-light">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Input</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2 text-text data-[state=active]:bg-primary data-[state=active]:text-light" disabled={!metrics.hasData}>
            <BarChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2 text-text data-[state=active]:bg-primary data-[state=active]:text-light" disabled={!metrics.hasData}>
            <LineChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="benchmarks" className="flex items-center gap-2 text-text data-[state=active]:bg-primary data-[state=active]:text-light" disabled={!metrics.hasData}>
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Benchmarks</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2 text-text data-[state=active]:bg-primary data-[state=active]:text-light" disabled={!metrics.hasData}>
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2 text-text data-[state=active]:bg-primary data-[state=active]:text-light" disabled={!metrics.hasData}>
            <Lightbulb className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card className="achievement-card bg-surface text-text border-border">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg text-text">
                    <Database className="h-5 w-5 text-primary" />
                    Enter Your Financial Data
                  </CardTitle>
                  <CardDescription className="text-text-muted">
                    All calculations are performed locally. Your data never leaves your browser.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDeleteSavedData}
                    className="border-destructive text-destructive hover:bg-destructive hover:text-light"
                    disabled={!healthInputs && (!healthHistory || healthHistory.length === 0)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Saved Data
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-text">Monthly Revenue *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tertiary" />
                          <Input
                            type="number"
                            placeholder="e.g., 50000"
                            value={formData.revenue}
                            onChange={(e) => updateField("revenue", e.target.value)}
                            className="pl-10 bg-surface text-text border-border"
                          />
                        </div>
                        <p className="text-xs text-text-muted">Total monthly revenue</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-text">Monthly Expenses *</Label>
                        <div className="relative">
                          <TrendingDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-destructive" />
                          <Input
                            type="number"
                            placeholder="e.g., 40000"
                            value={formData.expenses}
                            onChange={(e) => updateField("expenses", e.target.value)}
                            className="pl-10 bg-surface text-text border-border"
                          />
                        </div>
                        <p className="text-xs text-text-muted">Total monthly operating expenses</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-text">Total Debt</Label>
                        <div className="relative">
                          <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-warning" />
                          <Input
                            type="number"
                            placeholder="e.g., 100000"
                            value={formData.debt}
                            onChange={(e) => updateField("debt", e.target.value)}
                            className="pl-10 bg-surface text-text border-border"
                          />
                        </div>
                        <p className="text-xs text-text-muted">Outstanding loans and liabilities</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-text">Cash on Hand *</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-success" />
                          <Input
                            type="number"
                            placeholder="e.g., 150000"
                            value={formData.cash}
                            onChange={(e) => updateField("cash", e.target.value)}
                            className="pl-10 bg-surface text-text border-border"
                          />
                        </div>
                        <p className="text-xs text-text-muted">Available cash and equivalents</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-text">Team Size</Label>
                        <div className="relative">
                          <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tertiary" />
                          <Input
                            type="number"
                            placeholder="e.g., 10"
                            value={formData.teamSize}
                            onChange={(e) => updateField("teamSize", e.target.value)}
                            className="pl-10 bg-surface text-text border-border"
                          />
                        </div>
                        <p className="text-xs text-text-muted">Number of employees</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-text">Active Customers</Label>
                        <div className="relative">
                          <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-info" />
                          <Input
                            type="number"
                            placeholder="e.g., 100"
                            value={formData.customers}
                            onChange={(e) => updateField("customers", e.target.value)}
                            className="pl-10 bg-surface text-text border-border"
                          />
                        </div>
                        <p className="text-xs text-text-muted">Current paying customers</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-text">Company Name</Label>
                      <Input
                        placeholder="e.g., Acme Inc."
                        value={formData.companyName}
                        onChange={(e) => updateField("companyName", e.target.value)}
                        className="bg-surface text-text border-border"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-text">Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => { updateField("industry", value); setSelectedIndustry(value); }}>
                        <SelectTrigger className="bg-surface text-text border-border">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-surface text-text">
                          {Object.entries(INDUSTRY_BENCHMARKS).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Card className="stats-card h-fit">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2 text-text">
                      <Cpu className="h-4 w-4 text-primary" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-xs text-text-muted">Net Profit/Loss</div>
                      <div className={`text-xl font-bold ${metrics.netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatCurrency(metrics.netProfit)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-text-muted">Profit Margin</div>
                      <div className={`text-xl font-bold ${metrics.profitMargin >= 0.1 ? 'text-primary' : 'text-destructive'}`}>
                        {formatPercent(metrics.profitMargin)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-text-muted">Runway</div>
                      <div className={`text-xl font-bold ${metrics.runway >= 6 ? 'text-primary' : 'text-warning'}`}>
                        {metrics.runway >= 999 ? "∞" : `${metrics.runway.toFixed(1)} months`}
                      </div>
                    </div>
                    {metrics.customers > 0 && (
                      <>
                        <div>
                          <div className="text-xs text-text-muted">ARPU</div>
                          <div className="text-xl font-bold text-primary">
                            {formatCurrency(metrics.arpu)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-text-muted">LTV:CAC Ratio</div>
                          <div className={`text-xl font-bold ${metrics.ltvCacRatio >= 3 ? 'text-success' : 'text-warning'}`}>
                            {metrics.ltvCacRatio > 0 ? `${metrics.ltvCacRatio.toFixed(1)}x` : "N/A"}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-border">
                <Button
                  onClick={handleCalculate}
                  disabled={isCalculating || (!formData.revenue && !formData.expenses && !formData.cash)}
                  className="flex-1 h-12 btn-primary"
                  size="lg"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Cpu className="h-5 w-5 mr-2" />
                      Run Analysis
                    </>
                  )}
                </Button>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={!metrics.hasData}
                    className="btn-primary"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save Data
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearInputs}
                    className="btn-secondary"
                  >
                    Clear Inputs
                  </Button>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-primary">Privacy First</p>
                    <p className="text-sm text-text-muted mt-1">
                      All calculations happen in your browser. Your financial data is never sent to any server.
                    </p>
                    <p className="text-sm text-text-muted mt-2">
                      <strong>Note:</strong> Data is only saved when you explicitly click "Save Data".
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          {!metrics.hasData ? (
            <Card className="empty-state p-12 text-center">
              <Calculator className="h-16 w-16 mx-auto text-tertiary/30 mb-4" />
              <h3 className="text-lg font-semibold text-primary">No Data Yet</h3>
              <p className="text-text-muted mt-2">Enter your financial data to see your dashboard</p>
              <Button onClick={() => setActiveView("input")} className="mt-4 btn-primary">
                Enter Data
              </Button>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpiMetrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={metric.id} className="stats-card">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs text-text-muted font-medium">{metric.label}</p>
                            <p className="text-2xl font-bold text-text mt-2">{metric.value}</p>
                            <p className="text-xs text-text-muted mt-1">{metric.description}</p>
                          </div>
                          <Icon className="h-8 w-8" style={{ color: metric.color }} />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="health-score-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-text">
                      <Heart className="h-5 w-5 text-destructive" />
                      Financial Health Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center p-4">
                      <div className="relative">
                        <div className="text-6xl font-bold text-primary">
                          {currentScore || "--"}
                        </div>
                        <div className="text-sm text-text-muted text-center mt-2">/100</div>
                      </div>
                      {currentScore > 0 && (
                        <>
                          <div className="mt-4">
                            <Badge className={`px-4 py-2 text-lg font-semibold ${getHealthBadgeColor(currentScore)}`}>
                              {healthLabel(currentScore).toUpperCase()}
                            </Badge>
                          </div>
                          <div className="mt-6 w-full">
                            <Progress value={currentScore} className="h-2 bg-surface" />
                          </div>
                          <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                            {enterpriseKPIs.map((kpi) => (
                              <div key={kpi.id} className="text-center">
                                <div className="text-sm text-text-muted">{kpi.label}</div>
                                <div className="text-xl font-bold text-primary">{kpi.value.toFixed(0)}</div>
                                <div className={`text-xs mt-1 ${
                                  kpi.status === 'exceeds' ? 'text-success' :
                                  kpi.status === 'meets' ? 'text-warning' : 'text-destructive'
                                }`}>
                                  {kpi.status === 'exceeds' ? '✓ Strong' : kpi.status === 'meets' ? '~ Average' : '⚠ Needs Work'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="chart-container">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-text">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Projected Trend
                    </CardTitle>
                    <CardDescription className="text-text-muted">6-month projection based on current metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--text))" />
                          <YAxis tickFormatter={(v) => formatCurrency(v, true)} stroke="hsl(var(--text))" />
                          <Tooltip 
                            formatter={(value) => [formatCurrency(value), ""]}
                            contentStyle={{
                              backgroundColor: "hsl(var(--surface))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                              color: "hsl(var(--text))",
                            }}
                          />
                          <Area type="monotone" dataKey="revenue" name="Revenue" stroke={CHART_COLORS.revenue} fill={CHART_COLORS.revenue} fillOpacity={0.6} />
                          <Area type="monotone" dataKey="expenses" name="Expenses" stroke={CHART_COLORS.expenses} fill={CHART_COLORS.expenses} fillOpacity={0.6} />
                          <Legend />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {quickInsights.length > 0 && (
                <Card className="bg-surface text-text border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-text">
                      <Lightbulb className="h-5 w-5 text-primary" />
                      Key Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {quickInsights.slice(0, 3).map((insight, idx) => (
                        <Card key={idx} className={`${getSeverityColor(insight.severity)} text-text`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-text">{insight.title}</h4>
                                <p className="text-sm text-text-muted mt-1">{insight.description}</p>
                              </div>
                              <AlertTriangle className={`h-5 w-5 mt-1 ${
                                insight.severity === 'critical' ? 'text-destructive' :
                                insight.severity === 'high' ? 'text-warning' : 'text-success'
                              }`} />
                            </div>
                            <Button size="sm" className="mt-3 w-full btn-primary">
                              {insight.action}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {metrics.hasData && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 chart-container">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-text">
                      <Target className="h-5 w-5 text-primary" />
                      Performance vs Industry
                    </CardTitle>
                    <CardDescription className="text-text-muted">Your metrics compared to {INDUSTRY_BENCHMARKS[selectedIndustry]?.name} benchmarks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="hsl(var(--border))" />
                          <PolarAngleAxis dataKey="metric" stroke="hsl(var(--text))" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--text))" />
                          <Radar name="Your Company" dataKey="you" stroke={COLOR_SCHEME.primary} fill={COLOR_SCHEME.primary} fillOpacity={0.6} />
                          <Radar name="Industry Avg" dataKey="industry" stroke={COLOR_SCHEME.secondary} fill={COLOR_SCHEME.secondary} fillOpacity={0.3} />
                          <Legend />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: "hsl(var(--surface))",
                              border: "1px solid hsl(var(--border))",
                              color: "hsl(var(--text))",
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="chart-container">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-text">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Benchmark Comparison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {comparisonData.map((item, idx) => (
                        <div key={idx} className="p-4 rounded-lg bg-surface/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-text">{item.metric}</span>
                            <Badge className={
                              item.metric === "Debt Load" 
                                ? (item.you < item.industry ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive')
                                : (item.you > item.industry ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive')
                            }>
                              {item.metric === "Debt Load"
                                ? (item.you < item.industry ? 'Better' : 'Higher')
                                : (item.you > item.industry ? 'Above' : 'Below')
                              }
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-center">
                              <div className="text-sm text-text-muted">You</div>
                              <div className="text-lg font-bold text-text">
                                {item.you.toFixed(1)}{item.unit}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm text-text-muted">Industry</div>
                              <div className="text-lg font-bold text-text-muted">
                                {item.industry.toFixed(1)}{item.unit}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="metric-card-green">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-text-muted">Profit Margin</p>
                        <p className="text-3xl font-bold text-text">{formatPercent(metrics.profitMargin)}</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-success" />
                    </div>
                    <Progress value={Math.max(0, (metrics.profitMargin + 0.5) * 100)} className="h-2 bg-surface" />
                  </CardContent>
                </Card>

                <Card className="metric-card-blue">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-text-muted">Runway</p>
                        <p className="text-3xl font-bold text-text">
                          {metrics.runway >= 999 ? "∞" : `${metrics.runway.toFixed(1)} mo`}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-info" />
                    </div>
                    <p className="text-sm text-info">
                      {metrics.runway >= 12 ? "Excellent" : metrics.runway >= 6 ? "Good" : metrics.runway >= 3 ? "Low" : "Critical"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="metric-card-amber">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-text-muted">Debt Ratio</p>
                        <p className="text-3xl font-bold text-text">{formatPercent(metrics.debtToRevenue)}</p>
                      </div>
                      <Shield className="h-8 w-8 text-warning" />
                    </div>
                    <p className="text-sm text-warning">
                      {metrics.debtToRevenue < 0.2 ? "Low" : metrics.debtToRevenue < 0.5 ? "Moderate" : "High"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="stats-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-text-muted">Revenue/Employee</p>
                        <p className="text-3xl font-bold text-text">{formatCurrency(metrics.revenuePerEmployee, true)}</p>
                      </div>
                      <Users className="h-8 w-8 text-tertiary" />
                    </div>
                    <p className="text-sm text-text-muted">Annual per employee</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text">
                <Target className="h-5 w-5 text-primary" />
                Industry Benchmarks
              </CardTitle>
              <CardDescription className="text-text-muted">Compare your metrics against different industries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={Object.entries(INDUSTRY_BENCHMARKS).map(([, data]) => ({
                    industry: data.name,
                    margin: data.margin * 100,
                    runway: data.runway,
                    debtLoad: data.debtLoad * 100,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="industry" stroke="hsl(var(--text))" />
                    <YAxis yAxisId="left" stroke="hsl(var(--text))" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--text))" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--surface))",
                        border: "1px solid hsl(var(--border))",
                        color: "hsl(var(--text))",
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="margin" name="Margin %" fill={CHART_COLORS.margin} />
                    <Bar yAxisId="left" dataKey="debtLoad" name="Debt Load %" fill={CHART_COLORS.debtLoad} />
                    <Line yAxisId="right" type="monotone" dataKey="runway" name="Runway (mo)" stroke={CHART_COLORS.runway} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(INDUSTRY_BENCHMARKS).map(([key, benchmark]) => (
              <Card key={key} className={`${selectedIndustry === key ? 'achievement-card' : 'stats-card'} cursor-pointer text-text`} onClick={() => { setSelectedIndustry(key); updateField("industry", key); }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-text">{benchmark.name}</h3>
                    {selectedIndustry === key && <Badge className="bg-primary/10 text-primary">Selected</Badge>}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-muted">Avg Margin</span><span className="font-medium text-text">{formatPercent(benchmark.margin)}</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Avg Runway</span><span className="font-medium text-text">{benchmark.runway} mo</span></div>
                    <div className="flex justify-between"><span className="text-text-muted">Avg Debt Load</span><span className="font-medium text-text">{formatPercent(benchmark.debtLoad)}</span></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {metrics.hasData && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="chart-container">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-text">
                      <LineChartIcon className="h-5 w-5 text-primary" />
                      Financial Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="month" stroke="hsl(var(--text))" />
                          <YAxis tickFormatter={(v) => formatCurrency(v, true)} stroke="hsl(var(--text))" />
                          <Tooltip 
                            formatter={(value) => [formatCurrency(value), ""]}
                            contentStyle={{
                              backgroundColor: "hsl(var(--surface))",
                              border: "1px solid hsl(var(--border))",
                              color: "hsl(var(--text))",
                            }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="revenue" name="Revenue" stroke={CHART_COLORS.revenue} strokeWidth={3} />
                          <Line type="monotone" dataKey="expenses" name="Expenses" stroke={CHART_COLORS.expenses} strokeWidth={3} />
                          <Line type="monotone" dataKey="profit" name="Profit" stroke={CHART_COLORS.net} strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="chart-container">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-text">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Key Metrics Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Revenue', value: metrics.revenue, fill: CHART_COLORS.revenue },
                          { name: 'Expenses', value: metrics.expenses, fill: CHART_COLORS.expenses },
                          { name: 'Net Profit', value: Math.max(0, metrics.netProfit), fill: CHART_COLORS.net },
                          { name: 'Cash', value: metrics.cash, fill: CHART_COLORS.cash },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="name" stroke="hsl(var(--text))" />
                          <YAxis tickFormatter={(v) => formatCurrency(v, true)} stroke="hsl(var(--text))" />
                          <Tooltip 
                            formatter={(value) => [formatCurrency(value), ""]}
                            contentStyle={{
                              backgroundColor: "hsl(var(--surface))",
                              border: "1px solid hsl(var(--border))",
                              color: "hsl(var(--text))",
                            }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="achievement-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-text">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Health Score History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="date" stroke="hsl(var(--text))" />
                          <YAxis domain={[0, 100]} stroke="hsl(var(--text))" />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: "hsl(var(--surface))",
                              border: "1px solid hsl(var(--border))",
                              color: "hsl(var(--text))",
                            }}
                          />
                          <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))" }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center">
                        <TrendingUp className="h-16 w-16 text-tertiary/30 mb-4" />
                        <p className="text-primary font-medium">No history yet</p>
                        <p className="text-text-muted text-sm">Save data to track progress over time</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="achievement-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-text">
                <Lightbulb className="h-5 w-5 text-primary" />
                Financial Insights & Recommendations
              </CardTitle>
              <CardDescription className="text-text-muted">Actionable recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quickInsights.length > 0 ? (
                  quickInsights.map((insight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Card className={`${getSeverityColor(insight.severity)} text-text`}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${
                              insight.severity === 'critical' ? 'bg-destructive/20' :
                              insight.severity === 'high' ? 'bg-warning/20' : 'bg-success/20'
                            }`}>
                              <AlertTriangle className={`h-5 w-5 ${
                                insight.severity === 'critical' ? 'text-destructive' :
                                insight.severity === 'high' ? 'text-warning' : 'text-success'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-text">{insight.title}</h4>
                              <p className="text-text-muted mt-1">{insight.description}</p>
                              
                              <div className="mt-4 grid grid-cols-3 gap-4">
                                <div className="p-3 bg-surface/50 rounded-lg">
                                  <p className="text-xs text-text-muted">Priority</p>
                                  <p className="font-semibold text-text">
                                    {insight.severity === 'critical' ? 'Critical' : insight.severity === 'high' ? 'High' : 'Medium'}
                                  </p>
                                </div>
                                <div className="p-3 bg-surface/50 rounded-lg">
                                  <p className="text-xs text-text-muted">Impact</p>
                                  <p className="font-semibold text-text">{insight.impact}</p>
                                </div>
                                <div className="p-3 bg-surface/50 rounded-lg">
                                  <p className="text-xs text-text-muted">Timeframe</p>
                                  <p className="font-semibold text-text">{insight.timeframe}</p>
                                </div>
                              </div>
                              
                              <Button className="mt-4 btn-primary">{insight.action}</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Lightbulb className="h-16 w-16 mx-auto text-tertiary/30 mb-4" />
                    <h3 className="text-lg font-semibold text-primary">
                      {metrics.hasData ? "Looking Good!" : "No Insights Yet"}
                    </h3>
                    <p className="text-text-muted mt-2">
                      {metrics.hasData 
                        ? "Your metrics are within healthy ranges. Keep monitoring!"
                        : "Enter financial data to generate insights"
                      }
                    </p>
                    {!metrics.hasData && (
                      <Button onClick={() => setActiveView("input")} className="mt-4 btn-primary">
                        <Calculator className="h-4 w-4 mr-2" />
                        Enter Data
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}