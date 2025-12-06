"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// View Transitions API types
interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
  updateCallbackDone: Promise<void>;
}

declare global {
  interface Document {
    startViewTransition?: (callback: () => void) => ViewTransition;
  }
}

interface ThemeToggleProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export function ThemeToggle({
  className,
  duration = 400,
  ...props
}: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      // Fallback for browsers without View Transitions API
      const newTheme = !isDark;
      setIsDark(newTheme);
      document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", newTheme ? "dark" : "light");
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [isDark, duration]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn("bg-background relative overflow-hidden", className)}
        disabled
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "bg-background relative overflow-hidden group",
        className
      )}
      {...props}
    >
      <Sun
        className={cn(
          "h-[1.2rem] w-[1.2rem] transition-all duration-300",
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "absolute h-[1.2rem] w-[1.2rem] transition-all duration-300",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
