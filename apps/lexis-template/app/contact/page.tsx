"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", practiceArea: "", message: "" });

  return (
    <div style={{ backgroundColor: "#FAF8F5" }}>
      {/* Header */}
      <section className="pt-32 pb-16" style={{ backgroundColor: "#1E293B" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: "#B8860B" }} />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "#FFFFFF" }}>
            Request a Consultation
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}>
            Take the first step. Tell us about your legal matter and one of our attorneys
            will be in touch within 24 hours.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="p-8 sm:p-10" style={{ backgroundColor: "#FFFFFF", borderRadius: "4px" }}>
                <h2 className="text-xl font-bold mb-6" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
                  Consultation Request
                </h2>
                <form
                  onSubmit={(e) => { e.preventDefault(); alert("Consultation request submitted!"); }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "#0F172A" }}>Full Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 text-sm outline-none"
                        style={{ border: "1px solid #E2E0DB", borderRadius: "4px", backgroundColor: "#FAF8F5" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "#0F172A" }}>Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 text-sm outline-none"
                        style={{ border: "1px solid #E2E0DB", borderRadius: "4px", backgroundColor: "#FAF8F5" }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "#0F172A" }}>Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 text-sm outline-none"
                        style={{ border: "1px solid #E2E0DB", borderRadius: "4px", backgroundColor: "#FAF8F5" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "#0F172A" }}>Practice Area</label>
                      <select
                        value={form.practiceArea}
                        onChange={(e) => setForm({ ...form, practiceArea: e.target.value })}
                        className="w-full px-4 py-3 text-sm outline-none"
                        style={{ border: "1px solid #E2E0DB", borderRadius: "4px", backgroundColor: "#FAF8F5" }}
                      >
                        <option value="">Select area...</option>
                        <option>Corporate Law</option>
                        <option>Property Law</option>
                        <option>Immigration</option>
                        <option>Family Law</option>
                        <option>Criminal Defense</option>
                        <option>Tax Advisory</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: "#0F172A" }}>Describe Your Legal Matter</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={6}
                      placeholder="Please provide a brief description of your legal issue..."
                      className="w-full px-4 py-3 text-sm outline-none resize-none"
                      style={{ border: "1px solid #E2E0DB", borderRadius: "4px", backgroundColor: "#FAF8F5" }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 text-sm font-semibold tracking-wider uppercase transition-all hover:opacity-90"
                    style={{ backgroundColor: "#B8860B", color: "#0F172A", borderRadius: "4px" }}
                  >
                    Submit Request
                  </button>
                  <p className="text-xs text-center" style={{ color: "#94A3B8" }}>
                    All consultations are confidential under attorney-client privilege.
                  </p>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-8" style={{ backgroundColor: "#1E293B", borderRadius: "4px" }}>
                <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "#B8860B" }}>
                  Office Location
                </h3>
                <div className="space-y-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <p>Equity Tower, 42nd Floor<br />Jl. Jend. Sudirman Kav. 52-53<br />Jakarta 12190</p>
                  <p>(021) 700-8800</p>
                  <p>info@lexis-law.com</p>
                </div>
                <div className="w-10 h-0.5 mt-6" style={{ backgroundColor: "rgba(184,134,11,0.3)" }} />
                <div className="mt-6 space-y-2 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: By appointment</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              <div className="p-8" style={{ backgroundColor: "#FFFFFF", borderRadius: "4px", borderLeft: "4px solid #B8860B" }}>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
                  Initial Consultation
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                  Your first consultation is free. Meet with one of our attorneys to discuss
                  your case and understand your legal options.
                </p>
                <p className="text-2xl font-bold mt-4" style={{ color: "#B8860B", fontFamily: "var(--font-heading)" }}>
                  FREE
                </p>
                <p className="text-xs" style={{ color: "#94A3B8" }}>Up to 30 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
