"use client";

import { useTheme } from "@/lib/theme-context";
import { themes, themeVariants, ThemeVariant } from "@/lib/themes";

export function ThemeSwitcher() {
  const { variant, setVariant } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-1 rounded-full p-1 shadow-2xl backdrop-blur-md"
      style={{
        backgroundColor: variant === "streetwear" ? "rgba(20,20,20,0.95)" : "rgba(255,255,255,0.95)",
        border: `1px solid ${variant === "streetwear" ? "#2A2A2A" : "#E5E5E5"}`,
      }}
    >
      {themeVariants.map((v) => {
        const t = themes[v];
        const isActive = v === variant;
        return (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className="relative px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-300"
            style={{
              backgroundColor: isActive ? t.colors.primary : "transparent",
              color: isActive
                ? v === "streetwear" ? "#FFFFFF" : "#FFFFFF"
                : v === variant && variant === "streetwear"
                  ? "#A0A0A0"
                  : "#666666",
            }}
          >
            {t.name}
            {isActive && v === "streetwear" && (
              <span
                className="absolute inset-0 rounded-full animate-pulse opacity-20"
                style={{ backgroundColor: t.colors.accent }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
