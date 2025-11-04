# PRMS - Patient Record Management System

A comprehensive healthcare management system built with the MERN stack (MongoDB, Express.js, React, Node.js) for Eastern University Healthcare Center. This system manages patient records, doctor consultations, medical records, and prescriptions with role-based access control.

## 🚀 Features

### 🏥 **Core Healthcare Features**

- **Role-Based Access Control**: Admin, Doctor, and Patient dashboards with secure authentication
- **Patient Management**: Complete patient lifecycle from registration to medical history tracking
- **Doctor Management**: Doctor registration, specialization tracking, and availability management
- **Medical Records**: SOAP (Subjective, Objective, Assessment, Plan) note system with comprehensive documentation
- **Prescription Management**: Digital prescription creation, management, and tracking
- **Appointment System**: Schedule and manage patient appointments
- **Vital Signs Tracking**: Temperature, blood pressure, pulse, and respiration monitoring
- **Allergy Management**: Patient allergy tracking and alerts

### 📊 **Analytics & Reporting**

- **Admin Dashboard**: Comprehensive system overview with statistics and analytics
- **Patient Type Distribution**: Visual pie charts showing student, public, and staff demographics
- **Monthly Trends**: Medical records and activity tracking over time
- **Recent Activity Feed**: Real-time updates on system activities
- **Quick Actions**: Easy access to common administrative tasks

### 🔐 **Security & Authentication**

- **JWT Authentication**: Secure token-based authentication with HTTP-only cookies
- **Password Hashing**: bcrypt encryption for secure password storage
- **Role-Based Access**: Granular permissions for different user types
- **Input Validation**: Comprehensive validation for Sri Lankan NIC, mobile numbers, and email
- **Audit Logging**: Complete system activity tracking and logging
- **CORS Protection**: Secure cross-origin resource sharing configuration

### 🎨 **User Experience**

- **Responsive Design**: Modern UI with Tailwind CSS and React 19
- **Interactive Charts**: Beautiful pie charts and data visualizations
- **Real-time Updates**: Live data updates and notifications
- **Mobile-First**: Optimized for all device sizes
- **Accessibility**: WCAG compliant design patterns

### 📧 **Communication**

- **Email Notifications**: Automated credential delivery via email
- **SMTP Integration**: Professional email delivery system
- **User Onboarding**: Automated account creation and credential distribution

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas)

## 🛠 Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd PRMS
   ```

2. **Set up environment variables**

   **Server Environment** (`server/.env`):

   ```env
   NODE_ENV="development"
   CORS_ORIGIN = "http://localhost:5173"
   PORT=5000
   MONGODB_URI="mongodb+srv://prms:prms1234@cluster0.8kuookx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/prms"
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
   MAIL_USER="982072002@smtp-brevo.com"
   MAIL_PASS="x6GQOqwdmjycsgv4"
   SENDER_EMAIL="selvakumarthushanthan5@gmail.com"
   SUPER_ADMIN_EMAIL="selvakumarthushanthan5@gmail.com"
   SUPER_ADMIN_PASSWORD ="admin@123$"
   ```

   **Client Environment** (`client/.env`):

   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```

3. **Install dependencies:**

   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

4. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod

   # Or use MongoDB Atlas (cloud) - no local setup needed
   ```

## 🚀 Running the Application

### Individual Servers

**Backend only:**

```bash
cd server
npm install
npm run dev
```

**Frontend only:**

```bash
cd client
npm install
npm run dev
```

## 📁 Project Structure

````
PRMS/
│
├── server/                  # Express + MongoDB backend
│   ├── config/              # Configuration files
│   │   └── db.js            # MongoDB connection setup
│   │
│   ├── middleware/          # Middlewares
│   │   ├── protectedRoutes.js   # JWT authentication middleware
│   │   └── auditMiddleware.js   # System activity logging
│   │
│   ├── models/              # MongoDB models
│   │   ├── User.js              # Base user model (admin, doctor, patient)
│   │   ├── Patient.js           # Patient-specific details
│   │   ├── Doctor.js            # Doctor-specific details
│   │   ├── MedicalRecord.js     # SOAP notes and medical records
│   │   ├── Prescription.js      # Prescription management
│   │   ├── Appoinment.js        # Appointment management (Note: file name is Appoinment.js)
│   │   └── AuditLog.js          # System audit logs
│   │
│   ├── routes/              # API endpoints
│   │   ├── userRoutes.js        # Authentication routes
│   │   ├── patientRoutes.js     # Patient management
│   │   ├── doctorRoutes.js      # Doctor management
│   │   ├── medicalRecordRoutes.js # Medical records
│   │   ├── prescriptionRoutes.js # Prescription management
│   │   ├── appointmentRoutes.js # Appointment routes
│   │   └── adminRoutes.js       # Admin routes
│   │
│   ├── controllers/         # Business logic
│   │   ├── authController.js    # Login, logout, authentication
│   │   ├── patientController.js # Patient CRUD operations
│   │   ├── doctorController.js  # Doctor CRUD operations
│   │   ├── medicalRecordController.js # Medical record management
│   │   ├── prescriptionController.js # Prescription management
│   │   ├── appointmentController.js # Appointment management
│   │   └── adminController.js   # Admin statistics and analytics
│   │
│   ├── utils/               # Helper functions
│   │   ├── generateToken.js     # JWT token generation
│   │   ├── generatePassword.js  # Password generation
│   │   ├── mailer.js            # Email functionality
│   │   ├── validator.js         # Input validation (NIC, email, mobile, password)
│   │   └── sanitizeLog.js       # Log sanitization
│   │
│   ├── seeders/             # Database seeders
│   │   ├── seedAdmin.js         # Admin user seeder
│   │   └── seedSampleData.js    # Sample data seeder
│   │
│   ├── index.js             # Server entry point
│   └── package.json
│
├── client/                  # React + Vite frontend
│   ├── public/              # Static assets
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/          # Shared components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Spinner.jsx
│   │   │   ├── admin/           # Admin-specific components
│   │   │   │   ├── Overview.jsx
│   │   │   │   ├── Patients.jsx
│   │   │   │   ├── Doctors.jsx
│   │   │   │   └── Inventory.jsx
│   │   │   ├── doctor/          # Doctor-specific components
│   │   │   │   ├── Overview.jsx
│   │   │   │   ├── Patients.jsx
│   │   │   │   └── Appointments.jsx
│   │   │   ├── forms/           # Form components
│   │   │   │   ├── AdminForm.jsx
│   │   │   │   ├── DoctorForm.jsx
│   │   │   │   └── PatientForm.jsx
│   │   │   └── medical/          # Medical components
│   │   │       ├── MedicalRecordForm.jsx
│   │   │       ├── prescription/
│   │   │       │   └── PrescriptionForm.jsx
│   │   │       ├── soap/
│   │   │       │   └── SoapForm.jsx
│   │   │       └── vitals/
│   │   │           └── VitalsForm.jsx
│   │   │
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx         # Authentication page
│   │   │   ├── Dashboard.jsx     # Main dashboard router
│   │   │   ├── ErrorPage.jsx    # Error handling
│   │   │   ├── admin/            # Admin pages
│   │   │   │   └── AdminDashboard.jsx
│   │   │   └── doctor/           # Doctor pages
│   │   │       └── DoctorDashboard.jsx
│   │   │
│   │   ├── context/         # Global state management
│   │   │   └── AppContext.jsx   # Application context
│   │   │
│   │   ├── middleware/      # Frontend middleware
│   │   │   └── ProtectedRoutes.jsx # Route protection
│   │   │
│   │   ├── api/             # API client
│   │   │   └── client.js         # Axios configuration
│   │   │
│   │   ├── utils/           # Frontend utilities
│   │   │   └── validator.js     # Client-side validation
│   │   │
│   │   ├── App.jsx          # Main application component
│   │   ├── main.jsx         # Application entry point
│   │   └── index.css        # Global styles
│   │
│   ├── package.json
│   └── vite.config.js       # Vite configuration
│
├── LICENSE
└── README.md


## 🔧 Available Scripts

### Root Level Scripts

- `cd client && npm run dev` - Start only the frontend server
- `cd server && npm run dev` - Start only the backend server
- `npm run client` - Start only the frontend server
- `cd client && npm run build` - Build React app for production
- `npm run install-all` - Install all dependencies for both client and server

### Server Scripts

- `npm run start` - Start server in production mode
- `npm run dev` - Start server with nodemon (auto-restart)

### Client Scripts

- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🌐 API Endpoints

### Base URL: `http://localhost:5000/api`

#### Authentication Routes (`/api/user`)

- `POST /login` - User login with email and password
- `POST /logout` - User logout (requires authentication)
- `GET /auth-me` - Get current user details (requires authentication)

#### Patient Routes (`/api/patient`)

- `POST /register` - Register new patient
- `GET /` - Get all patients (with pagination)
- `GET /:id` - Get patient by ID
- `PUT /update` - Update patient profile (requires authentication)

#### Doctor Routes (`/api/doctor`)

- `POST /register` - Register new doctor
- `GET /` - Get all doctors (with pagination)
- `GET /:id` - Get doctor by ID
- `PUT /update` - Update doctor profile (requires authentication)

#### Medical Record Routes (`/api/med`)

- `POST /` - Create new medical record
- `GET /` - Get medical records (with pagination)
- `GET /:id` - Get medical record by ID
- `PUT /:id` - Update medical record
- `DELETE /:id` - Soft delete medical record

#### Prescription Routes (`/api/prescription`)

