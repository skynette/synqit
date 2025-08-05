'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  useUserProfile, 
  useCompanyProfile, 
  useUpdateUserProfile, 
  useUpdateCompanyProfile, 
  useChangePassword, 
  useToggle2FA 
} from "@/hooks/use-profile"

export default function ProfilePage() {
    // API hooks
    const { data: userProfile, isLoading: userLoading } = useUserProfile()
    const { data: companyProfile, isLoading: companyLoading } = useCompanyProfile()
    const updateUserProfile = useUpdateUserProfile()
    const updateCompanyProfile = useUpdateCompanyProfile()
    const changePassword = useChangePassword()
    const toggle2FA = useToggle2FA()

    // Local state
    const [activeTab, setActiveTab] = useState<"detail" | "security">("security")
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })
    const [projectData, setProjectData] = useState({
        projectName: "",
        projectLink: "",
        description: "",
        category: "",
        blockchain: "",
        partnershipType: "",
        teamEmail: "",
        officialEmail: "",
        websiteLink: "",
        facebook: "",
        twitter: "",
        discord: "",
        phoneCountryCode: "🇳🇬 +234",
        phoneNumber: "",
        collaborationPreferences: "Open to all"
    })
    const [notifications, setNotifications] = useState({
        reports: true,
        sound: true,
        vibrations: false
    })
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Initialize project data when company profile loads
    useEffect(() => {
        if (companyProfile) {
            setProjectData(prev => ({
                ...prev,
                projectName: companyProfile.name || "",
                projectLink: companyProfile.name?.toLowerCase().replace(/\s+/g, '-') || "",
                description: companyProfile.description || "",
                category: companyProfile.projectType || "",
                blockchain: companyProfile.blockchainPreferences?.[0]?.blockchain || "",
                partnershipType: "Strategic",
                teamEmail: companyProfile.contactEmail || "",
                officialEmail: companyProfile.contactEmail || "",
                websiteLink: companyProfile.website || "",
                facebook: companyProfile.facebookPage || "",
                twitter: companyProfile.twitterHandle || "",
                discord: companyProfile.discordServer || "",
                phoneCountryCode: companyProfile.phoneCountryCode || "🇳🇬 +234",
                phoneNumber: companyProfile.phoneNumber || "",
                collaborationPreferences: companyProfile.isLookingForPartners ? "Open to all" : "Closed"
            }))
        }
    }, [companyProfile])

    // Loading state
    if (userLoading || companyLoading) {
        return <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    }

    const isPasswordValid = passwordData.newPassword.length >= 8 &&
        /[A-Z]/.test(passwordData.newPassword) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword) &&
        /[0-9]/.test(passwordData.newPassword)

    const passwordsMatch = passwordData.newPassword === passwordData.confirmPassword && passwordData.confirmPassword.length > 0

    // Handler functions
    const handlePasswordChange = async () => {
        if (!isPasswordValid || !passwordsMatch) return
        
        try {
            await changePassword.mutateAsync({
                currentPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            })
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" })
        } catch (error) {
            console.error('Password change failed:', error)
        }
    }

    const handleToggle2FA = async () => {
        try {
            await toggle2FA.mutateAsync({ enabled: !userProfile?.twoFactorEnabled })
        } catch (error) {
            console.error('2FA toggle failed:', error)
        }
    }

    const handleSaveProjectDetails = async () => {
        try {
            await updateCompanyProfile.mutateAsync({
                name: projectData.projectName,
                description: projectData.description,
                projectType: projectData.category as any,
                contactEmail: projectData.teamEmail,
                website: projectData.websiteLink,
                twitterHandle: projectData.twitter,
                discordServer: projectData.discord,
                facebookPage: projectData.facebook,
                phoneNumber: projectData.phoneNumber,
                phoneCountryCode: projectData.phoneCountryCode,
                isLookingForPartners: projectData.collaborationPreferences === "Open to all"
            })
        } catch (error) {
            console.error('Project details save failed:', error)
        }
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6">
                <button className="flex items-center space-x-2 text-synqit-muted-foreground hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-synqit-surface">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Back</span>
                </button>
            </div>

            {/* Page Title and Settings Icon */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
                <button className="p-2.5 bg-synqit-surface hover:bg-synqit-surface/80 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-synqit-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-8 border-b border-synqit-border mb-8">
                <button
                    onClick={() => setActiveTab("detail")}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "detail"
                        ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-synqit-primary"
                        : "text-synqit-muted-foreground hover:text-white"
                        }`}
                >
                    Project Detail
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === "security"
                        ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-synqit-primary"
                        : "text-synqit-muted-foreground hover:text-white"
                        }`}
                >
                    Security & Account Management
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === "security" && (
                <div className="space-y-0">
                    {/* Security Header with Save Button */}
                    <div className="grid grid-cols-12 gap-8 pb-8 border-b border-synqit-border">
                        <div className="col-span-4">
                            <h2 className="text-xl font-semibold text-white">Security & Account Management</h2>
                            <p className="text-sm text-synqit-muted-foreground mt-1">Set up your security & Account Management</p>
                        </div>
                        <div className="col-span-8 flex justify-end items-start">
                            <button className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Change Password Section */}
                    <div className="grid grid-cols-12 gap-8 py-8 border-b border-gray-800">
                        <div className="col-span-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-base font-medium text-white">Change Password</h3>
                                <svg className="w-4 h-4 text-synqit-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-sm text-synqit-muted-foreground">Change/Setup your password</p>
                        </div>
                        <div className="col-span-8">
                            <div className="space-y-5 max-w-lg">
                                {/* Old Password */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Old Password</label>
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
                                    <label className="block text-sm font-medium text-white mb-2">New Password</label>
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
                                            <div className={`h-1 w-full rounded-full bg-synqit-border overflow-hidden`}>
                                                <div
                                                    className={`h-full transition-all duration-300 ${isPasswordValid ? 'bg-green-500 w-full' : 'bg-yellow-500 w-1/2'
                                                        }`}
                                                />
                                            </div>
                                            <p className="text-xs text-synqit-muted-foreground mt-2">
                                                Password must contain at least Capital letter, Special character & Number
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
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
                                        <p className="text-xs text-destructive mt-2">Does not match the new password</p>
                                    )}
                                </div>

                                <button 
                                    onClick={handlePasswordChange}
                                    disabled={!isPasswordValid || !passwordsMatch || changePassword.isPending}
                                    className="w-full bg-synqit-primary hover:bg-synqit-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    {changePassword.isPending ? 'Updating...' : 'Update Password'}
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
                                onClick={handleToggle2FA}
                                disabled={toggle2FA.isPending}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${userProfile?.twoFactorEnabled ? 'bg-synqit-primary' : 'bg-synqit-muted'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${userProfile?.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
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
                            <button className="w-full max-w-lg bg-destructive hover:bg-destructive/80 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                                Delete Account
                            </button>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex justify-end space-x-4 pt-8">
                        <button className="bg-synqit-muted hover:bg-synqit-muted/80 text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                            <span>Cancel</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <button className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-6 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-colors">
                            <span>Save Settings</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {activeTab === "detail" && (
                <div className="space-y-0">
                    {/* Project Details Header with Save Button */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-8 border-b border-synqit-border">
                        <div className="col-span-1 md:col-span-4">
                            <h2 className="text-lg md:text-xl font-semibold text-white">Project Details</h2>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground mt-1">You can change your Project details here seamlessly.</p>
                        </div>
                        <div className="col-span-1 md:col-span-8 flex justify-end items-start">
                            <button 
                                onClick={handleSaveProjectDetails}
                                disabled={updateCompanyProfile.isPending}
                                className="bg-synqit-primary hover:bg-synqit-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-colors"
                            >
                                {updateCompanyProfile.isPending ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>

                    {/* Project Name Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-800">
                        <div className="col-span-1 md:col-span-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-sm md:text-base font-medium text-white">Project Name</h3>
                                <svg className="w-4 h-4 text-synqit-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground">This is the Project Name that will be visible for everyone</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                            <div className="space-y-4 md:space-y-5 w-full md:max-w-lg">
                                <div>
                                    <input
                                        type="text"
                                        value={projectData.projectName}
                                        onChange={(e) => setProjectData(prev => ({ ...prev, projectName: e.target.value }))}
                                        className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 rounded-full text-sm md:text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter project name"
                                    />
                                </div>
                                <div className="flex">
                                    <div className="px-2 md:px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-l-full text-synqit-muted-foreground text-xs md:text-sm flex items-center whitespace-nowrap">
                                        https://synqit.com/
                                    </div>
                                    <input
                                        type="text"
                                        value={projectData.projectLink}
                                        onChange={(e) => setProjectData(prev => ({ ...prev, projectLink: e.target.value }))}
                                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 border-l-0 rounded-r-full text-sm md:text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="project-link"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Description Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-800">
                        <div className="col-span-1 md:col-span-4">
                            <h3 className="text-sm md:text-base font-medium text-white">Project Description</h3>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground mt-1">This will be your main story. Keep it very very long</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                            <div className="w-full md:max-w-lg">
                                <textarea
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 rounded-2xl text-sm md:text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows={6}
                                    placeholder="Enter project description"
                                    value={projectData.description}
                                    onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                                />
                                <div className="mt-2 text-right">
                                    <span className="text-xs md:text-sm text-synqit-muted-foreground">{projectData.description.length}/5000</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Industry/Category Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-800">
                        <div className="col-span-1 md:col-span-4">
                            <h3 className="text-sm md:text-base font-medium text-white">Industry/Category</h3>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground mt-1">Choose project category (Multi select)</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                            <div className="w-full md:max-w-lg flex flex-col sm:flex-row gap-3">
                                <select
                                    value={projectData.category}
                                    onChange={(e) => setProjectData(prev => ({ ...prev, category: e.target.value }))}
                                    className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 rounded-full text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Category</option>
                                    <option value="AI">AI</option>
                                    <option value="DEFI">DeFi</option>
                                    <option value="GAMEFI">GameFi</option>
                                    <option value="NFT">NFT</option>
                                    <option value="DAO">DAO</option>
                                    <option value="WEB3_TOOLS">Web3 Tools</option>
                                    <option value="INFRASTRUCTURE">Infrastructure</option>
                                    <option value="METAVERSE">Metaverse</option>
                                    <option value="SOCIAL">Social</option>
                                    <option value="OTHER">Other</option>
                                </select>
                                <select
                                    value={projectData.blockchain}
                                    onChange={(e) => setProjectData(prev => ({ ...prev, blockchain: e.target.value }))}
                                    className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 rounded-full text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Blockchain</option>
                                    <option value="ETHEREUM">Ethereum</option>
                                    <option value="BITCOIN">Bitcoin</option>
                                    <option value="SOLANA">Solana</option>
                                    <option value="POLYGON">Polygon</option>
                                    <option value="BINANCE_SMART_CHAIN">Binance Smart Chain</option>
                                    <option value="AVALANCHE">Avalanche</option>
                                    <option value="CARDANO">Cardano</option>
                                    <option value="POLKADOT">Polkadot</option>
                                    <option value="COSMOS">Cosmos</option>
                                    <option value="ARBITRUM">Arbitrum</option>
                                    <option value="OPTIMISM">Optimism</option>
                                    <option value="BASE">Base</option>
                                    <option value="OTHER">Other</option>
                                </select>
                                <select
                                    value={projectData.partnershipType}
                                    onChange={(e) => setProjectData(prev => ({ ...prev, partnershipType: e.target.value }))}
                                    className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 rounded-full text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option>Partnership Type</option>
                                    <option>Strategic</option>
                                    <option>Technical</option>
                                    <option>Marketing</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Project Profile Picture Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-800">
                        <div className="col-span-1 md:col-span-4">
                            <h3 className="text-sm md:text-base font-medium text-white">Project Profile Picture</h3>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground mt-1">This is will be your card profile picture</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                            <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0 w-full md:max-w-lg">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1a1f2e] border-2 border-dashed border-gray-700 flex items-center justify-center">
                                    <svg className="w-10 h-10 md:w-12 md:h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <p className="text-xs md:text-sm text-synqit-primary mb-1">Browse your file to upload!</p>
                                    <p className="text-[10px] md:text-xs text-synqit-muted-foreground mb-3">Supported Format: SVG, JPG, PNG (10mb each)</p>
                                    <button className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors flex items-center space-x-2 mx-auto sm:mx-0">
                                        <span>Browse File</span>
                                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Project Banner Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-800">
                        <div className="col-span-1 md:col-span-4">
                            <h3 className="text-sm md:text-base font-medium text-white">Project Banner</h3>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground mt-1">This is will be your card cover profile</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                            <div className="w-full md:max-w-lg">
                                <div className="w-full h-32 md:h-40 bg-[#1a1f2e] border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center">
                                    <p className="text-xs md:text-sm text-synqit-primary mb-1">Browse your file to upload!</p>
                                    <p className="text-[10px] md:text-xs text-synqit-muted-foreground mb-3">Supported Format: SVG, JPG, PNG (10mb each)</p>
                                    <button className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors flex items-center space-x-2">
                                        <span>Browse File</span>
                                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team & Collaboration Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-800">
                        <div className="col-span-1 md:col-span-4">
                            <h3 className="text-sm md:text-base font-medium text-white">Team & Collaboration</h3>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground mt-1">Set up Team & Collaboration</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                            <div className="w-full md:max-w-lg">
                                <div className="flex">
                                    <div className="px-2 md:px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-l-full text-synqit-muted-foreground text-xs md:text-sm flex items-center whitespace-nowrap">
                                        Email Address
                                    </div>
                                    <input
                                        type="email"
                                        value={projectData.teamEmail}
                                        onChange={(e) => setProjectData(prev => ({ ...prev, teamEmail: e.target.value }))}
                                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 border-l-0 rounded-r-full text-sm md:text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Collaboration Preferences Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-800">
                        <div className="col-span-1 md:col-span-4">
                            <h3 className="text-sm md:text-base font-medium text-white">Collaboration Preferences</h3>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground mt-1">Collaboration preference (Multi select)</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                            <div className="w-full md:max-w-lg">
                                <select
                                    value={projectData.collaborationPreferences}
                                    onChange={(e) => setProjectData(prev => ({ ...prev, collaborationPreferences: e.target.value }))}
                                    className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 rounded-full text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option>Collaboration Preferences</option>
                                    <option>Open to all</option>
                                    <option>By invitation</option>
                                    <option>Closed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Official Email Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-800">
                        <div className="col-span-1 md:col-span-4">
                            <h3 className="text-sm md:text-base font-medium text-white">Official Email</h3>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground mt-1">Enter your website/portfolio Link</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                            <div className="w-full md:max-w-lg">
                                <div className="flex">
                                    <div className="px-2 md:px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-l-full text-synqit-muted-foreground text-xs md:text-sm flex items-center whitespace-nowrap">
                                        Email Address
                                    </div>
                                    <input
                                        type="email"
                                        value={projectData.officialEmail}
                                        onChange={(e) => setProjectData(prev => ({ ...prev, officialEmail: e.target.value }))}
                                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 border-l-0 rounded-r-full text-sm md:text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="email@example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Website / Portfolio Link Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-800">
                        <div className="col-span-1 md:col-span-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-sm md:text-base font-medium text-white">Website / Portfolio Link</h3>
                                <svg className="w-4 h-4 text-synqit-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground">Enter your website/portfolio Link</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                            <div className="w-full md:max-w-lg">
                                <div className="flex">
                                    <div className="px-2 md:px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-l-full text-synqit-muted-foreground text-xs md:text-sm flex items-center">
                                        https://
                                    </div>
                                    <input
                                        type="text"
                                        value={projectData.websiteLink}
                                        onChange={(e) => setProjectData(prev => ({ ...prev, websiteLink: e.target.value }))}
                                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 border-l-0 rounded-r-full text-sm md:text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="example.com"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Links Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-800">
                        <div className="col-span-1 md:col-span-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-sm md:text-base font-medium text-white">Social Media Links</h3>
                                <svg className="w-4 h-4 text-synqit-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground">Links for your social media.</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                            <div className="w-full md:max-w-lg space-y-4">
                                <div className="flex">
                                    <div className="px-2 md:px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-l-full text-synqit-muted-foreground text-xs md:text-sm flex items-center whitespace-nowrap">
                                        facebook.com/
                                    </div>
                                    <input
                                        type="text"
                                        value={projectData.facebook}
                                        onChange={(e) => setProjectData(prev => ({ ...prev, facebook: e.target.value }))}
                                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 border-l-0 rounded-r-full text-sm md:text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="username"
                                    />
                                </div>
                                <div className="flex">
                                    <div className="px-2 md:px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-l-full text-synqit-muted-foreground text-xs md:text-sm flex items-center whitespace-nowrap">
                                        twitter.com/
                                    </div>
                                    <input
                                        type="text"
                                        value={projectData.twitter}
                                        onChange={(e) => setProjectData(prev => ({ ...prev, twitter: e.target.value }))}
                                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 border-l-0 rounded-r-full text-sm md:text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="username"
                                    />
                                </div>
                                <div className="flex">
                                    <div className="px-2 md:px-3 py-2 bg-[#1a1f2e] border border-gray-700 rounded-l-full text-synqit-muted-foreground text-xs md:text-sm flex items-center whitespace-nowrap">
                                        discord.com/
                                    </div>
                                    <input
                                        type="text"
                                        value={projectData.discord}
                                        onChange={(e) => setProjectData(prev => ({ ...prev, discord: e.target.value }))}
                                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 border-l-0 rounded-r-full text-sm md:text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="username"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phone Number Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-800">
                        <div className="col-span-1 md:col-span-4">
                            <h3 className="text-sm md:text-base font-medium text-white">Phone Number</h3>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground mt-1">Enter Phone number</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                            <div className="w-full md:max-w-lg">
                                <div className="flex">
                                    <div className="relative">
                                        <select
                                            value={projectData.phoneCountryCode}
                                            onChange={(e) => setProjectData(prev => ({ ...prev, phoneCountryCode: e.target.value }))}
                                            className="appearance-none px-3 md:px-4 py-2.5 md:py-3 pr-8 md:pr-10 bg-[#1a1f2e] border border-gray-700 rounded-l-full text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option>🇳🇬 +234</option>
                                            <option>🇺🇸 +1</option>
                                            <option>🇬🇧 +44</option>
                                        </select>
                                        <svg className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                    <input
                                        type="tel"
                                        value={projectData.phoneNumber}
                                        onChange={(e) => setProjectData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                        className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-[#1a1f2e] border border-gray-700 border-l-0 rounded-r-full text-sm md:text-base text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="(000) 000-0000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-6 md:py-8 border-b border-gray-800">
                        <div className="col-span-1 md:col-span-4">
                            <h3 className="text-sm md:text-base font-medium text-white">Notifications</h3>
                            <p className="text-xs md:text-sm text-synqit-muted-foreground mt-1">This is where you'll receive notifications</p>
                        </div>
                        <div className="col-span-1 md:col-span-8">
                            <div className="w-full md:max-w-lg space-y-5 md:space-y-6">
                                {/* Reports */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs md:text-sm font-medium text-white flex items-center gap-2">
                                            <button
                                                onClick={() => setNotifications(prev => ({ ...prev, reports: !prev.reports }))}
                                                className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center transition-colors ${notifications.reports
                                                    ? 'bg-synqit-primary border-synqit-primary'
                                                    : 'bg-transparent border-gray-600'
                                                    }`}
                                            >
                                                {notifications.reports && (
                                                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                            Reports
                                        </h4>
                                        <p className="text-[10px] md:text-xs text-synqit-muted-foreground ml-6 md:ml-7">Enable reports notifications</p>
                                    </div>
                                </div>

                                {/* Sound */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs md:text-sm font-medium text-white flex items-center gap-2">
                                            <button
                                                onClick={() => setNotifications(prev => ({ ...prev, sound: !prev.sound }))}
                                                className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center transition-colors ${notifications.sound
                                                    ? 'bg-synqit-primary border-synqit-primary'
                                                    : 'bg-transparent border-gray-600'
                                                    }`}
                                            >
                                                {notifications.sound && (
                                                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                            Sound
                                        </h4>
                                        <p className="text-[10px] md:text-xs text-synqit-muted-foreground ml-6 md:ml-7">Enable sound notifications</p>
                                    </div>
                                </div>

                                {/* Vibrations */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs md:text-sm font-medium text-white flex items-center gap-2">
                                            <button
                                                onClick={() => setNotifications(prev => ({ ...prev, vibrations: !prev.vibrations }))}
                                                className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center transition-colors ${notifications.vibrations
                                                    ? 'bg-synqit-primary border-synqit-primary'
                                                    : 'bg-transparent border-gray-600'
                                                    }`}
                                            >
                                                {notifications.vibrations && (
                                                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                            Vibrations
                                        </h4>
                                        <p className="text-[10px] md:text-xs text-synqit-muted-foreground ml-6 md:ml-7">Enable vibrations effect</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:space-x-4 pt-6 md:pt-8">
                        <button className="bg-synqit-muted hover:bg-synqit-muted/80 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium flex items-center justify-center space-x-2 transition-colors text-xs md:text-base">
                            <span>Cancel</span>
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <button 
                            onClick={handleSaveProjectDetails}
                            disabled={updateCompanyProfile.isPending}
                            className="bg-synqit-primary hover:bg-synqit-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full font-medium flex items-center justify-center space-x-2 transition-colors text-xs md:text-base"
                        >
                            <span>{updateCompanyProfile.isPending ? 'Saving...' : 'Save Settings'}</span>
                            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}