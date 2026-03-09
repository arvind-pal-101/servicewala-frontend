import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PaymentFailed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const handleRetry = () => {
    if (bookingId) {
      navigate(`/booking/${bookingId}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full">
          
          {/* Failed Animation */}
          <div className="text-center mb-8 animate-scalePop">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-6">
              <span className="text-7xl">❌</span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Payment Failed
            </h1>
            <p className="text-xl text-gray-600">
              We couldn't process your payment
            </p>
          </div>

          {/* Error Details Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6 animate-fadeIn">
            
            {/* Error Banner */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">⚠️</span>
                <div>
                  <h2 className="text-xl font-bold">Transaction Unsuccessful</h2>
                  <p className="text-sm opacity-90">Your payment could not be completed</p>
                </div>
              </div>
            </div>

            {/* Common Reasons */}
            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Common Reasons for Payment Failure:
              </h3>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-xl">•</span>
                  <div>
                    <p className="font-semibold text-gray-800">Insufficient Balance</p>
                    <p className="text-gray-600 text-sm">Please check your account balance</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-xl">•</span>
                  <div>
                    <p className="font-semibold text-gray-800">Incorrect Card Details</p>
                    <p className="text-gray-600 text-sm">Verify card number, expiry, and CVV</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-xl">•</span>
                  <div>
                    <p className="font-semibold text-gray-800">Network Issue</p>
                    <p className="text-gray-600 text-sm">Check your internet connection</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-xl">•</span>
                  <div>
                    <p className="font-semibold text-gray-800">Bank Declined</p>
                    <p className="text-gray-600 text-sm">Contact your bank for details</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-xl">•</span>
                  <div>
                    <p className="font-semibold text-gray-800">Transaction Timeout</p>
                    <p className="text-gray-600 text-sm">Payment window expired</p>
                  </div>
                </li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">💡</span>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Good News!</p>
                    <p className="text-gray-700 text-sm">
                      Your booking is still active. You can try paying again or choose cash payment option.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-3 gap-4 animate-slideInLeft">
            <button
              onClick={handleRetry}
              className="px-6 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all transform hover:scale-105"
            >
              🔄 Retry Payment
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-all"
            >
              📊 My Dashboard
            </button>
            <button
              onClick={() => navigate('/search')}
              className="px-6 py-4 border-2 border-primary text-primary rounded-2xl font-semibold hover:bg-blue-50 transition-all"
            >
              🔍 Browse Services
            </button>
          </div>

          {/* Help Section */}
          <div className="text-center mt-8 p-6 bg-white rounded-2xl shadow-lg">
            <h3 className="font-bold text-gray-800 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you continue to face issues, please contact our support team
            </p>
            <button
              onClick={() => window.location.href = 'mailto:support@servicewala.com'}
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              📧 Contact Support
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default PaymentFailed;