const stats = [
  {
    label: "Total Properties",
    value: "24",
    change: "+3 this month",
    positive: true,
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    label: "Bookings This Month",
    value: "47",
    change: "+12% vs last month",
    positive: true,
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    label: "Revenue",
    value: "Rp 892M",
    change: "+8.3% vs last month",
    positive: true,
    icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Occupancy Rate",
    value: "78%",
    change: "-2% vs last month",
    positive: false,
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

const recentBookings = [
  { guest: "Emma Wilson", villa: "Villa Serenara", dates: "Mar 18 - 22", status: "Confirmed", amount: "Rp 16,800,000" },
  { guest: "Thomas Mueller", villa: "The Jade Retreat", dates: "Mar 20 - 25", status: "Pending", amount: "Rp 17,500,000" },
  { guest: "Li Wei", villa: "Coral Bay Estate", dates: "Mar 22 - 28", status: "Confirmed", amount: "Rp 34,800,000" },
  { guest: "Sarah Johnson", villa: "Ombak Villa", dates: "Mar 25 - 28", status: "Confirmed", amount: "Rp 11,400,000" },
  { guest: "Pierre Dubois", villa: "Nusa Haven Resort", dates: "Apr 1 - 7", status: "Pending", amount: "Rp 43,200,000" },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="mb-10">
        <h1
          className="text-2xl md:text-3xl font-light text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Welcome back, <span className="italic font-medium">Admin</span>
        </h1>
        <p
          className="text-[var(--color-text-muted)] text-sm mt-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Here&apos;s what&apos;s happening with your properties today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--color-primary)]/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                </svg>
              </div>
            </div>
            <p
              className="text-2xl font-semibold text-[var(--color-text)] mb-1"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {stat.value}
            </p>
            <p
              className="text-[var(--color-text-muted)] text-xs mb-1"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {stat.label}
            </p>
            <p
              className={`text-xs font-medium ${stat.positive ? "text-green-600" : "text-red-500"}`}
              style={{ fontFamily: "var(--font-body)" }}
            >
              {stat.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2
            className="text-xl font-semibold text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Recent Bookings
          </h2>
          <a
            href="#"
            className="text-[var(--color-gold)] text-sm font-medium hover:underline"
            style={{ fontFamily: "var(--font-body)" }}
          >
            View All
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th
                  className="text-left px-6 py-3 text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Guest
                </th>
                <th
                  className="text-left px-6 py-3 text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Villa
                </th>
                <th
                  className="text-left px-6 py-3 text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Dates
                </th>
                <th
                  className="text-left px-6 py-3 text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Status
                </th>
                <th
                  className="text-right px-6 py-3 text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-medium"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.map((booking, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td
                    className="px-6 py-4 text-sm text-[var(--color-text)] font-medium"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {booking.guest}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-[var(--color-text-muted)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {booking.villa}
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-[var(--color-text-muted)]"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {booking.dates}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "Confirmed"
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 text-sm text-right text-[var(--color-text)] font-medium"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {booking.amount}
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
