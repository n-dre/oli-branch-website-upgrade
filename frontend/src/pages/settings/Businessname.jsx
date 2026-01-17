import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../../frontend/src/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../frontend/src/components/ui/card";
import { Button } from "../../../frontend/src/components/ui/button";
import { Input } from "../../../frontend/src/components/ui/input";

export default function Businessname() {
  const [businessName, setBusinessName] = useState("");
  const [dba, setDba] = useState("");

  const onSave = () => {
    // PUT /api/settings/business
    toast.success("Business name saved.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Businessname</CardTitle>
            <CardDescription>Update your business identity and display name.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Legal business name">
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g., Oli-Branch LLC" />
            </Field>

            <Field label="DBA / Display name (optional)">
              <Input value={dba} onChange={(e) => setDba(e.target.value)} placeholder="e.g., Oli-Branch" />
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
