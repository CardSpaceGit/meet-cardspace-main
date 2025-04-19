import { supabase } from '@/app/config/supabase';

/**
 * Constants
 */
const BRAND_LOGOS_BUCKET = 'brand-logos';

/**
 * Get a public URL for a file in the brand logos bucket
 */
export const getBrandLogoUrl = (fileName: string): string => {
  try {
    const { data } = supabase
      .storage
      .from(BRAND_LOGOS_BUCKET)
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting public URL for brand logo:', error);
    return '';
  }
};

/**
 * Upload a brand logo to Supabase Storage
 * @param file - File to upload (Blob/File object)
 * @param fileName - Name to save the file as (usually brandId + extension)
 * @returns The public URL of the uploaded file
 */
export const uploadBrandLogo = async (
  file: Blob,
  fileName: string
): Promise<string> => {
  try {
    // Upload the file
    const { data, error } = await supabase
      .storage
      .from(BRAND_LOGOS_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      throw error;
    }
    
    // Get and return the public URL
    return getBrandLogoUrl(fileName);
  } catch (error) {
    console.error('Error uploading brand logo:', error);
    throw error;
  }
};

/**
 * Delete a brand logo from Supabase Storage
 */
export const deleteBrandLogo = async (fileName: string): Promise<void> => {
  try {
    const { error } = await supabase
      .storage
      .from(BRAND_LOGOS_BUCKET)
      .remove([fileName]);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting brand logo:', error);
    throw error;
  }
};

/**
 * List all brand logos in the storage bucket
 */
export const listBrandLogos = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .storage
      .from(BRAND_LOGOS_BUCKET)
      .list();
    
    if (error) {
      throw error;
    }
    
    // Return just the file names
    return data.map(item => item.name);
  } catch (error) {
    console.error('Error listing brand logos:', error);
    return [];
  }
};

/**
 * Generate a file name for a brand logo
 * Format: brandId-timestamp.extension
 */
export const generateBrandLogoFileName = (
  brandId: string,
  fileType: string
): string => {
  const timestamp = Date.now();
  const extension = fileType.split('/')[1] || 'png';
  
  return `${brandId}-${timestamp}.${extension}`;
}; 