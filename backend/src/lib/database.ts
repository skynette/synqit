import { PrismaClient } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

/**
 * Database connection utility
 * Creates a singleton Prisma client instance to prevent connection pooling issues
 */
export const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

/**
 * Connect to database with retry mechanism
 */
export async function connectDatabase(retryCount = 0): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.warn(`⚠️ Database connection attempt ${retryCount + 1} failed:`, error);
    
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectDatabase(retryCount + 1);
    } else {
      console.error('❌ Max retries reached. Database connection failed.');
      if (process.env.NODE_ENV === 'production') {
        process.exit(1); // Exit in production if we can't connect to DB
      }
    }
  }
}

/**
 * Disconnect from database
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
  console.log('🔌 Database disconnected');
}

/**
 * Wrapper for Prisma operations with retry mechanism
 */
export async function withRetry<T>(operation: () => Promise<T>, retryCount = 0): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (error?.message?.includes("Can't reach database server") && retryCount < MAX_RETRIES) {
      console.warn(`Database operation failed, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return withRetry(operation, retryCount + 1);
    }
    throw error;
  }
} 