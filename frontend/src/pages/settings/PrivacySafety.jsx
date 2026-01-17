import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../../frontend/src/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../frontend/src/components/ui/card";
import { Button } from "../../../frontend/src/components/ui/button";

export default function PrivacySafety() {
  const [state, setState] = useState({
    profileDiscoverable: false,
    analyticsOptIn: false,
    personalizedInsights: true,
    allowDataExport: true,
  });

  const toggle = (key) => setState((s) => ({ ...s, [key]: !s[key] }));

  const onSave = () => {
    // PUT /api/settings/privacy
    toast.success("Privacy & safety settings saved.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Privacy & safety</CardTitle>
            <CardDescription>Control visibility, tracking, and data controls.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow
              title="Profile discoverability"
              desc="Allow your profile to appear in app discovery surfaces."
              checked={state.profileDiscoverable}
              onChange={() => toggle("profileDiscoverable")}
            />
            <ToggleRow
              title="Analytics"
              desc="Help improve the app by sharing anonymous usage analytics."
              checked={state.analyticsOptIn}
              onChange={() => toggle("analyticsOptIn")}
            />
            <ToggleRow
              title="Personalized insights"
              desc="Use your activity to generate tailored insights."
              checked={state.personalizedInsights}
              onChange={() => toggle("personalizedInsights")}
            />
            <ToggleRow
              title="Data export access"
              desc="Allow exporting your data from the settings page."
              checked={state.allowDataExport}
              onChange={() => toggle("allowDataExport")}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => toast.message("Export queued (wire API).")}>
                Export data
              </Button>
              <Button onClick={onSave}>Save</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function ToggleRow({ title, desc, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 border border-border rounded-xl p-4">
      <div className="space-y-1">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
      </div>
      <input type="checkbox" className="h-5 w-5 accent-foreground" checked={!!checked} onChange={onChange} />
    </div>
  );
}
