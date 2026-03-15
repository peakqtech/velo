import { loadTemplates, TemplateInfo } from "@/lib/templates";

export const dynamic = "force-dynamic";

export default function GalleryPage() {
  const templates = loadTemplates();

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: 56 }}>
        <h1
          style={{
            fontSize: 40,
            fontWeight: 700,
            margin: 0,
            color: "#ffffff",
            letterSpacing: "-0.02em",
          }}
        >
          Velo Template Gallery
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#888",
            marginTop: 8,
          }}
        >
          Browse available templates
        </p>
      </header>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(350, 1fr))",
          gap: 24,
        }}
      >
        {templates.length === 0 && (
          <p style={{ color: "#666", gridColumn: "1 / -1", textAlign: "center" }}>
            No templates found. Add sibling *-template directories with template.json files.
          </p>
        )}
        {templates.map((t) => (
          <TemplateCard key={t.dirName} template={t} />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({ template: t }: { template: TemplateInfo }) {
  const colorEntries = t.colors
    ? Object.entries(t.colors).slice(0, 7)
    : [];

  return (
    <div
      style={{
        backgroundColor: "#161616",
        borderRadius: 12,
        border: "1px solid #262626",
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "border-color 0.2s",
      }}
    >
      {/* Name & Description */}
      <div>
        <h2
          style={{
            fontSize: 22,
            fontWeight: 600,
            margin: 0,
            color: "#fff",
          }}
        >
          {t.displayName}
        </h2>
        <p
          style={{
            fontSize: 14,
            color: "#999",
            margin: "6px 0 0",
            lineHeight: 1.5,
          }}
        >
          {t.description}
        </p>
      </div>

      {/* Meta badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <Badge label={t.businessType} />
        <Badge label={t.style} />
        <Badge label={`${t.sectionCount} sections`} />
      </div>

      {/* Color palette */}
      {colorEntries.length > 0 && (
        <div>
          <p
            style={{
              fontSize: 11,
              color: "#666",
              margin: "0 0 8px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            Color Palette
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            {colorEntries.map(([name, color]) => (
              <div
                key={name}
                title={`${name}: ${color}`}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: color,
                  border: "2px solid #262626",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fonts */}
      {t.fonts && (
        <div>
          <p
            style={{
              fontSize: 11,
              color: "#666",
              margin: "0 0 4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontWeight: 600,
            }}
          >
            Fonts
          </p>
          <p style={{ fontSize: 14, color: "#ccc", margin: 0 }}>
            <span style={{ color: "#fff", fontWeight: 500 }}>
              {t.fonts.display}
            </span>
            {" / "}
            <span>{t.fonts.body}</span>
          </p>
        </div>
      )}

      {/* Directory */}
      <p
        style={{
          fontSize: 12,
          color: "#444",
          margin: 0,
          fontFamily: "monospace",
        }}
      >
        apps/{t.dirName}
      </p>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: 12,
        color: "#aaa",
        backgroundColor: "#222",
        border: "1px solid #333",
        borderRadius: 6,
        padding: "3px 10px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}
