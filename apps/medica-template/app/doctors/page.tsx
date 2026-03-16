"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const specialties = ["All", "General Medicine", "Dental Surgery", "Dermatology", "Pediatrics", "Cardiology"];

const doctors = [
  { name: "Dr. Sarah Chen", specialty: "General Medicine", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80", experience: "15 years", education: "University of Indonesia", bio: "Specializing in preventive care and chronic disease management." },
  { name: "Dr. Michael Hartono", specialty: "Dental Surgery", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80", experience: "12 years", education: "Gadjah Mada University", bio: "Expert in cosmetic dentistry and oral surgery." },
  { name: "Dr. James Wilson", specialty: "Dermatology", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80", experience: "10 years", education: "Airlangga University", bio: "Board-certified dermatologist specializing in skin cancer prevention." },
  { name: "Dr. Anita Dewi", specialty: "Pediatrics", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80", experience: "8 years", education: "University of Indonesia", bio: "Passionate about child wellness and developmental pediatrics." },
  { name: "Dr. Robert Tanaka", specialty: "Cardiology", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80", experience: "20 years", education: "Diponegoro University", bio: "Leading cardiologist with extensive interventional experience." },
  { name: "Dr. Lisa Permata", specialty: "General Medicine", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80", experience: "6 years", education: "Padjadjaran University", bio: "Focused on integrative and holistic approaches to family health." },
];

export default function DoctorsPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? doctors : doctors.filter((d) => d.specialty === filter);

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <section className="py-16" style={{ backgroundColor: "#EFF6FF" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
            Our Doctors
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748B" }}>
            A dedicated team of experienced healthcare professionals committed to your well-being.
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 border-b" style={{ borderColor: "#E2E8F0" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {specialties.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-4 py-2 text-sm font-medium transition-all"
                style={{
                  backgroundColor: filter === s ? "#0891B2" : "transparent",
                  color: filter === s ? "#FFFFFF" : "#64748B",
                  borderRadius: "12px",
                  border: filter === s ? "none" : "1px solid #E2E8F0",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((doc) => (
              <div
                key={doc.name}
                className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: "#FFFFFF", borderRadius: "20px", border: "1px solid #E2E8F0" }}
              >
                <div className="relative aspect-[4/5]">
                  <Image src={doc.image} alt={doc.name} fill className="object-cover" unoptimized />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold" style={{ color: "#0F172A", fontFamily: "var(--font-heading)" }}>{doc.name}</h3>
                  <p className="text-sm font-medium mt-1" style={{ color: "#0891B2" }}>{doc.specialty}</p>
                  <p className="text-sm mt-2" style={{ color: "#64748B" }}>{doc.bio}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs px-2.5 py-1" style={{ backgroundColor: "#EFF6FF", color: "#0891B2", borderRadius: "8px" }}>{doc.experience}</span>
                    <span className="text-xs" style={{ color: "#94A3B8" }}>{doc.education}</span>
                  </div>
                  <Link
                    href="/contact"
                    className="mt-4 block text-center text-sm font-semibold py-2.5 text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "#0891B2", borderRadius: "12px" }}
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
