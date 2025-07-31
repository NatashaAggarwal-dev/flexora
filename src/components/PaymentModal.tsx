import React, { useState, useEffect } from 'react';
import { X, CreditCard, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, onSuccess }) => {
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed' | 'idle'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen && paymentStatus === 'idle') {
      startPayment();
    }
  }, [isOpen]);

  const startPayment = async () => {
    setPaymentStatus('processing');
    setProgress(0);

    // Simulate payment processing steps
    const steps = [
      { progress: 20, message: 'Initializing payment...' },
      { progress: 40, message: 'Connecting to payment gateway...' },
      { progress: 60, message: 'Processing payment...' },
      { progress: 80, message: 'Verifying transaction...' },
      { progress: 100, message: 'Completing payment...' }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(step.progress);
    }

    // Simulate payment result (70% success rate)
    const success = Math.random() > 0.3;
    
    if (success) {
      setPaymentStatus('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } else {
      setPaymentStatus('failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Content */}
        <div className="text-center">
          {paymentStatus === 'idle' && (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-heading text-gray-900 mb-4">Payment Processing</h3>
              <p className="text-gray-600 font-body mb-6">
                Please wait while we process your payment of ₹{amount.toFixed(2)}
              </p>
            </>
          )}

          {paymentStatus === 'processing' && (
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader className="w-10 h-10 text-white animate-spin" />
              </div>
              <h3 className="text-2xl font-heading text-gray-900 mb-4">Processing Payment</h3>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div 
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              
              <p className="text-gray-600 font-body">
                {progress < 20 && 'Initializing payment...'}
                {progress >= 20 && progress < 40 && 'Connecting to payment gateway...'}
                {progress >= 40 && progress < 60 && 'Processing payment...'}
                {progress >= 60 && progress < 80 && 'Verifying transaction...'}
                {progress >= 80 && progress < 100 && 'Completing payment...'}
                {progress === 100 && 'Finalizing...'}
              </p>
            </>
          )}

          {paymentStatus === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-heading text-gray-900 mb-4">Payment Successful!</h3>
              <p className="text-gray-600 font-body mb-6">
                Your payment of ₹{amount.toFixed(2)} has been processed successfully.
              </p>
              <div className="bg-green-50 rounded-xl p-4 mb-6">
                <p className="text-green-800 font-subheading">Order ID: {`ORD${Date.now()}`}</p>
                <p className="text-green-600 text-sm">You will receive a confirmation email shortly.</p>
              </div>
            </>
          )}

          {paymentStatus === 'failed' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-heading text-gray-900 mb-4">Payment Failed</h3>
              <p className="text-gray-600 font-body mb-6">
                We couldn't process your payment. Please try again or use a different payment method.
              </p>
              <button
                onClick={startPayment}
                className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-subheading hover:bg-cyan-500 transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 