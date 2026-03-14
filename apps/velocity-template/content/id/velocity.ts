import type { VelocityContent } from "@velocity/types";

const content: VelocityContent = {
  hero: {
    headline: "Hancurkan Setiap Batas",
    tagline: "Dirancang untuk atlet yang menolak berhenti.",
    cta: { label: "Belanja Sekarang", href: "#products" },
    media: {
      type: "image",
      src: "/images/hero-placeholder.jpg",
      poster: "/images/hero-poster.jpg",
      alt: "Atlet berlari dengan perlengkapan Velocity",
    },
    overlay: { opacity: 0.4, gradient: "linear-gradient(to bottom, transparent, black)" },
  },
  productShowcase: {
    title: "The Apex Runner",
    subtitle: "Sepatu lari paling canggih kami.",
    products: [
      {
        name: "Apex Runner Pro",
        image: "/images/shoe-placeholder.png",
        alt: "Velocity Apex Runner Pro hitam dan merah",
        features: [
          { label: "Plat Karbon", position: { x: 30, y: 60 } },
          { label: "Busa React", position: { x: 70, y: 80 } },
          { label: "Mesh Bernapas", position: { x: 50, y: 30 } },
        ],
      },
    ],
  },
  brandStory: {
    chapters: [
      {
        heading: "Lahir di Lintasan",
        body: "Velocity dimulai dengan keyakinan sederhana: setiap atlet layak mendapatkan perlengkapan yang mengikuti ambisi mereka.",
        media: { type: "image", src: "/images/story-1.jpg", alt: "Lintasan atletik saat matahari terbit" },
        layout: "right",
      },
      {
        heading: "Diuji oleh Juara",
        body: "Dari ujian Olimpiade hingga lari 5K lingkungan, perlengkapan kami teruji di setiap tingkat kompetisi.",
        media: { type: "image", src: "/images/story-2.jpg", alt: "Atlet berkompetisi dengan perlengkapan Velocity" },
        layout: "left",
      },
      {
        heading: "Dibangun untuk Masa Depan",
        body: "Material berkelanjutan. Manufaktur tanpa limbah. Performa yang tidak merugikan planet.",
        media: { type: "image", src: "/images/story-3.jpg", alt: "Fasilitas manufaktur berkelanjutan" },
        layout: "full",
      },
    ],
  },
  productGrid: {
    heading: "Belanja Koleksi",
    categories: ["Semua", "Lari", "Latihan", "Gaya Hidup"],
    products: [
      { name: "Apex Runner Pro", price: { amount: 2800000, currency: "IDR" }, image: "/images/product-1.jpg", alt: "Sepatu Apex Runner Pro", category: "Lari", badge: "Baru" },
      { name: "Velocity Trainer X", price: { amount: 2200000, currency: "IDR" }, image: "/images/product-2.jpg", alt: "Sepatu Velocity Trainer X", category: "Latihan" },
      { name: "Street Glide", price: { amount: 1900000, currency: "IDR" }, image: "/images/product-3.jpg", alt: "Sepatu kasual Street Glide", category: "Gaya Hidup" },
      { name: "Sprint Elite", price: { amount: 3100000, currency: "IDR" }, image: "/images/product-4.jpg", alt: "Sepatu balap Sprint Elite", category: "Lari", badge: "Pro" },
      { name: "Power Lift", price: { amount: 2500000, currency: "IDR" }, image: "/images/product-5.jpg", alt: "Sepatu latihan Power Lift", category: "Latihan" },
      { name: "Urban Flow", price: { amount: 1700000, currency: "IDR" }, image: "/images/product-6.jpg", alt: "Sneaker Urban Flow", category: "Gaya Hidup" },
    ],
  },
  testimonials: {
    heading: "Kata Para Atlet",
    testimonials: [
      { quote: "Apex Runner mengubah hari lomba saya. Saya memecahkan rekor pribadi 3 menit.", author: "Sarah Chen", role: "Pelari Maraton", avatar: "/images/avatar-1.jpg", avatarAlt: "Foto Sarah Chen" },
      { quote: "Sepatu latihan paling nyaman yang pernah saya pakai. Titik.", author: "Marcus Williams", role: "Atlet CrossFit", avatar: "/images/avatar-2.jpg", avatarAlt: "Foto Marcus Williams" },
      { quote: "Akhirnya merek yang mengerti kebutuhan sprinter.", author: "Aisha Okafor", role: "Sprinter 100m", avatar: "/images/avatar-3.jpg", avatarAlt: "Foto Aisha Okafor" },
    ],
  },
  footer: {
    brand: { name: "Velocity", logo: "/images/velocity-logo.svg" },
    newsletter: { heading: "Tetap dalam perlombaan", placeholder: "Masukkan email Anda", cta: "Berlangganan" },
    socials: [
      { platform: "Instagram", url: "https://instagram.com", icon: "instagram" },
      { platform: "Twitter", url: "https://twitter.com", icon: "twitter" },
      { platform: "YouTube", url: "https://youtube.com", icon: "youtube" },
    ],
    links: [
      { group: "Belanja", items: [{ label: "Lari", href: "#" }, { label: "Latihan", href: "#" }, { label: "Gaya Hidup", href: "#" }] },
      { group: "Perusahaan", items: [{ label: "Tentang", href: "#" }, { label: "Karir", href: "#" }, { label: "Pers", href: "#" }] },
      { group: "Dukungan", items: [{ label: "FAQ", href: "#" }, { label: "Pengiriman", href: "#" }, { label: "Pengembalian", href: "#" }] },
    ],
    legal: "© 2026 Velocity Athletics. Hak cipta dilindungi.",
  },
  metadata: {
    title: "Velocity — Performa Atletik Didefinisikan Ulang",
    description: "Perlengkapan atletik premium yang dirancang untuk performa puncak.",
    ogImage: "/images/og-image.jpg",
  },
};

export default content;
