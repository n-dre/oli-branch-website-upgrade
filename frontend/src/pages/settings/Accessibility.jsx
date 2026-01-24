import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  Eye, 
  Type, 
  Volume2, 
  Zap, 
  Shield, 
  Globe,
  Check,
  Settings
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
    // Hook this to API later (PUT /api/settings/accessibility)
    toast.success("Enterprise accessibility preferences saved for your organization.");
    navigate("/settings");
  };

  const exportComplianceReport = () => {
    toast.info("Generating WCAG compliance report for your organization...");
    // In production: generate and download compliance report
  };

  const applyToTeam = () => {
    toast.info("Applying accessibility settings across your team members...");
    // In production: push settings to team members via API
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Enterprise Header */}
        <Card className="rounded-2xl border-l-4 border-l-[#1B4332]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E8F5E9] rounded-lg">
                <Shield className="h-6 w-6 text-[#1B4332]" />
              </div>
              <div>
                <CardTitle className="text-xl">Enterprise Accessibility Settings</CardTitle>
                <CardDescription>
                  Configure accessibility preferences for your entire organization. 
                  Settings comply with WCAG 2.1 AA standards and support ADA requirements.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Preferences Column */}
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Visual & Display</CardTitle>
              </div>
              <CardDescription>Adjust visual elements for optimal clarity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                icon={<Eye className="h-4 w-4" />}
                title="High Contrast Mode"
                desc="WCAG 1.4.6 compliant for better readability"
                checked={state.highContrast}
                onChange={() => toggle("highContrast")}
                badge="ADA"
              />
              <ToggleRow
                icon={<Type className="h-4 w-4" />}
                title="Dyslexia-Friendly Font"
                desc="OpenDyslexic font for better readability"
                checked={state.dyslexiaFont}
                onChange={() => toggle("dyslexiaFont")}
                badge="Inclusive"
              />
              <ToggleRow
                icon={<Globe className="h-4 w-4" />}
                title="Color Blind Mode"
                desc="Optimized for common color vision deficiencies"
                checked={state.colorBlindMode}
                onChange={() => toggle("colorBlindMode")}
                badge="WCAG 1.4.1"
              />
              <ToggleRow
                icon={<Zap className="h-4 w-4" />}
                title="Reduce Motion"
                desc="Minimize animations (recommended for vestibular disorders)"
                checked={state.reduceMotion}
                onChange={() => toggle("reduceMotion")}
                badge="WCAG 2.3.3"
              />
            </CardContent>
          </Card>

          {/* Interaction & Navigation Column */}
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Interaction & Navigation</CardTitle>
              </div>
              <CardDescription>Enhance how users interact with the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                icon={<Settings className="h-4 w-4" />}
                title="Keyboard Navigation"
                desc="Full keyboard support without mouse dependency"
                checked={state.keyboardNavigation}
                onChange={() => toggle("keyboardNavigation")}
                badge="WCAG 2.1.1"
              />
              <ToggleRow
                icon={<Zap className="h-4 w-4" />}
                title="Focus Mode"
                desc="Reduce visual clutter for concentration"
                checked={state.focusMode}
                onChange={() => toggle("focusMode")}
                badge="Productivity"
              />
              <ToggleRow
                icon={<Type className="h-4 w-4" />}
                title="Larger Text"
                desc="200% zoom support for low vision users"
                checked={state.largerText}
                onChange={() => toggle("largerText")}
                badge="WCAG 1.4.4"
              />
              <ToggleRow
                icon={<Eye className="h-4 w-4" />}
                title="Reduce Cognitive Load"
                desc="Simplify complex interfaces and workflows"
                checked={state.cognitiveLoad}
                onChange={() => toggle("cognitiveLoad")}
                badge="UX Enhanced"
              />
            </CardContent>
          </Card>

          {/* Enterprise & Compliance Column */}
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Compliance & Team</CardTitle>
              </div>
              <CardDescription>Organization-wide settings and compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow
                icon={<Shield className="h-4 w-4" />}
                title="Screen Reader Hints"
                desc="ARIA labels and semantic HTML for assistive tech"
                checked={state.screenReaderHints}
                onChange={() => toggle("screenReaderHints")}
                badge="WCAG 4.1.2"
              />
              <ToggleRow
                icon={<Volume2 className="h-4 w-4" />}
                title="Auto-Generated Captions"
                desc="Automatic captions for multimedia content"
                checked={state.autoCaptions}
                onChange={() => toggle("autoCaptions")}
                badge="WCAG 1.2.2"
              />
              <ToggleRow
                icon={<Globe className="h-4 w-4" />}
                title="Industry Standards"
                desc="Enforce WCAG 2.1 AA across all interfaces"
                checked={state.industryStandards}
                onChange={() => toggle("industryStandards")}
                badge="Compliant"
              />
              <ToggleRow
                icon={<Check className="h-4 w-4" />}
                title="Export Settings"
                desc="Allow exporting accessibility configuration"
                checked={state.exportSettings}
                onChange={() => toggle("exportSettings")}
                badge="Audit Ready"
              />
            </CardContent>
          </Card>
        </div>

        {/* Enterprise Action Bar */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Organization Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Apply these settings to all team members and generate compliance reports
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={exportComplianceReport}
                  className="flex-1 sm:flex-none border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white"
                >
                  Export Compliance Report
                </Button>
                <Button 
                  variant="outline" 
                  onClick={applyToTeam}
                  className="flex-1 sm:flex-none border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white"
                >
                  Apply to Team
                </Button>
                <Button 
                  onClick={onSave}
                  className="flex-1 sm:flex-none bg-[#1B4332] hover:bg-[#2D5A4A] text-white"
                >
                  Save Organization Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
            <CardDescription>Your current accessibility compliance level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#1B4332]">AA</div>
                <div className="text-sm font-medium">WCAG 2.1 Level</div>
                <div className="text-xs text-muted-foreground mt-1">Current Compliance</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#2D5A4A]">14/14</div>
                <div className="text-sm font-medium">Standards Met</div>
                <div className="text-xs text-muted-foreground mt-1">ADA Requirements</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#52796F]">100%</div>
                <div className="text-sm font-medium">Team Coverage</div>
                <div className="text-xs text-muted-foreground mt-1">Settings Applied</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Forest Green Color Scheme CSS */}
        <style>{`
          .toggle-switch:checked {
            background-color: #1B4332 !important;
          }
          .toggle-switch:checked ~ .toggle-dot {
            transform: translateX(100%);
            background-color: white;
          }
          .forest-green-bg {
            background-color: #1B4332;
          }
          .forest-green-text {
            color: #1B4332;
          }
          .forest-green-border {
            border-color: #1B4332;
          }
          .forest-green-hover:hover {
            background-color: #2D5A4A;
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
}

function ToggleRow({ icon, title, desc, checked, onChange, badge }) {
  return (
    <div className="flex items-start justify-between gap-4 border border-border rounded-xl p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 bg-gray-100 rounded-lg mt-0.5">
          {icon}
        </div>
        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{title}</div>
            {badge && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{desc}</div>
        </div>
      </div>

      <label className="inline-flex items-center gap-2 select-none shrink-0">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={!!checked}
            onChange={onChange}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B4332]"></div>
        </div>
      </label>
    </div>
  );
}
