import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Home() {
  const [categories, setCategories] = useState([]);
  const [searchCity, setSearchCity] = useState('Ayodhya');
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchPublicStats();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPublicStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/public/stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Stats fetch error:', error);
    }
  };

  const handleSearch = () => {
    navigate(`/search?city=${searchCity}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Helmet>
  <title>ServiceBabu - Verified Home Services in Ayodhya | Plumber, Electrician, Carpenter</title>
  <meta name="description" content="Book verified plumbers, electricians, carpenters and home service professionals in Ayodhya. Trusted, affordable, fast service at your doorstep. No hidden charges." />
  <meta name="keywords" content="home services Ayodhya, plumber Ayodhya, electrician Ayodhya, carpenter Ayodhya, AC repair Ayodhya, painter Ayodhya, ServiceBabu, ghar ka kaam Ayodhya" />
  <meta property="og:title" content="ServiceBabu - Verified Home Services in Ayodhya" />
  <meta property="og:description" content="Book verified plumbers, electricians, carpenters in Ayodhya. Trusted, affordable, fast." />
  <meta property="og:url" content="https://servicebabu.in/" />
  <meta property="og:type" content="website" />
  <link rel="canonical" href="https://servicebabu.in/" />
</Helmet>

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center animate-slide-up">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6">
  <span className="gradient-text">Trusted Home Services</span>
  <br />
  <span className="text-gray-800">At Your Doorstep</span>
</h1>
<p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
  Book verified Plumbers, Electricians & Carpenters in{' '}
  <span className="text-primary font-semibold">Ayodhya</span>{' '}
  — No hidden charges, Fast service
</p>

            <div className="max-w-2xl mx-auto">
              <div className="glass rounded-2xl p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-2xl">📍</span>
                    </div>
                    <input
                      type="text"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      placeholder="Enter your city"
                      className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 outline-none text-lg"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    🔍 Search Workers
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-12 text-gray-600">
  <div className="flex items-center gap-2">
    <span className="text-xl sm:text-2xl">✅</span>
    <span className="font-medium text-sm sm:text-base">Verified Workers</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="text-xl sm:text-2xl">⭐</span>
    <span className="font-medium text-sm sm:text-base">Customer Ratings</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="text-xl sm:text-2xl">💰</span>
    <span className="font-medium text-sm sm:text-base">No Hidden Charges</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="text-xl sm:text-2xl">🚀</span>
    <span className="font-medium text-sm sm:text-base">Fast Service</span>
  </div>
</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4">Popular Services</h2>
            <p className="text-gray-600 text-lg">Choose from our wide range of services</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category._id}
                onClick={() => navigate(`/search?category=${category._id}`)}
                className="card-hover cursor-pointer bg-white rounded-2xl p-6 shadow-lg text-center group"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-2">
  {category.name}
</h3>
                {/* Only show worker count if greater than 0 */}
                {category.workerCount > 0 && (
                  <p className="text-gray-500 text-sm">
                    {category.workerCount}+ workers
                  </p>
                )}
                <div className="mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">View Workers →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Get your work done in 3 simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-xl">1</div>
              <h3 className="text-2xl font-semibold mb-3">Search</h3>
              <p className="text-gray-600">Find the right worker for your needs from verified professionals</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-xl">2</div>
              <h3 className="text-2xl font-semibold mb-3">Book</h3>
              <p className="text-gray-600">Schedule a service at your preferred date and time</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-xl">3</div>
              <h3 className="text-2xl font-semibold mb-3">Done!</h3>
              <p className="text-gray-600">Get quality service and rate your experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section — Real Data, Show Only When Available */}
      {stats && (stats.totalWorkers > 0 || stats.totalUsers > 0) && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="glass rounded-3xl p-12">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                {stats.totalWorkers > 0 && (
                  <div>
                    <div className="text-5xl font-bold gradient-text mb-2">{stats.totalWorkers}+</div>
                    <p className="text-gray-600 text-lg">Verified Workers</p>
                  </div>
                )}
                {stats.totalUsers > 0 && (
                  <div>
                    <div className="text-5xl font-bold gradient-text mb-2">{stats.totalUsers}+</div>
                    <p className="text-gray-600 text-lg">Happy Customers</p>
                  </div>
                )}
                {stats.averageRating > 0 && (
                  <div>
                    <div className="text-5xl font-bold gradient-text mb-2">{stats.averageRating}⭐</div>
                    <p className="text-gray-600 text-lg">Average Rating</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default Home;