import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { workerAPI, reviewAPI } from '../services/api';
import { toast } from 'react-toastify';

function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkerDetails();
    fetchReviews();
  }, [id]);

  const fetchWorkerDetails = async () => {
    try {
      setLoading(true);
      const response = await workerAPI.getById(id);
      setWorker(response.data.data);
    } catch (error) {
      console.error('Error fetching worker:', error);
      toast.error('Failed to load worker details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewAPI.getWorkerReviews(id);
      setReviews(response.data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleBookNow = () => {
    navigate(`/book/${id}`);
  };

  const handleCall = () => {
    if (worker?.phone) {
      window.location.href = `tel:${worker.phone}`;
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading worker details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!worker) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Worker Not Found</h2>
            <button
              onClick={() => navigate('/search')}
              className="mt-4 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600"
            >
              Browse Workers
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

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Worker Header Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="md:flex">
              
              {/* Worker Photo */}
              <div className="md:w-1/3 bg-gradient-to-br from-blue-100 to-purple-100 relative">
                {worker.profilePic && worker.profilePic !== 'https://via.placeholder.com/150' ? (
                  <img 
                    src={worker.profilePic} 
                    alt={worker.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-96 md:h-full flex items-center justify-center">
                    <span className="text-9xl">👨‍🔧</span>
                  </div>
                )}
                
                {/* Verified Badge */}
                {worker.verification?.isVerified && (
                  <div className="absolute top-4 right-4 bg-success text-white px-4 py-2 rounded-full font-semibold flex items-center space-x-2 shadow-lg">
                    <span className="text-xl">✓</span>
                    <span>Verified</span>
                  </div>
                )}

                {/* Availability Badge */}
                {worker.availability?.isAvailable && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                    🟢 Available Now
                  </div>
                )}
              </div>

              {/* Worker Info */}
              <div className="md:w-2/3 p-8">
                
                {/* Name & Category */}
                <div className="mb-6">
                  <h1 className="text-4xl font-bold text-gray-800 mb-3">{worker.name}</h1>
                  <div className="flex items-center space-x-3 text-xl text-gray-600">
                    <span className="text-3xl">{worker.category?.icon || '🔧'}</span>
                    <span className="font-semibold">{worker.category?.name || 'Service Provider'}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500 text-3xl">⭐</span>
                    <span className="text-3xl font-bold text-gray-800">
                      {worker.ratings?.average?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <span className="text-gray-600 text-lg">
                    ({worker.ratings?.count || 0} reviews)
                  </span>
                </div>

                {/* Key Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">💼</span>
                      <span className="text-gray-600 font-medium">Experience</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      {worker.experience || 0} years
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">✅</span>
                      <span className="text-gray-600 font-medium">Completed</span>
                    </div>
                    <p className="text-2xl font-bold text-success">
                      {worker.completedBookings || 0} jobs
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-3 mb-6 text-gray-600">
                  <span className="text-2xl">📍</span>
                  <span className="text-lg">
                    {worker.location?.city || 'Location not specified'}
                  </span>
                </div>

                {/* Hourly Rate - Prominent */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">Hourly Rate</p>
                      <p className="text-5xl font-bold text-primary">
                        ₹{worker.hourlyRate || 0}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">per hour</p>
                    </div>
                    <div className="text-6xl">💰</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCall}
                    className="px-6 py-4 border-2 border-primary text-primary rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center space-x-2"
                  >
                    <span className="text-2xl">📞</span>
                    <span>Call Now</span>
                  </button>
                  <button
                    onClick={handleBookNow}
                    className="px-6 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
                  >
                    <span className="text-2xl">📅</span>
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          {worker.bio && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>📝</span>
                <span>About</span>
              </h2>
              <p className="text-gray-600 leading-relaxed">{worker.bio}</p>
            </div>
          )}

          {/* Services Areas */}
          {worker.location?.serviceAreas && worker.location.serviceAreas.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <span>🗺️</span>
                <span>Service Areas</span>
              </h2>
              <div className="flex flex-wrap gap-3">
                {worker.location.serviceAreas.map((area, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 bg-blue-50 text-primary rounded-full font-medium"
                  >
                    📍 {area}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {worker.portfolio && worker.portfolio.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <span>🖼️</span>
                <span>Portfolio</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {worker.portfolio.map((photo, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                    <img 
                      src={typeof photo === 'string' ? photo : photo.url} 
                      alt={typeof photo === 'object' && photo.title ? photo.title : `Work ${index + 1}`}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {typeof photo === 'object' && photo.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <p className="text-white font-medium">{photo.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
              <span>⭐</span>
              <span>Reviews ({reviews.length})</span>
            </h2>

            {reviews.length > 0 ? (
              <>
                {/* Average Rating Display */}
                <div className="mb-8 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
                  <div className="flex flex-col md:flex-row items-center justify-center md:justify-around space-y-4 md:space-y-0">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-gray-800 mb-2">
                        {worker.ratings?.average?.toFixed(1) || '0.0'}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-8 h-8 ${
                              star <= Math.round(worker.ratings?.average || 0)
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
                        ))}
                      </div>
                      <p className="text-gray-600">
                        Based on {worker.ratings?.count || 0} reviews
                      </p>
                    </div>

                    {/* Rating Distribution */}
                    <div className="w-full md:w-1/2 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = reviews.filter(r => r.rating === stars).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        
                        return (
                          <div key={stars} className="flex items-center space-x-3">
                            <span className="text-sm font-medium w-8">{stars} ⭐</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-yellow-400 h-3 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Individual Reviews */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                      
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {review.customer?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {review.customer?.name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {/* Rating Stars */}
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${
                                star <= review.rating
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
                          ))}
                        </div>
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment || review.reviewText}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-600 text-lg mb-2">No reviews yet</p>
                <p className="text-gray-500">Be the first to review this worker!</p>
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

export default WorkerProfile;