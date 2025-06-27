'use client'

import { useState } from "react"
import Link from "next/link"

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"detail" | "security">("security")
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

    const isPasswordValid = passwordData.newPassword.length >= 8 && 
        /[A-Z]/.test(passwordData.newPassword) && 
        /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) && 
        /[0-9]/.test(passwordData.newPassword)

    const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword && passwordData.confirmPassword.length > 0

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-[#1a1f2e]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Back</span>
                </button>
            </div>

            {/* Page Title and Settings Icon */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                <button className="p-2.5 bg-[#1a1f2e] hover:bg-[#252b3b] rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-8 border-b border-gray-800 mb-8">
                <button
                    onClick={() => setActiveTab("detail")}
                    className={`pb-4 text-sm font-medium transition-colors relative ${
                        activeTab === "detail"
                            ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
                            : "text-gray-500 hover:text-gray-300"
                    }`}
                >
                    Project Detail
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={`pb-4 text-sm font-medium transition-colors relative ${
                        activeTab === "security"
                            ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-500"
                            : "text-gray-500 hover:text-gray-300"
                    }`}
                >
                    Security & Account Management
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "security" && (
                <div className="space-y-0">
                    {/* Security Header with Save Button */}
                    <div className="grid grid-cols-12 gap-8 pb-8 border-b border-gray-800">
                        <div className="col-span-4">
                            <h2 className="text-xl font-semibold text-white">Security & Account Management</h2>
                            <p className="text-sm text-gray-500 mt-1">Set up your security & Account Management</p>
                        </div>
                        <div className="col-span-8 flex justify-end items-start">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Change Password Section */}
                    <div className="grid grid-cols-12 gap-8 py-8 border-b border-gray-800">
                        <div className="col-span-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-base font-medium text-white">Change Password</h3>
                                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-500">Change/Setup your password</p>
                        </div>
                        <div className="col-span-8">
                            <div className="space-y-5 max-w-lg">
                                {/* Old Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Old Password</label>
                                    <div className="relative">
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                                            className="w-full px-4 py-3 bg-[#1a1f2e] border border-gray-700 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                            placeholder="••••••••••••••••"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowOldPassword(!showOldPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                        >
                                            {showOldPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                            className="w-full px-4 py-3 bg-[#1a1f2e] border border-gray-700 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                            placeholder="••••••••••••••••"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                        >
                                            {showNewPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {passwordData.newPassword && (
                                        <div className="mt-3">
                                            <div className={`h-1 w-full rounded-full bg-gray-700 overflow-hidden`}>
                                                <div 
                                                    className={`h-full transition-all duration-300 ${
                                                        isPasswordValid ? 'bg-green-500 w-full' : 'bg-yellow-500 w-1/2'
                                                    }`}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Password must contain at least Capital letter, Special character & Number
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                            className="w-full px-4 py-3 bg-[#1a1f2e] border border-gray-700 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                                            placeholder="••••••••••••••••"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {passwordData.confirmPassword && !passwordsMatch && (
                                        <p className="text-xs text-red-500 mt-2">Does not match the new password</p>
                                    )}
                                </div>

                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="grid grid-cols-12 gap-8 py-8 border-b border-gray-800">
                        <div className="col-span-4">
                            <h3 className="text-base font-medium text-white">Two-Factor Authentication (2FA)</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Add a Two-Factor Authentication (2FA) for better security protection on your account
                            </p>
                        </div>
                        <div className="col-span-8 flex items-start">
                            <button
                                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-700'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Delete Account */}
                    <div className="grid grid-cols-12 gap-8 py-8 border-b border-gray-800">
                        <div className="col-span-4">
                            <h3 className="text-base font-medium text-white">Delete Account</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                This will permanently delete your account including partnerships and collaborations will be lost.
                            </p>
                        </div>
                        <div className="col-span-8">
                            <button className="w-full max-w-lg bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex justify-end space-x-4 pt-8">
                        <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                            <span>Cancel</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                            <span>Save Settings</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {activeTab === "detail" && (
                <div className="space-y-6">
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-4">
                            <h2 className="text-xl font-semibold text-white">Project Detail</h2>
                            <p className="text-sm text-gray-500 mt-1">Configure your project settings</p>
                        </div>
                        <div className="col-span-8">
                            <p className="text-gray-400">Project detail settings will be available here.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}