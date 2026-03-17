import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true  // ← CRITICAL: Send cookies with every request!
});

// Remove Authorization header interceptor - cookies handle auth now!
// No request interceptor needed anymore

// Auto-logout on 401 (invalid/expired token)
// Auto-logout on 401 (invalid/expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear any localStorage data (for migration cleanup)
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('userName');
      
      // List of public pages that don't need authentication
      const publicPages = [
        '/',
        '/login',
        '/register',
        '/worker/register',
        '/admin/login',
        '/forgot-password',
        '/reset-password',
        '/about',
        '/services',
        '/contact',
        '/faq',
        '/terms',
        '/privacy',
        '/refund-policy',
        '/search'
      ];
      
      // Check if current page is public or starts with public path
      const isPublicPage = publicPages.some(page => 
        window.location.pathname === page || 
        window.location.pathname.startsWith(page + '/')
      );
      
      // Only redirect to login if on a protected page
      if (!isPublicPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  registerUser: (data) => api.post('/auth/register', data),
  loginUser: (data) => api.post('/auth/login', data),
  loginAdmin: (data) => api.post('/auth/admin/login', data),
  registerWorker: (data) => api.post('/auth/worker/register', data),
  loginWorker: (data) => api.post('/auth/worker/login', data),
  logout: () => api.post('/auth/logout'),  // ← NEW: Logout API
  getProfile: () => api.get('/auth/profile'),
  updateAvailability: (status) => api.put('/auth/worker/availability', { isAvailable: status }),
  
  // Favorite workers
  addFavorite: (workerId) => api.post(`/auth/favorites/${workerId}`),
  removeFavorite: (workerId) => api.delete(`/auth/favorites/${workerId}`),
  getFavorites: () => api.get('/auth/favorites'),
  
  // Password reset
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.put(`/auth/reset-password/${token}`, data)
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`)
};

// Worker APIs
export const workerAPI = {
  search: (params) => api.get('/workers/search', { params }),
  getById: (id) => api.get(`/workers/${id}`),
  getAll: () => api.get('/workers')
};

// Booking APIs
export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getWorkerBookings: () => api.get('/bookings/worker-bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  acceptBooking: (id) => api.put(`/bookings/${id}/accept`),
  rejectBooking: (id) => api.put(`/bookings/${id}/reject`),
  startService: (id) => api.put(`/bookings/${id}/start`),
  completeBooking: (id, data) => api.put(`/bookings/${id}/complete`, data),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  confirmCashPayment: (id, data) => api.put(`/bookings/${id}/confirm-cash`, data)
};

// Image Upload APIs
export const imageAPI = {
  deleteProfileImage: () => api.delete('/upload/profile'),
  deletePortfolioImage: (publicId) => api.delete(`/upload/portfolio/${publicId}`)
};

// Review APIs
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getWorkerReviews: (workerId) => api.get(`/reviews/worker/${workerId}`),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  reportReview: (id, data) => api.put(`/reviews/${id}/report`, data)
};

// Payment APIs
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getPaymentDetails: (bookingId) => api.get(`/payments/${bookingId}`),
  refundPayment: (bookingId) => api.post(`/payments/refund/${bookingId}`)
};

// Commission APIs
export const commissionAPI = {
  getMyCommission: () => api.get('/commission/my'),
  payCommission: (data) => api.post('/commission/pay', data),
  getAllCommissions: () => api.get('/commission/all'),
  adminCollectCommission: (data) => api.post('/commission/collect', data)
};

export default api;