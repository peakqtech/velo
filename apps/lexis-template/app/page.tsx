"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const practiceAreas = [
  { name: "Corporate Law", desc: "Strategic counsel for mergers, acquisitions, compliance, and corporate governance." },
  { name: "Property Law", desc: "Comprehensive real estate services from transactions to dispute resolution." },
  { name: "Immigration", desc: "Expert guidance on visas, work permits, citizenship, and immigration compliance." },
  { name: "Family Law", desc: "Sensitive handling of divorce, custody, prenuptial agreements, and estates." },
  { name: "Criminal Defense", desc: "Vigorous defense strategies for all criminal matters with proven results." },
  { name: "Tax Advisory", desc: "Proactive tax planning and dispute resolution for individuals and corporations." },
];

const attorneys = [
  { name: "Alexander Hartono, SH, MH", role: "Managing Partner", specialty: "Corporate Law", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80", experience: "25 years" },
  { name: "Victoria Susanto, SH, LLM", role: "Senior Partner", specialty: "Immigration Law", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80", experience: "18 years" },
  { name: "David Prasetyo, SH, MH", role: "Partner", specialty: "Criminal Defense", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80", experience: "15 years" },
];

const stats = [
  { label: "Cases Won", target: 500, suffix: "+" },
  { label: "Success Rate", target: 98, suffix: "%" },
  { label: "Years Experience", target: 25, suffix: "" },
  { label: "Corporate Clients", target: 120, suffix: "+" },
];

const testimonials = [
  { name: "PT Maju Bersama", text: "Lexis handled our merger with exceptional professionalism. Their corporate team navigated complex regulations flawlessly.", role: "CEO" },
  { name: "Siti Rahayu", text: "During the most difficult time in my life, the family law team at Lexis provided not just legal expertise but genuine compassion.", role: "Client" },
  { name: "Global Ventures Ltd", text: "Their immigration practice streamlined our employee relocation process. What used to take months now takes weeks.", role: "HR Director" },
];

const awards = ["Best Law Firm 2025", "Top 50 Lawyers Asia", "Legal Innovation Award", "Pro Bono Excellence"];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count}{suffix}
    </span>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ===== HERO — DARK NAVY FULL VIEWPORT ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80"
          alt="Law library"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.92) 100%)" }} />

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="w-16 h-0.5 mx-auto mb-8" style={{ backgroundColor: "#B8860B" }} />
          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[1.05] mb-8"
            style={{ fontFamily: "var(--font-heading)", color: "#FFFFFF" }}
          >
            Justice.
            <br />
            <span style={{ color: "#B8860B" }}>Integrity.</span>
            <br />
            Excellence.
          </h1>
          <p className="text-lg sm:text-xl font-light max-w-2xl mx-auto mb-12" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)" }}>
            Providing exceptional legal counsel to individuals and corporations
            for over two decades. Your rights, our commitment.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 text-sm font-semibold tracking-wider uppercase transition-all hover:opacity-90"
              style={{ backgroundColor: "#B8860B", color: "#0F172A", borderRadius: "4px" }}
            >
              Schedule Consultation
            </Link>
            <Link
              href="/practice-areas"
              className="px-8 py-4 text-sm font-semibold tracking-wider uppercase transition-all hover:opacity-80"
              style={{ color: "#B8860B", border: "1px solid #B8860B", borderRadius: "4px" }}
            >
              Our Expertise
            </Link>
          </div>
          <div className="w-16 h-0.5 mx-auto mt-12" style={{ backgroundColor: "#B8860B" }} />
        </div>
      </section>

      {/* ===== PRACTICE AREAS ===== */}
      <section className="py-24" style={{ backgroundColor: "#FAF8F5" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#B8860B" }}>
              Areas of Expertise
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
              Practice Areas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceAreas.map((area) => (
              <div
                key={area.name}
                className="p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group cursor-pointer"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderLeft: "4px solid #B8860B",
                  borderRadius: "4px",
                }}
              >
                <h3
                  className="text-lg font-semibold mb-3 group-hover:text-[#B8860B] transition-colors"
                  style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}
                >
                  {area.name}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                  {area.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-sm font-medium" style={{ color: "#B8860B" }}>
                  Learn More
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ATTORNEYS ===== */}
      <section className="py-24" style={{ backgroundColor: "#1E293B" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#B8860B" }}>
              Our Team
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#FFFFFF" }}>
              Lead Attorneys
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {attorneys.map((atty) => (
              <div
                key={atty.name}
                className="overflow-hidden group"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={atty.image}
                    alt={atty.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#B8860B" }}>
                    {atty.name}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>{atty.role}</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {atty.specialty} &middot; {atty.experience}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CASE RESULTS / STATS ===== */}
      <section className="py-20" style={{ backgroundColor: "#0F172A" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p
                  className="text-5xl sm:text-6xl font-bold"
                  style={{ fontFamily: "var(--font-heading)", color: "#B8860B" }}
                >
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </p>
                <p className="text-sm mt-2 tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24" style={{ backgroundColor: "#FAF8F5" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#B8860B" }}>
              Client Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-8 relative"
                style={{ backgroundColor: "#FFFFFF", borderRadius: "4px" }}
              >
                <span className="text-6xl font-bold absolute top-4 left-6 leading-none" style={{ color: "#B8860B", opacity: 0.15, fontFamily: "var(--font-heading)" }}>
                  &ldquo;
                </span>
                <p className="text-sm leading-relaxed mb-6 relative z-10" style={{ color: "#334155" }}>
                  {t.text}
                </p>
                <div className="relative z-10">
                  <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#B8860B" }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AWARDS ===== */}
      <section className="py-14" style={{ backgroundColor: "#1E293B" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16">
            {awards.map((award) => (
              <div key={award} className="text-center">
                <p className="text-sm font-medium tracking-wider" style={{ color: "rgba(184,134,11,0.6)" }}>
                  {award}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
