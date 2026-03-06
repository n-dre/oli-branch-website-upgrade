// frontend/src/pages/tools/Help.jsx
import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, MessageSquare, FileText, Video, BookOpen, ChevronRight, Zap, Shield, Globe } from "lucide-react";
import HelpMiniChatModal from "../../components/help/HelpMiniChatModal";

export default function Help() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      title: "Getting Started",
      description: "Onboarding guides and first steps",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-blue-50 text-blue-600",
      items: ["Setup guide", "Account configuration", "User permissions"]
    },
    {
      title: "Documentation",
      description: "Comprehensive technical guides",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-purple-50 text-purple-600",
      items: ["API reference", "Integration guides", "Best practices"]
    },
    {
      title: "Security & Compliance",
      description: "Enterprise security features",
      icon: <Shield className="h-5 w-5" />,
      color: "bg-green-50 text-green-600",
      items: ["Data encryption", "Access controls", "Audit logs"]
    },
    {
      title: "Global Support",
      description: "24/7 international assistance",
      icon: <Globe className="h-5 w-5" />,
      color: "bg-orange-50 text-orange-600",
      items: ["Multi-language", "Regional contacts", "SLA details"]
    }
  ];

  const quickActions = [
    {
      title: "Contact Support",
      description: "Reach our technical support team",
      icon: <MessageSquare className="h-5 w-5" />,
      action: () => window.open("mailto:support@company.com", "_blank")
    },
    {
      title: "View Tutorials",
      description: "Step-by-step video guides",
      icon: <Video className="h-5 w-5" />,
      action: () => window.open("/tutorials", "_blank")
        },
    {
      title: "Knowledge Base",
      description: "Browse our documentation",
      icon: <FileText className="h-5 w-5" />,
      action: () => window.open("/education/articles/index.html", "_blank")
    }
  ];
    const popularQuestions = [
      "Why am I paying banking fees I don’t recognize?",
      "Which bank products don’t match my business profile?",
      "Where are cash flow leaks coming from each month?",
      "Am I using the wrong account type for my business activity?",
      "What banking changes would reduce my monthly costs?"
    ];
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white mb-2">Help Center</h1>
          <p className="text-lg text-gray-600">
            Get assistance, browse documentation, or chat with Oli — our AI assistant powered by OpenAI.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="search"
            placeholder="Search help articles, documentation, or ask a question..."
            className="pl-12 py-6 text-lg rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* AI Assistant Card - Prominent */}
        <Card className="rounded-xl border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Chat with Oli AI Assistant</h2>
                    <p className="text-gray-600">
                      Get instant answers to your questions. Oli can help with technical issues, guide you through features, and provide documentation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => setOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                  >
                    Start Conversation
                  </Button>
                  <div className="text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Enterprise-grade security
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Categories Grid */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Help Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpCategories.map((category, index) => (
              <Card key={index} className="rounded-lg hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`${category.color} p-3 rounded-lg`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{category.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      <ul className="space-y-1">
                        {category.items.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-500 flex items-center gap-1">
                            <ChevronRight className="h-3 w-3" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Two-column layout for Quick Actions and Popular Questions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common support actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full text-left border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-500 group-hover:text-blue-600">
                      {action.icon}
                    </div>
                    <div>
                      <div className="font-medium">{action.title}</div>
                      <div className="text-sm text-gray-500">{action.description}</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Popular Questions */}
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg">Popular Questions</CardTitle>
              <CardDescription>Frequently asked by teams</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {popularQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setSearchQuery(question)}
                  className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                >
                  {question}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 pt-8 border-t">
          <p>
            Need enterprise-level support? Contact our dedicated account team or 
            <a href="/enterprise-support" className="text-blue-600 hover:underline ml-1">
              explore enterprise plans
            </a>
          </p>
        </div>
      </div>

      <HelpMiniChatModal open={open} onOpenChange={setOpen} />
    </DashboardLayout>
  );
}

