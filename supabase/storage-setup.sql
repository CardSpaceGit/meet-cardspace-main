-- Create a storage bucket for brand logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-logos', 'brand-logos', true);

-- Set up public access policies for the brand logos bucket
CREATE POLICY "Public Access to Brand Logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-logos');

-- Set up authenticated upload policy for brands bucket
CREATE POLICY "Authenticated Users Can Upload Brand Logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'brand-logos' 
  AND auth.role() = 'authenticated'
);

-- Set up authenticated update policy for brand logos
CREATE POLICY "Authenticated Users Can Update Brand Logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'brand-logos' 
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'brand-logos' 
  AND auth.role() = 'authenticated'
);

-- Set up authenticated delete policy
CREATE POLICY "Authenticated Users Can Delete Brand Logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'brand-logos' 
  AND auth.role() = 'authenticated'
);

-- Helper function to get a Storage object's public URL
CREATE OR REPLACE FUNCTION storage_public_url(bucket TEXT, object TEXT) 
RETURNS TEXT AS $$
  SELECT 
    CASE WHEN object IS NULL OR object = '' THEN NULL
    ELSE (SELECT REPLACE(REPLACE(current_setting('app.settings.storage_base_url'), '{bucket}', bucket), '{object}', object))
    END
$$ LANGUAGE SQL IMMUTABLE; 