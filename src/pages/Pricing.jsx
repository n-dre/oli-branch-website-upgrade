// src/pages/Pricing.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const PLANS = {
  lite: {
    key: "lite",
    name: "OLI Lite",
    purpose: "Awareness & habit",
    mode: "Observation mode (not oversight)",
    monthlyPrice: 9.99,
    yearlyPrice: 107.89, // 10% off
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
      "No “OLI talks to you”",
    ],
    cta: "Start with OLI Lite",
  },

  assist: {
    key: "assist",
    name: "OLI Assist",
    purpose: "Guided awareness",
    mode: "Assisted monitoring",
    monthlyPrice: 29.99,
    yearlyPrice: 323.89, // 10% off
    accent: "#f59e0b",
    border: "#ffedd5",
    features: [
      "More frequent checks",
      "Limited recommendations",
      "“Here’s what changed” explanations",
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
    yearlyPrice: 539.89, // 10% off
    accent: "#3b82f6",
    border: "#dbeafe",
    features: [
      "Continuous monitoring",
      "Proactive agent alerts",
      "Personalized reasoning",
      "“OLI, check this for me”",
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
    yearlyPrice: 863.89, // 10% off
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

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  // Progressive visibility flags
  const earlyAccess = safeGetLocalStorage("oliEarlyAccess", "false") === "true";

  // This is your user's current plan.
  // In production you’ll replace this with your real auth/subscription source.
  const [currentPlanKey, setCurrentPlanKey] = useState(() => {
    const stored = safeGetLocalStorage("oliPlan", "lite");
    return PLANS[stored] ? stored : "lite";
  });

  // Example “pain signals” (trigger-based reveal).
  // Replace with your real analytics (mismatches/alerts/leakage events).
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
      if (reasons.length === 0) reasons.push("Unlock active oversight when you’re ready");
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
        backgroundColor: "#F8F5F0",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        margin: 0,
        padding: 0,
      }}
    >
      <nav
        style={{
          backgroundColor: "#ffffff",
          padding: "16px 32px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Link
          to="/"
          style={{ color: "#1B4332", textDecoration: "none", fontWeight: "600" }}
        >
          ← Back to Home
        </Link>
      </nav>

      <header
        style={{
          backgroundColor: "#1B4332",
          color: "#ffffff",
          padding: "60px 32px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "42px", fontWeight: "700", margin: "0 0 16px 0" }}>
          Your Plan
        </h1>
        <p
          style={{
            fontSize: "18px",
            opacity: 0.9,
            maxWidth: "720px",
            margin: "0 auto",
          }}
        >
          {earlyAccess
            ? "You’re on Early Access. You have full OLI access for learning and feedback."
            : "You’ll only see the next recommended upgrade when it’s justified — no pricing chaos."}
        </p>
      </header>

      <div style={{ padding: "60px 32px", maxWidth: "1100px", margin: "0 auto" }}>
        {earlyAccess && (
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "24px",
              border: "2px solid #1B4332",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              marginBottom: "28px",
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
                    color: "#1B4332",
                    fontWeight: "800",
                  }}
                >
                  Early Access Active
                </h3>
                <p
                  style={{
                    margin: "8px 0 0 0",
                    color: "#666",
                    fontSize: "14px",
                    maxWidth: "760px",
                  }}
                >
                  Pricing is hidden. You’re running the full product so we can
                  learn where the real mismatch pain is.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  safeSetLocalStorage("oliEarlyAccess", "false");
                }}
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#1B4332",
                  color: "#fff",
                  fontWeight: "700",
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
                backgroundColor: billingCycle === "monthly" ? "#1B4332" : "#e0e0e0",
                color: billingCycle === "monthly" ? "#fff" : "#333",
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
                backgroundColor: billingCycle === "yearly" ? "#1B4332" : "#e0e0e0",
                color: billingCycle === "yearly" ? "#fff" : "#333",
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
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              padding: "36px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: `2px solid ${currentPlan.border}`,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: "#f0f7f4",
                color: "#1B4332",
                padding: "8px 12px",
                borderRadius: "999px",
                fontWeight: "800",
                fontSize: "12px",
                marginBottom: "16px",
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

            <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#1B4332", margin: 0 }}>
              {currentPlan.name}
            </h3>
            <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
              <span style={{ fontWeight: "700", color: "#333" }}>{currentPlan.purpose}</span> • {currentPlan.mode}
            </p>

            {!earlyAccess && (
              <div style={{ marginTop: "18px" }}>
                <span style={{ fontSize: "46px", fontWeight: "800", color: "#1B4332" }}>
                  ${priceOf(currentPlan)}
                </span>
                <span style={{ fontSize: "16px", color: "#888" }}>
                  /{billingCycle === "monthly" ? "month" : "year"}
                </span>
              </div>
            )}

            <div style={{ marginTop: "22px" }}>
              <div style={{ fontSize: "14px", fontWeight: "800", color: "#1B4332", marginBottom: "10px" }}>
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
                      color: "#333",
                    }}
                  >
                    <span style={{ color: "#22c55e", fontSize: "18px" }}>✓</span>
                    {t}
                  </li>
                ))}
              </ul>

              {currentPlan.notIncluded.length > 0 && (
                <>
                  <div style={{ fontSize: "14px", fontWeight: "800", color: "#1B4332", margin: "18px 0 10px" }}>
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
                          color: "#777",
                        }}
                      >
                        <span style={{ color: "#ccc", fontSize: "18px" }}>✗</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {!earlyAccess && (
              <div style={{ marginTop: "24px", borderTop: "1px solid #eee", paddingTop: "18px" }}>
                <div style={{ fontSize: "12px", color: "#888", marginBottom: "10px" }}>
                  Local testing controls (replace with real subscription state)
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => onSelectPlan("lite")}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "10px",
                      border: "1px solid #e0e0e0",
                      backgroundColor: currentPlanKey === "lite" ? "#1B4332" : "#fff",
                      color: currentPlanKey === "lite" ? "#fff" : "#333",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "12px",
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
                      border: "1px solid #e0e0e0",
                      backgroundColor: currentPlanKey === "oversight" ? "#1B4332" : "#fff",
                      color: currentPlanKey === "oversight" ? "#fff" : "#333",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "12px",
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
                      border: "1px solid #e0e0e0",
                      backgroundColor: currentPlanKey === "pro" ? "#1B4332" : "#fff",
                      color: currentPlanKey === "pro" ? "#fff" : "#333",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "12px",
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
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                padding: "36px",
                boxShadow: "0 8px 40px rgba(27, 67, 50, 0.14)",
                border: `2px solid ${nextPlan.border}`,
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  backgroundColor: "#1B4332",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontWeight: "800",
                  fontSize: "12px",
                  marginBottom: "16px",
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

              <h3 style={{ fontSize: "26px", fontWeight: "800", color: "#1B4332", margin: 0 }}>
                {nextPlan.name}
              </h3>
              <p style={{ margin: "8px 0 0 0", color: "#666", fontSize: "14px" }}>
                <span style={{ fontWeight: "700", color: "#333" }}>{nextPlan.purpose}</span> • {nextPlan.mode}
              </p>

              <div style={{ marginTop: "18px" }}>
                <span style={{ fontSize: "46px", fontWeight: "800", color: "#1B4332" }}>
                  ${priceOf(nextPlan)}
                </span>
                <span style={{ fontSize: "16px", color: "#888" }}>
                  /{billingCycle === "monthly" ? "month" : "year"}
                </span>
              </div>

              <div
                style={{
                  marginTop: "18px",
                  backgroundColor: "#f0f7f4",
                  border: "1px solid #d4e6df",
                  borderRadius: "14px",
                  padding: "14px",
                }}
              >
                <div style={{ fontSize: "14px", fontWeight: "900", color: "#1B4332", marginBottom: "8px" }}>
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
                        color: "#333",
                      }}
                    >
                      <span style={{ color: "#1B4332", fontWeight: "900" }}>•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginTop: "22px" }}>
                <div style={{ fontSize: "14px", fontWeight: "800", color: "#1B4332", marginBottom: "10px" }}>
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
                        color: "#333",
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
                  backgroundColor: "#1B4332",
                  color: "#fff",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.92";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.transform = "translateY(0)";
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
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #e0e0e0",
              color: "#666",
              fontSize: "14px",
              textAlign: "center",
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
                color: "#1B4332",
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
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    padding: "28px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      color: "#1B4332",
                      marginTop: 0,
                      marginBottom: "8px",
                    }}
                  >
                    {service.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginBottom: "14px",
                      minHeight: "40px",
                    }}
                  >
                    {service.description}
                  </p>

                  <div style={{ display: "flex", alignItems: "baseline", marginBottom: "18px" }}>
                    <span style={{ fontSize: "30px", fontWeight: "900", color: "#1B4332" }}>
                      ${service.price}
                    </span>
                    <span style={{ fontSize: "14px", color: "#888", marginLeft: "8px" }}>
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
                      backgroundColor: "#1B4332",
                      color: "#fff",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#15382a";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#1B4332";
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
          <h2 style={{ fontSize: "26px", fontWeight: "900", color: "#1B4332", marginBottom: "10px" }}>
            Questions?
          </h2>
          <p style={{ color: "#666", marginBottom: "24px" }}>Contact us at contact@oli-branch.com</p>

          <Link
            to="/dashboard"
            style={{
              display: "inline-block",
              padding: "14px 32px",
              backgroundColor: "#1B4332",
              color: "#fff",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "800",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#15382a";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#1B4332";
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
