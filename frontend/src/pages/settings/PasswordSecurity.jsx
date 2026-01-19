import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

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
    mfaEnabled: false,
  }));

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSave = () => {
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    // TODO: PUT /api/settings/security
    // If this came from reset flow, backend should allow saving without currentPassword
    toast.success("Security settings saved.");

    // Optional: clear router state so it doesn't keep prefilling if user comes back
    if (resetPayload?.fromResetFlow) {
      navigate(location.pathname, { replace: true, state: null });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Password & security</CardTitle>
            <CardDescription>Update your password and security controls.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Current password">
                <Input
                  type="password"
                  value={form.currentPassword}
                  onChange={(e) => set("currentPassword", e.target.value)}
                  placeholder={resetPayload?.fromResetFlow ? "Not required (reset flow)" : ""}
                />
              </Field>
              <div />
              <Field label="New password">
                <Input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => set("newPassword", e.target.value)}
                />
              </Field>
              <Field label="Confirm new password">
                <Input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                />
              </Field>
            </div>

            <div className="flex items-start justify-between gap-4 border border-border rounded-xl p-4">
              <div className="space-y-1">
                <div className="font-semibold">Multi-factor authentication (MFA)</div>
                <div className="text-sm text-muted-foreground">Add a second step to verify sign-ins.</div>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 accent-foreground"
                checked={!!form.mfaEnabled}
                onChange={() => set("mfaEnabled", !form.mfaEnabled)}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={onSave}>Save</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold">{label}</div>
      {children}
    </div>
  );
}
