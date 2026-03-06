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
  const { settings, setSettings, profileImage, setProfileImage } = useData();
  const fileInputRef = useRef(null);

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
    reader.onload = (event) => {
      const dataUrl = event.target.result;

      setProfileImage(dataUrl);

      setSettings((prev) => ({
        ...prev,
        profile: {
          ...(prev.profile || {}),
          companyLogo: dataUrl,
        },
      }));

      toast.success("Company logo updated.");
    };

    reader.readAsDataURL(file);
  };

  const openFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveLogo = () => {
    setProfileImage("");

    setSettings((prev) => ({
      ...prev,
      profile: {
        ...(prev.profile || {}),
        companyLogo: "",
      },
    }));

    toast.success("Logo removed.");
  };

  const handleSaveProfile = () => {
    if (!profile.companyName.trim()) {
      toast.error("Company name is required (shown in header).");
      return;
    }
    if (!profile.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    setSettings((prev) => ({
      ...prev,
      profile: {
        ...(prev.profile || {}),
        ...profile,
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
    if (!passwords.current) return toast.error("Enter your current password.");
    if (passwords.new !== passwords.confirm) return toast.error("Passwords do not match.");
    if (passwords.new.length < 8) return toast.error("Password must be at least 8 characters.");

    toast.success("Password changed successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <DashboardLayout title="Profile" subtitle="Business identity & account security">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* PROFILE */}
        <Card className="border-none shadow-none bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <User className="h-5 w-5 text-[#1B4332]" />
              Profile Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#1B4332] flex items-center justify-center text-white text-xl font-semibold overflow-hidden">
                {currentLogo ? (
                  <img
                    src={currentLogo}
                    alt="Company Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-500">Header preview</div>
                <div className="font-semibold text-[#1B4332]">{headerNamePreview}</div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={openFileExplorer}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!currentLogo}
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>

            {/* IMPORTANT: off-screen file input (NOT display:none) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleImageUpload}
              className="fixed -left-[9999px] w-px h-px opacity-0 pointer-events-none"
            />

            <div className="space-y-2">
              <Label>Full Name (optional)</Label>
              <Input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button className="bg-[#1B4332] text-white" onClick={handleSaveProfile}>
                Update Profile
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* SECURITY */}
        <Card className="border-none shadow-none bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Lock className="h-5 w-5 text-[#1B4332]" />
              Account Settings
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <Input
              type="password"
              placeholder="Current Password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
            <Input
              type="password"
              placeholder="New Password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
            <Button className="bg-[#1B4332] text-white" onClick={handleChangePassword}>
              Change Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}