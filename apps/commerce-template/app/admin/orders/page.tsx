"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/demo-products";

type OrderStatus = "all" | "pending" | "processing" | "shipped" | "delivered";

const demoOrders = [
  { id: "ord_001", orderNumber: "ORD-M3K8F-X2N1", customer: "Andi Pratama", email: "andi@mail.com", items: 3, total: 1147000, status: "pending", date: "2026-03-16" },
  { id: "ord_002", orderNumber: "ORD-L9P2R-Q7T4", customer: "Sari Dewi", email: "sari@mail.com", items: 1, total: 299000, status: "processing", date: "2026-03-16" },
  { id: "ord_003", orderNumber: "ORD-K5W1D-H8M6", customer: "Budi Santoso", email: "budi@mail.com", items: 2, total: 898000, status: "shipped", date: "2026-03-15" },
  { id: "ord_004", orderNumber: "ORD-J2V9C-F3L5", customer: "Maya Putri", email: "maya@mail.com", items: 4, total: 1936000, status: "delivered", date: "2026-03-15" },
  { id: "ord_005", orderNumber: "ORD-H7B4N-A1K9", customer: "Rizky Fadilah", email: "rizky@mail.com", items: 1, total: 749000, status: "pending", date: "2026-03-14" },
  { id: "ord_006", orderNumber: "ORD-G6C3M-D9J2", customer: "Dina Lestari", email: "dina@mail.com", items: 2, total: 548000, status: "processing", date: "2026-03-14" },
  { id: "ord_007", orderNumber: "ORD-F1A8K-B5H7", customer: "Hendra Wijaya", email: "hendra@mail.com", items: 3, total: 1497000, status: "delivered", date: "2026-03-13" },
  { id: "ord_008", orderNumber: "ORD-E4R6P-C2G1", customer: "Nisa Amalia", email: "nisa@mail.com", items: 1, total: 1290000, status: "shipped", date: "2026-03-13" },
];

const statusTabs: { value: OrderStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
};

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("all");

  const filtered =
    activeTab === "all"
      ? demoOrders
      : demoOrders.filter((o) => o.status === activeTab);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-8">Orders</h1>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-6 bg-zinc-900 rounded-lg p-1 w-fit border border-zinc-800">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-zinc-800 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/50">
                  <td className="px-5 py-3 font-mono text-xs">
                    {order.orderNumber}
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <p>{order.customer}</p>
                      <p className="text-xs text-zinc-500">{order.email}</p>
                    </div>
                  </td>
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
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      View &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-zinc-500 text-sm">
            No orders found for this status.
          </div>
        )}
      </div>
    </div>
  );
}
