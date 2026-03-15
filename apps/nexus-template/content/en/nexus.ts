import type { NexusContent } from "@velo/types";

const content: NexusContent = {
  hero: {
    headline: "We Build Digital",
    subheadline: "A strategic agency that transforms businesses through bold design and cutting-edge technology.",
    marqueeText: "Strategy \u00b7 Design \u00b7 Development \u00b7 Innovation",
    cta: { label: "Start a Project", href: "#contact" },
  },
  services: {
    heading: "What We Do",
    subtitle: "We partner with ambitious brands to create digital experiences that drive growth.",
    services: [
      { title: "Brand Strategy", description: "We define your brand's position, voice, and visual identity to stand out in crowded markets.", icon: "\u25c6", stats: "50+ Brands Launched" },
      { title: "Web Development", description: "Custom-built, high-performance websites and web applications using modern frameworks.", icon: "\u2b21", stats: "200+ Projects Delivered" },
      { title: "UI/UX Design", description: "Human-centered design that balances aesthetics with usability for maximum engagement.", icon: "\u25b3", stats: "98% Client Satisfaction" },
      { title: "Digital Marketing", description: "Data-driven campaigns across search, social, and programmatic channels.", icon: "\u25cb", stats: "3x Average ROI" },
      { title: "Mobile Apps", description: "Native and cross-platform mobile applications built for scale and performance.", icon: "\u25a1", stats: "10M+ Downloads" },
      { title: "AI Integration", description: "Leverage artificial intelligence to automate workflows and unlock new capabilities.", icon: "\u25c7", stats: "40% Efficiency Gains" },
    ],
  },
  caseStudies: {
    heading: "Selected Work",
    studies: [
      { title: "Reimagining E-Commerce", client: "TechVault Inc.", category: "Web Development", image: "/images/case-study-1.jpg", alt: "TechVault e-commerce platform redesign", result: "+240% conversion rate", href: "#" },
      { title: "Brand Evolution", client: "Flux Studios", category: "Brand Strategy", image: "/images/case-study-2.jpg", alt: "Flux Studios brand identity", result: "4x brand recognition", href: "#" },
      { title: "Mobile-First Banking", client: "NeoBank", category: "Mobile Apps", image: "/images/case-study-3.jpg", alt: "NeoBank mobile application", result: "2M users in 6 months", href: "#" },
      { title: "AI-Powered Analytics", client: "DataStream", category: "AI Integration", image: "/images/case-study-4.jpg", alt: "DataStream analytics dashboard", result: "60% faster insights", href: "#" },
    ],
  },
  team: {
    heading: "The Team",
    subtitle: "World-class talent united by a passion for exceptional digital craftsmanship.",
    members: [
      { name: "Alex Rivera", role: "Founder & CEO", image: "/images/team-1.jpg", alt: "Alex Rivera portrait", bio: "15 years shaping digital experiences for Fortune 500 companies." },
      { name: "Jordan Chen", role: "Creative Director", image: "/images/team-2.jpg", alt: "Jordan Chen portrait", bio: "Award-winning designer with a passion for brutalist aesthetics." },
      { name: "Sam Okonkwo", role: "Head of Engineering", image: "/images/team-3.jpg", alt: "Sam Okonkwo portrait", bio: "Full-stack architect building for scale and performance." },
      { name: "Maya Petrov", role: "Strategy Lead", image: "/images/team-4.jpg", alt: "Maya Petrov portrait", bio: "Former McKinsey consultant turned brand strategist." },
    ],
  },
  stats: {
    heading: "By the Numbers",
    stats: [
      { value: 200, suffix: "+", label: "Projects Delivered" },
      { value: 50, suffix: "+", label: "Happy Clients" },
      { value: 15, label: "Years Experience" },
      { value: 98, suffix: "%", label: "Client Retention" },
    ],
  },
  contact: {
    heading: "Let's Talk",
    subtitle: "Ready to transform your digital presence? We'd love to hear from you.",
    cta: { label: "Book a Call", href: "#" },
    email: "hello@nexus.agency",
    features: [
      { text: "Free Consultation" },
      { text: "2-Week Discovery Sprint" },
      { text: "Fixed-Price Projects" },
    ],
  },
  footer: {
    brand: { name: "Nexus", logo: "/images/nexus-logo.svg" },
    newsletter: { heading: "Stay in the loop", placeholder: "Your email", cta: "Subscribe" },
    socials: [
      { platform: "Twitter", url: "https://twitter.com", icon: "twitter" },
      { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      { platform: "Dribbble", url: "https://dribbble.com", icon: "dribbble" },
    ],
    links: [
      { group: "Services", items: [{ label: "Strategy", href: "#" }, { label: "Design", href: "#" }, { label: "Development", href: "#" }] },
      { group: "Company", items: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Blog", href: "#" }] },
      { group: "Legal", items: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }] },
    ],
    legal: "\u00a9 2026 Nexus Agency. All rights reserved.",
  },
  metadata: {
    title: "Nexus \u2014 Digital Agency for Bold Brands",
    description: "Strategic agency that transforms businesses through bold design and cutting-edge technology.",
    ogImage: "/images/og-image.jpg",
  },
};

export default content;
