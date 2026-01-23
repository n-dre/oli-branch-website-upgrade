// frontend/src/components/layout/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Settings,
  MapPin,
  LogOut,
  Heart,
  Wrench,
  BookOpen,
  User,
  Link as LinkIcon,
  Crown,
  BarChart3,
  X,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";

import { cn } from "../../lib/utils";
import { useData } from "../../context/DataContext";

const LOGO_SRC = "/images/oli-branch00.png";

const navGroups = [
  {
    items: [
      { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { path: "/health", label: "Financial Health", icon: Heart },
      { path: "/tools", label: "Tools", icon: Wrench },
      { path: "/intake", label: "Intake Form", icon: ClipboardList },
    ],
  },
  {
    title: "Banking",
    items: [
      { path: "/link", label: "Link Bank", icon: LinkIcon, premium: true },
      { path: "/nearby-banks", label: "Nearby Banks", icon: MapPin },
    ],
  },
  {
    title: "Insights",
    items: [
      { path: "/leaks", label: "Financial Leaks", icon: BarChart3, premium: true },
      { path: "/report", label: "Report", icon: FileText },
    ],
  },
  {
    title: "Learning",
    items: [{ path: "/learning", label: "Learning", icon: BookOpen }],
  },
  {
    title: "Account",
    items: [
      { path: "/profile", label: "Profile", icon: User },
      { path: "/settings", label: "Settings", icon: Settings },
      { path: "/pricing", label: "Pricing", icon: Crown },
    ],
  },
];

function GroupHeader({ children, collapsed }) {
  if (collapsed) return null;
  return (
    <div className="px-2 pt-4 pb-2 text-[11px] uppercase tracking-wider text-[#F8F5F0]/50">
      {children}
    </div>
  );
}

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const { subscription } = useData();
  const isPremium = subscription?.plan === "premium";

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("ob_sidebar_collapsed");
    return saved !== null ? saved === "true" : false;
  });

  useEffect(() => {
    localStorage.setItem("ob_sidebar_collapsed", isCollapsed.toString());
  }, [isCollapsed]);

  const handleLogout = () => {
    localStorage.removeItem("oliBranchLogin");
    navigate("/");
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full transition-all duration-300 bg-[#1B4332]",
        isCollapsed ? "w-12": "w-54"
      )}
    >
      {/* Header with Toggle */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-1">
            <img src={LOGO_SRC} alt="Oli-Branch" className="h-7 w-7" />
            <span className="font-bold text-sm text-[#F8F5F0]">
              Oli-Branch
            </span>
          </div>
        )}

        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-[#F8F5F0] hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close sidebar"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Desktop Collapse/Expand Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "hidden lg:flex p-2 text-[#F8F5F0] hover:bg-white/10 rounded-lg transition-colors",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          {isCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navGroups.map((group, idx) => (
          <div key={group.title || idx}>
            {group.title && (
              <GroupHeader collapsed={isCollapsed}>
                {group.title}
              </GroupHeader>
            )}

            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#D4AF37] text-[#1B4332] shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                      : "text-[#F8F5F0]/80 hover:bg-white/10",
                    isCollapsed && "justify-center px-0"
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 whitespace-nowrap">
                      {item.label}
                    </span>
                    {item.premium && !isPremium && (
                      <Crown className="h-3 w-3 text-[#D4AF37]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900/20 transition-colors w-full",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}
