// frontend/src/pages/assessments/IntakeForm.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Mail,
  Building2,
  DollarSign,
  CreditCard,
  Banknote,
  Award,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

// ✅ FIXED IMPORTS (relative to frontend/src/pages/assessments)
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Progress } from "../../components/ui/progress";
import { useData } from "../../context/DataContext";
import { cn } from "../../lib/utils";

const STEPS = [
  { id: 1, title: "Contact Info", icon: Mail },
  { id: 2, title: "Business Details", icon: Building2 },
  { id: 3, title: "Banking Info", icon: CreditCard },
  { id: 4, title: "Additional Info", icon: Award },
];

const ENTITY_TYPES = ["Sole Proprietor", "LLC", "S-Corp", "C-Corp", "Partnership", "Non-Profit"];

export default function IntakeForm() {
  const navigate = useNavigate();
  const { addResponse, getScoring } = useData();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    businessName: "",
    entityType: "",
    monthlyRevenue: "",
    accountType: "",
    cashDeposits: false,
    monthlyFees: "",
    wantsGrants: false,
    veteranOwned: false,
    immigrantFounder: false,
    zipCode: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.businessName) newErrors.businessName = "Business name is required";
    }

    if (step === 2) {
      if (!formData.entityType) newErrors.entityType = "Entity type is required";
      if (!formData.monthlyRevenue) newErrors.monthlyRevenue = "Monthly revenue is required";
      else if (isNaN(formData.monthlyRevenue) || Number(formData.monthlyRevenue) < 0) {
        newErrors.monthlyRevenue = "Enter a valid amount";
      }
    }

    if (step === 3) {
      if (!formData.accountType) newErrors.accountType = "Account type is required";
      if (!formData.monthlyFees) newErrors.monthlyFees = "Monthly fees is required";
      else if (isNaN(formData.monthlyFees) || Number(formData.monthlyFees) < 0) {
        newErrors.monthlyFees = "Enter a valid amount";
      }
    }

    if (step === 4) {
      if (!formData.zipCode) newErrors.zipCode = "ZIP code is required";
      else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
        newErrors.zipCode = "Enter a valid ZIP code";
      }
      if (!formData.consent) newErrors.consent = "Consent is required to proceed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const submission = {
      ...formData,
      monthlyRevenue: Number(formData.monthlyRevenue),
      monthlyFees: Number(formData.monthlyFees),
    };

    const newResponse = addResponse(submission);
    const scoring = getScoring(newResponse);

    toast.success("Form submitted successfully!", {
      description: `Mismatch Score: ${scoring.mismatchScore} (${scoring.riskLabel} Risk)`,
      duration: 5000,
    });

    navigate(`/report/${encodeURIComponent(formData.email)}`);
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < 4) setCurrentStep((prev) => prev + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const progress = (currentStep / 4) * 100;

  return (
    <DashboardLayout title="Business Intake Form" subtitle="Complete this form to analyze your financial mismatch">
      <style>{`
        .hero-gradient { background: linear-gradient(135deg, #1B4332 0%, #52796F 100%); }

        .btn-primary {
          background: #1B4332 !important;
          color: #F8F5F0 !important;
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
          color: #F8F5F0 !important;
        }
        .course-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.02) 0%, rgba(82, 121, 111, 0.02) 100%);
        }
        .course-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }
        .achievement-card {
          border-left: 4px solid #1B4332 !important;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
        }
        .achievement-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(27, 67, 50, 0.15);
          border-color: #52796F !important;
        }
        .stats-card {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
          border: 1px solid rgba(82, 121, 111, 0.1);
        }
        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(27, 67, 50, 0.1);
        }
        .progress-gradient { background: linear-gradient(90deg, #1B4332 0%, #52796F 100%); }

        .tag-badge {
          background: rgba(27, 67, 50, 0.1) !important;
          color: #1B4332 !important;
          border: 1px solid rgba(27, 67, 50, 0.2) !important;
        }
        .category-badge {
          background: rgba(82, 121, 111, 0.1) !important;
          color: #52796F !important;
          border: 1px solid rgba(82, 121, 111, 0.2) !important;
        }

        @media (max-width: 640px) {
          .mobile-stack { flex-direction: column !important; }
          .mobile-full { width: 100% !important; }
          .mobile-text-center { text-align: center !important; }
          .mobile-p-4 { padding: 1rem !important; }
          .mobile-gap-4 { gap: 1rem !important; }
        }
        @media (max-width: 768px) {
          .tablet-flex-col { flex-direction: column !important; }
          .tablet-w-full { width: 100% !important; }
          .tablet-mb-4 { margin-bottom: 1rem !important; }
        }
      `}</style>

      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300",
                    currentStep >= step.id
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-12 sm:w-24 mx-2 transition-colors duration-300",
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {currentStep} of 4: {STEPS[currentStep - 1].title}
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                {STEPS[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Let's start with your contact information"}
                {currentStep === 2 && "Tell us about your business"}
                {currentStep === 3 && "Your current banking setup"}
                {currentStep === 4 && "Additional details for better recommendations"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1 */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@business.com"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        className={cn("pl-10", errors.email && "border-destructive")}
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="businessName"
                        placeholder="Your Business LLC"
                        value={formData.businessName}
                        onChange={(e) => updateField("businessName", e.target.value)}
                        className={cn("pl-10", errors.businessName && "border-destructive")}
                      />
                    </div>
                    {errors.businessName && <p className="text-sm text-destructive">{errors.businessName}</p>}
                  </div>
                </>
              )}

              {/* Step 2 */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="entityType">Entity Type *</Label>
                    <Select value={formData.entityType} onValueChange={(v) => updateField("entityType", v)}>
                      <SelectTrigger className={errors.entityType && "border-destructive"}>
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ENTITY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.entityType && <p className="text-sm text-destructive">{errors.entityType}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyRevenue">Monthly Revenue ($) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="monthlyRevenue"
                        type="number"
                        min="0"
                        placeholder="10000"
                        value={formData.monthlyRevenue}
                        onChange={(e) => updateField("monthlyRevenue", e.target.value)}
                        className={cn("pl-10", errors.monthlyRevenue && "border-destructive")}
                      />
                    </div>
                    {errors.monthlyRevenue && <p className="text-sm text-destructive">{errors.monthlyRevenue}</p>}
                  </div>
                </>
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-2">
                    <Label>Account Type *</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => updateField("accountType", "business")}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                          formData.accountType === "business"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                          errors.accountType && "border-destructive"
                        )}
                      >
                        <CreditCard className="h-6 w-6 mb-2 text-primary" />
                        <p className="font-medium">Business Account</p>
                        <p className="text-xs text-muted-foreground">Dedicated business banking</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField("accountType", "personal")}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                          formData.accountType === "personal"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                          errors.accountType && "border-destructive"
                        )}
                      >
                        <Users className="h-6 w-6 mb-2 text-warning" />
                        <p className="font-medium">Personal Account</p>
                        <p className="text-xs text-muted-foreground">Using personal for business</p>
                      </button>
                    </div>
                    {errors.accountType && <p className="text-sm text-destructive">{errors.accountType}</p>}
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50">
                    <Checkbox
                      id="cashDeposits"
                      checked={formData.cashDeposits}
                      onCheckedChange={(checked) => updateField("cashDeposits", checked)}
                    />
                    <div>
                      <Label htmlFor="cashDeposits" className="cursor-pointer">
                        <span className="flex items-center gap-2">
                          <Banknote className="h-4 w-4" />
                          Frequent Cash Deposits
                        </span>
                      </Label>
                      <p className="text-xs text-muted-foreground">Do you regularly deposit cash?</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyFees">Monthly Bank Fees ($) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="monthlyFees"
                        type="number"
                        min="0"
                        placeholder="25"
                        value={formData.monthlyFees}
                        onChange={(e) => updateField("monthlyFees", e.target.value)}
                        className={cn("pl-10", errors.monthlyFees && "border-destructive")}
                      />
                    </div>
                    {errors.monthlyFees && <p className="text-sm text-destructive">{errors.monthlyFees}</p>}
                  </div>
                </>
              )}

              {/* Step 4 */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50">
                      <Checkbox
                        id="wantsGrants"
                        checked={formData.wantsGrants}
                        onCheckedChange={(checked) => updateField("wantsGrants", checked)}
                      />
                      <div>
                        <Label htmlFor="wantsGrants" className="cursor-pointer font-medium">
                          Interested in Grants
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Would you like grant recommendations?
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50">
                      <Checkbox
                        id="veteranOwned"
                        checked={formData.veteranOwned}
                        onCheckedChange={(checked) => updateField("veteranOwned", checked)}
                      />
                      <div>
                        <Label htmlFor="veteranOwned" className="cursor-pointer font-medium">
                          <span className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-accent" />
                            Veteran-Owned Business
                          </span>
                        </Label>
                        <p className="text-xs text-muted-foreground">Access special veteran programs</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 rounded-lg bg-muted/50">
                      <Checkbox
                        id="immigrantFounder"
                        checked={formData.immigrantFounder}
                        onCheckedChange={(checked) => updateField("immigrantFounder", checked)}
                      />
                      <div>
                        <Label htmlFor="immigrantFounder" className="cursor-pointer font-medium">
                          Immigrant Founder
                        </Label>
                        <p className="text-xs text-muted-foreground">Access immigrant founder resources</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="zipCode"
                        placeholder="12345"
                        value={formData.zipCode}
                        onChange={(e) => updateField("zipCode", e.target.value)}
                        className={cn("pl-10", errors.zipCode && "border-destructive")}
                      />
                    </div>
                    {errors.zipCode && <p className="text-sm text-destructive">{errors.zipCode}</p>}
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => updateField("consent", checked)}
                        className={errors.consent && "border-destructive"}
                      />
                      <div>
                        <Label htmlFor="consent" className="cursor-pointer font-medium">
                          I consent to data processing *
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          By checking this box, you agree that we may process your information to provide
                          financial mismatch analysis and recommendations. Your data will be stored locally.
                        </p>
                      </div>
                    </div>
                    {errors.consent && <p className="text-sm text-destructive mt-2">{errors.consent}</p>}
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4 border-t border-border">
                <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={handleNext} className="gap-2 btn-primary">
                  {currentStep === 4 ? "Submit" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
