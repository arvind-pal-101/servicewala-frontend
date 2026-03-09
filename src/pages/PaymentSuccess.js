import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bookingAPI } from '../services/api';

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const paymentId = searchParams.get('paymentId');
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await bookingAPI.getById(bookingId);
      setBooking(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          
          {/* Success Animation */}
          <div className="text-center mb-8 animate-scalePop">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <span className="text-7xl">✅</span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Payment Successful! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              Your payment has been processed successfully
            </p>
          </div>

          {/* Payment Details Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6 animate-fadeIn">
            
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Payment ID</p>
                  <p className="text-lg font-mono">{paymentId || 'Processing...'}</p>
                </div>
                <div className="text-5xl">💳</div>
              </div>
            </div>

            {/* Booking Details */}
            {booking && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Service</span>
                    <span className="font-semibold text-gray-800">
                      {booking.category?.icon} {booking.category?.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Worker</span>
                    <span className="font-semibold text-gray-800">
                      {booking.worker?.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold text-gray-800">
                      {new Date(booking.scheduledDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Time</span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {booking.scheduledTime}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Location</span>
                    <span className="font-semibold text-gray-800">
                      {booking.serviceDetails?.serviceAddress?.city}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-4 bg-green-50 rounded-xl px-4 mt-4">
                    <span className="text-gray-700 text-lg font-medium">Amount Paid</span>
                    <span className="text-3xl font-bold text-green-600">
                      ₹{booking.pricing?.finalAmount || searchParams.get('amount') || '0'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-blue-50 p-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center">
                <span className="text-xl mr-2">📋</span>
                What's Next?
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Worker will arrive at scheduled time</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>You'll receive SMS/Email confirmation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Track your booking in dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Rate your experience after completion</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4 animate-slideInLeft">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              📊 Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/search')}
              className="px-8 py-4 border-2 border-primary text-primary rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all"
            >
              🔍 Book Another Service
            </button>
          </div>

          {/* Receipt Download */}
          <div className="text-center mt-6">
            <button
              onClick={() => window.print()}
              className="text-primary hover:underline font-medium flex items-center justify-center mx-auto"
            >
              <span className="mr-2">🖨️</span>
              Print Receipt
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default PaymentSuccess;