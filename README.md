# PRMS - MERN Stack Application

A modern web application built with the MERN stack (MongoDB, Express.js, React, Node.js) for Project Resource Management System.

## 🚀 Features

- **Full-Stack MERN Application**: Complete frontend and backend setup
- **User Authentication**: Ready-to-implement auth system with JWT
- **MongoDB Integration**: Database connection with Mongoose ODM
- **RESTful API**: Express.js backend with organized routes
- **Modern React Frontend**: React 19 with hooks and modern practices
- **Development Environment**: Hot reload and concurrent development servers
- **Environment Configuration**: Secure environment variable management

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

2. **Install all dependencies**

   ```bash
   npm install
   npm run install-all
   ```

3. **Set up environment variables**

   **Server Environment** (`server/.env`):

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/prms
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
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

### Development Mode (Recommended)

Start both frontend and backend servers simultaneously:

```bash
npm run dev
```

This will start:

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

### Individual Servers

**Backend only:**

```bash
npm run server
```

**Frontend only:**

```bash
npm run client
```

## 📁 Project Structure

```
PRMS/
├── package.json              # Root package with scripts
├── README.md                 # This file
├── server/                   # Backend (Express + MongoDB)
│   ├── index.js             # Main server file
│   ├── .env                 # Server environment variables
│   ├── package.json         # Server dependencies
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication routes
│   │   └── users.js         # User management routes
│   └── models/              # Database models
│       └── User.js          # User schema with validation
└── client/                  # Frontend (React)
    ├── .env                 # Client environment variables
    ├── public/              # Static files
    ├── src/                 # React source code
    │   ├── App.js           # Main App component
    │   ├── App.css          # App styles
    │   └── index.js         # React entry point
    └── package.json         # React dependencies
```

## 🔧 Available Scripts

### Root Level Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend server
- `npm run build` - Build React app for production
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

#### Authentication Routes (`/api/auth`)

- `GET /test` - Test auth routes
- `POST /register` - Register new user (ready for implementation)
- `POST /login` - User login (ready for implementation)

#### User Routes (`/api/users`)

- `GET /test` - Test user routes
- `GET /` - Get all users (ready for implementation)

#### General Routes

- `GET /` - Server status and welcome message

## 🗄 Database Schema

### User Model

```javascript
{
  name: String (required, min: 2 chars),
  email: String (required, unique, valid email),
  password: String (required, min: 6 chars, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **Password Hashing**: Using bcryptjs for secure password storage
- **JWT Authentication**: Ready for token-based authentication
- **CORS Configuration**: Cross-origin resource sharing enabled
- **Input Validation**: Mongoose schema validation
- **Environment Variables**: Sensitive data stored in .env files

## 🧪 Testing the Setup

1. **Start the application:**

   ```bash
   npm run dev
   ```

2. **Open your browser** to http://localhost:3000

3. **Test the features:**
   - Check server connection status
   - Test auth routes using the buttons
   - Test users routes using the buttons
   - Verify MongoDB connection in server logs

## 🚀 Deployment

### Frontend (React)

```bash
cd client
npm run build
# Deploy the 'build' folder to your hosting service
```

### Backend (Express)

```bash
cd server
npm start
# Deploy to services like Heroku, Railway, or DigitalOcean
```

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

- `NODE_ENV=production`
- `MONGODB_URI=your_production_mongodb_uri`
- `JWT_SECRET=your_production_jwt_secret`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

- The application uses **React 19** with modern hooks
- **Express 5** for the backend API
- **Mongoose 8** for MongoDB object modeling
- **Concurrently** for running multiple development servers
- **Nodemon** for automatic server restarts during development

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running locally or check your Atlas connection string
   - Verify the MONGODB_URI in your .env file

2. **Port Already in Use**

   - Change the PORT in server/.env file
   - Kill processes using the ports: `npx kill-port 3000 5000`

3. **CORS Issues**
   - Check that the REACT_APP_API_URL matches your backend URL
   - Verify CORS is properly configured in server/index.js

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

If you encounter any issues or have questions, please:

1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information

---

**Happy Coding! 🎉**
