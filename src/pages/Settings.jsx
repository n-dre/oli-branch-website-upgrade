// src/pages/Settings.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

import {
  ChevronRight,
  User,
  Bell,
  Shield,
  Moon,
  Sun,
  Monitor,
  Accessibility,
  Users,
  HelpCircle,
  FileText,
  Flag,
  Globe,
  Wallet,
  KeyRound,
  AtSign,
  Image as ImageIcon,
  History,
  Underline,
  IdCard,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";

// Inline switch (same style)
function InlineSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        checked ? "bg-[#1B4332]" : "bg-gray-300",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
      aria-pressed={checked}
      aria-label="Toggle"
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

function Row({ icon: Icon, label, value, onClick, dot, rightNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#52796F]/5 active:bg-[#52796F]/10 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#52796F]/15">
          <Icon className="w-5 h-5 text-[#1B4332]" />
        </div>
        <p className="font-medium text-[#1B4332] truncate">{label}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {dot ? <span className="w-2 h-2 rounded-full bg-blue-500" /> : null}
        {value ? <span className="text-sm text-[#52796F]">{value}</span> : null}
        {rightNode ? rightNode : <ChevronRight className="w-4 h-4 text-[#52796F]" />}
      </div>
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-[#52796F]/10 mx-4" />;
}

export default function Settings() {

  // WIRED: theme comes from ThemeContext
  const { themeMode, cycleThemeMode } = useTheme();

  // Local demo states (you can wire later)
  const [activeStatus, setActiveStatus] = useState(true);

  // Replace with real data later
  const businessHandle = "@Businessname";

  const darkModeLabel = useMemo(() => {
    if (themeMode === "dark") return "On";
    if (themeMode === "light") return "Off";
    return "System";
  }, [themeMode]);

  const navigate = useNavigate();

  const darkModeIcon = themeMode === "dark" ? Moon : themeMode === "light" ? Sun : Monitor;

  const onNotImplemented = (label) => toast.message(`${label} (not wired yet)`);

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account, privacy, notifications, and preferences">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
        {/* Section 1 */}
        <Card className="border border-[#52796F]/10 rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="w-full flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-[#52796F]/15">
                  <Users className="w-5 h-5 text-[#1B4332]" />
                </div>
                <p className="font-medium text-[#1B4332] truncate">Active status</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#52796F]">{activeStatus ? "On" : "Off"}</span>
                <InlineSwitch checked={activeStatus} onChange={setActiveStatus} />
              </div>
            </div>

            <Divider />

            <Row icon={darkModeIcon} label="Dark mode" value={darkModeLabel} onClick={cycleThemeMode} />

            <Divider />

            <Row icon={Accessibility} label="Accessibility" onClick={() => onNotImplemented("Accessibility")} />

            <Divider />

            <Row icon={Shield} label="Privacy & safety" dot onClick={() => onNotImplemented("Privacy & safety")} />
          </CardContent>
        </Card>

        {/* Section 2 */}
        <Card className="border border-[#52796F]/10 rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <Row icon={User} label="Avatar" onClick={() => onNotImplemented("Avatar")} />
            <Divider />
            <Row icon={AtSign} label="Businessname" value={businessHandle} onClick={() => onNotImplemented("Businessname ")} />
            <Divider />
            <Row icon={IdCard} label="Personal details" onClick={() => onNotImplemented("Personal details")} />
            <Divider />
            <Row icon={KeyRound} label="Password & security" onClick={() => onNotImplemented("Password & security")} />
          </CardContent>
        </Card>

        {/* Section 3 */}
        <Card className="border border-[#52796F]/10 rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <Row icon={Bell} label="Notifications & sounds" value="Off" onClick={() => onNotImplemented("Notifications & sounds")} />
            <Divider />
            <Row icon={Wallet} label="Payments" onClick={() => navigate('/payment')} />
            <Divider />
            <Row icon={ImageIcon} label="Photos & media" onClick={() => onNotImplemented("Photos & media")} />
            <Divider />
            <Row icon={History} label="Memories" onClick={() => onNotImplemented("Memories")} />
            <Divider />
            <Row icon={Globe} label="Language identification" onClick={() => onNotImplemented("Language identification")} />
            <Divider />
            <Row icon={Underline} label="Underlined words" onClick={() => onNotImplemented("Underlined words")} />
          </CardContent>
        </Card>

        {/* Section 4 */}
        <Card className="border border-[#52796F]/10 rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <Row icon={Flag} label="Report a problem" onClick={() => onNotImplemented("Report a problem")} />
            <Divider />
            <Row icon={HelpCircle} label="Help" onClick={() => onNotImplemented("Help")} />
            <Divider />
            <Row icon={FileText} label="Legal & policies" onClick={() => onNotImplemented("Legal & policies")} />
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
