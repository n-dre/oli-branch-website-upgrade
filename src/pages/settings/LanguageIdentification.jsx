import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function LanguageIdentification() {
  const [state, setState] = useState({
    autoDetect: true,
    preferredLanguage: "English",
    secondaryLanguage: "",
  });

  const onSave = () => {
    // PUT /api/settings/language
    toast.success("Language settings saved.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Language identification</CardTitle>
            <CardDescription>Configure language detection and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between gap-4 border border-border rounded-xl p-4">
              <div className="space-y-1">
                <div className="font-semibold">Auto-detect language</div>
                <div className="text-sm text-muted-foreground">Detect language based on your input.</div>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 accent-foreground"
                checked={!!state.autoDetect}
                onChange={() => setState((s) => ({ ...s, autoDetect: !s.autoDetect }))}
              />
            </div>

            <Field label="Preferred language">
              <Input value={state.preferredLanguage} onChange={(e) => setState((s) => ({ ...s, preferredLanguage: e.target.value }))} />
            </Field>

            <Field label="Secondary language (optional)">
              <Input value={state.secondaryLanguage} onChange={(e) => setState((s) => ({ ...s, secondaryLanguage: e.target.value }))} />
            </Field>

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
