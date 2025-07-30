'use client'

import { OnboardingPage } from '@/components/onboarding/onboarding-page'
import { AuthMiddleware } from '@/components/auth/auth-middleware'
import { useProject } from '@/hooks/use-project'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function OnboardingWrapper() {
    const { project, isProjectLoading } = useProject()
    const router = useRouter()

    // If user already has a project, redirect to dashboard
    useEffect(() => {
        if (!isProjectLoading && project) {
            router.replace('/dashboard')
        }
    }, [project, isProjectLoading, router])

    // Show loading while checking project status
    if (isProjectLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-[#4C82ED] border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white">Loading...</span>
                </div>
            </div>
        )
    }

    // If user has a project, don't render onboarding (redirect is in progress)
    if (project) {
        return null
    }

    // User doesn't have a project, show onboarding
    return <OnboardingPage />
}

export default function Onboarding() {
    return (
        <AuthMiddleware requireAuth={true} requireEmailVerification={true} redirectTo="/auth">
            <OnboardingWrapper />
        </AuthMiddleware>
    )
}