-- Create a more robust categories table
CREATE TABLE IF NOT EXISTS brand_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT, -- For frontend icon identification
  color TEXT, -- Hex color code for category styling
  display_order INTEGER,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS brand_categories_slug_idx ON brand_categories (slug);
CREATE INDEX IF NOT EXISTS brand_categories_featured_idx ON brand_categories (is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS brand_categories_display_order_idx ON brand_categories (display_order);

-- Insert standard categories with consistent naming, descriptions, and styling
INSERT INTO brand_categories (name, slug, description, icon_name, color, display_order, is_featured)
VALUES
  (
    'Retail',
    'retail',
    'Loyalty programs from retail stores and shopping brands',
    'shopping-bag',
    '#4a6fa5',
    10,
    true
  ),
  (
    'Food & Drink',
    'food-drink',
    'Rewards for restaurants, cafes, and food delivery services',
    'restaurant',
    '#e67e22',
    20,
    true
  ),
  (
    'Travel',
    'travel',
    'Airline, hotel, and travel booking reward programs',
    'airplane',
    '#3498db',
    30,
    true
  ),
  (
    'Entertainment',
    'entertainment',
    'Movie theaters, streaming services, and entertainment venues',
    'film',
    '#9b59b6',
    40,
    true
  ),
  (
    'Fitness',
    'fitness',
    'Gym memberships and fitness program rewards',
    'dumbbell',
    '#2ecc71',
    50,
    true
  ),
  (
    'Beauty',
    'beauty',
    'Cosmetics, skincare, and beauty salon reward programs',
    'spa',
    '#e84393',
    60,
    false
  ),
  (
    'Technology',
    'technology',
    'Electronics, software, and tech service rewards',
    'laptop',
    '#34495e',
    70,
    false
  ),
  (
    'Finance',
    'finance',
    'Banking, credit card, and financial service rewards',
    'credit-card',
    '#2c3e50',
    80,
    false
  ),
  (
    'Health',
    'health',
    'Pharmacy, health services, and wellness program rewards',
    'heartbeat',
    '#c0392b',
    90,
    false
  ),
  (
    'Education',
    'education',
    'Online courses, bookstores, and educational rewards',
    'book',
    '#16a085',
    100,
    false
  ),
  (
    'Automotive',
    'automotive',
    'Car rentals, car services, and auto parts rewards',
    'car',
    '#7f8c8d',
    110,
    false
  ),
  (
    'Other',
    'other',
    'Other types of loyalty and rewards programs',
    'tag',
    '#95a5a6',
    999,
    false
  );

-- Add RLS policies for the categories table
ALTER TABLE brand_categories ENABLE ROW LEVEL SECURITY;

-- Public read access to categories
CREATE POLICY "Allow anyone to read categories"
  ON brand_categories FOR SELECT
  USING (true);

-- Allow only authenticated users with admin role to modify categories
CREATE POLICY "Only admins can insert categories"
  ON brand_categories FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.jwt() ? 'is_admin');

CREATE POLICY "Only admins can update categories"
  ON brand_categories FOR UPDATE
  USING (auth.role() = 'authenticated' AND auth.jwt() ? 'is_admin');

CREATE POLICY "Only admins can delete categories"
  ON brand_categories FOR DELETE
  USING (auth.role() = 'authenticated' AND auth.jwt() ? 'is_admin');

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brand_categories_timestamp
BEFORE UPDATE ON brand_categories
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Update the brands table to use the categories as a foreign key
ALTER TABLE IF EXISTS brands
ADD COLUMN category_id UUID REFERENCES brand_categories(id);

-- Create index on the category_id
CREATE INDEX IF NOT EXISTS brands_category_id_idx ON brands (category_id);

-- Migrate existing data to use the new categories (if brands table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'brands') THEN
    -- Update Retail category
    UPDATE brands 
    SET category_id = (SELECT id FROM brand_categories WHERE slug = 'retail')
    WHERE category = 'Retail';
    
    -- Update Food & Drink category
    UPDATE brands 
    SET category_id = (SELECT id FROM brand_categories WHERE slug = 'food-drink')
    WHERE category = 'Food & Drink';
    
    -- Update Travel category
    UPDATE brands 
    SET category_id = (SELECT id FROM brand_categories WHERE slug = 'travel')
    WHERE category = 'Travel';
    
    -- Update Entertainment category
    UPDATE brands 
    SET category_id = (SELECT id FROM brand_categories WHERE slug = 'entertainment')
    WHERE category = 'Entertainment';
    
    -- Update Fitness category
    UPDATE brands 
    SET category_id = (SELECT id FROM brand_categories WHERE slug = 'fitness')
    WHERE category = 'Fitness';
    
    -- Update any remaining to Other
    UPDATE brands 
    SET category_id = (SELECT id FROM brand_categories WHERE slug = 'other')
    WHERE category_id IS NULL;
  END IF;
END $$; 