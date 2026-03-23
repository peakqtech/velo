import Link from "next/link";

export const metadata = {
  title: "Features — PeakQ",
  description:
    "Everything you need to run your business. AI-powered platform with SEO, lead capture, reputation management, and more.",
};

const features = [
  {
    icon: "🌐",
    title: "Website + CMS",
    subtitle: "Your Digital Foundation",
    description:
      "Industry-optimized templates with a built-in content management system. Launch a beautiful, mobile-responsive website in days, not months.",
    bullets: [
      "Industry-specific templates",
      "Drag-and-drop content editor",
      "Mobile-optimized responsive design",
      "Custom domain & SSL included",
    ],
    gradient: "from-blue-900/40 to-blue-800/20",
    accentColor: "#60a5fa",
  },
  {
    icon: "🔍",
    title: "SEO Engine",
    subtitle: "Be Found By The Right People",
    description:
      "AI-powered SEO that understands your industry's search patterns. Automatic keyword research, content optimization, and ranking tracking.",
    bullets: [
      "AI keyword research & optimization",
      "Auto-generated meta tags & sitemaps",
      "Local SEO for brick-and-mortar",
      "Ranking tracker & competitor analysis",
    ],
    gradient: "from-purple-900/40 to-purple-800/20",
    accentColor: "#c084fc",
  },
  {
    icon: "🎯",
    title: "Lead Capture",
    subtitle: "Turn Visitors Into Customers",
    description:
      "Smart forms, chatbots, and WhatsApp integration that capture leads 24/7. Industry-specific lead scoring tells you who's ready to buy.",
    bullets: [
      "Smart contact forms with validation",
      "WhatsApp business integration",
      "Lead scoring by industry signals",
      "Automated follow-up sequences",
    ],
    gradient: "from-orange-900/40 to-orange-800/20",
    accentColor: "#fb923c",
  },
  {
    icon: "⭐",
    title: "Reputation Management",
    subtitle: "Build Trust On Autopilot",
    description:
      "Automated review requests, AI-powered response suggestions, and real-time rating monitoring. Your reputation grows while you sleep.",
    bullets: [
      "Automated review request triggers",
      "AI response suggestions",
      "Multi-platform rating monitoring",
      "Review-to-ranking SEO boost",
    ],
    gradient: "from-yellow-900/40 to-yellow-800/20",
    accentColor: "#facc15",
  },
  {
    icon: "📢",
    title: "Ads Autopilot",
    subtitle: "Spend Smarter, Not More",
    description:
      "AI manages your Google and Meta ad campaigns. Automatic budget optimization, audience targeting, and conversion tracking — full-funnel visibility.",
    bullets: [
      "Google & Meta ad management",
      "AI budget optimization",
      "Audience targeting by industry",
      "Full-funnel conversion tracking",
    ],
    gradient: "from-red-900/40 to-red-800/20",
    accentColor: "#f87171",
  },
  {
    icon: "📊",
    title: "Business Intelligence",
    subtitle: "See Everything. Decide Faster.",
    description:
      "Revenue dashboard, client analytics, and growth reporting. Know exactly what's working, what's not, and where to invest next.",
    bullets: [
      "Real-time revenue dashboard",
      "Client & campaign analytics",
      "Growth trend reporting",
      "ROI attribution per channel",
    ],
    gradient: "from-green-900/40 to-green-800/20",
    accentColor: "#4ade80",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen" style={{ background: "#030712" }}>
      {/* Header */}
      <section className="pt-32 pb-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#4ade80" }}
          >
            Platform Features
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Everything You Need to
            <br />
            Run Your Business
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "#9ca3af" }}>
            One AI-powered platform that replaces six tools — built for your
            industry, managed for you.
          </p>
        </div>
      </section>

      {/* Feature Blocks */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto flex flex-col gap-24">
          {features.map((feature, index) => {
            const isEven = index % 2 !== 0;
            return (
              <div
                key={feature.title}
                className={`flex flex-col ${isEven ? "md:flex-row-reverse" : "md:flex-row"} gap-12 items-center`}
              >
                {/* Visual / Icon Side */}
                <div className="w-full md:w-1/2 flex-shrink-0">
                  <div
                    className={`rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}
                    style={{
                      height: "320px",
                      border: "1px solid #1f2937",
                    }}
                  >
                    <span className="text-8xl select-none">{feature.icon}</span>
                  </div>
                </div>

                {/* Text Side */}
                <div className="w-full md:w-1/2">
                  <p
                    className="text-xs font-semibold tracking-widest uppercase mb-3"
                    style={{ color: feature.accentColor }}
                  >
                    {feature.subtitle}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {feature.title}
                  </h2>
                  <p
                    className="text-base leading-relaxed mb-8"
                    style={{ color: "#9ca3af" }}
                  >
                    {feature.description}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {feature.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-center gap-3">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                          style={{
                            backgroundColor: `${feature.accentColor}22`,
                            color: feature.accentColor,
                          }}
                        >
                          ✓
                        </span>
                        <span className="text-sm" style={{ color: "#d1d5db" }}>
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-28 px-6 text-center">
        <div
          className="max-w-2xl mx-auto rounded-2xl py-16 px-8"
          style={{ background: "#0d1117", border: "1px solid #1f2937" }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to see it in action?
          </h2>
          <p className="mb-8 text-lg" style={{ color: "#9ca3af" }}>
            Choose the tier that fits your stage and unlock the features you
            need.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-8 py-4 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#4ade80", color: "#030712" }}
          >
            See Pricing →
          </Link>
        </div>
      </section>
    </main>
  );
}
