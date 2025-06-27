export default function ExplorePage() {
    const opportunities = [
        {
            id: 1,
            title: "DeFi Protocol Integration",
            company: "ChainLink Labs",
            type: "Technical Partnership",
            description: "Looking for blockchain developers to integrate oracle solutions into DeFi protocols.",
            tags: ["DeFi", "Oracle", "Smart Contracts"],
            matchScore: 95
        },
        {
            id: 2,
            title: "NFT Marketplace Collaboration",
            company: "OpenSea",
            type: "Business Partnership",
            description: "Seeking creative teams to build innovative NFT marketplace features and experiences.",
            tags: ["NFT", "Marketplace", "UI/UX"],
            matchScore: 88
        },
        {
            id: 3,
            title: "Web3 Gaming Platform",
            company: "Immutable X",
            type: "Strategic Alliance",
            description: "Partner with us to create next-generation blockchain gaming experiences.",
            tags: ["Gaming", "Layer 2", "NFT"],
            matchScore: 92
        }
    ]

    const trendingCategories = [
        { name: "DeFi", count: 156, growth: "+12%" },
        { name: "NFT", count: 89, growth: "+8%" },
        { name: "Gaming", count: 67, growth: "+15%" },
        { name: "Infrastructure", count: 45, growth: "+5%" },
        { name: "DAO", count: 34, growth: "+18%" },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-2">Explore Web3 Opportunities</h2>
                <p className="text-synqit-muted-foreground">
                    Discover trending collaboration opportunities and connect with innovative Web3 projects.
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-synqit-muted-foreground">Available Opportunities</p>
                            <p className="text-3xl font-bold text-white">1,247</p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-synqit-muted-foreground">Active Projects</p>
                            <p className="text-3xl font-bold text-white">892</p>
                        </div>
                        <div className="p-3 bg-synqit-primary/20 rounded-lg">
                            <svg className="w-6 h-6 text-synqit-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-synqit-muted-foreground">Your Matches</p>
                            <p className="text-3xl font-bold text-white">24</p>
                        </div>
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-synqit-muted-foreground">Success Rate</p>
                            <p className="text-3xl font-bold text-white">87%</p>
                        </div>
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trending Categories */}
            <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Trending Categories</h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {trendingCategories.map((category) => (
                        <div key={category.name} className="bg-synqit-input/50 rounded-lg p-4 text-center hover:bg-synqit-accent/20 transition-colors cursor-pointer">
                            <div className="text-2xl font-bold text-white">{category.count}</div>
                            <div className="text-sm text-synqit-muted-foreground">{category.name}</div>
                            <div className="text-xs text-green-400 mt-1">{category.growth}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Opportunities */}
            <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Top Opportunities for You</h3>
                    <button className="text-synqit-primary hover:text-synqit-accent transition-colors text-sm">
                        View All →
                    </button>
                </div>

                <div className="space-y-4">
                    {opportunities.map((opportunity) => (
                        <div key={opportunity.id} className="bg-synqit-input/50 rounded-lg p-6 hover:bg-synqit-accent/10 transition-colors cursor-pointer">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-lg font-semibold text-white">{opportunity.title}</h4>
                                        <span className="bg-synqit-primary/20 text-synqit-primary px-2 py-1 rounded-full text-xs">
                                            {opportunity.matchScore}% Match
                                        </span>
                                    </div>
                                    <p className="text-synqit-muted-foreground text-sm mb-2">{opportunity.company} • {opportunity.type}</p>
                                    <p className="text-white text-sm mb-3">{opportunity.description}</p>
                                    <div className="flex gap-2">
                                        {opportunity.tags.map((tag) => (
                                            <span key={tag} className="bg-synqit-border/30 text-synqit-muted-foreground px-2 py-1 rounded text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-4 py-2 rounded-lg text-sm font-medium ml-4">
                                    Connect
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 