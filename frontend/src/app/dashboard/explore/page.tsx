'use client'

import React, { useState } from 'react'
import { Search, ChevronDown, X, Star } from 'lucide-react'

// Mock data for projects
const mockProjects = [
    {
        id: 1,
        name: 'Arweave',
        domain: 'arweave.org',
        description: 'Mintrise is a Web3-based Real World Asset (RWA) investment platform designed to bri...',
        requestType: 'Partnership',
        partners: [
            '/api/placeholder/20/20',
            '/api/placeholder/20/20',
            '/api/placeholder/20/20',
            '/api/placeholder/20/20',
            '/api/placeholder/20/20'
        ],
        tags: ['RWA', 'DeFi', 'VC'],
        logo: '/api/placeholder/40/40',
        banner: '/api/placeholder/300/60'
    },
    {
        id: 2,
        name: 'ShortletLagos',
        domain: 'shortlet.com',
        description: 'Starts with a collection of 10,000 avatars that give you membership access.',
        requestType: 'Partnership',
        partners: [
            '/api/placeholder/20/20',
            '/api/placeholder/20/20',
            '/api/placeholder/20/20',
            '/api/placeholder/20/20'
        ],
        tags: ['RWA', 'DeFi'],
        logo: '/api/placeholder/40/40',
        banner: '/api/placeholder/300/60'
    },
    {
        id: 3,
        name: 'Aave',
        domain: 'aave.com',
        description: 'Starts with a collection of 10,000 avatars that give you membership access.',
        requestType: 'Partnership',
        partners: [
            '/api/placeholder/20/20',
            '/api/placeholder/20/20',
            '/api/placeholder/20/20'
        ],
        tags: ['RWA', 'DeFi'],
        logo: '/api/placeholder/40/40',
        banner: '/api/placeholder/300/60'
    },
    {
        id: 4,
        name: 'Audius',
        domain: 'audius.co',
        description: 'Starts with a collection of 10,000 avatars that give you membership access.',
        requestType: 'Partnership',
        partners: [
            '/api/placeholder/20/20',
            '/api/placeholder/20/20',
            '/api/placeholder/20/20',
            '/api/placeholder/20/20',
            '/api/placeholder/20/20'
        ],
        tags: ['RWA', 'DeFi'],
        logo: '/api/placeholder/40/40',
        banner: '/api/placeholder/300/60'
    }
]

const filterTabs = [
    'Trending Now',
    'Recent Partnership',
    'Socials',
    'New Projects',
    'RWA Projects',
    'Web3 projects',
    'VCs',
    'DeFi'
]

