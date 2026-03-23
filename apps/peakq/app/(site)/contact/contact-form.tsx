"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div
      className="rounded-xl p-6"
      style={{ background: "#0d1117", border: "1px solid #1f2937" }}
    >
      {submitted ? (
        <div className="text-center py-10">
          <p className="text-xl font-semibold text-white mb-2">
            Thanks for reaching out!
          </p>
          <p className="text-sm" style={{ color: "#9ca3af" }}>
            We&rsquo;ll get back to you within 24 hours.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            console.log("Contact form:", Object.fromEntries(formData));
            setSubmitted(true);
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white mb-1"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2"
              style={{
                background: "#1f2937",
                border: "1px solid #374151",
                // @ts-expect-error -- CSS custom property for focus ring
                "--tw-ring-color": "#4ade80",
              }}
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2"
              style={{
                background: "#1f2937",
                border: "1px solid #374151",
              }}
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-white mb-1"
            >
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2"
              style={{
                background: "#1f2937",
                border: "1px solid #374151",
              }}
              placeholder="Your company"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-white mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none focus:ring-2 resize-none"
              style={{
                background: "#1f2937",
                border: "1px solid #374151",
              }}
              placeholder="How can we help?"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer"
            style={{ backgroundColor: "#4ade80", color: "#030712" }}
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
}
