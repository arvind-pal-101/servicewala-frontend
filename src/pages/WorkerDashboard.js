import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bookingAPI, reviewAPI, authAPI } from '../services/api';
import { toast } from 'react-toastify';
import WorkerImageManager from './WorkerImageManager';

function WorkerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    completed: 0,
    totalEarnings: 0
  });

  useEffect(() => {
   // checkAuth();
    fetchWorkerData();
    fetchBookings();
  }, []);

  {/*
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'worker') {
      toast.error('Please login as worker');
      navigate('/login');
    }
  };
  */}

  const fetchWorkerData = async () => {
    try {
      const response = await authAPI.getProfile();
      setWorker(response.data.data);
    } catch (error) {
      console.error('Error fetching worker data:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getWorkerBookings();
      const bookingsData = response.data.data;
      
      setBookings(bookingsData);
      
      // Calculate stats
      const pending = bookingsData.filter(b => b.status === 'pending').length;
      const accepted = bookingsData.filter(b => b.status === 'accepted').length;
      const completed = bookingsData.filter(b => b.status === 'completed').length;
      const totalEarnings = bookingsData
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + (b.pricing?.finalAmount || 0), 0);
      
      setStats({ pending, accepted, completed, totalEarnings });
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId) => {
    try {
      await bookingAPI.acceptBooking(bookingId);
      toast.success('Booking accepted! 🎉');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to accept booking');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      await bookingAPI.rejectBooking(bookingId, { reason: 'Not available' });
      toast.success('Booking rejected');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to reject booking');
    }
  };

  const handleStartService = async (bookingId) => {
    try {
      await bookingAPI.startService(bookingId);
      toast.success('Service started! ⚡');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to start service');
    }
  };

  const handleCompleteService = async (bookingId) => {
    const finalAmount = prompt('Enter final amount (₹):');
    if (!finalAmount) return;

    try {
      await bookingAPI.completeBooking(bookingId, { finalAmount: parseInt(finalAmount) });
      toast.success('Service completed! 💰');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to complete service');
    }
  };

  const toggleAvailability = async () => {
    try {
      const newStatus = !worker?.availability?.isAvailable;
      await authAPI.updateAvailability(newStatus);
      toast.success(newStatus ? 'You are now available!' : 'Marked as unavailable');
      fetchWorkerData();
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      accepted: '✅',
      'in-progress': '⚡',
      completed: '🎉',
      rejected: '❌',
      cancelled: '🚫'
    };
    return icons[status] || '📋';
  };

  if (loading && bookings.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {worker?.name || 'Worker'}! 👨‍🔧
            </h1>
            <p className="text-gray-600">Manage your bookings and earnings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            
            {/* Pending Bookings */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">⏳</span>
                <span className="text-sm opacity-80">Pending</span>
              </div>
              <div className="text-4xl font-bold mb-1">{stats.pending}</div>
              <div className="text-sm opacity-90">New Requests</div>
            </div>

            {/* Accepted */}
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">✅</span>
                <span className="text-sm opacity-80">Accepted</span>
              </div>
              <div className="text-4xl font-bold mb-1">{stats.accepted}</div>
              <div className="text-sm opacity-90">Confirmed Jobs</div>
            </div>

            {/* Completed */}
            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🎉</span>
                <span className="text-sm opacity-80">Completed</span>
              </div>
              <div className="text-4xl font-bold mb-1">{stats.completed}</div>
              <div className="text-sm opacity-90">Finished Jobs</div>
            </div>

            {/* Earnings */}
            <div className="bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">💰</span>
                <span className="text-sm opacity-80">Earnings</span>
              </div>
              <div className="text-4xl font-bold mb-1">₹{stats.totalEarnings}</div>
              <div className="text-sm opacity-90">Total Earned</div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Availability Status</h3>
                <p className="text-gray-600">Let customers know if you're available for new bookings</p>
              </div>
              <button
                onClick={toggleAvailability}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                  worker?.availability?.isAvailable
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {worker?.availability?.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* Tab Headers */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'bookings'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📅 Bookings ({bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'images'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📸 Images
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  👤 Profile
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              
              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📭</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h3>
                      <p className="text-gray-600">New booking requests will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div
                          key={booking._id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-800">
                                  {booking.customer?.name || 'Customer'}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                  {getStatusIcon(booking.status)} {booking.status}
                                </span>
                              </div>
                              <div className="space-y-2 text-gray-600">
                                <p>📞 {booking.customer?.phone}</p>
                                <p>📅 {new Date(booking.scheduledDate).toLocaleDateString('en-IN')} - {booking.scheduledTime}</p>
                                <p>📍 {booking.serviceDetails?.serviceAddress?.address}, {booking.serviceDetails?.serviceAddress?.city}</p>
                                {booking.serviceDetails?.serviceAddress?.coordinates?.latitude != null && booking.serviceDetails?.serviceAddress?.coordinates?.longitude != null && (
                                  <a
                                    href={`https://www.google.com/maps?q=${booking.serviceDetails.serviceAddress.coordinates.latitude},${booking.serviceDetails.serviceAddress.coordinates.longitude}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary text-sm font-medium hover:underline"
                                  >
                                    🗺️ Open in Google Maps
                                  </a>
                                )}
                                <p className="font-medium text-gray-800">
                                  💬 {booking.serviceDetails?.problemDescription}
                                </p>
                                {booking.pricing?.estimatedCost && (
                                  <p>💰 Estimated: ₹{booking.pricing.estimatedCost.min} - ₹{booking.pricing.estimatedCost.max}</p>
                                )}
                                {booking.pricing?.finalAmount && (
                                  <p className="font-bold text-green-600">
                                    ✅ Final Amount: ₹{booking.pricing.finalAmount}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleAcceptBooking(booking._id)}
                                  className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                                >
                                  ✅ Accept
                                </button>
                                <button
                                  onClick={() => handleRejectBooking(booking._id)}
                                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                                >
                                  ❌ Reject
                                </button>
                              </>
                            )}

                            {booking.status === 'accepted' && (
                              <button
                                onClick={() => handleStartService(booking._id)}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                              >
                                ⚡ Start Service
                              </button>
                            )}

                            {booking.status === 'in-progress' && (
                              <button
                                onClick={() => handleCompleteService(booking._id)}
                                className="px-6 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors"
                              >
                                🎉 Complete Service
                              </button>
                            )}

                            <button
                              onClick={() => navigate(`/booking/${booking._id}`)}
                              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                              👁️ View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Images Tab */}
              {activeTab === 'images' && <WorkerImageManager onRefresh={fetchWorkerData} />}

              {/* Profile Tab */}
              {activeTab === 'profile' && worker && (
                <div>
                  <div className="max-w-2xl">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h3>
                    
                    <div className="space-y-6">
                      
                      {/* Profile Picture */}
                      <div className="flex items-center space-x-6">
                        <img
                          src={worker.profileImage?.url || worker.profilePic || 'https://via.placeholder.com/150'}
                          alt={worker.name}
                          className="w-24 h-24 rounded-full border-4 border-primary object-cover"
                        />
                        <div>
                          <h4 className="text-xl font-bold text-gray-800">{worker.name}</h4>
                          <p className="text-gray-600">{worker.category?.name}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-yellow-500 text-xl">⭐</span>
                            <span className="font-bold">{worker.ratings?.average?.toFixed(1) || '0.0'}</span>
                            <span className="text-gray-500">({worker.ratings?.count || 0} reviews)</span>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600 text-sm mb-1">Phone</p>
                          <p className="font-semibold">{worker.phone}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600 text-sm mb-1">Email</p>
                          <p className="font-semibold">{worker.email || 'Not provided'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600 text-sm mb-1">Experience</p>
                          <p className="font-semibold">{worker.experience} years</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600 text-sm mb-1">Hourly Rate</p>
                          <p className="font-semibold">₹{worker.hourlyRate}/hr</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600 text-sm mb-1">Location</p>
                          <p className="font-semibold">{worker.location?.city}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-600 text-sm mb-1">Verification</p>
                          <p className={`font-semibold ${
                            worker.verification?.isVerified ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {worker.verification?.isVerified ? '✅ Verified' : '⏳ Pending'}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                        <h4 className="font-bold text-gray-800 mb-4">Your Stats</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-600 text-sm">Total Bookings</p>
                            <p className="text-2xl font-bold text-primary">{worker.totalBookings || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Completed Jobs</p>
                            <p className="text-2xl font-bold text-green-600">{worker.completedBookings || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Total Earnings</p>
                            <p className="text-2xl font-bold text-purple-600">₹{worker.earnings?.total || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">This Month</p>
                            <p className="text-2xl font-bold text-orange-600">₹{worker.earnings?.thisMonth || 0}</p>
                          </div>
                        </div>
                      </div>

                      {/* Edit Profile Button */}
                      <button
                        onClick={() => toast.info('Profile editing coming soon!')}
                        className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                      >
                        ✏️ Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default WorkerDashboard;