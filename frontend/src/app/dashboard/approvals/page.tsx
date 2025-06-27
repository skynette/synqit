'use client'

import { useState } from "react"
import Image from "next/image"

interface ApprovedPartner {
    id: string
    name: string
    logo: string
    requestType: string
    tags: string[]
}

const approvedPartners: ApprovedPartner[] = [
    {
        id: "ens",
        name: "ENS",
        logo: "/icons/synqit.png",
        requestType: "Partnership",
        tags: ["RWA", "DeFi"]
    },
    {
        id: "lens",
        name: "Lens",
        logo: "/icons/synqit.png",
        requestType: "Partnership", 
        tags: ["RWA", "DeFi"]
    },
    {
        id: "arweave",
        name: "Arweave",
        logo: "/icons/arweave.png",
        requestType: "Partnership",
        tags: ["RWA", "DeFi"]
    },
    {
        id: "safe",
        name: "Safe",
        logo: "/icons/synqit.png",
        requestType: "Partnership",
        tags: ["RWA", "DeFi"]
    },
    {
        id: "polkadot",
        name: "Polkadot",
        logo: "/icons/synqit.png",
        requestType: "Partnership",
        tags: ["RWA", "DeFi"]
    },
    {
        id: "thegraph",
        name: "TheGraph",
        logo: "/icons/synqit.png",
        requestType: "Partnership",
        tags: ["RWA", "DeFi"]
    }
]

const filterOptions = {
    category: ["All Categories", "DeFi", "NFT", "Gaming", "Infrastructure"],
    blockchain: ["All Blockchains", "Ethereum", "Polygon", "Solana", "Binance"],
    partnershipType: ["All Types", "Technical", "Business", "Strategic", "Investment"]
}

export default function ApprovalsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filters, setFilters] = useState({
        category: "All Categories",
        blockchain: "All Blockchains", 
        partnershipType: "All Types"
    })
    const [resultsPerPage, setResultsPerPage] = useState(50)

    const filteredPartners = approvedPartners.filter(partner =>
        partner.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

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
                    Partnership Approval List
                </h1>
                <p className="text-synqit-muted-foreground text-lg">
                    View and manage your approved partnerships here.
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
                <div className="flex items-center gap-3 bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-xl px-5 py-3.5">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for partner"
                        className="flex-1 bg-transparent text-white placeholder:text-synqit-muted-foreground focus:outline-none text-sm"
                    />
                    <svg className="w-5 h-5 text-synqit-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 overflow-x-auto">
                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Category Filter */}
                    <div className="min-w-[140px]">
                        <select 
                            value={filters.category}
                            onChange={(e) => setFilters({...filters, category: e.target.value})}
                            className="w-full bg-synqit-surface border border-synqit-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-synqit-primary appearance-none"
                        >
                            {filterOptions.category.map(option => (
                                <option key={option} value={option}>
                                    {option === "All Categories" ? "Category" : option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Blockchain Filter */}
                    <div className="min-w-[140px]">
                        <select 
                            value={filters.blockchain}
                            onChange={(e) => setFilters({...filters, blockchain: e.target.value})}
                            className="w-full bg-synqit-surface border border-synqit-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-synqit-primary appearance-none"
                        >
                            {filterOptions.blockchain.map(option => (
                                <option key={option} value={option}>
                                    {option === "All Blockchains" ? "Blockchain" : option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Partnership Type Filter */}
                    <div className="min-w-[160px]">
                        <select 
                            value={filters.partnershipType}
                            onChange={(e) => setFilters({...filters, partnershipType: e.target.value})}
                            className="w-full bg-synqit-surface border border-synqit-border rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-synqit-primary appearance-none"
                        >
                            {filterOptions.partnershipType.map(option => (
                                <option key={option} value={option}>
                                    {option === "All Types" ? "Partnership Type" : option}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Results Counter */}
                    <div className="bg-synqit-primary text-white text-sm px-3 py-2 rounded-full font-medium">
                        {filteredPartners.length}
                    </div>
                </div>
            </div>

            {/* Partners List */}
            <div className="space-y-4">
                {filteredPartners.map((partner) => (
                    <div key={partner.id} className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-xl p-5 flex items-center justify-between hover:border-synqit-accent/20 transition-colors">
                        {/* Left Side - Logo, Name, Info */}
                        <div className="flex items-center gap-4 flex-1">
                            {/* Company Logo */}
                            <div className="w-12 h-12 relative rounded-full bg-white p-2 flex-shrink-0">
                                <Image
                                    src={partner.logo}
                                    alt={`${partner.name} logo`}
                                    fill
                                    className="object-contain"
                                />
                            </div>

                            {/* Company Info */}
                            <div className="flex-1">
                                <h3 className="font-semibold text-white text-lg mb-2">{partner.name}</h3>
                                
                                {/* Tags */}
                                <div className="flex items-center gap-2 mb-2">
                                    {partner.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-synqit-input text-synqit-muted-foreground rounded-full text-xs"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Request Type */}
                                <div className="flex items-center gap-2">
                                    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.64513 7.17116V2.97116C8.64513 1.99116 8.1143 1.79283 7.4668 2.52783L7.00013 3.05866L3.05096 7.55033C2.50846 8.16283 2.73596 8.66449 3.55263 8.66449H5.35513V12.8645C5.35513 13.8445 5.88596 14.0428 6.53346 13.3078L7.00013 12.777L10.9493 8.28533C11.4918 7.67283 11.2643 7.17116 10.4476 7.17116H8.64513Z" fill="#CFDBE4" />
                                    </svg>
                                    <span className="text-sm text-synqit-muted-foreground">Request Type: {partner.requestType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Notification Icon and Button */}
                        <div className="flex items-center gap-4">
                            {/* Notification Icon */}
                            <button className="p-2 text-synqit-muted-foreground hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5V4a2 2 0 00-2-2H6a2 2 0 00-2 2v13l5 5h6z" />
                                </svg>
                            </button>

                            {/* View Profile Button */}
                            <button className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-6 py-2.5 rounded-lg transition-colors duration-200 font-medium text-sm">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-synqit-muted-foreground text-sm">Result per page</span>
                        <select 
                            value={resultsPerPage}
                            onChange={(e) => setResultsPerPage(Number(e.target.value))}
                            className="bg-synqit-surface border border-synqit-border rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-synqit-primary"
                        >
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={200}>200</option>
                        </select>
                    </div>
                    <span className="text-synqit-muted-foreground text-sm">1-50 of 1,250</span>
                </div>

                <div className="flex items-center gap-1">
                    <button className="p-2 text-synqit-muted-foreground hover:text-white hover:bg-synqit-surface rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="p-2 text-synqit-muted-foreground hover:text-white hover:bg-synqit-surface rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="p-2 text-synqit-muted-foreground hover:text-white hover:bg-synqit-surface rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    <button className="p-2 text-synqit-muted-foreground hover:text-white hover:bg-synqit-surface rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
} 