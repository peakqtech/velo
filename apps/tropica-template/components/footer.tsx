import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white" id="contact">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3
              className="text-3xl italic font-semibold text-[var(--color-gold)] mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Tropica
            </h3>
            <p
              className="text-white/70 text-sm leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Curating Bali&apos;s finest luxury villas for discerning
              travelers since 2018. Your private paradise awaits.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              {["Instagram", "Facebook", "Twitter", "WhatsApp"].map((name) => (
                <a
                  key={name}
                  href="#"
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors duration-300 text-xs font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                  aria-label={name}
                >
                  {name[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Properties */}
          <div>
            <h4
              className="text-lg font-semibold mb-6 text-[var(--color-gold)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Properties
            </h4>
            <ul className="space-y-3">
              {["Seminyak Villas", "Ubud Retreats", "Canggu Estates", "Uluwatu Clifftop", "Nusa Dua Resorts"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="/properties"
                      className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4
              className="text-lg font-semibold mb-6 text-[var(--color-gold)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Services
            </h4>
            <ul className="space-y-3">
              {["Airport Transfer", "Private Chef", "Spa & Wellness", "Excursions", "Event Planning"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4
              className="text-lg font-semibold mb-6 text-[var(--color-gold)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Legal
            </h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cancellation Policy", "Cookie Policy"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
            <div className="mt-8">
              <p className="text-white/40 text-xs" style={{ fontFamily: "var(--font-body)" }}>
                hello@tropica-villas.com
              </p>
              <p className="text-white/40 text-xs mt-1" style={{ fontFamily: "var(--font-body)" }}>
                +62 812 3456 7890
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p
            className="text-white/40 text-xs"
            style={{ fontFamily: "var(--font-body)" }}
          >
            &copy; 2026 Tropica Luxury Villas. All rights reserved.
          </p>
          <p
            className="text-white/30 text-xs"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Jl. Kayu Aya No. 88, Seminyak, Bali 80361, Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
