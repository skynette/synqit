'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface AuthMiddlewareProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireEmailVerification?: boolean
  redirectTo?: string
}

export function AuthMiddleware({ 
  children, 
  requireAuth = true, 
  requireEmailVerification = false,
  redirectTo = '/auth' 
}: AuthMiddlewareProps) {
  const { user, isAuthenticated, isUserLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isUserLoading) {
      // Handle authentication requirements
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo)
        return
      }

      // Handle email verification requirements
      if (requireEmailVerification && isAuthenticated && user && !user.isEmailVerified) {
        // Allow access to email verification page
        if (pathname !== '/auth/verify-email') {
          router.push('/auth/verify-email')
          return
        }
      }

      // Redirect authenticated users away from auth pages
      if (!requireAuth && isAuthenticated) {
        // If user is not email verified, go to verification page
        if (user && !user.isEmailVerified) {
          router.push('/auth/verify-email')
          return
        }
        
        // Otherwise go to dashboard
        router.push('/dashboard')
        return
      }
    }
  }, [isAuthenticated, user, isUserLoading, requireAuth, requireEmailVerification, redirectTo, router, pathname])

  // Show loading while checking auth status
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#4C82ED] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white">Loading...</span>
        </div>
      </div>
    )
  }

  // If auth check passed, render children
  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return <>{children}</>
  }

  // Otherwise, don't render anything (redirect is in progress)
  return null
}

// Helper components for common use cases
export function EmailVerificationRequired({ children }: { children: React.ReactNode }) {
  return (
    <AuthMiddleware requireAuth={true} requireEmailVerification={true}>
      {children}
    </AuthMiddleware>
  )
}

export function AuthRequired({ children, redirectTo }: { children: React.ReactNode, redirectTo?: string }) {
  return (
    <AuthMiddleware requireAuth={true} redirectTo={redirectTo}>
      {children}
    </AuthMiddleware>
  )
}

export function GuestOnly({ children }: { children: React.ReactNode }) {
  return (
    <AuthMiddleware requireAuth={false}>
      {children}
    </AuthMiddleware>
  )
} 