import axios from 'axios';

/**
 * API Client for Synqit Backend
 */

// Base API configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // Increased to 30 seconds for better mobile support
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

// Profile API Types
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  bio?: string;
  walletAddress?: string;
  isEmailVerified: boolean;
  userType: string;
  subscriptionTier: string;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  description: string;
  website?: string;
  logoUrl?: string;
  foundedYear?: number;
  projectType?: string;
  projectStage?: string;
  tokenAvailability?: string;
  developmentFocus?: string;
  totalFunding?: number;
  isLookingForFunding: boolean;
  isLookingForPartners: boolean;
  contactEmail?: string;
  twitterHandle?: string;
  discordServer?: string;
  telegramGroup?: string;
  country?: string;
  city?: string;
  timezone?: string;
  blockchainPreferences: Array<{
    blockchain: string;
    isPrimary: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  walletAddress?: string;
  profileImage?: string;
}

export interface UpdateCompanyProfileRequest {
  name?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  foundedYear?: number;
  projectType?: string;
  projectStage?: string;
  tokenAvailability?: string;
  developmentFocus?: string;
  totalFunding?: number;
  isLookingForFunding?: boolean;
  isLookingForPartners?: boolean;
  contactEmail?: string;
  twitterHandle?: string;
  discordServer?: string;
  telegramGroup?: string;
  country?: string;
  city?: string;
  timezone?: string;
}


export interface Toggle2FARequest {
  enabled: boolean;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface BlockchainPreference {
  blockchain: string;
  isPrimary: boolean;
}

export interface UpdateBlockchainPreferencesRequest {
  preferences: BlockchainPreference[];
}

// Profile API methods
export const profileApi = {
  // User profile
  getUserProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/profile/user');
    return response.data.data;
  },

  updateUserProfile: async (data: UpdateUserProfileRequest): Promise<UserProfile> => {
    const response = await apiClient.put('/profile/user', data);
    return response.data.data;
  },

  // Company profile
  getCompanyProfile: async (): Promise<CompanyProfile | null> => {
    try {
      const response = await apiClient.get('/profile/company');
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  updateCompanyProfile: async (data: UpdateCompanyProfileRequest): Promise<CompanyProfile> => {
    const response = await apiClient.put('/profile/company', data);
    return response.data.data;
  },

  // Security
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post('/profile/change-password', data);
  },

  toggle2FA: async (data: Toggle2FARequest): Promise<{ twoFactorEnabled: boolean }> => {
    const response = await apiClient.post('/profile/toggle-2fa', data);
    return response.data.data;
  },

  deleteAccount: async (data: DeleteAccountRequest): Promise<void> => {
    await apiClient.delete('/profile/delete-account', { data });
  },

  // Blockchain preferences
  getBlockchainPreferences: async (): Promise<BlockchainPreference[]> => {
    const response = await apiClient.get('/profile/blockchain-preferences');
    return response.data.data;
  },

  updateBlockchainPreferences: async (data: UpdateBlockchainPreferencesRequest): Promise<BlockchainPreference[]> => {
    const response = await apiClient.put('/profile/blockchain-preferences', data);
    return response.data.data;
  },

  // File uploads (placeholder for now)
  uploadProfileImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/profile/user/upload-profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.url;
  },

  uploadCompanyLogo: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/profile/company/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.url;
  },

  uploadCompanyBanner: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/profile/company/upload-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.url;
  },
};

// Dashboard API Types
export interface DashboardStats {
  totalPartnerships: number;
  activePartnerships: number;
  pendingRequests: number;
  messages: number;
  notifications: number;
  profileViews: number;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  website?: string;
  projectType?: string;
  projectStage?: string;
  isLookingForFunding: boolean;
  isLookingForPartners: boolean;
  twitterHandle?: string;
  discordServer?: string;
  country?: string;
  blockchains: string[];
  tags: string[];
  totalFunding?: number;
  foundedYear?: number;
  userId: string;
}

