// src/pages/auth/ForgotPasswordModal.jsx
import React, { useState } from "react";
import ForgotPassword from "./ForgotPassword";
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog";

export function ForgotPasswordModal({ children, className }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <button type="button" className={`text-sm font-medium transition-colors hover:underline ${className}`}>
            Forgot password?
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="p-0 max-w-md overflow-hidden border-0 bg-transparent">
        <ForgotPassword isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}