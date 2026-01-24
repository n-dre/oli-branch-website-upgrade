import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  Shield,
  Lock,
  Key,
  RefreshCw,
  Smartphone,
  Users,
  Eye,
  EyeOff,
  CheckCircle,
  FileText,
  Database,
  Clock,
  Globe
} from "lucide-react";

export default function PasswordSecurity() {
  const location = useLocation();
  const navigate = useNavigate();

  // Read reset payload once (no effect)
  const resetPayload = useMemo(() => {
    const st = location.state;
    if (st?.fromResetFlow && st?.newPassword) {
      return {
        fromResetFlow: true,
        newPassword: st.newPassword,
        confirmPassword: st.confirmPassword ?? st.newPassword,
      };
    }
    return null;
  }, [location.state]);

  const [form, setForm] = useState(() => ({
    currentPassword: "",
    newPassword: resetPayload?.newPassword ?? "",
    confirmPassword: resetPayload?.confirmPassword ?? "",
    mfaEnabled: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    adminApproval: false,
    auditLogging: true,
    ipRestriction: false,
    encryptionLevel: "enterprise",
  }));

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSave = () => {
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("Password confirmation mismatch. Please ensure both fields match.");
      return;
    }

    // TODO: PUT /api/settings/security
    // If this came from reset flow, backend should allow saving without currentPassword
    toast.success("Enterprise security policies have been updated and applied across your organization.");
    
    // Optional: clear router state so it doesn't keep prefilling if user comes back
    if (resetPayload?.fromResetFlow) {
      navigate(location.pathname, { replace: true, state: null });
    }
  };

  const generateComplianceReport = () => {
    toast.info("Generating SOC 2 & ISO 27001 compliance report...");
  };

  const enforceToTeam = () => {
    toast.success("Security policies enforced across all team members.");
  };

  const passwordStrength = form.newPassword ? 
    (form.newPassword.length >= 12 ? "Strong" : 
     form.newPassword.length >= 8 ? "Medium" : "Weak") : "None";

  const strengthColor = {
    "Strong": "text-green-600",
    "Medium": "text-yellow-600",
    "Weak": "text-red-600",
    "None": "text-gray-400"
  }[passwordStrength];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {/* Enterprise Security Header */}
        <Card className="rounded-2xl border-l-4 border-l-[#1B4332]">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E8F5E9] rounded-lg">
                <Shield className="h-6 w-6 text-[#1B4332]" />
              </div>
              <div>
                <CardTitle className="text-xl">Enterprise Security Center</CardTitle>
                <CardDescription>
                  Manage organization-wide security policies, compliance settings, and access controls.
                  All settings comply with enterprise security standards.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Authentication Column */}
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Authentication</CardTitle>
              </div>
              <CardDescription>Password policies and user verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="Current Password" icon={<Key className="h-4 w-4" />}>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={form.currentPassword}
                    onChange={(e) => set("currentPassword", e.target.value)}
                    placeholder={resetPayload?.fromResetFlow ? "Not required (reset flow)" : "Enter current password"}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <Field label="New Password" icon={<RefreshCw className="h-4 w-4" />}>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={form.newPassword}
                    onChange={(e) => set("newPassword", e.target.value)}
                    placeholder="Minimum 12 characters"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.newPassword && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`text-xs font-medium ${strengthColor}`}>
                      Strength: {passwordStrength}
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          passwordStrength === "Strong" ? "bg-green-500 w-full" :
                          passwordStrength === "Medium" ? "bg-yellow-500 w-2/3" :
                          passwordStrength === "Weak" ? "bg-red-500 w-1/3" : "w-0"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </Field>

              <Field label="Confirm Password" icon={<CheckCircle className="h-4 w-4" />}>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    placeholder="Re-enter new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {form.confirmPassword && form.newPassword === form.confirmPassword && form.newPassword && (
                  <div className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Passwords match
                  </div>
                )}
              </Field>
            </CardContent>
          </Card>

          {/* Multi-Factor & Sessions Column */}
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">MFA & Sessions</CardTitle>
              </div>
              <CardDescription>Advanced access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-4 border border-border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="font-semibold flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Multi-factor Authentication
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Required</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Enterprise MFA with TOTP, SMS, or biometrics</div>
                </div>
                <label className="inline-flex items-center gap-2 select-none shrink-0">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!!form.mfaEnabled}
                      onChange={() => set("mfaEnabled", !form.mfaEnabled)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B4332]"></div>
                  </div>
                </label>
              </div>

              <Field label="Session Timeout" icon={<Clock className="h-4 w-4" />}>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={form.sessionTimeout}
                    onChange={(e) => set("sessionTimeout", parseInt(e.target.value) || 30)}
                    min="5"
                    max="1440"
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Auto-logout after inactivity</div>
              </Field>

              <Field label="Password Expiry" icon={<RefreshCw className="h-4 w-4" />}>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={form.passwordExpiry}
                    onChange={(e) => set("passwordExpiry", parseInt(e.target.value) || 90)}
                    min="1"
                    max="365"
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Force password rotation</div>
              </Field>
            </CardContent>
          </Card>

          {/* Enterprise Controls Column */}
          <Card className="rounded-2xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Enterprise Controls</CardTitle>
              </div>
              <CardDescription>Organization-wide security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-4 border border-border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Admin Approval Required
                  </div>
                  <div className="text-sm text-muted-foreground">Sensitive changes require admin review</div>
                </div>
                <label className="inline-flex items-center gap-2 select-none shrink-0">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!!form.adminApproval}
                      onChange={() => set("adminApproval", !form.adminApproval)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B4332]"></div>
                  </div>
                </label>
              </div>

              <div className="flex items-start justify-between gap-4 border border-border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="font-semibold flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Audit Logging
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">SOC 2</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Log all security events for compliance</div>
                </div>
                <label className="inline-flex items-center gap-2 select-none shrink-0">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!!form.auditLogging}
                      onChange={() => set("auditLogging", !form.auditLogging)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B4332]"></div>
                  </div>
                </label>
              </div>

              <div className="flex items-start justify-between gap-4 border border-border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-1 flex-1">
                  <div className="font-semibold flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    IP Restriction
                  </div>
                  <div className="text-sm text-muted-foreground">Limit access to approved IP addresses</div>
                </div>
                <label className="inline-flex items-center gap-2 select-none shrink-0">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={!!form.ipRestriction}
                      onChange={() => set("ipRestriction", !form.ipRestriction)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B4332]"></div>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise Action Bar */}
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Organization Security Policies</h3>
                <p className="text-sm text-muted-foreground">
                  Apply these security settings across your entire organization and generate compliance reports
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={generateComplianceReport}
                  className="flex-1 sm:flex-none border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Compliance Report
                </Button>
                <Button 
                  variant="outline" 
                  onClick={enforceToTeam}
                  className="flex-1 sm:flex-none border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Enforce to Team
                </Button>
                <Button 
                  onClick={onSave}
                  className="flex-1 sm:flex-none bg-[#1B4332] hover:bg-[#2D5A4A] text-white"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Save Security Policies
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Status */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Security Status</CardTitle>
            <CardDescription>Your current security compliance level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div className="text-sm font-medium mt-2">MFA Enabled</div>
                <div className="text-xs text-muted-foreground">Required for all users</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#1B4332]">A+</div>
                <div className="text-sm font-medium">Encryption Grade</div>
                <div className="text-xs text-muted-foreground">Enterprise TLS 1.3</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#2D5A4A]">24/7</div>
                <div className="text-sm font-medium">Monitoring</div>
                <div className="text-xs text-muted-foreground">Real-time threat detection</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#52796F]">SOC 2</div>
                <div className="text-sm font-medium">Compliance</div>
                <div className="text-xs text-muted-foreground">Type II Certified</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function Field({ label, children, icon }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold flex items-center gap-2">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}
