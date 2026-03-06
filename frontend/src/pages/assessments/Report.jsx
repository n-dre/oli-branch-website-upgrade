import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  FileText,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Building2,
  ExternalLink,
  Award,
  DollarSign,
  Sparkles,
  ArrowLeft,
  Search,
  Filter,
  X,
  ChevronRight,
  Calendar,
  Clock,
  BarChart3,
  Users,
  Eye,
  EyeOff,
  Check,
  Info,
  Loader2,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useData } from "../../context/DataContext";
import { cn } from "../../lib/utils";
import { toast } from "sonner";

// Fixed color definitions - using hex codes instead of HSL
const RISK_COLORS = {
  High: "#1B4332",
  Medium: "#52796F",
  Low: "#D4AF37",
};

const RISK_GRADIENTS = {
  High: "linear-gradient(135deg, #1B4332)",
  Medium: "linear-gradient(135deg, #52796F)",
  Low: "linear-gradient(135deg, #D4AF37)",
};

export default function Report() {
  const { email: routeEmail } = useParams();
  const navigate = useNavigate();
  const { responses, getScoring, getChartData, loading } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [selectedEmail, setSelectedEmail] = useState(routeEmail ? decodeURIComponent(routeEmail) : null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [viewMode, setViewMode] = useState("detailed"); // 'detailed' or 'summary'

  useEffect(() => {
    if (routeEmail && !selectedEmail) {
      const email = decodeURIComponent(routeEmail);
      setSelectedEmail(email);
    }
  }, [routeEmail, selectedEmail]);

  const chartData = getChartData();

  const filteredResponses = useMemo(() => {
    return (responses || []).filter((r) => {
      const scoring = getScoring(r);
      const matchesSearch =
        String(r?.businessName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(r?.email || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = filterRisk === "all" || scoring.riskLabel === filterRisk;
      return matchesSearch && matchesRisk;
    });
  }, [responses, searchTerm, filterRisk, getScoring]);

  const selectedResponse = selectedEmail ? (responses || []).find((r) => r.email === selectedEmail) : null;

  const selectedScoring = selectedResponse ? getScoring(selectedResponse) : null;

  // Calculate time since submission
  const getTimeSinceSubmission = (timestamp) => {
    const t = Number(timestamp);
    if (!Number.isFinite(t)) return "—";
    const diff = Date.now() - t;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  const handleShare = async (type = "link") => {
    const url = window.location.href;

    if (type === "link") {
      try {
        await navigator.clipboard.writeText(url);
        setCopiedLink(true);
        toast.success("Report link copied to clipboard!");
        setTimeout(() => setCopiedLink(false), 2000);
      } catch {
        toast.error("Failed to copy link");
      }
    } else if (type === "email") {
      toast.info("Email sharing would open your email client");
    }
  };

  const handleDownload = () => {
    if (!selectedResponse || !selectedScoring) {
      toast.error("Select a report first.");
      return;
    }

    const reportText = `
Oli-Branch Financial Mismatch Report
=====================================

Business: ${selectedResponse.businessName}
Email: ${selectedResponse.email}
Date: ${new Date(selectedResponse.timestamp).toLocaleDateString()}

MISMATCH SCORE: ${selectedScoring.mismatchScore}/100
RISK LEVEL: ${selectedScoring.riskLabel}
FEE WASTE: ${Number(selectedScoring.feeWastePercent || 0).toFixed(1)}% of revenue

KEY ISSUES:
${(selectedScoring.keyReasons || []).map((r) => `• ${r}`).join("\n")}

BANK RECOMMENDATIONS:
1. ${selectedScoring.bankMatch1}
   Why: ${selectedScoring.why1}

2. ${selectedScoring.bankMatch2}
   Why: ${selectedScoring.why2}

GRANT OPPORTUNITIES:
${(selectedScoring.grantsSuggested || [])
  .map((g, i) => `${i + 1}. ${g.grant}\n   ${g.why}`)
  .join("\n\n")}

RESOURCE LINKS:
SBA: ${selectedScoring.sbaLink}
SSBCI: ${selectedScoring.ssbciLink}
    `;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oli-branch-report-${String(selectedResponse.businessName || "business")
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "")}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Report downloaded successfully!");
  };

  const handleExportPDF = () => {
    toast.info("PDF export feature coming soon!");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterRisk("all");
  };

  const quickActions = [
    {
      label: "Download Report",
      icon: Download,
      onClick: handleDownload,
      variant: "default",
      activeClass: "bg-[#1B4332] text-white hover:bg-[#52796F] active:bg-[#1B4332]",
    },
    {
      label: "Share",
      icon: Share2,
      onClick: () => handleShare("link"),
      variant: "default",
      activeClass: "bg-[#1B4332] text-white hover:bg-[#52796F] active:bg-[#1B4332]",
    },
    {
      label: "New Assessment",
      icon: FileText,
      onClick: () => navigate("/intake"),
      variant: "outline",
      size: "sm",
      className:
        "btn-secondary hover:bg-[#E6F4EF] hover:text-[#1B4332] hover:border-[#1B4332]",
    },
  ];

  return (
    <DashboardLayout title="FinReports" subtitle="Detailed mismatch analysis and recommendations">
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
          color: #1B4332 !important;
          background: transparent !important;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #1B4332 !important;
          color: #F8F5F0 !important;
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

        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(248, 245, 240, 0.9);
        }

        .admin-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: white;
        }

        .admin-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }

        .hover-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: white;
        }

        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }

        .clickable {
          cursor: pointer;
          user-select: none;
        }

        .focus-ring:focus {
          outline: 2px solid #1B4332;
          outline-offset: 2px;
        }

        .hover-lift:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse { animation: pulse 2s infinite; }

        .health-progress-bg {
          background: linear-gradient(90deg, #1B4332 0%, #52796F 100%);
        }

        .risk-high-progress {
          background: linear-gradient(90deg, #52796F 0%, #1B4332 100%) !important;
        }

        .risk-medium-progress {
          background: linear-gradient(90deg, #10B981 0%, #52796F 100%) !important;
        }

        .risk-low-progress {
          background: linear-gradient(90deg, #D4AF37 0%, #F59E0B 100%) !important;
        }

        .portfolio-risk-high {
          background: linear-gradient(90deg, #52796F 0%, #1B4332 100%) !important;
        }

        .portfolio-risk-medium {
          background: linear-gradient(90deg, #10B981 0%, #52796F 100%) !important;
        }

        .portfolio-risk-low {
          background: linear-gradient(90deg, #D4AF37 0%, #F59E0B 100%) !important;
        }

        .achievement-gradient {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
        }

        .highlight-border {
          border-left: 4px solid #1B4332;
        }

        .tool-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.02) 0%, rgba(82, 121, 111, 0.02) 100%);
        }

        .tool-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }

        .budget-gradient {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
        }

        .resource-gradient {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.1) 0%, rgba(82, 121, 111, 0.1) 100%);
        }

        .settings-gradient {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.08) 0%, rgba(82, 121, 111, 0.08) 100%);
        }

        .danger-gradient {
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
        }

        .security-gradient {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%);
        }

        .location-card {
          border-left: 4px solid #1B4332;
          transition: all 0.3s ease;
        }

        .location-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }

        .theme-active {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%) !important;
          color: white !important;
          border-color: #1B4332 !important;
        }

        .input-focus:focus {
          border-color: #52796F;
          box-shadow: 0 0 0 2px rgba(82, 121, 111, 0.2);
          outline: none;
        }

        .password-strength-bar {
          background: linear-gradient(90deg, #1B4332 0%, #52796F 50%, #D4AF37 100%);
        }

        .payment-card {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.03) 0%, rgba(82, 121, 111, 0.03) 100%);
          border: 1px solid rgba(82, 121, 111, 0.1);
          transition: all 0.3s ease;
        }

        .payment-card:hover {
          border-color: #52796F;
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
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

      {/* Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Reports</span>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              size="sm"
              onClick={action.onClick}
              className={cn("gap-2 transition-all active:scale-95 active:opacity-80", action.activeClass)}
            >
              <action.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Response List */}
        <div className="lg:col-span-1">
          <Card className="stats-card sticky top-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Business Submissions
                  <Badge variant="outline" className="ml-2">
                    {responses.length}
                  </Badge>
                </CardTitle>
                {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
              <CardDescription>Select a business to view its report</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Enhanced Search & Filter */}
              <div className="space-y-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Search businesses or emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Select value={filterRisk} onValueChange={setFilterRisk}>
                    <SelectTrigger className="flex-1">
                      <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Filter by risk" />
                    </SelectTrigger>

                    {/* Fix: white background + light green hover + stays above content */}
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      <SelectItem value="all" className="hover:bg-[#E6F4EF] focus:bg-[#E6F4EF]">
                        All Risks
                      </SelectItem>
                      <SelectItem value="High" className="hover:bg-[#E6F4EF] focus:bg-[#E6F4EF]">
                        High Risk
                      </SelectItem>
                      <SelectItem value="Medium" className="hover:bg-[#E6F4EF] focus:bg-[#E6F4EF]">
                        Medium Risk
                      </SelectItem>
                      <SelectItem value="Low" className="hover:bg-[#E6F4EF] focus:bg-[#E6F4EF]">
                        Low Risk
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  {(searchTerm || filterRisk !== "all") && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-10 px-3">
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {filteredResponses.length > 0 && (
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Showing {filteredResponses.length} of {responses.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setViewMode(viewMode === "detailed" ? "summary" : "detailed")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      {viewMode === "detailed" ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {viewMode === "detailed" ? "Summary" : "Detailed"} View
                    </button>
                  </div>
                )}
              </div>

              {/* Enhanced Response List */}
              <AnimatePresence mode="wait">
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/30">
                  {filteredResponses.length > 0 ? (
                    filteredResponses.map((response, index) => {
                      const scoring = getScoring(response);
                      const isSelected = selectedEmail === response.email;

                      return (
                        <motion.button
                          key={response.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => setSelectedEmail(response.email)}
                          className={cn(
                            "w-full p-3 rounded-lg text-left transition-all duration-200 group clickable hover-lift",
                            isSelected
                              ? "bg-primary/10 border-2 border-primary shadow-sm"
                              : "bg-muted/30 hover:bg-muted/50 border-2 border-transparent hover:border-muted-foreground/20"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                  {response.businessName}
                                </p>
                                <Badge
                                  variant={
                                    scoring.riskLabel === "High"
                                      ? "destructive"
                                      : scoring.riskLabel === "Medium"
                                      ? "warning"
                                      : "success"
                                  }
                                  className="shrink-0 text-xs px-1.5 py-0"
                                  style={{
                                    background: RISK_GRADIENTS[scoring.riskLabel],
                                    color: "white",
                                  }}
                                >
                                  {scoring.mismatchScore}
                                </Badge>
                              </div>

                              <p className="text-xs text-muted-foreground truncate mb-2">{response.email}</p>

                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(response.timestamp).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {getTimeSinceSubmission(response.timestamp)}
                                </span>
                              </div>
                            </div>

                            <ChevronRight
                              className={cn(
                                "h-4 w-4 text-muted-foreground ml-2 shrink-0 transition-transform",
                                isSelected && "translate-x-1 text-primary"
                              )}
                            />
                          </div>
                        </motion.button>
                      );
                    })
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8 text-muted-foreground"
                    >
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-medium mb-1">No submissions found</p>
                      <p className="text-xs mb-4">
                        {searchTerm || filterRisk !== "all"
                          ? "Try adjusting your search or filters"
                          : "Add your first business assessment"}
                      </p>
                      {searchTerm || filterRisk !== "all" ? (
                        <Button variant="outline" size="sm" onClick={handleClearFilters} className="btn-secondary">
                          Clear Filters
                        </Button>
                      ) : (
                        <Link to="/intake">
                          <Button size="sm" className="btn-primary">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Add First Business
                          </Button>
                        </Link>
                      )}
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Report View */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedResponse && selectedScoring ? (
              <motion.div
                key={selectedResponse.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Enhanced Report Header */}
                <Card className="hover-card">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>

                          <div>
                            <CardTitle className="text-2xl flex items-center gap-2">
                              {selectedResponse.businessName}
                              <Badge variant="outline" className="text-xs">
                                {selectedResponse.entityType}
                              </Badge>
                            </CardTitle>

                            <CardDescription className="mt-1 flex flex-wrap items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(selectedResponse.timestamp).toLocaleDateString()}
                              </span>

                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {getTimeSinceSubmission(selectedResponse.timestamp)}
                              </span>

                              <span>{selectedResponse.email}</span>
                            </CardDescription>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleShare("link")}
                          className="relative btn-secondary"
                        >
                          {copiedLink ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Share2 className="h-4 w-4" />
                          )}

                          {copiedLink && (
                            <span className="absolute -top-2 -right-2 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">
                              Copied!
                            </span>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownload}
                          className="btn-secondary"
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleExportPDF}
                          className="gap-2 btn-primary"
                        >
                          <FileText className="h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Oli Summary */}
                <Card className="hover-card">
                  <CardContent className="pt-4">
                    <Badge className="mb-2">Oli Summary</Badge>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedScoring?.oliSummary ||
                        "Oli analyzed your financial structure and identified areas where banking mismatches and operational friction are creating unnecessary financial leaks. Addressing these issues can significantly improve your financial stability and growth potential."}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Mismatch Score */}
                  <Card className="hover-card">
                    <CardContent className="pt-6 flex flex-col items-center">
                      <div className="relative w-32 h-32 mb-4">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="hsl(var(--muted))"
                            strokeWidth="8"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={RISK_COLORS[selectedScoring.riskLabel]}
                            strokeWidth="8"
                            strokeDasharray="283"
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{
                              strokeDashoffset: 283 - selectedScoring.mismatchScore * 2.83,
                            }}
                            transition={{ duration: 1 }}
                          />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold">
                            {selectedScoring.mismatchScore}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Mismatch Score
                          </span>
                        </div>
                      </div>

                      <Badge
                        style={{
                          background: RISK_GRADIENTS[selectedScoring.riskLabel],
                          color: "white",
                        }}
                      >
                        {selectedScoring.riskLabel} Risk
                      </Badge>
                    </CardContent>
                  </Card>

                  {/* Financial Health Score */}
                  <Card className="hover-card">
                    <CardContent className="pt-6 flex flex-col items-center">
                      <div className="relative w-32 h-32 mb-4">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="hsl(var(--muted))"
                            strokeWidth="8"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="8"
                            strokeDasharray="283"
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: 283 }}
                            animate={{
                              strokeDashoffset:
                                283 - selectedScoring.financialHealthScore * 2.83,
                            }}
                            transition={{ duration: 1 }}
                          />
                        </svg>

                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold">
                            {selectedScoring.financialHealthScore}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Health Score
                          </span>
                        </div>
                      </div>

                      <Badge className="bg-green-600 text-white">
                        Financial Health
                      </Badge>
                    </CardContent>
                  </Card>

                  {/* Financial Overview */}
                  <Card className="hover-card">
                    <CardContent className="pt-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Financial overview metrics appear here.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Key Metrics */}
                <Card className="md:col-span-2 hover-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-accent" />
                      Financial Overview
                      <button
                        type="button"
                        className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => toast.info("Monthly revenue and fee analysis")}
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-200/50">
                        <p className="text-xs text-muted-foreground mb-1">Monthly Revenue</p>
                        <p className="text-xl font-bold text-foreground">
                          ${Number(selectedResponse.monthlyRevenue || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-200/50">
                        <p className="text-xs text-muted-foreground mb-1">Monthly Fees</p>
                        <p className="text-xl font-bold text-foreground">${selectedResponse.monthlyFees}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-200/50">
                        <p className="text-xs text-muted-foreground mb-1">Fee Waste</p>
                        <p className="text-xl font-bold text-foreground">{selectedScoring.feeWastePercent.toFixed(2)}%</p>
                        <p className="text-xs text-muted-foreground">of revenue</p>
                      </div>

                      <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-200/50">
                        <p className="text-xs text-muted-foreground mb-1">Potential Savings</p>
                        <p className="text-xl font-bold text-foreground">
                          $
                          {Math.round(
                            Number(selectedResponse.monthlyRevenue || 0) *
                              (Number(selectedScoring.feeWastePercent || 0) / 100)
                          ).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Fee Waste Percentage</span>
                        <span className="font-medium">{selectedScoring.feeWastePercent.toFixed(2)}%</span>
                      </div>
                      <Progress
                        value={Math.min(selectedScoring.feeWastePercent * 10, 100)}
                        className="h-2 progress-gradient"
                        indicatorClassName={cn(
                          selectedScoring.feeWastePercent > 10
                            ? "risk-high-progress"
                            : selectedScoring.feeWastePercent > 5
                            ? "risk-medium-progress"
                            : "risk-low-progress"
                        )}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge variant="outline" className="gap-1 category-badge">
                        <Building2 className="h-3 w-3" />
                        {selectedResponse.accountType} account
                      </Badge>
                      {selectedResponse.cashDeposits && (
                        <Badge variant="secondary" className="gap-1 tag-badge">
                          <DollarSign className="h-3 w-3" />
                          Cash deposits
                        </Badge>
                      )}
                      {selectedResponse.veteranOwned && (
                        <Badge variant="success" className="gap-1 tag-badge">
                          <Award className="h-3 w-3" />
                          Veteran Owned
                        </Badge>
                      )}
                      {selectedResponse.immigrantFounder && (
                        <Badge variant="success" className="gap-1 tag-badge">
                          <Users className="h-3 w-3" />
                          Immigrant Founder
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Tabs for Details */}
                <Tabs defaultValue="issues" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg">
                    <TabsTrigger value="issues" className="rounded-md data-[state=active]:bg-background clickable">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Key Issues
                    </TabsTrigger>
                    <TabsTrigger value="banks" className="rounded-md data-[state=active]:bg-background clickable">
                      <Building2 className="h-4 w-4 mr-2" />
                      Bank Matches
                    </TabsTrigger>
                    <TabsTrigger value="grants" className="rounded-md data-[state=active]:bg-background clickable">
                      <Award className="h-4 w-4 mr-2" />
                      Grants
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="issues" className="mt-4">
                    <Card className="hover-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          Mismatch Analysis
                        </CardTitle>
                        <CardDescription>Issues identified in your current banking setup</CardDescription>
                      </CardHeader>

                      <CardContent>
                        {selectedScoring.keyReasons.length > 0 ? (
                          <div className="space-y-3">
                            {selectedScoring.keyReasons.map((reason, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-amber-50/50 to-transparent border border-amber-200/50 clickable hover-lift"
                              >
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-foreground mb-1">Issue #{index + 1}</p>
                                  <p className="text-sm text-muted-foreground">{reason}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50/50 border border-green-200">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-green-800">Excellent match!</p>
                              <p className="text-sm text-green-700">
                                No significant mismatches detected with your current banking setup.
                              </p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="banks" className="mt-4">
                    <Card className="hover-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-primary" />
                          Recommended Banking Partners
                        </CardTitle>
                        <CardDescription>Banks that better match your business profile</CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {selectedScoring.bankMatch1 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/30 transition-all duration-300 group tool-card"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                                <Building2 className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-lg">{selectedScoring.bankMatch1}</h4>
                                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white">
                                    <Sparkles className="h-3 w-3 mr-1" />
                                    Top Match
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Best overall fit for your business needs</p>
                              </div>
                            </div>

                            <div className="pl-15">
                              <p className="text-sm text-foreground mb-3">{selectedScoring.why1}</p>
                              <Button variant="outline" size="sm" className="gap-2 btn-secondary">
                                Learn More
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </motion.div>
                        )}

                        {selectedScoring.bankMatch2 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="p-4 rounded-xl border border-muted bg-card hover:border-muted-foreground/30 transition-all duration-300 tool-card"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-sm">
                                <Building2 className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-lg">{selectedScoring.bankMatch2}</h4>
                                  <Badge variant="outline">Alternative</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">Good alternative with competitive offerings</p>
                              </div>
                            </div>

                            <div className="pl-15">
                              <p className="text-sm text-foreground mb-3">{selectedScoring.why2}</p>
                              <Button variant="outline" size="sm" className="gap-2 btn-secondary">
                                Learn More
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="grants" className="mt-4">
                    <Card className="hover-card">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Award className="h-5 w-5 text-accent" />
                          Funding Opportunities
                        </CardTitle>
                        <CardDescription>Grants and programs you may qualify for</CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {selectedScoring.grantsSuggested.length > 0 ? (
                          selectedScoring.grantsSuggested.map((grant, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-4 rounded-xl border border-muted bg-gradient-to-r from-accent/5 to-transparent hover:border-accent/30 transition-all duration-300 tool-card"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                  <DollarSign className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                  <Badge variant="outline" className="mb-1">
                                    Opportunity #{index + 1}
                                  </Badge>
                                  <h4 className="font-semibold">{grant.grant}</h4>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground pl-13 mb-3">{grant.why}</p>
                              <Button variant="outline" size="sm" className="gap-2 btn-secondary">
                                Apply Now
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium mb-1">No specific grants identified</p>
                            <p className="text-xs mb-4">Check general resources below for funding options</p>
                          </div>
                        )}

                        {/* Enhanced Resource Links */}
                        <div className="pt-4 border-t border-border">
                          <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            Additional Resources
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <a
                              href={selectedScoring.sbaLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/20 hover:border-primary/30 transition-all group resource-gradient clickable hover-lift"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Building2 className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">SBA Resources</p>
                                  <p className="text-xs text-muted-foreground">Small Business Administration</p>
                                </div>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </a>

                            <a
                              href={selectedScoring.ssbciLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-lg bg-accent/5 hover:bg-accent/10 border border-accent/20 hover:border-accent/30 transition-all group resource-gradient clickable hover-lift"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                                  <Award className="h-4 w-4 text-accent" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">SSBCI Program</p>
                                  <p className="text-xs text-muted-foreground">State Small Business Credit Initiative</p>
                                </div>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            ) : (
              /* Enhanced Empty State */
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full">
                <Card className="h-full min-h-[400px] flex items-center justify-center border-dashed border-2 stats-card">
                  <CardContent className="text-center py-12 px-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-6">
                      <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Report Selected</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                      Select a business from the list to view its detailed financial mismatch analysis and recommendations.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      {responses.length === 0 ? (
                        <Link to="/intake">
                          <Button className="gap-2 btn-primary">
                            <Sparkles className="h-4 w-4" />
                            Start First Assessment
                          </Button>
                        </Link>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (filteredResponses.length > 0) setSelectedEmail(filteredResponses[0].email);
                            }}
                            disabled={filteredResponses.length === 0}
                            className="gap-2 btn-secondary"
                          >
                            <ChevronRight className="h-4 w-4" />
                            Select First Business
                          </Button>
                          <Link to="/intake">
                            <Button variant="ghost" className="gap-2">
                              <FileText className="h-4 w-4" />
                              Add New Business
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Enhanced Overall Risk Distribution */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8">
        <Card className="stats-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-accent" />
              Portfolio Risk Overview
              <Badge variant="outline" className="ml-2">
                {responses.length} businesses
              </Badge>
            </CardTitle>
            <CardDescription>Distribution of financial mismatch risk across all submissions</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="hsl(var(--background))"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.name === "High Risk" ? "#1B4332" : entry.name === "Medium Risk" ? "#52796F" : "#D4AF37"}
                          className="hover:opacity-60 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      content={({ payload }) => {
                        if (payload && payload.length > 0) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg shadow-lg p-3 glass-effect">
                              <p className="font-medium text-sm">{data.name}</p>
                              <p className="text-sm">{data.value} businesses</p>
                              <p className="text-xs text-muted-foreground">
                                {responses.length > 0 ? ((data.value / responses.length) * 100).toFixed(1) : "0.0"}% of total
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 space-y-4">
                {chartData.map((entry) => {
                  const percentage = responses.length > 0 ? (entry.value / responses.length) * 100 : 0;
                  const riskLabel = entry.name.replace(" Risk", "");

                  return (
                    <div key={entry.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: RISK_COLORS[riskLabel] || "#cccccc",
                            }}
                          />
                          <span className="font-medium text-sm">{entry.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold">{entry.value}</span>
                          <span className="text-xs text-muted-foreground ml-2">{percentage.toFixed(1)}%</span>
                        </div>
                      </div>

                      <Progress
                        value={percentage}
                        className="h-2"
                        indicatorClassName={cn(
                          riskLabel === "High" ? "portfolio-risk-high" : riskLabel === "Medium" ? "portfolio-risk-medium" : "portfolio-risk-low"
                        )}
                      />
                    </div>
                  );
                })}

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Businesses Analyzed</span>
                    <span className="font-bold">{responses.length}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Average Mismatch Score</span>
                    <span className="font-bold">
                      {responses.length > 0
                        ? Math.round(
                            (responses || []).reduce((acc, r) => acc + getScoring(r).mismatchScore, 0) / responses.length
                          )
                        : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}

