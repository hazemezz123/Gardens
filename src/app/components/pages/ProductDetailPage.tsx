import { useState } from "react";
import { ShoppingCart, ChevronRight, Minus, Plus, Check, Leaf, Truck, Shield, Star as StarIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { useProducts, useProduct } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";
import { CategoryTag } from "../shared/CategoryTag";
import { DifficultyBadge } from "../shared/DifficultyBadge";
import { StarRating } from "../shared/StarRating";
import { ProductCard } from "../shared/ProductCard";

export function ProductDetailPage() {
  const navigate = useNavigate();
  const nav = (path: string) => { navigate(path); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const [params] = useSearchParams();
  const productId = Number(params.get("id")) || 1;
  const { data: product } = useProduct(productId);
  const { data: allProducts = [] } = useProducts();
  const { addItem } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState<"overview" | "care" | "planting">("overview");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const relatedProducts = allProducts.filter(p => p.category === product?.category && p.id !== productId).slice(0, 4);
  const thumbs = [product?.image, ...relatedProducts.map(p => p.image)].filter(Boolean).slice(0, 4);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product.id, qty);
    setAdded(true);
    toast.success(`Added ${qty} × ${product.name} to cart`, { duration: 2500 });
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return <div>Loading...</div>;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <button onClick={() => nav("/")} className="hover:text-foreground">Home</button>
        <ChevronRight size={14} />
        <button onClick={() => nav("/products")} className="hover:text-foreground">Products</button>
        <ChevronRight size={14} />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
            <img src={thumbs[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3">
            {thumbs.map((t, i) => (
              <button key={i} onClick={() => setActiveImg(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? "border-primary" : "border-border"}`}>
                <img src={t} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex gap-2 mb-3">
            <CategoryTag cat={product.category} />
            <DifficultyBadge level={product.difficulty} />
            {product.badge && <span className="text-xs bg-accent text-accent-foreground font-semibold px-2.5 py-0.5 rounded-full">{product.badge}</span>}
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</h1>
          <div className="flex items-center gap-3 mb-5">
            <StarRating rating={product.rating} />
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
          </div>
          <p className="text-3xl font-bold text-foreground mb-6">£{product.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Everything you need to grow rich, flavourful heirloom tomatoes at home — whether in a pot on a balcony or a raised bed in the garden. Each kit includes four heritage varieties, organic potting compost, bamboo canes, and our illustrated growing guide.
          </p>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-3 hover:bg-muted transition-colors"><Minus size={15} /></button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="p-3 hover:bg-muted transition-colors"><Plus size={15} /></button>
            </div>
            <button onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${added ? "bg-emerald-600 text-white" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
              {added ? <><Check size={16} /> Added to Cart</> : <><ShoppingCart size={16} /> Add to Cart</>}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
            {[{ Icon: Leaf, label: "Organic Seeds" }, { Icon: Truck, label: "Free Delivery" }, { Icon: Shield, label: "Grow Guarantee" }].map(({ Icon, label }) => (
              <div key={label} className="text-center">
                <Icon size={20} className="text-primary mx-auto mb-1" />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-20">
        <div className="flex border-b border-border mb-8">
          {(["overview", "care", "planting"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t === "care" ? "Care Instructions" : t === "planting" ? "Planting Guide" : "Overview"}
            </button>
          ))}
        </div>
        <div className="max-w-2xl prose text-foreground">
          {tab === "overview" && (
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>This kit includes four carefully selected heirloom tomato varieties — Gardener&apos;s Delight, Black Krim, Yellow Pear, and San Marzano — chosen for their exceptional flavour and beginner-friendly growth habit.</p>
              <p>Each variety is grown from certified organic, open-pollinated seed, meaning you can save seeds from your best fruits each year for future seasons.</p>
              <p><strong className="text-foreground">Includes:</strong> 4 seed packets (25 seeds each), 2L organic peat-free compost, 6 bamboo canes, plant labels, and a 24-page illustrated growing guide.</p>
            </div>
          )}
          {tab === "care" && (
            <ul className="space-y-3 text-sm text-muted-foreground">
              {["Water deeply 2–3 times per week once established. Avoid wetting foliage.", "Feed with a balanced liquid fertiliser every two weeks from first flower.", "Remove side shoots (suckers) on cordon varieties for a single main stem.", "Provide support with the included canes as plants grow. Tie loosely with soft twine.", "Harvest when skins are fully coloured and fruit gives slightly to gentle pressure."].map(i => (
                <li key={i} className="flex gap-3"><Check size={16} className="text-primary mt-0.5 shrink-0" />{i}</li>
              ))}
            </ul>
          )}
          {tab === "planting" && (
            <ol className="space-y-4 text-sm text-muted-foreground">
              {["Sow seeds February–April, 5mm deep in seed compost. Cover with a plastic bag or propagator lid.", "Germination takes 7–14 days at 18–24°C. Remove cover once seeds sprout.", "Prick seedlings out into 9cm pots when two true leaves appear.", "Harden off plants outdoors for a week before final planting in May–June.", "Plant into final position (60cm apart) after the last frost. Add compost and water well."].map((s, i) => (
                <li key={s} className="flex gap-3"><span className="w-6 h-6 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>{s}</li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-7" style={{ fontFamily: "'Playfair Display', serif" }}>You Might Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} product={p} onViewDetails={() => nav("/product-detail?id=" + p.id)} onAddToCart={() => { addItem(p.id); toast.success("Added to cart", { duration: 2000 }); }} />
          ))}
        </div>
      </div>
    </main>
  );
}
