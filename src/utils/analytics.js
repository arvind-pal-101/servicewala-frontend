import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = () => {
  // Only initialize if MEASUREMENT_ID is provided
  const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
  
  if (measurementId && measurementId !== 'YOUR_MEASUREMENT_ID') {
    ReactGA.initialize(measurementId);
    console.log('✅ Google Analytics initialized');
  }
};

// Track page views
export const logPageView = () => {
  ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
};

// Track events
export const logEvent = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

// Track user interactions
export const trackButtonClick = (buttonName) => {
  logEvent('Button', 'Click', buttonName);
};

export const trackSearch = (searchTerm) => {
  logEvent('Search', 'Query', searchTerm);
};

export const trackBooking = (category) => {
  logEvent('Booking', 'Created', category);
};

export const trackRegistration = (userType) => {
  logEvent('Registration', 'Complete', userType);
};

export const trackLogin = (userType) => {
  logEvent('Login', 'Success', userType);
};