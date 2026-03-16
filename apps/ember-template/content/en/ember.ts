import type { EmberContent } from "@velo/types";

const content: EmberContent = {
  hero: {
    headline: "A Culinary Journey",
    tagline: "Where tradition meets innovation, and every dish tells a story of passion and craftsmanship.",
    cta: { label: "Reserve a Table", href: "#reservation" },
    media: { type: "image", src: "/images/hero-dining.jpg", alt: "Elegant fine dining table setting with warm ambient lighting" },
    overlay: { opacity: 0.4, gradient: "linear-gradient(to bottom, rgba(44,24,16,0.5) 0%, rgba(44,24,16,0.3) 50%, rgba(250,247,242,1) 100%)" },
  },
  menu: {
    heading: "Our Menu",
    subtitle: "Seasonal ingredients, timeless techniques, unforgettable flavors.",
    categories: ["All", "Starters", "Mains", "Desserts"],
    items: [
      { name: "Burrata & Heirloom Tomatoes", description: "Creamy burrata with vine-ripened heirloom tomatoes, aged balsamic, and basil oil.", price: "$18", image: "/images/menu-burrata.jpg", alt: "Burrata and heirloom tomatoes", category: "Starters", badge: "Seasonal" },
      { name: "Seared Foie Gras", description: "Pan-seared foie gras with fig compote, toasted brioche, and port wine reduction.", price: "$26", image: "/images/menu-foie-gras.jpg", alt: "Seared foie gras with fig compote", category: "Starters" },
      { name: "Lobster Bisque", description: "Velvety bisque with cognac cream and chive oil, served with gruyere croutons.", price: "$22", image: "/images/menu-bisque.jpg", alt: "Lobster bisque in elegant bowl", category: "Starters" },
      { name: "Wagyu Beef Tenderloin", description: "A5 Wagyu with truffle pomme puree, roasted bone marrow, and red wine jus.", price: "$68", image: "/images/menu-wagyu.jpg", alt: "Wagyu beef tenderloin plated elegantly", category: "Mains", badge: "Signature" },
      { name: "Pan-Roasted Sea Bass", description: "Wild sea bass with saffron risotto, beurre blanc, and crispy capers.", price: "$42", image: "/images/menu-seabass.jpg", alt: "Pan-roasted sea bass on saffron risotto", category: "Mains" },
      { name: "Duck Confit", description: "Slow-cooked duck leg with cherry gastrique, roasted root vegetables, and herb oil.", price: "$38", image: "/images/menu-duck.jpg", alt: "Duck confit with cherry gastrique", category: "Mains" },
      { name: "Chocolate Souffl\u00e9", description: "Dark Valrhona chocolate souffl\u00e9 with vanilla cr\u00e8me anglaise and gold leaf.", price: "$16", image: "/images/menu-souffle.jpg", alt: "Chocolate souffle with creme anglaise", category: "Desserts", badge: "Chef's Choice" },
      { name: "Cr\u00e8me Br\u00fbl\u00e9e", description: "Classic Tahitian vanilla cr\u00e8me br\u00fbl\u00e9e with caramelized sugar and fresh berries.", price: "$14", image: "/images/menu-brulee.jpg", alt: "Creme brulee with fresh berries", category: "Desserts" },
    ],
  },
  chef: {
    heading: "The Chef",
    name: "Chef Isabella Moreau",
    bio: "With over two decades of experience across Michelin-starred kitchens in Paris, Tokyo, and New York, Chef Isabella brings a world of flavors to every plate. Her approach marries classical French technique with seasonal, locally-sourced ingredients, creating dishes that honor tradition while embracing the unexpected.",
    philosophy: "Cooking is an act of love. Every ingredient has a story, and my role is to let those stories unfold on the plate.",
    image: "/images/chef-portrait.jpg",
    alt: "Chef Isabella Moreau in the kitchen",
    achievements: [
      "Two Michelin Stars (2019 \u2013 Present)",
      "James Beard Award \u2014 Best Chef, 2021",
      "Trained under Alain Ducasse in Paris",
      "Featured in Bon App\u00e9tit, Eater, and The New York Times",
      "Advocate for sustainable and local sourcing",
    ],
  },
  reservation: {
    heading: "Reserve Your Table",
    subtitle: "Join us for an unforgettable evening of exceptional cuisine and warm hospitality.",
    cta: { label: "Make a Reservation", href: "#" },
    hours: [
      { days: "Monday \u2013 Thursday", time: "5:30 PM \u2013 10:00 PM" },
      { days: "Friday \u2013 Saturday", time: "5:00 PM \u2013 11:00 PM" },
      { days: "Sunday", time: "5:00 PM \u2013 9:00 PM" },
    ],
    phone: "+1 (212) 555-0178",
    address: "142 West 10th Street, New York, NY 10014",
  },
  gallery: {
    heading: "Our World",
    images: [
      { src: "/images/gallery-interior.jpg", alt: "Warm restaurant interior with candlelit tables", span: "wide" },
      { src: "/images/gallery-plating.jpg", alt: "Chef carefully plating a dish", span: "normal" },
      { src: "/images/gallery-wine.jpg", alt: "Curated wine cellar selection", span: "tall" },
      { src: "/images/gallery-dessert.jpg", alt: "Artfully presented dessert course", span: "normal" },
      { src: "/images/gallery-bar.jpg", alt: "Elegant bar area with craft cocktails", span: "normal" },
      { src: "/images/gallery-garden.jpg", alt: "Private garden dining terrace", span: "wide" },
    ],
  },
  testimonials: {
    heading: "Guest Voices",
    testimonials: [
      {
        quote: "An extraordinary dining experience from start to finish. The Wagyu was the best I have ever tasted, and the service was impeccable. This is what fine dining should be.",
        author: "Margaret Chen",
        role: "Food Critic, The Times",
        avatar: "/images/testimonial-1.jpg",
        avatarAlt: "Margaret Chen portrait",
      },
      {
        quote: "Chef Moreau has created something truly special. Every course was a revelation. We have been coming back monthly for over a year now and it never disappoints.",
        author: "David & Sarah Laurent",
        role: "Regular Guests",
        avatar: "/images/testimonial-2.jpg",
        avatarAlt: "David and Sarah Laurent portrait",
      },
      {
        quote: "The perfect setting for our anniversary dinner. The tasting menu paired with the sommelier's wine selections was an unforgettable journey through flavor.",
        author: "James Okoro",
        role: "Verified Guest",
        avatar: "/images/testimonial-3.jpg",
        avatarAlt: "James Okoro portrait",
      },
    ],
  },
  footer: {
    brand: { name: "Ember", logo: "/images/ember-logo.svg" },
    newsletter: { heading: "Stay in Touch", placeholder: "Your email address", cta: "Subscribe" },
    socials: [
      { platform: "Instagram", url: "https://instagram.com", icon: "instagram" },
      { platform: "Facebook", url: "https://facebook.com", icon: "facebook" },
      { platform: "Twitter", url: "https://twitter.com", icon: "twitter" },
    ],
    links: [
      { group: "Dining", items: [{ label: "Menu", href: "#menu" }, { label: "Wine List", href: "#" }, { label: "Private Dining", href: "#" }] },
      { group: "Visit", items: [{ label: "Reservations", href: "#reservation" }, { label: "Hours & Location", href: "#reservation" }, { label: "Gift Cards", href: "#" }] },
      { group: "Connect", items: [{ label: "About Us", href: "#chef" }, { label: "Press", href: "#" }, { label: "Careers", href: "#" }] },
    ],
    legal: "\u00a9 2026 Ember Restaurant. All rights reserved.",
  },
  metadata: {
    title: "Ember \u2014 Fine Dining Restaurant",
    description: "An elegant culinary journey where tradition meets innovation. Reserve your table for an unforgettable dining experience.",
    ogImage: "/images/og-image.jpg",
  },
};

export default content;
