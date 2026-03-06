// frontend/src/pages/tools/LinkBank.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Building2,
  Link as LinkIcon,
  Unlink,
  Shield,
  CheckCircle,
  RefreshCw,
  Wallet,
  Lock,
  Crown,
  X,
  Briefcase,
  Banknote,
  Users,
  FileText,
  Check,
  ChevronRight,
  Info,
  Upload,
  Globe,
  ShieldCheck,
  Database,
  Key,
  EyeOff,
  Plus,
  BarChart3,
  Clock,
  Search,
  Building,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";
import { useData } from "../../context/DataContext";

const BUSINESS_BANKS = [
  { 
    id: "chase", 
    name: "JPMorgan Chase Business", 
    logo: "🏦", 
    color: "bg-blue-500",
    businessOnly: true,
    supportsMulti: true,
    apiType: "Plaid",
    minBalance: 1000
  },
  { 
    id: "bofa", 
    name: "Bank of America Business", 
    logo: "🏛️", 
    color: "bg-red-500",
    businessOnly: true,
    supportsMulti: true,
    apiType: "Finicity",
    minBalance: 5000
  },
  { 
    id: "wells", 
    name: "Wells Fargo Business", 
    logo: "🏪", 
    color: "bg-yellow-500",
    businessOnly: true,
    supportsMulti: false,
    apiType: "MX",
    minBalance: 2500
  },
  { 
    id: "citi", 
    name: "Citibank Commercial", 
    logo: "🏢", 
    color: "bg-blue-600",
    businessOnly: true,
    supportsMulti: true,
    apiType: "Plaid",
    minBalance: 10000
  },
  { 
    id: "capital", 
    name: "Capital One Spark Business", 
    logo: "💳", 
    color: "bg-red-600",
    businessOnly: true,
    supportsMulti: true,
    apiType: "Finicity",
    minBalance: 3000
  },
  { 
    id: "usbank", 
    name: "U.S. Bank Business", 
    logo: "🇺🇸", 
    color: "bg-purple-500",
    businessOnly: true,
    supportsMulti: false,
    apiType: "MX",
    minBalance: 2000
  },
  { 
    id: "td", 
    name: "TD Bank Business", 
    logo: "🏪", 
    color: "bg-green-500",
    businessOnly: true,
    supportsMulti: true,
    apiType: "Plaid",
    minBalance: 1500
  },
  { 
    id: "siliconvalley", 
    name: "Silicon Valley Bank", 
    logo: "💻", 
    color: "bg-indigo-500",
    businessOnly: true,
    supportsMulti: true,
    apiType: "Direct API",
    minBalance: 25000
  },
];

