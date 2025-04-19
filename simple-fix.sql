-- Step 1: Drop the brand_categories table if it exists with incorrect schema
DROP TABLE IF EXISTS brand_categories CASCADE;

-- Step 2: Create the brand_categories table with the correct schema
CREATE TABLE brand_categories (
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

-- Step 3: Insert sample categories
INSERT INTO brand_categories (name, slug, description, icon_name, color, display_order, is_featured)
VALUES 
    ('Retail', 'retail', 'Retail store loyalty programs', 'shopping-bag', '#FF6B6B', 1, true),
    ('Food & Dining', 'food-dining', 'Restaurant and food service rewards', 'utensils', '#4ECDC4', 2, true),
    ('Travel', 'travel', 'Airlines, hotels, and travel services', 'plane', '#1A535C', 3, true);

-- Step 4: Make sure brands table has category_id column
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS category_id UUID;

-- Step 5: Create the foreign key relationship
ALTER TABLE brands
DROP CONSTRAINT IF EXISTS brands_category_id_fkey;

ALTER TABLE brands
ADD CONSTRAINT brands_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES brand_categories(id);

-- Step 6: Update brands to have a default category
UPDATE brands
SET category_id = (SELECT id FROM brand_categories WHERE name = 'Retail')
WHERE category_id IS NULL;

-- Step 7: Enable RLS on brand_categories
ALTER TABLE brand_categories ENABLE ROW LEVEL SECURITY;

-- Step 8: Allow everyone to read categories
DROP POLICY IF EXISTS "Allow public read access to brand_categories" ON brand_categories;
CREATE POLICY "Allow public read access to brand_categories" 
ON brand_categories FOR SELECT 
USING (true); 