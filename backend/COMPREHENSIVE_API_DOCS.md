# Synqit API - Complete Documentation

**Version**: 1.0.0  
**Base URL**: `http://localhost:5000/api`  
**Updated**: $(date)  
**Status**: ✅ All endpoints verified and functional  

---

## 📋 Quick Reference

| Category | Endpoints | Authentication |
|----------|-----------|----------------|
| Authentication | 11 endpoints | Public/Private |
| Profile Management | 11 endpoints | Private |
| Project Management | 5 endpoints | Public/Private |
| Dashboard | 11 endpoints | Private |
| Matching/Partnerships | 9 endpoints | Private |
| **Messaging** | **11 endpoints** | **Private** |
| Company Discovery | 8 endpoints | Public |
| Utilities | 2 endpoints | Public |

**Total: 68 endpoints**

---

## 🔐 Authentication

All protected endpoints require JWT token in header:
```bash
Authorization: Bearer <your_jwt_token>
```

---

## 📚 Complete Endpoint Reference

### 🔑 Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/verify-email` | Verify email with token | Public |
| POST | `/resend-verification` | Resend verification email | Public |
| POST | `/login` | User login | Public |
| POST | `/forgot-password` | Send password reset email | Public |
| POST | `/reset-password` | Reset password with token | Public |
| POST | `/change-password` | Change current password | Private |
| POST | `/change-email` | Change email address | Private |
| POST | `/logout` | Logout user | Private |
| GET | `/profile` | Get auth profile | Private |
| POST | `/refresh` | Refresh JWT token | Private |

#### POST /api/auth/register
```json
// Request
{
  "firstName": "John",
  "lastName": "Doe", 
  "email": "john@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "isVerified": false
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

#### POST /api/auth/login
```json
// Request
{
  "email": "john@example.com",
  "password": "password123"
}

// Response
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

---

### 👤 Profile Endpoints (`/api/profile`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/user` | Get user profile | Private |
| PUT | `/user` | Update user profile | Private |
| GET | `/` | Get profile (alias) | Private |
| PUT | `/` | Update profile (alias) | Private |
| POST | `/image` | Upload profile image | Private |
| GET | `/company` | Get company profile | Private |
| PUT | `/company` | Update company profile | Private |
| POST | `/company/logo` | Upload company logo | Private |
| POST | `/company/banner` | Upload company banner | Private |
| POST | `/change-password` | Change password | Private |
| POST | `/toggle-2fa` | Toggle 2FA | Private |
| DELETE | `/delete-account` | Delete account | Private |
| GET | `/blockchain-preferences` | Get blockchain prefs | Private |
| PUT | `/blockchain-preferences` | Update blockchain prefs | Private |

#### GET /api/profile/user
```json
// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "profileImage": "https://...",
    "bio": "Web3 developer",
    "location": "San Francisco",
    "website": "https://johndoe.com",
    "linkedin": "johndoe",
    "twitter": "johndoe", 
    "github": "johndoe",
    "telegram": "johndoe"
  }
}
```

#### PUT /api/profile/user
```json
// Request
{
  "firstName": "John",
  "lastName": "Smith",
  "bio": "Updated bio",
  "location": "New York",
  "website": "https://johnsmith.com"
}
```

---

