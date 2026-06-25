import { Leaf, Gift, Sparkles, Package, ShoppingCart } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const links = [
    { label: "Home", path: "/", Icon: Leaf },
    { label: "Boxes", path: "/boxes", Icon: Gift },
    { label: "Activities", path: "/activities", Icon: Sparkles },
    { label: "Shop", path: "/products", Icon: Package },
    { label: "Cart", path: "/cart", Icon: ShoppingCart },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-card/95 backdrop-blur-md border-t border-border z-40 flex" aria-label="Mobile navigation">
      {links.map(({ label, path, Icon }) => (
        <button key={path} onClick={() => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors min-h-[44px] ${location.pathname === path ? "text-primary" : "text-muted-foreground"}`}
          aria-current={location.pathname === path ? "page" : undefined}>
          <Icon size={18} />
          <span className="text-[10px] font-medium leading-tight">{label}</span>
        </button>
      ))}
    </nav>
  );
}
