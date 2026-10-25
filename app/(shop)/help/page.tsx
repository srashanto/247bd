"use client";

import { useCatalog } from "@/lib/catalog";

export default function HelpPage() {
  const { settings: s } = useCatalog();
  const sections = [
    {
      id: "delivery",
      title: "Delivery",
      body: [
        `Inside Dhaka: ৳${s.deliveryInsideDhaka}, usually in 1–2 days.`,
        `Outside Dhaka: ৳${s.deliveryOutsideDhaka}, usually in 2–4 days.`,
        ...(s.freeDeliveryOver > 0 ? [`Orders over ৳${s.freeDeliveryOver.toLocaleString("en-IN")} ship free anywhere in Bangladesh.`] : []),
        "We call or message you to confirm every order before it ships.",
      ],
    },
    {
      id: "payment",
      title: "Payment",
      body: [
        ...(s.advancePayment
          ? [
              "To confirm an order, pay the delivery charge in advance by bKash, Nagad or Rocket (Send Money), then enter the Transaction ID at checkout.",
              `bKash: ${s.paymentNumbers.bkash} · Nagad: ${s.paymentNumbers.nagad} · Rocket: ${s.paymentNumbers.rocket} (Personal)`,
              "Pay the rest in cash when your parcel arrives.",
            ]
          : ["Cash on delivery: pay the delivery person when your parcel arrives."]),
        "Check your parcel in front of the delivery person before paying.",
      ],
    },
    {
      id: "returns",
      title: "Returns",
      body: [
        "You can return unopened, unused products within 7 days of delivery.",
        "If a product arrives damaged or wrong, message us on WhatsApp with a photo within 48 hours and we'll replace it.",
        "For hygiene reasons, opened hair care and skin care can't be returned unless faulty.",
      ],
    },
    {
      id: "terms",
      title: "Terms and conditions",
      body: [
        "Prices and offers can change without notice. The price at checkout is the price you pay.",
        "Free gifts are given with eligible products while stock lasts.",
        "Coupon codes can't be combined, and one coupon applies per order.",
        "Patch test new skin care on your inner arm for 24 hours before using it on your face.",
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold sm:text-4xl">Delivery, payment and returns</h1>
      <p className="mt-2 text-[17px] text-muted">
        Still have a question? Call {s.phone} or{" "}
        <a href={`https://wa.me/${s.whatsapp}`} className="font-semibold text-ink underline underline-offset-4">message us on WhatsApp</a>.
      </p>
      <div className="mt-10 space-y-10">
        {sections.map((sec) => (
          <section key={sec.id} id={sec.id} className="scroll-mt-32">
            <h2 className="text-2xl font-semibold">{sec.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[17px] leading-relaxed marker:text-gold">
              {sec.body.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
