import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "247BD | Men's Grooming & Hair Styling Products in Bangladesh",
    template: "%s | 247BD",
  },
  description:
    "Buy men's grooming products in Bangladesh: hair clay, pomade, sea salt spray, shampoo, curl cream and skin care from PRIDE by PahelaPride. Cash on delivery all over Bangladesh.",
  keywords: [
    "men's grooming Bangladesh", "hair styling products Bangladesh", "hair clay price in Bangladesh", "pomade BD",
    "sea salt spray Bangladesh", "hair care for men BD", "curly hair products Bangladesh", "men's skin care Bangladesh",
    "PahelaPride", "PRIDE grooming", "247BD",
  ],
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_BD",
    url: "/",
    title: "247BD | Men's Grooming & Hair Styling Products in Bangladesh",
    description: "Hair clay, pomade, sea salt spray, curl care and skin care for men. Cash on delivery all over Bangladesh.",
    images: [{ url: "https://pahelapride.com/wp-content/uploads/2026/07/IMG_4461-1024x1024.jpg", width: 1024, height: 1024, alt: "PRIDE hair styling set" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  category: "shopping",
};

export const viewport: Viewport = { themeColor: "#0a0a0a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-BD">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,400..800&family=Inter:wght@400;500;600;700&family=Hind+Siliguri:wght@400;500;600&display=swap"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
