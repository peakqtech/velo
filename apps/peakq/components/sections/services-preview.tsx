import Link from "next/link";
import { services } from "@/lib/services.config";

export function ServicesPreview() {
  return (
    <section className="px-6 py-24 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Need hands-on help? Our team built the platform &mdash; we know it
          inside out.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="rounded-xl border border-gray-800 bg-gray-900/30 p-6 hover:border-gray-700 transition-colors"
          >
            <h3 className="text-white font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-500 text-sm">{service.shortDescription}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
