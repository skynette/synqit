'use client'

import { useState } from "react"
import Link from "next/link"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { Navbar } from "@/components/layout/navbar"
import { useAuth } from "@/hooks/use-auth"
import type { ForgotPasswordRequest } from "@/lib/api-client"

// Validation functions
const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return null
}

// Parse API validation errors
const parseValidationErrors = (error: any): Record<string, string> => {
    const fieldErrors: Record<string, string> = {}
    
    if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach((err: any) => {
            if (err.path && err.msg) {
                fieldErrors[err.path] = err.msg
            }
        })
    }
    
    return fieldErrors
}

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

// Forgot Password Form Component
interface ForgotPasswordFormProps {
    onSubmit: (data: ForgotPasswordRequest) => void
    isLoading: boolean
    error: any
}

function ForgotPasswordForm({ onSubmit, isLoading, error }: ForgotPasswordFormProps) {
    const [formData, setFormData] = useState<ForgotPasswordRequest>({
        email: ''
    })
    const [focusedField, setFocusedField] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [isSubmitted, setIsSubmitted] = useState(false)

    // Parse API errors when error changes
    const apiErrors = parseValidationErrors(error)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })

        // Clear field error when user starts typing
        if (fieldErrors[name] || apiErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}

        // Validate email
        const emailError = validateEmail(formData.email)
        if (emailError) errors.email = emailError

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (validateForm()) {
            setIsSubmitted(true)
            onSubmit(formData)
        }
    }

    const getFieldError = (fieldName: string) => {
        return fieldErrors[fieldName] || apiErrors[fieldName] || ''
    }

    // Show success message after submission
    if (isSubmitted && !error) {
        return (
            <div className="text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Check Your Email
                    </h1>
                    <p className="text-gray-400 mb-6">
                        If an account with that email exists, we've sent you a password reset link.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/auth"
                        className="block w-full bg-[#4C82ED] hover:bg-[#3d6bdc] text-white py-3 rounded-lg font-medium transition-colors text-center"
                    >
                        Back to Login
                    </Link>
                    
                    <button
                        onClick={() => {
                            setIsSubmitted(false)
                            setFormData({ email: '' })
                        }}
                        className="block w-full text-gray-400 hover:text-white py-3 rounded-lg font-medium transition-colors"
                    >
                        Try Different Email
                    </button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">
                    Forgot Your Password?
                </h1>
                <p className="text-gray-400">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            {error && !apiErrors.email && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">
                        {error.response?.data?.message || 'Something went wrong. Please try again.'}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                    <div className={`${focusedField === 'email' ? 'gradient-border' : 'gray-border'} ${getFieldError('email') ? 'border-red-500' : ''} rounded-lg mb-1`}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField('')}
                            className="w-full h-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white placeholder-gray-400 border-none focus:outline-none"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {getFieldError('email') && (
                        <p className="text-red-400 text-xs mt-1 px-1">{getFieldError('email')}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#4C82ED] hover:bg-[#3d6bdc] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            SENDING EMAIL...
                        </div>
                    ) : (
                        'SEND RESET LINK'
                    )}
                </button>

                {/* Back to Login */}
                <div className="text-center">
                    <Link 
                        href="/auth" 
                        className="text-gray-400 text-sm hover:text-white transition-colors"
                    >
                        ← Back to Login
                    </Link>
                </div>
            </form>
        </>
    )
}

// Main Forgot Password Page Component
export default function ForgotPasswordPage() {
    const { 
        forgotPassword,
        isSendingResetEmail,
        forgotPasswordError,
        resetForgotPasswordError 
    } = useAuth()

    const handleSubmit = (data: ForgotPasswordRequest) => {
        resetForgotPasswordError()
        forgotPassword(data)
    }

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                {/* Form Container */}
                <div className="bg-blue-800/5 border border-synqit-border rounded-3xl p-8">
                    <ForgotPasswordForm 
                        onSubmit={handleSubmit} 
                        isLoading={isSendingResetEmail}
                        error={forgotPasswordError}
                    />
                </div>
            </div>
        </AuthLayout>
    )
} 