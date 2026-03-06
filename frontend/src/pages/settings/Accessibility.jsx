import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Eye,
  Shield,
  Settings,
} from "lucide-react";

export default function Accessibility() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    reduceMotion: false,
    highContrast: false,
    largerText: false,
    screenReaderHints: true,
    keyboardNavigation: true,
    dyslexiaFont: false,
    colorBlindMode: false,
    cognitiveLoad: false,
    autoCaptions: false,
    focusMode: false,
    industryStandards: true,
    exportSettings: false,
  });

  const toggle = (key) => setState((s) => ({ ...s, [key]: !s[key] }));

  const onSave = () => {
    toast.success(
      "Enterprise accessibility preferences saved for your organization."
    );
    navigate("/settings");
  };

  const exportComplianceReport = () => {
    toast.info("Generating WCAG compliance report for your organization...");
  };

  const applyToTeam = () => {
    toast.info(
      "Applying accessibility settings across your team members..."
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Enterprise Header */}
        <Card className="rounded-2xl border-l-4 border-l-blue-600 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Shield className="h-7 w-7 text-blue-600" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl text-gray-900">
                  Enterprise Accessibility Settings
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Configure accessibility preferences for your entire organization. 
                  Settings comply with WCAG 2.1 AA standards and support ADA requirements.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual & Display */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Visual & Display
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Adjust visual elements for optimal clarity
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ToggleItem
                title="High Contrast ADA Mode"
                description="WCAG 1.4.6 compliant for better readability"
                checked={state.highContrast}
                onChange={() => toggle("highContrast")}
                badge="ADA"
              />
              <ToggleItem
                title="Dyslexia-Friendly Font"
                description="OpenDyslexic font for better readability"
                checked={state.dyslexiaFont}
                onChange={() => toggle("dyslexiaFont")}
                badge="Inclusive"
              />
              <ToggleItem
                title="Color Blind Mode"
                description="Optimized for common color vision deficiencies"
                checked={state.colorBlindMode}
                onChange={() => toggle("colorBlindMode")}
                badge="WCAG 1.4.1"
              />
              <ToggleItem
                title="Reduce Motion"
                description="Minimize animations (vestibular-safe)"
                checked={state.reduceMotion}
                onChange={() => toggle("reduceMotion")}
                badge="WCAG 2.3.3"
              />
            </CardContent>
          </Card>

          {/* Interaction & Navigation */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Settings className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Interaction & Navigation
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Enhance how users interact with the platform
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ToggleItem
                title="Keyboard Navigation"
                description="Full keyboard support"
                checked={state.keyboardNavigation}
                onChange={() => toggle("keyboardNavigation")}
                badge="WCAG 2.1.1"
              />
              <ToggleItem
                title="Focus Mode"
                description="Reduce visual clutter"
                checked={state.focusMode}
                onChange={() => toggle("focusMode")}
                badge="Productivity"
              />
              <ToggleItem
                title="Larger Text"
                description="200% zoom support"
                checked={state.largerText}
                onChange={() => toggle("largerText")}
                badge="WCAG 1.4.4"
              />
              <ToggleItem
                title="Reduce Cognitive Load"
                description="Simplify workflows"
                checked={state.cognitiveLoad}
                onChange={() => toggle("cognitiveLoad")}
                badge="UX Enhanced"
              />
            </CardContent>
          </Card>

          {/* Compliance & Team */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Shield className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Compliance & Team
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Organization-wide accessibility controls
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ToggleItem
                title="Screen Reader Hints"
                description="ARIA labels and semantic HTML"
                checked={state.screenReaderHints}
                onChange={() => toggle("screenReaderHints")}
                badge="WCAG 4.1.2"
              />
              <ToggleItem
                title="Auto Captions"
                description="Automatic multimedia captions"
                checked={state.autoCaptions}
                onChange={() => toggle("autoCaptions")}
                badge="WCAG 1.2.2"
              />
              <ToggleItem
                title="Industry Standards"
                description="Enforce WCAG 2.1 AA"
                checked={state.industryStandards}
                onChange={() => toggle("industryStandards")}
                badge="Compliant"
              />
              <ToggleItem
                title="Export Settings"
                description="Allow configuration export"
                checked={state.exportSettings}
                onChange={() => toggle("exportSettings")}
                badge="Audit Ready"
              />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="bg-gradient-to-r from-gray-50 to-white border rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Organization Settings
              </h3>
              <p className="text-sm text-gray-600">
                Apply these settings and generate compliance reports
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={exportComplianceReport}
                className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
              >
                Export Compliance Report
              </Button>
              
              <Button
                variant="outline"
                onClick={applyToTeam}
                className="w-full sm:w-auto border-gray-300 hover:bg-gray-50"
              >
                Apply to Team
              </Button>
              
              <Button
                onClick={onSave}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Organization Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Compliance Status</CardTitle>
            <CardDescription className="text-gray-600">
              Your current accessibility compliance level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-green-700 mb-1">AA</div>
                <div className="text-sm font-medium text-green-800">WCAG 2.1 Level</div>
                <div className="text-xs text-green-600 mt-1">Target Standard</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-blue-700 mb-1">14/14</div>
                <div className="text-sm font-medium text-blue-800">Standards Met</div>
                <div className="text-xs text-blue-600 mt-1">Full Compliance</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-purple-700 mb-1">100%</div>
                <div className="text-sm font-medium text-purple-800">Team Coverage</div>
                <div className="text-xs text-purple-600 mt-1">All Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Updated ToggleItem component - NO button-like styling
function ToggleItem({ title, description, checked, onChange, badge }) {
  return (
    <div className="flex items-center justify-between py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900 truncate">{title}</span>
          {badge && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      
      <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={onChange}
        />
        <div className={`
          w-12 h-6 rounded-full transition-colors duration-200 ease-in-out
          ${checked ? 'bg-blue-600' : 'bg-gray-300'}
        `}>
          <div className={`
            absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-6' : 'translate-x-0'}
          `} />
        </div>
      </label>
    </div>
  );
}