import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function TermsOfService() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: March 10, 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using ServiceWala ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Use of Service</h2>
              <p className="mb-4">ServiceWala provides a platform to connect customers with service workers. You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not misuse the platform for illegal activities</li>
                <li>Respect other users and service providers</li>
                <li>Not attempt to harm or disrupt the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Responsibilities</h2>
              <p className="mb-4"><strong>For Customers:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Provide accurate service requirements</li>
                <li>Be present at scheduled appointment times</li>
                <li>Make timely payments for services rendered</li>
                <li>Provide honest reviews and feedback</li>
              </ul>
              <p className="mb-4"><strong>For Service Workers:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide services as described</li>
                <li>Maintain professional conduct</li>
                <li>Arrive on time for scheduled appointments</li>
                <li>Complete work to satisfactory standards</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Payments and Fees</h2>
              <p className="mb-4">
                Payment for services is processed through our integrated payment gateway or accepted in cash upon completion of service.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Platform may charge a service fee</li>
                <li>All prices are in Indian Rupees (₹)</li>
                <li>Refunds are subject to our refund policy</li>
                <li>Workers are responsible for their own tax obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cancellations and Refunds</h2>
              <p className="mb-4">
                Cancellation policies vary by service type. Please refer to our Refund Policy for detailed information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Liability Disclaimer</h2>
              <p className="mb-4">
                ServiceWala acts as a platform connecting customers with independent service providers. We:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Do not employ service workers directly</li>
                <li>Are not responsible for the quality of services provided</li>
                <li>Are not liable for damages or injuries during service</li>
                <li>Recommend users verify worker credentials independently</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Intellectual Property</h2>
              <p>
                All content on ServiceWala, including text, graphics, logos, and software, is the property of ServiceWala and protected by copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Termination</h2>
              <p>
                We reserve the right to terminate or suspend accounts that violate these terms or engage in fraudulent activities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Changes to Terms</h2>
              <p>
                ServiceWala reserves the right to modify these terms at any time. Continued use of the service constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us through the platform's support system.
              </p>
            </section>

          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-600">
              By using ServiceWala, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default TermsOfService;