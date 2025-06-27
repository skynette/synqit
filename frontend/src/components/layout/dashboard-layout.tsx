"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { NotificationDrawer } from "@/components/ui/notification-drawer"
import type React from "react"

// Dashboard navigation items interface
interface DashboardNavItem {
    name: string
    href: string
    icon: React.ReactNode
    badge?: string
}

// Dashboard navigation items
const dashboardNavItems: DashboardNavItem[] = [
    {
        name: "Explore",
        href: "/dashboard",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
        )
    },
    {
        name: "Matchmaking & Requests",
        href: "/dashboard/matchmaking",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7.5h-3A1.5 1.5 0 0 0 14.04 8.37L11.5 16H14v6h6zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm-2 5.5H8.5l1.04-3.12c-.24-.66-.78-1.12-1.54-1.12S6.24 13.22 6 13.88L4.5 17H2v2h3.5l1.5-4.5L8.5 17h2v-1z"/>
            </svg>
        )
    },
    {
        name: "Partnership Approvals",
        href: "/dashboard/approvals",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
        )
    },
    {
        name: "Messages",
        href: "/dashboard/messages",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
        )
    },
    {
        name: "Pricing & Plan",
        href: "/dashboard/pricing",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
            </svg>
        ),
        badge: "6D left"
    }
]

interface DashboardLayoutProps {
    children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname()

    // Get page title based on current route
    const getPageTitle = () => {
        if (pathname.includes('/profile')) return 'Profile'
        
        const currentItem = dashboardNavItems.find(item => 
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        )
        return currentItem?.name || 'Dashboard'
    }

    return (
        <div className="min-h-screen relative">
            <BackgroundPattern />
            
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 w-64 h-screen transition-transform -translate-x-full lg:translate-x-0">
                <div className="h-full px-3 py-4 bg-synqit-surface/90 backdrop-blur-md border-r border-synqit-border">
                    {/* Header with Logo and Profile */}
                    <div className="flex items-center justify-between mb-8 px-4">
                        <div className="flex items-center space-x-2">
                            <Link href="/" className="flex items-center space-x-2">
                                <Image 
                                    src="/icons/synqit.png" 
                                    alt="Synqit Logo" 
                                    width={32} 
                                    height={32} 
                                    className="rounded-lg"
                                />
                            </Link>
                            <div>
                                <div className="text-white font-semibold text-sm">Synqit</div>
                                <div className="text-synqit-muted-foreground text-xs">Verifying</div>
                            </div>
                        </div>
                        <Link
                            href="/dashboard/profile"
                            className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                        >
                            Profile
                        </Link>
                    </div>

                    {/* Navigation */}
                    <ul className="space-y-2 font-medium">
                        {dashboardNavItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                            
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                                            isActive
                                                ? 'bg-synqit-primary/20 text-white shadow-lg'
                                                : 'text-white/80 hover:bg-synqit-primary/20 hover:text-white hover:shadow-md'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <span className={`transition-colors ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                                                {item.icon}
                                            </span>
                                            <span className="ml-3 text-sm font-medium">{item.name}</span>
                                        </div>
                                        {item.badge && (
                                            <span className="bg-synqit-primary text-white text-xs px-2 py-1 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    {/* Logout section */}
                    <div className="absolute bottom-4 left-3 right-3">
                        <button className="w-full flex items-center p-3 rounded-lg text-white/80 hover:bg-synqit-accent/20 hover:text-white transition-all duration-200 group">
                            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium">Logout Synqit</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Header */}
                <header className="sticky top-0 z-30 bg-[#1a1f2e] border-b border-synqit-border">
                    <div className="px-6 py-3">
                        <div className="flex items-center justify-between">
                            {/* Left side - Platform Icons */}
                            <div className="flex items-center space-x-3">
                                {/* Mobile menu button */}
                                <button className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-synqit-accent/20 rounded-lg transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>

                                {/* Platform/Service Icons */}
                                <div className="hidden lg:flex items-center space-x-3">
                                    {/* Polkadot */}
                                    <button className="flex items-center space-x-2 bg-[#2a2f3e] hover:bg-[#3a3f4e] px-3 py-2 rounded-full transition-colors">
                                        <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 bg-white rounded-full opacity-80"></div>
                                        </div>
                                        <span className="text-white text-sm font-medium">Polkadot</span>
                                    </button>

                                    {/* The Graph */}
                                    <button className="flex items-center space-x-2 bg-[#2a2f3e] hover:bg-[#3a3f4e] px-3 py-2 rounded-full transition-colors">
                                        <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">G</span>
                                        </div>
                                        <span className="text-white text-sm font-medium">The Graph</span>
                                    </button>

                                    {/* Lens */}
                                    <button className="flex items-center space-x-2 bg-[#2a2f3e] hover:bg-[#3a3f4e] px-3 py-2 rounded-full transition-colors">
                                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        </div>
                                        <span className="text-white text-sm font-medium">Lens</span>
                                    </button>

                                    {/* Super Rare */}
                                    <button className="flex items-center space-x-2 bg-[#2a2f3e] hover:bg-[#3a3f4e] px-3 py-2 rounded-full transition-colors">
                                        <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 rounded flex items-center justify-center">
                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                                            </svg>
                                        </div>
                                        <span className="text-white text-sm font-medium">Super Rare</span>
                                    </button>

                                    {/* Another Platform */}
                                    <button className="flex items-center justify-center bg-[#2a2f3e] hover:bg-[#3a3f4e] w-10 h-10 rounded-full transition-colors">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* Page Title - visible on mobile */}
                                <h1 className="lg:hidden text-xl font-bold text-white">{getPageTitle()}</h1>
                            </div>
                            
                            {/* Right side - User Actions */}
                            <div className="flex items-center space-x-3">
                                {/* Home */}
                                <button className="p-2 text-white/60 hover:text-white hover:bg-[#2a2f3e] rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </button>

                                {/* Notifications */}
                                <NotificationDrawer>
                                    <button className="p-2 text-white/60 hover:text-white hover:bg-[#2a2f3e] rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V7a4 4 0 00-8 0v5l-5 5h5m7 0a3 3 0 11-6 0" />
                                        </svg>
                                    </button>
                                </NotificationDrawer>

                                {/* User Profile */}
                                <button className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all">
                                    <span className="text-white text-sm font-medium">U</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="relative z-10 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
} 