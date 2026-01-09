/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const DataContext = createContext();

// --------------------
// Demo seed data
// --------------------
const SAMPLE_RESPONSES = [
  {
    id: 1,
    timestamp: "2025-01-15T10:30:00Z",
    email: "maria@smallbiz.com",
    businessName: "Maria's Bakery LLC",
    entityType: "LLC",
    monthlyRevenue: 12000,
    accountType: "business",
    cashDeposits: true,
    monthlyFees: 45,
    wantsGrants: true,
    veteranOwned: false,
    immigrantFounder: true,
    zipCode: "10001",
    consent: true,
  },
  {
    id: 2,
    timestamp: "2025-01-14T14:20:00Z",
    email: "john@techstart.io",
    businessName: "TechStart Solutions",
    entityType: "S-Corp",
    monthlyRevenue: 35000,
    accountType: "business",
    cashDeposits: false,
    monthlyFees: 120,
    wantsGrants: true,
    veteranOwned: true,
    immigrantFounder: false,
    zipCode: "94102",
    consent: true,
  },
  {
    id: 3,
    timestamp: "2025-01-13T09:15:00Z",
    email: "sarah@freelance.co",
    businessName: "Sarah Design Studio",
    entityType: "Sole Proprietor",
    monthlyRevenue: 4500,
    accountType: "personal",
    cashDeposits: false,
    monthlyFees: 25,
    wantsGrants: true,
    veteranOwned: false,
    immigrantFounder: false,
    zipCode: "60601",
    consent: true,
  },
];

// Mock bank transactions with fees
const MOCK_BANK_TRANSACTIONS = [
  { id: 1, date: "2025-01-15", description: "Monthly Maintenance Fee", amount: -15.0, category: "fee", feeType: "maintenance" },
  { id: 2, date: "2025-01-14", description: "Overdraft Fee", amount: -35.0, category: "fee", feeType: "overdraft" },
  { id: 3, date: "2025-01-13", description: "ATM Withdrawal Fee", amount: -3.5, category: "fee", feeType: "atm" },
  { id: 4, date: "2025-01-12", description: "Wire Transfer Fee", amount: -25.0, category: "fee", feeType: "wire" },
  { id: 5, date: "2025-01-10", description: "Paper Statement Fee", amount: -5.0, category: "fee", feeType: "statement" },
  { id: 6, date: "2025-01-08", description: "Overdraft Fee", amount: -35.0, category: "fee", feeType: "overdraft" },
  { id: 7, date: "2025-01-05", description: "Foreign Transaction Fee", amount: -12.5, category: "fee", feeType: "foreign" },
  { id: 8, date: "2025-01-03", description: "ATM Withdrawal Fee", amount: -3.0, category: "fee", feeType: "atm" },
  { id: 9, date: "2025-01-02", description: "Minimum Balance Fee", amount: -10.0, category: "fee", feeType: "minimum_balance" },
  { id: 10, date: "2024-12-28", description: "Monthly Maintenance Fee", amount: -15.0, category: "fee", feeType: "maintenance" },
  { id: 11, date: "2024-12-20", description: "Overdraft Fee", amount: -35.0, category: "fee", feeType: "overdraft" },
  { id: 12, date: "2024-12-15", description: "ACH Return Fee", amount: -20.0, category: "fee", feeType: "ach_return" },
];

// Fee analysis rules
const FEE_RULES = {
  overdraft: {
    name: "Overdraft Fees",
    description: "Charged when account balance goes negative",
    avoidable: true,
    recommendation: "Set up low balance alerts and link a savings account for overdraft protection",
    severity: "high",
  },
  maintenance: {
    name: "Monthly Maintenance Fees",
    description: "Regular account maintenance charges",
    avoidable: true,
    recommendation: "Switch to a no-fee business checking account like Novo or Bluevine",
    severity: "medium",
  },
  atm: {
    name: "ATM Fees",
    description: "Out-of-network ATM withdrawal charges",
    avoidable: true,
    recommendation: "Use in-network ATMs or choose a bank with ATM fee rebates",
    severity: "low",
  },
  wire: {
    name: "Wire Transfer Fees",
    description: "Domestic and international wire transfer charges",
    avoidable: false,
    recommendation: "Use ACH transfers when possible, or batch wire transfers",
    severity: "medium",
  },
  foreign: {
    name: "Foreign Transaction Fees",
    description: "Charges for international purchases",
    avoidable: true,
    recommendation: "Use a card with no foreign transaction fees",
    severity: "medium",
  },
  minimum_balance: {
    name: "Minimum Balance Fees",
    description: "Charged when balance falls below minimum requirement",
    avoidable: true,
    recommendation: "Maintain minimum balance or switch to an account without minimums",
    severity: "medium",
  },
  statement: {
    name: "Paper Statement Fees",
    description: "Charges for paper statements",
    avoidable: true,
    recommendation: "Switch to electronic statements",
    severity: "low",
  },
  ach_return: {
    name: "ACH Return Fees",
    description: "Charged when ACH payments are returned",
    avoidable: true,
    recommendation: "Verify account details before initiating transfers",
    severity: "high",
  },
};

