import { demoProducts, formatPrice } from "@/lib/demo-products";

const metrics = [
  {
    label: "Total Products",
    value: demoProducts.length.toString(),
    change: "+2 this week",
  },
  { label: "Total Orders", value: "156", change: "+12 this week" },
  {
    label: "Revenue (this month)",
    value: formatPrice(24850000),
    change: "+8.2%",
  },
  { label: "Pending Orders", value: "7", change: "3 need attention" },
];

const recentOrders = [
  {
    id: "ORD-M3K8F-X2N1",
    customer: "Andi Pratama",
    items: 3,
    total: 1147000,
    status: "pending",
    date: "2026-03-16",
  },
  {
    id: "ORD-L9P2R-Q7T4",
    customer: "Sari Dewi",
    items: 1,
    total: 299000,
    status: "processing",
    date: "2026-03-16",
  },
  {
    id: "ORD-K5W1D-H8M6",
    customer: "Budi Santoso",
    items: 2,
    total: 898000,
    status: "shipped",
    date: "2026-03-15",
  },
  {
    id: "ORD-J2V9C-F3L5",
    customer: "Maya Putri",
    items: 4,
    total: 1936000,
    status: "delivered",
    date: "2026-03-15",
  },
  {
    id: "ORD-H7B4N-A1K9",
    customer: "Rizky Fadilah",
    items: 1,
    total: 749000,
    status: "pending",
    date: "2026-03-14",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
};

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
              {m.label}
            </p>
            <p className="text-2xl font-semibold mt-2">{m.value}</p>
            <p className="text-xs text-zinc-500 mt-1">{m.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent Orders</h2>
          <a
            href="/admin/orders"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            View all &rarr;
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/50">
                  <td className="px-5 py-3 font-mono text-xs">{order.id}</td>
                  <td className="px-5 py-3">{order.customer}</td>
                  <td className="px-5 py-3 text-zinc-400">{order.items}</td>
                  <td className="px-5 py-3">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-400">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
