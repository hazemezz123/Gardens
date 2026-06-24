import { useState, useEffect } from "react";
import { Search, Check, Loader2 } from "lucide-react";
import { searchImages } from "../../services/imageSearch";
import type { PexelsImage } from "../../lib/pexels";

interface ImageSelectorProps {
  productName: string;
  category: string;
  onSelect: (image: PexelsImage) => void;
  selectedImage?: PexelsImage | null;
}

export function ImageSelector({
  productName,
  category,
  onSelect,
  selectedImage,
}: ImageSelectorProps) {
  const [images, setImages] = useState<PexelsImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualQuery, setManualQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const query = manualQuery || `${productName} ${category}`.trim();
    if (!query || query.length < 3) {
      setImages([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await searchImages(query, 12);
        setImages(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to search images");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [productName, category, manualQuery]);

  const handleSelect = (image: PexelsImage, index: number) => {
    setSelectedIndex(index);
    onSelect(image);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Search size={16} className="text-muted-foreground" />
        <input
          type="text"
          value={manualQuery}
          onChange={(e) => setManualQuery(e.target.value)}
          placeholder="Search Pexels images..."
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-input-background text-sm outline-none focus:border-primary/50"
        />
      </div>

      {loading && (
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      {!loading && images.length === 0 && !error && (
        <div className="p-6 text-center border-2 border-dashed border-border rounded-xl">
          <p className="text-sm text-muted-foreground">
            No images found. Try a different search term.
          </p>
        </div>
      )}

      {!loading && images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleSelect(image, index)}
              className={`relative aspect-square rounded-lg overflow-hidden group ${
                selectedIndex === index
                  ? "ring-2 ring-primary ring-offset-2"
                  : "ring-1 ring-border"
              }`}
            >
              <img
                src={image.src.small}
                alt={image.alt || image.photographer}
                className="w-full h-full object-cover"
              />
              {selectedIndex === index && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <Check size={16} className="text-white" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {image.photographer}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="p-3 bg-muted/40 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Selected:</p>
          <p className="text-sm font-medium text-foreground">
            Photo by {selectedImage.photographer}
          </p>
          <a
            href={selectedImage.photographer_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            View on Pexels
          </a>
        </div>
      )}
    </div>
  );
}
