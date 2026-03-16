import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

const PUBLIC_PATHS = ['/', '/login', '/register', '/worker/register', '/admin/login', '/forgot-password', '/reset-password', '/about', '/services', '/contact', '/faq', '/terms', '/privacy', '/refund-policy', '/search'];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const path = location.pathname;
    const isPublicPath = PUBLIC_PATHS.some(p => path === p || path.startsWith(p + '/'));
    const hasToken = localStorage.getItem('token');

    // On public pages with no token, skip API call to avoid 401 noise in console
    if (isPublicPath && !hasToken) {
      setIsLoggedIn(false);
      setIsCheckingAuth(false);
      return;
    }

    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        setIsLoggedIn(true);
        setUserName(response.data.data.name || 'User');
        const type = response.data.data.category ? 'worker' : response.data.data.role === 'admin' ? 'admin' : 'user';
        setUserType(type);
        localStorage.setItem('userName', response.data.data.name);
        localStorage.setItem('userType', type);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userType');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API to clear cookie
      await authAPI.logout();
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userType');
      
      // Update state
      setIsLoggedIn(false);
      setUserName('');
      setUserType('');
      
      toast.success('Logged out successfully! 👋');
      navigate('/');
    } catch (error) {
      // Even if logout API fails, clear local state
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      localStorage.removeItem('userType');
      setIsLoggedIn(false);
      toast.success('Logged out successfully! 👋');
      navigate('/');
    }
  };

  const getDashboardLink = () => {
    if (userType === 'admin') return '/admin/dashboard';
    return userType === 'worker' ? '/worker/dashboard' : '/dashboard';
  };

  // Show nothing while checking auth (prevents flash of login button)
  if (isCheckingAuth) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SW</span>
              </div>
              <span className="text-2xl font-bold gradient-text hidden sm:block">ServiceBabu</span>
            </Link>
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">SB</span>
            </div>
            <span className="text-2xl font-bold gradient-text hidden sm:block">ServiceBabu</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Home
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-primary font-medium transition-colors">
              Find Workers
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-gray-700 hover:text-primary font-medium transition-colors"
                >
                  Dashboard
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary font-medium transition-colors"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block">{userName}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-100">
                      <Link
                        to={getDashboardLink()}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        👤 My Profile
                      </Link>
                      {userType === 'user' && (
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          📋 My Bookings
                        </Link>
                      )}
                      {userType === 'worker' && (
                        <Link
                          to="/worker/dashboard"
                          className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          💼 My Jobs
                        </Link>
                      )}
                      <hr className="my-2" />
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-primary border-2 border-primary rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Find Workers
              </Link>
              
              {isLoggedIn ? (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="px-4 py-2 text-gray-600 font-medium">
                    👤 {userName}
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-primary hover:bg-blue-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-primary text-white rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;