// src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const Step = {
  PICK_METHOD: "PICK_METHOD",
  ENTER_CODE: "ENTER_CODE",
  RESET_PASSWORD: "RESET_PASSWORD",
};

const API = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(Step.PICK_METHOD);
  const [method, setMethod] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [masked, setMasked] = useState({ email: "", phone: "" });
  const [resetToken, setResetToken] = useState("");

  const backToLogin = () => navigate("/login");

  const startReset = async (chosen) => {
    if (!identifier.trim()) {
      toast.error("Enter your email or username.");
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
      toast.success("Verification code sent.");
    } catch {
      toast.error("Account not found or reset failed.");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code.trim()) {
      toast.error("Enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/password-reset/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, method, code }),
      });

      if (!res.ok) throw new Error("Invalid code");

      const data = await res.json();
      setResetToken(data.resetToken);
      setStep(Step.RESET_PASSWORD);
      toast.success("Code verified.");
    } catch {
      toast.error("Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  const completeReset = async () => {
    if (newPw.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("Passwords do not match.");
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

      toast.success("Password updated.");

      navigate("/settings/password-security", {
        state: {
          fromResetFlow: true,
          newPassword: newPw,
          confirmPassword: confirmPw,
        },
      });
    } catch {
      toast.error("Could not update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center p-4">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-[#1B4332]">Forgot password</CardTitle>
          <CardDescription>Verify your account, then set a new password.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Email or username</div>
            <Input
              value={identifier}
              onChange={(ev) => setIdentifier(ev.target.value)}
              placeholder="Enter email or username"
              autoComplete="username"
            />
          </div>

          {step === Step.PICK_METHOD && (
            <>
              <div className="pt-2 space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  disabled={loading}
                  onClick={() => startReset("sms")}
                >
                  Verify by SMS {masked.phone && `(phone: ${masked.phone})`}
                </Button>

                <Button
                  className="w-full justify-start"
                  variant="outline"
                  disabled={loading}
                  onClick={() => startReset("email")}
                >
                  Verify by Email {masked.email && `(email: ${masked.email})`}
                </Button>
              </div>

              <div className="pt-2 flex justify-center">
                <button onClick={backToLogin} className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Back to login
                </button>
              </div>
            </>
          )}

          {step === Step.ENTER_CODE && (
            <>
              <Input
                value={code}
                onChange={(ev) => setCode(ev.target.value)}
                placeholder="Enter verification code"
                inputMode="numeric"
                autoComplete="one-time-code"
              />

              <div className="flex gap-3">
                <Button variant="outline" className="w-1/2" disabled={loading} onClick={() => setStep(Step.PICK_METHOD)}>
                  Back
                </Button>
                <Button className="w-1/2" disabled={loading} onClick={verifyCode}>
                  Verify
                </Button>
              </div>
            </>
          )}

          {step === Step.RESET_PASSWORD && (
            <>
              <Input
                type="password"
                value={newPw}
                onChange={(ev) => setNewPw(ev.target.value)}
                placeholder="New password"
                autoComplete="new-password"
              />
              <Input
                type="password"
                value={confirmPw}
                onChange={(ev) => setConfirmPw(ev.target.value)}
                placeholder="Confirm password"
                autoComplete="new-password"
              />
              <Button className="w-full" disabled={loading} onClick={completeReset}>
                Set new password
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
