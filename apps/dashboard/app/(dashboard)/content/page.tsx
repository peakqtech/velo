"use client";

import { useState, useEffect } from "react";
import { generateSectionsFromContent } from "@velo/integration-cms";
import { ContentEditor } from "@velo/integration-cms";

// Demo content — in production this comes from the database
const DEMO_CONTENT = {
  hero: {
    headline: "Run Faster. Go Further.",
    tagline: "Premium athletic wear engineered for peak performance",
    cta: { label: "Shop Now", href: "/shop" },
    media: { type: "video", src: "/videos/hero.mp4", poster: "/images/hero-poster.jpg", alt: "Athletes running" },
    overlay: { opacity: 0.4, gradient: "linear-gradient(to bottom, transparent, black)" },
  },
  productShowcase: {
    title: "Featured Collection",
    subtitle: "Engineered for champions",
    products: [
      { name: "Velocity Pro", image: "/images/shoe-1.jpg", alt: "Running shoe", features: [] },
      { name: "Aero Jacket", image: "/images/jacket-1.jpg", alt: "Lightweight jacket", features: [] },
    ],
  },
  testimonials: {
    heading: "What Athletes Say",
    testimonials: [
      { quote: "Best running gear I've ever owned.", author: "Sarah K.", role: "Marathon Runner", avatar: "/images/avatar-1.jpg", avatarAlt: "Sarah" },
    ],
  },
  footer: {
    brand: { name: "Velocity", logo: "/images/logo.svg" },
    newsletter: { heading: "Stay in the race", placeholder: "Enter your email", cta: "Subscribe" },
    socials: [{ platform: "Instagram", url: "https://instagram.com", icon: "instagram" }],
    links: [{ group: "Shop", items: [{ label: "Running", href: "/running" }] }],
    legal: "© 2026 Velocity Athletics",
  },
};

export default function ContentPage() {
  const [content, setContent] = useState<Record<string, unknown>>(DEMO_CONTENT);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sections = generateSectionsFromContent(content);

  const handleSave = async (updatedContent: Record<string, unknown>) => {
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setContent(updatedContent);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Editor</h1>
          <p className="text-zinc-400 mt-1">Edit your site content visually</p>
        </div>
        {saved && (
          <span className="text-sm text-green-400 flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            Changes saved
          </span>
        )}
      </div>

      <ContentEditor
        sections={sections}
        content={content}
        onSave={handleSave}
      />
    </div>
  );
}
