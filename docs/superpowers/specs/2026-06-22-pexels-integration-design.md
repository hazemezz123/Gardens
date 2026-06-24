# Pexels Integration Design Spec

**Date:** 2026-06-22  
**Project:** Gardens E-commerce (Vite + React + Supabase)  
**Status:** Approved

## Overview

Integrate Pexels API to enable AI-assisted image selection in the admin panel and automated product seeding. The system consists of:
1. **Admin UI:** ImageSelector component that fetches and displays Pexels images based on product name/category
2. **Seed Script:** Batch tool that generates 5-10 products per category with Pexels images
3. **Backend:** Supabase Edge Function proxy for UI (secure), direct API calls for seed script (fast)

## Architecture

### Request Flow

```
Admin UI (ImageSelector)
  ↓ POST (debounced)
Supabase Edge Function: pexels-search
  ↓ GET with PEXELS_API_KEY
Pexels API: /v1/search
  ↓ returns photos
Edge Function → UI (image grid)
  ↓ user selects
Product saved with image_url, image_source="pexels", image_meta={pexels_id, photographer}

Seed Script (local)
  ├─ Pexels API (direct, PEXELS_API_KEY from .env)
  └─ Supabase JS Client (SERVICE_ROLE_KEY from .env)
```

### Key Decisions

- **Edge Function for UI:** Keeps `PEXELS_API_KEY` server-side, never exposed to browser
- **Direct API for Seed:** Faster batch processing, runs locally with full env access
- **Approach A:** Separates concerns—UI uses secure proxy, seed uses direct access

## Data Model Changes

### Products Table - New Columns

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `image_url` | text | `null` | Primary image URL from Pexels |
| `image_source` | text | `'manual'` | Either `'manual'` or `'pexels'` |
| `image_meta` | jsonb | `null` | Pexels metadata (id, photographer) |

### image_meta JSON Structure

```json
{
  "pexels_id": 12345,
  "photographer": "John Doe",
  "photographer_url": "https://www.pexels.com/@johndoe"
}
```

### Backward Compatibility

- Existing `image` column retained for legacy data
- On insert: `image_url` is primary source; if not set, falls back to `image`
- Migration adds new columns as nullable to avoid breaking existing records

## File Structure

```
website/
├── supabase/
│   └── functions/
│       └── pexels-search/
│           └── index.ts                    # Edge Function
├── src/
│   └── app/
│       ├── lib/
│       │   └── pexels.ts                  # Pexels types
│       ├── services/
│       │   └── imageSearch.ts             # Calls Edge Function
│       ├── components/
│       │   └── admin/
│       │       └── ImageSelector.tsx      # Image grid selector
│       └── types.ts                       # Updated Product interface
└── scripts/
    └── seedProducts.ts                    # Seed script
```

## Pexels Client

### Types (`src/app/lib/pexels.ts`)

```typescript
export interface PexelsImage {
  id: number;
  src: {
    small: string;   // 200px wide
    medium: string;  // 800px wide
    large: string;   // 1920px wide
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
```

### Service (`src/app/services/imageSearch.ts`)

```typescript
export async function searchImages(query: string, perPage = 10): Promise<PexelsImage[]> {
  const { data, error } = await supabase.functions.invoke('pexels-search', {
    body: { query, per_page: perPage }
  });
  if (error) throw error;
  return data.photos;
}
```

## Edge Function

### `supabase/functions/pexels-search/index.ts`

- **Method:** POST
- **Auth:** Requires valid Supabase JWT (admin only)
- **Input:** `{ query: string, per_page: number }`
- **Output:** `PexelsSearchResponse`
- **Secret:** `PEXELS_API_KEY` (set via `supabase secrets set`)

### Error Handling

- 400: Missing/invalid query
- 401: Unauthorized (no JWT)
- 502: Pexels API error (forward error message)
- 500: Internal error

## ImageSelector Component

### Props

```typescript
interface ImageSelectorProps {
  productName: string;
  category: string;
  onSelect: (image: PexelsImage) => void;
}
```

### Behavior

