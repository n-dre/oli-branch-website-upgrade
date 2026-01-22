// frontend/src/pages/tools/FinancialHealth.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { toast } from "sonner";
import {
  Heart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  Lightbulb,
  Calculator,
  RefreshCw,
  Info,
  Eye,
  Download,
  TrendingDown,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Calendar,
} from "lucide-react";

// ✅ FIXED IMPORTS (your Vite root is /frontend)
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { useData } from "../../context/DataContext";

// Updated colors to match your theme
const DONUT_COLORS = ["#1B4332", "#52796F", "#84A98C"];

// ✅ Yellow Gold = Revenue, Forest = Expenses, Light Green = Net
const BAR_COLORS = {
  revenue: "#D4AF37", // yellow gold
  expenses: "#1B4332", // forest green
  net: "#10B981", // light green
};

export default function FinancialHealth() {
  const {
    healthInputs,
    updateHealthInputs,
    healthHistory,
    addHealthHistory,
    clearHealthData,
    computeHealthScore,
    healthLabel,
  } = useData();

  const [formData, setFormData] = useState({
    revenue: healthInputs?.revenue || "",
    expenses: healthInputs?.expenses || "",
    debt: healthInputs?.debt || "",
    cash: healthInputs?.cash || "",
  });

  const [activeTab, setActiveTab] = useState("input");
  const [isCalculating, setIsCalculating] = useState(false);

  // ✅ Prevent “stuck calculating” + prevent stacked timers
  const calcTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (calcTimerRef.current) clearTimeout(calcTimerRef.current);
    };
  }, []);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCalculate = () => {
    // prevent double-click / stacked timers
    if (isCalculating) return;

    const inputs = {
      revenue: Number(formData.revenue || 0),
      expenses: Number(formData.expenses || 0),
      debt: Number(formData.debt || 0),
      cash: Number(formData.cash || 0),
    };

    const hasAny = Object.values(inputs).some((v) => v > 0);
    if (!hasAny) {
      toast.error("Please enter at least one value");
      return;
    }

    // clear any pending timer
    if (calcTimerRef.current) clearTimeout(calcTimerRef.current);

    setIsCalculating(true);

    // Simulate calculation delay
    calcTimerRef.current = setTimeout(() => {
      try {
        if (typeof computeHealthScore !== "function") {
          throw new Error("computeHealthScore is not available from DataContext.");
        }

        updateHealthInputs(inputs);

        const result = computeHealthScore(inputs);

        if (!result || typeof result.score !== "number") {
          throw new Error("computeHealthScore returned an invalid result.");
        }

        addHealthHistory(result.score);

        toast.success(`Score calculated: ${result.score}`, {
          description: `Your business financial health is ${healthLabel(result.score).toLowerCase()}.`,
        });

        setActiveTab("results");
      } catch (err) {
        console.error(err);
        toast.error("Calculation failed", {
          description: err?.message || "Please try again.",
        });
      } finally {
        setIsCalculating(false);
        calcTimerRef.current = null;
      }
    }, 800);
  };

  const handleClear = () => {
    setFormData({ revenue: "", expenses: "", debt: "", cash: "" });

    // stop spinner if it was running
    if (calcTimerRef.current) {
      clearTimeout(calcTimerRef.current);
      calcTimerRef.current = null;
    }
    setIsCalculating(false);

    clearHealthData();
    toast.info("All data has been cleared", {
      description: "Enter new values to calculate your score.",
    });
  };

  const handleQuickExample = () => {
    setFormData({
      revenue: "25000",
      expenses: "18000",
      debt: "40000",
      cash: "12000",
    });
    toast.info("Example values loaded", {
      description: "Click Calculate Score to see results.",
    });
  };

  const handleExport = () => {
    toast.success("Report exported", {
      description: "Your financial health report has been downloaded.",
    });
  };

  // ✅ Guard: don't call computeHealthScore during render if it's missing
  const currentResult =
    typeof computeHealthScore === "function" && healthInputs ? computeHealthScore(healthInputs) : null;

  const metrics = currentResult?.metrics || { margin: 0, runway: 0, debtLoad: 0 };

  // Donut chart data for breakdown
  const breakdownData = currentResult
    ? [
        {
          name: "Cash Flow",
          value: Math.round(Math.max(0, Math.min(100, ((metrics.margin + 0.25) / 0.75) * 100)) * 0.45),
          color: DONUT_COLORS[0],
        },
        {
          name: "Runway",
          value: Math.round(Math.max(0, Math.min(100, (metrics.runway / 6) * 100)) * 0.3),
          color: DONUT_COLORS[1],
        },
        {
          name: "Debt Health",
          value: Math.round(Math.max(0, Math.min(100, (1 - metrics.debtLoad) * 100)) * 0.25),
          color: DONUT_COLORS[2],
        },
      ]
    : [];

  // Fee Impact Analysis data
  const revenue = Number(healthInputs?.revenue || 0);
  const expenses = Number(healthInputs?.expenses || 0);

  // ✅ FIXED COLORS: Gold=Revenue, Forest=Expenses, LightGreen=Net
  const feeImpactData = currentResult
    ? [
        { name: "Revenue", value: revenue, fill: BAR_COLORS.revenue },
        { name: "Expenses", value: expenses, fill: BAR_COLORS.expenses },
        { name: "Net", value: Math.max(0, revenue - expenses), fill: BAR_COLORS.net },
      ]
    : [];

  // Key Mismatch Areas
  const mismatchAreas = [];
  if (currentResult) {
    if (metrics.margin < 0.1) {
      mismatchAreas.push({
        area: "Low Profit Margin",
        severity: metrics.margin < 0 ? "critical" : "warning",
        description: `Your margin is ${(metrics.margin * 100).toFixed(1)}%. Aim for at least 10-15%.`,
        action: "Increase prices or reduce variable costs",
      });
    }
    if (metrics.runway < 3) {
      mismatchAreas.push({
        area: "Short Runway",
        severity: metrics.runway < 1 ? "critical" : "warning",
        description: `Only ${metrics.runway.toFixed(1)} months of runway. Need 3-6 months minimum.`,
        action: "Build cash reserves or reduce burn rate",
      });
    }
    if (metrics.debtLoad > 0.5) {
      mismatchAreas.push({
        area: "High Debt Load",
        severity: metrics.debtLoad > 0.8 ? "critical" : "warning",
        description: `Debt is ${(metrics.debtLoad * 100).toFixed(0)}% of 6-month revenue.`,
        action: "Prioritize debt repayment or refinance",
      });
    }
    if (revenue > 0 && expenses > revenue * 0.9) {
      mismatchAreas.push({
        area: "Expense Ratio",
        severity: expenses > revenue ? "critical" : "warning",
        description: `Expenses are ${((expenses / revenue) * 100).toFixed(0)}% of revenue.`,
        action: "Review and cut non-essential expenses",
      });
    }
  }

  // Chart data from history
  const chartData = (healthHistory || []).map((h) => {
    const d = new Date(h.t);
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      score: h.score,
    };
  });

  // Recommendations
  const recommendations = [];
  if (currentResult) {
    if (metrics.margin < 0.05) recommendations.push("Improve margin: reduce variable costs or adjust pricing.");
    if (metrics.runway < 3) recommendations.push("Increase runway: reduce burn or build reserves.");
    if (metrics.debtLoad > 0.65) recommendations.push("Reduce debt load: refinance or prioritize high APR balances.");
    if (recommendations.length === 0) recommendations.push("Maintain discipline: track margin, runway, and debt monthly.");
  } else {
    recommendations.push("Add inputs to generate recommendations.");
  }

  const getHealthBadgeColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const tabs = [
    { id: "input", label: "Input & Analysis", icon: Calculator, description: "Enter financial data for analysis" },
    { id: "results", label: "Results", icon: TrendingUp, description: "View your health score and metrics", badge: undefined },
    { id: "history", label: "History", icon: Eye, description: "Track your score over time" },
  ];

  return (
    <DashboardLayout title="Financial Health" subtitle="Assess your business financial health" className="bg-[#F8F5F0]">
      <style>{`
        .hero-gradient {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
        }

        .btn-primary {
          background: #1B4332 !important;
          color: #F8F5F0 !important;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: #52796F !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3);
        }

        .btn-secondary {
          border: 2px solid #1B4332 !important;
          color: #1B4332 !important;
          background: transparent !important;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #1B4332 !important;
          color: #F8F5F0 !important;
        }

        .course-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.02) 0%, rgba(82, 121, 111, 0.02) 100%);
        }

        .course-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }

        .achievement-card {
          border-left: 4px solid #1B4332 !important;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
        }

        .achievement-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(27, 67, 50, 0.15);
          border-color: #52796F !important;
        }

        .stats-card {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
          border: 1px solid rgba(82, 121, 111, 0.1);
        }

        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(27, 67, 50, 0.1);
        }

        .progress-gradient {
          background: linear-gradient(90deg, #1B4332 0%, #52796F 100%);
        }

        .tag-badge {
          background: rgba(27, 67, 50, 0.1) !important;
          color: #1B4332 !important;
          border: 1px solid rgba(27, 67, 50, 0.2) !important;
        }

        .category-badge {
          background: rgba(82, 121, 111, 0.1) !important;
          color: #52796F !important;
          border: 1px solid rgba(82, 121, 111, 0.2) !important;
        }

        .leak-card-high {
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(239, 68, 68, 0.05) 100%);
          border: 1px solid rgba(220, 38, 38, 0.2);
        }

        .leak-card-medium {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .leak-card-low {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .chart-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(27, 67, 50, 0.08);
        }

        .health-score-card {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.1) 0%, rgba(82, 121, 111, 0.1) 100%);
          border: 2px solid rgba(27, 67, 50, 0.2);
        }

        .metric-card-green {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .metric-card-blue {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(96, 165, 250, 0.05) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        .metric-card-amber {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(251, 191, 36, 0.05) 100%);
          border: 1px solid rgba(245, 158, 11, 0.2);
        }

        .insight-card {
          transition: all 0.3s ease;
          background: white;
          border: 1px solid rgba(82, 121, 111, 0.1);
        }

        .insight-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(27, 67, 50, 0.15);
        }

        @media (max-width: 640px) {
          .mobile-stack {
            flex-direction: column !important;
          }

          .mobile-full {
            width: 100% !important;
          }

          .mobile-text-center {
            text-align: center !important;
          }

          .mobile-p-4 {
            padding: 1rem !important;
          }

          .mobile-gap-4 {
            gap: 1rem !important;
          }
        }

        @media (max-width: 768px) {
          .tablet-flex-col {
            flex-direction: column !important;
          }

          .tablet-w-full {
            width: 100% !important;
          }

          .tablet-mb-4 {
            margin-bottom: 1rem !important;
          }
        }
      `}</style>

      {/* Responsive Tabs Container */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-[#52796F]/20 overflow-hidden">
        {/* Tabs Header - Responsive Design */}
        <div className="flex flex-col md:flex-row bg-[#F8F5F0] border-b border-[#52796F]/20 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center justify-center md:justify-start gap-2 px-6 py-4 md:py-5
                  text-sm md:text-base font-medium whitespace-nowrap
                  transition-all duration-200 relative
                  ${
                    activeTab === tab.id
                      ? "text-[#1B4332] bg-white font-semibold"
                      : "text-[#52796F] hover:text-[#1B4332] hover:bg-white/80"
                  }
                  border-b-2 md:border-b-0 md:border-r border-[#52796F]/20 last:border-r-0
                  min-w-[120px] md:flex-1
                `}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span>{tab.label}</span>

                {activeTab === tab.id && (
                  <>
                    {/* Desktop active indicator */}
                    <div className="hidden md:block absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B4332]" />
                    {/* Mobile active indicator */}
                    <div className="md:hidden absolute bottom-0 left-0 top-0 w-0.5 bg-[#1B4332]" />
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="p-0">
          {/* Input & Analysis Tab */}
          {activeTab === "input" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6">
              {/* Quick Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="stats-card p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-[#52796F]">Revenue</p>
                      <p className="text-xl md:text-2xl font-bold text-[#1B4332]">
                        {formData.revenue ? `$${parseInt(formData.revenue, 10).toLocaleString()}` : "--"}
                      </p>
                    </div>
                    <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-[#10B981]" />
                  </div>
                </div>

                <div className="stats-card p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-[#52796F]">Expenses</p>
                      <p className="text-xl md:text-2xl font-bold text-[#1B4332]">
                        {formData.expenses ? `$${parseInt(formData.expenses, 10).toLocaleString()}` : "--"}
                      </p>
                    </div>
                    <TrendingDown className="w-6 h-6 md:w-8 md:h-8 text-[#DC2626]" />
                  </div>
                </div>

                <div className="stats-card p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-[#52796F]">Debt</p>
                      <p className="text-xl md:text-2xl font-bold text-[#1B4332]">
                        {formData.debt ? `$${parseInt(formData.debt, 10).toLocaleString()}` : "--"}
                      </p>
                    </div>
                    <Shield className="w-6 h-6 md:w-8 md:h-8 text-[#F59E0B]" />
                  </div>
                </div>

                <div className="stats-card p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm text-[#52796F]">Cash</p>
                      <p className="text-xl md:text-2xl font-bold text-[#1B4332]">
                        {formData.cash ? `$${parseInt(formData.cash, 10).toLocaleString()}` : "--"}
                      </p>
                    </div>
                    <Users className="w-6 h-6 md:w-8 md:h-8 text-[#3B82F6]" />
                  </div>
                </div>
              </div>

              {/* Main Input Card */}
              <Card className="achievement-card">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg md:text-xl text-[#1B4332]">
                        <Calculator className="h-5 w-5 md:h-6 md:w-6 text-[#1B4332]" />
                        Financial Health Inputs
                      </CardTitle>
                      <CardDescription className="mt-1 text-[#52796F]">
                        Enter your business financial details to calculate your health score
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleQuickExample}
                        className="text-xs md:text-sm btn-secondary"
                      >
                        Load Example
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="text-xs md:text-sm hidden md:flex btn-secondary"
                      >
                        <Download className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-[#1B4332]">Monthly Revenue</Label>
                          <Info className="h-4 w-4 text-[#52796F]" />
                        </div>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <span className="text-lg font-semibold text-[#10B981]">$</span>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g., 25,000"
                            value={formData.revenue}
                            onChange={(e) => updateField("revenue", e.target.value)}
                            className="pl-10 text-lg h-12 border-[#52796F]/20 focus:border-[#1B4332]"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-[#1B4332]">Monthly Expenses</Label>
                          <Info className="h-4 w-4 text-[#52796F]" />
                        </div>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <span className="text-lg font-semibold text-[#DC2626]">$</span>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            placeholder="e.g., 18,000"
                            value={formData.expenses}
                            onChange={(e) => updateField("expenses", e.target.value)}
                            className="pl-10 text-lg h-12 border-[#52796F]/20 focus:border-[#1B4332]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-[#1B4332]">Total Debt</Label>
                          <Info className="h-4 w-4 text-[#52796F]" />
                        </div>
                        <Input
                          type="number"
                          min="0"
                          placeholder="e.g., 40,000"
                          value={formData.debt}
                          onChange={(e) => updateField("debt", e.target.value)}
                          className="text-lg h-12 border-[#52796F]/20 focus:border-[#1B4332]"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-[#1B4332]">Cash on Hand</Label>
                          <Info className="h-4 w-4 text-[#52796F]" />
                        </div>
                        <Input
                          type="number"
                          min="0"
                          placeholder="e.g., 12,000"
                          value={formData.cash}
                          onChange={(e) => updateField("cash", e.target.value)}
                          className="text-lg h-12 border-[#52796F]/20 focus:border-[#1B4332]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-[#52796F]/20">
                    <Button
                      onClick={handleCalculate}
                      disabled={isCalculating}
                      className="flex-1 h-12 text-lg btn-primary"
                      size="lg"
                    >
                      {isCalculating ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          Calculate Health Score
                        </>
                      )}
                    </Button>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handleClear}
                        className="h-12 flex-1 sm:flex-none btn-secondary"
                      >
                        Clear All
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleQuickExample}
                        className="h-12 flex-1 sm:flex-none btn-secondary"
                      >
                        Load Example
                      </Button>
                    </div>
                  </div>

                  {/* Help Text */}
                  <div className="mt-4 p-3 bg-[#1B4332]/10 rounded-lg border border-[#1B4332]/20">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-[#1B4332] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[#1B4332]">
                        <span className="font-semibold">B2B Tip:</span> All calculations are done locally in your browser. Your business data is
                        stored only on your device for privacy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Results Tab */}
          {activeTab === "results" && (
            <div className="p-6 space-y-6">
              {/* Score Header */}
              <div className="health-score-card rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <Heart className="h-6 w-6 text-[#DC2626]" />
                      <span className="text-sm font-medium text-[#52796F]">FINANCIAL HEALTH SCORE</span>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="relative">
                        <div className="text-5xl md:text-6xl font-bold text-[#1B4332]">{currentResult?.score || "--"}</div>
                        <div className="text-sm text-[#52796F] text-center">/100</div>
                      </div>
                      {currentResult && (
                        <div>
                          <Badge className={`px-4 py-2 text-lg font-semibold ${getHealthBadgeColor(currentResult.score)}`}>
                            {healthLabel(currentResult.score).toUpperCase()}
                          </Badge>
                          <p className="text-[#52796F] mt-2 max-w-md">
                            Your business financial health is {healthLabel(currentResult.score).toLowerCase()}.
                            {currentResult.score >= 80 ? " Keep up the great work!" : " Review the recommendations below to improve."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {currentResult && (
                    <Button onClick={() => setActiveTab("input")} variant="outline" className="whitespace-nowrap btn-secondary">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Recalculate
                    </Button>
                  )}
                </div>
              </div>

              {currentResult ? (
                <>
                  {/* Analysis Cards Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Donut Chart Card */}
                    <Card className="chart-container">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-[#1B4332]">
                          <PieChartIcon className="h-4 w-4" />
                          Score Breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center">
                          <div className="relative h-[180px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={breakdownData}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={45}
                                  outerRadius={70}
                                  paddingAngle={4}
                                  dataKey="value"
                                  strokeWidth={0}
                                >
                                  {breakdownData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip
                                  formatter={(value, name) => [`${value} pts`, name]}
                                  contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid rgba(27, 67, 50, 0.1)",
                                    borderRadius: "8px",
                                    color: "#1B4332",
                                  }}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl font-bold text-[#1B4332]">{currentResult.score}</span>
                            </div>
                          </div>

                          <div className="w-full mt-4 space-y-3">
                            {breakdownData.map((entry, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                  <span className="text-sm font-medium text-[#1B4332]">{entry.name}</span>
                                </div>
                                <span className="text-sm font-semibold text-[#52796F]">{entry.value} pts</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Key Metrics Card */}
                    <Card className="chart-container">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-[#1B4332]">
                          <Target className="h-4 w-4" />
                          Key Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="metric-card-green p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-[#10B981]">Profit Margin</span>
                            <TrendingUp className="h-4 w-4 text-[#10B981]" />
                          </div>
                          <div className="text-2xl font-bold text-[#1B4332]">{(metrics.margin * 100).toFixed(1)}%</div>
                          <div className="mt-2 h-2 bg-[#10B981]/20 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full progress-gradient"
                              style={{ width: `${Math.min(100, metrics.margin * 200)}%` }}
                            />
                          </div>
                        </div>

                        <div className="metric-card-blue p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-[#3B82F6]">Runway</span>
                            <Calendar className="h-4 w-4 text-[#3B82F6]" />
                          </div>
                          <div className="text-2xl font-bold text-[#1B4332]">
                            {Number.isFinite(metrics.runway) ? metrics.runway.toFixed(1) : "12.0"} months
                          </div>
                          <div className="text-sm text-[#3B82F6] mt-1">
                            {metrics.runway >= 6 ? "Excellent" : metrics.runway >= 3 ? "Good" : "Critical"}
                          </div>
                        </div>

                        <div className="metric-card-amber p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-[#F59E0B]">Debt Load</span>
                            <Shield className="h-4 w-4 text-[#F59E0B]" />
                          </div>
                          <div className="text-2xl font-bold text-[#1B4332]">{(metrics.debtLoad * 100).toFixed(0)}%</div>
                          <div className="text-sm text-[#F59E0B] mt-1">
                            {metrics.debtLoad < 0.3 ? "Low" : metrics.debtLoad < 0.6 ? "Moderate" : "High"}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Insights */}
                    <Card className="chart-container">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-sm text-[#1B4332]">
                          <Lightbulb className="h-4 w-4" />
                          Quick Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {mismatchAreas.length > 0 ? (
                          mismatchAreas.slice(0, 3).map((item, idx) => (
                            <div
                              key={idx}
                              className={`insight-card p-3 rounded-lg ${
                                item.severity === "critical" ? "leak-card-high" : "leak-card-medium"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <AlertTriangle
                                  className={`h-4 w-4 ${item.severity === "critical" ? "text-[#DC2626]" : "text-[#F59E0B]"}`}
                                />
                                <span className="font-semibold text-sm text-[#1B4332]">{item.area}</span>
                              </div>
                              <p className="text-xs text-[#52796F] mt-1">{item.description}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 rounded-lg metric-card-green text-center">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-[#10B981]" />
                            <p className="font-semibold text-[#1B4332]">All Good!</p>
                            <p className="text-xs text-[#52796F] mt-1">No critical issues detected</p>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          className="w-full mt-4 btn-secondary"
                          onClick={() => setActiveTab("results")}
                        >
                          View Full Analysis
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Full Results */}
                  <div className="space-y-6">
                    {/* Fee Impact Analysis */}
                    <Card className="achievement-card">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[#1B4332]">
                          <BarChart3 className="h-5 w-5" />
                          Leaks Impact Analysis
                        </CardTitle>
                        <CardDescription className="text-[#52796F]">How your expenses impact your bottom line</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={feeImpactData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(27, 67, 50, 0.1)" />
                                <XAxis dataKey="name" stroke="#52796F" />
                                <YAxis stroke="#52796F" />
                                <Tooltip
                                  formatter={(value) => [`$${Number(value).toLocaleString()}`, ""]}
                                  contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid rgba(27, 67, 50, 0.1)",
                                    borderRadius: "8px",
                                    color: "#1B4332",
                                  }}
                                />
                                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                  {feeImpactData.map((entry, idx) => (
                                    <Cell key={`cell-${idx}`} fill={entry.fill} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Right side metrics */}
                          <div className="space-y-4">
                            {/* Monthly Revenue (GOLD) */}
                            <div className="metric-card-green p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="h-5 w-5" style={{ color: BAR_COLORS.revenue }} />
                                <span className="font-semibold text-[#1B4332]">Monthly Revenue</span>
                              </div>
                              <p className="text-2xl font-bold text-[#1B4332]">${revenue.toLocaleString()}</p>
                            </div>

                            {/* Monthly Expenses (FOREST) */}
                            <div className="leak-card-high p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-5 w-5" style={{ color: BAR_COLORS.expenses }} />
                                <span className="font-semibold text-[#1B4332]">Monthly Expenses</span>
                              </div>
                              <p className="text-2xl font-bold text-[#1B4332]">${expenses.toLocaleString()}</p>
                              <p className="text-sm mt-1" style={{ color: BAR_COLORS.expenses }}>
                                {revenue > 0 ? `${((expenses / revenue) * 100).toFixed(1)}% of revenue` : "0% of revenue"}
                              </p>
                            </div>

                            {/* Net Profit (LIGHT GREEN) */}
                            <div className="metric-card-blue p-4 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="h-5 w-5" style={{ color: BAR_COLORS.net }} />
                                <span className="font-semibold text-[#1B4332]">Net Profit</span>
                              </div>
                              <p className="text-2xl font-bold text-[#1B4332]">
                                ${Math.max(0, revenue - expenses).toLocaleString()}
                              </p>
                              <p className="text-sm mt-1" style={{ color: BAR_COLORS.net }}>
                                {(metrics.margin * 100).toFixed(1)}% profit margin
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Key Mismatch Areas & Recommendations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Key Mismatch Areas */}
                      <Card className="achievement-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-[#1B4332]">
                            <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                            Key Mismatch Areas
                          </CardTitle>
                          <CardDescription className="text-[#52796F]">
                            Business areas requiring attention based on your financial data
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {mismatchAreas.length > 0 ? (
                            <div className="space-y-4">
                              {mismatchAreas.map((item, idx) => (
                                <div
                                  key={idx}
                                  className={`p-4 rounded-lg ${item.severity === "critical" ? "leak-card-high" : "leak-card-medium"}`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle
                                      className={`h-5 w-5 ${item.severity === "critical" ? "text-[#DC2626]" : "text-[#F59E0B]"}`}
                                    />
                                    <span className="font-semibold text-[#1B4332]">{item.area}</span>
                                    <Badge
                                      className={`ml-auto ${
                                        item.severity === "critical"
                                          ? "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20"
                                          : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                                      }`}
                                    >
                                      {item.severity}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-[#52796F] mb-3">{item.description}</p>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Lightbulb className="h-4 w-4 text-[#1B4332]" />
                                    <span className="font-medium text-[#1B4332]">{item.action}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-6 rounded-lg metric-card-green text-center">
                              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-[#10B981]" />
                              <p className="font-semibold text-[#1B4332] text-lg">No Major Mismatches Detected!</p>
                              <p className="text-sm text-[#52796F] mt-2">
                                Your financial health looks good. Keep monitoring regularly.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Recommendations */}
                      <Card className="achievement-card">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-[#1B4332]">
                            <Lightbulb className="h-5 w-5" />
                            Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3">
                            {recommendations.map((rec, i) => (
                              <li key={i} className="flex items-start gap-3 p-4 rounded-lg metric-card-blue">
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className="w-6 h-6 rounded-full bg-[#1B4332]/10 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-[#1B4332]">{i + 1}</span>
                                  </div>
                                </div>
                                <div className="w-full">
                                  <span className="text-sm font-medium text-[#1B4332]">{rec}</span>

                                  <div className="mt-3 flex flex-col sm:flex-row gap-2 w-full">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-9 text-xs sm:text-sm btn-secondary w-full sm:w-auto"
                                    >
                                      Learn More
                                    </Button>
                                    <Button size="sm" className="h-9 text-xs sm:text-sm btn-primary w-full sm:w-auto">
                                      Take Action
                                    </Button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              ) : (
                <Card className="achievement-card">
                  <CardContent className="p-8 text-center">
                    <Calculator className="h-16 w-16 mx-auto mb-4 text-[#52796F]/30" />
                    <h3 className="text-lg font-semibold text-[#1B4332] mb-2">No Results Yet</h3>
                    <p className="text-[#52796F] mb-4">
                      Calculate your business financial health score to see detailed results and insights
                    </p>
                    <Button onClick={() => setActiveTab("input")} className="btn-primary">
                      Go to Input
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="p-6">
              <Card className="achievement-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1B4332]">
                    <TrendingUp className="h-5 w-5" />
                    Health Score History
                  </CardTitle>
                  <CardDescription className="text-[#52796F]">Track your score over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(27, 67, 50, 0.1)" />
                          <XAxis dataKey="date" stroke="#52796F" />
                          <YAxis domain={[0, 100]} stroke="#52796F" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid rgba(27, 67, 50, 0.1)",
                              borderRadius: "8px",
                              color: "#1B4332",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#1B4332"
                            strokeWidth={3}
                            dot={{ fill: "#1B4332", strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center">
                        <TrendingUp className="h-16 w-16 text-[#52796F]/30 mb-4" />
                        <p className="text-[#1B4332] text-lg font-medium mb-2">No history yet</p>
                        <p className="text-[#52796F] text-sm mb-4">Calculate your first score to start tracking</p>
                        <Button onClick={() => setActiveTab("input")} className="btn-primary">
                          <Calculator className="w-4 h-4 mr-2" />
                          Calculate Score
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
