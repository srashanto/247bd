export type Gender = "him" | "her" | "unisex";

export type PackShape =
  | "bottle"
  | "pump"
  | "spray"
  | "jar"
  | "tube"
  | "dropper"
  | "perfume"
  | "trimmer"
  | "straightener"
  | "comb";

export type Pack = {
  shape: PackShape;
  body: string; // main package colour
  accent: string; // cap / lid / pump colour
};

export type Category = { slug: string; name: string };
export type Concern = { slug: string; name: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Text printed on the pack. Use "|" for a line break. */
  label: string;
  gender: Gender;
  category: string;
  concerns: string[];
  price: number;
  oldPrice?: number;
  size?: string;
  pack: Pack;
  badge?: "Bestseller" | "New";
  stock: number;
  description: string;
  highlights: string[];
  keyIngredients?: string;
  howToUse: string;
  /** For combos: slugs of the products inside the box. */
  includes?: string[];
};

export const genders: Record<Gender, { name: string; short: string }> = {
  him: { name: "For him", short: "Him" },
  her: { name: "For her", short: "Her" },
  unisex: { name: "For everyone", short: "Unisex" },
};

export const categories: Category[] = [
  { slug: "hair-care", name: "Hair care" },
  { slug: "hair-styling", name: "Hair styling" },
  { slug: "skincare", name: "Skincare" },
  { slug: "beard-shave", name: "Beard & shave" },
  { slug: "body-care", name: "Body care" },
  { slug: "fragrance", name: "Fragrance" },
  { slug: "tools", name: "Tools" },
  { slug: "combos", name: "Combos" },
];

export const concerns: Concern[] = [
  { slug: "hair-fall", name: "Hair fall" },
  { slug: "frizz", name: "Frizzy, dry hair" },
  { slug: "styling", name: "Hold & texture" },
  { slug: "oily-skin", name: "Oily skin" },
  { slug: "acne", name: "Pimples" },
  { slug: "dullness", name: "Dull skin" },
  { slug: "dry-skin", name: "Dry skin" },
  { slug: "sun", name: "Sun protection" },
  { slug: "beard", name: "Patchy beard" },
  { slug: "freshness", name: "All-day freshness" },
];

