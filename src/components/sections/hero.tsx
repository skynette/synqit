import { Button } from "@/components/ui/button"
import { SynqitLogo } from "@/components/ui/synqit-logo"

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 md:mt-[144px]">
            {/* Welcome Badge */}
            <div className="mb-16 md:mb-20">
                <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border border-synqit-primary/30 rounded-full px-6 py-3 shadow-lg">
                    <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-synqit-primary rounded-sm flex items-center justify-center">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                                <path d="M0 0h8v8H0z" />
                            </svg>
                        </div>
                        <span className="text-white text-sm font-medium">Welcome to Synqit</span>
                    </div>
                </div>
            </div>

            {/* Logo with Concentric Design */}
            <div className="mb-16 md:mb-20 relative">
                {/* Concentric circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 md:w-64 md:h-64 border border-synqit-border/30 rounded-3xl"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 md:w-52 md:h-52 border border-synqit-border/20 rounded-2xl"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 md:w-40 md:h-40 border border-synqit-border/10 rounded-xl"></div>
                </div>

                {/* Main logo */}
                <div className="relative z-10">
                    <SynqitLogo className="w-24 h-24 md:w-32 md:h-32" />
                </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8 md:mb-12 max-w-4xl">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    The Future of Web3 Collaboration <span className="block">Starts Here</span>
                </h1>
            </div>

            {/* Description */}
            <div className="text-center mb-12 md:mb-16 max-w-2xl">
                <p className="text-synqit-muted text-lg md:text-xl leading-relaxed">
                    Discover and engage with the right partners, projects, and communities to accelerate your Web3 journey.
                </p>
            </div>

            {/* CTA Button */}
            <div className="mb-8 md:mb-12">
                <Button
                    size="lg"
                    className="bg-black hover:bg-gray-800 text-white px-8 md:px-12 py-4 md:py-6 text-sm md:text-base font-medium rounded-full transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-700 hover:border-gray-600"
                >
                    DISCOVER PROJECTS. FORGE PARTNERSHIPS.
                </Button>
            </div>
        </section>
    )
}
