import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
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

    // Hardcoded admin credentials (for demo)
    // In production, ye backend se verify hoga
    if (formData.email === 'admin@servicewala.com' && formData.password === 'admin123') {
      localStorage.setItem('adminToken', 'admin-token-12345');
      localStorage.setItem('adminEmail', formData.email);
      toast.success('Welcome Admin! 👨‍💼');
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        
        {/* Back to Home */}
        <Link to="/" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">👨‍💼</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Login to manage platform</p>
          </div>

          {/* Demo Credentials Box */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-800 mb-2">Demo Credentials:</p>
            <p className="text-sm text-blue-700">Email: admin@servicewala.com</p>
            <p className="text-sm text-blue-700">Password: admin123</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@servicewala.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
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
                placeholder="Enter admin password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {loading ? 'Logging in...' : 'Login as Admin'}
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Restricted access only
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;