/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Lightbulb,
  Download,
  ArrowLeft,
  CheckCircle,
  Building,
  Clock,
  Zap,
  Brain,
  Search,
  Banknote,
  Target,
  Lock,
  Star,
  Mic,
  MicOff,
  Volume2,
  FileText,
  Phone,
  Mail,
  MapPin,
  Globe,
  Shield,
  Users,
  BookOpen,
  Calendar,
  CreditCard,
  BarChart3,
  ChevronRight,
  Map,
} from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";

import AssessmentCalendar from "../../components/calendar/AssessmentCalendar";

const SEVERITY_COLORS = {
  critical: "#DC2626",
  high: "#F59E0B",
  medium: "#3B82F6",
  low: "#10B981",
  excellent: "#1B4332",
};

// AI Agent Oli Configuration
const OLI_AGENT_CONFIG = {
  name: "Oli",
  role: "Financial Intelligence Agent",
  capabilities: [
    "Voice-activated analysis",
    "Fee leakage detection",
    "Personalized recommendations",
    "Government resource matching",
    "Local financial assistance",
  ],
  voiceCommands: [
    "Hey Oli, analyze my finances",
    "Hey Oli, find financial leaks",
    "Hey Oli, show recommendations",
    "Hey Oli, help me save money",
    "Hey Oli, generate report",
  ],
  activationPhrase: "hey oli",
};

