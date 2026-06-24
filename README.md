
  # Gardens E-commerce Website Design

  This is a code bundle for Gardens E-commerce Website Design. The original project is available at https://www.figma.com/design/JgyWf9k0F8IOdasleho7QS/Gardens-E-commerce-Website-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

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
