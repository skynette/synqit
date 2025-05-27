import type React from "react"
import { Navbar } from "./navbar"
import { BackgroundPattern } from "@/components/ui/background-pattern"

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen relative">
            <BackgroundPattern />
            <Navbar />
            <main className="relative z-10 pt-20 md:pt-0">{children}</main>
        </div>
    )
}
