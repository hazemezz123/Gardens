# Supabase Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded data with Supabase persistence, add auth, cart, wishlist, orders, and admin CRUD with React Query.

**Architecture:** Thin service layer wraps Supabase queries → React Query hooks provide data to components → AuthContext + CartContext manage global state. Guest cart uses localStorage, logged-in cart uses DB.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS 4, @supabase/supabase-js ^2, @tanstack/react-query ^5, Supabase MCP

**Existing project:** `Gardens` (ref: `xsbhkqqvgeextpjayyuy`, region: `eu-west-1`)

**Supabase URL:** `https://xsbhkqqvgeextpjayyuy.supabase.co`
**Anon key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYmhrcXF2Z2VleHRwamF5eXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMDQzMTksImV4cCI6MjA5NzY4MDMxOX0.RyRYEbzIN6UTLMGYRZhJhu-3rYkMY310yHn5XauOn2g`

---

### Task 1: Environment setup + deps

**Files:**
- Create: `website/.env`
- Modify: `website/package.json`

- [ ] **Step 1: Create `.env` file**

```bash
cd "C:\Users\Administrator\Desktop\Unit-6\website"
```

Write `website/.env`:
```
VITE_SUPABASE_URL=https://xsbhkqqvgeextpjayyuy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzYmhrcXF2Z2VleHRwamF5eXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxMDQzMTksImV4cCI6MjA5NzY4MDMxOX0.RyRYEbzIN6UTLMGYRZhJhu-3rYkMY310yHn5XauOn2g
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
cd "C:\Users\Administrator\Desktop\Unit-6\website"
npm install @supabase/supabase-js @tanstack/react-query@5
```

Expected: packages added to `package.json` + `node_modules/`

- [ ] **Step 3: Create `lib/supabase.ts`**

Write `website/src/app/lib/supabase.ts`:
```ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 4: Generate Supabase types**

First, apply all migrations to create the schema, then run:
```bash
npx supabase gen types typescript --project-id xsbhkqqvgeextpjayyuy --schema public > src/app/types/supabase.ts
```

(Note: run after migrations in Task 2 so the schema exists.)

---

### Task 2: Database schema (DDL migrations)

**Files:** — using Supabase MCP

- [ ] **Step 1: Create products table**

```sql
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(8,2) NOT NULL,
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT NOT NULL,
  rating NUMERIC(3,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  badge TEXT DEFAULT '',
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT USING (true);

CREATE POLICY "Products are editable by admins only"
  ON products FOR ALL USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

- [ ] **Step 2: Create articles table**

```sql
CREATE TABLE IF NOT EXISTS articles (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT USING (true);

CREATE POLICY "Articles are editable by admins only"
  ON articles FOR ALL USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

- [ ] **Step 3: Create team table**

```sql
CREATE TABLE IF NOT EXISTS team (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE team ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team is viewable by everyone"
  ON team FOR SELECT USING (true);

CREATE POLICY "Team is editable by admins only"
  ON team FOR ALL USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

- [ ] **Step 4: Create faqs table**

```sql
CREATE TABLE IF NOT EXISTS faqs (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQs are viewable by everyone"
  ON faqs FOR SELECT USING (true);

CREATE POLICY "FAQs are editable by admins only"
  ON faqs FOR ALL USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

- [ ] **Step 5: Create profiles table**

```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

- [ ] **Step 6: Create orders + order_items tables**

```sql
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'dispatched', 'delivered')),
  total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity SMALLINT NOT NULL DEFAULT 1,
  unit_price NUMERIC(8,2) NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

- [ ] **Step 7: Create cart_items table**

```sql
CREATE TABLE IF NOT EXISTS cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cart"
  ON cart_items FOR ALL USING (auth.uid() = user_id);
```

- [ ] **Step 8: Create enquiries table**

```sql
CREATE TABLE IF NOT EXISTS enquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert enquiries"
  ON enquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and update enquiries"
  ON enquiries FOR SELECT USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update enquiries"
  ON enquiries FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

- [ ] **Step 9: Create wishlist_items table**

```sql
CREATE TABLE IF NOT EXISTS wishlist_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, product_id)
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist"
  ON wishlist_items FOR ALL USING (auth.uid() = user_id);
