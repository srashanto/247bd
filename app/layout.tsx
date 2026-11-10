import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "247BD | Football Boots, Balls & Kit in Bangladesh",
    template: "%s | 247BD",
  },
  description:
    "Football store in Bangladesh: football boots, footballs, jerseys, socks, shin guards and goalkeeper gloves. Pick your colour and size. Cash on delivery all over Bangladesh.",
  keywords: [
    "football boots Bangladesh", "football shop Bangladesh", "football boots price in BD", "studs boots Bangladesh",
    "football gear BD", "sports shop Bangladesh", "247BD",
  ],
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_BD",
    url: "/",
    title: "247BD | Football Boots, Balls & Kit in Bangladesh",
    description: "Football boots, balls and kit. Pick your colour and size. Cash on delivery all over Bangladesh.",
    images: [{ url: "https://247bd.net/products/white-red-hero.jpg", width: 1000, height: 1000, alt: "Meike long stud football boots" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  category: "shopping",
};

export const viewport: Viewport = { themeColor: "#08120d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-BD">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,700;1,700;1,800&family=Barlow:wght@400;500;600;700&family=Hind+Siliguri:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
