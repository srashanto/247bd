"use client";

import Link from "next/link";
import { useCatalog } from "@/lib/catalog";
import { categories } from "@/lib/products";
import { Logo } from "./Header";
import { FacebookIcon, GroupIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsappIcon, YoutubeIcon } from "./Icons";

export default function Footer() {
  const { settings: s } = useCatalog();
  const socials = [
    { href: s.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: s.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: s.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: s.whatsapp ? `https://wa.me/${s.whatsapp}` : "", label: "WhatsApp", Icon: WhatsappIcon },
    { href: s.community, label: "Community — Facebook group", Icon: GroupIcon },
  ].filter((x) => x.href);

  return (
    <footer className="mt-24 overflow-hidden border-t border-line bg-[#060606] text-ink/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed">{s.tagline}.</p>
          <p className="mt-3 text-sm text-muted">A grooming brand of PahelaPride.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="grid h-10 w-10 place-items-center border border-line text-ink/85 hover:border-gold hover:text-gold-2"
              >
                <Icon />
              </a>
            ))}
          </div>
          {s.community && (
            <a href={s.community} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-[14px] text-gold hover:text-gold-2">
              <GroupIcon className="h-4 w-4" /> Join our community on Facebook
            </a>
          )}
        </div>
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gold">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link href="/products/" className="hover:text-ink">All products</Link></li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products/?category=${c.slug}`} className="hover:text-ink">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gold">Customer care</h3>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link href="/orders/" className="hover:text-ink">Track your order</Link></li>
            <li><Link href="/help/" className="hover:text-ink">Shipping details</Link></li>
            <li><Link href="/help/#payment" className="hover:text-ink">Payment</Link></li>
            <li><Link href="/help/#returns" className="hover:text-ink">Refund and returns</Link></li>
            <li><Link href="/help/#terms" className="hover:text-ink">Terms &amp; conditions</Link></li>
            <li><Link href="/wishlist/" className="hover:text-ink">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gold">Contact</h3>
          <ul className="mt-4 space-y-3 text-[15px]">
            <li>
              <a href={`tel:${s.phone}`} className="flex items-center gap-2.5 hover:text-ink"><PhoneIcon className="h-4.5 w-4.5 text-gold" />{s.phone}</a>
            </li>
            <li>
              <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-ink">
                <WhatsappIcon className="h-4.5 w-4.5 text-gold" />WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${s.email}`} className="flex items-center gap-2.5 break-all hover:text-ink"><MailIcon className="h-4.5 w-4.5 shrink-0 text-gold" />{s.email}</a>
            </li>
            <li className="flex items-center gap-2.5"><PinIcon className="h-4.5 w-4.5 text-gold" />{s.address}</li>
          </ul>
          <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Cash on delivery · bKash · Nagad · Rocket</p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4" aria-hidden>
        <div className="select-none font-display text-[27vw] font-extrabold leading-[0.78] tracking-[-0.02em] text-ink/[0.05] [font-stretch:125%] lg:text-[21rem]">
          247BD
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-sm text-muted">
        © {new Date().getFullYear()} {s.storeName} · PahelaPride. All rights reserved.
      </div>
    </footer>
  );
}
