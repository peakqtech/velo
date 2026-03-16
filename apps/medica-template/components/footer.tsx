export function Footer() {
  return (
    <footer style={{ backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#0891B2" }}
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <span className="text-xl font-bold" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
                Medica
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
              Providing comprehensive, compassionate healthcare for you and your family since 2005.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "#0F172A" }}>Quick Links</h4>
            <ul className="space-y-2.5">
              {["Home", "Services", "Our Doctors", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#64748B" }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "#0F172A" }}>Services</h4>
            <ul className="space-y-2.5">
              {["General Checkup", "Dental Care", "Dermatology", "Pediatrics"].map((item) => (
                <li key={item}>
                  <a href="/services" className="text-sm hover:opacity-70 transition-opacity" style={{ color: "#64748B" }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "#0F172A" }}>Emergency</h4>
            <p className="text-2xl font-bold mb-2" style={{ color: "#EF4444", fontFamily: "var(--font-heading)" }}>
              (021) 911-0800
            </p>
            <p className="text-sm" style={{ color: "#64748B" }}>Available 24/7</p>
            <div className="mt-4 text-sm" style={{ color: "#64748B" }}>
              <p>123 Health Avenue, Suite 100</p>
              <p>Jakarta Selatan, 12110</p>
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-6 text-center text-xs"
          style={{ borderTop: "1px solid #E2E8F0", color: "#94A3B8" }}
        >
          &copy; {new Date().getFullYear()} Medica Health Clinic. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
