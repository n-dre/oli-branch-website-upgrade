import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { StripeProvider } from './context/StripeContext';

// Error Boundary
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
        <div className="p-10 text-center font-sans">
          <h1 className="text-red-600 text-2xl font-bold">Error Loading Page</h1>
          <p className="text-gray-600 my-4">{this.props.pageName || 'This page'} failed to load.</p>
          <pre className="bg-gray-100 p-4 rounded text-left overflow-auto max-w-xl mx-auto text-xs text-red-600">
            {this.state.error?.toString()}
          </pre>
          <a href="/" className="mt-4 inline-block px-6 py-2 bg-[#1B4332] text-white rounded">Go Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}

const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#F8F5F0]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1B4332]"></div>
  </div>
);

const safeLazy = (importFn, pageName) => {
  const LazyComponent = lazy(() =>
    importFn().catch((error) => {
      console.error(`Failed to load ${pageName}:`, error);
      return { default: () => <div className="p-10 text-center">Error loading {pageName}</div> };
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

// Lazy Imports
const LandingPage = safeLazy(() => import('./pages/LandingPage'), 'LandingPage');
const Dashboard = safeLazy(() => import('./pages/Dashboard'), 'Dashboard');
const FinancialHealth = safeLazy(() => import('./pages/FinancialHealth'), 'FinancialHealth');
const Tools = safeLazy(() => import('./pages/Tools'), 'Tools');
const Budget = safeLazy(() => import('./pages/Budget'), 'Budget');
const Learning = safeLazy(() => import('./pages/Learning'), 'Learning');
const IntakeForm = safeLazy(() => import('./pages/IntakeForm'), 'IntakeForm');
const Report = safeLazy(() => import('./pages/Report'), 'Report');
const BankLinking = safeLazy(() => import('./pages/BankLinking'), 'BankLinking');
const FeeAnalysis = safeLazy(() => import('./pages/FeeAnalysis'), 'FeeAnalysis');
const NearbyBanks = safeLazy(() => import('./pages/NearbyBanks'), 'NearbyBanks');
const Pricing = safeLazy(() => import('./pages/Pricing'), 'Pricing');
const Profile = safeLazy(() => import('./pages/Profile'), 'Profile');
const Settings = safeLazy(() => import('./pages/Settings'), 'Settings');

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <StripeProvider>
          <Router>
            <div className="min-h-screen bg-background transition-colors duration-300">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/financial-health" element={<FinancialHealth />} />
                <Route path="/tools" element={<Tools />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/intake" element={<IntakeForm />} />
                <Route path="/report" element={<Report />} />
                <Route path="/report/:email" element={<Report />} />
                <Route path="/bank-linking" element={<BankLinking />} />
                <Route path="/fee-analysis" element={<FeeAnalysis />} />
                <Route path="/nearby-banks" element={<NearbyBanks />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
              <Toaster position="top-right" richColors />
            </div>
          </Router>
        </StripeProvider>
      </DataProvider>
    </ThemeProvider>
  );
}

