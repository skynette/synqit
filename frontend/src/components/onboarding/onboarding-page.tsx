'use client'

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BackgroundPattern } from "@/components/ui/background-pattern"
import { Navbar } from "@/components/layout/navbar"
import { useProject } from "@/hooks/use-project"
// Define types inline since they're not exported from api-client
type ProjectType = 'AI' | 'DEFI' | 'GAMEFI' | 'NFT' | 'DAO' | 'WEB3_TOOLS' | 'INFRASTRUCTURE' | 'METAVERSE' | 'SOCIAL' | 'OTHER'
type ProjectStage = 'IDEA_STAGE' | 'MVP' | 'BETA_TESTING' | 'LIVE' | 'SCALING' | 'MATURE'
type Blockchain = 'ETHEREUM' | 'BITCOIN' | 'SOLANA' | 'POLYGON' | 'BINANCE_SMART_CHAIN' | 'AVALANCHE' | 'CARDANO' | 'POLKADOT' | 'COSMOS' | 'ARBITRUM' | 'OPTIMISM' | 'BASE' | 'OTHER'

// Types
interface BasicInfoData {
    projectName: string
    website: string
    profilePicture: File | null
    blockchains: Blockchain[]
    projectCategory: ProjectType
}

interface MarketingData {
    brandTone: string
    targetAudience: string[]
    brandKeywords: string[]
    socialPlatforms: string[]
    developmentFocus: string
}

