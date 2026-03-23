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
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    category: "Tops",
    description:
      "Premium organic cotton t-shirt with a relaxed fit. Breathable fabric perfect for everyday wear.",
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
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
    category: "Bottoms",
    description:
      "Tailored slim-fit chinos in stretch cotton. Perfect transition from office to weekend.",
    variants: [
      { name: "Size", options: ["28", "30", "32", "34", "36"] },
      { name: "Color", options: ["Khaki", "Navy", "Black"] },
    ],
    stock: 30,
  },
  {
    id: "3",
    name: "Oversized Hoodie",
    slug: "oversized-hoodie",
    price: 459000,
    currency: "IDR",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    category: "Tops",
    description:
      "Heavyweight cotton hoodie with a dropped shoulder. Cozy meets contemporary.",
    variants: [
      { name: "Size", options: ["S", "M", "L", "XL"] },
      { name: "Color", options: ["Gray", "Black", "Cream"] },
    ],
    stock: 25,
  },
  {
    id: "4",
    name: "Wide Leg Trousers",
    slug: "wide-leg-trousers",
    price: 699000,
    currency: "IDR",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
    category: "Bottoms",
    description:
      "Relaxed wide-leg silhouette in premium wool blend. Effortlessly elegant.",
    variants: [
      { name: "Size", options: ["28", "30", "32", "34"] },
      { name: "Color", options: ["Black", "Charcoal"] },
    ],
    stock: 20,
  },
  {
    id: "5",
    name: "Wool Overcoat",
    slug: "wool-overcoat",
    price: 1299000,
    currency: "IDR",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
    category: "Outerwear",
    description:
      "Double-breasted wool overcoat. Timeless design for the modern wardrobe.",
    variants: [
      { name: "Size", options: ["S", "M", "L", "XL"] },
      { name: "Color", options: ["Camel", "Black", "Navy"] },
    ],
    stock: 15,
  },
  {
    id: "6",
    name: "Puffer Jacket",
    slug: "puffer-jacket",
    price: 899000,
    currency: "IDR",
    image: "https://images.unsplash.com/photo-1544923246-77307dd270b5?w=800&q=80",
    category: "Outerwear",
    description:
      "Lightweight down puffer with matte finish. Warmth without the bulk.",
    variants: [
      { name: "Size", options: ["S", "M", "L", "XL"] },
      { name: "Color", options: ["Black", "Olive", "Navy"] },
    ],
    stock: 18,
  },
  {
    id: "7",
    name: "Canvas Tote Bag",
    slug: "canvas-tote-bag",
    price: 249000,
    currency: "IDR",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
    category: "Accessories",
    description:
      "Heavy-duty canvas tote with leather handles. Carries everything, looks great doing it.",
    variants: [{ name: "Color", options: ["Natural", "Black"] }],
    stock: 40,
  },
  {
    id: "8",
    name: "Leather Belt",
    slug: "leather-belt",
    price: 349000,
    currency: "IDR",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    category: "Accessories",
    description:
      "Full-grain leather belt with brushed nickel buckle. Built to last decades.",
    variants: [
      { name: "Size", options: ["S", "M", "L"] },
      { name: "Color", options: ["Brown", "Black"] },
    ],
    stock: 35,
  },
  {
    id: "9",
    name: "Linen Shirt",
    slug: "linen-shirt",
    price: 449000,
    currency: "IDR",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
    category: "Tops",
    description:
      "Pure linen button-down with a relaxed collar. The perfect warm-weather essential.",
    variants: [
      { name: "Size", options: ["S", "M", "L", "XL"] },
      { name: "Color", options: ["White", "Sky Blue", "Sand"] },
    ],
    stock: 28,
  },
  {
    id: "10",
    name: "Wool Scarf",
    slug: "wool-scarf",
    price: 199000,
    comparePrice: 299000,
    currency: "IDR",
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80",
    category: "Accessories",
    description:
      "Soft merino wool scarf with fringed edges. Essential winter layering piece.",
    variants: [{ name: "Color", options: ["Burgundy", "Gray", "Camel"] }],
    stock: 45,
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
