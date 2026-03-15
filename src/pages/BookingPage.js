import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { workerAPI, bookingAPI } from '../services/api';
import { toast } from 'react-toastify';
import { trackBooking } from '../utils/analytics';


function BookingPage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Check if user is logged in
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Form data
  const [formData, setFormData] = useState({
    // Guest user details (required if not logged in)
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    
    // Service details
    problemDescription: '',
    serviceAddress: '',
    serviceCity: '',
    servicePincode: '',
    latitude: '',
    longitude: '',
    
    // Scheduling
    scheduledDate: '',
    scheduledTime: 'morning', // morning, afternoon, evening
    
    // Additional notes
    additionalNotes: ''
  });

  useEffect(() => {
    fetchWorkerDetails();
  }, [workerId]);

  const fetchWorkerDetails = async () => {
    try {
      setLoading(true);
      const response = await workerAPI.getById(workerId);
      setWorker(response.data.data);
    } catch (error) {
      console.error('Error fetching worker:', error);
      toast.error('Failed to load worker details');
      navigate('/search');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    // Guest user validation
    if (!isLoggedIn) {
      if (!formData.customerName.trim()) {
        toast.error('Please enter your name');
        return false;
      }
      if (!formData.customerPhone.trim() || formData.customerPhone.length < 10) {
        toast.error('Please enter valid phone number');
        return false;
      }
    }

    // Common validation
    if (!formData.problemDescription.trim()) {
      toast.error('Please describe the problem');
      return false;
    }
    if (!formData.serviceAddress.trim()) {
      toast.error('Please enter service address');
      return false;
    }
    if (!formData.serviceCity.trim()) {
      toast.error('Please enter city');
      return false;
    }
    if (!formData.scheduledDate) {
      toast.error('Please select a date');
      return false;
    }

    // Check if date is in the past
    const selectedDate = new Date(formData.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Please select a future date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  try {
    setSubmitting(true);

    const bookingData = {
      workerId: workerId,  // ← FIXED: was 'worker'
      categoryId: worker.category?._id,  // ← FIXED: was 'category'
      serviceDetails: {
        problemDescription: formData.problemDescription,
        serviceAddress: {
          address: formData.serviceAddress,
          city: formData.serviceCity,
          pincode: formData.servicePincode,
          ...(formData.latitude && formData.longitude && {
            coordinates: {
              latitude: parseFloat(formData.latitude),
              longitude: parseFloat(formData.longitude)
            }
          })
        },
        additionalNotes: formData.additionalNotes
      },
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime
    };

    // For guest users, add contact info
    if (!isLoggedIn) {
      bookingData.guestCustomer = {  // ← FIXED: matches backend
        name: formData.customerName,
        phone: formData.customerPhone,
        email: formData.customerEmail || ''
      };
    }

    console.log('Submitting booking:', bookingData);

    const response = await bookingAPI.create(bookingData);

    if (response.data.success) {
      toast.success('🎉 Booking confirmed! Worker will contact you soon.');
      
      trackBooking(worker.category?.name || 'Unknown Category');
      // Redirect based on login status
      if (isLoggedIn) {
        navigate('/dashboard');
      } else {
        navigate('/booking-success');
      }
    }
  } catch (error) {
    console.error('Booking error:', error);
    
    // Show specific error message
    const errorMessage = error.response?.data?.message || 'Failed to create booking';
    toast.error(errorMessage);
    
    // If worker unavailable, redirect back
    if (errorMessage.includes('unavailable')) {
      setTimeout(() => {
        navigate(`/worker/${workerId}`);
      }, 2000);
    }
  } finally {
    setSubmitting(false);
  }
};

  // Calculate estimated cost
  const estimatedHours = 2; // Default estimate
  const estimatedCost = worker?.hourlyRate ? worker.hourlyRate * estimatedHours : 0;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking form...</p>
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Book Service</h1>
            <p className="text-gray-600">Fill in the details to confirm your booking</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Booking Form - Left Side */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                
                {/* Guest User Details */}
                {!isLoggedIn && (
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center space-x-2">
                      <span>👤</span>
                      <span>Your Details</span>
                    </h2>
                    <p className="text-gray-500 text-sm mb-6">No account needed! Just provide basic info.</p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          maxLength="10"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          name="customerEmail"
                          value={formData.customerEmail}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Service Details */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                    <span>🔧</span>
                    <span>Service Details</span>
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Problem Description *
                      </label>
                      <textarea
                        name="problemDescription"
                        value={formData.problemDescription}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Describe the problem in detail (e.g., Fan not working, sparking from switch)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Address *
                      </label>
                      <input
                        type="text"
                        name="serviceAddress"
                        value={formData.serviceAddress}
                        onChange={handleChange}
                        placeholder="House no., Street, Locality"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="serviceCity"
                          value={formData.serviceCity}
                          onChange={handleChange}
                          placeholder="Ayodhya"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="servicePincode"
                          value={formData.servicePincode}
                          onChange={handleChange}
                          placeholder="224123"
                          maxLength="6"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm font-medium text-gray-800 mb-2">📍 Exact location (optional)</p>
                      <p className="text-xs text-gray-600 mb-3">Worker can open in maps for accurate navigation.</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!navigator.geolocation) {
                              toast.error('Geolocation not supported');
                              return;
                            }
                            navigator.geolocation.getCurrentPosition(
                              (pos) => {
                                setFormData(prev => ({
                                  ...prev,
                                  latitude: pos.coords.latitude.toFixed(6),
                                  longitude: pos.coords.longitude.toFixed(6)
                                }));
                                toast.success('Location captured');
                              },
                              () => toast.error('Could not get location')
                            );
                          }}
                          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-600"
                        >
                          Use my current location
                        </button>
                        {(formData.latitude && formData.longitude) && (
                          <span className="text-sm text-green-700 py-2">✓ {formData.latitude}, {formData.longitude}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                    <span>📅</span>
                    <span>Schedule</span>
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['morning', 'afternoon', 'evening'].map((time) => (
                          <label
                            key={time}
                            className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                              formData.scheduledTime === time
                                ? 'border-primary bg-blue-50 text-primary'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <input
                              type="radio"
                              name="scheduledTime"
                              value={time}
                              checked={formData.scheduledTime === time}
                              onChange={handleChange}
                              className="hidden"
                            />
                            <div className="text-2xl mb-1">
                              {time === 'morning' && '🌅'}
                              {time === 'afternoon' && '☀️'}
                              {time === 'evening' && '🌆'}
                            </div>
                            <div className="font-medium capitalize">{time}</div>
                            <div className="text-xs text-gray-500">
                              {time === 'morning' && '8 AM - 12 PM'}
                              {time === 'afternoon' && '12 PM - 5 PM'}
                              {time === 'evening' && '5 PM - 9 PM'}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Any special instructions or requirements"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-2xl transform hover:scale-105'
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Confirming Booking...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>✅</span>
                      <span>Confirm Booking</span>
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Booking Summary - Right Side */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>

                {/* Worker Info */}
                {worker && (
                  <>
                    <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-3xl">
                        {worker.category?.icon || '👨‍🔧'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{worker.name}</p>
                        <p className="text-sm text-gray-600">{worker.category?.name}</p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hourly Rate</span>
                        <span className="font-semibold">₹{worker.hourlyRate}/hr</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Estimated Time</span>
                        <span className="font-semibold">{estimatedHours} hours</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-primary">
                        <span>Estimated Cost</span>
                        <span>₹{estimatedCost}</span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">📞 Worker will call you</span> to confirm the booking
                      </p>
                      <p className="text-xs text-gray-600">
                        Final cost may vary based on actual work
                      </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span>Verified Professional</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span>Easy Cancellation</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default BookingPage;