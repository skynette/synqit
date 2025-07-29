'use client'

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { Navbar } from "@/components/layout/navbar"

// Types
interface BasicInfoData {
    projectName: string
    website: string
    profilePicture: File | null
    blockchains: string[]
    projectCategory: string
}

interface MarketingData {
    brandTone: string
    targetAudience: string[]
    brandKeywords: string[]
    socialPlatforms: string[]
}

interface DataConnectionsData {
    connectedAccounts: {
        twitter: boolean
        discord: boolean
        telegram: boolean
        reddit: boolean
    }
}

interface OnboardingData extends BasicInfoData, MarketingData, DataConnectionsData {}

// Step Progress Component
function StepProgress({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-sm font-medium">
                    Step {currentStep}: {
                        currentStep === 1 ? "Let's get you onboarded" :
                        currentStep === 2 ? "Marketing & Audience" :
                        "Data Connections"
                    }
                </h2>
                <span className="text-gray-400 text-sm">{currentStep} / {totalSteps}</span>
            </div>
            <div className="flex gap-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                            i < currentStep ? 'bg-[#4C82ED]' : 'bg-gray-600'
                        }`}
                    />
                ))}
            </div>
        </div>
    )
}

// Step 1: Basic Info Component
function BasicInfoStep({ 
    data, 
    onChange, 
    onNext 
}: { 
    data: BasicInfoData; 
    onChange: (data: Partial<BasicInfoData>) => void; 
    onNext: () => void;
}) {
    const [focusedField, setFocusedField] = useState<string>("")
    const [blockchainDropdownOpen, setBlockchainDropdownOpen] = useState(false)
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const blockchainOptions = [
        'N/A', 'Toronet', 'Polygon', 'Multi-Chain', 'Ethereum', 'Solana', 'Binance Smart Chain', 
        'Cardano', 'Polkadot', 'Avalanche', 'Terra', 'Cosmos', 'Near', 'Fantom'
    ]

    const categoryOptions = [
        'DeFi', 'NFT', 'Gaming', 'Infrastructure', 'Social', 'DAO', 'Metaverse', 
        'Education', 'Healthcare', 'Supply Chain', 'Identity', 'Privacy'
    ]

    const filteredBlockchains = blockchainOptions.filter(blockchain =>
        blockchain.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onChange({ profilePicture: file })
        }
    }

    const toggleBlockchain = (blockchain: string) => {
        const newBlockchains = data.blockchains.includes(blockchain)
            ? data.blockchains.filter(b => b !== blockchain)
            : [...data.blockchains, blockchain]
        onChange({ blockchains: newBlockchains })
    }

    const handleNext = () => {
        if (data.projectName && data.blockchains.length > 0) {
            onNext()
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">
                    Let's Get Started with Your Profile 🚀
                </h1>
            </div>

            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-6 space-y-6">
                <h3 className="text-white text-lg font-semibold">Basic Info</h3>

                {/* Project Name */}
                <div>
                    <div className={`${focusedField === 'projectName' ? 'gradient-border' : 'gray-border'} rounded-lg`}>
                        <input
                            type="text"
                            placeholder="Project Name"
                            value={data.projectName}
                            onChange={(e) => onChange({ projectName: e.target.value })}
                            onFocus={() => setFocusedField('projectName')}
                            onBlur={() => setFocusedField('')}
                            className="w-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white placeholder-gray-400 border-none focus:outline-none"
                        />
                    </div>
                </div>

                {/* Website */}
                <div>
                    <div className={`${focusedField === 'website' ? 'gradient-border' : 'gray-border'} rounded-lg`}>
                        <input
                            type="url"
                            placeholder="Website"
                            value={data.website}
                            onChange={(e) => onChange({ website: e.target.value })}
                            onFocus={() => setFocusedField('website')}
                            onBlur={() => setFocusedField('')}
                            className="w-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white placeholder-gray-400 border-none focus:outline-none"
                        />
                    </div>
                </div>

                {/* Project Profile Picture */}
                <div>
                    <h4 className="text-white font-medium mb-2">Project Profile Picture</h4>
                    <p className="text-gray-400 text-sm mb-4">This is will be your card profile picture</p>
                    
                    <div className="border-2 border-dashed border-[#2a3142] rounded-lg p-8 text-center">
                        <div className="space-y-4">
                            <div>
                                <p className="text-[#4C82ED] font-medium">Browse your file to upload!</p>
                                <p className="text-gray-400 text-sm">Supported Format: SVG, JPG, PNG (10mb each)</p>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-[#4C82ED] hover:bg-[#3d6bdc] text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
                            >
                                Browse File
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 12V4M8 4L5 7M8 4L11 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            {data.profilePicture && (
                                <p className="text-green-400 text-sm">{data.profilePicture.name} selected</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Blockchain Selection */}
                <div className="relative">
                    <button
                        onClick={() => setBlockchainDropdownOpen(!blockchainDropdownOpen)}
                        className={`w-full ${focusedField === 'blockchain' ? 'gradient-border' : 'gray-border'} rounded-lg`}
                        onFocus={() => setFocusedField('blockchain')}
                        onBlur={() => setFocusedField('')}
                    >
                        <div className="w-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-left flex items-center justify-between">
                            <span className={data.blockchains.length > 0 ? 'text-white' : 'text-gray-400'}>
                                {data.blockchains.length > 0 
                                    ? `${data.blockchains.length} blockchain(s) selected`
                                    : 'Select Blockchain(s) (Multi-Select)'
                                }
                            </span>
                            <svg 
                                width="20" 
                                height="20" 
                                viewBox="0 0 20 20" 
                                fill="none"
                                className={`transform transition-transform ${blockchainDropdownOpen ? 'rotate-180' : ''}`}
                            >
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </button>

                    {blockchainDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1f2e] border border-[#2a3142] rounded-lg p-4 z-10">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-white text-sm font-medium">Blockchain Type</label>
                                    <div className="mt-2 relative">
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-[#0a0f1c] border border-[#2a3142] rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
                                        />
                                        <svg 
                                            width="20" 
                                            height="20" 
                                            viewBox="0 0 20 20" 
                                            fill="none"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        >
                                            <path d="M19 19L13 13M15 8A7 7 0 1 1 1 8A7 7 0 0 1 15 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                </div>

                                <div className="max-h-48 overflow-y-auto space-y-2">
                                    {filteredBlockchains.map((blockchain) => (
                                        <label key={blockchain} className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.blockchains.includes(blockchain)}
                                                onChange={() => toggleBlockchain(blockchain)}
                                                className="w-4 h-4 bg-[#2a3142] border border-[#4a5568] rounded"
                                            />
                                            <span className="text-white">{blockchain}</span>
                                        </label>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setBlockchainDropdownOpen(false)}
                                    className="w-full bg-[#4C82ED] hover:bg-[#3d6bdc] text-white py-2 rounded-lg font-medium transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Project Category */}
                <div className="relative">
                    <button
                        onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                        className={`w-full ${focusedField === 'category' ? 'gradient-border' : 'gray-border'} rounded-lg`}
                        onFocus={() => setFocusedField('category')}
                        onBlur={() => setFocusedField('')}
                    >
                        <div className="w-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-left flex items-center justify-between">
                            <span className={data.projectCategory ? 'text-white' : 'text-gray-400'}>
                                {data.projectCategory || 'Project Category'}
                            </span>
                            <svg 
                                width="20" 
                                height="20" 
                                viewBox="0 0 20 20" 
                                fill="none"
                                className={`transform transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                            >
                                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </button>

                    {categoryDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1f2e] border border-[#2a3142] rounded-lg p-4 z-10 max-h-48 overflow-y-auto">
                            {categoryOptions.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        onChange({ projectCategory: category })
                                        setCategoryDropdownOpen(false)
                                    }}
                                    className="w-full text-left px-3 py-2 text-white hover:bg-[#2a3142] rounded transition-colors"
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={handleNext}
                disabled={!data.projectName || data.blockchains.length === 0}
                className="w-full bg-[#4C82ED] hover:bg-[#3d6bdc] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
            >
                NEXT
            </button>
        </div>
    )
}

