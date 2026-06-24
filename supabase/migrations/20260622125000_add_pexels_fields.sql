-- Add Pexels image fields to products table
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS image_source text DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS image_meta jsonb;

-- Index for filtering by source
CREATE INDEX IF NOT EXISTS idx_products_image_source ON products(image_source);

-- Add comment for documentation
COMMENT ON COLUMN products.image_meta IS 'Stores Pexels metadata: {pexels_id, photographer, photographer_url}';
