# Synqit Backend

A comprehensive Node.js backend for the Synqit Web3 collaboration platform with enhanced authentication, email verification, and security features.

## 🚀 Features

### ✅ Enhanced Authentication System
- **Email Verification**: Magic link-based email verification using Resend
- **Password Reset**: Secure password reset via email with time-limited tokens
- **Account Security**: Failed login tracking with automatic lockout
- **Session Management**: JWT-based authentication with session invalidation
- **Password Management**: Change password and email for authenticated users
- **Email Templates**: Professional, responsive email templates

### 🔐 Security Features
- **Password Strength Validation**: Enforced strong password requirements
- **Account Lockout**: 5 failed attempts = 30-minute lockout
- **Rate Limiting**: Configurable rate limiting on all endpoints
- **Token Security**: Secure token generation with expiration
- **BCRYPT Hashing**: Industry-standard password hashing
- **Session Invalidation**: Automatic cleanup of expired sessions

### 📧 Email Service (Resend Integration)
- **Verification Emails**: Welcome emails with verification links
- **Password Reset Emails**: Security-focused reset instructions
- **Welcome Emails**: Sent after successful email verification
- **Resend Functionality**: Users can resend verification emails

### 🎯 Requirements Implementation
Based on the comprehensive requirements document, we've implemented:

- ✅ **A2 2-10**: Complete registration and verification flow
- ✅ **A3 11-13**: Login with enhanced security
- ✅ **A4 14**: Recovery email verification
- ✅ **C1 59-61**: Password and email management
- ✅ **H1 93**: Failed password attempts handling
- 🔄 **H1 94**: 2FA framework (prepared for future implementation)

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Email Service**: Resend
- **Security**: bcryptjs, express-rate-limit, helmet
- **Validation**: express-validator
- **TypeScript**: Full TypeScript support

## 📋 Prerequisites

- Node.js 18 or higher
- PostgreSQL database
- Resend account for email service

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/synqit"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key-here"
FROM_EMAIL="noreply@synqit.com"

# Frontend URL (for email links)
FRONTEND_URL="http://localhost:3000"

# Server Configuration
PORT=5000
NODE_ENV="development"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/verify-email` | Verify email address | ❌ |
| POST | `/api/auth/resend-verification` | Resend verification email | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| POST | `/api/auth/forgot-password` | Request password reset | ❌ |
| POST | `/api/auth/reset-password` | Reset password | ❌ |
| POST | `/api/auth/change-password` | Change password | ✅ |
| POST | `/api/auth/change-email` | Change email | ✅ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| POST | `/api/auth/refresh` | Refresh token | ✅ |
| POST | `/api/auth/logout` | Logout user | ✅ |

### Example: User Registration
```javascript
// POST /api/auth/register
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "STARTUP",
  "bio": "Optional bio",
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```

### Example: Email Verification
```javascript
// POST /api/auth/verify-email
{
  "token": "verification-token-from-email"
}
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

### Project Structure
```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── lib/              # Configuration
├── prisma/               # Database schema
└── dist/                 # Compiled JavaScript
```

### Key Components

#### AuthService
- User registration with email verification
- Login with security features
- Password reset functionality
- Email and password management

#### EmailService
- Resend integration
- Professional email templates
- Verification and reset emails
- Welcome emails

#### TokenUtils
- Secure token generation
- Email verification tokens (24h expiry)
- Password reset tokens (1h expiry)
- 2FA backup codes (future use)

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Account Protection
- **Failed Login Tracking**: Monitor and track failed attempts
- **Account Lockout**: Automatic 30-minute lockout after 5 failed attempts
- **Session Management**: JWT tokens with expiration and invalidation
- **Password Reset Security**: Time-limited tokens, session invalidation

### Rate Limiting
- Authentication endpoints: 100 requests per 15 minutes
- Configurable limits per environment
- IP-based rate limiting

## 📧 Email Templates

Professional, responsive email templates included:

### Email Verification
- Welcome message with verification link
- 24-hour expiry notice
- Branded styling with gradients

### Password Reset
- Security-focused messaging
- 1-hour expiry notice
- Clear instructions and warnings

### Welcome Email
- Sent after successful verification
- Platform feature highlights
- Call-to-action buttons

## 🧪 Testing

### Manual Testing Flow
1. Register new user → Check verification email
2. Verify email → Check welcome email
3. Login with verified account
4. Test failed login attempts (should lock after 5)
5. Test password reset flow
6. Test change password/email
7. Test token refresh and logout

### Test User Creation
```javascript
// Create test user
const testUser = {
  email: "test@example.com",
  password: "TestPassword123!",
  firstName: "Test",
  lastName: "User",
  userType: "STARTUP"
};
```

## 🚀 Production Deployment

### Environment Variables
```bash
# Production Database
DATABASE_URL="postgresql://prod_user:prod_pass@prod_host:5432/synqit_prod"

# Strong JWT Secret (64+ characters recommended)
JWT_SECRET="production-super-secret-jwt-key-minimum-64-chars-recommended"

# Production Email
RESEND_API_KEY="production-resend-api-key"
FROM_EMAIL="noreply@synqit.com"

# Production Frontend
FRONTEND_URL="https://synqit.com"

# Production Settings
NODE_ENV="production"
PORT=5000
```

### Production Checklist
- [ ] SSL certificate installed
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Email domain verified
- [ ] Rate limiting configured
- [ ] Monitoring set up
- [ ] Error tracking enabled
- [ ] Backup strategy implemented

## 🔄 Future Enhancements

### Planned Features
- **2FA Authentication**: TOTP-based two-factor authentication
- **IP Monitoring**: Unusual login location detection
- **Phone Verification**: SMS-based verification
- **Terms & Privacy**: Legal compliance features
- **Notification Settings**: User preference management
- **Account Migration**: Import from other platforms

### Performance Optimization
- Database indexing optimization
- Email queue for bulk operations
- Caching layer for frequently accessed data
- Background job processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For issues and questions:
- Check the troubleshooting section in `SETUP_CHECKLIST.md`
- Review the API documentation in `API_DOCUMENTATION.md`
- Create an issue in the repository

---

**Built with ❤️ for the Web3 collaboration community** 