// src/pages/HowItWorks.jsx
import React from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CheckCircle, FileText, Shield, BarChart3, Zap } from "lucide-react";

export default function HowItWorks() {
  return (
    <DashboardLayout
      title="How It Works"
      subtitle="Understand the Oli-Branch audit flow and what you get back"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="border-[#52796F]/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1B4332]">
              <Zap className="w-5 h-5" />
              Overview
            </CardTitle>
            <CardDescription className="text-[#52796F]">
              The platform walks you through an audit, scores risk, and generates actionable outputs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-[#52796F]/10 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-[#1B4332]" />
                  <p className="font-semibold text-[#1B4332]">1) Create an Audit</p>
                </div>
                <p className="text-sm text-[#52796F]">
                  Start a new audit, enter business details + financial inputs, and save progress.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-[#52796F]/10 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-[#1B4332]" />
                  <p className="font-semibold text-[#1B4332]">2) Get a Health Score</p>
                </div>
                <p className="text-sm text-[#52796F]">
                  Your inputs produce a score + status label. The goal is clarity, not fluff.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-[#52796F]/10 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-[#1B4332]" />
                  <p className="font-semibold text-[#1B4332]">3) Review Analytics</p>
                </div>
                <p className="text-sm text-[#52796F]">
                  See risk distribution and fee vs revenue trends across your audits.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-[#52796F]/10 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-[#1B4332]" />
                  <p className="font-semibold text-[#1B4332]">4) Take Action</p>
                </div>
                <p className="text-sm text-[#52796F]">
                  Use quick actions to run checks, compare products, and generate reports.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Badge className="bg-[#1B4332]/10 text-[#1B4332] border border-[#1B4332]/20">
                Audit → Score → Risk → Recommendations
              </Badge>
              <Badge className="bg-[#52796F]/10 text-[#52796F] border border-[#52796F]/20">
                Built for small-business banking mismatch
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#52796F]/10">
          <CardHeader>
            <CardTitle className="text-[#1B4332]">What you should do first</CardTitle>
            <CardDescription className="text-[#52796F]">
              If you’re brand new, follow the Quick Start Guide.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#52796F]">
              Go to <span className="font-semibold text-[#1B4332]">Quick Start Guide</span> and complete:
              Profile → First Audit → Financial Health → Review Dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
