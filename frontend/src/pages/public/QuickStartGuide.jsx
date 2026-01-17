// src/pages/QuickStartGuide.jsx
import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../../frontend/src/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../frontend/src/components/ui/card";
import { Button } from "../../../frontend/src/components/ui/button";
import { CheckCircle, User, FileText, Shield, ChevronRight } from "lucide-react";

export default function QuickStartGuide() {
  return (
    <DashboardLayout
      title="Quick Start Guide"
      subtitle="Do these steps in order to get your first real dashboard"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="border-[#52796F]/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#1B4332]">
              <CheckCircle className="w-5 h-5" />
              10-minute setup
            </CardTitle>
            <CardDescription className="text-[#52796F]">
              This sets your business name, creates your first audit, and generates a score.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 rounded-lg border border-[#52796F]/10 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#1B4332]" />
                    <p className="font-semibold text-[#1B4332]">Step 1: Set your business name</p>
                  </div>
                  <Link to="/profile">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#1B4332] text-[#1B4332] hover:bg-[#52796F]/15"
                    >
                      Go to Profile <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-[#52796F] mt-2">
                  Update <span className="font-semibold text-[#1B4332]">Company Name</span>. That name will appear in the Dashboard welcome banner.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-[#52796F]/10 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1B4332]" />
                    <p className="font-semibold text-[#1B4332]">Step 2: Create your first audit</p>
                  </div>
                  <Link to="/intake">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#1B4332] text-[#1B4332] hover:bg-[#52796F]/15"
                    >
                      New Audit <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-[#52796F] mt-2">
                  Fill the minimum fields and submit. You’ll see audit counts, risk distribution, and recent audits populate.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-[#52796F]/10 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#1B4332]" />
                    <p className="font-semibold text-[#1B4332]">Step 3: Run a health check</p>
                  </div>
                  <Link to="/health">
                    <Button
                      size="sm"
                      className="bg-white text-[#1B4332] hover:bg-[#52796F]/15 border border-white"
                    >
                      Start Health Check <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-[#52796F] mt-2">
                  Once completed, the score and status show up across the dashboard cards.
                </p>
              </div>

              <div className="p-4 rounded-lg border border-[#52796F]/10 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-[#1B4332]">Step 4: Return to Dashboard</p>
                  <Link to="/dashboard">
                    <Button className="bg-[#1B4332] text-[#F8F5F0] hover:bg-[#52796F]">
                      Back to Dashboard <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-[#52796F] mt-2">
                  You’ll now see: audits count, completion rate, risk breakdown, charts, and recent audit list.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#52796F]/10">
          <CardHeader>
            <CardTitle className="text-[#1B4332]">Need the concept first?</CardTitle>
            <CardDescription className="text-[#52796F]">
              Read the flow end-to-end.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/HowItWorks">
              <Button
                variant="outline"
                className="border-[#1B4332] text-[#1B4332] hover:bg-[#52796F]/15"
              >
                Open How It Works <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
