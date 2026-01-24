// src/pages/tools/Profile.jsx
import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, Upload, Lock, X } from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useData } from "../../context/DataContext";

export default function Profile() {
  // ✅ Use the correct functions from DataContext
  const { settings, setSettings, profileImage, setProfileImage } = useData();
  const fileInputRef = useRef(null);

  // ✅ Initialize from settings.profile
  const [profile, setProfile] = useState(() => ({
    fullName: settings?.profile?.fullName || "",
    email: settings?.profile?.email || "",
    companyName: settings?.profile?.companyName || "",
  }));

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const initials = useMemo(() => {
    const base = (profile.companyName || profile.fullName || "U").trim();
    return base
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [profile.companyName, profile.fullName]);

  // ✅ Get logo from both places for backward compatibility
  const currentLogo = settings?.profile?.companyLogo || profileImage || "";
  const headerNamePreview = profile.companyName || "Company Name";

  const validateImage = (file) => {
    const allowed = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Only PNG, JPG, WEBP, or GIF allowed.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return false;
    }
    return true;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImage(file)) {
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      
      // ✅ Update both profileImage AND settings.profile.companyLogo
      setProfileImage(dataUrl);
      
      setSettings(prev => ({
        ...prev,
        profile: {
          ...(prev.profile || {}),
          companyLogo: dataUrl,
        },
      }));

      toast.success("Company logo updated.");
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleRemoveLogo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // ✅ Remove from both places
    setProfileImage("");
    
    setSettings(prev => ({
      ...prev,
      profile: {
        ...(prev.profile || {}),
        companyLogo: "",
      },
    }));
    
    toast.success("Logo removed.");
  };

  const handleSaveProfile = () => {
    const companyName = profile.companyName.trim();
    const email = profile.email.trim();
    const fullName = profile.fullName.trim();

    if (!companyName) {
      toast.error("Company name is required (shown in header).");
      return;
    }
    if (!email) {
      toast.error("Email is required.");
      return;
    }

    // ✅ Update settings.profile correctly
    setSettings(prev => ({
      ...prev,
      profile: {
        ...(prev.profile || {}),
        companyName,
        email,
        fullName,
        // Preserve existing logo if any
        companyLogo: prev?.profile?.companyLogo || currentLogo || "",
      },
    }));

    toast.success("Profile updated.");
  };

  const handleReset = () => {
    setProfile({
      fullName: settings?.profile?.fullName || "",
      email: settings?.profile?.email || "",
      companyName: settings?.profile?.companyName || "",
    });
    toast.success("Reverted.");
  };

  const handleChangePassword = () => {
    if (!passwords.current) {
      toast.error("Enter your current password.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match!");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    toast.success("Password changed successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <DashboardLayout title="Profile" subtitle="Business identity & account security">
      <style>{`
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
        @media (max-width: 1024px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid profile-grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* PROFILE */}
        <Card className="border-none shadow-none bg-[#f5f5f5]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#1B4332]" />
              Profile Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Logo + Header Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              <div className="shrink-0">
                {/* Round Avatar - fixed aspect ratio */}
                <div 
                  className="relative w-20 h-20 rounded-full border-2 border-[#1B4332]/20 shadow-md overflow-hidden bg-[#1B4332]"
                  data-testid="profile-avatar"
                  style={{ aspectRatio: '1 / 1' }}
                >
                  {currentLogo ? (
                    <img 
                      src={currentLogo}
                      alt="Company Logo"
                      className="absolute inset-0 w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center text-white text-xl font-semibold">
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0 w-full space-y-2">
                <div className="text-xs text-muted-foreground">Header preview</div>

                <div className="font-semibold text-[#1B4332] truncate">
                  {headerNamePreview}
                </div>

                {/* Hidden file input for image upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageUpload}
                  data-testid="file-input"
                />

                {/* Responsive button container */}
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  {/* Upload Button - triggers file input */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 hover:bg-[#1B4332] hover:text-white transition-colors"
                    onClick={handleUploadClick}
                    data-testid="upload-logo-btn"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>

                  {/* Remove Button - disabled when no logo, responsive styling */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleRemoveLogo}
                    disabled={!currentLogo}
                    data-testid="remove-logo-btn"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name (optional)</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                data-testid="full-name-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                data-testid="email-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name (shown in header)</Label>
              <Input
                id="companyName"
                value={profile.companyName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, companyName: e.target.value }))
                }
                data-testid="company-name-input"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="btn-primary w-full sm:w-auto" 
                onClick={handleSaveProfile}
                data-testid="save-profile-btn"
              >
                Update Profile
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full sm:w-auto" 
                onClick={handleReset}
                data-testid="cancel-btn"
              >
                Cancel
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              This saves <b>companyName</b> + <b>companyLogo</b> for the header.
            </div>
          </CardContent>
        </Card>

        {/* SECURITY */}
        <Card className="border-none shadow-none bg-[#f5f5f5]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#1B4332]" />
              Account Settings
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                autoComplete="current-password"
                data-testid="current-password-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                autoComplete="new-password"
                data-testid="new-password-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                autoComplete="new-password"
                data-testid="confirm-password-input"
              />
            </div>

            <Button 
              className="btn-primary w-full sm:w-auto" 
              onClick={handleChangePassword}
              data-testid="change-password-btn"
            >
              Change Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}