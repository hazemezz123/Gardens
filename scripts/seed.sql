-- ============================================================
-- Gardens Database Seed Script
-- Run this in the Supabase SQL Editor (SQL > New Query)
-- Re-run safely: clears then re-inserts all seed data
-- ============================================================

-- Disable triggers temporarily for clean truncation
SET session_replication_role = 'replica';

-- Clear all tables (order respects FK constraints)
TRUNCATE TABLE wishlist_items CASCADE;
TRUNCATE TABLE cart_items CASCADE;
TRUNCATE TABLE enquiries CASCADE;
TRUNCATE TABLE order_items CASCADE;
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE faqs CASCADE;
TRUNCATE TABLE team CASCADE;
TRUNCATE TABLE articles CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE profiles CASCADE;
TRUNCATE TABLE auth.users CASCADE;

SET session_replication_role = 'origin';

-- ============================================================
-- SECURITY DEFINER function to break RLS recursion.
-- Run BEFORE seeding so admin policies work correctly.
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ============================================================
-- PRODUCTS (12)
-- ============================================================
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

-- ============================================================
-- ARTICLES (5)
-- ============================================================
INSERT INTO articles (title, excerpt, category, read_time, author, date, image, featured) VALUES
('10 Essential Tips for First-Time Vegetable Gardeners', 'Starting a vegetable garden can feel overwhelming. Here are the top mistakes beginners make and how to sidestep each one.', 'Plant Care', '5 min', 'Sophie Lane', 'June 14, 2026', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop&auto=format', true),
('The Art of Watering: How Much Is Just Right?', 'Overwatering kills more houseplants than neglect ever does. Learn to read the signs and develop an intuitive watering rhythm.', 'Watering', '4 min', 'Marcus Chen', 'June 10, 2026', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&auto=format', false),
('Composting 101: Turn Kitchen Scraps Into Garden Gold', 'Composting is easier than you think, and the rewards are enormous. Rich compost dramatically improves soil structure and plant health.', 'Seasonal Guides', '6 min', 'Amelia Ross', 'June 5, 2026', 'https://images.unsplash.com/photo-1592722893931-9b93b8bcf6eb?w=600&h=400&fit=crop&auto=format', false),
('Indoor Herb Gardens: Grow Fresh Flavour on Your Windowsill', 'No outdoor space? No problem. A sunny windowsill is all you need to grow a thriving herb garden year-round.', 'Indoor Gardening', '5 min', 'Sophie Lane', 'May 28, 2026', 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop&auto=format', false),
('Natural Pest Control: Keep Your Garden Chemical-Free', 'Commercial pesticides harm beneficial insects and disrupt ecosystems. These natural alternatives protect your plants without the collateral damage.', 'Pest Control', '7 min', 'Marcus Chen', 'May 20, 2026', 'https://images.unsplash.com/photo-1490750967868-88df5691a876?w=600&h=400&fit=crop&auto=format', false);

-- ============================================================
-- TEAM (4)
-- ============================================================
INSERT INTO team (name, role, bio, image) VALUES
('Sophie Lane', 'Founder & Head Horticulturist', 'With 15 years growing vegetables in the English countryside, Sophie founded Gardens to share her passion for accessible gardening.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&auto=format'),
('Marcus Chen', 'Head of Product Curation', 'Marcus sources every seed and tool in our catalogue, prioritising organic suppliers and sustainable packaging across the supply chain.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format'),
('Amelia Ross', 'Content & Education Lead', 'Former botanical garden educator, Amelia writes the guides that make growing feel achievable for absolute beginners.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&auto=format'),
('James Okafor', 'Operations & Sustainability', 'James oversees our carbon-neutral warehouse operations and spearheads our compostable packaging initiative.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&auto=format');

-- ============================================================
-- FAQS (5)
-- ============================================================
INSERT INTO faqs (question, answer, sort_order) VALUES
('Do I need any gardening experience to use your kits?', 'Not at all. Every kit includes step-by-step planting guides written for complete beginners. Our Beginner-rated products are specifically designed for people starting from scratch.', 1),
('How long does delivery take?', 'Standard delivery is 2–4 working days. Express next-day delivery is available at checkout. All orders over £45 qualify for free standard shipping.', 2),
('Are your seeds organic and non-GMO?', 'Yes. We exclusively source organic, open-pollinated, non-GMO seeds from certified suppliers. Every product page lists the exact seed variety and its certification.', 3),
('What if my plants don''t grow?', 'We stand behind our products with a full grow guarantee. If your seeds fail to germinate under normal conditions, contact us and we''ll send a replacement kit free of charge.', 4),
('Can I track my order?', 'Yes. You''ll receive a tracking link via email as soon as your order is dispatched. You can also check order status from your account dashboard.', 5);

-- ============================================================
-- ADMIN ACCOUNT
-- Email:    admin@gardens.com
-- Password: Admin123!
-- ============================================================
DO $$
DECLARE
  _admin_id uuid;
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_sent_at,
    confirmation_token, recovery_token,
    email_change_token_new, email_change,
    phone, phone_change_token,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at,
    is_sso_user, is_anonymous
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@gardens.com',
    crypt('Admin123!', gen_salt('bf')),
    now(), now(),
    '', '',
    '', '',
    '', '',
    '{"provider":"email","providers":["email"]}',
    '{"name":"Admin User"}',
    now(), now(),
    false, false
  )
  RETURNING id INTO _admin_id;

  -- The handle_new_user trigger creates a profile with role='customer'.
  -- Promote it to admin.
  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = _admin_id;
END;
$$;

-- ============================================================
-- SAMPLE ENQUIRIES (3)
-- ============================================================
INSERT INTO enquiries (name, email, subject, message, is_read) VALUES
('Jane Porter', 'jane.porter@example.com', 'Order enquiry', 'Hi, I placed an order yesterday but haven''t received a confirmation email. Could you check if it went through?', false),
('Tom Fletcher', 'tom.f@example.com', 'Product question', 'The Heirloom Tomato Starter Kit says it contains 6 seed varieties. Are these all indeterminate or determinate types?', false),
('Priya Sharma', 'priya.sharma@example.com', 'Returns', 'I received my order but the Lavender kit was damaged during shipping. Can I get a replacement?', true);

-- ============================================================
-- SAMPLE ORDERS + ORDER ITEMS (linked to admin user)
-- Uses a subquery to get the admin UUID from profiles
-- ============================================================
DO $$
DECLARE
  _uid uuid;
  _oid bigint;
BEGIN
  SELECT id INTO _uid FROM profiles WHERE role = 'admin' LIMIT 1;

  -- Order 1: placed, delivered
  INSERT INTO orders (user_id, status, total) VALUES (_uid, 'delivered', 63.98)
  RETURNING id INTO _oid;
  INSERT INTO order_items (order_id, product_id, quantity, unit_price)
  SELECT _oid, id, 1, price FROM products WHERE name = 'Heirloom Tomato Starter Kit';
  INSERT INTO order_items (order_id, product_id, quantity, unit_price)
  SELECT _oid, id, 1, price FROM products WHERE name = 'Basil & Mint Essentials';

  -- Order 2: being processed
  INSERT INTO orders (user_id, status, total) VALUES (_uid, 'processing', 59.99)
  RETURNING id INTO _oid;
  INSERT INTO order_items (order_id, product_id, quantity, unit_price)
  SELECT _oid, id, 1, price FROM products WHERE name = 'Indoor Jungle Bundle';

  -- Order 3: pending
  INSERT INTO orders (user_id, status, total) VALUES (_uid, 'pending', 93.48)
  RETURNING id INTO _oid;
  INSERT INTO order_items (order_id, product_id, quantity, unit_price)
  SELECT _oid, id, 2, price FROM products WHERE name = 'Fresh Herb Garden Box';
  INSERT INTO order_items (order_id, product_id, quantity, unit_price)
  SELECT _oid, id, 1, price FROM products WHERE name = 'Chilli Pepper Collection';
END;
$$;

-- ============================================================
-- SAMPLE CART ITEMS (for admin user)
-- ============================================================
DO $$
DECLARE
  _uid uuid;
BEGIN
  SELECT id INTO _uid FROM profiles WHERE role = 'admin' LIMIT 1;

  INSERT INTO cart_items (user_id, product_id, quantity)
  SELECT _uid, id, 1 FROM products WHERE name = 'Mushroom Growing Kit';
  INSERT INTO cart_items (user_id, product_id, quantity)
  SELECT _uid, id, 2 FROM products WHERE name = 'Summer Salad Greens Box';
END;
$$;

-- ============================================================
-- SAMPLE WISHLIST ITEMS (for admin user)
-- ============================================================
DO $$
DECLARE
  _uid uuid;
BEGIN
  SELECT id INTO _uid FROM profiles WHERE role = 'admin' LIMIT 1;

  INSERT INTO wishlist_items (user_id, product_id)
  SELECT _uid, id FROM products WHERE name = 'Bonsai Beginner Set';
  INSERT INTO wishlist_items (user_id, product_id)
  SELECT _uid, id FROM products WHERE name = 'Lavender Sanctuary Kit';
  INSERT INTO wishlist_items (user_id, product_id)
  SELECT _uid, id FROM products WHERE name = 'Wildflower Meadow Pack';
END;
$$;
