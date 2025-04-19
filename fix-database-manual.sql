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