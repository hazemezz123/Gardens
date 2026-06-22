import { useState } from "react";
import { ArrowRight, ChevronRight, Leaf, BookOpen, Truck, Sprout, Mail, Check, Clock, Package, Recycle, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useProducts } from "../../hooks/useProducts";
import { useArticles } from "../../hooks/useArticles";
import { useCart } from "../../hooks/useCart";
import { ProductCard } from "../shared/ProductCard";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export function HomePage() {
  const navigate = useNavigate();
  const nav = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: articles = [] } = useArticles();
  const { addItem } = useCart();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <main>
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 8, ease: "easeOut" }} className="absolute inset-0">
          <div className="absolute inset-0 bg-foreground/40 z-10" />
          <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&h=900&fit=crop&auto=format" alt="Hands tending a garden" className="w-full h-full object-cover" />
        </motion.div>
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 text-sm px-4 py-1.5 rounded-full mb-6 mx-auto">
              <Leaf size={13} /> Over 50,000 happy growers
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Grow Your Garden<br />
              <em className="text-emerald-300 not-italic">With Confidence</em>
            </h1>
            <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-xl mx-auto">
              Everything a beginner needs to start growing — curated seed kits, expert guides, and sustainable tools delivered to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => nav("/products")} className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-base hover:bg-primary/90 transition-colors">
                Shop Gardening Boxes <ArrowRight size={17} />
              </button>
              <button onClick={() => nav("/tips")} className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-xl font-medium text-base hover:bg-white/20 transition-colors">
                Explore Tips
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-center gap-8">
          {[{ Icon: Sprout, text: "Organic Seeds" }, { Icon: Package, text: "Free Delivery over £45" }, { Icon: Recycle, text: "Compostable Packaging" }, { Icon: Star, text: "4.8/5 from 12,000 reviews" }].map(({ Icon, text }) => (
            <motion.div key={text} variants={fadeUp} className="flex items-center gap-2 text-sm font-medium text-foreground/70">
              <Icon size={16} className="text-accent" /><span>{text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">Our Favourites</p>
            <h2 className="text-4xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Featured Products</h2>
          </div>
          <button onClick={() => nav("/products")} className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            View All <ChevronRight size={15} />
          </button>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-5 w-16 bg-muted rounded" />
                  </div>
                </motion.div>
              ))
            : products.slice(0, 4).map(p => (
            <motion.div key={p.id} variants={fadeUp}><ProductCard product={p} onViewDetails={() => nav("/product-detail")} onAddToCart={() => addItem(p.id)} /></motion.div>
          ))}
        </motion.div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">The Gardens Promise</p>
            <h2 className="text-4xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Why Gardeners Choose Us</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { Icon: Sprout, title: "Beginner Friendly", desc: "Every kit comes with illustrated step-by-step planting guides written for first-timers." },
              { Icon: Leaf, title: "Sustainable Products", desc: "Organic, open-pollinated seeds. Compostable packaging. Carbon-neutral deliveries." },
              { Icon: BookOpen, title: "Expert Guidance", desc: "Our horticultural team is available 7 days a week to answer any growing question." },
              { Icon: Truck, title: "Fast Delivery", desc: "Next-day dispatch on orders before 2 pm. Free standard delivery on orders over £45." },
            ].map(({ Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} whileHover={{ y: -4 }} className="bg-card rounded-2xl p-7 border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">Learn &amp; Grow</p>
            <h2 className="text-4xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Gardening Tips</h2>
          </div>
          <button onClick={() => nav("/tips")} className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            All Articles <ChevronRight size={15} />
          </button>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.slice(0, 3).map(a => (
            <motion.article key={a.id} variants={fadeUp} whileHover={{ y: -6 }} onClick={() => nav("/tips")} className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2.5 py-0.5 rounded-full">{a.category}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={11} /> {a.readTime}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{a.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="py-20 bg-primary">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail size={24} className="text-white" />
          </motion.div>
          <h2 className="text-4xl font-semibold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Seasonal Tips in Your Inbox</h2>
          <p className="text-white/70 mb-8">Join 24,000 gardeners who get our fortnightly planting guides, exclusive offers, and seasonal inspiration.</p>
          {subscribed ? (
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-xl">
              <Check size={16} /> You're in! Check your inbox.
            </motion.div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); toast.success("Subscribed! Check your inbox."); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" required placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 px-5 py-3.5 rounded-xl outline-none focus:border-white/50 transition-colors" />
              <button type="submit" className="bg-white text-primary font-semibold px-7 py-3.5 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap">Subscribe</button>
            </form>
          )}
        </div>
      </motion.section>
    </main>
  );
}
