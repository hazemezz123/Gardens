import { useState } from "react";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { count } = useCart();
  const links = [
    { label: "Home", path: "/" },
    { label: "Boxes", path: "/boxes" },
    { label: "Products", path: "/products" },
    { label: "About", path: "/about" },
    { label: "Tips", path: "/tips" },
    { label: "Contact", path: "/contact" },
  ];
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-24">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 group">
          <img src="/Gardens-logo.png" alt="Gardens" className="h-20 w-auto" />
          {/* <span className="font-display text-xl font-semibold text-foreground tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Gardens</span> */}
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <button key={l.path} onClick={() => { navigate(l.path); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.path ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              {l.label}
            </button>
          ))}
          <button onClick={() => navigate("/admin")} className="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Dashboard</button>
        </nav>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-muted transition-colors hidden md:flex"><Search size={18} className="text-muted-foreground" /></button>
          <button onClick={() => navigate("/cart")} className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <ShoppingCart size={18} className="text-muted-foreground" />
            {count > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">{count}</span>}
          </button>
          {user && (
            <div className="hidden md:flex items-center gap-1 ml-2">
              <button onClick={() => navigate("/orders")} className="px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">Orders</button>
              <button onClick={() => navigate("/admin")} className="px-3 py-2 rounded-lg hover:bg-muted transition-colors">
                <span className="text-xs font-medium text-muted-foreground">{user.profile?.name || user.email}</span>
              </button>
              <button onClick={signOut} className="text-xs text-muted-foreground hover:text-foreground">Sign Out</button>
            </div>
          )}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          {links.map(l => (
            <button key={l.path} onClick={() => { navigate(l.path); setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === l.path ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`}>
              {l.label}
            </button>
          ))}
          <button onClick={() => { navigate("/admin"); setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === "/admin" ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`}>
            Dashboard
          </button>
          {user && (
            <>
              <div className="border-t border-border my-2" />
              <button onClick={() => { navigate("/orders"); setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                My Orders
              </button>
              <button onClick={() => { signOut(); setOpen(false); }} className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                Sign Out ({user.profile?.name || user.email})
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
