'use client'

import { useState } from "react"
import Image from "next/image"

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
        logo: "/images/arweave.png",
        companyLogo: "/icons/arweave.png",
        description: "Mintrise is a Web3-based Real World Asset (RWA) investment platform designed to bridge traditional...",
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
        tags: ["RWA", "DeFi", "VC"]
    },
    {
        id: "shortlet",
        name: "ShortletLagos",
        logo: "/images/shortlet-lagos.png",
        companyLogo: "/icons/shortlet-lagos.png",
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
        tags: ["RWA", "DeFi"]
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
        tags: ["RWA", "DeFi"]
    },
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
        tags: ["RWA", "DeFi"]
    }
]

const filterOptions = {
    projectType: ["Metaverse", "DeFi", "NFT", "Gaming", "Infrastructure"],
    projectStage: ["Idea Stage", "Development", "Launch", "Scaling"],
    blockchain: ["Ethereum", "Polygon", "Solana", "Binance", "Avalanche"],
    tokenAvailability: ["No Token Yet", "Token Available", "Coming Soon"],
    rewardModel: ["Airdrops", "Revenue Share", "Token Allocation", "Equity"],
    fundingStatus: ["Pre-Seed", "Seed", "Series A", "Series B"],
    teamSize: ["1-10", "11-50", "51-100", "100+"],
    mainFocus: ["DeFi", "GameFi", "SocialFi", "Infrastructure"]
}

const tabs = [
    "Trending Now",
    "Recent Partnership", 
    "Socials",
    "New Projects",
    "RWA Projects",
    "Web3 projects",
    "VCs",
    "Builders"
]

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filters, setFilters] = useState({
        projectType: "Metaverse",
        projectStage: "Idea Stage", 
        blockchain: "Ethereum",
        tokenAvailability: "No Token Yet",
        rewardModel: "Airdrops",
        fundingStatus: "Pre-Seed",
        teamSize: "1-10",
        mainFocus: "DeFi"
    })
    const [activeTab, setActiveTab] = useState("Trending Now")
    const [currentPage, setCurrentPage] = useState(1)
    const [resultsPerPage, setResultsPerPage] = useState(50)

    return (
        <div className="space-y-6">
            {/* Header Badge */}
            <div className="flex justify-start">
                <div className="flex items-center gap-2 bg-[#1a1f2e] border border-gray-700 rounded-full px-4 py-2">
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                        </svg>
                    </div>
                    <span className="text-white text-sm font-medium">Explore SynQit</span>
                </div>
            </div>

            {/* Main Header */}
            <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    Explore Web3 Partnerships Tailored to Your Vision.
                </h1>
                <p className="text-gray-400 text-lg">
                    Discover, Connect, Collaborate – Find the Perfect Web3 Partnership!
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
                <div className="flex items-center gap-3 bg-[#1a1f2e] border border-gray-700 rounded-xl px-5 py-3.5">
                    <Image 
                        src="/icons/synqit.png" 
                        alt="Synqit AI" 
                        width={24} 
                        height={24} 
                        className="rounded"
                    />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search projects, VCs, or builders... (AI-powered suggestions)"
                        className="flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none text-sm"
                    />
                </div>
            </div>

            {/* Status Messages */}
            <div className="space-y-1">
                <p className="text-gray-400 text-sm italic">Refining Results...</p>
                <p className="text-gray-400 text-sm">
                    <span className="italic">SynQit AI suggests Partners that Matches your Profile</span> <span className="font-medium">(Coming Soon!)</span>
                </p>
            </div>

            {/* AI Suggestions Placeholder */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-500/20 rounded-full animate-pulse"></div>
                <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-pulse"></div>
                <div className="w-8 h-8 bg-gray-500/20 rounded-full animate-pulse"></div>
                <div className="w-8 h-8 bg-green-500/20 rounded-full animate-pulse"></div>
                <div className="w-8 h-8 bg-purple-500/20 rounded-full animate-pulse"></div>
            </div>

            {/* Filters Container */}
            <div className="space-y-4">
                {/* Filter Row with horizontal scroll */}
                <div className="relative">
                    <div className="flex items-start gap-4 overflow-x-auto scrollbar-hide pb-2">
                        <div className="flex gap-3 flex-nowrap">
                            {/* Project Type */}
                            <div className="min-w-[180px]">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Project Type</label>
                                <select 
                                    value={filters.projectType}
                                    onChange={(e) => setFilters({...filters, projectType: e.target.value})}
                                    className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {filterOptions.projectType.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Project Stage */}
                            <div className="min-w-[180px]">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Project Stage</label>
                                <select 
                                    value={filters.projectStage}
                                    onChange={(e) => setFilters({...filters, projectStage: e.target.value})}
                                    className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {filterOptions.projectStage.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Blockchain Network */}
                            <div className="min-w-[180px]">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Blockchain Network</label>
                                <select 
                                    value={filters.blockchain}
                                    onChange={(e) => setFilters({...filters, blockchain: e.target.value})}
                                    className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {filterOptions.blockchain.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Token Availability */}
                            <div className="min-w-[180px]">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Token Availability</label>
                                <select 
                                    value={filters.tokenAvailability}
                                    onChange={(e) => setFilters({...filters, tokenAvailability: e.target.value})}
                                    className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {filterOptions.tokenAvailability.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Reward Model */}
                            <div className="min-w-[180px]">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Reward Model</label>
                                <select 
                                    value={filters.rewardModel}
                                    onChange={(e) => setFilters({...filters, rewardModel: e.target.value})}
                                    className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {filterOptions.rewardModel.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Funding Status */}
                            <div className="min-w-[180px]">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Funding Status</label>
                                <select 
                                    value={filters.fundingStatus}
                                    onChange={(e) => setFilters({...filters, fundingStatus: e.target.value})}
                                    className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {filterOptions.fundingStatus.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Team Size */}
                            <div className="min-w-[180px]">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Team Size</label>
                                <select 
                                    value={filters.teamSize}
                                    onChange={(e) => setFilters({...filters, teamSize: e.target.value})}
                                    className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {filterOptions.teamSize.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Main Focus */}
                            <div className="min-w-[180px]">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Main Focus</label>
                                <select 
                                    value={filters.mainFocus}
                                    onChange={(e) => setFilters({...filters, mainFocus: e.target.value})}
                                    className="w-full bg-[#1a1f2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {filterOptions.mainFocus.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Action buttons - fixed position */}
                        <div className="flex gap-3 items-end flex-shrink-0 ml-4">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors whitespace-nowrap">
                                Apply Filter
                            </button>
                            <button className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap">
                                Clear Filter
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                            activeTab === tab
                                ? "bg-blue-600 text-white"
                                : "text-gray-400 hover:text-white hover:bg-[#1a1f2e]"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {partners.map((partner) => (
                    <div key={partner.id} className="bg-[#1a1f2e] border border-gray-800 rounded-2xl overflow-hidden flex flex-col hover:border-gray-700 transition-colors">
                        {/* Banner Image */}
                        <div className="relative h-20 w-full bg-white">
                            <Image
                                src={partner.logo}
                                alt={`${partner.name} banner`}
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
                                        src={partner.companyLogo}
                                        alt={`${partner.name} logo`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <h3 className="font-semibold text-white">{partner.name}</h3>
                            </div>

                            {/* Description */}
                            <p className="text-gray-400 text-sm mb-4 flex-grow line-clamp-3">
                                {partner.description}
                            </p>

                            {/* Request Type */}
                            <div className="flex items-center gap-2 mb-3">
                                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64513 7.17116V2.97116C8.64513 1.99116 8.1143 1.79283 7.4668 2.52783L7.00013 3.05866L3.05096 7.55033C2.50846 8.16283 2.73596 8.66449 3.55263 8.66449H5.35513V12.8645C5.35513 13.8445 5.88596 14.0428 6.53346 13.3078L7.00013 12.777L10.9493 8.28533C11.4918 7.67283 11.2643 7.17116 10.4476 7.17116H8.64513Z" fill="#6B7280" />
                                </svg>
                                <span className="text-sm text-gray-400">Request Type: {partner.requestType}</span>
                            </div>

                            {/* Partners */}
                            <div className="mb-3 flex items-center gap-2">
                                <p className="text-sm text-gray-400">Partners:</p>
                                <div className="flex -space-x-2">
                                    {partner.partnerAvatars.slice(0, 6).map((avatar, index) => (
                                        <div key={index} className="w-6 h-6 rounded-full relative overflow-hidden border-2 border-[#1a1f2e]">
                                            <Image
                                                src={avatar}
                                                alt={`Partner ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                    {partner.partnerAvatars.length > 6 && (
                                        <div className="w-6 h-6 rounded-full bg-gray-700 border-2 border-[#1a1f2e] flex items-center justify-center">
                                            <span className="text-[10px] text-gray-300">+{partner.partnerAvatars.length - 6}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-5">
                                {partner.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* View Details Button */}
                            <button className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors duration-200 font-medium text-sm">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Result per page</span>
                        <select 
                            value={resultsPerPage}
                            onChange={(e) => setResultsPerPage(Number(e.target.value))}
                            className="bg-[#1a1f2e] border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={200}>200</option>
                        </select>
                    </div>
                    <span className="text-gray-400 text-sm">1-50 of 1,250</span>
                </div>

                <div className="flex items-center gap-1">
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-[#1a1f2e] rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-[#1a1f2e] rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-[#1a1f2e] rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white hover:bg-[#1a1f2e] rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}