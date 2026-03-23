"use client";

import Image from "next/image";
import { useState } from "react";

const team = [
  { name: "Aria Kusuma", role: "Founder & Principal Architect", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
  { name: "Lina Tanaka", role: "Design Director", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80" },
  { name: "Reza Firmansyah", role: "Senior Architect", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80" },
  { name: "Dian Permata", role: "Interior Designer", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80" },
];

const process = [
  { step: "01", title: "Brief", desc: "We listen. Understanding your vision, needs, and constraints forms the foundation of every project." },
  { step: "02", title: "Concept", desc: "Ideas take shape. We explore multiple design directions through sketches, mood boards, and 3D visualizations." },
  { step: "03", title: "Design", desc: "Precision matters. Detailed architectural drawings, material selections, and engineering coordination." },
  { step: "04", title: "Build", desc: "Vision becomes reality. On-site supervision ensures every detail matches the design intent." },
];

export default function StudioPage() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  return (
    <div className="pt-16" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <h1
            className="text-5xl sm:text-7xl lg:text-8xl leading-none mb-8"
            style={{ fontFamily: "var(--font-heading)", color: "#111111" }}
          >
            THE
            <br />
            STUDIO
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            <div>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: "#888888", fontWeight: 300 }}>
                FORMA was founded in 2018 with a simple belief: architecture should serve people, not egos.
                Every project we take on starts with listening — understanding how spaces will be lived in,
                worked in, and experienced.
              </p>
            </div>
            <div>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: "#888888", fontWeight: 300 }}>
                Based in Jakarta with projects across Indonesia and Southeast Asia, our team of architects,
                interior designers, and project managers brings diverse expertise to every challenge. We
                believe the best design emerges from collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Image */}
      <section className="pb-20">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="relative w-full" style={{ aspectRatio: "21/9" }}>
            <Image
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1600&q=80"
              alt="FORMA design studio"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 sm:py-28" style={{ backgroundColor: "#F5F3EF" }}>
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <h2
            className="text-3xl sm:text-5xl mb-16"
            style={{ fontFamily: "var(--font-heading)", color: "#111111" }}
          >
            TEAM
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {team.map((member) => (
              <div key={member.name}>
                <div className="relative aspect-[3/4] overflow-hidden mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    unoptimized
                  />
                </div>
                <h3 className="text-sm font-medium" style={{ color: "#111111" }}>{member.name}</h3>
                <p className="text-xs mt-0.5" style={{ color: "#888888" }}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 sm:py-28" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <h2
            className="text-3xl sm:text-5xl mb-16"
            style={{ fontFamily: "var(--font-heading)", color: "#111111" }}
          >
            PROCESS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step) => (
              <div key={step.step}>
                <p
                  className="text-6xl mb-4"
                  style={{ fontFamily: "var(--font-heading)", color: "#E5E5E5" }}
                >
                  {step.step}
                </p>
                <h3 className="text-lg font-medium mb-2" style={{ fontFamily: "var(--font-body)", color: "#111111" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#888888" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 sm:py-28" style={{ backgroundColor: "#111111" }}>
        <div className="mx-auto max-w-[700px] px-6 sm:px-10">
          <h2
            className="text-3xl sm:text-5xl text-center mb-12"
            style={{ fontFamily: "var(--font-heading)", color: "#FFFFFF" }}
          >
            GET IN TOUCH
          </h2>

          <form
            onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent!"); }}
            className="space-y-6"
          >
            <div>
              <input
                type="text"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                placeholder="Name"
                className="w-full px-0 py-4 text-sm bg-transparent outline-none text-white placeholder-zinc-600"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
              />
            </div>
            <div>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="Email"
                className="w-full px-0 py-4 text-sm bg-transparent outline-none text-white placeholder-zinc-600"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
              />
            </div>
            <div>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="Tell us about your project"
                rows={4}
                className="w-full px-0 py-4 text-sm bg-transparent outline-none text-white placeholder-zinc-600 resize-none"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 text-sm font-medium tracking-wider transition-all hover:opacity-80"
              style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
            >
              SEND INQUIRY
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