```

---

### Task 3: Seed data

- [ ] **Step 1: Seed PRODUCTS**

```sql
INSERT INTO products (name, price, difficulty, category, image, rating, reviews, badge, status) VALUES
('Heirloom Tomato Starter Kit', 34.99, 'Beginner', 'Vegetables', 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=600&h=600&fit=crop&auto=format', 4.8, 124, 'Best Seller', 'Active'),
('Fresh Herb Garden Box', 28.99, 'Beginner', 'Herbs', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=600&fit=crop&auto=format', 4.9, 89, 'New', 'Active'),
('Wildflower Meadow Pack', 22.50, 'Beginner', 'Flowers', 'https://images.unsplash.com/photo-1490750967868-88df5691a876?w=600&h=600&fit=crop&auto=format', 4.7, 67, '', 'Active'),
('Indoor Jungle Bundle', 59.99, 'Intermediate', 'Indoor Plants', 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=600&h=600&fit=crop&auto=format', 4.6, 45, 'Popular', 'Active'),
('Basil & Mint Essentials', 19.99, 'Beginner', 'Herbs', 'https://images.unsplash.com/photo-1618088129969-bcb0c051985e?w=600&h=600&fit=crop&auto=format', 4.9, 201, 'Best Seller', 'Active'),
('Succulent Desert Garden', 44.99, 'Beginner', 'Indoor Plants', 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=600&h=600&fit=crop&auto=format', 4.5, 38, '', 'Active'),
('Lavender Sanctuary Kit', 31.50, 'Intermediate', 'Flowers', 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&h=600&fit=crop&auto=format', 4.8, 92, 'New', 'Active'),
('Summer Salad Greens Box', 26.99, 'Beginner', 'Vegetables', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=600&fit=crop&auto=format', 4.7, 156, '', 'Active'),
('Rose Garden Starter', 49.99, 'Intermediate', 'Flowers', 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=600&fit=crop&auto=format', 4.4, 29, '', 'Draft'),
('Mushroom Growing Kit', 38.00, 'Beginner', 'Vegetables', 'https://images.unsplash.com/photo-1585059895524-72359e06133a?w=600&h=600&fit=crop&auto=format', 4.6, 73, 'Unique', 'Active'),
('Bonsai Beginner Set', 65.00, 'Advanced', 'Indoor Plants', 'https://images.unsplash.com/photo-1512428559087-560552a9f1e4?w=600&h=600&fit=crop&auto=format', 4.3, 22, '', 'Active'),
('Chilli Pepper Collection', 29.99, 'Intermediate', 'Vegetables', 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&h=600&fit=crop&auto=format', 4.7, 88, 'Spicy', 'Active');
```

- [ ] **Step 2: Seed ARTICLES**

```sql
INSERT INTO articles (title, excerpt, category, read_time, author, date, image, featured) VALUES
('10 Essential Tips for First-Time Vegetable Gardeners', 'Starting a vegetable garden can feel overwhelming. Here are the top mistakes beginners make and how to sidestep each one.', 'Plant Care', '5 min', 'Sophie Lane', 'June 14, 2026', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop&auto=format', true),
('The Art of Watering: How Much Is Just Right?', 'Overwatering kills more houseplants than neglect ever does. Learn to read the signs and develop an intuitive watering rhythm.', 'Watering', '4 min', 'Marcus Chen', 'June 10, 2026', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&auto=format', false),
('Composting 101: Turn Kitchen Scraps Into Garden Gold', 'Composting is easier than you think, and the rewards are enormous. Rich compost dramatically improves soil structure and plant health.', 'Seasonal Guides', '6 min', 'Amelia Ross', 'June 5, 2026', 'https://images.unsplash.com/photo-1592722893931-9b93b8bcf6eb?w=600&h=400&fit=crop&auto=format', false),
('Indoor Herb Gardens: Grow Fresh Flavour on Your Windowsill', 'No outdoor space? No problem. A sunny windowsill is all you need to grow a thriving herb garden year-round.', 'Indoor Gardening', '5 min', 'Sophie Lane', 'May 28, 2026', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop&auto=format', false),
('Natural Pest Control: Keep Your Garden Chemical-Free', 'Commercial pesticides harm beneficial insects and disrupt ecosystems. These natural alternatives protect your plants without the collateral damage.', 'Pest Control', '7 min', 'Marcus Chen', 'May 20, 2026', 'https://images.unsplash.com/photo-1490750967868-88df5691a876?w=600&h=400&fit=crop&auto=format', false);
```

- [ ] **Step 3: Seed TEAM**

```sql
INSERT INTO team (name, role, bio, image) VALUES
('Sophie Lane', 'Founder & Head Horticulturist', 'With 15 years growing vegetables in the English countryside, Sophie founded Gardens to share her passion for accessible gardening.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&auto=format'),
('Marcus Chen', 'Head of Product Curation', 'Marcus sources every seed and tool in our catalogue, prioritising organic suppliers and sustainable packaging across the supply chain.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format'),
('Amelia Ross', 'Content & Education Lead', 'Former botanical garden educator, Amelia writes the guides that make growing feel achievable for absolute beginners.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&auto=format'),
('James Okafor', 'Operations & Sustainability', 'James oversees our carbon-neutral warehouse operations and spearheads our compostable packaging initiative.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format');
```

- [ ] **Step 4: Seed FAQS**

```sql
INSERT INTO faqs (question, answer, sort_order) VALUES
('Do I need any gardening experience to use your kits?', 'Not at all. Every kit includes step-by-step planting guides written for complete beginners. Our Beginner-rated products are specifically designed for people starting from scratch.', 1),
('How long does delivery take?', 'Standard delivery is 2–4 working days. Express next-day delivery is available at checkout. All orders over £45 qualify for free standard shipping.', 2),
('Are your seeds organic and non-GMO?', 'Yes. We exclusively source organic, open-pollinated, non-GMO seeds from certified suppliers. Every product page lists the exact seed variety and its certification.', 3),
('What if my plants don''t grow?', 'We stand behind our products with a full grow guarantee. If your seeds fail to germinate under normal conditions, contact us and we''ll send a replacement kit free of charge.', 4),
('Can I track my order?', 'Yes. You''ll receive a tracking link via email as soon as your order is dispatched. You can also check order status from your account dashboard.', 5);
```

- [ ] **Step 5: Generate TypeScript types**

```bash
npx supabase gen types typescript --project-id xsbhkqqvgeextpjayyuy --schema public > src/app/types/supabase.ts
```

---

### Task 4: Update TypeScript types + add new interfaces

**Files:**
- Modify: `src/app/types.ts`
- Create: `src/app/types/supabase.ts` (from generated step above)

- [ ] **Step 1: Add new interfaces to `types.ts`**

Read current `src/app/types.ts`, add after existing types:

```ts
export interface Profile {
  id: string;
  name: string;
  role: "admin" | "customer";
  avatar_url: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: string;
  status: "pending" | "processing" | "dispatched" | "delivered";
  total: number;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface CartItem {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  created_at: string;
}

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface WishlistItem {
  id: number;
  user_id: string;
  product_id: number;
  created_at: string;
}

// Filter types for product query
export interface ProductFilters {
  category?: string;
  difficulty?: string;
  maxPrice?: number;
  search?: string;
}
```

---

### Task 5: Create service layer

**Files:**
- Create: `src/app/services/products.ts`
- Create: `src/app/services/articles.ts`
- Create: `src/app/services/team.ts`
- Create: `src/app/services/faqs.ts`
- Create: `src/app/services/orders.ts`
- Create: `src/app/services/enquiries.ts`
- Create: `src/app/services/cart.ts`
- Create: `src/app/services/wishlist.ts`

- [ ] **Step 1: Create `services/products.ts`**

```ts
import { supabase } from "../lib/supabase";
import type { Product, ProductFilters } from "../types";

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  let query = supabase.from("products").select("*");

  if (filters?.category && filters.category !== "All") {
    query = query.eq("category", filters.category);
  }
  if (filters?.difficulty && filters.difficulty !== "All") {
    query = query.eq("difficulty", filters.difficulty);
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte("price", filters.maxPrice);
  }
  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query.order("id");
  if (error) throw error;
  return data ?? [];
}

export async function getProduct(id: number): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createProduct(product: Omit<Product, "id" | "created_at" | "updated_at">): Promise<Product> {
  const { data, error } = await supabase.from("products").insert(product).select().single();
  if (error) throw error;
  return data;
}

export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}
```

- [ ] **Step 2: Create `services/articles.ts`**

```ts
import { supabase } from "../lib/supabase";
import type { Article } from "../types";

export async function getArticles(category?: string, search?: string): Promise<Article[]> {
  let query = supabase.from("articles").select("*");
  if (category && category !== "All") query = query.eq("category", category);
  if (search) query = query.ilike("title", `%${search}%`);
  const { data, error } = await query.order("id");
  if (error) throw error;
  return data ?? [];
}

export async function getArticle(id: number): Promise<Article | null> {
  const { data, error } = await supabase.from("articles").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createArticle(article: Omit<Article, "id" | "created_at">): Promise<Article> {
  const { data, error } = await supabase.from("articles").insert(article).select().single();
  if (error) throw error;
  return data;
}

export async function updateArticle(id: number, updates: Partial<Article>): Promise<Article> {
  const { data, error } = await supabase.from("articles").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteArticle(id: number): Promise<void> {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}
```

- [ ] **Step 3: Create `services/team.ts`**

```ts
import { supabase } from "../lib/supabase";
import type { TeamMember } from "../types";

export async function getTeam(): Promise<TeamMember[]> {
  const { data, error } = await supabase.from("team").select("*").order("id");
  if (error) throw error;
  return data ?? [];
}
```

- [ ] **Step 4: Create `services/faqs.ts`**

```ts
import { supabase } from "../lib/supabase";
import type { FAQ } from "../types";

export async function getFaqs(): Promise<FAQ[]> {
  const { data, error } = await supabase.from("faqs").select("*").order("sort_order");
  if (error) throw error;
  return data ?? [];
}
```

- [ ] **Step 5: Create `services/orders.ts`**

```ts
import { supabase } from "../lib/supabase";
import type { Order, OrderItem } from "../types";

export async function getOrders(userId?: string): Promise<Order[]> {
  let query = supabase.from("orders").select("*");
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createOrder(order: Omit<Order, "id" | "created_at">): Promise<Order> {
  const { data, error } = await supabase.from("orders").insert(order).select().single();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id: number, status: Order["status"]): Promise<Order> {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  const { data, error } = await supabase.from("order_items").select("*").eq("order_id", orderId);
  if (error) throw error;
  return data ?? [];
}
```

- [ ] **Step 6: Create `services/enquiries.ts`**

```ts
import { supabase } from "../lib/supabase";
import type { Enquiry } from "../types";

export async function getEnquiries(): Promise<Enquiry[]> {
  const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createEnquiry(enquiry: Omit<Enquiry, "id" | "is_read" | "created_at">): Promise<Enquiry> {
  const { data, error } = await supabase.from("enquiries").insert(enquiry).select().single();
  if (error) throw error;
  return data;
}

export async function markEnquiryRead(id: number): Promise<void> {
  const { error } = await supabase.from("enquiries").update({ is_read: true }).eq("id", id);
  if (error) throw error;
}
```

- [ ] **Step 7: Create `services/cart.ts`**

```ts
import { supabase } from "../lib/supabase";
import type { CartItem } from "../types";

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const { data, error } = await supabase.from("cart_items").select("*, products(*)").eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}

export async function upsertCartItem(userId: string, productId: number, quantity: number): Promise<void> {
  const { error } = await supabase.from("cart_items").upsert(
    { user_id: userId, product_id: productId, quantity },
    { onConflict: "user_id, product_id" }
  );
  if (error) throw error;
}

export async function removeCartItem(userId: string, productId: number): Promise<void> {
  const { error } = await supabase.from("cart_items").delete().eq("user_id", userId).eq("product_id", productId);
  if (error) throw error;
}

export async function clearCart(userId: string): Promise<void> {
  const { error } = await supabase.from("cart_items").delete().eq("user_id", userId);
  if (error) throw error;
}
```

- [ ] **Step 8: Create `services/wishlist.ts`**

```ts
import { supabase } from "../lib/supabase";
import type { WishlistItem } from "../types";

export async function getWishlist(userId: string): Promise<WishlistItem[]> {
  const { data, error } = await supabase.from("wishlist_items").select("*, products(*)").eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}

export async function addWishlistItem(userId: string, productId: number): Promise<void> {
  const { error } = await supabase.from("wishlist_items").upsert(
    { user_id: userId, product_id: productId },
    { onConflict: "user_id, product_id" }
  );
  if (error) throw error;
}

export async function removeWishlistItem(userId: string, productId: number): Promise<void> {
  const { error } = await supabase.from("wishlist_items").delete().eq("user_id", userId).eq("product_id", productId);
  if (error) throw error;
}
```

---

### Task 6: Create React Query hooks

**Files:**
- Create: `src/app/hooks/useProducts.ts`
- Create: `src/app/hooks/useArticles.ts`
- Create: `src/app/hooks/useTeam.ts`
- Create: `src/app/hooks/useFaqs.ts`
- Create: `src/app/hooks/useOrders.ts`
- Create: `src/app/hooks/useEnquiries.ts`
- Create: `src/app/hooks/useCart.ts`
- Create: `src/app/hooks/useWishlist.ts`
- Create: `src/app/hooks/useAuth.ts`

- [ ] **Step 1: Create `hooks/useProducts.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as productsService from "../services/products";
import type { Product, ProductFilters } from "../types";

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productsService.getProducts(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => productsService.getProduct(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (product: Parameters<typeof productsService.createProduct>[0]) =>
      productsService.createProduct(product),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Product> }) =>
      productsService.updateProduct(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsService.deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
```

- [ ] **Step 2: Create `hooks/useArticles.ts`**

```ts
import { useQuery } from "@tanstack/react-query";
import * as articlesService from "../services/articles";

export function useArticles(category?: string, search?: string) {
  return useQuery({
    queryKey: ["articles", category, search],
    queryFn: () => articlesService.getArticles(category, search),
    staleTime: 5 * 60 * 1000,
  });
}
```

- [ ] **Step 3: Create `hooks/useTeam.ts`**

```ts
import { useQuery } from "@tanstack/react-query";
import * as teamService from "../services/team";

export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: () => teamService.getTeam(),
    staleTime: 5 * 60 * 1000,
  });
}
```

- [ ] **Step 4: Create `hooks/useFaqs.ts`**

```ts
import { useQuery } from "@tanstack/react-query";
import * as faqsService from "../services/faqs";

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: () => faqsService.getFaqs(),
    staleTime: 5 * 60 * 1000,
  });
}
```

- [ ] **Step 5: Create `hooks/useOrders.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as ordersService from "../services/orders";
import type { Order } from "../types";

export function useOrders(userId?: string) {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: () => ordersService.getOrders(userId),
    enabled: !!userId,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (order: Parameters<typeof ordersService.createOrder>[0]) =>
      ordersService.createOrder(order),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Order["status"] }) =>
      ordersService.updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orders"] }),
  });
}
```

- [ ] **Step 6: Create `hooks/useEnquiries.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as enquiriesService from "../services/enquiries";

export function useEnquiries() {
  return useQuery({
    queryKey: ["enquiries"],
    queryFn: () => enquiriesService.getEnquiries(),
  });
}

export function useCreateEnquiry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (enquiry: Parameters<typeof enquiriesService.createEnquiry>[0]) =>
      enquiriesService.createEnquiry(enquiry),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enquiries"] }),
  });
}

export function useMarkEnquiryRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => enquiriesService.markEnquiryRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enquiries"] }),
  });
}
```

- [ ] **Step 7: Create `hooks/useAuth.ts`**

```ts
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

