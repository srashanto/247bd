import type { Metadata } from "next";
import { STORE } from "@/lib/store";

export const metadata: Metadata = { title: "Delivery, payment & returns | 247BD" };

const sections = [
  {
    id: "delivery",
    title: "Delivery",
    body: [
      `Inside Dhaka: ৳${STORE.deliveryInsideDhaka}, usually in 1–2 days.`,
      `Outside Dhaka: ৳${STORE.deliveryOutsideDhaka}, usually in 2–4 days.`,
      `Orders over ৳${STORE.freeDeliveryOver.toLocaleString("en-IN")} ship free anywhere in Bangladesh.`,
      "After you place an order, confirm it on WhatsApp and we pack it the same day.",
    ],
  },
  {
    id: "payment",
    title: "Payment",
    body: [
      "Cash on delivery: pay the delivery person when your parcel arrives.",
      `bKash or Nagad: use Send Money to ${STORE.paymentNumber}, then enter the transaction ID (TrxID) at checkout.`,
      "Check your parcel in front of the delivery person before paying.",
    ],
  },
  {
    id: "returns",
    title: "Returns",
    body: [
      "You can return unopened, unused products within 7 days of delivery.",
      "If a product arrives damaged or wrong, message us on WhatsApp with a photo within 48 hours and we'll replace it.",
      "For hygiene reasons, opened skincare, hair care and fragrance can't be returned unless faulty.",
    ],
  },
  {
    id: "original",
    title: "Product quality",
    body: [
      "Every product is checked for seal, batch number and expiry date before it ships.",
      "Patch test new skincare on your inner arm for 24 hours before using it on your face.",
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Delivery, payment and returns</h1>
      <p className="mt-2 text-[17px] text-muted">
        Still have a question? Call {STORE.phone} or{" "}
        <a href={`https://wa.me/${STORE.whatsapp}`} className="font-semibold text-ink underline underline-offset-4">message us on WhatsApp</a>.
      </p>
      <div className="mt-10 space-y-10">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-32">
            <h2 className="text-2xl font-bold">{s.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[17px] leading-relaxed marker:text-gold">
              {s.body.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
