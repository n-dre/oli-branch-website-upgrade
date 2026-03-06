// frontend/src/components/Header.jsx
<<<<<<< HEAD
import React, { useMemo, useState, useEffect, useRef } from "react";
=======
import React, { useMemo, useState } from "react";
>>>>>>> e9235cc2169c9dd35b28965cf0c7f9b3388f2812
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Moon,
  Sun,
  Bell,
  HelpCircle,
  GraduationCap,
  Settings,
  MoreHorizontal,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Header({ title, subtitle }) {
  const data = useData?.() || {};
  const settings = data.settings || {};
  const profileImage = data.profileImage || null;
  // Use currentTheme and setThemeMode from your ThemeContext
  const { currentTheme, setThemeMode } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
<<<<<<< HEAD
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
        setMobileOpen(false); // Close mobile menu when hiding
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
=======
>>>>>>> e9235cc2169c9dd35b28965cf0c7f9b3388f2812

  const initials = useMemo(() => {
    return (
      settings.profile?.companyName
        ?.split(" ")
        .map((w) => w?.[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "OB"
    );
  }, [settings.profile?.companyName]);

<<<<<<< HEAD
  const bgColor = currentTheme === "dark" ? "bg-slate-950" : "bg-white";

  return (
    <>
      {/* Mobile top bar - ALWAYS visible, never moves */}
      <div 
        className={`fixed top-0 left-0 w-full z-50 ${bgColor} md:hidden`}
        style={{ 
          height: isVisible ? '72px' : '0px',
          transition: 'height 300ms',
          borderBottom: isVisible ? '1px solid hsl(var(--border))' : 'none',
          boxShadow: isVisible ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none',
          overflow: 'hidden'
        }}
      >
        {/* Copy the mobile header content here */}
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="min-w-0 max-w-full">
              <h1 className="font-display text-base font-bold text-foreground truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 p-0"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 p-0"
              onClick={() => setThemeMode(currentTheme === "light" ? "dark" : "light")}
            >
              {currentTheme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Avatar className="h-9 w-9 ring-2 ring-transparent shrink-0">
              {profileImage && <AvatarImage src={profileImage} alt="Profile" />}
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 p-0"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <MoreHorizontal className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile panel inside fixed div */}
        {mobileOpen && (
          <div className="px-4 pb-3 pt-3 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {settings.profile?.companyName || "Oli-Branch"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {settings.profile?.email || ""}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigate("/help")}>
                  <HelpCircle className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/learning")}
                >
                  <GraduationCap className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop header - unchanged */}
      <header className={`hidden md:block ${bgColor} border-b border-border shadow-sm sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}>
        <div className="flex items-center justify-between gap-3 min-w-0">
          {/* LEFT — Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1 pl-16 sm:pl-8 lg:pl-14">
            <div className="min-w-0 max-w-full">
              <h1 className="font-display text-base sm:text-xl lg:text-2xl font-bold text-foreground truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT — Desktop Utilities */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => navigate("/help")}>
              <HelpCircle className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 p-0"
              onClick={() => navigate("/notifications")}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/learning")}
            >
              <GraduationCap className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 p-0"
              onClick={() => setThemeMode(currentTheme === "light" ? "dark" : "light")}
            >
              {currentTheme === "light" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-3 pl-3 border-l border-border">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-foreground">
                  {settings.profile?.companyName || "Oli-Branch"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {settings.profile?.email || ""}
                </p>
              </div>

              <Avatar className="h-10 w-10 ring-2 ring-transparent shrink-0">
                {profileImage && <AvatarImage src={profileImage} alt="Profile" />}
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for mobile content */}
      <div className={`md:hidden`} style={{ height: isVisible ? '72px' : '0px', transition: 'height 300ms' }} />
    </>
=======
  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-3 min-w-0">
        {/* LEFT — Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1 pl-8 lg:pl-14">
          <div className="min-w-0">
            <h1 className="font-display text-xl lg:text-2xl font-bold text-foreground truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT — Desktop Utilities */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => navigate("/help")}>
            <HelpCircle className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 p-0"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/learning")}
          >
            <GraduationCap className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 p-0"
            onClick={() => setThemeMode(currentTheme === "light" ? "dark" : "light")}
          >
            {currentTheme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right hidden lg:block">
              <p className="text-sm font-medium text-foreground">
                {settings.profile?.companyName || "Oli-Branch"}
              </p>
              <p className="text-xs text-muted-foreground">
                {settings.profile?.email || ""}
              </p>
            </div>

            <Avatar className="h-10 w-10 ring-2 ring-transparent shrink-0">
              {profileImage && <AvatarImage src={profileImage} alt="Profile" />}
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* RIGHT — Mobile / Tablet */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 p-0"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 p-0"
            onClick={() => setThemeMode(currentTheme === "light" ? "dark" : "light")}
          >
            {currentTheme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Avatar className="h-9 w-9 ring-2 ring-transparent shrink-0">
            {profileImage && <AvatarImage src={profileImage} alt="Profile" />}
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 p-0"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <MoreHorizontal className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-border">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {settings.profile?.companyName || "Oli-Branch"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {settings.profile?.email || ""}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/help")}>
                <HelpCircle className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/learning")}
              >
                <GraduationCap className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
>>>>>>> e9235cc2169c9dd35b28965cf0c7f9b3388f2812
  );
}