# Synqit Backend Developer Guide

This comprehensive guide covers all the backend features and APIs for the Synqit Web3 collaboration platform. This documentation is essential for developers working on the frontend integration or extending the backend functionality.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Upload System](#file-upload-system)
3. [Matching & Partnership System](#matching--partnership-system)
4. [Messaging System](#messaging-system)
5. [Company Management](#company-management)
6. [Authentication & Security](#authentication--security)
7. [API Reference](#api-reference)
8. [Database Schema](#database-schema)
9. [Environment Setup](#environment-setup)
10. [Testing](#testing)

## Architecture Overview

The Synqit backend follows a layered architecture pattern:

```
┌─────────────────┐
│   Controllers   │  ← HTTP Request Handlers
├─────────────────┤
│    Services     │  ← Business Logic Layer
├─────────────────┤
│    Database     │  ← Data Access Layer (Prisma)
└─────────────────┘
```

### Key Components

- **Controllers**: Handle HTTP requests/responses and validation
- **Services**: Contain business logic and database operations
- **Middleware**: Authentication, rate limiting, validation
- **Routes**: Define API endpoints and middleware chains
- **Utils**: Helper functions and error handling

## File Upload System

### Overview

The file upload system uses **Cloudinary** as the cloud storage provider with **Multer** for handling multipart/form-data uploads.

### Supported File Types

- **Images**: jpg, jpeg, png, gif, webp, svg
- **Maximum Size**: 5MB per file
- **Auto Optimization**: Cloudinary automatically optimizes images

### Upload Types & Configurations

#### 1. Profile Images
- **Endpoint**: `POST /api/profile/image`
- **Field Name**: `profileImage`
- **Transformation**: 500x500 square crop with face detection
- **Storage Path**: `synqit/profiles/`

#### 2. Company Logos
- **Endpoint**: `POST /api/profile/company/logo`
- **Field Name**: `companyLogo`  
- **Transformation**: 300x300 with padding, transparent background
- **Storage Path**: `synqit/companies/logos/`

#### 3. Company Banners
- **Endpoint**: `POST /api/profile/company/banner`
- **Field Name**: `companyBanner`
- **Transformation**: 1920x400 banner crop
- **Storage Path**: `synqit/companies/banners/`

#### 4. Project Logos
- **Endpoint**: `POST /api/project/logo`
- **Field Name**: `projectLogo`
- **Transformation**: 400x400 with padding
- **Storage Path**: `synqit/projects/logos/`

#### 5. Project Banners
- **Endpoint**: `POST /api/project/banner`
- **Field Name**: `projectBanner`
- **Transformation**: 1920x600 banner crop
- **Storage Path**: `synqit/projects/banners/`

### Implementation Examples

#### Frontend Upload (React)
```javascript
const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append('profileImage', file);
  
  const response = await fetch('/api/profile/image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return response.json();
};
```

#### Backend Configuration
```typescript
// Cloudinary configuration in src/config/cloudinary.ts
export const profileImageUpload = multer({
  storage: createCloudinaryStorage('profiles', [
    { width: 500, height: 500, crop: 'fill', gravity: 'face' },
    { quality: 'auto', fetch_format: 'auto' }
  ]),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: validateImageTypes
});
```

### Error Handling

The system includes comprehensive error handling:
- File validation errors
- Upload failures with automatic cleanup
- Old image deletion when replacing
- Cloudinary service errors

## Matching & Partnership System

### Overview

The matching system allows users to discover compatible partners and manage partnership requests through a comprehensive workflow.

### Key Features

- **Partnership Requests**: Send, accept, reject, cancel
- **Compatibility Scoring**: Algorithm-based partner recommendations
- **Status Tracking**: Complete partnership lifecycle management
- **Filtering & Search**: Advanced partner discovery
- **Statistics**: Partnership success rates and analytics

### Partnership Workflow

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   PENDING   │ -> │   ACCEPTED   │ or │  REJECTED   │
└─────────────┘    └──────────────┘    └─────────────┘
       │                                       │
       v                                       │
┌─────────────┐                                │
│  CANCELLED  │ <──────────────────────────────┘
└─────────────┘
```

### API Endpoints

#### Partnership Management
```
POST   /api/matches/request              - Create partnership request
GET    /api/matches                     - Get user partnerships
GET    /api/matches/sent               - Get sent requests
GET    /api/matches/received          - Get received requests
GET    /api/matches/:id               - Get partnership details
POST   /api/matches/:id/accept       - Accept request
POST   /api/matches/:id/reject       - Reject request  
POST   /api/matches/:id/cancel       - Cancel request
```

#### Discovery & Analytics
```
GET    /api/matches/recommendations    - Get recommended matches
GET    /api/matches/stats             - Get partnership statistics
```

### Partnership Request Example

```javascript
const createPartnership = async (data) => {
  const response = await fetch('/api/matches/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      receiverProjectId: "uuid-of-target-project",
      partnershipType: "TECHNICAL",
      title: "DeFi Integration Partnership",
      description: "Looking to integrate our DeFi protocol...",
      proposedTerms: "Revenue sharing model...",
      duration: "6 months",
      equity: 5.0,
      compensation: "Token allocation + advisory fee"
    })
  });
  
  return response.json();
};
```

### Compatibility Algorithm

The recommendation engine considers:
- **Blockchain Focus**: Matching or complementary technologies
- **Project Type**: Complementary project categories
- **Common Tags**: Shared interests and technologies
- **Activity Level**: Partnership history and engagement
- **Trust Score**: User verification and reputation

### Partnership Types

- `TECHNICAL`: Code collaboration, technical integration
- `BUSINESS`: Business development, partnerships
- `MARKETING`: Joint marketing, cross-promotion
- `ADVISORY`: Mentorship, strategic guidance
- `INVESTMENT`: Funding, token swaps
- `COLLABORATION`: General collaboration

## Messaging System

### Overview

The messaging system enables real-time communication between partners within the context of partnerships.

### Key Features

- **Partnership-based Messaging**: Messages tied to specific partnerships
- **Real-time Status**: Read/unread message tracking
- **Message History**: Paginated conversation history
- **Search Functionality**: Search across messages
- **Message Management**: Delete, edit capabilities

### API Endpoints

```
POST   /api/messages/send                    - Send message
GET    /api/messages/conversations          - Get all conversations
GET    /api/messages/partnerships/:id       - Get messages for partnership
POST   /api/messages/mark-read             - Mark messages as read
GET    /api/messages/unread-count          - Get unread count
GET    /api/messages/search               - Search messages
DELETE /api/messages/:id                  - Delete message
GET    /api/messages/stats               - Get message statistics
GET    /api/messages/recent              - Get recent messages
```

### Sending Messages

```javascript
const sendMessage = async (partnershipId, content) => {
  const response = await fetch('/api/messages/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      partnershipId,
      content,
      messageType: 'TEXT'
    })
  });
  
  return response.json();
};
```

### Message Types

- `TEXT`: Regular text messages
- `FILE`: File attachments (future enhancement)
- `SYSTEM`: System-generated messages

### Pagination & Filtering

Messages support advanced pagination:
```javascript
const getMessages = async (partnershipId, options = {}) => {
  const params = new URLSearchParams({
    page: options.page || 1,
    limit: options.limit || 50,
    ...options
  });
  
  const response = await fetch(
    `/api/messages/partnerships/${partnershipId}?${params}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  
  return response.json();
};
```

## Company Management

### Overview

The company management system provides comprehensive company discovery, filtering, and analytics capabilities.

### Key Features

- **Company Directory**: Browse all companies
- **Advanced Search**: Multi-criteria filtering
- **Featured Companies**: Verified, high-performing companies
- **Trending Analysis**: Companies with recent activity
- **Statistics**: Platform-wide company analytics
- **Similar Companies**: Recommendation engine

### API Endpoints

```
GET    /api/companies                    - Get all companies
GET    /api/companies/featured          - Get featured companies
GET    /api/companies/trending          - Get trending companies
GET    /api/companies/search           - Advanced search
GET    /api/companies/stats            - Get statistics
GET    /api/companies/by-type/:type    - Get by project type
GET    /api/companies/:id              - Get company details
GET    /api/companies/:id/similar      - Get similar companies
```

### Advanced Search Example

```javascript
const searchCompanies = async (searchParams) => {
  const params = new URLSearchParams({
    q: searchParams.query,
    projectTypes: searchParams.projectTypes?.join(','),
    minTrustScore: searchParams.minTrustScore,
    isVerified: searchParams.isVerified,
    location: searchParams.location,
    page: searchParams.page || 1,
    limit: searchParams.limit || 20
  });
  
  const response = await fetch(`/api/companies/search?${params}`);
  return response.json();
};
```

### Company Filtering Options

- **Search Terms**: Name, description, bio
- **Project Type**: DeFi, Infrastructure, Gaming, NFT, Social
- **Blockchain Focus**: Ethereum, Solana, Polygon, etc.
- **Location**: Geographic location
- **Funding Stage**: Seed, Series A, B, C, etc.
- **Team Size**: 1-10, 11-50, 51-200, 200+
- **Verification Status**: Verified/Unverified
- **Trust Score**: Minimum trust score filter

## Authentication & Security

### JWT Token System

The platform uses JWT tokens for authentication:
- **Access Token**: Short-lived (1 hour) for API access
- **Refresh Token**: Long-lived (30 days) for token renewal

### Security Features

- **Rate Limiting**: API endpoint protection
- **Input Validation**: Comprehensive request validation
- **File Upload Security**: Type checking, size limits
- **CORS Configuration**: Cross-origin request handling
- **Password Hashing**: bcrypt with salt rounds
- **2FA Support**: Two-factor authentication ready

### Authentication Flow

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  // Store tokens securely
  localStorage.setItem('accessToken', data.data.accessToken);
  localStorage.setItem('refreshToken', data.data.refreshToken);
  
  return data;
};

// Protected API calls
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    }
  });
};
```

## API Reference

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "pagination": {  // Only for paginated responses
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [  // Only for validation errors
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

## Database Schema

### Key Models

#### User
```prisma
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  firstName       String
  lastName        String
  profileImage    String?
  bio             String?
  location        String?
  isVerified      Boolean   @default(false)
  // ... other fields
}
```

#### Project (Company)
```prisma
model Project {
  id                String    @id @default(uuid())
  ownerId           String
  companyName       String
  projectName       String
  companyLogo       String?
  companyBanner     String?
  projectLogo       String?
  projectBanner     String?
  projectType       String
  blockchainFocus   String?
  trustScore        Int       @default(50)
  viewCount         Int       @default(0)
  isActive          Boolean   @default(true)
  // ... other fields
}
```

#### Partnership
```prisma
model Partnership {
  id                  String    @id @default(uuid())
  requesterId         String
  receiverId          String
  requesterProjectId  String
  receiverProjectId   String
  title              String
  description        String
  partnershipType    PartnershipType
  status             PartnershipStatus @default(PENDING)
  // ... other fields
}
```

#### Message
```prisma
model Message {
  id            String      @id @default(uuid())
  senderId      String
  partnershipId String
  content       String
  messageType   MessageType @default(TEXT)
  isRead        Boolean     @default(false)
  createdAt     DateTime    @default(now())
  // ... other fields
}
```

## Environment Setup

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/synqit_db

# JWT Secrets
JWT_SECRET=your-very-secure-jwt-secret-key-here
JWT_REFRESH_SECRET=your-very-secure-refresh-secret-key-here

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM="Synqit <noreply@synqit.com>"

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Application
NODE_ENV=development
PORT=5000
```

