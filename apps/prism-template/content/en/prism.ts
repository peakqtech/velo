import type { PrismContent } from "@velo/types";

const content: PrismContent = {
  hero: {
    headline: "Modern Solutions for Customer Engagement",
    subtitle:
      "Highly customizable components for building modern websites and applications that look and feel the way you mean it.",
    searchPlaceholder: "Search tools, integrations, workflows...",
    announcement: "Introducing Support for AI Models",
    screenshotSrc: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2700&q=80",
    cta: { label: "Start Building", href: "#features" },
    secondaryCta: { label: "Request a demo", href: "#pricing" },
    trustedBy: [
      { name: "Stripe", logo: "/logos/stripe.svg" },
      { name: "Vercel", logo: "/logos/vercel.svg" },
      { name: "Linear", logo: "/logos/linear.svg" },
      { name: "Raycast", logo: "/logos/raycast.svg" },
      { name: "Supabase", logo: "/logos/supabase.svg" },
      { name: "GitHub", logo: "/logos/github.svg" },
      { name: "Notion", logo: "/logos/notion.svg" },
      { name: "Figma", logo: "/logos/figma.svg" },
    ],
  },

  features: {
    heading: "Everything you need to scale",
    subtitle:
      "Powerful features designed to help your team work smarter, not harder.",
    features: [
      {
        title: "Real-time Analytics",
        description:
          "Track every metric that matters with live dashboards and custom reports. Make data-driven decisions in seconds.",
        icon: "\u{1F4CA}",
      },
      {
        title: "Team Collaboration",
        description:
          "Work together seamlessly with shared workspaces, inline comments, and real-time editing across your entire team.",
        icon: "\u{1F465}",
      },
      {
        title: "Smart Automation",
        description:
          "Automate repetitive tasks with intelligent workflows. Set triggers, conditions, and actions — no code required.",
        icon: "\u{26A1}",
      },
      {
        title: "Enterprise Security",
        description:
          "SOC 2 compliant with end-to-end encryption, SSO, and granular role-based access controls for peace of mind.",
        icon: "\u{1F512}",
      },
      {
        title: "200+ Integrations",
        description:
          "Connect with the tools you already use. From Slack to Salesforce, our integrations keep your stack unified.",
        icon: "\u{1F517}",
      },
      {
        title: "24/7 Support",
        description:
          "Get help when you need it with dedicated support, comprehensive docs, and a thriving community forum.",
        icon: "\u{1F4AC}",
      },
    ],
  },

  pricing: {
    heading: "Simple, transparent pricing",
    subtitle:
      "No hidden fees. No surprises. Choose the plan that fits your team.",
    plans: [
      {
        name: "Free",
        description: "For individuals and small projects getting started.",
        price: { amount: 0, period: "month", currency: "USD" },
        features: [
          "Up to 3 team members",
          "5 GB storage",
          "Basic analytics",
          "Community support",
          "10 integrations",
        ],
        cta: { label: "Get Started", href: "/signup?plan=free" },
      },
      {
        name: "Pro",
        description: "For growing teams that need more power and flexibility.",
        price: { amount: 29, period: "month", currency: "USD" },
        features: [
          "Unlimited team members",
          "100 GB storage",
          "Advanced analytics & reports",
          "Priority email support",
          "Unlimited integrations",
          "Custom workflows",
        ],
        cta: { label: "Start Free Trial", href: "/signup?plan=pro" },
        highlighted: true,
      },
      {
        name: "Enterprise",
        description:
          "For organizations that need security, compliance, and scale.",
        price: { amount: 99, period: "month", currency: "USD" },
        features: [
          "Everything in Pro",
          "Unlimited storage",
          "SSO & SAML",
          "Dedicated account manager",
          "Custom SLA",
          "Audit logs & compliance",
          "On-premise deployment",
        ],
        cta: { label: "Contact Sales", href: "/contact" },
      },
    ],
  },

  integrations: {
    heading: "Connects with your favorite tools",
    integrations: [
      { name: "Slack", logo: "/logos/slack.svg", category: "Communication" },
      {
        name: "GitHub",
        logo: "/logos/github.svg",
        category: "Development",
      },
      { name: "Figma", logo: "/logos/figma.svg", category: "Design" },
      {
        name: "Notion",
        logo: "/logos/notion.svg",
        category: "Productivity",
      },
      {
        name: "Linear",
        logo: "/logos/linear.svg",
        category: "Project Management",
      },
      {
        name: "Stripe",
        logo: "/logos/stripe.svg",
        category: "Payments",
      },
      {
        name: "Vercel",
        logo: "/logos/vercel.svg",
        category: "Deployment",
      },
      {
        name: "Supabase",
        logo: "/logos/supabase.svg",
        category: "Database",
      },
    ],
  },

  testimonials: {
    heading: "Loved by teams worldwide",
    testimonials: [
      {
        quote:
          "Prism transformed how our team discovers and manages tools. We cut our SaaS spend by 30% in the first quarter alone.",
        author: "Sarah Chen",
        role: "VP of Engineering, Acme Corp",
        avatar: "/avatars/sarah.jpg",
        avatarAlt: "Sarah Chen headshot",
      },
      {
        quote:
          "The integrations marketplace is a game-changer. Everything just works together, and the automation features save us hours every week.",
        author: "Marcus Johnson",
        role: "CTO, TechFlow Inc",
        avatar: "/avatars/marcus.jpg",
        avatarAlt: "Marcus Johnson headshot",
      },
      {
        quote:
          "We evaluated dozens of platforms before choosing Prism. The clean UI, powerful analytics, and responsive support made it an easy decision.",
        author: "Elena Rodriguez",
        role: "Head of Operations, ScaleUp",
        avatar: "/avatars/elena.jpg",
        avatarAlt: "Elena Rodriguez headshot",
      },
    ],
  },

  faq: {
    heading: "Frequently asked questions",
    subtitle:
      "Got questions? We have answers. If you need more help, reach out to our support team.",
    questions: [
      {
        question: "How does the free trial work?",
        answer:
          "Start with a 14-day free trial of the Pro plan. No credit card required. At the end of your trial, you can choose to continue with Pro or switch to the Free plan.",
      },
      {
        question: "Can I change plans at any time?",
        answer:
          "Absolutely. You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately, and we prorate any billing differences.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Security is our top priority. We are SOC 2 Type II compliant, use end-to-end encryption for all data in transit and at rest, and conduct regular third-party security audits.",
      },
      {
        question: "Do you offer custom enterprise solutions?",
        answer:
          "Yes. Our Enterprise plan includes dedicated account management, custom SLAs, on-premise deployment options, and tailored integrations. Contact our sales team to discuss your needs.",
      },
      {
        question: "What integrations do you support?",
        answer:
          "We support over 200 integrations including Slack, GitHub, Figma, Notion, Linear, Stripe, and many more. We are constantly adding new integrations based on customer feedback.",
      },
      {
        question: "How do I cancel my subscription?",
        answer:
          "You can cancel your subscription at any time from your account settings. Your account will remain active until the end of your current billing period. We do not charge cancellation fees.",
      },
    ],
  },

  footer: {
    brand: {
      name: "Prism",
      logo: "/logos/prism-logo.svg",
    },
    newsletter: {
      heading: "Stay in the loop",
      placeholder: "Enter your email",
      cta: "Subscribe",
    },
    socials: [
      { platform: "Twitter", url: "https://twitter.com/prism", icon: "twitter" },
      { platform: "GitHub", url: "https://github.com/prism", icon: "github" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/prism", icon: "linkedin" },
      { platform: "Discord", url: "https://discord.gg/prism", icon: "discord" },
    ],
    links: [
      {
        group: "Product",
        items: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Integrations", href: "#integrations" },
          { label: "Changelog", href: "/changelog" },
        ],
      },
      {
        group: "Company",
        items: [
          { label: "About", href: "/about" },
          { label: "Blog", href: "/blog" },
          { label: "Careers", href: "/careers" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        group: "Legal",
        items: [
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
          { label: "Security", href: "/security" },
        ],
      },
    ],
    legal: "\u00A9 2026 Prism. All rights reserved.",
  },

  metadata: {
    title: "Prism — The SaaS Marketplace for Modern Teams",
    description:
      "Discover, compare, and integrate the best SaaS tools. Prism helps teams find the perfect tools with real-time analytics, automation, and 200+ integrations.",
    ogImage: "/og-prism.png",
  },
};

export default content;
