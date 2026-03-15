import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function ProtectedRoute({ allowedUserTypes, redirectTo, children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Verify auth via API call (cookie automatically sent)
      const response = await authAPI.getProfile();
      
      if (response.data.success) {
        setIsAuthenticated(true);
        
        // Determine user type from profile
        const type = response.data.data.category ? 'worker' : 
                     response.data.data.role === 'admin' ? 'admin' : 'user';
        setUserType(type);
        
        // Update localStorage for UI (isLoggedIn, favorites checks)
        localStorage.setItem('token', 'authenticated');
        localStorage.setItem('userType', type);
        localStorage.setItem('userName', response.data.data.name);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Not authenticated
      setIsAuthenticated(false);
      
      // Clean up stale localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userName');
    } finally {
      setIsChecking(false);
    }
  };

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo || '/login'} replace />;
  }

  // Check user type restrictions
  if (Array.isArray(allowedUserTypes) && allowedUserTypes.length > 0) {
    if (!allowedUserTypes.includes(userType)) {
      // User type not allowed - redirect appropriately
      const fallback = redirectTo || 
                      (userType === 'admin' ? '/admin/dashboard' : 
                       userType === 'worker' ? '/worker/dashboard' : '/dashboard');
      return <Navigate to={fallback} replace />;
    }
  }

  // Authenticated and authorized - render children
  return children;
}