export interface Partnership {
  id: string;
  companyId: string;
  partnerId: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  proposedBy: string;
  proposalMessage?: string;
  responseMessage?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  company?: Company;
  partner?: Company;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

export interface DashboardFilters {
  search?: string;
  projectType?: string;
  projectStage?: string;
  blockchain?: string;
  country?: string;
  isLookingForFunding?: boolean;
  isLookingForPartners?: boolean;
  tags?: string[];
  tokenAvailability?: string;
  rewardModel?: string;
  fundingStatus?: string;
  teamSize?: string;
  developmentFocus?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'totalFunding';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard API methods
export const dashboardApi = {
  // Stats
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data.data;
  },

  // Companies
  getCompanies: async (filters?: DashboardFilters): Promise<PaginatedResponse<Company>> => {
    const response = await apiClient.get('/dashboard/companies', { params: filters });
    return response.data.data;
  },

  getCompanyById: async (id: string): Promise<Company> => {
    const response = await apiClient.get(`/dashboard/companies/${id}`);
    return response.data.data;
  },

  // Partnerships
  getPartnerships: async (): Promise<Partnership[]> => {
    const response = await apiClient.get('/dashboard/partnerships');
    return response.data.data;
  },

  getPartnershipById: async (id: string): Promise<Partnership> => {
    const response = await apiClient.get(`/dashboard/partnerships/${id}`);
    return response.data.data;
  },

  // Messages
  getMessages: async (): Promise<Message[]> => {
    const response = await apiClient.get('/dashboard/messages');
    return response.data.data;
  },

  // Notifications
  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get('/dashboard/notifications');
    return response.data.data;
  },

  markNotificationAsRead: async (id: string): Promise<void> => {
    await apiClient.put(`/dashboard/notifications/${id}/read`);
  },

  // Profile
  getDashboardProfile: async (): Promise<UserProfile & { company?: CompanyProfile }> => {
    const response = await apiClient.get('/dashboard/profile');
    return response.data.data;
  },
};

// Project API Types
export interface Project {
  id: string;
  name: string;
  description: string;
  website?: string;
  logoUrl?: string;
  bannerUrl?: string;
  foundedYear?: number;
  projectType?: 'AI' | 'DEFI' | 'GAMEFI' | 'NFT' | 'DAO' | 'WEB3_TOOLS' | 'INFRASTRUCTURE' | 'METAVERSE' | 'SOCIAL' | 'OTHER';
  projectStage?: 'IDEA_STAGE' | 'MVP' | 'BETA_TESTING' | 'LIVE' | 'SCALING' | 'MATURE';
  teamSize?: 'SOLO' | 'SMALL_2_10' | 'MEDIUM_11_50' | 'LARGE_51_200' | 'ENTERPRISE_200_PLUS';
  fundingStage?: 'PRE_SEED' | 'SEED' | 'SERIES_A' | 'SERIES_B' | 'SERIES_C' | 'SERIES_D_PLUS' | 'IPO' | 'PROFITABLE';
  totalFunding?: number;
  isLookingForFunding: boolean;
  isLookingForPartners: boolean;
  tokenAvailability?: 'NO_TOKEN_YET' | 'PRIVATE_SALE_ONGOING' | 'PUBLIC_SALE_LIVE' | 'LISTED_ON_EXCHANGES' | 'FULLY_DISTRIBUTED';
  developmentFocus?: string;
  contactEmail?: string;
  twitterHandle?: string;
  discordServer?: string;
  telegramGroup?: string;
  githubUrl?: string;
  whitepaperUrl?: string;
  country?: string;
  city?: string;
  timezone?: string;
  isVerified: boolean;
  verificationLevel: 'BASIC' | 'VERIFIED' | 'PREMIUM_VERIFIED' | 'ENTERPRISE_VERIFIED';
  trustScore: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  blockchainPreferences: Array<{
    id: string;
    blockchain: string;
    isPrimary: boolean;
  }>;
  tags: Array<{
    id: string;
    tag: string;
  }>;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
    userType: string;
    subscriptionTier: string;
    isVerified: boolean;
    createdAt: string;
  };
}

