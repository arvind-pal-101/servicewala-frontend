import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkers: 0,
    totalBookings: 0,
    pendingWorkers: 0,
    completedBookings: 0,
    revenue: 0
  });
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchAllData();
  }, []);

  const checkAuth = () => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      toast.error('Please login as admin');
      navigate('/admin/login');
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data.data);

      // Fetch users
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data.data);

      // Fetch workers
      const workersRes = await api.get('/admin/workers');
      setWorkers(workersRes.data.data);

      // Fetch bookings
      const bookingsRes = await api.get('/admin/bookings');
      setBookings(bookingsRes.data.data);

      // Fetch categories
      const categoriesRes = await api.get('/categories');
      setCategories(categoriesRes.data.data);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyWorker = async (workerId) => {
    try {
      await api.put(`/admin/workers/${workerId}/verify`);
      toast.success('Worker verified successfully! ✅');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to verify worker');
    }
  };

  const handleRejectWorker = async (workerId) => {
    const reason = prompt('Reason for rejection:');
    if (!reason) return;

    try {
      await api.put(`/admin/workers/${workerId}/reject`, { reason });
      toast.success('Worker rejected');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to reject worker');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`, { isActive: !currentStatus });
      toast.success(currentStatus ? 'User deactivated' : 'User activated');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    toast.success('Logged out successfully!');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍💼</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-sm opacity-90">ServiceWala Management</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">👥</span>
              <span className="text-sm opacity-80">Users</span>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalUsers}</div>
            <div className="text-sm opacity-90">Total Customers</div>
          </div>

          <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">👨‍🔧</span>
              <span className="text-sm opacity-80">Workers</span>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalWorkers}</div>
            <div className="text-sm opacity-90">
              <span className="bg-yellow-500 px-2 py-1 rounded text-xs">
                {stats.pendingWorkers} Pending
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">📋</span>
              <span className="text-sm opacity-80">Bookings</span>
            </div>
            <div className="text-4xl font-bold mb-1">{stats.totalBookings}</div>
            <div className="text-sm opacity-90">{stats.completedBookings} Completed</div>
          </div>

          <div className="bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl">💰</span>
              <span className="text-sm opacity-80">Revenue</span>
            </div>
            <div className="text-4xl font-bold mb-1">₹{stats.revenue}</div>
            <div className="text-sm opacity-90">Total Earnings</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Tab Headers */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-semibold transition-colors min-w-[150px] ${
                  activeTab === 'overview'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveTab('workers')}
                className={`px-6 py-4 font-semibold transition-colors min-w-[150px] ${
                  activeTab === 'workers'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                👨‍🔧 Workers ({workers.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 font-semibold transition-colors min-w-[150px] ${
                  activeTab === 'users'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                👥 Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-4 font-semibold transition-colors min-w-[150px] ${
                  activeTab === 'bookings'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                📋 Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-4 font-semibold transition-colors min-w-[150px] ${
                  activeTab === 'categories'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                🏷️ Categories ({categories.length})
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Platform Overview</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Recent Activity */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Active Users:</span>
                        <span className="font-bold">{users.filter(u => u.isActive).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Verified Workers:</span>
                        <span className="font-bold">
                          {workers.filter(w => w.verification?.isVerified).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Pending Approvals:</span>
                        <span className="font-bold text-yellow-600">
                          {workers.filter(w => w.verification?.status === 'pending').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Today's Bookings:</span>
                        <span className="font-bold text-green-600">
                          {bookings.filter(b => 
                            new Date(b.createdAt).toDateString() === new Date().toDateString()
                          ).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Platform Health */}
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">💚 Platform Health</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-700">Worker Approval Rate</span>
                          <span className="text-sm font-bold">
                            {workers.length > 0 
                              ? Math.round((workers.filter(w => w.verification?.isVerified).length / workers.length) * 100)
                              : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${workers.length > 0 
                                ? (workers.filter(w => w.verification?.isVerified).length / workers.length) * 100
                                : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-700">Booking Completion Rate</span>
                          <span className="text-sm font-bold">
                            {bookings.length > 0 
                              ? Math.round((stats.completedBookings / bookings.length) * 100)
                              : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ 
                              width: `${bookings.length > 0 
                                ? (stats.completedBookings / bookings.length) * 100
                                : 0}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pending Workers Alert */}
                {workers.filter(w => w.verification?.status === 'pending').length > 0 && (
                  <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-3xl mr-4">⚠️</span>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-yellow-800 mb-1">
                          Pending Worker Approvals
                        </h4>
                        <p className="text-yellow-700">
                          You have {workers.filter(w => w.verification?.status === 'pending').length} workers 
                          waiting for verification. Click on "Workers" tab to review.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('workers')}
                        className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600"
                      >
                        Review Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Workers Tab */}
            {activeTab === 'workers' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Workers Management</h2>
                  <div className="flex space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {workers.filter(w => w.verification?.isVerified).length} Verified
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      {workers.filter(w => w.verification?.status === 'pending').length} Pending
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worker</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {workers.map((worker) => (
                        <tr key={worker._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-gray-900">{worker.name}</div>
                              <div className="text-sm text-gray-500">{worker.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {worker.category?.icon} {worker.category?.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{worker.experience} years</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">₹{worker.hourlyRate}/hr</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {worker.verification?.isVerified ? (
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                ✅ Verified
                              </span>
                            ) : worker.verification?.status === 'rejected' ? (
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                ❌ Rejected
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                ⏳ Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {worker.verification?.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleVerifyWorker(worker._id)}
                                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                  ✅ Approve
                                </button>
                                <button
                                  onClick={() => handleRejectWorker(worker._id)}
                                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                  ❌ Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Users Management</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{user.email || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{user.location?.city || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              user.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? '🟢 Active' : '🔴 Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                              className={`px-3 py-1 rounded ${
                                user.isActive
                                  ? 'bg-red-500 text-white hover:bg-red-600'
                                  : 'bg-green-500 text-white hover:bg-green-600'
                              }`}
                            >
                              {user.isActive ? '🚫 Deactivate' : '✅ Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">All Bookings</h2>
                
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-bold text-gray-800">
                              {booking.category?.icon} {booking.category?.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <p>👤 Customer: {booking.customer?.name}</p>
                            <p>👨‍🔧 Worker: {booking.worker?.name}</p>
                            <p>📅 Date: {new Date(booking.scheduledDate).toLocaleDateString('en-IN')}</p>
                            <p>💰 Amount: ₹{booking.pricing?.finalAmount || 'Pending'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Service Categories</h2>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <div key={category._id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                      <div className="text-4xl mb-2">{category.icon}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;