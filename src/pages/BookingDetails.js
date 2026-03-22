import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bookingAPI } from '../services/api';
import { toast } from 'react-toastify';

function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const userType = localStorage.getItem('userType');

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getById(id);
      setBooking(response.data.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      await bookingAPI.acceptBooking(id);
      toast.success('Booking accepted! 🎉');
      fetchBooking();
    } catch (error) {
      toast.error('Failed to accept booking');
    }
  };

  const handleReject = async () => {
    try {
      await bookingAPI.rejectBooking(id);
      toast.success('Booking rejected');
      fetchBooking();
    } catch (error) {
      toast.error('Failed to reject booking');
    }
  };

  const handleStartService = async () => {
    try {
      await bookingAPI.startService(id);
      toast.success('Service started! ⚡');
      fetchBooking();
    } catch (error) {
      toast.error('Failed to start service');
    }
  };

  const handleComplete = async () => {
    const finalAmount = prompt('Enter final amount (₹):');
    if (!finalAmount) return;

    try {
      await bookingAPI.completeBooking(id, { finalAmount: parseInt(finalAmount) });
      toast.success('Service completed! 💰');
      fetchBooking();
    } catch (error) {
      toast.error('Failed to complete service');
    }
  };
  const handleConfirmCash = async () => {
  // Get the final amount from booking (already set during service completion)
  const finalAmount = booking?.pricing?.finalAmount;

  if (!finalAmount) {
    toast.error('Unable to get booking amount. Please complete service first.');
    return;
  }

  // Simple Yes/No confirmation with the FIXED amount
  const confirmed = window.confirm(
    `Confirm you received ₹${finalAmount} cash from customer?\n\n` +
    `Service Amount: ₹${finalAmount}\n` +
    `Click OK to confirm receipt of cash payment.`
  );

  if (!confirmed) {
    return;
  }

  try {
    await bookingAPI.confirmCashPayment(id, { finalAmount: finalAmount });  // ✅ Uses correct amount
    toast.success(`💵 Cash payment confirmed! ₹${finalAmount} received`);
    fetchBooking();
  } catch (error) {
    toast.error('Failed to confirm cash payment');
  }
};

  const handleCancel = async () => {
    const reason = prompt('Reason for cancellation:');
    if (!reason) return;

    try {
      await bookingAPI.cancelBooking(id);
      toast.success('Booking cancelled');
      fetchBooking();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      accepted: 'bg-blue-100 text-blue-800 border-blue-300',
      'in-progress': 'bg-purple-100 text-purple-800 border-purple-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="text-primary hover:underline mb-4 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back</span>
            </button>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
  <div>
    <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
      Booking Details
    </h1>
    <p className="text-gray-600 text-sm sm:text-base">Booking ID: {booking.bookingId || booking._id}</p>
  </div>
  <div className={`px-4 py-2 sm:px-6 sm:py-3 rounded-xl border-2 font-bold text-sm sm:text-lg self-start sm:self-auto ${getStatusColor(booking.status)}`}>
    {getStatusIcon(booking.status)} {booking.status.toUpperCase()}
  </div>
</div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column - Booking Info */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Customer Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  👤 Customer Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600 w-24">Name:</span>
                    <span className="font-semibold">{booking.customer?.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600 w-24">Phone:</span>
                    <span className="font-semibold">{booking.customer?.phone}</span>
                  </div>
                  {booking.customer?.email && (
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600 w-24">Email:</span>
                      <span className="font-semibold">{booking.customer.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Worker Info (for customers) */}
              {userType === 'user' && booking.worker && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    👨‍🔧 Worker Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600 w-24">Name:</span>
                      <span className="font-semibold">{booking.worker?.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600 w-24">Phone:</span>
                      <span className="font-semibold">{booking.worker?.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-600 w-24">Category:</span>
                      <span className="font-semibold">{booking.category?.name}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Details */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  🔧 Service Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm text-gray-600 mb-1">Category</h3>
                    <p className="font-semibold text-lg">
                      {booking.category?.icon} {booking.category?.name}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600 mb-1">Problem Description</h3>
                    <p className="font-semibold">{booking.serviceDetails?.problemDescription}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600 mb-1">Service Address</h3>
                    <p className="font-semibold">
                      {booking.serviceDetails?.serviceAddress?.address}, {booking.serviceDetails?.serviceAddress?.city}
                      {booking.serviceDetails?.serviceAddress?.pincode && ` - ${booking.serviceDetails.serviceAddress.pincode}`}
                    </p>
                    {booking.serviceDetails?.serviceAddress?.coordinates?.latitude != null && booking.serviceDetails?.serviceAddress?.coordinates?.longitude != null && (
                      <a
                        href={`https://www.google.com/maps?q=${booking.serviceDetails.serviceAddress.coordinates.latitude},${booking.serviceDetails.serviceAddress.coordinates.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm font-medium hover:underline mt-1 inline-block"
                      >
                        🗺️ Open in Google Maps
                      </a>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600 mb-1">Scheduled Date & Time</h3>
                    <p className="font-semibold">
                      📅 {new Date(booking.scheduledDate).toLocaleDateString('en-IN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="font-semibold capitalize">
                      🕐 {booking.scheduledTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  📅 Timeline
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-gray-600">Booked:</span>
                    <span className="font-semibold">
                      {new Date(booking.timeline?.bookedAt || booking.createdAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                  {booking.timeline?.acceptedAt && (
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-600">Accepted:</span>
                      <span className="font-semibold">
                        {new Date(booking.timeline.acceptedAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  {booking.timeline?.startedAt && (
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      <span className="text-gray-600">Started:</span>
                      <span className="font-semibold">
                        {new Date(booking.timeline.startedAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  {booking.timeline?.completedAt && (
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold">
                        {new Date(booking.timeline.completedAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                  {booking.timeline?.cancelledAt && (
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span className="text-gray-600">Cancelled:</span>
                      <span className="font-semibold">
                        {new Date(booking.timeline.cancelledAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Actions & Pricing */}
            <div className="space-y-6">
              
              {/* Pricing */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">💰 Pricing</h2>
                <div className="space-y-3">
                  {booking.pricing?.estimatedCost && (
                    <div>
                      <p className="text-sm text-gray-600">Estimated Cost</p>
                      <p className="font-bold text-lg">
                        ₹{booking.pricing.estimatedCost.min} - ₹{booking.pricing.estimatedCost.max}
                      </p>
                    </div>
                  )}
                  {booking.pricing?.finalAmount && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">Final Amount</p>
                      <p className="font-bold text-2xl text-green-600">
                        ₹{booking.pricing.finalAmount}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold capitalize">{booking.payment?.method || 'Cash'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <p className={`font-semibold capitalize ${
                      booking.payment?.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {booking.payment?.status || 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions - WORKER */}
              {userType === 'worker' && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Actions</h2>
                  <div className="space-y-3">
                    
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={handleAccept}
                          className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                        >
                          ✅ Accept Booking
                        </button>
                        <button
                          onClick={handleReject}
                          className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                          ❌ Reject Booking
                        </button>
                      </>
                    )}

                    {booking.status === 'accepted' && (
                      <button
                        onClick={handleStartService}
                        className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                      >
                        ⚡ Start Service
                      </button>
                    )}

                    {booking.status === 'in-progress' && (
                      <button
                        onClick={handleComplete}
                        className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                      >
                        🎉 Complete Service
                      </button>
                    )}
                    {/* CONFIRM CASH PAYMENT - Only for CASH payments */}
{booking.status === 'completed' && 
 booking.payment?.status === 'pending' &&
 booking.payment?.method === 'cash' && (
  <button
    onClick={handleConfirmCash}
    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
  >
    💵 Confirm Cash Received - ₹{booking.pricing?.finalAmount}
  </button>
)}

{/* WAITING FOR ONLINE PAYMENT */}
{booking.status === 'completed' && 
 booking.payment?.status === 'pending' &&
 booking.payment?.method === 'online' && (
  <div className="w-full px-6 py-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
    <p className="text-blue-800 font-semibold text-center mb-1">
      ⏳ Waiting for Online Payment
    </p>
    <p className="text-blue-700 text-sm text-center">
      Customer will complete payment of ₹{booking.pricing?.finalAmount} online
    </p>
  </div>
)}

{['pending', 'accepted'].includes(booking.status) && (
                      <button
                        onClick={handleCancel}
                        className="w-full px-6 py-3 border-2 border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                      >
                        🚫 Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Actions - CUSTOMER */}
{userType === 'user' && (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Actions</h2>
    <div className="space-y-3">
      
      {/* PAY NOW BUTTON - Shows for accepted/in-progress/completed if not paid */}
      {['accepted', 'in-progress', 'completed'].includes(booking.status) && 
       booking.payment?.status === 'pending' && (
        <button
          onClick={() => navigate(`/payment/${booking._id}?amount=${booking.pricing?.finalAmount || booking.pricing?.estimatedCost?.max || 500}`)}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
        >
          💳 Pay Now - ₹{booking.pricing?.finalAmount || booking.pricing?.estimatedCost?.max || 500}
        </button>
      )}

      {/* PAYMENT COMPLETED - Shows when paid */}
      {booking.payment?.status === 'completed' && (
        <div className="w-full px-6 py-3 bg-green-100 text-green-800 rounded-lg font-semibold flex items-center justify-center space-x-2">
          <span>✅</span>
          <span>Payment Completed</span>
        </div>
      )}

      {/* CASH PAYMENT NOTE - For completed bookings with pending payment */}
      {booking.status === 'completed' && 
       booking.payment?.status === 'pending' && (
        <div className="w-full px-6 py-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
          <p className="text-yellow-800 font-semibold text-center mb-1">💵 Payment Pending</p>
          <p className="text-yellow-700 text-sm text-center">
            Pay online above or pay ₹{booking.pricing?.finalAmount} cash to worker
          </p>
        </div>
      )}

      {/* CANCEL BUTTON */}
      {['pending', 'accepted'].includes(booking.status) && (
        <button
          onClick={handleCancel}
          className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
        >
          🚫 Cancel Booking
        </button>
      )}
      
      {/* REVIEW BUTTON */}
      {booking.status === 'completed' && (
        <button
          onClick={() => navigate(`/review/${booking._id}`)}
          className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          ⭐ Write Review
        </button>
      )}
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

export default BookingDetails;