'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, setAuthToken, clearAuthToken, getAuthToken } from '@/lib/api-client'
import type { 
  LoginRequest, 
  RegisterRequest, 
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ChangeEmailRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  User 
} from '@/lib/api-client'
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
        
        // Check if email is verified
        if (!data.data.user.isEmailVerified) {
          router.push('/auth/verify-email')
          // toast.info('Please verify your email address to continue')
        } else {
          router.push('/dashboard')
          // toast.success('Login successful!')
        }
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
        router.push('/auth/verify-email')
        // toast.success('Account created successfully! Please verify your email.')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed'
      // toast.error(message)
      console.error('Registration error:', message)
    },
  })

  // Email verification mutation
  const verifyEmailMutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (data) => {
      if (data.status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['user'] })
        router.push('/dashboard')
        // toast.success('Email verified successfully!')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Email verification failed'
      // toast.error(message)
      console.error('Email verification error:', message)
    },
  })

  // Resend verification mutation
  const resendVerificationMutation = useMutation({
    mutationFn: authApi.resendVerification,
    onSuccess: (data) => {
      if (data.status === 'success') {
        // toast.success('Verification email sent successfully!')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to resend verification email'
      // toast.error(message)
      console.error('Resend verification error:', message)
    },
  })

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) => {
      if (data.status === 'success') {
        // toast.success('Password reset email sent successfully!')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to send password reset email'
      // toast.error(message)
      console.error('Forgot password error:', message)
    },
  })

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data) => {
      if (data.status === 'success') {
        router.push('/auth?tab=login')
        // toast.success('Password reset successfully! Please login with your new password.')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Password reset failed'
      // toast.error(message)
      console.error('Reset password error:', message)
    },
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: (data) => {
      if (data.status === 'success') {
        // toast.success('Password changed successfully!')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to change password'
      // toast.error(message)
      console.error('Change password error:', message)
    },
  })

  // Change email mutation
  const changeEmailMutation = useMutation({
    mutationFn: authApi.changeEmail,
    onSuccess: (data) => {
      if (data.status === 'success') {
        queryClient.invalidateQueries({ queryKey: ['user'] })
        // toast.success('Email changed successfully! Please verify your new email address.')
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to change email'
      // toast.error(message)
      console.error('Change email error:', message)
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

  const verifyEmail = (data: VerifyEmailRequest) => {
    verifyEmailMutation.mutate(data)
  }

  const resendVerification = (data: ResendVerificationRequest) => {
    resendVerificationMutation.mutate(data)
  }

  const forgotPassword = (data: ForgotPasswordRequest) => {
    forgotPasswordMutation.mutate(data)
  }

  const resetPassword = (data: ResetPasswordRequest) => {
    resetPasswordMutation.mutate(data)
  }

  const changePassword = (data: ChangePasswordRequest) => {
    changePasswordMutation.mutate(data)
  }

  const changeEmail = (data: ChangeEmailRequest) => {
    changeEmailMutation.mutate(data)
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
    isVerifyingEmail: verifyEmailMutation.isPending,
    isResendingVerification: resendVerificationMutation.isPending,
    isSendingResetEmail: forgotPasswordMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isChangingEmail: changeEmailMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    
    // Errors
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    verifyEmailError: verifyEmailMutation.error,
    resendVerificationError: resendVerificationMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    changePasswordError: changePasswordMutation.error,
    changeEmailError: changeEmailMutation.error,
    userError,
    
    // Actions
    login,
    register,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    changeEmail,
    logout,
    
    // Reset functions
    resetLoginError: loginMutation.reset,
    resetRegisterError: registerMutation.reset,
    resetVerifyEmailError: verifyEmailMutation.reset,
    resetResendVerificationError: resendVerificationMutation.reset,
    resetForgotPasswordError: forgotPasswordMutation.reset,
    resetResetPasswordError: resetPasswordMutation.reset,
    resetChangePasswordError: changePasswordMutation.reset,
    resetChangeEmailError: changeEmailMutation.reset,
  }
} 