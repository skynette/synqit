'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { Navbar } from "@/components/layout/navbar"
import { useAuth } from "@/hooks/use-auth"
import type { LoginRequest, RegisterRequest } from "@/lib/api-client"

// Validation functions
const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Please enter a valid email address"
    return null
}

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

const validateName = (name: string, fieldName: string): string | null => {
    if (!name) return `${fieldName} is required`
    if (name.length < 2) return `${fieldName} must be at least 2 characters long`
    if (name.length > 50) return `${fieldName} must be less than 50 characters`
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
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

// Login Form Component
interface LoginFormProps {
    onSubmit: (data: LoginRequest) => void
    isLoading: boolean
    error: any
}

function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    })
    const [agreeToTerms, setAgreeToTerms] = useState(false)
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

        // Validate email
        const emailError = validateEmail(formData.email)
        if (emailError) errors.email = emailError

        // Validate password
        if (!formData.password) errors.password = "Password is required"

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!agreeToTerms) {
            alert('Please agree to the terms of service')
            return
        }

        if (validateForm()) {
            onSubmit(formData)
        }
    }

    const getFieldError = (fieldName: string) => {
        return fieldErrors[fieldName] || apiErrors[fieldName] || ''
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-white mb-8">
                Login to your Synqit Account
            </h1>

            {error && !apiErrors.email && !apiErrors.password && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">
                        {error.response?.data?.message || 'Login failed. Please try again.'}
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
                            placeholder="Enter Email/Username"
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

                {/* Password Input */}
                <div>
                    <div className={`${focusedField === 'password' ? 'gradient-border' : 'gray-border'} ${getFieldError('password') ? 'border-red-500' : ''} rounded-lg mb-1`}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField('')}
                            className="w-full h-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white placeholder-gray-400 border-none focus:outline-none"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {getFieldError('password') && (
                        <p className="text-red-400 text-xs mt-1 px-1">{getFieldError('password')}</p>
                    )}
                </div>

                {/* Forgotten Password */}
                <div className="text-right">
                    <Link href="/forgot-password" className="text-gray-400 text-sm hover:text-white transition-colors">
                        Forgotten Password?
                    </Link>
                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={isLoading || !agreeToTerms}
                    className="w-full bg-[#4C82ED] hover:bg-[#3d6bdc] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            LOGGING IN...
                        </div>
                    ) : (
                        'LOGIN'
                    )}
                </button>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="terms-login"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 bg-[#2a3142] border border-synqit-border rounded"
                        disabled={isLoading}
                    />
                    <label htmlFor="terms-login" className="text-sm text-gray-400">
                        By continuing, you agree to the{' '}
                        <Link href="/terms" className="text-[#4C82ED] hover:underline">
                            Terms of Service
                        </Link>
                        . We'll occasionally send you account-related emails.
                    </label>
                </div>
            </form>
        </>
    )
}

// Sign Up Form Component
interface SignUpFormProps {
    onSubmit: (data: RegisterRequest) => void
    isLoading: boolean
    error: any
}

