import React from 'react';
import { useNavigate } from 'react-router-dom';

function WorkerCard({ worker }) {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/worker/${worker._id}`);
  };

  const handleBookNow = () => {
    navigate(`/book/${worker._id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden animate-fadeIn smooth-hover">
      
      {/* Worker Image/Avatar */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
        {worker.profilePic && worker.profilePic !== 'https://via.placeholder.com/150' ? (
          <img
            src={worker.profilePic}
            alt={worker.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl">👨‍🔧</span>
          </div>
        )}
        
        {/* Verified Badge */}
        {worker.verification?.isVerified && (
          <div className="absolute top-3 right-3 bg-success text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
            <span>✓</span>
            <span>Verified</span>
          </div>
        )}

        {/* Available Badge */}
        {worker.availability?.isAvailable && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            🟢 Available
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6">
        
        {/* Name & Category */}
        <div className="mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{worker.name}</h3>
          <p className="text-gray-600 flex items-center space-x-2">
            <span className="text-xl">{worker.category?.icon || '🔧'}</span>
            <span>{worker.category?.name || 'Service Provider'}</span>
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-yellow-500 text-2xl">⭐</span>
          <span className="text-xl font-bold text-gray-800">
            {worker.ratings?.average?.toFixed(1) || '0.0'}
          </span>
          <span className="text-gray-500">
            ({worker.ratings?.count || 0} reviews)
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-gray-600 text-sm">Experience</p>
            <p className="text-lg font-bold text-primary">
              {worker.experience || 0} years
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-lg font-bold text-success">
              {worker.completedBookings || 0} jobs
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-gray-600 mb-4">
          <span>📍</span>
          <span>{worker.location?.city || 'Location not set'}</span>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
          <p className="text-gray-600 text-sm">Hourly Rate</p>
          <p className="text-3xl font-bold text-primary">
            ₹{worker.hourlyRate || 0}
            <span className="text-sm text-gray-600">/hr</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <button
    onClick={handleViewProfile}
    className="px-4 py-2 sm:py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all text-sm sm:text-base"
  >
    View Profile
  </button>
  <button
    onClick={handleBookNow}
    className="px-4 py-2 sm:py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all btn-ripple text-sm sm:text-base"
  >
    Book Now
  </button>
</div>
      </div>
    </div>
  );
}

export default WorkerCard;