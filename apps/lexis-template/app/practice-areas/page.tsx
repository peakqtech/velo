import Link from "next/link";

const practiceAreas = [
  { name: "Corporate Law", desc: "Our corporate practice handles complex business transactions including mergers, acquisitions, joint ventures, and corporate restructuring. We advise boards on governance, compliance, and risk management strategies that protect shareholder value.", keyServices: ["Mergers & Acquisitions", "Corporate Governance", "Securities & Capital Markets", "Private Equity"] },
  { name: "Property Law", desc: "From residential purchases to large-scale commercial developments, our property team provides end-to-end legal support. We handle transactions, due diligence, title disputes, and land-use regulatory compliance.", keyServices: ["Real Estate Transactions", "Land Title Disputes", "Construction Law", "Leasing & Tenancy"] },
  { name: "Immigration", desc: "Navigating Indonesia's immigration landscape requires expertise and precision. We assist individuals and corporations with visa applications, work permits, permanent residency, and citizenship matters.", keyServices: ["Work Permits (KITAS)", "Permanent Residency (KITAP)", "Corporate Immigration", "Citizenship Applications"] },
  { name: "Family Law", desc: "We understand that family matters require both legal expertise and emotional sensitivity. Our team handles divorce proceedings, child custody, prenuptial agreements, and estate planning with discretion.", keyServices: ["Divorce & Separation", "Child Custody", "Prenuptial Agreements", "Estate Planning"] },
  { name: "Criminal Defense", desc: "When your freedom is at stake, you need a defense team with a proven track record. We provide vigorous representation at every stage, from investigation through trial and appeal.", keyServices: ["White-Collar Crime", "Fraud Defense", "Drug Offenses", "Appeals & Post-Conviction"] },
  { name: "Tax Advisory", desc: "Proactive tax planning can save millions. Our tax team works with individuals and multinational corporations to optimize tax positions, resolve disputes with authorities, and ensure full compliance.", keyServices: ["Tax Planning & Optimization", "Transfer Pricing", "Tax Dispute Resolution", "International Tax"] },
];

export default function PracticeAreasPage() {
  return (
    <div style={{ backgroundColor: "#FAF8F5" }}>
      {/* Header */}
      <section className="pt-32 pb-16" style={{ backgroundColor: "#1E293B" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: "#B8860B" }} />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "#FFFFFF" }}>
            Practice Areas
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}>
            Comprehensive legal services across six core practice areas, each led by
            specialists with decades of proven experience.
          </p>
        </div>
      </section>

      {/* Practice Areas Detail */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {practiceAreas.map((area, i) => (
            <div
              key={area.name}
              className="p-8 sm:p-10"
              style={{
                backgroundColor: "#FFFFFF",
                borderLeft: "4px solid #B8860B",
                borderRadius: "4px",
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <span className="text-xs font-medium tracking-wider" style={{ color: "#B8860B" }}>
                    0{i + 1}
                  </span>
                  <h2 className="text-2xl font-bold mt-2 mb-4" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
                    {area.name}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                    {area.desc}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold tracking-wider uppercase mb-4" style={{ color: "#0F172A" }}>
                    Key Services
                  </h4>
                  <ul className="space-y-2">
                    {area.keyServices.map((s) => (
                      <li key={s} className="flex items-center gap-2 text-sm" style={{ color: "#64748B" }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#B8860B" }} />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="inline-flex items-center mt-6 text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: "#B8860B" }}
                  >
                    Consult Now &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
