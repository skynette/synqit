import Image from "next/image"
import Link from "next/link"

interface Partner {
    id: string
    name: string
    logo: string
    companyLogo: string
    description: string
    requestType: string
    partnerAvatars: string[]
    tags: string[]
}

const partners: Partner[] = [
    {
        id: "arweave",
        name: "Arweave",
        logo: "/icons/arweave.png",
        companyLogo: "/icons/arweave.png",
        description: "Arweave is a Web3-based Real World Asset (RWA) investment platform designed to bridge traditional...",
        requestType: "Partnership",
        partnerAvatars: [
            "/icons/arweave.png",
            "/icons/arweave.png",
            "/icons/arweave.png",
            "/icons/arweave.png",
            "/icons/arweave.png",
            "/icons/arweave.png"
        ],
        tags: ["RWA", "DeFi", "VC"]
    },
    {
        id: "shortlet",
        name: "ShortletLagos",
        logo: "/images/logos/shortlet-logo.png",
        companyLogo: "/icons/shortlet-lagos.png",
        description: "Starts with a collection of 10,000 avatars that give you membership access.",
        requestType: "Partnership",
        partnerAvatars: [
            "/icons/arweave.png",
            "/icons/arweave.png",
            "/icons/arweave.png",
            "/icons/arweave.png",
            "/icons/arweave.png",
            "/icons/arweave.pngg"
        ],
        tags: ["RWA", "DeFi"]
    },
    {
        id: "aave",
        name: "Aave",
        logo: "/icons/aave.png",
        companyLogo: "/icons/aave.png",
        description: "Starts with a collection of 10,000 avatars that give you membership access.",
        requestType: "Partnership",
        partnerAvatars: [
            "/icons/arweave.png",
            "/icons/arweave.png",
            "/icons/arweave.png",
            "/icons/arweave.png",
            "/icons/arweave.png",
            "/icons/arweave.pngg"
        ],
        tags: ["RWA", "DeFi"]
    },
    {
        id: "audius",
        name: "Audius",
        logo: "/images/logos/audius-logo.png",
        companyLogo: "/icons/audius.png",
        description: "Starts with a collection of 10,000 avatars that give you membership access.",
        requestType: "Partnership",
        partnerAvatars: [
            "/icons/aave.png",
            "/icons/aave.png",
            "/icons/aave.png",
            "/icons/aave.png",
            "/icons/aave.png",
            "/icons/aave.png"
        ],
        tags: ["RWA", "DeFi"]
    }
]

export function TrustedBuildersSection() {
    return (
        <section className="w-full py-20 md:py-32 relative">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        Trusted by 1000+ Web3 Builders & Innovators
                    </h2>
                    <p className="text-synqit-muted-foreground text-base md:text-lg max-w-3xl mx-auto mb-8">
                        Join a growing community of Web3 enthusiasts, startups, and enterprises using Synqit to collaborate,
                        innovate, and build the future of decentralized work.
                    </p>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                            <span className="text-orange-500">🚀</span>
                            <span>12,000+ Users</span>
                        </div>
                        <span className="text-synqit-muted-foreground">|</span>
                        <div className="flex items-center gap-2">
                            <span>🔗</span>
                            <span>Seamless Collaboration</span>
                        </div>
                        <span className="text-synqit-muted-foreground">|</span>
                        <div className="flex items-center gap-2">
                            <span>🔒</span>
                            <span>Secured & Scalable</span>
                        </div>
                    </div>
                </div>

                {/* Partner Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {partners.map((partner) => (
                        <div key={partner.id} className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6 flex flex-col">
                            {/* Header with Logo */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 relative">
                                    <Image
                                        src={partner.logo}
                                        alt={`${partner.name} logo`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            </div>

                            {/* Company Logo */}
                            <div className="h-16 mb-4 flex gap-3 items-center">
                                <Image
                                    src={partner.companyLogo}
                                    alt={`${partner.name} company`}
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                                <h3 className="font-bold text-lg">{partner.name}</h3>
                            </div>

                            {/* Description */}
                            <p className="text-synqit-muted-foreground text-xs tracking-tighter mb-4 flex-grow">
                                {partner.description}
                            </p>

                            {/* Request Type */}
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs" style={{ display: 'flex', alignItems: 'center' }}>
                                    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.64513 7.17116V2.97116C8.64513 1.99116 8.1143 1.79283 7.4668 2.52783L7.00013 3.05866L3.05096 7.55033C2.50846 8.16283 2.73596 8.66449 3.55263 8.66449H5.35513V12.8645C5.35513 13.8445 5.88596 14.0428 6.53346 13.3078L7.00013 12.777L10.9493 8.28533C11.4918 7.67283 11.2643 7.17116 10.4476 7.17116H8.64513Z" fill="#CFDBE4"/>
                                    </svg>
                                </span>
                                <span className="text-sm">Request Type: {partner.requestType}</span>
                            </div>

                            {/* Partners */}
                            <div className="mb-4">
                                <p className="text-sm mb-2">Partners:</p>
                                <div className="flex -space-x-2">
                                    {partner.partnerAvatars.map((avatar, index) => (
                                        <div key={index} className="w-8 h-8 rounded-full border-2 border-synqit-surface relative overflow-hidden">
                                            <Image
                                                src={avatar}
                                                alt={`Partner ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    {partner.partnerAvatars.length > 5 && (
                                        <div className="w-8 h-8 rounded-full bg-synqit-primary/20 border-2 border-synqit-surface flex items-center justify-center">
                                            <span className="text-xs">+{partner.partnerAvatars.length - 5}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex gap-2 mb-6">
                                {partner.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-synqit-primary/10 text-synqit-primary rounded-full text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* View Details Button */}
                            <button className="w-full py-2.5 bg-synqit-primary/20 hover:bg-synqit-primary/30 text-synqit-primary rounded-lg transition-colors duration-200 font-medium text-sm">
                                View Details
                            </button>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <Link
                        href="/start-journey"
                        className="inline-block bg-transparent border-2 border-synqit-primary text-synqit-primary hover:bg-synqit-primary hover:text-synqit-primary-foreground transition-all duration-300 px-8 py-3 rounded-full font-medium uppercase tracking-wider"
                    >
                        Start Your Web3 Journey
                    </Link>
                </div>
            </div>
        </section>
    )
}