// src/App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Context Providers (FIXED)
import { ThemeProvider } from "./context/ThemeContext";
import { DataProvider } from "./context/DataContext";
import { StripeProvider } from "./context/StripeContext";

// --- Error Boundary Component ---
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
            color: "#333",
          }}
        >
          <h1 style={{ color: "#dc2626" }}>Error Loading Page</h1>
          <p style={{ color: "#666", marginBottom: "20px" }}>
            {this.props.pageName || "This page"} failed to load.
          </p>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "16px",
              borderRadius: "8px",
              textAlign: "left",
              overflow: "auto",
              maxWidth: "600px",
              margin: "0 auto 20px",
              fontSize: "12px",
              color: "#dc2626",
            }}
          >
            {this.state.error?.toString()}
          </pre>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#1B4332",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Go Home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Loading Spinner Component ---
const Loading = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      fontFamily: "Inter, sans-serif",
      color: "#1B4332",
      backgroundColor: "#F8F5F0",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #e0e0e0",
          borderTopColor: "#1B4332",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 16px",
        }}
      />
      <p>Loading...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

// --- Safe Lazy Import Wrapper ---
const safeLazy = (importFn, pageName) => {
  const LazyComponent = lazy(() =>
    importFn().catch((error) => {
      console.error(`Failed to load ${pageName}:`, error);
      return {
        default: () => (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              color: "#333",
              backgroundColor: "#F8F5F0",
              minHeight: "100vh",
            }}
          >
            <h1 style={{ color: "#dc2626" }}>Failed to Load: {pageName}</h1>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              There was an error importing this page.
            </p>
            <pre
              style={{
                background: "#fff",
                padding: "16px",
                borderRadius: "8px",
                textAlign: "left",
                overflow: "auto",
                maxWidth: "600px",
                margin: "0 auto 20px",
                fontSize: "12px",
                color: "#dc2626",
                border: "1px solid #e0e0e0",
              }}
            >
              {error?.toString()}
            </pre>
            <a
              href="/"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#1B4332",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
              }}
            >
              Go Home
            </a>
          </div>
        ),
      };
    })
  );

  return function WrappedComponent(props) {
    return (
      <ErrorBoundary pageName={pageName}>
        <Suspense fallback={<Loading />}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    );
  };
};

// ✅ Settings index is now pages/settings/index.jsx
const Settings = safeLazy(() => import("./pages/settings"), "Settings");

// ✅ Settings subpages
const Accessibility = safeLazy(() => import("./pages/settings/Accessibility"), "Accessibility");
const PrivacySafety = safeLazy(() => import("./pages/settings/PrivacySafety"), "PrivacySafety");
const Avatar = safeLazy(() => import("./pages/settings/Avatar"), "Avatar");
const Businessname = safeLazy(() => import("./pages/settings/Businessname"), "Businessname");
const PersonalDetails = safeLazy(() => import("./pages/settings/PersonalDetails"), "PersonalDetails");
const PasswordSecurity = safeLazy(() => import("./pages/settings/PasswordSecurity"), "PasswordSecurity");
const NotificationsSounds = safeLazy(() => import("./pages/settings/NotificationsSounds"), "NotificationsSounds");
const PhotosMedia = safeLazy(() => import("./pages/settings/PhotosMedia"), "PhotosMedia");
const Memories = safeLazy(() => import("./pages/settings/Memories"), "Memories");
const LanguageIdentification = safeLazy(() => import("./pages/settings/LanguageIdentification"), "LanguageIdentification");
const UnderlinedWords = safeLazy(() => import("./pages/settings/UnderlinedWords"), "UnderlinedWords");
const ReportAProblem = safeLazy(() => import("./pages/settings/ReportAProblem"), "ReportAProblem");
const LegalPolicies = safeLazy(() => import("./pages/settings/LegalPolicies"), "LegalPolicies");

// --- Lazy Load Pages ---
const LandingPage = safeLazy(() => import("./pages/tools/LandingPage"), "LandingPage");
const LoginPage = safeLazy(() => import("./pages/auth/LoginPage"), "LoginPage");
const SignupPage = safeLazy(() => import("./pages/auth/SignupPage"), "SignupPage");
const Services = safeLazy(() => import("./pages/tools/Services"), "Services");
const Resources = safeLazy(() => import("./pages/tools/Resources"), "Resources");
const About = safeLazy(() => import("./pages/public/About"), "About");
const Pricing = safeLazy(() => import("./pages/public/Pricing"), "Pricing");
const Terms = safeLazy(() => import("./pages/public/Terms"), "Terms");
const Privacy = safeLazy(() => import("./pages/tools/Privacy"), "Privacy");

