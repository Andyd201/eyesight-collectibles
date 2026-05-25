import "./globals.css";
import Navbar     from "@/components/layout/Navbar";
import Footer     from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: {
    default: "Eyesight Collectibles — Pokémon Cards, Sealed Products & Graded Cards",
    template: "%s | Eyesight Collectibles",
  },
  description:
    "Shop Pokémon TCG singles, sealed booster boxes, ETBs, graded cards (PSA/CGC), and accessories. Specializing in Japanese and Korean sets.",
  keywords: ["pokemon cards", "pokemon tcg", "pokemon singles", "booster box", "graded cards", "PSA", "korean pokemon"],
  openGraph: { siteName: "Eyesight Collectibles", type: "website" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="noise">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
