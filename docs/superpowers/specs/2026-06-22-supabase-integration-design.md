# Supabase Integration Design

## Overview

Replace hardcoded data files with Supabase-backed persistence. Add auth, per-user cart/wishlist/orders, and admin panel CRUD. Use @tanstack/react-query for data fetching.

## Architecture

```
src/app/
├── lib/supabase.ts                 # Supabase client singleton
├── types.ts                        # + Order, OrderItem, CartItem, Enquiry, Profile, WishlistItem
├── types/supabase.ts               # Generated types from supabase CLI
├── services/                        # Raw Supabase queries (thin wrappers)
│   ├── products.ts
│   ├── articles.ts
│   ├── team.ts
│   ├── faqs.ts
│   ├── orders.ts
│   ├── enquiries.ts
│   ├── cart.ts
│   └── wishlist.ts
├── hooks/                           # React Query wrappers
│   ├── useProducts.ts
│   ├── useArticles.ts
│   ├── useTeam.ts
│   ├── useFaqs.ts
│   ├── useOrders.ts
│   ├── useEnquiries.ts
│   ├── useCart.ts
│   ├── useWishlist.ts
│   └── useAuth.ts
├── contexts/
│   ├── AuthContext.tsx              # User/session state, login/logout/signup
│   └── CartContext.tsx              # Cart state, guest↔DB sync on login
├── components/
│   ├── shared/
│   │   ├── AuthGuard.tsx            # Route guard for admin pages
│   │   ├── LoginForm.tsx            # Email/password login modal/page
│   │   ├── SignUpForm.tsx           # Registration form
│   │   └── SkeletonCard.tsx         # Loading placeholder matching card shapes
│   ├── layout/                      # unchanged
│   └── pages/                       # updated to use hooks instead of data imports
├── data/                            # REMOVED — replaced by Supabase queries
├── App.tsx                          # unchanged routing, wraps providers
└── main.tsx                         # wraps <App> with QueryClientProvider + AuthProvider + CartProvider
```

## Database Schema

### Tables

**products**
| Column | Type | Notes |
|--------|------|-------|
| id | int8 PK | auto-increment |
| name | text | |
| price | numeric(8,2) | |
| difficulty | text | 'Beginner','Intermediate','Advanced' |
| category | text | |
| image | text | URL |
| rating | numeric(3,1) | |
| reviews | int4 | |
| badge | text | |
| status | text | 'Active','Draft' |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |

**articles**
| Column | Type |
|--------|------|
| id | int8 PK |
| title | text |
| excerpt | text |
| category | text |
| read_time | text |
| author | text |
| date | text |
| image | text |
| featured | bool |
| created_at | timestamptz |

**team**
| Column | Type |
|--------|------|
| id | int8 PK |
| name | text |
| role | text |
| bio | text |
| image | text |
| created_at | timestamptz |

**faqs**
| Column | Type |
|--------|------|
| id | int8 PK |
| question | text |
| answer | text |
| sort_order | int2 |
| created_at | timestamptz |

**profiles** — linked to auth.users
| Column | Type |
|--------|------|
| id | uuid PK → auth.users |
| name | text |
| role | text (admin/customer) |
| avatar_url | text |
| created_at | timestamptz |

**orders**
| Column | Type |
|--------|------|
| id | int8 PK |
| user_id | uuid → profiles.id |
| status | text (pending/processing/dispatched/delivered) |
| total | numeric(10,2) |
| created_at | timestamptz |

**order_items**
| Column | Type |
|--------|------|
| id | int8 PK |
| order_id | int8 → orders.id |
| product_id | int8 → products.id |
| quantity | int2 |
| unit_price | numeric(8,2) |

**cart_items**
| Column | Type |
|--------|------|
| id | int8 PK |
| user_id | uuid → profiles.id |
| product_id | int8 → products.id |
| quantity | int2 |
| created_at | timestamptz |
| *unique* | (user_id, product_id) |

**enquiries**
| Column | Type |
|--------|------|
| id | int8 PK |
| name | text |
| email | text |
| subject | text |
| message | text |
| is_read | bool default false |
| created_at | timestamptz |

**wishlist_items**
| Column | Type |
|--------|------|
| id | int8 PK |
| user_id | uuid → profiles.id |
| product_id | int8 → products.id |
| created_at | timestamptz |
| *unique* | (user_id, product_id) |

### Row-Level Security (RLS)

