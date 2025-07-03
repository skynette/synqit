'use client'

import { AuthMiddleware } from '@/components/auth/auth-middleware'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AuthMiddleware requireAuth={true} requireEmailVerification={true}>
            <DashboardLayout>
                {children}
            </DashboardLayout>
        </AuthMiddleware>
    )
} 