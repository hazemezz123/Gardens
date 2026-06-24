# Pexels Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable AI-assisted image selection in admin panel and automated product seeding using Pexels API + Supabase.

**Architecture:** Supabase Edge Function proxies Pexels API for UI (secure key storage). Seed script calls Pexels directly for fast batch processing. Both use same Pexels client types.

**Tech Stack:** Vite + React, Supabase Edge Functions (Deno), TypeScript, Pexels API, Supabase JS Client

---

## File Structure

### Create
- `supabase/functions/pexels-search/index.ts` - Edge Function proxy
- `src/app/lib/pexels.ts` - Pexels API types
- `src/app/services/imageSearch.ts` - Client wrapper for Edge Function
- `src/app/components/admin/ImageSelector.tsx` - Image grid selector
- `scripts/seedProducts.ts` - Seed script
- `supabase/migrations/YYYYMMDDHHMMSS_add_pexels_fields.sql` - DB migration

### Modify
- `src/app/types.ts` - Add image_url, image_source, image_meta to Product
- `src/app/types/supabase.ts` - Add new columns to Database types
- `src/app/services/products.ts` - Update createProduct signature
- `src/app/components/pages/AdminDashboard.tsx` - Integrate ImageSelector
- `.env.example` - Add PEXELS_API_KEY, SUPABASE_SERVICE_ROLE_KEY

---

## Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/20260622125000_add_pexels_fields.sql`

- [ ] **Step 1: Write migration SQL**

```sql
-- Add Pexels image fields to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS image_source text DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS image_meta jsonb;

-- Index for filtering by source
CREATE INDEX IF NOT EXISTS idx_products_image_source ON products(image_source);

-- Add comment for documentation
COMMENT ON COLUMN products.image_meta IS 'Stores Pexels metadata: {pexels_id, photographer, photographer_url}';
```

- [ ] **Step 2: Apply migration locally**

Run: `supabase db push`
Expected: Migration applied successfully

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260622125000_add_pexels_fields.sql
git commit -m "feat(db): add pexels image fields to products"
```

---

## Task 2: TypeScript Types

**Files:**
- Modify: `src/app/types.ts:1-94`
- Modify: `src/app/types/supabase.ts:1-106`

- [ ] **Step 1: Update Product interface in types.ts**

Add after line 13 in `src/app/types.ts`:

```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  difficulty: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  badge: string;
  status: string;
  image_url: string | null;
  image_source: "manual" | "pexels";
  image_meta: {
    pexels_id: number;
    photographer: string;
    photographer_url: string;
  } | null;
}
```

- [ ] **Step 2: Update Database types in supabase.ts**

Add to `products.Row` (after line 18):

```typescript
          image_url: string | null;
          image_source: string;
          image_meta: Json;
```

Add to `products.Insert` (after line 29):

```typescript
          image_url?: string | null;
          image_source?: string;
          image_meta?: Json;
```

Add to `products.Update` (after line 37):

```typescript
          image_url?: string | null;
          image_source?: string;
          image_meta?: Json;
```

- [ ] **Step 3: Commit**

```bash
git add src/app/types.ts src/app/types/supabase.ts
git commit -m "feat(types): add pexels image fields to Product"
```

---

## Task 3: Pexels Client Library

**Files:**
- Create: `src/app/lib/pexels.ts`

- [ ] **Step 1: Create Pexels types**

```typescript
export interface PexelsImage {
  id: number;
  src: {
    small: string;
    medium: string;
    large: string;
  };
  photographer: string;
  photographer_url: string;
  alt: string;
}

export interface PexelsSearchResponse {
  photos: PexelsImage[];
  total_results: number;
  page: number;
  per_page: number;
}

