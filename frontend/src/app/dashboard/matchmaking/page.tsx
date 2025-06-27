'use client'

import { useState } from "react"
import Image from "next/image"

interface PartnerRequest {
    id: string
    name: string
    logo: string
    companyLogo: string
    description: string
    requestType: string
    partnerAvatars: string[]
    tags: string[]
    isNew: boolean
    requestStatus: 'incoming' | 'outgoing'
}

const partnerRequests: PartnerRequest[] = [
    {
        id: "audius",
        name: "Audius",
        logo: "/images/audius.png",
        companyLogo: "/icons/audius.png",
        description: "Starts with a collection of 10,000 avatars that give you membership access.",
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
        isNew: true,
        requestStatus: 'incoming'
    },
    {
        id: "aave",
        name: "Aave",
        logo: "/images/aave.png",
        companyLogo: "/icons/aave.png",
        description: "Starts with a collection of 10,000 avatars that give you membership access.",
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
        isNew: true,
        requestStatus: 'incoming'
    }
]

export default function MatchmakingPage() {
    const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming')
    
    const filteredRequests = partnerRequests.filter(request => request.requestStatus === activeTab)

    return (
        <div className="space-y-6">
            {/* Header Badge */}
            <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-full px-4 py-2">
                    <div className="w-5 h-5 bg-synqit-primary rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7.5h-3A1.5 1.5 0 0 0 14.04 8.37L11.5 16H14v6h6z"/>
                        </svg>
                    </div>
                    <span className="text-white text-sm font-medium">Matchmake & Request</span>
                </div>
            </div>

            {/* Main Header */}
            <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Let SynQit Match You with the Perfect Partner!
                </h1>
                <p className="text-synqit-muted-foreground text-lg">
                    AI-Powered Matchmaking for Web3 Success.
                </p>
            </div>

            {/* AI Suggestions Section */}
            <div className="space-y-4">
                <p className="text-synqit-muted-foreground text-sm">
                    <span className="italic">SynQit AI suggests Partners that Matches your Profile</span> <span className="font-medium">(Coming Soon!)</span>
                </p>
                
                {/* AI Suggestions Placeholder */}
                <div className="flex items-center gap-3">
                    <div className="w-16 h-12 bg-pink-500/20 rounded-lg animate-pulse"></div>
                    <div className="w-16 h-12 bg-blue-500/20 rounded-lg animate-pulse"></div>
                    <div className="w-16 h-12 bg-gray-500/20 rounded-lg animate-pulse"></div>
                    <div className="w-16 h-12 bg-green-500/20 rounded-lg animate-pulse"></div>
                    <div className="w-16 h-12 bg-purple-500/20 rounded-lg animate-pulse"></div>
                </div>
            </div>

            {/* Your Requests Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Your Requests</h2>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('incoming')}
                        className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                            activeTab === 'incoming'
                                ? "bg-synqit-primary text-white"
                                : "text-synqit-muted-foreground hover:text-white hover:bg-synqit-surface/50"
                        }`}
                    >
                        Incoming Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('outgoing')}
                        className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                            activeTab === 'outgoing'
                                ? "bg-synqit-primary text-white"
                                : "text-synqit-muted-foreground hover:text-white hover:bg-synqit-surface/50"
                        }`}
                    >
                        Outgoing Requests
                    </button>
                </div>

                {/* Request Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                            <div key={request.id} className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl overflow-hidden flex flex-col relative">
                                {/* New Request Badge */}
                                {request.isNew && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            New Request
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16L12 13.5 15.5 16 12 18.5 8.5 16z"/>
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Banner Image */}
                                <div className="relative h-20 w-full bg-white">
                                    <Image
                                        src={request.logo}
                                        alt={`${request.name} banner`}
                                        fill
                                        className="object-contain p-4"
                                    />
                                </div>

                                {/* Card Content */}
                                <div className="p-5 flex flex-col flex-grow">
                                    {/* Company Logo and Name */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 relative rounded-full bg-white p-1">
                                            <Image
                                                src={request.companyLogo}
                                                alt={`${request.name} logo`}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <h3 className="font-semibold text-white">{request.name}</h3>
                                    </div>

                                    {/* Description */}
                                    <p className="text-synqit-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
                                        {request.description}
                                    </p>

                                    {/* Request Type */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8.64513 7.17116V2.97116C8.64513 1.99116 8.1143 1.79283 7.4668 2.52783L7.00013 3.05866L3.05096 7.55033C2.50846 8.16283 2.73596 8.66449 3.55263 8.66449H5.35513V12.8645C5.35513 13.8445 5.88596 14.0428 6.53346 13.3078L7.00013 12.777L10.9493 8.28533C11.4918 7.67283 11.2643 7.17116 10.4476 7.17116H8.64513Z" fill="#CFDBE4" />
                                        </svg>
                                        <span className="text-sm text-synqit-muted-foreground">Request Type: {request.requestType}</span>
                                    </div>

                                    {/* Partners */}
                                    <div className="mb-3 flex items-center gap-2">
                                        <p className="text-sm text-synqit-muted-foreground">Partners:</p>
                                        <div className="flex -space-x-2">
                                            {request.partnerAvatars.slice(0, 6).map((avatar, index) => (
                                                <div key={index} className="w-6 h-6 rounded-full relative overflow-hidden border-2 border-synqit-surface">
                                                    <Image
                                                        src={avatar}
                                                        alt={`Partner ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                            {request.partnerAvatars.length > 6 && (
                                                <div className="w-6 h-6 rounded-full bg-synqit-muted border-2 border-synqit-surface flex items-center justify-center">
                                                    <span className="text-[10px] text-synqit-muted-foreground">+{request.partnerAvatars.length - 6}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {request.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 bg-synqit-input text-synqit-muted-foreground rounded-full text-xs"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        {activeTab === 'incoming' ? (
                                            <>
                                                <button className="flex-1 py-3 bg-synqit-primary hover:bg-synqit-primary/80 text-white rounded-lg transition-colors duration-200 font-medium text-sm">
                                                    Accept Partnership
                                                </button>
                                                <button className="px-6 py-3 bg-synqit-surface/50 hover:bg-synqit-surface border border-synqit-border text-synqit-muted-foreground hover:text-white rounded-lg transition-colors duration-200 font-medium text-sm">
                                                    View Profile
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="flex-1 py-3 bg-synqit-muted hover:bg-synqit-muted/80 text-white rounded-lg transition-colors duration-200 font-medium text-sm">
                                                    Cancel Request
                                                </button>
                                                <button className="px-6 py-3 bg-synqit-surface/50 hover:bg-synqit-surface border border-synqit-border text-synqit-muted-foreground hover:text-white rounded-lg transition-colors duration-200 font-medium text-sm">
                                                    View Profile
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-synqit-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-synqit-primary" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No {activeTab} requests</h3>
                                <p className="text-synqit-muted-foreground">
                                    {activeTab === 'incoming' 
                                        ? 'You have no incoming partnership requests at the moment.'
                                        : 'You have no outgoing partnership requests at the moment.'
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 