// src/pages/HeroSection.jsx
import React from "react";

const HeroSection = ({ onTalkToOli }) => {
  return (
    <section
      className="relative overflow-hidden"
      // HARD guarantee: gradient is on the SECTION background
      style={{
        backgroundImage: "linear-gradient(135deg, #1B4332 0%, #52796F 100%)",
      }}
    >
      {/* subtle contrast overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.10)" }} />

      {/* if Navbar is fixed, Layout will add pt-24 to main.
          so hero itself should NOT add pt-24 */}

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <div style={{ color: "#F8F5F0" }}>
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Stop the <span style={{ color: "#D4AF37" }}>Silent Leak</span> in Your Business Banking.
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ opacity: 0.92 }}>
            Oli is the AI auditor that finds the hidden fees and mismatched services draining your profit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="https://smartmatch-6.preview.emergentagent.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-9 py-5 rounded-lg font-semibold inline-flex items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ background: "#1B4332", color: "#F8F5F0" }}
            >
              Start a Free 14-Day Trial
            </a>

            <button
              type="button"
              onClick={onTalkToOli}
              className="px-8 py-4 rounded-lg text-lg font-semibold transition-all"
              style={{
                border: "2px solid #F8F5F0",
                color: "#F8F5F0",
                background: "transparent",
              }}
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