export interface PexelsSearchRequest {
  query: string;
  per_page?: number;
  page?: number;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/lib/pexels.ts
git commit -m "feat(lib): add Pexels API types"
```

---

## Task 4: Image Search Service

**Files:**
- Create: `src/app/services/imageSearch.ts`

- [ ] **Step 1: Create service wrapper**

```typescript
import { supabase } from "../lib/supabase";
import type { PexelsImage } from "../lib/pexels";

export async function searchImages(query: string, perPage = 10): Promise<PexelsImage[]> {
  if (!query.trim()) {
    return [];
  }

  const { data, error } = await supabase.functions.invoke("pexels-search", {
    body: { query, per_page: perPage },
  });

  if (error) {
    console.error("Pexels search error:", error);
    throw new Error(`Failed to search images: ${error.message}`);
  }

  return data.photos ?? [];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/services/imageSearch.ts
git commit -m "feat(services): add image search service"
```

---

## Task 5: Supabase Edge Function

**Files:**
- Create: `supabase/functions/pexels-search/index.ts`
- Create: `supabase/functions/pexels-search/deno.json`

- [ ] **Step 1: Create deno.json**

```json
{
  "imports": {
    "std/": "https://deno.land/std@0.168.0/"
  }
}
```

- [ ] **Step 2: Create Edge Function**

```typescript
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  query?: string;
  per_page?: number;
  page?: number;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const { query, per_page = 10, page = 1 } = (await req.json()) as RequestBody;

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Query parameter is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Pexels API
    const apiKey = Deno.env.get("PEXELS_API_KEY");
    if (!apiKey) {
      throw new Error("PEXELS_API_KEY not configured");
    }

    const params = new URLSearchParams({
      query: query.trim(),
      per_page: String(per_page),
      page: String(page),
    });

    const pexelsResponse = await fetch(`https://api.pexels.com/v1/search?${params}`, {
      headers: { Authorization: apiKey },
    });

    if (!pexelsResponse.ok) {
      const errorText = await pexelsResponse.text();
      return new Response(
        JSON.stringify({ error: `Pexels API error: ${pexelsResponse.status} ${errorText}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await pexelsResponse.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
```

- [ ] **Step 3: Deploy Edge Function**

Run: `supabase functions deploy pexels-search --no-verify-jwt`
Expected: Function deployed successfully

- [ ] **Step 4: Set PEXELS_API_KEY secret**

Run: `supabase secrets set PEXELS_API_KEY=your_pexels_api_key_here`
Expected: Secret set successfully

- [ ] **Step 5: Test Edge Function**

Run: `curl -X POST https://your-project.supabase.co/functions/v1/pexels-search -H "Authorization: Bearer YOUR_ANON_KEY" -H "Content-Type: application/json" -d '{"query":"rose","per_page":3}'`
Expected: JSON response with photos array

- [ ] **Step 6: Commit**

```bash
git add supabase/functions/pexels-search/
git commit -m "feat(edge-function): add pexels-search proxy"
```

---

## Task 6: ImageSelector Component

**Files:**
- Create: `src/app/components/admin/ImageSelector.tsx`

- [ ] **Step 1: Create component**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/components/admin/ImageSelector.tsx
git commit -m "feat(admin): add ImageSelector component"
```

---

## Task 7: Admin Dashboard Integration

**Files:**
- Modify: `src/app/components/pages/AdminDashboard.tsx:1-275`

- [ ] **Step 1: Import ImageSelector**

Add to imports (line 1):

```typescript
import { ImageSelector } from "../admin/ImageSelector";
```

- [ ] **Step 2: Add state for selected image**

Add after line 13:

```typescript
  const [selectedPexelsImage, setSelectedPexelsImage] = useState<any>(null);
```

- [ ] **Step 3: Replace image upload section**

Replace lines 216-220 (the Upload dropzone) with:

```tsx
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Product Image</label>
                <ImageSelector
                  productName={editProduct?.name || ""}
                  category={editProduct?.category || ""}
                  onSelect={setSelectedPexelsImage}
                  selectedImage={selectedPexelsImage}
                />
              </div>
```

- [ ] **Step 4: Update product creation logic**

Find the "Create Product" button onClick handler (line 265) and update to pass image data:

```typescript
onClick={() => {
  if (selectedPexelsImage) {
    // Will be implemented in products service
    console.log("Selected image:", selectedPexelsImage);
  }
  setModalOpen(false);
}}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/components/pages/AdminDashboard.tsx
git commit -m "feat(admin): integrate ImageSelector in product modal"
```

---

## Task 8: Update Products Service

**Files:**
- Modify: `src/app/services/products.ts:31-38`

- [ ] **Step 1: Update createProduct signature**

Replace lines 31-38 with:

```typescript
export async function createProduct(product: {
  name: string;
  price: number;
  difficulty: string;
  category: string;
  image: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  status?: string;
  image_url?: string | null;
  image_source?: string;
  image_meta?: any;
}): Promise<Product> {
  const { data, error } = await supabase.from("products").insert(product).select().single();
  if (error) throw error;
  return data;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/services/products.ts
git commit -m "feat(services): update createProduct with pexels fields"
```

---

## Task 9: Seed Script Setup

**Files:**
- Create: `scripts/seedProducts.ts`
- Modify: `.env.example`

- [ ] **Step 1: Update .env.example**

Add:

```bash
# Pexels API (get from https://www.pexels.com/api/)
PEXELS_API_KEY=your_pexels_api_key

# Supabase Service Role (for seed script only - bypasses RLS)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

- [ ] **Step 2: Create seed script structure**

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/app/types/supabase";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !PEXELS_API_KEY) {
  console.error("Missing env vars. Check .env.example");
  process.exit(1);
}

const supabase = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY);

interface PexelsPhoto {
  id: number;
  src: { small: string; medium: string; large: string };
  photographer: string;
  photographer_url: string;
  alt: string;
}

async function fetchPexelsImage(query: string): Promise<PexelsPhoto | null> {
  const params = new URLSearchParams({ query, per_page: "1", page: "1" });
  const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
    headers: { Authorization: PEXELS_API_KEY },
  });

  if (!response.ok) {
    console.error(`Pexels API error: ${response.status}`);
    return null;
  }

  const data = await response.json();
  await new Promise((resolve) => setTimeout(resolve, 100)); // Rate limit
  return data.photos?.[0] ?? null;
}
```

- [ ] **Step 3: Commit**

```bash
git add scripts/seedProducts.ts .env.example
git commit -m "feat(seed): add seed script setup"
```

---

## Task 10: Product Data Definition

**Files:**
- Modify: `scripts/seedProducts.ts`

- [ ] **Step 1: Add product data arrays**

Add after line 35:

```typescript
interface ProductData {
  name: string;
  price: number;
  difficulty: string;
  category: string;
  badge: string | null;
  description: string;
}

const productsByCategory: Record<string, ProductData[]> = {
  plants: [
    { name: "Monstera Deliciosa Plant", price: 34.99, difficulty: "Intermediate", category: "Plants", badge: "Best Seller", description: "A stunning tropical plant with large, glossy leaves featuring distinctive splits. Perfect for adding a jungle vibe to any room." },
    { name: "Snake Plant Laurentii", price: 24.99, difficulty: "Beginner", category: "Plants", badge: null, description: "One of the hardiest houseplants available. Tolerates low light and irregular watering with striking vertical leaves." },
    { name: "Fiddle Leaf Fig Tree", price: 89.99, difficulty: "Advanced", category: "Plants", badge: "New", description: "The Instagram-favorite statement plant. Features large, violin-shaped leaves on a tall, elegant trunk." },
    { name: "Peace Lily Spathiphyllum", price: 19.99, difficulty: "Beginner", category: "Plants", badge: null, description: "Beautiful white blooms and glossy leaves. Excellent air purifier that thrives in low-light conditions." },
    { name: "Rubber Plant Burgundy", price: 29.99, difficulty: "Beginner", category: "Plants", badge: null, description: "Dark, glossy leaves with burgundy undertones. Fast-growing and forgiving, perfect for beginners." },
    { name: "String of Pearls Succulent", price: 15.99, difficulty: "Intermediate", category: "Plants", badge: null, description: "Cascading strands of round, bead-like leaves. Unique conversation piece for hanging baskets." },
    { name: "Boston Fern", price: 22.99, difficulty: "Intermediate", category: "Plants", badge: "Sale", description: "Lush, feathery fronds that add softness to any space. Excellent for humidifying dry indoor air." },
  ],
  seeds: [
    { name: "Heirloom Tomato Seeds Collection", price: 8.99, difficulty: "Beginner", category: "Seeds", badge: "Best Seller", description: "10 varieties of heirloom tomatoes including Brandywine, Cherokee Purple, and Green Zebra. Non-GMO and open-pollinated." },
    { name: "Basil Seed Mix", price: 5.99, difficulty: "Beginner", category: "Seeds", badge: null, description: "Five basil varieties: Sweet Genovese, Thai, Lemon, Purple, and Greek. Perfect for culinary gardens." },
    { name: "Wildflower Meadow Mix", price: 12.99, difficulty: "Beginner", category: "Seeds", badge: "New", description: "25+ native wildflower species to create a pollinator paradise. Covers 100 square feet per packet." },
    { name: "Organic Herb Garden Starter Kit", price: 18.99, difficulty: "Beginner", category: "Seeds", badge: null, description: "Complete kit with 12 herb varieties, seed starting trays, organic soil, and detailed growing guide." },
    { name: "Giant Pumpkin Seeds", price: 7.99, difficulty: "Advanced", category: "Seeds", badge: null, description: "Atlantic Giant variety capable of producing 500+ pound pumpkins. Perfect for county fair competitions." },
    { name: "Lavender English Seeds", price: 6.99, difficulty: "Intermediate", category: "Seeds", badge: null, description: "Fragrant English lavender for borders, sachets, and culinary use. Drought-tolerant once established." },
  ],
  tools: [
    { name: "Japanese Hori Hori Garden Knife", price: 32.99, difficulty: "Beginner", category: "Tools", badge: "Best Seller", description: "Versatile stainless steel blade with serrated edge and measuring marks. Essential for digging, cutting, and transplanting." },
    { name: "Ergonomic Pruning Shears", price: 28.99, difficulty: "Beginner", category: "Tools", badge: null, description: "Bypass pruners with rotating handle to reduce hand strain. Cuts branches up to 1 inch diameter." },
    { name: "Long-Reach Loppers", price: 45.99, difficulty: "Intermediate", category: "Tools", badge: null, description: "32-inch extendable handles with compound action for cutting 2-inch branches. Lightweight aluminum construction." },
    { name: "Soil Knife & Saw Combo", price: 38.99, difficulty: "Intermediate", category: "Tools", badge: "New", description: "Dual-purpose tool with serrated knife and folding saw. Perfect for root pruning and dividing perennials." },
    { name: "Watering Can Copper 2-Gallon", price: 54.99, difficulty: "Beginner", category: "Tools", badge: null, description: "Handcrafted copper watering can with removable rose spout. Beautiful patina develops over time." },
    { name: "Garden Tool Set 5-Piece", price: 39.99, difficulty: "Beginner", category: "Tools", badge: "Sale", description: "Stainless steel trowel, fork, cultivator, weeder, and pruner with ergonomic wooden handles." },
  ],
  pots: [
    { name: "Terracotta Planter Classic 12-inch", price: 24.99, difficulty: "Beginner", category: "Pots", badge: null, description: "Traditional Italian terracotta with drainage hole and saucer. Breathable clay promotes healthy root growth." },
    { name: "Self-Watering Reservoir Pot", price: 34.99, difficulty: "Beginner", category: "Pots", badge: "Best Seller", description: "Built-in water reservoir keeps plants hydrated for up to 2 weeks. Ideal for busy plant parents and vacation travelers." },
    { name: "Hanging Basket Macramé Set", price: 29.99, difficulty: "Beginner", category: "Pots", badge: "New", description: "Handwoven macramé hanger with 3-tier design. Includes 8-inch plastic liner pot and ceiling hook." },
    { name: "Ceramic Glazed Planter Blue", price: 42.99, difficulty: "Beginner", category: "Pots", badge: null, description: "Artisan-crafted ceramic with reactive blue glaze. Each piece is unique with beautiful color variations." },
    { name: "Fabric Grow Bags 5-Pack", price: 19.99, difficulty: "Beginner", category: "Pots", badge: null, description: "Breathable fabric promotes air pruning for denser root systems. Reusable for 3+ seasons. 5-gallon capacity." },
    { name: "Concrete Geometric Planter", price: 48.99, difficulty: "Beginner", category: "Pots", badge: null, description: "Modern geometric design with waterproof seal. Perfect for succulents and small indoor plants." },
  ],
  fertilizers: [
    { name: "Organic Fish Emulsion Fertilizer", price: 14.99, difficulty: "Beginner", category: "Fertilizers", badge: "Best Seller", description: "Concentrated liquid fertilizer (5-1-1 NPK). Promotes lush foliage growth. Dilutes to 32 gallons." },
    { name: "Slow-Release Plant Spikes", price: 9.99, difficulty: "Beginner", category: "Fertilizers", badge: null, description: "Pre-measured fertilizer spikes feed plants for 90 days. Just push into soil and forget. 50 spikes per box." },
    { name: "Worm Castings Organic", price: 22.99, difficulty: "Beginner", category: "Fertilizers", badge: "New", description: "Premium earthworm castings improve soil structure and provide slow-release nutrients. 10-pound bag." },
    { name: "Bloom Booster Fertilizer", price: 16.99, difficulty: "Intermediate", category: "Fertilizers", badge: null, description: "High-phosphorus formula (10-30-20) promotes abundant flowers and fruit. Water-soluble for easy application." },
    { name: "Compost Tea Bags 12-Pack", price: 19.99, difficulty: "Beginner", category: "Fertilizers", badge: null, description: "Brew nutrient-rich compost tea in minutes. Steep bag in water for 24 hours. Makes 12 gallons." },
    { name: "Calcium Nitrate Granular", price: 18.99, difficulty: "Advanced", category: "Fertilizers", badge: null, description: "Prevents blossom end rot in tomatoes and peppers. Fast-acting formula. 4-pound bag covers 400 sq ft." },
    { name: "Mycorrhizal Fungi Inoculant", price: 27.99, difficulty: "Intermediate", category: "Fertilizers", badge: null, description: "Beneficial fungi expand root systems by 10x. Improves nutrient uptake and drought resistance. 8 oz powder." },
  ],
};
```

- [ ] **Step 2: Commit**

```bash
git add scripts/seedProducts.ts
git commit -m "feat(seed): add product data for all categories"
```

---

## Task 11: Seed Script Logic

**Files:**
- Modify: `scripts/seedProducts.ts`

- [ ] **Step 1: Add main seed function**

Add at end of file:

```typescript
async function seedProducts() {
  console.log("Starting product seed...\n");

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const [category, products] of Object.entries(productsByCategory)) {
    console.log(`\n📦 Seeding category: ${category} (${products.length} products)`);

    for (const product of products) {
      // Check if product already exists
      const { data: existing } = await supabase
        .from("products")
        .select("id")
        .ilike("name", product.name)
        .maybeSingle();

      if (existing) {
        console.log(`  ⏭️  Skipped: ${product.name} (already exists)`);
        skipped++;
        continue;
      }

      // Fetch image from Pexels
      const searchQuery = `${category} ${product.name.split(" ")[0]}`;
      const photo = await fetchPexelsImage(searchQuery);

      if (!photo) {
        console.log(`  ❌ Failed: ${product.name} (no image found)`);
        failed++;
        continue;
      }

      // Insert product
      const { error } = await supabase.from("products").insert({
        name: product.name,
        price: product.price,
        difficulty: product.difficulty,
        category: product.category,
        image: photo.src.medium, // Legacy field
        image_url: photo.src.medium,
        image_source: "pexels",
        image_meta: {
          pexels_id: photo.id,
          photographer: photo.photographer,
          photographer_url: photo.photographer_url,
        },
        badge: product.badge,
        status: "Active",
        rating: 4.5,
        reviews: Math.floor(Math.random() * 50) + 5,
      });

      if (error) {
        console.log(`  ❌ Failed: ${product.name} - ${error.message}`);
        failed++;
      } else {
        console.log(`  ✅ Created: ${product.name}`);
        created++;
      }
    }
  }

  console.log(`\n🎉 Seed complete!`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Failed: ${failed}`);
}

seedProducts().catch(console.error);
```

- [ ] **Step 2: Add npm script**

Add to `package.json` scripts:

```json
"seed:products": "tsx scripts/seedProducts.ts"
```

- [ ] **Step 3: Install tsx**

Run: `npm install --save-dev tsx`

- [ ] **Step 4: Test seed script**

Run: `npm run seed:products`
Expected: Products created with Pexels images

- [ ] **Step 5: Commit**

```bash
git add scripts/seedProducts.ts package.json package-lock.json
git commit -m "feat(seed): complete seed script with idempotency"
```

---

## Task 12: Final Testing & Documentation

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Test ImageSelector in browser**

1. Run `npm run dev`
2. Navigate to admin panel
3. Click "Add Product"
4. Enter product name and category
5. Verify image grid appears after 500ms
6. Select an image
7. Verify green border and photographer attribution
8. Save product
9. Check database for `image_url`, `image_source`, `image_meta`

- [ ] **Step 2: Test Edge Function**

Run: `supabase functions serve --env-file .env.local`
Test: `curl -X POST http://localhost:54321/functions/v1/pexels-search -H "Authorization: Bearer test" -H "Content-Type: application/json" -d '{"query":"plant","per_page":5}'`
Expected: JSON with photos array

- [ ] **Step 3: Test seed script idempotency**

Run: `npm run seed:products` (twice)
Expected: Second run shows "Skipped" for all products

- [ ] **Step 4: Update README.md**

Add section:

```markdown
## Pexels Integration

### Setup

1. Get API key from https://www.pexels.com/api/
2. Add to `.env`:
   ```
   PEXELS_API_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### Seed Products

```bash
npm run seed:products
```

Creates 5-10 products per category with Pexels images. Idempotent (safe to run multiple times).

### Admin Image Selector

In admin panel → Add Product → image grid auto-fetches based on product name/category.
```

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: add Pexels integration guide"
```

- [ ] **Step 6: Final commit - all changes**

```bash
git add -A
git commit -m "feat: complete Pexels integration for admin and seeding"
```

---

## Summary

**Total Tasks:** 12  
**Estimated Time:** 2-3 hours  
**Dependencies:** Pexels API key, Supabase project

**Key Files:**
- Edge Function: `supabase/functions/pexels-search/index.ts`
- Types: `src/app/lib/pexels.ts`
- Service: `src/app/services/imageSearch.ts`
- Component: `src/app/components/admin/ImageSelector.tsx`
- Seed: `scripts/seedProducts.ts`

**Next Steps:**
1. Get Pexels API key
2. Run migration
3. Deploy Edge Function
4. Test ImageSelector
5. Run seed script
