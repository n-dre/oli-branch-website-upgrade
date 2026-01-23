// src/App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Context Providers
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";
import { StripeProvider } from "./context/StripeContext";

// ---------------- ERROR BOUNDARY ----------------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "50px",
            textAlign: "center",
            fontFamily: "Inter, sans-serif",
            backgroundColor: "#F8F5F0",
            minHeight: "100vh",
          }}
        >
          <h1 style={{ color: "#dc2626" }}>Error Loading Page</h1>
          <pre style={{ marginTop: 20, color: "#dc2626" }}>
            {this.state.error?.toString()}
          </pre>
          <a href="/" style={{ color: "#1B4332", fontWeight: 600 }}>
            Go Home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------- LOADING ----------------
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen text-[#1B4332]">
    Loading…
  </div>
);

// ---------------- SAFE LAZY ----------------
const safeLazy = (fn, name) =>
  lazy(() =>
    fn().catch((err) => {
      console.error(`Failed loading ${name}`, err);
      return {
        default: () => (
          <div className="p-10 text-center text-red-600">
            Failed to load {name}
          </div>
        ),
      };
    })
  );

// ---------------- PUBLIC ----------------
const LandingPage = safeLazy(() => import("./pages/tools/LandingPage"), "LandingPage");
const LoginPage = safeLazy(() => import("./pages/auth/LoginPage"), "LoginPage");
const SignupPage = safeLazy(() => import("./pages/auth/SignupPage"), "SignupPage");
const ForgotPassword = safeLazy(() => import("./pages/auth/ForgotPassword"), "ForgotPassword");
const About = safeLazy(() => import("./pages/public/About"), "About");
const Pricing = safeLazy(() => import("./pages/public/Pricing"), "Pricing");
const Terms = safeLazy(() => import("./pages/public/Terms"), "Terms");
const Privacy = safeLazy(() => import("./pages/public/Privacy"), "Privacy");
const QuickStartGuide = safeLazy(
  () => import("./pages/public/QuickStartGuide"),
  "QuickStartGuide"
);

// ---------------- DASHBOARD ----------------
const AdminDashboard = safeLazy(() => import("./pages/dashboard/AdminDashboard"), "AdminDashboard");
const UserDashboard = safeLazy(() => import("./pages/dashboard/UserDashboard"), "UserDashboard");

// ---------------- TOOLS ----------------
const Tools = safeLazy(() => import("./pages/tools/Tools"), "Tools");
const Services = safeLazy(() => import("./pages/tools/Services"), "Services");
const Resources = safeLazy(() => import("./pages/tools/Resources"), "Resources");
const LinkBank = safeLazy(() => import("./pages/tools/LinkBank"), "LinkBank");
const Budget = safeLazy(() => import("./pages/tools/Budget"), "Budget");
const Payment = safeLazy(() => import("./pages/tools/Payment"), "Payment");
const FinancialLeaks = safeLazy(() => import("./pages/tools/FinancialLeaks"), "FinancialLeaks");
const FinancialHealth = safeLazy(() => import("./pages/tools/FinancialHealth"), "FinancialHealth");
const Help = safeLazy(() => import("./pages/tools/Help"), "Help");
const HowItWorks = safeLazy(() => import("./pages/tools/HowItWorks"), "HowItWorks");
const ResourcesFinder = safeLazy(
  () => import("./pages/tools/ResourcesFinder"),
  "ResourcesFinder"
);
const Learning = safeLazy(() => import("./pages/tools/Learning"), "Learning");
const NearbyBanks = safeLazy(() => import("./pages/tools/NearbyBanks"), "NearbyBanks");
const Profile = safeLazy(() => import("./pages/tools/Profile"), "Profile");
const NotificationsSounds = safeLazy(
  () => import("./pages/tools/NotificationsSounds"),
  "NotificationsSounds"
);

