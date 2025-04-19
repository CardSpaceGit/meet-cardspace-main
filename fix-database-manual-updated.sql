-- Step 1: First check if brand_categories table exists with the proper columns
DO $$
DECLARE
    table_exists boolean;
    slug_exists boolean;
BEGIN
    -- Check if table exists
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'brand_categories'
    ) INTO table_exists;
    
    -- Check if slug column exists
    SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'brand_categories'
        AND column_name = 'slug'
    ) INTO slug_exists;
    
    -- If table doesn't exist or doesn't have the slug column, drop it and recreate
    IF NOT table_exists OR NOT slug_exists THEN
        -- Drop the table if it exists with wrong schema
        DROP TABLE IF EXISTS brand_categories;
        
        -- Create the proper table
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
        
        -- Insert sample categories
        INSERT INTO brand_categories (name, slug, description, icon_name, color, display_order, is_featured)
        VALUES 
            ('Retail', 'retail', 'Retail store loyalty programs', 'shopping-bag', '#FF6B6B', 1, true),
            ('Food & Dining', 'food-dining', 'Restaurant and food service rewards', 'utensils', '#4ECDC4', 2, true),
            ('Travel', 'travel', 'Airlines, hotels, and travel services', 'plane', '#1A535C', 3, true);
    END IF;
END
$$;

-- Step 2: Make sure brands table has category_id column
DO $$
BEGIN
    -- Check if brands table has category_id column
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'brands' 
        AND column_name = 'category_id'
    ) THEN
        ALTER TABLE brands ADD COLUMN category_id UUID;
    END IF;
END
$$;

-- Step 3: Create the foreign key relationship
DO $$
BEGIN
    -- Check if the constraint already exists
    IF NOT EXISTS (
        SELECT FROM information_schema.table_constraints 
        WHERE constraint_name = 'brands_category_id_fkey' 
        AND table_name = 'brands'
    ) THEN
        -- Drop the constraint if it exists with a different name
        BEGIN
            ALTER TABLE brands
            DROP CONSTRAINT IF EXISTS brands_category_id_fkey;
        EXCEPTION WHEN OTHERS THEN
            -- Ignore errors from dropping non-existent constraint
        END;
        
        -- Add the constraint
        ALTER TABLE brands
        ADD CONSTRAINT brands_category_id_fkey
        FOREIGN KEY (category_id)
        REFERENCES brand_categories(id);
    END IF;
END
$$;

-- Step 4: Update any existing brands to have a category if they don't have one
UPDATE brands
SET category_id = (SELECT id FROM brand_categories WHERE name = 'Retail')
WHERE category_id IS NULL;

-- Step 5: Enable RLS on brand_categories
ALTER TABLE brand_categories ENABLE ROW LEVEL SECURITY;

-- Step 6: Allow everyone to read categories
DROP POLICY IF EXISTS "Allow public read access to brand_categories" ON brand_categories;
CREATE POLICY "Allow public read access to brand_categories" 
ON brand_categories FOR SELECT 
USING (true); 