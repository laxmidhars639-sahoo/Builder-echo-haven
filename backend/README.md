# SkyTraining Backend API

A comprehensive Node.js backend for the SkyTraining pilot training application, built with Express.js and MongoDB.

## Features

- **User Authentication**: JWT-based authentication for students and admins
- **User Management**: Complete user profiles with role-based access
- **Course Management**: CRUD operations for pilot training courses
- **Enrollment System**: Student course enrollment with payment tracking
- **Admin Dashboard**: Comprehensive admin panel with analytics
- **Security**: Rate limiting, input validation, and secure password hashing
- **Documentation**: Well-documented API endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs
- **Environment Management**: dotenv

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone and navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/skytraining
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

4. **Start the server**

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

### MongoDB Setup

**Option 1: Local MongoDB**

- Install MongoDB locally
- Start MongoDB service
- Use connection string: `mongodb://localhost:27017/skytraining`

**Option 2: MongoDB Atlas (Cloud)**

- Create account at [MongoDB Atlas](https://mongodb.com/atlas)
- Create a cluster and get connection string
- Update `MONGODB_URI` in `.env` file

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "+1234567890",
  "userType": "student",
  "gender": "male"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123",
  "userType": "student"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Course Endpoints

#### Get All Courses

```http
GET /api/courses?page=1&limit=10&category=license&status=active
```

#### Get Single Course

```http
GET /api/courses/:id
```

#### Create Course (Admin Only)

```http
POST /api/courses
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Private Pilot License",
  "description": "Learn to fly single-engine aircraft",
  "duration": "6-12 months",
  "price": "$8,500",
  "priceNumeric": 8500,
  "category": "license",
  "level": "beginner"
}
```

### Enrollment Endpoints

#### Create Enrollment (Student Only)

```http
POST /api/enrollments
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "courseId": "course_object_id",
  "paymentMode": "Credit Card",
  "installments": "Within 3 months",
  "gender": "male"
}
```

#### Get My Enrollments (Student Only)

```http
GET /api/enrollments/my
Authorization: Bearer <student_token>
```

#### Get All Enrollments (Admin Only)

```http
GET /api/enrollments?page=1&limit=10&status=enrolled
Authorization: Bearer <admin_token>
```

### Admin Endpoints

#### Get Dashboard Stats (Admin Only)

```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

#### Get Students List (Admin Only)

```http
GET /api/admin/students?page=1&limit=10&search=john
Authorization: Bearer <admin_token>
```

#### Get Analytics (Admin Only)

```http
GET /api/admin/analytics
Authorization: Bearer <admin_token>
```

### User Management Endpoints

#### Get User Profile

```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890"
}
```

#### Change Password

```http
PUT /api/users/:id/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

## Data Models

### User Model

- Personal information (name, email, phone, gender)
- Authentication (password, user type)
- Flight data (flight hours, certificates)
- Address and emergency contacts
- Medical certificate information

### Course Model

- Course details (title, description, duration, price)
- Academic information (curriculum, prerequisites)
- Instructor and aircraft requirements
- Enrollment limits and current count

### Enrollment Model

- Student and course references
- Payment information and schedule
- Academic progress tracking
- Flight hours and exam results
- Schedule and completion data

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Cross-origin request security
- **Account Locking**: Automatic lockout after failed attempts

## Error Handling

The API uses consistent error response format:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [...]
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Development

### File Structure

```
backend/
├── models/          # Database models
├── routes/          # API routes
├── middleware/      # Custom middleware
├── package.json     # Dependencies
├── server.js        # Main server file
└── README.md        # This file
```

### Available Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with auto-reload
- `npm test`: Run tests

### Environment Variables

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRE`: JWT expiration time
- `FRONTEND_URL`: Frontend URL for CORS

## Production Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure MongoDB Atlas connection
4. Set up proper CORS origins
5. Configure rate limiting

### Security Checklist

- [ ] Strong JWT secret key
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Input validation active
- [ ] Error logging set up
- [ ] Database backups scheduled

## Support

For questions or issues:

1. Check the API documentation above
2. Review error messages and logs
3. Ensure all environment variables are set
4. Verify MongoDB connection

## License

This project is licensed under the MIT License.