export default function BusinessBankLinking() {
  const { linkedBanks, linkBankAccount, unlinkBankAccount, subscription, feeAnalysis } =
    useData();
  const navigate = useNavigate();

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [linkingStep, setLinkingStep] = useState("select"); // select, business-verify, credentials, accounts, success
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [businessInfo, setBusinessInfo] = useState({
    ein: "",
    businessName: "",
    businessType: "LLC",
    accountType: "checking"
  });
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualBankInfo, setManualBankInfo] = useState({
    name: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "checking"
  });

  // Trial logic - users get 7 days trial before needing premium
  const trialDays = 7; // 7-day trial
  const trialEndDate = new Date(); // This would come from backend/user data
  trialEndDate.setDate(trialEndDate.getDate() + trialDays);
  
  // Check if user is in trial period (simplified - in real app, check against actual trial end date)
  const isTrialActive = subscription.plan === "trial" || subscription.plan === "free";
  const isPremium = subscription.plan === "premium" || subscription.plan === "business";
  const isBusinessPlan = subscription.plan === "business";
  
  // Can connect accounts if in trial OR has premium
  const canConnectAccounts = isTrialActive || isPremium;

  const handleSelectBank = (bank) => {
    if (!canConnectAccounts) {
      toast.error("Please upgrade to Premium or start your trial to connect business accounts");
      navigate("/pricing");
      return;
    }
    
    // During trial, don't check for business plan restrictions
    if (!isTrialActive && !isBusinessPlan && bank.minBalance > 10000) {
      toast.error("This bank requires Business Plan for high-balance accounts");
      navigate("/pricing");
      return;
    }
    
    setSelectedBank(bank);
    setLinkingStep("business-verify");
  };

  const handleBusinessVerify = () => {
    if (!businessInfo.ein || !businessInfo.businessName) {
      toast.error("Please enter valid business information");
      return;
    }
    
    // Simulate EIN validation
    if (businessInfo.ein.length < 9) {
      toast.error("Please enter a valid 9-digit EIN");
      return;
    }
    
    setLinkingStep("credentials");
  };

  const handleLink = async () => {
    if (!credentials.username || !credentials.password) {
      toast.error("Please enter your business banking credentials");
      return;
    }

    setLinkingStep("accounts");
    
    // Simulate fetching available accounts
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock available accounts
    const availableAccounts = [
      { id: "checking1", name: "Primary Business Checking", type: "checking", balance: 45287.63 },
      { id: "savings1", name: "Business Savings", type: "savings", balance: 125000.00 },
      { id: "checking2", name: "Operations Checking", type: "checking", balance: 15732.41 },
      { id: "credit", name: "Business Line of Credit", type: "line", balance: -25000.00 },
    ];
    
    setSelectedAccounts([availableAccounts[0].id]);
  };

  const handleConnectAccounts = async () => {
    if (selectedAccounts.length === 0) {
      toast.error("Please select at least one business account");
      return;
    }

    setLinkingStep("loading");
    
    // Simulate connection progress
    const progressInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    clearInterval(progressInterval);
    
    // Link all selected accounts
    selectedAccounts.forEach(accountId => {
      linkBankAccount({
        bankId: selectedBank.id + "_" + accountId,
        bankName: selectedBank.name,
        accountType: "Business Account",
        accountMask: "****" + Math.floor(1000 + Math.random() * 9000),
        logo: selectedBank.logo,
        isBusiness: true,
        businessName: businessInfo.businessName,
        ein: businessInfo.ein,
      });
    });

    setLinkingStep("success");
    toast.success(`${selectedBank.name} linked successfully!`);

    setTimeout(() => {
      setShowLinkModal(false);
      setLinkingStep("select");
      setSelectedBank(null);
      setCredentials({ username: "", password: "" });
      setBusinessInfo({ ein: "", businessName: "", businessType: "LLC", accountType: "checking" });
      setSelectedAccounts([]);
      setConnectionProgress(0);
    }, 2000);
  };

  const handleManualBankConnect = () => {
    if (!manualBankInfo.name || !manualBankInfo.accountNumber || !manualBankInfo.routingNumber) {
      toast.error("Please fill in all required bank information");
      return;
    }
    
    // Validate routing number (should be 9 digits)
    if (manualBankInfo.routingNumber.length !== 9 || !/^\d+$/.test(manualBankInfo.routingNumber)) {
      toast.error("Please enter a valid 9-digit routing number");
      return;
    }
    
    // Validate account number (should be at least 4 digits)
    if (manualBankInfo.accountNumber.length < 4 || !/^\d+$/.test(manualBankInfo.accountNumber)) {
      toast.error("Please enter a valid account number");
      return;
    }
    
    setLinkingStep("loading");
    
    // Simulate connection progress
    const progressInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      clearInterval(progressInterval);
      
      // Link the manual bank
      linkBankAccount({
        bankId: "manual_" + Date.now(),
        bankName: manualBankInfo.name,
        accountType: `Manual ${manualBankInfo.accountType.charAt(0).toUpperCase() + manualBankInfo.accountType.slice(1)}`,
        accountMask: "****" + manualBankInfo.accountNumber.slice(-4),
        logo: "🏦",
        isBusiness: true,
        businessName: businessInfo.businessName || "Manual Business Account",
        ein: businessInfo.ein || "MANUAL",
        isManual: true,
      });

      setLinkingStep("success");
      toast.success(`${manualBankInfo.name} connected successfully!`);

      setTimeout(() => {
        setShowLinkModal(false);
        setShowManualEntry(false);
        setLinkingStep("select");
        setSelectedBank(null);
        setManualBankInfo({
          name: "",
          accountNumber: "",
          routingNumber: "",
          accountType: "checking"
        });
        setConnectionProgress(0);
      }, 2000);
    }, 3000);
  };

  const handleUnlink = (bankId) => {
    if (window.confirm("Are you sure you want to unlink this business account?")) {
      unlinkBankAccount(bankId);
      toast.success("Business account unlinked");
    }
  };

  // Button click handlers
  const handleGenerateReports = () => {
    navigate("/reports/business");
  };

  const handleMonitorCashFlow = () => {
    navigate("/analytics/cash-flow");
  };

  const handleAddTeamMembers = () => {
    navigate("/team/manage");
  };

  const handleViewDetailedAnalysis = () => {
    navigate("/fee-analysis");
  };

  const handleConnectFirstAccount = () => {
    if (!canConnectAccounts) {
      toast.error("Start your free trial to connect business accounts");
      navigate("/pricing");
      return;
    }
    setShowLinkModal(true);
  };

  return (
    <DashboardLayout
      title="Business Banking"
      subtitle="Connect your business accounts for enterprise-grade financial analysis"
    >
      <div className="space-y-6">
        {/* Enterprise Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="hero-gradient border-0">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-white" />
                    <h1 className="text-2xl font-bold text-white">Enterprise Business Banking</h1>
                  </div>
                  <p className="text-white/80 max-w-2xl">
                    Connect multiple business accounts securely. Our platform is built for B2B financial 
                    management with enterprise-grade security and compliance.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  {isTrialActive && (
                    <div className="mb-2 sm:mb-0 sm:mr-2">
                      <Badge variant="outline" className="gap-1 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                        <Clock className="h-3 w-3" />
                        {trialDays}-Day Trial
                      </Badge>
                    </div>
                  )}
                  <Button 
                    onClick={() => setShowLinkModal(true)} 
                    disabled={!canConnectAccounts}
                    className="btn-primary gap-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Link Business Account
                  </Button>
                  {!canConnectAccounts && (
                    <Button onClick={() => navigate("/pricing")} className="btn-secondary gap-2">
                      <Crown className="h-4 w-4" />
                      Start Free Trial
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trial Notice Banner */}
        {isTrialActive && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <div>
                      <p className="font-medium">You're on a {trialDays}-day free trial</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Connect business accounts now. Upgrade to Premium after trial to continue access.
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate("/pricing")} 
                    variant="outline" 
                    size="sm"
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    View Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="accounts" className="space-y-6">
          <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full max-w-md">
            <TabsTrigger value="accounts" className="gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Business Accounts</span>
              <span className="sm:hidden">Accounts</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Financial Analytics</span>
              <span className="sm:hidden">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            {/* Linked Accounts Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-primary" />
                      Business Banking Accounts
                    </CardTitle>
                    <CardDescription>
                      {linkedBanks.filter(b => b.isBusiness).length} business account(s) connected
                      {isTrialActive && (
                        <span className="ml-2 text-yellow-600 dark:text-yellow-400">
                          • Trial Active
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Building2 className="h-3 w-3" />
                      <span className="hidden sm:inline">B2B</span>
                    </Badge>
                    <Button
                      onClick={() => setShowLinkModal(true)}
                      disabled={!canConnectAccounts}
                      className="gap-2 w-full sm:w-auto"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 sm:hidden" />
                      <LinkIcon className="h-4 w-4 hidden sm:block" />
                      <span className="hidden sm:inline">Add Account</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {linkedBanks.filter(b => b.isBusiness).length > 0 ? (
                  <div className="space-y-4">
                    {linkedBanks.filter(b => b.isBusiness).map((bank) => (
                      <div
                        key={bank.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors gap-4 sm:gap-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                            {bank.logo}
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold truncate">{bank.bankName}</h4>
                              <Badge variant="secondary" className="text-xs shrink-0">
                                Business
                              </Badge>
                              {isTrialActive && (
                                <Badge variant="outline" className="text-xs shrink-0 bg-yellow-100 text-yellow-700 border-yellow-300">
                                  Trial
                                </Badge>
                              )}
                              {bank.isManual && (
                                <Badge variant="outline" className="text-xs shrink-0 bg-gray-100 text-gray-700 border-gray-300">
                                  Manual
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {bank.accountType} • {bank.accountMask}
                            </p>
                            {bank.businessName && (
                              <p className="text-xs text-muted-foreground truncate">
                                {bank.businessName} • EIN: {bank.ein}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-end sm:justify-start gap-3">
                          <Badge variant="success" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span className="hidden sm:inline">Connected</span>
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleUnlink(bank.id)}
                          >
                            <Unlink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <Building2 className="h-16 w-16 mx-auto text-muted-foreground/30" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">No Business Accounts Connected</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        {isTrialActive ? (
                          <>Connect your business banking accounts during your {trialDays}-day free trial to unlock enterprise financial analytics.</>
                        ) : (
                          <>Connect your business banking accounts to unlock enterprise financial analytics, fee optimization, and cash flow forecasting.</>
                        )}
                      </p>
                    </div>
                    <Button
                      onClick={handleConnectFirstAccount}
                      disabled={!canConnectAccounts}
                      className="gap-2 mt-4 w-full sm:w-auto"
                    >
                      <LinkIcon className="h-4 w-4" />
                      {isTrialActive ? "Connect Business Account (Trial)" : "Connect First Business Account"}
                    </Button>
                    {!canConnectAccounts && (
                      <p className="text-sm text-muted-foreground">
                        Start your {trialDays}-day free trial to connect business accounts
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50">
                <CardContent className="p-6" onClick={handleGenerateReports}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">Financial Reports</h4>
                      <p className="text-sm text-muted-foreground truncate">Generate business reports</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50">
                <CardContent className="p-6" onClick={handleMonitorCashFlow}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">Cash Flow</h4>
                      <p className="text-sm text-muted-foreground truncate">Monitor business liquidity</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50">
                <CardContent className="p-6" onClick={handleAddTeamMembers}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">Multi-User</h4>
                      <p className="text-sm text-muted-foreground truncate">Add team members</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {feeAnalysis && linkedBanks.filter(b => b.isBusiness).length > 0 ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Business Financial Health
                      {isTrialActive && (
                        <Badge variant="outline" className="ml-2 text-xs bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Trial
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <p className="text-sm text-muted-foreground">Monthly Business Fees</p>
                        <p className="text-2xl font-bold text-destructive">
                          ${feeAnalysis.totalFees.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Across all business accounts</p>
                      </div>
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <p className="text-sm text-muted-foreground">Optimization Potential</p>
                        <p className="text-2xl font-bold text-warning">
                          ${feeAnalysis.avoidableFees.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Reducible fees</p>
                      </div>
                      <div className="p-4 rounded-lg bg-card border border-border">
                        <p className="text-sm text-muted-foreground">Projected Annual Savings</p>
                        <p className="text-2xl font-bold text-success">
                          ${(feeAnalysis.savingsPotential * 12).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">With optimizations</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleViewDetailedAnalysis}
                      variant="outline"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Detailed Business Analysis
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                  <h3 className="text-lg font-semibold mb-2">Business Analytics Unavailable</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    {isTrialActive ? (
                      <>Connect your business accounts during your {trialDays}-day trial to access financial analytics.</>
                    ) : (
                      <>Connect your business accounts to access financial analytics, fee optimization insights, and cash flow forecasting.</>
                    )}
                  </p>
                  <Button onClick={handleConnectFirstAccount} className="gap-2" disabled={!canConnectAccounts}>
                    <LinkIcon className="h-4 w-4" />
                    {isTrialActive ? "Connect Business Account (Trial)" : "Connect Business Account"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  Enterprise Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Bank-Level Security</h4>
                        <p className="text-sm text-muted-foreground">
                          256-bit encryption, TLS 1.3, and military-grade security protocols.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <EyeOff className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Zero-Knowledge Architecture</h4>
                        <p className="text-sm text-muted-foreground">
                          Your banking credentials are never stored on our servers.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Database className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">SOC 2 Type II Certified</h4>
                        <p className="text-sm text-muted-foreground">
                          Enterprise-grade data protection and compliance standards.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">GDPR & CCPA Compliant</h4>
                        <p className="text-sm text-muted-foreground">
                          Full compliance with international data protection regulations.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Key className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Read-Only Access</h4>
                        <p className="text-sm text-muted-foreground">
                          We can only view transactions, never move money or make changes.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Direct API Connections</h4>
                        <p className="text-sm text-muted-foreground">
                          Secure connections using bank-approved APIs (Plaid, Finicity, MX).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Business Banking Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Business Account Requirements</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500" />
                      Valid EIN (Employer Identification Number)
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500" />
                      Registered business name
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500" />
                      Business banking credentials
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500" />
                      Multi-account support available
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Crown className="h-6 w-6 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">{isTrialActive ? "Trial Benefits" : "Business Plan Benefits"}</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-primary" />
                      {isTrialActive ? "Connect business accounts during trial" : "Connect unlimited business accounts"}
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-primary" />
                      Advanced financial analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-primary" />
                      {isTrialActive ? "Full platform access" : "Priority support & onboarding"}
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-primary" />
                      {isTrialActive ? "Upgrade to continue after trial" : "Custom reporting & exports"}
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Business Account Link Modal - FIXED WITH WHITE BACKGROUND */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-auto border border-gray-200 dark:border-gray-800">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-10">
              <div className="flex items-center justify-between p-4 md:p-6">
                <div className="space-y-1 pr-4">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                    {linkingStep === "select" && "Select Business Bank"}
                    {linkingStep === "business-verify" && "Business Verification"}
                    {linkingStep === "credentials" && `Connect to ${selectedBank?.name}`}
                    {linkingStep === "accounts" && "Select Business Accounts"}
                    {linkingStep === "loading" && "Securing Connection"}
                    {linkingStep === "success" && "Connection Successful"}
                  </h2>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    {linkingStep === "select" && "Choose your business banking provider"}
                    {linkingStep === "business-verify" && "Verify your business information"}
                    {linkingStep === "credentials" && "Enter your business banking credentials"}
                    {linkingStep === "accounts" && "Choose which business accounts to connect"}
                    {linkingStep === "loading" && "Establishing secure business banking connection"}
                    {linkingStep === "success" && "Your business accounts are now connected"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowLinkModal(false);
                    setLinkingStep("select");
                    setSelectedBank(null);
                    setShowManualEntry(false);
                    setConnectionProgress(0);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0 transition-colors"
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="px-4 md:px-6 pb-4">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Step {
                    linkingStep === "select" ? "1" :
                    linkingStep === "business-verify" ? "2" :
                    linkingStep === "credentials" ? "3" :
                    linkingStep === "accounts" ? "4" :
                    linkingStep === "loading" ? "5" : "6"
                  } of 6</span>
                  <span className="text-right">Business Account Setup</span>
                </div>
                <Progress value={connectionProgress} className="h-1" />
              </div>
            </div>

            <div className="p-4 md:p-6">
              {/* Step 1: Bank Selection - FIXED WITH WHITE BACKGROUND */}
              {linkingStep === "select" && (
                <div className="space-y-6">
                  {isTrialActive && (
                  <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          7-Day Free Trial Active
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          You can connect business accounts during your trial. Upgrade to Premium to continue after trial ends.
                        </p>
                      </div>
                    </div>
                  </div>
              )}     
                  {!showManualEntry ? (
                    <>
                      {/* Search Bar */}
                      <div className="space-y-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search for your business bank..."
                            className="pl-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                            disabled
                          />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Search functionality coming soon. Select from popular banks below or add manually.
                        </p>
                      </div>
                      
                      {/* Popular Banks Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {BUSINESS_BANKS.map((bank) => (
                          <button
                            key={bank.id}
                            onClick={() => handleSelectBank(bank)}
                            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md transition-all text-left group w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750"
                            type="button"
                          >
                            <div className="flex items-start justify-between">
                              <span className="text-2xl">{bank.logo}</span>
                              {bank.supportsMulti && (
                                <Badge variant="outline" className="text-xs dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                                  Multi-Account
                                </Badge>
                              )}
                            </div>
                            <p className="font-semibold mt-3 text-gray-900 dark:text-white">{bank.name}</p>
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                                  Business Only
                                </Badge>
                                <Info className="h-3 w-3 text-gray-400" />
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Min. balance: <span className="font-semibold">${bank.minBalance.toLocaleString()}</span>
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      {/* Manual Entry Option */}
                      <button
                        onClick={() => setShowManualEntry(true)}
                        className="w-full p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-center group"
                        type="button"
                      >
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-primary/10">
                            <Building className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Don't see your bank?</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Add business account manually</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                            Enter your bank details manually for analysis
                          </p>
                        </div>
                      </button>
                    </>
                  ) : (
                    /* Manual Bank Entry Form */
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setShowManualEntry(false)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                            type="button"
                          >
                            <ChevronRight className="h-4 w-4 rotate-180" />
                          </button>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Add Business Bank Manually</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Enter your business banking details</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Manual Entry
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bankName" className="text-gray-700 dark:text-gray-300">Bank Name *</Label>
                          <Input
                            id="bankName"
                            placeholder="Enter your bank name"
                            value={manualBankInfo.name}
                            onChange={(e) => setManualBankInfo({...manualBankInfo, name: e.target.value})}
                            className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber" className="text-gray-700 dark:text-gray-300">Business Account Number *</Label>
                          <Input
                            id="accountNumber"
                            placeholder="Enter account number"
                            value={manualBankInfo.accountNumber}
                            onChange={(e) => setManualBankInfo({...manualBankInfo, accountNumber: e.target.value})}
                            className="w-full font-mono bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                            type="text"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Last 4 digits will be shown as account mask
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="routingNumber" className="text-gray-700 dark:text-gray-300">Routing Number (ABA) *</Label>
                          <Input
                            id="routingNumber"
                            placeholder="9-digit routing number"
                            value={manualBankInfo.routingNumber}
                            onChange={(e) => setManualBankInfo({...manualBankInfo, routingNumber: e.target.value})}
                            className="w-full font-mono bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                            type="text"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            9-digit ABA routing number for your bank
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="accountType" className="text-gray-700 dark:text-gray-300">Account Type</Label>
                          <select
                            id="accountType"
                            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            value={manualBankInfo.accountType}
                            onChange={(e) => setManualBankInfo({...manualBankInfo, accountType: e.target.value})}
                          >
                            <option value="checking">Business Checking</option>
                            <option value="savings">Business Savings</option>
                            <option value="line">Line of Credit</option>
                            <option value="loan">Business Loan</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Manual connections require periodic statement uploads for analysis. 
                          We'll guide you through the verification process.
                        </p>
                      </div>
                      
                      {/* Manual Entry Footer */}
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button
                          variant="outline"
                          onClick={() => setShowManualEntry(false)}
                          className="w-full sm:w-auto"
                        >
                          Back to Bank List
                        </Button>
                        <Button
                          onClick={handleManualBankConnect}
                          disabled={!manualBankInfo.name || !manualBankInfo.accountNumber || !manualBankInfo.routingNumber}
                          className="w-full sm:w-auto"
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Connect Manual Account
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Info Box */}
                  {!showManualEntry && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <Info className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Only business banking providers are shown. Personal accounts cannot be connected to this platform.
                        Can't find your bank? Use the manual entry option above.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Business Verification */}
              {linkingStep === "business-verify" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <span className="text-2xl">{selectedBank?.logo}</span>
                    <div className="min-w-0">
                      <span className="font-semibold block truncate text-gray-900 dark:text-white">{selectedBank?.name}</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Business Banking Provider</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-gray-700 dark:text-gray-300">Registered Business Name *</Label>
                      <Input
                        id="businessName"
                        placeholder="Acme Corporation Inc."
                        value={businessInfo.businessName}
                        onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
                        className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ein" className="text-gray-700 dark:text-gray-300">Employer Identification Number (EIN) *</Label>
                      <Input
                        id="ein"
                        placeholder="12-3456789"
                        value={businessInfo.ein}
                        onChange={(e) => setBusinessInfo({...businessInfo, ein: e.target.value})}
                        className="font-mono w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        9-digit EIN issued by the IRS. Format: XX-XXXXXXX
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessType" className="text-gray-700 dark:text-gray-300">Business Type</Label>
                      <select
                        id="businessType"
                        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        value={businessInfo.businessType}
                        onChange={(e) => setBusinessInfo({...businessInfo, businessType: e.target.value})}
                      >
                        <option value="LLC">LLC</option>
                        <option value="Corporation">Corporation</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Sole Proprietorship">Sole Proprietorship</option>
                        <option value="Non-Profit">Non-Profit</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Your business information is encrypted and only used for account verification with your bank.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Credentials */}
              {linkingStep === "credentials" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <span className="text-2xl">{selectedBank?.logo}</span>
                    <div className="min-w-0">
                      <span className="font-semibold block truncate text-gray-900 dark:text-white">{selectedBank?.name}</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">For: {businessInfo.businessName}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Business Banking Username *</Label>
                      <Input
                        placeholder="Enter business banking username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                        className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300">Business Banking Password *</Label>
                      <Input
                        type="password"
                        placeholder="Enter business banking password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your credentials are encrypted end-to-end and never stored on our servers.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Account Selection */}
              {linkingStep === "accounts" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Available Business Accounts</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Select which business accounts you'd like to connect for analysis.
                    </p>
                    
                    <div className="space-y-3">
                      {[
                        { id: "checking1", name: "Primary Business Checking", type: "checking", balance: 45287.63 },
                        { id: "savings1", name: "Business Savings", type: "savings", balance: 125000.00 },
                        { id: "checking2", name: "Operations Checking", type: "checking", balance: 15732.41 },
                        { id: "credit", name: "Business Line of Credit", type: "line", balance: -25000.00 },
                      ].map((account) => (
                        <label
                          key={account.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors bg-white dark:bg-gray-800"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <input
                              type="checkbox"
                              checked={selectedAccounts.includes(account.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAccounts([...selectedAccounts, account.id]);
                                } else {
                                  setSelectedAccounts(selectedAccounts.filter(id => id !== account.id));
                                }
                              }}
                              className="rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium truncate text-gray-900 dark:text-white">{account.name}</p>
                                <Badge variant="outline" className="text-xs shrink-0 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                                  {account.type === 'checking' ? 'Checking' : 
                                   account.type === 'savings' ? 'Savings' : 'Credit'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                Balance: <span className="font-medium">${Math.abs(account.balance).toLocaleString()}</span>
                                {account.balance < 0 ? ' (Credit)' : ''}
                              </p>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Loading */}
              {linkingStep === "loading" && (
                <div className="py-8 md:py-12 text-center space-y-6">
                  <div className="relative">
                    <RefreshCw className="h-12 md:h-16 w-12 md:w-16 mx-auto mb-4 text-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield className="h-6 md:h-8 w-6 md:w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-lg md:text-xl text-gray-900 dark:text-white">Establishing Secure Business Connection</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto px-4">
                      Connecting to {selectedBank?.name} via secure API. 
                      Your data is being encrypted and transmitted securely.
                    </p>
                  </div>
                  <Progress value={connectionProgress} className="w-full max-w-sm mx-auto" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {connectionProgress < 30 && "Initializing secure connection..."}
                    {connectionProgress >= 30 && connectionProgress < 60 && "Authenticating with bank..."}
                    {connectionProgress >= 60 && connectionProgress < 90 && "Retrieving account data..."}
                    {connectionProgress >= 90 && "Finalizing encryption..."}
                  </p>
                </div>
              )}

              {/* Step 6: Success */}
              {linkingStep === "success" && (
                <div className="py-8 md:py-12 text-center space-y-6">
                  <CheckCircle className="h-12 md:h-16 w-12 md:w-16 mx-auto text-green-500" />
                  <div className="space-y-2 px-4">
                    <p className="font-semibold text-lg md:text-xl text-gray-900 dark:text-white">Business Accounts Connected!</p>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      {selectedAccounts.length} business account(s) from {selectedBank?.name} 
                      are now securely connected and ready for analysis.
                      {isTrialActive && (
                        <span className="block mt-2 text-yellow-600 dark:text-yellow-400">
                          ✓ Connected during your {trialDays}-day free trial
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg dark:bg-green-900/20 max-w-md mx-auto border border-green-200 dark:border-green-800">
                    <p className="text-sm text-gray-800 dark:text-gray-300">
                      <span className="font-semibold">Next:</span> 
                      {' '}Financial analysis will begin automatically. 
                      Check your dashboard for insights in 2-3 minutes.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {(linkingStep === "business-verify" || linkingStep === "credentials" || linkingStep === "accounts") && (
              <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (linkingStep === "credentials") setLinkingStep("business-verify");
                      else if (linkingStep === "business-verify") setLinkingStep("select");
                      else if (linkingStep === "accounts") setLinkingStep("credentials");
                    }}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      if (linkingStep === "business-verify") handleBusinessVerify();
                      else if (linkingStep === "credentials") handleLink();
                      else if (linkingStep === "accounts") handleConnectAccounts();
                    }}
                    disabled={
                      (linkingStep === "business-verify" && (!businessInfo.ein || !businessInfo.businessName)) ||
                      (linkingStep === "credentials" && (!credentials.username || !credentials.password)) ||
                      (linkingStep === "accounts" && selectedAccounts.length === 0)
                    }
                    className="w-full sm:w-auto order-1 sm:order-2"
                  >
                    {linkingStep === "business-verify" && "Verify Business"}
                    {linkingStep === "credentials" && "Connect to Bank"}
                    {linkingStep === "accounts" && `Connect ${selectedAccounts.length} Account(s)`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}