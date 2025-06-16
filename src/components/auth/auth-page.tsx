'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SynqitLogo } from "@/components/ui/synqit-logo"
import { BackgroundPattern } from "@/components/ui/background-pattern"

// Auth Layout Component
interface AuthLayoutProps {
    children: React.ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen relative">
            <BackgroundPattern />
            {/* Desktop Navbar - Same as home page */}
            <nav className="hidden md:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[80%] max-w-[1193px] mx-auto rounded-full">
                <div className="bg-[#1a1f2e]/90 backdrop-blur-md border border-synqit-border rounded-full px-6 py-1 shadow-2xl">
                    <div className="flex items-center justify-center space-x-8 w-full">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 min-w-0">
                            <SynqitLogo className="w-20 md:w-24 lg:w-28 xl:w-32 min-w-0" />
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex-1 flex items-center justify-center space-x-6 min-w-0">
                            {['About', 'Why Synqit', 'How Synqit work', 'Testimonial', 'Pricing'].map((item) => (
                                <Link
                                    key={item}
                                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>

                        {/* Login Button */}
                        <button
                            className="w-fit bg-black/50 backdrop-blur-sm border border-blue-500 text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 px-8 py-2.5 rounded-full font-medium uppercase tracking-[0.2em] text-sm relative overflow-hidden group"
                            style={{
                                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.1)'
                            }}
                            type="button"
                        >
                            <span className="relative z-10">LOGIN</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#1a1f2e]/90 backdrop-blur-md border-b border-synqit-border">
                <div className="px-4 py-3 flex items-center justify-between">
                    {/* Hamburger Menu */}
                    <button className="text-white p-2">
                        <div className="grid grid-cols-3 gap-1 w-6 h-6">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm" />
                            ))}
                        </div>
                    </button>
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <SynqitLogo className="w-20" />
                    </Link>
                </div>
            </header>

            <main className="relative z-10 pt-20 md:pt-24 min-h-screen flex items-center justify-center p-4">
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
                    <span className="px-4 bg-[#1a1f2e] text-gray-400">Or continue with</span>
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
                        <g clip-path="url(#clip0_140_1159)">
                            <g clip-path="url(#clip1_140_1159)">
                                <g clip-path="url(#clip2_140_1159)">
                                    <path d="M22 16.6699H12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M18 12.6699L22 16.6699L18 20.6699" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
                        <g clip-path="url(#clip0_140_1159)">
                            <g clip-path="url(#clip1_140_1159)">
                                <g clip-path="url(#clip2_140_1159)">
                                    <path d="M22 16.6699H12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M18 12.6699L22 16.6699L18 20.6699" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
                        <span className="px-4 bg-[#1a1f2e] text-gray-400">Or</span>
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