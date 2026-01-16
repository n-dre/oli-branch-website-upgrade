import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, Building2, Upload, Lock } from "lucide-react";

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

  const [profile, setProfile] = useState({
    fullName: "",
    email: settings.profile?.email || "",
    companyName: settings.profile?.companyName || "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSaveProfile = () => {
    updateSettings({
      profile: {
        ...settings.profile,
        companyName: profile.companyName,
        email: profile.email,
      },
    });
    toast.success("Profile updated!");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      updateProfileImage(reader.result);
      toast.success("Profile picture updated!");
    };
    reader.readAsDataURL(file);
  };

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match!");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    toast.success("Password changed successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const initials = (profile.companyName || "U")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <DashboardLayout title="Profile" subtitle="Manage your profile information">
      <style>{`
        .hero-gradient {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
        }

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
          color: #1B4332 !important;
          background: transparent !important;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: #1B4332 !important;
          color: #F8F5F0 !important;
        }

        .stats-card {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
          border: 1px solid rgba(82, 121, 111, 0.1);
        }

        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(27, 67, 50, 0.1);
        }

        .progress-gradient {
          background: linear-gradient(90deg, #1B4332 0%, #52796F 100%);
        }

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

        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(248, 245, 240, 0.9);
        }

        .admin-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: white;
        }

        .admin-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }

        .hover-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: white;
        }

        .hover-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }

        .clickable {
          cursor: pointer;
          user-select: none;
        }

        .focus-ring:focus {
          outline: 2px solid #1B4332;
          outline-offset: 2px;
        }

        .hover-lift:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse { animation: pulse 2s infinite; }

        .health-progress-bg {
          background: linear-gradient(90deg, #1B4332 0%, #52796F 100%);
        }

        .risk-high-progress {
          background: linear-gradient(90deg, #DC2626 0%, #EF4444 100%) !important;
        }

        .risk-medium-progress {
          background: linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%) !important;
        }

        .risk-low-progress {
          background: linear-gradient(90deg, #10B981 0%, #34D399 100%) !important;
        }

        .portfolio-risk-high {
          background: linear-gradient(90deg, #DC2626 0%, #EF4444 100%) !important;
        }

        .portfolio-risk-medium {
          background: linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%) !important;
        }

        .portfolio-risk-low {
          background: linear-gradient(90deg, #10B981 0%, #34D399 100%) !important;
        }

        .achievement-gradient {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
        }

        .highlight-border {
          border-left: 4px solid #1B4332;
        }

        .tool-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.02) 0%, rgba(82, 121, 111, 0.02) 100%);
        }

        .tool-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }

        .budget-gradient {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
        }

        .resource-gradient {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.1) 0%, rgba(82, 121, 111, 0.1) 100%);
        }

        .settings-gradient {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.08) 0%, rgba(82, 121, 111, 0.08) 100%);
        }

        .danger-gradient {
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%);
        }

        .security-gradient {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%);
        }

        .location-card {
          border-left: 4px solid #1B4332;
          transition: all 0.3s ease;
        }

        .location-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }

        .theme-active {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%) !important;
          color: white !important;
          border-color: #1B4332 !important;
        }

        .input-focus:focus {
          border-color: #52796F;
          box-shadow: 0 0 0 2px rgba(82, 121, 111, 0.2);
          outline: none;
        }

        .password-strength-bar {
          background: linear-gradient(90deg, #DC2626 0%, #F59E0B 50%, #10B981 100%);
        }

        .payment-card {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.03) 0%, rgba(82, 121, 111, 0.03) 100%);
          border: 1px solid rgba(82, 121, 111, 0.1);
          transition: all 0.3s ease;
        }

        .payment-card:hover {
          border-color: #52796F;
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
        }

        @media (max-width: 640px) {
          .mobile-stack {
            flex-direction: column !important;
          }
          
          .mobile-full {
            width: 100% !important;
          }
          
          .mobile-text-center {
            text-align: center !important;
          }
          
          .mobile-p-4 {
            padding: 1rem !important;
          }
          
          .mobile-gap-4 {
            gap: 1rem !important;
          }
        }

        @media (max-width: 768px) {
          .tablet-flex-col {
            flex-direction: column !important;
          }
          
          .tablet-w-full {
            width: 100% !important;
          }
          
          .tablet-mb-4 {
            margin-bottom: 1rem !important;
          }
        }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {profileImage ? <AvatarImage src={profileImage} alt="Profile" /> : null}
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Picture
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Full Name (optional)</Label>
              <Input
                placeholder="Optional"
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g., oli-branch.com"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Company Name (shown in header)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="e.g., Logistics LLC"
                  value={profile.companyName}
                  onChange={(e) => setProfile((p) => ({ ...p, companyName: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <Button onClick={handleSaveProfile}>Update Profile</Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
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

            <Button onClick={handleChangePassword}>Change Password</Button>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}