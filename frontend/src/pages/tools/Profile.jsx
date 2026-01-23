// src/pages/tools/Profile.jsx
import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, Upload, Lock } from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { useData } from "../../context/DataContext";

export default function Profile() {
  const { settings, updateSettings, profileImage, updateProfileImage } = useData();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(() => ({
    fullName: settings.profile?.fullName || "",
    email: settings.profile?.email || "",
    companyName: settings.profile?.companyName || "",
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

  const headerNamePreview = profile.companyName || "Company Name";
  const headerLogoPreview = settings.profile?.companyLogo || profileImage || "";

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

      updateProfileImage(dataUrl);

      updateSettings({
        profile: {
          ...(settings.profile || {}),
          companyLogo: dataUrl,
        },
      });

      toast.success("Company logo updated.");
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleUploadClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Upload button clicked");
    fileInputRef.current?.click();
  };

  const handleRemoveLogo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Remove button clicked");
    updateProfileImage("");
    updateSettings({
      profile: {
        ...(settings.profile || {}),
        companyLogo: "",
      },
    });
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

    updateSettings({
      profile: {
        ...(settings.profile || {}),
        companyName,
        email,
        fullName,
        companyLogo: settings.profile?.companyLogo || profileImage || "",
      },
    });

    toast.success("Profile updated.");
  };

  const handleReset = () => {
    setProfile({
      fullName: settings.profile?.fullName || "",
      email: settings.profile?.email || "",
      companyName: settings.profile?.companyName || "",
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
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Logo + Header Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              <div className="shrink-0">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={headerLogoPreview} alt="Logo here" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0 w-full space-y-2">
                <div className="text-xs text-muted-foreground">Header preview</div>

                <div className="font-semibold text-[#1B4332] truncate">
                  {headerNamePreview}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto flex items-center justify-center pointer-events-auto cursor-pointer"
                    onClick={handleUploadClick}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto flex items-center justify-center pointer-events-auto cursor-pointer"
                    onClick={handleRemoveLogo}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Full Name (optional)</Label>
              <Input
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Company Name (shown in header)</Label>
              <Input
                value={profile.companyName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, companyName: e.target.value }))
                }
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button className="btn-primary w-full sm:w-auto" onClick={handleSaveProfile}>
                Update Profile
              </Button>
              <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleReset}>
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
              <Lock className="h-5 w-5 text-primary" />
              Account Settings
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                autoComplete="new-password"
              />
            </div>

            <Button className="btn-primary w-full sm:w-auto" onClick={handleChangePassword}>
              Change Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}