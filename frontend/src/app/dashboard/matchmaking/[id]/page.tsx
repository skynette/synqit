'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface PartnerProfileProps {
    params: {
        id: string
    }
}

const partnerProfileData: { [key: string]: any } = {
    arweave: {
        id: "arweave",
        name: "Arweave",
        logo: "/icons/arweave.png",
        banner: "/images/arweave.png",
        domain: "arweave.org",
        requestType: "Partnership",
        partnerAvatars: [
            "/avatars/avatar1.png",
            "/avatars/avatar2.png",
            "/avatars/avatar3.png",
            "/avatars/avatar4.png",
            "/avatars/avatar5.png",
            "/avatars/avatar6.png",
            "/avatars/avatar7.png",
            "/avatars/avatar8.png",
            "/avatars/avatar9.png",
        ],
        tags: ["RWA", "DeFi"],
        status: "awaiting_response",
        about: {
            description: "Arweave is a decentralized storage protocol that offers permanent and tamper-proof data storage on the blockchain. Unlike traditional cloud services, Arweave enables users to store information permanently with a single upfront payment, ensuring data persistence, security, and accessibility over time."
        },
        partnerships: {
            description: "Arweave is being used in countless different ways. Take your first steps with the power of permanent data storage by uploading a file, making your own homepage on the permaweb or simply learning more about Arweave and its ecosystem.",
            blockchain: "Arweave Blockchain",
            industry: "🏘️ Real Estate | 🏢 DeFi | 💎 RWA"
        },
        website: {
            title: "A Web3-powered investment platform transforming real-world assets (...",
            description: "Arweave is a decentralized storage protocol that offers permanent and tamper-proof data storage on the blockchain. Unlike traditional cloud service...",
            url: "Visit Mintrise Website",
            preview: "/images/web3-collab-1.png"
        },
        partnershipDetails: {
            eligibility: "Who Can Partner With Us?",
            criteria: [
                {
                    category: "Marketing Projects",
                    description: "Looking for strategic co-branding"
                },
                {
                    category: "DeFi Protocols", 
                    description: "Seeking integrations (staking, lending, etc.)"
                },
                {
                    category: "Web3 Communities",
                    description: "Interested in joint AMAs & collaborations"
                }
            ]
        },
        preferredPartnerTypes: [
            { type: "Cross-Marketing", active: true },
            { type: "Platform Integration", active: true },
            { type: "Joint Events & AMAs", active: true }
        ],
        requirements: [
            "Must be a verified Web3 project",
            "Have an active community (Telegram, Discord, Twitter)",
            "Must align with Mintrise's ecosystem goals"
        ],
        howToApply: [
            'Click "Request Partnership" to send a connection request',
            "Mintrise will review and approve based on alignment"
        ],
        partnershipStatus: {
            upcomingEvents: "Upcoming Joint Events: (Event List)",
            recentAnnouncements: "Recent Announcements: Follow social media account to get updated"
        },
        activeCollaborations: [
            { name: "ShortletLagos", avatar: "/avatars/avatar1.png" },
            { name: "Mintrise", avatar: "/avatars/avatar2.png" },
            { name: "We3oost", avatar: "/avatars/avatar3.png" },
            { name: "TechExplore", avatar: "/avatars/avatar4.png" }
        ],
        cta: {
            title: "Partner with Mintrise & Shape the Future of Web3 Real Estate!",
            followText: "Not ready yet? Follow Mintrise for updates!"
        }
    },
    shortlet: {
        id: "shortlet",
        name: "ShortletLagos",
        logo: "/icons/shortlet-lagos.png",
        banner: "/images/shortlet-lagos.png",
        domain: "shortletlagos.com",
        requestType: "Partnership",
        partnerAvatars: [
            "/avatars/avatar1.png",
            "/avatars/avatar2.png",
            "/avatars/avatar3.png",
            "/avatars/avatar4.png",
            "/avatars/avatar5.png",
            "/avatars/avatar6.png",
            "/avatars/avatar7.png",
            "/avatars/avatar8.png",
            "/avatars/avatar9.png",
        ],
        tags: ["RWA", "DeFi"],
        status: "awaiting_response",
        about: {
            description: "ShortletLagos is pioneering the future of short-term rental investments through blockchain technology. We combine real estate investment opportunities with Web3 infrastructure to create a new paradigm for property investment and management."
        },
        partnerships: {
            description: "ShortletLagos offers unique partnership opportunities in the intersection of real estate and blockchain. We're looking for partners who can help us expand our ecosystem and bring innovative solutions to property investment.",
            blockchain: "Ethereum Blockchain",
            industry: "🏘️ Real Estate | 🏢 DeFi | 💎 RWA"
        },
        website: {
            title: "Revolutionizing property investment through Web3 technology...",
            description: "Shortlet Lagos combines traditional real estate with blockchain technology to create seamless investment opportunities...",
            url: "Visit ShortletLagos Website",
            preview: "/images/web3-collab-2.png"
        },
        partnershipDetails: {
            eligibility: "Who Can Partner With Us?",
            criteria: [
                {
                    category: "Real Estate Projects",
                    description: "Looking for property development partnerships"
                },
                {
                    category: "DeFi Protocols", 
                    description: "Seeking yield farming and staking integrations"
                },
                {
                    category: "Investment Communities",
                    description: "Interested in joint investment opportunities"
                }
            ]
        },
        preferredPartnerTypes: [
            { type: "Cross-Marketing", active: true },
            { type: "Platform Integration", active: false },
            { type: "Joint Events & AMAs", active: true }
        ],
        requirements: [
            "Must be a verified Web3 project",
            "Have an active community (Telegram, Discord, Twitter)",
            "Must align with ShortletLagos's ecosystem goals"
        ],
        howToApply: [
            'Click "Request Partnership" to send a connection request',
            "ShortletLagos will review and approve based on alignment"
        ],
        partnershipStatus: {
            upcomingEvents: "Upcoming Joint Events: (Event List)",
            recentAnnouncements: "Recent Announcements: Follow social media account to get updated"
        },
        activeCollaborations: [
            { name: "Arweave", avatar: "/avatars/avatar1.png" },
            { name: "Mintrise", avatar: "/avatars/avatar2.png" },
            { name: "We3oost", avatar: "/avatars/avatar3.png" },
            { name: "TechExplore", avatar: "/avatars/avatar4.png" }
        ],
        cta: {
            title: "Partner with ShortletLagos & Shape the Future of Web3 Real Estate!",
            followText: "Not ready yet? Follow ShortletLagos for updates!"
        }
    },
    audius: {
        id: "audius",
        name: "Audius",
        logo: "/icons/audius.png",
        banner: "/images/audius.png",
        domain: "audius.co",
        requestType: "Partnership",
        partnerAvatars: [
            "/avatars/avatar1.png",
            "/avatars/avatar2.png",
            "/avatars/avatar3.png",
            "/avatars/avatar4.png",
            "/avatars/avatar5.png",
            "/avatars/avatar6.png",
            "/avatars/avatar7.png",
            "/avatars/avatar8.png",
            "/avatars/avatar9.png",
        ],
        tags: ["RWA", "DeFi"],
        status: "new_request",
        about: {
            description: "Audius is a blockchain-based decentralized protocol for sharing and streaming audio content. It is secured by an incentive-aligned network of node operators, providing a censorship-resistant alternative to existing streaming platforms."
        },
        partnerships: {
            description: "Audius offers partnership opportunities for artists, labels, developers, and Web3 projects looking to integrate music and audio experiences into their platforms.",
            blockchain: "Solana & Ethereum",
            industry: "🎵 Music | 🎨 Creator Economy | 🎧 Streaming"
        },
        website: {
            title: "Empowering artists through decentralized music streaming...",
            description: "Audius is giving artists the power to share their music freely and fans the ability to directly support creators...",
            url: "Visit Audius Platform",
            preview: "/images/web3-collab-4.png"
        },
        partnershipDetails: {
            eligibility: "Who Can Partner With Us?",
            criteria: [
                {
                    category: "Music Artists & Labels",
                    description: "Looking for innovative distribution partnerships"
                },
                {
                    category: "Gaming Platforms", 
                    description: "Seeking music integration partnerships"
                },
                {
                    category: "Creator Economy Apps",
                    description: "Interested in audio content collaborations"
                }
            ]
        },
        preferredPartnerTypes: [
            { type: "Cross-Marketing", active: true },
            { type: "Platform Integration", active: true },
            { type: "Joint Events & AMAs", active: false }
        ],
        requirements: [
            "Must be a verified Web3 project",
            "Have an active community (Telegram, Discord, Twitter)",
            "Must align with Audius's creator economy goals"
        ],
        howToApply: [
            'Click "Accept Partnership" to approve the request',
            "Audius will be notified and begin collaboration planning"
        ],
        partnershipStatus: {
            upcomingEvents: "Upcoming Joint Events: Music NFT showcase",
            recentAnnouncements: "Recent Announcements: New artist onboarding program launched"
        },
        activeCollaborations: [
            { name: "SoundCloud", avatar: "/avatars/avatar1.png" },
            { name: "Mintrise", avatar: "/avatars/avatar2.png" },
            { name: "BeatDAO", avatar: "/avatars/avatar3.png" },
            { name: "MusicNFT", avatar: "/avatars/avatar4.png" }
        ],
        cta: {
            title: "Partner with Audius & Shape the Future of Decentralized Music!",
            followText: "Not ready yet? Follow Audius for updates!"
        }
    },
    aave: {
        id: "aave",
        name: "Aave",
        logo: "/icons/aave.png",
        banner: "/images/aave.png",
        domain: "aave.com",
        requestType: "Partnership",
        partnerAvatars: [
            "/avatars/avatar1.png",
            "/avatars/avatar2.png",
            "/avatars/avatar3.png",
            "/avatars/avatar4.png",
            "/avatars/avatar5.png",
            "/avatars/avatar6.png",
            "/avatars/avatar7.png",
            "/avatars/avatar8.png",
            "/avatars/avatar9.png",
        ],
        tags: ["RWA", "DeFi"],
        status: "new_request",
        about: {
            description: "Aave is a decentralized finance protocol that allows people to lend and borrow crypto. Lenders earn interest by depositing digital assets into specially created liquidity pools. Borrowers can then use their crypto as collateral to take out a flash loan using this liquidity."
        },
        partnerships: {
            description: "Aave Protocol offers various partnership opportunities including integrations, liquidity partnerships, governance collaborations, and ecosystem development initiatives.",
            blockchain: "Multi-chain (Ethereum, Polygon, Avalanche)",
            industry: "🏢 DeFi | 🔗 Lending | 💰 Liquidity"
        },
        website: {
            title: "Open source and non-custodial liquidity protocol...",
            description: "Aave is a decentralized finance protocol that allows people to lend and borrow crypto without intermediaries...",
            url: "Visit Aave Protocol",
            preview: "/images/web3-collab-3.png"
        },
        partnershipDetails: {
            eligibility: "Who Can Partner With Us?",
            criteria: [
                {
                    category: "DeFi Protocols",
                    description: "Looking for yield optimization partnerships"
                },
                {
                    category: "Asset Managers", 
                    description: "Seeking institutional liquidity providers"
                },
                {
                    category: "Developer Teams",
                    description: "Interested in building on Aave ecosystem"
                }
            ]
        },
        preferredPartnerTypes: [
            { type: "Cross-Marketing", active: false },
            { type: "Platform Integration", active: true },
            { type: "Joint Events & AMAs", active: true }
        ],
        requirements: [
            "Must be a verified DeFi project",
            "Have proven track record in crypto",
            "Must align with Aave's decentralized finance goals"
        ],
        howToApply: [
            'Click "Accept Partnership" to approve the request',
            "Aave will be notified and begin integration planning"
        ],
        partnershipStatus: {
            upcomingEvents: "Upcoming Joint Events: DeFi governance workshop",
            recentAnnouncements: "Recent Announcements: New liquidity mining program"
        },
        activeCollaborations: [
            { name: "Compound", avatar: "/avatars/avatar1.png" },
            { name: "Uniswap", avatar: "/avatars/avatar2.png" },
            { name: "Polygon", avatar: "/avatars/avatar3.png" },
            { name: "Chainlink", avatar: "/avatars/avatar4.png" }
        ],
        cta: {
            title: "Partner with Aave & Shape the Future of DeFi!",
            followText: "Not ready yet? Follow Aave for updates!"
        }
    }
}

