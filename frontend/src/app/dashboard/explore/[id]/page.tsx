'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface ProjectDetailProps {
    params: Promise<{
        id: string
    }>
}

const projectData: { [key: string]: any } = {
    arweave: {
        id: "arweave",
        name: "Arweave",
        logo: "/icons/arweave.png",
        banner: "/images/arweave.png",
        verified: true,
        description: "Mintrise is a Web3-based Real World Asset (RWA) investment platform designed to bridge traditional...",
        stats: {
            followers: "61.2K",
            following: "13.3K"
        },
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
        additionalTags: 2,
        about: "Arweave is a decentralized storage protocol that offers permanent and tamper-proof data storage on the blockchain. Unlike traditional cloud services, Arweave enables users to store information permanently with a single upfront payment, ensuring data persistence, security, and accessibility over time.",
        partnerships: {
            description: "Arweave is being used in countless different ways. Take your first steps with the power of permanent data storage by uploading a file, making your own homepage on the permaweb or simply learning more about Arweave and its ecosystem.",
            blockchain: "Arweave Blockchain",
            industry: "🏘️ Real Estate | 🏢 DeFi | 💎 RWA"
        },
        website: {
            title: "A Web3-powered investment platform transforming real-world a...",
            description: "Arweave is a decentralized storage protocol that offers permanent and tamper-proof data storage on the blockchain. Unlike traditional cloud...",
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
        howToApply: [
            {
                step: 1,
                title: "Apply to Collaborate Above",
                description: ""
            },
            {
                step: 2,
                title: "Wait for an email if you match our preference",
                description: ""
            },
            {
                step: 3,
                title: "Complete the onboarding",
                description: ""
            },
            {
                step: 4,
                title: "Join Team",
                description: "and have fun!",
                highlight: true
            }
        ]
    },
    shortlet: {
        id: "shortlet",
        name: "ShortletLagos",
        logo: "/icons/shortlet-lagos.png",
        banner: "/images/shortlet-lagos.png",
        verified: true,
        description: "Starts with a collection of 10,000 avatars that give you membership access.",
        stats: {
            followers: "25.4K",
            following: "8.7K"
        },
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
        additionalTags: 1,
        about: "ShortletLagos is pioneering the future of short-term rental investments through blockchain technology. We combine real estate investment opportunities with Web3 infrastructure to create a new paradigm for property investment and management.",
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
        howToApply: [
            {
                step: 1,
                title: "Apply to Collaborate Above",
                description: ""
            },
            {
                step: 2,
                title: "Wait for our investment team review",
                description: ""
            },
            {
                step: 3,
                title: "Complete the KYC process",
                description: ""
            },
            {
                step: 4,
                title: "Start Investing",
                description: "and earn returns!",
                highlight: true
            }
        ]
    },
    aave: {
        id: "aave",
        name: "Aave",
        logo: "/icons/aave.png",
        banner: "/images/aave.png",
        verified: true,
        description: "Aave is a decentralized non-custodial liquidity market protocol where users can participate as depositors or borrowers.",
        stats: {
            followers: "124.8K",
            following: "45.2K"
        },
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
        additionalTags: 2,
        about: "Aave is a decentralized finance protocol that allows people to lend and borrow crypto. Lenders earn interest by depositing digital assets into specially created liquidity pools. Borrowers can then use their crypto as collateral to take out a flash loan using this liquidity.",
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
        howToApply: [
            {
                step: 1,
                title: "Apply to Collaborate Above",
                description: ""
            },
            {
                step: 2,
                title: "Technical evaluation by our team",
                description: ""
            },
            {
                step: 3,
                title: "Complete integration testing",
                description: ""
            },
            {
                step: 4,
                title: "Go Live",
                description: "and start earning!",
                highlight: true
            }
        ]
    },
    audius: {
        id: "audius",
        name: "Audius",
        logo: "/icons/audius.png",
        banner: "/images/audius.png",
        verified: true,
        description: "Audius is a decentralized music platform that puts power back into the hands of artists and fans.",
        stats: {
            followers: "89.3K",
            following: "12.6K"
        },
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
        additionalTags: 3,
        about: "Audius is a blockchain-based decentralized protocol for sharing and streaming audio content. It is secured by an incentive-aligned network of node operators, providing a censorship-resistant alternative to existing streaming platforms.",
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
        howToApply: [
            {
                step: 1,
                title: "Apply to Collaborate Above",
                description: ""
            },
            {
                step: 2,
                title: "Creative brief and portfolio review",
                description: ""
            },
            {
                step: 3,
                title: "Complete platform onboarding",
                description: ""
            },
            {
                step: 4,
                title: "Start Creating",
                description: "and get discovered!",
                highlight: true
            }
        ]
    }
}

export default function ProjectDetailPage({ params }: ProjectDetailProps) {
    const router = useRouter()
    const [isFollowing, setIsFollowing] = useState(false)
    const [projectId, setProjectId] = useState<string | null>(null)
    
    // Use effect to handle the async params
    useEffect(() => {
        params.then(({ id }) => {
            setProjectId(id)
        })
    }, [params])
    
    if (!projectId) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-white">Loading...</p>
                </div>
            </div>
        )
    }
    
    const project = projectData[projectId]
    
    return (
        <div className="min-h-screen bg-synqit-background p-6">
            {/* Back Button */}
            <div className="mb-6">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white hover:text-synqit-primary transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl">
                {/* Left Sidebar - Project Info */}
                <div className="lg:col-span-1">
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6 space-y-6">
                        {/* Project Header */}
                        <div className="text-center">
                            {/* Banner */}
                            <div className="relative h-20 w-full bg-white rounded-lg mb-4">
                                <Image
                                    src={project.banner}
                                    alt={`${project.name} banner`}
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>

                            {/* Logo and Name */}
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="w-12 h-12 relative rounded-full bg-white p-2">
                                    <Image
                                        src={project.logo}
                                        alt={`${project.name} logo`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-bold text-white">{project.name}</h1>
                                        {project.verified && (
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-center gap-6 mb-4">
                                <div className="flex items-center gap-1 text-synqit-muted-foreground">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7.5h-3A1.5 1.5 0 0 0 14.04 8.37L11.5 16H14v6h6z"/>
                                    </svg>
                                    <span className="text-sm font-medium">{project.stats.followers}</span>
                                </div>
                                <div className="flex items-center gap-1 text-synqit-muted-foreground">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                                    </svg>
                                    <span className="text-sm font-medium">{project.stats.following}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-synqit-muted-foreground text-sm mb-4">
                                {project.description}
                            </p>
                        </div>

                        {/* Request Type */}
                        <div className="flex items-center gap-2">
                            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.64513 7.17116V2.97116C8.64513 1.99116 8.1143 1.79283 7.4668 2.52783L7.00013 3.05866L3.05096 7.55033C2.50846 8.16283 2.73596 8.66449 3.55263 8.66449H5.35513V12.8645C5.35513 13.8445 5.88596 14.0428 6.53346 13.3078L7.00013 12.777L10.9493 8.28533C11.4918 7.67283 11.2643 7.17116 10.4476 7.17116H8.64513Z" fill="#CFDBE4" />
                            </svg>
                            <span className="text-sm text-synqit-muted-foreground">Request Type: {project.requestType}</span>
                        </div>

                        {/* Partners */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <p className="text-sm text-synqit-muted-foreground">Partners:</p>
                                <div className="flex -space-x-2">
                                    {project.partnerAvatars.slice(0, 6).map((avatar: string, index: number) => (
                                        <div key={index} className="w-6 h-6 rounded-full relative overflow-hidden border-2 border-synqit-surface">
                                            <Image
                                                src={avatar}
                                                alt={`Partner ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    {project.partnerAvatars.length > 6 && (
                                        <div className="w-6 h-6 rounded-full bg-synqit-muted border-2 border-synqit-surface flex items-center justify-center">
                                            <span className="text-[10px] text-synqit-muted-foreground">+{project.partnerAvatars.length - 6}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-synqit-input text-synqit-muted-foreground rounded-full text-xs"
                                >
                                    {tag}
                                </span>
                            ))}
                            {project.additionalTags > 0 && (
                                <span className="px-3 py-1 bg-synqit-input text-synqit-muted-foreground rounded-full text-xs">
                                    +{project.additionalTags}
                                </span>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button className="w-full bg-synqit-primary hover:bg-synqit-primary/80 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                Apply for Partnership
                            </button>
                            <button 
                                onClick={() => setIsFollowing(!isFollowing)}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                                    isFollowing 
                                        ? 'bg-synqit-surface/50 border border-synqit-border text-white'
                                        : 'bg-synqit-surface/50 border border-synqit-border text-synqit-muted-foreground hover:text-white'
                                }`}
                            >
                                Follow Profile
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* How to Apply */}
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6 mt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">How to Apply for Partnership</h3>
                        <div className="space-y-4">
                            {project.howToApply.map((step: any) => (
                                <div key={step.step} className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-synqit-primary/20 rounded-full flex items-center justify-center text-synqit-primary font-bold text-sm">
                                        {step.step}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white text-sm">
                                            {step.title}
                                            {step.highlight && (
                                                <span className="ml-2 bg-synqit-primary text-white px-2 py-1 rounded text-xs">
                                                    {step.description}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About Section */}
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">About {project.name}</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Project Description:</h3>
                                <p className="text-synqit-muted-foreground leading-relaxed">
                                    {project.about}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">What We Offer for Partnerships:</h3>
                                <p className="text-synqit-muted-foreground leading-relaxed mb-4">
                                    {project.partnerships.description}
                                </p>
                                <div className="space-y-2">
                                    <p className="text-synqit-muted-foreground">
                                        <span className="font-medium">Blockchain Used:</span> {project.partnerships.blockchain}
                                    </p>
                                    <p className="text-synqit-muted-foreground">
                                        <span className="font-medium">Industry Focus:</span> {project.partnerships.industry}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Website Preview */}
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 relative rounded-full bg-white p-2 flex-shrink-0">
                                <Image
                                    src={project.logo}
                                    alt={`${project.name} logo`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold mb-1">{project.name}</h3>
                                <p className="text-synqit-primary text-sm mb-2">{project.website.title}</p>
                                <p className="text-synqit-muted-foreground text-sm mb-3">
                                    {project.website.description}
                                </p>
                                <a 
                                    href="#" 
                                    className="text-synqit-primary hover:text-synqit-accent text-sm font-medium"
                                >
                                    {project.website.url}
                                </a>
                            </div>
                            <div className="w-32 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={project.website.preview}
                                    alt="Website preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Partnership Details */}
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Partnership Details</h3>
                        
                        <div className="space-y-4">
                            <h4 className="text-white font-medium flex items-center gap-2">
                                <svg className="w-4 h-4 text-synqit-primary" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                                {project.partnershipDetails.eligibility}
                            </h4>
                            
                            <div className="space-y-3 pl-6">
                                {project.partnershipDetails.criteria.map((criterion: any, index: number) => (
                                    <div key={index} className="text-synqit-muted-foreground">
                                        <span className="font-medium">{criterion.category}</span> → {criterion.description}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 