// ---------------- SETTINGS ----------------
const Settings = safeLazy(() => import("./pages/settings"), "Settings");
const Accessibility = safeLazy(() => import("./pages/settings/Accessibility"), "Accessibility");
const PrivacySafety = safeLazy(() => import("./pages/settings/PrivacySafety"), "PrivacySafety");
const Avatar = safeLazy(() => import("./pages/settings/Avatar"), "Avatar");
const Businessname = safeLazy(() => import("./pages/settings/Businessname"), "Businessname");
const PersonalDetails = safeLazy(() => import("./pages/settings/PersonalDetails"), "PersonalDetails");
const PasswordSecurity = safeLazy(
  () => import("./pages/settings/PasswordSecurity"),
  "PasswordSecurity"
);
const PhotosMedia = safeLazy(() => import("./pages/settings/PhotosMedia"), "PhotosMedia");
const Memories = safeLazy(() => import("./pages/settings/Memories"), "Memories");
const LanguageIdentification = safeLazy(
  () => import("./pages/settings/LanguageIdentification"),
  "LanguageIdentification"
);
const UnderlinedWords = safeLazy(
  () => import("./pages/settings/UnderlinedWords"),
  "UnderlinedWords"
);
const ReportAProblem = safeLazy(
  () => import("./pages/settings/ReportAProblem"),
  "ReportAProblem"
);
const LegalPolicies = safeLazy(
  () => import("./pages/settings/LegalPolicies"),
  "LegalPolicies"
);
const CookiePolicy = safeLazy(
  () => import("./pages/settings/CookiePolicy"),
  "CookiePolicy"
);
const SecurityDisclosure = safeLazy(
  () => import("./pages/settings/SecurityDisclosure"),
  "SecurityDisclosure"
);

// ---------------- ASSESSMENTS ----------------
const IntakeForm = safeLazy(() => import("./pages/assessments/IntakeForm"), "IntakeForm");
const Report = safeLazy(() => import("./pages/assessments/Report"), "Report");

// ---------------- APP ----------------
export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <StripeProvider>
          <ErrorBoundary>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/password" element={<ForgotPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/QuickStartGuide" element={<QuickStartGuide />} />

                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<UserDashboard />} />

                <Route path="/tools" element={<Tools />} />
                <Route path="/services" element={<Services />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/link" element={<LinkBank />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/leaks" element={<FinancialLeaks />} />
                <Route path="/health" element={<FinancialHealth />} />
                <Route path="/help" element={<Help />} />
                <Route path="/HowItWorks" element={<HowItWorks />} />
                <Route path="/finder" element={<ResourcesFinder />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/nearby-banks" element={<NearbyBanks />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/notifications" element={<NotificationsSounds />} />

                <Route path="/intake" element={<IntakeForm />} />
                <Route path="/report" element={<Report />} />
                <Route path="/report/:email" element={<Report />} />

                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/accessibility" element={<Accessibility />} />
                <Route path="/settings/privacy-safety" element={<PrivacySafety />} />
                <Route path="/settings/avatar" element={<Avatar />} />
                <Route path="/settings/businessname" element={<Businessname />} />
                <Route path="/settings/personal-details" element={<PersonalDetails />} />
                <Route path="/settings/password-security" element={<PasswordSecurity />} />
                <Route path="/settings/photos-media" element={<PhotosMedia />} />
                <Route path="/settings/memories" element={<Memories />} />
                <Route path="/settings/language-identification" element={<LanguageIdentification />} />
                <Route path="/settings/underlined-words" element={<UnderlinedWords />} />
                <Route path="/settings/report-a-problem" element={<ReportAProblem />} />
                <Route path="/settings/legal-policies" element={<LegalPolicies />} />

                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/security-disclosure" element={<SecurityDisclosure />} />

                <Route path="*" element={<div className="p-10 text-center">404</div>} />
              </Routes>
            </Suspense>

            <Toaster position="top-right" richColors closeButton />
          </ErrorBoundary>
        </StripeProvider>
      </DataProvider>
    </ThemeProvider>
  );
}