// Step 2: Marketing & Audience Component
function MarketingStep({ 
    data, 
    onChange, 
    onNext, 
    onPrevious 
}: { 
    data: MarketingData; 
    onChange: (data: Partial<MarketingData>) => void; 
    onNext: () => void;
    onPrevious: () => void;
}) {
    const brandTones = ['Tech-Savy', 'Formal', 'Playful', 'Minimal']
    const audienceOptions = ['Startups', 'Devs', 'DAO contributors', 'VCs', 'Others']
    const keywordOptions = ['Trading', 'Web3', 'Sustainability', 'Gaming', 'Cryptocurrency', 'Community']
    const platformOptions = ['Discord', 'Facebook', 'Telegram', 'Clickup', 'Twitter']

    const toggleArrayItem = (array: string[], item: string, key: keyof MarketingData) => {
        const newArray = array.includes(item)
            ? array.filter(i => i !== item)
            : [...array, item]
        onChange({ [key]: newArray })
    }

    const handleNext = () => {
        if (data.brandTone && data.targetAudience.length > 0) {
            onNext()
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">
                    Marketing & Audience 🚀
                </h1>
            </div>

            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-6 space-y-6">
                <h3 className="text-white text-lg font-semibold">Marketing & Audience Preference</h3>

                {/* Brand Tone */}
                <div>
                    <label className="text-white text-sm font-medium block mb-3">Brand Tone</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {brandTones.map((tone) => (
                            <button
                                key={tone}
                                onClick={() => onChange({ brandTone: tone })}
                                className={`px-4 py-3 rounded-lg border transition-colors ${
                                    data.brandTone === tone
                                        ? 'bg-[#4C82ED] border-[#4C82ED] text-white'
                                        : 'bg-[#2a3142] border-[#2a3142] text-gray-300 hover:border-[#4C82ED]'
                                }`}
                            >
                                {tone}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Target Audience */}
                <div>
                    <label className="text-white text-sm font-medium block mb-3">
                        Select Target Audience (Multi-Select)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {audienceOptions.map((audience) => (
                            <label key={audience} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.targetAudience.includes(audience)}
                                    onChange={() => toggleArrayItem(data.targetAudience, audience, 'targetAudience')}
                                    className="w-4 h-4 bg-[#2a3142] border border-[#4a5568] rounded"
                                />
                                <span className="text-white">{audience}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Brand Keywords */}
                <div>
                    <label className="text-white text-sm font-medium block mb-3">Brand Keywords</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {keywordOptions.map((keyword) => (
                            <label key={keyword} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.brandKeywords.includes(keyword)}
                                    onChange={() => toggleArrayItem(data.brandKeywords, keyword, 'brandKeywords')}
                                    className="w-4 h-4 bg-[#2a3142] border border-[#4a5568] rounded"
                                />
                                <span className="text-white">{keyword}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Social Platforms */}
                <div>
                    <label className="text-white text-sm font-medium block mb-3">Social Platforms</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {platformOptions.map((platform) => (
                            <label key={platform} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.socialPlatforms.includes(platform)}
                                    onChange={() => toggleArrayItem(data.socialPlatforms, platform, 'socialPlatforms')}
                                    className="w-4 h-4 bg-[#2a3142] border border-[#4a5568] rounded"
                                />
                                <span className="text-white">{platform}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onPrevious}
                    className="flex-1 bg-transparent border border-[#2a3142] text-white py-3 rounded-lg font-medium hover:bg-[#2a3142] transition-colors"
                >
                    PREVIOUS
                </button>
                <button
                    onClick={handleNext}
                    disabled={!data.brandTone || data.targetAudience.length === 0}
                    className="flex-1 bg-[#4C82ED] hover:bg-[#3d6bdc] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors"
                >
                    NEXT
                </button>
            </div>
        </div>
    )
}

// Step 3: Data Connections Component
function DataConnectionsStep({ 
    data, 
    onChange, 
    onFinish, 
    onPrevious 
}: { 
    data: DataConnectionsData; 
    onChange: (data: Partial<DataConnectionsData>) => void; 
    onFinish: () => void;
    onPrevious: () => void;
}) {
    const socialConnections = [
        { key: 'twitter' as const, name: 'Handler_jnr', icon: '/icons/twitter.svg', color: '#1DA1F2' },
        { key: 'discord' as const, name: 'Link Discord Account', icon: '/icons/discord.svg', color: '#5865F2' },
        { key: 'telegram' as const, name: 'Link Telegram Account', icon: '/icons/telegram.svg', color: '#0088CC' },
        { key: 'reddit' as const, name: 'Link Reddit Account', icon: '/icons/reddit.svg', color: '#FF4500' }
    ]

    const toggleConnection = (key: keyof DataConnectionsData['connectedAccounts']) => {
        onChange({
            connectedAccounts: {
                ...data.connectedAccounts,
                [key]: !data.connectedAccounts[key]
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">
                    Data Connections 🚀
                </h1>
            </div>

            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-6 space-y-6">
                <h3 className="text-white text-lg font-semibold">Connect your Social Account</h3>

                <div className="space-y-4">
                    {socialConnections.map((connection) => (
                        <div
                            key={connection.key}
                            className="flex items-center justify-between bg-[#2a3142] border border-[#3a4152] rounded-lg px-4 py-4"
                        >
                            <div className="flex items-center gap-3">
                                <div 
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: connection.color }}
                                >
                                    <span className="text-white text-sm font-bold">
                                        {connection.key === 'twitter' ? '𝕏' : 
                                         connection.key === 'discord' ? '💬' : 
                                         connection.key === 'telegram' ? '✈' : '🔗'}
                                    </span>
                                </div>
                                <span className="text-white font-medium">{connection.name}</span>
                            </div>
                            <button
                                onClick={() => toggleConnection(connection.key)}
                                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                                <svg 
                                    width="20" 
                                    height="20" 
                                    viewBox="0 0 20 20" 
                                    fill="none"
                                    className="text-black"
                                >
                                    <path 
                                        d="M15 6L9 12L5 8" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onPrevious}
                    className="flex-1 bg-transparent border border-[#2a3142] text-white py-3 rounded-lg font-medium hover:bg-[#2a3142] transition-colors"
                >
                    PREVIOUS
                </button>
                <button
                    onClick={onFinish}
                    className="flex-1 bg-[#4C82ED] hover:bg-[#3d6bdc] text-white py-3 rounded-lg font-medium transition-colors"
                >
                    FINISH
                </button>
            </div>
        </div>
    )
}

// Auth Layout Component
function OnboardingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen relative">
            <BackgroundPattern />
            <Navbar />
            <main className="relative z-10 mt-20 md:mt-24 flex items-center justify-center p-4">
                {children}
            </main>
        </div>
    )
}

// Main Onboarding Page Component
export function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({
        // Basic Info
        projectName: '',
        website: '',
        profilePicture: null,
        blockchains: [],
        projectCategory: '',
        // Marketing
        brandTone: '',
        targetAudience: [],
        brandKeywords: [],
        socialPlatforms: [],
        // Data Connections
        connectedAccounts: {
            twitter: false,
            discord: false,
            telegram: false,
            reddit: false
        }
    })

    const updateData = (newData: Partial<OnboardingData>) => {
        setOnboardingData(prev => ({ ...prev, ...newData }))
    }

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleFinish = async () => {
        // Here you would typically submit the data to your API
        console.log('Onboarding completed:', onboardingData)
        
        // Create project and redirect to dashboard
        try {
            // await createProject(onboardingData)
            // router.push('/dashboard')
            alert('Onboarding completed! Project created successfully.')
        } catch (error) {
            console.error('Error creating project:', error)
        }
    }

    return (
        <OnboardingLayout>
            <div className="w-full max-w-md md:max-w-lg">
                <StepProgress currentStep={currentStep} totalSteps={3} />
                
                {currentStep === 1 && (
                    <BasicInfoStep
                        data={onboardingData}
                        onChange={updateData}
                        onNext={handleNext}
                    />
                )}
                
                {currentStep === 2 && (
                    <MarketingStep
                        data={onboardingData}
                        onChange={updateData}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                    />
                )}
                
                {currentStep === 3 && (
                    <DataConnectionsStep
                        data={onboardingData}
                        onChange={updateData}
                        onFinish={handleFinish}
                        onPrevious={handlePrevious}
                    />
                )}
            </div>
        </OnboardingLayout>
    )
}