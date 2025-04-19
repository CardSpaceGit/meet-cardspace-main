import { supabase } from '@/app/config/supabase';

/**
 * Constants
 */
const BRAND_CARDS_BUCKET = 'brand-cards';

/**
 * Get a public URL for a file in the brand cards bucket
 */
export const getBrandCardUrl = (fileName: string): string => {
  try {
    const { data } = supabase
      .storage
      .from(BRAND_CARDS_BUCKET)
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting public URL for brand card:', error);
    return '';
  }
};

/**
 * Upload a brand card to Supabase Storage
 * @param file - File to upload (Blob/File object)
 * @param fileName - Name to save the file as (usually brandId + extension)
 * @returns The public URL of the uploaded file
 */
export const uploadBrandCard = async (
  file: Blob,
  fileName: string
): Promise<string> => {
  try {
    // Upload the file
    const { data, error } = await supabase
      .storage
      .from(BRAND_CARDS_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      throw error;
    }
    
    // Get and return the public URL
    return getBrandCardUrl(fileName);
  } catch (error) {
    console.error('Error uploading brand card:', error);
    throw error;
  }
};

/**
 * Delete a brand card from Supabase Storage
 */
export const deleteBrandCard = async (fileName: string): Promise<void> => {
  try {
    const { error } = await supabase
      .storage
      .from(BRAND_CARDS_BUCKET)
      .remove([fileName]);
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting brand card:', error);
    throw error;
  }
};

/**
 * List all brand cards in the storage bucket
 */
export const listBrandCards = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .storage
      .from(BRAND_CARDS_BUCKET)
      .list();
    
    if (error) {
      throw error;
    }
    
    // Return just the file names
    return data.map(item => item.name);
  } catch (error) {
    console.error('Error listing brand cards:', error);
    return [];
  }
};

/**
 * Generate a file name for a brand card
 * Format: brandId-timestamp.extension
 */
export const generateBrandCardFileName = (
  brandId: string,
  fileType: string
): string => {
  const timestamp = Date.now();
  const extension = fileType.split('/')[1] || 'png';
  
  return `${brandId}-${timestamp}.${extension}`;
};

// Legacy function names for backward compatibility
export const getBrandLogoUrl = getBrandCardUrl;
export const uploadBrandLogo = uploadBrandCard;
export const deleteBrandLogo = deleteBrandCard;
export const listBrandLogos = listBrandCards;
export const generateBrandLogoFileName = generateBrandCardFileName; 