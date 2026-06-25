import {
  ArrowRight,
  Sun,
  Calendar,
  FlaskConical,
  Wrench,
  TreePine,
  BookHeart,
  Camera,
  ClipboardList,
  Mic,
  Sprout,
} from "lucide-react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const activities = [
  {
    id: "open-gardens",
    title: "Open Gardens",
    description:
      "Visit our partner gardens across Europe, Asia, and New Zealand. Explore beautifully maintained spaces, meet expert horticulturists, and gather inspiration for your own garden. Our Open Gardens programme runs from spring through autumn with new locations added every season.",
    image:
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&h=500&fit=crop&auto=format",
    alt: "Beautiful open garden path through blooming flowers",
    cta: "Find Open Gardens Near You",
    Icon: Sun,
    color: "from-emerald-50 to-green-50",
  },
  {
    id: "monthly-checklist",
    title: "Monthly Gardening Checklist",
    description:
      "Never miss a gardening task again. Our monthly checklist tells you exactly what to plant, prune, feed, and harvest each month. Tailored to your region \u2014 Europe, Asia, or New Zealand \u2014 with weather-smart reminders and seasonal tips.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop&auto=format",
    alt: "Monthly gardening planner on a wooden table",
    cta: "View This Month's Checklist",
    Icon: Calendar,
    color: "from-sky-50 to-blue-50",
  },
  {
    id: "greenhouse-tips",
    title: "Greenhouse Tips",
    description:
      "Make the most of your greenhouse with expert advice on ventilation, heating, watering systems, and crop rotation. Whether you have a small lean-to or a commercial polytunnel, our guides help you maximise yield year-round.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop&auto=format",
    alt: "Glass greenhouse filled with thriving plants",
    cta: "Explore Greenhouse Guides",
    Icon: FlaskConical,
    color: "from-amber-50 to-yellow-50",
  },
  {
    id: "garden-maintenance",
    title: "Garden Maintenance Advice",
    description:
      "Keep your garden looking its best with practical maintenance advice covering lawn care, pruning schedules, soil health, weed management, and seasonal clean-ups. Our step-by-step guides make garden upkeep simple and satisfying.",
    image:
      "https://images.unsplash.com/photo-1592921870789-04563d55041c?w=800&h=500&fit=crop&auto=format",
    alt: "Garden tools arranged for maintenance work",
    cta: "Browse Maintenance Guides",
    Icon: Wrench,
    color: "from-stone-50 to-neutral-50",
  },
  {
    id: "allotment-jobs",
    title: "Allotment Jobs",
    description:
      "Get the most from your allotment with our seasonal job lists, crop rotation planners, and space-saving growing techniques. From preparing beds to harvesting, we cover everything a plot-holder needs to succeed.",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop&auto=format",
    alt: "Thriving allotment plot with vegetables",
    cta: "View Allotment Calendar",
    Icon: TreePine,
    color: "from-lime-50 to-green-50",
  },
  {
    id: "plant-diary",
    title: "Plant Diary and Progress Notes",
    description:
      "Track your garden's progress with our digital plant diary. Record planting dates, growth milestones, weather conditions, and harvest yields. Add photos and notes to compare seasons and celebrate your successes.",
    image:
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=500&fit=crop&auto=format",
    alt: "Gardener writing notes in a plant diary",
    cta: "Start Your Plant Diary",
    Icon: BookHeart,
    color: "from-rose-50 to-pink-50",
  },
  {
    id: "photo-competitions",
    title: "Photographic Competitions",
    description:
      "Show off your garden photography skills in our seasonal photographic competitions. Categories include Best Bloom, Wildlife in the Garden, and Most Creative Container Display. Winners receive Gardens vouchers and are featured in our blog and social media.",
    image:
      "https://images.unsplash.com/photo-1490750967868-88df5691a876?w=800&h=500&fit=crop&auto=format",
    alt: "Close-up photography of colourful garden flowers",
    cta: "Enter the Competition",
    Icon: Camera,
    color: "from-purple-50 to-violet-50",
  },
  {
    id: "seasonal-surveys",
    title: "Seasonal Surveys",
    description:
      "Help shape the future of Gardens by participating in our seasonal surveys. Share your preferences, feedback, and gardening experiences. Your input directly influences the products we develop and the content we create.",
    image:
      "https://images.unsplash.com/photo-1558904541-efa843a19901?w=800&h=500&fit=crop&auto=format",
    alt: "Seasonal survey form with gardening theme",
    cta: "Take the Latest Survey",
    Icon: ClipboardList,
    color: "from-teal-50 to-emerald-50",
  },
  {
    id: "online-talks",
    title: "Online Advice Talks",
    description:
      "Join our free online advice talks hosted by horticultural experts. Monthly sessions cover topics from seed starting and soil health to pest management and garden design. Live Q&A included \u2014 or catch up on recordings anytime.",
    image:
      "https://images.unsplash.com/photo-1558904541-efa843a19901?w=800&h=500&fit=crop&auto=format",
    alt: "Online gardening talk with expert speaker",
    cta: "View Upcoming Talks",
    Icon: Mic,
    color: "from-orange-50 to-amber-50",
  },
];

export function ActivitiesPage() {
  const navigate = useNavigate();
  const nav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCta = (activity: (typeof activities)[0]) => {
    if (activity.id === "plant-diary") {
      toast.info("Digital plant diary coming soon! Sign up to be notified.");
    } else if (activity.id === "photo-competitions") {
      toast.info("Next competition opens 1 August 2026. Check back to enter!");
    } else if (activity.id === "seasonal-surveys") {
      toast.info("Summer survey is now open! Check your email for the link.");
    } else if (activity.id === "online-talks") {
      toast.info(
        "Next talk: 'Soil Health 101' on 5 July. Register on our events page.",
      );
    } else if (activity.id === "open-gardens") {
      nav("/contact?subject=Open+Gardens+Enquiry");
    } else {
      nav("/tips");
    }
  };

  return (
    <main id="main-content">
      <section className="relative min-h-72 lg:h-80 flex items-center overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-foreground/45 z-10" />
          <img
            src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=1600&h=500&fit=crop&auto=format"
            alt="Community of gardeners enjoying outdoor activities"
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
            Get Involved
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gardening Activities
          </h1>
          <p className="text-white/75 mt-4 max-w-2xl mx-auto">
            From open garden visits and online talks to photographic
            competitions and seasonal surveys \u2014 there is always something
            happening at Gardens.
          </p>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activities.map((activity) => (
            <motion.article
              key={activity.id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-20 group-hover:opacity-10 transition-opacity z-10`}
                />
                <img
                  src={activity.image}
                  alt={activity.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
                  <activity.Icon size={18} className="text-primary" />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h2
                  className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {activity.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                  {activity.description}
                </p>
                <button
                  onClick={() => handleCta(activity)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors self-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded-lg"
                >
                  {activity.cta} <ArrowRight size={15} />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="bg-secondary py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Sprout size={26} className="text-primary" />
            </div>
            <h2
              className="text-3xl font-semibold text-foreground mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Can't Find What You Are Looking For?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              We are always adding new activities based on member feedback. Let
              us know what you would like to see.
            </p>
            <button
              onClick={() => nav("/contact?subject=Activity+Suggestion")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Suggest an Activity <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
