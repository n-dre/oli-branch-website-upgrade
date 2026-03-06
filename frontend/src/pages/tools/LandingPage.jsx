import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  // Color definitions
  const colors = {
    gold: '#D4AF37',
    forest: '#1B4332',
    sage: '#52796F',
    cream: '#F8F5F0',
    charcoal: '#2D3748'
  };

  const [showTrialModal, setShowTrialModal] = useState(false);
  const navigate = useNavigate();

  const talkToOli = () => alert("Hi! I'm Oli. How can I help you today?");

  const handleStartTrial = () => {
    setShowTrialModal(true);
  };

  const closeTrialModal = () => {
    setShowTrialModal(false);
  };

  const confirmTrialStart = () => {
    // Close the modal first
    setShowTrialModal(false);
    
    // Redirect to signup page after a brief delay for smooth transition
    setTimeout(() => {
      navigate('/signup');
    }, 100);
  };

  return (
    <div
      className="font-body min-h-screen relative"
      style={{ backgroundColor: colors.cream, color: colors.charcoal }}
    >
      <style>{`
        .hero-gradient {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
        }

        .glass-effect {
          -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
          background: rgba(248, 245, 240, 0.9);
        }

        .btn-primary {
          background-color: #1B4332;
          color: #F8F5F0;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background-color: #52796F;
          transform: translateY(-2px);
        }

        .btn-secondary {
          border: 2px solid #1B4332;
          color: #1B4332;
          background: transparent;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background-color: #1B4332;
          color: #F8F5F0;
        }

        @keyframes vibrate-glow {
          0% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 25px rgba(212, 175, 55, 0.9);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
          }
        }

        /* Modal styles */
        .modal-overlay {
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(4px);
        }

        .modal-content {
          background: #F8F5F0;
          border: 2px solid #1B4332;
          box-shadow: 0 20px 60px rgba(27, 67, 50, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .policy-content {
          max-height: 60vh;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #52796F #F8F5F0;
        }

        .policy-content::-webkit-scrollbar {
          width: 8px;
        }

        .policy-content::-webkit-scrollbar-track {
          background: #F8F5F0;
        }

        .policy-content::-webkit-scrollbar-thumb {
          background-color: #52796F;
          border-radius: 4px;
        }
      `}</style>

      {/* Trial Terms Modal */}
      {showTrialModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 modal-overlay" 
            onClick={closeTrialModal}
          />
          
          {/* Modal */}
          <div className="relative z-[101] w-full max-w-2xl modal-content rounded-2xl overflow-hidden">
            {/* Modal Header */}
            <div 
              className="px-8 py-6 text-white relative"
              style={{ backgroundColor: colors.forest }}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">7-Day Free Trial Terms</h2>
                  <p className="text-white/80">Important information about your trial</p>
                </div>
              </div>
              <button
                onClick={closeTrialModal}
                className="absolute right-6 top-6 text-white/70 hover:text-white text-2xl"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 policy-content">
              {/* Warning Section */}
              <div className="mb-8 p-4 rounded-lg border-2 border-yellow-500 bg-yellow-50">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-bold text-lg text-yellow-800 mb-2">Important Notice</h3>
                    <p className="text-yellow-700 font-medium">
                      Your free trial will automatically convert to a paid subscription after 7 days 
                      unless cancelled before the trial period ends.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trial Details */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.forest }}>
                  Trial Period Details
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>7-Day Full Access:</strong> Complete access to all Oli-Branch financial audit features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Credit card required:</strong> For trial period</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Auto-Renewal:</strong> Trial converts to paid plan ($9.99/month) after 7 days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Cancellation:</strong> Cancel anytime before trial ends to avoid charges</span>
                  </li>
                </ul>
              </div>

              {/* Oli-Branch Policies */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.forest }}>
                  Oli-Branch Service Policies
                </h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>Data Security:</strong> All financial data processed by Oli-Branch is encrypted using 
                    256-bit SSL encryption. We never store your banking credentials.
                  </p>
                  <p>
                    <strong>Privacy Commitment:</strong> Your financial information is used solely for audit purposes 
                    and is never sold or shared with third parties without explicit consent.
                  </p>
                  <p>
                    <strong>Accuracy Disclaimer:</strong> While Oli-Branch AI strives for accuracy, audit results 
                    should be verified by a qualified financial professional before making significant decisions.
                  </p>
                  <p>
                    <strong>Service Limitations:</strong> Oli-Branch is designed for business banking analysis 
                    and may not detect all types of financial mismatches or hidden fees.
                  </p>
                  <p>
                    <strong>Subscription Terms:</strong> After the trial, your subscription will renew monthly 
                    until cancelled. You can cancel anytime from your account dashboard.
                  </p>
                </div>
              </div>

              {/* Reminder Box */}
              <div className="p-4 rounded-lg border-2" style={{ borderColor: colors.sage, backgroundColor: `${colors.sage}10` }}>
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 flex-shrink-0" style={{ color: colors.sage }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium" style={{ color: colors.forest }}>
                    <strong>Reminder:</strong> You will receive email notifications 3 days and 1 day before your trial ends. 
                    No charges will be applied if you cancel before the trial period expires.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between">
              <button
                onClick={closeTrialModal}
                className="px-6 py-3 rounded-lg font-medium border-2 transition-colors"
                style={{ 
                  borderColor: colors.forest, 
                  color: colors.forest,
                  backgroundColor: 'transparent'
                }}
              >
                Cancel
              </button>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={confirmTrialStart}
                  className="px-8 py-3 rounded-lg font-medium text-white transition-all hover:shadow-lg flex items-center justify-center gap-2"
                  style={{ 
                    backgroundColor: colors.forest,
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  I Accept & Start Free Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className="fixed top-0 w-full z-50 glass-effect border-b border-opacity-20 py-4"
        style={{ borderColor: colors.sage }}
      >
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/images/oli-branch00.png"
              alt="Oli Logo"
              className="w-12 h-12 rounded-lg"
            />
            <div className="flex flex-col">
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
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/services"
              className="hover:opacity-80"
              style={{ color: colors.charcoal }}
            >
              Services
            </Link>
            <Link
              to="/resources"
              className="hover:opacity-80"
              style={{ color: colors.charcoal }}
            >
              Resources
            </Link>
            <Link
              to="/about"
              className="hover:opacity-80"
              style={{ color: colors.charcoal }}
            >
              About
            </Link>
            <Link
              to="/login"
              className="hover:opacity-80"
              style={{ color: colors.charcoal }}
            >
              Login
            </Link>
            <button
              onClick={handleStartTrial}
              className="btn-primary px-6 py-2 rounded-lg font-medium inline-flex items-center justify-center cursor-pointer"
            >
              Run an Audit
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-95"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-7xl font-bold mb-6">
            Stop the{' '}
            <span style={{ color: colors.gold }}>Leaks</span> in Your
            Business Banking.
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Oli is the financial auditor that finds the hidden fees and mismatched
            services draining your profit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleStartTrial}
              className="btn-primary px-9 py-5 rounded-lg text-lg font-medium inline-block text-center cursor-pointer hover:shadow-xl transition-shadow"
            >
              Start a Free 7-Day Trial
            </button>
            <button
              onClick={talkToOli}
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-green-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
            >
              Ask Oli a Question
            </button>
          </div>
          <p className="mt-6 text-white/70 text-sm">
            7-day trial. Credit card required. Cancel anytime before trial ends.
          </p>
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
};

export default LandingPage;