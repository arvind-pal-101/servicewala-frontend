# ServiceWala Frontend

> **Full-stack service marketplace platform - React Frontend**

A modern, responsive React application for connecting customers with local service providers. Features real-time booking, payments, reviews, and an intuitive user interface.

---

## 🚀 **Live Demo**

- **Live URL:** https://servicewala-frontend-psi.vercel.app
- **Backend API:** https://servicewala-backend-g4b8.onrender.com
- **Status:** ✅ Production Ready

---

## ✨ **Features**

### **For Customers:**
- ✅ Browse and search service providers by category
- ✅ View worker profiles with ratings and reviews
- ✅ Book services with preferred date and time
- ✅ Track booking status in real-time
- ✅ Make payments (Razorpay + Cash on completion)
- ✅ Write reviews and rate workers
- ✅ Manage bookings from personal dashboard

### **For Workers:**
- ✅ Professional profile with portfolio
- ✅ Receive and manage booking requests
- ✅ Accept/reject bookings
- ✅ Update availability status
- ✅ Upload profile and portfolio images
- ✅ Track earnings and completed jobs
- ✅ Confirm cash payments

### **For Admins:**
- ✅ Comprehensive admin dashboard
- ✅ Manage users and workers
- ✅ Verify worker registrations
- ✅ Monitor all bookings
- ✅ Platform analytics

---

## 🛠️ **Tech Stack**

- **Framework:** React 18
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Notifications:** React Toastify
- **Payment:** Razorpay SDK
- **Image Upload:** Cloudinary
- **Build Tool:** Create React App
- **Deployment:** Vercel

---

## 📁 **Project Structure**

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── ProtectedRoute.js
│   │   ├── ImageUpload.js
│   │   └── Skeleton.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Search.js
│   │   ├── WorkerProfile.js
│   │   ├── BookingPage.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── WorkerLogin.js
│   │   ├── WorkerRegister.js
│   │   ├── UserDashboard.js
│   │   ├── WorkerDashboard.js
│   │   ├── WorkerImageManager.js
│   │   ├── BookingDetails.js
│   │   ├── PaymentPage.js
│   │   ├── WriteReview.js
│   │   ├── AdminLogin.js
│   │   ├── AdminDashboard.js
│   │   └── NotFound.js
│   ├── services/
│   │   └── api.js          # API integration
│   ├── App.js
│   ├── index.js
│   └── index.css
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

---

## ⚙️ **Installation & Setup**

### **Prerequisites:**
- Node.js (v17 or higher)
- Backend API running (or deployed)

### **Step 1: Clone Repository**
```bash
git clone https://github.com/arvind-pal-101/servicewala-frontend.git
cd servicewala-frontend
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Environment Variables**

Create `.env` file in root directory:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api

# For production deployment:
# REACT_APP_API_URL=https://servicewala-backend-g4b8.onrender.com/api
```

### **Step 4: Run Development Server**
```bash
npm start
```

Application will run on: `http://localhost:3000`

---

## 🎨 **Pages & Routes**

### **Public Routes:**
- `/` - Home page
- `/search` - Search workers
- `/worker/:id` - Worker profile
- `/login` - User login
- `/register` - User registration
- `/worker-login` - Worker login
- `/worker-register` - Worker registration
- `/admin-login` - Admin login

### **Protected Routes (User):**
- `/dashboard` - User dashboard
- `/book/:workerId` - Create booking
- `/booking/:id` - Booking details
- `/payment/:bookingId` - Payment page
- `/write-review/:bookingId` - Write review

### **Protected Routes (Worker):**
- `/worker-dashboard` - Worker dashboard
- `/worker-dashboard` (Images tab) - Image management

### **Protected Routes (Admin):**
- `/admin-dashboard` - Admin dashboard

---

## 🎯 **Key Features Implementation**

### **1. Authentication**
- JWT token stored in localStorage
- Protected routes with ProtectedRoute component
- Automatic token inclusion in API requests
- Auto-redirect on unauthorized access

### **2. Search & Filters**
- Category-based filtering
- Location-based search
- Real-time search results
- Worker availability status

### **3. Booking System**
- Multi-step booking form
- Date and time selection
- Problem description
- Estimated cost calculation
- Guest booking support

### **4. Payment Integration**
- Razorpay payment gateway
- Cash on completion option
- Payment status tracking
- Worker cash confirmation

### **5. Image Upload**
- Profile image upload
- Portfolio gallery (up to 5 images)
- Cloudinary integration
- Image preview before upload
- Delete functionality

### **6. Reviews & Ratings**
- 5-star rating system
- Written reviews
- Average rating display
- Rating distribution visualization

---

## 🎨 **UI/UX Features**

- ✅ Fully responsive design
- ✅ Mobile-first approach
- ✅ Smooth animations
- ✅ Loading skeletons
- ✅ Toast notifications
- ✅ Form validation
- ✅ Error handling
- ✅ 404 page
- ✅ Professional color scheme
- ✅ Intuitive navigation

---

## 🚀 **Deployment**

### **Platform:** Vercel

### **Environment Variables (Production):**

In Vercel Dashboard → Settings → Environment Variables:

```
REACT_APP_API_URL=https://servicewala-backend-g4b8.onrender.com/api
CI=false
```

### **Build Command:**
```bash
npm run build
```

### **Output Directory:**
```
build
```

### **Auto-Deploy:**
Connected to GitHub for automatic deployments on push to main branch.

---

## 📝 **Scripts**

```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

---

## 🔌 **API Integration**

All API calls are centralized in `src/services/api.js`:

```javascript
// Example: Login user
const response = await authAPI.loginUser({ phone, password });

// Example: Search workers
const response = await workerAPI.search({ category, city });

// Example: Create booking
const response = await bookingAPI.create(bookingData);
```

---

## 🎨 **Tailwind Configuration**

Custom theme colors:

```javascript
{
  primary: '#3B82F6',    // Blue-500
  secondary: '#8B5CF6',  // Purple-500
  success: '#10B981',    // Green-500
  danger: '#EF4444',     // Red-500
  warning: '#F59E0B'     // Amber-500
}
```

---

## 📱 **Responsive Breakpoints**

```
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

---

## 🐛 **Known Issues**

- ESLint warnings in production build (disabled with CI=false)
- Razorpay test mode only (production keys needed for live payments)

---

## 🔮 **Future Enhancements**

- [ ] Real-time chat between users and workers
- [ ] Push notifications
- [ ] Progressive Web App (PWA)
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Google Maps integration
- [ ] Worker calendar view
- [ ] Advanced search filters
- [ ] Favorites/wishlist
- [ ] Referral system

---

## 🧪 **Testing Credentials**

### **Test User:**
```
Phone: 9012345678
Password: password123
```

### **Test Worker:**
```
Phone: 9345678901
Password: password123
```

### **Test Admin:**
```
Username: admin
Password: admin123
```

### **Test Payment (Razorpay):**
```
Card: 4111 1111 1111 1111
CVV: 123
Expiry: Any future date
```

---

## 👨‍💻 **Developer**

**Arvind Pal**
- GitHub: [@arvind-pal-101](https://github.com/arvind-pal-101)
- Location: Ayodhya, Uttar Pradesh, India

---

## 📄 **License**

This project is private and not open for public use.

---

## 🙏 **Acknowledgments**

- Vercel for frontend hosting
- Tailwind CSS for styling framework
- React team for the amazing framework
- Razorpay for payment integration

---

## 📞 **Support**

For issues or questions, please create an issue in the GitHub repository.

---

**⭐ If you found this project useful, please consider starring the repository!**
