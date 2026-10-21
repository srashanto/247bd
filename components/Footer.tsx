import Link from "next/link";
import { categories } from "@/lib/products";
import { STORE } from "@/lib/store";

export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-900 text-brand-100">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-1">
            <span className="rounded-lg bg-brand-500 px-2 py-1 text-lg font-black text-white">247</span>
            <span className="text-xl font-black text-white">BD</span>
          </div>
          <p className="mt-3 text-sm text-brand-100/80">{STORE.tagline}.</p>
        </div>
        <div>
          <h3 className="font-semibold text-white">Categories</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products/?category=${c.slug}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white">Help</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/cart/" className="hover:text-white">Cart</Link></li>
            <li><Link href="/orders/" className="hover:text-white">My orders</Link></li>
            <li>Delivery inside Dhaka: ৳{STORE.deliveryInsideDhaka}</li>
            <li>Delivery outside Dhaka: ৳{STORE.deliveryOutsideDhaka}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>📞 {STORE.phone}</li>
            <li>✉️ {STORE.email}</li>
            <li>📍 {STORE.address}</li>
            <li className="pt-2">We accept: Cash on Delivery · bKash · Nagad</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-brand-100/70">
        © {new Date().getFullYear()} {STORE.name}. All rights reserved.
      </div>
    </footer>
  );
}
