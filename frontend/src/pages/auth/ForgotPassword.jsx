// src/pages/auth/ForgotPassword.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { X, Smartphone, Mail, Shield, CheckCircle, ChevronRight, ArrowLeft, Clock, KeyRound } from "lucide-react";

const Step = {
  PICK_METHOD: "PICK_METHOD",
  ENTER_CODE: "ENTER_CODE",
  RESET_PASSWORD: "RESET_PASSWORD",
  SUCCESS: "SUCCESS"
};

const API = import.meta.env.VITE_API_URL;

export default function ForgotPassword({ isOpen = true, onClose, initialIdentifier = "" }) {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [step, setStep] = useState(Step.PICK_METHOD);
  const [method, setMethod] = useState("");
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [masked, setMasked] = useState({ email: "", phone: "" });
  const [resetToken, setResetToken] = useState("");
  const [codeResent, setCodeResent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [activeInputIndex, setActiveInputIndex] = useState(0);

  const backToLogin = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/login");
    }
  };

  // Start countdown timer for resend code
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Focus on the first empty input
  useEffect(() => {
    if (step === Step.ENTER_CODE && inputRefs.current[activeInputIndex]) {
      inputRefs.current[activeInputIndex].focus();
    }
  }, [step, activeInputIndex]);

  const handleCodeChange = (value, index) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    
    const newCode = [...code];
    newCode[index] = value.replace(/\D/g, '');
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      setActiveInputIndex(index + 1);
    }

    // Check if all digits are filled
    if (newCode.every(digit => digit !== "") && index === 5) {
      const fullCode = newCode.join('');
      verifyCode(fullCode);
    }
  };

  const handleCodeKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      setActiveInputIndex(index - 1);
    }
  };

  const startReset = async (chosen) => {
    if (!identifier.trim()) {
      toast.error("Please enter your email or username");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/password-reset/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, method: chosen }),
      });

      if (!res.ok) throw new Error("Failed to start reset");

      const data = await res.json();
      setMasked({
        email: data.maskedEmail,
        phone: data.maskedPhone,
      });
      setMethod(chosen);
      setStep(Step.ENTER_CODE);
      setTimer(60);
      setCodeResent(false);
      setCode(["", "", "", "", "", ""]);
      setActiveInputIndex(0);
      toast.success(`Security code sent to your ${chosen === "sms" ? "mobile device" : "email"}`);
    } catch {
      toast.error("Account not found or reset failed");
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (timer > 0) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/password-reset/resend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, method }),
      });

      if (!res.ok) throw new Error("Failed to resend");

      setCodeResent(true);
      setTimer(60);
      toast.success("New security code sent");
    } catch {
      toast.error("Unable to resend code");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (verificationCode) => {
    const codeToVerify = verificationCode || code.join('');
    if (!codeToVerify.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/password-reset/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, method, code: codeToVerify }),
      });

      if (!res.ok) throw new Error("Invalid code");

      const data = await res.json();
      setResetToken(data.resetToken);
      setStep(Step.RESET_PASSWORD);
      toast.success("Identity verified. Set your new password");
    } catch {
      toast.error("Invalid or expired security code");
    } finally {
      setLoading(false);
    }
  };

  const completeReset = async () => {
    if (newPw.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/password-reset/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword: newPw }),
      });

      if (!res.ok) throw new Error("Reset failed");

      setStep(Step.SUCCESS);
      toast.success("Password updated successfully");
      
      setTimeout(() => {
        if (onClose) {
          onClose();
        } else {
          navigate("/login");
        }
      }, 2500);
    } catch {
      toast.error("Could not update password");
    } finally {
      setLoading(false);
    }
  };

  const isStandalone = !onClose;

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] to-[#EAE7E0] flex items-center justify-center p-4">
        <Card className="w-full max-w-lg rounded-2xl border border-gray-200 shadow-2xl">
          <CardHeader className="text-center border-b border-gray-100 pb-6">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-[#1B4332]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#1B4332]">Password Recovery</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Verify your identity to securely reset your password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 py-8">
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={backToLogin}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-lg mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full rounded-xl border border-gray-300 shadow-2xl bg-white">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50/50">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-[#1B4332]/10 rounded-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-[#1B4332]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {step === Step.ENTER_CODE ? "Verification Required" : "Secure Password Recovery"}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500">IBM Business Security System</p>
                </div>
              </div>
              <button
                onClick={backToLogin}
                className="rounded-lg p-1.5 sm:p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </button>
            </div>

            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );

  function renderContent() {
    switch(step) {
      case Step.PICK_METHOD:
        return (
          <>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2 sm:mb-3">
                  Account Identifier
                </label>
                <div className="relative">
                  <Input
                    value={identifier}
                    onChange={(ev) => setIdentifier(ev.target.value)}
                    placeholder="Enter your business email or username"
                    className="pl-4 pr-4 py-3 sm:py-3.5 border-gray-300 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 text-sm sm:text-base"
                    autoFocus
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3">
                  Enter the email or username associated with your business account
                </p>
              </div>

              <div className="pt-4 sm:pt-6">
                <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 sm:mb-4">Select Verification Method</h4>
                <div className="space-y-3 sm:space-y-4">
                  {/* SMS Verification Button */}
                  <button
                    onClick={() => startReset("sms")}
                    disabled={loading || !identifier.trim()}
                    className="w-full group cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
                  >
                    <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-300 rounded-lg hover:border-[#1B4332] hover:bg-[#1B4332]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 bg-blue-50 rounded-lg">
                          <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900 text-sm sm:text-base">Mobile SMS Verification</div>
                          <div className="text-xs sm:text-sm text-gray-500">Receive a code via SMS</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-[#1B4332] group-hover:text-[#52796F] mr-2 hidden sm:inline">
                          Verify
                        </span>
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </div>
                    </div>
                  </button>

                  {/* Email Verification Button */}
                  <button
                    onClick={() => startReset("email")}
                    disabled={loading || !identifier.trim()}
                    className="w-full group cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[#1B4332]/30"
                  >
                    <div className="flex items-center justify-between p-3 sm:p-4 border border-gray-300 rounded-lg hover:border-[#1B4332] hover:bg-[#1B4332]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-2.5 bg-green-50 rounded-lg">
                          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900 text-sm sm:text-base">Email Verification</div>
                          <div className="text-xs sm:text-sm text-gray-500">Receive a code via email</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium text-[#1B4332] group-hover:text-[#52796F] mr-2 hidden sm:inline">
                          Verify
                        </span>
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                      </div>
                    </div>
                  </button>
                </div>
                
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-blue-900 mb-1">Security Note</p>
                      <p className="text-xs sm:text-sm text-blue-700">
                        Select your preferred verification method to receive a secure 6-digit code.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 sm:pt-6 border-t border-gray-100">
              <button
                onClick={backToLogin}
                className="text-sm sm:text-base font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 sm:gap-2 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Return to login
              </button>
            </div>
          </>
        );

      case Step.ENTER_CODE:
        return (
          <>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <button
                onClick={() => setStep(Step.PICK_METHOD)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-500">
                  {timer > 0 ? `${timer}s remaining` : 'Code expired'}
                </span>
              </div>
            </div>

            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#1B4332]/10 rounded-full mb-4">
                {method === "sms" ? (
                  <Smartphone className="h-6 w-6 sm:h-7 sm:w-7 text-[#1B4332]" />
                ) : (
                  <Mail className="h-6 w-6 sm:h-7 sm:w-7 text-[#1B4332]" />
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Enter Verification Code
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                {method === "sms" 
                  ? "Enter the 6-digit code sent to your mobile device" 
                  : "Enter the 6-digit code sent to your email"
                }
              </p>
              {masked[method === "sms" ? "phone" : "email"] && (
                <p className="text-sm font-medium text-gray-700 mt-2">
                  Sent to: <span className="text-[#1B4332]">{masked[method === "sms" ? "phone" : "email"]}</span>
                </p>
              )}
              {codeResent && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-700">New code sent!</span>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 sm:p-6 mb-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-full mb-2">
                  <KeyRound className="h-3 w-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">6-DIGIT SECURITY CODE</span>
                </div>
                <p className="text-xs text-gray-500">Enter each digit in the boxes below</p>
              </div>

              <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(e.target.value, index)}
                    onKeyDown={(e) => handleCodeKeyDown(e, index)}
                    onFocus={() => setActiveInputIndex(index)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-xl sm:text-2xl font-bold border-2 rounded-lg focus:outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/30 cursor-text ${
                      digit ? 'border-[#1B4332] bg-white' : 'border-gray-300 bg-white'
                    } ${
                      activeInputIndex === index ? 'ring-2 ring-[#1B4332]/30' : ''
                    }`}
                    autoComplete="off"
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="w-full sm:w-1/2 border-gray-300 hover:bg-gray-50 cursor-pointer"
                  onClick={resendCode}
                  disabled={timer > 0 || loading}
                >
                  {timer > 0 ? `Resend (${timer}s)` : 'Resend Code'}
                </Button>
                <Button
                  className="w-full sm:w-1/2 bg-[#1B4332] hover:bg-[#52796F] cursor-pointer"
                  onClick={() => verifyCode()}
                  disabled={loading || code.some(digit => !digit)}
                >
                  Verify Code
                </Button>
              </div>

              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  Code expires in 10 minutes • Auto-verifies when complete
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-600 mb-3">Or enter the code manually:</p>
              <div className="flex gap-3">
                <Input
                  value={code.join('')}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    const newCode = value.split('');
                    setCode([...newCode, ...Array(6 - newCode.length).fill('')]);
                    if (value.length === 6) {
                      verifyCode(value);
                    }
                  }}
                  placeholder="Enter 6-digit code"
                  className="flex-1 text-center font-mono tracking-widest"
                  maxLength={6}
                />
                <Button
                  className="bg-[#1B4332] hover:bg-[#52796F] cursor-pointer"
                  onClick={() => verifyCode()}
                  disabled={loading || code.some(digit => !digit)}
                >
                  Verify
                </Button>
              </div>
            </div>
          </>
        );

      case Step.RESET_PASSWORD:
        return (
          <>
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full mb-3 sm:mb-4">
                <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Set New Password</h3>
              <p className="text-sm text-gray-600 mt-1">
                Create a strong password to secure your business account
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPw}
                  onChange={(ev) => setNewPw(ev.target.value)}
                  placeholder="Enter new password"
                  className="border-gray-300 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 py-3 sm:py-3.5"
                  autoFocus
                />
                <div className="flex items-center gap-1 sm:gap-2 mt-3">
                  <div className={`h-1.5 sm:h-2 flex-1 rounded-full ${newPw.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div className={`h-1.5 sm:h-2 flex-1 rounded-full ${/[A-Z]/.test(newPw) ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div className={`h-1.5 sm:h-2 flex-1 rounded-full ${/[0-9]/.test(newPw) ? 'bg-green-500' : 'bg-gray-200'}`} />
                  <div className={`h-1.5 sm:h-2 flex-1 rounded-full ${/[^A-Za-z0-9]/.test(newPw) ? 'bg-green-500' : 'bg-gray-200'}`} />
                </div>
                <ul className="text-xs text-gray-500 space-y-1 mt-3">
                  <li className={`flex items-center ${newPw.length >= 8 ? "text-green-600" : ""}`}>
                    <span className="mr-2">•</span>
                    <span>At least 8 characters</span>
                  </li>
                  <li className={`flex items-center ${/[A-Z]/.test(newPw) ? "text-green-600" : ""}`}>
                    <span className="mr-2">•</span>
                    <span>One uppercase letter</span>
                  </li>
                  <li className={`flex items-center ${/[0-9]/.test(newPw) ? "text-green-600" : ""}`}>
                    <span className="mr-2">•</span>
                    <span>One number</span>
                  </li>
                  <li className={`flex items-center ${/[^A-Za-z0-9]/.test(newPw) ? "text-green-600" : ""}`}>
                    <span className="mr-2">•</span>
                    <span>One special character</span>
                  </li>
                </ul>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmPw}
                  onChange={(ev) => setConfirmPw(ev.target.value)}
                  placeholder="Re-enter new password"
                  className="border-gray-300 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/20 py-3 sm:py-3.5"
                />
                {confirmPw && newPw !== confirmPw && (
                  <p className="text-sm text-red-600 mt-2">Passwords do not match</p>
                )}
              </div>

              <Button
                className="w-full bg-[#1B4332] hover:bg-[#52796F] py-3 sm:py-2.5 h-auto sm:h-11 cursor-pointer"
                disabled={loading || newPw.length < 8 || newPw !== confirmPw}
                onClick={completeReset}
              >
                Update Password
              </Button>
            </div>
          </>
        );

      case Step.SUCCESS:
        return (
          <div className="text-center py-6 sm:py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4 sm:mb-6">
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Password Updated Successfully</h3>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Your business account password has been securely updated
            </p>
            <div className="space-y-2 sm:space-y-3 max-w-xs mx-auto">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 rounded-lg">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Identity verified</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 rounded-lg">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <span className="text-xs sm:text-sm font-medium text-gray-700">Password encrypted</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6 sm:mt-8">
              Redirecting to login...
            </p>
          </div>
        );

      default:
        return null;
    }
  }
}