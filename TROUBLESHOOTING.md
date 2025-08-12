# Offers Troubleshooting Guide

## Quick Database Check

Run these queries in your Supabase SQL Editor:

### 1. Check if tables exist:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('homepage_offers', 'homepage_offer_products', 'products');
```

### 2. Check if tables have data:
```sql
-- Check offers
SELECT COUNT(*) FROM homepage_offers;

-- Check offer-product relationships  
SELECT COUNT(*) FROM homepage_offer_products;

-- Check active products
SELECT COUNT(*) FROM products WHERE is_active = true;
```

### 3. Check RLS policies:
```sql
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public';
```

## Common Issues:

1. **Tables don't exist** → Create them
2. **No data in tables** → Insert sample data  
3. **RLS blocking access** → Create public read policies
4. **No active products** → Set is_active = true

## Quick Fix:

```sql
-- Create tables if missing
CREATE TABLE IF NOT EXISTS homepage_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homepage_offer_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES homepage_offers(id),
  product_id UUID REFERENCES products(id)
);

-- Insert sample data
INSERT INTO homepage_offers (title) VALUES ('عروض خاصة'), ('منتجات جديدة');

-- Create RLS policies
CREATE POLICY "public_read" ON homepage_offers FOR SELECT USING (true);
CREATE POLICY "public_read" ON homepage_offer_products FOR SELECT USING (true);
```

Check browser console for debug logs to see exactly where the issue is.
