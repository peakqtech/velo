"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ThemeVariant, ThemeConfig, getTheme, getThemeVariant } from "./themes";

interface ThemeContextType {
  theme: ThemeConfig;
  variant: ThemeVariant;
  setVariant: (v: ThemeVariant) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeCSSVariables(theme: ThemeConfig) {
  const root = document.documentElement;
  root.style.setProperty("--color-bg", theme.colors.bg);
  root.style.setProperty("--color-surface", theme.colors.surface);
  root.style.setProperty("--color-text", theme.colors.text);
  root.style.setProperty("--color-text-secondary", theme.colors.textSecondary);
  root.style.setProperty("--color-primary", theme.colors.primary);
  root.style.setProperty("--color-primary-hover", theme.colors.primaryHover);
  root.style.setProperty("--color-accent", theme.colors.accent);
  root.style.setProperty("--color-border", theme.colors.border);
  root.style.setProperty("--color-card-bg", theme.colors.cardBg);
  root.style.setProperty("--font-heading", theme.fonts.heading);
  root.style.setProperty("--font-body", theme.fonts.body);
  root.style.setProperty("--border-radius", theme.borderRadius);
}

export function ThemeProvider({
  children,
  initialVariant,
}: {
  children: ReactNode;
  initialVariant?: ThemeVariant;
}) {
  const [variant, setVariant] = useState<ThemeVariant>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get("theme");
      if (urlTheme) {
        return getThemeVariant(urlTheme);
      }
    }
    return initialVariant || "luxury";
  });
  const theme = getTheme(variant);

  useEffect(() => {
    applyThemeCSSVariables(theme);

    // Load Google Fonts
    const existingLink = document.getElementById("theme-fonts");
    if (existingLink) {
      existingLink.remove();
    }
    const link = document.createElement("link");
    link.id = "theme-fonts";
    link.rel = "stylesheet";
    link.href = theme.fonts.importUrl;
    document.head.appendChild(link);
  }, [theme]);

  const handleSetVariant = (v: ThemeVariant) => {
    setVariant(v);
    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set("theme", v);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <ThemeContext.Provider
      value={{ theme, variant, setVariant: handleSetVariant }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
