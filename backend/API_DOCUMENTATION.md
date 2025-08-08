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

## File Upload Endpoints

### Upload Profile Image
Upload a user's profile image to Cloudinary.

**Endpoint:** `POST /profile/image`
**Access:** Private (requires authentication)
**Content-Type:** `multipart/form-data`

**Form Data:**
- `profileImage` (file): Image file (jpg, jpeg, png, gif, webp, svg, max 5MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "profileImage": "https://res.cloudinary.com/synqit/image/upload/...",
    "profile": {
      // Updated user profile object
    }
  },
  "message": "Profile image uploaded successfully"
}
```

### Upload Company Logo
**Endpoint:** `POST /profile/company/logo`
**Form Field:** `companyLogo`

### Upload Company Banner
**Endpoint:** `POST /profile/company/banner`
**Form Field:** `companyBanner`

### Upload Project Logo
**Endpoint:** `POST /project/logo`
**Form Field:** `projectLogo`

### Upload Project Banner
**Endpoint:** `POST /project/banner`
**Form Field:** `projectBanner`

## Matching & Partnership Endpoints

### Create Partnership Request
Send a partnership request to another user's project.

**Endpoint:** `POST /matches/request`
**Access:** Private

**Request Body:**
```json
{
  "receiverProjectId": "uuid-of-target-project",
  "partnershipType": "TECHNICAL",
  "title": "DeFi Integration Partnership",
  "description": "Looking to integrate our DeFi protocol with your platform...",
  "proposedTerms": "Revenue sharing model, 50/50 split",
  "duration": "6 months",
  "equity": 5.0,
  "compensation": "Token allocation + advisory fee"
}
```

**Partnership Types:**
- `TECHNICAL` - Technical collaboration
- `BUSINESS` - Business development
- `MARKETING` - Marketing collaboration
- `ADVISORY` - Advisory services
- `INVESTMENT` - Investment opportunity
- `COLLABORATION` - General collaboration

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "partnership-uuid",
    "title": "DeFi Integration Partnership",
    "status": "PENDING",
    "partnershipType": "TECHNICAL",
    "requester": { /* user info */ },
    "receiver": { /* user info */ },
    "requesterProject": { /* project info */ },
    "receiverProject": { /* project info */ },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Partnership request sent successfully"
}
```

### Accept Partnership Request
**Endpoint:** `POST /matches/:id/accept`
**Access:** Private (must be receiver)

### Reject Partnership Request
**Endpoint:** `POST /matches/:id/reject`
**Access:** Private (must be receiver)

### Cancel Partnership Request
**Endpoint:** `POST /matches/:id/cancel`
**Access:** Private (must be requester)

### Get User Partnerships
**Endpoint:** `GET /matches`
**Access:** Private

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (`all`, `pending`, `accepted`, `rejected`, `cancelled`)
- `type` (string): Filter by partnership type
- `sortBy` (string): Sort field (`createdAt`, `updatedAt`, `title`)
- `sortOrder` (string): Sort order (`asc`, `desc`)

### Get Partnership Details
**Endpoint:** `GET /matches/:id`
**Access:** Private (must be involved in partnership)

### Get Sent Partnerships
**Endpoint:** `GET /matches/sent`
**Access:** Private

### Get Received Partnerships
**Endpoint:** `GET /matches/received`
**Access:** Private

### Get Recommended Matches
**Endpoint:** `GET /matches/recommendations`
**Access:** Private

**Query Parameters:**
- `limit` (number): Number of recommendations (default: 10, max: 50)
- `projectType` (string): Filter by project type
- `blockchainFocus` (string): Filter by blockchain focus
- `excludeExisting` (boolean): Exclude existing partnerships (default: true)

### Get Partnership Statistics
**Endpoint:** `GET /matches/stats`
**Access:** Private

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "pending": 5,
    "accepted": 15,
    "rejected": 3,
    "cancelled": 2,
    "sent": 12,
    "received": 13,
    "successRate": 60
  },
  "message": "Partnership statistics retrieved successfully"
}
```

## Messaging Endpoints

### Send Message
Send a message within a partnership conversation.

**Endpoint:** `POST /messages/send`
**Access:** Private

**Request Body:**
```json
{
  "partnershipId": "uuid-of-partnership",
  "content": "Hey! I'd love to discuss the technical integration details...",
  "messageType": "TEXT"
}
```

**Message Types:**
- `TEXT` - Regular text message
- `FILE` - File attachment (future)
- `SYSTEM` - System-generated message

### Get Conversations
Get all conversations for the authenticated user.

**Endpoint:** `GET /messages/conversations`
**Access:** Private

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `unreadOnly` (boolean): Show only conversations with unread messages

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "partnership-uuid",
        "title": "DeFi Integration Partnership",
        "status": "ACCEPTED",
        "partner": { /* partner user info */ },
        "partnerProject": { /* partner project info */ },
        "lastMessage": {
          "content": "Sounds great! Let's schedule a call.",
          "createdAt": "2024-01-01T10:30:00.000Z",
          "sender": { /* sender info */ }
        },
        "unreadCount": 2,
        "updatedAt": "2024-01-01T10:30:00.000Z"
      }
    ],
    "pagination": { /* pagination info */ }
  },
  "message": "Conversations retrieved successfully"
}
```

