import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // Color definitions
  const colors = {
    gold: '#D4AF37',
    forest: '#1B4332',
    sage: '#52796F',
    cream: '#F8F5F0',
    charcoal: '#2D3748'
  };

  const talkToOli = () => alert("Hi! I'm Oli. How can I help you today?");

  return (
    <div
      className="font-body min-h-screen"
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
      `}</style>

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
            <a
              href="https://financial-mismatch.preview.emergentagent.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-6 py-2 rounded-lg font-medium inline-flex items-center justify-center"
            >
              Free Demo Audit
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-95"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="font-display text-4xl md:text-7xl font-bold mb-6">
            Stop the{' '}
            <span style={{ color: colors.gold }}>Silent Leak</span> in Your
            Business Banking.
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Oli is the AI auditor that finds the hidden fees and mismatched
            services draining your profit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://financial-mismatch.preview.emergentagent.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-9 py-5 rounded-lg text-lg font-medium inline-block text-center"
            >
              Start a Free 14-Day Trial
            </a>
            <button
              onClick={talkToOli}
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-green-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all"
            >
              Ask Oli a Question
            </button>
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
