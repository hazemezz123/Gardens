import { useState } from "react";
import { Heart, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../../types";
import { CategoryTag } from "./CategoryTag";
import { DifficultyBadge } from "./DifficultyBadge";
import { StarRating } from "./StarRating";

export function ProductCard({ product, onViewDetails, onAddToCart }: { product: Product; onViewDetails: () => void; onAddToCart: () => void }) {
  const [wished, setWished] = useState(false);
  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-semibold px-2.5 py-1 rounded-full">{product.badge}</span>
        )}
        <button onClick={(e) => { e.stopPropagation(); setWished(!wished); }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
          <Heart size={14} className={wished ? "fill-rose-500 text-rose-500" : "text-gray-400"} />
        </button>
        <button onClick={onViewDetails}
          className="absolute inset-x-3 bottom-3 bg-white/90 backdrop-blur-sm text-foreground text-sm font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white">
          <Eye size={14} /> Quick View
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <CategoryTag cat={product.category} />
          <DifficultyBadge level={product.difficulty} />
        </div>
        <h3 className="font-medium text-foreground text-sm leading-snug mb-1 flex-1" style={{ fontFamily: "'Playfair Display', serif" }}>{product.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.reviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">£{product.price.toFixed(2)}</span>
          <button onClick={() => { onAddToCart(); toast.success("Added to cart", { duration: 2000 }); }} className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
