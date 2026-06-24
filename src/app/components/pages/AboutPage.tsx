import { ArrowRight, Leaf, Sprout, BookOpen, Shield, Heart, Award } from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useTeam } from "../../hooks/useTeam";

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const slideIn = (dir: "left" | "right") => ({
  hidden: { opacity: 0, x: dir === "left" ? -40 : 40 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5 } },
});

export function AboutPage() {
  const navigate = useNavigate();
  const nav = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const { data: team = [] } = useTeam();
  return (
    <main>
      <section className="relative min-h-64 lg:h-80 flex items-center overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 6, ease: "easeOut" }} className="absolute inset-0">
          <div className="absolute inset-0 bg-foreground/50 z-10" />
          <img src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=1600&h=500&fit=crop&auto=format" alt="Garden path through green foliage" className="w-full h-full object-cover" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <p className="text-sm font-medium text-emerald-300 uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-5xl font-semibold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Growing Together Since 2019</h1>
          <p className="text-white/75 mt-4 max-w-xl mx-auto">We started in a small London flat with a windowsill and a dream. Today we help thousands of beginners grow their first garden.</p>
        </motion.div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">Brand Journey</p>
          <h2 className="text-4xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Our Story</h2>
        </motion.div>
        <div className="relative">
          <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-border hidden md:block origin-top" />
          {[
            { year: "2019", title: "A Kitchen Windowsill", desc: "Sophie grows her first herb box in a Brixton flat. Frustrated by complicated guides and poor-quality seeds, she decides to do it better." },
            { year: "2020", title: "First 100 Customers", desc: "A simple Shopify store selling handpicked seed kits to friends. Word spreads. The compostable packaging wins attention online." },
            { year: "2022", title: "The Team Grows", desc: "Marcus joins to lead product curation. Amelia builds the education programme. A real warehouse replaces the spare bedroom." },
            { year: "2024", title: "Carbon Neutral Operations", desc: "Gardens achieves full carbon-neutral status. Every delivery is offset and the new warehouse runs on 100% renewable energy." },
            { year: "2026", title: "50,000 Growers", desc: "More than 50,000 customers have started their first garden with a Gardens kit. The mission continues." },
          ].map((item, i) => (
            <motion.div key={item.year} variants={slideIn(i % 2 === 0 ? "left" : "right")} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className={`relative flex md:items-center mb-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
              <div className="md:w-1/2 md:px-10">
                <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <span className="text-xs font-mono text-accent font-semibold tracking-widest">{item.year}</span>
                  <h3 className="font-semibold text-foreground mt-1 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex w-8 h-8 bg-primary rounded-full border-4 border-background items-center justify-center">
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, type: "spring" }} className="w-2 h-2 bg-white rounded-full" />
              </div>
              <div className="md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">What Drives Us</p>
            <h2 className="text-4xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Mission &amp; Values</h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { Icon: Leaf, title: "Sustainability First", desc: "Every purchasing decision is weighed against its environmental impact. We choose the harder, greener path every time." },
              { Icon: Sprout, title: "Accessibility", desc: "Gardening should not feel like a hobby reserved for experts with big gardens. We lower every barrier we find." },
              { Icon: BookOpen, title: "Education Over Selling", desc: "Our goal is to make you a confident gardener, not a repeat customer. A thriving garden is the best outcome." },
              { Icon: Shield, title: "Quality Guarantee", desc: "We test every product in real garden conditions before listing it. If it doesn't grow, we replace it. No questions." },
              { Icon: Heart, title: "Community", desc: "Gardening is better shared. Our growing community of members exchange tips, harvests, and encouragement." },
              { Icon: Award, title: "Certified Organic", desc: "100% of our seeds are certified organic, open-pollinated, and non-GMO. We list every certification on every product page." },
            ].map(({ Icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} whileHover={{ y: -4 }} className="bg-card rounded-2xl p-7 border border-border">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
          <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">The People</p>
          <h2 className="text-4xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Meet the Team</h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map(m => (
            <motion.div key={m.name} variants={fadeUp} whileHover={{ y: -6 }} className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
              <div className="aspect-square bg-muted overflow-hidden">
                <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{m.name}</h3>
                <p className="text-xs font-medium text-accent mt-0.5 mb-3">{m.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.bio}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="py-20 bg-primary">
        <div className="text-center max-w-xl mx-auto px-4">
          <h2 className="text-4xl font-semibold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Start Your Gardening Journey</h2>
          <p className="text-white/70 mb-8">Browse our full collection of beginner-friendly kits and find the perfect place to begin.</p>
          <button onClick={() => nav("/products")} className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-xl hover:bg-white/90 transition-colors">
            Shop All Kits <ArrowRight size={17} />
          </button>
        </div>
      </motion.section>
    </main>
  );
}
