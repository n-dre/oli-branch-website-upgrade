import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../../frontend/src/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../frontend/src/components/ui/card";
import { Button } from "../../../frontend/src/components/ui/button";
import { Input } from "../../../frontend/src/components/ui/input";

export default function PersonalDetails() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zip: "",
  });

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSave = () => {
    // PUT /api/settings/personal
    toast.success("Personal details saved.");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Personal details</CardTitle>
            <CardDescription>Manage your account identity and contact details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="First name">
                <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
              </Field>
              <Field label="Last name">
                <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
              </Field>
              <Field label="Email">
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="Phone">
                <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field label="City">
                <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
              </Field>
              <Field label="State">
                <Input value={form.state} onChange={(e) => set("state", e.target.value)} />
              </Field>
              <Field label="ZIP">
                <Input value={form.zip} onChange={(e) => set("zip", e.target.value)} />
              </Field>
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
