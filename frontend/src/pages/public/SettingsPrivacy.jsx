// frontend/src/pages/public/SettingsPrivacy.jsx
import React from "react";
import { Link } from "react-router-dom";

const SettingsPrivacy = () => {
  // Color definitions
  const colors = {
    gold: "#D4AF37",
    forest: "#1B4332",
    sage: "#52796F",
    cream: "#F8F5F0",
    charcoal: "#2D3748",
  };

  return (
    <div
      className="font-body min-h-screen"
      style={{ backgroundColor: colors.cream, color: colors.charcoal }}
    >
      {/* CSS Styles */}
      <style>{`
        .glass-effect { backdrop-filter: blur(10px); background: rgba(248, 245, 240, 0.9); }
      `}</style>

      {/* Hero Section */}
      <section
        className="pt-24 pb-12"
        style={{ backgroundColor: colors.forest, color: colors.cream }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Privacy <span style={{ color: colors.gold }}>Policy</span>
          </h1>
          <p className="text-lg opacity-90">Last updated: January 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 space-y-8">
            {/* Introduction */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors.forest }}
              >
                1. Introduction
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Oli-Branch LLC ("Company," "we," "our," or "us") is committed to
                protecting your privacy. This Privacy Policy explains how we
                collect, use, disclose, and safeguard your information when you
                use our website and services. Please read this privacy policy
                carefully. If you do not agree with the terms of this privacy
                policy, please do not access our services.
              </p>
            </div>

            {/* Information We Collect */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors.forest }}
              >
                2. Information We Collect
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may collect information about you in a variety of ways:
              </p>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: colors.sage }}
              >
                Personal Data
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you register for an account, we collect personally
                identifiable information, such as:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
                <li>Name and email address</li>
                <li>Business name and entity type</li>
                <li>Phone number (optional)</li>
                <li>ZIP code</li>
                <li>Business financial information (monthly revenue, banking fees)</li>
              </ul>

              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: colors.sage }}
              >
                Usage Data
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                We automatically collect certain information when you visit our
                website, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>IP address and browser type</li>
                <li>Device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors.forest }}
              >
                3. How We Use Your Information
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Provide and maintain our services</li>
                <li>Analyze your banking situation and identify potential savings</li>
                <li>Generate personalized financial mismatch reports</li>
                <li>Communicate with you about our services, updates, and offers</li>
                <li>Improve our website and user experience</li>
                <li>Protect against fraudulent or unauthorized activity</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            {/* Data Sharing */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors.forest }}
              >
                4. Disclosure of Your Information
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may share your information in the following situations:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>
                  <strong>With your consent:</strong> When you have given us
                  explicit permission
                </li>
                <li>
                  <strong>Service providers:</strong> With third parties who
                  perform services on our behalf
                </li>
                <li>
                  <strong>Legal requirements:</strong> If required by law or in
                  response to valid legal requests
                </li>
                <li>
                  <strong>Business transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets
                </li>
              </ul>
              <p
                className="text-gray-600 leading-relaxed mt-4 p-4 rounded-lg"
                style={{ backgroundColor: `${colors.sage}10` }}
              >
                <strong>Important:</strong> We do NOT sell your personal
                information to third parties. We do NOT receive kickbacks or
                referral fees from banks based on your data.
              </p>
            </div>

            {/* Data Security */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors.forest }}
              >
                5. Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We implement appropriate technical and organizational security
                measures to protect your personal information, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure password hashing</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                However, no method of transmission over the Internet or
                electronic storage is 100% secure. While we strive to protect
                your personal information, we cannot guarantee its absolute
                security.
              </p>
            </div>

            {/* Data Retention */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors.forest }}
              >
                6. Data Retention
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your personal information only for as long as
                necessary to fulfill the purposes for which it was collected,
                including to satisfy any legal, accounting, or reporting
                requirements. When your data is no longer needed, we will
                securely delete or anonymize it.
              </p>
            </div>

            {/* Your Rights */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors.forest }}
              >
                7. Your Privacy Rights
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>
                  <strong>Access:</strong> Request a copy of the personal data we
                  hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  personal data
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  data
                </li>
                <li>
                  <strong>Portability:</strong> Request transfer of your data to
                  another service
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing
                  communications
                </li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-4">
                To exercise any of these rights, please contact us at
                contact@oli-branch.com.
              </p>
            </div>

            {/* Cookies */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors.forest }}
              >
                8. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to track
                activity on our website and hold certain information. Cookies
                are files with a small amount of data which may include an
                anonymous unique identifier.
              </p>
              <p className="text-gray-600 leading-relaxed">
                You can instruct your browser to refuse all cookies or to
                indicate when a cookie is being sent. However, if you do not
                accept cookies, you may not be able to use some portions of our
                service.
              </p>
            </div>

            {/* Third-Party Links */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors.forest }}
              >
                9. Third-Party Links
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our website may contain links to third-party websites that are
                not operated by us. We have no control over and assume no
                responsibility for the content, privacy policies, or practices
                of any third-party sites or services. We strongly advise you to
                review the privacy policy of every site you visit.
              </p>
            </div>

            {/* Children's Privacy */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors.forest }}
              >
                10. Children's Privacy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not intended for individuals under the age of
                18. We do not knowingly collect personally identifiable
                information from children under 18. If you are a parent or
                guardian and you are aware that your child has provided us with
                personal data, please contact us.
              </p>
            </div>

            {/* Changes to Policy */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors.forest }}
              >
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date. You are advised
                to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: colors.forest }}
              >
                12. Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please
                contact us:
              </p>
              <div
                className="mt-4 p-4 rounded-lg"
                style={{ backgroundColor: `${colors.sage}10` }}
              >
                <p className="font-semibold" style={{ color: colors.forest }}>
                  Oli-Branch LLC
                </p>
                <p className="text-gray-600">Email: contact@oli-branch.com</p>
                <p className="text-gray-600">Phone: (857) 999-8059</p>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-8 text-center">
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 font-medium transition-colors"
              style={{ color: colors.forest }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{ backgroundColor: colors.charcoal, color: colors.cream }}
        className="py-8"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            Copyright &copy; 2023-2026 Oli-Branch LLC. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SettingsPrivacy;
