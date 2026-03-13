import type { VelocityContent } from "@/lib/types";

const content: VelocityContent = {
  hero: {
    headline: "Break Every Limit",
    tagline: "Engineered for athletes who refuse to stop.",
    cta: { label: "Shop Now", href: "#products" },
    media: { type: "image", src: "/images/hero-placeholder.jpg", poster: "/images/hero-poster.jpg", alt: "Athlete sprinting in Velocity gear" },
    overlay: { opacity: 0.4, gradient: "linear-gradient(to bottom, transparent, black)" },
  },
  productShowcase: {
    title: "The Apex Runner",
    subtitle: "Our most advanced running shoe yet.",
    products: [{
      name: "Apex Runner Pro", image: "/images/shoe-placeholder.png", alt: "Velocity Apex Runner Pro in black and red",
      features: [
        { label: "Carbon Plate", position: { x: 30, y: 60 } },
        { label: "React Foam", position: { x: 70, y: 80 } },
        { label: "Breathable Mesh", position: { x: 50, y: 30 } },
      ],
    }],
  },
  brandStory: {
    chapters: [
      { heading: "Born on the Track", body: "Velocity started with a simple belief: every athlete deserves equipment that keeps up with their ambition.", media: { type: "image", src: "/images/story-1.jpg", alt: "Track and field at sunrise" }, layout: "right" },
      { heading: "Tested by Champions", body: "From Olympic trials to neighborhood 5Ks, our gear is battle-tested at every level of competition.", media: { type: "image", src: "/images/story-2.jpg", alt: "Athletes competing in Velocity gear" }, layout: "left" },
      { heading: "Built for Tomorrow", body: "Sustainable materials. Zero-waste manufacturing. Performance that does not cost the planet.", media: { type: "image", src: "/images/story-3.jpg", alt: "Sustainable manufacturing facility" }, layout: "full" },
    ],
  },
  productGrid: {
    heading: "Shop the Collection",
    categories: ["All", "Running", "Training", "Lifestyle"],
    products: [
      { name: "Apex Runner Pro", price: { amount: 180, currency: "USD" }, image: "/images/product-1.jpg", alt: "Apex Runner Pro shoe", category: "Running", badge: "New" },
      { name: "Velocity Trainer X", price: { amount: 140, currency: "USD" }, image: "/images/product-2.jpg", alt: "Velocity Trainer X shoe", category: "Training" },
      { name: "Street Glide", price: { amount: 120, currency: "USD" }, image: "/images/product-3.jpg", alt: "Street Glide casual shoe", category: "Lifestyle" },
      { name: "Sprint Elite", price: { amount: 200, currency: "USD" }, image: "/images/product-4.jpg", alt: "Sprint Elite racing shoe", category: "Running", badge: "Pro" },
      { name: "Power Lift", price: { amount: 160, currency: "USD" }, image: "/images/product-5.jpg", alt: "Power Lift training shoe", category: "Training" },
      { name: "Urban Flow", price: { amount: 110, currency: "USD" }, image: "/images/product-6.jpg", alt: "Urban Flow lifestyle sneaker", category: "Lifestyle" },
    ],
  },
  testimonials: {
    heading: "Athletes Speak",
    testimonials: [
      { quote: "The Apex Runner changed my race day. I PR'd by 3 minutes.", author: "Sarah Chen", role: "Marathon Runner", avatar: "/images/avatar-1.jpg", avatarAlt: "Sarah Chen portrait" },
      { quote: "Most comfortable training shoe I have ever worn. Period.", author: "Marcus Williams", role: "CrossFit Athlete", avatar: "/images/avatar-2.jpg", avatarAlt: "Marcus Williams portrait" },
      { quote: "Finally a brand that understands what sprinters need.", author: "Aisha Okafor", role: "100m Sprinter", avatar: "/images/avatar-3.jpg", avatarAlt: "Aisha Okafor portrait" },
    ],
  },
  footer: {
    brand: { name: "Velocity", logo: "/images/velocity-logo.svg" },
    newsletter: { heading: "Stay in the race", placeholder: "Enter your email", cta: "Subscribe" },
    socials: [
      { platform: "Instagram", url: "https://instagram.com", icon: "instagram" },
      { platform: "Twitter", url: "https://twitter.com", icon: "twitter" },
      { platform: "YouTube", url: "https://youtube.com", icon: "youtube" },
    ],
    links: [
      { group: "Shop", items: [{ label: "Running", href: "#" }, { label: "Training", href: "#" }, { label: "Lifestyle", href: "#" }] },
      { group: "Company", items: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }] },
      { group: "Support", items: [{ label: "FAQ", href: "#" }, { label: "Shipping", href: "#" }, { label: "Returns", href: "#" }] },
    ],
    legal: "© 2026 Velocity Athletics. All rights reserved.",
  },
  metadata: {
    title: "Velocity — Athletic Performance Redefined",
    description: "Premium athletic wear engineered for peak performance.",
    ogImage: "/images/og-image.jpg",
  },
};

export default content;