1. **Auto-fetch:** Watches `productName` + `category` via `useEffect`
2. **Debounce:** 500ms delay before calling `searchImages()`
3. **Loading State:** Shows skeleton grid while fetching
4. **Grid Display:** 3-column layout with aspect-ratio thumbnails
5. **Selection:** Click image → green border + checkmark → calls `onSelect`
6. **Manual Search:** Text input for custom queries (overrides auto-fetch)
7. **Attribution:** Shows photographer name under selected image

### Integration in AdminDashboard

Replace the "Upload product images" dropzone with `<ImageSelector />`:
- Auto-fetches on modal open if `editProduct` has name/category
- Stores selected image data in form state
- On save: passes `image_url`, `image_source="pexels"`, `image_meta` to `createProduct`

## Seed Script

### `scripts/seedProducts.ts`

**Environment Variables:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)
- `PEXELS_API_KEY`

**Categories:**
- Plants (indoor, outdoor, succulents)
- Seeds (vegetables, herbs, flowers)
- Tools (hand tools, power tools, accessories)
- Pots (ceramic, plastic, hanging)
- Fertilizers (organic, synthetic, specialty)

**Product Structure:**
- 5-10 products per category
- Realistic names (e.g., "Monstera Deliciosa Plant", "Heirloom Tomato Seeds")
- Prices: £5-£150 range
- Descriptions: 2-3 sentences per product
- Difficulty: Beginner/Intermediate/Advanced
- Status: Active
- Badge: Random selection (New, Best Seller, Sale, or null)

**Pexels Search Strategy:**
- Query: `{category} {product_type}` (e.g., "indoor plant monstera")
- Select first image from results
- Store full metadata in `image_meta`

**Idempotency:**
- Check if product exists by `name` before insert
- Skip duplicates, log "already exists"
- Safe to run multiple times

**Execution:**
```bash
npx tsx scripts/seedProducts.ts
```

## Database Migration

### SQL

```sql
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS image_source text DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS image_meta jsonb;

CREATE INDEX IF NOT EXISTS idx_products_image_source ON products(image_source);
```

### Rollback

```sql
ALTER TABLE products
  DROP COLUMN IF EXISTS image_url,
  DROP COLUMN IF EXISTS image_source,
  DROP COLUMN IF EXISTS image_meta;
```

## Security

### API Key Protection

- **PEXELS_API_KEY:** Stored as Supabase secret, only accessible in Edge Functions
- **SUPABASE_SERVICE_ROLE_KEY:** Only in seed script `.env`, never committed
- **VITE_PEXELS_API_KEY:** NOT used (would expose key to browser)

### RLS Policies

- `pexels-search` Edge Function: Requires authenticated user. Checks `profiles` table for `role='admin'` via `supabase.auth.getUser()`.
- Seed script: Uses service role key (bypasses RLS, local-only)

## Testing Strategy

### Manual Testing

1. **ImageSelector:**
   - Open admin panel → Add Product
   - Enter product name "Rose Bush" + category "Plants"
   - Verify image grid loads after 500ms
   - Select image → verify green border
   - Save product → check DB for `image_url`, `image_source`, `image_meta`

2. **Seed Script:**
   - Run `npx tsx scripts/seedProducts.ts`
   - Verify 25-50 products created
   - Check each has valid `image_url` from Pexels
   - Run again → verify no duplicates

3. **Edge Function:**
   - Deploy: `supabase functions deploy pexels-search`
   - Test locally: `supabase functions serve --env-file .env.local`
   - curl test with valid JWT

## Future Enhancements

- **Image caching:** Store Pexels images in Supabase Storage to reduce API calls
- **Bulk image selection:** Select multiple images for product gallery
- **AI-powered suggestions:** Use product description to refine Pexels search
- **Image editing:** Crop/resize selected images before save

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Pexels API rate limits | Seed script includes 100ms delay between requests |
| Broken image links | Store full `image_meta` for re-fetch if URL expires |
| Edge Function cold starts | Use Supabase's persistent Edge Runtime |
| Seed script fails mid-run | Idempotent design allows safe re-runs |

## Conclusion

This design provides a secure, efficient Pexels integration for both admin UI and automated seeding. The dual approach (Edge Function for UI, direct API for seed) balances security with performance while keeping the codebase maintainable.
