import { formatPrice } from "./products";
import { Settings } from "./settings";
import { supabase } from "./supabase";

export type PayMethod = "bkash" | "nagad" | "rocket" | "cod";

export const payLabels: Record<PayMethod, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
  cod: "Cash on delivery",
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "returned";

export const statusLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export type OrderItem = {
  slug: string;
  name: string;
  variation?: string | null;
  label?: string | null;
  price: number;
  qty: number;
  image?: string | null;
};

export type Customer = {
  name: string;
  phone: string;
  district: string;
  area: string;
  address: string;
  email?: string;
};

export type Payment = {
  method: PayMethod;
  /** Advance amount the customer sent by mobile banking. */
  advance?: number;
  trx?: string;
  screenshot?: string | null;
  verified?: boolean;
};

export type Order = {
  id: string;
  created_at: string;
  status: OrderStatus;
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  coupon?: string | null;
  delivery: number;
  total: number;
  payment: Payment;
  note?: string | null;
  admin_note?: string | null;
  courier?: string | null;
  tracking?: string | null;
  updated_at?: string;
};

export type NewOrder = {
  customer: Customer;
  items: { slug: string; variation?: string | null; qty: number }[];
  coupon?: string | null;
  payment: Payment;
  note?: string;
};

const KEY = "247bd-orders-v2";

export function loadMyOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function rememberOrder(order: Order) {
  try {
    localStorage.setItem(KEY, JSON.stringify([order, ...loadMyOrders().filter((o) => o.id !== order.id)].slice(0, 50)));
  } catch {}
}

/** Shrinks a payment screenshot before upload so it goes through on slow mobile data. */
export async function compressImage(file: File, max = 1400): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise((res) => canvas.toBlob((b) => res(b || file), "image/jpeg", 0.82));
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function uploadScreenshot(file: File): Promise<string | null> {
  const db = supabase();
  if (!db) return null;
  const blob = await compressImage(file);
  const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.jpg`;
  const { error } = await db.storage.from("payment-proofs").upload(path, blob, { contentType: "image/jpeg" });
  if (error) throw error;
  return path;
}

export function whatsappLink(order: Order, settings: Settings) {
  const lines = [
    `New order from ${settings.storeName} website`,
    `Order ID: ${order.id}`,
    ``,
    ...order.items.map((i) => `• ${i.name}${i.label ? ` (${i.label})` : ""} x${i.qty} = ${formatPrice(i.price * i.qty)}`),
    ``,
    `Subtotal: ${formatPrice(order.subtotal)}`,
    order.discount ? `Discount${order.coupon ? ` (${order.coupon})` : ""}: -${formatPrice(order.discount)}` : "",
    `Delivery: ${formatPrice(order.delivery)}`,
    `Total: ${formatPrice(order.total)}`,
    order.payment.trx
      ? `Advance ${formatPrice(order.payment.advance ?? order.delivery)} paid by ${payLabels[order.payment.method]} (TrxID: ${order.payment.trx})`
      : `Payment: Cash on delivery`,
    ``,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}, ${order.customer.area}, ${order.customer.district}`,
    order.note ? `Note: ${order.note}` : "",
  ].filter((l, i, arr) => l !== "" || (arr[i - 1] !== "" && i > 0));
  return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export async function trackOrder(id: string, phone: string): Promise<Order | null> {
  const db = supabase();
  if (!db) return loadMyOrders().find((o) => o.id.toUpperCase() === id.trim().toUpperCase()) ?? null;
  const { data, error } = await db.rpc("track_order", { p_id: id.trim(), p_phone: phone.trim() });
  if (error) throw error;
  return (data as Order) ?? null;
}
