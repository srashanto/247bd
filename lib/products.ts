export type Category = {
  slug: string;
  name: string;
  emoji: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  emoji: string;
  color: string; // tailwind gradient classes for the product tile
  rating: number;
  stock: number;
  description: string;
  features: string[];
};

export const categories: Category[] = [
  { slug: "electronics", name: "Electronics", emoji: "📱" },
  { slug: "fashion", name: "Fashion", emoji: "👕" },
  { slug: "home", name: "Home & Living", emoji: "🏠" },
  { slug: "beauty", name: "Beauty", emoji: "💄" },
  { slug: "grocery", name: "Grocery", emoji: "🛒" },
  { slug: "sports", name: "Sports", emoji: "⚽" },
];

export const products: Product[] = [
  {
    id: "p1", slug: "wireless-earbuds-pro", name: "Wireless Earbuds Pro", category: "electronics",
    price: 2490, oldPrice: 3200, emoji: "🎧", color: "from-sky-100 to-indigo-200", rating: 4.6, stock: 25,
    description: "True wireless earbuds with active noise cancellation, 30 hours of battery with the case and fast USB-C charging.",
    features: ["Active noise cancellation", "30h battery with case", "IPX5 water resistant", "6 months warranty"],
  },
  {
    id: "p2", slug: "smart-watch-x2", name: "Smart Watch X2", category: "electronics",
    price: 3990, oldPrice: 4990, emoji: "⌚", color: "from-slate-100 to-slate-300", rating: 4.4, stock: 18,
    description: "1.9 inch AMOLED display, heart rate and SpO2 tracking, Bluetooth calling and 7 days of battery life.",
    features: ["AMOLED display", "Bluetooth calling", "Heart rate & SpO2", "7 days battery"],
  },
  {
    id: "p3", slug: "power-bank-20000", name: "Power Bank 20000mAh", category: "electronics",
    price: 1850, emoji: "🔋", color: "from-emerald-100 to-teal-200", rating: 4.7, stock: 40,
    description: "High capacity 20000mAh power bank with 22.5W fast charging and dual output. Perfect for load shedding.",
    features: ["20000mAh capacity", "22.5W fast charging", "Dual USB + Type-C", "LED indicator"],
  },
  {
    id: "p4", slug: "panjabi-cotton-premium", name: "Premium Cotton Panjabi", category: "fashion",
    price: 1650, oldPrice: 2100, emoji: "👘", color: "from-amber-100 to-orange-200", rating: 4.8, stock: 30,
    description: "Soft breathable cotton panjabi with fine embroidery on the collar. Ideal for Eid and special occasions.",
    features: ["100% cotton", "Sizes M to XXL", "Embroidered collar", "Machine washable"],
  },
  {
    id: "p5", slug: "jamdani-saree", name: "Handloom Jamdani Saree", category: "fashion",
    price: 5500, oldPrice: 6500, emoji: "🥻", color: "from-rose-100 to-pink-200", rating: 4.9, stock: 8,
    description: "Authentic handwoven Jamdani saree from Narayanganj artisans, with a traditional motif and blouse piece.",
    features: ["Handwoven", "Includes blouse piece", "6 yards length", "Dry clean recommended"],
  },
  {
    id: "p6", slug: "mens-sneakers", name: "Men's Running Sneakers", category: "fashion",
    price: 2200, emoji: "👟", color: "from-zinc-100 to-zinc-300", rating: 4.3, stock: 22,
    description: "Lightweight breathable mesh sneakers with a cushioned sole for daily running and walking.",
    features: ["Mesh upper", "Cushioned sole", "Sizes 39 to 44", "Anti-slip grip"],
  },
  {
    id: "p7", slug: "rice-cooker-1-8l", name: "Electric Rice Cooker 1.8L", category: "home",
    price: 2750, oldPrice: 3300, emoji: "🍚", color: "from-yellow-100 to-amber-200", rating: 4.5, stock: 15,
    description: "1.8 litre non-stick rice cooker that keeps food warm automatically. Cooks rice for 6 to 8 people.",
    features: ["1.8L capacity", "Non-stick inner pot", "Auto keep warm", "1 year warranty"],
  },
  {
    id: "p8", slug: "rechargeable-fan", name: "Rechargeable Table Fan", category: "home",
    price: 3200, emoji: "🌀", color: "from-cyan-100 to-sky-200", rating: 4.4, stock: 12,
    description: "Rechargeable 12 inch table fan with LED light and up to 8 hours of backup during power cuts.",
    features: ["Up to 8h backup", "Built-in LED light", "3 speed modes", "Low noise motor"],
  },
  {
    id: "p9", slug: "nakshi-kantha-bedsheet", name: "Nakshi Kantha Bedsheet", category: "home",
    price: 1950, emoji: "🛏️", color: "from-fuchsia-100 to-purple-200", rating: 4.7, stock: 10,
    description: "King size cotton bedsheet with hand-stitched Nakshi Kantha design and two matching pillow covers.",
    features: ["King size", "2 pillow covers", "Hand stitched", "Pure cotton"],
  },
  {
    id: "p10", slug: "herbal-face-wash", name: "Herbal Neem Face Wash", category: "beauty",
    price: 350, oldPrice: 420, emoji: "🧴", color: "from-lime-100 to-green-200", rating: 4.2, stock: 60,
    description: "Gentle neem and turmeric face wash that cleanses deeply and helps control pimples.",
    features: ["Neem & turmeric", "100ml", "For all skin types", "Paraben free"],
  },
  {
    id: "p11", slug: "matte-lipstick-set", name: "Matte Lipstick Set (6 pcs)", category: "beauty",
    price: 890, emoji: "💋", color: "from-red-100 to-rose-200", rating: 4.5, stock: 35,
    description: "Long lasting matte lipstick set with six everyday shades. Smudge proof and lightweight.",
    features: ["6 shades", "Long lasting", "Smudge proof", "Vitamin E enriched"],
  },
  {
    id: "p12", slug: "miniket-rice-5kg", name: "Premium Miniket Rice 5kg", category: "grocery",
    price: 420, emoji: "🌾", color: "from-stone-100 to-amber-100", rating: 4.6, stock: 100,
    description: "Clean, polished premium miniket rice in a sealed 5kg bag.",
    features: ["5kg pack", "Sealed packaging", "Stone free", "Fresh stock"],
  },
  {
    id: "p13", slug: "sundarban-honey", name: "Sundarban Natural Honey 500g", category: "grocery",
    price: 650, oldPrice: 750, emoji: "🍯", color: "from-orange-100 to-yellow-200", rating: 4.8, stock: 45,
    description: "Pure raw honey collected from the Sundarbans mangrove forest. No added sugar.",
    features: ["500g jar", "100% natural", "No added sugar", "Lab tested"],
  },
  {
    id: "p14", slug: "cricket-bat-english-willow", name: "English Willow Cricket Bat", category: "sports",
    price: 6800, oldPrice: 7900, emoji: "🏏", color: "from-green-100 to-emerald-200", rating: 4.7, stock: 6,
    description: "Grade 2 English willow bat with a thick edge and cane handle. Ready to play.",
    features: ["English willow", "Full size", "Cane handle", "Free bat cover"],
  },
  {
    id: "p15", slug: "football-size-5", name: "Football Size 5", category: "sports",
    price: 990, emoji: "⚽", color: "from-gray-100 to-gray-300", rating: 4.4, stock: 28,
    description: "Hand stitched size 5 match football suitable for grass and turf.",
    features: ["Size 5", "Hand stitched", "PU leather", "Free air pin"],
  },
  {
    id: "p16", slug: "yoga-mat-6mm", name: "Yoga Mat 6mm", category: "sports",
    price: 1150, emoji: "🧘", color: "from-violet-100 to-indigo-200", rating: 4.3, stock: 20,
    description: "6mm thick non-slip yoga mat with a carry strap for home workouts.",
    features: ["6mm thick", "Non-slip", "Carry strap", "Easy to clean"],
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function formatPrice(amount: number) {
  return "৳" + amount.toLocaleString("en-IN");
}

export function discountPercent(p: Product) {
  return p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
}
