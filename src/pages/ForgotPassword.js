import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');  // ← CHANGED from 'phone'
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);  // ← NEW
  const [sentToEmail, setSentToEmail] = useState('');  // ← NEW

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!identifier) {
      toast.error('Please enter your phone number or email');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.forgotPassword({ identifier });  // ← CHANGED
      
      if (response.data.success) {
        setEmailSent(true);
        setSentToEmail(response.data.email);  // ← SAVE email from response
        toast.success('Password reset link sent!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
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
            
            {!emailSent ? (
              <>
                {/* BEFORE EMAIL SENT */}
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">🔐</div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-gray-600">
                    Enter your phone number or email to reset your password
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div>
  <label className="block text-gray-700 font-medium mb-2">
    📱 Phone Number or 📧 Email
  </label>
  <input
    type="text"
    value={identifier}
    onChange={(e) => setIdentifier(e.target.value)}
    placeholder="9876543210 or your@email.com"  // ← CONSISTENT
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
    required
  />
  <p className="text-sm text-gray-500 mt-2">
    Reset link will be sent to your registered email
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
              </>
            ) : (
              <>
                {/* AFTER EMAIL SENT - SUCCESS STATE */}
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-4xl">✓</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your email!</h2>
                  
                  <p className="text-gray-600 mb-4">
                    We've sent a password reset link to:
                  </p>
                  
                  <p className="text-xl font-semibold text-primary mb-6">
                    {sentToEmail}
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700 text-left">
                      📧 <strong>Check your inbox</strong> and spam folder
                      <br />
                      ⏰ Link expires in <strong>30 minutes</strong>
                      <br />
                      🔒 Click the link to reset your password
                    </p>
                  </div>
                  
                  <Link
                    to="/login"
                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    Back to Login
                  </Link>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;