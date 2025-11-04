# PRMS Backend - Express.js + MongoDB

The backend API for the Patient Record Management System (PRMS), built with Express.js, MongoDB, and Mongoose. This robust healthcare management API provides secure, scalable endpoints for patient records, medical documentation, and system administration.

## 🚀 Features

### 🏥 **Healthcare Management**

- **Patient Management**: Complete CRUD operations for patient profiles
- **Doctor Management**: Doctor registration, specialization tracking, and availability
- **Medical Records**: SOAP (Subjective, Objective, Assessment, Plan) documentation system
- **Prescription Management**: Digital prescription creation and tracking
- **Appointment System**: Schedule and manage patient appointments
- **Vital Signs Tracking**: Comprehensive health metrics recording

### 📊 **Analytics & Reporting**

- **Admin Statistics**: Comprehensive system analytics and reporting
- **Patient Demographics**: Distribution analysis by patient types
- **Medical Records Analytics**: Activity tracking and trends
- **Real-time Data**: Live statistics for dashboard visualization

### 🔐 **Security & Authentication**

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for secure password storage
- **Role-Based Access Control**: Granular permissions for different user types
- **Input Validation**: Comprehensive validation for Sri Lankan NIC, mobile numbers, and email
- **CORS Protection**: Secure cross-origin resource sharing
- **Audit Logging**: Complete system activity tracking

### 📧 **Communication**

- **Email Notifications**: Automated credential delivery via SMTP
- **User Onboarding**: Automated account creation and credential distribution
- **Professional Email Templates**: Clean, healthcare-appropriate email formatting

## 🛠 Technology Stack

### **Core Technologies**

- **Express.js 5.1.0** - Fast, unopinionated web framework
- **MongoDB 6.20.0** - NoSQL database for flexible data storage
- **Mongoose 8.18.2** - MongoDB object modeling and validation
- **Node.js** - JavaScript runtime environment

### **Authentication & Security**

- **jsonwebtoken 9.0.2** - JWT token generation and verification
- **bcrypt 6.0.0** - Password hashing and encryption
- **helmet 8.1.0** - HTTP security headers
- **cors 2.8.5** - Cross-origin resource sharing

### **Development & Utilities**

- **nodemon 3.1.10** - Automatic server restarts during development
- **morgan 1.10.1** - HTTP request logging
- **compression 1.8.1** - Response compression
- **cookie-parser 1.4.7** - Cookie parsing middleware
- **dotenv 17.2.2** - Environment variable management
- **nodemailer 7.0.6** - Email functionality

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── controllers/                 # Business logic controllers
│   ├── adminController.js       # Admin statistics and analytics
│   ├── appointmentController.js # Appointment management
│   ├── authController.js        # Authentication logic
│   ├── doctorController.js      # Doctor CRUD operations
│   ├── medicalRecordController.js # Medical records management
│   ├── patientController.js     # Patient CRUD operations
│   └── prescriptionController.js # Prescription management
├── middleware/                  # Custom middleware
│   ├── auditMiddleware.js       # System activity logging
│   └── protectedRoutes.js      # JWT authentication middleware
├── models/                      # MongoDB data models
│   ├── Appoinment.js           # Appointment schema (status: Queue, Consultation, Closed)
│   ├── AuditLog.js             # Audit logging schema
│   ├── Doctor.js               # Doctor schema
│   ├── MedicalRecord.js        # Medical record schema (SOAP format)
│   ├── Patient.js              # Patient schema
│   ├── Prescription.js         # Prescription schema
│   └── User.js                 # Base user schema
├── routes/                      # API route definitions
│   ├── adminRoutes.js          # Admin-specific routes (stats endpoint)
│   ├── appointmentRoutes.js     # Appointment routes
│   ├── doctorRoutes.js          # Doctor routes
│   ├── medicalRecordRoutes.js   # Medical record routes
│   ├── patientRoutes.js         # Patient routes
│   ├── prescriptionRoutes.js    # Prescription routes
│   └── userRoutes.js            # Authentication routes
├── seeders/                     # Database seeders
│   ├── seedAdmin.js             # Admin user seeder
│   └── seedSampleData.js        # Sample data seeder
├── utils/                       # Utility functions
│   ├── generatePassword.js      # Password generation
│   ├── generateToken.js         # JWT token generation
│   ├── mailer.js                # Email functionality
│   ├── sanitizeLog.js           # Log sanitization
│   └── validator.js             # Input validation
├── index.js                     # Server entry point
└── package.json                 # Dependencies and scripts
```

## 🚀 Getting Started

### **Prerequisites**

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### **Installation**

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the server directory:

   ```env
   NODE_ENV="development"
   CORS_ORIGIN="http://localhost:5173"
   PORT=5000
   MONGODB_URI="mongodb+srv://prms:prms1234@cluster0.8kuookx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/prms"
   JWT_SECRET="your_super_secret_jwt_key_change_this_in_production_12345"
   MAIL_USER="982072002@smtp-brevo.com"
   MAIL_PASS="x6GQOqwdmjycsgv4"
   SENDER_EMAIL="selvakumarthushanthan5@gmail.com"
   SUPER_ADMIN_EMAIL="selvakumarthushanthan5@gmail.com"
   SUPER_ADMIN_PASSWORD="admin@123$"
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

