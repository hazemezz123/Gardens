import {
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const nav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (location.pathname === "/admin") return null;

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/Gardens-logo.png"
                alt="Gardens"
                className="h-20 w-auto brightness-0 invert"
              />
              {/* <span className="text-lg font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>Gardens</span> */}
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              Helping beginners grow with confidence through curated kits,
              expert guides, and sustainable products.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 rounded-lg bg-background/10 hover:bg-background/20 transition-colors"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-background/80 uppercase tracking-wider">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {[
                "Vegetables",
                "Herbs",
                "Flowers",
                "Indoor Plants",
                "Gardening Tools",
                "Gift Sets",
              ].map((l) => (
                <li key={l}>
                  <button
                    onClick={() => nav("/products")}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-background/80 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                ["About Us", "/about"],
                ["Gardening Tips", "/tips"],
                ["Contact", "/contact"],
              ].map(([l, p]) => (
                <li key={l as string}>
                  <button
                    onClick={() => nav(p as string)}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {l as string}
                  </button>
                </li>
              ))}
              {["Sustainability", "Press", "Careers"].map((l) => (
                <li key={l}>
                  <span className="text-sm text-background/60">{l}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 text-background/80 uppercase tracking-wider">
              Get In Touch
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-2.5 text-sm text-background/60">
                <Mail size={15} className="mt-0.5 shrink-0" /> hello@gardens.co
              </li>
              <li className="flex gap-2.5 text-sm text-background/60">
                <Phone size={15} className="mt-0.5 shrink-0" /> +44 20 7946 0123
              </li>
              <li className="flex gap-2.5 text-sm text-background/60">
                <MapPin size={15} className="mt-0.5 shrink-0" /> 12 Bloom Lane,
                London, EC1A 2BB
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/40">
            © 2026 Gardens Ltd. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map(
              (l) => (
                <span
                  key={l}
                  className="text-xs text-background/40 cursor-pointer hover:text-background/60"
                >
                  {l}
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
