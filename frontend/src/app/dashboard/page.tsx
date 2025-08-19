"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useProjects } from "@/hooks/use-project"
import { useAuth } from "@/hooks/use-auth"
import {
  OnboardingPopup,
  useOnboarding,
} from "@/components/onboarding/onboarding-popup"
import { Project } from "@/lib/api-client"

// Loading skeleton component
const CardSkeleton = () => (
  <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-20 bg-gray-700"></div>
    <div className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
        <div className="h-4 bg-gray-700 rounded w-24"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-700 rounded w-4/5"></div>
      </div>
      <div className="h-10 bg-gray-700 rounded"></div>
    </div>
  </div>
)

const filterOptions = {
  projectType: ["N/A", "AI", "DeFi", "GameFi", "NFT", "DAO", "Web3 Tools"],
  projectStage: [
    "N/A",
    "Idea Stage",
    "MVP",
    "Beta Testing",
    "Live",
    "Testing",
    "Scaling",
  ],
  blockchain: [
    "N/A",
    "Ethereum",
    "Solana",
    "MVP",
    "Binance Smart Chain",
    "Polygon",
    "Avalanche",
    "Toronet",
  ],
  tokenAvailability: [
    "N/A",
    "No Token Yet",
    "Private Sale Ongoing",
    "Public Sale Live",
    "Listed on Exchanges",
  ],
  rewardModel: ["Airdrops", "Revenue Share", "Token Allocation", "Equity"],
  fundingStatus: ["Pre-Seed", "Seed", "Series A", "Series B"],
  teamSize: ["1-10", "11-50", "51-100", "100+"],
  developmentFocus: [
    "DeFi",
    "GameFi",
    "SocialFi",
    "Infrastructure",
    "AI",
    "Web3 Tools",
  ],
}

