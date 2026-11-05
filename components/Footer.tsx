"use client";

import Link from "next/link";
import { useCatalog } from "@/lib/catalog";
import { categories } from "@/lib/products";
import { categoryHref } from "@/lib/seo";
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
    <footer className="pp-footer">
      <div className="pp-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <Link href="/" aria-label="247BD home"><Logo light /></Link>
          <p className="mt-4 max-w-xs text-[15px] font-medium leading-relaxed">Imported hair styling, hair care, skincare &amp; perfume, delivered all over Bangladesh.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="pp-social">
                <Icon />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3>Customer care</h3>
          <ul className="mt-4 space-y-2.5 text-[15px] font-medium">
            <li><Link href="/help/">Shipping details</Link></li>
            <li><Link href="/help/#payment">Payment</Link></li>
            <li><Link href="/help/#returns">Refund and returns</Link></li>
            <li><Link href="/help/#terms">Terms &amp; conditions</Link></li>
          </ul>
        </div>
        <div>
          <h3>Quick links</h3>
          <ul className="mt-4 space-y-2.5 text-[15px] font-medium">
            <li><Link href="/products/">All products</Link></li>
            {categories.map((c) => (
              <li key={c.slug}><Link href={categoryHref(c.slug)}>{c.name}</Link></li>
            ))}
            <li><Link href="/orders/">Track your order</Link></li>
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul className="mt-4 space-y-3 text-[15px] font-medium">
            <li><a href={`tel:${s.phone}`} className="flex items-center gap-2.5"><PhoneIcon className="h-4.5 w-4.5" />{s.phone}</a></li>
            <li><a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5"><WhatsappIcon className="h-4.5 w-4.5" />WhatsApp</a></li>
            <li><a href={`mailto:${s.email}`} className="flex items-center gap-2.5 break-all"><MailIcon className="h-4.5 w-4.5 shrink-0" />{s.email}</a></li>
            <li className="flex items-center gap-2.5"><PinIcon className="h-4.5 w-4.5" />{s.address}</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Cash on Delivery", "bKash", "Nagad"].map((m) => <span key={m} className="pp-chip">{m}</span>)}
          </div>
        </div>
      </div>
      <div className="pp-container" aria-hidden><div className="pp-footer__word">247BD</div></div>
      <div className="pp-container flex flex-wrap justify-between gap-2 py-5 text-sm font-medium">
        <span>© {new Date().getFullYear()} PahelaPride. All rights reserved.</span>
        <Link href="/help/#terms">Privacy &amp; terms</Link>
      </div>
    </footer>
  );
}
