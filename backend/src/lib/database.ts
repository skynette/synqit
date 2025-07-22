import { PrismaClient, Prisma } from '@prisma/client';

declare global {
  var __prisma: PrismaClient | undefined;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds
const CONNECTION_TIMEOUT = 20000; // 20 seconds
const POOL_TIMEOUT = 20; // 20 seconds for pool timeout
const CONNECTION_LIMIT = 25; // Increase connection limit

// Health check interval to keep connections alive
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

/**
 * Configure Prisma options with enhanced connection pooling
 */
const prismaOptions: Prisma.PrismaClientOptions = {
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
};

// Add connection pool configuration via URL parameters
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('connection_limit')) {
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('connection_limit', CONNECTION_LIMIT.toString());
  url.searchParams.set('pool_timeout', POOL_TIMEOUT.toString());
  url.searchParams.set('connect_timeout', (CONNECTION_TIMEOUT / 1000).toString());
  url.searchParams.set('pgbouncer', 'true'); // Enable PgBouncer mode if available
  process.env.DATABASE_URL = url.toString();
}

/**
 * Database connection utility
 * Creates a singleton Prisma client instance to prevent connection pooling issues
 */
export const prisma = globalThis.__prisma || new PrismaClient(prismaOptions);

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
 * Wrapper for Prisma operations with retry mechanism
 */
export async function withRetry<T>(operation: () => Promise<T>, retryCount = 0): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    const isConnectionError = 
      error?.message?.includes("Can't reach database server") ||
      error?.code === 'P2024' || // Connection pool timeout
      error?.code === 'P1001' || // Can't reach database
      error?.code === 'P1002';   // Database server timeout
      
    if (isConnectionError && retryCount < MAX_RETRIES) {
      console.warn(`Database operation failed with error ${error?.code}, retrying (${retryCount + 1}/${MAX_RETRIES})...`);
      
      // On connection pool timeout, try to reset the connection
      if (error?.code === 'P2024') {
        try {
          await prisma.$disconnect();
          await new Promise(resolve => setTimeout(resolve, 1000));
          await prisma.$connect();
        } catch (disconnectError) {
          console.error('Failed to reset connection:', disconnectError);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return withRetry(operation, retryCount + 1);
    }
    throw error;
  }
}

/**
 * Health check function to keep database connections alive
 */
let healthCheckInterval: NodeJS.Timeout | null = null;

export function startDatabaseHealthCheck() {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  healthCheckInterval = setInterval(async () => {
    try {
      // Simple query to keep connection alive
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      console.error('Database health check failed:', error);
      // Try to reconnect
      try {
        await prisma.$disconnect();
        await prisma.$connect();
        console.log('Database reconnected successfully');
      } catch (reconnectError) {
        console.error('Failed to reconnect to database:', reconnectError);
      }
    }
  }, HEALTH_CHECK_INTERVAL);
}

export function stopDatabaseHealthCheck() {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
}

/**
 * Enhanced disconnect function
 */
export async function disconnectDatabase() {
  stopDatabaseHealthCheck();
  await prisma.$disconnect();
  console.log('🔌 Database disconnected');
} 