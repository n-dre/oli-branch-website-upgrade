import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../../frontend/src/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../frontend/src/components/ui/card";
import { Button } from "../../../frontend/src/components/ui/button";

export default function NotificationsSounds() {
  const [state, setState] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true,
    sounds: true,
  });

  const toggle = (k) => setState((s) => ({ ...s, [k]: !s[k] }));

  const onSave = () => {
    // PUT /api/settings/notifications
    toast.success("Notification settings saved.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Notifications & sounds</CardTitle>
            <CardDescription>Choose how you get notified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow title="Email alerts" desc="Receive important updates by email." checked={state.emailAlerts} onChange={() => toggle("emailAlerts")} />
            <ToggleRow title="SMS alerts" desc="Receive urgent alerts via text." checked={state.smsAlerts} onChange={() => toggle("smsAlerts")} />
            <ToggleRow title="Push notifications" desc="Show notifications on your device." checked={state.pushAlerts} onChange={() => toggle("pushAlerts")} />
            <ToggleRow title="Sounds" desc="Play sounds for notifications." checked={state.sounds} onChange={() => toggle("sounds")} />

            <div className="pt-2 flex justify-end">
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