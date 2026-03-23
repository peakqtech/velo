import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const properties = [
  {
    slug: "villa-serenara",
    name: "Villa Serenara",
    location: "Seminyak",
    bedrooms: 4,
    bathrooms: 4,
    guests: 8,
    price: "Rp 4,200,000",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
  },
  {
    slug: "the-jade-retreat",
    name: "The Jade Retreat",
    location: "Ubud",
    bedrooms: 3,
    bathrooms: 3,
    guests: 6,
    price: "Rp 3,500,000",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  },
  {
    slug: "coral-bay-estate",
    name: "Coral Bay Estate",
    location: "Canggu",
    bedrooms: 5,
    bathrooms: 5,
    guests: 10,
    price: "Rp 5,800,000",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
  },
  {
    slug: "ombak-villa",
    name: "Ombak Villa",
    location: "Seminyak",
    bedrooms: 3,
    bathrooms: 3,
    guests: 6,
    price: "Rp 3,800,000",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  },
  {
    slug: "villa-amara",
    name: "Villa Amara",
    location: "Ubud",
    bedrooms: 2,
    bathrooms: 2,
    guests: 4,
    price: "Rp 2,500,000",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
  },
  {
    slug: "nusa-haven",
    name: "Nusa Haven Resort",
    location: "Canggu",
    bedrooms: 6,
    bathrooms: 6,
    guests: 12,
    price: "Rp 7,200,000",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
];

export default function PropertiesPage() {
  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="pt-28 pb-12 bg-[var(--color-sand)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p
            className="text-[var(--color-gold)] text-xs tracking-[0.3em] uppercase mb-3"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
          >
            Our Collection
          </p>
          <h1
            className="text-3xl md:text-5xl font-light text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Luxury <span className="italic font-medium">Properties</span>
          </h1>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-[var(--color-sand)] pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label
                  className="block text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                >
                  Location
                </label>
                <select
                  className="w-full border border-gray-200 rounded-[var(--radius)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <option>All Locations</option>
                  <option>Seminyak</option>
                  <option>Ubud</option>
                  <option>Canggu</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                >
                  Bedrooms
                </label>
                <select
                  className="w-full border border-gray-200 rounded-[var(--radius)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <option>Any</option>
                  <option>1-2 Bedrooms</option>
                  <option>3-4 Bedrooms</option>
                  <option>5+ Bedrooms</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                >
                  Price Range
                </label>
                <select
                  className="w-full border border-gray-200 rounded-[var(--radius)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <option>Any Price</option>
                  <option>Under Rp 3,000,000</option>
                  <option>Rp 3,000,000 - 5,000,000</option>
                  <option>Above Rp 5,000,000</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-2"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                >
                  Sort By
                </label>
                <select
                  className="w-full border border-gray-200 rounded-[var(--radius)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition-colors"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Grid */}
      <section className="pb-20 bg-[var(--color-sand)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p
            className="text-[var(--color-text-muted)] text-sm mb-8"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Showing {properties.length} properties
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {properties.map((property) => (
              <Link
                key={property.slug}
                href={`/properties/${property.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    {/* Image */}
                    <div className="relative aspect-[4/3] sm:aspect-auto overflow-hidden">
                      <Image
                        src={property.image}
                        alt={property.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    </div>
                    {/* Details */}
                    <div className="p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-3.5 h-3.5 text-[var(--color-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span
                            className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider"
                            style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                          >
                            {property.location}
                          </span>
                        </div>
                        <h3
                          className="text-xl md:text-2xl font-semibold text-[var(--color-text)] mb-3"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {property.name}
                        </h3>
                        <div className="flex items-center gap-4 text-[var(--color-text-muted)] text-xs" style={{ fontFamily: "var(--font-body)" }}>
                          <span>{property.bedrooms} Beds</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>{property.bathrooms} Baths</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>{property.guests} Guests</span>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <p
                          className="text-[var(--color-primary)] font-semibold text-sm"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {property.price}
                          <span className="font-normal text-[var(--color-text-muted)]">
                            {" "}/ night
                          </span>
                        </p>
                        <span
                          className="text-[var(--color-gold)] text-sm font-medium group-hover:translate-x-1 transition-transform duration-300"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Details &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
