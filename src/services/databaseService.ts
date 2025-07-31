import { supabase, User, UserAddress, Product, Order, OrderItem, Payment, OrderTracking } from '../lib/supabase';

// ==================== USER OPERATIONS ====================

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) throw error;
  return data;
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) throw error;
};

// ==================== ADDRESS OPERATIONS ====================

export const getUserAddresses = async (userId: string): Promise<UserAddress[]> => {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createUserAddress = async (addressData: Partial<UserAddress>): Promise<UserAddress> => {
  const { data, error } = await supabase
    .from('user_addresses')
    .insert([addressData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateUserAddress = async (addressId: string, updates: Partial<UserAddress>): Promise<UserAddress> => {
  const { data, error } = await supabase
    .from('user_addresses')
    .update(updates)
    .eq('id', addressId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteUserAddress = async (addressId: string): Promise<void> => {
  const { error } = await supabase
    .from('user_addresses')
    .delete()
    .eq('id', addressId);

  if (error) throw error;
};

export const setDefaultAddress = async (userId: string, addressId: string): Promise<void> => {
  // First, remove default from all addresses
  await supabase
    .from('user_addresses')
    .update({ is_default: false })
    .eq('user_id', userId);

  // Then set the new default
  const { error } = await supabase
    .from('user_addresses')
    .update({ is_default: true })
    .eq('id', addressId);

  if (error) throw error;
};

// ==================== PRODUCT OPERATIONS ====================

export const getAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error) throw error;
  return data;
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// ==================== ORDER OPERATIONS ====================

export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
};

export const getOrderByNumber = async (orderNumber: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single();

  if (error) throw error;
  return data;
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<Order> => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const cancelOrder = async (orderId: string): Promise<Order> => {
  return updateOrderStatus(orderId, 'cancelled');
};

// ==================== ORDER ITEMS OPERATIONS ====================

export const createOrderItems = async (orderItems: Partial<OrderItem>[]): Promise<OrderItem[]> => {
  const { data, error } = await supabase
    .from('order_items')
    .insert(orderItems)
    .select();

  if (error) throw error;
  return data || [];
};

export const getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) throw error;
  return data || [];
};

// ==================== PAYMENT OPERATIONS ====================

export const createPayment = async (paymentData: Partial<Payment>): Promise<Payment> => {
  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePaymentStatus = async (paymentId: string, status: Payment['payment_status']): Promise<Payment> => {
  const { data, error } = await supabase
    .from('payments')
    .update({ payment_status: status })
    .eq('id', paymentId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPaymentByOrderId = async (orderId: string): Promise<Payment | null> => {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .single();

  if (error) throw error;
  return data;
};

// ==================== ORDER TRACKING OPERATIONS ====================

export const createOrderTracking = async (trackingData: Partial<OrderTracking>): Promise<OrderTracking> => {
  const { data, error } = await supabase
    .from('order_tracking')
    .insert([trackingData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getOrderTracking = async (orderId: string): Promise<OrderTracking[]> => {
  const { data, error } = await supabase
    .from('order_tracking')
    .select('*')
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
};

// ==================== UTILITY FUNCTIONS ====================

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `FLEX-${timestamp}-${random}`;
};

export const generateTrackingNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TRK-${timestamp}-${random}`;
};

// ==================== AGGREGATE QUERIES ====================

export const getUserOrderHistory = async (userId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      payments (*),
      order_tracking (*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getOrderDetails = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*),
      payments (*),
      order_tracking (*)
    `)
    .eq('id', orderId)
    .single();

  if (error) throw error;
  return data;
};

// ==================== ADMIN FUNCTIONS ====================

export const getAllOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getDashboardStats = async () => {
  // Get total orders
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });

  // Get total users
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  // Get total revenue
  const { data: payments } = await supabase
    .from('payments')
    .select('amount')
    .eq('payment_status', 'paid');

  const totalRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  return {
    totalOrders: totalOrders || 0,
    totalUsers: totalUsers || 0,
    totalRevenue
  };
}; 