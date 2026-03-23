"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/demo-products";

const demoOrderDetails: Record<
  string,
  {
    id: string;
    orderNumber: string;
    customer: {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    items: Array<{
      name: string;
      variant: string;
      qty: number;
      price: number;
    }>;
    subtotal: number;
    shipping: number;
    total: number;
    status: string;
    paymentMethod: string;
    timeline: Array<{ status: string; date: string; note: string }>;
  }
> = {
  ord_001: {
    id: "ord_001",
    orderNumber: "ORD-M3K8F-X2N1",
    customer: {
      name: "Andi Pratama",
      email: "andi@mail.com",
      phone: "+62 812-3456-7890",
      address: "Jl. Sudirman No. 45, Jakarta Selatan, DKI Jakarta 12190",
    },
    items: [
      { name: "Essential Cotton Tee", variant: "M / Black", qty: 2, price: 299000 },
      { name: "Slim Chino Pants", variant: "32 / Navy", qty: 1, price: 599000 },
    ],
    subtotal: 1197000,
    shipping: 0,
    total: 1197000,
    status: "pending",
    paymentMethod: "Bank Transfer",
    timeline: [
      { status: "Order Placed", date: "2026-03-16 14:23", note: "Order received" },
    ],
  },
  ord_002: {
    id: "ord_002",
    orderNumber: "ORD-L9P2R-Q7T4",
    customer: {
      name: "Sari Dewi",
      email: "sari@mail.com",
      phone: "+62 878-9012-3456",
      address: "Jl. Gatot Subroto No. 12, Bandung, Jawa Barat 40261",
    },
    items: [
      { name: "Essential Cotton Tee", variant: "S / White", qty: 1, price: 299000 },
    ],
    subtotal: 299000,
    shipping: 25000,
    total: 324000,
    status: "processing",
    paymentMethod: "E-Wallet",
    timeline: [
      { status: "Order Placed", date: "2026-03-16 10:05", note: "Order received" },
      { status: "Payment Confirmed", date: "2026-03-16 10:08", note: "E-Wallet payment verified" },
      { status: "Processing", date: "2026-03-16 11:30", note: "Preparing order for shipment" },
    ],
  },
};

const statusFlow = ["pending", "processing", "shipped", "delivered"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  shipped: "bg-purple-500/20 text-purple-400",
  delivered: "bg-green-500/20 text-green-400",
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const order = demoOrderDetails[orderId];
  const [status, setStatus] = useState(order?.status ?? "pending");

  if (!order) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Order Not Found</h1>
        <p className="text-zinc-500 mb-4">
          This order detail is only available for demo orders ord_001 and
          ord_002.
        </p>
        <Link
          href="/admin/orders"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          &larr; Back to orders
        </Link>
      </div>
    );
  }

  function handleStatusUpdate(newStatus: string) {
    setStatus(newStatus);
    // In production, PATCH /api/orders/:id
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/orders"
          className="text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          &larr;
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">
            Order {order.orderNumber}
          </h1>
          <span
            className={`inline-flex mt-1 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[status]}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800">
              <h2 className="text-sm font-semibold">Order Items</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                  <th className="px-5 py-3 font-medium">Product</th>
                  <th className="px-5 py-3 font-medium">Variant</th>
                  <th className="px-5 py-3 font-medium text-right">Qty</th>
                  <th className="px-5 py-3 font-medium text-right">Price</th>
                  <th className="px-5 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3">{item.name}</td>
                    <td className="px-5 py-3 text-zinc-400">{item.variant}</td>
                    <td className="px-5 py-3 text-right">{item.qty}</td>
                    <td className="px-5 py-3 text-right">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-5 py-3 text-right font-medium">
                      {formatPrice(item.price * item.qty)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-4 border-t border-zinc-800 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Shipping</span>
                <span>
                  {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t border-zinc-800 pt-2">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Order Timeline</h2>
            <div className="space-y-4">
              {order.timeline.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-zinc-500 mt-1.5" />
                    {i < order.timeline.length - 1 && (
                      <div className="w-px flex-1 bg-zinc-700 mt-1" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">{entry.status}</p>
                    <p className="text-xs text-zinc-500">{entry.date}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {entry.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-3">Customer</h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.customer.name}</p>
              <p className="text-zinc-400">{order.customer.email}</p>
              <p className="text-zinc-400">{order.customer.phone}</p>
            </div>
            <h3 className="text-xs font-medium text-zinc-500 mt-4 mb-1 uppercase tracking-wider">
              Shipping Address
            </h3>
            <p className="text-sm text-zinc-400">{order.customer.address}</p>
          </div>

          {/* Payment */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-3">Payment</h2>
            <p className="text-sm text-zinc-400">{order.paymentMethod}</p>
          </div>

          {/* Status Update */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-3">Update Status</h2>
            <select
              value={status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              {statusFlow.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
