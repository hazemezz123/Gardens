# Gardens E-commerce Website

A modern e-commerce platform for garden products, built with React and Supabase. Based on the [Gardens E-commerce Website Design](https://www.figma.com/design/JgyWf9k0F8IOdasleho7QS/Gardens-E-commerce-Website-Design) from Figma.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS 4, Radix UI, Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **State:** React Context, TanStack Query
- **Routing:** React Router 7
- **Charts:** Recharts
- **Testing:** Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `PEXELS_API_KEY` | [Pexels API key](https://www.pexels.com/api/) for product images |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (seed script only) |

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── admin/       # Admin dashboard components
│   │   ├── layout/      # Navbar, Footer, MobileNav
│   │   ├── pages/       # Page components
│   │   ├── shared/      # ProductCard, CategoryTag, etc.
│   │   └── ui/          # Radix UI primitives
│   ├── contexts/        # React contexts (auth, cart)
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities
│   ├── services/        # Supabase API services
│   └── types.ts         # TypeScript interfaces
├── styles/              # Global CSS
└── main.tsx             # Entry point
supabase/
├── functions/           # Edge functions
└── migrations/          # Database migrations
```

## Features

- Product catalog with categories
- Shopping cart and checkout
- Order management
- Admin dashboard with analytics
- Articles and gardening tips
- Team and FAQ sections
- Contact/enquiry form
- Responsive design (mobile + desktop)
- Pexels image integration for products

## Seed Data

Populate products with Pexels images:

```bash
npm run seed:products
```

Creates 5-10 products per category. Idempotent (safe to run multiple times).

## Testing

```bash
npm run test
npm run test:csv    # Tests + CSV report
npm run test:watch  # Watch mode
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run seed:products` | Seed products from Pexels |
