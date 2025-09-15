# TickerTracker Backend API

A robust Node.js/Express backend for the TickerTracker stock market application, built with the MERN stack.

## Features

- **Authentication & Authorization**
  - User registration and login
  - JWT token-based authentication
  - Password hashing with bcrypt
  - Email verification
  - Password reset functionality
  - Account lockout after failed attempts
  - Role-based access control (user, premium, admin)

- **User Management**
  - Complete user profiles
  - Stock market preferences
  - Watchlist management
  - Subscription management
  - API usage tracking

- **Security**
  - Helmet.js for security headers
  - Rate limiting
  - CORS configuration
  - Input validation and sanitization
  - Secure cookie handling

- **Database**
  - MongoDB with Mongoose ODM
  - Comprehensive user schema
  - Data validation and indexes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Express Validator
- **Security**: Helmet, bcryptjs, CORS
- **Development**: Nodemon

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TickerTracker-MSBC/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/tickertracker
   JWT_SECRET=your_very_long_and_secure_secret_key
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas cloud service

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Verify installation**
   Open `http://localhost:5000/health` in your browser

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/preferences` - Update user preferences
- `PUT /api/auth/change-password` - Change password

### Password Recovery
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password with token

### Email Verification
- `PUT /api/auth/verify-email/:token` - Verify email address

### Watchlist Management
- `POST /api/auth/watchlist` - Add stock to watchlist
- `DELETE /api/auth/watchlist/:symbol` - Remove stock from watchlist

### Admin Routes
- `GET /api/auth/users` - Get all users (admin only)
- `PUT /api/auth/users/:id/role` - Update user role (admin only)
- `DELETE /api/auth/users/:id` - Delete user (admin only)
- `GET /api/auth/stats` - Get user statistics (admin only)

## User Schema

The User model includes:

- **Basic Information**: username, email, password, firstName, lastName
- **Security**: email verification, password reset tokens, login attempts tracking
- **Stock Market Preferences**: default currency, risk tolerance, investment experience
- **Watchlist**: Array of tracked stock symbols
- **Portfolios**: User-defined portfolios
- **Notifications**: Preference settings for alerts
- **Subscription**: Plan details and status
- **API Usage**: Request tracking and limits

## Security Features

1. **Password Security**
   - Minimum 6 characters with complexity requirements
   - Bcrypt hashing with salt rounds
   - Password reset with time-limited tokens

2. **Account Protection**
   - Account lockout after 5 failed login attempts
   - 2-hour lockout duration
   - Rate limiting on authentication endpoints

3. **JWT Tokens**
   - Secure token generation
   - Configurable expiration
   - Cookie-based and header-based authentication

4. **Input Validation**
   - Express Validator for all inputs
   - Email format validation
   - Username format restrictions

## Development

### Scripts
```bash
npm run dev     # Start with nodemon (auto-restart)
npm start       # Start production server
npm test        # Run tests (when implemented)
```

### Project Structure
```
backend/
├── config/
│   └── database.js      # MongoDB connection
├── controllers/
│   └── authController.js # Authentication logic
├── middleware/
│   └── auth.js          # Authentication middleware
├── models/
│   └── User.js          # User data model
├── routes/
│   └── auth.js          # API routes
├── .env.example         # Environment template
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
└── server.js           # Application entry point
```

### Environment Variables

Key environment variables to configure:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (use a long, random string)
- `JWT_EXPIRE` - Token expiration time (e.g., "30d")
- `FRONTEND_URL` - Frontend application URL for CORS
- `PORT` - Server port (default: 5000)

## Production Deployment

1. **Set production environment**
   ```env
   NODE_ENV=production
   ```

2. **Use secure configurations**
   - Strong JWT secret
   - HTTPS-only cookies
   - Proper CORS settings
   - MongoDB Atlas for database

3. **Security checklist**
   - [ ] Change default JWT secret
   - [ ] Use HTTPS in production
   - [ ] Set up proper CORS origins
   - [ ] Configure rate limiting
   - [ ] Set up monitoring and logging
   - [ ] Use environment variables for all secrets

## API Testing

You can test the API using tools like Postman or curl:

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "test@example.com",
    "password": "Test123!"
  }'
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
