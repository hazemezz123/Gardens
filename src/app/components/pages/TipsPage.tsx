import { useState } from "react";
import { Search, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useArticles } from "../../hooks/useArticles";

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export function TipsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selCat, setSelCat] = useState("All");
  const tipCats = ["All", "Plant Care", "Watering", "Indoor Gardening", "Pest Control", "Seasonal Guides"];

  const { data: articles = [] } = useArticles(selCat, search || undefined);
  const featured = articles.find(a => a.featured) || articles[0];
  const rest = articles.filter(a => a !== featured);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-12">
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">Learn &amp; Grow</p>
        <h1 className="text-5xl font-semibold text-foreground mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Gardening Tips</h1>
        <p className="text-muted-foreground max-w-md mx-auto">Expert guides written for beginners. No jargon, no assumptions — just practical advice that actually works.</p>
      </motion.div>

      <div className="relative max-w-md mx-auto mb-10">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles…"
          className="w-full pl-11 pr-5 py-3.5 rounded-xl border border-border bg-card outline-none focus:border-primary/50 transition-colors" />
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {tipCats.map(c => (
          <button key={c} onClick={() => setSelCat(c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selCat === c ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"}`}>
            {c}
          </button>
        ))}
      </div>

      {featured && (
        <motion.article initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="group cursor-pointer grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border bg-card mb-10 hover:shadow-xl transition-all duration-300">
          <div className="aspect-video lg:aspect-auto overflow-hidden bg-muted min-h-64">
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="p-8 lg:p-10 flex flex-col justify-center">
            <span className="inline-flex items-center text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full w-fit mb-4">{featured.category}</span>
            <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{featured.title}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{featured.excerpt}</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center"><Star size={10} className="text-primary" /></div>{featured.author}</span>
              <span className="flex items-center gap-1.5"><Clock size={13} />{featured.readTime} read</span>
              <span>{featured.date}</span>
            </div>
          </div>
        </motion.article>
      )}

      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map(a => (
          <motion.article key={a.id} variants={fadeUp} whileHover={{ y: -6 }} className="group cursor-pointer bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
            <div className="aspect-[16/10] overflow-hidden bg-muted">
              <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">{a.category}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={11} />{a.readTime}</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2 leading-snug group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{a.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                <span>{a.author}</span>
                <span>{a.date}</span>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </main>
  );
}
