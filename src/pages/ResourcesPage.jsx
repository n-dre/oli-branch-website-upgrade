import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';

const ResourcesPage = () => {
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
    <div className="font-body bg-cream text-charcoal">
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
            box-shadow: 0 0 15px rgba(255, 215, 0, 0.7);
            animation: vibrate-glow 2s infinite ease-in-out;
            display: flex; align-items: center; justify-content: center;
        }
        .oli-avatar-img { width: 100%; height: 100%; border-radius: 50%; border: 2px solid #FFD700; }
        
        @keyframes vibrate-glow {
            0% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.6); }
            50% { transform: scale(1.05); box-shadow: 0 0 25px rgba(255, 215, 0, 0.9), 0 0 40px rgba(255, 215, 0, 0.4); }
            100% { transform: scale(1); box-shadow: 0 0 10px rgba(255, 215, 0, 0.6); }
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect border-b border-sage/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-cream rounded-lg overflow-hidden">
                <img src="/resources/oli-branch00.png" alt="Oli Logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-xl text-forest">Oli-Branch</span>
                <span className="text-[10px] font-medium text-charcoal tracking-wide uppercase">Powered by AI</span>
              </div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-charcoal hover:text-sage transition-colors">Home</Link>
              <Link to="/services" className="text-charcoal hover:text-sage transition-colors">Services</Link>
              <Link to="/about" className="text-charcoal hover:text-sage transition-colors">About</Link>
              <Link to="/login" className="text-charcoal hover:text-sage transition-colors">Login</Link>
              <a href="https://smartmatch-6.preview.emergentagent.com/" target="_blank" rel="noopener noreferrer"
                 className="btn-primary px-6 py-2 rounded-lg font-medium inline-flex items-center justify-center">
                Free Audit
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#1B4332] text-[#F8F5F0]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="fade-in-up">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
              <span className="text-[#D4AF37]">Financial Resources & Education</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Everything you need to build financial literacy and grow your business with confidence
            </p>
          </div>
        </div>
      </section>

      {/* Health Score Section */}
      <section className="py-12 px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-6 rounded-xl border text-center shadow-sm">
            <h3 className="text-xl font-bold text-[#1B4332] mb-4">Financial Health Score</h3>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="progress-ring w-32 h-32">
                <circle className="progress-ring-circle" stroke="#e2e8f0" strokeWidth="8" fill="transparent" r="56" cx="64" cy="64" />
                <circle className="progress-ring-circle" stroke="#52796F" strokeWidth="8" fill="transparent" r="56" cx="64" cy="64" strokeDasharray="351.86" strokeDashoffset="175" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-[#1B4332]">50%</span>
              </div>
            </div>
            <p className="text-gray-600 mb-4">Mismatched Fees Detected</p>
            <div className="text-sm text-[#52796F] font-medium">Potential savings: See recommendations.</div>
          </div>

          <div className="bg-white p-6 rounded-xl border mt-6 shadow-sm">
            <h3 className="text-xl font-bold text-[#1B4332] mb-4">Funding Status</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center mr-3 text-white text-sm">✓</div>
                <span className="text-sm">Bank Fee Review Done</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#52796F] rounded-full flex items-center justify-center mr-3 text-white text-sm">!</div>
                <span className="text-sm">Gov. Resource Match</span>
              </div>
              <div className="flex items-center opacity-50">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3 text-white text-sm">🎯</div>
                <span className="text-sm">Goal Setter (locked)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-display text-4xl font-bold text-[#1B4332] mb-4">Tools to Fix Your Banking Mismatch</h2>
            <p className="text-xl text-gray-600">Everything you need to understand your fees, assess account fit, and choose better banking options.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm resource-card">
              <h3 className="text-xl font-semibold text-[#1B4332] mb-3">Bank Fee Mismatch Guide</h3>
              <p className="text-gray-600 mb-6">Understand when your bank is charging fees that don’t match your business size or account tier.</p>
              <Link to="/login" className="btn-primary w-full py-3 rounded-lg inline-block text-center font-medium">View Schedule</Link>
            </div>

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm resource-card">
              <h3 className="text-xl font-semibold text-[#1B4332] mb-3">Understanding Bank Fees</h3>
              <p className="text-gray-600 mb-6">A simple course on how banks calculate fees—and how to spot charges that shouldn’t be there.</p>
              <Link to="/login" className="btn-primary w-full py-3 rounded-lg inline-block text-center font-medium">Start Learning</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-[#F8F5F0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-[#1B4332] mb-6">Community & Expert Support</h2>
            <p className="text-xl text-gray-600">Connect with other entrepreneurs and get expert guidance</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="resource-card bg-white p-8 rounded-xl text-center shadow-sm">
              <div className="w-16 h-16 bg-[#52796F]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">👥</div>
              <h3 className="text-xl font-semibold text-[#1B4332] mb-4">Community Forum</h3>
              <p className="text-gray-600 mb-6">Connect with thousands of small business owners and share experiences.</p>
              <a href="https://www.facebook.com/groups/755013229548095/" target="_blank" rel="noopener noreferrer" className="btn-secondary w-full py-3 rounded-lg inline-block">Join Community</a>
            </div>

            <div className="resource-card bg-white p-8 rounded-xl text-center shadow-sm">
              <div className="w-16 h-16 bg-[#FF6B6B]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">📅</div>
              <h3 className="text-xl font-semibold text-[#1B4332] mb-4">Live Workshops</h3>
              <p className="text-gray-600 mb-6">Attend regular workshops on topics like funding and financial planning.</p>
              <Link to="/login" className="btn-secondary w-full py-3 rounded-lg inline-block">View Schedule</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D3748] text-[#F8F5F0] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/resources/oli-branch00.png" alt="Oli Logo" className="w-10 h-10 object-cover rounded" />
                <span className="font-display font-bold text-xl">Oli-Branch</span>
              </div>
              <p className="text-gray-300 max-w-md">Oli is the AI auditor that finds hidden fees draining your profit. Start your free audit to secure your financial future.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/about" className="hover:text-white">Our Story</Link></li>
                <li><Link to="/about" className="hover:text-white">Team</Link></li>
                <li><Link to="/about" className="hover:text-white">Values</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Connect</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/resources" className="hover:text-white">Resources</Link></li>
                <li><Link to="/services" className="hover:text-white">Services</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>© 2023–2026 Oli-Branch LLC. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating AI Button */}
      <div id="oli-chat-trigger" onClick={talkToOli} title="Talk to Oli AI">
        <img src="/resources/Gemini_Generated_Image_qt3fakqt3fakqt3f.png" alt="Oli AI Avatar" className="oli-avatar-img shadow-2xl" />
      </div>
    </div>
  );
};

export default ResourcesPage;