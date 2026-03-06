/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const DataContext = createContext();
const isBrowser = typeof window !== "undefined";

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

  const revenue = Math.max(0, safeNumber(response?.monthlyRevenue, 0));
  const fees = Math.max(0, safeNumber(response?.monthlyFees, 0));

  if (response?.accountType === "personal") {
    score += 30;
    reasons.push("Using personal account for business");
  }

  if (response?.cashDeposits) {
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

  if (response?.wantsGrants) {
    score += 10;
    reasons.push("Seeking grant guidance");
  }

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

function getScoring(response) {
  const s = calculateMismatchScore(response);
  const riskLabel = getRiskLabel(s.score);

  return {
    mismatchScore: s.score,
    riskLabel,
    keyReasons: Array.isArray(s.reasons) ? s.reasons : [],
    feeWastePercent: safeNumber(s.feeWastePercent, 0),
    bankMatch1: response?.bankMatch1 ?? response?.bank1 ?? "",
    why1: response?.why1 ?? "",
    bankMatch2: response?.bankMatch2 ?? response?.bank2 ?? "",
    why2: response?.why2 ?? "",
    grantsSuggested: Array.isArray(response?.grantsSuggested)
      ? response.grantsSuggested
      : [],
    sbaLink: "",
    ssbciLink: "",
  };
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
    ? {
        name: match.state,
        abbr: match.abbr,
        sbaLink: `https://www.sba.gov/${match.abbr}`,
        ssbciLink: `https://treasury.gov/ssbci/${match.abbr}`,
      }
    : {
        name: "United States",
        abbr: "US",
        sbaLink: "https://www.sba.gov",
        ssbciLink: "https://treasury.gov/ssbci",
      };
}

// --------------------
// Health Score Logic
// --------------------
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

const FEE_RULES = {
  overdraft: { avoidable: true },
  maintenance: { avoidable: true },
  atm: { avoidable: true },
  wire: { avoidable: false },
  foreign: { avoidable: true },
  minimum_balance: { avoidable: true },
  statement: { avoidable: true },
  ach_return: { avoidable: true },
};

// --------------------
// Provider
// --------------------
export function DataProvider({ children }) {
  const [responses, setResponses] = useState(() =>
    safeJsonParse(isBrowser ? localStorage.getItem("oliBranchResponses") : null, [])
  );

  const [settings, setSettings] = useState(() =>
    safeJsonParse(isBrowser ? localStorage.getItem("oliBranchSettings") : null, {
      gpsRadius: 3,
      profile: { companyName: "", email: "" },
    })
  );

  const [healthInputs, setHealthInputs] = useState(() =>
    safeJsonParse(
      isBrowser ? localStorage.getItem("oliBranchFinancialInputs") : null,
      null
    )
  );

  const [healthHistory, setHealthHistory] = useState(() =>
    safeJsonParse(
      isBrowser ? localStorage.getItem("oliBranchHealthHistory") : null,
      []
    )
  );

  const [paymentLinks, setPaymentLinks] = useState(() =>
    safeJsonParse(isBrowser ? localStorage.getItem("oliBranchPaymentLinks") : null, {
      cashApp: "",
      zelle: "",
      venmo: "",
      bankLink: "",
    })
  );

  const [profileImage, setProfileImage] = useState(() =>
    isBrowser ? localStorage.getItem("userProfileImage") : null
  );

  const [subscription] = useState(() => ({
    plan: "free",
    analysisCount: 0,
    lastAnalysisDate: null,
    weekStartDate: new Date().toISOString(),
  }));

  const [linkedBanks, setLinkedBanks] = useState(() =>
    safeJsonParse(isBrowser ? localStorage.getItem("oliBranchLinkedBanks") : null, [])
  );

  // --------------------
  // ✅ REPORTS (ADDED)
  // --------------------
  const [reports, setReports] = useState(() =>
    safeJsonParse(isBrowser ? localStorage.getItem("oliBranchReports") : null, [])
  );

  const addReport = useCallback((report) => {
    setReports((prev) => [report, ...prev]);
  }, []);

  const getReportById = useCallback(
    (id) => reports.find((r) => r.id === id),
    [reports]
  );

  const generateFinancialLeaksReport = useCallback((totalFees) => {
    const report = {
      id: crypto.randomUUID(),
      type: "Financial Leaks",
      createdAt: new Date().toISOString(),
      title: "Financial Leaks Assessment",
      summary: `Detected $${Number(totalFees).toFixed(2)} in monthly fee leaks`,
      source: "financial-leaks",
      status: "generated",
    };

    setReports((prev) => [report, ...prev]);
    return report;
  }, []);

  // --------------------
  // Health helpers
  // --------------------
  const updateHealthInputs = useCallback((inputs) => {
    setHealthInputs(inputs);
  }, []);

  const addHealthHistory = useCallback((score) => {
    const newEntry = { score, t: new Date().getTime() };
    setHealthHistory((prev) => [newEntry, ...prev].slice(0, 10));
  }, []);

  const clearHealthData = useCallback(() => {
    setHealthInputs(null);
    setHealthHistory([]);
  }, []);

  // --------------------
  // Persistence
  // --------------------
  useEffect(() => {
    if (isBrowser) localStorage.setItem("oliBranchReports", JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    if (isBrowser) localStorage.setItem("oliBranchResponses", JSON.stringify(responses));
  }, [responses]);

  useEffect(() => {
    if (isBrowser) localStorage.setItem("oliBranchSettings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!isBrowser) return;
    healthInputs
      ? localStorage.setItem("oliBranchFinancialInputs", JSON.stringify(healthInputs))
      : localStorage.removeItem("oliBranchFinancialInputs");
  }, [healthInputs]);

  useEffect(() => {
    if (isBrowser) localStorage.setItem("oliBranchHealthHistory", JSON.stringify(healthHistory));
  }, [healthHistory]);

  useEffect(() => {
    if (isBrowser) localStorage.setItem("oliBranchPaymentLinks", JSON.stringify(paymentLinks));
  }, [paymentLinks]);

  useEffect(() => {
    if (!isBrowser) return;
    profileImage
      ? localStorage.setItem("userProfileImage", profileImage)
      : localStorage.removeItem("userProfileImage");
  }, [profileImage]);

  const linkBankAccount = useCallback((bankData) => {
    const newBank = {
      id: Date.now(),
      ...bankData,
      linkedAt: new Date().toISOString(),
      lastSync: new Date().toISOString(),
    };
    setLinkedBanks((prev) => [...prev, newBank]);
    return newBank;
  }, []);

  const unlinkBankAccount = useCallback((bankId) => {
    setLinkedBanks((prev) => prev.filter((b) => b.id !== bankId));
  }, []);

  const getChartData = useCallback(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    (responses || []).forEach((r) => {
      const s = getScoring(r);
      if (s?.riskLabel === "High") counts.High += 1;
      else if (s?.riskLabel === "Medium") counts.Medium += 1;
      else counts.Low += 1;
    });
    return [
      { name: "High Risk", value: counts.High },
      { name: "Medium Risk", value: counts.Medium },
      { name: "Low Risk", value: counts.Low },
    ];
  }, [responses]);

  return (
    <DataContext.Provider
      value={{
        responses,
        setResponses,
        settings,
        setSettings,
        healthInputs,
        setHealthInputs,
        updateHealthInputs,
        healthHistory,
        setHealthHistory,
        addHealthHistory,
        clearHealthData,
        paymentLinks,
        setPaymentLinks,
        profileImage,
        setProfileImage,
        subscription,
        linkedBanks,

        // reports
        reports,
        addReport,
        getReportById,
        generateFinancialLeaksReport,

        getScoring,
        getChartData,
        calculateMismatchScore,
        getRiskLabel,
        getStateFromZip,
        computeHealthScore,
        healthLabel,
        linkBankAccount,
        unlinkBankAccount,
        FEE_RULES,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within DataProvider");
  }
  return ctx;
}
