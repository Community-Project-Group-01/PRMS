# PRMS Frontend - React + Vite

The frontend application for the Patient Record Management System (PRMS), built with React 19, Vite, and Tailwind CSS. This modern healthcare management interface provides role-based dashboards for administrators, doctors, and patients.

## 🚀 Features

### 🎨 **Modern UI/UX**

- **React 19** with latest hooks and context API
- **Vite** for lightning-fast development and building
- **Tailwind CSS** for responsive, modern design
- **React Icons** for consistent iconography
- **React Hot Toast** for user notifications
- **React Router DOM** for client-side routing

### 🏥 **Healthcare Dashboards**

#### **Admin Dashboard**

- **Overview Section**: Comprehensive analytics with interactive pie charts
- **Patient Management**: View and manage patient profiles
- **Doctor Management**: Manage doctor profiles and specializations
- **System Statistics**: Real-time data visualization
- **Quick Actions**: Easy access to common tasks

#### **Doctor Dashboard**

- **Patient Overview**: View assigned patients
- **Medical Records**: Create and manage SOAP notes
- **Appointments**: Schedule and manage patient appointments
- **Prescription Management**: Generate and track prescriptions

#### **Patient Dashboard**

- **Profile Management**: Update personal information
- **Medical History**: View medical records and prescriptions
- **Appointment Booking**: Schedule appointments with doctors

### 📊 **Data Visualization**

- **Interactive Pie Charts**: Patient type distribution with hover effects
- **Statistics Cards**: Key metrics with trend indicators
- **Monthly Charts**: Medical records activity over time
- **Recent Activity Feed**: Real-time system updates

## 🛠 Technology Stack

### **Core Technologies**

- **React 19.1.1** - Latest React with modern features
- **Vite 7.1.7** - Fast build tool and development server
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **React Router DOM 7.9.3** - Client-side routing

### **UI Components**

- **React Icons 5.5.0** - Icon library
- **React Hot Toast 2.6.0** - Toast notifications
- **Axios 1.12.2** - HTTP client for API calls

### **Development Tools**

- **ESLint 9.36.0** - Code linting
- **Vite Plugin React 5.0.3** - React support for Vite
- **TypeScript Types** - Type definitions for React

## 📁 Project Structure

```
client/
├── public/
│   └── index.html              # Main HTML template
├── src/
│   ├── api/
│   │   └── client.js           # Axios configuration with credentials
│   ├── components/
│   │   ├── admin/              # Admin-specific components
│   │   │   ├── Overview.jsx    # Analytics dashboard with pie charts
│   │   │   ├── Patients.jsx    # Patient management
│   │   │   ├── Doctors.jsx     # Doctor management
│   │   │   └── Inventory.jsx   # Inventory management (placeholder)
│   │   ├── doctor/             # Doctor-specific components
│   │   │   ├── Overview.jsx    # Doctor dashboard
│   │   │   ├── Patients.jsx    # Patient list for doctors
│   │   │   └── Appointments.jsx # Appointment management
│   │   ├── common/             # Shared components
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── Sidebar.jsx     # Dashboard sidebar
│   │   │   ├── Footer.jsx      # Footer component
│   │   │   ├── Button.jsx      # Reusable button
│   │   │   └── Spinner.jsx     # Loading spinner
│   │   ├── forms/              # Form components
│   │   │   ├── AdminForm.jsx
│   │   │   ├── DoctorForm.jsx
│   │   │   └── PatientForm.jsx
│   │   └── medical/            # Medical components
│   │       ├── MedicalRecordForm.jsx
│   │       ├── prescription/
│   │       │   └── PrescriptionForm.jsx
│   │       ├── soap/
│   │       │   └── SoapForm.jsx
│   │       └── vitals/
│   │           └── VitalsForm.jsx
│   ├── pages/                  # Page components
│   │   ├── Login.jsx           # Authentication page
│   │   ├── Dashboard.jsx       # Main dashboard router
│   │   ├── ErrorPage.jsx       # Error handling
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx
│   │   └── doctor/
│   │       └── DoctorDashboard.jsx
│   ├── context/
│   │   └── AppContext.jsx       # Global state management
│   ├── middleware/
│   │   └── ProtectedRoutes.jsx # Route protection
│   ├── utils/
│   │   └── validator.js         # Client-side validation
│   ├── App.jsx                 # Main application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── package.json
├── vite.config.js             # Vite configuration
└── eslint.config.js           # ESLint configuration
```

