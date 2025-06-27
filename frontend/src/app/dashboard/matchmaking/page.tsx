export default function MatchmakingPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-2">Matchmaking & Requests</h2>
                <p className="text-synqit-muted-foreground">
                    Discover and connect with potential Web3 partners through AI-powered matchmaking.
                </p>
            </div>

            {/* Coming Soon */}
            <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-synqit-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-synqit-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7.5h-3A1.5 1.5 0 0 0 14.04 8.37L11.5 16H14v6h6zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zm-2 5.5H8.5l1.04-3.12c-.24-.66-.78-1.12-1.54-1.12S6.24 13.22 6 13.88L4.5 17H2v2h3.5l1.5-4.5L8.5 17h2v-1z"/>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                    <p className="text-synqit-muted-foreground">
                        Advanced matchmaking features are being developed to help you find the perfect Web3 collaboration partners.
                    </p>
                </div>
            </div>
        </div>
    )
} 