### **Available Scripts**

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run seed-admin` - Create admin user

## 🌐 API Endpoints

### **Base URL**: `http://localhost:5000/api`

#### **Authentication Routes** (`/api/user`)

- `POST /login` - User login with email and password
- `POST /logout` - User logout (requires authentication)
- `GET /auth-me` - Get current user details (requires authentication)

#### **Patient Routes** (`/api/patient`)

- `POST /register` - Register new patient
- `GET /` - Get all patients (with pagination)
- `GET /:id` - Get patient by ID
- `PUT /update` - Update patient profile (requires authentication)

#### **Doctor Routes** (`/api/doctor`)

- `POST /register` - Register new doctor
- `GET /` - Get all doctors (with pagination)
- `GET /:id` - Get doctor by ID
- `PUT /update` - Update doctor profile (requires authentication)

#### **Medical Record Routes** (`/api/med`)

- `POST /` - Create new medical record
- `GET /` - Get medical records (with pagination)
- `GET /:id` - Get medical record by ID
- `PUT /:id` - Update medical record
- `DELETE /:id` - Soft delete medical record

#### **Prescription Routes** (`/api/prescription`)

- `POST /` - Create new prescription
- `GET /` - Get prescriptions (with pagination)
- `GET /:id` - Get prescription by ID
- `PUT /:id` - Update prescription
- `DELETE /:id` - Soft delete prescription

#### **Admin Routes** (`/api/admin`)

- `GET /stats` - Get comprehensive system statistics and analytics (Admin only)

#### **Appointment Routes** (`/api/appointment`)

- `POST /` - Create new appointment
- `GET /` - Get appointments (with pagination)
- `GET /:id` - Get appointment by ID
- `PUT /:id` - Update appointment
- `DELETE /:id` - Cancel appointment

## 🗄 Database Schema

### **User Model (Base User)**

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

### **Appointment Model**

```javascript
{
  patient: ObjectId (ref: 'Patient', required),
  doctor: ObjectId (ref: 'Doctor', required),
  status: String (enum: ['Queue', 'Consultation', 'Closed'], default: 'Queue'),
  createdAt: Date,
  updatedAt: Date
}
```

### **Patient Model**

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

### **Doctor Model**

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

### **Medical Record Model**

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

### **Prescription Model**

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

### **Authentication & Authorization**

- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Secure cookie storage
- **Password Hashing**: bcrypt encryption
- **Role-Based Access**: Granular permissions

### **Input Validation**

- **Sri Lankan NIC**: Supports old format (9 digits + V/X) and new format (12 digits)
- **Mobile Numbers**: 10 digits exactly
- **Email Validation**: RFC-compliant email validation
- **Password Validation**: Minimum 8 characters, at least 1 letter and 1 number
- **Data Sanitization**: Input sanitization for security

