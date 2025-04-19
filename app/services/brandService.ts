import { supabase } from '@/app/config/supabase';
import { getBrandLogoUrl, uploadBrandLogo, generateBrandLogoFileName } from './storageService';
import { Category } from './categoryService';

export interface Brand {
  id: string;
  name: string;
  subtitle: string;
  logo_url: string;
  category: string; // Keep for backward compatibility
  category_id?: string; // New field linking to brand_categories table
  category_details?: Category; // Joined category data when available
  created_at?: string;
}

export interface CreateBrandData {
  name: string;
  subtitle: string;
  description?: string;
  category_id: string; // Now using category_id
  website_url?: string;
  terms_and_conditions?: string;
}

/**
 * Fetch all brands from Supabase
 */
export const fetchAllBrands = async (): Promise<Brand[]> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        category_details:brand_categories(*)
      `)
      .order('name');
    
    if (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchAllBrands:', error);
    return [];
  }
};

/**
 * Fetch brands with filtering options
 */
export const fetchBrands = async (
  searchTerm?: string,
  categoryId?: string
): Promise<Brand[]> => {
  try {
    let query = supabase
      .from('brands')
      .select(`
        *,
        category_details:brand_categories(*)
      `);
    
    // Apply category filter if provided
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    
    // Apply search filter if provided
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      console.error('Error fetching filtered brands:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchBrands:', error);
    return [];
  }
};

/**
 * Fetch all unique brand categories
 * @deprecated Use categoryService.fetchAllCategories() instead
 */
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('category')
      .order('category');
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    // Extract unique categories
    const categories = Array.from(
      new Set(data.map(item => item.category))
    ).filter(Boolean); // Remove any null or empty categories
    
    return categories;
  } catch (error) {
    console.error('Error in fetchCategories:', error);
    return [];
  }
};

/**
 * Get a single brand by ID
 */
export const getBrandById = async (brandId: string): Promise<Brand | null> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        category_details:brand_categories(*)
      `)
      .eq('id', brandId)
      .single();
    
    if (error) {
      console.error('Error fetching brand by ID:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getBrandById:', error);
    return null;
  }
};

/**
 * Create a new brand with logo upload
 */
export const createBrand = async (
  brandData: CreateBrandData,
  logoFile?: Blob
): Promise<Brand | null> => {
  try {
    // First insert the brand data
    const { data, error } = await supabase
      .from('brands')
      .insert([{
        name: brandData.name,
        subtitle: brandData.subtitle,
        description: brandData.description || null,
        category_id: brandData.category_id,
        website_url: brandData.website_url || null,
        terms_and_conditions: brandData.terms_and_conditions || null,
        logo_url: null // Will update this after upload
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
    
    // If we have a logo file, upload it
    if (logoFile && data.id) {
      const fileName = generateBrandLogoFileName(data.id, logoFile.type);
      
      // Upload the logo
      const logoUrl = await uploadBrandLogo(logoFile, fileName);
      
      // Update the brand with the logo URL
      const { data: updatedData, error: updateError } = await supabase
        .from('brands')
        .update({ logo_url: logoUrl })
        .eq('id', data.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating brand with logo URL:', updateError);
        throw updateError;
      }
      
      return updatedData;
    }
    
    return data;
  } catch (error) {
    console.error('Error in createBrand:', error);
    return null;
  }
}; 