import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/app/types/supabase";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
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
  await new Promise((resolve) => setTimeout(resolve, 100));
  return data.photos?.[0] ?? null;
}

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

async function seedProducts() {
  console.log("Starting product seed...\n");

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const [category, products] of Object.entries(productsByCategory)) {
    console.log(`\n📦 Seeding category: ${category} (${products.length} products)`);

    for (const product of products) {
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

      const searchQuery = `${category} ${product.name.split(" ")[0]}`;
      const photo = await fetchPexelsImage(searchQuery);

      if (!photo) {
        console.log(`  ❌ Failed: ${product.name} (no image found)`);
        failed++;
        continue;
      }

      const { error } = await supabase.from("products").insert({
        name: product.name,
        price: product.price,
        difficulty: product.difficulty,
        category: product.category,
        image: photo.src.medium,
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
