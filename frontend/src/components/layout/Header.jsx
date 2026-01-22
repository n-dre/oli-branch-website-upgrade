// frontend/src/components/Header.jsx
import React, { useMemo, useState } from "react";
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
  Grid,
  MoreHorizontal,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Header({ title, subtitle }) {
  const { settings, profileImage } = useData();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

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

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-3 min-w-0">
        {/* LEFT — Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
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
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => navigate("/apps")}>
            <Grid className="h-5 w-5" />
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
            onClick={toggleTheme}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
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

              <Button variant="ghost" size="icon" onClick={() => navigate("/apps")}>
                <Grid className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}