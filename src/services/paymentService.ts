import { supabase, TABLES } from '../lib/supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number;
  currency: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
}

export const initializeRazorpay = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(script);
  });
};

export const createPaymentOrder = async (options: PaymentOptions) => {
  try {
    // For testing, we'll use a mock order creation
    // In production, this would be a call to your backend
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id: orderId,
      amount: options.amount * 100, // Razorpay expects amount in paise
      currency: options.currency,
      receipt: orderId,
    };
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
};

// Mock payment function for testing without Razorpay
export const initiateMockPayment = async (options: PaymentOptions) => {
  return new Promise((resolve, reject) => {
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for testing
      
      if (success) {
        resolve({
          razorpay_payment_id: `pay_${Date.now()}`,
          razorpay_order_id: `order_${Date.now()}`,
          razorpay_signature: 'mock_signature'
        });
      } else {
        reject(new Error('Payment failed'));
      }
    }, 2000);
  });
};

// Update payment status in database
export const updatePaymentStatus = async (orderId: string, status: string, paymentId?: string) => {
  try {
    const updates: any = { payment_status: status };
    if (paymentId) {
      updates.razorpay_payment_id = paymentId;
    }

    const { error } = await supabase
      .from(TABLES.ORDERS)
      .update(updates)
      .eq('id', orderId);

    if (error) throw error;
    console.log('Payment status updated:', status);
  } catch (error) {
    console.error('Error updating payment status:', error);
  }
};

export const initiatePayment = async (options: PaymentOptions) => {
  try {
    await initializeRazorpay();
    
    const order = await createPaymentOrder(options);
    
    const paymentOptions = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Razorpay test key
      amount: order.amount,
      currency: order.currency,
      name: 'Flexora',
      description: options.description,
      order_id: order.id,
      handler: function (response: any) {
        console.log('Payment successful:', response);
        // Update payment status in database
        updatePaymentStatus(options.orderId, 'paid', response.razorpay_payment_id);
        alert('Payment successful! Order ID: ' + response.razorpay_order_id);
      },
      prefill: {
        name: options.customerName,
        email: options.customerEmail,
        contact: options.customerPhone,
      },
      theme: {
        color: '#0891b2', // cyan-600
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed');
        }
      },
      // Simplified test mode - just UPI and cards
      config: {
        display: {
          blocks: {
            banks: {
              name: "Pay using UPI",
              instruments: [
                {
                  method: "upi"
                }
              ]
            },
            cards: {
              name: "Pay using Cards",
              instruments: [
                {
                  method: "card"
                }
              ]
            }
          },
          sequence: ["block.banks", "block.cards"],
          preferences: {
            show_default_blocks: false
          }
        }
      }
    };

    const razorpay = new window.Razorpay(paymentOptions);
    razorpay.open();
    
    return razorpay;
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw error;
  }
}; 