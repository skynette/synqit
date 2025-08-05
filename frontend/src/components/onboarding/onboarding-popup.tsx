// components/onboarding/onboarding-popup.tsx
// 'use client'

import { useState, useEffect } from 'react'
import { X, User, Target } from 'lucide-react'
import Image from 'next/image'

interface OnboardingPopupProps {
    isOpen: boolean
    onClose: () => void
    onSetupProfile: () => void
    onMaybeLater: () => void
}

export function OnboardingPopup({ isOpen, onClose, onSetupProfile, onMaybeLater }: OnboardingPopupProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center mt-20">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-700/50 rounded-3xl p-8 mx-4 max-w-xl w-full shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Profile Setup Visual */}
                <div className="relative w-full h-64 md:h-80">
                    <Image
                        src={'/images/how-it-works-1.png'}
                        alt={'How Synqit Works'}
                        fill
                        className="object-contain"
                        priority={true}
                    />
                </div>

                {/* Content */}
                <div className="mb-8">
                    <h2 className="text-center text-3xl font-bold text-white mb-4">
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
                <div className="flex flex-col md:flex-row gap-3">
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
        // Navigate to onboarding page
        window.location.href = '/dashboard/profile'
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