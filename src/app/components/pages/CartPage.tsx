import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useCart } from "../../hooks/useCart";
import { useProducts } from "../../hooks/useProducts";

export function CartPage() {
  const navigate = useNavigate();
  const nav = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const { items, updateQty, removeItem, clearCart, count } = useCart();
  const { data: products = [] } = useProducts();

  const cartItems = items.map(ci => {
    const p = products.find(pp => pp.id === ci.productId);
    return { ...ci, product: p };
  }).filter(ci => ci.product);

  const total = cartItems.reduce((sum, ci) => sum + (ci.product?.price ?? 0) * ci.quantity, 0);

  return (
    <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <button onClick={() => nav("/")} className="hover:text-foreground transition-colors">Home</button>
        <ChevronRight size={14} />
        <span className="text-foreground">Cart</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Shopping Cart</h1>
          <p className="text-sm text-muted-foreground mt-1">{count} {count === 1 ? "item" : "items"}</p>
        </div>
        {cartItems.length > 0 && (
          <button onClick={() => { clearCart(); toast.success("Cart cleared"); }} className="text-sm text-muted-foreground hover:text-foreground underline transition-colors">
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={28} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet.</p>
          <button onClick={() => nav("/products")} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
            Start Shopping <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 space-y-4">
            {cartItems.map(ci => (
              <div key={ci.productId} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-card border border-border rounded-2xl p-3 sm:p-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-muted overflow-hidden shrink-0">
                    <img src={ci.product!.image} alt={ci.product!.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>{ci.product!.name}</h3>
                    <p className="text-sm font-semibold text-foreground mt-1">£{ci.product!.price.toFixed(2)}</p>
                  </div>
                  <button onClick={() => { removeItem(ci.productId); toast.success("Removed from cart"); }} className="sm:hidden p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-4">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateQty(ci.productId, ci.quantity - 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                      <Minus size={13} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">{ci.quantity}</span>
                    <button onClick={() => updateQty(ci.productId, ci.quantity + 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
                      <Plus size={13} />
                    </button>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <p className="font-semibold text-foreground">£{(ci.product!.price * ci.quantity).toFixed(2)}</p>
                  </div>
                  <button onClick={() => { removeItem(ci.productId); toast.success("Removed from cart"); }} className="hidden sm:flex p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-80">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Order Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">£{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="border-t border-border pt-2.5 flex justify-between font-semibold text-foreground">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => nav("/checkout")} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm mt-6 hover:bg-primary/90 transition-colors">
                Proceed to Checkout
              </button>
              <button onClick={() => nav("/products")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-3 transition-colors">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
