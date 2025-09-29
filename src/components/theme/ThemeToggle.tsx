import React from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <Button
      variant="outline"
      size="sm"
      aria-label="Toggle theme"
      className="flex items-center gap-2"
      onClick={toggleTheme}
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </Button>
  );
}
