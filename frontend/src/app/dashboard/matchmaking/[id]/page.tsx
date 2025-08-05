'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { dashboardApi, projectApi } from "@/lib/api-client"
import { useAuth } from "@/hooks/use-auth"
import type { Partnership, Project } from "@/lib/api-client"

interface PartnerProfileProps {
    params: Promise<{
        id: string
    }>
}

export default function PartnerProfilePage({ params }: PartnerProfileProps) {
    const router = useRouter()
    const { user } = useAuth()
    const [partnership, setPartnership] = useState<Partnership | null>(null)
    const [partnerProject, setPartnerProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchPartnershipDetails() {
            try {
                setLoading(true)
                const { id } = await params

                // Fetch partnership details
                const partnershipData = await dashboardApi.getPartnershipById(id)
                setPartnership(partnershipData)

                // Determine which project to show (the partner's project)
                const currentUserId = user?.id
                if (!currentUserId) {
                    setError('User not authenticated')
                    return
                }
                const isIncoming = partnershipData.receiverId === currentUserId
                const partnerProjectId = isIncoming
                    ? partnershipData.requesterProject?.id
                    : partnershipData.receiverProject?.id

                // Fetch partner's project details if available
                if (partnerProjectId) {
                    try {
                        const projectData = await projectApi.getProjectById(partnerProjectId)
                        setPartnerProject(projectData)
                    } catch (projectError) {
                        console.warn('Could not fetch partner project details:', projectError)
                    }
                }
            } catch (err: any) {
                console.error('Error fetching partnership details:', err)
                setError('Failed to load partnership details')
            } finally {
                setLoading(false)
            }
        }

        fetchPartnershipDetails()
    }, [params])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1426] p-6">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white">Loading partnership details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !partnership) {
        return (
            <div className="min-h-screen bg-[#0B1426] p-6">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">Partnership Not Found</h1>
                        <p className="text-gray-400 mb-6">
                            {error || "The partnership you're looking for doesn't exist or has been removed."}
                        </p>
                        <button
                            onClick={() => router.back()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Determine partner info
    const currentUserId = user?.id
    if (!currentUserId) {
        return (
            <div className="min-h-screen bg-[#0B1426] p-6">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
                        <p className="text-gray-400 mb-6">
                            Please log in to view partnership details.
                        </p>
                        <button
                            onClick={() => router.push('/auth')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const isIncoming = partnership.receiverId === currentUserId
    const partner = isIncoming ? partnership.requester : partnership.receiver
    const partnerProjectInfo = isIncoming ? partnership.requesterProject : partnership.receiverProject

    if (!partner) {
        return (
            <div className="min-h-screen bg-[#0B1426] flex items-center justify-center">
                <div className="text-center text-white">
                    <p>Partner information not available</p>
                    <button
                        onClick={() => router.back()}
                        className="mt-4 text-blue-500 hover:underline"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0B1426]">
            {/* Header */}
            <div className="flex justify-between items-center p-6">
                <div></div>
                <button
                    onClick={() => router.back()}
                    className="bg-[#2A3441] hover:bg-[#374151] text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                    Back
                </button>
            </div>

            {/* Hero Section with Banner */}
            <div className="relative">
                {/* Banner Image - Using actual image instead of gradient */}
                <div className="h-64 relative overflow-hidden">
                    {partnerProject?.bannerUrl ? (
                        <Image
                            src={partnerProject.bannerUrl}
                            alt="Banner"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        // Fallback pattern background
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700">
                            <div className="absolute inset-0" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }} />
                        </div>
                    )}

                    {/* Verified Badge */}
                    <div className="absolute top-4 right-4">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Verified
                        </div>
                    </div>
                </div>

                {/* Profile Section Overlay */}
                <div className="relative -mt-16 px-6">
                    <div className="bg-[#1E2837] rounded-2xl p-6 border border-[#374151]">
                        <div className="flex items-start gap-6">
                            {/* Profile Image - No ring around it */}
                            <div className="w-24 h-24 relative rounded-full bg-[#1E2837] flex-shrink-0">
                                {partnerProject?.logoUrl ? (
                                    <Image
                                        src={partnerProject.logoUrl}
                                        alt="Logo"
                                        fill
                                        className="object-contain rounded-full p-2"
                                    />
                                ) : partner.profileImage ? (
                                    <Image
                                        src={partner.profileImage}
                                        alt="Profile"
                                        fill
                                        className="object-cover rounded-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-2xl">
                                            {partner.firstName.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-white mb-2">
                                    {partnerProjectInfo?.name || `${partner.firstName} ${partner.lastName}`}
                                </h1>

                                {/* Stats */}
                                <div className="flex items-center gap-6 mb-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">👥</span>
                                        <span className="text-white font-medium">61.2K</span>
                                        <span className="text-gray-400">followers</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">⚡</span>
                                        <span className="text-white font-medium">13.3K</span>
                                    </div>
                                </div>

                                {/* Compatibility Score - Blue border with dark green number bg */}
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-gray-400 text-sm">Compatibility Score</span>
                                    <div className="border border-blue-500 rounded-full px-3 py-1 flex items-center gap-2">
                                        <span className="text-white text-sm">48</span>
                                        <div className="bg-green-700 text-white px-2 py-0.5 rounded text-xs font-medium">
                                            %
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-400 mb-4 max-w-2xl text-sm">
                                    {partnerProject?.description || partnership.description ||
                                        "Mintrise is a Web3-based Real World Asset (RWA) investment platform designed to bridge traditional real estate investment with decentralized finance (DeFi)."}
                                </p>

                                {/* Request Type */}
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-400">⚡</span>
                                    <span className="text-white text-sm">Request Type: {partnership.partnershipType}</span>
                                </div>
                            </div>

                            {/* Right Side Actions - Row layout instead of column */}
                            <div className="flex gap-3">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                                    Cancel Request
                                </button>
                                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                                    Following ✓
                                </button>
                            </div>
                        </div>

                        {/* Partnership Stats - Stacked together */}
                        <div className="flex gap-4 mt-4">
                            <div className="border border-blue-500 rounded-full px-4 py-2 flex items-center gap-2">
                                <span className="text-white text-sm">Total Partnership</span>
                                <div className="bg-green-700 text-white px-2 py-1 rounded text-xs font-medium">
                                    18th
                                </div>
                            </div>
                            <div className="border border-blue-500 rounded-full px-4 py-2 flex items-center gap-2">
                                <span className="text-white text-sm">Active Collabs</span>
                                <div className="bg-green-700 text-white px-2 py-1 rounded text-xs font-medium">
                                    18th
                                </div>
                            </div>
                        </div>

                        {/* Partners Icons - Using actual images instead of gradients */}
                        <div className="flex items-center gap-2 mt-4">
                            <span className="text-white text-sm mr-2">Partners</span>
                            <div className="flex gap-1">
                                {/* These would be actual partner images */}
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-8 h-8 bg-gray-600 rounded-full overflow-hidden">
                                        {/* Replace with actual Image components when you have the URLs */}
                                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">{i}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="w-8 h-8 bg-[#374151] rounded-full flex items-center justify-center text-xs text-white">
                                    +10
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex gap-2 mt-4">
                            <span className="bg-[#374151] text-gray-300 px-3 py-1 rounded-full text-sm">RWA</span>
                            <span className="bg-[#374151] text-gray-300 px-3 py-1 rounded-full text-sm">DeFi</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Links Section - All icons with same background color */}
            <div className="px-6 mt-8">
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-[#1E2837] border border-[#374151] rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#374151] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-white font-medium">Twitter</div>
                                <div className="text-sm text-green-400">18.2k ↗ 1.20%</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1E2837] border border-[#374151] rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#374151] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-white font-medium">Discord</div>
                                <div className="text-sm text-green-400">1430 users ↗ 1.20%</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1E2837] border border-[#374151] rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#374151] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-white font-medium">Facebook</div>
                                <div className="text-sm text-red-400">25.4k ↘ 2.84%</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1E2837] border border-[#374151] rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#374151] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-white font-medium">Website</div>
                                <div className="text-sm text-green-400">Active ↗ 1.20%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rest of the content remains the same... */}
            {/* Two Column Layout */}
            <div className="px-6 mt-8 grid grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="col-span-2 space-y-8">
                    {/* About Arweave */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">About Arweave</h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Project Description:</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Arweave is a decentralized storage protocol that offers permanent and tamper-proof data storage on the blockchain. Unlike traditional cloud services, Arweave enables users to store information permanently with a single upfront payment, ensuring data persistence, security, and accessibility over time.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">What We Offer for Partnerships:</h3>
                                <p className="text-gray-400 leading-relaxed mb-4">
                                    Arweave is being used in countless different ways. Take your first steps with the power of permanent data storage by uploading a file, making your own homepage on the permaweb or simply learning more about Arweave and its ecosystem.
                                </p>
                                <div className="space-y-1 text-gray-400">
                                    <p><strong>Blockchain Used:</strong> Arweave Blockchain</p>
                                    <p><strong>Industry Focus:</strong> 🏠 Real Estate | 📦 DeFi | 🌐 RWA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Arweave Section with Banner */}
                    <div className="bg-[#1E2837] border border-[#374151] rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">🌐</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Arweave</h3>
                                <p className="text-blue-400">A Web3-powered investment platform transforming real-world assets (RWA) into fractional ownership opportunities.</p>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-4">
                            Arweave is a decentralized storage protocol that offers permanent and tamper-proof data storage on the blockchain. Unlike traditional cloud services, Arweave enables users to store information permanently with a single upfront payment, ensuring data persistence, security, and accessibility over time.
                        </p>
                        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Visit Mintrise Website
                        </a>
                    </div>

                    {/* Partnership Details */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">Partnership Details</h2>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                                    💼 Who Can Partner With Us?
                                </h4>
                                <div className="space-y-2 text-gray-400">
                                    <p>Marketing Projects → Looking for strategic co-branding</p>
                                    <p>DeFi Protocols → Seeking integrations (staking, lending, etc.)</p>
                                    <p>Web3 Communities → Interested in joint AMAs & collaborations</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                                    💝 Preferred Partner Type:
                                </h4>
                                <div className="space-y-1 text-gray-400">
                                    <p>Cross-Marketing ✅</p>
                                    <p>Platform Integration ✅</p>
                                    <p>Joint Events & AMAs ✅</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Eligibility & Requirements */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">Eligibility & Requirements</h2>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-white font-medium mb-3">📋 Requirements to Join:</h4>
                                <div className="space-y-2 text-gray-400">
                                    <p>✅ Must be a verified Web3 project</p>
                                    <p>✅ Have an active community (Telegram, Discord, Twitter)</p>
                                    <p>✅ Must align with Mintrise's ecosystem goals</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-medium mb-3">📞 How to Apply:</h4>
                                <div className="space-y-1 text-gray-400">
                                    <p>Click "Request Partnership" to send a connection request</p>
                                    <p>Mintrise will review and approve based on alignment</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Partnership Status & Activity */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">Partnership Status & Activity</h2>

                        <div className="space-y-4">
                            <p className="text-gray-400">📅 Upcoming Joint Events: (Event List)</p>
                            <p className="text-gray-400">📢 Recent Announcements: Follow social media account to get updated</p>

                            <div>
                                <h4 className="text-white font-medium mb-3">🤝 Active Collaborations:</h4>
                                <div className="flex gap-4">
                                    {['ShortLegagos', 'Mintrise', 'We3oost', 'TechExplore', 'We3oost'].map((name, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-[#1E2837] rounded-full px-3 py-1 border border-[#374151]">
                                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full"></div>
                                            <span className="text-sm text-white">{name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call-to-Action */}
                    <div className="py-8">
                        <h2 className="text-2xl font-bold text-white mb-4 flex gap-2">
                            🚀 Call-to-Action (CTA)
                        </h2>
                        <p className="text-gray-400 mb-6 max-w-2xl">
                            Partner with Mintrise & Shape the Future of Web3 Real Estate!
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors mb-6">
                            Apply for Partnership
                        </button>
                        <p className="text-gray-400 mb-6">
                            Not ready yet? Follow Mintrise for updates!
                        </p>

                        {/* Social Media Icons */}
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* How to Apply */}
                    <div className="bg-[#1E2837] border border-[#374151] rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4">How to Apply for Partnership</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                                <p className="text-gray-300 text-sm">Apply to Collaborate Above</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                                <p className="text-gray-300 text-sm">Wait for an email if you match our preferences</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                                <p className="text-gray-300 text-sm">Complete the onboarding</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
                                <div>
                                    <span className="text-gray-300 text-sm">Join Team</span>
                                    <span className="text-white text-sm ml-1">and have fun!</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Follow Section */}
                    <div className="bg-[#1E2837] border border-[#374151] rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h4 className="text-white font-medium">Follow Mintrise on SynQit</h4>
                                <p className="text-gray-400 text-sm">Stay updated with company's news & trend</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white text-sm">+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}