function SignUpForm({ onSubmit, isLoading, error }: SignUpFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        userType: 'STARTUP' as const,
        bio: ''
    })
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const [focusedField, setFocusedField] = useState<string>("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    // Parse API errors when error changes
    const apiErrors = parseValidationErrors(error)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

        // Validate first name
        const firstNameError = validateName(formData.firstName, 'First name')
        if (firstNameError) errors.firstName = firstNameError

        // Validate last name
        const lastNameError = validateName(formData.lastName, 'Last name')
        if (lastNameError) errors.lastName = lastNameError

        // Validate email
        const emailError = validateEmail(formData.email)
        if (emailError) errors.email = emailError

        // Validate password
        const passwordError = validatePassword(formData.password)
        if (passwordError) errors.password = passwordError

        // Validate confirm password
        if (!formData.confirmPassword) {
            errors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match"
        }

        setFieldErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!agreeToTerms) {
            alert('Please agree to the terms of service')
            return
        }

        if (validateForm()) {
            const registerData: RegisterRequest = {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
                userType: formData.userType,
                bio: formData.bio || undefined,
            }

            onSubmit(registerData)
        }
    }

    const getFieldError = (fieldName: string) => {
        return fieldErrors[fieldName] || apiErrors[fieldName] || ''
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-white mb-8">
                Create an Account with Synqit
            </h1>

            {error && Object.keys(apiErrors).length === 0 && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">
                        {error.response?.data?.message || 'Registration failed. Please try again.'}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className={`${focusedField === 'firstName' ? 'gradient-border' : 'gray-border'} ${getFieldError('firstName') ? 'border-red-500' : ''} rounded-lg mb-1`}>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('firstName')}
                                onBlur={() => setFocusedField('')}
                                className="w-full h-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white placeholder-gray-400 border-none focus:outline-none"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {getFieldError('firstName') && (
                            <p className="text-red-400 text-xs mt-1 px-1">{getFieldError('firstName')}</p>
                        )}
                    </div>
                    <div>
                        <div className={`${focusedField === 'lastName' ? 'gradient-border' : 'gray-border'} ${getFieldError('lastName') ? 'border-red-500' : ''} rounded-lg mb-1`}>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                onFocus={() => setFocusedField('lastName')}
                                onBlur={() => setFocusedField('')}
                                className="w-full h-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white placeholder-gray-400 border-none focus:outline-none"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        {getFieldError('lastName') && (
                            <p className="text-red-400 text-xs mt-1 px-1">{getFieldError('lastName')}</p>
                        )}
                    </div>
                </div>

                {/* Email Input */}
                <div>
                    <div className={`${focusedField === 'email' ? 'gradient-border' : 'gray-border'} ${getFieldError('email') ? 'border-red-500' : ''} rounded-lg mb-1`}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
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

                {/* User Type Selection */}
                <div>
                    <div className={`${focusedField === 'userType' ? 'gradient-border' : 'gray-border'} ${getFieldError('userType') ? 'border-red-500' : ''} rounded-lg mb-1`}>
                        <select
                            name="userType"
                            value={formData.userType}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('userType')}
                            onBlur={() => setFocusedField('')}
                            className="w-full h-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white border-none focus:outline-none"
                            required
                            disabled={isLoading}
                        >
                            <option value="STARTUP">Startup</option>
                            <option value="INVESTOR">Investor</option>
                            <option value="ECOSYSTEM_PLAYER">Ecosystem Player</option>
                            <option value="INDIVIDUAL">Individual</option>
                        </select>
                    </div>
                    {getFieldError('userType') && (
                        <p className="text-red-400 text-xs mt-1 px-1">{getFieldError('userType')}</p>
                    )}
                </div>

                {/* Password Input */}
                <div>
                    <div className={`${focusedField === 'password' ? 'gradient-border' : 'gray-border'} ${getFieldError('password') ? 'border-red-500' : ''} rounded-lg mb-1`}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField('')}
                            className="w-full h-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white placeholder-gray-400 border-none focus:outline-none"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {getFieldError('password') && (
                        <p className="text-red-400 text-xs mt-1 px-1">{getFieldError('password')}</p>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div>
                    <div className={`${focusedField === 'confirmPassword' ? 'gradient-border' : 'gray-border'} ${getFieldError('confirmPassword') ? 'border-red-500' : ''} rounded-lg mb-1`}>
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
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

                {/* Sign Up Button */}
                <button
                    type="submit"
                    disabled={isLoading || !agreeToTerms}
                    className="w-full bg-[#4C82ED] hover:bg-[#3d6bdc] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            CREATING ACCOUNT...
                        </div>
                    ) : (
                        'SIGN UP'
                    )}
                </button>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="terms-signup"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 bg-[#2a3142] border border-synqit-border rounded"
                        disabled={isLoading}
                    />
                    <label htmlFor="terms-signup" className="text-sm text-gray-400">
                        By continuing, you agree to the{' '}
                        <Link href="/terms" className="text-[#4C82ED] hover:underline">
                            Terms of Service
                        </Link>
                        . We'll occasionally send you account-related emails.
                    </label>
                </div>
            </form>
        </>
    )
}

