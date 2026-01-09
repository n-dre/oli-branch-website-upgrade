
 // src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#2D3748] text-[#F8F5F0] py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-[#2D3748] rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/resources/oli-branch00.png" alt="Oli Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-bold text-xl">Oli-Branch</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Oli is the AI auditor that finds hidden fees and mismatched services draining your profit. Start your free audit 
              to secure your financial future, registration is required to view your custom report.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:contact@oli-branch.com" className="text-[#52796F] hover:text-[#F8F5F0] transition-colors">
                contact@oli-branch.com
              </a>
            </div>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/about#story" className="hover:text-[#F8F5F0] transition-colors">Our Story</Link>
              </li>
              <li>
                <Link to="/about#team" className="hover:text-[#F8F5F0] transition-colors">Team</Link>
              </li>
              <li>
                <Link to="/about#values" className="hover:text-[#F8F5F0] transition-colors">Values</Link>
              </li>
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Connect</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/resources" className="hover:text-[#F8F5F0] transition-colors">Resources</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-[#F8F5F0] transition-colors">Services</Link>
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
            className="text-[#52796F] hover:text-[#F8F5F0] transition-colors"
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
            className="text-[#52796F] hover:text-[#F8F5F0] transition-colors"
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
            className="text-[#52796F] hover:text-[#F8F5F0] transition-colors"
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
            className="text-[#52796F] hover:text-[#F8F5F0] transition-colors"
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
            className="text-[#52796F] hover:text-[#F8F5F0] transition-colors"
            aria-label="Follow Oli-Branch on TikTok"
          >
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
  );
};

export default Footer;