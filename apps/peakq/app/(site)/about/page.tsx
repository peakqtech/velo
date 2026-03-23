export const metadata = {
  title: "About — PeakQ",
  description: "We built the platform. Then we proved it works.",
};

const team = [
  {
    name: "Alex Chen",
    role: "Founder & CEO",
    bio: "Former QA director who saw the gap between enterprise tooling and what small businesses could access. Built PeakQ to close it.",
  },
  {
    name: "Jordan Rivera",
    role: "Head of Engineering",
    bio: "Full-stack architect with a decade of experience shipping platforms at scale. Obsessed with performance and developer experience.",
  },
  {
    name: "Sam Okoro",
    role: "Head of Growth",
    bio: "Growth strategist who has helped 200+ businesses find product-market fit. Turns data into revenue playbooks.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ background: "#030712" }}>
      {/* Header */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#4ade80" }}
          >
            About
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            We Built the Platform.
            <br />
            Then We Proved It Works.
          </h1>
        </div>
      </section>

      {/* Origin Story */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          <p className="text-lg leading-relaxed" style={{ color: "#d1d5db" }}>
            We started as QA experts obsessing over software quality. We saw
            businesses struggling with disconnected tools &mdash; a website
            here, an SEO tool there, analytics somewhere else. So we built the
            platform we wished existed. And we made our own business the first
            customer.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "#d1d5db" }}>
            That decision changed everything. By eating our own cooking, we
            discovered what actually moves the needle for a growing business:
            not more dashboards, but smarter automation. Not more data, but
            the right insight at the right moment. Every feature in PeakQ
            exists because we needed it ourselves first.
          </p>
          <p className="text-lg leading-relaxed" style={{ color: "#d1d5db" }}>
            Today PeakQ powers businesses across industries &mdash; from
            restaurants and real-estate agencies to law firms and e-commerce
            brands. The platform keeps evolving, but the principle stays the
            same: build what works, prove it on ourselves, then hand it to you.
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            The Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-xl p-6 text-center"
                style={{ background: "#0d1117", border: "1px solid #1f2937" }}
              >
                <div
                  className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                  style={{ background: "#1f2937", color: "#4ade80" }}
                >
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <p className="text-white font-semibold text-lg">
                  {member.name}
                </p>
                <p
                  className="text-sm font-medium mb-3"
                  style={{ color: "#4ade80" }}
                >
                  {member.role}
                </p>
                <p className="text-sm" style={{ color: "#9ca3af" }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="pb-28 px-6 text-center">
        <div
          className="max-w-3xl mx-auto rounded-2xl p-10"
          style={{ background: "#0d1117", border: "1px solid #1f2937" }}
        >
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#4ade80" }}
          >
            Our Mission
          </p>
          <p className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
            We believe every business deserves AI-powered tools that were
            previously only available to enterprises with million-dollar
            budgets.
          </p>
        </div>
      </section>
    </main>
  );
}