// Social Login Section Component
function SocialLoginSection() {
    return (
        <div className="mt-8">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-synqit-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 text-gray-400">Or continue with</span>
                </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <button className="flex items-center justify-between bg-[#2a3142] border border-synqit-border rounded-lg px-4 py-3 text-white hover:bg-[#3a4152] transition-colors">
                    <div className="flex items-center gap-3">
                        <Image src="/icons/gmail.svg" alt="Gmail" width={30} height={30} />
                        <span>Gmail</span>
                    </div>
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="34" height="34" rx="10" fill="white" />
                        <g clipPath="url(#clip0_140_1159)">
                            <g clipPath="url(#clip1_140_1159)">
                                <g clipPath="url(#clip2_140_1159)">
                                    <path d="M22 16.6699H12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18 12.6699L22 16.6699L18 20.6699" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                            </g>
                        </g>
                        <defs>
                            <clipPath id="clip0_140_1159">
                                <rect width="12" height="10" fill="white" transform="translate(11 11.6699)" />
                            </clipPath>
                            <clipPath id="clip1_140_1159">
                                <rect width="12" height="10" fill="white" transform="translate(11 11.6699)" />
                            </clipPath>
                            <clipPath id="clip2_140_1159">
                                <rect width="12" height="10" fill="white" transform="translate(11 11.6699)" />
                            </clipPath>
                        </defs>
                    </svg>
                </button>

                <button className="flex items-center justify-between bg-[#2a3142] border border-synqit-border rounded-lg px-4 py-3 text-white hover:bg-[#3a4152] transition-colors">
                    <div className="flex items-center gap-3">
                        <Image src="/icons/discord.svg" alt="Discord" width={30} height={30} />
                        <span>Discord</span>
                    </div>
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="34" height="34" rx="10" fill="white" />
                        <g clipPath="url(#clip0_140_1159)">
                            <g clipPath="url(#clip1_140_1159)">
                                <g clipPath="url(#clip2_140_1159)">
                                    <path d="M22 16.6699H12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M18 12.6699L22 16.6699L18 20.6699" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                            </g>
                        </g>
                        <defs>
                            <clipPath id="clip0_140_1159">
                                <rect width="12" height="10" fill="white" transform="translate(11 11.6699)" />
                            </clipPath>
                            <clipPath id="clip1_140_1159">
                                <rect width="12" height="10" fill="white" transform="translate(11 11.6699)" />
                            </clipPath>
                            <clipPath id="clip2_140_1159">
                                <rect width="12" height="10" fill="white" transform="translate(11 11.6699)" />
                            </clipPath>
                        </defs>
                    </svg>

                </button>
            </div>

            {/* Wallet Section */}
            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-synqit-border"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 text-gray-400">Or</span>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-white text-sm mb-4">with Wallet</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center justify-between bg-[#2a3142] border border-[#4C82ED] rounded-lg px-4 py-3 text-white hover:bg-[#3a4152] transition-colors">
                            <span>WalletConnect</span>
                            <div className="rounded-full flex items-center justify-center">
                                <Image src="/icons/wallet-connect.svg" alt="WalletConnect" width={40} height={40} />
                            </div>
                        </button>

                        <button className="flex items-center justify-between bg-[#2a3142] border border-synqit-border rounded-lg px-4 py-3 text-white hover:bg-[#3a4152] transition-colors">
                            <span>Meta Mask</span>
                            <div className="flex items-center justify-center">
                                <Image src="/icons/metamask.svg" alt="MetaMask" width={40} height={40} />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Main Auth Page Component
export function AuthPage() {
    const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')
    const { 
        login, 
        register, 
        isLoggingIn, 
        isRegistering, 
        loginError, 
        registerError,
        resetLoginError,
        resetRegisterError 
    } = useAuth()

    const handleTabChange = (tab: 'login' | 'signup') => {
        setActiveTab(tab)
        // Reset errors when switching tabs
        resetLoginError()
        resetRegisterError()
    }

    return (
        <AuthLayout>
            <div className="w-full max-w-md md:max-w-lg">
                {/* Tab Navigation */}
                <div className="flex mb-8 bg-transparent border border-synqit-border rounded-full p-1">
                    <button
                        onClick={() => handleTabChange('login')}
                        className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-300 ${activeTab === 'login'
                            ? 'bg-[#4C82ED] text-white shadow-lg'
                            : 'bg-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => handleTabChange('signup')}
                        className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-300 ${activeTab === 'signup'
                            ? 'bg-[#4C82ED] text-white shadow-lg'
                            : 'bg-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form Container */}
                <div className="bg-blue-800/5 border border-synqit-border rounded-3xl p-8">
                    {/* Dynamic Form Content */}
                    {activeTab === 'login' ? (
                        <LoginForm 
                            onSubmit={login} 
                            isLoading={isLoggingIn}
                            error={loginError}
                        />
                    ) : (
                        <SignUpForm 
                            onSubmit={register} 
                            isLoading={isRegistering}
                            error={registerError}
                        />
                    )}

                    {/* Social Login Section - Shared between both forms */}
                    <SocialLoginSection />
                </div>
            </div>
        </AuthLayout>
    )
}