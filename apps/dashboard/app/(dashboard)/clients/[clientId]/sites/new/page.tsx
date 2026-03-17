"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

/* ────────────────────────────────────────────────────────── */
/*  Types                                                      */
/* ────────────────────────────────────────────────────────── */

interface Template {
  name: string;
  displayName: string;
  description: string;
  businessType: string;
  style: string;
  sectionCount: number;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  defaultEnabled: boolean;
}

/* ────────────────────────────────────────────────────────── */
/*  Static data                                                */
/* ────────────────────────────────────────────────────────── */

const templatePreviews: Record<string, string> = {
  velocity: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&q=80",
  ember: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  haven: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  nexus: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  prism: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  serenity: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  commerce: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
  tropica: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=600&q=80",
  medica: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
  lexis: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80",
  forma: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
};

const templateBadges: Record<string, string[]> = {
  velocity: ["Portfolio", "Performance", "Athletics"],
  ember: ["Restaurant", "Booking", "Menu"],
  haven: ["Real Estate", "Listings", "Tours"],
  nexus: ["Agency", "Portfolio", "Services"],
  prism: ["SaaS", "Pricing", "Dashboard"],
  serenity: ["Wellness", "Booking", "Spa"],
  commerce: ["E-commerce", "Catalog", "Checkout"],
  tropica: ["Villa Rental", "Booking", "Gallery"],
  medica: ["Medical", "Appointments", "Doctors"],
  lexis: ["Law Firm", "Consultations", "Cases"],
  forma: ["Architecture", "Portfolio", "Projects"],
};

const templateGradients: Record<string, string> = {
  velocity: "from-red-600 to-orange-600",
  ember: "from-amber-600 to-red-700",
  haven: "from-emerald-600 to-teal-700",
  nexus: "from-orange-500 to-amber-600",
  prism: "from-violet-600 to-indigo-600",
  serenity: "from-green-600 to-emerald-700",
  commerce: "from-pink-600 to-rose-700",
  tropica: "from-cyan-600 to-teal-600",
  medica: "from-blue-600 to-cyan-700",
  lexis: "from-slate-600 to-zinc-700",
  forma: "from-stone-600 to-neutral-700",
};

/* ── Icons as tiny SVGs ────────────────────────────────── */

function IconReservation() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="16" r="2" />
    </svg>
  );
}

function IconOrdering() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}

function IconAnalytics() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconContact() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconNewsletter() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
      <line x1="10" y1="6" x2="18" y2="6" />
      <line x1="10" y1="10" x2="18" y2="10" />
      <line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}

function IconBooking() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M9 16l2 2 4-4" />
    </svg>
  );
}

function IconReviews() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function IconCart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
    </svg>
  );
}

function IconPayment() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

function IconDoctor() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <line x1="12" y1="11" x2="12" y2="17" />
      <line x1="9" y1="14" x2="15" y2="14" />
    </svg>
  );
}

function IconInsurance() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconScale() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="3" x2="12" y2="21" />
      <polyline points="1 12 5 8 9 12" />
      <polyline points="15 12 19 8 23 12" />
      <line x1="1" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="23" y2="12" />
    </svg>
  );
}

function IconBlog() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconPortfolio() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function IconGallery3D() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l9 4.5v7L12 18l-9-4.5v-7L12 2z" />
      <path d="M12 18v4" />
      <path d="M3 6.5l9 4.5 9-4.5" />
      <line x1="12" y1="11" x2="12" y2="18" />
    </svg>
  );
}

function IconTimeline() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconCase() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

/* ── Feature sets per template ─────────────────────────── */

