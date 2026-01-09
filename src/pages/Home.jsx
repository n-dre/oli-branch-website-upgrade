// src/components/HeroSection.jsx
import React from 'react';

const HeroSection = ({ onTalkToOli }) => {
  return (
    <section className="relative min-h-screen pt-24 overflow-hidden">
      <div className="absolute inset-0 hero-gradient opacity-95"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <div>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
            Stop the <span className="text-[#D4AF37]">Silent Leak</span> in Your Business Banking.
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Oli is the AI auditor that finds the hidden fees and mismatched services draining your profit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://smartmatch-6.preview.emergentagent.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1B4332] text-[#F8F5F0] px-9 py-5 rounded-lg font-medium inline-flex items-center justify-center hover:bg-[#52796F] transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Start My Free Audit
            </a>
            <button 
              onClick={onTalkToOli} 
              className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#1B4332] px-8 py-4 rounded-lg text-lg font-semibold transition-all"
            >
              Ask Oli a Question
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;