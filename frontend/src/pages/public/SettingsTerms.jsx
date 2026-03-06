// frontend/src/pages/public/SettingsTerms.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SettingsTerms = () => {
  // Color definitions
  const colors = {
    gold: '#D4AF37',
    forest: '#1B4332',
    sage: '#52796F',
    cream: '#F8F5F0',
    charcoal: '#2D3748'
  };

  return (
    <div className="font-body min-h-screen" style={{ backgroundColor: colors.cream, color: colors.charcoal }}>
      {/* CSS Styles */}
      <style>{`
        .glass-effect { backdrop-filter: blur(10px); background: rgba(248, 245, 240, 0.9); }
      `}</style>

      {/* Hero Section */}
      <section className="pt-24 pb-12" style={{ backgroundColor: colors.forest, color: colors.cream }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Terms of <span style={{ color: colors.gold }}>Service</span>
          </h1>
          <p className="text-lg opacity-90">Last updated: January 2025</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
            
            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to Oli-Branch LLC ("Company," "we," "our," or "us"). These Terms of Service ("Terms") govern your access to and use of our website, applications, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
              </p>
            </div>

            {/* Eligibility */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>2. Eligibility</h2>
              <p className="text-gray-600 leading-relaxed">
                You must be at least 18 years old and have the legal capacity to enter into a binding agreement to use our Services. By using our Services, you represent and warrant that you meet these requirements. If you are using our Services on behalf of a business entity, you represent that you have the authority to bind that entity to these Terms.
              </p>
            </div>

            {/* Account Registration */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>3. Account Registration</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To access certain features of our Services, you may be required to create an account. When creating an account, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized access to your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
              </ul>
            </div>

            {/* Services Description */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>4. Services Description</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Oli-Branch provides AI-powered financial auditing and analysis services designed to help small businesses identify:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Hidden banking fees and charges</li>
                <li>Account mismatches and service gaps</li>
                <li>Opportunities for cost savings</li>
                <li>Better-fit banking products and services</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                Our Services are for informational purposes only and do not constitute financial advice. We recommend consulting with a qualified financial professional before making any financial decisions.
              </p>
            </div>

            {/* User Responsibilities */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>5. User Responsibilities</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                When using our Services, you agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Submit false or misleading information</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use our Services for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the integrity of our Services</li>
                <li>Reverse engineer or attempt to extract the source code of our software</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>6. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All content, features, and functionality of our Services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and software, are the exclusive property of Oli-Branch LLC or its licensors and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </div>

            {/* Disclaimer of Warranties */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>7. Disclaimer of Warranties</h2>
              <p className="text-gray-600 leading-relaxed">
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>8. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, OLI-BRANCH LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF OUR SERVICES.
              </p>
            </div>

            {/* Termination */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>9. Termination</h2>
              <p className="text-gray-600 leading-relaxed">
                We may terminate or suspend your access to our Services immediately, without prior notice or liability, for any reason, including without limitation if you breach these Terms. Upon termination, your right to use our Services will immediately cease. All provisions of these Terms which by their nature should survive termination shall survive.
              </p>
            </div>

            {/* Governing Law */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>10. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the Commonwealth of Massachusetts, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of our Services shall be resolved in the courts located in Massachusetts.
              </p>
            </div>

            {/* Changes to SettingsTerms */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>11. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of our Services after any such changes constitutes your acceptance of the new Terms.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.forest }}>12. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: `${colors.sage}10` }}>
                <p className="font-semibold" style={{ color: colors.forest }}>Oli-Branch LLC</p>
                <p className="text-gray-600">Email: contact@oli-branch.com</p>
                <p className="text-gray-600">Phone: (857) 999-8059</p>
              </div>
            </div>

          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link to="/settings" className="inline-flex items-center gap-2 font-medium transition-colors" style={{ color: colors.forest }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: colors.charcoal, color: colors.cream }} className="py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400">Copyright &copy; 2023-2026 Oli-Branch LLC. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SettingsTerms;