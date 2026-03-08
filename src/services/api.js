import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
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
  registerUser: (data) => api.post('/auth/user/register', data),
  loginUser: (data) => api.post('/auth/user/login', data),
  registerWorker: (data) => api.post('/auth/worker/register', data),
  loginWorker: (data) => api.post('/auth/worker/login', data),
  getProfile: () => {
    const userType = localStorage.getItem('userType');
    return userType === 'worker' 
      ? api.get('/auth/worker/me')
      : api.get('/auth/user/me');
  },
  updateAvailability: (data) => api.put('/auth/worker/availability', data),
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
};

// Worker APIs
export const workerAPI = {
  search: (params) => api.get('/workers/search', { params }),
  getById: (id) => api.get(`/workers/${id}`),
  getAll: () => api.get('/workers'),
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
};

// Review APIs
// Review APIs
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getWorkerReviews: (workerId) => api.get(`/reviews/worker/${workerId}`),
  getMyReviews: () => api.get('/reviews/my-reviews'),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  reportReview: (id, data) => api.post(`/reviews/${id}/report`, data)
};

export default api;