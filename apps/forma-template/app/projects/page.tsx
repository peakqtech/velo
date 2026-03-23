"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const categories = ["All", "Residential", "Commercial", "Hospitality", "Interior"];

const projects = [
  { slug: "villa-serenity", name: "Villa Serenity", category: "Residential", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80", location: "Bali, Indonesia", year: "2025" },
  { slug: "the-loft-kitchen", name: "The Loft Kitchen", category: "Interior", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80", location: "Jakarta, Indonesia", year: "2025" },
  { slug: "azure-living", name: "Azure Living Room", category: "Interior", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80", location: "Bandung, Indonesia", year: "2025" },
  { slug: "casa-moderna", name: "Casa Moderna", category: "Residential", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80", location: "Surabaya, Indonesia", year: "2024" },
  { slug: "zen-retreat", name: "Zen Retreat", category: "Hospitality", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80", location: "Yogyakarta, Indonesia", year: "2024" },
  { slug: "brutalist-studio", name: "Brutalist Studio", category: "Commercial", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80", location: "Jakarta, Indonesia", year: "2024" },
  { slug: "modern-house", name: "Modern Residence", category: "Residential", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80", location: "Semarang, Indonesia", year: "2023" },
  { slug: "design-studio", name: "The Design Studio", category: "Commercial", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80", location: "Jakarta, Indonesia", year: "2023" },
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="pt-16" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <h1
            className="text-5xl sm:text-7xl lg:text-8xl leading-none mb-8"
            style={{ fontFamily: "var(--font-heading)", color: "#111111" }}
          >
            PROJECTS
          </h1>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-4" style={{ borderBottom: "1px solid #E5E5E5", paddingBottom: "16px" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="text-sm font-medium transition-all"
                style={{
                  color: filter === cat ? "#111111" : "#CCCCCC",
                  borderBottom: filter === cat ? "2px solid #111111" : "2px solid transparent",
                  paddingBottom: "4px",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="pb-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filtered.map((project, i) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group block relative overflow-hidden break-inside-avoid"
                style={{ aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "4/5" : "1/1" }}
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-500 flex flex-col items-start justify-end p-6 sm:p-8">
                  <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-xs tracking-wider uppercase mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {project.category} &middot; {project.year}
                    </p>
                    <h3 className="text-lg font-medium text-white" style={{ fontFamily: "var(--font-body)" }}>
                      {project.name}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {project.location}
                    </p>
                    <p className="text-sm mt-3 text-white/60">
                      View &rarr;
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
