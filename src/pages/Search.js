import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WorkerCard from '../components/WorkerCard';
import { workerAPI, categoryAPI } from '../services/api';
import { toast } from 'react-toastify';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    minRating: '',
    maxRate: '',
    sortBy: 'rating' // rating, price-low, price-high, experience
  });

  useEffect(() => {
    fetchCategories();
    fetchWorkers();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const params = {
        city: searchParams.get('city') || filters.city,
        category: searchParams.get('category') || filters.category,
        minRating: filters.minRating,
        maxRate: filters.maxRate
      };

      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await workerAPI.search(params);
      let workersData = response.data.data;

      // Apply sorting
      workersData = sortWorkers(workersData, filters.sortBy);

      setWorkers(workersData);
    } catch (error) {
      console.error('Error fetching workers:', error);
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const sortWorkers = (workersData, sortBy) => {
    switch (sortBy) {
      case 'rating':
        return [...workersData].sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0));
      case 'price-low':
        return [...workersData].sort((a, b) => a.hourlyRate - b.hourlyRate);
      case 'price-high':
        return [...workersData].sort((a, b) => b.hourlyRate - a.hourlyRate);
      case 'experience':
        return [...workersData].sort((a, b) => b.experience - a.experience);
      default:
        return workersData;
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const params = {};
    if (filters.city) params.city = filters.city;
    if (filters.category) params.category = filters.category;
    setSearchParams(params);
    fetchWorkers();
  };

  const handleClearFilters = () => {
    setFilters({
      city: '',
      category: '',
      minRating: '',
      maxRate: '',
      sortBy: 'rating'
    });
    setSearchParams({});
    fetchWorkers();
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Find Your Perfect Worker
            </h1>
            <p className="text-gray-600">
              {workers.length} verified professionals ready to help you
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              
              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  placeholder="Enter city"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ ⭐</option>
                  <option value="4.5">4.5+ ⭐</option>
                </select>
              </div>

              {/* Max Rate Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Rate
                </label>
                <select
                  value={filters.maxRate}
                  onChange={(e) => handleFilterChange('maxRate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="">Any Price</option>
                  <option value="300">₹300/hr</option>
                  <option value="500">₹500/hr</option>
                  <option value="1000">₹1000/hr</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => {
                    handleFilterChange('sortBy', e.target.value);
                    setWorkers(sortWorkers(workers, e.target.value));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="experience">Most Experienced</option>
                </select>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:shadow-xl transition-all"
              >
                🔍 Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Workers Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading workers...</p>
              </div>
            </div>
          ) : workers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map(worker => (
                <WorkerCard key={worker._id} worker={worker} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Workers Found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search in a different city
              </p>
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Search;