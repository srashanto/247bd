export type Tier = { min: number; percent: number };

export type Coupon = {
  code: string;
  type: "percent" | "fixed" | "tiered";
  value?: number | null;
  tiers?: Tier[] | null;
  min_subtotal?: number | null;
  expires_at?: string | null;
  usage_limit?: number | null;
  used?: number;
  active: boolean;
  note?: string | null;
};

export type Settings = {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  community: string;
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  /** 0 turns free delivery off. */
  freeDeliveryOver: number;
  /** Customers pay the delivery charge in advance by bKash / Nagad / Rocket. */
  advancePayment: boolean;
  paymentNumbers: { bkash: string; nagad: string; rocket: string };
  announcements: string[];
  couponNotice: string;
};

export const defaultSettings: Settings = {
  storeName: "247BD",
  tagline: "PRIDE grooming by PahelaPride, delivered all over Bangladesh",
  phone: "01748047444",
  whatsapp: "8801748047444",
  email: "pahelapride.official@gmail.com",
  address: "Narayanganj, Bangladesh",
  facebook: "https://www.facebook.com/pahela.pride",
  instagram: "https://www.instagram.com/pahela.pride/",
  youtube: "https://www.youtube.com/@pahelapride",
  community: "https://www.facebook.com/share/g/1EiPYJT8C5/",
  deliveryInsideDhaka: 80,
  deliveryOutsideDhaka: 120,
  freeDeliveryOver: 0,
  advancePayment: true,
  paymentNumbers: { bkash: "01683075333", nagad: "01683075333", rocket: "01683075333" },
  announcements: [
    "Use [PAHELA] coupon code to get up to 30% discount",
    "Combo কিনলে FREE gift",
    "Cash on Delivery সারা বাংলাদেশে",
  ],
  couponNotice: "Use [PAHELA] coupon code to get up to 30% discount",
};

/** Used to preview coupons when the admin backend is not connected. */
export const defaultCoupons: Coupon[] = [
  {
    code: "PAHELA",
    type: "tiered",
    tiers: [
      { min: 500, percent: 5 },
      { min: 1500, percent: 10 },
      { min: 2500, percent: 15 },
      { min: 3500, percent: 20 },
      { min: 4500, percent: 25 },
      { min: 5000, percent: 30 },
    ],
    active: true,
    note: "Up to 30% off by cart subtotal",
  },
];

export function couponDiscount(c: Coupon | undefined, subtotal: number): { discount: number; message?: string } {
  if (!c || !c.active) return { discount: 0, message: "This coupon code is not valid" };
  if (c.expires_at && new Date(c.expires_at) < new Date()) return { discount: 0, message: "This coupon has expired" };
  if (c.usage_limit != null && (c.used ?? 0) >= c.usage_limit) return { discount: 0, message: "This coupon has been used up" };
  if (subtotal < (c.min_subtotal ?? 0)) return { discount: 0, message: `Add ৳${c.min_subtotal} or more to use this coupon` };
  if (c.type === "fixed") return { discount: Math.min(c.value ?? 0, subtotal) };
  if (c.type === "percent") return { discount: Math.round((subtotal * (c.value ?? 0)) / 100) };
  const pct = Math.max(0, ...(c.tiers ?? []).filter((t) => subtotal >= t.min).map((t) => t.percent));
  if (!pct) return { discount: 0, message: `Add ৳${Math.min(...(c.tiers ?? []).map((t) => t.min))} or more to use this coupon` };
  return { discount: Math.round((subtotal * pct) / 100) };
}

export function deliveryCharge(s: Settings, district: string, subtotal: number) {
  if (subtotal === 0) return 0;
  if (s.freeDeliveryOver > 0 && subtotal >= s.freeDeliveryOver) return 0;
  return district === "Dhaka" ? s.deliveryInsideDhaka : s.deliveryOutsideDhaka;
}

export const districts = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura", "Brahmanbaria", "Chandpur", "Chattogram",
  "Chuadanga", "Cox's Bazar", "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gazipur", "Gopalganj",
  "Habiganj", "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna", "Kishoreganj",
  "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur", "Magura", "Manikganj", "Meherpur", "Moulvibazar",
  "Munshiganj", "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore", "Nawabganj", "Netrakona",
  "Nilphamari", "Noakhali", "Pabna", "Panchagarh", "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati",
  "Rangpur", "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet", "Tangail", "Thakurgaon",
];
