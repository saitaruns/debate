"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const DarkModeToggle = ({className}) => {
  const { theme, setTheme } = useTheme();
  const handleTheme = () => {
    theme === "dark" ? setTheme("light") : setTheme("dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleTheme} className={cn(className)}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
};

export default DarkModeToggle;
