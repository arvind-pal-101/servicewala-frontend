import React, { useState } from 'react';

const ImageUpload = ({ 
  type = 'profile', // 'profile' or 'portfolio'
  currentImage = null,
  onUploadSuccess,
  maxFiles = 1 
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count
    if (files.length > maxFiles) {
      setError(`You can only upload ${maxFiles} image(s) at a time`);
      return;
    }

    // Validate file types and sizes
    const validFiles = [];
    const newPreviews = [];
    
    for (const file of files) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        continue;
      }
      
      // Check file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        continue;
      }
      
      validFiles.push(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    }
    
    setSelectedFiles(validFiles);
    setError('');
  };

  // Handle upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select an image first');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      
      if (type === 'profile') {
        formData.append('profileImage', selectedFiles[0]);
      } else {
        selectedFiles.forEach(file => {
          formData.append('portfolioImages', file);
        });
      }

      const token = localStorage.getItem('token');
      const endpoint = type === 'profile' 
        ? 'http://localhost:5000/api/upload/profile'
        : 'http://localhost:5000/api/upload/portfolio';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      // Clear selection
      setSelectedFiles([]);
      setPreviews([]);
      
      // Call success callback
      if (onUploadSuccess) {
        onUploadSuccess(data);
      }

      alert(`${type === 'profile' ? 'Profile image' : 'Portfolio images'} uploaded successfully!`);

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setError('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {type === 'profile' ? 'Upload Profile Image' : 'Upload Portfolio Images'}
      </h3>

      {/* Current Image Preview (for profile) */}
      {type === 'profile' && currentImage && previews.length === 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Current Profile Image:</p>
          <img 
            src={currentImage} 
            alt="Current profile" 
            className="w-32 h-32 object-cover rounded-full border-2 border-gray-300"
          />
        </div>
      )}

      {/* File Input */}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          multiple={type === 'portfolio'}
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={uploading}
        />
        <p className="text-xs text-gray-500 mt-1">
          {type === 'profile' 
            ? 'JPG, PNG, WEBP up to 5MB'
            : `Upload up to ${maxFiles} images (JPG, PNG, WEBP up to 5MB each)`
          }
        </p>
      </div>

      {/* Preview */}
      {previews.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className="flex flex-wrap gap-3">
            {previews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index + 1}`}
                className={`object-cover border-2 border-gray-300 ${
                  type === 'profile' 
                    ? 'w-32 h-32 rounded-full' 
                    : 'w-24 h-24 rounded-lg'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Buttons */}
      {selectedFiles.length > 0 && (
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
          <button
            onClick={handleCancel}
            disabled={uploading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;