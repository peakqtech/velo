"use client";

import Link from "next/link";
import { useState } from "react";
import { demoProducts, formatPrice } from "@/lib/demo-products";

export default function AdminProductsPage() {
  const [products] = useState(demoProducts);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-white text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-800/50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-gradient-to-br from-zinc-700 to-zinc-600 shrink-0" />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-zinc-500">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div>
                      <span>{formatPrice(product.price)}</span>
                      {product.comparePrice && (
                        <span className="block text-xs text-zinc-500 line-through">
                          {formatPrice(product.comparePrice)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        product.stock < 20
                          ? "text-yellow-400"
                          : "text-zinc-300"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-400">
                    {product.category}
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/new?edit=${product.id}`}
                        className="text-xs text-zinc-400 hover:text-white transition-colors"
                      >
                        Edit
                      </Link>
                      <button className="text-xs text-zinc-400 hover:text-red-400 transition-colors">
                        Delete
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
