import { useState, useEffect, useRef, useCallback } from "react";
import { ShoppingCart, Search, Menu, X, ChevronDown, LogOut, Package, LayoutDashboard } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

const linkClass = (path: string, isActive: boolean) =>
  `relative px-3 py-2 text-sm font-medium transition-colors duration-200
    after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2
    after:h-0.5 after:w-4/5 after:rounded-full after:bg-primary
    after:scale-x-0 after:opacity-0 after:transition-all after:duration-300
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-sm
    ${isActive ? "text-primary font-semibold after:scale-x-100 after:opacity-100" : "text-muted-foreground hover:text-foreground"}`;

const dropdownItemClass = (isActive: boolean) =>
  `w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
    ${isActive ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { count } = useCart();

  const exploreRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.profile?.role === "admin";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!exploreOpen && !accountOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) setExploreOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [exploreOpen, accountOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setExploreOpen(false);
    setAccountOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  const nav = useCallback((path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  const isActive = (path: string) => location.pathname === path;

  const mainLinks = [
    { label: "Home", path: "/" },
    { label: "Boxes", path: "/boxes" },
    { label: "Activities", path: "/activities" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const exploreLinks = [
    { label: "Products", path: "/products" },
    { label: "Tips", path: "/tips" },
  ];

  const isExploreActive = exploreLinks.some(l => isActive(l.path));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (setter: (v: boolean) => void) => (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setter(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-shadow duration-300 ${scrolled ? "shadow-[0_1px_6px_rgba(0,0,0,0.06)]" : "shadow-none"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20 lg:h-24">
        <button onClick={() => nav("/")} className="flex items-center gap-2 shrink-0" aria-label="Go to homepage">
          <img src="/Gardens-logo.png" alt="Gardens" className="h-16 w-auto lg:h-20" />
        </button>

        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {mainLinks.map(l => (
            <button
              key={l.path}
              onClick={() => nav(l.path)}
              className={linkClass(l.path, isActive(l.path))}
              aria-current={isActive(l.path) ? "page" : undefined}
            >
              {l.label}
            </button>
          ))}

          <div ref={exploreRef} className="relative">
            <button
              onClick={() => setExploreOpen(!exploreOpen)}
              onMouseEnter={() => setExploreOpen(true)}
              className={`${linkClass("/explore", isExploreActive)} inline-flex items-center gap-1`}
              aria-expanded={exploreOpen}
              aria-haspopup="true"
              aria-label="Explore subpages"
            >
              Explore <ChevronDown size={14} className={`transition-transform duration-200 ${exploreOpen ? "rotate-180" : ""}`} />
            </button>
            {exploreOpen && (
              <div
                onMouseLeave={() => setExploreOpen(false)}
                className="absolute top-full left-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                role="menu"
                onKeyDown={handleKeyDown(setExploreOpen)}
              >
                {exploreLinks.map(l => (
                  <button
                    key={l.path}
                    onClick={() => { nav(l.path); setExploreOpen(false); }}
                    className={dropdownItemClass(isActive(l.path))}
                    role="menuitem"
                    aria-current={isActive(l.path) ? "page" : undefined}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-1.5 lg:gap-2">
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            {searchOpen ? (
              <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden transition-all duration-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products, boxes, articles…"
                  className="w-52 lg:w-64 px-3 py-1.5 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60"
                  onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
                  aria-label="Search"
                />
                <button type="submit" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" aria-label="Submit search">
                  <Search size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Open search"
              >
                <Search size={18} />
              </button>
            )}
          </form>

          <button
            onClick={() => navigate("/cart")}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label={`Shopping cart with ${count} item${count !== 1 ? "s" : ""}`}
          >
            <ShoppingCart size={18} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-sm">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>

          <div ref={accountRef} className="relative hidden md:block">
            {user ? (
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className={`p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground ${accountOpen ? "bg-muted" : ""}`}
                aria-expanded={accountOpen}
                aria-haspopup="true"
                aria-label="Account menu"
              >
                <ChevronDown size={18} className={`transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`} />
              </button>
            ) : null}
            {accountOpen && user && (
              <div
                className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                role="menu"
                onKeyDown={handleKeyDown(setAccountOpen)}
              >
                {isAdmin && (
                  <button
                    onClick={() => { nav("/admin"); setAccountOpen(false); }}
                    className={dropdownItemClass(isActive("/admin"))}
                    role="menuitem"
                    aria-current={isActive("/admin") ? "page" : undefined}
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </button>
                )}
                <button
                  onClick={() => { nav("/orders"); setAccountOpen(false); }}
                  className={dropdownItemClass(isActive("/orders"))}
                  role="menuitem"
                  aria-current={isActive("/orders") ? "page" : undefined}
                >
                  <Package size={16} />
                  Orders
                </button>
                <div className="border-t border-border my-1.5 mx-2" />
                <div className="px-3 py-1.5 text-xs text-muted-foreground truncate">
                  {user.profile?.name || user.email}
                </div>
                <button
                  onClick={() => { signOut(); setAccountOpen(false); }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  role="menuitem"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background max-h-[calc(100dvh-5rem)] overflow-y-auto" onKeyDown={e => e.key === "Escape" && setMobileOpen(false)}>
          <div className="px-4 py-3">
            <form onSubmit={handleMobileSearch}>
              <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden">
                <Search size={16} className="ml-3 shrink-0 text-muted-foreground" />
                <input
                  ref={mobileSearchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products, boxes, articles…"
                  className="w-full px-2 py-2.5 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/60"
                  aria-label="Search"
                />
                {searchQuery && (
                  <button type="button" onClick={() => setSearchQuery("")} className="p-2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
                    <X size={16} />
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="px-4 pb-2 space-y-0.5">
            {mainLinks.map(l => (
              <button
                key={l.path}
                onClick={() => { nav(l.path); setMobileOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${isActive(l.path) ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`}
                aria-current={isActive(l.path) ? "page" : undefined}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="px-4 pb-2">
            <div className="border-t border-border pt-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Explore</div>
              {exploreLinks.map(l => (
                <button
                  key={l.path}
                  onClick={() => { nav(l.path); setMobileOpen(false); }}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${isActive(l.path) ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`}
                  aria-current={isActive(l.path) ? "page" : undefined}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {user && (
            <div className="px-4 pb-4">
              <div className="border-t border-border pt-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</div>
                {isAdmin && (
                  <button
                    onClick={() => { nav("/admin"); setMobileOpen(false); }}
                    className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${isActive("/admin") ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`}
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={() => { nav("/orders"); setMobileOpen(false); }}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${isActive("/orders") ? "bg-secondary text-primary" : "text-foreground hover:bg-muted"}`}
                >
                  Orders
                </button>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors min-h-[44px]"
                >
                  Sign Out ({user.profile?.name || user.email})
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
