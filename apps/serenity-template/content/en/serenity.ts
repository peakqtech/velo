import type { SerenityContent } from "@velocity/types";

const content: SerenityContent = {
  hero: {
    headline: "Your Journey to Wellness Starts Here",
    tagline:
      "Experience personalized holistic care designed to restore balance, reduce stress, and help you thrive. Our board-certified practitioners are here to guide your path to lasting wellness.",
    cta: { label: "Book Your Visit", href: "/booking" },
    media: {
      type: "image",
      src: "/images/hero-wellness.jpg",
      alt: "Serene wellness center with natural light and calming greenery",
    },
    badges: [
      { label: "Board Certified", icon: "\u2705" },
      { label: "15+ Years", icon: "\u{1F3C6}" },
      { label: "Holistic Care", icon: "\u{1F33F}" },
    ],
  },

  services: {
    heading: "Our Wellness Services",
    subtitle:
      "A comprehensive range of treatments tailored to your unique needs, all delivered in a calm and nurturing environment.",
    services: [
      {
        title: "Massage Therapy",
        description:
          "Relieve tension and promote deep relaxation with our therapeutic massage techniques, from Swedish to deep tissue.",
        icon: "\u{1F64F}",
        duration: "60 min",
        price: "$120",
      },
      {
        title: "Acupuncture",
        description:
          "Restore energy flow and alleviate pain with traditional acupuncture performed by licensed practitioners.",
        icon: "\u{1FA7B}",
        duration: "45 min",
        price: "$95",
      },
      {
        title: "Yoga Classes",
        description:
          "Build strength, flexibility, and mindfulness through guided yoga sessions for all experience levels.",
        icon: "\u{1F9D8}",
        duration: "75 min",
        price: "$35",
      },
      {
        title: "Nutrition Counseling",
        description:
          "Develop a personalized nutrition plan with our certified dietitians to fuel your body and mind.",
        icon: "\u{1F957}",
        duration: "50 min",
        price: "$85",
      },
      {
        title: "Meditation & Breathwork",
        description:
          "Cultivate inner peace and mental clarity through guided meditation and conscious breathing practices.",
        icon: "\u{1F54A}\uFE0F",
        duration: "30 min",
        price: "$45",
      },
      {
        title: "Physical Therapy",
        description:
          "Recover from injury and improve mobility with evidence-based rehabilitation programs and hands-on care.",
        icon: "\u{1F4AA}",
        duration: "60 min",
        price: "$150",
      },
    ],
  },

  process: {
    heading: "How It Works",
    subtitle:
      "Your wellness journey is simple and seamless from start to finish.",
    steps: [
      {
        step: 1,
        title: "Book Online",
        description:
          "Choose your service and schedule a time that works for you through our easy online booking.",
        icon: "\u{1F4C5}",
      },
      {
        step: 2,
        title: "Initial Assessment",
        description:
          "Meet with your practitioner for a thorough evaluation to understand your goals and health history.",
        icon: "\u{1F50D}",
      },
      {
        step: 3,
        title: "Personalized Treatment",
        description:
          "Receive a customized care plan and begin your treatment with our expert team.",
        icon: "\u{1F33F}",
      },
      {
        step: 4,
        title: "Thrive & Maintain",
        description:
          "Enjoy lasting results with follow-up support and ongoing wellness guidance.",
        icon: "\u2728",
      },
    ],
  },

  practitioners: {
    heading: "Meet Our Practitioners",
    subtitle:
      "Our team of licensed professionals brings decades of combined experience in holistic and integrative health.",
    practitioners: [
      {
        name: "Dr. Maya Patel",
        specialty: "Integrative Medicine",
        image: "/images/practitioner-maya.jpg",
        alt: "Dr. Maya Patel, integrative medicine specialist",
        bio: "With over 18 years of experience, Dr. Patel combines Eastern and Western medicine to create comprehensive treatment plans for each patient.",
        credentials: ["MD", "ABIHM", "Licensed Acupuncturist"],
      },
      {
        name: "James Rivera, LMT",
        specialty: "Massage & Bodywork",
        image: "/images/practitioner-james.jpg",
        alt: "James Rivera, licensed massage therapist",
        bio: "James specializes in therapeutic massage and myofascial release, helping clients recover from chronic pain and sports injuries.",
        credentials: ["LMT", "NCTMB", "Sports Massage Cert."],
      },
      {
        name: "Sarah Kim, RDN",
        specialty: "Clinical Nutrition",
        image: "/images/practitioner-sarah.jpg",
        alt: "Sarah Kim, registered dietitian nutritionist",
        bio: "Sarah takes a food-as-medicine approach, crafting personalized nutrition strategies that support healing and long-term vitality.",
        credentials: ["RDN", "CNSC", "Certified Yoga Instructor"],
      },
    ],
  },

  testimonials: {
    heading: "What Our Patients Say",
    testimonials: [
      {
        quote:
          "Serenity Wellness completely changed my approach to health. The team is incredibly caring, and my chronic back pain has improved dramatically after just a few sessions.",
        author: "Linda Tran",
        role: "Patient, 2 years",
        avatar: "/avatars/linda.jpg",
        avatarAlt: "Linda Tran headshot",
      },
      {
        quote:
          "The holistic approach here is unlike anything I have experienced. Dr. Patel took the time to understand my whole health picture, not just my symptoms.",
        author: "David Okonkwo",
        role: "Patient, 1 year",
        avatar: "/avatars/david.jpg",
        avatarAlt: "David Okonkwo headshot",
      },
      {
        quote:
          "From yoga classes to nutrition counseling, every service is top-notch. This place truly feels like a sanctuary. I recommend it to everyone I know.",
        author: "Maria Gonzalez",
        role: "Patient, 3 years",
        avatar: "/avatars/maria.jpg",
        avatarAlt: "Maria Gonzalez headshot",
      },
    ],
  },

  booking: {
    heading: "Ready to Begin Your Wellness Journey?",
    subtitle:
      "Book your first appointment today and take the first step toward a healthier, more balanced life.",
    cta: { label: "Schedule an Appointment", href: "/booking" },
    phone: "(555) 234-5678",
    email: "hello@serenitywellness.com",
    hours: [
      { days: "Monday \u2013 Friday", time: "8:00 AM \u2013 7:00 PM" },
      { days: "Saturday", time: "9:00 AM \u2013 4:00 PM" },
      { days: "Sunday", time: "Closed" },
    ],
  },

  footer: {
    brand: {
      name: "Serenity Wellness",
      logo: "/logos/serenity-logo.svg",
    },
    newsletter: {
      heading: "Wellness tips, delivered weekly",
      placeholder: "Enter your email",
      cta: "Subscribe",
    },
    socials: [
      { platform: "Instagram", url: "https://instagram.com/serenitywellness", icon: "instagram" },
      { platform: "Facebook", url: "https://facebook.com/serenitywellness", icon: "facebook" },
      { platform: "YouTube", url: "https://youtube.com/@serenitywellness", icon: "youtube" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/serenitywellness", icon: "linkedin" },
    ],
    links: [
      {
        group: "Services",
        items: [
          { label: "Massage Therapy", href: "#services" },
          { label: "Acupuncture", href: "#services" },
          { label: "Yoga Classes", href: "#services" },
          { label: "Nutrition", href: "#services" },
        ],
      },
      {
        group: "About",
        items: [
          { label: "Our Story", href: "/about" },
          { label: "Practitioners", href: "#practitioners" },
          { label: "Testimonials", href: "#testimonials" },
          { label: "Careers", href: "/careers" },
        ],
      },
      {
        group: "Support",
        items: [
          { label: "Contact Us", href: "/contact" },
          { label: "Insurance", href: "/insurance" },
          { label: "Privacy Policy", href: "/privacy" },
          { label: "Terms of Service", href: "/terms" },
        ],
      },
    ],
    legal: "\u00A9 2026 Serenity Wellness Center. All rights reserved.",
  },

  metadata: {
    title: "Serenity Wellness \u2014 Holistic Health & Wellness Center",
    description:
      "Experience personalized holistic care at Serenity Wellness. Our board-certified practitioners offer massage therapy, acupuncture, yoga, nutrition counseling, and more.",
    ogImage: "/og-serenity.png",
  },
};

export default content;
