"use client";

/* eslint-disable @next/next/no-img-element */

interface SectionPreviewProps {
  sectionKey: string;
  data: Record<string, unknown>;
}

export function SectionPreview({ sectionKey, data }: SectionPreviewProps) {
  switch (sectionKey) {
    case "hero":
      return <HeroPreview data={data} />;
    case "testimonials":
      return <TestimonialsPreview data={data} />;
    case "footer":
      return <FooterPreview data={data} />;
    default:
      return <GenericPreview sectionKey={sectionKey} data={data} />;
  }
}

/* -------------------------------------------------------------------------- */
/*  Hero Preview                                                              */
/* -------------------------------------------------------------------------- */

function HeroPreview({ data }: { data: Record<string, unknown> }) {
  const headline = (data.headline as string) || "Headline";
  const tagline = (data.tagline as string) || "Tagline goes here";
  const cta = data.cta as Record<string, unknown> | undefined;
  const media = data.media as Record<string, unknown> | undefined;
  const overlay = data.overlay as Record<string, unknown> | undefined;

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 via-transparent to-violet-600/10" />
      {overlay && (
        <div
          className="absolute inset-0"
          style={{ opacity: Number(overlay.opacity) || 0.4 }}
        />
      )}

      <div className="relative px-8 py-16 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight mb-3">
          {headline}
        </h1>
        <p className="text-base text-zinc-400 max-w-md mx-auto mb-6">
          {tagline}
        </p>

        {cta && (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25">
              {(cta.label as string) || "CTA"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </div>
        )}

        {media && (
          <div className="mt-8 mx-auto max-w-xs">
            <div className="rounded-lg border border-zinc-700/50 bg-zinc-800/50 p-4 flex items-center gap-3">
              {(media.type as string) === "video" ? (
                <>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600/20">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-400">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-300 truncate">Video</p>
                    <p className="text-xs text-zinc-500 truncate">{(media.src as string) || "No source"}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600/20">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-300 truncate">Image</p>
                    <p className="text-xs text-zinc-500 truncate">{(media.src as string) || "No source"}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Testimonials Preview                                                      */
/* -------------------------------------------------------------------------- */

function TestimonialsPreview({ data }: { data: Record<string, unknown> }) {
  const heading = (data.heading as string) || "Testimonials";
  const testimonials = (data.testimonials as Record<string, unknown>[]) || [];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
      <h2 className="text-lg font-bold text-white mb-5 text-center">{heading}</h2>

      {testimonials.length === 0 && (
        <p className="text-sm text-zinc-500 text-center py-8">No testimonials added yet</p>
      )}

      <div className="space-y-3">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700"
          >
            <p className="text-sm italic text-zinc-300 mb-3 leading-relaxed">
              &ldquo;{(t.quote as string) || "..."}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              {/* Avatar placeholder */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-bold text-white">
                {((t.author as string) || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{(t.author as string) || "Author"}</p>
                <p className="text-xs text-zinc-500">{(t.role as string) || "Role"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Footer Preview                                                            */
/* -------------------------------------------------------------------------- */

function FooterPreview({ data }: { data: Record<string, unknown> }) {
  const brand = data.brand as Record<string, unknown> | undefined;
  const newsletter = data.newsletter as Record<string, unknown> | undefined;
  const socials = (data.socials as Record<string, unknown>[]) || [];
  const links = (data.links as Record<string, unknown>[]) || [];
  const legal = (data.legal as string) || "";

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Top: brand + newsletter */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-lg font-bold text-white">
              {(brand?.name as string) || "Brand"}
            </p>
          </div>
          {newsletter && (
            <div className="text-right">
              <p className="text-sm font-medium text-zinc-300 mb-1.5">
                {(newsletter.heading as string) || "Subscribe"}
              </p>
              <div className="flex items-center gap-1.5">
                <div className="h-7 w-32 rounded-md border border-zinc-700 bg-zinc-800 px-2 flex items-center">
                  <span className="text-[10px] text-zinc-500">
                    {(newsletter.placeholder as string) || "email"}
                  </span>
                </div>
                <span className="rounded-md bg-blue-600 px-2.5 py-1 text-[10px] font-medium text-white">
                  {(newsletter.cta as string) || "Go"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Link groups */}
        {links.length > 0 && (
          <div className="flex gap-8 border-t border-zinc-800 pt-4">
            {links.map((group, i) => {
              const items = (group.items as Record<string, unknown>[]) || [];
              return (
                <div key={i}>
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    {(group.group as string) || "Links"}
                  </p>
                  <ul className="space-y-1">
                    {items.map((item, j) => (
                      <li key={j} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                        {(item.label as string) || "Link"}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {/* Socials */}
        {socials.length > 0 && (
          <div className="flex items-center gap-2 border-t border-zinc-800 pt-4">
            {socials.map((s, i) => (
              <div
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <span className="text-[9px] font-medium text-zinc-400 uppercase">
                  {((s.platform as string) || "?").slice(0, 2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Legal */}
        {legal && (
          <p className="text-[10px] text-zinc-600 border-t border-zinc-800 pt-3">{legal}</p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Generic Preview                                                           */
/* -------------------------------------------------------------------------- */

function GenericPreview({ sectionKey, data }: { sectionKey: string; data: Record<string, unknown> }) {
  const label = sectionKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="h-2 w-2 rounded-full bg-blue-500" />
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">{label}</h2>
      </div>
      <div className="space-y-3">
        {Object.entries(data || {}).map(([key, value]) => (
          <GenericField key={key} fieldKey={key} value={value} />
        ))}
      </div>
    </div>
  );
}

function GenericField({ fieldKey, value }: { fieldKey: string; value: unknown }) {
  const label = fieldKey
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

  // String
  if (typeof value === "string") {
    const isImage = value.match(/\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i) || value.startsWith("data:image");
    if (isImage) {
      return (
        <div className="space-y-1">
          <p className="text-xs font-medium text-zinc-500">{label}</p>
          <div className="h-16 w-24 rounded-md border border-zinc-700 bg-zinc-800 overflow-hidden">
            <img src={value} alt={label} className="h-full w-full object-cover" />
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        <p className="text-sm text-zinc-300">{value || <span className="text-zinc-600">Empty</span>}</p>
      </div>
    );
  }

  // Number / Boolean
  if (typeof value === "number" || typeof value === "boolean") {
    return (
      <div className="space-y-0.5">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        <p className="text-sm text-zinc-300">{String(value)}</p>
      </div>
    );
  }

  // Array
  if (Array.isArray(value)) {
    return (
      <div className="space-y-1">
        <p className="text-xs font-medium text-zinc-500">{label} ({value.length} items)</p>
        <div className="space-y-1.5 pl-3 border-l-2 border-zinc-800">
          {value.slice(0, 5).map((item, i) => {
            if (typeof item === "object" && item !== null) {
              return (
                <div key={i} className="rounded-md border border-zinc-800 bg-zinc-900/50 p-2 space-y-1">
                  {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                    <div key={k} className="flex items-baseline gap-2">
                      <span className="text-[10px] text-zinc-500 shrink-0">{k}:</span>
                      <span className="text-xs text-zinc-400 truncate">{typeof v === "string" ? v : JSON.stringify(v)}</span>
                    </div>
                  ))}
                </div>
              );
            }
            return (
              <p key={i} className="text-xs text-zinc-400">{String(item)}</p>
            );
          })}
          {value.length > 5 && (
            <p className="text-[10px] text-zinc-600">+{value.length - 5} more</p>
          )}
        </div>
      </div>
    );
  }

  // Object
  if (typeof value === "object" && value !== null) {
    return (
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-zinc-500">{label}</p>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 space-y-2">
          {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
            <GenericField key={k} fieldKey={k} value={v} />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