export default function ExplorePage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('Trending Now')
    const [filters, setFilters] = useState({
        projectType: 'Metaverse',
        projectStage: 'Idea Stage',
        blockchain: 'Ethereum',
        tokenAvailability: 'No Token Yet',
        rewardModel: 'Airdrops'
    })
    const [showFilters, setShowFilters] = useState(false)

    const handleFilterChange = (filterType: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }))
    }

    const clearFilters = () => {
        setFilters({
            projectType: '',
            projectStage: '',
            blockchain: '',
            tokenAvailability: '',
            rewardModel: ''
        })
    }

    return (
        <div className="min-h-screen bg-[#0B1426] text-white">
            {/* Header */}
            <div className="border-b border-gray-800 px-6 py-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#1E3A8A] px-3 py-1.5 rounded-full">
                        <Star className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium">Explore Synqit</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8">
                {/* Title and Description */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Explore Web3 Partnerships Tailored to Your Vision.
                    </h1>
                    <p className="text-gray-400">
                        Discover, Connect, Collaborate – Find the Perfect Web3 Partnership!
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <div className="flex items-center bg-[#1A2332] border border-gray-700 rounded-lg px-4 py-3">
                        <Search className="w-5 h-5 text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Search projects, VCs, or builders... (AI-powered suggestions)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                        />
                    </div>
                </div>

                {/* Refining Results */}
                <div className="mb-6">
                    <p className="text-gray-400 italic mb-2">Refining Results...</p>
                    <p className="text-gray-300">
                        SynQit AI suggests Partners that Matches your Profile{' '}
                        <span className="text-blue-400">(Coming Soon!)</span>
                    </p>

                    {/* Loading dots animation */}
                    <div className="flex items-center gap-2 mt-4">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-full animate-pulse ${i === 0 ? 'bg-pink-400' :
                                        i === 1 ? 'bg-blue-400' :
                                            i === 2 ? 'bg-purple-400' :
                                                i === 3 ? 'bg-gray-500' :
                                                    'bg-green-400'
                                    }`}
                                style={{
                                    animationDelay: `${i * 0.2}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <div className="grid grid-cols-5 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Project Type</label>
                            <select
                                value={filters.projectType}
                                onChange={(e) => handleFilterChange('projectType', e.target.value)}
                                className="w-full bg-[#1A2332] border border-gray-700 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="Metaverse">Metaverse</option>
                                <option value="DeFi">DeFi</option>
                                <option value="NFT">NFT</option>
                                <option value="Gaming">Gaming</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Project Stage</label>
                            <select
                                value={filters.projectStage}
                                onChange={(e) => handleFilterChange('projectStage', e.target.value)}
                                className="w-full bg-[#1A2332] border border-gray-700 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="Idea Stage">Idea Stage</option>
                                <option value="Development">Development</option>
                                <option value="Beta">Beta</option>
                                <option value="Launch">Launch</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Blockchain Network</label>
                            <select
                                value={filters.blockchain}
                                onChange={(e) => handleFilterChange('blockchain', e.target.value)}
                                className="w-full bg-[#1A2332] border border-gray-700 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="Ethereum">Ethereum</option>
                                <option value="Polygon">Polygon</option>
                                <option value="Solana">Solana</option>
                                <option value="BSC">BSC</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Token Availability</label>
                            <select
                                value={filters.tokenAvailability}
                                onChange={(e) => handleFilterChange('tokenAvailability', e.target.value)}
                                className="w-full bg-[#1A2332] border border-gray-700 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="No Token Yet">No Token Yet</option>
                                <option value="Has Token">Has Token</option>
                                <option value="Coming Soon">Coming Soon</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Reward Model</label>
                            <select
                                value={filters.rewardModel}
                                onChange={(e) => handleFilterChange('rewardModel', e.target.value)}
                                className="w-full bg-[#1A2332] border border-gray-700 rounded-lg px-3 py-2 text-white"
                            >
                                <option value="Airdrops">Airdrops</option>
                                <option value="Revenue Share">Revenue Share</option>
                                <option value="Equity">Equity</option>
                                <option value="Token Share">Token Share</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="bg-[#4F46E5] hover:bg-[#4338CA] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Apply Filter
                        </button>
                        <button
                            onClick={clearFilters}
                            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                            Clear Filter
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab
                                    ? 'bg-[#4F46E5] text-white'
                                    : 'bg-[#1A2332] text-gray-300 hover:bg-[#2A3441]'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Project Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {mockProjects.map((project) => (
                        <div key={project.id} className="bg-[#1A2332] rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-colors">
                            {/* Project Banner */}
                            <div className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                                <span className="text-lg font-bold">{project.name.charAt(0)}</span>
                            </div>

                            {/* Card Content */}
                            <div className="p-4">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                                        <span className="text-xs font-bold">{project.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">{project.name}</h3>
                                        <p className="text-xs text-gray-400">{project.domain}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs text-gray-300 mb-3 line-clamp-2">
                                    {project.description}
                                </p>

                                {/* Request Type */}
                                <div className="flex items-center gap-1 mb-3">
                                    <div className="w-3 h-3 bg-gray-400">
                                        <svg viewBox="0 0 12 12" fill="currentColor">
                                            <path d="M6 2L8 6L6 10L4 6Z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-400">Request Type: {project.requestType}</span>
                                </div>

                                {/* Partners */}
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xs text-gray-400">Partners:</span>
                                    <div className="flex -space-x-1">
                                        {project.partners.slice(0, 5).map((partner, index) => (
                                            <div key={index} className="w-5 h-5 bg-gray-600 rounded-full border border-gray-700" />
                                        ))}
                                        {project.partners.length > 5 && (
                                            <div className="w-5 h-5 bg-blue-600 rounded-full border border-gray-700 flex items-center justify-center">
                                                <span className="text-xs">+</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex gap-1 mb-4">
                                    {project.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-1 bg-[#2A3441] text-xs rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* View Details Button */}
                                <button className="w-full py-2 bg-[#4F46E5]/20 hover:bg-[#4F46E5]/30 text-[#4F46E5] rounded-lg text-sm font-medium transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-400">Result per page</span>
                        <select className="bg-[#1A2332] border border-gray-700 rounded px-2 py-1 text-sm">
                            <option>50</option>
                            <option>100</option>
                            <option>200</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">1-50 of 1250</span>
                        <div className="flex gap-1">
                            <button className="p-1 hover:bg-gray-700 rounded">
                                <ChevronDown className="w-4 h-4 rotate-90" />
                            </button>
                            <button className="p-1 hover:bg-gray-700 rounded">
                                <ChevronDown className="w-4 h-4 -rotate-90" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}