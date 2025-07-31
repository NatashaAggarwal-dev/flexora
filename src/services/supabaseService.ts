import { supabase } from '../lib/supabase';

export interface Review {
  id?: number;
  customer_name: string;
  customer_email: string;
  rating: number;
  review_text: string;
  product_id: number;
  created_at?: string;
}

export const submitReview = async (review: Review) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const getReviews = async (productId?: number) => {
  try {
    let query = supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
}; 