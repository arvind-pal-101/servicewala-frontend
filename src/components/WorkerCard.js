import React from 'react';
import { useNavigate } from 'react-router-dom';

function WorkerCard({ worker }) {
  const navigate = useNavigate();

  return (
    <div className="card-hover bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
         onClick={() => navigate(`/worker/${worker._id}`)}>
      
      {/* Worker Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
        {worker.profilePhoto ? (
          <img 
            src={worker.profilePhoto} 
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
          <div className="absolute top-3 right-3 bg-success text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <span>✓</span>
            <span>Verified</span>
          </div>
        )}

        {/* Availability Badge */}
        {worker.availability?.isAvailable && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            🟢 Available
          </div>
        )}
      </div>

      {/* Worker Info */}
      <div className="p-5">
        
        {/* Name & Category */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{worker.name}</h3>
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="text-2xl">{worker.category?.icon || '🔧'}</span>
            <span className="font-medium">{worker.category?.name || 'Service Provider'}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500 text-xl">⭐</span>
            <span className="font-bold text-gray-800">
              {worker.ratings?.average?.toFixed(1) || '0.0'}
            </span>
          </div>
          <span className="text-gray-500 text-sm">
            ({worker.ratings?.count || 0} reviews)
          </span>
        </div>

        {/* Experience & Location */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span>💼</span>
            <span>{worker.experience || 0} years experience</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📍</span>
            <span>{worker.location?.city || 'Location not specified'}</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Hourly Rate</span>
            <span className="text-2xl font-bold text-primary">
              ₹{worker.hourlyRate || 0}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/worker/${worker._id}`);
            }}
            className="px-4 py-2 border-2 border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
          >
            View Profile
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/book/${worker._id}`);
            }}
            className="px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:shadow-xl transition-all"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkerCard;