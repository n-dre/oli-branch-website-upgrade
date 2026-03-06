// src/pages/Pricing.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

// Import your theme context
import { useTheme } from "../../context/ThemeContext";

const PLANS = {
  lite: {
    key: "lite",
    name: "OLI Lite",
    purpose: "Awareness & habit",
    mode: "Observation mode (not oversight)",
    monthlyPrice: 9.99,
    yearlyPrice: 107.89,
    accent: "#22c55e",
    border: "#d1fae5",
    features: [
      "Financial Health Score",
      "Monthly snapshot",
      "Basic mismatch detection",
      "Limited alerts (summary-level)",
      "OpenAI search (education)",
    ],
    notIncluded: [
      "No proactive agent actions",
      "No continuous monitoring",
      "No personalized reasoning",
      "No \"OLI talks to you\"",
    ],
    cta: "Start with OLI Lite",
  },
  assist: {
    key: "assist",
    name: "OLI Assist",
    purpose: "Guided awareness",
    mode: "Assisted monitoring",
    monthlyPrice: 29.99,
    yearlyPrice: 323.89,
    accent: "#f59e0b",
    border: "#ffedd5",
    features: [
      "More frequent checks",
      "Limited recommendations",
      "\"Here's what changed\" explanations",
      "Some proactive alerts",
      "Typed interaction with OLI (limited)",
    ],
    notIncluded: ["Not always-on", "No deep personalization"],
    cta: "Upgrade to OLI Assist",
  },
  oversight: {
    key: "oversight",
    name: "OLI Oversight",
    purpose: "Active protection",
    mode: "Digital financial oversight",
    monthlyPrice: 49.99,
    yearlyPrice: 539.89,
    accent: "#3b82f6",
    border: "#dbeafe",
    features: [
      "Continuous monitoring",
      "Proactive agent alerts",
      "Personalized reasoning",
      "\"OLI, check this for me\"",
      "Priority processing",
    ],
    notIncluded: [],
    cta: "Upgrade to Oversight",
  },
  pro: {
    key: "pro",
    name: "OLI Pro",
    purpose: "Scale & complexity",
    mode: "Higher volume + advanced reporting",
    monthlyPrice: 79.99,
    yearlyPrice: 863.89,
    accent: "#a855f7",
    border: "#f3e8ff",
    features: [
      "Multiple accounts",
      "Higher transaction volume",
      "More frequent evaluations",
      "Advanced reports",
      "Invite-only (early)",
    ],
    notIncluded: [],
    cta: "Request Pro Access",
  },
};

function safeGetLocalStorage(key, fallback) {
  try {
    if (typeof window === "undefined") return fallback;
    const v = window.localStorage.getItem(key);
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
}

function safeSetLocalStorage(key, value) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(key, value);
  } catch {
    // no-op
  }
}

// Helper function to get theme-based styles
const getThemeStyles = (themeMode) => ({
  background: themeMode === 'dark' ? '#121212' : '#F8F5F0',
  navBackground: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
  navBorder: themeMode === 'dark' ? '#333' : '#e0e0e0',
  cardBackground: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
  cardBorder: themeMode === 'dark' ? '#333' : '#e0e0e0',
  textPrimary: themeMode === 'dark' ? '#ffffff' : '#1B4332',
  textSecondary: themeMode === 'dark' ? '#b0b0b0' : '#666',
  textTertiary: themeMode === 'dark' ? '#888' : '#888',
  accent: themeMode === 'dark' ? '#4a5568' : '#1B4332', // Changed to gray in dark mode
  border: themeMode === 'dark' ? '#444' : '#e0e0e0',
  hoverBackground: themeMode === 'dark' ? '#2d2d2d' : '#f0f7f4',
  buttonBg: themeMode === 'dark' ? '#4a5568' : '#1B4332', // Changed to gray in dark mode
  buttonHoverBg: themeMode === 'dark' ? '#2d3748' : '#15382a', // Darker gray for hover
  headerBg: themeMode === 'dark' ? '#2d3748' : '#1B4332', // Changed to dark gray in dark mode
  headerText: '#ffffff', // This stays white in both modes
  badgeBg: themeMode === 'dark' ? '#4a5568' : '#f0f7f4', // Gray in dark mode
  badgeText: themeMode === 'dark' ? '#ffffff' : '#1B4332',
  whyBg: themeMode === 'dark' ? '#2a2a2a' : '#f0f7f4',
  whyBorder: themeMode === 'dark' ? '#444' : '#d4e6df',
  inactiveButtonBg: themeMode === 'dark' ? '#333' : '#e0e0e0',
  inactiveButtonText: themeMode === 'dark' ? '#ccc' : '#333',
});