## 🚀 Getting Started

### **Prerequisites**

- Node.js (v14 or higher)
- npm or yarn

### **Installation**

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the client directory:

   ```env
   VITE_API_URL=
   ```

   **Local dev**: Leave `VITE_API_URL` empty. Vite proxies `/api` to `http://localhost:5000` so auth cookies work on the same origin (`localhost:5173`). Start the backend on port 5000 before `npm run dev`.

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### **Available Scripts**

- `npm run dev` - Start development server with hot reload (Vite HMR)
- `npm run build` - Build for production (outputs to `dist` folder)
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🎨 UI Components

### **Admin Overview Dashboard**

- **Statistics Cards**: Total patients, doctors, medical records, prescriptions
- **Interactive Pie Chart**: Patient type distribution with hover effects
- **Monthly Charts**: Medical records activity over time
- **Recent Activity**: Latest medical records with patient/doctor info
- **Quick Actions**: Easy access to common administrative tasks

### **Responsive Design**

- **Mobile-First**: Optimized for all screen sizes
- **Tailwind CSS**: Utility-first styling approach
- **Component-Based**: Reusable UI components
- **Accessibility**: WCAG compliant design patterns

## 🔧 Configuration

### **Vite Configuration**

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### **API Configuration**

```javascript
// src/api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: "" // dev: empty uses Vite proxy; production: set VITE_API_URL to API host
  withCredentials: true,
});
```

## 🧪 Testing

### **Manual Testing**

1. **Login as Admin**: Test the overview dashboard with pie charts
2. **Patient Management**: Browse and manage patient profiles
3. **Doctor Management**: View doctor specializations
4. **Responsive Design**: Test on different screen sizes

### **Development Testing**

- **Hot Reload**: Changes reflect immediately
- **ESLint**: Code quality checks
- **Console Logging**: Debug information for pie charts and API calls

## 🚀 Deployment

### **Production Build**

```bash
npm run build
```

### **Deploy to Static Hosting**

- **Vercel**: Connect GitHub repository
- **Netlify**: Drag and drop dist folder
- **GitHub Pages**: Use GitHub Actions

### **Environment Variables for Production**

```env
VITE_API_URL=https://your-api-domain.com
```

**Important**: Do not add `/api` to `VITE_API_URL`; axios paths already start with `/api/...`. Ensure CORS on the backend allows your frontend origin.

## 🐛 Troubleshooting

### **Common Issues**

1. **Port Already in Use**

   ```bash
   # Kill process using port 5173
   npx kill-port 5173
   ```

2. **API Connection Issues**

   - Check VITE_API_URL in .env file
   - Verify backend server is running
   - Check CORS configuration

3. **Build Issues**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📝 Development Notes

### **Technology Stack**

**Core Technologies:**
- **React 19.1.1**: Latest React with modern hooks and context API
- **React DOM 19.1.1**: React rendering library
- **Vite 7.1.7**: Fast build tool and development server with HMR
- **Tailwind CSS 4.1.14**: Utility-first CSS framework
- **React Router DOM 7.9.3**: Client-side routing and navigation

**UI Libraries:**
- **React Icons 5.5.0**: Comprehensive icon library
- **React Hot Toast 2.6.0**: Toast notification system

**Development Tools:**
- **Axios 1.12.2**: HTTP client for API requests with credentials support
- **ESLint 9.36.0**: Code linting and quality checks
- **Vite Plugin React 5.0.3**: React support for Vite

### **Architecture**

- **Component-Based**: Modular, reusable React components
- **State Management**: React Context API (`AppContext`) for global state
- **Routing**: React Router with protected routes middleware
- **API Integration**: Centralized Axios client with credentials for authentication
- **Form Handling**: Custom form components for admin, doctor, and patient registration
- **Medical Components**: Specialized components for SOAP notes, prescriptions, and vitals

### **Key Features**

- **Role-Based Dashboards**: Separate dashboards for admin, doctor, and patient roles
- **Protected Routes**: Middleware for route protection based on authentication
- **Real-Time Updates**: Context API for reactive state updates
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Error Handling**: Error page component for 404 and other errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.
