// src/pages/About.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import anime from "animejs";

const About = () => {
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditStep, setAuditStep] = useState(1);
  const [monthlyFee, setMonthlyFee] = useState("");
  const [auditResult, setAuditResult] = useState("");

  const statsAnimatedRef = useRef(false);

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
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 800,
      easing: "easeOutCubic",
      delay: anime.stagger(120),
    });

    anime({
      targets: ".stagger-children > *",
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 600,
      easing: "easeOutCubic",
      delay: anime.stagger(100),
    });
  }, []);

  useEffect(() => {
    const statNumbers = document.querySelectorAll(".stat-number");
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (statsAnimatedRef.current) {
            observer.unobserve(entry.target);
            return;
          }

          const target = Number(entry.target.dataset.target || "0");

          anime({
            targets: { value: 0 },
            value: target,
            duration: 2000,
            easing: "easeOutQuad",
            update: (anim) => {
              const v = anim.animatables[0].target.value;
              entry.target.textContent = Math.floor(v);
            },
            complete: () => {
              entry.target.textContent = String(target);
            },
          });

          observer.unobserve(entry.target);
        });

        if (entries.some((e) => e.isIntersecting)) statsAnimatedRef.current = true;
      },
      { threshold: 0.5, rootMargin: "0px 0px -100px 0px" }
    );

    statNumbers.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && showAuditModal) setShowAuditModal(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showAuditModal]);

  const talkToOli = () => {
    alert("Hi! I'm Oli. I'm currently analyzing account mismatches. How can I help you?");
  };

  const startAudit = () => {
    setShowAuditModal(true);
    setAuditProgress(0);
    setAuditStep(1);
    setAuditResult("");
    setMonthlyFee("");
  };

  const closeAudit = () => setShowAuditModal(false);

  const processAudit = () => {
    const feeValue = parseFloat(monthlyFee) || 0;
    setAuditProgress(100);

    setTimeout(() => {
      setAuditStep(2);

      if (feeValue > 100) {
        setAuditResult(
          `We found potential savings of $${(feeValue * 0.3).toFixed(2)} per month. That's $${(
            feeValue * 0.3 * 12
          ).toFixed(2)} per year you could be saving!`
        );
      } else if (feeValue > 50) {
        setAuditResult(
          `We identified $${(feeValue * 0.2).toFixed(
            2
          )} in potentially unnecessary fees each month. Let's help you optimize!`
        );
      } else {
        setAuditResult(
          `Your fees look reasonable, but we can still help you find better banking options that match your business needs.`
        );
      }
    }, 1000);
  };

  return (
    <div style={{ background: colors.cream, color: colors.charcoal }}>
      {/* Custom Styles */}
      <style>{`
        .hero-gradient { background: linear-gradient(135deg, #1B4332 0%, #52796F 100%); }
        .glass-effect { backdrop-filter: blur(10px); background: rgba(248, 245, 240, 0.9); }

        .btn-primary { background: #1B4332; color: #F8F5F0; transition: all 0.3s ease; }
        .btn-primary:hover { background: #52796F; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3); }

        .btn-secondary { border: 2px solid #F8F5F0; color: #F8F5F0; background: transparent; transition: all 0.3s ease; }
        .btn-secondary:hover { background: #F8F5F0; color: #1B4332; }

        .btn-secondary-dark { border: 2px solid #1B4332; color: #1B4332; background: transparent; transition: all 0.3s ease; }
        .btn-secondary-dark:hover { background: #1B4332; color: #F8F5F0; }

        .fade-in-up { opacity: 0; transform: translateY(24px); }
        .stagger-children > * { opacity: 0; transform: translateY(24px); }

        .modal { 
          display: flex; position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 1000; align-items: center; justify-content: center;
          padding: 24px;
        }
        .modal-content { 
          background: white; border-radius: 12px; padding: 2.5rem;
          max-width: 600px; width: 100%; max-height: 90vh;
          overflow-y: auto; position: relative;
        }

        .progress-bar { width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
        .progress-fill { height: 100%; background: #D4AF37; transition: width 0.4s ease; }

        .form-input { width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 16px; transition: all 0.3s ease; }
        .form-input:focus { outline: none; border-color: #52796F; box-shadow: 0 0 0 3px rgba(82, 121, 111, 0.1); }

        #oli-chat-trigger {
          position: fixed; bottom: 20px; right: 20px;
          cursor: pointer; z-index: 1000;
          width: 60px; height: 60px; border-radius: 50%;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.7);
          animation: vibrate-glow 2s infinite ease-in-out;
          display: flex; align-items: center; justify-content: center;
        }
        .oli-avatar-img {
          width: 100%; height: 100%;
          border-radius: 50%;
          border: 2px solid #D4AF37;
        }
        @keyframes vibrate-glow {
          0% { transform: scale(1); box-shadow: 0 0 10px rgba(212, 175, 55, 0.6); }
          50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(212, 175, 55, 0.9), 0 0 40px rgba(212, 175, 55, 0.4); }
          100% { transform: scale(1); box-shadow: 0 0 10px rgba(212, 175, 55, 0.6); }
        }

        .team-card { transition: all 0.3s ease; }
        .team-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1); }

        .value-card { transition: all 0.3s ease; border: 1px solid rgba(82, 121, 111, 0.1); }
        .value-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1); }

        .timeline-item { transition: all 0.3s ease; }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-opacity-20" style={{ borderColor: colors.sage }}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 rounded-lg overflow-hidden" style={{ backgroundColor: colors.cream }}>
                <img src="/resources/oli-branch00.png" alt="Oli Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-bold text-xl" style={{ color: colors.forest }}>Oli-Branch</span>
                <span className="text-[10px] uppercase tracking-widest italic">
                  Powered by AI
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/services" className="hover:opacity-80" style={{ color: colors.charcoal }}>Services</Link>
              <Link to="/resources" className="hover:opacity-80" style={{ color: colors.charcoal }}>Resources</Link>
              <Link to="/about" className="hover:opacity-80" style={{ color: colors.charcoal }}>About</Link>
              <Link to="/login" className="hover:opacity-80" style={{ color: colors.charcoal }}>Login</Link>
              <button type="button" onClick={startAudit} className="btn-primary px-6 py-2 rounded-lg font-medium">
                Free Audit
              </button>
            </div>

            <button type="button" className="md:hidden" aria-label="Open menu" style={{ color: colors.forest }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-95 z-10"></div>
        <div className="relative z-20 max-w-6xl mx-auto px-6 text-center" style={{ color: colors.cream }}>
          <div className="fade-in-up">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              <span style={{ color: colors.gold }}>Empowering</span>{" "}
              <span>Small Businesses to Thrive.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              At Oli-Branch, we believe that small businesses are the backbone of our economy. 
              Our mission is to break down financial barriers and provide every entrepreneur 
              with the tools and knowledge they need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/signup"
                className="px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-all"
                style={{ backgroundColor: colors.gold, color: colors.forest }}
              >
                Start Your Journey
              </Link>
              <a href="#story" className="btn-secondary px-8 py-4 rounded-lg text-lg font-semibold">
                Our Story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="story" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6" style={{ color: colors.forest }}>
              Our Mission & Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leveling the financial playing field with intelligence and integrity
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in-up">
              <h3 className="font-display text-3xl font-bold mb-6" style={{ color: colors.forest }}>Our Mission</h3>
              <p className="text-lg text-gray-700 mb-6">
                At Oli-Branch, we are on a mission to democratize high-level financial auditing. For too long, small businesses have been left to navigate complex banking fees, mismatched service tiers, and hidden costs alone. 
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We bridge this gap by providing automated, AI-driven auditing that acts as a 24/7 financial guardian. We are here to ensure that every entrepreneur—regardless of their size—has the tools to identify every <strong>mismatch</strong> and reclaim capital that should be reinvested into their team and community.
              </p>
            </div>
            
            <div className="fade-in-up">
              <h3 className="font-display text-3xl font-bold mb-6" style={{ color: colors.forest }}>Our Vision</h3>
              <p className="text-lg text-gray-700 mb-6">
                We envision a world where financial success is governed by the strength of a business owner's vision, not their ability to decode a 40-page bank statement or spot a service <strong>mismatch</strong>.
              </p>
              <p className="text-lg text-gray-700">
                By scaling Oli into a universal "Financial Translator," we are building a future where small businesses have the same negotiation power as Fortune 500 companies. We see a global economy where no business is held back by outdated financial structures or mismatched resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20" style={{ backgroundColor: colors.cream }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl font-bold mb-4" style={{ color: colors.forest }}>Our Commitment</h2>
          <p className="text-xl text-gray-600 mb-16">The change we are working to create every day.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 bg-white rounded-2xl shadow-sm border" style={{ borderColor: `${colors.sage}20` }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${colors.sage}20` }}>
                <span className="text-2xl">🛡️</span>
              </div>
              <h4 className="font-bold text-xl mb-4" style={{ color: colors.forest }}>Zero Hidden Fees</h4>
              <p className="text-gray-600">Our primary metric of success is the amount of capital we help small businesses "claw back" from unnecessary bank charges.</p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-sm border" style={{ borderColor: `${colors.sage}20` }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${colors.sage}20` }}>
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="font-bold text-xl mb-4" style={{ color: colors.forest }}>Informed Growth</h4>
              <p className="text-gray-600">We aim to increase the financial literacy of our users so they can secure funding with confidence and clarity.</p>
            </div>

            <div className="p-8 bg-white rounded-2xl shadow-sm border" style={{ borderColor: `${colors.sage}20` }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${colors.sage}20` }}>
                <span className="text-2xl">🤝</span>
              </div>
              <h4 className="font-bold text-xl mb-4" style={{ color: colors.forest }}>Radical Integrity</h4>
              <p className="text-gray-600">We never take kickbacks from banks. Our impact is measured by the trust our community places in our independent data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section id="team" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-display text-4xl font-bold mb-6" style={{ color: colors.forest }}>
              Leadership Team
            </h2>
            <p className="text-xl text-gray-600">
              Experienced professionals dedicated to small business success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {/* Team Member 1 */}
            <div className="team-card bg-white p-8 rounded-xl text-center shadow-sm">
              <img src="/resources/image0 (11).jpeg" alt="Andre Petion" className="w-32 h-32 rounded-full mx-auto mb-6 object-cover" />
              <h3 className="text-2xl font-bold mb-2" style={{ color: colors.forest }}>Andre Petion</h3>
              <p className="font-medium mb-4" style={{ color: colors.sage }}>Founder & CEO</p>
              <p className="text-gray-600 mb-6">
                Andre founded Oli-Branch to end the "Silent Leak" of small business capital. Driven by a mission to democratize elite financial tools, he leverages AI to help entrepreneurs identify service mismatches and reclaim their profit.
              </p>
              <div className="flex justify-center space-x-4">
                <a href="https://www.linkedin.com/in/andre-g-petion-jr-mba/" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: colors.sage }}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://github.com/n-dre?tab=stars" target="_blank" rel="noopener noreferrer" className="transition-colors" style={{ color: colors.sage }} aria-label="GitHub">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385 0.6 0.113 0.82-0.258 0.82-0.577 0-0.285-0.01-1.04-0.015-2.04 -3.338 0.724-4.042-1.61-4.042-1.61 -0.546-1.387-1.333-1.757-1.333-1.757 -1.09-0.745 0.083-0.729 0.083-0.729 1.205 0.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495 0.998 0.108-0.776 0.418-1.305 0.76-1.605 -2.665-0.3-5.466-1.332-5.466-5.93 0-1.31 0.47-2.38 1.235-3.22 -0.135-0.303-0.54-1.523 0.105-3.176 0 0 1.005-0.322 3.3 1.23 0.96-0.267 1.98-0.399 3-0.405 1.02 0.006 2.04 0.138 3 0.405 2.28-1.552 3.285-1.23 3.285-1.23 0.645 1.653 0.24 2.873 0.12 3.176 0.765 0.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92 0.42 0.36 0.81 1.096 0.81 2.22 0 1.606-0.015 2.896-0.015 3.286 0 0.315 0.21 0.69 0.825 0.57 C20.565 22.092 24 17.592 24 12.297 c0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section id="values" className="py-20" style={{ backgroundColor: colors.cream }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-display text-4xl font-bold mb-6" style={{ color: colors.forest }}>
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            <div className="value-card bg-white p-8 rounded-xl">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${colors.sage}20` }}>
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: colors.forest }}>Trust & Transparency</h3>
              <p className="text-gray-600">
                Oli-Branch LLC currently holds a Medium Risk status with a 70/100 Financial Mismatch Score, identifying that your heavy reliance on cash deposits and a need for grant navigation are causing roughly $35 in monthly fee leakage.
              </p>
            </div>
            
            <div className="value-card bg-white p-8 rounded-xl">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${colors.sage}20` }}>
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: colors.forest }}>Innovation</h3>
              <p className="text-gray-600">
                We're constantly pushing the boundaries of what's possible with AI and financial technology 
                to create better solutions for small businesses.
              </p>
            </div>
            
            <div className="value-card bg-white p-8 rounded-xl">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${colors.sage}20` }}>
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: colors.forest }}>Customer-First</h3>
              <p className="text-gray-600">
                Every decision we make is guided by what's best for our customers. Your success is our 
                primary measure of achievement.
              </p>
            </div>
            
            <div className="value-card bg-white p-8 rounded-xl">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${colors.sage}20` }}>
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: colors.forest }}>Inclusivity</h3>
              <p className="text-gray-600">
                We believe financial empowerment should be accessible to everyone, regardless of background, 
                location, or business size.
              </p>
            </div>
            
            <div className="value-card bg-white p-8 rounded-xl">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${colors.sage}20` }}>
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: colors.forest }}>Continuous Learning</h3>
              <p className="text-gray-600">
                We're committed to ongoing education and improvement, both for ourselves and for the 
                small business community we serve.
              </p>
            </div>
            
            <div className="value-card bg-white p-8 rounded-xl">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: `${colors.sage}20` }}>
                <span className="text-3xl">💪</span>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: colors.forest }}>Empowerment</h3>
              <p className="text-gray-600">
                We provide tools and knowledge that enable small business owners to take control of 
                their financial future with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-display text-4xl font-bold mb-6" style={{ color: colors.forest }}>
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Early-stage milestones as we build a system to fix the small-business banking mismatch.
            </p>
          </div>

          <div className="space-y-12">
            {/* Founded */}
            <div className="timeline-item fade-in-up">
              <div className="bg-white p-6 rounded-xl border-l-4" style={{ borderColor: colors.sage }}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-xl font-semibold" style={{ color: colors.forest }}>Oli-Branch Founded</h3>
                  <span className="font-medium" style={{ color: colors.sage }}>June 2023</span>
                </div>
                <p className="text-gray-600">
                  Founded by Andre Petion to address a consistent problem: small businesses are placed into banking products
                  that don't match how they operate—leading to avoidable fees, constraints, and financing friction.
                </p>
              </div>
            </div>

            {/* Research + Framework */}
            <div className="timeline-item fade-in-up">
              <div className="bg-white p-6 rounded-xl border-l-4" style={{ borderColor: colors.sage }}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-xl font-semibold" style={{ color: colors.forest }}>Mismatch Framework Built</h3>
                  <span className="font-medium" style={{ color: colors.sage }}>2023–2024</span>
                </div>
                <p className="text-gray-600">
                  Built the core framework for identifying mismatch signals (fee leakage, deposit limits, transaction behavior,
                  cash-flow timing) and translating them into practical recommendations.
                </p>
              </div>
            </div>

            {/* Prototype */}
            <div className="timeline-item fade-in-up">
              <div className="bg-white p-6 rounded-xl border-l-4" style={{ borderColor: colors.sage }}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-xl font-semibold" style={{ color: colors.forest }}>Prototype Development</h3>
                  <span className="font-medium" style={{ color: colors.sage }}>2024</span>
                </div>
                <p className="text-gray-600">
                  Began building the early product experience: a guided health check, a fee audit workflow, and a resource hub
                  designed to reduce avoidable costs and improve banking fit.
                </p>
              </div>
            </div>

            {/* Pilots */}
            <div className="timeline-item fade-in-up">
              <div className="bg-white p-6 rounded-xl border-l-4" style={{ borderColor: colors.sage }}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-xl font-semibold" style={{ color: colors.forest }}>Pilot & Partner Outreach</h3>
                  <span className="font-medium" style={{ color: colors.sage }}>2025–Present</span>
                </div>
                <p className="text-gray-600">
                  Preparing for pilots with small-business cohorts and exploring partnerships with banks, credit unions,
                  and community organizations to validate outcomes and scale responsibly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Mission */}
      <section id="partners" className="py-20" style={{ backgroundColor: colors.forest, color: colors.cream }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Oli-Branch fixes the mismatch between small businesses and banking. We're looking for early investors
              and forward-thinking banks to help scale a solution that reduces fee leakage and improves account fit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Early Investors */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Early Investors</h3>
              <p className="opacity-90 mb-4">
                Back the build. Help complete the final product layer that turns mismatch signals into clear actions.
              </p>
              <ul className="space-y-2 text-sm opacity-80">
                <li>• Product completion + validation</li>
                <li>• Data partnerships + research</li>
                <li>• Pilot rollout to SMB cohorts</li>
              </ul>
              <a
                href="mailto:contact@oli-branch.com?subject=Pilot%20Sponsorship%20Inquiry&body=Hello%20Oli-Branch%20Team,%0D%0A%0D%0AWe%20are%20interested%20in%20sponsoring%20a%20pilot%20program.%20Please%20share%20details%20on%20scope,%20timeline,%20and%20expected%20outcomes.%0D%0A%0D%0AOrganization:%0D%0AContact%20Name:%0D%0AEmail:%0D%0A"
                className="btn-primary mt-6 inline-block px-6 py-3 rounded-lg text-center"
              >
                Request Investor Brief
              </a>
            </div>

            {/* Banks & Credit Unions */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Banks & Credit Unions</h3>
              <p className="opacity-90 mb-4">
                Partner to reach qualified small businesses with better-fit accounts—based on real usage patterns, not guesswork.
              </p>
              <ul className="space-y-2 text-sm opacity-80">
                <li>• Referral-ready matching pipeline</li>
                <li>• Lower churn from better account fit</li>
                <li>• Transparent product education</li>
              </ul>
              <a
                href="mailto:contact@oli-branch.com?subject=Pilot%20Sponsorship%20Inquiry&body=Hello%20Oli-Branch%20Team,%0D%0A%0D%0AWe%20are%20interested%20in%20sponsoring%20a%20pilot%20program.%20Please%20share%20details%20on%20scope,%20timeline,%20and%20expected%20outcomes.%0D%0A%0D%0AOrganization:%0D%0AContact%20Name:%0D%0AEmail:%0D%0A"
                className="btn-primary mt-6 inline-block px-6 py-3 rounded-lg text-center"
              >
                Become a Partner
              </a>
            </div>

            {/* Pilot Sponsors */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Pilot Sponsors</h3>
              <p className="opacity-90 mb-4">
                Fund targeted pilots with measurable outcomes: fewer avoidable fees, clearer readiness, and smarter banking decisions.
              </p>
              <ul className="space-y-2 text-sm opacity-80">
                <li>• Cohort-based reporting</li>
                <li>• Measurable savings + outcomes</li>
                <li>• Community and nonprofit channels</li>
              </ul>
              <a
                href="mailto:contact@oli-branch.com?subject=Pilot%20Sponsorship%20Inquiry&body=Hello%20Oli-Branch%20Team,%0D%0A%0D%0AWe%20are%20interested%20in%20sponsoring%20a%20pilot%20program.%20Please%20share%20details%20on%20scope,%20timeline,%20and%20expected%20outcomes.%0D%0A%0D%0AOrganization:%0D%0AContact%20Name:%0D%0AEmail:%0D%0A"
                className="btn-primary mt-6 inline-block px-6 py-3 rounded-lg text-center"
              >
                Sponsor a Pilot
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="fade-in-up">
            <h2 className="font-display text-4xl font-bold mb-6" style={{ color: colors.forest }}>
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Have questions about Oli-Branch? We'd love to hear from you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="p-8 rounded-xl" style={{ backgroundColor: `${colors.sage}10` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${colors.sage}20` }}>
                  <svg className="w-8 h-8" fill="none" stroke={colors.sage} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.forest }}>Email Us</h3>
                <p className="text-gray-600 mb-4">For general inquiries and support</p>
                <a href="mailto:contact@oli-branch.com" className="font-medium transition-colors" style={{ color: colors.sage }}>
                  contact@oli-branch.com
                </a>
              </div>
              
              <div className="p-8 rounded-xl" style={{ backgroundColor: `${colors.sage}10` }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${colors.sage}20` }}>
                  <svg className="w-8 h-8" fill="none" stroke={colors.sage} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: colors.forest }}>Call Us</h3>
                <p className="text-gray-600 mb-4">Speak with our team directly</p>
                <a href="tel:857-999-8059" className="font-medium transition-colors" style={{ color: colors.sage }}>
                  (857) 999-8059
                </a>
              </div>
            </div>
          </div>
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
                  <img src="/resources/oli-branch00.png" alt="Oli Logo" className="w-full h-full object-cover" />
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
                  <Link to="/about#team" className="hover:text-white transition-colors">Team</Link>
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
            <p>Copyright &copy; 2023-2026 Oli-Branch LLC. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Audit Modal */}
      {showAuditModal && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={closeAudit} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl">
              &times;
            </button>
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src="/resources/oli-branch-1 (9).png" alt="Oli" className="w-12 h-12 rounded-full" style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: colors.gold }} />
                <h3 className="font-display text-2xl font-bold" style={{ color: colors.forest }}>Oli Financial Audit</h3>
              </div>
              
              <div className="progress-bar mb-8">
                <div className="progress-fill" style={{ width: `${auditProgress}%` }}></div>
              </div>

              {auditStep === 1 ? (
                <div>
                  <label className="block text-sm font-semibold mb-2">What are your average monthly banking fees?</label>
                  <input 
                    type="number" 
                    value={monthlyFee}
                    onChange={(e) => setMonthlyFee(e.target.value)}
                    placeholder="$0.00" 
                    className="form-input mb-6" 
                  />
                  <button onClick={processAudit} className="btn-primary w-full py-4 rounded-lg font-bold">Analyze My Fees</button>
                </div>
              ) : (
                <div className="text-center">
                  <h4 className="text-xl font-bold mb-2" style={{ color: colors.forest }}>Audit Complete</h4>
                  <p className="text-gray-700 mb-6">{auditResult}</p>
                  <button onClick={closeAudit} className="btn-secondary-dark w-full py-3 rounded-lg">Get Full Report</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Button */}
      <div id="oli-chat-trigger" onClick={talkToOli} title="Talk to Oli AI">
        <img src="/resources/Gemini_Generated_Image_qt3fakqt3fakqt3f.png" alt="Oli AI Avatar" className="oli-avatar-img shadow-2xl" />
      </div>
    </div>
  );
};

export default About;
