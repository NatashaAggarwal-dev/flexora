import { supabase, TABLES } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  google_id?: string;
  phone?: string;
  auth_provider: 'google' | 'email';
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  address_type: 'shipping' | 'billing';
  is_default: boolean;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  marketing_emails: boolean;
  theme: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  shipping_address?: any;
  billing_address?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  product_id?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

// User Profile Operations
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .rpc('get_user_profile_with_status', { user_id: userId });

    if (error) throw error;
    return data[0] || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('check_email_availability', { email_address: email });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking email availability:', error);
    return false;
  }
};

export const markProfileComplete = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .rpc('mark_profile_complete', { user_id: userId });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking profile complete:', error);
    return false;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
};

// User Addresses Operations
export const getUserAddresses = async (userId: string): Promise<UserAddress[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USER_ADDRESSES)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    return [];
  }
};

export const addUserAddress = async (address: Omit<UserAddress, 'id' | 'created_at' | 'updated_at'>): Promise<UserAddress | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USER_ADDRESSES)
      .insert(address)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding user address:', error);
    return null;
  }
};

export const updateUserAddress = async (addressId: string, updates: Partial<UserAddress>): Promise<UserAddress | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USER_ADDRESSES)
      .update(updates)
      .eq('id', addressId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user address:', error);
    return null;
  }
};

export const deleteUserAddress = async (addressId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from(TABLES.USER_ADDRESSES)
      .delete()
      .eq('id', addressId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting user address:', error);
    return false;
  }
};

// User Preferences Operations
export const getUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USER_PREFERENCES)
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    return null;
  }
};

export const updateUserPreferences = async (userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.USER_PREFERENCES)
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return null;
  }
};

// Order Operations
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

export const getOrderDetails = async (orderId: string): Promise<{ order: Order | null; items: OrderItem[] }> => {
  try {
    // Get order
    const { data: order, error: orderError } = await supabase
      .from(TABLES.ORDERS)
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError) throw orderError;

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from(TABLES.ORDER_ITEMS)
      .select('*')
      .eq('order_id', orderId);

    if (itemsError) throw itemsError;

    return {
      order,
      items: items || []
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    return { order: null, items: [] };
  }
};

export const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .insert(orderData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

export const addOrderItems = async (items: Omit<OrderItem, 'id' | 'created_at'>[]): Promise<OrderItem[]> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ORDER_ITEMS)
      .insert(items)
      .select();

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error adding order items:', error);
    return [];
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<Order | null> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
};

export const updatePaymentStatus = async (orderId: string, paymentStatus: Order['payment_status'], razorpayPaymentId?: string): Promise<Order | null> => {
  try {
    const updates: any = { payment_status: paymentStatus };
    if (razorpayPaymentId) {
      updates.razorpay_payment_id = razorpayPaymentId;
    }

    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    return null;
  }
}; 