export default function FinancialLeaks() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  
  // State for AI agent simulation
  const [oliStatus, setOliStatus] = useState("idle"); // idle, analyzing, complete
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [detectedLeaks, setDetectedLeaks] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Key Mismatch Areas data
  const keyMismatchAreas = [
    "Relies on cash deposits",
    "Grant navigation needed",
    "High ATM fees with current bank",
    "Insufficient fee waivers for business accounts",
    "Lack of free wire transfer services",
  ];

  // Bank Recommendations data
  const bankRecommendations = [
    {
      name: "Citizens Bank",
      description: "Cash-friendly deposit policies",
      features: ["Unlimited cash deposits", "Low business account fees", "Local branch network", "Mobile check deposit"],
      matchScore: 92,
      contact: "Visit local branch or call 1-800-922-9999",
      icon: <Banknote className="h-5 w-5" />,
      color: "#1B4332"
    },
    {
      name: "MIT Federal Credit Union",
      description: "Lower cash-handling costs",
      features: ["Reduced cash deposit fees", "Community-focused banking", "Financial counseling", "ATM fee rebates"],
      matchScore: 88,
      contact: "Call (617) 253-2845 or visit mitfcu.org",
      icon: <Shield className="h-5 w-5" />,
      color: "#3B82F6"
    },
    {
      name: "Bank of America Business Advantage",
      description: "Integrated cash management",
      features: ["Advanced cash flow tools", "Merchant services", "Business credit options", "Nationwide ATMs"],
      matchScore: 85,
      contact: "Schedule appointment at local branch",
      icon: <CreditCard className="h-5 w-5" />,
      color: "#DC2626"
    }
  ];

  // Grant & Funding Resources data
  const grantResources = [
    {
      name: "City Micro-Grant",
      description: "Local startup support; quick turn-around",
      features: ["Up to $10,000 funding", "3-month approval process", "Business mentoring", "Networking events"],
      matchScore: 95,
      contact: "Apply at citysmallbusiness.gov",
      icon: <Map className="h-5 w-5" />,
      color: "#10B981"
    },
    {
      name: "SBA Resources",
      description: "SBA resources for Massachusetts",
      features: ["Loan guarantees", "Business counseling", "Government contracting help", "Disaster assistance"],
      matchScore: 90,
      contact: "Visit sba.gov/ma or call 1-800-827-5722",
      icon: <Globe className="h-5 w-5" />,
      color: "#F59E0B"
    },
    {
      name: "State Programs",
      description: "Find SSBCI in Massachusetts",
      features: ["State Small Business Credit Initiative", "Capital access programs", "Loan participation", "Collateral support"],
      matchScore: 88,
      contact: "Visit mass.gov/ssbci",
      icon: <MapPin className="h-5 w-5" />,
      color: "#8B5CF6"
    }
  ];

  // Handle PDF download
  const handleDownloadPDF = useCallback(() => {
    toast.success("PDF Report Generated!", {
      description: "Your personalized financial report has been downloaded",
    });
  }, []);

  // Simulate AI agent analysis
  const simulateOliAnalysis = useCallback(async () => {
    setOliStatus("analyzing");
    setAnalysisProgress(0);
    
    // Simulate analysis steps
    const steps = [
      "Analyzing banking patterns...",
      "Detecting cash handling inefficiencies...",
      "Identifying grant opportunities...",
      "Matching local resources...",
      "Generating action plan...",
      "Compiling recommendations..."
    ];
    
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(((i + 1) / steps.length) * 100);
      
      // Update status message
      if (i < steps.length - 1) {
        toast.info(`Oli: ${steps[i]}`, {
          duration: 1500,
        });
      }
    }
    
    // Generate mock analysis results
    const mockLeaks = [
      {
        id: 1,
        type: "atm_fees",
        name: "ATM Fees",
        description: "Excessive out-of-network ATM usage detected",
        amount: 87.50,
        count: 7,
        severity: "high",
        avoidable: true,
        recommendation: "Switch to a bank with ATM fee reimbursement",
        pattern: "Monthly pattern detected: 2-3 out-of-network withdrawals"
      },
      {
        id: 2,
        type: "cash_deposit_fees",
        name: "Cash Deposit Fees",
        description: "High fees for cash deposits",
        amount: 45.00,
        count: 4,
        severity: "high",
        avoidable: true,
        recommendation: "Use banks with cash-friendly policies",
        pattern: "Weekly cash deposits incurring fees"
      },
      {
        id: 3,
        type: "maintenance_fees",
        name: "Monthly Maintenance",
        description: "Account maintenance fee could be waived",
        amount: 25.00,
        count: 3,
        severity: "medium",
        avoidable: true,
        recommendation: "Maintain minimum balance to waive fee",
        pattern: "Consistent monthly charge"
      }
    ];
    
    setDetectedLeaks(mockLeaks);
    
    // Complete analysis
    setOliStatus("complete");
    setShowResults(true);
    
    toast.success("Oli analysis complete!", {
      description: "Found key mismatches and personalized recommendations",
    });
  }, []);

  // Handle voice command - wrapped in useCallback
  const handleVoiceCommand = useCallback((command) => {
    console.log("Voice command detected:", command);
    
    if (command.includes("analyze") || command.includes("financial")) {
      toast.success("Voice command received!", {
        description: "Starting AI analysis of your finances",
      });
      simulateOliAnalysis();
    } else if (command.includes("report") || command.includes("generate")) {
      toast.success("Voice command received!", {
        description: "Generating PDF report",
      });
      handleDownloadPDF();
    } else if (command.includes("recommend") || command.includes("help")) {
      toast.success("Voice command received!", {
        description: "Showing personalized recommendations",
      });
      if (!showResults) {
        simulateOliAnalysis();
      }
    } else if (command.includes("stop") || command.includes("end")) {
      toast.info("Voice recognition stopped");
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  }, [simulateOliAnalysis, handleDownloadPDF, showResults]);

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const combinedTranscript = (finalTranscript + interimTranscript).toLowerCase();

        // Check for activation phrase
        if (combinedTranscript.includes(OLI_AGENT_CONFIG.activationPhrase)) {
          handleVoiceCommand(combinedTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          toast.error("Microphone access denied", {
            description: "Please enable microphone access to use voice commands",
          });
        }
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      console.warn('Speech recognition not supported');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [handleVoiceCommand]);

  // Initialize with demo data on component mount
  useEffect(() => {
    // Auto-start demo analysis after 2 seconds
    const timer = setTimeout(() => {
      simulateOliAnalysis();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [simulateOliAnalysis]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error("Voice recognition not supported", {
        description: "Your browser doesn't support voice recognition",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info("Listening for 'Hey Oli'...", {
        duration: 2000,
      });
    }
  };

  // Handle manual analysis trigger
  const handleAnalyzeClick = () => {
    simulateOliAnalysis();
  };

  // Calculate totals
  const totalFees = detectedLeaks.reduce((sum, leak) => sum + leak.amount, 0);
  const avoidableFees = detectedLeaks
    .filter(leak => leak.avoidable)
    .reduce((sum, leak) => sum + leak.amount, 0);
  const savingsPotential = avoidableFees * 12; // Annual projection

  return (
    <DashboardLayout title="Financial Leaks" subtitle="AI-powered bank fee analysis by Oli Agent" className="bg-[#F8F5F0]">
      <style>{`
        .btn-primary {
          background: #1B4332 !important;
          color: #ffa200 !important;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          background: #52796F !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3);
        }
        .btn-secondary {
          border: 2px solid #1B4332 !important;
          color: #1B4332 !important;
          background: transparent !important;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: #1B4332 !important;
          color: #ffa200 !important;
        }
        .btn-disabled {
          background: #94a3b8 !important;
          color: #f1f5f9 !important;
          cursor: not-allowed !important;
          opacity: 0.7 !important;
        }
        .btn-voice {
          background: linear-gradient(135deg, #b9b9b9 0%, #3B82F6 100%) !important;
          color: white !important;
          animation: pulse 2s infinite;
        }
        .achievement-card {
          border-left: 4px solid #c7c7c7 !important;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
        }
        .stats-card {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
          border: 1px solid rgba(82, 121, 111, 0.1);
        }
        .progress-gradient {
          background: linear-gradient(90deg, #1B4332 0%, #52796F 100%);
        }
        .demo-banner {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          margin-bottom: 16px;
        }
        .pulse-animation {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
        }
        .mismatch-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 12px;
        }
        .mismatch-item::before {
          content: "•";
          color: #b9b9b9;
          font-size: 24px;
          line-height: 1;
        }
        .next-step-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 16px;
          border-left: 4px solid #1B4332;
          box-shadow: 0 2px 8px rgba(27, 67, 50, 0.1);
        }
        .bank-card, .grant-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          border: 1px solid rgba(82, 121, 111, 0.2);
          transition: all 0.3s ease;
        }
        .bank-card:hover, .grant-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(27, 67, 50, 0.15);
          border-color: #1B4332;
        }
      `}</style>

      <div className="space-y-6">
        {/* Demo Mode Banner */}
        <div className="demo-banner">
          <Volume2 className="h-4 w-4" />
          <span className="text-[#ffa200]">Voice-Activated Demo - Say &quot;Hey Oli&quot; to activate AI assistant</span>
        </div>

        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 btn-secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={toggleListening} 
              className={`gap-2 ${isListening ? 'btn-voice' : 'btn-primary'}`}
            >
              {isListening ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Activate Oli
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Analysis Results - Simplified Layout */}
        {showResults && (
          <div className="space-y-8">
            {/* Financial Leaks Summary */}
            <Card className="achievement-card">
              <CardHeader>
                <CardTitle className="text-[#1B4332] flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Financial Leaks Detected
                </CardTitle>
                <CardDescription className="text-[#52796F]">
                  Oli identified potential savings opportunities in your current banking setup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-6 text-center border border-[#52796F]/10">
                    <div className="text-3xl font-bold text-[#DC2626] mb-2">${totalFees.toFixed(2)}</div>
                    <div className="text-sm text-[#52796F]">Monthly Fee Leaks</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center border border-[#52796F]/10">
                    <div className="text-3xl font-bold text-[#10B981] mb-2">${savingsPotential.toFixed(2)}</div>
                    <div className="text-sm text-[#52796F]">Annual Savings Potential</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 text-center border border-[#52796F]/10">
                    <div className="text-3xl font-bold text-[#F59E0B] mb-2">{detectedLeaks.length}</div>
                    <div className="text-sm text-[#52796F]">Areas for Improvement</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Mismatch Areas */}
            <Card className="achievement-card">
              <CardHeader>
                <CardTitle className="text-[#1B4332]">Key Mismatch Areas</CardTitle>
                <CardDescription className="text-[#52796F]">
                  Based on Oli&apos;s analysis of your financial patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-xl p-6 border border-[#52796F]/10">
                  {keyMismatchAreas.map((item, index) => (
                    <div key={index} className="mismatch-item">
                      <span className="text-[#1B4332]">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Two Column Layout for Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bank Recommendations */}
              <Card className="achievement-card">
                <CardHeader>
                  <CardTitle className="text-[#1B4332]">Bank Recommendations</CardTitle>
                  <CardDescription className="text-[#52796F]">
                    Banks better suited to your cash handling needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bankRecommendations.map((bank, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bank-card"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-lg text-[#1B4332]">{bank.name}</h4>
                            <p className="text-[#52796F]">{bank.description}</p>
                          </div>
                          <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20">
                            {bank.matchScore}% Match
                          </Badge>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {bank.features.map((feature, idx) => (
                              <Badge key={idx} className="bg-[#1B4332]/5 text-[#1B4332] border-[#1B4332]/10 text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-[#52796F]">
                          <Phone className="h-4 w-4" />
                          <span>{bank.contact}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Grant & Funding Resources */}
              <Card className="achievement-card">
                <CardHeader>
                  <CardTitle className="text-[#1B4332]">Grant & Funding Resources</CardTitle>
                  <CardDescription className="text-[#52796F]">
                    Local and government funding opportunities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {grantResources.map((grant, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="grant-card"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-lg text-[#1B4332]">{grant.name}</h4>
                            <p className="text-[#52796F]">{grant.description}</p>
                          </div>
                          <Badge className="bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20">
                            {grant.matchScore}% Match
                          </Badge>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {grant.features.map((feature, idx) => (
                              <Badge key={idx} className="bg-[#3B82F6]/5 text-[#3B82F6] border-[#3B82F6]/10 text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-[#52796F]">
                          <Globe className="h-4 w-4" />
                          <span>{grant.contact}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <Card className="achievement-card">
              <CardHeader>
                <CardTitle className="text-[#1B4332]">Next Steps</CardTitle>
                <CardDescription className="text-[#52796F]">
                  Actionable steps to improve your financial alignment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="next-step-card">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#1B4332]/10 p-3 rounded-lg">
                        <Banknote className="h-6 w-6 text-[#1B4332]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-[#1B4332] mb-2">Review Bank Options</h4>
                        <p className="text-[#52796F] mb-4">
                          Contact the recommended banks to compare their business banking packages
                        </p>
                        <Button className="gap-2 btn-primary">
                          View Banks
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="next-step-card">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#1B4332]/10 p-3 rounded-lg">
                        <BarChart3 className="h-6 w-6 text-[#1B4332]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-[#1B4332] mb-2">Set Up Budget Tracking</h4>
                        <p className="text-[#52796F] mb-4">
                          Use our budget dashboard to track fees and optimize your banking costs
                        </p>
                        <Button className="gap-2 btn-primary">
                          Open Dashboard
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="next-step-card">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#1B4332]/10 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-[#1B4332]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-[#1B4332] mb-2">Explore Funding Resources</h4>
                        <p className="text-[#52796F] mb-4">
                          Research the suggested grant programs and SBA resources for your area
                        </p>
                        <Button className="gap-2 btn-primary">
                          View Resources
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                 {/* Step 4 */}
                <div className="next-step-card">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#1B4332]/10 p-3 rounded-lg">
                      <Calendar className="h-6 w-6 text-[#1B4332]" />
                    </div>

                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-[#1B4332] mb-2">
                        Schedule Follow-up Assessment
                      </h4>

                      <p className="text-[#52796F] mb-4">
                        Regular assessments help track improvement in your financial alignment
                      </p>

                      <div className="flex items-center gap-3">
                        <Button className="gap-2 btn-primary">
                          New Assessment
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        {/* Calendar icon trigger ONLY */}
                        <AssessmentCalendar
                          onSchedule={(date) => {
                            console.log("Follow-up assessment scheduled:", date);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </CardContent>
            </Card>

            {/* Oli Summary */}
            <Card className="stats-card">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1B4332]">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-[#1B4332] mb-2">Oli&apos;s Financial Assessment</h3>
                    <p className="text-[#52796F] mb-4">{`
                      Based on my analysis, your current banking setup has significant fee leakages totaling $${totalFees.toFixed(2)} monthly. 
                      The key mismatch areas identified suggest you need banks with better cash handling policies and should explore 
                      local grant opportunities. Following the recommended next steps could save you $${savingsPotential.toFixed(2)} annually.
                    `}</p>
                    <div className="flex gap-4">
                      <Button onClick={handleDownloadPDF} className="gap-2 btn-primary">
                        <FileText className="h-4 w-4" />
                        Download Full Report
                      </Button>
                      <Button onClick={simulateOliAnalysis} className="gap-2 btn-secondary">
                        <Search className="h-4 w-4" />
                        Re-run Analysis
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Agent Oli Card (shown when no results yet) */}
        {!showResults && (
          <Card className="ai-agent-card" style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(96, 165, 250, 0.05) 100%)',
            border: '2px solid rgba(59, 130, 246, 0.2)'
          }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div 
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#1B4332] flex items-center justify-center cursor-pointer"
                      onClick={toggleListening}
                      title="Click to activate Oli"
                    >
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    {oliStatus === "analyzing" && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center">
                        <Zap className="h-3 w-3 text-white" />
                      </div>
                    )}
                    {isListening && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#DC2626] flex items-center justify-center">
                        <Mic className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1B4332]">{OLI_AGENT_CONFIG.name}</h2>
                    <p className="text-[#52796F]">{OLI_AGENT_CONFIG.role}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {OLI_AGENT_CONFIG.capabilities.map((cap, idx) => (
                        <Badge key={idx} className="bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className={`
                    ${oliStatus === "idle" ? "bg-[#52796F]/10 text-[#52796F]" : ""}
                    ${oliStatus === "analyzing" ? "bg-[#F59E0B]/10 text-[#F59E0B] pulse-animation" : ""}
                    ${oliStatus === "complete" ? "bg-[#10B981]/10 text-[#10B981]" : ""}
                    border-transparent text-lg px-4 py-2
                  `}>
                    {oliStatus === "idle" && "Ready for Analysis"}
                    {oliStatus === "analyzing" && "Analyzing..."}
                    {oliStatus === "complete" && "Analysis Complete"}
                  </Badge>
                  {oliStatus === "analyzing" && (
                    <p className="text-sm text-[#52796F] mt-2">Scanning for financial leaks...</p>
                  )}
                </div>
              </div>
              
              {oliStatus === "analyzing" && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-[#52796F] mb-2">
                    <span>Analysis Progress</span>
                    <span>{Math.round(analysisProgress)}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2 progress-gradient" />
                </div>
              )}
              
              {oliStatus === "idle" && (
                <div className="mt-6 flex flex-col items-center gap-4">
                  <p className="text-[#52796F] text-center">
                    Click the Oli avatar or say &quot;Hey Oli&quot; to start voice-activated financial analysis
                  </p>
                  <div className="flex gap-4">
                    <Button onClick={handleAnalyzeClick} className="gap-2 btn-primary px-6 py-4">
                      <Search className="h-5 w-5" />
                      Start Demo Analysis
                    </Button>
                    <Button onClick={toggleListening} className="gap-2 btn-voice px-6 py-4">
                      <Mic className="h-5 w-5" />
                      Activate Voice Mode
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Link Bank Account Card - DISABLED */}
        {!showResults && (
          <Card className="stats-card">
            <CardContent className="py-8 text-center">
              <Building className="h-16 w-16 mx-auto mb-4 text-[#52796F]/30" />
              <h2 className="text-2xl font-bold mb-2 text-[#1B4332]">No Bank Linked</h2>
              <p className="text-[#52796F] mb-6">
                Link your bank account for AI agent Oli to analyze fees and find better banking options.
              </p>
              <Button disabled className="gap-2 btn-disabled">
                <Lock className="h-4 w-4" />
                Link Bank Account (Demo Mode)
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}