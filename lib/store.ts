export const STORE = {
  name: "247BD",
  tagline: "Grooming essentials for him and her, delivered across Bangladesh",
  phone: "01700-000000",
  // WhatsApp number in international format without "+". Replace with the real shop number.
  whatsapp: "8801700000000",
  // bKash / Nagad number customers send advance payment to. Replace with the real number.
  paymentNumber: "01700-000000",
  email: "support@247bd.net",
  address: "Dhaka, Bangladesh",
  facebook: "https://facebook.com/",
  deliveryInsideDhaka: 60,
  deliveryOutsideDhaka: 120,
  freeDeliveryOver: 2500,
};

export const districts = [
  "Dhaka", "Chattogram", "Gazipur", "Narayanganj", "Sylhet", "Rajshahi", "Khulna", "Barishal",
  "Rangpur", "Mymensingh", "Cumilla", "Bogura", "Cox's Bazar", "Jashore", "Dinajpur", "Tangail",
  "Faridpur", "Noakhali", "Feni", "Pabna", "Kushtia", "Brahmanbaria", "Narsingdi", "Other",
];

export function deliveryCharge(district: string, subtotal: number) {
  if (subtotal === 0) return 0;
  if (subtotal >= STORE.freeDeliveryOver) return 0;
  return district === "Dhaka" ? STORE.deliveryInsideDhaka : STORE.deliveryOutsideDhaka;
}