- [ ] **Step 8: Create `hooks/useCart.ts`**

```ts
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
```

- [ ] **Step 9: Create `hooks/useWishlist.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as wishlistService from "../services/wishlist";
import { useAuth } from "./useAuth";

export function useWishlist() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: () => wishlistService.getWishlist(user!.id),
    enabled: !!user,
  });
}

export function useAddWishlistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: number }) =>
      wishlistService.addWishlistItem(userId, productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}

export function useRemoveWishlistItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, productId }: { userId: string; productId: number }) =>
      wishlistService.removeWishlistItem(userId, productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist"] }),
  });
}
```

---

### Task 7: Create Contexts (Auth + Cart)

**Files:**
- Create: `src/app/contexts/AuthContext.tsx`
- Create: `src/app/contexts/CartContext.tsx`

- [ ] **Step 1: Create `contexts/AuthContext.tsx`**

```tsx
import { createContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../types";

interface AuthContextValue {
  user: (User & { profile?: Profile }) | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(User & { profile?: Profile }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(authUser: User) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();
    setUser({ ...authUser, profile: data ?? undefined });
    setLoading(false);
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signUp(email: string, password: string, name?: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

- [ ] **Step 2: Create `contexts/CartContext.tsx`**

```tsx
import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import * as cartService from "../services/cart";
import type { Product } from "../types";

