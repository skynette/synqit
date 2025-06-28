'use client'

import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthMiddlewareProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthMiddleware({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth' 
}: AuthMiddlewareProps) {
  const { isAuthenticated, isUserLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isUserLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo)
      } else if (!requireAuth && isAuthenticated) {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, isUserLoading, requireAuth, redirectTo, router])

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