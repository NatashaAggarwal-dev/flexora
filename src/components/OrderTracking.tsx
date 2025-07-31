import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Order {
  id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  currency: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const OrderTracking: React.FC = () => {
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<{ order: Order; items: OrderItem[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<'email' | 'orderNumber'>('email');

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const searchOrders = async () => {
    if (!email && !orderNumber) {
      setError('Please enter an email address or order number');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOrders([]);
    setSelectedOrder(null);

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          profiles!inner(email)
        `);

      if (searchType === 'email') {
        query = query.eq('profiles.email', email);
      } else {
        query = query.eq('order_number', orderNumber);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        setOrders(data);
      } else {
        setError('No orders found. Please check your email or order number.');
      }
    } catch (error: any) {
      console.error('Error searching orders:', error);
      setError('Failed to search orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderDetails = async (orderId: string) => {
    try {
      // Get order items
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder({ order, items: items || [] });
      }
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-heading text-gray-900 mb-6">
            Track Your <span className="text-cyan-600">Order</span>
          </h1>
          <p className="text-lg font-body text-gray-600 max-w-2xl mx-auto">
            Enter your email address or order number to track your Flexora order status and delivery updates.
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-subheading text-gray-700 mb-2">
                Search by
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="email"
                    checked={searchType === 'email'}
                    onChange={(e) => setSearchType(e.target.value as 'email' | 'orderNumber')}
                    className="mr-2"
                  />
                  <Mail className="w-4 h-4 mr-1" />
                  Email Address
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="orderNumber"
                    checked={searchType === 'orderNumber'}
                    onChange={(e) => setSearchType(e.target.value as 'email' | 'orderNumber')}
                    className="mr-2"
                  />
                  <Package className="w-4 h-4 mr-1" />
                  Order Number
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type={searchType === 'email' ? 'email' : 'text'}
                value={searchType === 'email' ? email : orderNumber}
                onChange={(e) => {
                  if (searchType === 'email') {
                    setEmail(e.target.value);
                  } else {
                    setOrderNumber(e.target.value);
                  }
                }}
                placeholder={searchType === 'email' ? 'Enter your email address' : 'Enter your order number'}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-body"
              />
            </div>
            <button
              onClick={searchOrders}
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-xl font-subheading hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Search className="w-5 h-5" />
              <span>{isLoading ? 'Searching...' : 'Track Order'}</span>
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {orders.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-gray-900">Your Orders</h2>
            
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="text-lg font-subheading text-gray-900">
                        Order #{order.order_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-subheading border ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="text-lg font-subheading text-gray-900">
                      ₹{order.total_amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => getOrderDetails(order.id)}
                      className="text-cyan-600 hover:text-cyan-500 font-subheading text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {/* Order Details */}
                {selectedOrder && selectedOrder.order.id === order.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-subheading text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2">
                          <div>
                            <p className="font-subheading text-gray-900">{item.product_name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-subheading text-gray-900">₹{item.total_price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-subheading text-gray-900">Payment Status:</span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-subheading text-gray-900">Last Updated:</span>
                        <span className="text-sm text-gray-600">{formatDate(order.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking; 