const templateFeatures: Record<string, Feature[]> = {
  ember: [
    { id: "reservation", name: "Online Reservation", description: "Time slots, party size, deposit collection", icon: <IconReservation />, defaultEnabled: true },
    { id: "ordering", name: "Online Ordering", description: "Menu browsing, cart, and checkout flow", icon: <IconOrdering />, defaultEnabled: false },
    { id: "whatsapp", name: "WhatsApp Notifications", description: "Instant booking confirmations via WhatsApp", icon: <IconWhatsApp />, defaultEnabled: true },
    { id: "analytics", name: "Analytics (Plausible)", description: "Privacy-first visitor and conversion tracking", icon: <IconAnalytics />, defaultEnabled: false },
  ],
  tropica: [
    { id: "booking-calendar", name: "Booking Calendar", description: "Availability display with seasonal pricing", icon: <IconBooking />, defaultEnabled: true },
    { id: "whatsapp-inquiry", name: "WhatsApp Inquiry", description: "One-tap inquiry button for villa bookings", icon: <IconWhatsApp />, defaultEnabled: true },
    { id: "guest-reviews", name: "Guest Reviews", description: "Verified guest review collection and display", icon: <IconReviews />, defaultEnabled: false },
    { id: "analytics", name: "Analytics", description: "Privacy-first visitor and conversion tracking", icon: <IconAnalytics />, defaultEnabled: false },
  ],
  commerce: [
    { id: "catalog-cart", name: "Product Catalog + Cart + Checkout", description: "Full shopping experience with product pages", icon: <IconCart />, defaultEnabled: true },
    { id: "payment", name: "Payment Processing (Xendit/Stripe)", description: "Accept online payments securely", icon: <IconPayment />, defaultEnabled: true },
    { id: "order-management", name: "Order Management", description: "Track and manage customer orders", icon: <IconClipboard />, defaultEnabled: false },
    { id: "whatsapp-orders", name: "WhatsApp Orders", description: "Receive order notifications via WhatsApp", icon: <IconWhatsApp />, defaultEnabled: false },
  ],
  medica: [
    { id: "appointment", name: "Appointment Booking", description: "Online scheduling with available time slots", icon: <IconBooking />, defaultEnabled: true },
    { id: "doctor-profiles", name: "Doctor Profiles", description: "Detailed profiles with specializations and bio", icon: <IconDoctor />, defaultEnabled: true },
    { id: "patient-reviews", name: "Patient Reviews", description: "Verified patient testimonials and ratings", icon: <IconReviews />, defaultEnabled: false },
    { id: "insurance-info", name: "Insurance Info", description: "List accepted insurance providers and plans", icon: <IconInsurance />, defaultEnabled: false },
  ],
  lexis: [
    { id: "consultation", name: "Consultation Booking", description: "Schedule initial consultations online", icon: <IconBooking />, defaultEnabled: true },
    { id: "practice-areas", name: "Practice Area Pages", description: "Detailed pages for each legal specialty", icon: <IconScale />, defaultEnabled: true },
    { id: "case-results", name: "Case Results", description: "Showcase notable case outcomes", icon: <IconCase />, defaultEnabled: false },
    { id: "blog", name: "Blog/Articles", description: "Legal insights and news articles", icon: <IconBlog />, defaultEnabled: false },
  ],
  forma: [
    { id: "portfolio", name: "Project Portfolio", description: "Visual showcase of completed projects", icon: <IconPortfolio />, defaultEnabled: true },
    { id: "contact-form", name: "Contact Form", description: "Inquiry form for potential clients", icon: <IconContact />, defaultEnabled: true },
    { id: "3d-gallery", name: "3D Gallery", description: "Interactive 3D renders and walkthroughs", icon: <IconGallery3D />, defaultEnabled: false },
    { id: "process-timeline", name: "Process Timeline", description: "Visual workflow from concept to completion", icon: <IconTimeline />, defaultEnabled: false },
  ],
};

const defaultFeatures: Feature[] = [
  { id: "contact-form", name: "Contact Form", description: "Inquiry form with email notifications", icon: <IconContact />, defaultEnabled: true },
  { id: "whatsapp-chat", name: "WhatsApp Chat", description: "Floating WhatsApp chat button", icon: <IconWhatsApp />, defaultEnabled: false },
  { id: "analytics", name: "Analytics", description: "Privacy-first visitor tracking", icon: <IconAnalytics />, defaultEnabled: false },
  { id: "newsletter", name: "Newsletter Signup", description: "Email collection with double opt-in", icon: <IconNewsletter />, defaultEnabled: false },
];

function getFeaturesForTemplate(templateName: string): Feature[] {
  return templateFeatures[templateName] ?? defaultFeatures;
}

/* ────────────────────────────────────────────────────────── */
/*  Step Indicator                                             */
/* ────────────────────────────────────────────────────────── */

