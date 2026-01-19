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
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { Button } from "../ui/button";
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
    <div className="px-2 pt-4 pb-2 text-[11px] uppercase tracking-wider sidebar-foreground/50">
      {children}
    </div>
  );
}

export default function Sidebar() {
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

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-56",
        "lg:static translate-x-0"
      )}
    >
      {/* ✅ ONLY CHANGE HERE: forest green background */}
      <div className="flex flex-col h-full p-3 bg-[#1B4332]">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-1">
              <img src={LOGO_SRC} alt="Oli-Branch" className="h-7 w-7" />
              <span className="font-bold text-sm sidebar-foreground">
                Oli-Branch
              </span>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
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
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "sidebar-accent sidebar-shadow-glow"
                        : "sidebar-foreground/80 sidebar-hover",
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
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900/20 transition-colors",
            isCollapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}

