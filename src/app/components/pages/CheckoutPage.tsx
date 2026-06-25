import { useState } from "react";
import { ChevronRight, CreditCard, Lock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart, count } = useCart();
  const { data: products = [] } = useProducts();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", postcode: "", card: "", expiry: "", cvc: "" });

  const cartItems = items.map(ci => {
    const p = products.find(pp => pp.id === ci.productId);
    return { ...ci, product: p };
  }).filter(ci => ci.product);

  const total = cartItems.reduce((sum, ci) => sum + (ci.product?.price ?? 0) * ci.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    setSubmitted(true);
    toast.success("Order placed successfully!");
  };

  if (submitted) {
    return (
      <main id="main-content" className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-semibold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">Thank you for your order. You'll receive a confirmation email shortly.</p>
        <p className="text-sm text-muted-foreground mb-8">Order #GD-{(Math.random() * 10000).toFixed(0).padStart(4, "0")}</p>
        <button onClick={() => navigate("/")} className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
          Back to Home
        </button>
      </main>
    );
  }

  if (cartItems.length === 0 && !submitted) {
    navigate("/cart");
    return null;
  }

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <button onClick={() => navigate("/")} className="hover:text-foreground transition-colors">Home</button>
        <ChevronRight size={14} />
        <button onClick={() => navigate("/cart")} className="hover:text-foreground transition-colors">Cart</button>
        <ChevronRight size={14} />
        <span className="text-foreground">Checkout</span>
      </nav>

      <h1 className="text-3xl font-semibold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Checkout</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Shipping Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Sophie Lane" className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="sophie@example.com" className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-foreground block mb-1.5">Address</label>
                <input required value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="12 Bloom Lane" className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">City</label>
                <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="London" className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Postcode</label>
                <input required value={form.postcode} onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))} placeholder="EC1A 2BB" className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard size={18} className="text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Payment</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Card Number</label>
                <input required value={form.card} onChange={e => setForm(f => ({ ...f, card: e.target.value }))} placeholder="4242 4242 4242 4242" maxLength={19} className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Expiry</label>
                  <input required value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} placeholder="MM/YY" maxLength={5} className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">CVC</label>
                  <input required value={form.cvc} onChange={e => setForm(f => ({ ...f, cvc: e.target.value }))} placeholder="123" maxLength={4} className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                <Lock size={12} /> Your payment info is processed securely. This is a demo — no real charges.
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-96">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
            <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Order Summary</h3>
            <div className="space-y-3 mb-5">
              {cartItems.map(ci => (
                <div key={ci.productId} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                    <img src={ci.product!.image} alt={ci.product!.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{ci.product!.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {ci.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-foreground">£{(ci.product!.price * ci.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2.5 text-sm border-t border-border pt-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">£{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="border-t border-border pt-2.5 flex justify-between font-semibold text-foreground text-base">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
            <button type="submit" className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold text-sm mt-6 hover:bg-primary/90 transition-colors">
              Place Order — £{total.toFixed(2)}
            </button>
            <p className="text-center text-xs text-muted-foreground mt-3 flex items-center justify-center gap-1.5">
              <Lock size={11} /> Secure checkout — demo only
            </p>
          </div>
        </div>
      </form>
    </main>
  );
}
