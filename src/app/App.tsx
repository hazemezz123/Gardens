import { Routes, Route } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { MobileNav } from "./components/layout/MobileNav";
import { HomePage } from "./components/pages/HomePage";
import { AboutPage } from "./components/pages/AboutPage";
import { ProductsPage } from "./components/pages/ProductsPage";
import { ProductDetailPage } from "./components/pages/ProductDetailPage";
import { TipsPage } from "./components/pages/TipsPage";
import { ContactPage } from "./components/pages/ContactPage";
import { AdminDashboard } from "./components/pages/AdminDashboard";
import { CartPage } from "./components/pages/CartPage";
import { CheckoutPage } from "./components/pages/CheckoutPage";
import { AuthGuard } from "./components/shared/AuthGuard";
import { OrdersPage } from "./components/pages/OrdersPage";
import { BoxesPage } from "./components/pages/BoxesPage";

export default function App() {
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/boxes" element={<BoxesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product-detail" element={<ProductDetailPage />} />
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
      </Routes>

      <Footer />
      <div className="h-16 md:hidden" />
      <MobileNav />
      <Toaster />
    </div>
  );
}
