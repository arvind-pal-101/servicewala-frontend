import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book a service?",
      answer: "Simply search for workers by category or location, select a worker based on ratings and reviews, and click 'Book Now'. Fill in the service details, choose your preferred date and time, and confirm your booking."
    },
    {
      question: "Is registration required to book a service?",
      answer: "No! You can book services as a guest user. However, creating an account allows you to track bookings, save favorite workers, and manage your service history."
    },
    {
      question: "How are workers verified?",
      answer: "All workers on ServiceWala go through a verification process including phone number verification and document submission. We also monitor reviews and ratings to maintain quality standards."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept online payments through our secure payment gateway (credit/debit cards, UPI, net banking) as well as cash on completion of service."
    },
    {
      question: "Can I cancel a booking?",
      answer: "Yes. You can cancel up to 2 hours before the scheduled time for a full refund. Cancellations within 2 hours receive a 50% refund. Please check our Refund Policy for details."
    },
    {
      question: "How do I become a worker on ServiceWala?",
      answer: "Click 'Join as Worker', fill in your details, upload necessary documents, and create your professional profile. Once verified, you can start receiving booking requests."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "You can leave a review and rating. If there are quality issues, contact our support team within 48 hours with details and evidence. We'll investigate and may offer a refund based on our policy."
    },
    {
      question: "Are there any service fees?",
      answer: "Customers don't pay any service fees - you only pay the worker's rate. Workers may pay a small platform fee on completed bookings."
    }
  ];

  return (
    <>
      <Helmet>
        <title>FAQ - ServiceWala</title>
        <meta name="description" content="Frequently asked questions about ServiceWala - booking services, payments, and more." />
      </Helmet>
      
      <Navbar />
      
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600">Find answers to common questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-lg text-gray-800">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-primary transition-transform ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Please reach out to our support team.
            </p>
            <Link 
  to="/contact"
  className="inline-block px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
>
  Contact Support
</Link>
          </div>

        </div>
      </div>
      
      <Footer />
    </>
  );
}

export default FAQ;