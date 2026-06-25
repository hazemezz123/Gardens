import { useAuth } from "../../hooks/useAuth";
import { useOrders } from "../../hooks/useOrders";
import { useNavigate } from "react-router";
import { ChevronRight, Package } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  dispatched: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-100 text-emerald-700",
};

export function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: orders = [] } = useOrders(user?.id);

  return (
    <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <button onClick={() => navigate("/")} className="hover:text-foreground">Home</button>
        <ChevronRight size={14} />
        <span className="text-foreground">My Orders</span>
      </nav>

      <h1 className="text-3xl font-semibold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No orders yet</p>
          <button onClick={() => navigate("/products")} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono text-muted-foreground">#{o.id}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[o.status] || "bg-gray-100 text-gray-600"}`}>{o.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">£{Number(o.total).toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
