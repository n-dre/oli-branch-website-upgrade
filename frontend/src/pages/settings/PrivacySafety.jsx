// src/pages/settings/PrivacySafety.jsx
import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Eye, EyeOff, History, MapPin, BarChart3, Lightbulb, Shield, Mail, Share2, Download, Trash2 } from "lucide-react";

export default function PrivacySafety() {
  const [state, setState] = useState({
    profileDiscoverable: false,
    analyticsOptIn: false,
    personalizedInsights: true,
    allowDataExport: true,
    marketingEmails: false,
    thirdPartySharing: false,
    locationTracking: false,
    activityHistory: true,
    twoFactorAuth: true,
    secureBackup: true,
  });

  const toggle = (key) => setState((s) => ({ ...s, [key]: !s[key] }));

  const onSave = () => {
    toast.success("Privacy & safety settings saved successfully.");
  };

  const handleResetSettings = () => {
    setState({
      profileDiscoverable: false,
      analyticsOptIn: false,
      personalizedInsights: true,
      allowDataExport: true,
      marketingEmails: false,
      thirdPartySharing: false,
      locationTracking: false,
      activityHistory: true,
      twoFactorAuth: true,
      secureBackup: true,
    });
    toast.info("Privacy settings reset to defaults.");
  };

  const handleExportData = () => {
    toast.success("Data export requested. You'll receive an email with download instructions within 24 hours.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900/[0.9] mb-2">Privacy & Safety</h1>
          <p className="text-gray-600">
            Control how your data is used, who can see your information, and manage your safety preferences to ensure your financial information remains secure.
          </p>
        </div>

        {/* Profile & Visibility Section */}
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Eye className="h-5 w-5 text-gray-700" />
              Profile & Visibility
            </CardTitle>
            <CardDescription>Control who can see your profile and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <ToggleRow
                title="Profile Discoverability"
                description="Allow your profile to appear in app discovery surfaces and search results"
                details="When enabled, other Oli-Branch users can find your profile through search and recommendation features. Your profile will show basic information like your name and profile picture."
                icon={state.profileDiscoverable ? Eye : EyeOff}
                checked={state.profileDiscoverable}
                onChange={() => toggle("profileDiscoverable")}
              />
              
              <ToggleRow
                title="Activity History"
                description="Store your activity history to provide personalized recommendations"
                details="Enabling this allows Oli-Branch to track your financial activities to offer personalized insights, budgeting suggestions, and financial health recommendations."
                icon={History}
                checked={state.activityHistory}
                onChange={() => toggle("activityHistory")}
              />
              
              <ToggleRow
                title="Location Tracking"
                description="Allow location-based services for nearby bank features"
                details="When enabled, Oli-Branch can access your location to show nearby banks, ATMs, and financial service providers. Your exact location is never stored permanently."
                icon={MapPin}
                checked={state.locationTracking}
                onChange={() => toggle("locationTracking")}
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Profile visibility settings only affect how other Oli-Branch users see your information. Your financial data is always kept private and secure.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data & Analytics Section */}
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-gray-700" />
              Data & Analytics
            </CardTitle>
            <CardDescription>Control how your data is used for analytics and insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <ToggleRow
                title="Analytics Opt-In"
                description="Help improve the app by sharing anonymous usage analytics"
                details="Anonymous usage data helps us identify bugs, improve performance, and understand feature usage patterns. No personal or financial information is included in analytics data."
                icon={BarChart3}
                checked={state.analyticsOptIn}
                onChange={() => toggle("analyticsOptIn")}
              />
              
              <ToggleRow
                title="Personalized Insights"
                description="Use your activity to generate tailored financial insights and recommendations"
                details="Enabling this allows Oli-Branch to analyze your financial patterns to provide customized advice, savings opportunities, and investment suggestions based on your goals."
                icon={Lightbulb}
                checked={state.personalizedInsights}
                onChange={() => toggle("personalizedInsights")}
              />
              
              <ToggleRow
                title="Third-Party Data Sharing"
                description="Allow sharing aggregated, anonymized data with trusted partners"
                details="Aggregated and anonymized data may be shared with financial research institutions and partners to improve financial services industry-wide. Individual data is never identifiable."
                icon={Share2}
                checked={state.thirdPartySharing}
                onChange={() => toggle("thirdPartySharing")}
              />
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                <strong>Data Security:</strong> All data shared for analytics purposes is fully anonymized and encrypted. Your personal and financial information remains confidential.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security & Communication Section */}
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-700" />
              Security & Communication
            </CardTitle>
            <CardDescription>Enhanced security features and communication preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow
              title="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              details="Receive a verification code via SMS or authenticator app when signing in from new devices."
              icon={Shield}
              checked={state.twoFactorAuth}
              onChange={() => toggle("twoFactorAuth")}
            />
            
            <ToggleRow
              title="Secure Backup"
              description="Automatically backup your financial data securely"
              details="Your data is encrypted and backed up daily to ensure you never lose important financial information."
              icon={Shield}
              checked={state.secureBackup}
              onChange={() => toggle("secureBackup")}
            />
            
            <ToggleRow
              title="Marketing Emails"
              description="Receive promotional emails and updates about new features"
              details="Stay informed about new features, financial tips, and special offers from Oli-Branch."
              icon={Mail}
              checked={state.marketingEmails}
              onChange={() => toggle("marketingEmails")}
            />
          </CardContent>
        </Card>

        {/* Data Management Section */}
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Data Management</CardTitle>
            <CardDescription>Control access to your data and exports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ToggleRow
              title="Data Export Access"
              description="Allow exporting your data from the settings page"
              details="Enable this to download your complete financial data including transactions, budgets, and reports."
              icon={Download}
              checked={state.allowDataExport}
              onChange={() => toggle("allowDataExport")}
            />
            
            <div className="pt-4 space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Data Download
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Download a complete copy of all your data stored in Oli-Branch. Includes transactions, budgets, reports, and account information. Available in CSV and PDF formats.
                    </p>
                  </div>
                  <Button variant="outline" onClick={handleExportData} disabled={!state.allowDataExport}>
                    Request Export
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Exports may take up to 24 hours to prepare. You'll receive an email with download instructions.
                </p>
              </div>

              <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-red-900 flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Account Deletion
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      Permanently delete your account and all associated data. This action cannot be undone and will remove all your financial information from our systems.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-300 hover:bg-red-100"
                    onClick={() => toast.error("Account deletion requires additional verification. Please contact support.")}
                  >
                    Delete Account
                  </Button>
                </div>
                <p className="text-xs text-red-600">
                  Warning: This action is irreversible. Consider exporting your data first.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal & Compliance Links */}
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Legal & Compliance</CardTitle>
            <CardDescription>Review our legal policies and compliance documentation</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a href="/privacy" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <div className="font-medium text-gray-900">Privacy Policy</div>
              <div className="text-sm text-gray-600">How we collect, use, and protect your data</div>
            </a>
            <a href="/terms" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <div className="font-medium text-gray-900">Terms of Service</div>
              <div className="text-sm text-gray-600">Rules and guidelines for using Oli-Branch</div>
            </a>
            <a href="/cookie-policy" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <div className="font-medium text-gray-900">Cookie Policy</div>
              <div className="text-sm text-gray-600">How we use cookies and tracking technologies</div>
            </a>
            <a href="/security-disclosure" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200">
              <div className="font-medium text-gray-900">Security Disclosure</div>
              <div className="text-sm text-gray-600">Our security practices and protocols</div>
            </a>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium">Need help with privacy settings?</p>
            <p>Contact our support team at <a href="mailto:support@oli-branch.com" className="text-primary hover:underline">contact@oli-branch.com </a></p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleResetSettings}>
              Reset to Defaults
            </Button>
            <Button onClick={onSave} className="bg-primary hover:bg-primary/90">
              Save All Changes
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 border-t border-gray-200 pt-4">
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          <p className="mt-1">We comply with GDPR, CCPA, and other global privacy regulations. Your data is encrypted and stored securely.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

function ToggleRow({ title, description, details, icon: Icon, checked, onChange }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-gray-600" />}
            <div className="font-semibold text-gray-900">{title}</div>
          </div>
          <div className="text-sm text-gray-700">{description}</div>
          {details && (
            <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
              {details}
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={onChange}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${checked ? 'bg-green-800' : 'bg-gray-300'}  // Forest green when on
              focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${checked ? 'translate-x-6' : 'translate-x-1'}
                shadow-sm
              `}
            />
          </button>
        </div>
      </div>
    </div>
  );
}