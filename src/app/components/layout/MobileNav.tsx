import { Leaf, Package, ShoppingCart, BookOpen, Mail } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const links = [
    { label: "Home", path: "/", Icon: Leaf },
    { label: "Shop", path: "/products", Icon: Package },
    { label: "Cart", path: "/cart", Icon: ShoppingCart },
    { label: "Tips", path: "/tips", Icon: BookOpen },
    { label: "Contact", path: "/contact", Icon: Mail },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-card/95 backdrop-blur-md border-t border-border z-40 flex">
      {links.map(({ label, path, Icon }) => (
        <button key={path} onClick={() => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors min-h-[44px] ${location.pathname === path ? "text-primary" : "text-muted-foreground"}`}>
          <Icon size={20} />
          <span className="text-[10px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
}
