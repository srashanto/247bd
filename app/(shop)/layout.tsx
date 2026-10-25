import { CatalogProvider } from "@/lib/catalog";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CatalogProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileNav />
          </div>
        </WishlistProvider>
      </CartProvider>
    </CatalogProvider>
  );
}
