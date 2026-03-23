import { Suspense } from "react";
import { LeadCaptureForm } from "@/components/lead-capture-form";

export const metadata = {
  title: "Get Started — PeakQ",
  description:
    "Start building your revenue machine. Tell us about your business.",
};

const steps = [
  {
    number: "1",
    title: "We review your info",
    description:
      "Our team reviews your submission and matches you with the best template and tier for your industry.",
  },
  {
    number: "2",
    title: "We set up your template",
    description:
      "We configure your site, connect your domain, and customize the design to match your brand.",
  },
  {
    number: "3",
    title: "You launch",
    description:
      "Go live with a fully optimized, AI-powered online presence — usually within days, not months.",
  },
];

export default function GetStartedPage() {
  return (
    <main className="min-h-screen" style={{ background: "#030712" }}>
      {/* Header */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#4ade80" }}
          >
            Get Started
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Start Building Your Revenue Machine
          </h1>
          <p className="text-lg" style={{ color: "#9ca3af" }}>
            Tell us about your business and we&rsquo;ll set you up with the
            perfect solution.
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="pb-28 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Lead Capture Form */}
          <Suspense
            fallback={
              <div
                className="rounded-xl p-6 animate-pulse"
                style={{ background: "#0d1117", border: "1px solid #1f2937", minHeight: 400 }}
              />
            }
          >
            <LeadCaptureForm />
          </Suspense>

          {/* Right: What happens next */}
          <div>
            <div
              className="rounded-xl p-6"
              style={{ background: "#0d1117", border: "1px solid #1f2937" }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">
                What happens next?
              </h3>
              <div className="flex flex-col gap-6">
                {steps.map((step) => (
                  <div key={step.number} className="flex gap-4">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: "#1f2937", color: "#4ade80" }}
                    >
                      {step.number}
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">
                        {step.title}
                      </p>
                      <p className="text-sm" style={{ color: "#9ca3af" }}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
