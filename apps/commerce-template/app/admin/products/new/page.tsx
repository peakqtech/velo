"use client";

import { useState } from "react";
import Link from "next/link";

interface VariantGroup {
  name: string;
  options: string[];
}

export default function AdminProductNewPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [currency] = useState("IDR");
  const [category, setCategory] = useState("Tops");
  const [images, setImages] = useState<string[]>([""]);
  const [variants, setVariants] = useState<VariantGroup[]>([]);
  const [stock, setStock] = useState("0");
  const [trackStock, setTrackStock] = useState(true);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  }

  function addImage() {
    setImages([...images, ""]);
  }

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  function updateImage(index: number, value: string) {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  }

  function addVariant() {
    setVariants([...variants, { name: "", options: [] }]);
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index));
  }

  function updateVariantName(index: number, value: string) {
    const updated = [...variants];
    updated[index].name = value;
    setVariants(updated);
  }

  function updateVariantOptions(index: number, value: string) {
    const updated = [...variants];
    updated[index].options = value.split(",").map((s) => s.trim()).filter(Boolean);
    setVariants(updated);
  }

  function handleSave() {
    setSaving(true);
    // In production, POST to API
    const product = {
      name,
      slug,
      description,
      price: parseInt(price) || 0,
      comparePrice: comparePrice ? parseInt(comparePrice) : undefined,
      currency,
      category,
      images: images.filter(Boolean),
      variants,
      stock: parseInt(stock) || 0,
      trackStock,
      active,
    };
    console.log("Save product:", product);
    setTimeout(() => {
      setSaving(false);
      alert("Product saved (demo mode)");
    }, 500);
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          &larr;
        </Link>
        <h1 className="text-2xl font-semibold">Add Product</h1>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Basic Info
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Essential Cotton Tee"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-400 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
              placeholder="Premium organic cotton t-shirt..."
            />
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Pricing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Price ({currency})
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="299000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Compare Price
              </label>
              <input
                type="number"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="Tops">Tops</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Images
          </h2>
          {images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={img}
                onChange={(e) => updateImage(i, e.target.value)}
                className="flex-1 px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="/images/product-1.jpg"
              />
              {images.length > 1 && (
                <button
                  onClick={() => removeImage(i)}
                  className="px-3 py-2 text-xs text-zinc-400 hover:text-red-400 border border-zinc-700 rounded-lg transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addImage}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            + Add another image
          </button>
        </section>

        {/* Variants */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Variants
          </h2>
          {variants.map((v, i) => (
            <div key={i} className="p-4 bg-zinc-800/50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={v.name}
                  onChange={(e) => updateVariantName(i, e.target.value)}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="Variant name (e.g. Size)"
                />
                <button
                  onClick={() => removeVariant(i)}
                  className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">
                  Options (comma-separated)
                </label>
                <input
                  type="text"
                  value={v.options.join(", ")}
                  onChange={(e) => updateVariantOptions(i, e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="S, M, L, XL"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addVariant}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            + Add variant group
          </button>
        </section>

        {/* Inventory */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
            Inventory
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </div>
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={trackStock}
                  onChange={(e) => setTrackStock(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Track stock</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-5 py-2.5 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || !name}
            className="px-6 py-2.5 bg-white text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