- `POST /` - Create new prescription
- `GET /` - Get prescriptions (with pagination)
- `GET /:id` - Get prescription by ID
- `PUT /:id` - Update prescription
- `DELETE /:id` - Soft delete prescription

#### Admin Routes (`/api/admin`)

- `GET /stats` - Get comprehensive system statistics and analytics (Admin only)

#### Appointment Routes (`/api/appointment`)

- `POST /` - Create new appointment
- `GET /` - Get appointments (with pagination)
- `GET /:id` - Get appointment by ID
- `PUT /:id` - Update appointment
- `DELETE /:id` - Cancel appointment

#### General Routes

- `GET /` - Server status and welcome message

## 🗄 Database Schema

### User Model (Base User)

```javascript
{
  name: String (required, trim),
  email: String (required, unique, lowercase),
  password: String (required, minlength: 6, hashed with bcrypt),
  role: String (enum: ['admin', 'doctor', 'patient'], required),
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model

```javascript
{
  patient: ObjectId (ref: 'Patient', required),
  doctor: ObjectId (ref: 'Doctor', required),
  status: String (enum: ['Queue', 'Consultation', 'Closed'], default: 'Queue'),
  createdAt: Date,
  updatedAt: Date
}
```

### Patient Model

```javascript
{
  nic: String (required, unique), // Sri Lankan NIC
  user: ObjectId (ref: 'User', required),
  patientType: String (enum: ['student', 'public', 'staff'], required),
  allergies: [String] (default: []),
  contact: String (default: ""),
  address: String (default: ""),
  dob: Date (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor Model

```javascript
{
  user: ObjectId (ref: 'User', required),
  specialization: String (required),
  licenseNumber: String (required, unique),
  yearsOfExperience: Number (default: 0),
  contact: String (default: ""),
  isAvailable: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Medical Record Model

```javascript
{
  patient: ObjectId (ref: 'Patient', required),
  doctor: ObjectId (ref: 'Doctor', required),
  soap: {
    subjective: String (required),
    objective: String (required),
    assessment: String (required),
    plan: String (required)
  },
  prescriptions: [ObjectId] (ref: 'Prescription'),
  vitals: {
    temperature: Number,
    bloodPressure: String,
    pulse: Number,
    respiration: Number
  },
  notes: String,
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Prescription Model

```javascript
{
  doctor: ObjectId (ref: 'Doctor', required),
  patient: ObjectId (ref: 'Patient', required),
  medicalRecord: ObjectId (ref: 'MedicalRecord', required),
  items: [{
    drug: String (required),
    dosage: String (required),
    instructions: String,
    duration: String
  }],
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **Password Hashing**: Using bcrypt for secure password storage
- **JWT Authentication**: Token-based authentication with HTTP-only cookies
- **CORS Configuration**: Cross-origin resource sharing with credentials
- **Input Validation**: Comprehensive validation for Sri Lankan NIC, mobile numbers, and email
- **Environment Variables**: Sensitive data stored in .env files
- **Helmet Security**: HTTP security headers
- **Data Sanitization**: Input sanitization for audit logs
- **Role-Based Access**: Different access levels for admin, doctor, and patient roles
- **Soft Delete**: Data retention with soft delete functionality
- **Audit Logging**: Comprehensive system activity tracking

## 🧪 Testing the Setup

### **Quick Start with Sample Data**

1. **Seed the database with sample data:**

   ```bash
   cd server
   npm run seed
   ```

2. **Start the application:**

   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

3. **Open your browser** to `http://localhost:5173` (or the port shown in terminal)

4. **Login with sample credentials:**

   **Admin Access:**

   - Email: `selvakumarthushanthan5@gmail.com`
   - Password: `admin@123$`

   **Sample Patient Access (password: `password123`):**

   - `john.smith@email.com` (Student)
   - `sarah.johnson@email.com` (Public)
   - `michael.brown@email.com` (Staff)

   **Sample Doctor Access (password: `password123`):**

   - `amanda.roberts@hospital.com` (General Medicine)
   - `james.thompson@hospital.com` (Cardiology)
   - `maria.garcia@hospital.com` (Pediatrics)

### **Sample Data Includes:**

- **8 Patients** with different types (Student, Public, Staff)
- **5 Doctors** with various specializations
- **5 Medical Records** with complete SOAP notes
- **Prescriptions** linked to medical records
- **Realistic healthcare scenarios** for testing

### **Test the Features:**

- **Admin Dashboard**: View comprehensive statistics and pie charts
- **Patient Management**: Browse and manage patient profiles
- **Doctor Management**: View doctor specializations and experience
- **Medical Records**: Review SOAP notes and prescriptions
- **Analytics**: Explore patient type distributions and trends

## 🏥 Healthcare System Features

### Admin Dashboard

- **Patient Management**: Register and manage patient profiles
- **Doctor Management**: Register and manage doctor profiles
- **System Overview**: View system statistics and activity
- **User Management**: Manage user accounts and roles

### Doctor Dashboard

- **Patient Consultation**: View patient information and medical history
- **SOAP Notes**: Create and manage medical records with SOAP format
- **Prescription Management**: Generate and manage prescriptions
- **Appointment Management**: View and manage patient appointments

### Patient Dashboard

- **Profile Management**: Update personal information
- **Medical History**: View medical records and prescriptions
- **Appointment Booking**: Schedule appointments with doctors

### Key Healthcare Features

- **SOAP Documentation**: Standardized medical record format
- **Prescription Management**: Digital prescription creation and tracking
- **Patient Classification**: Student, public, and staff patient types
- **Allergy Tracking**: Patient allergy management
- **Vital Signs**: Temperature, blood pressure, pulse, and respiration tracking
- **Medical History**: Comprehensive patient medical record keeping

## 🚀 Deployment

### Frontend (React + Vite)

```bash
cd client
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend (Express)

```bash
cd server
npm start
# Deploy to services like Heroku, Railway, or DigitalOcean
```

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

**Server Environment:**

- `NODE_ENV=production`
- `PORT=5000`
- `MONGODB_URI=your_production_mongodb_uri`
- `JWT_SECRET=your_production_jwt_secret`
- `CORS_ORIGIN=your_frontend_domain`

**Client Environment:**

- `VITE_API_URL=your_backend_api_url/api`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

### Technology Stack

**Frontend:**
- **React 19.1.1** with modern hooks and context API
- **Vite 7.1.7** for fast development and building
- **Tailwind CSS 4.1.14** for modern, responsive UI design
- **React Router DOM 7.9.3** for client-side routing
- **Axios 1.12.2** for HTTP requests
- **React Hot Toast 2.6.0** for notifications
- **React Icons 5.5.0** for iconography

**Backend:**
- **Express.js 5.1.0** for the backend API with middleware support
- **Mongoose 8.18.2** for MongoDB object modeling and validation
- **MongoDB 6.20.0** for database storage
- **jsonwebtoken 9.0.2** for secure authentication with HTTP-only cookies
- **bcrypt 6.0.0** for password hashing
- **Nodemailer 7.0.6** for email notifications
- **Helmet 8.1.0** for security headers
- **Morgan 1.10.1** for HTTP request logging
- **Compression 1.8.1** for response compression
- **CORS 2.8.5** for cross-origin resource sharing
- **Nodemon 3.1.10** for automatic server restarts during development

### Validation Rules

- **Password**: Minimum 8 characters, at least 1 letter and 1 number
- **NIC**: Supports both old format (9 digits + V/X) and new format (12 digits)
- **Mobile Number**: 10 digits exactly
- **Email**: RFC-compliant email validation

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running locally or check your Atlas connection string
   - Verify the MONGODB_URI in your server/.env file
   - Check MongoDB service status: `mongod --version`

2. **Port Already in Use**

   - Change the PORT in server/.env file
   - Kill processes using the ports: `npx kill-port 5000 5173`

3. **CORS Issues**

   - Check that the VITE_API_URL matches your backend URL
   - Verify CORS is properly configured in server/index.js
   - Ensure credentials are enabled in axios configuration

4. **Authentication Issues**

   - Check JWT_SECRET is set in server/.env
   - Verify cookies are being set properly
   - Check browser developer tools for cookie issues

5. **Email Issues**

   - Verify email configuration in server/utils/mailer.js
   - Check SMTP settings for email delivery
   - Test email functionality with a simple test

6. **Frontend Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Vite configuration in vite.config.js
   - Verify all dependencies are installed

## 🏥 Healthcare System Benefits

### For Healthcare Providers

- **Digital Records**: Eliminate paper-based medical records
- **SOAP Documentation**: Standardized medical note format
- **Prescription Management**: Digital prescription creation and tracking
- **Patient History**: Comprehensive medical history at fingertips
- **Role-Based Access**: Secure access control for different user types

### For Patients

- **Easy Access**: View medical history and prescriptions online
- **Profile Management**: Update personal information securely
- **Appointment Tracking**: Manage appointments with healthcare providers
- **Medical Records**: Access to complete medical history

### For Administrators

- **User Management**: Register and manage patients and doctors
- **System Overview**: Monitor system usage and statistics
- **Data Management**: Comprehensive data management capabilities
- **Security**: Role-based access control and audit logging

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information

## 🙏 Acknowledgments

- **Eastern University Healthcare Center** for the healthcare system requirements
- **MERN Stack** for providing a robust development framework
- **Tailwind CSS** for modern UI components
- **MongoDB** for flexible data storage
- **React** for dynamic user interfaces

---

**Happy Healthcare Management! 🏥**
````
