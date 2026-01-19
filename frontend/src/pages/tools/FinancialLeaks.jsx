// frontend/src/pages/tools/FinancialLeaks.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  AlertTriangle,
  DollarSign,
  TrendingDown,
  Lightbulb,
  Download,
  ArrowLeft,
  Crown,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { useData } from "../../context/DataContext";

const SEVERITY_COLORS = {
  high: "#DC2626",
  medium: "#F59E0B",
  low: "#10B981",
};

// Fee Rules Definitions
const FEE_RULES = [
  {
    type: "atm_fees",
    name: "ATM Fees",
    description: "Charges for using out-of-network ATMs",
    threshold: 10,
    severity: "high",
  },
  {
    type: "maintenance_fees",
    name: "Monthly Maintenance",
    description: "Account maintenance charges",
    threshold: 25,
    severity: "medium",
  },
  {
    type: "overdraft_fees",
    name: "Overdraft Fees",
    description: "Charges for overdrawing your account",
    threshold: 35,
    severity: "high",
  },
  {
    type: "transfer_fees",
    name: "Transfer Fees",
    description: "Charges for transferring money",
    threshold: 5,
    severity: "low",
  },
];

export default function FinancialLeaks() {
  const { feeAnalysis, linkedBanks, subscription } = useData();
  const navigate = useNavigate();

  // NOTE: your app seems to use subscription.plan === 'premium'
  const isPremium = subscription?.plan === "premium";

  if (!isPremium) {
    return (
      <DashboardLayout title="Financial Leaks" subtitle="Detailed breakdown of your banking fees">
        <Card className="max-w-lg mx-auto achievement-card">
          <CardContent className="py-12 text-center">
            <Crown className="h-16 w-16 mx-auto mb-4 text-[#1B4332]" />
            <h2 className="text-2xl font-bold mb-2 text-[#1B4332]">Premium Feature</h2>
            <p className="text-[#52796F] mb-6">
              Financial leaks is available for Premium subscribers. Upgrade to unlock detailed fee breakdowns
              and savings recommendations.
            </p>

            <Button onClick={() => navigate("/pricing")} className="gap-2 btn-primary text-[#D4AF37]">
              <Crown className="h-4 w-4 text-[#D4AF37]" />
              Upgrade to Oli Oversight - $49.99/month
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  if (!feeAnalysis || !Array.isArray(linkedBanks) || linkedBanks.length === 0) {
    return (
      <DashboardLayout title="Financial Leaks" subtitle="Detailed breakdown of your banking fees">
        <Card className="max-w-lg mx-auto stats-card">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-[#52796F]/30" />
            <h2 className="text-2xl font-bold mb-2 text-[#1B4332]">No Bank Linked</h2>
            <p className="text-[#52796F] mb-6">
              Link your bank account to analyze your transactions and detect fee mismatches.
            </p>
            <Button onClick={() => navigate("/link")} className="btn-primary">
              Link Bank Account
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  // Prepare chart data (guard against missing feesByType)
  const feesByType = Array.isArray(feeAnalysis.feesByType) ? feeAnalysis.feesByType : [];

  const pieData = feesByType.map((fee) => ({
    name: fee.name,
    value: Number(fee.total) || 0,
    fill: SEVERITY_COLORS[fee.severity] || SEVERITY_COLORS.low,
  }));

  const barData = feesByType.map((fee) => ({
    name: (fee.name || "").split(" ")[0] || "Fee",
    amount: Number(fee.total) || 0,
    count: Number(fee.count) || 0,
    fill: fee.avoidable ? SEVERITY_COLORS.medium : SEVERITY_COLORS.low,
  }));

  const handleDownloadPDF = () => {
    const reportText = `
OLI-BRANCH Financial Leaks REPORT
==============================
Generated: ${new Date().toLocaleDateString()}

SUMMARY
-------
Total Fees Found: $${Number(feeAnalysis.totalFees || 0).toFixed(2)}
Avoidable Fees: $${Number(feeAnalysis.avoidableFees || 0).toFixed(2)}
Potential Monthly Savings: $${Number(feeAnalysis.savingsPotential || 0).toFixed(2)}
Fee Mismatch Score: ${feeAnalysis.mismatchScore ?? 0}/100

FEE BREAKDOWN
-------------
${feesByType
  .map(
    (fee) => `
${fee.name}
  Total: $${Number(fee.total || 0).toFixed(2)} (${Number(fee.count || 0)} occurrences)
  Severity: ${(fee.severity || "").toUpperCase()}
  Avoidable: ${fee.avoidable ? "Yes" : "No"}
  Recommendation: ${fee.recommendation || ""}
`
  )
  .join("")}

RECOMMENDATIONS
---------------
${feesByType
  .filter((f) => f.avoidable)
  .map((fee, i) => `${i + 1}. ${fee.recommendation}`)
  .join("\n")}

---
Report generated by Oli-Branch Financial Dashboard
    `.trim();

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oli-branch-financial-leaks-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded!");
  };

  return (
    <DashboardLayout title="Financial Leaks" subtitle="Detailed breakdown of your banking fees" className="bg-[#F8F5F0]">
      <style>{`
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
        .achievement-card {
          border-left: 4px solid #1B4332 !important;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
        }
        .stats-card {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
          border: 1px solid rgba(82, 121, 111, 0.1);
        }
        .progress-gradient {
          background: linear-gradient(90deg, #1B4332 0%, #52796F 100%);
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
      `}</style>

      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate("/link")} className="gap-2 btn-secondary">
          <ArrowLeft className="h-4 w-4" />
          Back to Bank Linking
        </Button>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="stats-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#52796F]">Total Fees</p>
                    <p className="text-3xl font-bold text-[#DC2626]">${Number(feeAnalysis.totalFees || 0).toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#DC2626]/10">
                    <DollarSign className="h-6 w-6 text-[#DC2626]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="stats-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#52796F]">Avoidable Fees</p>
                    <p className="text-3xl font-bold text-[#F59E0B]">${Number(feeAnalysis.avoidableFees || 0).toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#F59E0B]/10">
                    <AlertTriangle className="h-6 w-6 text-[#F59E0B]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="stats-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#52796F]">Potential Savings</p>
                    <p className="text-3xl font-bold text-[#10B981]">${Number(feeAnalysis.savingsPotential || 0).toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#10B981]/10">
                    <TrendingDown className="h-6 w-6 text-[#10B981]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="stats-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#52796F]">Mismatch Score</p>
                    <p className="text-3xl font-bold text-[#1B4332]">{feeAnalysis.mismatchScore ?? 0}/100</p>
                  </div>
                  <div className="p-3 rounded-full bg-[#1B4332]/10">
                    <AlertTriangle className="h-6 w-6 text-[#1B4332]" />
                  </div>
                </div>
                <Progress value={Number(feeAnalysis.mismatchScore || 0)} className="mt-3 h-2 progress-gradient" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="text-[#1B4332]">Fee Distribution</CardTitle>
              <CardDescription className="text-[#52796F]">Breakdown by fee type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${Number(value || 0).toFixed(2)}`}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(27, 67, 50, 0.1)",
                        backgroundColor: "white",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                    <span className="text-sm text-[#52796F]">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="chart-container">
            <CardHeader>
              <CardTitle className="text-[#1B4332]">Fee Amounts by Type</CardTitle>
              <CardDescription className="text-[#52796F]">Total amount per category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(27, 67, 50, 0.1)" />
                    <XAxis dataKey="name" stroke="#52796F" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#52796F" />
                    <Tooltip
                      formatter={(value) => `$${Number(value || 0).toFixed(2)}`}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(27, 67, 50, 0.1)",
                        backgroundColor: "white",
                      }}
                    />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fee Rules Reference */}
        <Card className="achievement-card">
          <CardHeader>
            <CardTitle className="text-[#1B4332]">Fee Rules & Thresholds</CardTitle>
            <CardDescription className="text-[#52796F]">How we detect financial leaks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEE_RULES.map((rule, index) => (
                <motion.div
                  key={rule.type}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    rule.severity === "high" ? "leak-card-high" : rule.severity === "medium" ? "leak-card-medium" : "leak-card-low"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        rule.severity === "high" ? "bg-[#DC2626]/20" : rule.severity === "medium" ? "bg-[#F59E0B]/20" : "bg-[#10B981]/20"
                      }`}
                    >
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          rule.severity === "high" ? "text-[#DC2626]" : rule.severity === "medium" ? "text-[#F59E0B]" : "text-[#10B981]"
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1B4332]">{rule.name}</h4>
                      <p className="text-sm text-[#52796F] mt-1">{rule.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge
                          className={`${
                            rule.severity === "high"
                              ? "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20"
                              : rule.severity === "medium"
                              ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                              : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                          }`}
                        >
                          {rule.severity} priority
                        </Badge>
                        <span className="text-sm font-medium text-[#1B4332]">${rule.threshold}+</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fee Details */}
        <Card className="achievement-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-[#1B4332]">Fee Breakdown & Recommendations</CardTitle>
              <CardDescription className="text-[#52796F]">Detailed analysis with actionable recommendations</CardDescription>
            </div>
            <Button onClick={handleDownloadPDF} className="gap-2 btn-primary">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feesByType.map((fee, index) => (
                <motion.div
                  key={fee.type || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${
                    fee.severity === "high" ? "leak-card-high" : fee.severity === "medium" ? "leak-card-medium" : "leak-card-low"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          fee.severity === "high" ? "bg-[#DC2626]/20" : fee.severity === "medium" ? "bg-[#F59E0B]/20" : "bg-[#10B981]/20"
                        }`}
                      >
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            fee.severity === "high" ? "text-[#DC2626]" : fee.severity === "medium" ? "text-[#F59E0B]" : "text-[#10B981]"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1B4332]">{fee.name}</h4>
                        <p className="text-sm text-[#52796F]">{fee.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-[#1B4332]">${Number(fee.total || 0).toFixed(2)}</p>
                      <p className="text-sm text-[#52796F]">{Number(fee.count || 0)} occurrences</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${
                          fee.severity === "high"
                            ? "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20"
                            : fee.severity === "medium"
                            ? "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20"
                            : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                        }`}
                      >
                        {fee.severity} priority
                      </Badge>

                      {fee.avoidable && (
                        <Badge className="text-[#10B981] border-[#10B981]/20 bg-[#10B981]/10">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Avoidable
                        </Badge>
                      )}
                    </div>

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.info(`Learn more about ${fee.name} fees`);
                      }}
                      className="text-sm text-[#52796F] hover:text-[#1B4332] flex items-center gap-1"
                    >
                      Learn more <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  <div className="mt-3 p-3 rounded-lg bg-white border border-[#52796F]/10">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-[#1B4332] shrink-0 mt-0.5" />
                      <p className="text-sm text-[#52796F]">{fee.recommendation}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