### **Security Headers**

- **Helmet**: HTTP security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting (configurable)
- **Audit Logging**: Complete activity tracking

## 📊 Sample Data & Seeding

### **Seed Sample Data**

```bash
npm run seed
```

### **Create Admin User**

```bash
npm run seed-admin
```

### **Sample Data Includes:**

- **8 Patients** with different types (Student, Public, Staff)
- **5 Doctors** with various specializations
- **5 Medical Records** with complete SOAP notes
- **Prescriptions** linked to medical records
- **Realistic healthcare scenarios** for testing

### **Sample Login Credentials:**

- **Admin**: `selvakumarthushanthan5@gmail.com` / `admin@123$`
- **Patients**: `[email]` / `password123`
- **Doctors**: `[email]` / `password123`

## 🧪 Testing

### **API Testing with cURL**

```bash
# Test server status
curl -X GET http://localhost:5000/

# Test admin stats (requires authentication)
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Content-Type: application/json" \
  -H "Cookie: jwt=your_jwt_token"
```

### **Database Testing**

- **MongoDB Connection**: Verify connection in server logs
- **Data Seeding**: Test sample data creation
- **CRUD Operations**: Test all endpoints
- **Authentication**: Test login/logout functionality

## 🚀 Deployment

### **Production Environment**

```bash
# Set production environment variables
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CORS_ORIGIN=your_frontend_domain
```

### **Deployment Platforms**

- **Heroku**: Easy deployment with Git integration
- **Railway**: Modern deployment platform
- **DigitalOcean**: VPS deployment
- **AWS**: EC2 or Elastic Beanstalk

### **Environment Variables for Production**

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CORS_ORIGIN=your_frontend_domain
MAIL_USER=your_smtp_username
MAIL_PASS=your_smtp_password
SENDER_EMAIL=your_sender_email
```

## 🐛 Troubleshooting

### **Common Issues**

1. **MongoDB Connection Error**

   ```bash
   # Check MongoDB service
   mongod --version

   # Verify connection string
   echo $MONGODB_URI
   ```

2. **Port Already in Use**

   ```bash
   # Kill process using port 5000
   npx kill-port 5000
   ```

3. **JWT Token Issues**

   - Check JWT_SECRET in .env file
   - Verify token expiration settings
   - Check cookie configuration

4. **Email Issues**
   - Verify SMTP settings
   - Check email credentials
   - Test email functionality

### **Debug Mode**

```bash
# Enable debug logging
DEBUG=* npm run dev
```

## 📝 Development Notes

### **Technology Stack**

- **Express.js 5.1.0**: Latest Express.js with modern features
- **Mongoose 8.18.2**: Latest Mongoose with improved performance
- **MongoDB 6.20.0**: NoSQL database for flexible data storage
- **jsonwebtoken 9.0.2**: Secure token-based authentication
- **bcrypt 6.0.0**: Secure password hashing
- **Nodemailer 7.0.6**: Professional email delivery via SMTP
- **Helmet 8.1.0**: HTTP security headers
- **CORS 2.8.5**: Cross-origin resource sharing
- **Morgan 1.10.1**: HTTP request logging
- **Compression 1.8.1**: Response compression
- **Cookie-parser 1.4.7**: Cookie parsing middleware
- **Nodemon 3.1.10**: Automatic server restarts during development

### **Validation Rules**

- **Password**: Minimum 8 characters, at least 1 letter and 1 number
- **NIC**: Supports both old format (9 digits + V/X) and new format (12 digits)
- **Mobile Number**: 10 digits exactly
- **Email**: RFC-compliant email validation

### **Database Features**

- **Soft Delete**: Medical records and prescriptions use `isDeleted` flag for data retention
- **Indexing**: Compound indexes on medical records for faster queries
- **Virtual Fields**: Medical records include summary virtual for listing views
- **Transactions**: Medical record creation uses MongoDB transactions for data consistency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👥 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Check server logs for error messages
4. Create an issue with detailed information

---

**Happy Healthcare API Development! 🏥**
