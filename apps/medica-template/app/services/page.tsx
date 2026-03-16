"use client";

import Link from "next/link";

const services = [
  { name: "General Checkup", icon: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z", desc: "Comprehensive annual health screenings including blood pressure, cholesterol, blood sugar, and cardiovascular assessments. Our preventive approach helps detect issues early.", duration: "45 min", price: "Rp 350.000 - Rp 750.000" },
  { name: "Dental Care", icon: "M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z", desc: "Complete dental services from routine cleanings to cosmetic dentistry, fillings, root canals, and orthodontics. Using the latest digital imaging technology.", duration: "30-90 min", price: "Rp 200.000 - Rp 2.500.000" },
  { name: "Dermatology", icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z", desc: "Expert skin care including acne treatment, eczema management, skin cancer screening, and cosmetic procedures like laser therapy and chemical peels.", duration: "30-60 min", price: "Rp 300.000 - Rp 1.500.000" },
  { name: "Pediatrics", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z", desc: "Dedicated child healthcare covering vaccinations, growth monitoring, developmental assessments, and treatment of childhood illnesses in a kid-friendly environment.", duration: "30-45 min", price: "Rp 250.000 - Rp 600.000" },
  { name: "Lab Tests", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611l-.772.13c-1.687.282-3.406.282-5.094 0l-.772-.13c-1.718-.293-2.3-2.379-1.067-3.61L14 15.3", desc: "State-of-the-art diagnostics including complete blood count, metabolic panels, thyroid function, STD screening, and genetic testing with fast, accurate results.", duration: "15-30 min", price: "Rp 150.000 - Rp 3.000.000" },
  { name: "Emergency Care", icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z", desc: "Round-the-clock emergency medical care with experienced physicians, advanced life support equipment, and rapid triage systems. No appointment needed.", duration: "Varies", price: "Rp 500.000+" },
];

export default function ServicesPage() {
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <section className="py-16" style={{ backgroundColor: "#EFF6FF" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
            Our Services
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748B" }}>
            Comprehensive healthcare services tailored to your needs, delivered with compassion and expertise.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div
                key={service.name}
                className="p-8 transition-all duration-300 hover:shadow-lg"
                style={{ border: "1px solid #E2E8F0", borderRadius: "20px" }}
              >
                <div className="flex items-start gap-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#EFF6FF" }}
                  >
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#0891B2">
                      <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
                      {service.name}
                    </h3>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "#64748B" }}>
                      {service.desc}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className="text-xs font-medium px-3 py-1" style={{ backgroundColor: "#EFF6FF", color: "#0891B2", borderRadius: "8px" }}>
                        {service.duration}
                      </span>
                      <span className="text-xs font-medium px-3 py-1" style={{ backgroundColor: "#ECFDF5", color: "#10B981", borderRadius: "8px" }}>
                        {service.price}
                      </span>
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center text-sm font-semibold transition-opacity hover:opacity-70"
                      style={{ color: "#0891B2" }}
                    >
                      Book Now
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
