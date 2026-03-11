import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: March 10, 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
              <p className="mb-4"><strong>Personal Information:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Name, phone number, and email address</li>
                <li>Location and service address</li>
                <li>Profile pictures and documents</li>
                <li>Payment information (processed securely)</li>
              </ul>
              <p className="mb-4"><strong>Usage Information:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Service bookings and transaction history</li>
                <li>Reviews and ratings</li>
                <li>Communication with workers and support</li>
                <li>Device and browser information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Facilitate connections between customers and workers</li>
                <li>Process payments and bookings</li>
                <li>Send service updates and notifications</li>
                <li>Improve platform functionality</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Information Sharing</h2>
              <p className="mb-4">We share your information only:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>With workers you book for service delivery</li>
                <li>With payment processors for transactions</li>
                <li>When required by law or legal process</li>
                <li>With your explicit consent</li>
              </ul>
              <p className="mt-4">
                We <strong>never</strong> sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Data Security</h2>
              <p className="mb-4">We implement security measures including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encrypted data transmission (HTTPS)</li>
                <li>Secure password hashing</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
                <li>Secure cloud storage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance user experience, analyze usage patterns, and personalize content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Data Retention</h2>
              <p>
                We retain your information for as long as your account is active or as needed to provide services. You may request account deletion at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Children's Privacy</h2>
              <p>
                ServiceWala is not intended for users under 18 years of age. We do not knowingly collect information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Changes to Privacy Policy</h2>
              <p>
                We may update this policy periodically. We will notify users of significant changes via email or platform notification.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact Us</h2>
              <p>
                For privacy-related questions or to exercise your rights, please contact us through the platform's support system.
              </p>
            </section>

          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-600">
              Your privacy is important to us. We are committed to protecting your personal information and being transparent about our data practices.
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;