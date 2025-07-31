import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xlvkjdqeisqksnuvlqxh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdmtqZHFlaXNxa3NudXZscXhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5Mzc0NzgsImV4cCI6MjA2OTUxMzQ3OH0.VJHQ3Sp9FN-jMLbBLfMfL5j3r7ccS0lXzImj8pr5Nw0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Google OAuth Configuration - Use environment variables
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '';
export const GOOGLE_PROJECT_ID = import.meta.env.VITE_GOOGLE_PROJECT_ID || '';

// Database table names
export const TABLES = {
  PROFILES: 'profiles',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  USER_ADDRESSES: 'user_addresses',
  USER_PREFERENCES: 'user_preferences'
} as const;

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const; 