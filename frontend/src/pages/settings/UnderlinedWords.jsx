import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../../frontend/src/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../frontend/src/components/ui/card";
import { Button } from "../../../frontend/src/components/ui/button";

export default function UnderlinedWords() {
  const [state, setState] = useState({
    enableUnderlines: true,
    showDefinitions: true,
    highlightFinancialTerms: true,
  });

  const toggle = (k) => setState((s) => ({ ...s, [k]: !s[k] }));

  const onSave = () => {
    // PUT /api/settings/underlines
    toast.success("Underlined words settings saved.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Underlined words</CardTitle>
            <CardDescription>Control term underlines and definition behavior.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow title="Enable underlined words" desc="Underline recognized terms and concepts." checked={state.enableUnderlines} onChange={() => toggle("enableUnderlines")} />
            <ToggleRow title="Show definitions on hover/tap" desc="Quick definitions for underlined terms." checked={state.showDefinitions} onChange={() => toggle("showDefinitions")} />
            <ToggleRow title="Highlight financial terms" desc="Prioritize finance-related vocabulary." checked={state.highlightFinancialTerms} onChange={() => toggle("highlightFinancialTerms")} />

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