const AdminDashboard = safeLazy(() => import("./pages/dashboard/AdminDashboard"), "AdminDashboard");
const UserDashboard = safeLazy(() => import("./pages/dashboard/UserDashboard"), "UserDashboard");
const LinkBank = safeLazy(() => import("./pages/tools/LinkBank"), "LinkBank");
const Budget = safeLazy(() => import("./pages/tools/Budget"), "Budget");
const FinancialLeaks = safeLazy(() => import("./pages/tools/FinancialLeaks"), "FinancialLeaks");
const FinancialHealth = safeLazy(() => import("./pages/tools/FinancialHealth"), "FinancialHealth");
const Help = safeLazy(() => import("./pages/tools/Help"), "Help");

const HowItWorks = safeLazy(() => import("./pages/tools/HowItWorks"), "HowItWorks");
const QuickStartGuide = safeLazy(() => import("./pages/public/QuickStartGuide"), "QuickStartGuide");
const ResourcesFinder = safeLazy(() => import("./pages/tools/ResourcesFinder"), "ResourcesFinder");

const IntakeForm = safeLazy(() => import("./pages/assessments/IntakeForm"), "IntakeForm");
const Learning = safeLazy(() => import("./pages/tools/Learning"), "Learning");
const Payment = safeLazy(() => import("./pages/tools/Payment"), "Payment");

const NearbyBanks = safeLazy(() => import("./pages/tools/NearbyBanks"), "NearbyBanks");
const Profile = safeLazy(() => import("./pages/tools/Profile"), "Profile");
const Report = safeLazy(() => import("./pages/assessments/Report"), "Report");
const Tools = safeLazy(() => import("./pages/tools/Tools"), "Tools");

// --- Main App Component ---
function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <StripeProvider>
          <div className="min-h-screen bg-background transition-colors duration-300">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Dashboard routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/link" element={<LinkBank />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/leaks" element={<FinancialLeaks />} />
              <Route path="/health" element={<FinancialHealth />} />
              <Route path="/help" element={<Help />} />

              {/* Other routes */}
              <Route path="/HowItWorks" element={<HowItWorks />} />
              <Route path="/QuickStartGuide" element={<QuickStartGuide />} />
              <Route path="/finder" element={<ResourcesFinder />} />

              <Route path="/intake" element={<IntakeForm />} />
              <Route path="/learning" element={<Learning />} />
              <Route path="/nearby-banks" element={<NearbyBanks />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/report" element={<Report />} />
              <Route path="/report/:email" element={<Report />} />

              {/* Settings */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/accessibility" element={<Accessibility />} />
              <Route path="/settings/privacy-safety" element={<PrivacySafety />} />
              <Route path="/settings/avatar" element={<Avatar />} />
              <Route path="/settings/businessname" element={<Businessname />} />
              <Route path="/settings/personal-details" element={<PersonalDetails />} />
              <Route path="/settings/password-security" element={<PasswordSecurity />} />
              <Route path="/settings/notifications-sounds" element={<NotificationsSounds />} />
              <Route path="/settings/photos-media" element={<PhotosMedia />} />
              <Route path="/settings/memories" element={<Memories />} />
              <Route path="/settings/language-identification" element={<LanguageIdentification />} />
              <Route path="/settings/underlined-words" element={<UnderlinedWords />} />
              <Route path="/settings/report-a-problem" element={<ReportAProblem />} />
              <Route path="/settings/legal-policies" element={<LegalPolicies />} />

              <Route path="/tools" element={<Tools />} />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div
                    style={{
                      padding: "50px",
                      textAlign: "center",
                      color: "#333",
                      fontFamily: "Inter, sans-serif",
                      backgroundColor: "#F8F5F0",
                      minHeight: "100vh",
                    }}
                  >
                    <h1 style={{ fontSize: "72px", margin: "0 0 16px", color: "#1B4332" }}>
                      404
                    </h1>
                    <p style={{ fontSize: "18px", color: "#666", marginBottom: "24px" }}>
                      Page Not Found
                    </p>
                    <a
                      href="/"
                      style={{
                        display: "inline-block",
                        padding: "12px 24px",
                        backgroundColor: "#1B4332",
                        color: "#fff",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontWeight: "600",
                      }}
                    >
                      Go Home
                    </a>
                  </div>
                }
              />
            </Routes>

            <Toaster position="top-right" richColors closeButton />
          </div>
        </StripeProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;



