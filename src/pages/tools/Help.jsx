import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import HelpMiniChatModal from "../../components/Help/HelpMiniChatModal";

export default function Help() {
  const [open, setOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Help</CardTitle>
            <CardDescription>Quick links and support actions.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Clicking Help triggers the mini window */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full text-left border border-border rounded-xl p-4 hover:bg-muted/40 transition-colors"
            >
              <div className="font-semibold">Open Help chat</div>
              <div className="text-sm text-muted-foreground">
                Ask a general question. “Hi, I’m Ollie. How can I help you today?”
              </div>
            </button>

            {/* Keep your other Help actions here if you want */}
          </CardContent>
        </Card>
      </div>

      <HelpMiniChatModal open={open} onOpenChange={setOpen} />
    </DashboardLayout>
  );
}
