import Image from "next/image";
import Link from "next/link";

const allProjects = [
  {
    slug: "villa-serenity",
    name: "Villa Serenity",
    category: "Residential",
    location: "Bali, Indonesia",
    area: "450 m2",
    year: "2025",
    type: "Private Residence",
    description: "A serene tropical villa that blends contemporary architecture with Balinese craftsmanship. Floor-to-ceiling glass walls dissolve the boundary between indoor and outdoor living, while natural stone and timber create warmth throughout. The infinity pool extends toward the jungle canopy, creating an uninterrupted connection with nature.",
    heroImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    ],
  },
  {
    slug: "the-loft-kitchen",
    name: "The Loft Kitchen",
    category: "Interior",
    location: "Jakarta, Indonesia",
    area: "85 m2",
    year: "2025",
    type: "Kitchen & Dining Renovation",
    description: "A complete transformation of a dated apartment kitchen into a modern culinary workspace. The design centers on a monolithic marble island that serves as both preparation space and social hub. Custom cabinetry in matte black contrasts with warm oak accents and polished concrete floors.",
    heroImage: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
    ],
  },
  {
    slug: "casa-moderna",
    name: "Casa Moderna",
    category: "Residential",
    location: "Surabaya, Indonesia",
    area: "620 m2",
    year: "2024",
    type: "Luxury Residence",
    description: "A bold statement in modern tropical architecture. The cantilevered upper floor creates dramatic shade for the ground-level living spaces while framing views of the surrounding landscape. The material palette is deliberately restrained: exposed concrete, glass, and weathered steel.",
    heroImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    ],
  },
];

function getProject(slug: string) {
  return allProjects.find((p) => p.slug === slug) || allProjects[0];
}

function getAdjacentProjects(slug: string) {
  const idx = allProjects.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? allProjects[idx - 1] : allProjects[allProjects.length - 1];
  const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : allProjects[0];
  return { prev, next };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  const { prev, next } = getAdjacentProjects(slug);

  return (
    <div className="pt-16" style={{ backgroundColor: "#FFFFFF" }}>
      {/* Hero Image */}
      <section className="relative w-full" style={{ height: "75vh" }}>
        <Image
          src={project.heroImage}
          alt={project.name}
          fill
          className="object-cover"
          unoptimized
          priority
        />
      </section>

      {/* Project Info */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "#CCCCCC" }}>
                {project.category}
              </p>
              <h1
                className="text-4xl sm:text-6xl leading-none mb-8"
                style={{ fontFamily: "var(--font-heading)", color: "#111111" }}
              >
                {project.name}
              </h1>
              <p className="text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: "#888888", fontWeight: 300 }}>
                {project.description}
              </p>
            </div>

            {/* Specs */}
            <div className="space-y-6">
              {[
                ["Location", project.location],
                ["Area", project.area],
                ["Year", project.year],
                ["Type", project.type],
              ].map(([label, value]) => (
                <div key={label} style={{ borderBottom: "1px solid #E5E5E5", paddingBottom: "12px" }}>
                  <p className="text-xs tracking-wider uppercase mb-1" style={{ color: "#CCCCCC" }}>{label}</p>
                  <p className="text-sm font-medium" style={{ color: "#111111" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="pb-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 space-y-6">
          {project.gallery.map((img, i) => (
            <div key={i} className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <Image
                src={img}
                alt={`${project.name} photo ${i + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <section style={{ borderTop: "1px solid #E5E5E5" }}>
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2">
            <Link
              href={`/projects/${prev.slug}`}
              className="py-12 pr-8 group transition-opacity hover:opacity-60"
              style={{ borderRight: "1px solid #E5E5E5" }}
            >
              <p className="text-xs tracking-wider uppercase mb-2" style={{ color: "#CCCCCC" }}>&larr; Previous</p>
              <p className="text-lg font-medium" style={{ fontFamily: "var(--font-body)", color: "#111111" }}>
                {prev.name}
              </p>
            </Link>
            <Link
              href={`/projects/${next.slug}`}
              className="py-12 pl-8 text-right group transition-opacity hover:opacity-60"
            >
              <p className="text-xs tracking-wider uppercase mb-2" style={{ color: "#CCCCCC" }}>Next &rarr;</p>
              <p className="text-lg font-medium" style={{ fontFamily: "var(--font-body)", color: "#111111" }}>
                {next.name}
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
