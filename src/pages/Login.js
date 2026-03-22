import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { trackLogin } from '../utils/analytics';

function Login() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrorType(null); // Clear error when user types
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
      setErrorType(null);

      const loginAPI = userType === 'user' 
        ? authAPI.loginUser 
        : authAPI.loginWorker;

      const response = await loginAPI(formData);

      if (response.data.success) {
        trackLogin(userType);
        
        // Save only UI state (NO token - it's in cookie!)
        localStorage.setItem('userType', userType);
        localStorage.setItem('userName', response.data.data.name);
        
        toast.success(`Welcome back, ${response.data.data.name}! 🎉`);

        // Redirect
        const redirectPath = userType === 'worker' ? '/worker/dashboard' : '/dashboard';
        setTimeout(() => {
          window.location.href = redirectPath;
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const errorTypeFromBackend = error.response?.data?.errorType;
      const message = error.response?.data?.message;
      
      setErrorType(errorTypeFromBackend);
      toast.error(message || 'Login failed. Please try again.');
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl">👋</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
              <p className="text-gray-600">Login to continue</p>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setUserType('user');
                    setErrorType(null);
                  }}
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
                  onClick={() => {
                    setUserType('worker');
                    setErrorType(null);
                  }}
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

            <form onSubmit={handleSubmit} className="space-y-5">
              
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

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>

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

            {/* USER NOT FOUND ERROR */}
            {errorType === 'USER_NOT_FOUND' && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg animate-fadeIn">
                <p className="text-sm text-gray-700 mb-3 font-medium">
                  📝 Don't have an account yet?
                </p>
                <Link 
                  to={userType === 'worker' ? '/worker/register' : '/register'}
                  className="block w-full py-3 bg-primary text-white text-center rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                >
                  Create {userType === 'worker' ? 'Worker' : 'Customer'} Account
                </Link>
              </div>
            )}

            {/* WRONG PASSWORD ERROR */}
            {errorType === 'WRONG_PASSWORD' && (
              <div className="mt-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg animate-fadeIn">
                <p className="text-sm text-gray-700 mb-3 font-medium">
                  🔑 Having trouble with your password?
                </p>
                <Link 
                  to="/forgot-password"
                  className="block w-full py-3 bg-orange-500 text-white text-center rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                >
                  Reset Password
                </Link>
              </div>
            )}

            {/* ACCOUNT PENDING VERIFICATION */}
            {(errorType === 'ACCOUNT_PENDING' || errorType === 'ACCOUNT_NOT_VERIFIED') && (
              <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg animate-fadeIn">
                <p className="text-sm text-gray-700 font-medium">
                  ⏳ Your worker account is pending admin verification. You'll receive an email once approved.
                </p>
              </div>
            )}

            {/* ACCOUNT REJECTED */}
            {errorType === 'ACCOUNT_REJECTED' && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg animate-fadeIn">
                <p className="text-sm text-gray-700 font-medium mb-3">
                  ❌ Your application was rejected. Please contact support for details.
                </p>
                <a 
                  href="mailto:support@servicebabu.in"
                  className="block w-full py-3 bg-red-500 text-white text-center rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            )}

            {/* ACCOUNT DEACTIVATED */}
            {errorType === 'ACCOUNT_DEACTIVATED' && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg animate-fadeIn">
                <p className="text-sm text-gray-700 font-medium mb-3">
                  🚫 Your account has been deactivated. Please contact support.
                </p>
                <a 
                  href="mailto:support@servicebabu.in"
                  className="block w-full py-3 bg-red-500 text-white text-center rounded-lg font-semibold hover:bg-red-600 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            )}

            {/* DEFAULT REGISTER LINK (when no error) */}
            {!errorType && (
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
            )}
          </div>

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