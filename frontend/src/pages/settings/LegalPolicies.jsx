// src/pages/settings/PrivacySafety.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  Eye, EyeOff, History, MapPin, BarChart3, Lightbulb, Shield, 
  Mail, Share2, Download, Trash2, Lock, Database, Bell, Globe,
  UserCheck, Calendar, FileText, HelpCircle, ArrowLeft
} from "lucide-react";

export default function PrivacySafety() {
  const navigate = useNavigate();
  
  const [state, setState] = useState({
    // Profile & Visibility
    profileDiscoverable: false,
    activityHistory: true,
    locationTracking: false,
    publicProfile: false,
    
    // Data & Analytics
    analyticsOptIn: false,
    personalizedInsights: true,
    thirdPartySharing: false,
    performanceTracking: true,
    
    // Security
    twoFactorAuth: true,
    secureBackup: true,
    sessionTimeout: true,
    suspiciousLoginAlerts: true,
    
    // Communication
    marketingEmails: false,
    productUpdates: true,
    securityAlerts: true,
    partnerOffers: false,
    
    // Data Management
    allowDataExport: true,
    autoDataCleanup: false,
    dataRetention: true,
  });

  const toggle = (key) => setState((s) => ({ ...s, [key]: !s[key] }));

  const onSave = async () => {
    try {
      toast.loading("Saving your privacy preferences...");
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.dismiss();
      toast.success("Privacy settings saved successfully!", {
        description: "Your preferences have been updated.",
      });
      
      setTimeout(() => {
        navigate("/settings");
      }, 1200);
      
    } catch {
      toast.error("Unable to save settings", {
        description: "Please check your connection and try again.",
      });
    }
  };

  const handleResetSettings = () => {
    setState({
      profileDiscoverable: false,
      activityHistory: true,
      locationTracking: false,
      publicProfile: false,
      analyticsOptIn: false,
      personalizedInsights: true,
      thirdPartySharing: false,
      performanceTracking: true,
      twoFactorAuth: true,
      secureBackup: true,
      sessionTimeout: true,
      suspiciousLoginAlerts: true,
      marketingEmails: false,
      productUpdates: true,
      securityAlerts: true,
      partnerOffers: false,
      allowDataExport: true,
      autoDataCleanup: false,
      dataRetention: true,
    });
    toast.info("Settings reset to recommended defaults");
  };

  const handleExportData = () => {
    toast.success("Export request submitted", {
      description: "You'll receive an email with download link within 24 hours.",
    });
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requires verification", {
      description: "Please contact support@oli-branch.com for assistance.",
      action: {
        label: "Contact Support",
        onClick: () => window.location.href = "mailto:support@oli-branch.com",
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/settings")}
              className="gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Settings
            </Button>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Privacy & Safety Center</h1>
            <p className="text-gray-600 mt-2">
              Take control of your data. Manage visibility, security, and communication preferences to protect your financial information.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
              <Lock className="h-3 w-3" />
              End-to-end encryption
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm">
              <Shield className="h-3 w-3" />
              GDPR compliant
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm">
              <Database className="h-3 w-3" />
              Bank-level security
            </span>
          </div>
        </div>

        {/* Profile & Visibility */}
        <SectionCard
          title="Profile & Visibility"
          description="Control how others see you and your activity"
          icon={<UserCheck className="h-5 w-5" />}
        >
          <ToggleRow
            title="Public Profile"
            description="Make your profile visible to other Oli-Branch users"
            details="Your name, profile picture, and public badges will be visible in community features."
            icon={state.publicProfile ? Eye : EyeOff}
            checked={state.publicProfile}
            onChange={() => toggle("publicProfile")}
          />
          <ToggleRow
            title="Activity History"
            description="Store your financial activity for personalized insights"
            details="Used to provide tailored budgeting advice and financial health recommendations."
            icon={History}
            checked={state.activityHistory}
            onChange={() => toggle("activityHistory")}
          />
          <ToggleRow
            title="Location Services"
            description="Enable location-based financial services"
            details="Find nearby banks, ATMs, and compare regional financial products."
            icon={MapPin}
            checked={state.locationTracking}
            onChange={() => toggle("locationTracking")}
          />
          <ToggleRow
            title="Profile Discoverability"
            description="Allow others to find you through search"
            details="Appear in search results when other users look for financial partners or advisors."
            icon={Globe}
            checked={state.profileDiscoverable}
            onChange={() => toggle("profileDiscoverable")}
          />
        </SectionCard>

        {/* Data & Analytics */}
        <SectionCard
          title="Data & Analytics"
          description="Control how your data improves our services"
          icon={<BarChart3 className="h-5 w-5" />}
        >
          <ToggleRow
            title="Performance Analytics"
            description="Help us improve app speed and reliability"
            details="Anonymous data about app performance and feature usage."
            icon={BarChart3}
            checked={state.performanceTracking}
            onChange={() => toggle("performanceTracking")}
          />
          <ToggleRow
            title="Personalized Insights"
            description="Receive customized financial recommendations"
            details="AI-powered insights based on your spending patterns and financial goals."
            icon={Lightbulb}
            checked={state.personalizedInsights}
            onChange={() => toggle("personalizedInsights")}
          />
          <ToggleRow
            title="Research Participation"
            description="Contribute to financial research studies"
            details="Anonymous, aggregated data helps improve financial services industry-wide."
            icon={Share2}
            checked={state.thirdPartySharing}
            onChange={() => toggle("thirdPartySharing")}
          />
          <ToggleRow
            title="Usage Analytics"
            description="Share usage patterns to improve features"
            details="Understand how features are used to prioritize development."
            icon={Database}
            checked={state.analyticsOptIn}
            onChange={() => toggle("analyticsOptIn")}
          />
        </SectionCard>

        {/* Security */}
        <SectionCard
          title="Security"
          description="Enhanced protection for your financial data"
          icon={<Shield className="h-5 w-5" />}
        >
          <ToggleRow
            title="Two-Factor Authentication"
            description="Extra security layer for account access"
            details="Required for all new devices and sensitive actions."
            icon={Lock}
            checked={state.twoFactorAuth}
            onChange={() => toggle("twoFactorAuth")}
          />
          <ToggleRow
            title="Secure Cloud Backup"
            description="Automatic encrypted backups of your data"
            details="Daily encrypted backups to prevent data loss."
            icon={Database}
            checked={state.secureBackup}
            onChange={() => toggle("secureBackup")}
          />
          <ToggleRow
            title="Session Timeout"
            description="Automatically log out after inactivity"
            details="For security, sessions expire after 30 minutes of inactivity."
            icon={Calendar}
            checked={state.sessionTimeout}
            onChange={() => toggle("sessionTimeout")}
          />
          <ToggleRow
            title="Suspicious Activity Alerts"
            description="Get notified of unusual account activity"
            details="Immediate alerts for logins from new devices or locations."
            icon={Bell}
            checked={state.suspiciousLoginAlerts}
            onChange={() => toggle("suspiciousLoginAlerts")}
          />
        </SectionCard>

        {/* Communication */}
        <SectionCard
          title="Communication"
          description="Choose how we communicate with you"
          icon={<Mail className="h-5 w-5" />}
        >
          <ToggleRow
            title="Product Updates"
            description="News about new features and improvements"
            details="Monthly digest of platform updates and enhancements."
            icon={Bell}
            checked={state.productUpdates}
            onChange={() => toggle("productUpdates")}
          />
          <ToggleRow
            title="Security Alerts"
            description="Important security notices and updates"
            details="Critical updates about security features and threats."
            icon={Shield}
            checked={state.securityAlerts}
            onChange={() => toggle("securityAlerts")}
          />
          <ToggleRow
            title="Financial Tips"
            description="Educational content and financial advice"
            details="Weekly insights and money management strategies."
            icon={Lightbulb}
            checked={state.marketingEmails}
            onChange={() => toggle("marketingEmails")}
          />
          <ToggleRow
            title="Partner Offers"
            description="Relevant offers from trusted financial partners"
            details="Carefully vetted offers from banking and investment partners."
            icon={Share2}
            checked={state.partnerOffers}
            onChange={() => toggle("partnerOffers")}
          />
        </SectionCard>

        {/* Data Management */}
        <SectionCard
          title="Data Management"
          description="Control your data retention and exports"
          icon={<Database className="h-5 w-5" />}
        >
          <ToggleRow
            title="Data Export Access"
            description="Download your complete financial history"
            details="Export all transactions, reports, and account data in multiple formats."
            icon={Download}
            checked={state.allowDataExport}
            onChange={() => toggle("allowDataExport")}
          />
          <ToggleRow
            title="Auto Data Cleanup"
            description="Automatically remove old temporary data"
            details="Clear cached data and temporary files after 90 days."
            icon={Trash2}
            checked={state.autoDataCleanup}
            onChange={() => toggle("autoDataCleanup")}
          />
          <ToggleRow
            title="Extended Data Retention"
            description="Keep your financial history longer"
            details="Maintain transaction records for 7 years (standard is 3 years)."
            icon={FileText}
            checked={state.dataRetention}
            onChange={() => toggle("dataRetention")}
          />
          
          <div className="space-y-4 pt-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Request Data Export
                  </h3>
                  <p className="text-sm text-gray-600">
                    Download all your Oli-Branch data including transactions, reports, and settings.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Available formats: CSV, PDF, JSON • Processing time: 2-24 hours
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleExportData}
                  disabled={!state.allowDataExport}
                  className="whitespace-nowrap"
                >
                  Request Export
                </Button>
              </div>
            </div>

            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-red-900 flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete Account Permanently
                  </h3>
                  <p className="text-sm text-red-700">
                    This will permanently delete all your data and cannot be undone.
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Warning: Export your data before proceeding with deletion.
                  </p>
                </div>
                <Button 
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Legal Documents */}
        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Legal Documents & Policies
            </CardTitle>
            <CardDescription>Review our complete policies and compliance information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: "Privacy Policy", desc: "How we protect and use your data", href: "/privacy", icon: Shield },
                { name: "Terms of Service", desc: "Rules for using Oli-Branch", href: "/terms", icon: FileText },
                { name: "Cookie Policy", desc: "Our use of cookies and tracking", href: "/cookie-policy", icon: Database },
                { name: "Security Disclosure", desc: "Our security protocols", href: "/security-disclosure", icon: Lock },
                { name: "Data Processing Agreement", desc: "GDPR compliance details", href: "/dpa", icon: Globe },
                {
                  name: "Community Guidelines",
                  desc: "Standards for user conduct",
                  href: "https://www.facebook.com/groups/755013229548095/",
                  icon: UserCheck,
                  external: true
                },

              ].map((doc) => (
                <a
                  key={doc.name}
                  href={doc.href}
                  className="group p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                      <doc.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 group-hover:text-gray-950">
                        {doc.name}
                      </div>
                      <div className="text-sm text-gray-600">{doc.desc}</div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="sticky bottom-6 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-center md:text-left">
              <p className="font-medium text-gray-900">Need help with privacy settings?</p>
              <p className="text-sm text-gray-600">
                Contact our privacy team at{" "}
                <a href="mailto:privacy@oli-branch.com" className="text-primary hover:underline font-medium">
                  contact@oli-branch.com
                </a>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleResetSettings}
                className="gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button
                onClick={onSave}
                className="bg-green-800 hover:bg-green-900 text-white gap-2"
                size="lg"
              >
                <Shield className="h-4 w-4" />
                Save All Privacy Settings
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p>
                  <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="mt-1">
                  Oli-Branch complies with GDPR, CCPA, PIPEDA, and global privacy regulations.
                </p>
              </div>
              <div className="text-right">
                <p>All data encrypted at rest and in transit</p>
                <p className="text-green-600 font-medium">✓ SOC 2 Type II Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper Components
function SectionCard({ title, description, icon, children }) {
  return (
    <Card className="rounded-xl border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}

function ToggleRow({ title, description, details, icon: Icon, checked, onChange }) {
  return (
    <div className="group flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200">
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-100 rounded-md group-hover:bg-gray-200 transition-colors">
            {Icon && <Icon className="h-3.5 w-3.5 text-gray-600" />}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{title}</div>
            <div className="text-sm text-gray-600 mt-0.5">{description}</div>
          </div>
        </div>
        {details && (
          <div className="text-xs text-gray-500 bg-white border border-gray-100 p-2 rounded-md ml-9">
            {details}
          </div>
        )}
      </div>
      <div className="flex-shrink-0 pt-1">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={onChange}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300
            ${checked 
              ? 'bg-green-800 shadow-green-200/50' 
              : 'bg-gray-300 hover:bg-gray-400'
            }
            focus:outline-none focus:ring-2 focus:ring-green-800 focus:ring-offset-2
            group-hover:shadow-md
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-300
              ${checked 
                ? 'translate-x-6 shadow-md' 
                : 'translate-x-1 shadow-sm'
              }
            `}
          />
        </button>
      </div>
    </div>
  );
}