interface DataConnectionsData {
    socialLinks: {
        twitter: string
        discord: string
        telegram: string
        reddit: string
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
                        "Social Links (Optional)"
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
    onNext,
    errors = {},
    showErrors = false,
    validateStep1,
    setShowErrors
}: { 
    data: BasicInfoData; 
    onChange: (data: Partial<BasicInfoData>) => void; 
    onNext: () => void;
    errors?: Record<string, string>;
    showErrors?: boolean;
    validateStep1: () => boolean;
    setShowErrors: (show: boolean) => void;
}) {
    const [focusedField, setFocusedField] = useState<string>("")
    const [blockchainDropdownOpen, setBlockchainDropdownOpen] = useState(false)
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const blockchainOptions: Blockchain[] = [
        'ETHEREUM', 'POLYGON', 'SOLANA', 'BINANCE_SMART_CHAIN', 
        'CARDANO', 'POLKADOT', 'AVALANCHE', 'COSMOS', 'ARBITRUM', 
        'OPTIMISM', 'BASE', 'OTHER'
    ]

    const categoryOptions: ProjectType[] = [
        'DEFI', 'NFT', 'GAMEFI', 'INFRASTRUCTURE', 'SOCIAL', 'DAO', 'METAVERSE', 
        'AI', 'WEB3_TOOLS', 'OTHER'
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

    const toggleBlockchain = (blockchain: Blockchain) => {
        const newBlockchains = data.blockchains.includes(blockchain)
            ? data.blockchains.filter(b => b !== blockchain)
            : [...data.blockchains, blockchain]
        onChange({ blockchains: newBlockchains })
    }

    const handleNext = () => {
        setShowErrors(true)
        if (validateStep1()) {
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
                    <div className={`${focusedField === 'projectName' ? 'gradient-border' : showErrors && errors.projectName ? 'border border-red-500' : 'gray-border'} rounded-lg`}>
                        <input
                            type="text"
                            placeholder="Project Name *"
                            value={data.projectName}
                            onChange={(e) => onChange({ projectName: e.target.value })}
                            onFocus={() => setFocusedField('projectName')}
                            onBlur={() => setFocusedField('')}
                            className="w-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white placeholder-gray-400 border-none focus:outline-none"
                        />
                    </div>
                    {showErrors && errors.projectName && (
                        <p className="text-red-500 text-sm mt-1">{errors.projectName}</p>
                    )}
                </div>

                {/* Website */}
                <div>
                    <div className={`${focusedField === 'website' ? 'gradient-border' : showErrors && errors.website ? 'border border-red-500' : 'gray-border'} rounded-lg`}>
                        <input
                            type="url"
                            placeholder="Website (https://...)"
                            value={data.website}
                            onChange={(e) => onChange({ website: e.target.value })}
                            onFocus={() => setFocusedField('website')}
                            onBlur={() => setFocusedField('')}
                            className="w-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white placeholder-gray-400 border-none focus:outline-none"
                        />
                    </div>
                    {showErrors && errors.website && (
                        <p className="text-red-500 text-sm mt-1">{errors.website}</p>
                    )}
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
                                    ? data.blockchains.map(b => b.replace(/_/g, ' ')).join(', ')
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
                                            <span className="text-white">{blockchain.replace(/_/g, ' ')}</span>
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
                    {showErrors && errors.blockchains && (
                        <p className="text-red-500 text-sm mt-1">{errors.blockchains}</p>
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
                    {showErrors && errors.projectCategory && (
                        <p className="text-red-500 text-sm mt-1">{errors.projectCategory}</p>
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
    onPrevious,
    errors = {},
    showErrors = false,
    validateStep2,
    setShowErrors
}: { 
    data: MarketingData; 
    onChange: (data: Partial<MarketingData>) => void; 
    onNext: () => void;
    onPrevious: () => void;
    errors?: Record<string, string>;
    showErrors?: boolean;
    validateStep2: () => boolean;
    setShowErrors: (show: boolean) => void;
}) {
    const [focusedField, setFocusedField] = useState<string>('')
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
        setShowErrors(true)
        if (validateStep2()) {
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
                    {showErrors && errors.brandTone && (
                        <p className="text-red-500 text-sm mt-1">{errors.brandTone}</p>
                    )}
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
                    {showErrors && errors.targetAudience && (
                        <p className="text-red-500 text-sm mt-1">{errors.targetAudience}</p>
                    )}
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

                {/* Development Focus */}
                <div>
                    <label className="text-white text-sm font-medium block mb-3">Development Focus</label>
                    <div className={`${focusedField === 'developmentFocus' ? 'gradient-border' : 'gray-border'} rounded-lg`}>
                        <textarea
                            placeholder="What are you currently focusing on? (e.g., Building MVP, Token Launch, Partnership Development)"
                            value={data.developmentFocus}
                            onChange={(e) => onChange({ developmentFocus: e.target.value })}
                            onFocus={() => setFocusedField('developmentFocus')}
                            onBlur={() => setFocusedField('')}
                            className="w-full bg-[#0a0f1c] rounded-lg px-4 py-3 text-white placeholder-gray-400 border-none focus:outline-none resize-none"
                            rows={3}
                        />
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
    onPrevious,
    errors = {},
    showErrors = false,
    isLoading = false
}: { 
    data: DataConnectionsData; 
    onChange: (data: Partial<DataConnectionsData>) => void; 
    onFinish: () => void;
    onPrevious: () => void;
    errors?: Record<string, string>;
    showErrors?: boolean;
    isLoading?: boolean;
}) {
    const [focusedField, setFocusedField] = useState<string>('')
    
    const socialConnections = [
        { key: 'twitter' as const, name: 'Twitter/X Handle', placeholder: '@username', color: '#1DA1F2' },
        { key: 'discord' as const, name: 'Discord Server', placeholder: 'https://discord.gg/...', color: '#5865F2' },
        { key: 'telegram' as const, name: 'Telegram Group', placeholder: 'https://t.me/...', color: '#0088CC' },
        { key: 'reddit' as const, name: 'Reddit Community', placeholder: 'r/community', color: '#FF4500' }
    ]

    const updateSocialLink = (key: keyof DataConnectionsData['socialLinks'], value: string) => {
        onChange({
            socialLinks: {
                ...data.socialLinks,
                [key]: value
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">
                    Social Connections
                </h1>
                <p className="text-gray-400">Add your social links (optional)</p>
            </div>

            <div className="bg-[#1a1f2e] border border-[#2a3142] rounded-2xl p-6 space-y-6">
                <div>
                    <h3 className="text-white text-lg font-semibold">Connect your Social Accounts</h3>
                    <p className="text-gray-400 text-sm mt-1">Optional - Add your social media links to help others connect with you</p>
                </div>

                <div className="space-y-4">
                    {socialConnections.map((connection) => (
                        <div key={connection.key}>
                            <label className="text-gray-300 text-sm mb-2 block">{connection.name}</label>
                            <div className={`${focusedField === connection.key ? 'gradient-border' : showErrors && errors[connection.key] ? 'border border-red-500' : 'gray-border'} rounded-lg`}>
                                <div className="flex items-center gap-3 bg-[#0a0f1c] rounded-lg px-4 py-3">
                                    <div 
                                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: connection.color }}
                                    >
                                        <span className="text-white text-sm font-bold">
                                            {connection.key === 'twitter' ? '𝕏' : 
                                             connection.key === 'discord' ? '💬' : 
                                             connection.key === 'telegram' ? '✈' : '🔗'}
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={connection.placeholder}
                                        value={data.socialLinks[connection.key]}
                                        onChange={(e) => updateSocialLink(connection.key, e.target.value)}
                                        onFocus={() => setFocusedField(connection.key)}
                                        onBlur={() => setFocusedField('')}
                                        className="flex-1 bg-transparent text-white placeholder-gray-400 border-none focus:outline-none"
                                    />
                                </div>
                            </div>
                            {showErrors && errors[connection.key] && (
                                <p className="text-red-500 text-sm mt-1">{errors[connection.key]}</p>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="text-center">
                    <p className="text-gray-500 text-sm">You can skip this step and add social links later from your profile</p>
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
                    onClick={() => {
                        console.log('Finish button clicked')
                        onFinish()
                    }}
                    disabled={isLoading}
                    className="flex-1 bg-[#4C82ED] hover:bg-[#3d6bdc] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Project...
                        </>
                    ) : (
                        'FINISH'
                    )}
                </button>
            </div>
        </div>
    )
}

// Right Side Component for Desktop
function OnboardingRightSide() {
    return (
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-center p-8 xl:p-12">
            <div className="max-w-lg">
                <h2 className="text-3xl xl:text-4xl font-bold text-white mb-6">
                    Build Your Web3 Network in Seconds.
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                    Start connecting with like-minded projects and unlock powerful collaborations
                </p>
                
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl p-6 mb-8 relative">
                    {/* Feature Image */}
                    <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
                        <Image
                            src="/images/how-it-works-1.png"
                            alt="Create and Optimize Your Profile"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    
                    <div className="flex justify-center mb-4">
                        <div className="bg-[#4C82ED] text-white px-4 py-2 rounded-full text-sm font-medium">
                            You
                        </div>
                    </div>
                    
                    <h3 className="text-white text-xl font-semibold text-center mb-3">
                        Set Up Your Profile for Better Matches
                    </h3>
                    <p className="text-gray-400 text-center text-sm mb-4">
                        Showcase your company, blockchain focus, funding stage & interests.
                    </p>
                    <p className="text-gray-400 text-center text-sm">
                        AI enhances your profile for maximum visibility & match accuracy.
                    </p>
                    
                    {/* Decorative dots pattern */}
                    <div className="absolute top-4 right-4 opacity-30">
                        <div className="grid grid-cols-8 gap-1">
                            {Array.from({ length: 32 }, (_, i) => (
                                <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <p className="text-gray-400 text-base">
                    Let's start by showcasing your project — we'll create a personalized profile page to help you stand out, build trust, and attract the right collaborators.
                </p>
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
            <div className="relative z-10 mt-20 md:mt-24 flex min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-96px)]">
                {/* Left side - Form */}
                <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-4">
                    {children}
                </div>
                {/* Right side - Desktop only */}
                <OnboardingRightSide />
            </div>
        </div>
    )
}

// Validation helpers
const validateUrl = (url: string): boolean => {
    if (!url) return true; // Optional fields
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

const validateTwitterHandle = (handle: string): boolean => {
    if (!handle) return true; // Optional
    return /^@?[A-Za-z0-9_]{1,15}$/.test(handle);
}

// Main Onboarding Page Component
export function OnboardingPage() {
    const router = useRouter()
    const { createOrUpdateProject, isSaving, saveError } = useProject()
    const [currentStep, setCurrentStep] = useState(1)
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const [showErrors, setShowErrors] = useState(false)
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({
        // Basic Info
        projectName: '',
        website: '',
        profilePicture: null,
        blockchains: [],
        projectCategory: '' as ProjectType,
        // Marketing
        brandTone: '',
        targetAudience: [],
        brandKeywords: [],
        socialPlatforms: [],
        developmentFocus: '',
        // Data Connections
        socialLinks: {
            twitter: '',
            discord: '',
            telegram: '',
            reddit: ''
        }
    })

    const validateStep1 = (): boolean => {
        const errors: Record<string, string> = {}
        
        // Basic Info validations
        if (!onboardingData.projectName || onboardingData.projectName.length < 1) {
            errors.projectName = 'Project name is required'
        } else if (onboardingData.projectName.length > 100) {
            errors.projectName = 'Project name must not exceed 100 characters'
        }
        
        if (onboardingData.website && !validateUrl(onboardingData.website)) {
            errors.website = 'Please enter a valid URL'
        }
        
        if (onboardingData.blockchains.length === 0) {
            errors.blockchains = 'Please select at least one blockchain'
        }
        
        if (!onboardingData.projectCategory) {
            errors.projectCategory = 'Please select a project category'
        }
        
        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const validateStep2 = (): boolean => {
        const errors: Record<string, string> = {}
        
        // Marketing validations
        if (!onboardingData.brandTone) {
            errors.brandTone = 'Please select a brand tone'
        }
        
        if (onboardingData.targetAudience.length === 0) {
            errors.targetAudience = 'Please select at least one target audience'
        }
        
        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const validateStep3 = (): boolean => {
        const errors: Record<string, string> = {}
        
        // Social links validations - all optional
        if (onboardingData.socialLinks.twitter && onboardingData.socialLinks.twitter.trim()) {
            if (!validateTwitterHandle(onboardingData.socialLinks.twitter)) {
                errors.twitter = 'Invalid Twitter handle (1-15 characters, letters, numbers, underscore)'
            }
        }
        
        if (onboardingData.socialLinks.discord && onboardingData.socialLinks.discord.trim()) {
            if (!validateUrl(onboardingData.socialLinks.discord)) {
                errors.discord = 'Please enter a valid Discord URL'
            }
        }
        
        if (onboardingData.socialLinks.telegram && onboardingData.socialLinks.telegram.trim()) {
            if (!validateUrl(onboardingData.socialLinks.telegram)) {
                errors.telegram = 'Please enter a valid Telegram URL'
            }
        }
        
        if (onboardingData.socialLinks.reddit && onboardingData.socialLinks.reddit.trim()) {
            // Reddit can be r/community or URL
            const reddit = onboardingData.socialLinks.reddit.trim();
            if (!reddit.startsWith('r/') && !validateUrl(reddit)) {
                errors.reddit = 'Please enter a valid Reddit community (r/community) or URL'
            }
        }
        
        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const validateAllSteps = (): boolean => {
        return validateStep1() && validateStep2() && validateStep3()
    }

    const updateData = (newData: Partial<OnboardingData>) => {
        setOnboardingData(prev => ({ ...prev, ...newData }))
        // Clear specific errors when user updates data
        if (showErrors) {
            validateAllSteps()
        }
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
        console.log('handleFinish called')
        setShowErrors(true)
        
        const isValid = validateAllSteps()
        console.log('Form validation result:', isValid)
        console.log('Validation errors:', validationErrors)
        
        if (!isValid) {
            console.log('Form validation failed, scrolling to top')
            // Scroll to top to show errors
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
        }
        
        // Auto-generate description from project name and category
        const generateDescription = () => {
            const category = onboardingData.projectCategory ? onboardingData.projectCategory.replace(/_/g, ' ').toLowerCase() : 'web3';
            const audience = onboardingData.targetAudience.length > 0 ? onboardingData.targetAudience.join(', ').toLowerCase() : 'users';
            const blockchain = onboardingData.blockchains.length > 0 ? onboardingData.blockchains[0].replace(/_/g, ' ').toLowerCase() : 'blockchain';
            
            return `${onboardingData.projectName} is a ${category} project built on ${blockchain}, designed to serve ${audience}. We're focused on ${onboardingData.developmentFocus || 'building innovative solutions in the web3 space'}.`;
        }

        // Transform onboarding data to match API format
        const projectData = {
            name: onboardingData.projectName,
            description: generateDescription(),
            website: onboardingData.website || undefined,
            projectType: onboardingData.projectCategory,
            developmentFocus: onboardingData.developmentFocus || undefined,
            blockchainPreferences: onboardingData.blockchains,
            tags: onboardingData.brandKeywords,
            // Social links - only include if provided
            twitterHandle: onboardingData.socialLinks.twitter || undefined,
            discordServer: onboardingData.socialLinks.discord || undefined,
            telegramGroup: onboardingData.socialLinks.telegram || undefined,
            redditCommunity: onboardingData.socialLinks.reddit || undefined,
            // Additional fields can be added later
            projectStage: 'IDEA_STAGE' as const,
            isLookingForPartners: true,
        }
        
        console.log('Project data to be sent:', projectData)
        console.log('Onboarding data:', onboardingData)
        
        try {
            console.log('Calling createOrUpdateProject...')
            await createOrUpdateProject(projectData)
            console.log('Project created successfully, redirecting to dashboard...')
            // Small delay to ensure state updates are processed
            setTimeout(() => {
                router.replace('/dashboard')
            }, 100)
        } catch (error: any) {
            console.error('Error creating project:', error)
            console.error('Error details:', error?.response?.data)
            // Handle API validation errors
            if (error?.response?.data?.errors) {
                const apiErrors: Record<string, string> = {}
                error.response.data.errors.forEach((err: any) => {
                    apiErrors[err.path] = err.msg
                })
                setValidationErrors(apiErrors)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
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
                        errors={validationErrors}
                        showErrors={showErrors}
                        validateStep1={validateStep1}
                        setShowErrors={setShowErrors}
                    />
                )}
                
                {currentStep === 2 && (
                    <MarketingStep
                        data={onboardingData}
                        onChange={updateData}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        errors={validationErrors}
                        showErrors={showErrors}
                        validateStep2={validateStep2}
                        setShowErrors={setShowErrors}
                    />
                )}
                
                {currentStep === 3 && (
                    <DataConnectionsStep
                        data={onboardingData}
                        onChange={updateData}
                        onFinish={handleFinish}
                        onPrevious={handlePrevious}
                        errors={validationErrors}
                        showErrors={showErrors}
                        isLoading={isSaving}
                    />
                )}
            </div>
        </OnboardingLayout>
    )
}