- **products / articles / team / faqs**: PUBLIC read, admin write
- **orders / order_items**: user reads own + inserts own, admin reads all
- **cart_items**: user read/write own, admin read all
- **wishlist_items**: user read/write own
- **enquiries**: anon insert (with rate limit), admin read + update
- **profiles**: user read own, admin read all

### Seed Data

Migrate existing hardcoded arrays into seed SQL:
- 12 products
- 5 articles
- 4 team members
- 5 FAQs
- 1 admin profile (linked to initial auth user)

## Data Flow

### Reads
```
Component → useProducts(filters) → useQuery → services/products.ts → supabase
```

- `useQuery` provides: `data`, `isLoading`, `error`, `refetch`
- Filters/local state stay in hooks, query keys include filter values
- Stale time: products/articles/team/faqs = 5min (low churn), cart/orders = 0 (must be fresh)

### Mutations
```
Component → useCreateProduct() → useMutation → services/products.ts → supabase
                                          → onSuccess invalidates ['products']
```

### Cart
- Guest: localStorage (key `gardens_cart`)
- On login: merge localStorage items into `cart_items` via upsert, clear localStorage
- CartContext provides unified `items`, `addItem`, `removeItem`, `updateQty`, `clearCart`
- Cart count in Navbar reads from context (not local state)

## Auth Flow

1. `AuthContext` initializes on mount: `supabase.auth.getSession()` restores session
2. Listens to `onAuthStateChange` → updates `user` state
3. `user` object includes profile via join or separate query
4. `signIn(email, pw)` / `signUp(email, pw)` / `signOut()` exposed on context
5. After signup, auto-create profile row via DB trigger

### AuthGuard

```tsx
function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <SkeletonCard />;
  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  return children;
}
```

## File Changes

### New files
- `src/app/lib/supabase.ts`
- `src/app/types/supabase.ts`
- `src/app/services/*` (8 files)
- `src/app/hooks/*` (9 files)
- `src/app/contexts/AuthContext.tsx`
- `src/app/contexts/CartContext.tsx`
- `src/app/components/shared/AuthGuard.tsx`
- `src/app/components/shared/LoginForm.tsx`
- `src/app/components/shared/SignUpForm.tsx`
- `src/app/components/shared/SkeletonCard.tsx`

### Modified files
- `src/app/types.ts` — add new interfaces
- `src/app/components/pages/*` — replace data imports with hook calls
- `src/app/components/pages/HomePage.tsx` — use products/articles from hooks
- `src/app/components/pages/ProductsPage.tsx` — use products from hook
- `src/app/components/pages/AdminDashboard.tsx` — use real mutations for CRUD
- `src/app/components/layout/Navbar.tsx` — cart count from context
- `src/app/App.tsx` — wrap with AuthGuard for admin route
- `src/app/main.tsx` — add Provider wrappers

### Removed files
- `src/app/data/*` (products.ts, articles.ts, team.ts, faqs.ts)

## Packages

Add to dependencies:
- `@supabase/supabase-js` ^2.x
- `@tanstack/react-query` ^5.x

Add to devDependencies:
- `supabase` CLI for local dev + type gen

## Implementation Plan

### Phase 1: Supabase project + schema
1. Create Supabase project via MCP server
2. Run DDL for all tables + RLS policies
3. Run seed script with initial data
4. Generate TypeScript types via `supabase gen types`

### Phase 2: Client setup + services
1. Install deps (@supabase/supabase-js, @tanstack/react-query)
2. Create `lib/supabase.ts` with client init
3. Create all 8 service files
4. Create all 9 hook files with React Query

### Phase 3: Components updated
1. Add SkeletonCard loading states
2. Update page components to use hooks
3. Remove `data/` files

### Phase 4: Auth
1. AuthContext with login/logout/signup
2. LoginForm + SignUpForm components
3. AuthGuard for admin
4. Profile creation trigger

### Phase 5: Per-user features
1. CartContext with guest↔DB sync
2. Navbar cart count from context
3. Wishlist toggle on ProductCard
4. Enquiries stored in DB
5. Order creation + admin order list

## Constraints

- No breaking UI changes — components keep same visual output, only data source changes
- Loading states must match card/article shapes to avoid layout shift
- Guest users can still browse products and articles without auth
- Cart must survive page refresh for both guests (localStorage) and logged-in (DB)
- Admin dashboard CRUD must invalidate query cache after mutations
