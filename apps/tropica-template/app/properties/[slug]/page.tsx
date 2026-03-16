import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const villaData: Record<
  string,
  {
    name: string;
    location: string;
    area: string;
    bedrooms: number;
    bathrooms: number;
    guests: number;
    description: string;
    images: string[];
    amenities: string[];
    peakPrice: string;
    offPeakPrice: string;
    holidayPrice: string;
    reviews: { name: string; country: string; rating: number; text: string }[];
  }
> = {
  "villa-serenara": {
    name: "Villa Serenara",
    location: "Seminyak",
    area: "Jl. Kayu Aya, Seminyak",
    bedrooms: 4,
    bathrooms: 4,
    guests: 8,
    description:
      "Nestled in the heart of Seminyak, Villa Serenara is a contemporary tropical masterpiece. This four-bedroom haven features an expansive 15-meter infinity pool, open-plan living spaces that flow seamlessly into lush tropical gardens, and a rooftop terrace with panoramic sunset views. Every room is thoughtfully designed with natural materials, handcrafted Balinese art, and modern amenities for the ultimate luxury experience.",
    images: [
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    ],
    amenities: [
      "Private Pool",
      "High-Speed WiFi",
      "Air Conditioning",
      "Fully Equipped Kitchen",
      "Parking",
      "Garden",
      "BBQ Area",
      "Smart TV",
      "Washer & Dryer",
      "Safe Box",
      "Daily Housekeeping",
      "Airport Transfer",
    ],
    peakPrice: "Rp 5,500,000",
    offPeakPrice: "Rp 4,200,000",
    holidayPrice: "Rp 7,000,000",
    reviews: [
      {
        name: "Sophie Laurent",
        country: "France",
        rating: 5,
        text: "Absolutely breathtaking villa. The pool was divine and the staff went above and beyond. Will definitely return.",
      },
      {
        name: "David Chen",
        country: "Singapore",
        rating: 5,
        text: "Perfect family getaway. Spacious rooms, beautiful design, and the location is ideal for exploring Seminyak.",
      },
    ],
  },
};

const fallbackVilla = {
  name: "The Jade Retreat",
  location: "Ubud",
  area: "Jl. Raya Ubud, Ubud",
  bedrooms: 3,
  bathrooms: 3,
  guests: 6,
  description:
    "Surrounded by ancient rice terraces and tropical jungle, The Jade Retreat is a sanctuary of calm. This three-bedroom villa combines traditional Balinese architecture with contemporary luxury. Wake to the sound of birdsong, meditate in the yoga pavilion, and dine under the stars in the open-air restaurant. The perfect escape for those seeking tranquility and authentic Balinese culture.",
  images: [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
  ],
  amenities: [
    "Private Pool",
    "High-Speed WiFi",
    "Air Conditioning",
    "Fully Equipped Kitchen",
    "Yoga Pavilion",
    "Garden",
    "Rice Terrace View",
    "Smart TV",
    "Daily Housekeeping",
    "Bicycle Rental",
    "Spa Room",
    "Airport Transfer",
  ],
  peakPrice: "Rp 4,500,000",
  offPeakPrice: "Rp 3,500,000",
  holidayPrice: "Rp 6,000,000",
  reviews: [
    {
      name: "Akiko Tanaka",
      country: "Japan",
      rating: 5,
      text: "The most peaceful place I have ever stayed. Waking up to the rice terrace views was magical.",
    },
    {
      name: "James Whitfield",
      country: "UK",
      rating: 5,
      text: "Incredible attention to detail. The private yoga sessions and spa were highlights of our trip.",
    },
  ],
};

const amenityIcons: Record<string, string> = {
  "Private Pool": "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14",
  "High-Speed WiFi": "M8.111 16.404a12 12 0 015.78 0M12 20h.01M5.11 13.39a16 16 0 0113.78 0M2.11 10.39a20 20 0 0119.78 0",
  "Air Conditioning": "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  "Fully Equipped Kitchen": "M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
};

