# How to Fix the Database Relationship Error

## Error Description

You're seeing this error because your app is trying to join two tables that don't have a proper relationship in your Supabase database:

```
Error in fetchBrands: {"code": "PGRST200", "details": "Searched for a foreign key relationship between 'brands' and 'brand_categories' in the schema 'public', but no matches were found.", "hint": null, "message": "Could not find a relationship between 'brands' and 'brand_categories' in the schema cache"}
```

## Quick Fix Steps

1. **Log in to your Supabase Dashboard**
   - Go to https://app.supabase.com
   - Find and select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "+ New Query"

3. **Run the SQL Fix**
   - Copy and paste this entire code block into the editor:

```sql
-- Step 1: Create the brand_categories table
CREATE TABLE IF NOT EXISTS brand_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_name TEXT,
    color TEXT,
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Step 2: Insert a sample category if none exists
INSERT INTO brand_categories (name, slug, description, icon_name, color, display_order, is_featured)
SELECT 'Retail', 'retail', 'Retail store loyalty programs', 'shopping-bag', '#FF6B6B', 1, true
WHERE NOT EXISTS (SELECT 1 FROM brand_categories LIMIT 1);

-- Step 3: Make sure brands table has category_id column
ALTER TABLE brands ADD COLUMN IF NOT EXISTS category_id UUID;

-- Step 4: Create the foreign key relationship
ALTER TABLE brands
DROP CONSTRAINT IF EXISTS brands_category_id_fkey;

ALTER TABLE brands
ADD CONSTRAINT brands_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES brand_categories(id);

-- Step 5: Update any existing brands to have a category
UPDATE brands
SET category_id = (SELECT id FROM brand_categories WHERE name = 'Retail')
WHERE category_id IS NULL;
```

4. **Click "Run" to execute the SQL script**

5. **Verify the Fix**
   - Click on "Table Editor" in the left sidebar
   - Check both tables:
     - Verify the `brand_categories` table exists and has at least one row
     - Verify the `brands` table has a `category_id` column

6. **Restart Your App**
   - Go back to your development environment
   - Stop any running instances of your app
   - Clear the cache with `npm run clear-cache`
   - Restart the app

The error should now be resolved. Your app is trying to join the `brands` table with the `brand_categories` table, and now this relationship is properly defined in the database.

## Additional Categories (Optional)

If you want to add more categories, you can run this additional SQL in the SQL Editor:

```sql
-- Add more categories if needed
INSERT INTO brand_categories (name, slug, description, icon_name, color, display_order, is_featured)
VALUES 
    ('Food & Dining', 'food-dining', 'Restaurant and food service rewards', 'utensils', '#4ECDC4', 2, true),
    ('Travel', 'travel', 'Airlines, hotels, and travel services', 'plane', '#1A535C', 3, true),
    ('Entertainment', 'entertainment', 'Movies, games, and entertainment venues', 'film', '#FFE66D', 4, true),
    ('Health & Beauty', 'health-beauty', 'Pharmacies, cosmetics, and wellness', 'heart', '#FF6B6B', 5, false);
```

## Still Have Issues?

If you're still experiencing problems after applying this fix:

1. Check the console logs for any additional error messages
2. Verify your Supabase URL and API key in the `.env` file
3. Make sure your Supabase project is active and accessible 