const tabs = [
  "Trending Now",
  "Recent Partnership",
  "Socials",
  "New Projects",
  "RWA Projects",
  "Web3 projects",
  "VCs",
  "Builders",
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("Trending Now")
  const [currentPage, setCurrentPage] = useState(1)
  const [resultsPerPage, setResultsPerPage] = useState(50)
  const [filters, setFilters] = useState<any>({})

  // Get user data for onboarding
  const { user } = useAuth()

  // Add onboarding hook
  const {
    showProfileSetup,
    startOnboarding,
    handleSetupProfile,
    handleMaybeLater,
    handleClose,
  } = useOnboarding()

  // Use the projects hook for fetching projects
  const queryFilters = {
    page: currentPage,
    limit: resultsPerPage,
    search: searchQuery,
    tab: activeTab.toLowerCase().replace(/\s+/g, "-"),
    ...filters,
  }

  const { data, isLoading, isError } = useProjects(queryFilters)

  // Extract projects and pagination info
  const projects = data?.projects || []
  const pagination = data?.pagination || {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  }

  // Trigger onboarding for new verified users
  useEffect(() => {
    if (user?.isEmailVerified) {
      // Small delay to let the page load, then check for onboarding
      const timer = setTimeout(() => {
        startOnboarding()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [user?.isEmailVerified, startOnboarding])

  // Update page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, resultsPerPage])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleResultsPerPageChange = (newLimit: number) => {
    setResultsPerPage(newLimit)
    setCurrentPage(1)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [filterType]: value === "N/A" ? undefined : value,
    }))
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setFilters({})
    setSearchQuery("")
    setCurrentPage(1)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Badge */}
        <div className="bg-[#121D2E] p-4 md:p-6 rounded-2xl space-y-6">
          <div className="space-y-3 md:space-y-6 bg-gradient-to-r from-[#030816] to-[#0A0E237D] p-4 md:p-6 rounded-2xl ">
            <div className="flex justify-start">
              <div className="flex items-center gap-2 bg-[#1a1f2e] border border-blue-700 rounded-full px-4 py-2">
                <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                  </svg>
                </div>
                <span className="text-white text-sm">Explore SynQit</span>
              </div>
            </div>

            {/* Main Header */}
            <div className="space-y-6">
              <h1 className="text-xl md:text-4xl font-bold text-white">
                Explore Web3 Partnerships Tailored to Your Vision.
              </h1>
              <p className="text-gray-400 text-lg">
                Discover, Connect, Collaborate - Find the Perfect Web3
                Partnership!
              </p>
            </div>
          </div>
          <div className="space-y-3 md:space-y-6 bg-gradient-to-r from-[#030816] to-[#0A0E237D] p-4 md:p-6 rounded-2xl ">
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <div className="flex items-center gap-3 bg-[#1a1f2e] border border-gray-700 rounded-2xl px-5 py-3.5">
                <Image
                  src="/icons/synqit.png"
                  alt="Synqit AI"
                  width={24}
                  height={24}
                  className="rounded"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search projects, VCs, or builders... (AI-powered suggestions)"
                  className="flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Status Messages */}
            <div className="space-y-1">
              <p className="text-gray-400 text-sm italic">
                {isLoading
                  ? "Loading..."
                  : `Showing ${projects.length} results`}
              </p>
              <p className="text-gray-400 text-sm">
                <span className="italic">
                  SynQit AI suggests Partners that Matches your Profile
                </span>{" "}
                <span className="font-medium">(Coming Soon!)</span>
              </p>
            </div>

            {/* AI Suggestions Placeholder */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-pink-500/20 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-500/20 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-green-500/20 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-purple-500/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Filters Container */}
        <div className="space-y-4">
          {/* Filter Row with horizontal scroll */}
          <div className="relative">
            <div className="flex items-start gap-4 overflow-x-auto pb-2 custom-scrollbar">
              <div className="flex flex-nowrap">
                {/* Project Type */}
                <div className="min-w-[180px]">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Project Type
                  </label>
                  <select
                    value={filters.projectType || "N/A"}
                    onChange={(e) =>
                      handleFilterChange("projectType", e.target.value)
                    }
                    className="w-full bg-[#121D2E] border border-gray-700 rounded-l-lg px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filterOptions.projectType.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Project Stage */}
                <div className="min-w-[180px]">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Project Stage
                  </label>
                  <select
                    value={filters.projectStage || "N/A"}
                    onChange={(e) =>
                      handleFilterChange("projectStage", e.target.value)
                    }
                    className="w-full bg-[#121D2E] border border-gray-700 px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filterOptions.projectStage.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Blockchain Network */}
                <div className="min-w-[180px]">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Blockchain Network
                  </label>
                  <select
                    value={filters.blockchain || "N/A"}
                    onChange={(e) =>
                      handleFilterChange("blockchain", e.target.value)
                    }
                    className="w-full bg-[#121D2E] border border-gray-700 px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filterOptions.blockchain.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Token Availability */}
                <div className="min-w-[180px]">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Token Availability
                  </label>
                  <select
                    value={filters.tokenAvailability || "N/A"}
                    onChange={(e) =>
                      handleFilterChange("tokenAvailability", e.target.value)
                    }
                    className="w-full bg-[#121D2E] border border-gray-700 px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filterOptions.tokenAvailability.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reward Model */}
                <div className="min-w-[180px]">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Reward Model
                  </label>
                  <select
                    value={filters.rewardModel || "Airdrops"}
                    onChange={(e) =>
                      handleFilterChange("rewardModel", e.target.value)
                    }
                    className="w-full bg-[#121D2E] border border-gray-700 px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filterOptions.rewardModel.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Funding Status */}
                <div className="min-w-[180px]">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Funding Status
                  </label>
                  <select
                    value={filters.fundingStatus || "Pre-Seed"}
                    onChange={(e) =>
                      handleFilterChange("fundingStatus", e.target.value)
                    }
                    className="w-full bg-[#121D2E] border border-gray-700 px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filterOptions.fundingStatus.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Team Size */}
                <div className="min-w-[180px]">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Team Size
                  </label>
                  <select
                    value={filters.teamSize || "1-10"}
                    onChange={(e) =>
                      handleFilterChange("teamSize", e.target.value)
                    }
                    className="w-full bg-[#121D2E] border border-gray-700 px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filterOptions.teamSize.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Development Focus */}
                <div className="min-w-[180px]">
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Development Focus
                  </label>
                  <select
                    value={filters.developmentFocus || "DeFi"}
                    onChange={(e) =>
                      handleFilterChange("developmentFocus", e.target.value)
                    }
                    className="w-full bg-[#121D2E] border border-gray-700 rounded-r-lg px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {filterOptions.developmentFocus.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action buttons - fixed position */}
              <div className="flex gap-3 mt-6 flex-shrink-0 ml-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3.5 rounded-lg font-medium text-sm transition-colors whitespace-nowrap">
                  Apply Filter
                </button>
                <button
                  onClick={resetFilters}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-3.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  Clear Filter
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#1a1f2e]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        {isError && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">
              Failed to load projects. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        )}

        {!isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {isLoading ? (
              // Show loading skeletons
              Array.from({ length: 8 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            ) : projects.length > 0 ? (
              // Show projects
              projects.map((project: Project) => (
                <div
                  key={project.id}
                  className="bg-[#1a1f2e] border border-gray-800 rounded-2xl overflow-hidden flex flex-col hover:border-gray-700 transition-colors"
                >
                  {/* Banner Image */}
                  <div className="relative h-20 w-full bg-gradient-to-br from-blue-600 to-purple-600">
                    {project.bannerUrl ? (
                      <Image
                        src={project.bannerUrl}
                        alt={`${project.name} banner`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-white text-2xl font-bold">
                          {project.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Project Logo and Name */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 relative rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-1">
                        {project.logoUrl ? (
                          <Image
                            src={project.logoUrl}
                            alt={`${project.name} logo`}
                            fill
                            className="object-contain rounded-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-white font-bold">
                              {project.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-white">
                        {project.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 flex-grow line-clamp-3">
                      {project.description || "No description available"}
                    </p>

                    {/* Project Info */}
                    <div className="space-y-2 mb-3">
                      {project.projectType && (
                        <div className="flex items-center gap-2">
                          <svg
                            width="14"
                            height="15"
                            viewBox="0 0 14 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.64513 7.17116V2.97116C8.64513 1.99116 8.1143 1.79283 7.4668 2.52783L7.00013 3.05866L3.05096 7.55033C2.50846 8.16283 2.73596 8.66449 3.55263 8.66449H5.35513V12.8645C5.35513 13.8445 5.88596 14.0428 6.53346 13.3078L7.00013 12.777L10.9493 8.28533C11.4918 7.67283 11.2643 7.17116 10.4476 7.17116H8.64513Z"
                              fill="#6B7280"
                            />
                          </svg>
                          <span className="text-sm text-gray-400">
                            Type: {project.projectType}
                          </span>
                        </div>
                      )}

                      {project.projectStage && (
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm text-gray-400">
                            Stage: {project.projectStage}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-gray-400">
                          {project.isLookingForFunding &&
                          project.isLookingForPartners
                            ? "Seeking Funding & Partners"
                            : project.isLookingForFunding
                            ? "Seeking Funding"
                            : project.isLookingForPartners
                            ? "Seeking Partners"
                            : "Not actively seeking"}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tags?.slice(0, 3).map((tag, index) => (
                        <span
                          key={
                            typeof tag === "string"
                              ? tag
                              : tag.id || tag.tag || index
                          }
                          className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs"
                        >
                          {typeof tag === "string" ? tag : tag.tag}
                        </span>
                      )) ||
                        project.blockchainPreferences
                          ?.slice(0, 3)
                          .map((blockchain) => (
                            <span
                              key={blockchain.id || blockchain.blockchain}
                              className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs"
                            >
                              {blockchain.blockchain}
                            </span>
                          ))}
                    </div>

                    {/* View Details Button */}
                    <Link href={`/dashboard/explore/${project.id}`}>
                      <button className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors duration-200 font-medium text-sm">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // No projects found
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 mb-4">
                  No projects found matching your criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Result per page</span>
              <select
                value={resultsPerPage}
                onChange={(e) =>
                  handleResultsPerPageChange(Number(e.target.value))
                }
                className="bg-[#1a1f2e] border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
            <span className="text-gray-400 text-sm">
              {pagination.total > 0
                ? `${(pagination.page - 1) * pagination.limit + 1}-${Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )} of ${pagination.total}`
                : "0 results"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-white hover:bg-[#1a1f2e] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-white hover:bg-[#1a1f2e] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <span className="px-3 py-1 text-sm text-gray-400">
              Page {currentPage} of {pagination.totalPages || 1}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pagination.totalPages}
              className="p-2 text-gray-500 hover:text-white hover:bg-[#1a1f2e] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              disabled={currentPage >= pagination.totalPages}
              className="p-2 text-gray-500 hover:text-white hover:bg-[#1a1f2e] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Onboarding popup */}
      <OnboardingPopup
        isOpen={showProfileSetup}
        onClose={handleClose}
        onSetupProfile={handleSetupProfile}
        onMaybeLater={handleMaybeLater}
      />
    </>
  )
}
