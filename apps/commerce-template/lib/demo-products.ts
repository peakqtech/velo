export interface DemoProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  currency: string;
  image: string;
  category: string;
  description: string;
  variants: Array<{ name: string; options: string[] }>;
  stock: number;
}

export const demoProducts: DemoProduct[] = [
  {
    id: "1",
    name: "Essential Cotton Tee",
    slug: "essential-cotton-tee",
    price: 299000,
    currency: "IDR",
    image: "/images/product-1.jpg",
    category: "Tops",
    description:
      "Premium organic cotton t-shirt with a relaxed fit. Crafted from 100% sustainably sourced cotton for everyday comfort.",
    variants: [
      { name: "Size", options: ["S", "M", "L", "XL"] },
      { name: "Color", options: ["Black", "White", "Navy"] },
    ],
    stock: 50,
  },
  {
    id: "2",
    name: "Slim Chino Pants",
    slug: "slim-chino-pants",
    price: 599000,
    currency: "IDR",
    image: "/images/product-2.jpg",
    category: "Bottoms",
    description:
      "Tailored slim-fit chinos in stretch cotton. Perfect for both casual and semi-formal occasions.",
    variants: [
      { name: "Size", options: ["28", "30", "32", "34", "36"] },
      { name: "Color", options: ["Khaki", "Navy", "Black"] },
    ],
    stock: 30,
  },
  {
    id: "3",
    name: "Linen Blend Shirt",
    slug: "linen-blend-shirt",
    price: 459000,
    currency: "IDR",
    image: "/images/product-3.jpg",
    category: "Tops",
    description:
      "Breathable linen-cotton blend shirt with a clean, minimalist collar. Ideal for warm weather.",
    variants: [
      { name: "Size", options: ["S", "M", "L", "XL"] },
      { name: "Color", options: ["White", "Sky Blue", "Sand"] },
    ],
    stock: 25,
  },
  {
    id: "4",
    name: "Oversized Crew Sweatshirt",
    slug: "oversized-crew-sweatshirt",
    price: 389000,
    comparePrice: 489000,
    currency: "IDR",
    image: "/images/product-4.jpg",
    category: "Tops",
    description:
      "Heavy-weight French terry sweatshirt with a dropped shoulder design. Soft-washed for a lived-in feel.",
    variants: [
      { name: "Size", options: ["S", "M", "L", "XL"] },
      { name: "Color", options: ["Charcoal", "Cream", "Olive"] },
    ],
    stock: 40,
  },
  {
    id: "5",
    name: "Relaxed Wide-Leg Trousers",
    slug: "relaxed-wide-leg-trousers",
    price: 549000,
    currency: "IDR",
    image: "/images/product-5.jpg",
    category: "Bottoms",
    description:
      "Contemporary wide-leg trousers with an elastic waistband and pleated front. Effortlessly stylish.",
    variants: [
      { name: "Size", options: ["28", "30", "32", "34"] },
      { name: "Color", options: ["Black", "Beige", "Charcoal"] },
    ],
    stock: 20,
  },
  {
    id: "6",
    name: "Wool Blend Overcoat",
    slug: "wool-blend-overcoat",
    price: 1290000,
    currency: "IDR",
    image: "/images/product-6.jpg",
    category: "Outerwear",
    description:
      "Classic single-breasted overcoat in a premium wool blend. Timeless silhouette for the colder months.",
    variants: [
      { name: "Size", options: ["S", "M", "L", "XL"] },
      { name: "Color", options: ["Camel", "Black", "Grey"] },
    ],
    stock: 15,
  },
  {
    id: "7",
    name: "Nylon Windbreaker",
    slug: "nylon-windbreaker",
    price: 749000,
    comparePrice: 899000,
    currency: "IDR",
    image: "/images/product-7.jpg",
    category: "Outerwear",
    description:
      "Lightweight packable windbreaker with a concealed hood. Water-resistant coating for light rain.",
    variants: [
      { name: "Size", options: ["S", "M", "L", "XL"] },
      { name: "Color", options: ["Black", "Sage", "Stone"] },
    ],
    stock: 35,
  },
  {
    id: "8",
    name: "Canvas Tote Bag",
    slug: "canvas-tote-bag",
    price: 199000,
    currency: "IDR",
    image: "/images/product-8.jpg",
    category: "Accessories",
    description:
      "Durable heavyweight canvas tote with reinforced handles. Spacious interior for daily essentials.",
    variants: [
      { name: "Color", options: ["Natural", "Black", "Navy"] },
    ],
    stock: 60,
  },
  {
    id: "9",
    name: "Leather Minimalist Belt",
    slug: "leather-minimalist-belt",
    price: 349000,
    currency: "IDR",
    image: "/images/product-9.jpg",
    category: "Accessories",
    description:
      "Full-grain leather belt with a brushed metal buckle. Clean design that pairs with everything.",
    variants: [
      { name: "Size", options: ["S", "M", "L"] },
      { name: "Color", options: ["Black", "Brown", "Tan"] },
    ],
    stock: 45,
  },
  {
    id: "10",
    name: "Ribbed Knit Beanie",
    slug: "ribbed-knit-beanie",
    price: 149000,
    currency: "IDR",
    image: "/images/product-10.jpg",
    category: "Accessories",
    description:
      "Soft merino wool blend beanie with a classic ribbed texture. Lightweight warmth for transitional seasons.",
    variants: [
      { name: "Color", options: ["Black", "Grey", "Burgundy", "Forest"] },
    ],
    stock: 70,
  },
];

export function formatPrice(price: number, currency: string = "IDR"): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
