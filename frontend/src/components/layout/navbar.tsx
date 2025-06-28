"use client"

import Link from "next/link"
import { useState } from "react"
import { SynqitLogo } from "@/components/ui/synqit-logo"
import { 
    Drawer, 
    DrawerContent, 
    DrawerTrigger, 
    DrawerClose,
    DrawerHeader,
    DrawerTitle
} from "@/components/ui/drawer"

const navigationItems = [
    { name: "About", href: "/#about" },
    { name: "Why Synqit", href: "/#why-synqit" },
    { name: "How Synqit work", href: "/#how-synqit-work" },
    { name: "Testimonial", href: "/#testimonial" },
    { name: "Pricing", href: "/#pricing" },
]

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleMobileNavClick = () => {
        setMobileMenuOpen(false)
    }

    return (
        <>
            {/* Desktop Navbar - Island Style */}
            <nav className="hidden md:block fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[80%] max-w-[1193px] mx-auto rounded-full">
                <div className="bg-[#1a1f2e]/30 backdrop-blur-md border border-synqit-border rounded-full pl-4 pr-2 py-2 shadow-2xl">
                    <div className="flex items-center justify-center space-x-8 w-full">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 min-w-0">
                            <SynqitLogo className="w-16 md:w-20 lg:w-24 xl:w-28 min-w-0" />
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex-1 flex items-center justify-center space-x-6 min-w-0">
                            {navigationItems.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm font-medium whitespace-nowrap"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>

                        {/* Login Button with Gradient Border */}
                        <Link
                            href="/auth"
                            className="w-fit bg-black/50 backdrop-blur-sm border border-blue-500 text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 px-14 py-5 rounded-full font-medium uppercase tracking-[0.2em] text-xs relative overflow-hidden group flex items-center justify-center"
                            style={{
                                boxShadow: '0 0 15px rgba(59, 130, 246, 0.3), inset 0 0 15px rgba(59, 130, 246, 0.1)'
                            }}
                        >
                            <span className="relative z-10">LOGIN</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Navbar */}
            <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0f1c]/95 backdrop-blur-md border-b border-synqit-border">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        {/* Mobile Menu Drawer */}
                        <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} direction="left">
                            <DrawerTrigger asChild>
                                <button className="text-white p-2 hover:bg-white/10 rounded-md transition-colors">
                                    <div className="grid grid-cols-3 gap-1 w-6 h-6">
                                        {Array.from({ length: 9 }).map((_, i) => (
                                            <div key={i} className="w-1.5 h-1.5 bg-white rounded-sm" />
                                        ))}
                                    </div>
                                </button>
                            </DrawerTrigger>
                            
                            <DrawerContent className="bg-[#0a0f1c] border-synqit-border">
                                <DrawerHeader className="border-b border-synqit-border">
                                    <div className="flex items-center justify-between">
                                        <DrawerTitle asChild>
                                            <SynqitLogo className="w-20" />
                                        </DrawerTitle>
                                        <DrawerClose asChild>
                                            <button className="text-white/60 hover:text-white p-2 rounded-md transition-colors">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </DrawerClose>
                                    </div>
                                </DrawerHeader>
                                
                                <div className="flex flex-col py-6">
                                    {/* Navigation Items */}
                                    <div className="space-y-1 px-4">
                                        {navigationItems.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                onClick={handleMobileNavClick}
                                                className="block py-4 px-4 text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 text-lg font-medium"
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                    
                                    {/* Mobile Login Button */}
                                    <div className="px-4 mt-8">
                                        <Link
                                            href="/auth"
                                            onClick={handleMobileNavClick}
                                            className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                                        >
                                            LOGIN
                                        </Link>
                                    </div>
                                    
                                    {/* Bottom spacing */}
                                    <div className="flex-1 min-h-[2rem]" />
                                </div>
                            </DrawerContent>
                        </Drawer>

                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <SynqitLogo className="w-16" />
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    )
}
