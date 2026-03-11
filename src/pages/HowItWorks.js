import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function HowItWorks() {
  return (
    <>
      <Helmet>
        <title>How It Works - ServiceWala</title>
        <meta name="description" content="Learn how to book services and connect with workers on ServiceWala." />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">How It Works</h1>
            <p className="text-xl text-gray-600">Simple steps to get the help you need</p>
          </div>

          {/* For Customers */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">For Customers</h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  🔍
                </div>
                <div className="text-primary font-bold text-lg mb-2">Step 1</div>
                <h3 className="font-bold text-xl mb-3">Search</h3>
                <p className="text-gray-600 text-sm">
                  Browse workers by category, location, or search by name
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ⭐
                </div>
                <div className="text-primary font-bold text-lg mb-2">Step 2</div>
                <h3 className="font-bold text-xl mb-3">Compare</h3>
                <p className="text-gray-600 text-sm">
                  Check ratings, reviews, experience, and pricing
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  📅
                </div>
                <div className="text-primary font-bold text-lg mb-2">Step 3</div>
                <h3 className="font-bold text-xl mb-3">Book</h3>
                <p className="text-gray-600 text-sm">
                  Select date, time, and provide service details
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  ✅
                </div>
                <div className="text-primary font-bold text-lg mb-2">Step 4</div>
                <h3 className="font-bold text-xl mb-3">Get Service</h3>
                <p className="text-gray-600 text-sm">
                  Worker arrives, completes job, and you pay
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                to="/search"
                className="inline-block px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
              >
                Find Workers Now
              </Link>
            </div>
          </div>

          {/* For Workers */}
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">For Workers</h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  📝
                </div>
                <div className="text-primary font-bold text-lg mb-2">Step 1</div>
                <h3 className="font-bold text-xl mb-3">Register</h3>
                <p className="text-gray-600 text-sm">
                  Create your professional profile with skills and experience
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  📱
                </div>
                <div className="text-primary font-bold text-lg mb-2">Step 2</div>
                <h3 className="font-bold text-xl mb-3">Get Bookings</h3>
                <p className="text-gray-600 text-sm">
                  Receive booking requests from customers
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  🔧
                </div>
                <div className="text-primary font-bold text-lg mb-2">Step 3</div>
                <h3 className="font-bold text-xl mb-3">Complete Work</h3>
                <p className="text-gray-600 text-sm">
                  Provide quality service and build your reputation
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                  💰
                </div>
                <div className="text-primary font-bold text-lg mb-2">Step 4</div>
                <h3 className="font-bold text-xl mb-3">Get Paid</h3>
                <p className="text-gray-600 text-sm">
                  Receive payment and earn positive reviews
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                to="/worker/register"
                className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
              >
                Join as Worker
              </Link>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </>
  );
}

export default HowItWorks;