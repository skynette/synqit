import Image from "next/image"

export function UnlockWeb3Section() {
    return (
        <section className="w-full min-h-screen py-20 relative overflow-hidden flex items-center">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <div className="relative">
                    {/* Large Oval Container */}
                    <div className="relative mx-auto" style={{ maxWidth: '90vw', aspectRatio: '1.8/1' }}>
                        {/* Oval Border */}
                        <div
                            className="absolute inset-0 border border-synqit-border/30"
                            style={{
                                borderRadius: '50%',
                                transform: 'scale(1)',
                            }}
                        />

                        {/* Content Container - Centered within the oval */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-16">
                            {/* Heading */}
                            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-center max-w-4xl">
                                Unlock the Power of Web3 Today!
                            </h2>

                            {/* Subheading */}
                            <p className="text-synqit-muted-foreground text-base md:text-lg lg:text-xl mb-16 text-center">
                                Join us on the journey to the decentralized future.
                            </p>

                            {/* Logo with SVG lines - Increased spacing */}
                            <div className="relative w-full max-w-2xl mx-auto mb-20 md:mb-24">
                                <Image
                                    src="/images/logo_power.png"
                                    alt="Synqit Logo with decorative lines"
                                    width={600}
                                    height={120}
                                    className="w-full h-auto"
                                    priority
                                />
                            </div>

                            {/* CTA Button - Positioned lower */}
                            <button
                                className="bg-transparent border border-synqit-primary text-synqit-primary hover:bg-synqit-primary hover:text-synqit-primary-foreground transition-all duration-300 px-10 py-3.5 rounded-full font-medium text-sm md:text-base uppercase tracking-wider"
                                type="button"
                            >
                                Accelerate Your Web3 Growth
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}