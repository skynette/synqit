'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { projectApi, dashboardApi } from "@/lib/api-client"
import { useAuth } from "@/hooks/use-auth"
import type { Project } from "@/lib/api-client"

interface ProjectDetailProps {
    params: Promise<{
        id: string
    }>
}


export default function ProjectDetailPage({ params }: ProjectDetailProps) {
    const router = useRouter()
    const { user } = useAuth()
    const [isFollowing, setIsFollowing] = useState(false)
    const [project, setProject] = useState<Project | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isRequestingPartnership, setIsRequestingPartnership] = useState(false)
    
    useEffect(() => {
        async function fetchProject() {
            try {
                const { id } = await params
                const projectData = await projectApi.getProjectById(id)
                setProject(projectData)
            } catch (err: any) {
                console.error('Error fetching project:', err)
                if (err.response?.status === 404) {
                    setError('Project not found')
                } else {
                    setError('Failed to load project')
                }
            } finally {
                setLoading(false)
            }
        }
        
        fetchProject()
    }, [params])
    
    const handlePartnershipRequest = async () => {
        if (!user) {
            router.push('/auth')
            return
        }
        
        if (!project) return
        
        try {
            setIsRequestingPartnership(true)
            
            // Create partnership request
            await dashboardApi.createPartnership({
                receiverProjectId: project.id,
                partnershipType: 'ECOSYSTEM_PARTNERSHIP',
                title: `Partnership Request from ${user.firstName} ${user.lastName}`,
                description: `I'm interested in exploring partnership opportunities with ${project.name} in the ${project.projectType} space.`
            })
            
            // Show success and redirect to matchmaking
            alert('Partnership request sent successfully!')
            router.push('/dashboard/matchmaking')
        } catch (err: any) {
            console.error('Error creating partnership:', err)
            alert('Failed to send partnership request. Please try again.')
        } finally {
            setIsRequestingPartnership(false)
        }
    }
    
    if (loading) {
        return (
            <div className="min-h-screen bg-synqit-background p-6">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-synqit-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-white">Loading project...</p>
                    </div>
                </div>
            </div>
        )
    }
    
    if (error || !project) {
        return (
            <div className="min-h-screen bg-synqit-background p-6">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">
                            {error === 'Project not found' ? 'Project Not Found' : 'Something went wrong'}
                        </h1>
                        <p className="text-synqit-muted-foreground mb-6">
                            {error === 'Project not found' 
                                ? "The project you're looking for doesn't exist or has been removed."
                                : "We couldn't load the project details. Please try again later."
                            }
                        </p>
                        <button 
                            onClick={() => router.push('/dashboard/explore')}
                            className="bg-synqit-primary hover:bg-synqit-primary/80 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                        >
                            Back to Explore
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className="min-h-screen bg-synqit-background p-6">
            {/* Back Button */}
            <div className="mb-6">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white hover:text-synqit-primary transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl">
                {/* Left Sidebar - Project Info */}
                <div className="lg:col-span-1">
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6 space-y-6">
                        {/* Project Header */}
                        <div className="text-center">
                            {/* Banner */}
                            <div className="relative h-20 w-full bg-white rounded-lg mb-4">
                                {project.bannerUrl ? (
                                    <Image
                                        src={project.bannerUrl}
                                        alt={`${project.name} banner`}
                                        fill
                                        className="object-contain p-2"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        No banner image
                                    </div>
                                )}
                            </div>

                            {/* Logo and Name */}
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <div className="w-12 h-12 relative rounded-full bg-white p-2">
                                    {project.logoUrl ? (
                                        <Image
                                            src={project.logoUrl}
                                            alt={`${project.name} logo`}
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                                            {project.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-bold text-white">{project.name}</h1>
                                        {project.isVerified && (
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center justify-center gap-6 mb-4">
                                <div className="flex items-center gap-1 text-synqit-muted-foreground">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.5 7.5h-3A1.5 1.5 0 0 0 14.04 8.37L11.5 16H14v6h6z"/>
                                    </svg>
                                    <span className="text-sm font-medium">{project.trustScore || 0}</span>
                                    <span className="text-xs text-synqit-muted-foreground">Trust Score</span>
                                </div>
                                <div className="flex items-center gap-1 text-synqit-muted-foreground">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                    </svg>
                                    <span className="text-sm font-medium">{project.viewCount || 0}</span>
                                    <span className="text-xs text-synqit-muted-foreground">Views</span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-synqit-muted-foreground text-sm mb-4">
                                {project.description}
                            </p>
                        </div>

                        {/* Project Type */}
                        <div className="flex items-center gap-2">
                            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.64513 7.17116V2.97116C8.64513 1.99116 8.1143 1.79283 7.4668 2.52783L7.00013 3.05866L3.05096 7.55033C2.50846 8.16283 2.73596 8.66449 3.55263 8.66449H5.35513V12.8645C5.35513 13.8445 5.88596 14.0428 6.53346 13.3078L7.00013 12.777L10.9493 8.28533C11.4918 7.67283 11.2643 7.17116 10.4476 7.17116H8.64513Z" fill="#CFDBE4" />
                            </svg>
                            <span className="text-sm text-synqit-muted-foreground">Project Type: {project.projectType}</span>
                        </div>

                        {/* Partnership Status */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <p className="text-sm text-synqit-muted-foreground">Looking for Partners:</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    project.isLookingForPartners 
                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                }`}>
                                    {project.isLookingForPartners ? 'Yes' : 'No'}
                                </span>
                            </div>
                            {project.isLookingForFunding && (
                                <div className="flex items-center gap-2 mb-3">
                                    <p className="text-sm text-synqit-muted-foreground">Looking for Funding:</p>
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                        Yes
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tagObj: any) => (
                                <span
                                    key={tagObj.id}
                                    className="px-3 py-1 bg-synqit-input text-synqit-muted-foreground rounded-full text-xs"
                                >
                                    {tagObj.tag}
                                </span>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button 
                                onClick={handlePartnershipRequest}
                                disabled={isRequestingPartnership || !project.isLookingForPartners}
                                className="w-full bg-synqit-primary hover:bg-synqit-primary/80 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isRequestingPartnership ? 'Sending Request...' : 
                                 !project.isLookingForPartners ? 'Not Looking for Partners' : 
                                 'Apply for Partnership'}
                            </button>
                            <button 
                                onClick={() => setIsFollowing(!isFollowing)}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                                    isFollowing 
                                        ? 'bg-synqit-surface/50 border border-synqit-border text-white'
                                        : 'bg-synqit-surface/50 border border-synqit-border text-synqit-muted-foreground hover:text-white'
                                }`}
                            >
                                Follow Profile
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Project Info */}
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6 mt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-synqit-muted-foreground">Stage:</span>
                                <span className="text-white">{project.projectStage}</span>
                            </div>
                            {project.teamSize && (
                                <div className="flex justify-between">
                                    <span className="text-synqit-muted-foreground">Team Size:</span>
                                    <span className="text-white">{project.teamSize}</span>
                                </div>
                            )}
                            {project.foundedYear && (
                                <div className="flex justify-between">
                                    <span className="text-synqit-muted-foreground">Founded:</span>
                                    <span className="text-white">{project.foundedYear}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-synqit-muted-foreground">Created:</span>
                                <span className="text-white">{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About Section */}
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">About {project.name}</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Project Description:</h3>
                                <p className="text-synqit-muted-foreground leading-relaxed">
                                    {project.description}
                                </p>
                            </div>

                            {project.developmentFocus && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Development Focus:</h3>
                                    <p className="text-synqit-muted-foreground leading-relaxed">
                                        {project.developmentFocus}
                                    </p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4">Blockchain Preferences:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.blockchainPreferences.map((blockchain: any) => (
                                        <span
                                            key={blockchain.id}
                                            className={`px-3 py-1 rounded-full text-xs ${
                                                blockchain.isPrimary
                                                    ? 'bg-synqit-primary text-white'
                                                    : 'bg-synqit-input text-synqit-muted-foreground'
                                            }`}
                                        >
                                            {blockchain.blockchain}
                                            {blockchain.isPrimary && ' (Primary)'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Links */}
                    {(project.website || project.twitterHandle || project.contactEmail) && (
                        <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Contact & Links</h3>
                            <div className="space-y-3">
                                {project.website && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-synqit-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                        </svg>
                                        <a 
                                            href={project.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-synqit-primary hover:text-synqit-accent transition-colors"
                                        >
                                            {project.website}
                                        </a>
                                    </div>
                                )}
                                {project.twitterHandle && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-synqit-primary" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                        </svg>
                                        <span className="text-synqit-muted-foreground">@{project.twitterHandle}</span>
                                    </div>
                                )}
                                {project.contactEmail && (
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-synqit-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-synqit-muted-foreground">{project.contactEmail}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Owner Information */}
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Project Owner</h3>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 relative rounded-full bg-synqit-primary/20 flex items-center justify-center">
                                {project.owner.profileImage ? (
                                    <Image
                                        src={project.owner.profileImage}
                                        alt={`${project.owner.firstName} ${project.owner.lastName}`}
                                        fill
                                        className="object-cover rounded-full"
                                    />
                                ) : (
                                    <span className="text-synqit-primary font-bold">
                                        {project.owner.firstName.charAt(0).toUpperCase()}
                                        {project.owner.lastName.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h4 className="text-white font-medium">
                                    {project.owner.firstName} {project.owner.lastName}
                                </h4>
                                <p className="text-synqit-muted-foreground text-sm">{project.owner.userType}</p>
                                {project.owner.isVerified && (
                                    <span className="inline-block mt-1 bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                                        Verified User
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Partnership Opportunity */}
                    <div className="bg-synqit-surface/50 backdrop-blur-sm border border-synqit-border rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Partnership Opportunity</h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <span role="img" aria-label="handshake">🤝</span>
                                <h4 className="text-white font-medium">Interested in collaborating?</h4>
                            </div>
                            
                            <p className="text-synqit-muted-foreground mb-6">
                                Connect with {project.name} and explore partnership opportunities in the {project.projectType} space.
                            </p>
                            
                            <div className="space-y-3">
                                <button 
                                    onClick={handlePartnershipRequest}
                                    disabled={isRequestingPartnership || !project.isLookingForPartners}
                                    className="w-full bg-synqit-primary hover:bg-synqit-primary/80 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isRequestingPartnership ? 'Sending Request...' : 
                                     !project.isLookingForPartners ? 'Not Looking for Partners' : 
                                     'Request Partnership'}
                                </button>
                                <button className="w-full bg-synqit-surface/50 border border-synqit-border hover:border-synqit-primary text-white py-3 px-4 rounded-lg font-medium transition-colors">
                                    Send Message
                                </button>
                            </div>
                            
                            <div className="text-center pt-4">
                                <p className="text-synqit-muted-foreground text-sm">
                                    Project created on {new Date(project.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 