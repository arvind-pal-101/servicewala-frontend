import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function BookingSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('id');
  const phone = searchParams.get('phone');

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-6xl mb-6 animate-bounce shadow-2xl">
                ✓
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              Your service request has been received
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">What's Next?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Worker Will Call You</h3>
                  <p className="text-gray-600">The worker will contact you on <strong>{phone}</strong> to confirm the booking details.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Service Scheduled</h3>
                  <p className="text-gray-600">Once confirmed, the worker will arrive at your scheduled time.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">3️⃣</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Pay After Service</h3>
                  <p className="text-gray-600">Payment is made after the work is completed to your satisfaction.</p>
                </div>
              </div>
            </div>

            {bookingId && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all"
            >
              Back to Home
            </button>
            
            <button
              onClick={() => navigate('/search')}
              className="w-full px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-blue-50 transition-all"
            >
              Book Another Service
            </button>
          </div>

          {/* Create Account CTA */}
          <div className="mt-8 text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">Want to track your booking?</h3>
            <p className="text-gray-600 mb-4">Create an account to view booking history and get updates</p>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BookingSuccess;