'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { Navbar } from "@/components/layout/navbar"

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
    onSubmit: (data: any) => void
}

function LoginForm({ onSubmit }: LoginFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [agreeToTerms, setAgreeToTerms] = useState(false)
    const [focusedField, setFocusedField] = useState<string>('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const getBorderColor = (fieldName: string, fieldValue: string) => {
        return focusedField === fieldName || fieldValue ? '#4C82ED' : '#6B7280'
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-white mb-8">
                Login to your Synqit Account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email/Username"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-200"
                        style={{
                            borderColor: getBorderColor('email', formData.email)
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4C82ED'}
                        onBlur={(e) => e.target.style.borderColor = formData.email ? '#4C82ED' : '#6B7280'}
                        required
                    />
                </div>

                {/* Password Input */}
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-200"
                        style={{
                            borderColor: formData.password ? '#4C82ED' : '#6B7280'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4C82ED'}
                        onBlur={(e) => e.target.style.borderColor = formData.password ? '#4C82ED' : '#6B7280'}
                        required
                    />
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
                    className="w-full bg-[#4C82ED] hover:bg-[#3d6bdc] text-white py-3 rounded-lg font-medium transition-colors"
                >
                    LOGIN
                </button>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="terms-login"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 bg-[#2a3142] border border-synqit-border rounded"
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
    onSubmit: (data: any) => void
}

function SignUpForm({ onSubmit }: SignUpFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [agreeToTerms, setAgreeToTerms] = useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <>
            <h1 className="text-2xl font-bold text-white mb-8">
                Create an Account with Synqit
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-200"
                        style={{
                            borderColor: formData.email ? '#4C82ED' : '#6B7280'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4C82ED'}
                        onBlur={(e) => e.target.style.borderColor = formData.email ? '#4C82ED' : '#6B7280'}
                        required
                    />
                </div>

                {/* Username Input */}
                <div>
                    <input
                        type="text"
                        name="username"
                        placeholder="Enter Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-200"
                        style={{
                            borderColor: formData.username ? '#4C82ED' : '#6B7280'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4C82ED'}
                        onBlur={(e) => e.target.style.borderColor = formData.username ? '#4C82ED' : '#6B7280'}
                        required
                    />
                </div>

                {/* Password Input */}
                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-200"
                        style={{
                            borderColor: formData.password ? '#4C82ED' : '#6B7280'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4C82ED'}
                        onBlur={(e) => e.target.style.borderColor = formData.password ? '#4C82ED' : '#6B7280'}
                        required
                    />
                </div>

                {/* Confirm Password Input */}
                <div>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none transition-all duration-200"
                        style={{
                            borderColor: formData.confirmPassword ? '#4C82ED' : '#6B7280'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#4C82ED'}
                        onBlur={(e) => e.target.style.borderColor = formData.confirmPassword ? '#4C82ED' : '#6B7280'}
                        required
                    />
                </div>

                {/* Sign Up Button */}
                <button
                    type="submit"
                    className="w-full bg-[#4C82ED] hover:bg-[#3d6bdc] text-white py-3 rounded-lg font-medium transition-colors"
                >
                    SIGN UP
                </button>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-3">
                    <input
                        type="checkbox"
                        id="terms-signup"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 bg-[#2a3142] border border-synqit-border rounded"
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

    const handleLoginSubmit = (data: any) => {
        console.log('Login form submitted:', data)
    }

    const handleSignUpSubmit = (data: any) => {
        console.log('Sign up form submitted:', data)
    }

    return (
        <AuthLayout>
            <div className="w-full max-w-md md:max-w-lg">
                {/* Tab Navigation */}
                <div className="flex mb-8 bg-transparent border border-synqit-border rounded-full p-1">
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-3 px-6 rounded-full font-medium transition-all duration-300 ${activeTab === 'login'
                            ? 'bg-[#4C82ED] text-white shadow-lg'
                            : 'bg-transparent text-gray-400 hover:text-white'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setActiveTab('signup')}
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
                        <LoginForm onSubmit={handleLoginSubmit} />
                    ) : (
                        <SignUpForm onSubmit={handleSignUpSubmit} />
                    )}

                    {/* Social Login Section - Shared between both forms */}
                    <SocialLoginSection />
                </div>
            </div>
        </AuthLayout>
    )
}