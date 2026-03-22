import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bookingAPI, reviewAPI, authAPI, commissionAPI } from '../services/api';
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
const [commission, setCommission] = useState(null);

  useEffect(() => {
  fetchWorkerData();
  fetchBookings();
  fetchCommission();
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
  const fetchCommission = async () => {
  try {
    const response = await commissionAPI.getMyCommission();
    setCommission(response.data.data);
  } catch (error) {
    console.error('Commission fetch error:', error);
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
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">Availability Status</h3>
                <p className="text-gray-600">Let customers know if you're available for new bookings</p>
              </div>
              <button
                onClick={toggleAvailability}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                  worker?.availability?.isAvailable
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                {worker?.availability?.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
              </button>
            </div>
          </div>

          {/* Earnings Summary - NEW! */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 mb-8 border-2 border-green-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">💰 Your Earnings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Pending Earnings */}
              <div className="bg-white rounded-xl p-5 text-center border-2 border-yellow-200">
                <p className="text-gray-600 text-sm mb-1">⏳ Pending Payment</p>
                <p className="text-3xl font-bold text-yellow-600 mb-1">
                  ₹{worker?.earnings?.pending || 0}
                </p>
                <p className="text-xs text-gray-500">Will be paid on Friday</p>
              </div>

              {/* Paid Earnings */}
              <div className="bg-white rounded-xl p-5 text-center border-2 border-green-200">
                <p className="text-gray-600 text-sm mb-1">✅ Total Received</p>
                <p className="text-3xl font-bold text-green-600 mb-1">
                  ₹{worker?.earnings?.paid || 0}
                </p>
                {worker?.earnings?.lastPayoutDate && (
                  <p className="text-xs text-gray-500">
                    Last: {new Date(worker.earnings.lastPayoutDate).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>

              {/* Total Earnings */}
              <div className="bg-white rounded-xl p-5 text-center border-2 border-blue-200">
                <p className="text-gray-600 text-sm mb-1">💵 Total Earnings</p>
                <p className="text-3xl font-bold text-blue-600 mb-1">
                  ₹{worker?.earnings?.total || 0}
                </p>
                <p className="text-xs text-gray-500">All-time</p>
              </div>
            </div>

            {/* Payout Info */}
            {worker?.earnings?.pending > 0 && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold text-gray-800">Next Payout: Friday</p>
                    <p className="text-sm text-gray-600">
                      Admin will transfer ₹{worker.earnings.pending} to your account via UPI/Bank Transfer
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* Tab Headers */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`min-w-[120px] px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'bookings'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📅 Bookings ({bookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`min-w-[120px] px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'images'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📸 Images
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`min-w-[120px] px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  👤 Profile
                </button>
                <button
  onClick={() => setActiveTab('commission')}
  className={`min-w-[120px] px-6 py-4 font-semibold transition-colors ${
    activeTab === 'commission'
      ? 'bg-primary text-white'
      : 'text-gray-600 hover:bg-gray-50'
  }`}
>
  💰 Commission
  {commission?.summary?.pendingCount > 0 && (
    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
      {commission.summary.pendingCount}
    </span>
  )}
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

{/* PAYMENT STATUS - NEW CODE */}
{booking.status === 'completed' && booking.pricing?.finalAmount && (
  <p className="mt-1">
    {booking.payment?.status === 'completed' ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
        💵 Payment Received
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-700">
        ⏳ Payment Pending - ₹{booking.pricing.finalAmount}
      </span>
    )}
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
              {/* Commission Tab */}
{activeTab === 'commission' && (
  <div>
    {!commission?.commissionEnabled ? (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💰</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Commission System</h3>
        <p className="text-gray-600">Commission is currently disabled. No commission will be charged.</p>
      </div>
    ) : (
      <div className="space-y-6">

        {/* Block Warning */}
        {commission?.summary?.isBlocked && (
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🚫</span>
              <div>
                <h3 className="text-xl font-bold text-red-800">Account Blocked!</h3>
                <p className="text-red-700">You have more than 3 pending commissions. Please clear pending commissions to unblock your account.</p>
              </div>
            </div>
          </div>
        )}

        {/* Commission Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-red-50 rounded-xl p-6 text-center">
            <p className="text-gray-600 text-sm mb-1">Pending Commission</p>
            <p className="text-3xl font-bold text-red-600">₹{commission?.summary?.totalPending || 0}</p>
            <p className="text-sm text-red-500">{commission?.summary?.pendingCount || 0} bookings</p>
          </div>
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <p className="text-gray-600 text-sm mb-1">Collected Commission</p>
            <p className="text-3xl font-bold text-green-600">₹{commission?.summary?.totalCollected || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 text-center">
            <p className="text-gray-600 text-sm mb-1">Commission Rate</p>
            <p className="text-3xl font-bold text-blue-600">{commission?.commissionRate || 0}%</p>
          </div>
        </div>

        {/* Pending Commissions List */}
        {commission?.pendingBookings?.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">⏳ Pending Commissions</h3>
            <div className="space-y-4">
              {commission.pendingBookings.map((booking) => (
                <div key={booking._id} className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-bold text-gray-800">Booking: {booking.bookingId}</p>
                      <p className="text-gray-600 text-sm">Customer: {booking.customer?.name}</p>
                      <p className="text-gray-600 text-sm">Amount: ₹{booking.pricing?.finalAmount}</p>
                      <p className="text-red-600 font-bold">Commission Due: ₹{booking.payment?.commissionAmount}</p>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-700">Pay Commission Via:</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={async () => {
                          try {
                            await commissionAPI.payCommission({
                              bookingId: booking._id,
                              paymentMethod: 'upi'
                            });
                            toast.success('Commission payment recorded!');
                            fetchCommission();
                          } catch (error) {
                            toast.error('Failed to record payment');
                          }
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
                      >
                        📱 UPI Transfer
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await commissionAPI.payCommission({
                              bookingId: booking._id,
                              paymentMethod: 'next_booking'
                            });
                            toast.success('Will be deducted from next booking!');
                            fetchCommission();
                          } catch (error) {
                            toast.error('Failed to record payment');
                          }
                        }}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                      >
                        💳 Next Booking
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await commissionAPI.payCommission({
                              bookingId: booking._id,
                              paymentMethod: 'monthly'
                            });
                            toast.success('Added to monthly settlement!');
                            fetchCommission();
                          } catch (error) {
                            toast.error('Failed to record payment');
                          }
                        }}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
                      >
                        📅 Monthly Settlement
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Pending */}
        {commission?.pendingBookings?.length === 0 && (
          <div className="text-center py-8 bg-green-50 rounded-xl">
            <div className="text-5xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-green-800">All Clear!</h3>
            <p className="text-green-600">No pending commissions</p>
          </div>
        )}
      </div>
    )}
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