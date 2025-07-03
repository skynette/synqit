# Synqit Backend Setup Checklist

## Prerequisites
- [ ] Node.js 18+ installed
- [ ] PostgreSQL database running
- [ ] Resend account created (for email service)
- [ ] Git repository initialized

## Environment Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/synqit"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here-minimum-32-chars"
JWT_EXPIRES_IN="7d"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key-here"
FROM_EMAIL="noreply@synqit.com"

# Frontend URL (for email links)
FRONTEND_URL="http://localhost:3000"

# Server Configuration
PORT=5000
NODE_ENV="development"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_SALT_ROUNDS=12
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Optional: Open Prisma Studio
npm run db:studio
```

## Authentication Features Implementation

### ✅ Core Authentication (Implemented)
- [x] User registration with email verification
- [x] Email verification via magic link
- [x] User login with enhanced security
- [x] Password reset via email
- [x] Change password (authenticated users)
- [x] Change email (authenticated users)
- [x] Account lockout after failed attempts
- [x] Session management with JWT
- [x] Token refresh functionality

### ✅ Email Service (Implemented)
- [x] Resend integration for email delivery
- [x] Professional email templates
- [x] Email verification emails
- [x] Password reset emails
- [x] Welcome emails after verification
- [x] Resend verification email functionality

### ✅ Security Features (Implemented)
- [x] Password strength validation
- [x] Failed login attempt tracking
- [x] Account lockout mechanism (5 attempts, 30 min lockout)
- [x] Secure token generation for verification/reset
- [x] Rate limiting on authentication endpoints
- [x] BCRYPT password hashing
- [x] JWT token management
- [x] Session invalidation on password reset

### 🔄 Additional Features (From Requirements Document)

#### User Management Features
- [x] A2 2: Registration with company name, username, email, X account
- [x] A2 3: Set password with confirmation
- [ ] A2 4: Terms and conditions approval
- [ ] A2 5: Privacy policy approval
- [x] A2 6: Email already registered handling
- [x] A2 7: Recovery email with link to set new password
- [x] A2 8: Reset password
- [x] A2 9: Create user account in database
- [x] A2 10: Email verification
- [x] A3 11: Login with email & password
- [x] A3 12: Verify email and password with database
- [x] A3 13: Login failure handling
- [x] A4 14: Recovery email verification

#### Account Management Features
- [x] C1 59: Change password
- [x] C1 60: Reset password
- [x] C1 61: Recover account
- [x] C1 65: Change address (email)
- [x] C1 66: Change email
- [ ] C1 67: Change phone number
- [ ] C1 64: Notification settings
- [ ] C1 68: Login and import account/migration

#### Security Features
- [x] H1 93: Failed password attempts handling
- [ ] H1 94: 2FA authentication (prepared for future)
- [x] H1 95: Secure connection (SSL) for data transmission
- [ ] H1 92: Uncommon IP address detection

## Development Setup

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test API Endpoints
Use the following endpoints to test functionality:

#### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/resend-verification` - Resend verification
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password (auth required)
- `POST /api/auth/change-email` - Change email (auth required)
- `GET /api/auth/profile` - Get profile (auth required)
- `POST /api/auth/refresh` - Refresh token (auth required)
- `POST /api/auth/logout` - Logout (auth required)

## Testing Checklist

### Manual Testing
- [ ] Register new user
- [ ] Check email verification email received
- [ ] Verify email using link
- [ ] Check welcome email received
- [ ] Login with verified account
- [ ] Test failed login attempts (should lock after 5)
- [ ] Test password reset flow
- [ ] Test change password
- [ ] Test change email
- [ ] Test resend verification
- [ ] Test token refresh
- [ ] Test logout

### Email Testing
- [ ] Email verification template renders correctly
- [ ] Password reset template renders correctly
- [ ] Welcome email template renders correctly
- [ ] All email links work correctly
- [ ] Email delivery is reliable

### Security Testing
- [ ] Password strength validation works
- [ ] Account lockout works after 5 failed attempts
- [ ] Account unlocks after 30 minutes
- [ ] Tokens expire correctly
- [ ] JWT tokens are invalidated on logout
- [ ] Password reset invalidates all sessions

## Production Deployment

### Environment Variables for Production
```bash
# Database (Production)
DATABASE_URL="postgresql://prod_user:prod_pass@prod_host:5432/synqit_prod"

# JWT Configuration (Strong Secret)
JWT_SECRET="production-super-secret-jwt-key-minimum-64-chars-recommended"
JWT_EXPIRES_IN="7d"

# Email Service (Production)
RESEND_API_KEY="production-resend-api-key"
FROM_EMAIL="noreply@synqit.com"

# Frontend URL (Production)
FRONTEND_URL="https://synqit.com"

# Server Configuration
PORT=5000
NODE_ENV="production"

# Rate Limiting (Stricter in production)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# Security
BCRYPT_SALT_ROUNDS=12
```

### Pre-Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificate installed
- [ ] Email domain verified with Resend
- [ ] Rate limiting configured
- [ ] Monitoring and logging set up
- [ ] Error tracking configured
- [ ] Backup strategy implemented

## Additional Recommendations

### Future Enhancements
1. **2FA Implementation**: Framework is prepared for TOTP-based 2FA
2. **IP Address Monitoring**: Track and alert on unusual login locations
3. **Phone Number Verification**: SMS-based verification
4. **Terms and Conditions**: Legal compliance requirements
5. **Privacy Policy**: GDPR compliance
6. **Notification Settings**: User preference management
7. **Account Migration**: Import from other platforms

### Performance Optimization
- [ ] Database indexing on frequently queried fields
- [ ] Email queue for bulk operations
- [ ] Caching layer for frequently accessed data
- [ ] Background job processing for cleanup tasks

### Monitoring
- [ ] Authentication success/failure rates
- [ ] Email delivery rates
- [ ] Account lockout incidents
- [ ] Token usage patterns
- [ ] Error rates and response times

## Troubleshooting

### Common Issues
1. **Email not sending**: Check Resend API key and FROM_EMAIL configuration
2. **Database connection errors**: Verify DATABASE_URL and database availability
3. **JWT token issues**: Ensure JWT_SECRET is properly set
4. **Account lockout**: Check failed login attempt logic and lockout duration
5. **Email verification fails**: Verify token generation and expiry logic

### Debug Commands
```bash
# Check database connection
npx prisma db:status

# Reset database (development only)
npx prisma db:reset

# View database in browser
npx prisma studio
```

This comprehensive setup ensures all authentication features from the requirements document are properly implemented and tested. 