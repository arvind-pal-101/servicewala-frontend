import React, { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import { authAPI, imageAPI } from '../services/api';

const WorkerImageManager = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle profile image upload success
  const handleProfileUploadSuccess = (data) => {
    setUser(prev => ({
      ...prev,
      profileImage: data.profileImage
    }));
  };

  // Handle portfolio upload success
  const handlePortfolioUploadSuccess = (data) => {
    setUser(prev => ({
      ...prev,
      portfolio: data.portfolio
    }));
  };

  // Delete profile image
  const handleDeleteProfileImage = async () => {
    if (!window.confirm('Are you sure you want to delete your profile image?')) {
      return;
    }

    try {
      setDeleting('profile');
      await imageAPI.deleteProfileImage();
      setUser(prev => ({
        ...prev,
        profileImage: null
      }));
      alert('Profile image deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete profile image');
    } finally {
      setDeleting(null);
    }
  };

  // Delete portfolio image
  const handleDeletePortfolioImage = async (publicId) => {
    if (!window.confirm('Are you sure you want to delete this portfolio image?')) {
      return;
    }

    try {
      setDeleting(publicId);
      await imageAPI.deletePortfolioImage(publicId);
      setUser(prev => ({
        ...prev,
        portfolio: prev.portfolio.filter(img => img.publicId !== publicId)
      }));
      alert('Portfolio image deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete image');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Profile Image Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Profile Image</h2>
        
        {/* Current Profile Image */}
        {user?.profileImage?.url && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Current Profile Image:</p>
            <div className="flex items-center gap-4">
              <img 
                src={user.profileImage.url} 
                alt="Profile" 
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-300"
              />
              <button
                onClick={handleDeleteProfileImage}
                disabled={deleting === 'profile'}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {deleting === 'profile' ? 'Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          </div>
        )}

        {/* Upload New Profile Image */}
        <ImageUpload
          type="profile"
          currentImage={user?.profileImage?.url}
          onUploadSuccess={handleProfileUploadSuccess}
          maxFiles={1}
        />
      </div>

      {/* Portfolio Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Portfolio Images</h2>
        
        {/* Current Portfolio */}
        {user?.portfolio && user.portfolio.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">
              Current Portfolio ({user.portfolio.length}/5):
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {user.portfolio.map((image) => (
                <div key={image.publicId} className="relative group">
                  <img
                    src={image.url}
                    alt="Portfolio"
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                  />
                  <button
                    onClick={() => handleDeletePortfolioImage(image.publicId)}
                    disabled={deleting === image.publicId}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:bg-gray-400"
                    title="Delete image"
                  >
                    {deleting === image.publicId ? '⏳' : '🗑️'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Portfolio Images */}
        {(!user?.portfolio || user.portfolio.length < 5) && (
          <ImageUpload
            type="portfolio"
            onUploadSuccess={handlePortfolioUploadSuccess}
            maxFiles={5 - (user?.portfolio?.length || 0)}
          />
        )}

        {user?.portfolio && user.portfolio.length >= 5 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-700">
            ⚠️ Portfolio is full (5/5 images). Delete an image to upload more.
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerImageManager;

// INSTRUCTIONS FOR WorkerDashboard.js:
// Import this component at top:
// import WorkerImageManager from './WorkerImageManager';
//
// Add a new tab in your dashboard:
// In the tabs array, add:
// { id: 'images', label: '📸 Images' }
//
// In the content rendering section, add:
// {activeTab === 'images' && <WorkerImageManager />}