'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// Simple toast utility - can be replaced with react-hot-toast later
const toast = {
  success: (message: string) => {
    if (typeof window !== 'undefined') {
      console.log('✅ ' + message)
      // You can replace this with your preferred toast library
    }
  },
  error: (message: string) => {
    if (typeof window !== 'undefined') {
      console.error('❌ ' + message)
      // You can replace this with your preferred toast library
    }
  }
}
import { 
  profileApi, 
  UserProfile, 
  CompanyProfile, 
  UpdateUserProfileRequest, 
  UpdateCompanyProfileRequest,
  ChangePasswordRequest,
  Toggle2FARequest,
  DeleteAccountRequest,
  BlockchainPreference,
  UpdateBlockchainPreferencesRequest
} from '@/lib/api-client'

// Query Keys
export const PROFILE_QUERY_KEYS = {
  user: ['profile', 'user'] as const,
  company: ['profile', 'company'] as const,
  blockchainPreferences: ['profile', 'blockchain-preferences'] as const,
}

// User Profile Hooks
export function useUserProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.user,
    queryFn: profileApi.getUserProfile,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: profileApi.updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.user, data)
      toast.success('Profile updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
    },
  })
}

// Company Profile Hooks
export function useCompanyProfile() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.company,
    queryFn: profileApi.getCompanyProfile,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: profileApi.updateCompanyProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.company, data)
      toast.success('Company profile updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update company profile'
      toast.error(message)
    },
  })
}

// Security Hooks
export function useChangePassword() {
  return useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to change password'
      toast.error(message)
    },
  })
}

export function useToggle2FA() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: profileApi.toggle2FA,
    onSuccess: (data) => {
      // Update the user profile cache with new 2FA status
      queryClient.setQueryData(PROFILE_QUERY_KEYS.user, (old: UserProfile | undefined) => {
        if (!old) return old
        return {
          ...old,
          twoFactorEnabled: data.twoFactorEnabled
        }
      })
      toast.success(`2FA ${data.twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`)
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to toggle 2FA'
      toast.error(message)
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: profileApi.deleteAccount,
    onSuccess: () => {
      toast.success('Account deleted successfully!')
      // Clear all cached data
      queryClient.clear()
      // Redirect will be handled by the API client interceptor
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete account'
      toast.error(message)
    },
  })
}

// Blockchain Preferences Hooks
export function useBlockchainPreferences() {
  return useQuery({
    queryKey: PROFILE_QUERY_KEYS.blockchainPreferences,
    queryFn: profileApi.getBlockchainPreferences,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateBlockchainPreferences() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: profileApi.updateBlockchainPreferences,
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEYS.blockchainPreferences, data)
      // Also update the company profile cache
      queryClient.setQueryData(PROFILE_QUERY_KEYS.company, (old: CompanyProfile | undefined) => {
        if (!old) return old
        return {
          ...old,
          blockchainPreferences: data
        }
      })
      toast.success('Blockchain preferences updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update blockchain preferences'
      toast.error(message)
    },
  })
}

// File Upload Hooks
export function useUploadProfileImage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: profileApi.uploadProfileImage,
    onSuccess: (imageUrl) => {
      // Update the user profile cache with new image URL
      queryClient.setQueryData(PROFILE_QUERY_KEYS.user, (old: UserProfile | undefined) => {
        if (!old) return old
        return {
          ...old,
          profileImage: imageUrl
        }
      })
      toast.success('Profile image updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to upload profile image'
      toast.error(message)
    },
  })
}

export function useUploadCompanyLogo() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: profileApi.uploadCompanyLogo,
    onSuccess: (logoUrl) => {
      // Update the company profile cache with new logo URL
      queryClient.setQueryData(PROFILE_QUERY_KEYS.company, (old: CompanyProfile | undefined) => {
        if (!old) return old
        return {
          ...old,
          logoUrl: logoUrl
        }
      })
      toast.success('Company logo updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to upload company logo'
      toast.error(message)
    },
  })
}

export function useUploadCompanyBanner() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: profileApi.uploadCompanyBanner,
    onSuccess: (bannerUrl) => {
      // Update the company profile cache with new banner URL
      queryClient.setQueryData(PROFILE_QUERY_KEYS.company, (old: CompanyProfile | undefined) => {
        if (!old) return old
        return {
          ...old,
          bannerUrl: bannerUrl
        }
      })
      toast.success('Company banner updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to upload company banner'
      toast.error(message)
    },
  })
}

// Utility hook for combined profile data
export function useProfileData() {
  const userProfile = useUserProfile()
  const companyProfile = useCompanyProfile()
  const blockchainPreferences = useBlockchainPreferences()
  
  return {
    user: userProfile,
    company: companyProfile,
    blockchainPreferences,
    isLoading: userProfile.isLoading || companyProfile.isLoading,
    error: userProfile.error || companyProfile.error,
  }
}