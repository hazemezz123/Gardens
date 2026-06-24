import { useState } from "react";
import { Search, ChevronRight, ArrowRight, Package, Leaf, Recycle, Sprout } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";
import { ProductCard } from "../shared/ProductCard";

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

export function BoxesPage() {
  const navigate = useNavigate();
  const nav = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const [search, setSearch] = useState("");
  const { data: products = [], isLoading } = useProducts({ category: "Boxes", search: search || undefined });
  const { addItem } = useCart();

  return (
    <main>
      <section className="relative min-h-72 lg:h-96 flex items-center overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: "easeOut" }} className="absolute inset-0">
          <div className="absolute inset-0 bg-foreground/45 z-10" />
          <img src="https://images.unsplash.com/photo-1558904541-efa843a19901?w=1600&h=600&fit=crop&auto=format" alt="Gardening boxes" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <p className="text-sm font-medium text-emerald-300 uppercase tracking-widest mb-3">Curated for You</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Gardening Boxes</h1>
          <p className="text-white/75 mt-4 max-w-xl mx-auto">Beautifully packaged starter kits with everything you need to grow — seeds, compost, tools, and illustrated guides.</p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button onClick={() => nav("/")} className="hover:text-foreground transition-colors">Home</button>
          <ChevronRight size={14} />
          <span className="text-foreground">Boxes</span>
        </nav>

        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Our Boxes</h2>
          <div className="relative w-full max-w-xs hidden sm:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search boxes…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50 transition-colors" />
          </div>
        </div>

        <div className="sm:hidden relative mb-5">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search boxes…" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/50 transition-colors" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-16 bg-muted rounded-full" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-5 w-16 bg-muted rounded" />
                </div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Package size={48} className="text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>No boxes yet</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">We're preparing new gardening boxes. Browse all products to find what you need.</p>
              <button onClick={() => nav("/products")} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
                Browse All Products <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <motion.div key={search} variants={stagger} initial="hidden" animate="show" className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map(p => (
                <motion.div key={p.id} variants={fadeUp}>
                  <ProductCard product={p} onViewDetails={() => nav("/product-detail?id=" + p.id)} onAddToCart={() => addItem(p.id)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
          {[
            { Icon: Package, title: "Everything Included", desc: "Seeds, compost, canes, labels, and a full-colour growing guide in every box." },
            { Icon: Leaf, title: "Organic & Sustainable", desc: "Certified organic seeds, peat-free compost, and fully compostable packaging." },
            { Icon: Recycle, title: "Carbon Neutral Delivery", desc: "All boxes are shipped carbon neutral through verified offset programmes." },
          ].map(({ Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
