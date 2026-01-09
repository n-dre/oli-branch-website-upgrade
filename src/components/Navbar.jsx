// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-[#F8F5F0] rounded-lg overflow-hidden">
            <img src="/resources/oli-branch00.png" alt="Oli Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display font-bold text-xl text-[#1B4332]">
              Oli-Branch
            </span>
            <span className="text-[10px] font-medium text-[#2D3748] tracking-widest">
              Powered by AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/services" className="text-[#2D3748] hover:text-[#52796F] transition-colors">
            Services
          </Link>
          <Link to="/resources" className="text-[#2D3748] hover:text-[#52796F] transition-colors">
            Resources
          </Link>
          <Link to="/about" className="text-[#2D3748] hover:text-[#52796F] transition-colors">
            About
          </Link>
          <Link to="/login" className="text-[#2D3748] hover:text-[#52796F] transition-colors">
            Login
          </Link>
          <a 
            href="https://smartmatch-6.preview.emergentagent.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#1B4332] text-[#F8F5F0] px-6 py-2 rounded-lg font-medium inline-flex items-center justify-center hover:bg-[#52796F] transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Free Audit
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-[#2D3748]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4">
          <Link 
            to="/services" 
            className="block text-[#2D3748] hover:text-[#52796F] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </Link>
          <Link 
            to="/resources" 
            className="block text-[#2D3748] hover:text-[#52796F] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Resources
          </Link>
          <Link 
            to="/about" 
            className="block text-[#2D3748] hover:text-[#52796F] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/login" 
            className="block text-[#2D3748] hover:text-[#52796F] transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Login
          </Link>
          <a 
            href="https://smartmatch-6.preview.emergentagent.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block bg-[#1B4332] text-[#F8F5F0] px-6 py-3 rounded-lg font-medium text-center hover:bg-[#52796F] transition-all"
          >
            Free Audit
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
