# Offers Setup & Troubleshooting Guide

## Why Offers Are Not Showing

The offers system requires **4 key components** to work properly:

1. ✅ **homepage_offers** table with data
2. ✅ **homepage_offer_products** table with relationships  
3. ✅ **products** table with active products
4. ✅ **RLS policies** allowing public read access

## Step-by-Step Database Check

### 1. Go to Your Supabase Dashboard
- Navigate to [supabase.com](https://supabase.com)
- Select your project
- Go to **SQL Editor**

### 2. Check if Tables Exist

Run this query to see what tables you have:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('homepage_offers', 'homepage_offer_products', 'products');
```

**Expected Result:** You should see all 3 tables listed.

### 3. Check Each Table for Data

#### A. Check homepage_offers:
```sql
SELECT COUNT(*) as total_offers FROM homepage_offers;
SELECT * FROM homepage_offers ORDER BY created_at DESC;
```

**Expected Result:** Should show > 0 offers with titles like "عروض خاصة", "منتجات جديدة", etc.

#### B. Check homepage_offer_products:
```sql
SELECT COUNT(*) as total_relationships FROM homepage_offer_products;
SELECT 
  hop.id,
  hop.offer_id,
  hop.product_id,
  o.title as offer_title,
  p.name as product_name
FROM homepage_offer_products hop
LEFT JOIN homepage_offers o ON hop.offer_id = o.id
LEFT JOIN products p ON hop.product_id = p.id
ORDER BY hop.offer_id;
```

**Expected Result:** Should show relationships between offers and products.

#### C. Check products:
```sql
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as active_products FROM products WHERE is_active = true;
SELECT id, name, is_active FROM products WHERE is_active = true LIMIT 5;
```

**Expected Result:** Should show active products (is_active = true).

### 4. Check RLS Policies

```sql
-- Check if RLS is enabled
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('homepage_offers', 'homepage_offer_products', 'products');

-- Check existing policies
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('homepage_offers', 'homepage_offer_products', 'products');
```

**Expected Result:** Should show policies allowing SELECT for all users.

## Common Issues & Solutions

### Issue 1: Tables Don't Exist
**Solution:** Create the missing tables:

```sql
-- Create homepage_offers table
CREATE TABLE IF NOT EXISTS homepage_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create homepage_offer_products table
CREATE TABLE IF NOT EXISTS homepage_offer_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES homepage_offers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(offer_id, product_id)
);
```

### Issue 2: No Data in Tables
**Solution:** Insert sample data:

```sql
-- Insert sample offers
INSERT INTO homepage_offers (title) VALUES 
  ('عروض خاصة'),
  ('منتجات جديدة'),
  ('خصومات كبيرة');

-- Create relationships (replace with actual product IDs)
INSERT INTO homepage_offer_products (offer_id, product_id)
SELECT 
  o.id as offer_id,
  p.id as product_id
FROM homepage_offers o
CROSS JOIN (SELECT id FROM products WHERE is_active = true LIMIT 6) p;
```

### Issue 3: RLS Blocking Access
**Solution:** Create public read policies:

```sql
-- Enable RLS
ALTER TABLE homepage_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_offer_products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to homepage_offers" 
ON homepage_offers FOR SELECT USING (true);

CREATE POLICY "Allow public read access to homepage_offer_products" 
ON homepage_offer_products FOR SELECT USING (true);

CREATE POLICY "Allow public read access to active products" 
ON products FOR SELECT USING (is_active = true);
```

### Issue 4: No Active Products
**Solution:** Ensure products have is_active = true:

```sql
-- Check inactive products
SELECT id, name, is_active FROM products WHERE is_active = false;

-- Activate products if needed
UPDATE products SET is_active = true WHERE is_active = false;
```

## Testing the Setup

After fixing the issues:

1. **Refresh your homepage** - you should see offers with product cards
2. **Check browser console** - look for the debug logs we added
3. **Verify data flow** - offers → offer_products → products

## Debug Console Logs

The updated code now shows detailed logs in your browser console:

- ✅ "Successfully fetched offers: [array]"
- ✅ "Number of offers found: X"
- ✅ "Valid offers with products: [array]"
- ✅ "Number of valid offers: X"

If you see "No offers found in database", the issue is in step 3A.
If you see offers but no products, the issue is in step 3B or 3C.

## Quick Fix Script

Run this complete setup script if you want to start fresh:

```sql
-- Complete setup script
-- 1. Create tables
CREATE TABLE IF NOT EXISTS homepage_offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homepage_offer_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES homepage_offers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(offer_id, product_id)
);

-- 2. Insert sample data
INSERT INTO homepage_offers (title) VALUES 
  ('عروض خاصة'),
  ('منتجات جديدة'),
  ('خصومات كبيرة')
ON CONFLICT DO NOTHING;

-- 3. Create relationships
INSERT INTO homepage_offer_products (offer_id, product_id)
SELECT 
  o.id as offer_id,
  p.id as product_id
FROM homepage_offers o
CROSS JOIN (SELECT id FROM products WHERE is_active = true LIMIT 6) p
ON CONFLICT DO NOTHING;

-- 4. Set up RLS policies
ALTER TABLE homepage_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_offer_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to homepage_offers" 
ON homepage_offers FOR SELECT USING (true);

CREATE POLICY "Allow public read access to homepage_offer_products" 
ON homepage_offer_products FOR SELECT USING (true);

CREATE POLICY "Allow public read access to active products" 
ON products FOR SELECT USING (is_active = true);
```

## Still Not Working?

If offers still don't show after following this guide:

1. **Check browser console** for error messages
2. **Verify Supabase connection** in your environment variables
3. **Test database connection** with a simple query
4. **Check if RLS is too restrictive** - temporarily disable it for testing

The debug information we added to the homepage will help identify exactly where the issue is occurring.
