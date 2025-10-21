# PRMS - Patient Record Management System

A comprehensive healthcare management system built with the MERN stack (MongoDB, Express.js, React, Node.js) for Eastern University Healthcare Center. This system manages patient records, doctor consultations, medical records, and prescriptions with role-based access control.

## 🚀 Features

- **Role-Based Access Control**: Admin, Doctor, and Patient dashboards
- **Patient Management**: Registration, profile management, and medical history tracking
- **Doctor Management**: Doctor registration, specialization tracking, and availability management
- **Medical Records**: SOAP (Subjective, Objective, Assessment, Plan) note system
- **Prescription Management**: Digital prescription creation and management
- **Secure Authentication**: JWT-based authentication with password hashing
- **Email Notifications**: Automated credential delivery via email
- **Responsive Design**: Modern UI with Tailwind CSS and React 19
- **Data Validation**: Comprehensive input validation for Sri Lankan NIC, mobile numbers, and email
- **Audit Logging**: System activity tracking and logging

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
   REACT_APP_API_URL=http://localhost:5000/api
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
npm install
npm run server
```

**Frontend only:**

```bash
npm install
npm run client
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
│   │   └── AuditLog.js          # System audit logs
│   │
│   ├── routes/              # API endpoints
│   │   ├── userRoutes.js        # Authentication routes
│   │   ├── patientRoutes.js     # Patient management
│   │   ├── doctorRoutes.js      # Doctor management
│   │   ├── medicalRecordRoutes.js # Medical records
│   │   └── prescriptionRoutes.js # Prescription management
│   │
│   ├── controllers/         # Business logic
│   │   ├── authController.js    # Login, logout, authentication
│   │   ├── patientController.js # Patient CRUD operations
│   │   ├── doctorController.js  # Doctor CRUD operations
│   │   ├── medicalRecordController.js # Medical record management
│   │   └── prescriptionController.js # Prescription management
│   │
│   ├── utils/               # Helper functions
│   │   ├── generateToken.js     # JWT token generation
│   │   ├── generatePassword.js  # Password generation
│   │   ├── mailer.js            # Email functionality
│   │   ├── validator.js         # Input validation
│   │   └── sanitizeLog.js       # Log sanitization
│   │
│   ├── seeders/             # Database seeders
│   │   └── seedAdmin.js         # Admin user seeder
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
│   │   │   └── forms/           # Form components
│   │   │       ├── AdminForm.jsx
│   │   │       ├── DoctorForm.jsx
│   │   │       └── PatientForm.jsx
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

#### General Routes

- `GET /` - Server status and welcome message

## 🗄 Database Schema

### User Model (Base User)

```javascript
{
  name: String (required, trim),
  email: String (required, unique, lowercase),
  password: String (required, min: 6 chars, hashed),
  role: String (enum: ['admin', 'doctor', 'patient'], required),
  createdAt: Date,
  updatedAt: Date
}
````

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

1. **Start the application:**

   ```bash
   npm run dev
   ```

2. **Open your browser** to http://localhost:5173

3. **Test the features:**
   - Login with admin credentials (use seeder to create admin user)
   - Test patient registration
   - Test doctor registration
   - Create medical records with SOAP notes
   - Generate prescriptions
   - Verify MongoDB connection in server logs

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

- `REACT_APP_API_URL=your_backend_api_url`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

- The application uses **React 19** with modern hooks and context API
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive UI design
- **Express 5** for the backend API with middleware support
- **Mongoose 8** for MongoDB object modeling and validation
- **JWT** for secure authentication with HTTP-only cookies
- **Nodemailer** for email notifications
- **bcrypt** for password hashing
- **Helmet** for security headers
- **Morgan** for HTTP request logging
- **Compression** for response compression
- **CORS** for cross-origin resource sharing
- **Nodemon** for automatic server restarts during development

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

   - Check that the REACT_APP_API_URL matches your backend URL
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
