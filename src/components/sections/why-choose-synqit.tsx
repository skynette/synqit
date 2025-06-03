import Image from "next/image"

interface Feature {
    id: string
    title: string
    description: string
    iconSrc: string
    iconAlt: string
}

const features: Feature[] = [
    {
        id: "open-ecosystem",
        title: "Open Ecosystem Access",
        description: "Startups gain direct visibility and priority access to top VCs, launchpads, & projects, leveling the playing field.",
        iconSrc: "/icons/ecosystem-access.png",
        iconAlt: "Open Ecosystem Access"
    },
    {
        id: "verified-deals",
        title: "Verified & Transparent Deals",
        description: "Reduce scams & fake projects with on-chain deal verification (future feature) or social proof-driven validation.",
        iconSrc: "/icons/verified-deals.png",
        iconAlt: "Verified Deals"
    },
    {
        id: "ai-discovery",
        title: "AI-Powered Discovery",
        description: "No need for manual searches—Synqit suggests top matches based on shared goals, blockchain preference, & funding stage.",
        iconSrc: "/icons/api-powered-discovery.png",
        iconAlt: "AI-Powered Discovery"
    },
    {
        id: "effortless-networking",
        title: "Effortless Networking & Outreach",
        description: "One-click partnerships, AIpowered intros, automated follow-ups, and event sync—so you can focus on building.",
        iconSrc: "/icons/effortless-networking.png",
        iconAlt: "Effortless Networking"
    }
]

const bottomFeature: Feature = {
    id: "smart-matchmaking",
    title: "Smart Web3 Matchmaking",
    description: "Instantly connect with ideal partners based on industry, blockchain, followers, and past collaborations—no more scattered searching.",
    iconSrc: "/icons/smart-web3-matchmaking.png",
    iconAlt: "Smart Web3 Matchmaking"
}

export function WhyChooseSynqitSection() {
    return (
        <section className="w-full py-20 md:py-32 relative">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                        Why Choose Synqit?
                    </h2>
                    <p className="text-synqit-muted-foreground text-base md:text-lg">
                        The Future of Web3 Collaboration, Secured & Smarter.
                    </p>
                </div>

                {/* Features Grid - 2x2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-8 flex gap-6"
                        >
                            {/* Icon Container */}
                            <div className="flex-shrink-0">
                                <Image
                                    src={feature.iconSrc}
                                    alt={feature.iconAlt}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-lg md:text-xl font-bold mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-synqit-muted-foreground text-sm md:text-base leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Feature - Centered */}
                <div className="flex justify-center">
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-8 max-w-2xl w-full">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                <Image
                                    src={bottomFeature.iconSrc}
                                    alt={bottomFeature.iconAlt}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-lg md:text-xl font-bold mb-2">
                                    {bottomFeature.title}
                                </h3>
                                <p className="text-synqit-muted-foreground text-sm md:text-base leading-relaxed">
                                    {bottomFeature.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}