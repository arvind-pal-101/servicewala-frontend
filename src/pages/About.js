import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function About() {
  return (
    <>
      <Helmet>
        <title>About Us - ServiceWala</title>
        <meta name="description" content="Learn about ServiceWala - connecting customers with trusted local service providers." />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">About ServiceWala</h1>
            <p className="text-xl text-gray-600">Connecting communities with trusted professionals</p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ServiceWala was founded with a simple mission: to bridge the gap between skilled local workers and customers who need their services. We believe that finding reliable help for home and business needs should be easy, transparent, and trustworthy.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Whether you need a plumber, electrician, carpenter, or any other professional service, ServiceWala makes it simple to connect with verified workers in your area.
            </p>
          </div>

          {/* What We Do */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex space-x-4">
                <div className="text-4xl">🔍</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Easy Discovery</h3>
                  <p className="text-gray-600">Search and find skilled workers by category, location, and ratings.</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="text-4xl">✅</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Verified Professionals</h3>
                  <p className="text-gray-600">All workers are verified to ensure quality and reliability.</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="text-4xl">💬</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Transparent Reviews</h3>
                  <p className="text-gray-600">Read honest reviews from real customers.</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <div className="text-4xl">💰</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Fair Pricing</h3>
                  <p className="text-gray-600">Clear pricing with no hidden charges.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-5xl mb-3">🤝</div>
                <h3 className="font-bold text-lg mb-2">Trust</h3>
                <p className="text-gray-600 text-sm">Building trust between workers and customers</p>
              </div>
              <div>
                <div className="text-5xl mb-3">⚡</div>
                <h3 className="font-bold text-lg mb-2">Quality</h3>
                <p className="text-gray-600 text-sm">Ensuring high-quality service delivery</p>
              </div>
              <div>
                <div className="text-5xl mb-3">🌟</div>
                <h3 className="font-bold text-lg mb-2">Community</h3>
                <p className="text-gray-600 text-sm">Supporting local workers and businesses</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </>
  );
}

export default About;