// components/onboarding/onboarding-popup.tsx
// 'use client'

import { useState, useEffect } from 'react'
import { X, User, Target } from 'lucide-react'

interface OnboardingPopupProps {
    isOpen: boolean
    onClose: () => void
    onSetupProfile: () => void
    onMaybeLater: () => void
}

export function OnboardingPopup({ isOpen, onClose, onSetupProfile, onMaybeLater }: OnboardingPopupProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-700/50 rounded-3xl p-8 mx-4 max-w-lg w-full shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Profile Setup Visual */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        {/* Main profile window */}
                        <div className="bg-slate-800/60 backdrop-blur border border-slate-600/50 rounded-2xl p-6 w-80">
                            {/* Progress bar */}
                            <div className="mb-6">
                                <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full w-1/3 transition-all duration-1000"></div>
                                </div>
                            </div>

                            {/* Profile tags */}
                            <div className="flex gap-2 mb-4">
                                <div className="flex items-center gap-2 bg-slate-700/50 rounded-full px-3 py-1.5 text-sm">
                                    <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                                        <User className="w-3 h-3 text-slate-300" />
                                    </div>
                                    <span className="text-slate-300">Styla</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-700/50 rounded-full px-3 py-1.5 text-sm">
                                    <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                                        <Target className="w-3 h-3 text-slate-300" />
                                    </div>
                                    <span className="text-slate-300">TechExplore</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-700/50 rounded-full px-3 py-1.5 text-sm">
                                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">T</span>
                                    </div>
                                    <span className="text-slate-300">Techtest</span>
                                </div>
                            </div>

                            {/* Profile section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-slate-600 rounded h-3 w-32 mb-1"></div>
                                        <div className="bg-slate-700 rounded h-2 w-24"></div>
                                    </div>
                                </div>

                                <div className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2 px-4 rounded-lg text-center cursor-pointer">
                                    Profile
                                </div>
                            </div>
                        </div>

                        {/* Floating completion badge */}
                        <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg animate-bounce">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Set Up Your Profile for Better Matches!
                    </h2>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        Complete your profile to get tailored AI recommendations and better partnership opportunities. A well-detailed profile helps others understand your strengths, increasing your chances of successful collaborations.
                    </p>

                    {/* Benefits list */}
                    <div className="space-y-3 text-left">
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Add your project details & interests</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Highlight your expertise & services</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Improve visibility in matchmaking & search</span>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onSetupProfile}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                    >
                        Set Up Profile Now
                    </button>
                    <button
                        onClick={onMaybeLater}
                        className="w-full text-slate-400 hover:text-white font-medium py-3 px-6 rounded-xl transition-colors hover:bg-slate-800/50"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    )
}

// Hook for managing onboarding state
export function useOnboarding() {
    const [showProfileSetup, setShowProfileSetup] = useState(false)
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

    useEffect(() => {
        // Check if user has seen onboarding before
        const seen = localStorage.getItem('synqit_onboarding_seen')
        setHasSeenOnboarding(seen === 'true')
    }, [])

    const startOnboarding = () => {
        if (!hasSeenOnboarding) {
            setShowProfileSetup(true)
        }
    }

    const handleSetupProfile = () => {
        setShowProfileSetup(false)
        localStorage.setItem('synqit_onboarding_seen', 'true')
        setHasSeenOnboarding(true)
        // Navigate to profile setup page - adjust this route as needed
        window.location.href = '/dashboard/profile/setup'
    }

    const handleMaybeLater = () => {
        setShowProfileSetup(false)
        localStorage.setItem('synqit_onboarding_seen', 'true')
        setHasSeenOnboarding(true)
    }

    const handleClose = () => {
        setShowProfileSetup(false)
    }

    return {
        showProfileSetup,
        startOnboarding,
        handleSetupProfile,
        handleMaybeLater,
        handleClose,
        hasSeenOnboarding
    }
}