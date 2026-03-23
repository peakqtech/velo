import Link from "next/link";
import type { TemplateConfig } from "@/lib/templates.config";

interface TemplateCardProps {
  template: TemplateConfig;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-800 bg-gray-900 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10">
      {/* Gradient top section */}
      <div
        className="flex items-center justify-center"
        style={{
          height: 120,
          background: `linear-gradient(135deg, ${template.gradient[0]}, ${template.gradient[1]})`,
        }}
      >
        <span className="text-5xl">{template.icon}</span>
      </div>

      {/* Content section */}
      <div className="flex flex-col gap-2 p-5">
        <div>
          <h3 className="text-base font-bold text-white">{template.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{template.industry}</p>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">
          {template.capabilities.join(", ")}
        </p>

        <div className="flex items-center gap-3 mt-3">
          <a
            href={template.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-green-400 hover:text-green-300 transition-colors"
          >
            Preview →
          </a>
          <Link
            href={`/get-started?template=${template.slug}`}
            className="ml-auto text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 rounded-md px-3 py-1.5 hover:bg-green-500/20 hover:border-green-500/40 transition-all"
          >
            Use This
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RequestIndustryCard() {
  return (
    <div className="group relative flex flex-col rounded-xl border border-dashed border-gray-700 bg-gray-900/50 overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10">
      {/* Empty top section with "+" */}
      <div
        className="flex items-center justify-center"
        style={{ height: 120 }}
      >
        <span
          className="text-5xl font-light transition-transform duration-300 group-hover:scale-110"
          style={{ color: "#a78bfa" }}
        >
          +
        </span>
      </div>

      {/* Content section */}
      <div className="flex flex-col gap-2 p-5">
        <div>
          <h3 className="text-base font-bold text-white">
            Don&apos;t See Your Industry?
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            We&apos;re building new solutions every month.
          </p>
        </div>

        <div className="flex items-center mt-3">
          <Link
            href="/contact"
            className="text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
            style={{ color: "#a78bfa" }}
          >
            Request Yours →
          </Link>
        </div>
      </div>
    </div>
  );
}
