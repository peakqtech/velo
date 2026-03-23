export interface TemplateConfig {
  slug: string;
  name: string;
  industry: string;
  category: string;
  capabilities: string[];
  previewUrl: string;
  gradient: [string, string];
  icon: string;
}

export const TEMPLATE_CATEGORIES = [
  { slug: "all", label: "All" },
  { slug: "food-hospitality", label: "Food & Hospitality" },
  { slug: "real-estate", label: "Real Estate" },
  { slug: "health-wellness", label: "Health & Wellness" },
  { slug: "professional-services", label: "Professional Services" },
  { slug: "e-commerce", label: "E-Commerce" },
  { slug: "creative", label: "Creative" },
] as const;

export const templates: TemplateConfig[] = [
  {
    slug: "tropica",
    name: "Tropica",
    industry: "Restaurant & Dining",
    category: "food-hospitality",
    capabilities: ["Menu SEO", "Online reservations", "Review management", "Food photography showcase"],
    previewUrl: "https://tropica-template.vercel.app",
    gradient: ["#f97316", "#dc2626"],
    icon: "🍽️",
  },
  {
    slug: "haven",
    name: "Haven",
    industry: "Real Estate",
    category: "real-estate",
    capabilities: ["Listing SEO", "Lead scoring", "Property showcase", "Market intelligence"],
    previewUrl: "https://haven-template.vercel.app",
    gradient: ["#3b82f6", "#1d4ed8"],
    icon: "🏠",
  },
  {
    slug: "serenity",
    name: "Serenity",
    industry: "Wellness & Spa",
    category: "health-wellness",
    capabilities: ["Booking AI", "Client retention", "Treatment upsells", "Wellness content"],
    previewUrl: "https://serenity-template.vercel.app",
    gradient: ["#ec4899", "#a855f7"],
    icon: "💆",
  },
  {
    slug: "medica",
    name: "Medica",
    industry: "Healthcare",
    category: "health-wellness",
    capabilities: ["Patient scheduling", "Compliance SEO", "Intake automation", "Provider profiles"],
    previewUrl: "https://medica-template.vercel.app",
    gradient: ["#14b8a6", "#0d9488"],
    icon: "🏥",
  },
  {
    slug: "commerce",
    name: "Commerce",
    industry: "E-Commerce",
    category: "e-commerce",
    capabilities: ["Product SEO", "Cart recovery", "Ad autopilot", "Inventory showcase"],
    previewUrl: "https://commerce-template.vercel.app",
    gradient: ["#f59e0b", "#d97706"],
    icon: "🛍️",
  },
  {
    slug: "lexis",
    name: "Lexis",
    industry: "Legal & Professional",
    category: "professional-services",
    capabilities: ["Practice SEO", "Client intake", "Case management", "Attorney profiles"],
    previewUrl: "https://lexis-template.vercel.app",
    gradient: ["#6366f1", "#4338ca"],
    icon: "⚖️",
  },
  {
    slug: "prism",
    name: "Prism",
    industry: "Creative & Portfolio",
    category: "creative",
    capabilities: ["Portfolio SEO", "Lead capture", "Project booking", "Gallery showcase"],
    previewUrl: "https://prism-template.vercel.app",
    gradient: ["#8b5cf6", "#7c3aed"],
    icon: "🎨",
  },
  {
    slug: "ember",
    name: "Ember",
    industry: "Events & Entertainment",
    category: "creative",
    capabilities: ["Event SEO", "Ticket booking", "Gallery showcase", "Venue management"],
    previewUrl: "https://ember-template.vercel.app",
    gradient: ["#ef4444", "#b91c1c"],
    icon: "🔥",
  },
  {
    slug: "forma",
    name: "Forma",
    industry: "Fitness & Training",
    category: "health-wellness",
    capabilities: ["Class scheduling", "Membership management", "Trainer profiles", "Program SEO"],
    previewUrl: "https://forma-template.vercel.app",
    gradient: ["#22c55e", "#16a34a"],
    icon: "💪",
  },
  {
    slug: "nexus",
    name: "Nexus",
    industry: "Tech & SaaS",
    category: "professional-services",
    capabilities: ["Service SEO", "Lead generation", "Case studies", "Team showcase"],
    previewUrl: "https://nexus-template.vercel.app",
    gradient: ["#06b6d4", "#0891b2"],
    icon: "🚀",
  },
];
