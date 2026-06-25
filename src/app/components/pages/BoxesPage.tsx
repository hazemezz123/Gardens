import {
  ArrowRight,
  Package,
  Leaf,
  Recycle,
  Sprout,
  Ruler,
  BookOpen,
  Mail,
  Gift,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const boxes = [
  {
    id: "oddbox",
    title: "Oddbox",
    tagline: "Rescuing wonky vegetables rejected by supermarkets",
    description:
      "Our Oddbox is packed with perfectly good fruit and vegetables that supermarkets rejected \u2014 just because they are misshapen, too big, or too small. Every week we rescue fresh, organic produce that would otherwise go to waste and deliver it straight to your door. You also receive a curated selection of vegetable seeds, plus access to our blog covering recipes, storage tips, and growing guides.",
    features: [
      "Wonky vegetables rejected by supermarkets",
      "Blog with recipes and growing guides",
      "Weekly deliveries to your door",
      "Vegetable seeds included every month",
    ],
    image:
      "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=800&h=600&fit=crop&auto=format",
    alt: "Oddbox with misshapen fresh vegetables",
    cta: "Subscribe to Oddbox",
    color: "bg-amber-50",
    border: "border-amber-200",
    accent: "text-amber-600",
    badge: "Weekly",
    Icon: Package,
  },
  {
    id: "flourish",
    title: "Flourish",
    tagline: "Four carefully curated boxes a year \u2014 one for every season",
    description:
      "The Flourish subscription delivers four premium boxes each year, timed perfectly with each growing season. Every box contains a thoughtful collection of seeds with seed trays to start them off, a high-quality watering can, and a handmade cruelty-free soap crafted by local artisans. Whether you are a seasoned gardener or just beginning, Flourish helps your garden flourish all year round.",
    features: [
      "Four boxes per year (seasonal)",
      "Seeds with seed trays for starting",
      "Premium watering can included",
      "Handmade cruelty-free soap",
    ],
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop&auto=format",
    alt: "Flourish box with seeds and soap",
    cta: "Subscribe to Flourish",
    color: "bg-rose-50",
    border: "border-rose-200",
    accent: "text-rose-600",
    badge: "Seasonal",
    Icon: Sprout,
  },
  {
    id: "cottage",
    title: "Cottage",
    tagline: "A monthly surprise of wild beauty delivered to your door",
    description:
      "The Cottage subscription brings the charm of an English cottage garden to your home every single month. Each box contains a carefully selected mix of wild flower seeds suited to the current season, beautifully illustrated fact cards about the flowers and wildlife they attract, and natural seed markers with twine so you can label your plot with style.",
    features: [
      "Monthly box delivery",
      "Wild flower seeds (seasonally selected)",
      "Illustrated fact cards",
      "Seed markers and natural twine",
    ],
    image:
      "https://images.unsplash.com/photo-1580202313707-46a966af5c6f?q=80&w=1162&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Cottage box with wild flower seeds and twine",
    cta: "Subscribe to Cottage",
    color: "bg-sky-50",
    border: "border-sky-200",
    accent: "text-sky-600",
    badge: "Monthly",
    Icon: Ruler,
  },
  {
    id: "custom",
    title: "Custom Boxes",
    tagline:
      "Tailored subscriptions for businesses, gifts, and special occasions",
    description:
      "Need something unique? Our Custom Box service lets you create the perfect gardening subscription for your organisation, team, or loved ones. Choose from corporate subscriptions \u2014 ideal for employee wellbeing programmes, client gifts, or team-building activities \u2014 or gift subscriptions that can be scheduled for birthdays, weddings, or any special occasion. Every custom box is hand-picked by our curation team.",
    features: [
      "Corporate subscriptions for teams and clients",
      "Gift subscriptions for any occasion",
      "Fully customisable contents and branding",
      "Contact us for a personalised quote",
    ],
    image:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&h=600&fit=crop&auto=format",
    alt: "Custom branded gift box with gardening items",
    cta: "Enquire About Custom Boxes",
    color: "bg-purple-50",
    border: "border-purple-200",
    accent: "text-purple-600",
    badge: "Any Time",
    Icon: Gift,
  },
];

export function BoxesPage() {
  const navigate = useNavigate();
  const nav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCta = (box: (typeof boxes)[0]) => {
    if (box.id === "custom") {
      nav("/contact?subject=Custom+Box+Enquiry");
    } else {
      toast.success(
        `${box.title} subscription enquiry received! We will contact you soon.`,
      );
    }
  };

  return (
    <main id="main-content">
      <section className="relative min-h-72 lg:h-96 flex items-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-foreground/45 z-10" />
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Display of gardening boxes arranged on wooden table"
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full"
        >
          <p className="text-sm font-medium text-emerald-300 uppercase tracking-widest mb-3">
            Curated for You
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gardening Boxes
          </h1>
          <p className="text-white/75 mt-4 max-w-2xl mx-auto">
            From rescued wonky veg to seasonal artisan collections \u2014
            discover the perfect subscription box for your gardening journey.
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-12"
        >
          {boxes.map((box, i) => (
            <motion.section
              key={box.id}
              variants={fadeUp}
              className={`rounded-3xl ${box.color} border ${box.border} overflow-hidden`}
            >
              <div className={`grid grid-cols-1 lg:grid-cols-2`}>
                <div
                  className={`p-8 lg:p-12 flex flex-col justify-center order-2 ${i % 2 === 0 ? "lg:order-1" : "lg:order-2"}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`text-xs font-semibold ${box.accent} bg-white/80 px-3 py-1 rounded-full border ${box.border}`}
                    >
                      {box.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <box.Icon size={28} className={box.accent} />
                    <h2
                      className="text-3xl lg:text-4xl font-semibold text-foreground"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {box.title}
                    </h2>
                  </div>
                  <p className="text-base font-medium text-foreground/80 mb-4 italic">
                    {box.tagline}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {box.description}
                  </p>
                  <ul className="space-y-2.5 mb-8">
                    {box.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-sm text-foreground"
                      >
                        <Leaf
                          size={16}
                          className="text-primary mt-0.5 shrink-0"
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleCta(box)}
                      className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {box.id === "custom" ? (
                        <Mail size={16} />
                      ) : (
                        <Package size={16} />
                      )}
                      {box.cta} <ArrowRight size={16} />
                    </button>
                    {box.id === "oddbox" && (
                      <button className="inline-flex items-center justify-center gap-2 bg-white border border-border px-7 py-3.5 rounded-xl font-medium text-sm hover:bg-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                        <BookOpen size={16} /> Read Our Blog
                      </button>
                    )}
                    {box.id === "custom" && (
                      <button
                        onClick={() => nav("/contact")}
                        className="inline-flex items-center justify-center gap-2 bg-white border border-border px-7 py-3.5 rounded-xl font-medium text-sm hover:bg-muted transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <Building2 size={16} /> Corporate Info
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className={`relative min-h-72 lg:min-h-full order-1 ${i % 2 === 0 ? "lg:order-2" : "lg:order-1"}`}
                >
                  <img
                    src={box.image}
                    alt={box.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.section>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20"
        >
          {[
            {
              Icon: Package,
              title: "Everything Included",
              desc: "Seeds, compost, tools, and a full-colour growing guide in every box.",
            },
            {
              Icon: Leaf,
              title: "Organic & Sustainable",
              desc: "Certified organic seeds, peat-free compost, and fully compostable packaging.",
            },
            {
              Icon: Recycle,
              title: "Carbon Neutral Delivery",
              desc: "All boxes are shipped carbon neutral through verified offset programmes.",
            },
          ].map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-primary" />
              </div>
              <h3
                className="font-semibold text-foreground mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
