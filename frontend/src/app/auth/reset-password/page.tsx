'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { Navbar } from "@/components/layout/navbar"
import { useAuth } from "@/hooks/use-auth"
import type { ResetPasswordRequest } from "@/lib/api-client"

// Validation functions
const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Password must be at least 8 characters long"
    
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
        return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    }
    
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

// Reset Password Form Component
interface ResetPasswordFormProps {
    onSubmit: (data: ResetPasswordRequest) => void
    isLoading: boolean
    error: any
    token: string | null
}

function ResetPasswordForm({ onSubmit, isLoading, error, token }: ResetPasswordFormProps) {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    })
    const [focusedField, setFocusedField] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

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

        // Validate password
        const passwordError = validatePassword(formData.newPassword)
        if (passwordError) errors.newPassword = passwordError

        // Validate confirm password
        if (!formData.confirmPassword) {
            errors.confirmPassword = "Please confirm your password"
        } else if (formData.newPassword !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match"
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!token) {
            setFieldErrors({ general: "Invalid or missing reset token" })
            return
        }

        if (validateForm()) {
            onSubmit({
                token,
                newPassword: formData.newPassword
            })
        }
    }

    const getFieldError = (fieldName: string) => {
        return fieldErrors[fieldName] || apiErrors[fieldName] || ''
    }

    // Show error if no token
    if (!token) {
        return (
            <div className="text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">
                        Invalid Reset Link
                    </h1>
                    <p className="text-gray-400 mb-6">
                        This password reset link is invalid or has expired. Please request a new one.
                    </p>
                </div>

                <div className="space-y-4">
                    <Link
                        href="/auth/forgot-password"
                        className="block w-full bg-[#4C82ED] hover:bg-[#3d6bdc] text-white py-3 rounded-lg font-medium transition-colors text-center"
                    >
                        Request New Reset Link
                    </Link>
                    
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

    return (
        <>
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-white mb-4">
                    Reset Your Password
                </h1>
                <p className="text-gray-400">
                    Enter your new password below.
                </p>
            </div>

            {error && Object.keys(apiErrors).length === 0 && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">
                        {error.response?.data?.message || 'Password reset failed. Please try again.'}
                    </p>
                </div>
            )}

            {fieldErrors.general && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{fieldErrors.general}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password Input */}
                <div>
                    <div className={`${focusedField === 'newPassword' ? 'gradient-border' : 'gray-border'} ${getFieldError('newPassword') ? 'border-red-500' : ''} rounded-lg mb-1`}>
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Enter new password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('newPassword')}
                            onBlur={() => setFocusedField('')}
                            className="w-full h-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white placeholder-gray-400 border-none focus:outline-none"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {getFieldError('newPassword') && (
                        <p className="text-red-400 text-xs mt-1 px-1">{getFieldError('newPassword')}</p>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div>
                    <div className={`${focusedField === 'confirmPassword' ? 'gradient-border' : 'gray-border'} ${getFieldError('confirmPassword') ? 'border-red-500' : ''} rounded-lg mb-1`}>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField('')}
                            className="w-full h-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white placeholder-gray-400 border-none focus:outline-none"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {getFieldError('confirmPassword') && (
                        <p className="text-red-400 text-xs mt-1 px-1">{getFieldError('confirmPassword')}</p>
                    )}
                </div>

                {/* Password Requirements */}
                <div className="text-xs text-gray-400 space-y-1">
                    <p>Password must contain:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>At least 8 characters</li>
                        <li>One uppercase letter</li>
                        <li>One lowercase letter</li>
                        <li>One number</li>
                        <li>One special character</li>
                    </ul>
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
                            RESETTING PASSWORD...
                        </div>
                    ) : (
                        'RESET PASSWORD'
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

// Main Reset Password Page Component
export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [token, setToken] = useState<string | null>(null)

    const { 
        resetPassword,
        isResettingPassword,
        resetPasswordError,
        resetResetPasswordError 
    } = useAuth()

    useEffect(() => {
        const tokenParam = searchParams.get('token')
        setToken(tokenParam)
    }, [searchParams])

    const handleSubmit = (data: ResetPasswordRequest) => {
        resetResetPasswordError()
        resetPassword(data)
    }

    return (
        <AuthLayout>
            <div className="w-full max-w-md">
                {/* Form Container */}
                <div className="bg-blue-800/5 border border-synqit-border rounded-3xl p-8">
                    <ResetPasswordForm 
                        onSubmit={handleSubmit} 
                        isLoading={isResettingPassword}
                        error={resetPasswordError}
                        token={token}
                    />
                </div>
            </div>
        </AuthLayout>
    )
} 