import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const featuredVillas = [
  {
    name: "Villa Serenara",
    location: "Seminyak",
    bedrooms: 4,
    guests: 8,
    price: "Rp 4,200,000",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    slug: "villa-serenara",
  },
  {
    name: "The Jade Retreat",
    location: "Ubud",
    bedrooms: 3,
    guests: 6,
    price: "Rp 3,500,000",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    slug: "the-jade-retreat",
  },
  {
    name: "Coral Bay Estate",
    location: "Canggu",
    bedrooms: 5,
    guests: 10,
    price: "Rp 5,800,000",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
    slug: "coral-bay-estate",
  },
];

const reviews = [
  {
    name: "Sophie Laurent",
    country: "France",
    rating: 5,
    quote:
      "An absolute dream. The villa exceeded every expectation. The infinity pool overlooking the rice terraces was surreal. Tropica made everything seamless.",
    avatar: "SL",
  },
  {
    name: "James Whitfield",
    country: "United Kingdom",
    rating: 5,
    quote:
      "We've stayed at luxury properties around the world, and Tropica is in a league of its own. The private chef experience alone was worth the trip.",
    avatar: "JW",
  },
  {
    name: "Akiko Tanaka",
    country: "Japan",
    rating: 5,
    quote:
      "Perfect for our honeymoon. The villa was immaculately maintained and the concierge arranged the most magical sunset dinner on the beach.",
    avatar: "AT",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar isHomepage />

      {/* ============ HERO ============ */}
      <section className="relative h-screen min-h-[700px] overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=1600&q=80"
          alt="Bali infinity pool villa"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <div className="max-w-4xl mx-auto mb-8 md:mb-16">
            <p
              className="text-[var(--color-gold)] text-sm md:text-base tracking-[0.3em] uppercase mb-4 md:mb-6"
              style={{ fontFamily: "var(--font-body)", fontWeight: 400 }}
            >
              Bali&apos;s Finest Luxury Villas
            </p>
            <h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-white font-light leading-[1.1] mb-4 md:mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your Private
              <br />
              <span className="italic font-medium">Paradise Awaits</span>
            </h1>
            <p
              className="text-white/70 text-base md:text-lg max-w-xl mx-auto"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
            >
              Luxury villas in Bali&apos;s most exclusive locations
            </p>
          </div>

          {/* Glassmorphism Booking Widget */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="liquid-glass-strong rounded-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                <div className="flex flex-col">
                  <label
                    className="text-white/60 text-xs uppercase tracking-wider mb-2"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                  >
                    Check-in
                  </label>
                  <input
                    type="date"
                    className="bg-white/10 border border-white/20 rounded-[var(--radius)] px-4 py-3 text-white text-sm outline-none focus:border-[var(--color-gold)] transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    className="text-white/60 text-xs uppercase tracking-wider mb-2"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                  >
                    Check-out
                  </label>
                  <input
                    type="date"
                    className="bg-white/10 border border-white/20 rounded-[var(--radius)] px-4 py-3 text-white text-sm outline-none focus:border-[var(--color-gold)] transition-colors"
                    style={{ fontFamily: "var(--font-body)" }}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    className="text-white/60 text-xs uppercase tracking-wider mb-2"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                  >
                    Guests
                  </label>
                  <select
                    className="bg-white/10 border border-white/20 rounded-[var(--radius)] px-4 py-3 text-white text-sm outline-none focus:border-[var(--color-gold)] transition-colors appearance-none"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    <option value="2" className="text-[var(--color-text)]">2 Guests</option>
                    <option value="4" className="text-[var(--color-text)]">4 Guests</option>
                    <option value="6" className="text-[var(--color-text)]">6 Guests</option>
                    <option value="8" className="text-[var(--color-text)]">8 Guests</option>
                    <option value="10" className="text-[var(--color-text)]">10+ Guests</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <button
                    className="gold-gradient text-white rounded-[var(--radius)] px-6 py-3 text-sm font-medium uppercase tracking-wider hover:shadow-lg hover:shadow-[var(--color-gold)]/30 transition-all duration-300"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Search Availability
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ============ FEATURED VILLAS ============ */}
      <section className="py-20 lg:py-28 bg-[var(--color-sand)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14 lg:mb-20">
            <p
              className="text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-3"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
            >
              Handpicked for You
            </p>
            <h2
              className="text-3xl md:text-5xl lg:text-6xl font-light text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Curated <span className="italic font-medium">Estates</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredVillas.map((villa) => (
              <Link
                key={villa.slug}
                href={`/properties/${villa.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={villa.image}
                      alt={villa.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <h3
                      className="text-xl md:text-2xl font-semibold text-[var(--color-text)] mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {villa.name}
                    </h3>
                    <div
                      className="flex items-center gap-4 text-[var(--color-text-muted)] text-xs mb-4"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {villa.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
                        </svg>
                        {villa.bedrooms} Beds
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {villa.guests} Guests
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p
                        className="text-[var(--color-primary)] font-semibold text-sm"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        From {villa.price}{" "}
                        <span className="font-normal text-[var(--color-text-muted)]">
                          / night
                        </span>
                      </p>
                      <span className="text-[var(--color-gold)] text-sm font-medium group-hover:translate-x-1 transition-transform duration-300">
                        View &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/properties"
              className="inline-block px-8 py-3.5 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-[var(--radius)] text-sm font-medium uppercase tracking-wider hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
              style={{ fontFamily: "var(--font-body)" }}
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* ============ EXPERIENCE ============ */}
      <section className="py-20 lg:py-28 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80"
                alt="Bali temple at sunset"
                fill
                className="object-cover"
                unoptimized
              />
              {/* Floating badge */}
              <div className="absolute bottom-6 right-6 liquid-glass-dark rounded-2xl px-6 py-4 text-white z-10">
                <p
                  className="text-3xl font-semibold"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  8+
                </p>
                <p
                  className="text-white/70 text-xs uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Years of Excellence
                </p>
              </div>
            </div>

            {/* Content */}
            <div>
              <p
                className="text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-4"
                style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
              >
                Why Choose Us
              </p>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-light text-[var(--color-text)] mb-8"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                The Tropica{" "}
                <span className="italic font-medium">Experience</span>
              </h2>
              <p
                className="text-[var(--color-text-muted)] mb-10 leading-relaxed"
                style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
              >
                Every Tropica villa is personally inspected and curated to meet
                the highest standards of luxury, comfort, and authenticity. We
                believe your stay should be as extraordinary as the island
                itself.
              </p>

              <div className="space-y-8">
                {[
                  {
                    title: "Handpicked Properties",
                    desc: "Each villa is personally vetted by our team. Only the top 5% make the Tropica collection.",
                  },
                  {
                    title: "24/7 Concierge",
                    desc: "Your dedicated concierge handles everything from airport transfers to private dining reservations.",
                  },
                  {
                    title: "Best Price Guarantee",
                    desc: "Book with confidence. Find a lower price elsewhere and we'll match it, plus give you 10% off.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-5">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3
                        className="text-lg font-semibold text-[var(--color-text)] mb-1"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="text-[var(--color-text-muted)] text-sm leading-relaxed"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 300,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ GUEST REVIEWS ============ */}
      <section className="py-20 lg:py-28 bg-[var(--color-sand)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14 lg:mb-20">
            <p
              className="text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-3"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
            >
              Testimonials
            </p>
            <h2
              className="text-3xl md:text-5xl font-light text-[var(--color-text)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What Our <span className="italic font-medium">Guests Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.name}
                className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-[var(--color-gold)]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {/* Quote */}
                <p
                  className="text-[var(--color-text)] text-sm leading-relaxed mb-6 italic"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                >
                  &ldquo;{review.quote}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center text-white text-xs font-semibold">
                    {review.avatar}
                  </div>
                  <div>
                    <p
                      className="text-[var(--color-text)] text-sm font-semibold"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {review.name}
                    </p>
                    <p
                      className="text-[var(--color-text-muted)] text-xs"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {review.country}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="relative py-20 lg:py-28 bg-[var(--color-primary)] overflow-hidden">
        {/* Subtle tropical pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 C20 15, 10 25, 5 40 C10 35, 20 30, 30 30 C20 30, 10 35, 5 40 C15 30, 25 20, 30 5z' fill='%23fff' fill-opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p
            className="text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-3"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
          >
            Newsletter
          </p>
          <h2
            className="text-3xl md:text-5xl font-light text-white mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Stay <span className="italic font-medium">Inspired</span>
          </h2>
          <p
            className="text-white/60 mb-10 max-w-lg mx-auto"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
          >
            Get exclusive access to new villa listings, seasonal offers, and
            curated Bali travel guides delivered to your inbox.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/20 rounded-[var(--radius)] px-5 py-3.5 text-white text-sm placeholder:text-white/40 outline-none focus:border-[var(--color-gold)] transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <button
              className="gold-gradient text-white rounded-[var(--radius)] px-8 py-3.5 text-sm font-medium uppercase tracking-wider hover:shadow-lg hover:shadow-[var(--color-gold)]/30 transition-all duration-300 whitespace-nowrap"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Subscribe
            </button>
          </div>
          <p
            className="text-white/30 text-xs mt-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
