import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../../frontend/src/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../frontend/src/components/ui/card";
import { Button } from "../../../frontend/src/components/ui/button";

export default function Memories() {
  const [state, setState] = useState({
    enableMemories: true,
    allowPersonalization: true,
    autoSummaries: false,
  });

  const toggle = (k) => setState((s) => ({ ...s, [k]: !s[k] }));

  const onSave = () => {
    // PUT /api/settings/memories
    toast.success("Memories settings saved.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Memories</CardTitle>
            <CardDescription>Control memory and personalization behavior.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow title="Enable memories" desc="Allow the app to remember preferences and context." checked={state.enableMemories} onChange={() => toggle("enableMemories")} />
            <ToggleRow title="Personalization" desc="Use memory to personalize insights and experiences." checked={state.allowPersonalization} onChange={() => toggle("allowPersonalization")} />
            <ToggleRow title="Auto summaries" desc="Create automatic summaries of activity (if available)." checked={state.autoSummaries} onChange={() => toggle("autoSummaries")} />

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => toast.message("Clear memory queued (wire API).")}>
                Clear memories
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
