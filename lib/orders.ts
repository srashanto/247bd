import { formatPrice } from "./products";
import { STORE } from "./store";

export type PaymentMethod = "cod" | "bkash" | "nagad";

export const paymentLabels: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  bkash: "bKash",
  nagad: "Nagad",
};

export type Order = {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    district: string;
    address: string;
    note: string;
  };
  payment: PaymentMethod;
  transactionId?: string;
  items: { slug: string; name: string; price: number; qty: number }[];
  subtotal: number;
  delivery: number;
  total: number;
};

const KEY = "247bd-orders";

export function loadOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  const all = [order, ...loadOrders()];
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {}
}

export function newOrderId() {
  const d = new Date();
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `247BD-${date}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function whatsappLink(order: Order) {
  const lines = [
    `New order from 247BD website`,
    `Order ID: ${order.id}`,
    ``,
    ...order.items.map((i) => `• ${i.name} x${i.qty} = ${formatPrice(i.price * i.qty)}`),
    ``,
    `Subtotal: ${formatPrice(order.subtotal)}`,
    `Delivery: ${formatPrice(order.delivery)}`,
    `Total: ${formatPrice(order.total)}`,
    `Payment: ${paymentLabels[order.payment]}${order.transactionId ? ` (TrxID: ${order.transactionId})` : ""}`,
    ``,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}, ${order.customer.district}`,
    order.customer.note ? `Note: ${order.customer.note}` : "",
  ].filter((l, i, arr) => !(l === "" && arr[i - 1] === ""));
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}
