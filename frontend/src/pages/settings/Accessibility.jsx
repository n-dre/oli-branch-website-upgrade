import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export default function Accessibility() {
  const navigate = useNavigate();

  const [state, setState] = useState({
    reduceMotion: false,
    highContrast: false,
    largerText: false,
    screenReaderHints: true,
  });

  const toggle = (key) => setState((s) => ({ ...s, [key]: !s[key] }));

  const onSave = () => {
    // Hook this to API later (PUT /api/settings/accessibility)
    toast.success("Accessibility settings saved.");
    navigate("/settings");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Accessibility</CardTitle>
            <CardDescription>Adjust accessibility preferences across the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow
              title="Reduce motion"
              desc="Minimize animations and transitions."
              checked={state.reduceMotion}
              onChange={() => toggle("reduceMotion")}
            />
            <ToggleRow
              title="High contrast"
              desc="Increase contrast for better readability."
              checked={state.highContrast}
              onChange={() => toggle("highContrast")}
            />
            <ToggleRow
              title="Larger text"
              desc="Increase base text size."
              checked={state.largerText}
              onChange={() => toggle("largerText")}
            />
            <ToggleRow
              title="Screen reader hints"
              desc="Show additional labels and hints for assistive tech."
              checked={state.screenReaderHints}
              onChange={() => toggle("screenReaderHints")}
            />

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

      <label className="inline-flex items-center gap-2 select-none">
        <input
          type="checkbox"
          className="h-5 w-5 accent-foreground"
          checked={!!checked}
          onChange={onChange}
        />
      </label>
    </div>
  );
}

