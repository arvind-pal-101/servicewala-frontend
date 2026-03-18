import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WorkerCard from '../components/WorkerCard';
import { workerAPI, categoryAPI } from '../services/api';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';


function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    category: searchParams.get('category') || '',
    minRating: '',
    maxPrice: '',
    sortBy: 'rating'
  });

  useEffect(() => {
    fetchCategories();
    fetchWorkers();
  }, []);

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
      const response = await workerAPI.search(filters);
      setWorkers(response.data.data);
    } catch (error) {
      console.error('Error fetching workers:', error);
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    fetchWorkers();
  };

  const handleReset = () => {
    setFilters({
      city: '',
      category: '',
      minRating: '',
      maxPrice: '',
      sortBy: 'rating'
    });
    setTimeout(() => fetchWorkers(), 100);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Find Workers</h1>
            
            {/* Filters Skeleton */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="h-12 bg-gray-300 rounded"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Loading Skeletons */}
            <div className="grid md:grid-cols-3 gap-6">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold gradient-text mb-2">Find Local Workers</h1>
            <p className="text-gray-600">Discover skilled professionals in your area</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              
              {/* City */}
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="City"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />

              {/* Category */}
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>

              {/* Rating */}
              <select
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>

              {/* Max Price */}
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price (₹/hr)"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />

              {/* Sort */}
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="experience">Most Experienced</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
  <button
    onClick={handleSearch}
    className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all"
  >
    🔍 Search
  </button>
  <button
    onClick={handleReset}
    className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
  >
    Reset
  </button>
</div>
          </div>
          <Helmet>
  <title>Find Service Providers - ServiceWala</title>
  <meta name="description" content="Search and find verified local service providers. Browse categories and book trusted professionals for your needs." />
</Helmet>

          {/* Results */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              Found <span className="font-bold text-primary">{workers.length}</span> workers
            </p>
          </div>

          {/* Workers Grid */}
          {workers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map(worker => (
                <WorkerCard key={worker._id} worker={worker} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Workers Found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters</p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
              >
                Reset Filters
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