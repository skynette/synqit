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
            <div className="min-h-screen bg-synqit-background p-6">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-synqit-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white">Loading partnership details...</p>
                    </div>
                </div>
            </div>
        )
    }
    
    if (error || !partnership) {
        return (
            <div className="min-h-screen bg-synqit-background p-6">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">Partnership Not Found</h1>
                        <p className="text-synqit-muted-foreground mb-6">
                            {error || "The partnership you're looking for doesn't exist or has been removed."}
                        </p>
                        <button 
                            onClick={() => router.back()}
                            className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-6 py-3 rounded-lg transition-colors"
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
            <div className="min-h-screen bg-synqit-background p-6">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">Authentication Required</h1>
                        <p className="text-synqit-muted-foreground mb-6">
                            Please log in to view partnership details.
                        </p>
                        <button 
                            onClick={() => router.push('/auth')}
                            className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-6 py-3 rounded-lg transition-colors"
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

    return (
        <div className="min-h-screen bg-synqit-background">
            {/* Header with Back Button */}
            <div className="flex justify-between items-center p-6">
                <button 
                    onClick={() => router.back()}
                    className="text-white hover:text-synqit-primary transition-colors"
                >
                    Back
                </button>
                
                {/* Other Pending Requests */}
                <div className="text-white">
                    <span className="text-synqit-muted-foreground">Other Pending Requests </span>
                    <span className="font-medium">(All)</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Partner Header Card */}
                    <div className="bg-white rounded-2xl overflow-hidden relative">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            <div className={`text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                                partnership.status === 'PENDING' ? 'bg-orange-500' :
                                partnership.status === 'ACCEPTED' ? 'bg-green-500' :
                                partnership.status === 'REJECTED' ? 'bg-red-500' :
                                'bg-gray-500'
                            }`}>
                                {partnership.status}
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                                </svg>
                            </div>
                        </div>

                        {/* Banner */}
                        <div className="relative h-32 w-full">
                            {partnerProject?.bannerUrl ? (
                                <Image
                                    src={partnerProject.bannerUrl}
                                    alt={`${partnerProjectInfo?.name || partner.firstName} banner`}
                                    fill
                                    className="object-contain p-8"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <div className="w-16 h-16 bg-synqit-primary/20 rounded-full flex items-center justify-center">
                                        <span className="text-synqit-primary font-bold text-xl">
                                            {(partnerProjectInfo?.name || partner.firstName).charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Partner Info */}
                        <div className="bg-synqit-surface text-white p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 relative rounded-full bg-synqit-primary/20 flex items-center justify-center">
                                    {partnerProject?.logoUrl ? (
                                        <Image
                                            src={partnerProject.logoUrl}
                                            alt={`${partnerProjectInfo?.name || partner.firstName} logo`}
                                            fill
                                            className="object-contain rounded-full"
                                        />
                                    ) : partner.profileImage ? (
                                        <Image
                                            src={partner.profileImage}
                                            alt={`${partner.firstName} ${partner.lastName}`}
                                            fill
                                            className="object-cover rounded-full"
                                        />
                                    ) : (
                                        <span className="text-synqit-primary font-bold text-xl">
                                            {partner.firstName.charAt(0).toUpperCase()}
                                            {partner.lastName.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        {partnerProjectInfo?.name || `${partner.firstName} ${partner.lastName}`}
                                    </h1>
                                    <p className="text-synqit-muted-foreground">
                                        {partnerProject?.website || partner.email}
                                    </p>
                                    {partnerProjectInfo && (
                                        <p className="text-xs text-synqit-muted-foreground">
                                            by {partner.firstName} {partner.lastName}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Partnership Type */}
                            <div className="flex items-center gap-2 mb-4">
                                <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.64513 7.17116V2.97116C8.64513 1.99116 8.1143 1.79283 7.4668 2.52783L7.00013 3.05866L3.05096 7.55033C2.50846 8.16283 2.73596 8.66449 3.55263 8.66449H5.35513V12.8645C5.35513 13.8445 5.88596 14.0428 6.53346 13.3078L7.00013 12.777L10.9493 8.28533C11.4918 7.67283 11.2643 7.17116 10.4476 7.17116H8.64513Z" fill="#CFDBE4" />
                                </svg>
                                <span className="text-sm">Partnership Type: {partnership.partnershipType}</span>
                            </div>

                            {/* Project Type */}
                            {partnerProjectInfo && (
                                <div className="mb-4">
                                    <span className="text-sm text-synqit-muted-foreground">
                                        Project Type: {partnerProjectInfo.projectType}
                                    </span>
                                </div>
                            )}

                            {/* Tags */}
                            {partnerProject?.tags && partnerProject.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {partnerProject.tags.map((tagObj: any, index: number) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-synqit-input text-synqit-muted-foreground rounded-full text-xs"
                                        >
                                            {tagObj.tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Action Button */}
                            <div className="space-y-3">
                                {isIncoming && partnership.status === 'PENDING' ? (
                                    <button className="w-full py-3 bg-synqit-primary hover:bg-synqit-primary/80 text-white rounded-lg font-medium transition-colors">
                                        Accept Partnership
                                    </button>
                                ) : partnership.status === 'PENDING' ? (
                                    <button className="w-full py-3 bg-synqit-muted hover:bg-synqit-muted/80 text-white rounded-lg font-medium transition-colors">
                                        Cancel Request
                                    </button>
                                ) : (
                                    <button 
                                        disabled
                                        className="w-full py-3 bg-synqit-muted/30 text-synqit-muted-foreground rounded-lg font-medium cursor-not-allowed"
                                    >
                                        {partnership.status}
                                    </button>
                                )}
                                
                                <button className="w-full py-3 bg-synqit-surface/50 border border-synqit-border hover:border-synqit-primary text-white rounded-lg font-medium transition-colors">
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white">
                            About {partnerProjectInfo?.name || `${partner.firstName} ${partner.lastName}`}
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Partnership Request:</h3>
                                <p className="text-synqit-muted-foreground leading-relaxed">
                                    {partnership.description || 'This partnership request is for collaboration opportunities to help both projects grow and succeed in the Web3 ecosystem.'}
                                </p>
                            </div>
                            
                            {partnerProject?.description && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Project Description:</h3>
                                    <p className="text-synqit-muted-foreground leading-relaxed">
                                        {partnerProject.description}
                                    </p>
                                </div>
                            )}
                            
                            {partnerProject?.developmentFocus && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Development Focus:</h3>
                                    <p className="text-synqit-muted-foreground leading-relaxed">
                                        {partnerProject.developmentFocus}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* What We Offer for Partnerships */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">What We Offer for Partnerships:</h2>
                        <p className="text-synqit-muted-foreground leading-relaxed">
                            This project offers various partnership opportunities including cross-marketing initiatives, 
                            technical integrations, joint community events, and collaborative development efforts to 
                            strengthen both projects' presence in the Web3 ecosystem.
                        </p>
                        
                        {partnerProject?.blockchainPreferences && partnerProject.blockchainPreferences.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-synqit-muted-foreground">
                                    <span className="font-medium">Blockchain Focus:</span> {
                                        partnerProject.blockchainPreferences
                                            .map((bp: any) => bp.blockchain)
                                            .join(', ')
                                    }
                                </p>
                            </div>
                        )}
                        
                        {partnerProjectInfo && (
                            <div className="space-y-2">
                                <p className="text-synqit-muted-foreground">
                                    <span className="font-medium">Project Type:</span> {partnerProjectInfo.projectType}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Website/Contact Information */}
                    {(partnerProject?.website || partnerProject?.contactEmail || partnerProject?.twitterHandle) && (
                        <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Contact & Links</h3>
                            <div className="space-y-3">
                                {partnerProject?.website && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-synqit-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                        </svg>
                                        <a 
                                            href={partnerProject.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-synqit-primary hover:text-synqit-accent transition-colors"
                                        >
                                            {partnerProject.website}
                                        </a>
                                    </div>
                                )}
                                {partnerProject?.twitterHandle && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-synqit-primary" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                        </svg>
                                        <span className="text-synqit-muted-foreground">@{partnerProject.twitterHandle}</span>
                                    </div>
                                )}
                                {partnerProject?.contactEmail && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-synqit-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-synqit-muted-foreground">{partnerProject.contactEmail}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Partnership Details - Generic Instructions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">Partnership Guidelines</h2>
                        
                        <div className="space-y-4">
                            <div className="text-synqit-muted-foreground">
                                <p className="mb-4">
                                    This section provides general partnership guidelines that apply to most Web3 collaborations. 
                                    Each partnership is unique and specific terms will be discussed during the collaboration process.
                                </p>
                                
                                <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-synqit-primary" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                    Common Partnership Types:
                                </h4>
                                
                                <div className="space-y-2 pl-6">
                                    <div>• <span className="font-medium">Cross-Marketing:</span> Joint promotional activities and content sharing</div>
                                    <div>• <span className="font-medium">Technical Integration:</span> API integrations and platform connections</div>
                                    <div>• <span className="font-medium">Community Collaboration:</span> Joint events, AMAs, and community initiatives</div>
                                    <div>• <span className="font-medium">Product Development:</span> Collaborative development of new features or services</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* How to Apply - Generic Instructions */}
                    <div className="space-y-4">
                        <h4 className="text-white font-medium flex items-center gap-2">
                            📞 How to Apply:
                        </h4>
                        
                        <div className="space-y-2 text-synqit-muted-foreground">
                            <div>1. Click 'Accept Partnership' to approve the request and begin collaboration planning</div>
                            <div>2. The requesting party will be notified and can proceed with detailed partnership discussions</div>
                            <div>3. Both parties will collaborate to define specific partnership terms and deliverables</div>
                            <div>4. Regular check-ins and progress updates will be scheduled to ensure successful collaboration</div>
                        </div>
                    </div>

                    {/* Call-to-Action - Generic Instructions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            🚀 Call-to-Action (CTA)
                        </h2>
                        
                        <p className="text-synqit-muted-foreground">
                            Partner with {partnerProjectInfo?.name || `${partner.firstName} ${partner.lastName}`} & Shape the Future of Web3!
                        </p>
                        
                        {isIncoming && partnership.status === 'PENDING' ? (
                            <button className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                                Accept Partnership
                            </button>
                        ) : (
                            <button className="bg-synqit-primary hover:bg-synqit-primary/80 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                                Apply for Partnership
                            </button>
                        )}
                        
                        <p className="text-synqit-muted-foreground">
                            Not ready yet? Follow {partnerProjectInfo?.name || `${partner.firstName} ${partner.lastName}`} for updates!
                        </p>
                    </div>
                </div>

                {/* Right Sidebar - Partnership Actions */}
                <div className="lg:col-span-1">
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-lg p-4">
                        <h3 className="text-white font-medium mb-4">Partnership Actions</h3>
                        <div className="space-y-3">
                            <Link 
                                href="/dashboard/matchmaking"
                                className="block w-full text-center bg-synqit-primary hover:bg-synqit-primary/80 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                            >
                                Back to Requests
                            </Link>
                            <button className="w-full bg-synqit-surface/50 border border-synqit-border hover:border-synqit-primary text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                                Send Message
                            </button>
                            {partnerProject?.website && (
                                <a 
                                    href={partnerProject.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center bg-synqit-muted hover:bg-synqit-muted/80 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                                >
                                    Visit Website
                                </a>
                            )}
                        </div>
                        
                        {/* Partnership Info */}
                        <div className="mt-6 space-y-2 text-sm">
                            <div className="text-synqit-muted-foreground">
                                <span className="font-medium">Status:</span> {partnership.status}
                            </div>
                            <div className="text-synqit-muted-foreground">
                                <span className="font-medium">Type:</span> {partnership.partnershipType}
                            </div>
                            <div className="text-synqit-muted-foreground">
                                <span className="font-medium">Created:</span> {new Date(partnership.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 