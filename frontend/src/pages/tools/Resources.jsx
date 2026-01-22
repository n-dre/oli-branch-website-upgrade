import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import anime from "animejs";

const ResourcesPage = () => {
  // Color definitions
  const colors = {
    gold: '#D4AF37',
    forest: '#1B4332',
    sage: '#52796F',
    cream: '#F8F5F0',
    charcoal: '#2D3748'
  };

  useEffect(() => {
    // Initial Fade In Up Animation
    anime({
      targets: '.fade-in-up',
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 1000,
      easing: 'easeOutExpo',
      delay: anime.stagger(200)
    });

    // Stagger children animation
    anime({
      targets: '.stagger-children > *',
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 800,
      easing: 'easeOutQuad',
      delay: anime.stagger(100)
    });
  }, []);

  const talkToOli = () => {
    alert("Hi! I'm Oli. I'm currently analyzing account mismatches. How can I help you?");
  };

  return (
    <div className="font-body" style={{ backgroundColor: colors.cream, color: colors.charcoal }}>
      {/* PRESERVED CUSTOM STYLES */}
      <style>{`
        .glass-effect { backdrop-filter: blur(10px); background: rgba(248, 245, 240, 0.9); }
        .btn-primary { background: #1B4332; color: #F8F5F0; transition: all 0.3s ease; }
        .btn-primary:hover { background: #52796F; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3); }
        .btn-secondary { border: 2px solid #1B4332; color: #1B4332; background: transparent; transition: all 0.3s ease; }
        .btn-secondary:hover { background: #1B4332; color: #F8F5F0; }
        .resource-card { transition: all 0.3s ease; border: 1px solid rgba(82, 121, 111, 0.1); }
        .resource-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1); }
        .progress-ring { transform: rotate(-90deg); }
        .progress-ring-circle { transition: stroke-dashoffset 0.35s; transform-origin: 50% 50%; }
        
        #oli-chat-trigger {
            position: fixed; bottom: 20px; right: 20px; cursor: pointer; z-index: 1000;
            width: 60px; height: 60px; border-radius: 50%;
            box-shadow: 0 0 15px rgba(212, 175, 55, 0.7);
            animation: vibrate-glow 2s infinite ease-in-out;
            display: flex; align-items: center; justify-content: center;
        }
        .oli-avatar-img { width: 100%; height: 100%; border-radius: 50%; border: 2px solid #D4AF37; }
        
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
              <Link to="/" className="hover:opacity-70 transition-colors" style={{ color: colors.charcoal }}>Home</Link>
              <Link to="/services" className="hover:opacity-70 transition-colors" style={{ color: colors.charcoal }}>Services</Link>
              <Link to="/about" className="hover:opacity-70 transition-colors" style={{ color: colors.charcoal }}>About</Link>
              <Link to="/login" className="hover:opacity-70 transition-colors" style={{ color: colors.charcoal }}>Login</Link>
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
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16" style={{ backgroundColor: colors.forest, color: colors.cream }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="fade-in-up">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              <span style={{ color: colors.gold }}>Financial Resources & Education</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Everything you need to build financial literacy and grow your business with confidence
            </p>
          </div>
        </div>
      </section>

      {/* Financial Health Score Section */}
      <section className="py-12" style={{ backgroundColor: colors.cream }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Financial Health Score Card */}
            <div className="bg-white p-6 rounded-xl border text-center shadow-sm">
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.forest }}>Financial Health Score</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="progress-ring w-32 h-32">
                  <circle 
                    className="progress-ring-circle" 
                    stroke="#e2e8f0" 
                    strokeWidth="8" 
                    fill="transparent" 
                    r="56" 
                    cx="64" 
                    cy="64"
                  />
                  <circle 
                    className="progress-ring-circle" 
                    stroke={colors.sage} 
                    strokeWidth="8" 
                    fill="transparent" 
                    r="56" 
                    cx="64" 
                    cy="64" 
                    strokeDasharray="351.86" 
                    strokeDashoffset="210"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: colors.forest }}>50%</span>
                </div>
              </div>
              <p className="text-gray-600 mb-4">Mismatched Fee Detected</p>
              <div className="text-sm font-medium" style={{ color: colors.sage }}>Potential savings: See recommendations.</div>
            </div>

            {/* Funding Status Card */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-xl font-bold mb-4" style={{ color: colors.forest }}>Funding Status</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: colors.gold }}
                  >
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-sm">Bank Fee Review Done</span>
                </div>
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: colors.sage }}
                  >
                    <span className="text-white text-sm">!</span>
                  </div>
                  <span className="text-sm">Gov. Resource Match</span>
                </div>
                <div className="flex items-center opacity-50">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🎯</span>
                  </div>
                  <span className="text-sm">Goal Setter (locked)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4" style={{ color: colors.forest }}>
              Tools to Fix Your Banking Mismatch
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to understand your fees, assess account fit, and choose better banking options.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 justify-items-center">
            {/* Mismatch Guide */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-full">
              <h3 className="text-xl font-semibold mb-3" style={{ color: colors.forest }}>Bank Fee Mismatch Guide</h3>
              <p className="text-gray-600 mb-4">
                Understand when your bank is charging fees that don't match your business size, activity,
                or account tier—and what to do next.
              </p>
              <Link
                to="/login"
                className="btn-primary w-full py-3 rounded-lg inline-block text-center"
              >
                View Schedule
              </Link>
            </div>

            {/* Accounting Basics */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm w-full">
              <h3 className="text-xl font-semibold mb-3" style={{ color: colors.forest }}>Understanding Bank Fees</h3>
              <p className="text-gray-600 mb-4">
                A simple course on how banks calculate fees—and how to spot charges that shouldn't be there.
              </p>
              <Link
                to="/login"
                className="btn-primary w-full py-3 rounded-lg inline-block text-center"
              >
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Support */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-display text-4xl font-bold mb-6" style={{ color: colors.forest }}>
              Community & Expert Support
            </h2>
            <p className="text-xl text-gray-600">
              Connect with other entrepreneurs and get expert guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {/* Community Forum Card */}
            <div className="resource-card bg-white p-8 rounded-xl text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: `${colors.sage}20` }}
              >
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: colors.forest }}>Community Forum</h3>
              <p className="text-gray-600 mb-6">
                Connect with thousands of small business owners, share experiences, and get peer support.
              </p>
              <a
                href="https://www.facebook.com/groups/755013229548095/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full py-3 rounded-lg inline-block text-center"
              >
                Join Community
              </a>
            </div>

            {/* Live Workshops Card */}
            <div className="resource-card bg-white p-8 rounded-xl text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: '#FED7D720' }}
              >
                <span className="text-3xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: colors.forest }}>Live Workshops</h3>
              <p className="text-gray-600 mb-6">
                Attend regular workshops on topics like funding, marketing, and financial planning.
              </p>
              <Link
                to="/login"
                className="btn-secondary w-full py-3 rounded-lg inline-block text-center"
              >
                View Schedule
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ backgroundColor: colors.forest, color: colors.cream }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="fade-in-up">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Start Your <span style={{ color: colors.gold }}>Financial Education</span> Journey
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of entrepreneurs building their financial knowledge and business success
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup"
                className="px-8 py-4 rounded-lg text-lg font-bold hover:opacity-90 transition-all text-center"
                style={{ backgroundColor: colors.gold, color: colors.forest }}
              >
                Start a Free 14-Day Trial
              </Link>
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
            {/* Instagram */}
            <a 
              href="https://www.instagram.com/oli.branch/"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: colors.sage }}
              aria-label="Follow Oli-Branch on Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.5-.9a1.1 1.1 0 11-2.2 0 1.1 1.1 0 012.2 0z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/company/oli-branch-llc/?viewAsMember=true"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: colors.sage }}
              aria-label="Follow Oli-Branch on LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5C3.34 3.5 2 4.84 2 6.48s1.34 2.98 2.98 2.98 2.98-1.34 2.98-2.98S6.62 3.5 4.98 3.5zM3 9h4v12H3V9zm7 0h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21h-4V9z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a 
              href="https://www.youtube.com/@AdminContact-xd1xk"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: colors.sage }}
              aria-label="Subscribe to Oli-Branch on YouTube"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C17.5 2.5 12 2.5 12 2.5h0s-5.5 0-8.6.4c-.4.1-1.3.1-2.1 1-.6.7-.8 2.3-.8 2.3S0 8.1 0 10v1.9c0 1.9.5 3.8.5 3.8s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.7.2 7.3.4 7.3.4s5.5 0 8.6-.4c.4-.1 1.3-.1 2.1-1 .6-.7.8-2.3.8-2.3s.5-1.9.5-3.8V10c0-1.9-.5-3.8-.5-3.8zM9.6 14.7V7.8l6.3 3.5-6.3 3.4z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a 
              href="https://www.facebook.com/groups/755013229548095/"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: colors.sage }}
              aria-label="Follow Oli-Branch on Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4H15.3c-1.3 0-1.7.8-1.7 1.6V12h3l-.5 3h-2.5v7A10 10 0 0022 12z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a 
              href="https://www.tiktok.com/@olbrnch"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              style={{ color: colors.sage }}
              aria-label="Follow Oli-Branch on TikTok"
            >
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

      {/* Floating AI Button */}
      <div id="oli-chat-trigger" onClick={talkToOli} title="Talk to Oli AI">
        <img src="/images/Gemini_Generated_Image_qt3fakqt3fakqt3f.png" alt="Oli Avatar" className="oli-avatar-img shadow-2xl" />
      </div>
    </div>
  );
};

export default ResourcesPage;