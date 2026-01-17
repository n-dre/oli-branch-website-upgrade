import React, { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../../frontend/src/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../frontend/src/components/ui/card";
import { Button } from "../../../frontend/src/components/ui/button";
import { Input } from "../../../frontend/src/components/ui/input";

export default function ReportAProblem() {
  const [form, setForm] = useState({
    subject: "",
    details: "",
    email: "",
  });

  const onSubmit = () => {
    if (!form.subject || !form.details) {
      toast.error("Subject and details are required.");
      return;
    }
    // POST /api/support/tickets
    toast.success("Report submitted.");
    setForm({ subject: "", details: "", email: "" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Report a problem</CardTitle>
            <CardDescription>Tell us what happened and we’ll investigate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Subject">
              <Input value={form.subject} onChange={(e) => setForm((s) => ({ ...s, subject: e.target.value }))} placeholder="Short description" />
            </Field>

            <Field label="Details">
              <textarea
                className="w-full min-h-[140px] rounded-xl border border-border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-foreground/20"
                value={form.details}
                onChange={(e) => setForm((s) => ({ ...s, details: e.target.value }))}
                placeholder="What did you do? What did you expect? What happened?"
              />
            </Field>

            <Field label="Contact email (optional)">
              <Input value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} placeholder="name@domain.com" />
            </Field>

            <div className="pt-2 flex justify-end">
              <Button onClick={onSubmit}>Submit</Button>
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