const items: Product[] = [
  // ---------- For him ----------
  {
    id: "m1", slug: "sea-salt-texture-spray", name: "Sea Salt Texture Spray", label: "Sea Salt|Spray",
    gender: "him", category: "hair-styling", concerns: ["styling"], size: "200 ml",
    price: 650, oldPrice: 750, badge: "Bestseller", stock: 40,
    pack: { shape: "spray", body: "#3E6A86", accent: "#1F2A2E" },
    description: "Adds volume and a matte, beach-style texture to short and medium hair without the crunch of gel.",
    highlights: ["Light, flexible hold", "Matte finish", "Works on damp or dry hair", "Washes out easily"],
    keyIngredients: "Sea salt, aloe vera, panthenol",
    howToUse: "Shake well. Spray 4–6 times on towel-dried hair, then blow-dry while shaping with your fingers.",
  },
  {
    id: "m2", slug: "matte-clay-pomade", name: "Matte Clay Pomade", label: "Matte|Clay",
    gender: "him", category: "hair-styling", concerns: ["styling"], size: "100 g",
    price: 750, badge: "Bestseller", stock: 35,
    pack: { shape: "jar", body: "#2B2F33", accent: "#B8873A" },
    description: "Strong hold with zero shine. Shapes quiffs, crops and messy textures that stay in place all day.",
    highlights: ["Strong hold", "No shine", "Restyle during the day", "Non-greasy"],
    keyIngredients: "Kaolin clay, bentonite, beeswax",
    howToUse: "Warm a fingertip amount between your palms and work it through dry hair from the roots up.",
  },
  {
    id: "m3", slug: "anti-hairfall-shampoo-men", name: "Anti-Hairfall Shampoo for Men", label: "Anti|Hairfall",
    gender: "him", category: "hair-care", concerns: ["hair-fall"], size: "250 ml",
    price: 590, oldPrice: 690, stock: 50,
    pack: { shape: "bottle", body: "#2F4B63", accent: "#C9D3DB" },
    description: "A daily shampoo with caffeine and biotin that cleans the scalp without stripping it and helps reduce breakage.",
    highlights: ["Caffeine + biotin", "Sulphate free", "Daily use", "Fresh mint feel"],
    keyIngredients: "Caffeine, biotin, peppermint oil",
    howToUse: "Massage into wet scalp for 1–2 minutes, then rinse well. Use every day or every other day.",
  },
  {
    id: "m4", slug: "charcoal-oil-control-face-wash", name: "Charcoal Oil-Control Face Wash", label: "Charcoal|Face Wash",
    gender: "him", category: "skincare", concerns: ["oily-skin", "acne"], size: "150 ml",
    price: 420, badge: "Bestseller", stock: 60,
    pack: { shape: "tube", body: "#33393D", accent: "#7E8A90" },
    description: "Deep-cleans sweat, dust and extra oil after a long day outside. Leaves skin clean but not tight.",
    highlights: ["Controls oil for hours", "Unclogs pores", "For oily and combination skin", "Use morning and night"],
    keyIngredients: "Activated charcoal, salicylic acid, tea tree",
    howToUse: "Lather a small amount on wet face, massage for 30 seconds and rinse with cool water.",
  },
  {
    id: "m5", slug: "beard-growth-oil", name: "Beard Growth Oil", label: "Beard|Oil",
    gender: "him", category: "beard-shave", concerns: ["beard"], size: "30 ml",
    price: 690, oldPrice: 850, badge: "Bestseller", stock: 30,
    pack: { shape: "dropper", body: "#8A5A2B", accent: "#1F2A2E" },
    description: "Nourishes the skin under your beard and softens coarse hair. Helps patchy areas look fuller over time.",
    highlights: ["Softens rough beard", "Stops beard itch", "Light woody scent", "Absorbs fast"],
    keyIngredients: "Argan, jojoba, castor oil, vitamin E",
    howToUse: "Put 4–5 drops on your palm and massage into the beard and skin underneath, once or twice a day.",
  },
  {
    id: "m6", slug: "beard-wash-softener", name: "Beard Wash & Softener", label: "Beard|Wash",
    gender: "him", category: "beard-shave", concerns: ["beard"], size: "100 ml",
    price: 450, stock: 28,
    pack: { shape: "tube", body: "#6B4A2F", accent: "#D7C3A6" },
    description: "A gentle cleanser for beards that removes dust and food without drying the skin below.",
    highlights: ["2-in-1 wash and soften", "No dry flakes", "Gentle on skin"],
    keyIngredients: "Coconut-based cleansers, aloe vera, argan oil",
    howToUse: "Lather into a wet beard, leave for one minute and rinse. Follow with beard oil.",
  },
  {
    id: "m7", slug: "sensitive-shaving-foam", name: "Sensitive Shaving Foam", label: "Shave|Foam",
    gender: "him", category: "beard-shave", concerns: [], size: "200 ml",
    price: 380, stock: 45,
    pack: { shape: "spray", body: "#D9E2E8", accent: "#2F4B63" },
    description: "Rich, cushioning foam that lets the razor glide and helps prevent cuts and redness.",
    highlights: ["For sensitive skin", "Rich lather", "Alcohol free"],
    keyIngredients: "Aloe vera, glycerin, chamomile",
    howToUse: "Shake well, apply a golf-ball amount to wet skin and shave in the direction of hair growth.",
  },
  {
    id: "m8", slug: "after-shave-balm", name: "Cooling After Shave Balm", label: "After|Shave",
    gender: "him", category: "beard-shave", concerns: ["dry-skin"], size: "100 ml",
    price: 520, stock: 25,
    pack: { shape: "pump", body: "#9DB3C2", accent: "#1F2A2E" },
    description: "Calms razor burn and hydrates freshly shaved skin, without the sting of alcohol splash.",
    highlights: ["Soothes razor burn", "No sting", "Light, quick absorbing"],
    keyIngredients: "Menthol, allantoin, shea butter",
    howToUse: "After shaving, pat skin dry and smooth one pump over the shaved area.",
  },
  {
    id: "m9", slug: "sport-body-spray", name: "Sport Deodorant Body Spray", label: "Sport|Body Spray",
    gender: "him", category: "body-care", concerns: ["freshness"], size: "150 ml",
    price: 450, oldPrice: 520, stock: 70,
    pack: { shape: "spray", body: "#1F3A4F", accent: "#E0A92E" },
    description: "A fresh citrus and aquatic body spray made for humid days and long commutes.",
    highlights: ["Fresh citrus scent", "Lasts through the day", "No white marks"],
    howToUse: "Spray from about 15 cm away on chest and underarms.",
  },
  {
    id: "m10", slug: "oud-intense-edp", name: "Oud Intense Eau de Parfum", label: "Oud|Intense",
    gender: "him", category: "fragrance", concerns: ["freshness"], size: "50 ml",
    price: 1890, oldPrice: 2290, badge: "New", stock: 15,
    pack: { shape: "perfume", body: "#4A3426", accent: "#B8873A" },
    description: "Warm oud, smoky amber and a touch of saffron. A rich evening scent that stays on for hours.",
    highlights: ["Long lasting", "Warm and woody", "Good for evenings and events"],
    keyIngredients: "Notes: saffron, oud, amber, sandalwood",
    howToUse: "Spray on pulse points: neck, wrists and behind the ears. Don't rub.",
  },
  {
    id: "m11", slug: "precision-beard-trimmer", name: "Precision Beard Trimmer", label: "Trimmer",
    gender: "him", category: "tools", concerns: ["beard"], size: "20 length settings",
    price: 2490, oldPrice: 2990, stock: 12,
    pack: { shape: "trimmer", body: "#2B2F33", accent: "#9DB3C2" },
    description: "Cordless trimmer with 20 length settings from stubble to a full beard, and a 90-minute battery.",
    highlights: ["90 min cordless use", "USB-C charging", "Washable head", "6 months warranty"],
    howToUse: "Choose a length, then trim against the direction of growth. Rinse the head after use.",
  },

  // ---------- For her ----------
  {
    id: "w1", slug: "rice-water-repair-shampoo", name: "Rice Water Repair Shampoo", label: "Rice Water|Shampoo",
    gender: "her", category: "hair-care", concerns: ["hair-fall", "frizz"], size: "250 ml",
    price: 620, oldPrice: 720, badge: "Bestseller", stock: 50,
    pack: { shape: "bottle", body: "#EFE3D3", accent: "#7A4775" },
    description: "Strengthens long hair from root to tip and cuts down breakage from heat, colour and humidity.",
    highlights: ["Reduces breakage", "Adds shine", "Safe for coloured hair", "Sulphate free"],
    keyIngredients: "Fermented rice water, keratin, amla",
    howToUse: "Massage into wet scalp, let the lather run through the lengths, then rinse. Follow with a mask or conditioner.",
  },
  {
    id: "w2", slug: "argan-hair-serum", name: "Argan Anti-Frizz Hair Serum", label: "Argan|Serum",
    gender: "her", category: "hair-care", concerns: ["frizz"], size: "50 ml",
    price: 690, badge: "Bestseller", stock: 40,
    pack: { shape: "pump", body: "#C9963F", accent: "#3B2A22" },
    description: "Tames frizz and flyaways in humid weather and gives hair a smooth, glossy finish.",
    highlights: ["Controls frizz", "Heat protection", "Non-sticky"],
    keyIngredients: "Argan oil, silk proteins, vitamin E",
    howToUse: "Smooth 1–2 pumps through the mid-lengths and ends of damp or dry hair. Avoid the roots.",
  },
  {
    id: "w3", slug: "keratin-smooth-hair-mask", name: "Keratin Smooth Hair Mask", label: "Keratin|Mask",
    gender: "her", category: "hair-care", concerns: ["frizz"], size: "200 g",
    price: 790, oldPrice: 890, stock: 22,
    pack: { shape: "jar", body: "#7A4775", accent: "#EADCE8" },
    description: "A weekly deep-conditioning mask that makes rough, damaged hair soft and easy to manage.",
    highlights: ["Deep conditioning", "Softer in one use", "Use once or twice a week"],
    keyIngredients: "Hydrolysed keratin, shea butter, coconut oil",
    howToUse: "After shampoo, apply generously to lengths and ends. Leave 5–10 minutes, then rinse.",
  },
  {
    id: "w4", slug: "vitamin-c-glow-serum", name: "Vitamin C Glow Serum", label: "Vitamin C|Serum",
    gender: "her", category: "skincare", concerns: ["dullness"], size: "30 ml",
    price: 890, oldPrice: 1050, badge: "Bestseller", stock: 30,
    pack: { shape: "dropper", body: "#D98B2B", accent: "#F3F5F2" },
    description: "Brightens dull skin and evens out dark spots with regular use. Light texture that layers under sunscreen.",
    highlights: ["Brightens tone", "Fades dark spots", "Lightweight", "Morning use"],
    keyIngredients: "10% vitamin C, ferulic acid, vitamin E",
    howToUse: "Apply 3–4 drops on clean skin every morning. Always follow with sunscreen.",
  },
  {
    id: "w5", slug: "hyaluronic-gel-moisturizer", name: "Hyaluronic Gel Moisturizer", label: "Gel|Moisturizer",
    gender: "her", category: "skincare", concerns: ["dry-skin", "oily-skin"], size: "50 g",
    price: 750, stock: 34,
    pack: { shape: "jar", body: "#CFE0E8", accent: "#5E8FA8" },
    description: "Water-light hydration that suits Bangladesh's humid weather. Keeps skin plump without feeling heavy.",
    highlights: ["Oil free", "Water-light gel", "Day and night"],
    keyIngredients: "Hyaluronic acid, ceramides, green tea",
    howToUse: "Massage a pea-sized amount onto clean skin, morning and night.",
  },
  {
    id: "w6", slug: "niacinamide-pimple-face-wash", name: "Niacinamide Pimple Care Face Wash", label: "Pimple|Face Wash",
    gender: "her", category: "skincare", concerns: ["acne", "oily-skin"], size: "100 ml",
    price: 450, oldPrice: 520, stock: 55,
    pack: { shape: "tube", body: "#F0E4EE", accent: "#7A4775" },
    description: "A gentle gel cleanser that clears clogged pores and helps calm active pimples and marks.",
    highlights: ["Calms pimples", "Gentle foam", "Doesn't dry out skin"],
    keyIngredients: "Niacinamide, zinc, centella",
    howToUse: "Massage onto wet skin for 30 seconds, morning and night, then rinse.",
  },
  {
    id: "w7", slug: "brightening-body-lotion", name: "Brightening Body Lotion", label: "Body|Lotion",
    gender: "her", category: "body-care", concerns: ["dry-skin", "dullness"], size: "250 ml",
    price: 690, stock: 40,
    pack: { shape: "pump", body: "#F2D7DD", accent: "#A2506A" },
    description: "Daily body lotion that softens dry elbows and knees and gives skin an even, healthy glow.",
    highlights: ["48h moisture", "Non-greasy", "Light floral scent"],
    keyIngredients: "Niacinamide, shea butter, glycerin",
    howToUse: "Apply all over the body after bathing, while skin is still a little damp.",
  },
  {
    id: "w8", slug: "rose-musk-body-mist", name: "Rose & Musk Body Mist", label: "Rose|Musk",
    gender: "her", category: "fragrance", concerns: ["freshness"], size: "150 ml",
    price: 590, badge: "New", stock: 38,
    pack: { shape: "spray", body: "#D9A3B4", accent: "#F3F5F2" },
    description: "Soft rose and clean musk. A light everyday mist for college, office or a quick refresh.",
    highlights: ["Light everyday scent", "Spray on skin, hair or clothes", "Alcohol light"],
    keyIngredients: "Notes: rose, pear, white musk",
    howToUse: "Mist over skin and clothes from about 20 cm away. Reapply whenever you like.",
  },
  {
    id: "w9", slug: "peony-edp", name: "Peony Bloom Eau de Parfum", label: "Peony|Bloom",
    gender: "her", category: "fragrance", concerns: ["freshness"], size: "50 ml",
    price: 1890, oldPrice: 2290, stock: 14,
    pack: { shape: "perfume", body: "#E7C3CF", accent: "#7A4775" },
    description: "Fresh peony, jasmine and a soft vanilla base. Feminine, long lasting and easy to wear.",
    highlights: ["Long lasting", "Floral and soft", "Day to night"],
    keyIngredients: "Notes: peony, jasmine, vanilla",
    howToUse: "Spray on pulse points: neck and wrists. Don't rub.",
  },
  {
    id: "w10", slug: "ionic-hair-straightener", name: "Ionic Hair Straightener", label: "Straightener",
    gender: "her", category: "tools", concerns: ["frizz"], size: "5 heat settings",
    price: 2890, oldPrice: 3490, badge: "New", stock: 10,
    pack: { shape: "straightener", body: "#3B2A33", accent: "#E7C3CF" },
    description: "Ceramic plates with ionic technology for smooth, shiny hair. Heats up in 30 seconds.",
    highlights: ["Heats in 30 seconds", "5 heat settings", "Auto shut-off", "6 months warranty"],
    howToUse: "Use on dry hair with a heat protectant. Work in small sections, moving slowly from root to tip.",
  },

  // ---------- Unisex ----------
  {
    id: "u1", slug: "invisible-sunscreen-spf50", name: "Invisible Sunscreen SPF 50 PA++++", label: "SPF 50|Sunscreen",
    gender: "unisex", category: "skincare", concerns: ["sun", "oily-skin"], size: "50 ml",
    price: 790, oldPrice: 890, badge: "Bestseller", stock: 60,
    pack: { shape: "tube", body: "#F3E3B5", accent: "#E0A92E" },
    description: "No white cast, no greasy shine. Daily sun protection that works on every skin tone.",
    highlights: ["SPF 50 PA++++", "No white cast", "Matte finish", "Sweat resistant"],
    keyIngredients: "Broad-spectrum UV filters, niacinamide",
    howToUse: "Apply two finger-lengths to face and neck as the last step in the morning. Reapply every 2–3 hours outside.",
  },
  {
    id: "u2", slug: "aloe-soothing-gel", name: "Aloe Vera Soothing Gel", label: "Aloe|Gel",
    gender: "unisex", category: "skincare", concerns: ["dry-skin", "acne"], size: "200 ml",
    price: 390, stock: 80,
    pack: { shape: "jar", body: "#BFD8B8", accent: "#3F6B57" },
    description: "Cooling gel for sunburn, shaving irritation and dry patches. Works on face, body and hair.",
    highlights: ["Cools sunburn", "Calms irritation", "Multi-use"],
    keyIngredients: "92% aloe vera",
    howToUse: "Apply a thin layer wherever skin feels hot, dry or irritated.",
  },
  {
    id: "u3", slug: "wide-tooth-wooden-comb", name: "Wide-Tooth Neem Wood Comb", label: "Comb",
    gender: "unisex", category: "tools", concerns: ["hair-fall", "frizz"], size: "1 piece",
    price: 250, stock: 90,
    pack: { shape: "comb", body: "#A47148", accent: "#A47148" },
    description: "Handmade neem wood comb that detangles without pulling, and reduces static and breakage.",
    highlights: ["Anti-static", "Gentle on wet hair", "Beard friendly"],
    howToUse: "Comb from the ends upward, a few centimetres at a time.",
  },
];

