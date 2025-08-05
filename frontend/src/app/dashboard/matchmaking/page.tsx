'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { dashboardApi } from "@/lib/api-client"
import { useAuth } from "@/hooks/use-auth"
import type { Partnership } from "@/lib/api-client"

interface PartnerRequest {
    id: string
    name: string
    logo: string
    description: string
    requestType: string
    tags: { tag: string }[]
    isNew: boolean
    requestStatus: 'incoming' | 'outgoing'
    status: string
    partnerProject: {
        id: string
        name: string
        logoUrl: string | null
        projectType: string
    } | null
    partner: {
        id: string
        firstName: string
        lastName: string
        profileImage: string | null
    } | null
}

export default function MatchmakingPage() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming')
    const [partnerships, setPartnerships] = useState<Partnership[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [processingPartnership, setProcessingPartnership] = useState<string | null>(null)
    
    useEffect(() => {
        async function fetchPartnerships() {
            try {
                setLoading(true)
                const data = await dashboardApi.getPartnerships()
                setPartnerships(data)
            } catch (err: any) {
                console.error('Error fetching partnerships:', err)
                setError('Failed to load partnerships')
            } finally {
                setLoading(false)
            }
        }
        
        fetchPartnerships()
    }, [])

    const handleAcceptPartnership = async (partnershipId: string) => {
        try {
            setProcessingPartnership(partnershipId)
            await dashboardApi.acceptPartnership(partnershipId)
            
            // Update the local state to reflect the change
            setPartnerships(prev => prev.map(partnership => 
                partnership.id === partnershipId 
                    ? { ...partnership, status: 'ACCEPTED' as const, updatedAt: new Date().toISOString() }
                    : partnership
            ))
            
            alert('Partnership request accepted successfully!')
        } catch (error: any) {
            console.error('Error accepting partnership:', error)
            alert('Failed to accept partnership request. Please try again.')
        } finally {
            setProcessingPartnership(null)
        }
    }

    const handleRejectPartnership = async (partnershipId: string) => {
        try {
            setProcessingPartnership(partnershipId)
            await dashboardApi.rejectPartnership(partnershipId)
            
            // Update the local state to reflect the change
            setPartnerships(prev => prev.map(partnership => 
                partnership.id === partnershipId 
                    ? { ...partnership, status: 'REJECTED' as const, updatedAt: new Date().toISOString() }
                    : partnership
            ))
            
            alert('Partnership request rejected successfully!')
        } catch (error: any) {
            console.error('Error rejecting partnership:', error)
            alert('Failed to reject partnership request. Please try again.')
        } finally {
            setProcessingPartnership(null)
        }
    }
    
    // Transform API data to match our component interface
    const transformPartnership = (partnership: Partnership, currentUserId: string): PartnerRequest => {
        const isIncoming = partnership.receiverId === currentUserId
        const isOutgoing = partnership.requesterId === currentUserId
        
        return {
            id: partnership.id,
            name: isIncoming ? partnership.requesterProject?.name || `${partnership.requester?.firstName || 'Unknown'} ${partnership.requester?.lastName || 'User'}` 
                             : partnership.receiverProject?.name || `${partnership.receiver?.firstName || 'Unknown'} ${partnership.receiver?.lastName || 'User'}`,
            logo: isIncoming ? partnership.requesterProject?.logoUrl || '/icons/default-project.png'
                             : partnership.receiverProject?.logoUrl || '/icons/default-project.png',
            description: partnership.description || 'Partnership request for collaboration opportunities.',
            requestType: partnership.partnershipType || 'Partnership',
            tags: [], // We'll need to add tags if available
            isNew: partnership.status === 'PENDING',
            requestStatus: isIncoming ? 'incoming' : 'outgoing',
            status: partnership.status,
            partnerProject: (() => {
                const project = isIncoming ? partnership.requesterProject : partnership.receiverProject
                return project ? {
                    id: project.id,
                    name: project.name,
                    logoUrl: project.logoUrl || null,
                    projectType: project.projectType || ''
                } : null
            })(),
            partner: (() => {
                const user = isIncoming ? partnership.requester : partnership.receiver
                return user ? {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profileImage: user.profileImage || null
                } : null
            })()
        }
    }
    
    // Get current user ID from auth context
    const currentUserId = user?.id
    
    const transformedRequests = (currentUserId && Array.isArray(partnerships)) 
        ? partnerships.map(p => transformPartnership(p, currentUserId)) 
        : []
    const filteredRequests = transformedRequests.filter(request => request.requestStatus === activeTab)

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
                    Let SynQit Match You with the Perfect Partner!
                </h1>
                <p className="text-synqit-muted-foreground text-lg">
                    AI-Powered Matchmaking for Web3 Success.
                </p>
            </div>


            {/* Your Requests Section */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Your Requests</h2>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab('incoming')}
                        className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                            activeTab === 'incoming'
                                ? "bg-synqit-primary text-white"
                                : "text-synqit-muted-foreground hover:text-white hover:bg-synqit-surface/50"
                        }`}
                    >
                        Incoming Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('outgoing')}
                        className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                            activeTab === 'outgoing'
                                ? "bg-synqit-primary text-white"
                                : "text-synqit-muted-foreground hover:text-white hover:bg-synqit-surface/50"
                        }`}
                    >
                        Outgoing Requests
                    </button>
                </div>

                {/* Request Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading ? (
                        // Loading skeleton
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6 animate-pulse">
                                <div className="h-20 bg-synqit-muted/20 rounded-lg mb-4"></div>
                                <div className="h-4 bg-synqit-muted/20 rounded mb-2"></div>
                                <div className="h-4 bg-synqit-muted/20 rounded w-3/4 mb-4"></div>
                                <div className="flex gap-2 mb-4">
                                    <div className="h-6 w-16 bg-synqit-muted/20 rounded-full"></div>
                                    <div className="h-6 w-16 bg-synqit-muted/20 rounded-full"></div>
                                </div>
                                <div className="h-10 bg-synqit-muted/20 rounded"></div>
                            </div>
                        ))
                    ) : error ? (
                        <div className="col-span-2 bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
                            <p className="text-red-400">{error}</p>
                        </div>
                    ) : filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                            <div key={request.id} className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl overflow-hidden flex flex-col relative">
                                {/* New Request Badge for Incoming */}
                                {request.isNew && request.requestStatus === 'incoming' && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            New Request
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM8.5 16L12 13.5 15.5 16 12 18.5 8.5 16z"/>
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Awaiting Response Badge for Outgoing */}
                                {request.requestStatus === 'outgoing' && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            Awaiting Response
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Banner/Logo Image */}
                                <div className="relative h-20 w-full bg-white">
                                    {request.logo && request.logo !== '/icons/default-project.png' ? (
                                        <Image
                                            src={request.logo}
                                            alt={`${request.name} banner`}
                                            fill
                                            className="object-contain p-4"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <div className="w-12 h-12 bg-synqit-primary/20 rounded-full flex items-center justify-center">
                                                <span className="text-synqit-primary font-bold">
                                                    {request.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Card Content */}
                                <div className="p-5 flex flex-col flex-grow">
                                    {/* Project/User Name */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 relative rounded-full bg-synqit-primary/20 flex items-center justify-center">
                                            {request.partner?.profileImage ? (
                                                <Image
                                                    src={request.partner.profileImage}
                                                    alt={`${request.name} owner`}
                                                    fill
                                                    className="object-cover rounded-full"
                                                />
                                            ) : (
                                                <span className="text-synqit-primary font-bold text-sm">
                                                    {request.partner?.firstName.charAt(0) || request.name.charAt(0)}
                                                    {request.partner?.lastName.charAt(0) || ''}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">{request.name}</h3>
                                            {request.partner && (
                                                <p className="text-xs text-synqit-muted-foreground">
                                                    by {request.partner.firstName} {request.partner.lastName}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-synqit-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
                                        {request.description}
                                    </p>

                                    {/* Request Type & Status */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.64513 7.17116V2.97116C8.64513 1.99116 8.1143 1.79283 7.4668 2.52783L7.00013 3.05866L3.05096 7.55033C2.50846 8.16283 2.73596 8.66449 3.55263 8.66449H5.35513V12.8645C5.35513 13.8445 5.88596 14.0428 6.53346 13.3078L7.00013 12.777L10.9493 8.28533C11.4918 7.67283 11.2643 7.17116 10.4476 7.17116H8.64513Z" fill="#CFDBE4" />
                                            </svg>
                                            <span className="text-sm text-synqit-muted-foreground">{request.requestType}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            request.status === 'PENDING' ? 'bg-orange-500/20 text-orange-400' :
                                            request.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' :
                                            request.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {request.status}
                                        </span>
                                    </div>

                                    {/* Project Type */}
                                    {request.partnerProject && (
                                        <div className="mb-3">
                                            <span className="text-sm text-synqit-muted-foreground">
                                                Project Type: {request.partnerProject.projectType}
                                            </span>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    {request.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {request.tags.map((tagObj, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-synqit-input text-synqit-muted-foreground rounded-full text-xs"
                                                >
                                                    {tagObj.tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        {activeTab === 'incoming' ? (
                                            <>
                                                {request.status === 'PENDING' ? (
                                                    <>
                                                        <button 
                                                            onClick={() => handleAcceptPartnership(request.id)}
                                                            className="flex-1 py-3 bg-synqit-primary hover:bg-synqit-primary/80 text-white rounded-lg transition-colors duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                            disabled={processingPartnership === request.id}
                                                        >
                                                            {processingPartnership === request.id ? 'Processing...' : 'Accept Partnership'}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleRejectPartnership(request.id)}
                                                            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                            disabled={processingPartnership === request.id}
                                                        >
                                                            {processingPartnership === request.id ? 'Processing...' : 'Decline'}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex-1 py-3 text-center rounded-lg border border-synqit-border">
                                                        <span className={`font-medium text-sm ${
                                                            request.status === 'ACCEPTED' ? 'text-green-400' : 
                                                            request.status === 'REJECTED' ? 'text-red-400' : 
                                                            'text-synqit-muted-foreground'
                                                        }`}>
                                                            {request.status === 'ACCEPTED' ? 'Partnership Accepted' : 
                                                             request.status === 'REJECTED' ? 'Partnership Declined' : 
                                                             request.status}
                                                        </span>
                                                    </div>
                                                )}
                                                <Link href={`/dashboard/matchmaking/${request.id}`} className="px-6 py-3 bg-synqit-surface/50 hover:bg-synqit-surface border border-synqit-border text-synqit-muted-foreground hover:text-white rounded-lg transition-colors duration-200 font-medium text-sm text-center">
                                                    View Details
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <button 
                                                    className="flex-1 py-3 bg-synqit-muted hover:bg-synqit-muted/80 text-white rounded-lg transition-colors duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={request.status !== 'PENDING'}
                                                >
                                                    {request.status === 'PENDING' ? 'Cancel Request' : request.status}
                                                </button>
                                                <Link href={`/dashboard/matchmaking/${request.id}`} className="px-6 py-3 bg-synqit-surface/50 hover:bg-synqit-surface border border-synqit-border text-synqit-muted-foreground hover:text-white rounded-lg transition-colors duration-200 font-medium text-sm text-center">
                                                    View Details
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 bg-synqit-surface/30 backdrop-blur-sm border border-synqit-border rounded-lg p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-16 h-16 bg-synqit-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-synqit-primary" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No {activeTab} requests</h3>
                                <p className="text-synqit-muted-foreground">
                                    {activeTab === 'incoming' 
                                        ? 'You have no incoming partnership requests at the moment.'
                                        : 'You have no outgoing partnership requests at the moment.'
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 