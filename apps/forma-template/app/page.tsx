"use client";

import Image from "next/image";
import Link from "next/link";

const featuredProjects = [
  { slug: "villa-serenity", name: "Villa Serenity", category: "Residential", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", year: "2025" },
  { slug: "the-loft-kitchen", name: "The Loft Kitchen", category: "Interior", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80", year: "2025" },
  { slug: "casa-moderna", name: "Casa Moderna", category: "Residential", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", year: "2024" },
];

export default function HomePage() {
  return (
    <>
      {/* ===== HERO — SPLIT LAYOUT ===== */}
      <section className="min-h-screen pt-16 flex items-center" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text — MASSIVE */}
            <div className="order-2 lg:order-1 py-12 lg:py-0">
              <h1
                className="leading-[0.95] mb-8"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "#111111",
                  fontSize: "clamp(3rem, 8vw, 8rem)",
                }}
              >
                WE
                <br />
                DESIGN
                <br />
                SPACES
                <br />
                THAT
                <br />
                <span style={{ color: "#E63946" }}>INSPIRE</span>
              </h1>
              <p className="text-base sm:text-lg leading-relaxed max-w-md mb-10" style={{ color: "#888888", fontWeight: 300 }}>
                Award-winning architecture and interior design studio creating
                spaces where form meets function.
              </p>
              <Link
                href="/projects"
                className="inline-flex items-center text-sm font-medium tracking-wide transition-opacity hover:opacity-50"
                style={{ color: "#111111", borderBottom: "2px solid #111111", paddingBottom: "4px" }}
              >
                View Projects
              </Link>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 relative aspect-[3/4] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
                alt="Modern house architecture"
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-20 sm:py-28" style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E5E5" }}>
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="flex flex-wrap justify-start gap-16 sm:gap-24">
            <div>
              <p
                className="text-6xl sm:text-8xl"
                style={{ fontFamily: "var(--font-heading)", color: "#111111" }}
              >
                47
              </p>
              <p className="text-sm mt-2" style={{ color: "#888888" }}>Projects Completed</p>
            </div>
            <div>
              <p
                className="text-6xl sm:text-8xl"
                style={{ fontFamily: "var(--font-heading)", color: "#111111" }}
              >
                12
              </p>
              <p className="text-sm mt-2" style={{ color: "#888888" }}>Awards Won</p>
            </div>
            <div>
              <p
                className="text-6xl sm:text-8xl"
                style={{ fontFamily: "var(--font-heading)", color: "#111111" }}
              >
                8
              </p>
              <p className="text-sm mt-2" style={{ color: "#888888" }}>Years Active</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      <section className="py-20 sm:py-28" style={{ backgroundColor: "#F5F3EF" }}>
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="flex items-end justify-between mb-16">
            <h2
              className="text-3xl sm:text-5xl leading-tight"
              style={{ fontFamily: "var(--font-heading)", color: "#111111" }}
            >
              FEATURED
              <br />
              WORK
            </h2>
            <Link
              href="/projects"
              className="text-sm font-medium transition-opacity hover:opacity-50 hidden sm:block"
              style={{ color: "#888888" }}
            >
              All Projects &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group block relative overflow-hidden"
                style={{ aspectRatio: "3/4" }}
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500 flex flex-col items-start justify-end p-8">
                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-xs tracking-wider uppercase mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {project.category} &middot; {project.year}
                    </p>
                    <h3 className="text-xl font-medium text-white" style={{ fontFamily: "var(--font-body)" }}>
                      {project.name}
                    </h3>
                    <p className="text-sm mt-2 text-white/60">
                      View &rarr;
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/projects"
            className="block text-center mt-10 text-sm font-medium transition-opacity hover:opacity-50 sm:hidden"
            style={{ color: "#888888" }}
          >
            All Projects &rarr;
          </Link>
        </div>
      </section>

      {/* ===== PHILOSOPHY QUOTE ===== */}
      <section className="py-28 sm:py-40" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-[1000px] px-6 sm:px-10 text-center">
          <p
            className="text-2xl sm:text-4xl lg:text-5xl leading-snug font-normal"
            style={{ fontFamily: "var(--font-heading)", color: "#111111" }}
          >
            &ldquo;ARCHITECTURE IS THE
            <br />
            THOUGHTFUL MAKING
            <br />
            OF <span style={{ color: "#E63946" }}>SPACE</span>&rdquo;
          </p>
          <p className="text-sm mt-8" style={{ color: "#CCCCCC" }}>
            &mdash; Louis Kahn
          </p>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 sm:py-32" style={{ backgroundColor: "#111111" }}>
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 text-center">
          <h2
            className="text-4xl sm:text-6xl lg:text-7xl leading-tight mb-8"
            style={{ fontFamily: "var(--font-heading)", color: "#FFFFFF" }}
          >
            LET&apos;S BUILD
            <br />
            SOMETHING
          </h2>
          <Link
            href="/studio"
            className="inline-flex items-center px-8 py-4 text-sm font-medium tracking-wider transition-all hover:opacity-80"
            style={{ backgroundColor: "#E63946", color: "#FFFFFF" }}
          >
            GET IN TOUCH
          </Link>
        </div>
      </section>
    </>
  );
}
