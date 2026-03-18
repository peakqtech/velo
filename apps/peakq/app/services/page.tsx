import Link from "next/link";
import { services } from "@/lib/services.config";

export const metadata = {
  title: "Services — PeakQ",
  description:
    "Expert services from the team that built the platform. QA testing, custom development, and managed services.",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen" style={{ background: "#030712" }}>
      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#4ade80" }}
          >
            Expert Services
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Expert Services from the Team
            <br />
            That Built the Platform
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "#9ca3af" }}>
            Need hands-on help? Our team doesn&apos;t just sell the platform —
            we built it. We know every feature, every integration, every edge
            case.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      <section className="px-6 pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.slug}
              className="rounded-2xl p-8 flex flex-col gap-6 transition-all duration-200 hover:border-gray-600"
              style={{
                background: "#0d1117",
                border: "1px solid #1f2937",
              }}
            >
              <div className="flex flex-col gap-3 flex-1">
                <h2 className="text-xl font-bold text-white">{service.name}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                  {service.shortDescription}
                </p>
              </div>
              <Link
                href={`/services/${service.slug}`}
                className="text-sm font-semibold transition-colors duration-200"
                style={{ color: "#4ade80" }}
              >
                Learn More →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
