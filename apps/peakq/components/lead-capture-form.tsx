"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { TEMPLATE_CATEGORIES, templates } from "@/lib/templates.config";

export function LeadCaptureForm() {
  const searchParams = useSearchParams();
  const preselected = searchParams.get("template") ?? "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    template: preselected,
  });
  const [submitted, setSubmitted] = useState(false);

  const industries = TEMPLATE_CATEGORIES.filter((c) => c.slug !== "all");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Lead capture:", form);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="rounded-xl p-8 text-center"
        style={{ background: "#0d1117", border: "1px solid #1f2937" }}
      >
        <p className="text-xl font-semibold text-white mb-2">
          We&rsquo;re on it!
        </p>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          Check your inbox — we&rsquo;ll follow up within one business day.
        </p>
      </div>
    );
  }

  const selectStyle = {
    background: "#1f2937",
    border: "1px solid #374151",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-6 flex flex-col gap-4"
      style={{ background: "#0d1117", border: "1px solid #1f2937" }}
    >
      {/* Name */}
      <div>
        <label
          htmlFor="lc-name"
          className="block text-sm font-medium text-white mb-1"
        >
          Name
        </label>
        <input
          id="lc-name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2"
          style={selectStyle}
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="lc-email"
          className="block text-sm font-medium text-white mb-1"
        >
          Email
        </label>
        <input
          id="lc-email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="you@company.com"
          className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2"
          style={selectStyle}
        />
      </div>

      {/* Company */}
      <div>
        <label
          htmlFor="lc-company"
          className="block text-sm font-medium text-white mb-1"
        >
          Company Name
        </label>
        <input
          id="lc-company"
          name="company"
          type="text"
          required
          value={form.company}
          onChange={handleChange}
          placeholder="Your company"
          className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2"
          style={selectStyle}
        />
      </div>

      {/* Industry */}
      <div>
        <label
          htmlFor="lc-industry"
          className="block text-sm font-medium text-white mb-1"
        >
          Industry
        </label>
        <select
          id="lc-industry"
          name="industry"
          required
          value={form.industry}
          onChange={handleChange}
          className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none focus:ring-2 appearance-none cursor-pointer"
          style={selectStyle}
        >
          <option value="" disabled>
            Select your industry
          </option>
          {industries.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Template */}
      <div>
        <label
          htmlFor="lc-template"
          className="block text-sm font-medium text-white mb-1"
        >
          Which template caught your eye?{" "}
          <span style={{ color: "#6b7280" }}>(optional)</span>
        </label>
        <select
          id="lc-template"
          name="template"
          value={form.template}
          onChange={handleChange}
          className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none focus:ring-2 appearance-none cursor-pointer"
          style={selectStyle}
        >
          <option value="">None / Not sure yet</option>
          {templates.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name} — {t.industry}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer mt-2"
        style={{ backgroundColor: "#4ade80", color: "#030712" }}
      >
        Get Started
      </button>
    </form>
  );
}
