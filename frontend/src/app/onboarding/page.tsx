'use client'

import { OnboardingPage } from '@/components/onboarding/onboarding-page'
import { AuthRequired } from '@/components/auth/auth-middleware'

export default function Onboarding() {
    return (
        <AuthRequired redirectTo="/auth">
            <OnboardingPage />
        </AuthRequired>
    )
}