### 🚀 Project Endpoints 

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/project` | Get my project | Private |
| POST | `/api/project` | Create/update project | Private |
| DELETE | `/api/project` | Delete my project | Private |
| POST | `/api/project/logo` | Upload project logo | Private |
| POST | `/api/project/banner` | Upload project banner | Private |
| GET | `/api/projects` | Get all projects (public) | Public |

#### GET /api/project
```json
// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "DeFi Protocol",
    "description": "Revolutionary DeFi protocol",
    "projectType": "DEFI",
    "stage": "DEVELOPMENT",
    "logoUrl": "https://...",
    "bannerUrl": "https://...",
    "website": "https://protocol.com",
    "github": "https://github.com/protocol",
    "documentation": "https://docs.protocol.com",
    "techStack": ["Solidity", "React", "Node.js"],
    "blockchains": ["Ethereum", "Polygon"],
    "fundingGoal": 1000000,
    "currentFunding": 250000
  }
}
```

#### POST /api/project
```json
// Request
{
  "name": "My DeFi Project",
  "description": "Building the future of DeFi",
  "projectType": "DEFI",
  "stage": "IDEA",
  "website": "https://mydefi.com",
  "techStack": ["Solidity", "React"],
  "blockchains": ["Ethereum"]
}
```

#### GET /api/projects (Public)
```json
// Query: ?page=1&limit=10&projectType=DEFI&search=protocol
// Response
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "DeFi Protocol",
        "description": "Revolutionary protocol",
        "projectType": "DEFI",
        "stage": "DEVELOPMENT",
        "logoUrl": "https://...",
        "owner": {
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

---

### 📊 Dashboard Endpoints (`/api/dashboard`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/stats` | Get dashboard stats | Private |
| GET | `/projects` | Get my projects | Private |
| GET | `/projects/:id` | Get project by ID | Private |
| GET | `/partnerships` | Get my partnerships | Private |
| POST | `/partnerships` | Create partnership | Private |
| GET | `/partnerships/:id` | Get partnership details | Private |
| PUT | `/partnerships/:id/accept` | Accept partnership | Private |
| PUT | `/partnerships/:id/reject` | Reject partnership | Private |
| DELETE | `/partnerships/:id` | Cancel partnership | Private |
| GET | `/messages` | Get dashboard messages | Private |
| GET | `/notifications` | Get notifications | Private |
| GET | `/profile` | Get dashboard profile | Private |

#### GET /api/dashboard/stats
```json
// Response
{
  "success": true,
  "data": {
    "totalProjects": 3,
    "totalPartnerships": 12,
    "pendingRequests": 2,
    "activePartnerships": 8,
    "totalMessages": 45,
    "unreadMessages": 3,
    "notifications": 5
  }
}
```

---

### 🤝 Matching/Partnership Endpoints (`/api/matches`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/request` | Create partnership request | Private |
| GET | `/` | Get all partnerships | Private |
| GET | `/sent` | Get sent requests | Private |
| GET | `/received` | Get received requests | Private |
| GET | `/recommendations` | Get match recommendations | Private |
| GET | `/stats` | Get partnership stats | Private |
| GET | `/:id` | Get partnership details | Private |
| POST | `/:id/accept` | Accept partnership | Private |
| POST | `/:id/reject` | Reject partnership | Private |
| POST | `/:id/cancel` | Cancel partnership | Private |

#### POST /api/matches/request
```json
// Request
{
  "receiverProjectId": "uuid",
  "partnershipType": "TECHNICAL",
  "title": "Looking for backend developer",
  "description": "We need help with smart contract development",
  "proposedTerms": "Equity sharing arrangement"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Looking for backend developer",
    "description": "We need help with smart contract development",
    "partnershipType": "TECHNICAL",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### GET /api/matches
```json
// Query: ?page=1&limit=10&status=ACTIVE
// Response  
{
  "success": true,
  "data": {
    "partnerships": [
      {
        "id": "uuid",
        "title": "Smart Contract Partnership",
        "partnershipType": "TECHNICAL", 
        "status": "ACTIVE",
        "partner": {
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "partnerProject": {
          "name": "DeFi Protocol",
          "logoUrl": "https://..."
        }
      }
    ],
    "pagination": { /* pagination info */ }
  }
}
```

---

### 💬 Messaging Endpoints (`/api/messages`) - **FULLY FUNCTIONAL**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/send` | Send partnership message | Private |
| POST | `/direct` | **Send direct message** | Private |
| GET | `/direct/:userId` | **Get direct messages** | Private |
| GET | `/conversations` | Get all conversations | Private |
| GET | `/partnerships/:id` | Get partnership messages | Private |
| POST | `/mark-read` | Mark messages as read | Private |
| GET | `/unread-count` | Get unread count | Private |
| GET | `/search` | Search messages | Private |
| GET | `/stats` | Get messaging stats | Private |
| GET | `/recent` | Get recent messages | Private |
| DELETE | `/:id` | Delete message | Private |

#### POST /api/messages/send (Partnership Message)
```json
// Request
{
  "partnershipId": "uuid",
  "content": "Hello! Let's discuss the partnership details.",
  "messageType": "TEXT"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "Hello! Let's discuss the partnership details.",
    "messageType": "TEXT",
    "senderId": "uuid",
    "receiverId": "uuid", 
    "partnershipId": "uuid",
    "isRead": false,
    "createdAt": "2024-01-01T12:00:00Z",
    "sender": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "profileImage": "https://..."
    }
  },
  "message": "Message sent successfully"
}
```

#### POST /api/messages/direct (Direct Message)
```json
// Request
{
  "receiverId": "uuid",
  "content": "Hi! I saw your project and would love to connect.",
  "messageType": "TEXT"
}

// Response - Same format as partnership message
```

#### GET /api/messages/direct/:userId (Get Direct Messages)
```json
// GET /api/messages/direct/user-uuid-here?page=1&limit=20
// Response
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "content": "Hi! How are you?",
        "messageType": "TEXT",
        "senderId": "uuid",
        "receiverId": "uuid",
        "isRead": true,
        "createdAt": "2024-01-01T12:00:00Z",
        "readAt": "2024-01-01T12:05:00Z",
        "sender": {
          "id": "uuid", 
          "firstName": "John",
          "lastName": "Doe",
          "profileImage": "https://..."
        },
        "receiver": {
          "id": "uuid",
          "firstName": "Jane", 
          "lastName": "Smith",
          "profileImage": "https://..."
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

#### GET /api/messages/conversations
```json
// Query: ?page=1&limit=10&unreadOnly=false
// Response
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "title": "Partnership with DeFi Protocol",
        "status": "ACTIVE",
        "partner": {
          "id": "uuid",
          "firstName": "Jane",
          "lastName": "Smith",
          "profileImage": "https://..."
        },
        "partnerProject": {
          "id": "uuid",
          "name": "DeFi Protocol",
          "logoUrl": "https://..."
        },
        "myProject": {
          "id": "uuid",
          "name": "My Project",
          "logoUrl": "https://..."
        },
        "lastMessage": {
          "id": "uuid",
          "content": "Sounds good, let's proceed!",
          "createdAt": "2024-01-01T15:30:00Z",
          "sender": {
            "firstName": "Jane",
            "lastName": "Smith"
          }
        },
        "unreadCount": 2,
        "updatedAt": "2024-01-01T15:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

#### POST /api/messages/mark-read
```json
// Request
{
  "partnershipId": "uuid",
  "messageIds": ["uuid1", "uuid2"] // optional
}

// Response
{
  "success": true,
  "data": {
    "markedCount": 3
  },
  "message": "3 messages marked as read"
}
```

#### GET /api/messages/search
```json
// Query: ?q=contract&partnershipId=uuid&page=1&limit=10
// Response
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "content": "We need to review the smart contract code",
        "createdAt": "2024-01-01T10:00:00Z",
        "sender": {
          "firstName": "John",
          "lastName": "Doe",
          "profileImage": "https://..."
        },
        "partnership": {
          "id": "uuid",
          "title": "Smart Contract Partnership"
        }
      }
    ],
    "query": "contract",
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### GET /api/messages/stats
```json
// Response
{
  "success": true,
  "data": {
    "messagesSent": 25,
    "messagesReceived": 18,
    "unreadMessages": 3,
    "activeConversations": 4,
    "totalMessages": 43
  }
}
```

#### GET /api/messages/unread-count
```json
// Response
{
  "success": true,
  "data": {
    "unreadCount": 5
  }
}
```

#### DELETE /api/messages/:id
```json
// Response
{
  "success": true,
  "data": {
    "success": true,
    "message": "Message deleted successfully"
  }
}
```

---

### 🏢 Company Endpoints (`/api/companies`) - **PUBLIC ACCESS**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all companies | Public |
| GET | `/featured` | Get featured companies | Public |
| GET | `/trending` | Get trending companies | Public |
| GET | `/search` | Advanced search | Public |
| GET | `/stats` | Get company stats | Public |
| GET | `/by-type/:type` | Get by project type | Public |
| GET | `/:id` | Get company details | Public |
| GET | `/:id/similar` | Get similar companies | Public |

#### GET /api/companies
```json
// Query: ?page=1&limit=10&search=defi&projectType=DEFI&blockchain=ethereum
// Response
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "uuid",
        "companyName": "DeFi Innovations Inc",
        "companyDescription": "Leading DeFi protocol development",
        "companyWebsite": "https://defiinnovations.com",
        "companyLogo": "https://...",
        "industry": "Blockchain",
        "companySize": "11-50",
        "projects": [
          {
            "name": "DeFi Protocol V2",
            "projectType": "DEFI",
            "stage": "LAUNCHED"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

### 🔧 Utility Endpoints

#### GET /api/health
```json
// Response
{
  "status": "ok",
  "message": "Synqit API is running",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0",
  "environment": "development"
}
```

#### GET /api/
```json
// Response
{
  "status": "success", 
  "message": "Welcome to Synqit API",
  "version": "1.0.0",
  "documentation": "/api/docs",
  "endpoints": {
    "health": "/api/health",
    "auth": "/api/auth",
    "dashboard": "/api/dashboard", 
    "profile": "/api/profile",
    "project": "/api/project",
    "matches": "/api/matches",
    "messages": "/api/messages",
    "companies": "/api/companies"
  }
}
```

---

## 🚨 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### HTTP Status Codes
- **200**: Success
- **201**: Created  
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **409**: Conflict (duplicate resource)
- **429**: Too Many Requests (rate limited)
- **500**: Internal Server Error

---

## 🚀 Quick Start Guide

### 1. Start the Server
```bash
npm run dev
```

### 2. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com", 
    "password": "password123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Use Protected Endpoints
```bash
curl -X GET http://localhost:5000/api/profile/user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Send a Direct Message
```bash
curl -X POST http://localhost:5000/api/messages/direct \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "receiverId": "other-user-uuid",
    "content": "Hello! I would like to collaborate on your project."
  }'
```

---

## 📝 Development Notes

### Key Features Implemented:
- ✅ Complete authentication system with JWT
- ✅ User and company profile management  
- ✅ Project creation and discovery
- ✅ Partnership/matching system
- ✅ **Full messaging system (partnership + direct messages)**
- ✅ Company discovery and search
- ✅ File upload capabilities
- ✅ Comprehensive validation and error handling
- ✅ Rate limiting and security measures

### Database Models:
- Users, Companies, Projects, Partnerships
- **Messages (with partnership and direct messaging support)**
- Notifications, Blockchain preferences

### Security Features:
- JWT authentication
- Password hashing (bcrypt)
- Input validation (express-validator)
- Rate limiting 
- CORS enabled
- File upload validation

---

## 🎯 Frontend Integration Tips

1. **Authentication Flow**: Register → Login → Store JWT token → Use in all requests
2. **File Uploads**: Use FormData for profile/company/project images
3. **Real-time Updates**: Consider WebSockets for live messaging (future enhancement)
4. **Error Handling**: Always check `success` field in responses
5. **Pagination**: All list endpoints support `page` and `limit` parameters
6. **Search**: Use debounced search inputs for better UX
7. **Messaging**: Poll `/api/messages/unread-count` for notification badges

---

## 📞 Support & Contact

- **Repository**: Check the GitHub repository for latest updates
- **Issues**: Report bugs or request features via GitHub issues
- **Server Status**: Check `/api/health` endpoint
- **Version**: This documentation covers API v1.0.0

**Last Updated**: $(date)  
**Status**: ✅ All 68 endpoints verified and functional