const calendarDays = Array.from({ length: 35 }, (_, i) => {
  const day = i - 2;
  return {
    day: day > 0 && day <= 31 ? day : null,
    available: day > 0 && day <= 31 ? ![5, 6, 7, 12, 13, 14, 15, 25, 26].includes(day) : false,
    booked: [5, 6, 7, 12, 13, 14, 15, 25, 26].includes(day),
  };
});

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const villa = villaData[slug] || fallbackVilla;

  const moreProperties = [
    {
      slug: "coral-bay-estate",
      name: "Coral Bay Estate",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
      location: "Canggu",
      price: "Rp 5,800,000",
    },
    {
      slug: "ombak-villa",
      name: "Ombak Villa",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      location: "Seminyak",
      price: "Rp 3,800,000",
    },
    {
      slug: "nusa-haven",
      name: "Nusa Haven Resort",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      location: "Canggu",
      price: "Rp 7,200,000",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero Photo Grid */}
      <section className="pt-24 pb-8 bg-[var(--color-sand)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden">
            {/* Main Image */}
            <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto md:min-h-[400px]">
              <Image
                src={villa.images[0]}
                alt={villa.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute top-4 left-4 glass-dark rounded-full px-4 py-2 text-white text-xs font-medium" style={{ fontFamily: "var(--font-body)" }}>
                {villa.images.length} Photos
              </div>
            </div>
            {/* Thumbnails */}
            {villa.images.slice(1, 5).map((img, i) => (
              <div key={i} className="relative aspect-[4/3] hidden md:block">
                <Image
                  src={img}
                  alt={`${villa.name} photo ${i + 2}`}
                  fill
                  className="object-cover hover:opacity-90 transition-opacity cursor-pointer"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Info */}
      <section className="py-12 bg-[var(--color-sand)]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left - Details */}
            <div className="lg:col-span-2 space-y-10">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-[var(--color-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[var(--color-text-muted)] text-sm" style={{ fontFamily: "var(--font-body)" }}>
                    {villa.area}
                  </span>
                </div>
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-light text-[var(--color-text)] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {villa.name}
                </h1>
                <div className="flex flex-wrap gap-6 text-[var(--color-text-muted)] text-sm" style={{ fontFamily: "var(--font-body)" }}>
                  <span>{villa.bedrooms} Bedrooms</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 self-center" />
                  <span>{villa.bathrooms} Bathrooms</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 self-center" />
                  <span>Up to {villa.guests} Guests</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2
                  className="text-2xl font-semibold text-[var(--color-text)] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  About This Property
                </h2>
                <p
                  className="text-[var(--color-text-muted)] leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                >
                  {villa.description}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h2
                  className="text-2xl font-semibold text-[var(--color-text)] mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {villa.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 bg-white rounded-[var(--radius)] px-4 py-3"
                    >
                      <svg
                        className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d={amenityIcons[amenity] || "M5 13l4 4L19 7"}
                        />
                      </svg>
                      <span
                        className="text-[var(--color-text)] text-sm"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Table */}
              <div>
                <h2
                  className="text-2xl font-semibold text-[var(--color-text)] mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Rates
                </h2>
                <div className="bg-white rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[var(--color-primary)] text-white">
                        <th
                          className="text-left px-6 py-4 text-sm font-medium uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Season
                        </th>
                        <th
                          className="text-left px-6 py-4 text-sm font-medium uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Period
                        </th>
                        <th
                          className="text-right px-6 py-4 text-sm font-medium uppercase tracking-wider"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          Per Night
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="px-6 py-4 text-sm text-[var(--color-text)]" style={{ fontFamily: "var(--font-body)" }}>
                          Off-Peak
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]" style={{ fontFamily: "var(--font-body)" }}>
                          Jan - Mar, Oct - Nov
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-[var(--color-primary)]" style={{ fontFamily: "var(--font-body)" }}>
                          {villa.offPeakPrice}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-[var(--color-text)]" style={{ fontFamily: "var(--font-body)" }}>
                          Peak Season
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]" style={{ fontFamily: "var(--font-body)" }}>
                          Apr - Sep
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-[var(--color-primary)]" style={{ fontFamily: "var(--font-body)" }}>
                          {villa.peakPrice}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-[var(--color-text)]" style={{ fontFamily: "var(--font-body)" }}>
                          Holiday
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]" style={{ fontFamily: "var(--font-body)" }}>
                          Dec, Nyepi, Eid
                        </td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-[var(--color-primary)]" style={{ fontFamily: "var(--font-body)" }}>
                          {villa.holidayPrice}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[var(--color-text-muted)] text-xs mt-3" style={{ fontFamily: "var(--font-body)" }}>
                  * Minimum 2-night stay. Prices exclude 10% government tax and 5% service charge.
                </p>
              </div>

              {/* Availability Calendar */}
              <div>
                <h2
                  className="text-2xl font-semibold text-[var(--color-text)] mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Availability
                </h2>
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h3
                      className="text-lg font-semibold text-[var(--color-text)]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      March 2026
                    </h3>
                    <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                      <div
                        key={d}
                        className="text-center text-xs text-[var(--color-text-muted)] py-2 uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((cell, i) => (
                      <div
                        key={i}
                        className={`text-center py-2.5 rounded-lg text-sm transition-colors ${
                          cell.day === null
                            ? ""
                            : cell.booked
                            ? "bg-red-50 text-red-300 line-through"
                            : "bg-green-50 text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white cursor-pointer"
                        }`}
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {cell.day}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 mt-4 text-xs text-[var(--color-text-muted)]" style={{ fontFamily: "var(--font-body)" }}>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-green-50 border border-green-200" />
                      Available
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded bg-red-50 border border-red-200" />
                      Booked
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h2
                  className="text-2xl font-semibold text-[var(--color-text)] mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Guest Reviews
                </h2>
                <div className="space-y-6">
                  {villa.reviews.map((review) => (
                    <div
                      key={review.name}
                      className="bg-white rounded-2xl p-6"
                    >
                      <div className="flex items-center gap-1 mb-3">
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
                      <p
                        className="text-[var(--color-text)] text-sm leading-relaxed mb-4 italic"
                        style={{ fontFamily: "var(--font-body)", fontWeight: 300 }}
                      >
                        &ldquo;{review.text}&rdquo;
                      </p>
                      <p
                        className="text-[var(--color-text)] text-sm font-semibold"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {review.name}{" "}
                        <span className="text-[var(--color-text-muted)] font-normal text-xs" style={{ fontFamily: "var(--font-body)" }}>
                          {review.country}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div>
                <h2
                  className="text-2xl font-semibold text-[var(--color-text)] mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Location
                </h2>
                <div className="bg-white rounded-2xl overflow-hidden aspect-[16/9] flex items-center justify-center border border-gray-100">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-[var(--color-text-muted)]/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-[var(--color-text-muted)] text-sm" style={{ fontFamily: "var(--font-body)" }}>
                      {villa.area}, {villa.location}, Bali
                    </p>
                    <p className="text-[var(--color-text-muted)] text-xs mt-1" style={{ fontFamily: "var(--font-body)" }}>
                      Interactive map available after booking
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Booking Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                  <div className="mb-6">
                    <p
                      className="text-2xl font-semibold text-[var(--color-primary)]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {villa.offPeakPrice}
                      <span
                        className="text-base font-normal text-[var(--color-text-muted)]"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {" "}/ night
                      </span>
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className="w-3.5 h-3.5 text-[var(--color-gold)]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs text-[var(--color-text-muted)] ml-1" style={{ fontFamily: "var(--font-body)" }}>
                        ({villa.reviews.length} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
                        Check-in
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-200 rounded-[var(--radius)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
                        style={{ fontFamily: "var(--font-body)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
                        Check-out
                      </label>
                      <input
                        type="date"
                        className="w-full border border-gray-200 rounded-[var(--radius)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
                        style={{ fontFamily: "var(--font-body)" }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
                        Guests
                      </label>
                      <select
                        className="w-full border border-gray-200 rounded-[var(--radius)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] transition-colors"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {Array.from({ length: villa.guests }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i === 0 ? "Guest" : "Guests"}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    className="w-full gold-gradient text-white rounded-[var(--radius)] py-3.5 text-sm font-medium uppercase tracking-wider hover:shadow-lg hover:shadow-[var(--color-gold)]/30 transition-all duration-300 mb-3"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Book Now
                  </button>
                  <a
                    href="#"
                    className="block w-full text-center border-2 border-green-500 text-green-600 rounded-[var(--radius)] py-3 text-sm font-medium hover:bg-green-500 hover:text-white transition-all duration-300"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    Inquire via WhatsApp
                  </a>
                </div>

                {/* Quick Facts */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h4
                    className="text-lg font-semibold text-[var(--color-text)] mb-4"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Quick Facts
                  </h4>
                  <div className="space-y-3 text-sm" style={{ fontFamily: "var(--font-body)" }}>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Property Type</span>
                      <span className="text-[var(--color-text)] font-medium">Private Villa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Check-in</span>
                      <span className="text-[var(--color-text)] font-medium">2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Check-out</span>
                      <span className="text-[var(--color-text)] font-medium">12:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Min. Stay</span>
                      <span className="text-[var(--color-text)] font-medium">2 Nights</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--color-text-muted)]">Cancellation</span>
                      <span className="text-[var(--color-text)] font-medium">Free up to 7 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2
            className="text-2xl md:text-3xl font-light text-[var(--color-text)] mb-10"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            More <span className="italic font-medium">Properties</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {moreProperties.map((p) => (
              <Link key={p.slug} href={`/properties/${p.slug}`} className="group block">
                <div className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                  <div className="bg-white p-5">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]" style={{ fontFamily: "var(--font-heading)" }}>
                      {p.name}
                    </h3>
                    <p className="text-[var(--color-text-muted)] text-xs mt-1" style={{ fontFamily: "var(--font-body)" }}>
                      {p.location}
                    </p>
                    <p className="text-[var(--color-primary)] text-sm font-semibold mt-2" style={{ fontFamily: "var(--font-body)" }}>
                      From {p.price} <span className="font-normal text-[var(--color-text-muted)]">/ night</span>
                    </p>
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
