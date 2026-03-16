"use client";

import Image from "next/image";
import Link from "next/link";

const services = [
  { name: "General Checkup", icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z", desc: "Comprehensive annual health screenings" },
  { name: "Dental Care", icon: "M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z", desc: "Preventive and restorative dental services" },
  { name: "Dermatology", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z", desc: "Skin health and cosmetic treatments" },
  { name: "Pediatrics", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z", desc: "Child healthcare from infancy through adolescence" },
  { name: "Lab Tests", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.772.13c-1.687.282-3.406.282-5.094 0l-.772-.13c-1.718-.293-2.3-2.379-1.067-3.61L14 15.3", desc: "Full-spectrum diagnostic testing" },
  { name: "Emergency", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z", desc: "24/7 emergency medical services" },
];

const doctors = [
  {
    name: "Dr. Sarah Chen",
    specialty: "General Medicine",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
    experience: "15 years",
  },
  {
    name: "Dr. Michael Hartono",
    specialty: "Dental Surgery",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80",
    experience: "12 years",
  },
  {
    name: "Dr. James Wilson",
    specialty: "Dermatology",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80",
    experience: "10 years",
  },
];

const testimonials = [
  { name: "Rina Wulandari", rating: 5, text: "The staff was incredibly caring and professional. Dr. Chen took the time to explain everything thoroughly.", date: "March 2026" },
  { name: "Budi Santoso", rating: 5, text: "Best dental experience I've ever had. Modern equipment and gentle approach. Highly recommended.", date: "February 2026" },
  { name: "Maya Sari", rating: 5, text: "My kids love coming here for their checkups. The pediatric wing is so welcoming and fun.", date: "February 2026" },
  { name: "Ahmad Fadli", rating: 4, text: "Quick lab results and very transparent pricing. The online booking system is super convenient.", date: "January 2026" },
];

const insurancePartners = ["Allianz", "Prudential", "AXA Mandiri", "BPJS Kesehatan", "Manulife", "AIA"];

export default function HomePage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden" style={{ backgroundColor: "#EFF6FF" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium mb-6"
                style={{ backgroundColor: "rgba(8,145,178,0.1)", color: "#0891B2", borderRadius: "999px" }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#10B981" }} />
                Open Today 7:00 AM - 9:00 PM
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}
              >
                Your Health,
                <br />
                <span style={{ color: "#0891B2" }}>Our Priority</span>
              </h1>
              <p className="text-lg leading-relaxed mb-8 max-w-lg" style={{ color: "#64748B" }}>
                Comprehensive healthcare with a personal touch. Our experienced team is
                dedicated to keeping you and your family healthy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#0891B2", borderRadius: "16px" }}
                >
                  Book Appointment
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold transition-all hover:opacity-70"
                  style={{ color: "#0891B2", border: "2px solid #0891B2", borderRadius: "16px" }}
                >
                  Our Services
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80"
                alt="Modern hospital"
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          </div>
        </div>

        {/* Floating appointment card */}
        <div
          className="hidden xl:block absolute bottom-8 right-8 p-6 w-72"
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            boxShadow: "0 20px 60px rgba(8,145,178,0.15)",
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "#ECFDF5" }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#10B981">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>Quick Booking</p>
              <p className="text-xs" style={{ color: "#64748B" }}>Get confirmed in 2 mins</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-2 rounded-full" style={{ backgroundColor: "#EFF6FF", width: "100%" }} />
            <div className="h-2 rounded-full" style={{ backgroundColor: "#EFF6FF", width: "75%" }} />
          </div>
          <Link
            href="/contact"
            className="block text-center text-sm font-semibold text-white py-2.5"
            style={{ backgroundColor: "#0891B2", borderRadius: "12px" }}
          >
            Schedule Now
          </Link>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#0891B2" }}>
              What We Offer
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
              Our Medical Services
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.name}
                className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group cursor-pointer"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "16px",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                  style={{ backgroundColor: "#EFF6FF" }}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0891B2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#0F172A", fontFamily: "var(--font-heading)" }}>
                  {service.name}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DOCTORS ===== */}
      <section className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#0891B2" }}>
              Expert Team
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
              Meet Our Doctors
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc) => (
              <div
                key={doc.name}
                className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{ backgroundColor: "#FFFFFF", borderRadius: "20px" }}
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={doc.image}
                    alt={doc.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold" style={{ color: "#0F172A", fontFamily: "var(--font-heading)" }}>
                    {doc.name}
                  </h3>
                  <p className="text-sm mt-1" style={{ color: "#0891B2" }}>{doc.specialty}</p>
                  <p className="text-xs mt-1" style={{ color: "#64748B" }}>{doc.experience} experience</p>
                  <Link
                    href="/contact"
                    className="mt-4 block text-center text-sm font-semibold py-2.5 transition-all hover:opacity-90"
                    style={{
                      color: "#0891B2",
                      border: "2px solid #0891B2",
                      borderRadius: "12px",
                    }}
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#0891B2" }}>
              Patient Stories
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
              What Our Patients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6"
                style={{ backgroundColor: "#F8FAFC", borderRadius: "16px" }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4"
                      fill={i < t.rating ? "#0891B2" : "#E2E8F0"}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#334155" }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>{t.name}</p>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INSURANCE PARTNERS ===== */}
      <section className="py-14" style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium mb-8" style={{ color: "#94A3B8" }}>
            Trusted by Leading Insurance Providers
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-14">
            {insurancePartners.map((partner) => (
              <span
                key={partner}
                className="text-lg font-bold"
                style={{ color: "#CBD5E1", fontFamily: "var(--font-heading)" }}
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT / LOCATION ===== */}
      <section className="py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "#0891B2" }}>
                Find Us
              </p>
              <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
                Visit Our Clinic
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0891B2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>Address</p>
                    <p className="text-sm" style={{ color: "#64748B" }}>123 Health Avenue, Suite 100, Jakarta Selatan 12110</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0891B2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>Phone</p>
                    <p className="text-sm" style={{ color: "#64748B" }}>(021) 555-0100</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0891B2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>Operating Hours</p>
                    <p className="text-sm" style={{ color: "#64748B" }}>Mon - Sat: 7:00 AM - 9:00 PM</p>
                    <p className="text-sm" style={{ color: "#64748B" }}>Sun: 8:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div
              className="aspect-video flex items-center justify-center"
              style={{ backgroundColor: "#EFF6FF", borderRadius: "20px" }}
            >
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#94A3B8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                <p className="text-sm font-medium" style={{ color: "#94A3B8" }}>Interactive Map</p>
                <p className="text-xs mt-1" style={{ color: "#CBD5E1" }}>Google Maps integration</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
