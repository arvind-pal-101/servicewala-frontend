import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { bookingAPI, reviewAPI } from '../services/api';
import { toast } from 'react-toastify';

function WriteReview() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getById(bookingId);
      const bookingData = response.data.data;
      
      if (bookingData.status !== 'completed') {
        toast.error('You can only review completed bookings');
        navigate('/dashboard');
        return;
      }
      
      setBooking(bookingData);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      setSubmitting(true);

      await reviewAPI.create({
        worker: booking.worker?._id || booking.worker,
        booking: bookingId,
        rating,
        comment: comment.trim()
      });

      toast.success('Thank you for your review! ⭐');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
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
        <div className="max-w-2xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-4xl">⭐</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Write a Review
            </h1>
            <p className="text-gray-600">Share your experience with {booking?.worker?.name}</p>
          </div>

          {/* Review Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            
            {/* Booking Info */}
            <div className="mb-8 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-2">Service Details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📋 {booking?.category?.icon} {booking?.category?.name}</p>
                <p>👨‍🔧 Worker: {booking?.worker?.name}</p>
                <p>📅 Date: {new Date(booking?.scheduledDate).toLocaleDateString('en-IN')}</p>
                <p>💰 Amount: ₹{booking?.pricing?.finalAmount}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Star Rating */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-4 text-center">
                  How would you rate this service?
                </label>
                <div className="flex justify-center items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transform transition-all hover:scale-125 focus:outline-none"
                    >
                      <svg
                        className={`w-16 h-16 ${
                          star <= (hoveredRating || rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center mt-4 text-2xl font-bold text-gray-800">
                    {rating === 1 && '😞 Poor'}
                    {rating === 2 && '😕 Below Average'}
                    {rating === 3 && '😐 Average'}
                    {rating === 4 && '😊 Good'}
                    {rating === 5 && '🤩 Excellent'}
                  </p>
                )}
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-2">
                  Tell us about your experience
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like? What could be improved?"
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none resize-none"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Minimum 10 characters ({comment.length}/10)
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || rating === 0 || comment.length < 10}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  submitting || rating === 0 || comment.length < 10
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </span>
                ) : (
                  '⭐ Submit Review'
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>

          {/* Review Tips */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-3">💡 Tips for writing a great review:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✅ Be specific about what you liked or didn't like</li>
              <li>✅ Mention the worker's professionalism and quality of work</li>
              <li>✅ Include details about timing and communication</li>
              <li>✅ Be honest but respectful</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default WriteReview;