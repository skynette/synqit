'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, setAuthToken, clearAuthToken, getAuthToken } from '@/lib/api-client'
import type { LoginRequest, RegisterRequest, User } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
// import { toast } from 'sonner' // We'll add this for notifications later

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  // Check if user is authenticated
  const isAuthenticated = !!getAuthToken()

  // Get current user profile
  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    retry: false,
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.status === 'success' && data.data) {
        setAuthToken(data.data.token)
        queryClient.setQueryData(['user'], { user: data.data.user })
        router.push('/dashboard')
        // toast.success('Login successful!')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Login failed'
      // toast.error(message)
      console.error('Login error:', message)
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.status === 'success' && data.data) {
        setAuthToken(data.data.token)
        queryClient.setQueryData(['user'], { user: data.data.user })
        router.push('/dashboard')
        // toast.success('Account created successfully!')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed'
      // toast.error(message)
      console.error('Registration error:', message)
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuthToken()
      queryClient.clear()
      router.push('/auth')
      // toast.success('Logged out successfully')
    },
    onError: (error: any) => {
      // Even if logout fails on server, clear local storage
      clearAuthToken()
      queryClient.clear()
      router.push('/auth')
      console.error('Logout error:', error)
    },
  })

  // Utility functions
  const login = (data: LoginRequest) => {
    loginMutation.mutate(data)
  }

  const register = (data: RegisterRequest) => {
    registerMutation.mutate(data)
  }

  const logout = () => {
    logoutMutation.mutate()
  }

  return {
    // State
    user: user?.user,
    isAuthenticated,
    isUserLoading,
    
    // Loading states
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    
    // Errors
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    userError,
    
    // Actions
    login,
    register,
    logout,
    
    // Reset functions
    resetLoginError: loginMutation.reset,
    resetRegisterError: registerMutation.reset,
  }
} 