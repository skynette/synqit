'use client'

import Link from "next/link"
import { SynqitLogo } from "@/components/ui/synqit-logo"
import { BackgroundPattern } from "@/components/ui/background-pattern"

interface AuthLayoutProps {
    children: React.ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen relative">
            <BackgroundPattern />
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

            <main className="relative z-10 pt-20 md:pt-0 min-h-screen flex items-center justify-center p-4">
                {children}
            </main>
        </div>
    )
}