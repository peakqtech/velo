import Image from "next/image";

const properties = [
  {
    name: "Villa Serenara",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    location: "Seminyak",
    bedrooms: 4,
    price: "Rp 4,200,000",
    status: "Active",
  },
  {
    name: "The Jade Retreat",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    location: "Ubud",
    bedrooms: 3,
    price: "Rp 3,500,000",
    status: "Active",
  },
  {
    name: "Coral Bay Estate",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
    location: "Canggu",
    bedrooms: 5,
    price: "Rp 5,800,000",
    status: "Active",
  },
  {
    name: "Ombak Villa",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    location: "Seminyak",
    bedrooms: 3,
    price: "Rp 3,800,000",
    status: "Maintenance",
  },
  {
    name: "Villa Amara",
    image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    location: "Ubud",
    bedrooms: 2,
    price: "Rp 2,500,000",
    status: "Active",
  },
  {
    name: "Nusa Haven Resort",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    location: "Canggu",
    bedrooms: 6,
    price: "Rp 7,200,000",
    status: "Active",
  },
];

export default function AdminPropertiesPage() {
  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl md:text-3xl font-light text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Manage <span className="italic font-medium">Properties</span>
          </h1>
          <p
            className="text-[var(--color-text-muted)] text-sm mt-1"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {properties.length} properties in your portfolio
          </p>
        </div>
        <button
          className="gold-gradient text-white rounded-[var(--radius)] px-6 py-2.5 text-sm font-medium uppercase tracking-wider hover:shadow-lg transition-shadow duration-300"
          style={{ fontFamily: "var(--font-body)" }}
        >
          + Add Property
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th
                  className="text-left px-6 py-4 text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Property
                </th>
                <th
                  className="text-left px-6 py-4 text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Location
                </th>
                <th
                  className="text-left px-6 py-4 text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Bedrooms
                </th>
                <th
                  className="text-left px-6 py-4 text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Price / Night
                </th>
                <th
                  className="text-left px-6 py-4 text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Status
                </th>
                <th
                  className="text-right px-6 py-4 text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {properties.map((property) => (
                <tr
                  key={property.name}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={property.image}
                          alt={property.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <span
                        className="text-sm font-semibold text-[var(--color-text)]"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {property.name}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-[var(--color-text-muted)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {property.location}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-[var(--color-text-muted)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {property.bedrooms}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-[var(--color-text)] font-medium"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {property.price}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        property.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors p-1"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="text-[var(--color-text-muted)] hover:text-red-500 transition-colors p-1"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
