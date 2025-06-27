"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { BackgroundPattern } from "@/components/ui/background-pattern"
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
        href: "/dashboard/explore",
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
        const currentItem = dashboardNavItems.find(item => 
            pathname === item.href || (item.href !== '/dashboard/explore' && pathname.startsWith(item.href))
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
                            const isActive = pathname === item.href || (item.href !== '/dashboard/explore' && pathname.startsWith(item.href))
                            
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 group ${
                                            isActive
                                                ? 'bg-synqit-primary text-synqit-primary-foreground shadow-lg'
                                                : 'text-white/80 hover:bg-synqit-primary/80 hover:text-white hover:shadow-md'
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
                <header className="sticky top-0 z-30 bg-synqit-surface/90 backdrop-blur-md border-b border-synqit-border">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {/* Mobile menu button */}
                                <button className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-synqit-accent/20 rounded-lg transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                                <h1 className="text-2xl font-bold text-white">{getPageTitle()}</h1>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                {/* Notifications */}
                                <button className="p-2 text-white/80 hover:text-white hover:bg-synqit-accent/20 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V7a4 4 0 00-8 0v5l-5 5h5m7 0a3 3 0 11-6 0" />
                                    </svg>
                                </button>

                                {/* Search */}
                                <div className="relative hidden md:block">
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="w-64 pl-10 pr-4 py-2 bg-synqit-input border border-synqit-border rounded-lg text-white placeholder:text-synqit-muted-foreground focus:outline-none focus:ring-2 focus:ring-synqit-primary focus:border-transparent"
                                    />
                                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-synqit-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
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