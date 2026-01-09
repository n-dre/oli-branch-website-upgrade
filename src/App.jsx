import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { StripeProvider } from './context/StripeContext';

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
        <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Inter, sans-serif', color: '#333' }}>
          <h1 style={{ color: '#dc2626' }}>Error Loading Page</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            {this.props.pageName || 'This page'} failed to load.
          </p>
          <pre style={{
            background: '#f5f5f5', padding: '16px', borderRadius: '8px',
            textAlign: 'left', overflow: 'auto', maxWidth: '600px',
            margin: '0 auto 20px', fontSize: '12px', color: '#dc2626'
          }}>
            {this.state.error?.toString()}
          </pre>
          <a href="/" style={{
            display: 'inline-block', padding: '12px 24px', backgroundColor: '#1B4332',
            color: '#fff', borderRadius: '8px', textDecoration: 'none'
          }}>
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
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#1B4332', backgroundColor: '#F8F5F0'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px', height: '40px', border: '4px solid #e0e0e0',
        borderTopColor: '#1B4332', borderRadius: '50%',
        animation: 'spin 1s linear infinite', margin: '0 auto 16px'
      }} />
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
          <div style={{
            padding: '50px', textAlign: 'center', fontFamily: 'Inter, sans-serif',
            color: '#333', backgroundColor: '#F8F5F0', minHeight: '100vh'
          }}>
            <h1 style={{ color: '#dc2626' }}>Failed to Load: {pageName}</h1>
            <p style={{ color: '#666', marginBottom: '20px' }}>There was an error importing this page.</p>
            <pre style={{
              background: '#fff', padding: '16px', borderRadius: '8px',
              textAlign: 'left', overflow: 'auto', maxWidth: '600px',
              margin: '0 auto 20px', fontSize: '12px', color: '#dc2626', border: '1px solid #e0e0e0'
            }}>
              {error?.toString()}
            </pre>
            <a href="/" style={{
              display: 'inline-block', padding: '12px 24px', backgroundColor: '#1B4332',
              color: '#fff', borderRadius: '8px', textDecoration: 'none'
            }}>
              Go Home
            </a>
          </div>
        ),
      };
    })
  );

  return (props) => (
    <ErrorBoundary pageName={pageName}>
      <Suspense fallback={<Loading />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// --- Lazy Load Pages ---
const LandingPage = safeLazy(() => import('./pages/LandingPage'), 'LandingPage');
const LoginPage = safeLazy(() => import('./pages/LoginPage'), 'LoginPage');
const Dashboard = safeLazy(() => import('./pages/Dashboard'), 'Dashboard');
const BankLinking = safeLazy(() => import('./pages/BankLinking'), 'BankLinking');
const Budget = safeLazy(() => import('./pages/Budget'), 'Budget');
const FeeAnalysis = safeLazy(() => import('./pages/FeeAnalysis'), 'FeeAnalysis');
const FinancialHealth = safeLazy(() => import('./pages/FinancialHealth'), 'FinancialHealth');
const IntakeForm = safeLazy(() => import('./pages/IntakeForm'), 'IntakeForm');
const Learning = safeLazy(() => import('./pages/Learning'), 'Learning');
const NearbyBanks = safeLazy(() => import('./pages/NearbyBanks'), 'NearbyBanks');
const Pricing = safeLazy(() => import('./pages/Pricing'), 'Pricing');
const Profile = safeLazy(() => import('./pages/Profile'), 'Profile');
const Report = safeLazy(() => import('./pages/Report'), 'Report');
const Settings = safeLazy(() => import('./pages/Settings'), 'Settings');
const Tools = safeLazy(() => import('./pages/Tools'), 'Tools');

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <StripeProvider>
          <Router>
            <div className="min-h-screen bg-background transition-colors duration-300">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/pricing" element={<Pricing />} />

                {/* Dashboard routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/bank-linking" element={<BankLinking />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/fee-analysis" element={<FeeAnalysis />} />
                <Route path="/financial-health" element={<FinancialHealth />} />
                <Route path="/intake-form" element={<IntakeForm />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/nearby-banks" element={<NearbyBanks />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/report" element={<Report />} />
                <Route path="/report/:email" element={<Report />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/tools" element={<Tools />} />

                {/* 404 fallback */}
                <Route
                  path="*"
                  element={
                    <div style={{
                      padding: '50px', textAlign: 'center', color: '#333',
                      fontFamily: 'Inter, sans-serif', backgroundColor: '#F8F5F0', minHeight: '100vh'
                    }}>
                      <h1 style={{ fontSize: '72px', margin: '0 0 16px', color: '#1B4332' }}>404</h1>
                      <p style={{ fontSize: '18px', color: '#666', marginBottom: '24px' }}>Page Not Found</p>
                      <a href="/" style={{
                        display: 'inline-block', padding: '12px 24px', backgroundColor: '#1B4332',
                        color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600'
                      }}>
                        Go Home
                      </a>
                    </div>
                  }
                />
              </Routes>
              <Toaster position="top-right" richColors closeButton />
            </div>
          </Router>
        </StripeProvider>
      </DataProvider>
    </ThemeProvider>
  );
}