export interface CreateProjectData {
  name: string;
  description: string;
  website?: string;
  logoUrl?: string;
  bannerUrl?: string;
  foundedYear?: number;
  projectType?: 'AI' | 'DEFI' | 'GAMEFI' | 'NFT' | 'DAO' | 'WEB3_TOOLS' | 'INFRASTRUCTURE' | 'METAVERSE' | 'SOCIAL' | 'OTHER';
  projectStage?: 'IDEA_STAGE' | 'MVP' | 'BETA_TESTING' | 'LIVE' | 'SCALING' | 'MATURE';
  teamSize?: 'SOLO' | 'SMALL_2_10' | 'MEDIUM_11_50' | 'LARGE_51_200' | 'ENTERPRISE_200_PLUS';
  fundingStage?: 'PRE_SEED' | 'SEED' | 'SERIES_A' | 'SERIES_B' | 'SERIES_C' | 'SERIES_D_PLUS' | 'IPO' | 'PROFITABLE';
  totalFunding?: number;
  isLookingForFunding?: boolean;
  isLookingForPartners?: boolean;
  tokenAvailability?: 'NO_TOKEN_YET' | 'PRIVATE_SALE_ONGOING' | 'PUBLIC_SALE_LIVE' | 'LISTED_ON_EXCHANGES' | 'FULLY_DISTRIBUTED';
  developmentFocus?: string;
  contactEmail?: string;
  twitterHandle?: string;
  discordServer?: string;
  telegramGroup?: string;
  githubUrl?: string;
  whitepaperUrl?: string;
  country?: string;
  city?: string;
  timezone?: string;
  blockchainPreferences?: ('ETHEREUM' | 'BITCOIN' | 'SOLANA' | 'POLYGON' | 'BINANCE_SMART_CHAIN' | 'AVALANCHE' | 'CARDANO' | 'POLKADOT' | 'COSMOS' | 'ARBITRUM' | 'OPTIMISM' | 'BASE' | 'OTHER')[];
  tags?: string[];
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  id?: string;
}

export interface ProjectFilters {
  search?: string;
  projectType?: string;
  projectStage?: string;
  blockchain?: string;
  country?: string;
  isLookingForFunding?: boolean;
  isLookingForPartners?: boolean;
  tags?: string[];
  tokenAvailability?: string;
  fundingStage?: string;
  teamSize?: string;
  developmentFocus?: string;
  tab?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'viewCount' | 'trustScore';
  sortOrder?: 'asc' | 'desc';
}

// Project API methods
export const projectApi = {
  // Get current user's project
  getMyProject: async (): Promise<Project | null> => {
    try {
      const response = await apiClient.get('/project');
      return response.data.data.project;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create or update project
  createOrUpdateProject: async (data: CreateProjectData | UpdateProjectData): Promise<{ status: string; data: { project: Project } }> => {
    const response = await apiClient.post('/project', data);
    return response.data;
  },

  // Get project by ID
  getProjectById: async (projectId: string): Promise<Project> => {
    const response = await apiClient.get(`/project/${projectId}`);
    return response.data.data.project;
  },

  // Get all projects with filtering
  getProjects: async (filters?: ProjectFilters): Promise<{
    projects: Project[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const response = await apiClient.get('/project/all', { params: filters });
    return response.data.data;
  },

  // Delete project
  deleteProject: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.delete('/project');
    return response.data;
  },

  // Upload project logo
  uploadLogo: async (file: File): Promise<{ status: string; data: { url: string } }> => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await apiClient.post('/project/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload project banner
  uploadBanner: async (file: File): Promise<{ status: string; data: { url: string } }> => {
    const formData = new FormData();
    formData.append('banner', file);
    const response = await apiClient.post('/project/upload-banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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