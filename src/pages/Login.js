import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { trackLogin } from '../utils/analytics';

function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('user'); // 'user' or 'worker'
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.phone || !formData.password) {
    toast.error('Please fill all fields');
    return;
  }

  if (formData.phone.length !== 10) {
    toast.error('Please enter valid 10-digit phone number');
    return;
  }

  try {
    setLoading(true);

    const loginAPI = userType === 'user' 
      ? authAPI.loginUser 
      : authAPI.loginWorker;

    const response = await loginAPI(formData);

    if (response.data.success) {
      
      trackLogin(userType); // Track login
      
      // Token in httpOnly cookie - use 'auth' flag for UI checks (isLoggedIn, favorites, etc.)
      localStorage.setItem('token', 'authenticated');
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', response.data.data.name);
      
      toast.success(`Welcome back, ${response.data.data.name}! 🎉`);

      const redirectPath = userType === 'worker' ? '/worker/dashboard' : '/dashboard';

// Force hard redirect (navigate not working, use window.location)
setTimeout(() => {
  window.location.href = redirectPath;
}, 500);  // Increased delay for toast
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Invalid credentials');
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl">👋</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
              <p className="text-gray-600">Login to continue</p>
            </div>

            {/* User Type Toggle */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('user')}
                  className={`py-3 rounded-xl font-semibold transition-all ${
                    userType === 'user'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  👤 Customer
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('worker')}
                  className={`py-3 rounded-xl font-semibold transition-all ${
                    userType === 'worker'
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  👨‍🔧 Worker
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  maxLength="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  required
                />
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Logging in...</span>
                  </span>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to={userType === 'worker' ? '/worker/register' : '/register'}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign up as {userType === 'worker' ? 'Worker' : 'Customer'}
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-gray-500 text-sm mt-6">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Login;