// apps/peakq/components/sections/logo-marquee.tsx
// NOTE: No "use client" — CSS animation only, stays a server component
const CLIENTS = [
  "APEX DENTAL", "NOVA REALTY", "KLEO FITNESS", "BLOOM HOSPITALITY",
  "SUMMIT LEGAL", "CREST CLINICS", "PEAK EVENTS", "HARBOR STAYS",
];

export function LogoMarquee() {
  // Duplicate array for seamless loop
  const items = [...CLIENTS, ...CLIENTS];

  return (
    <div
      className="w-full overflow-hidden py-6"
      style={{ borderTop: "1px solid rgba(59,130,246,0.12)", borderBottom: "1px solid rgba(59,130,246,0.12)" }}
    >
      <p
        className="text-center mb-4 text-[10px] uppercase tracking-[0.15em]"
        style={{ fontFamily: "var(--font-mono)", color: "rgba(255,255,255,0.25)" }}
      >
        Trusted by businesses across 12+ industries
      </p>
      <div className="flex overflow-hidden">
        <div
          className="flex gap-16 whitespace-nowrap"
          style={{ animation: "marquee 25s linear infinite", width: "max-content" }}
        >
          {items.map((name, i) => (
            <span
              key={`${i}-${name}`}
              className="text-sm tracking-[0.1em]"
              style={{ fontFamily: "Courier New, monospace", color: "rgba(255,255,255,0.25)" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
