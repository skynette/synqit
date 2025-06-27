export default function ApprovalsPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-2">Partnership Approvals</h2>
                <p className="text-synqit-muted-foreground">
                    Review and approve partnership requests and collaboration proposals.
                </p>
            </div>

            {/* Coming Soon */}
            <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-synqit-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-synqit-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
                    <p className="text-synqit-muted-foreground">
                        Partnership approval management system is being developed to streamline your collaboration workflow.
                    </p>
                </div>
            </div>
        </div>
    )
} 