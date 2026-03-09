import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  registerUser: (data) => api.post('/auth/register', data),           // ← FIXED
  loginUser: (data) => api.post('/auth/login', data),                 // ← FIXED
  registerWorker: (data) => api.post('/auth/worker/register', data),
  loginWorker: (data) => api.post('/auth/worker/login', data),
  getProfile: () => api.get('/auth/profile'),                         // ← Now matches!
  updateAvailability: (status) => api.put('/auth/worker/availability', { isAvailable: status })
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
  confirmCashPayment: (id) => api.put(`/bookings/${id}/confirm-cash`)
};
// Image Upload APIs
export const imageAPI = {
  // Delete profile image
  deleteProfileImage: () => api.delete('/upload/profile'),
  
  // Delete portfolio image
  deletePortfolioImage: (publicId) => api.delete(`/upload/portfolio/${publicId}`)
};

// Review APIs
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getWorkerReviews: (workerId) => api.get(`/reviews/worker/${workerId}`),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  reportReview: (id, data) => api.post(`/reviews/${id}/report`, data)
};

// Payment APIs
export const paymentAPI = {
  createOrder: (data) => api.post('/payments/create-order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getPaymentDetails: (bookingId) => api.get(`/payments/${bookingId}`),
  refundPayment: (bookingId) => api.post(`/payments/refund/${bookingId}`)
};

export default api;