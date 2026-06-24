import { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";
import { ProductCard } from "../shared/ProductCard";

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export function ProductsPage() {
  const navigate = useNavigate();
  const nav = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const [search, setSearch] = useState("");
  const [selCat, setSelCat] = useState("All");
  const [selDiff, setSelDiff] = useState("All");
  const [maxPrice, setMaxPrice] = useState(100);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const cats = ["All", "Plants", "Seeds", "Tools", "Pots", "Fertilizers"];
  const diffs = ["All", "Beginner", "Intermediate", "Advanced"];

  const { data: products = [], isLoading } = useProducts({
    category: selCat,
    difficulty: selDiff,
    maxPrice,
    search: search || undefined,
  });
  const { addItem } = useCart();
  const PER_PAGE = 8;
  const paginated = products.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(products.length / PER_PAGE);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <button onClick={() => nav("/")} className="hover:text-foreground transition-colors">Home</button>
          <ChevronRight size={14} />
          <span className="text-foreground">Products</span>
        </nav>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>All Products</h1>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" className="pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50 w-60 transition-colors" />
            </div>
            <button onClick={() => setFiltersOpen(!filtersOpen)} className="sm:hidden flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-xl text-sm font-medium">
              <Filter size={15} /> Filters
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className={`${filtersOpen ? "block" : "hidden"} sm:block w-full sm:w-56 shrink-0`}>
          <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
            <h3 className="font-semibold text-foreground mb-5 text-sm uppercase tracking-wider">Filters</h3>

            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Category</p>
              <div className="space-y-1">
                {cats.map(c => (
                  <button key={c} onClick={() => { setSelCat(c); setPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selCat === c ? "bg-primary text-primary-foreground font-medium" : "text-foreground hover:bg-muted"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Price Range</p>
              <input type="range" min={10} max={100} value={maxPrice} onChange={e => { setMaxPrice(+e.target.value); setPage(1); }} className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>£10</span><span className="font-medium text-foreground">up to £{maxPrice}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Difficulty</p>
              <div className="space-y-1">
                {diffs.map(d => (
                  <button key={d} onClick={() => { setSelDiff(d); setPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selDiff === d ? "bg-primary text-primary-foreground font-medium" : "text-foreground hover:bg-muted"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-muted-foreground">{products.length} products found</p>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-5 w-16 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No products match your filters.</div>
          ) : (
            <motion.div key={page} variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginated.map(p => (
                <motion.div key={p.id} variants={fadeUp}><ProductCard product={p} onViewDetails={() => nav("/product-detail?id=" + p.id)} onAddToCart={() => addItem(p.id)} /></motion.div>
              ))}
            </motion.div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors">
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === n ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
