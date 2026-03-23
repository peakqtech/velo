export function Footer() {
  return (
    <footer className="py-24 sm:py-32" style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E5E5" }}>
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-12">
          <div>
            <span
              className="text-4xl sm:text-5xl tracking-tight"
              style={{ fontFamily: "var(--font-heading)", color: "#111111" }}
            >
              FORMA
            </span>
          </div>
          <div className="flex gap-16">
            <div className="space-y-2">
              <a href="mailto:hello@forma.studio" className="block text-sm hover:opacity-50 transition-opacity" style={{ color: "#888888" }}>
                hello@forma.studio
              </a>
              <a href="tel:+62215550200" className="block text-sm hover:opacity-50 transition-opacity" style={{ color: "#888888" }}>
                +62 21 555 0200
              </a>
            </div>
            <div className="space-y-2">
              <a href="#" className="block text-sm hover:opacity-50 transition-opacity" style={{ color: "#888888" }}>
                Instagram
              </a>
              <a href="#" className="block text-sm hover:opacity-50 transition-opacity" style={{ color: "#888888" }}>
                Behance
              </a>
            </div>
          </div>
        </div>

        <p className="mt-20 text-xs" style={{ color: "#CCCCCC" }}>
          &copy; {new Date().getFullYear()} FORMA Studio
        </p>
      </div>
    </footer>
  );
}
