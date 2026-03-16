export type ThemeVariant = "luxury" | "streetwear" | "minimal";

export interface ThemeConfig {
  name: string;
  description: string;
  fonts: { heading: string; body: string; importUrl: string };
  colors: {
    bg: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryHover: string;
    accent: string;
    border: string;
    cardBg: string;
  };
  hero: {
    image: string;
    overlayOpacity: string;
    textAlign: string;
    layout: "centered" | "split" | "fullbleed";
  };
  borderRadius: string;
  navStyle: "transparent" | "solid" | "minimal";
}

export const themes: Record<ThemeVariant, ThemeConfig> = {
  luxury: {
    name: "Atelier",
    description: "Editorial luxury with serif typography",
    fonts: {
      heading: "'Playfair Display', serif",
      body: "'Inter', sans-serif",
      importUrl:
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap",
    },
    colors: {
      bg: "#FAF9F7",
      surface: "#FFFFFF",
      text: "#1A1A1A",
      textSecondary: "#6B6B6B",
      primary: "#1A1A1A",
      primaryHover: "#333333",
      accent: "#C5A572",
      border: "#E8E5E0",
      cardBg: "#FFFFFF",
    },
    hero: {
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
      overlayOpacity: "0.3",
      textAlign: "center",
      layout: "centered",
    },
    borderRadius: "0px",
    navStyle: "transparent",
  },
  streetwear: {
    name: "HYPE",
    description: "Bold streetwear with loud typography",
    fonts: {
      heading: "'Anton', sans-serif",
      body: "'Epilogue', sans-serif",
      importUrl:
        "https://fonts.googleapis.com/css2?family=Anton&family=Epilogue:wght@400;500;600;700&display=swap",
    },
    colors: {
      bg: "#0A0A0A",
      surface: "#141414",
      text: "#FFFFFF",
      textSecondary: "#A0A0A0",
      primary: "#FF3333",
      primaryHover: "#FF5555",
      accent: "#00FF88",
      border: "#2A2A2A",
      cardBg: "#141414",
    },
    hero: {
      image:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80",
      overlayOpacity: "0.5",
      textAlign: "left",
      layout: "fullbleed",
    },
    borderRadius: "0px",
    navStyle: "solid",
  },
  minimal: {
    name: "Muji",
    description: "Japanese-inspired minimalism",
    fonts: {
      heading: "'Noto Serif', serif",
      body: "'Noto Sans', sans-serif",
      importUrl:
        "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600&family=Noto+Serif:wght@400;500;600&display=swap",
    },
    colors: {
      bg: "#FAFAF8",
      surface: "#FFFFFF",
      text: "#2D2D2D",
      textSecondary: "#8C8C8C",
      primary: "#2D2D2D",
      primaryHover: "#4A4A4A",
      accent: "#B8860B",
      border: "#EBEBEB",
      cardBg: "#FFFFFF",
    },
    hero: {
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
      overlayOpacity: "0.15",
      textAlign: "center",
      layout: "split",
    },
    borderRadius: "2px",
    navStyle: "minimal",
  },
};

export const themeVariants: ThemeVariant[] = ["luxury", "streetwear", "minimal"];

export function getTheme(variant?: string): ThemeConfig {
  if (variant && variant in themes) {
    return themes[variant as ThemeVariant];
  }
  return themes.luxury;
}

export function getThemeVariant(variant?: string): ThemeVariant {
  if (variant && variant in themes) {
    return variant as ThemeVariant;
  }
  return "luxury";
}
