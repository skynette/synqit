"use client"

import Link from "next/link"
import { SynqitLogo } from "@/components/ui/synqit-logo"

const navigationItems = [
    { name: "About", href: "/about" },
    { name: "Why Synqit", href: "/why-synqit" },
    { name: "How Synqit work", href: "/how-synqit-work" },
    { name: "Testimonial", href: "/testimonial" },
    { name: "Pricing", href: "/pricing" },
]

export function Navbar() {
    return (
        <>
            {/* Desktop Navbar - Island Style */}
            <nav className="hidden md:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[80%] max-w-[1193px] mx-auto rounded-full">
                <div className="bg-[#1a1f2e]/90 backdrop-blur-md border border-synqit-border rounded-full px-6 py-1 shadow-2xl">
                    <div className="flex items-center justify-center space-x-8 w-full">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 min-w-0">
                            <SynqitLogo className="w-20 md:w-24 lg:w-28 xl:w-32 min-w-0" />
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex-1 flex items-center justify-center space-x-6 min-w-0">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* Login Button with Gradient Border */}
                        <button
                            className="w-fit bg-black/50 backdrop-blur-sm border border-blue-500 text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 px-8 py-2.5 rounded-full font-medium uppercase tracking-[0.2em] text-sm relative overflow-hidden group"
                            style={{
                                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.1)'
                            }}
                            type="button"
                        >
                            <span className="relative z-10">LOGIN</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navbar */}
            <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0f1c]/95 backdrop-blur-md border-b border-synqit-border">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Hamburger Menu */}
                        <button className="text-white p-2">
                            <div className="grid grid-cols-3 gap-1 w-6 h-6">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm" />
                                ))}
                            </div>
                        </button>
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <SynqitLogo className="" />
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    )
}