interface CartItemWithProduct {
  productId: number;
  quantity: number;
  product?: Product;
}

interface CartContextValue {
  items: CartItemWithProduct[];
  count: number;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  updateQty: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

export const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "gardens_cart";

function getLocalCart(): CartItemWithProduct[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function setLocalCart(items: CartItemWithProduct[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (user) {
      cartService.getCartItems(user.id).then(dbItems => {
        const local = getLocalCart();
        // Merge local into DB
        const merged = [...dbItems];
        for (const li of local) {
          const existing = merged.find(m => m.product_id === li.productId);
          if (existing) {
            existing.quantity += li.quantity;
          } else {
            cartService.upsertCartItem(user.id, li.productId, li.quantity);
          }
        }
        setItems(local.length > 0 ? merged.map(i => ({ productId: i.product_id, quantity: i.quantity, product: (i as any).products })) : []);
        localStorage.removeItem(STORAGE_KEY);
        setLoading(false);
      });
    } else {
      setItems(getLocalCart());
      setLoading(false);
    }
  }, [user]);

  const addItem = useCallback(async (productId: number, quantity = 1) => {
    if (user) {
      await cartService.upsertCartItem(user.id, productId, quantity);
      const dbItems = await cartService.getCartItems(user.id);
      setItems(dbItems.map(i => ({ productId: i.product_id, quantity: i.quantity, product: (i as any).products })));
    } else {
      setItems(prev => {
        const existing = prev.find(i => i.productId === productId);
        if (existing) {
          const next = prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
          setLocalCart(next);
          return next;
        }
        const next = [...prev, { productId, quantity }];
        setLocalCart(next);
        return next;
      });
    }
  }, [user]);

  const removeItem = useCallback(async (productId: number) => {
    if (user) {
      await cartService.removeCartItem(user.id, productId);
      const dbItems = await cartService.getCartItems(user.id);
      setItems(dbItems.map(i => ({ productId: i.product_id, quantity: i.quantity })));
    } else {
      setItems(prev => {
        const next = prev.filter(i => i.productId !== productId);
        setLocalCart(next);
        return next;
      });
    }
  }, [user]);

  const updateQty = useCallback(async (productId: number, quantity: number) => {
    if (user) {
      if (quantity <= 0) {
        await removeItem(productId);
        return;
      }
      await cartService.upsertCartItem(user.id, productId, quantity);
      const dbItems = await cartService.getCartItems(user.id);
      setItems(dbItems.map(i => ({ productId: i.product_id, quantity: i.quantity })));
    } else {
      setItems(prev => {
        const next = quantity <= 0
          ? prev.filter(i => i.productId !== productId)
          : prev.map(i => i.productId === productId ? { ...i, quantity } : i);
        setLocalCart(next);
        return next;
      });
    }
  }, [user, removeItem]);

  const clearCart = useCallback(async () => {
    if (user) {
      await cartService.clearCart(user.id);
    }
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, addItem, removeItem, updateQty, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
}
```

---

### Task 8: Update main.tsx with providers

**Files:**
- Modify: `src/app/main.tsx`

- [ ] **Step 1: Wrap App with providers**

Read `src/app/main.tsx`, rewrite to:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import App from "./App";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
```

---

### Task 9: Update page components to use hooks

**Files:**
- Modify: `src/app/components/pages/HomePage.tsx`
- Modify: `src/app/components/pages/AboutPage.tsx`
- Modify: `src/app/components/pages/ProductsPage.tsx`
- Modify: `src/app/components/pages/ProductDetailPage.tsx`
- Modify: `src/app/components/pages/TipsPage.tsx`
- Modify: `src/app/components/pages/ContactPage.tsx`
- Modify: `src/app/components/pages/AdminDashboard.tsx`
- Create: `src/app/components/shared/SkeletonCard.tsx`

- [ ] **Step 1: Create `components/shared/SkeletonCard.tsx`**

```tsx
export function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
      <div className="aspect-square bg-muted" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-muted rounded-full" />
          <div className="h-5 w-20 bg-muted rounded-full" />
        </div>
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="flex justify-between">
          <div className="h-5 w-16 bg-muted rounded" />
          <div className="h-8 w-24 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update `HomePage.tsx`**

Replace `PRODUCTS` import with `useProducts`, `ARTICLES` with `useArticles`:

```tsx
// Remove these imports:
// import { PRODUCTS } from "../../data/products";
// import { ARTICLES } from "../../data/articles";
// import { ProductCard } from "../shared/ProductCard";

// Add:
import { useProducts } from "../../hooks/useProducts";
import { useArticles } from "../../hooks/useArticles";
import { ProductCard } from "../shared/ProductCard";
import { SkeletonCard } from "../shared/SkeletonCard";

// Inside component:
const { data: products = [], isLoading: productsLoading } = useProducts();
const { data: articles = [], isLoading: articlesLoading } = useArticles();

// Replace PRODUCTS.slice(0, 4).map(...) with:
{productsLoading
  ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
  : products.slice(0, 4).map(p => (
      <ProductCard key={p.id} product={p} onViewDetails={() => nav("product-detail")} onAddToCart={addToCart} />
    ))}

// Replace ARTICLES.slice(0, 3).map(...) with:
{articlesLoading
  ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse"><div className="aspect-[16/10] bg-muted" /><div className="p-6 space-y-3"><div className="h-4 bg-muted rounded w-1/4" /><div className="h-5 bg-muted rounded w-3/4" /><div className="h-4 bg-muted rounded w-full" /></div></div>)
  : articles.slice(0, 3).map(a => (
      // ... existing article card JSX unchanged
    ))}
```

- [ ] **Step 3: Update `AboutPage.tsx`**

Replace `TEAM` import with `useTeam`:

```tsx
// Remove:
// import { TEAM } from "../../data/team";
// Add:
import { useTeam } from "../../hooks/useTeam";

const { data: team = [] } = useTeam();

// Replace TEAM.map(...) with team.map(...)
```

- [ ] **Step 4: Update `ProductsPage.tsx`**

Replace `PRODUCTS` filter with `useProducts` hook:

```tsx
// Remove:
// import { PRODUCTS } from "../../data/products";
// Add:
import { useProducts } from "../../hooks/useProducts";

const { data: products = [], isLoading } = useProducts({ category: selCat, difficulty: selDiff, maxPrice, search });

// Remove local filtered/paginated logic — now done server-side
const paginated = products.slice((page - 1) * PER_PAGE, page * PER_PAGE);
const totalPages = Math.ceil(products.length / PER_PAGE);

// Remove the manual filter logic entirely
```

- [ ] **Step 5: Update `ProductDetailPage.tsx`**

Replace `PRODUCTS` with `useProducts`/`useProduct`:

```tsx
// Remove:
// import { PRODUCTS } from "../../data/products";
// Add:
import { useProducts, useProduct } from "../../hooks/useProducts";

// Change product from PRODUCTS[0] to useProduct:
const productId = 1; // This should come from navigation state in future
const { data: product } = useProduct(productId);
const { data: relatedProducts = [] } = useProducts();

// Replace PRODUCTS.slice(4, 8) with relatedProducts.slice(4, 8)
```

- [ ] **Step 6: Update `TipsPage.tsx`**

Replace `ARTICLES` with `useArticles`:

```tsx
// Remove:
// import { ARTICLES } from "../../data/articles";
// Add:
import { useArticles } from "../../hooks/useArticles";

const { data: articles = [] } = useArticles(selCat, search);

// Replace filtered/featured logic to use articles
const featured = articles.find(a => a.featured) || articles[0];
const rest = articles.filter(a => a !== featured);
```

- [ ] **Step 7: Update `ContactPage.tsx`**

Replace `FAQS` with `useFaqs`, and store enquiries in DB:

```tsx
// Remove:
// import { FAQS } from "../../data/faqs";
// Add:
import { useFaqs } from "../../hooks/useFaqs";
import { useCreateEnquiry } from "../../hooks/useEnquiries";

const { data: faqs = [] } = useFaqs();
const createEnquiry = useCreateEnquiry();

// In handleSubmit:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await createEnquiry.mutateAsync(form);
  setSent(true);
};

// Replace FAQS.map(...) with faqs.map(...)
```

- [ ] **Step 8: Update `AdminDashboard.tsx`**

Replace hardcoded PRODUCTS, enquiries, stats with hooks:

```tsx
// Remove:
// import { PRODUCTS } from "../../data/products";
// Add:
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "../../hooks/useProducts";
import { useEnquiries, useMarkEnquiryRead } from "../../hooks/useEnquiries";
import { useOrders, useUpdateOrderStatus } from "../../hooks/useOrders";

const { data: products = [], isLoading: productsLoading } = useProducts();
const { data: enquiries = [] } = useEnquiries();
const { data: orders = [] } = useOrders();
const createProduct = useCreateProduct();
const updateProduct = useUpdateProduct();
const deleteProduct = useDeleteProduct();
const markRead = useMarkEnquiryRead();
const updateStatus = useUpdateOrderStatus();

// Replace PRODUCTS.map with products.map
// Replace enquiries array with enquiries hook
// Replace orders table data with orders hook
// Connect modal save button → createProduct.mutate / updateProduct.mutate
// Connect delete button → deleteProduct.mutate(id)
```

---

### Task 10: Create Auth UI components

**Files:**
- Create: `src/app/components/shared/AuthGuard.tsx`
- Create: `src/app/components/shared/LoginForm.tsx`
- Create: `src/app/components/shared/SignUpForm.tsx`

- [ ] **Step 1: Create `AuthGuard.tsx`**

```tsx
import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { SkeletonCard } from "./SkeletonCard";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><SkeletonCard /></div>;
  if (!user || user.profile?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-4">Please log in with an admin account.</p>
          <LoginForm />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Create `LoginForm.tsx`**

```tsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-foreground text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Sign In</h2>
      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <div>
        <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
      </div>
      <div>
        <input required type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50">
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Create `SignUpForm.tsx`**

```tsx
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export function SignUpForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password, name);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-foreground text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Create Account</h2>
      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
      <div>
        <input required placeholder="Full Name" value={name} onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
      </div>
      <div>
        <input required type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
      </div>
      <div>
        <input required type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} minLength={6}
          className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50">
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
```

---

### Task 11: Update Navbar with auth + hook cart count

**Files:**
- Modify: `src/app/components/layout/Navbar.tsx`

- [ ] **Step 1: Add auth user menu and cart from context**

```tsx
// Add imports:
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

// Inside component:
const { user, signOut } = useAuth();
const { count } = useCart();

// Replace cart prop usage with count from context:
// Before: <span>{cart > 0 && ...}</span>
// After: <span>{count > 0 && ...}</span>

// Add user menu after the cart button:
{user && (
  <div className="hidden md:flex items-center gap-2 ml-2">
    <button onClick={() => nav("admin")} className="p-2 rounded-lg hover:bg-muted transition-colors">
      <span className="text-xs font-medium text-muted-foreground">{user.profile?.name || user.email}</span>
    </button>
    <button onClick={signOut} className="text-xs text-muted-foreground hover:text-foreground">Sign Out</button>
  </div>
)}
```

Also update the Navbar props:

```tsx
// Before:
export function Navbar({ current, nav, cart }: { current: Page; nav: (p: Page) => void; cart: number })
// After:
export function Navbar({ current, nav }: { current: Page; nav: (p: Page) => void })
```

---

### Task 12: Update App.tsx routing

**Files:**
- Modify: `src/app/App.tsx`

- [ ] **Step 1: Remove `cartCount` state, wrap admin route with AuthGuard**

```tsx
// Remove:
// const [cartCount, setCartCount] = useState(0);
// const addToCart = () => setCartCount(c => c + 1);

// Remove cart prop from Navbar
// <Navbar current={page} nav={nav} />

// Wrap admin with AuthGuard:
import { AuthGuard } from "./components/shared/AuthGuard";

// Replace:
{page === "admin" && <AdminDashboard />}
// With:
{page === "admin" && <AuthGuard><AdminDashboard /></AuthGuard>}

// Remove cart
```

The `addToCart` function is no longer needed locally — it's handled by `useCart` hook directly in page components.

---

### Task 13: Remove old data files

**Files:**
- Delete: `src/app/data/products.ts`
- Delete: `src/app/data/articles.ts`
- Delete: `src/app/data/team.ts`
- Delete: `src/app/data/faqs.ts`

- [ ] **Step 1: Delete stale data files**

```bash
Remove-Item "C:\Users\Administrator\Desktop\Unit-6\website\src\app\data\products.ts"
Remove-Item "C:\Users\Administrator\Desktop\Unit-6\website\src\app\data\articles.ts"
Remove-Item "C:\Users\Administrator\Desktop\Unit-6\website\src\app\data\team.ts"
Remove-Item "C:\Users\Administrator\Desktop\Unit-6\website\src\app\data\faqs.ts"
```

---

### Task 14: Build verification

- [ ] **Step 1: Run build**

```bash
cd "C:\Users\Administrator\Desktop\Unit-6\website"
npx vite build
```

Expected: `✓ built in X.Xs` — no TypeScript errors.

- [ ] **Step 2: Run dev server and verify**

```bash
cd "C:\Users\Administrator\Desktop\Unit-6\website"
npx vite --host
```

Open browser, verify: products load, articles load, team renders, FAQs show, login works, admin dashboard renders data from DB.
