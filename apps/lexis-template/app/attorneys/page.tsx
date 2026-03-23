import Image from "next/image";
import Link from "next/link";

const attorneys = [
  {
    name: "Alexander Hartono, SH, MH",
    role: "Managing Partner",
    specialty: "Corporate Law",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
    experience: "25 years",
    education: ["University of Indonesia (SH)", "Harvard Law School (LLM)"],
    barAdmissions: ["PERADI", "Jakarta Bar Association"],
    bio: "Alexander has led the firm since 2008, building it into one of Southeast Asia's most respected corporate law practices. He has personally overseen transactions valued at over $2 billion.",
  },
  {
    name: "Victoria Susanto, SH, LLM",
    role: "Senior Partner",
    specialty: "Immigration Law",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    experience: "18 years",
    education: ["Gadjah Mada University (SH)", "University of Melbourne (LLM)"],
    barAdmissions: ["PERADI", "International Bar Association"],
    bio: "Victoria is a recognized authority on Indonesian immigration law, having successfully processed over 3,000 work permits and visa applications for multinational corporations.",
  },
  {
    name: "David Prasetyo, SH, MH",
    role: "Partner",
    specialty: "Criminal Defense",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    experience: "15 years",
    education: ["Padjadjaran University (SH)", "University of Indonesia (MH)"],
    barAdmissions: ["PERADI", "Criminal Defense Bar"],
    bio: "David has maintained a 96% acquittal rate in criminal defense cases. He is frequently consulted by media as an expert commentator on high-profile legal proceedings.",
  },
];

export default function AttorneysPage() {
  return (
    <div style={{ backgroundColor: "#FAF8F5" }}>
      {/* Header */}
      <section className="pt-32 pb-16" style={{ backgroundColor: "#1E293B" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="w-12 h-0.5 mb-6" style={{ backgroundColor: "#B8860B" }} />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "var(--font-heading)", color: "#FFFFFF" }}>
            Our Attorneys
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "rgba(255,255,255,0.5)" }}>
            Meet the legal minds behind our exceptional track record.
          </p>
        </div>
      </section>

      {/* Attorneys */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {attorneys.map((atty, i) => (
            <div
              key={atty.name}
              className="grid grid-cols-1 lg:grid-cols-3 gap-10 p-8"
              style={{ backgroundColor: "#FFFFFF", borderRadius: "4px" }}
            >
              <div className="relative aspect-[3/4] overflow-hidden" style={{ borderRadius: "4px" }}>
                <Image src={atty.image} alt={atty.name} fill className="object-cover" unoptimized />
              </div>
              <div className="lg:col-span-2">
                <span className="text-xs font-medium tracking-wider" style={{ color: "#B8860B" }}>
                  {atty.role}
                </span>
                <h2 className="text-2xl font-bold mt-2 mb-4" style={{ fontFamily: "var(--font-heading)", color: "#0F172A" }}>
                  {atty.name}
                </h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "#64748B" }}>
                  {atty.bio}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "#0F172A" }}>
                      Specialty
                    </h4>
                    <p className="text-sm" style={{ color: "#B8860B" }}>{atty.specialty}</p>
                    <p className="text-xs mt-1" style={{ color: "#94A3B8" }}>{atty.experience} experience</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "#0F172A" }}>
                      Education
                    </h4>
                    <ul className="space-y-1">
                      {atty.education.map((e) => (
                        <li key={e} className="text-xs" style={{ color: "#64748B" }}>{e}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "#0F172A" }}>
                      Bar Admissions
                    </h4>
                    <ul className="space-y-1">
                      {atty.barAdmissions.map((b) => (
                        <li key={b} className="text-xs" style={{ color: "#64748B" }}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center mt-6 px-5 py-2.5 text-sm font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: "#B8860B", color: "#0F172A", borderRadius: "4px" }}
                >
                  Schedule Consultation
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
