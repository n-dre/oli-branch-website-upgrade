// src/pages/Services.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import anime from "animejs";

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState("banking");

  // Color definitions
  const colors = {
    gold: '#D4AF37',
    forest: '#1B4332',
    sage: '#52796F',
    cream: '#F8F5F0',
    charcoal: '#2D3748'
  };

  useEffect(() => {
    anime({
      targets: ".fade-in-up",
      opacity: 1,
      translateY: 0,
      duration: 800,
      easing: "easeOutCubic",
      delay: anime.stagger(100),
    });

    anime({
      targets: ".stagger-children > *",
      opacity: 1,
      translateY: 0,
      duration: 600,
      easing: "easeOutCubic",
      delay: anime.stagger(100),
    });
  }, [activeTab]);

  const handleTabClick = (tabId) => setActiveTab(tabId);

  return (
    <div style={{ backgroundColor: colors.cream, color: colors.charcoal }}>
      {/* CSS Injection */}
      <style>{`
        .hero-gradient {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
        }

        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(248, 245, 240, 0.9);
        }

        .btn-primary {
          background: #1B4332;
          color: #F8F5F0;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: #52796F;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3);
        }

        .btn-secondary {
          border: 2px solid #1B4332;
          color: #1B4332;
          background: transparent;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #1B4332;
          color: #F8F5F0;
        }

        .service-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .product-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
        }

        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .fade-in-up {
          opacity: 0;
          transform: translateY(24px);
        }

        .stagger-children > * {
          opacity: 0;
          transform: translateY(24px);
        }

        .tab-button {
          padding: 12px 24px;
          border: 2px solid transparent;
          border-radius: 8px;
          background: transparent;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-button.active {
          border-color: #52796F;
          background: #52796F;
          color: white;
        }

        .tab-button:hover:not(.active) {
          border-color: #52796F;
          color: #52796F;
        }

        @keyframes vibrate-glow {
          0% { transform: scale(1); box-shadow: 0 0 10px rgba(212, 175, 55, 0.6); }
          50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(212, 175, 55, 0.9), 0 0 40px rgba(212, 175, 55, 0.4); }
          100% { transform: scale(1); box-shadow: 0 0 10px rgba(212, 175, 55, 0.6); }
        }
      `}</style>
            {/* Navigation */}
            <nav
            className="fixed top-0 w-full z-50 glass-effect border-b border-opacity-20"
            style={{ borderColor: colors.sage }}
            >
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <img
                    src="/images/oli-branch00.png"
                    alt="Oli Logo"
                    className="w-12 h-12 rounded-lg"
                    />
                    <div className="flex flex-col leading-tight">
                    <span
                        className="font-bold text-xl"
                        style={{ color: colors.forest }}
                    >
                        Oli-Branch
                    </span>
                    <span className="text-[10px] uppercase tracking-widest italic">
                        Powered by AI
                    </span>
                    </div>
                </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:opacity-70 transition-colors">Home</Link>
              <Link to="/resources" className="hover:opacity-70 transition-colors">Resources</Link>
              <Link to="/about" className="hover:opacity-70 transition-colors">About</Link>
              <Link to="/login" className="hover:opacity-70 transition-colors">Login</Link>
              <a
                href="https://financial-mismatch.preview.emergentagent.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-2 rounded-lg font-medium inline-flex items-center justify-center"
              >
                Run an Audit
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16" style={{ backgroundColor: colors.forest, color: colors.cream }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="fade-in-up">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              Comprehensive <span style={{ color: colors.gold }}>Financial Solutions</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Oli is the AI auditor that finds the hidden fees and mismatched services draining your profit.
            </p>
          </div>
        </div>
      </section>

      {/* Service Tabs */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Tab Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              type="button"
              className={`tab-button ${activeTab === 'banking' ? 'active' : ''}`}
              onClick={() => handleTabClick('banking')}
            >
              Banking Products
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'health' ? 'active' : ''}`}
              onClick={() => handleTabClick('health')}
            >
              Financial Health
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => handleTabClick('resources')}
            >
              Government Resources
            </button>
            <button
              type="button"
              className={`tab-button ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => handleTabClick('education')}
            >
              Education
            </button>
          </div>

          {/* Banking Products Tab */}
          {activeTab === 'banking' && (
            <div className="mt-16">
              <h3 className="font-display text-3xl font-bold text-center mb-8" style={{ color: colors.forest }}>
                Banking Products That Reduce Financial Mismatch
              </h3>

              <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
                These products are commonly recommended when a business is overpaying in fees, using the wrong account tier,
                or carrying financial tools that don't match their cash flow. Review options designed to
                fix the mismatch between your banking needs and what you're currently paying for.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Checking Account */}
                <div className="product-card bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold" style={{ color: colors.forest }}>Business Checking</h4>
                    <span className="font-bold" style={{ color: colors.gold }}>4.8/5</span>
                  </div>

                  <ul className="space-y-2 text-gray-600 mb-6">
                    <li>✓ Designed for businesses overpaying monthly fees</li>
                    <li>✓ Includes higher free transaction limits</li>
                    <li>✓ Reduces mismatch for low-to-medium volume businesses</li>
                    <li>✓ Transparent pricing—no hidden charges</li>
                  </ul>

                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.forest }}>$0</div>
                    <div className="text-gray-500 mb-4">monthly maintenance</div>
                    <button type="button" className="btn-primary w-full py-3 rounded-lg">Review Options</button>
                  </div>
                </div>

                {/* Credit Line */}
                <div className="product-card bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold" style={{ color: colors.forest }}>Business Credit Line</h4>
                    <span className="font-bold" style={{ color: colors.gold }}>4.7/5</span>
                  </div>

                  <ul className="space-y-2 text-gray-600 mb-6">
                    <li>✓ Corrects mismatch caused by using personal credit for business expenses</li>
                    <li>✓ Pay interest only on what you use—ideal for uneven cash flow</li>
                    <li>✓ No annual fee reduces long-term carrying costs</li>
                    <li>✓ Prevents overdraft and penalty cycles</li>
                  </ul>

                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.forest }}>8.9%</div>
                    <div className="text-gray-500 mb-4">APR</div>
                    <button type="button" className="btn-primary w-full py-3 rounded-lg">See Eligibility</button>
                  </div>
                </div>

                {/* SBA Loan */}
                <div className="product-card bg-white p-6 rounded-xl border hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-semibold" style={{ color: colors.forest }}>SBA Express Loan</h4>
                    <span className="font-bold" style={{ color: colors.gold }}>4.6/5</span>
                  </div>

                  <ul className="space-y-2 text-gray-600 mb-6">
                    <li>✓ Ideal when high-rate loans or merchant cash advances are mismatched to revenue</li>
                    <li>✓ Fast approval helps restructure unhealthy debt</li>
                    <li>✓ Lower payments improve cash-flow stability</li>
                    <li>✓ Often requires no collateral</li>
                  </ul>

                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.forest }}>5.5%</div>
                    <div className="text-gray-500 mb-4">APR</div>
                    <button type="button" className="btn-primary w-full py-3 rounded-lg">Compare Lenders</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Health Tab */}
          {activeTab === 'health' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="font-display text-4xl font-bold mb-4" style={{ color: colors.forest }}>
                  Financial Mismatch Dashboard
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Identify where your banking setup doesn't match how your business actually operates, and fix it.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl border">
                  <h3 className="font-semibold mb-1" style={{ color: colors.forest }}>Mismatch Score</h3>
                  <div className="text-4xl font-bold mb-2" style={{ color: colors.forest }}>68</div>
                  <p className="text-gray-600 text-sm">
                    Indicates friction between your cash flow and banking products.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border">
                  <h3 className="font-semibold mb-1" style={{ color: colors.forest }}>Estimated Monthly Leak</h3>
                  <div className="text-4xl font-bold mb-2" style={{ color: colors.forest }}>$420</div>
                  <p className="text-gray-600 text-sm">
                    Avoidable fees, interest, and penalties caused by mismatched tools.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl border">
                  <h3 className="font-semibold mb-1" style={{ color: colors.forest }}>Primary Cause</h3>
                  <div className="text-lg font-bold mb-2" style={{ color: colors.forest }}>
                    Wrong Account Tier
                  </div>
                  <p className="text-gray-600 text-sm">
                    Paying for features you don't use, or hitting limits you shouldn't.
                  </p>
                </div>
              </div>

              {/* Mismatch Signals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h3 className="text-2xl font-bold mb-6" style={{ color: colors.forest }}>
                    Common Mismatch Signals
                  </h3>

                  <div className="space-y-6">
                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold" style={{ color: colors.forest }}>Fee Pressure</h4>
                      <p className="text-gray-600">
                        Monthly banking fees eating into payroll, inventory, or growth capital.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Often caused by the wrong account tier or unnecessary add-ons.
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold" style={{ color: colors.forest }}>Cash Flow Mismatch</h4>
                      <p className="text-gray-600">
                        Revenue timing doesn't align with billing cycles, minimum balances, or overdraft rules.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Leads to avoidable penalties and short-term borrowing.
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-lg border">
                      <h4 className="font-semibold" style={{ color: colors.forest }}>Credit Misuse</h4>
                      <p className="text-gray-600">
                        Short-term, high-cost credit used to fund long-term business needs.
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Creates compounding interest and cash flow strain.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Fixes */}
                <div>
                  <h3 className="text-2xl font-bold mb-6" style={{ color: colors.forest }}>
                    Recommended Fixes
                  </h3>

                  <div className="rounded-xl p-6" style={{ backgroundColor: `${colors.sage}20` }}>
                    <ul className="space-y-3 text-gray-700">
                      <li>• Align your checking account tier with actual transaction volume.</li>
                      <li>• Replace overdraft cycles with a flexible credit line.</li>
                      <li>• Move high-cost short-term debt into better-fit financing.</li>
                      <li>• Eliminate tools you don't actively use.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-16 text-center">
                <h3 className="font-display text-3xl font-bold mb-6" style={{ color: colors.forest }}>
                  Get Your Financial Mismatch Score
                </h3>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Answer a few questions and we'll show exactly where your banking setup is working against you, and how to fix it.
                </p>
                <a
                href="https://financial-mismatch.preview.emergentagent.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-8 py-4 rounded-lg font-medium inline-flex items-center justify-center"
                >
                    Start Mismatch Check
                </a>

                <p className="text-sm text-gray-500 mt-3">
                  No bank login required.
                </p>
              </div>
            </div>
          )}

          {/* Government Resources Tab */}
          {activeTab === 'resources' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="font-display text-4xl font-bold mb-4" style={{ color: colors.forest }}>
                  Mismatch Resource Finder
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Find public programs that fix specific mismatches—high-cost debt, cash-flow gaps, startup capital, and
                  procurement barriers, not random "opportunities."
                </p>
              </div>

              {/* Mismatch Filters */}
              <div className="max-w-4xl mx-auto bg-white border rounded-xl p-6 mb-12">
                <h3 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>What mismatch are you trying to fix?</h3>
                <p className="text-gray-600 mb-6">
                  Pick the problem. We'll match you to programs designed for that exact gap.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-gray-50">
                    <h4 className="font-semibold mb-1" style={{ color: colors.forest }}>High-cost debt mismatch</h4>
                    <p className="text-gray-600 text-sm">
                      Using expensive short-term money (cards/MCA) for long-term needs.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border bg-gray-50">
                    <h4 className="font-semibold mb-1" style={{ color: colors.forest }}>Cash-flow timing mismatch</h4>
                    <p className="text-gray-600 text-sm">
                      Revenue arrives late, but bills and payroll hit on schedule.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border bg-gray-50">
                    <h4 className="font-semibold mb-1" style={{ color: colors.forest }}>Startup capital mismatch</h4>
                    <p className="text-gray-600 text-sm">
                      You need working capital, but bank requirements don't fit your stage.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border bg-gray-50">
                    <h4 className="font-semibold mb-1" style={{ color: colors.forest }}>Procurement access mismatch</h4>
                    <p className="text-gray-600 text-sm">
                      You can do the work, but can't break into government contracting.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button type="button" disabled className="btn-primary px-6 py-3 rounded-lg opacity-50 cursor-not-allowed">
                    Match Me to Programs
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-4 text-center">
                  No bank login required. We match based on your business stage, location, industry, and mismatch type.
                </p>
              </div>

              {/* Featured Programs */}
              <div className="mt-10">
                <h3 className="font-display text-3xl font-bold text-center mb-8" style={{ color: colors.forest }}>
                  Featured Programs by Mismatch
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* SBA 7(a) */}
                  <div className="service-card bg-white p-6 rounded-xl border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold" style={{ color: colors.forest }}>SBA 7(a) Loan Program</h4>
                      <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${colors.sage}20`, color: colors.sage }}>
                        Fix: Debt + Cash-Flow Fit
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Best For:</span>
                        <span className="font-semibold">Refinance, working capital</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Use Case:</span>
                        <span className="font-semibold">Replace high-cost debt</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Availability:</span>
                        <span className="font-semibold">Rolling</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                      Use when your current financing doesn't match your revenue cycle—high payments, high APR, or rigid terms.
                      This is a common "mismatch correction" option for longer-term stability.
                    </p>

                    <div className="flex gap-3">
                      <button type="button" disabled className="btn-primary w-full py-3 rounded-lg opacity-50 cursor-not-allowed">Find a Lender</button>
                    </div>
                  </div>

                  {/* Microloan */}
                  <div className="service-card bg-white p-6 rounded-xl border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold" style={{ color: colors.forest }}>SBA Microloan Program</h4>
                      <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${colors.gold}20`, color: '#92400e' }}>
                        Fix: Startup Capital Fit
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Best For:</span>
                        <span className="font-semibold">Early-stage working capital</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Use Case:</span>
                        <span className="font-semibold">Inventory, tools, launch costs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Availability:</span>
                        <span className="font-semibold">Varies by lender</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                      Use when you're too early for traditional bank underwriting but need right-sized capital that matches your stage.
                      Helps correct the "startup funding mismatch."
                    </p>

                    <div className="flex gap-3">
                      <button type="button" disabled className="btn-primary w-full py-3 rounded-lg opacity-50 cursor-not-allowed">Find Microloan Lenders</button>
                    </div>
                  </div>

                  {/* CDFI */}
                  <div className="service-card bg-white p-6 rounded-xl border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold" style={{ color: colors.forest }}>CDFI Lending Programs</h4>
                      <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${colors.sage}20`, color: colors.sage }}>
                        Fix: Underwriting Fit
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Best For:</span>
                        <span className="font-semibold">Flexible underwriting</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Use Case:</span>
                        <span className="font-semibold">Cash-flow-based lending</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Availability:</span>
                        <span className="font-semibold">Regional</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                      Use when the bank's underwriting model doesn't fit your business reality—thin file, newer business,
                      nontraditional revenue patterns, or community-focused eligibility.
                    </p>

                    <div className="flex gap-3">
                      <button type="button" disabled className="btn-primary w-full py-3 rounded-lg opacity-50 cursor-not-allowed">Find Local CDFIs</button>
                    </div>
                  </div>

                  {/* Government Contracting */}
                  <div className="service-card bg-white p-6 rounded-xl border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold" style={{ color: colors.forest }}>Government Contracting Support</h4>
                      <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${colors.gold}20`, color: '#92400e' }}>
                        Fix: Procurement Access
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Best For:</span>
                        <span className="font-semibold">Winning contracts</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Use Case:</span>
                        <span className="font-semibold">Registration + bids + compliance</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Availability:</span>
                        <span className="font-semibold">Ongoing</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">
                      Use when you can deliver the work but can't break through the system—certifications, vendor registration,
                      bid packaging, and compliance. This fixes the "access mismatch."
                    </p>

                    <div className="flex gap-3">
                      <button type="button" disabled className="btn-primary w-full py-3 rounded-lg opacity-50 cursor-not-allowed">Find Local Support</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Explanation */}
              <div className="mt-12 max-w-4xl mx-auto p-6 bg-white border rounded-xl">
                <h4 className="font-semibold mb-2" style={{ color: colors.forest }}>What makes this different</h4>
                <p className="text-gray-600">
                  Most "resource lists" dump programs without context. This section is built around mismatch:
                  you choose the gap (cash flow timing, underwriting fit, high-cost debt, procurement access),
                  and we surface programs designed to correct that exact problem.
                </p>
              </div>
            </div>
          )}

          {/* Education Tab */}
          {activeTab === 'education' && (
            <div className="py-12">
              <div className="text-center mb-16">
                <h2 className="font-display text-4xl font-bold mb-4" style={{ color: colors.forest }}>Financial Toolset</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Professional resources designed to identify and correct financial mismatch in your business.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
                <div className="group bg-white p-8 rounded-2xl border flex flex-col hover:shadow-md transition-all" style={{ borderColor: `${colors.sage}20` }}>
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3" style={{ color: colors.forest }}>Fee Leakage Audit</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      A professional guide to identifying preventable bank fees, wire charges, and deposit limits that are mismatched to your current business tier.
                    </p>
                  </div>
                  <a href="#" className="font-bold flex items-center gap-2 mt-auto" style={{ color: colors.sage }}>
                    Access Audit Guide <span>→</span>
                  </a>
                </div>

                <div className="group bg-white p-8 rounded-2xl border flex flex-col hover:shadow-md transition-all" style={{ borderColor: `${colors.sage}20` }}>
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3" style={{ color: colors.forest }}>Cash Flow Timing Model</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Learn to align your accounts receivable cycle with your accounts payable to eliminate the panic borrowing cycle.
                    </p>
                  </div>
                  <a href="#" className="font-bold flex items-center gap-2 mt-auto" style={{ color: colors.sage }}>
                    View Timing Model <span>→</span>
                  </a>
                </div>

                <div className="group bg-white p-8 rounded-2xl border flex flex-col hover:shadow-md transition-all" style={{ borderColor: `${colors.sage}20` }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: colors.forest }}>
                    <span className="text-2xl">🔓</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3" style={{ color: colors.forest }}>Debt Restructuring Kit</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Strategies for moving away from high-APR merchant advances and credit card reliance into sustainable, long-term financing.
                    </p>
                  </div>
                  <a href="#" className="font-bold flex items-center gap-2 mt-auto" style={{ color: colors.sage }}>
                    Access Resource Kit <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: colors.charcoal, color: colors.cream }} className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                  <img src="/images/oli-branch00.png" alt="Oli Logo" className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-bold text-xl">Oli-Branch</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Oli is the AI auditor that finds hidden fees and mismatched services draining your profit. Start your free audit
                to secure your financial future, registration is required to view your custom report.
              </p>
              <div className="flex space-x-4">
                <a href="mailto:contact@oli-branch.com" className="transition-colors" style={{ color: colors.sage }}>
                  contact@oli-branch.com
                </a>
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link to="/about#story" className="hover:text-white transition-colors">Our Story</Link>
                </li>
                <li>
                  <Link to="/about#values" className="hover:text-white transition-colors">Values</Link>
                </li>
              </ul>
            </div>

            {/* Connect Links */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Connect</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link to="/resources" className="hover:text-white transition-colors">Resources</Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white transition-colors">Services</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center gap-4 mt-8" aria-label="Follow Oli-Branch on social media">
            <a href="https://www.instagram.com/oli.branch/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" style={{ color: colors.sage }} aria-label="Instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/oli-branch-llc/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" style={{ color: colors.sage }} aria-label="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5C3.34 3.5 2 4.84 2 6.48s1.34 2.98 2.98 2.98 2.98-1.34 2.98-2.98S6.62 3.5 4.98 3.5zM3 9h4v12H3V9zm7 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21h-4V9z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@AdminContact-xd1xk" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" style={{ color: colors.sage }} aria-label="YouTube">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C17.5 2.5 12 2.5 12 2.5h0s-5.5 0-8.6.4c-.4.1-1.3.1-2.1 1-.6.7-.8 2.3-.8 2.3S0 8.1 0 10v1.9c0 1.9.5 3.8.5 3.8s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.3.4 7.3.4s5.5 0 8.6-.4c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s.5-1.9.5-3.8V10c0-1.9-.5-3.8-.5-3.8zM9.6 14.7V7.8l6.3 3.5-6.3 3.4z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/groups/755013229548095/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" style={{ color: colors.sage }} aria-label="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4H15.3c-1.3 0-1.7.8-1.7 1.6V12h3l-.5 3h-2.5v7A10 10 0 0022 12z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@olbrnch" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" style={{ color: colors.sage }} aria-label="TikTok">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 8.5c-1.9 0-3.7-.6-5.1-1.7v7.4a6.5 6.5 0 11-5.7-6.4v3.5a3 3 0 102.7 3V2h3.1c.4 3 2.7 5.4 5.7 5.7v.8z"/>
              </svg>
            </a>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p> &copy; 2023-2026 Oli-Branch LLC. All Rights Reserved.</p>
          </div>
        </div>
    </footer>
  </div>
);
}

export default ServicesPage;




