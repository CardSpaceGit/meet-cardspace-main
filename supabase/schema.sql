-- Create a table for brand categories (optional, can be used for future expansion)
CREATE TABLE IF NOT EXISTS brand_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  logo_url TEXT,
  category TEXT NOT NULL,
  website_url TEXT,
  terms_and_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index for faster searches by name
CREATE INDEX IF NOT EXISTS brands_name_idx ON brands (name);

-- Create an index for category filtering
CREATE INDEX IF NOT EXISTS brands_category_idx ON brands (category);

-- Add some sample brands data
INSERT INTO brands (name, subtitle, description, logo_url, category, website_url)
VALUES 
  (
    'Starbucks', 
    'Starbucks Rewards Program', 
    'Earn Stars with every purchase and redeem them for free drinks, food, and more.', 
    'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/800px-Starbucks_Corporation_Logo_2011.svg.png', 
    'Food & Drink',
    'https://www.starbucks.com/rewards'
  ),
  (
    'Amazon', 
    'Amazon Prime', 
    'Free shipping, exclusive deals, and unlimited streaming of movies and TV shows.', 
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png', 
    'Retail',
    'https://www.amazon.com/prime'
  ),
  (
    'Delta Airlines', 
    'SkyMiles Program', 
    'Earn miles with Delta and over 30 airline partners to use toward travel.', 
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Delta_logo.svg/1200px-Delta_logo.svg.png', 
    'Travel',
    'https://www.delta.com/skymiles'
  ),
  (
    'Nike', 
    'Nike Membership', 
    'Get access to member-only products, events, and personalized benefits.', 
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png', 
    'Fitness',
    'https://www.nike.com/membership'
  ),
  (
    'AMC Theatres', 
    'AMC Stubs', 
    'Earn points on movies, food & drinks to redeem for rewards and save on tickets.', 
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/AMC_Theatres_logo.svg/2560px-AMC_Theatres_logo.svg.png', 
    'Entertainment',
    'https://www.amctheatres.com/amcstubs'
  ),
  (
    'Sephora', 
    'Beauty Insider', 
    'Earn points with every purchase to redeem for beauty products and exclusive experiences.', 
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Sephora_logo.svg/1280px-Sephora_logo.svg.png', 
    'Retail',
    'https://www.sephora.com/beauty-insider'
  ),
  (
    'Southwest Airlines', 
    'Rapid Rewards', 
    'Earn points on flights and partner purchases to redeem for free travel.', 
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Southwest_Airlines_logo_2014.svg/2560px-Southwest_Airlines_logo_2014.svg.png', 
    'Travel',
    'https://www.southwest.com/rapidrewards'
  ),
  (
    'Planet Fitness', 
    'PF Black Card', 
    'Unlimited access to any Planet Fitness club and many additional perks.', 
    'https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Planet_Fitness_logo.svg/1200px-Planet_Fitness_logo.svg.png', 
    'Fitness',
    'https://www.planetfitness.com/pf-black-card'
  ),
  (
    'Cinemark', 
    'Movie Club', 
    'Get one 2D movie ticket credit per month, 20% off concessions, and more.', 
    'https://upload.wikimedia.org/wikipedia/en/thumb/6/6a/Cinemark_logo.svg/1200px-Cinemark_logo.svg.png', 
    'Entertainment',
    'https://www.cinemark.com/movieclub'
  ),
  (
    'Dunkin', 
    'DD Perks', 
    'Earn points on every Dunkin run and redeem for free beverages.', 
    'https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/Dunkin%27_Donuts_logo.svg/1200px-Dunkin%27_Donuts_logo.svg.png', 
    'Food & Drink',
    'https://www.dunkindonuts.com/en/dd-perks'
  );

-- Create RLS policies for the brands table
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Policy that allows all users to read brands
CREATE POLICY "Allow anyone to read brands"
  ON brands FOR SELECT
  USING (true);

-- For future use: policies for user-specific brand additions
-- This assumes you'll have a user_brands junction table in the future
-- CREATE POLICY "Users can add their own brands"
--   ON brands FOR INSERT
--   WITH CHECK (auth.uid() = created_by); 