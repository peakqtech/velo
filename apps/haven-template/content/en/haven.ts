import type { HavenContent } from "@velocity/types";

const content: HavenContent = {
  hero: {
    headline: "Live Beyond Extraordinary",
    tagline: "Discover a curated collection of the world's most prestigious residences, where luxury meets artistry.",
    cta: { label: "Explore Properties", href: "#properties" },
    media: {
      type: "video",
      src: "/videos/haven-hero.mp4",
      poster: "/images/haven-hero-poster.jpg",
      alt: "Aerial view of luxury waterfront estate at golden hour",
    },
    stats: [
      { value: "$2.8B+", label: "Portfolio Value" },
      { value: "150+", label: "Exclusive Listings" },
      { value: "98%", label: "Client Satisfaction" },
      { value: "25+", label: "Years of Excellence" },
    ],
  },
  properties: {
    heading: "Featured Residences",
    subtitle: "Hand-selected properties that redefine luxury living.",
    properties: [
      {
        name: "The Azure Penthouse",
        location: "Manhattan, New York",
        price: "$4,500,000",
        image: "/images/property-1.jpg",
        alt: "Modern penthouse with panoramic skyline views",
        bedrooms: 4,
        bathrooms: 5,
        area: "6,200 sq ft",
        featured: true,
      },
      {
        name: "Villa Serenata",
        location: "Beverly Hills, California",
        price: "$3,200,000",
        image: "/images/property-2.jpg",
        alt: "Mediterranean villa with infinity pool",
        bedrooms: 5,
        bathrooms: 6,
        area: "8,400 sq ft",
      },
      {
        name: "The Meridian Estate",
        location: "Miami Beach, Florida",
        price: "$2,100,000",
        image: "/images/property-3.jpg",
        alt: "Contemporary oceanfront estate",
        bedrooms: 3,
        bathrooms: 4,
        area: "4,800 sq ft",
        featured: true,
      },
      {
        name: "Château Lumière",
        location: "Aspen, Colorado",
        price: "$1,200,000",
        image: "/images/property-4.jpg",
        alt: "Mountain retreat with floor-to-ceiling windows",
        bedrooms: 4,
        bathrooms: 3,
        area: "5,100 sq ft",
      },
    ],
  },
  amenities: {
    heading: "World-Class Amenities",
    subtitle: "Every detail designed to exceed your expectations.",
    amenities: [
      {
        title: "24/7 Concierge",
        description: "A dedicated team at your service around the clock, handling everything from reservations to personal errands.",
        icon: "\u{1F511}",
      },
      {
        title: "Infinity Pool & Spa",
        description: "Temperature-controlled infinity pool overlooking the skyline, complemented by a full-service spa and wellness center.",
        icon: "\u{1F30A}",
      },
      {
        title: "Private Spa & Wellness",
        description: "State-of-the-art treatment rooms, sauna, steam room, and meditation garden for total rejuvenation.",
        icon: "\u{1F9D6}",
      },
      {
        title: "Elite Fitness Center",
        description: "Professional-grade equipment, personal training suites, yoga studio, and indoor lap pool.",
        icon: "\u{1F3CB}",
      },
      {
        title: "Wine Cellar & Tasting Room",
        description: "Climate-controlled cellar housing over 2,000 bottles with an intimate tasting room for private events.",
        icon: "\u{1F377}",
      },
      {
        title: "Private Theater",
        description: "Dolby Atmos surround sound, 4K laser projection, and plush seating for an unmatched cinematic experience.",
        icon: "\u{1F3AC}",
      },
    ],
  },
  virtualTour: {
    heading: "Experience It Virtually",
    subtitle: "Step inside our properties from anywhere in the world with our immersive 3D virtual tours.",
    cta: { label: "Start Virtual Tour", href: "#tour" },
    media: {
      type: "image",
      src: "/images/virtual-tour-bg.jpg",
      poster: "/images/virtual-tour-bg.jpg",
      alt: "Interior of luxury living room with modern furnishings",
    },
  },
  neighborhood: {
    heading: "The Neighborhood",
    subtitle: "Perfectly situated in the heart of everything that matters.",
    highlights: [
      {
        title: "Fine Dining",
        description: "Michelin-starred restaurants and world-renowned chefs within walking distance.",
        distance: "0.3 mi",
        icon: "\u{1F37D}",
      },
      {
        title: "Central Park",
        description: "Direct access to lush green spaces, jogging trails, and serene waterfront promenades.",
        distance: "0.5 mi",
        icon: "\u{1F333}",
      },
      {
        title: "Elite Academies",
        description: "Top-rated private schools and prestigious universities in the immediate vicinity.",
        distance: "1.2 mi",
        icon: "\u{1F393}",
      },
      {
        title: "Luxury Shopping",
        description: "Designer boutiques, flagship stores, and exclusive shopping galleries steps away.",
        distance: "0.2 mi",
        icon: "\u{1F6CD}",
      },
    ],
  },
  agent: {
    heading: "Your Trusted Advisor",
    name: "Victoria Ashworth",
    title: "Senior Luxury Property Specialist",
    bio: "With over 18 years of experience in ultra-luxury real estate, Victoria has facilitated over $1.5 billion in transactions. Her deep understanding of the luxury market, combined with an unwavering commitment to discretion and personalized service, has earned her the trust of the world's most discerning buyers.",
    image: "/images/agent-portrait.jpg",
    alt: "Victoria Ashworth, Senior Luxury Property Specialist",
    phone: "+1 (212) 555-0198",
    email: "victoria@havenrealty.com",
    cta: { label: "Schedule a Consultation", href: "#contact" },
    credentials: [
      "Certified Luxury Home Marketing Specialist",
      "Top 1% Nationwide",
      "Forbes Global Properties",
      "Institute for Luxury Home Marketing",
    ],
  },
  footer: {
    brand: { name: "Haven", logo: "/images/haven-logo.svg" },
    newsletter: {
      heading: "Stay Informed on Exclusive Listings",
      placeholder: "Your email address",
      cta: "Subscribe",
    },
    socials: [
      { platform: "Instagram", url: "https://instagram.com", icon: "instagram" },
      { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
      { platform: "Facebook", url: "https://facebook.com", icon: "facebook" },
    ],
    links: [
      {
        group: "Properties",
        items: [
          { label: "Featured", href: "#" },
          { label: "New Listings", href: "#" },
          { label: "Sold", href: "#" },
        ],
      },
      {
        group: "Services",
        items: [
          { label: "Buying", href: "#" },
          { label: "Selling", href: "#" },
          { label: "Consulting", href: "#" },
        ],
      },
      {
        group: "Company",
        items: [
          { label: "About", href: "#" },
          { label: "Team", href: "#" },
          { label: "Contact", href: "#" },
        ],
      },
    ],
    legal: "\u00a9 2026 Haven Realty. All rights reserved.",
  },
  metadata: {
    title: "Haven \u2014 Luxury Real Estate for the Extraordinary",
    description: "Discover a curated collection of the world's most prestigious residences. Haven connects discerning buyers with extraordinary properties.",
    ogImage: "/images/og-image.jpg",
  },
};

export default content;