const steps = [
  { num: 1, label: "Template" },
  { num: 2, label: "Details" },
  { num: 3, label: "Features" },
  { num: 4, label: "Review" },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((step, i) => {
        const isActive = step.num === current;
        const isCompleted = step.num < current;
        return (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white ring-4 ring-blue-600/20"
                    : isCompleted
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/40"
                    : "bg-zinc-800/80 text-zinc-500 border border-zinc-700/50"
                }`}
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  step.num
                )}
              </div>
              <span
                className={`text-[11px] mt-1.5 font-medium transition-colors duration-300 ${
                  isActive ? "text-blue-400" : isCompleted ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 sm:w-24 h-px mx-3 mb-5 transition-colors duration-300 ${
                  step.num < current ? "bg-blue-600/40" : "bg-zinc-800"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Step 1: Choose Template                                    */
/* ────────────────────────────────────────────────────────── */

const templatePorts: Record<string, number> = {
  velocity: 3000, ember: 3001, haven: 3002, nexus: 3003, prism: 3004,
  serenity: 3005, commerce: 3006, tropica: 3007, medica: 3008, lexis: 3009, forma: 3010,
};

function Step1ChooseTemplate({
  templates,
  selected,
  onSelect,
}: {
  templates: Template[];
  selected: string | null;
  onSelect: (name: string) => void;
}) {
  const [previewOpen, setPreviewOpen] = useState<string | null>(null);

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-100 mb-1">Choose a Template</h2>
      <p className="text-sm text-zinc-500 mb-6">Pick the perfect starting point. Click &quot;Preview&quot; to see the live template.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((t) => {
          const isSelected = selected === t.name;
          const preview = templatePreviews[t.name];
          const badges = templateBadges[t.name] ?? [t.businessType];
          const isPreviewOpen = previewOpen === t.name;
          const port = templatePorts[t.name];
          const liveUrl = port ? `http://localhost:${port}` : null;

          return (
            <div
              key={t.name}
              className={`rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-500/20 bg-zinc-900"
                  : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/50"
              }`}
            >
              {/* Clickable header to select */}
              <button
                onClick={() => onSelect(t.name)}
                className="group text-left w-full"
              >
                {/* Preview image */}
                <div className="relative h-40 overflow-hidden bg-zinc-800">
                  {preview ? (
                    <Image
                      src={preview}
                      alt={t.displayName}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${templateGradients[t.name] ?? "from-zinc-700 to-zinc-800"}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-transparent to-transparent" />

                  {isSelected && (
                    <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg bg-gradient-to-br ${templateGradients[t.name] ?? "from-zinc-600 to-zinc-700"} flex items-center justify-center shadow-lg`}>
                      <span className="text-xs font-bold text-white">{t.name[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white drop-shadow-md">{t.displayName}</p>
                      <p className="text-[11px] text-zinc-300/80">{t.businessType}</p>
                    </div>
                  </div>
                </div>
              </button>

              {/* Card body */}
              <div className="p-4">
                <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{t.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {badges.slice(0, 3).map((badge) => (
                      <span key={badge} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                        {badge}
                      </span>
                    ))}
                  </div>
                  {liveUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewOpen(isPreviewOpen ? null : t.name);
                      }}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors flex items-center gap-1.5"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {isPreviewOpen ? "Hide" : "Preview"}
                    </button>
                  )}
                </div>
              </div>

              {/* Live iframe preview — expands on click */}
              {isPreviewOpen && liveUrl && (
                <div className="border-t border-zinc-800">
                  <div className="relative bg-black" style={{ aspectRatio: "16/10" }}>
                    <iframe
                      src={liveUrl}
                      className="absolute inset-0 border-0"
                      style={{
                        width: "250%",
                        height: "250%",
                        transform: "scale(0.4)",
                        transformOrigin: "top left",
                      }}
                      title={`Live preview of ${t.displayName}`}
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-medium text-zinc-300">Live</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Step 2: Business Details                                   */
/* ────────────────────────────────────────────────────────── */

function Step2BusinessDetails({
  siteName,
  setSiteName,
  domain,
  setDomain,
  description,
  setDescription,
}: {
  siteName: string;
  setSiteName: (v: string) => void;
  domain: string;
  setDomain: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
}) {
  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-zinc-100 mb-1">Business Details</h2>
      <p className="text-sm text-zinc-500 mb-8">Tell us a bit about the business.</p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Site Name</label>
          <input
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full h-11 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="My Business"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Custom Domain <span className="text-zinc-500 font-normal">(optional)</span>
          </label>
          <input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full h-11 px-4 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="yourbusiness.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Business Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            placeholder="A brief description of the business, its services, and target audience..."
          />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Step 3: Features                                           */
/* ────────────────────────────────────────────────────────── */

function Step3Features({
  templateName,
  enabledFeatures,
  toggleFeature,
}: {
  templateName: string;
  enabledFeatures: Set<string>;
  toggleFeature: (id: string) => void;
}) {
  const features = getFeaturesForTemplate(templateName);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-zinc-100 mb-1">Choose Features</h2>
      <p className="text-sm text-zinc-500 mb-8">Toggle the integrations and features you need.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {features.map((f) => {
          const enabled = enabledFeatures.has(f.id);
          return (
            <button
              key={f.id}
              onClick={() => toggleFeature(f.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                enabled
                  ? "border-blue-500/50 bg-blue-500/5"
                  : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`mt-0.5 shrink-0 transition-colors ${enabled ? "text-blue-400" : "text-zinc-500"}`}>
                    {f.icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-medium transition-colors ${enabled ? "text-zinc-100" : "text-zinc-300"}`}>
                      {f.name}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{f.description}</p>
                  </div>
                </div>
                {/* Toggle switch */}
                <div
                  className={`shrink-0 w-10 h-6 rounded-full relative transition-colors duration-200 ${
                    enabled ? "bg-blue-600" : "bg-zinc-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      enabled ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Step 4: Review & Create                                    */
/* ────────────────────────────────────────────────────────── */

function Step4Review({
  template,
  siteName,
  domain,
  description,
  enabledFeatures,
  templateName,
  creating,
  error,
  onCreate,
}: {
  template: Template | null;
  siteName: string;
  domain: string;
  description: string;
  enabledFeatures: Set<string>;
  templateName: string;
  creating: boolean;
  error: string | null;
  onCreate: () => void;
}) {
  const features = getFeaturesForTemplate(templateName);
  const enabledList = features.filter((f) => enabledFeatures.has(f.id));
  const preview = templatePreviews[templateName];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-zinc-100 mb-1">Review & Create</h2>
      <p className="text-sm text-zinc-500 mb-8">Everything looks good? Let&apos;s launch this site.</p>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        {/* Template preview */}
        <div className="relative h-48 overflow-hidden bg-zinc-800">
          {preview ? (
            <Image
              src={preview}
              alt={template?.displayName ?? templateName}
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${templateGradients[templateName] ?? "from-zinc-700 to-zinc-800"}`} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${templateGradients[templateName] ?? "from-zinc-600 to-zinc-700"} flex items-center justify-center shadow-lg`}>
              <span className="text-base font-bold text-white">{templateName[0].toUpperCase()}</span>
            </div>
            <div>
              <p className="text-base font-semibold text-white">{template?.displayName ?? templateName}</p>
              <p className="text-sm text-zinc-300/80">{template?.businessType}</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Site Name</p>
              <p className="text-sm font-medium text-zinc-200">{siteName}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Domain</p>
              <p className="text-sm text-zinc-200">{domain || <span className="text-zinc-600">Not set</span>}</p>
            </div>
          </div>

          {description && (
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-zinc-400">{description}</p>
            </div>
          )}

          {/* Features */}
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Features ({enabledList.length})</p>
            {enabledList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {enabledList.map((f) => (
                  <span
                    key={f.id}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    {f.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-600">No features selected</p>
            )}
          </div>
        </div>

        {/* Create button */}
        <div className="p-5 pt-0">
          {error && (
            <p className="text-sm text-red-400 mb-3">{error}</p>
          )}
          <button
            onClick={onCreate}
            disabled={creating}
            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {creating ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating Site...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                Create Site
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Success animation                                          */
/* ────────────────────────────────────────────────────────── */

function SuccessOverlay({ siteName }: { siteName: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md">
      <div className="text-center animate-in fade-in zoom-in duration-500">
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-600/20 flex items-center justify-center ring-4 ring-green-600/10">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-zinc-100 mb-2">Site Created!</h2>
        <p className="text-zinc-400">{siteName} is ready to go. Redirecting...</p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Main Wizard Page                                           */
/* ────────────────────────────────────────────────────────── */

export default function NewSiteWizardPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.clientId as string;

  /* ── Client info ────────────────────────────────────── */
  const [clientName, setClientName] = useState("");
  const [loadingClient, setLoadingClient] = useState(true);

  /* ── Templates ──────────────────────────────────────── */
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  /* ── Wizard state ───────────────────────────────────── */
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [siteName, setSiteName] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [enabledFeatures, setEnabledFeatures] = useState<Set<string>>(new Set());

  /* ── Create state ───────────────────────────────────── */
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  /* ── Load client + templates ────────────────────────── */
  useEffect(() => {
    fetch(`/api/clients/${clientId}`)
      .then((r) => r.json())
      .then((data) => {
        setClientName(data.name ?? "");
        setSiteName(data.name ?? "");
      })
      .catch(() => {})
      .finally(() => setLoadingClient(false));

    fetch("/api/templates")
      .then((r) => r.json())
      .then((data) => setTemplates(data.templates ?? []))
      .catch(() => {})
      .finally(() => setLoadingTemplates(false));
  }, [clientId]);

  /* ── Initialize features when template changes ──────── */
  useEffect(() => {
    if (!selectedTemplate) return;
    const features = getFeaturesForTemplate(selectedTemplate);
    const defaults = new Set(features.filter((f) => f.defaultEnabled).map((f) => f.id));
    setEnabledFeatures(defaults);
  }, [selectedTemplate]);

  /* ── Handlers ───────────────────────────────────────── */
  const toggleFeature = useCallback((id: string) => {
    setEnabledFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedTemplate;
      case 2: return !!siteName.trim();
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const handleCreate = async () => {
    if (!selectedTemplate || !siteName.trim()) return;

    setCreating(true);
    setError(null);

    try {
      // Get default content for the template
      const templateRes = await fetch(`/api/templates?withContent=${selectedTemplate}`);
      const { defaultContent } = await templateRes.json();

      // Build features array
      const features = Array.from(enabledFeatures);

      // Create site
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: siteName.trim(),
          template: selectedTemplate,
          content: defaultContent || {},
          clientId,
          domain: domain.trim() || undefined,
          features,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create site");
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/clients/${clientId}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create site");
    } finally {
      setCreating(false);
    }
  };

  /* ── Loading state ──────────────────────────────────── */
  if (loadingClient || loadingTemplates) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded" />
        <div className="h-12 bg-zinc-800/50 rounded-xl" />
        <div className="grid grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-zinc-800/30 rounded-xl border border-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

  const selectedTemplateObj = templates.find((t) => t.name === selectedTemplate) ?? null;

  return (
    <div className="min-h-[80vh] flex flex-col">
      {/* Success overlay */}
      {showSuccess && <SuccessOverlay siteName={siteName} />}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-300 transition-colors">Clients</Link>
        <span>/</span>
        <Link href={`/clients/${clientId}`} className="hover:text-zinc-300 transition-colors">{clientName}</Link>
        <span>/</span>
        <span className="text-zinc-300">New Site</span>
      </div>

      {/* Step indicator */}
      <div className="mb-8">
        <StepIndicator current={step} />
      </div>

      {/* Step content */}
      <div className="flex-1 mb-8">
        {step === 1 && (
          <Step1ChooseTemplate
            templates={templates}
            selected={selectedTemplate}
            onSelect={setSelectedTemplate}
          />
        )}
        {step === 2 && (
          <Step2BusinessDetails
            siteName={siteName}
            setSiteName={setSiteName}
            domain={domain}
            setDomain={setDomain}
            description={description}
            setDescription={setDescription}
          />
        )}
        {step === 3 && selectedTemplate && (
          <Step3Features
            templateName={selectedTemplate}
            enabledFeatures={enabledFeatures}
            toggleFeature={toggleFeature}
          />
        )}
        {step === 4 && (
          <Step4Review
            template={selectedTemplateObj}
            siteName={siteName}
            domain={domain}
            description={description}
            enabledFeatures={enabledFeatures}
            templateName={selectedTemplate ?? ""}
            creating={creating}
            error={error}
            onCreate={handleCreate}
          />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="sticky bottom-0 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-6 pb-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-900"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              disabled={!canProceed()}
              className="px-6 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <div /> /* Create button is inside Step 4 */
          )}
        </div>
      </div>
    </div>
  );
}
