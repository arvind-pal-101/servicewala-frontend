import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || phone.length !== 10) {
      toast.error('Please enter valid 10-digit phone number');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.forgotPassword({ phone });
      
      toast.success(response.data.message);
      toast.info('Check your email inbox!');
      
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
        <div className="max-w-md mx-auto">
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🔐</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Forgot Password?
              </h1>
              <p className="text-gray-600">
                Enter your phone number and we'll send a password reset link to your email
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  📱 Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxLength="10"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll send reset link to your registered email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-blue-600'
                }`}
              >
                {loading ? '📧 Sending...' : '📧 Send Reset Link'}
              </button>

            </form>

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-primary hover:underline font-medium"
              >
                ← Back to Login
              </Link>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">
                💡 <strong>Note:</strong> Reset link will be sent to the email registered with this phone number. Link expires in 30 minutes.
              </p>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;