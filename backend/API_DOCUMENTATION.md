# Synqit API Documentation

## Overview

The Synqit API is a RESTful Web3 matchmaking platform that connects startups, investors, and ecosystem players. Built with Node.js, TypeScript, Express, and PostgreSQL.

## Base URL

```
Development: http://localhost:3001
Production: https://api.synqit.com
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
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
  "data": {}, // Present on success
  "errors": [] // Present on validation errors
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

### Authentication

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "STARTUP", // STARTUP | INVESTOR | ECOSYSTEM_PLAYER | INDIVIDUAL
  "bio": "Optional bio text",
  "walletAddress": "0x1234567890123456789012345678901234567890" // Optional
}
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "STARTUP",
      "subscriptionTier": "FREE",
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt_token_here",
    "expiresAt": "2024-01-08T00:00:00.000Z"
  }
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here",
    "expiresAt": "2024-01-08T00:00:00.000Z"
  }
}
```

#### POST /api/auth/logout
Logout and invalidate current session.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

#### GET /api/auth/profile
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": "STARTUP",
      "subscriptionTier": "FREE",
      "bio": "User bio",
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLoginAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

#### POST /api/auth/refresh
Refresh authentication token.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "success",
  "message": "Token refreshed successfully",
  "data": {
    "user": { /* user object */ },
    "token": "new_jwt_token_here",
    "expiresAt": "2024-01-08T00:00:00.000Z"
  }
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