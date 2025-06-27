export default function MessagesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-2">Messages</h2>
                <p className="text-synqit-muted-foreground">
                    Communicate with your Web3 partners and manage all your conversations in one place.
                </p>
            </div>

            {/* Coming Soon */}
            <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-synqit-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-synqit-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                    <p className="text-synqit-muted-foreground">
                        Integrated messaging system is being developed to facilitate seamless communication between partners.
                    </p>
                </div>
            </div>
        </div>
    )
} 