### Installation & Setup

```bash
# Install dependencies
npm install

# Setup database
npx prisma migrate dev
npx prisma generate

# Seed database (optional)
npm run seed

# Start development server
npm run dev
```

## Testing

### API Testing with Examples

#### 1. File Upload Test
```bash
# Test profile image upload
curl -X POST http://localhost:5000/api/profile/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profileImage=@/path/to/image.jpg"
```

#### 2. Partnership Request Test
```bash
# Create partnership request
curl -X POST http://localhost:5000/api/matches/request \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverProjectId": "uuid-here",
    "partnershipType": "TECHNICAL",
    "title": "Test Partnership",
    "description": "Test partnership description"
  }'
```

#### 3. Company Search Test
```bash
# Search companies
curl -X GET "http://localhost:5000/api/companies/search?q=defi&projectTypes=DeFi&minTrustScore=70"
```

### Integration Testing Checklist

- [ ] File upload functionality
- [ ] Partnership workflow (create, accept, reject, cancel)
- [ ] Message sending and retrieval
- [ ] Company search and filtering
- [ ] Authentication flows
- [ ] Rate limiting
- [ ] Error handling
- [ ] Pagination
- [ ] Input validation

## Best Practices

### Frontend Integration

1. **Token Management**: Implement proper token storage and refresh
2. **Error Handling**: Handle all error responses appropriately
3. **Loading States**: Show loading indicators during API calls
4. **Pagination**: Implement proper pagination for list views
5. **File Uploads**: Show upload progress and handle failures
6. **Real-time Updates**: Consider WebSocket integration for messages

### Performance Optimization

1. **Caching**: Implement Redis caching for frequently accessed data
2. **Database Indexing**: Ensure proper database indexes
3. **Image Optimization**: Use Cloudinary transformations
4. **Lazy Loading**: Implement lazy loading for large lists
5. **Batch Operations**: Use batch operations where possible

### Security Considerations

1. **Input Sanitization**: Always validate and sanitize inputs
2. **File Upload Security**: Implement virus scanning for production
3. **Rate Limiting**: Monitor and adjust rate limits
4. **Logging**: Implement comprehensive logging
5. **Monitoring**: Set up error tracking and performance monitoring

## Troubleshooting

### Common Issues

1. **File Upload Fails**: Check Cloudinary credentials
2. **Database Connection**: Verify DATABASE_URL format
3. **JWT Errors**: Ensure JWT_SECRET is set correctly
4. **Email Not Sending**: Verify SMTP credentials
5. **Rate Limiting**: Check if rate limits are being exceeded

### Debug Mode

Enable debug mode by setting `NODE_ENV=development` and checking logs for detailed error information.

---

This developer guide provides comprehensive coverage of all backend functionality. For additional support or questions, please refer to the API documentation or contact the development team.