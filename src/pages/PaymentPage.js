import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { paymentAPI, bookingAPI } from '../services/api';
import { toast } from 'react-toastify';

function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const amount = searchParams.get('amount');
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');

  useEffect(() => {
    fetchBookingDetails();
    loadRazorpayScript();
  }, [bookingId]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getById(bookingId);
      setBooking(response.data.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      setProcessing(true);

      // Load Razorpay script
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        return;
      }

      // Create order
      const orderResponse = await paymentAPI.createOrder({
        bookingId: bookingId,
        amount: parseFloat(amount)
      });

      const { orderId, amount: orderAmount, currency, keyId } = orderResponse.data.data;

      // Razorpay options
      const options = {
        key: keyId,
        amount: orderAmount,
        currency: currency,
        name: 'ServiceWala',
        description: `Payment for ${booking.category?.name} service`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: bookingId
            });

            if (verifyResponse.data.success) {
              toast.success('Payment successful!');
              navigate(`/payment-success?bookingId=${bookingId}&paymentId=${response.razorpay_payment_id}`);
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed');
            navigate(`/payment-failed?bookingId=${bookingId}`);
          }
        },
        prefill: {
          name: booking.customer?.name || '',
          email: booking.customer?.email || '',
          contact: booking.customer?.phone || ''
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment initiation failed');
      setProcessing(false);
    }
  };

  const handleCashPayment = async () => {
    try {
      setProcessing(true);
      
      // Update booking payment method to cash
      toast.success('Cash payment selected! Worker will collect payment after service.');
      navigate(`/booking/${bookingId}`);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update payment method');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'online') {
      handleOnlinePayment();
    } else {
      handleCashPayment();
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">💳 Payment</h1>
            <p className="text-gray-600">Choose your payment method</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Booking Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-slideInLeft">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Booking Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Service</span>
                  <span className="font-semibold">
                    {booking.category?.icon} {booking.category?.name}
                  </span>
                </div>
                
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Worker</span>
                  <span className="font-semibold">{booking.worker?.name}</span>
                </div>
                
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">
                    {new Date(booking.scheduledDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
                
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold">{booking.scheduledTime}</span>
                </div>
                
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Location</span>
                  <span className="font-semibold">
                    {booking.serviceDetails?.serviceAddress?.city}
                  </span>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 text-lg">Total Amount</span>
                    <span className="text-4xl font-bold text-primary">
                      ₹{amount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-6 animate-slideInRight">
              
              {/* Online Payment */}
              <div
                onClick={() => setPaymentMethod('online')}
                className={`bg-white rounded-2xl shadow-xl p-8 cursor-pointer transition-all transform hover:scale-105 ${
                  paymentMethod === 'online' 
                    ? 'ring-4 ring-primary' 
                    : 'hover:shadow-2xl'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                      💳
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Pay Online</h3>
                      <p className="text-gray-600 text-sm">Credit/Debit/UPI/Wallet</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="w-6 h-6 text-primary"
                  />
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>✅ Instant confirmation</span>
                  <span>•</span>
                  <span>🔒 100% Secure</span>
                </div>
              </div>

              {/* Cash Payment */}
              <div
                onClick={() => setPaymentMethod('cash')}
                className={`bg-white rounded-2xl shadow-xl p-8 cursor-pointer transition-all transform hover:scale-105 ${
                  paymentMethod === 'cash' 
                    ? 'ring-4 ring-primary' 
                    : 'hover:shadow-2xl'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl">
                      💵
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Pay with Cash</h3>
                      <p className="text-gray-600 text-sm">Pay after service completion</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className="w-6 h-6 text-primary"
                  />
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>✅ No advance payment</span>
                  <span>•</span>
                  <span>📝 Pay to worker</span>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed btn-ripple"
              >
                {processing ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span>
                    {paymentMethod === 'online' ? '💳 Pay ₹' + amount : '📝 Confirm Cash Payment'}
                  </span>
                )}
              </button>

              {/* Security Note */}
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default PaymentPage;