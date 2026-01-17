import React from "react";
import DashboardLayout from "../../../frontend/src/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../frontend/src/components/ui/card";

export default function LegalPolicies() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Legal & policies</CardTitle>
            <CardDescription>Review legal documents and policy disclosures.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <DocRow title="Terms of Service" desc="Rules and conditions for using the platform." />
            <DocRow title="Privacy Policy" desc="How data is collected, used, and protected." />
            <DocRow title="Cookie Policy" desc="Cookie usage and preferences." />
            <DocRow title="Security Disclosure" desc="How we handle security and reporting." />

            <div className="text-sm text-muted-foreground pt-2">
              Wire these rows to your policy routes or external documents.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function DocRow({ title, desc }) {
  return (
    <div className="border border-border rounded-xl p-4">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground mt-1">{desc}</div>
    </div>
  );
}
