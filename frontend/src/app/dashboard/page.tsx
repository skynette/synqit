"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome to Synqit Dashboard</h2>
                <p className="text-synqit-muted-foreground">
                    Manage your Web3 collaborations and projects from one central location.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-synqit-muted-foreground">Active Projects</p>
                            <p className="text-2xl font-bold text-white">12</p>
                        </div>
                        <div className="p-3 bg-synqit-primary/20 rounded-lg">
                            <svg className="w-6 h-6 text-synqit-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-synqit-muted-foreground">Collaborators</p>
                            <p className="text-2xl font-bold text-white">34</p>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-synqit-muted-foreground">Messages</p>
                            <p className="text-2xl font-bold text-white">156</p>
                        </div>
                        <div className="p-3 bg-yellow-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-synqit-muted-foreground">Completed Deals</p>
                            <p className="text-2xl font-bold text-white">8</p>
                        </div>
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-synqit-input/50 rounded-lg">
                        <div className="w-10 h-10 bg-synqit-primary rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">New collaboration request from @web3dev</p>
                            <p className="text-sm text-synqit-muted-foreground">2 hours ago</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-synqit-input/50 rounded-lg">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">Project "DeFi Dashboard" completed</p>
                            <p className="text-sm text-synqit-muted-foreground">1 day ago</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 bg-synqit-input/50 rounded-lg">
                        <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium">Profile verification pending</p>
                            <p className="text-sm text-synqit-muted-foreground">3 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 