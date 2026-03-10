import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.resetPassword(token, { password });
      
      toast.success(response.data.message);
      toast.success('Redirecting to login...');
      
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
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
              <div className="text-6xl mb-4">🔑</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  🔒 New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    minLength="6"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  🔒 Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  minLength="6"
                  required
                />
              </div>

              {password && confirmPassword && (
                <div className={`p-3 rounded-lg text-sm ${
                  password === confirmPassword
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {password === confirmPassword ? '✅ Passwords match' : '❌ Passwords do not match'}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || password !== confirmPassword}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                  loading || password !== confirmPassword
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-blue-600'
                }`}
              >
                {loading ? '🔄 Resetting...' : '✅ Reset Password'}
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

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-gray-600">
                ⚠️ <strong>Note:</strong> After resetting, you'll be redirected to login with your new password.
              </p>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResetPassword;