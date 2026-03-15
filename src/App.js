import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CookieConsent from 'react-cookie-consent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HelmetProvider } from 'react-helmet-async';
import { initGA, logPageView } from './utils/analytics';

import Home from './pages/Home';
import Search from './pages/Search';
import WorkerProfile from './pages/WorkerProfile';
import BookingPage from './pages/BookingPage';
import BookingSuccess from './pages/BookingSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import WorkerRegister from './pages/WorkerRegister';
import WorkerDashboard from './pages/WorkerDashboard';
import BookingDetails from './pages/BookingDetails';
import UserDashboard from './pages/UserDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import WriteReview from './pages/WriteReview';
import NotFound from './pages/NotFound';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import FAQ from './pages/FAQ';
import Services from './pages/Services';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';

// Analytics wrapper component - INSIDE Router
function AnalyticsWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    logPageView();
  }, [location]);

  return children;
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AnalyticsWrapper>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/worker/:id" element={<WorkerProfile />} />
              <Route path="/book/:workerId" element={<BookingPage />} />
              <Route path="/booking-success" element={<BookingSuccess />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/worker/register" element={<WorkerRegister />} />
              <Route path="/worker/dashboard" element={
                <ProtectedRoute allowedUserTypes={['worker']} redirectTo="/login">
                  <WorkerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/booking/:id" element={<BookingDetails />} />
              <Route path="/dashboard" element={
                <ProtectedRoute allowedUserTypes={['user']} redirectTo="/login">
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedUserTypes={['admin']} redirectTo="/admin/login">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/review/:bookingId" element={
                <ProtectedRoute allowedUserTypes={['user']} redirectTo="/login">
                  <WriteReview />
                </ProtectedRoute>
              } />
              <Route path="/payment/:bookingId" element={<PaymentPage />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failed" element={<PaymentFailed />} /> 
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />         
              <Route path="*" element={<NotFound />} /> 
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
            
            {/* Cookie Consent */}
            <CookieConsent
              location="bottom"
              buttonText="Accept All"
              declineButtonText="Decline"
              enableDeclineButton
              cookieName="servicewalaCookieConsent"
              style={{ 
                background: "#1f2937",
                padding: "20px",
                alignItems: "center"
              }}
              buttonStyle={{ 
                background: "#3b82f6",
                color: "white",
                fontSize: "14px",
                padding: "12px 30px",
                borderRadius: "8px",
                fontWeight: "600"
              }}
              declineButtonStyle={{
                background: "transparent",
                border: "2px solid #9ca3af",
                color: "#9ca3af",
                fontSize: "14px",
                padding: "10px 28px",
                borderRadius: "8px",
                fontWeight: "600"
              }}
              expires={365}
            >
              <div style={{ fontSize: "15px", lineHeight: "1.6" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", display: "block", marginBottom: "8px" }}>
                  🍪 We use cookies
                </span>
                We use cookies to enhance your experience, analyze traffic, and personalize content.
                By clicking "Accept All", you consent to our use of cookies.{" "}
                <Link to="/privacy" style={{ color: "#60a5fa", textDecoration: "underline" }}>
                  Learn more
                </Link>
              </div>
            </CookieConsent>
            
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </AnalyticsWrapper>
      </Router>
    </HelmetProvider>
  );
}

export default App;