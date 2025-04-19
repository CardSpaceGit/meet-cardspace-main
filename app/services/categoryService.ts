import { supabase } from '@/app/config/supabase';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name: string;
  color: string;
  display_order: number;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all categories
 */
export const fetchAllCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('brand_categories')
      .select('*')
      .order('display_order');
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchAllCategories:', error);
    return [];
  }
};

/**
 * Fetch only featured categories
 */
export const fetchFeaturedCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('brand_categories')
      .select('*')
      .eq('is_featured', true)
      .order('display_order');
    
    if (error) {
      console.error('Error fetching featured categories:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchFeaturedCategories:', error);
    return [];
  }
};

/**
 * Get a single category by ID
 */
export const getCategoryById = async (categoryId: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('brand_categories')
      .select('*')
      .eq('id', categoryId)
      .single();
    
    if (error) {
      console.error('Error fetching category by ID:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    return null;
  }
};

/**
 * Get a single category by slug
 */
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('brand_categories')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error('Error fetching category by slug:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCategoryBySlug:', error);
    return null;
  }
};

/**
 * Search categories by name
 */
export const searchCategories = async (query: string): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('brand_categories')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('display_order');
    
    if (error) {
      console.error('Error searching categories:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in searchCategories:', error);
    return [];
  }
}; 