const otherPendingRequests = [
    { id: "polkadot", name: "Polkadot", logo: "/icons/metamask.svg" },
    { id: "thegraph", name: "The Graph", logo: "/icons/wallet-connect.svg" },
    { id: "lens", name: "Lens", logo: "/avatars/avatar3.png" },
    { id: "superrare", name: "Super Rare", logo: "/avatars/avatar4.png" }
]

export default function PartnerProfilePage({ params }: PartnerProfileProps) {
    const router = useRouter()
    const [isFollowing, setIsFollowing] = useState(false)
    
    const partner = partnerProfileData[params.id]
    
    if (!partner) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Partner Not Found</h1>
                    <button 
                        onClick={() => router.back()}
                        className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-synqit-background">
            {/* Header with Back Button */}
            <div className="flex justify-between items-center p-6">
                <button 
                    onClick={() => router.back()}
                    className="text-white hover:text-synqit-primary transition-colors"
                >
                    Back
                </button>
                
                {/* Other Pending Requests */}
                <div className="text-white">
                    <span className="text-synqit-muted-foreground">Other Pending Requests </span>
                    <span className="font-medium">(All)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Partner Header Card */}
                    <div className="bg-white rounded-2xl overflow-hidden relative">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            {partner.status === 'awaiting_response' ? (
                                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                    Awaiting Response
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                                    </svg>
                                </div>
                            ) : (
                                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                    New Request
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16L12 13.5 15.5 16 12 18.5 8.5 16z"/>
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Banner */}
                        <div className="relative h-32 w-full">
                            <Image
                                src={partner.banner}
                                alt={`${partner.name} banner`}
                                fill
                                className="object-contain p-8"
                            />
                        </div>

                        {/* Partner Info */}
                        <div className="bg-synqit-surface text-white p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 relative rounded-full bg-white p-2">
                                    <Image
                                        src={partner.logo}
                                        alt={`${partner.name} logo`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">{partner.name}</h1>
                                    <p className="text-synqit-muted-foreground">{partner.domain}</p>
                                </div>
                            </div>

                            {/* Request Type */}
                            <div className="flex items-center gap-2 mb-4">
                                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64513 7.17116V2.97116C8.64513 1.99116 8.1143 1.79283 7.4668 2.52783L7.00013 3.05866L3.05096 7.55033C2.50846 8.16283 2.73596 8.66449 3.55263 8.66449H5.35513V12.8645C5.35513 13.8445 5.88596 14.0428 6.53346 13.3078L7.00013 12.777L10.9493 8.28533C11.4918 7.67283 11.2643 7.17116 10.4476 7.17116H8.64513Z" fill="#CFDBE4" />
                                </svg>
                                <span className="text-sm">Request Type: {partner.requestType}</span>
                            </div>

                            {/* Partners */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <p className="text-sm text-synqit-muted-foreground">Partners:</p>
                                    <div className="flex -space-x-2">
                                        {partner.partnerAvatars.slice(0, 8).map((avatar: string, index: number) => (
                                            <div key={index} className="w-6 h-6 rounded-full relative overflow-hidden border-2 border-synqit-surface">
                                                <Image
                                                    src={avatar}
                                                    alt={`Partner ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                        <div className="w-6 h-6 rounded-full bg-synqit-muted border-2 border-synqit-surface flex items-center justify-center">
                                            <span className="text-[10px] text-synqit-muted-foreground">+10</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {partner.tags.map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-synqit-input text-synqit-muted-foreground rounded-full text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Status Button */}
                            {partner.status === 'awaiting_response' ? (
                                <button 
                                    disabled
                                    className="w-full py-3 bg-synqit-muted/30 text-synqit-muted-foreground rounded-lg font-medium cursor-not-allowed"
                                >
                                    Awaiting Response
                                </button>
                            ) : (
                                <button className="w-full py-3 bg-synqit-primary hover:bg-synqit-primary/80 text-white rounded-lg font-medium transition-colors">
                                    Accept Partnership
                                </button>
                            )}
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">About {partner.name}</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Project Description:</h3>
                                <p className="text-synqit-muted-foreground leading-relaxed">
                                    {partner.about.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* What We Offer for Partnerships */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">What We Offer for Partnerships:</h2>
                        <p className="text-synqit-muted-foreground leading-relaxed">
                            {partner.partnerships.description}
                        </p>
                        <div className="space-y-2">
                            <p className="text-synqit-muted-foreground">
                                <span className="font-medium">Blockchain Used:</span> {partner.partnerships.blockchain}
                            </p>
                            <p className="text-synqit-muted-foreground">
                                <span className="font-medium">Industry Focus:</span> {partner.partnerships.industry}
                            </p>
                        </div>
                    </div>

                    {/* Website Preview */}
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 relative rounded-full bg-white p-2 flex-shrink-0">
                                <Image
                                    src={partner.logo}
                                    alt={`${partner.name} logo`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold mb-1">{partner.name}</h3>
                                <p className="text-synqit-primary text-sm mb-2">{partner.website.title}</p>
                                <p className="text-synqit-muted-foreground text-sm mb-3">
                                    {partner.website.description}
                                </p>
                                <a 
                                    href="#" 
                                    className="text-synqit-primary hover:text-synqit-accent text-sm font-medium"
                                >
                                    {partner.website.url}
                                </a>
                            </div>
                            <div className="w-32 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={partner.website.preview}
                                    alt="Website preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Partnership Details */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">Partnership Details</h2>
                        
                        <div className="space-y-4">
                            <h4 className="text-white font-medium flex items-center gap-2">
                                <svg className="w-4 h-4 text-synqit-primary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                {partner.partnershipDetails.eligibility}
                            </h4>
                            
                            <div className="space-y-3 pl-6">
                                {partner.partnershipDetails.criteria.map((criterion: any, index: number) => (
                                    <div key={index} className="text-synqit-muted-foreground">
                                        <span className="font-medium">{criterion.category}</span> → {criterion.description}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preferred Partner Type */}
                    <div className="space-y-4">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            ❤️ Preferred Partner Type:
                        </h3>
                        <div className="space-y-2">
                            {partner.preferredPartnerTypes.map((type: any, index: number) => (
                                <div key={index} className="flex items-center gap-2 text-synqit-muted-foreground">
                                    {type.active ? (
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                    ) : (
                                        <div className="w-4 h-4 rounded border border-synqit-border"></div>
                                    )}
                                    <span>{type.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Eligibility & Requirements */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white">Eligibility & Requirements</h2>
                        
                        <div className="space-y-4">
                            <h4 className="text-white font-medium flex items-center gap-2">
                                📋 Requirements to Join:
                            </h4>
                            
                            <div className="space-y-2">
                                {partner.requirements.map((requirement: string, index: number) => (
                                    <div key={index} className="flex items-center gap-2 text-synqit-muted-foreground">
                                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                        <span>{requirement}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* How to Apply */}
                    <div className="space-y-4">
                        <h4 className="text-white font-medium flex items-center gap-2">
                            📞 How to Apply:
                        </h4>
                        
                        <div className="space-y-2">
                            {partner.howToApply.map((step: string, index: number) => (
                                <div key={index} className="text-synqit-muted-foreground">
                                    {step}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Partnership Status & Activity */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white">Partnership Status & Activity</h2>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-synqit-muted-foreground">
                                <span>📅</span>
                                <span>{partner.partnershipStatus.upcomingEvents}</span>
                            </div>
                            <div className="flex items-center gap-2 text-synqit-muted-foreground">
                                <span>📢</span>
                                <span>{partner.partnershipStatus.recentAnnouncements}</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Collaborations */}
                    <div className="space-y-4">
                        <h3 className="text-white font-medium flex items-center gap-2">
                            🤝 Active Collaborations:
                        </h3>
                        
                        <div className="flex gap-3">
                            {partner.activeCollaborations.map((collab: any, index: number) => (
                                <div key={index} className="flex items-center gap-2 bg-synqit-surface/50 px-3 py-2 rounded-lg">
                                    <div className="w-8 h-8 rounded-full relative overflow-hidden">
                                        <Image
                                            src={collab.avatar}
                                            alt={collab.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-white text-sm">{collab.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Call-to-Action */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            🚀 Call-to-Action (CTA)
                        </h2>
                        
                        <p className="text-synqit-muted-foreground">{partner.cta.title}</p>
                        
                        <button className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                            Apply for Partnership
                        </button>
                        
                        <p className="text-synqit-muted-foreground">{partner.cta.followText}</p>
                        
                        {/* Social Media Links */}
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </div>
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </div>
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </div>
                            <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                                </svg>
                            </div>
                            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </div>
                            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Other Pending Requests */}
                <div className="lg:col-span-1">
                    <div className="space-y-4">
                        {otherPendingRequests.map((request) => (
                            <div key={request.id} className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 relative rounded-full overflow-hidden">
                                        <Image
                                            src={request.logo}
                                            alt={request.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="text-white font-medium">{request.name}</span>
                                </div>
                                <Link 
                                    href={`/dashboard/matchmaking/${request.id}`}
                                    className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                                >
                                    View Profile
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
} 