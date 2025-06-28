/**
 * TypeScript declaration file to extend Express types
 */

import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      userId?: string;
      sessionId?: string;
    }
  }
}

export {}; 