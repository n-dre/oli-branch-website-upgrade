// src/pages/settings/index.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  ChevronRight,
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  Monitor,
  Accessibility as AccessibilityIcon,
  Users,
  FileText,
  Flag,
  Globe,
  Wallet,
  KeyRound,
  Image as ImageIcon,
  History,
  Underline,
  IdCard,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent } from "../../components/ui/card";
import { useTheme } from "../../context/ThemeContext";

// Inline switch
function InlineSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-[#1B4332]" : "bg-gray-300 dark:bg-gray-600",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}

function Row({ icon: Icon, label, value, onClick, dot, }) {
  const { themeMode } = useTheme();
  
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#52796F]/5 dark:hover:bg-white/5 active:bg-[#52796F]/10 dark:active:bg-white/10 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
          themeMode === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-[#52796F]/15'
        }`}>
          <Icon className={`w-5 h-5 ${
            themeMode === 'dark' ? 'text-white' : 'text-[#1B4332]'
          }`} />
        </div>
        <p className={`font-medium truncate ${
          themeMode === 'dark' ? 'text-white' : 'text-[#1B4332]'
        }`}>
          {label}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {dot && <span className="w-2 h-2 rounded-full bg-blue-500" />}
        {value && (
          <span className={`text-sm ${
            themeMode === 'dark' ? 'text-gray-400' : 'text-[#52796F]'
          }`}>
            {value}
          </span>
        )}
        <ChevronRight className={`w-4 h-4 ${
          themeMode === 'dark' ? 'text-gray-400' : 'text-[#52796F]'
        }`} />
      </div>
    </button>
  );
}

function Divider() {
  const { themeMode } = useTheme();
  
  return (
    <div className={`h-px mx-4 ${
      themeMode === 'dark' ? 'bg-gray-700' : 'bg-[#52796F]/10'
    }`} />
  );
}

export default function Settings() {
  const { themeMode, cycleThemeMode } = useTheme();
  const [activeStatus, setActiveStatus] = useState(true);
  const navigate = useNavigate();

  const darkModeLabel = useMemo(() => {
    if (themeMode === "dark") return "On";
    if (themeMode === "light") return "Off";
    return "System";
  }, [themeMode]);

  const darkModeIcon = themeMode === "dark" ? Moon : themeMode === "light" ? Sun : Monitor;

  const go = (path) => navigate(path);

  return (
    <DashboardLayout 
      title="Settings" 
      subtitle="Manage your account, privacy, notifications, and preferences"
    >
      <motion.div 
        initial={{ opacity: 0, y: 14 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="space-y-5"
      >
        {/* Section 1 */}
        <Card className={`
          border rounded-2xl overflow-hidden
          ${themeMode === 'dark' 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-[#52796F]/10 bg-white'
          }
        `}>
          <CardContent className="p-0">
            <div className={`flex items-center justify-between px-4 py-3 ${
              themeMode === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex items-center gap-3">
                <Users className={`w-5 h-5 ${
                  themeMode === 'dark' ? 'text-white' : 'text-[#1B4332]'
                }`} />
                <p className={`font-medium ${
                  themeMode === 'dark' ? 'text-white' : 'text-[#1B4332]'
                }`}>
                  Active status
                </p>
              </div>
              <InlineSwitch checked={activeStatus} onChange={setActiveStatus} />
            </div>
            <Divider />
            <Row icon={darkModeIcon} label="Dark mode" value={darkModeLabel} onClick={cycleThemeMode} />
            <Divider />
            <Row icon={AccessibilityIcon} label="Accessibility" onClick={() => go("/settings/accessibility")} />
            <Divider />
            <Row icon={Shield} label="Privacy & safety" onClick={() => go("/settings/privacy-safety")} />
          </CardContent>
        </Card>

        {/* Section 2 */}
        <Card className={`
          border rounded-2xl overflow-hidden
          ${themeMode === 'dark' 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-[#52796F]/10 bg-white'
          }
        `}>
          <CardContent className="p-0">
            <Row icon={User} label="GpsRadius" onClick={() => go("/settings/Gps")} />
            <Divider />
            <Row icon={IdCard} label="Personal details" onClick={() => go("/settings/personal-details")} />
            <Divider />
            <Row icon={KeyRound} label="Password & security" onClick={() => go("/settings/password-security")} />
          </CardContent>
        </Card>

        {/* Section 3 */}
        <Card className={`
          border rounded-2xl overflow-hidden
          ${themeMode === 'dark' 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-[#52796F]/10 bg-white'
          }
        `}>
          <CardContent className="p-0">
            <Row icon={Bell} label="Notifications & sounds" onClick={() => go("/notifications")} />
            <Divider />
            <Row icon={Wallet} label="Payments" onClick={() => go("/payment")} />
            <Divider />
            <Row icon={ImageIcon} label="Photos & media" onClick={() => go("/settings/photos-media")} />
            <Divider />
            <Row icon={History} label="Memories" onClick={() => go("/settings/memories")} />
            <Divider />
            <Row icon={Globe} label="Language identification" onClick={() => go("/settings/language-identification")} />
            <Divider />
            <Row icon={Underline} label="Underlined words" onClick={() => go("/settings/underlined-words")} />
          </CardContent>
        </Card>

        {/* Section 4 */}
        <Card className={`
          border rounded-2xl overflow-hidden
          ${themeMode === 'dark' 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-[#52796F]/10 bg-white'
          }
        `}>
          <CardContent className="p-0">
            <Row icon={Flag} label="OrganizationSettings" onClick={() => go("/settings/Organization")} />
            <Divider />
            <Row icon={Flag} label="Report a problem" onClick={() => go("/settings/report-a-problem")} />
            <Divider />
            <Row icon={FileText} label="Legal & policies" onClick={() => go("/settings/legal-policies")} />
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
