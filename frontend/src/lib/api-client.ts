import axios from 'axios';

/**
 * API Client for Synqit Backend
 */

// Base API configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      clearAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// Token management
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('synqit_auth_token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('synqit_auth_token', token);
  }
};

export const clearAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('synqit_auth_token');
  }
};

// API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'STARTUP' | 'INVESTOR' | 'ECOSYSTEM_PLAYER' | 'INDIVIDUAL';
  bio?: string;
  walletAddress?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangeEmailRequest {
  newEmail: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    user: User;
    token: string;
    expiresAt: string;
  };
  errors?: any[];
}

export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  data?: any;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  subscriptionTier: string;
  isEmailVerified: boolean;
  isVerified: boolean;
  bio?: string;
  walletAddress?: string;
  createdAt: string;
  lastLoginAt?: string;
  failedLoginAttempts: number;
  lockedUntil?: string;
}

// Auth API methods
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/verify-email', data);
    return response.data;
  },

  resendVerification: async (data: ResendVerificationRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/resend-verification', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/change-password', data);
    return response.data;
  },

  changeEmail: async (data: ChangeEmailRequest): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/change-email', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    clearAuthToken();
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await apiClient.get('/auth/profile');
    return response.data.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
}; 