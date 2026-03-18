import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/lib/services.config";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.name} — PeakQ`,
    description: service.shortDescription,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <main className="min-h-screen" style={{ background: "#030712" }}>
      <section className="pt-32 pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/services"
            className="inline-flex items-center text-sm mb-12 transition-colors duration-200"
            style={{ color: "#9ca3af" }}
          >
            ← Back to Services
          </Link>

          {/* Heading */}
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#4ade80" }}
          >
            Service
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            {service.name}
          </h1>

          {/* Description */}
          <p className="text-lg leading-relaxed mb-12" style={{ color: "#9ca3af" }}>
            {service.description}
          </p>

          {/* Capabilities */}
          <div
            className="rounded-2xl p-8 mb-12"
            style={{ background: "#0d1117", border: "1px solid #1f2937" }}
          >
            <h2 className="text-lg font-semibold text-white mb-6">
              What&apos;s Included
            </h2>
            <ul className="flex flex-col gap-4">
              {service.capabilities.map((capability) => (
                <li key={capability} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{
                      backgroundColor: "#4ade8022",
                      color: "#4ade80",
                    }}
                  >
                    ✓
                  </span>
                  <span className="text-sm" style={{ color: "#d1d5db" }}>
                    {capability}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <Link
            href="/contact"
            className="inline-block px-8 py-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#4ade80", color: "#030712" }}
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}
