import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { bookingAPI, authAPI } from '../services/api';
import { toast } from 'react-toastify';

function UserDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    //checkAuth();
    fetchUserData();
    fetchBookings();
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
{/*
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'user') {
      toast.error('Please login as customer');
      navigate('/login');
    }
  };  
  */}

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      setFavLoading(true);
      const response = await authAPI.getFavorites();
      setFavorites(response.data.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // Silent fail - user might not have favorites yet
    } finally {
      setFavLoading(false);
    }
  };

  const removeFavorite = async (workerId) => {
    try {
      await authAPI.removeFavorite(workerId);
      toast.success('Removed from favorites');
      fetchFavorites(); // Refresh list
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  const handleCancelBooking = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowCancelDialog(true);
  };

  const confirmCancelBooking = async () => {
    try {
      await bookingAPI.cancelBooking(selectedBookingId);
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(b => ['pending', 'accepted', 'in-progress'].includes(b.status));
      case 'completed':
        return bookings.filter(b => b.status === 'completed');
      case 'cancelled':
        return bookings.filter(b => ['cancelled', 'rejected'].includes(b.status));
      default:
        return bookings;
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

  const filteredBookings = getFilteredBookings();
  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => ['pending', 'accepted', 'in-progress'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => ['cancelled', 'rejected'].includes(b.status)).length
  };

  if (loading && bookings.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
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
          <div className="mb-8 animate-fadeIn">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-gray-600">Track and manage your service bookings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg p-6 text-white animate-scalePop">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">📋</span>
                <span className="text-sm opacity-80">Total</span>
              </div>
              <div className="text-4xl font-bold mb-1">{stats.total}</div>
              <div className="text-sm opacity-90">All Bookings</div>
            </div>

            <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg p-6 text-white animate-scalePop" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">⏳</span>
                <span className="text-sm opacity-80">Upcoming</span>
              </div>
              <div className="text-4xl font-bold mb-1">{stats.upcoming}</div>
              <div className="text-sm opacity-90">Active Jobs</div>
            </div>

            <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl shadow-lg p-6 text-white animate-scalePop" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🎉</span>
                <span className="text-sm opacity-80">Completed</span>
              </div>
              <div className="text-4xl font-bold mb-1">{stats.completed}</div>
              <div className="text-sm opacity-90">Finished Jobs</div>
            </div>

            <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg p-6 text-white animate-scalePop" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">🚫</span>
                <span className="text-sm opacity-80">Cancelled</span>
              </div>
              <div className="text-4xl font-bold mb-1">{stats.cancelled}</div>
              <div className="text-sm opacity-90">Closed</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => navigate('/search')}
              className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 smooth-hover"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-2">Book New Service</h3>
                  <p className="opacity-90">Find workers for your next project</p>
                </div>
                <span className="text-5xl">🔍</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 smooth-hover"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-2">Favorite Workers</h3>
                  <p className="opacity-90">Quick access to trusted workers</p>
                </div>
                <span className="text-5xl">⭐</span>
              </div>
            </button>
          </div>

          {/* Bookings Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'all'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📋 All ({stats.total})
                </button>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'upcoming'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  ⏳ Upcoming ({stats.upcoming})
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'completed'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🎉 Completed ({stats.completed})
                </button>
                <button
                  onClick={() => setActiveTab('cancelled')}
                  className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'cancelled'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🚫 Cancelled ({stats.cancelled})
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors ${
                    activeTab === 'favorites'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  ❤️ Favorites ({favorites.length})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              
              {/* BOOKINGS TABS CONTENT */}
              {activeTab !== 'favorites' && (
                <>
                  {filteredBookings.length === 0 ? (
                    <EmptyState
                      icon={
                        activeTab === 'all' ? '📭' :
                        activeTab === 'upcoming' ? '⏳' :
                        activeTab === 'completed' ? '🎉' :
                        '🚫'
                      }
                      title={`No ${activeTab !== 'all' ? activeTab : ''} Bookings`}
                      message={
                        activeTab === 'all' 
                          ? "You haven't made any bookings yet. Start by finding a worker!"
                          : `No ${activeTab} bookings found.`
                      }
                      actionText="🔍 Browse Workers"
                      actionLink="/search"
                    />
                  ) : (
                    <div className="space-y-4">
                      {filteredBookings.map((booking) => (
                        <div
                          key={booking._id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow animate-fadeIn"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-800">
                                  {booking.category?.icon} {booking.category?.name}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                                  {getStatusIcon(booking.status)} {booking.status}
                                </span>
                              </div>
                              
                              <div className="space-y-2 text-gray-600">
                                <p className="font-medium text-gray-800">
                                  👨‍🔧 Worker: {booking.worker?.name || 'Assigned'}
                                </p>
                                <p>📞 {booking.worker?.phone || 'Contact pending'}</p>
                                <p>📅 {new Date(booking.scheduledDate).toLocaleDateString('en-IN')} - {booking.scheduledTime}</p>
                                <p>📍 {booking.serviceDetails?.serviceAddress?.city}</p>
                                <p className="text-sm">
                                  💬 {booking.serviceDetails?.problemDescription?.substring(0, 100)}
                                  {booking.serviceDetails?.problemDescription?.length > 100 && '...'}
                                </p>
                                {booking.pricing?.estimatedCost && (
                                  <p>💰 ₹{booking.pricing.estimatedCost.min} - ₹{booking.pricing.estimatedCost.max}</p>
                                )}
                                {booking.pricing?.finalAmount && (
                                  <p className="font-bold text-green-600">
                                    ✅ Final Amount: ₹{booking.pricing.finalAmount}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => navigate(`/booking/${booking._id}`)}
                              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors btn-ripple"
                            >
                              👁️ View Details
                            </button>

                            {['pending', 'accepted'].includes(booking.status) && (
                              <button
                                onClick={() => handleCancelBooking(booking._id)}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors btn-ripple"
                              >
                                🚫 Cancel Booking
                              </button>
                            )}

                            {booking.status === 'completed' && (
                              <button
                                onClick={() => navigate(`/review/${booking._id}`)}
                                className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors btn-ripple"
                              >
                                ⭐ Write Review
                              </button>
                            )}

                            {booking.status === 'cancelled' && (
                              <button
                                onClick={() => navigate('/search')}
                                className="px-6 py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-blue-50 transition-colors"
                              >
                                🔍 Book Again
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* FAVORITES TAB CONTENT */}
              {activeTab === 'favorites' && (
                <div>
                  {favLoading ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading favorites...</p>
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">❤️</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">No Favorites Yet</h3>
                      <p className="text-gray-600 mb-6">
                        Save workers you trust for quick access later
                      </p>
                      <button
                        onClick={() => navigate('/search')}
                        className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                      >
                        🔍 Browse Workers
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favorites.map((worker) => (
                        <div
                          key={worker._id}
                          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-shadow"
                        >
                          {/* Worker Image */}
                          <div className="flex items-center space-x-4 mb-4">
                            <img
                              src={worker.profileImage?.url || worker.profilePic || 'https://via.placeholder.com/100'}
                              alt={worker.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                            />
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800">{worker.name}</h3>
                              <p className="text-gray-600 flex items-center space-x-1">
                                <span>{worker.category?.icon || '🔧'}</span>
                                <span>{worker.category?.name || 'Worker'}</span>
                              </p>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="text-yellow-500 text-xl">⭐</span>
                            <span className="font-bold text-lg">
                              {worker.ratings?.average?.toFixed(1) || '0.0'}
                            </span>
                            <span className="text-gray-500 text-sm">
                              ({worker.ratings?.count || 0} reviews)
                            </span>
                          </div>

                          {/* Details */}
                          <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <span>💼</span>
                              <span>{worker.experience || 0} years experience</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <span>📍</span>
                              <span>{worker.location?.city || 'Location not set'}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <span>💰</span>
                              <span className="font-semibold text-primary">₹{worker.hourlyRate || 0}/hr</span>
                            </div>
                          </div>

                          {/* Availability */}
                          {worker.availability?.isAvailable ? (
                            <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium mb-4">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              <span>Available</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium mb-4">
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                              <span>Unavailable</span>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => navigate(`/worker/${worker._id}`)}
                              className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
                            >
                              👁️ View Profile
                            </button>
                            <button
                              onClick={() => removeFavorite(worker._id)}
                              className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors text-sm"
                            >
                              ❌ Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Profile Section */}
          {user && (
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">👤 Your Profile</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-1">Name</p>
                    <p className="font-semibold text-lg">{user.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-1">Phone</p>
                    <p className="font-semibold text-lg">{user.phone}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-1">Email</p>
                    <p className="font-semibold text-lg">{user.email || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-sm mb-1">Location</p>
                    <p className="font-semibold text-lg">{user.location?.city || 'Not set'}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toast.info('Profile editing coming soon!')}
                className="mt-6 w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors btn-ripple"
              >
                ✏️ Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={confirmCancelBooking}
        title="Cancel Booking?"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="No, Keep It"
        type="danger"
      />

      <Footer />
    </>
  );
}

export default UserDashboard;