// --------------------
// Safety helpers
// --------------------
function safeJsonParse(value, fallback) {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function safeNumber(x, fallback = 0) {
  const n = Number(x);
  return Number.isFinite(n) ? n : fallback;
}

// --------------------
// Scoring Logic
// --------------------
function calculateMismatchScore(response) {
  let score = 0;
  const reasons = [];

  const revenue = Math.max(0, safeNumber(response.monthlyRevenue, 0));
  const fees = Math.max(0, safeNumber(response.monthlyFees, 0));

  if (response.accountType === "personal") {
    score += 30;
    reasons.push("Using personal account for business");
  }

  if (response.cashDeposits) {
    score += 20;
    reasons.push("Frequent cash deposits (higher scrutiny)");
  }

  if (revenue < 5000) {
    score += 25;
    reasons.push("Low monthly revenue (<$5k)");
  } else if (revenue < 10000) {
    score += 10;
    reasons.push("Moderate revenue ($5k-$10k)");
  }

  if (response.wantsGrants) {
    score += 10;
    reasons.push("Seeking grant guidance");
  }

  // Avoid divide-by-zero
  const feePercentage = revenue > 0 ? (fees / revenue) * 100 : 0;

  if (feePercentage > 2) {
    score += 15;
    reasons.push(`High fee burden (${feePercentage.toFixed(1)}% of revenue)`);
  }

  return {
    score: Math.min(100, score),
    reasons,
    feeWastePercent: feePercentage,
  };
}

function getRiskLabel(score) {
  if (score >= 60) return "High";
  if (score >= 30) return "Medium";
  return "Low";
}

function getBankRecommendations(response) {
  const revenue = safeNumber(response.monthlyRevenue, 0);
  const recommendations = [];

  if (revenue > 50000) {
    recommendations.push({ bank: "Chase Business Complete", why: "Best for high-volume businesses" });
    recommendations.push({ bank: "Bank of America Business Advantage", why: "Integrated cash management" });
  } else if (revenue > 10000) {
    recommendations.push({ bank: "Bluevine Business Checking", why: "No monthly fees, high APY" });
    recommendations.push({ bank: "Mercury Bank", why: "Modern banking, no hidden fees" });
  } else {
    recommendations.push({ bank: "Novo Business Checking", why: "Fee-free for small businesses" });
    recommendations.push({ bank: "Relay Financial", why: "Multiple free checking accounts" });
  }

  return recommendations.slice(0, 2);
}

function getStateFromZip(zip) {
  const z = String(zip || "");
  const prefix = parseInt(z.substring(0, 3), 10);

  const zipRanges = [
    { start: 100, end: 149, state: "New York", abbr: "NY" },
    { start: 600, end: 629, state: "Illinois", abbr: "IL" },
    { start: 900, end: 961, state: "California", abbr: "CA" },
  ];

  const match = zipRanges.find((r) => prefix >= r.start && prefix <= r.end);

  return match
    ? { name: match.state, abbr: match.abbr, sbaLink: `https://www.sba.gov/${match.abbr}`, ssbciLink: `https://treasury.gov/ssbci/${match.abbr}` }
    : { name: "United States", abbr: "US", sbaLink: "https://www.sba.gov", ssbciLink: "https://treasury.gov/ssbci" };
}

function getGrantRecommendations(response) {
  const grants = [];
  const state = getStateFromZip(response.zipCode);

  if (response.veteranOwned) {
    grants.push({ grant: "SBA Veterans Advantage Loan", why: "Reduced fees for veterans" });
  }
  if (response.immigrantFounder) {
    grants.push({ grant: "Hello Alice Immigrant Founder Grant", why: "Up to $10,000" });
  }
  if (response.wantsGrants) {
    grants.push({ grant: `${state.name} SSBCI Program`, why: "State small business credit initiative" });
  }

  return grants.slice(0, 2);
}

// Health Score computation
function computeHealthScore(inputs) {
  const revenue = Math.max(0, safeNumber(inputs?.revenue, 0));
  const expenses = Math.max(0, safeNumber(inputs?.expenses, 0));
  const debt = Math.max(0, safeNumber(inputs?.debt, 0));
  const cash = Math.max(0, safeNumber(inputs?.cash, 0));

  const margin = revenue > 0 ? (revenue - expenses) / revenue : 0;
  const marginScore = Math.max(0, Math.min(1, (margin + 0.25) / 0.75));

  const burn = Math.max(0, expenses - revenue);
  const runway = burn > 0 ? cash / burn : 12;
  const runwayScore = Math.max(0, Math.min(1, runway / 6));

  const debtLoad = revenue > 0 ? debt / (revenue * 6) : 1;
  const debtScore = 1 - Math.max(0, Math.min(1, debtLoad));

  const score = Math.round(marginScore * 45 + runwayScore * 30 + debtScore * 25);
  return { score, metrics: { margin, runway, debtLoad } };
}

function healthLabel(score) {
  if (score >= 85) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "At Risk";
}

// --------------------
// Provider
// --------------------
export function DataProvider({ children }) {
  const [responses, setResponses] = useState(() => safeJsonParse(localStorage.getItem("oliBranchResponses"), SAMPLE_RESPONSES));

  const [settings, setSettings] = useState(() =>
    safeJsonParse(localStorage.getItem("oliBranchSettings"), {
      gpsRadius: 3,
      profile: { companyName: "Oli-Branch Demo", email: "demo@olibranch.com" },
    })
  );

  const [healthInputs, setHealthInputs] = useState(() => safeJsonParse(localStorage.getItem("oliBranchFinancialInputs"), null));
  const [healthHistory, setHealthHistory] = useState(() => safeJsonParse(localStorage.getItem("oliBranchHealthHistory"), []));

  const [paymentLinks, setPaymentLinks] = useState(() =>
    safeJsonParse(localStorage.getItem("oliBranchPaymentLinks"), { cashApp: "", zelle: "", venmo: "", bankLink: "" })
  );

  const [profileImage, setProfileImage] = useState(() => localStorage.getItem("userProfileImage") || null);

  const [subscription, setSubscription] = useState(() =>
    safeJsonParse(localStorage.getItem("oliBranchSubscription"), {
      plan: "free",
      analysisCount: 0,
      lastAnalysisDate: null,
      weekStartDate: new Date().toISOString(),
    })
  );

  const [linkedBanks, setLinkedBanks] = useState(() => safeJsonParse(localStorage.getItem("oliBranchLinkedBanks"), []));
  const [bankTransactions, setBankTransactions] = useState(() => safeJsonParse(localStorage.getItem("oliBranchBankTransactions"), []));
  const [feeAnalysis, setFeeAnalysis] = useState(() => safeJsonParse(localStorage.getItem("oliBranchFeeAnalysis"), null));

  // Persist state
  useEffect(() => {
    localStorage.setItem("oliBranchResponses", JSON.stringify(responses));
  }, [responses]);

  useEffect(() => {
    localStorage.setItem("oliBranchSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (healthInputs) {
      localStorage.setItem("oliBranchFinancialInputs", JSON.stringify(healthInputs));
    } else {
      localStorage.removeItem("oliBranchFinancialInputs");
    }
  }, [healthInputs]);

  useEffect(() => {
    localStorage.setItem("oliBranchHealthHistory", JSON.stringify(healthHistory));
  }, [healthHistory]);

  useEffect(() => {
    localStorage.setItem("oliBranchPaymentLinks", JSON.stringify(paymentLinks));
  }, [paymentLinks]);

  useEffect(() => {
    if (profileImage) {
      localStorage.setItem("userProfileImage", profileImage);
    } else {
      localStorage.removeItem("userProfileImage");
    }
  }, [profileImage]);

  useEffect(() => {
    localStorage.setItem("oliBranchSubscription", JSON.stringify(subscription));
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem("oliBranchLinkedBanks", JSON.stringify(linkedBanks));
  }, [linkedBanks]);

  useEffect(() => {
    localStorage.setItem("oliBranchBankTransactions", JSON.stringify(bankTransactions));
  }, [bankTransactions]);

  useEffect(() => {
    if (feeAnalysis) {
      localStorage.setItem("oliBranchFeeAnalysis", JSON.stringify(feeAnalysis));
    } else {
      localStorage.removeItem("oliBranchFeeAnalysis");
    }
  }, [feeAnalysis]);

  // Free tier check
  const canPerformAnalysis = useCallback(() => {
    if (subscription.plan === "premium") return { allowed: true };

    const weekStart = new Date(subscription.weekStartDate);
    const now = new Date();
    const daysSinceWeekStart = (now - weekStart) / (1000 * 60 * 60 * 24);

    if (daysSinceWeekStart >= 7) {
      setSubscription((prev) => ({
        ...prev,
        analysisCount: 0,
        weekStartDate: now.toISOString(),
      }));
      return { allowed: true };
    }

    if (subscription.analysisCount >= 2) {
      return { allowed: false, reason: "Weekly limit reached (2 free analyses per week)" };
    }

    return { allowed: true };
  }, [subscription.plan, subscription.weekStartDate, subscription.analysisCount]);

  const incrementAnalysisCount = useCallback(() => {
    setSubscription((prev) => ({
      ...prev,
      analysisCount: prev.analysisCount + 1,
      lastAnalysisDate: new Date().toISOString(),
    }));
  }, []);

  const upgradeToPremium = useCallback(() => {
    setSubscription((prev) => ({ ...prev, plan: "premium" }));
  }, []);

  const cancelPremium = useCallback(() => {
    setSubscription((prev) => ({ ...prev, plan: "free" }));
  }, []);

  // Fee analysis with memoization
  const runFeeAnalysis = useCallback((transactions) => {
    const fees = (transactions || []).filter((t) => t.category === "fee");

    const feesByType = {};
    let totalFees = 0;
    let avoidableFees = 0;

    fees.forEach((fee) => {
      const type = fee.feeType;
      const rule = FEE_RULES[type];

      if (!feesByType[type]) {
        feesByType[type] = {
          ...(rule || { name: type, description: "", avoidable: false, recommendation: "", severity: "low" }),
          count: 0,
          total: 0,
          transactions: [],
        };
      }

      const amt = Math.abs(safeNumber(fee.amount, 0));
      feesByType[type].count += 1;
      feesByType[type].total += amt;
      feesByType[type].transactions.push(fee);

      totalFees += amt;
      if (rule?.avoidable) avoidableFees += amt;
    });

    const sortedFees = Object.entries(feesByType)
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.total - a.total);

    // Avoid NaN when totalFees = 0
    const mismatchScore = totalFees > 0 ? Math.min(100, Math.round((avoidableFees / totalFees) * 100)) : 0;

    const analysis = {
      totalFees,
      avoidableFees,
      savingsPotential: avoidableFees,
      feeCount: fees.length,
      feesByType: sortedFees,
      mismatchScore,
      analyzedAt: new Date().toISOString(),
    };

    setFeeAnalysis(analysis);
    return analysis;
  }, []);

  const linkBankAccount = useCallback((bankData) => {
    const newBank = {
      id: Date.now(),
      ...bankData,
      linkedAt: new Date().toISOString(),
      lastSync: new Date().toISOString(),
    };

    setLinkedBanks((prev) => [...prev, newBank]);

    // Demo: add mock txns + analysis
    setBankTransactions(MOCK_BANK_TRANSACTIONS);

    // Run fee analysis on mock transactions
    const fees = MOCK_BANK_TRANSACTIONS.filter((t) => t.category === "fee");
    const feesByType = {};
    let totalFees = 0;
    let avoidableFees = 0;

    fees.forEach((fee) => {
      const type = fee.feeType;
      const rule = FEE_RULES[type];

      if (!feesByType[type]) {
        feesByType[type] = {
          ...(rule || { name: type, description: "", avoidable: false, recommendation: "", severity: "low" }),
          count: 0,
          total: 0,
          transactions: [],
        };
      }

      const amt = Math.abs(safeNumber(fee.amount, 0));
      feesByType[type].count += 1;
      feesByType[type].total += amt;
      feesByType[type].transactions.push(fee);

      totalFees += amt;
      if (rule?.avoidable) avoidableFees += amt;
    });

    const sortedFees = Object.entries(feesByType)
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.total - a.total);

    const mismatchScore = totalFees > 0 ? Math.min(100, Math.round((avoidableFees / totalFees) * 100)) : 0;

    const analysis = {
      totalFees,
      avoidableFees,
      savingsPotential: avoidableFees,
      feeCount: fees.length,
      feesByType: sortedFees,
      mismatchScore,
      analyzedAt: new Date().toISOString(),
    };

    setFeeAnalysis(analysis);

    return newBank;
  }, []);

  const unlinkBankAccount = useCallback((bankId) => {
    setLinkedBanks((prev) => {
      const next = prev.filter((b) => b.id !== bankId);

      if (next.length === 0) {
        setBankTransactions([]);
        setFeeAnalysis(null);
      }

      return next;
    });
  }, []);

  const addResponse = useCallback((response) => {
    const newResponse = { ...response, id: Date.now(), timestamp: new Date().toISOString() };
    setResponses((prev) => [newResponse, ...prev]);
    return newResponse;
  }, []);

  const getScoring = useCallback((response) => {
    const { score, reasons, feeWastePercent } = calculateMismatchScore(response);
    const riskLabel = getRiskLabel(score);
    const bankRecommendations = getBankRecommendations(response);
    const grantRecommendations = getGrantRecommendations(response);
    const state = getStateFromZip(response.zipCode);

    return {
      email: response.email,
      mismatchScore: score,
      riskLabel,
      feeWastePercent,
      keyReasons: reasons,
      bankMatch1: bankRecommendations[0]?.bank || "",
      why1: bankRecommendations[0]?.why || "",
      bankMatch2: bankRecommendations[1]?.bank || "",
      why2: bankRecommendations[1]?.why || "",
      grantsSuggested: grantRecommendations,
      state: state.name,
      abbr: state.abbr,
      sbaLink: state.sbaLink,
      ssbciLink: state.ssbciLink,
    };
  }, []);

  const getChartData = useCallback(() => {
    const riskCounts = { High: 0, Medium: 0, Low: 0 };
    responses.forEach((response) => {
      const { score } = calculateMismatchScore(response);
      riskCounts[getRiskLabel(score)] += 1;
    });

    return [
      { name: "High Risk", value: riskCounts.High, fill: "hsl(var(--destructive))" },
      { name: "Medium Risk", value: riskCounts.Medium, fill: "hsl(var(--warning))" },
      { name: "Low Risk", value: riskCounts.Low, fill: "hsl(var(--success))" },
    ];
  }, [responses]);

  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const updateHealthInputs = useCallback((inputs) => {
    setHealthInputs(inputs);
  }, []);

  const addHealthHistory = useCallback((score) => {
    setHealthHistory((prev) => [...prev.slice(-11), { t: new Date().toISOString(), score }]);
  }, []);

  const clearHealthData = useCallback(() => {
    setHealthInputs(null);
  }, []);

  const updatePaymentLinks = useCallback((links) => {
    setPaymentLinks(links);
  }, []);

  const updateProfileImage = useCallback((image) => {
    setProfileImage(image);
  }, []);

  return (
    <DataContext.Provider
      value={{
        responses,
        addResponse,
        getScoring,
        getChartData,
        settings,
        updateSettings,
        calculateMismatchScore,
        getRiskLabel,
        getStateFromZip,
        healthInputs,
        updateHealthInputs,
        healthHistory,
        addHealthHistory,
        clearHealthData,
        computeHealthScore,
        healthLabel,
        paymentLinks,
        updatePaymentLinks,
        profileImage,
        updateProfileImage,
        // Subscription
        subscription,
        canPerformAnalysis,
        incrementAnalysisCount,
        upgradeToPremium,
        cancelPremium,
        // Bank Linking
        linkedBanks,
        linkBankAccount,
        unlinkBankAccount,
        bankTransactions,
        feeAnalysis,
        runFeeAnalysis,
        FEE_RULES,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
}