const comboDefs: Omit<Product, "oldPrice" | "pack" | "stock">[] = [
  {
    id: "c1", slug: "beard-starter-kit", name: "Beard Starter Kit", label: "Beard Kit",
    gender: "him", category: "combos", concerns: ["beard"], price: 1190, badge: "Bestseller",
    includes: ["beard-growth-oil", "beard-wash-softener", "wide-tooth-wooden-comb"],
    description: "Everything for a softer, fuller-looking beard: wash it, oil it, comb it.",
    highlights: ["Wash, oil and comb", "Gift ready", "Save on the set"],
    howToUse: "Wash the beard, pat dry, apply 4–5 drops of oil and comb into shape.",
  },
  {
    id: "c2", slug: "mens-styling-duo", name: "Men's Styling Duo", label: "Styling Duo",
    gender: "him", category: "combos", concerns: ["styling"], price: 1199,
    includes: ["sea-salt-texture-spray", "matte-clay-pomade"],
    description: "Pre-style with sea salt spray for volume, then lock it in with matte clay.",
    highlights: ["Volume + hold", "Matte finish", "Save on the set"],
    howToUse: "Spray on damp hair and blow-dry, then work a little clay through to finish.",
  },
  {
    id: "c3", slug: "daily-glow-routine", name: "Daily Glow Routine", label: "Glow Set",
    gender: "her", category: "combos", concerns: ["dullness", "sun"], price: 1990, badge: "Bestseller",
    includes: ["vitamin-c-glow-serum", "hyaluronic-gel-moisturizer", "invisible-sunscreen-spf50"],
    description: "A simple three-step morning routine for brighter, hydrated and protected skin.",
    highlights: ["3-step routine", "Brighter skin", "Save on the set"],
    howToUse: "Morning: vitamin C serum, then gel moisturizer, then sunscreen.",
  },
  {
    id: "c4", slug: "frizz-free-hair-kit", name: "Frizz-Free Hair Kit", label: "Hair Kit",
    gender: "her", category: "combos", concerns: ["frizz", "hair-fall"], price: 1749,
    includes: ["rice-water-repair-shampoo", "keratin-smooth-hair-mask", "argan-hair-serum"],
    description: "Wash, repair and seal: the full routine for smooth, manageable hair even in monsoon humidity.",
    highlights: ["Wash, mask, serum", "Less frizz, more shine", "Save on the set"],
    howToUse: "Shampoo, apply the mask for 5–10 minutes, rinse, then finish with 1–2 pumps of serum.",
  },
];

const bySlug = new Map(items.map((p) => [p.slug, p]));

const combos: Product[] = comboDefs.map((c) => {
  const inside = (c.includes ?? []).map((s) => bySlug.get(s)!).filter(Boolean);
  return {
    ...c,
    oldPrice: inside.reduce((n, p) => n + p.price, 0),
    stock: Math.min(...inside.map((p) => p.stock)),
    pack: inside[0].pack,
    size: `${inside.length} products`,
  };
});

export const products: Product[] = [...items, ...combos];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getConcern(slug: string) {
  return concerns.find((c) => c.slug === slug);
}

export function includedProducts(p: Product) {
  return (p.includes ?? []).map((s) => getProduct(s)).filter((x): x is Product => Boolean(x));
}

export function formatPrice(amount: number) {
  return "৳" + amount.toLocaleString("en-IN");
}

export function discountPercent(p: Product) {
  return p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
}

export function matchesGender(p: Product, g: string) {
  if (!g) return true;
  return p.gender === g || p.gender === "unisex";
}
