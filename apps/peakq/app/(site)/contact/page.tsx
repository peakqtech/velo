import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact — PeakQ",
  description: "Let's talk. Get in touch with the PeakQ team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen" style={{ background: "#030712" }}>
      {/* Header */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#4ade80" }}
          >
            Contact
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Let&rsquo;s Talk
          </h1>
          <p className="text-lg" style={{ color: "#9ca3af" }}>
            Have a question, want a demo, or ready to get started? We&rsquo;d
            love to hear from you.
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="pb-28 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Contact Form */}
          <ContactForm />

          {/* Right: Info Cards */}
          <div className="flex flex-col gap-6">
            {/* Book a Demo */}
            <div
              className="rounded-xl p-6"
              style={{ background: "#0d1117", border: "1px solid #1f2937" }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Book a Demo
              </h3>
              <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>
                See how PeakQ can transform your business in a 15-minute
                walkthrough tailored to your industry.
              </p>
              <a
                href="/get-started"
                className="inline-block px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "#4ade80", color: "#030712" }}
              >
                Schedule a Call
              </a>
            </div>

            {/* Email */}
            <div
              className="rounded-xl p-6"
              style={{ background: "#0d1117", border: "1px solid #1f2937" }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <a
                href="mailto:hello@peakq.tech"
                className="text-sm hover:underline"
                style={{ color: "#4ade80" }}
              >
                hello@peakq.tech
              </a>
            </div>

            {/* Location */}
            <div
              className="rounded-xl p-6"
              style={{ background: "#0d1117", border: "1px solid #1f2937" }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                Location
              </h3>
              <p className="text-sm" style={{ color: "#9ca3af" }}>
                Remote-first, globally distributed team.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
