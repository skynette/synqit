'use client'

import { useState, useEffect, useRef, Suspense, useCallback } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { Navbar } from "@/components/layout/navbar"
import { useAuth } from "@/hooks/use-auth"
import type { VerifyEmailRequest, ResendVerificationRequest } from "@/lib/api-client"

// Auth Layout Component
interface AuthLayoutProps {
    children: React.ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen relative">
            <BackgroundPattern />
            <Navbar />
            <main className="relative z-10 mt-20 md:mt-24 flex items-center justify-center p-4">
                {children}
            </main>
        </div>
    )
}

// Email Verification Component
interface EmailVerificationProps {
    token: string | null
    user: any
    onVerify: (data: VerifyEmailRequest) => void
    onResend: (data: ResendVerificationRequest) => void
    isVerifying: boolean
    isResending: boolean
    verifyError: any
    resendError: any
}

function EmailVerification({ 
    token, 
    user, 
    onVerify, 
    onResend, 
    isVerifying, 
    isResending, 
    verifyError, 
    resendError 
}: EmailVerificationProps) {
    const hasAttemptedVerificationRef = useRef(false)

    // Auto-verify if token is present in URL with persistence
    useEffect(() => {
        if (token && !hasAttemptedVerificationRef.current) {
            // Check if we've already attempted verification for this token
            const verificationKey = `synqit_verified_${token}`
            const hasVerified = sessionStorage.getItem(verificationKey)
            
            if (!hasVerified) {
                hasAttemptedVerificationRef.current = true
                // Mark as attempted in session storage
                sessionStorage.setItem(verificationKey, 'true')
                onVerify({ token })
            }
        }
    }, [token, onVerify])

    const handleResendVerification = () => {
        if (user?.email) {
            onResend({ email: user.email })
        }
    }

    // Show verification in progress
    if (token && isVerifying) {
        return (
            <div className="text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Verifying Your Email
                    </h1>
                    <p className="text-gray-400">
                        Please wait while we verify your email address...
                    </p>
                </div>
            </div>
        )
    }

    // Show verification error
    if (token && verifyError) {
        return (
            <div className="text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Verification Failed
                    </h1>
                    <p className="text-gray-400 mb-6">
                        {verifyError?.response?.data?.message || 'This verification link is invalid or has expired.'}
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleResendVerification}
                        disabled={isResending || !user?.email}
                        className="block w-full bg-[#4C82ED] hover:bg-[#3d6bdc] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        {isResending ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                SENDING...
                            </div>
                        ) : (
                            'Send New Verification Email'
                        )}
                    </button>
                    
                    <Link
                        href="/auth"
                        className="block w-full text-gray-400 hover:text-white py-3 rounded-lg font-medium transition-colors text-center"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        )
    }

    // Show pending verification (no token in URL)
    return (
        <div className="text-center">
            <div className="mb-6">
                <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">
                    Check Your Email
                </h1>
                <p className="text-gray-400 mb-6">
                    We've sent a verification link to{' '}
                    <span className="text-white font-medium">{user?.email}</span>
                    <br />
                    Click the link in the email to verify your account.
                </p>
            </div>

            {resendError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">
                        {resendError.response?.data?.message || 'Failed to resend verification email'}
                    </p>
                </div>
            )}

            <div className="space-y-4">
                <button
                    onClick={handleResendVerification}
                    disabled={isResending || !user?.email}
                    className="block w-full bg-[#4C82ED] hover:bg-[#3d6bdc] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                >
                    {isResending ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            SENDING...
                        </div>
                    ) : (
                        'Resend Verification Email'
                    )}
                </button>
                
                <Link
                    href="/dashboard"
                    className="block w-full text-gray-400 hover:text-white py-3 rounded-lg font-medium transition-colors text-center"
                >
                    Continue to Dashboard
                </Link>
                
                <Link
                    href="/auth"
                    className="block w-full text-gray-400 hover:text-white py-3 rounded-lg font-medium transition-colors text-center"
                >
                    Back to Login
                </Link>
            </div>

            <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-gray-400">
                    <strong className="text-white">Didn't receive the email?</strong>
                    <br />
                    Check your spam folder or try resending the verification email.
                </p>
            </div>
        </div>
    )
}

// Email Verification Page Content with Search Params
function VerifyEmailPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [token, setToken] = useState<string | null>(null)

    const { 
        user,
        verifyEmail,
        resendVerification,
        isVerifyingEmail,
        isResendingVerification,
        verifyEmailError,
        resendVerificationError,
        resetVerifyEmailError,
        resetResendVerificationError,
        userError
    } = useAuth()

    useEffect(() => {
        const tokenParam = searchParams.get('token')
        setToken(tokenParam)
    }, [searchParams])

    // Redirect if user is already verified
    useEffect(() => {
        if (user?.isEmailVerified) {
            router.push('/dashboard')
        }
    }, [user, router])

    const handleVerify = useCallback((data: VerifyEmailRequest) => {
        resetVerifyEmailError()
        verifyEmail(data)
    }, [resetVerifyEmailError, verifyEmail])

    const handleResend = useCallback((data: ResendVerificationRequest) => {
        resetResendVerificationError()
        resendVerification(data)
    }, [resetResendVerificationError, resendVerification])

    // Show error state if user data fails to load
    if (userError) {
        return (
            <AuthLayout>
                <div className="w-full max-w-md">
                    <div className="bg-blue-800/5 border border-synqit-border rounded-3xl p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Connection Error</h2>
                            <p className="text-gray-400 mb-4">Failed to load user data. Please check your connection and try again.</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    // Show loading if we don't have user data yet
    if (!user) {
        return (
            <AuthLayout>
                <div className="w-full max-w-md">
                    <div className="bg-blue-800/5 border border-synqit-border rounded-3xl p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-gray-400">Loading...</p>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                {/* Form Container */}
                <div className="bg-blue-800/5 border border-synqit-border rounded-3xl p-8">
                    <EmailVerification
                        token={token}
                        user={user}
                        onVerify={handleVerify}
                        onResend={handleResend}
                        isVerifying={isVerifyingEmail}
                        isResending={isResendingVerification}
                        verifyError={verifyEmailError}
                        resendError={resendVerificationError}
                    />
                </div>
            </div>
        </AuthLayout>
    )
}

// Main Email Verification Page Component with Suspense
export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <AuthLayout>
                <div className="w-full max-w-md">
                    <div className="bg-blue-800/5 border border-synqit-border rounded-3xl p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <p className="text-gray-400">Loading...</p>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        }>
            <VerifyEmailPageContent />
        </Suspense>
    )
} 