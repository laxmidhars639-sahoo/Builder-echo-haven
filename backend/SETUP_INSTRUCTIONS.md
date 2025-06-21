# SkyTraining Backend Setup Instructions

## Problem Fixed

The issue was that the frontend and backend were not properly communicating. Here's what I've fixed:

### 1. **CORS Configuration**

- Updated `server.js` to allow requests from port 8080 (where your frontend is running)
- Added support for multiple development ports

### 2. **File-Based Storage Solution**

Since MongoDB connection was causing issues, I've created a file-based storage solution for development:

- Created `utils/fileStorage.js` - Simple file-based user storage
- Created `routes/auth-dev.js` - Development authentication routes
- Created `server-dev.js` - Development server without MongoDB dependency

## How to Start the Backend (Choose One Option)

### Option 1: Use File-Based Development Server (Recommended)

```bash
cd backend
npm run dev-simple
```

### Option 2: Fix MongoDB Connection

If you want to use MongoDB, you need to:

1. Install MongoDB locally or get a MongoDB Atlas connection string
2. Update the `MONGODB_URI` in `.env` file
3. Run: `npm run dev`

## Testing the Setup

### 1. Start the Backend

```bash
cd backend
npm run dev-simple
```

You should see:

```
✅ File-based storage initialized (Development Mode)
🚀 Server running on port 5000
✅ Ready to accept connections!
```

### 2. Test the API

Open a new terminal and test:

```bash
# Health check
curl http://localhost:5000/api/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "userType": "student"
  }'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "userType": "student"
  }'
```

### 3. Start the Frontend

In another terminal:

```bash
npm run dev
```

## What's Different Now

### Frontend Changes:

- ✅ Login page now calls real backend API
- ✅ Signup page now calls real backend API
- ✅ Proper error handling for invalid credentials
- ✅ Token storage for authenticated requests

### Backend Changes:

- ✅ Fixed CORS to allow frontend connections
- ✅ Created file-based storage (no MongoDB needed)
- ✅ Proper user authentication and validation
- ✅ Password hashing and security
- ✅ Login attempt tracking and account locking

## User Data Storage

User data is stored in `backend/data/users.json`. You can view this file to see registered users.

## Authentication Flow

1. **Signup**: Creates new user in file storage with hashed password
2. **Login**: Verifies email/password and user type, returns JWT token
3. **Protection**: Users can only login if they have signed up first
4. **Security**: Passwords are hashed, failed login attempts are tracked

## Switching to MongoDB Later

When you're ready to use MongoDB:

1. Install MongoDB or get Atlas connection string
2. Update `MONGODB_URI` in `.env`
3. Change the import in `server.js` from `auth-dev` to `auth`
4. Use `npm run dev` instead of `npm run dev-simple`

## Troubleshooting

### Backend not starting:

- Check if port 5000 is available
- Ensure all dependencies are installed: `npm install`
- Check `.env` file exists

### Frontend can't connect:

- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify frontend is making requests to `http://localhost:5000`

### Login/Signup not working:

- Check backend console for error messages
- Verify user data in `backend/data/users.json`
- Test API endpoints with curl commands above