### Get Partnership Messages
**Endpoint:** `GET /messages/partnerships/:id`
**Access:** Private

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page (default: 50)
- `before` (ISO date): Get messages before this date
- `after` (ISO date): Get messages after this date

### Mark Messages as Read
**Endpoint:** `POST /messages/mark-read`
**Access:** Private

**Request Body:**
```json
{
  "partnershipId": "uuid-of-partnership",
  "messageIds": ["msg-uuid-1", "msg-uuid-2"] // Optional
}
```

### Get Unread Message Count
**Endpoint:** `GET /messages/unread-count`
**Access:** Private

### Search Messages
**Endpoint:** `GET /messages/search`
**Access:** Private

**Query Parameters:**
- `q` (string): Search query (min 2 characters)
- `partnershipId` (string): Optional partnership filter
- `page` (number): Page number
- `limit` (number): Items per page

### Delete Message
**Endpoint:** `DELETE /messages/:id`
**Access:** Private (must be sender)

### Get Message Statistics
**Endpoint:** `GET /messages/stats`
**Access:** Private

## Company Management Endpoints

### Get All Companies
Browse all companies with filtering and pagination.

**Endpoint:** `GET /companies`
**Access:** Public

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search term
- `projectType` (string): Filter by project type
- `blockchainFocus` (string): Filter by blockchain focus
- `location` (string): Filter by location
- `fundingStage` (string): Filter by funding stage
- `teamSize` (string): Filter by team size
- `isVerified` (boolean): Filter by verification status
- `sortBy` (string): Sort field (`trustScore`, `viewCount`, `createdAt`, `companyName`)
- `sortOrder` (string): Sort order (`asc`, `desc`)

**Response:**
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "company-uuid",
        "companyName": "Awesome DeFi Co",
        "projectName": "DeFi Protocol",
        "description": "Revolutionary DeFi platform...",
        "companyLogo": "https://...",
        "projectType": "DeFi",
        "blockchainFocus": "Ethereum",
        "trustScore": 85,
        "viewCount": 1250,
        "isVerified": true,
        "owner": { /* owner info */ },
        "tags": [ /* project tags */ ],
        "partnershipCount": 12
      }
    ],
    "pagination": { /* pagination info */ }
  },
  "message": "Companies retrieved successfully"
}
```

### Get Company Details
**Endpoint:** `GET /companies/:id`
**Access:** Public (view tracking for authenticated users)

### Get Featured Companies
**Endpoint:** `GET /companies/featured`
**Access:** Public

**Query Parameters:**
- `limit` (number): Number of companies (default: 10, max: 20)

### Get Trending Companies
**Endpoint:** `GET /companies/trending`
**Access:** Public

**Query Parameters:**
- `limit` (number): Number of companies
- `timeframe` (string): Timeframe (`7d`, `30d`, `90d`)

### Advanced Company Search
**Endpoint:** `GET /companies/search`
**Access:** Public

**Query Parameters:**
- `q` (string): Search query (required, min 2 characters)
- `projectTypes` (array): Array of project types
- `blockchainFocuses` (array): Array of blockchain focuses
- `fundingStages` (array): Array of funding stages
- `teamSizes` (array): Array of team sizes
- `minTrustScore` (number): Minimum trust score (0-100)
- `isVerified` (boolean): Verification filter
- `hasPartnerships` (boolean): Partnership filter
- `location` (string): Location filter
- `page` (number): Page number
- `limit` (number): Items per page

### Get Companies by Type
**Endpoint:** `GET /companies/by-type/:type`
**Access:** Public

### Get Company Statistics
**Endpoint:** `GET /companies/stats`
**Access:** Public

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCompanies": 1250,
    "verifiedCompanies": 890,
    "verificationRate": 71,
    "companiesByType": {
      "DeFi": 320,
      "Infrastructure": 280,
      "Gaming": 250,
      "NFT": 180,
      "Social": 120
    },
    "trustScoreStats": {
      "average": 68,
      "minimum": 15,
      "maximum": 98
    },
    "topBlockchainFocuses": [
      { "focus": "Ethereum", "count": 450 },
      { "focus": "Solana", "count": 320 }
    ]
  },
  "message": "Company statistics retrieved successfully"
}
```

### Get Similar Companies
**Endpoint:** `GET /companies/:id/similar`
**Access:** Public

## Future Endpoints (Roadmap)

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

# Cloudinary Configuration (File Upload Service)
CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_API_SECRET="your-cloudinary-api-secret"

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