export default function Pricing() {
  const { themeMode } = useTheme();
  const [billingCycle, setBillingCycle] = useState("monthly");
  const styles = getThemeStyles(themeMode);

  // Progressive visibility flags
  const earlyAccess = safeGetLocalStorage("oliEarlyAccess", "false") === "true";

  // This is your user's current plan.
  const [currentPlanKey, setCurrentPlanKey] = useState(() => {
    const stored = safeGetLocalStorage("oliPlan", "lite");
    return PLANS[stored] ? stored : "lite";
  });

  // Example "pain signals" (trigger-based reveal).
  const painSignals = useMemo(() => {
    const mismatches = Number(safeGetLocalStorage("oli_mismatchCount_30d", "0"));
    const alerts = Number(safeGetLocalStorage("oli_alertCount_30d", "0"));
    const leakage = Number(safeGetLocalStorage("oli_leakageScore_30d", "0"));
    return { mismatches, alerts, leakage };
  }, []);

  const nextRecommendedPlanKey = useMemo(() => {
    const current = currentPlanKey;

    const painTriggered =
      painSignals.mismatches >= 3 ||
      painSignals.alerts >= 5 ||
      painSignals.leakage >= 2;

    if (current === "lite") {
      return painTriggered ? "oversight" : null;
    }

    if (current === "oversight") {
      const proEligible =
        painSignals.alerts >= 10 || painSignals.mismatches >= 8;
      return proEligible ? "pro" : null;
    }

    if (current === "assist") return "oversight";

    return null;
  }, [currentPlanKey, painSignals]);

  const currentPlan = PLANS[currentPlanKey];
  const nextPlan = nextRecommendedPlanKey ? PLANS[nextRecommendedPlanKey] : null;

  const upgradeWhy = useMemo(() => {
    if (!nextPlan) return [];
    if (nextPlan.key === "oversight") {
      const reasons = [];
      if (painSignals.mismatches >= 3) reasons.push("Repeated mismatches detected");
      if (painSignals.alerts >= 5) reasons.push("Multiple alerts in the last 30 days");
      if (painSignals.leakage >= 2) reasons.push("Leakage patterns are emerging");
      if (reasons.length === 0) reasons.push("Unlock active oversight when you're ready");
      return reasons;
    }
    if (nextPlan.key === "pro") {
      return [
        "Your activity indicates higher transaction complexity",
        "You may benefit from multi-account oversight",
      ];
    }
    return ["Upgrade to unlock the next level of oversight"];
  }, [nextPlan, painSignals]);

  const additionalServices = [
    {
      name: "Financial Leaks Report",
      description: "One-time detailed report download",
      price: 29.99,
      frequency: "One-time",
    },
    {
      name: "Banking & Financial Leaks Access",
      description: "Monthly subscription for banking links and financial leaks",
      price: 29.99,
      frequency: "Monthly",
    },
  ];

  const priceOf = (plan) =>
    billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;

  const onSelectPlan = (planKey) => {
    setCurrentPlanKey(planKey);
    safeSetLocalStorage("oliPlan", planKey);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: styles.background,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        margin: 0,
        padding: 0,
        transition: 'background-color 0.3s ease',
      }}
    >
      <nav
        style={{
          backgroundColor: styles.navBackground,
          padding: "16px 32px",
          borderBottom: `1px solid ${styles.navBorder}`,
          transition: 'all 0.3s ease',
        }}
      >
        <Link
          to="/"
          style={{ color: styles.textPrimary, textDecoration: "none", fontWeight: "600" }}
        >
          ← Back to Home
        </Link>
      </nav>

      <header
        style={{
          backgroundColor: styles.headerBg,
          color: styles.headerText,
          padding: "60px 32px",
          textAlign: "center",
          transition: 'background-color 0.3s ease',
        }}
      >
        <h1 style={{ fontSize: "42px", fontWeight: "700", margin: "0 0 16px 0", color: styles.headerText }}>
          Your Plan
        </h1>
        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
            maxWidth: "720px",
            margin: "0 auto",
            color: styles.headerText,
          }}
        >
          {earlyAccess
            ? "You're on Early Access. You have full OLI access for learning and feedback."
            : "You'll only see the next recommended upgrade when it's justified — no pricing chaos."}
        </p>
      </header>

      <div style={{ padding: "60px 32px", maxWidth: "1100px", margin: "0 auto" }}>
        {earlyAccess && (
          <div
            style={{
              backgroundColor: styles.cardBackground,
              borderRadius: "16px",
              padding: "24px",
              border: `2px solid ${styles.textPrimary}`,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              marginBottom: "28px",
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    color: styles.textPrimary,
                    fontWeight: "800",
                  }}
                >
                  Early Access Active
                </h3>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    color: styles.textSecondary,
                    fontSize: "14px",
                    maxWidth: "760px",
                  }}
                >
                  Pricing is hidden. You're running the full product so we can
                  learn where the real mismatch pain is.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  safeSetLocalStorage("oliEarlyAccess", "false");
                  window.location.reload();
                }}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: styles.buttonBg,
                  color: "#fff",
                  fontWeight: "700",
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.buttonHoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styles.buttonBg;
                }}
              >
                End Early Access (local)
              </button>
            </div>
          </div>
        )}

        {!earlyAccess && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginBottom: "36px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                backgroundColor: billingCycle === "monthly" ? styles.buttonBg : styles.inactiveButtonBg,
                color: billingCycle === "monthly" ? "#fff" : styles.inactiveButtonText,
                transition: "all 0.2s ease",
                minWidth: "120px",
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                backgroundColor: billingCycle === "yearly" ? styles.buttonBg : styles.inactiveButtonBg,
                color: billingCycle === "yearly" ? "#fff" : styles.inactiveButtonText,
                transition: "all 0.2s ease",
                minWidth: "120px",
              }}
            >
              Yearly (Save 10%)
            </button>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: nextPlan ? "repeat(2, minmax(320px, 1fr))" : "minmax(320px, 1fr)",
            gap: "28px",
            alignItems: "start",
          }}
        >
          {/* CURRENT */}
          <div
            style={{
              backgroundColor: styles.cardBackground,
              borderRadius: "20px",
              padding: "36px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: `2px solid ${currentPlan.border}`,
              position: "relative",
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: styles.badgeBg,
                color: styles.badgeText,
                padding: "8px 12px",
                borderRadius: "999px",
                fontWeight: "800",
                fontSize: "12px",
                marginBottom: "16px",
                transition: 'all 0.3s ease',
              }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "999px",
                  backgroundColor: currentPlan.accent,
                  display: "inline-block",
                }}
              />
              Current plan
            </div>

            <h3 style={{ fontSize: "26px", fontWeight: "800", color: styles.textPrimary, margin: 0 }}>
              {currentPlan.name}
            </h3>
            <p style={{ margin: "8px 0 0 0", color: styles.textSecondary, fontSize: "14px" }}>
              <span style={{ fontWeight: "700", color: styles.textPrimary }}>{currentPlan.purpose}</span> • {currentPlan.mode}
            </p>

            {!earlyAccess && (
              <div style={{ marginTop: "18px" }}>
                <span style={{ fontSize: "46px", fontWeight: "800", color: styles.textPrimary }}>
                  ${priceOf(currentPlan)}
                </span>
                <span style={{ fontSize: "16px", color: styles.textTertiary }}>
                  /{billingCycle === "monthly" ? "month" : "year"}
                </span>
              </div>
            )}

            <div style={{ marginTop: "22px" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: styles.textPrimary, marginBottom: "10px" }}>
                What you get
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {currentPlan.features.map((t, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "9px 0",
                      fontSize: "14px",
                      color: styles.textPrimary,
                    }}
                  >
                    <span style={{ color: "#22c55e", fontSize: "18px" }}>✓</span>
                    {t}
                  </li>
                ))}
              </ul>

              {currentPlan.notIncluded.length > 0 && (
                <>
                  <div style={{ fontSize: "14px", fontWeight: "800", color: styles.textPrimary, margin: "18px 0 10px" }}>
                    What it does NOT do
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {currentPlan.notIncluded.map((t, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "9px 0",
                          fontSize: "14px",
                          color: styles.textSecondary,
                        }}
                      >
                        <span style={{ color: styles.textTertiary, fontSize: "18px" }}>✗</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {!earlyAccess && (
              <div style={{ marginTop: "24px", borderTop: `1px solid ${styles.border}`, paddingTop: "18px" }}>
                <div style={{ fontSize: "12px", color: styles.textTertiary, marginBottom: "10px" }}>
                  Local testing controls (replace with real subscription state)
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => onSelectPlan("lite")}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${styles.border}`,
                      backgroundColor: currentPlanKey === "lite" ? styles.buttonBg : styles.cardBackground,
                      color: currentPlanKey === "lite" ? "#fff" : styles.textPrimary,
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "12px",
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Set Lite
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectPlan("oversight")}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${styles.border}`,
                      backgroundColor: currentPlanKey === "oversight" ? styles.buttonBg : styles.cardBackground,
                      color: currentPlanKey === "oversight" ? "#fff" : styles.textPrimary,
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "12px",
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Set Oversight
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectPlan("pro")}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${styles.border}`,
                      backgroundColor: currentPlanKey === "pro" ? styles.buttonBg : styles.cardBackground,
                      color: currentPlanKey === "pro" ? "#fff" : styles.textPrimary,
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "12px",
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Set Pro
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* NEXT */}
          {!earlyAccess && nextPlan && (
            <div
              style={{
                backgroundColor: styles.cardBackground,
                borderRadius: "20px",
                padding: "36px",
                boxShadow: themeMode === 'dark' 
                  ? "0 8px 40px rgba(0,0,0,0.3)" 
                  : "0 8px 40px rgba(27, 67, 50, 0.14)",
                border: `2px solid ${nextPlan.border}`,
                position: "relative",
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: styles.buttonBg,
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontWeight: "800",
                  fontSize: "12px",
                  marginBottom: "16px",
                  transition: 'background-color 0.3s ease',
                }}
              >
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    backgroundColor: nextPlan.accent,
                    display: "inline-block",
                  }}
                />
                Next recommended plan
              </div>

              <h3 style={{ fontSize: "26px", fontWeight: "800", color: styles.textPrimary, margin: 0 }}>
                {nextPlan.name}
              </h3>
              <p style={{ margin: "8px 0 0 0", color: styles.textSecondary, fontSize: "14px" }}>
                <span style={{ fontWeight: "700", color: styles.textPrimary }}>{nextPlan.purpose}</span> • {nextPlan.mode}
              </p>

              <div style={{ marginTop: "18px" }}>
                <span style={{ fontSize: "46px", fontWeight: "800", color: styles.textPrimary }}>
                  ${priceOf(nextPlan)}
                </span>
                <span style={{ fontSize: "16px", color: styles.textTertiary }}>
                  /{billingCycle === "monthly" ? "month" : "year"}
                </span>
              </div>

              <div
                style={{
                  marginTop: "18px",
                  backgroundColor: styles.whyBg,
                  border: `1px solid ${styles.whyBorder}`,
                  borderRadius: "14px",
                  padding: "14px",
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: "900", color: styles.textPrimary, marginBottom: "8px" }}>
                  Why this upgrade helps
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {upgradeWhy.map((r, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: "10px",
                        padding: "7px 0",
                        fontSize: "13px",
                        color: styles.textPrimary,
                      }}
                    >
                      <span style={{ color: styles.textPrimary, fontWeight: "900" }}>•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: "22px" }}>
                <div style={{ fontSize: "14px", fontWeight: "800", color: styles.textPrimary, marginBottom: "10px" }}>
                  What you add
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {nextPlan.features.map((t, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 0",
                        fontSize: "14px",
                        color: styles.textPrimary,
                      }}
                    >
                      <span style={{ color: "#22c55e", fontSize: "18px" }}>✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onSelectPlan(nextPlan.key)}
                style={{
                  width: "100%",
                  marginTop: "24px",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  fontSize: "16px",
                  fontWeight: "800",
                  cursor: "pointer",
                  backgroundColor: styles.buttonBg,
                  color: "#fff",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.92";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.backgroundColor = styles.buttonHoverBg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.backgroundColor = styles.buttonBg;
                }}
              >
                {nextPlan.cta}
              </button>
            </div>
          )}
        </div>

        {!earlyAccess && !nextPlan && (
          <div
            style={{
              marginTop: "24px",
              padding: "18px",
              backgroundColor: styles.cardBackground,
              borderRadius: "14px",
              border: `1px solid ${styles.border}`,
              color: styles.textSecondary,
              fontSize: "14px",
              textAlign: "center",
              transition: 'all 0.3s ease',
            }}
          >
            No upgrade recommended right now. Stay on your current plan until active oversight is justified.
          </div>
        )}

        {!earlyAccess && (
          <div style={{ marginTop: "70px" }}>
            <h2
              style={{
                fontSize: "26px",
                fontWeight: "800",
                color: styles.textPrimary,
                marginBottom: "26px",
                textAlign: "center",
              }}
            >
              Additional Services
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
                maxWidth: "860px",
                margin: "0 auto",
              }}
            >
              {additionalServices.map((service, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: styles.cardBackground,
                    borderRadius: "16px",
                    padding: "28px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: `1px solid ${styles.border}`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      color: styles.textPrimary,
                      marginTop: 0,
                      marginBottom: "8px",
                    }}
                  >
                    {service.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: styles.textSecondary,
                      marginBottom: "14px",
                      minHeight: "40px",
                    }}
                  >
                    {service.description}
                  </p>

                  <div style={{ display: "flex", alignItems: "baseline", marginBottom: "18px" }}>
                    <span style={{ fontSize: "30px", fontWeight: "900", color: styles.textPrimary }}>
                      ${service.price}
                    </span>
                    <span style={{ fontSize: "14px", color: styles.textTertiary, marginLeft: "8px" }}>
                      /{service.frequency}
                    </span>
                  </div>

                  <button
                    type="button"
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: "800",
                      cursor: "pointer",
                      backgroundColor: styles.buttonBg,
                      color: "#fff",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = styles.buttonHoverBg;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = styles.buttonBg;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Purchase
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: "80px", textAlign: "center" }}>
          <h2 style={{ fontSize: "26px", fontWeight: "900", color: styles.textPrimary, marginBottom: "10px" }}>
            Questions?
          </h2>
          <p style={{ color: styles.textSecondary, marginBottom: "24px" }}>Contact us at contact@oli-branch.com</p>

          <Link
            to="/dashboard"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              backgroundColor: styles.buttonBg,
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "800",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = styles.buttonHoverBg;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = styles.buttonBg;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
