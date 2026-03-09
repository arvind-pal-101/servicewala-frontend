import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          
          {/* 404 Animation */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 mb-4">
              404
            </h1>
            <div className="text-6xl mb-4 animate-bounce">
              🔍
            </div>
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
            >
              ← Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
            >
              🏠 Go Home
            </button>
            <button
              onClick={() => navigate('/search')}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
            >
              🔍 Browse Workers
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-4">Popular Pages:</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/search')}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                🔍 Find Workers
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                📊 My Dashboard
              </button>
              <button
                onClick={() => navigate('/login')}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                🔐 Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default NotFound;