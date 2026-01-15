import React from "react";
import { useData } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { Moon, Sun, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function Header({ title, subtitle }) {
  const { settings, profileImage } = useData();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const initials =
    settings.profile?.companyName
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "OB";

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-4 sm:px-6 lg:px-8 py-4">
      {/* ✅ min-w-0 + gap prevents right icons from being pushed off */}
      <div className="flex items-center justify-between gap-3 min-w-0">
        {/* ✅ allow title block to shrink instead of pushing icons */}
        <div className="lg:ml-0 ml-12 min-w-0 flex-1">
          <h1 className="font-display text-xl lg:text-2xl font-bold text-foreground truncate">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-sm text-muted-foreground mt-0.5 truncate">
              {subtitle}
            </p>
          ) : null}
        </div>

        {/* ✅ shrink-0 stops bell/theme from collapsing */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* ✅ fixed tap target for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 p-0"
            type="button"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full" />
          </Button>

          {/* ✅ fixed tap target for mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 p-0"
            onClick={toggleTheme}
            type="button"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          <div className="flex items-center gap-3 pl-3 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">
                {settings.profile?.companyName || "Oli-Branch"}
              </p>
              <p className="text-xs text-muted-foreground">
                {settings.profile?.email || ""}
              </p>
            </div>

            <Avatar className="h-10 w-10 ring-2 ring-transparent shrink-0">
              {profileImage ? (
                <AvatarImage src={profileImage} alt="Profile" />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
