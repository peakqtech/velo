export function Footer() {
  return (
    <footer style={{ backgroundColor: "#0F172A" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <span
              className="text-3xl font-bold tracking-wider"
              style={{ fontFamily: "var(--font-heading)", color: "#B8860B" }}
            >
              LEXIS
            </span>
            <p className="mt-4 text-sm leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.4)" }}>
              For over 25 years, Lexis has provided exceptional legal counsel to individuals and
              corporations. Our commitment to justice and integrity has earned us the trust of
              thousands of clients.
            </p>
            <div className="mt-6 w-16 h-0.5" style={{ backgroundColor: "#B8860B" }} />
          </div>

          {/* Practice Areas */}
          <div>
            <h4
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: "#B8860B" }}
            >
              Practice Areas
            </h4>
            <ul className="space-y-3">
              {["Corporate Law", "Property Law", "Immigration", "Family Law", "Criminal Defense", "Tax Advisory"].map((item) => (
                <li key={item}>
                  <a
                    href="/practice-areas"
                    className="text-sm hover:opacity-70 transition-opacity"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: "#B8860B" }}
            >
              Contact
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              <li>(021) 700-8800</li>
              <li>info@lexis-law.com</li>
              <li>Equity Tower, 42nd Floor<br />Jakarta 12190</li>
            </ul>
            <div className="mt-6 flex gap-3">
              {["LinkedIn", "Twitter"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-xs font-medium px-3 py-1.5 transition-all hover:opacity-80"
                  style={{ color: "#B8860B", border: "1px solid rgba(184,134,11,0.3)", borderRadius: "4px" }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bar associations */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            &copy; {new Date().getFullYear()} Lexis & Associates. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["PERADI Member", "IBA Certified", "Jakarta Bar"].map((badge) => (
              <span key={badge} className="text-xs font-medium" style={{ color: "rgba(184,134,11,0.5)" }}>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
