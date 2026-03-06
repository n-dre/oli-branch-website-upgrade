// frontend/src/components/layout/Sidebar.jsx
import React from "react";
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
  PanelLeft,
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
    <div className="px-2 pt-4 pb-2 text-[11px] uppercase tracking-wider text-[hsl(var(--sidebar-foreground)/0.5)]">
      {children}
    </div>
  );
}

/**
 * Production Sidebar (no localStorage)
 *
 * Props:
 * - collapsed?: boolean (default false)
 * - onCollapsedChange?: (next:boolean) => void
 * - onClose?: () => void   // mobile drawer close
 */
export default function Sidebar({ collapsed = false, onCollapsedChange, onClose }) {
  const navigate = useNavigate();
  const data = useData?.() || {};
  const subscription = data.subscription;
  const isPremium = subscription?.plan === "premium";

  const safeClose = typeof onClose === "function" ? onClose : null;
  const setCollapsed =
    typeof onCollapsedChange === "function" ? onCollapsedChange : null;

  const handleLogout = () => {
    // Production: logout should be handled by your auth layer.
    // This is a safe client-side fallback.
    try {
      sessionStorage.removeItem("oliBranchLogin");
    } catch {
      // ignore
    }
    navigate("/");
  };

  const handleNavClick = () => {
    if (safeClose) safeClose();
  };

  const toggleCollapsed = () => {
    if (setCollapsed) setCollapsed(!collapsed);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full transition-all duration-300",
        "bg-[hsl(var(--sidebar))] text-[hsl(var(--sidebar-foreground))]",
        collapsed ? "w-14" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[hsl(var(--border))]">
        {!collapsed && (
          <div className="flex items-center gap-2 px-1">
            <img src={LOGO_SRC} alt="Oli-Branch" className="h-7 w-7" />
            <span className="font-bold text-sm">Oli-Branch</span>
          </div>
        )}

        {/* Mobile close (only when passed) */}
        {safeClose && (
          <button
            onClick={safeClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close sidebar"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Desktop collapse toggle (only when controlled) */}
        {setCollapsed && (
          <button
            onClick={toggleCollapsed}
            className={cn(
              "hidden lg:flex p-2 hover:bg-white/10 rounded-lg transition-colors",
              collapsed && "mx-auto"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            type="button"
          >
            {collapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {navGroups.map((group, idx) => (
          <div key={group.title || idx}>
            {group.title && <GroupHeader collapsed={collapsed}>{group.title}</GroupHeader>}

            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-[0_0_20px_hsl(var(--accent)/0.4)]"
                      : "text-[hsl(var(--sidebar-foreground)/0.8)] hover:bg-white/10",
                    collapsed && "justify-center px-0"
                  )
                }
              >
                <item.icon
                  className="
                    h-4 w-4 shrink-0
                    text-white
                    group-[.active]:text-white
                    dark:group-[.active]:text-[#1B4332]
                  "
                />

                {!collapsed && (
                  <>
                    <span className="flex-1 whitespace-nowrap">{item.label}</span>
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
      <div className="p-3 border-t border-[hsl(var(--border))]">
        <button
          onClick={handleLogout}
          type="button"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900/20 transition-colors w-full",
            collapsed && "justify-center px-0"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
