import { BlogSubscribe } from "./blog-subscribe";

export const metadata = {
  title: "Blog — PeakQ",
  description: "Industry insights, platform updates, and growth strategies.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen" style={{ background: "#030712" }}>
      <section className="pt-32 pb-28 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p
            className="text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: "#4ade80" }}
          >
            Blog
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
            Coming Soon
          </h1>
          <p className="text-lg mb-10" style={{ color: "#9ca3af" }}>
            Industry insights, platform updates, and growth strategies.
            <br />
            Subscribe to get notified when we launch.
          </p>

          <BlogSubscribe />
        </div>
      </section>
    </main>
  );
}
