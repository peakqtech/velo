"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", date: "", message: "" });

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <section className="py-16" style={{ backgroundColor: "#EFF6FF" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
            Book an Appointment
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748B" }}>
            Schedule your visit online. We will confirm your appointment within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <form
                onSubmit={(e) => { e.preventDefault(); alert("Appointment request submitted!"); }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>Full Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                      style={{ border: "1px solid #E2E8F0", borderRadius: "12px", backgroundColor: "#F8FAFC" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                      style={{ border: "1px solid #E2E8F0", borderRadius: "12px", backgroundColor: "#F8FAFC" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+62 812-3456-7890"
                      className="w-full px-4 py-3 text-sm outline-none transition-all focus:ring-2"
                      style={{ border: "1px solid #E2E8F0", borderRadius: "12px", backgroundColor: "#F8FAFC" }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>Service</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full px-4 py-3 text-sm outline-none transition-all"
                      style={{ border: "1px solid #E2E8F0", borderRadius: "12px", backgroundColor: "#F8FAFC" }}
                    >
                      <option value="">Select service...</option>
                      <option>General Checkup</option>
                      <option>Dental Care</option>
                      <option>Dermatology</option>
                      <option>Pediatrics</option>
                      <option>Lab Tests</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>Preferred Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-4 py-3 text-sm outline-none transition-all"
                    style={{ border: "1px solid #E2E8F0", borderRadius: "12px", backgroundColor: "#F8FAFC" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#0F172A" }}>Additional Notes</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your symptoms or concerns..."
                    rows={4}
                    className="w-full px-4 py-3 text-sm outline-none transition-all resize-none"
                    style={{ border: "1px solid #E2E8F0", borderRadius: "12px", backgroundColor: "#F8FAFC" }}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: "#0891B2", borderRadius: "16px" }}
                >
                  Request Appointment
                </button>
              </form>
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6" style={{ backgroundColor: "#EFF6FF", borderRadius: "20px" }}>
                <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
                  Operating Hours
                </h3>
                <div className="space-y-3">
                  {[
                    ["Monday - Friday", "7:00 AM - 9:00 PM"],
                    ["Saturday", "7:00 AM - 6:00 PM"],
                    ["Sunday", "8:00 AM - 5:00 PM"],
                    ["Emergency", "24/7"],
                  ].map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span style={{ color: "#334155" }}>{day}</span>
                      <span className="font-medium" style={{ color: day === "Emergency" ? "#EF4444" : "#0891B2" }}>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6" style={{ backgroundColor: "#ECFDF5", borderRadius: "20px" }}>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
                  Quick Contact
                </h3>
                <p className="text-sm mb-3" style={{ color: "#64748B" }}>For urgent inquiries</p>
                <p className="text-xl font-bold" style={{ color: "#10B981" }}>(021) 555-0100</p>
                <p className="text-sm mt-2" style={{ color: "#64748B" }}>info@medica-clinic.com</p>
              </div>

              {/* Map placeholder */}
              <div
                className="aspect-square flex items-center justify-center"
                style={{ backgroundColor: "#F8FAFC", borderRadius: "20px", border: "1px solid #E2E8F0" }}
              >
                <div className="text-center">
                  <svg className="w-10 h-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#94A3B8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <p className="text-sm" style={{ color: "#94A3B8" }}>Map View</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
