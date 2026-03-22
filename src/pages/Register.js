import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  
  // Real-time validation errors
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    password: '',
    confirmPassword: ''
  });

  // Validation functions
  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    if (phone.length !== 10) return 'Phone number must be exactly 10 digits';
    if (!/^[6-9]\d{9}$/.test(phone)) return 'Please enter valid Indian phone number (starting with 6-9)';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) return 'Please enter valid email address';
    return '';
  };

  const validateCity = (city) => {
    if (!city) return 'City is required';
    if (city.length < 2) return 'City name must be at least 2 characters';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let error = '';
    
    switch(name) {
      case 'name':
        setFormData({ ...formData, [name]: value });
        error = validateName(value);
        break;
      case 'phone':
        const phoneValue = value.replace(/\D/g, '').slice(0, 10);
        setFormData({ ...formData, phone: phoneValue });
        error = validatePhone(phoneValue);
        break;
      case 'email':
        setFormData({ ...formData, [name]: value });
        error = validateEmail(value);
        break;
      case 'city':
        setFormData({ ...formData, [name]: value });
        error = validateCity(value);
        break;
      case 'password':
        setFormData({ ...formData, [name]: value });
        error = validatePassword(value);
        if (formData.confirmPassword) {
          setErrors(prev => ({
            ...prev,
            confirmPassword: validateConfirmPassword(formData.confirmPassword, value)
          }));
        }
        break;
      case 'confirmPassword':
        setFormData({ ...formData, [name]: value });
        error = validateConfirmPassword(value, formData.password);
        break;
      default:
        setFormData({ ...formData, [name]: value });
        break;
    }

    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const nameError = validateName(formData.name);
    const phoneError = validatePhone(formData.phone);
    const emailError = validateEmail(formData.email);
    const cityError = validateCity(formData.city);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);

    setErrors({
      name: nameError,
      phone: phoneError,
      email: emailError,
      city: cityError,
      password: passwordError,
      confirmPassword: confirmPasswordError
    });

    if (nameError || phoneError || emailError || cityError || passwordError || confirmPasswordError) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    try {
      setLoading(true);

      const registerData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        location: {
          city: formData.city
        }
      };

      const response = await authAPI.registerUser(registerData);

      if (response.data.success) {
        localStorage.setItem('userType', 'user');
        localStorage.setItem('userName', response.data.data.name);
        toast.success('🎉 Account created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - ServiceWala</title>
        <meta name="description" content="Create your ServiceWala account to book trusted local service providers." />
      </Helmet>
      
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-3xl">🎉</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h1>
              <p className="text-gray-600">Join ServiceWala as a Customer</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
  
  {/* Name */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Full Name *
    </label>
    <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="Enter your name"
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${
        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
    />
    {errors.name && (
      <p className="mt-1 text-sm text-red-600 flex items-center">
        <span className="mr-1">⚠️</span> {errors.name}
      </p>
    )}
  </div>

  {/* Phone */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Phone Number *
    </label>
    <input
      type="tel"
      name="phone"
      value={formData.phone}
      onChange={handleChange}
      placeholder="9876543210"
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${
        errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
    />
    {errors.phone && (
      <p className="mt-1 text-sm text-red-600 flex items-center">
        <span className="mr-1">⚠️</span> {errors.phone}
      </p>
    )}
    {!errors.phone && formData.phone.length === 10 && (
      <p className="mt-1 text-sm text-green-600 flex items-center">
        <span className="mr-1">✓</span> Valid phone number
      </p>
    )}
  </div>

  {/* Email */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Email *
    </label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="your@email.com"
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${
        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
    />
    {errors.email && (
      <p className="mt-1 text-sm text-red-600 flex items-center">
        <span className="mr-1">⚠️</span> {errors.email}
      </p>
    )}
    {!errors.email && formData.email.length > 0 && (
      <p className="mt-1 text-sm text-green-600 flex items-center">
        <span className="mr-1">✓</span> Valid email
      </p>
    )}
  </div>

  {/* City */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      City *
    </label>
    <input
      type="text"
      name="city"
      value={formData.city}
      onChange={handleChange}
      placeholder="Ayodhya"
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${
        errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
    />
    {errors.city && (
      <p className="mt-1 text-sm text-red-600 flex items-center">
        <span className="mr-1">⚠️</span> {errors.city}
      </p>
    )}
    {!errors.city && formData.city.length > 0 && (
      <p className="mt-1 text-sm text-green-600 flex items-center">
        <span className="mr-1">✓</span> Valid city
      </p>
    )}
  </div>

  {/* Password & Confirm Password - SIDE BY SIDE */}
  <div className="grid md:grid-cols-2 gap-4">
    {/* Password */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Password *
      </label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Minimum 6 characters"
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${
          errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors.password && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span> {errors.password}
        </p>
      )}
      {!errors.password && formData.password.length >= 6 && (
        <p className="mt-1 text-sm text-green-600 flex items-center">
          <span className="mr-1">✓</span> Strong password
        </p>
      )}
    </div>

    {/* Confirm Password */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Confirm Password *
      </label>
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Re-enter password"
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${
          errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {errors.confirmPassword && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span> {errors.confirmPassword}
        </p>
      )}
      {!errors.confirmPassword && formData.confirmPassword.length > 0 && formData.confirmPassword === formData.password && (
        <p className="mt-1 text-sm text-green-600 flex items-center">
          <span className="mr-1">✓</span> Passwords match
        </p>
      )}
    </div>
  </div>

  {/* Submit */}
  <button
    type="submit"
    disabled={loading}
    className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${
      loading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-gradient-to-r from-primary to-blue-600 text-white hover:shadow-xl transform hover:scale-105'
    }`}
  >
    {loading ? (
      <span className="flex items-center justify-center space-x-2">
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Creating Account...</span>
      </span>
    ) : (
      <span>Create Account</span>
    )}
  </button>
</form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Want to provide services?{' '}
                <Link to="/worker/register" className="text-primary font-semibold hover:underline">
                  Register as Worker
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Register;