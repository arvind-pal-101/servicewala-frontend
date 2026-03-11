import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function RefundPolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Refund Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: March 10, 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Cancellation Policy</h2>
              <p className="mb-4"><strong>Before Service Start:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Cancel up to 2 hours before scheduled time: Full refund</li>
                <li>Cancel within 2 hours of scheduled time: 50% refund</li>
                <li>No-show without cancellation: No refund</li>
              </ul>
              <p className="mb-4"><strong>After Service Start:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Service in progress: No refund (unless quality issues)</li>
                <li>Service completed: No refund (dispute resolution available)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Refund Eligibility</h2>
              <p className="mb-4">You may be eligible for a refund if:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Worker did not show up for scheduled appointment</li>
                <li>Service was significantly different from description</li>
                <li>Work quality does not meet basic standards</li>
                <li>Worker behaved unprofessionally or inappropriately</li>
                <li>Payment was charged incorrectly</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Refund Process</h2>
              <p className="mb-4">To request a refund:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Contact support through the platform within 48 hours</li>
                <li>Provide booking details and reason for refund</li>
                <li>Submit any supporting evidence (photos, messages)</li>
                <li>Our team will review within 3-5 business days</li>
                <li>Approved refunds processed within 7-10 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Non-Refundable Situations</h2>
              <p className="mb-4">Refunds will not be provided for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Change of mind after service completion</li>
                <li>Minor subjective dissatisfaction</li>
                <li>Delays caused by customer</li>
                <li>Services completed as described</li>
                <li>Cash payments (unless fraud is proven)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Partial Refunds</h2>
              <p>
                In cases where service was partially completed or issues were partially resolved, we may offer a partial refund based on the circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Refund Methods</h2>
              <p className="mb-4">Refunds are processed to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Original payment method (online payments)</li>
                <li>Platform wallet (can be used for future bookings)</li>
                <li>Bank transfer (for cash payments, with proof)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Dispute Resolution</h2>
              <p>
                If you disagree with a refund decision, you may escalate to our dispute resolution team. Both parties will be heard, and a fair decision will be made within 15 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Worker Compensation</h2>
              <p>
                Workers are compensated for completed work. Refunds to customers may result in reduced or zero payment to workers, depending on the situation.
              </p>
            </section>

          </div>

          <div className="mt-12 p-6 bg-yellow-50 rounded-xl">
            <p className="text-sm text-gray-600">
              <strong>Important:</strong> All refund requests must be made within 48 hours of service completion. We strive to be fair to both customers and workers.
            </p>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default RefundPolicy;