# Synqit API Documentation

## Overview

The Synqit API is a RESTful Web3 matchmaking platform that connects startups, investors, and ecosystem players. Built with Node.js, TypeScript, Express, and PostgreSQL.

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.synqit.com/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **Password reset**: 3 requests per hour
- **Messaging**: 50 messages per hour

## Response Format

All API responses follow this format:

```json
{
  "status": "success" | "error",
  "message": "Human readable message",
  "data": {} | null,
  "errors": [] | null
}
```

## Authentication Endpoints

### Register User
Creates a new user account and sends email verification.

**Endpoint:** `POST /auth/register`
**Access:** Public

**Request Body:**
```json
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

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully. Please check your email for verification.",
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "STARTUP",
      "isEmailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token",
    "expiresAt": "2024-01-08T00:00:00.000Z"
  }
}
```

### Verify Email
Verifies a user's email address using the verification token.

**Endpoint:** `POST /auth/verify-email`
**Access:** Public

**Request Body:**
```json
{
  "token": "verification-token"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Email verified successfully"
}
```

### Resend Verification Email
Resends the email verification email.

**Endpoint:** `POST /auth/resend-verification`
**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Verification email sent successfully"
}
```

### Login
Authenticates a user and returns a JWT token.

**Endpoint:** `POST /auth/login`
**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "STARTUP",
      "isEmailVerified": true,
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token",
    "expiresAt": "2024-01-08T00:00:00.000Z"
  }
}
```

### Forgot Password
Initiates the password reset process by sending a reset email.

**Endpoint:** `POST /auth/forgot-password`
**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "If the email exists, a password reset link will be sent"
}
```

### Reset Password
Resets a user's password using the reset token.

**Endpoint:** `POST /auth/reset-password`
**Access:** Public

**Request Body:**
```json
{
  "token": "reset-token",
  "newPassword": "NewStrongPassword123!"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

### Change Password
Changes the authenticated user's password.

**Endpoint:** `POST /auth/change-password`
**Access:** Private (requires authentication)

**Request Body:**
```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewStrongPassword123!"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

### Change Email
Changes the authenticated user's email address.

**Endpoint:** `POST /auth/change-email`
**Access:** Private (requires authentication)

**Request Body:**
```json
{
  "newEmail": "newemail@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Email changed successfully. Please verify your new email address."
}
```

### Logout
Invalidates the current user session.

**Endpoint:** `POST /auth/logout`
**Access:** Private (requires authentication)

**Response:**
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

### Get Profile
Returns the authenticated user's profile information.

**Endpoint:** `GET /auth/profile`
**Access:** Private (requires authentication)

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "STARTUP",
      "isEmailVerified": true,
      "subscriptionTier": "FREE",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLoginAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Refresh Token
Refreshes the JWT token for the authenticated user.

**Endpoint:** `POST /auth/refresh`
**Access:** Private (requires authentication)

**Response:**
```json
{
  "status": "success",
  "message": "Token refreshed successfully",
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "new-jwt-token",
    "expiresAt": "2024-01-08T00:00:00.000Z"
  }
}
```

## Endpoints

### Health Check

#### GET /api/health
Returns the API status and version.

**Response:**
```json
{
  "status": "ok",
  "message": "Synqit API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

## Error Codes

- **400 Bad Request**: Invalid request data or validation errors
- **401 Unauthorized**: Missing or invalid authentication token
- **403 Forbidden**: Insufficient permissions (subscription required)
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

## Data Models

### User Types
- `STARTUP`: Startup companies looking for partnerships
- `INVESTOR`: Investors looking for opportunities
- `ECOSYSTEM_PLAYER`: Service providers, exchanges, etc.
- `INDIVIDUAL`: Individual contributors

### Subscription Tiers
- `FREE`: Basic features
- `PREMIUM`: Enhanced visibility and features
- `ENTERPRISE`: Full access with priority support

### Blockchain Support
- Ethereum, Bitcoin, Solana, Polygon
- Binance Smart Chain, Avalanche, Cardano
- Polkadot, Cosmos, Arbitrum, Optimism, Base

### Partnership Types
- Technical Integration
- Marketing Collaboration
- Funding Opportunity
- Advisory Partnership
- Joint Venture
- Ecosystem Partnership
- Service Provider
- Talent Exchange

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token-based authentication
- Session management with expiry
- Rate limiting on all endpoints
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection protection via Prisma ORM

## Future Endpoints (Roadmap)

- `/api/companies` - Company management
- `/api/partnerships` - Partnership requests
- `/api/messages` - Direct messaging
- `/api/matches` - AI-powered matching
- `/api/notifications` - User notifications
- `/api/subscriptions` - Subscription management
- `/api/verification` - Identity verification
- `/api/analytics` - Platform analytics

## Environment Variables

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

## Email Templates

The system includes professional email templates for:
- **Email Verification**: Welcome email with verification link
- **Password Reset**: Security-focused reset instructions
- **Welcome Email**: Sent after successful email verification

All emails are responsive and include the Synqit branding with gradient styling.

## Implementation Notes

1. **Email Verification**: Users can log in before verification but should be prompted to verify
2. **Password Reset**: Tokens expire after 1 hour for security
3. **Account Lockout**: Automatically unlocks after 30 minutes or successful password reset
4. **Session Management**: JWT tokens are stored in database for invalidation capability
5. **Security**: All passwords are hashed using bcrypt with configurable salt rounds 