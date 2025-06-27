export default function ProfilePage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-2">Profile Settings</h2>
                <p className="text-synqit-muted-foreground">
                    Manage your account information and Web3 collaboration preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-synqit-muted-foreground mb-2">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your first name"
                                        className="w-full px-4 py-3 bg-synqit-input border border-synqit-border rounded-lg text-white placeholder:text-synqit-muted-foreground focus:outline-none focus:ring-2 focus:ring-synqit-primary focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-synqit-muted-foreground mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your last name"
                                        className="w-full px-4 py-3 bg-synqit-input border border-synqit-border rounded-lg text-white placeholder:text-synqit-muted-foreground focus:outline-none focus:ring-2 focus:ring-synqit-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-synqit-muted-foreground mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-3 bg-synqit-input border border-synqit-border rounded-lg text-white placeholder:text-synqit-muted-foreground focus:outline-none focus:ring-2 focus:ring-synqit-primary focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-synqit-muted-foreground mb-2">Bio</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about yourself and your Web3 expertise..."
                                    className="w-full px-4 py-3 bg-synqit-input border border-synqit-border rounded-lg text-white placeholder:text-synqit-muted-foreground focus:outline-none focus:ring-2 focus:ring-synqit-primary focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Skills & Interests */}
                    <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Skills & Interests</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-synqit-muted-foreground mb-2">Areas of Expertise</label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {["DeFi", "NFT", "Smart Contracts", "Blockchain Development"].map((skill) => (
                                        <span key={skill} className="bg-synqit-primary/20 text-synqit-primary px-3 py-1 rounded-full text-sm">
                                            {skill} ×
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Add a skill and press Enter"
                                    className="w-full px-4 py-3 bg-synqit-input border border-synqit-border rounded-lg text-white placeholder:text-synqit-muted-foreground focus:outline-none focus:ring-2 focus:ring-synqit-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-6 text-center">
                        <div className="w-24 h-24 bg-synqit-primary rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-medium text-white">U</span>
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2">Profile Picture</h4>
                        <button className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-4 py-2 rounded-lg text-sm font-medium">
                            Upload Photo
                        </button>
                    </div>

                    {/* Account Status */}
                    <div className="bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Account Status</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-synqit-muted-foreground">Email Verified</span>
                                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">Pending</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-synqit-muted-foreground">Profile Complete</span>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">75%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-synqit-muted-foreground">KYC Status</span>
                                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">Required</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <button className="w-full bg-synqit-primary hover:bg-synqit-primary/80 text-white px-6 py-3 rounded-lg font-medium">
                            Save Changes
                        </button>
                        <button className="w-full bg-transparent border border-synqit-border text-white hover:bg-synqit-surface/20 px-6 py-3 rounded-lg font-medium">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 