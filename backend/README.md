# Synqit Backend

Backend API for the Synqit application built with Node.js, TypeScript, Express, and PostgreSQL with Prisma.

## Features

- ✅ TypeScript
- ✅ Express.js server
- ✅ CORS enabled
- ✅ Security headers with Helmet
- ✅ PostgreSQL database with Prisma ORM
- ✅ Health check endpoint
- ✅ Environment configuration

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   - Create `.env` file in the backend directory with:
     ```env
     # Database
     DATABASE_URL="postgresql://postgres:password@localhost:5432/synqit_db?schema=public"
     
     # Server
     PORT=3001
     NODE_ENV=development
     
     # CORS
     CORS_ORIGIN=http://localhost:3000
     
     # JWT
     JWT_SECRET=your-super-secret-jwt-key-change-in-production-make-it-at-least-32-characters-long
     JWT_EXPIRY=7d
     ```
   - **Important**: Update the `DATABASE_URL` with your actual PostgreSQL credentials

3. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database (for development)
   npm run db:push
   
   # Or run migrations (for production)
   npm run db:migrate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Quick Start (Without Database)

To test the API structure without setting up PostgreSQL:

1. Comment out the database connection in `src/index.ts`
2. Run `npm run dev`
3. Visit `http://localhost:3001/api/health`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## API Endpoints

### Health Check
- **GET** `/health` - Returns API status and version

## Database Schema

The initial schema includes:
- **User** model with basic fields (id, email, name, timestamps)

## Development

The server runs on `http://localhost:3001` by default.

Health check endpoint: `http://localhost:3001/health` 