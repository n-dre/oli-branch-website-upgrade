import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";

import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Settings,
  MapPin,
  LogOut,
  Menu,
  X,
  Heart,
  Wrench,
  BookOpen,
  User,
  Link as LinkIcon,
  Crown,
  BarChart3,
} from "lucide-react";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cn } from "../../lib/utils";
import { useData } from "../../context/DataContext";

/* put your logo in /public, for example:
   public/oli-logo.png
*/
const LOGO_SRC = "/resources/oli-branch00.png";

const navGroups = [
  {
    items: [
      { path: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { path: "/health", label: "Financial Health", icon: Heart },
      { path: "/tools", label: "Tools", icon: Wrench },
      { path: "/intake", label: "Intake Form", icon: ClipboardList },
      { path: "/help", label: "Help", icon: Search },
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
      { path: "/finder", label: "Find Resources", icon: Search },
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

function GroupHeader({ children }) {
  return (
    <div className="px-2 pt-4 pb-2 text-[11px] uppercase tracking-wider sidebar-foreground/50">
      {children}
    </div>
  );
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileHeaderVisible, setMobileHeaderVisible] = useState(true);

  const navigate = useNavigate();
  const { subscription } = useData();
  const isPremium = subscription?.plan === "premium";

  // Scroll tracking
  const lastYRef = useRef(0);
  const lastScrollAtRef = useRef(Date.now());
  const rafRef = useRef(null);

  useEffect(() => {
    // Guard for SSR
    if (typeof window === "undefined") return;

    lastYRef.current = window.scrollY || 0;

    const onScroll = () => {
      lastScrollAtRef.current = Date.now();

      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;

        const y = window.scrollY || 0;
        const lastY = lastYRef.current;
        const delta = y - lastY;

        // thresholds avoid jitter
        const goingDown = delta > 6;
        const goingUp = delta < -6;

        // Rule:
        // - scrolling down -> hide (slide UP)
        // - scrolling up -> show (slide DOWN)
        // - near top -> always show
        if (y < 10) {
          setMobileHeaderVisible(true);
        } else if (goingDown) {
          setMobileHeaderVisible(false);
        } else if (goingUp) {
          setMobileHeaderVisible(true);
        }

        lastYRef.current = y;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // "No scroll = show" behavior:
    // if user stops scrolling for 350ms, show header again.
    const idle = setInterval(() => {
      if (Date.now() - lastScrollAtRef.current > 350) {
        setMobileHeaderVisible(true);
      }
    }, 250);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearInterval(idle);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("oliBranchLogin");
    navigate("/");
  };

  // Sidebar top offset follows header height on mobile
  const mobileHeaderHeight = mobileHeaderVisible ? "64px" : "0px";

  return (
    <div style={{ ["--mobile-header-h"]: mobileHeaderHeight }}>
      {/* Mobile Header */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 right-0 z-70 mobile-header h-16 flex items-center justify-between px-4",
          "transition-transform duration-200 will-change-transform",
          mobileHeaderVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo + Title (mobile) */}
          <div className="flex items-center gap-2">
            <img
              src={LOGO_SRC}
              alt="Oli-Branch logo"
              className="h-7 w-7 object-contain"
              draggable="false"
            />
            <div>
              <h1 className="font-display text-base font-bold text-[#1B4332]">
                Oli-Branch
              </h1>
              <p className="text-xs text-gray-600">Financial Dashboard</p>
            </div>
          </div>
        </div>

        {isPremium && (
          <Badge className="bg-[#D4AF37] text-[#1B4332] gap-1">
            <Crown className="h-3 w-3" />
            Premium
          </Badge>
        )}
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-56 sidebar transition-transform duration-300",
          "sidebar-scrollbar",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:top-0",
          // ✅ replaces mt-16 with dynamic offset
          "mt-[var(--mobile-header-h)] lg:mt-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Desktop Logo */}
          <div className="hidden lg:flex items-center gap-3 mb-5 px-2">
            <img
              src={LOGO_SRC}
              alt="Oli-Branch logo"
              className="h-8 w-8 object-contain"
              draggable="false"
            />
            <div>
              <h1 className="font-display text-base font-bold sidebar-foreground">
                Oli-Branch
              </h1>
              <p className="text-xs sidebar-foreground/60">Financial Dashboard</p>
            </div>
          </div>

          {/* Desktop Subscription Badge */}
          {isPremium && (
            <div className="hidden lg:block mb-3 px-2">
              <Badge className="w-full justify-center bg-[#D4AF37] text-[#1B4332] gap-1">
                <Crown className="h-3 w-3" />
                Premium
              </Badge>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto sidebar-scrollbar">
            {navGroups.map((group) => (
              <div key={group.title || "main"} className="mb-1">
                {group.title && <GroupHeader>{group.title}</GroupHeader>}

                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                          isActive
                            ? "sidebar-accent sidebar-shadow-glow"
                            : "sidebar-foreground/80 sidebar-hover"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.label}</span>
                      {item.premium && !isPremium && (
                        <Crown className="h-3 w-3 text-[#D4AF37]" />
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Upgrade CTA */}
          {!isPremium && (
            <div className="p-3 mb-2 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/30">
              <p className="text-xs sidebar-foreground mb-2">
                Unlock bank linking & leaks
              </p>
              <Button
                size="sm"
                className="w-full gap-1 bg-[#D4AF37] hover:bg-[#E6C158] text-[#1B4332]"
                onClick={() => {
                  navigate("/pricing");
                  setIsOpen(false);
                }}
              >
                <Crown className="h-3 w-3" />
                Upgrade $9.99/mo
              </Button>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900/20 hover:text-red-200 transition-colors mt-2 sidebar-hover"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </div>
  );
}

