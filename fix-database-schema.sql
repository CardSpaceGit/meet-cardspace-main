-- First, check if brand_categories table exists
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

-- Add some sample categories if the table is empty
INSERT INTO brand_categories (name, slug, description, icon_name, color, display_order, is_featured)
SELECT 
    'Retail', 'retail', 'Retail store loyalty programs', 'shopping-bag', '#FF6B6B', 1, true
WHERE NOT EXISTS (SELECT 1 FROM brand_categories LIMIT 1);

INSERT INTO brand_categories (name, slug, description, icon_name, color, display_order, is_featured)
SELECT 
    'Food & Dining', 'food-dining', 'Restaurant and food service rewards', 'utensils', '#4ECDC4', 2, true
WHERE NOT EXISTS (SELECT 1 FROM brand_categories LIMIT 1);

INSERT INTO brand_categories (name, slug, description, icon_name, color, display_order, is_featured)
SELECT 
    'Travel', 'travel', 'Airlines, hotels, and travel services', 'plane', '#1A535C', 3, true
WHERE NOT EXISTS (SELECT 1 FROM brand_categories LIMIT 1);

-- Check if brands table has category_id column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'brands' 
        AND column_name = 'category_id'
    ) THEN
        ALTER TABLE brands ADD COLUMN category_id UUID;
    END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.table_constraints 
        WHERE constraint_name = 'brands_category_id_fkey' 
        AND table_name = 'brands'
    ) THEN
        ALTER TABLE brands 
        ADD CONSTRAINT brands_category_id_fkey 
        FOREIGN KEY (category_id) 
        REFERENCES brand_categories(id);
    END IF;
END $$;

-- Enable RLS on brand_categories
ALTER TABLE brand_categories ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read categories
DROP POLICY IF EXISTS "Allow public read access to brand_categories" ON brand_categories;
CREATE POLICY "Allow public read access to brand_categories" 
ON brand_categories FOR SELECT 
USING (true);

-- Only allow authenticated users to modify categories
DROP POLICY IF EXISTS "Allow authenticated users to insert brand_categories" ON brand_categories;
CREATE POLICY "Allow authenticated users to insert brand_categories" 
ON brand_categories FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to update brand_categories" ON brand_categories;
CREATE POLICY "Allow authenticated users to update brand_categories" 
ON brand_categories FOR UPDATE 
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to delete brand_categories" ON brand_categories;
CREATE POLICY "Allow authenticated users to delete brand_categories" 
ON brand_categories FOR DELETE 
USING (auth.role() = 'authenticated'); 