"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { dashboardApi, projectApi } from "@/lib/api-client"
import { useAuth } from "@/hooks/use-auth"
import type { Partnership, Project } from "@/lib/api-client"
import { buildStyles, CircularProgressbar } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

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
  const [cancellingPartnership, setCancellingPartnership] = useState(false)

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
          setError("User not authenticated")
          return
        }
        const isIncoming = partnershipData.receiverId === currentUserId
        const partnerProjectId = isIncoming
          ? partnershipData.requesterProject?.id
          : partnershipData.receiverProject?.id

        // Fetch partner's project details if available
        if (partnerProjectId) {
          try {
            const projectData = await projectApi.getProjectById(
              partnerProjectId
            )
            setPartnerProject(projectData)
          } catch (projectError) {
            console.warn(
              "Could not fetch partner project details:",
              projectError
            )
          }
        }
      } catch (err: any) {
        console.error("Error fetching partnership details:", err)
        setError("Failed to load partnership details")
      } finally {
        setLoading(false)
      }
    }

    fetchPartnershipDetails()
  }, [params])

  const handleCancelPartnership = async () => {
    if (!partnership || !user) return

    const confirmed = window.confirm(
      `Are you sure you want to cancel your partnership request with ${
        partnerProjectInfo?.name || `${partner?.firstName} ${partner?.lastName}`
      }?`
    )

    if (!confirmed) return

    try {
      setCancellingPartnership(true)
      await dashboardApi.cancelPartnership(partnership.id)

      // Update the local state to reflect the change
      setPartnership((prev) =>
        prev
          ? {
              ...prev,
              status: "CANCELLED" as const,
              updatedAt: new Date().toISOString(),
              respondedAt: new Date().toISOString(),
            }
          : prev
      )

      alert("Partnership request cancelled successfully!")
    } catch (error: any) {
      console.error("Error cancelling partnership:", error)
      alert("Failed to cancel partnership request. Please try again.")
    } finally {
      setCancellingPartnership(false)
    }
  }

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
            <h1 className="text-2xl font-bold text-white mb-4">
              Partnership Not Found
            </h1>
            <p className="text-gray-400 mb-6">
              {error ||
                "The partnership you're looking for doesn't exist or has been removed."}
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
            <h1 className="text-2xl font-bold text-white mb-4">
              Authentication Required
            </h1>
            <p className="text-gray-400 mb-6">
              Please log in to view partnership details.
            </p>
            <button
              onClick={() => router.push("/auth")}
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
  const partnerProjectInfo = isIncoming
    ? partnership.requesterProject
    : partnership.receiverProject

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
    <div className="min-h-screen ">
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
        <div className="h-72 relative overflow-hidden rounded-4xl">
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
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
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
        <div className="relative -mt-40 ">
          <div className="bg-[#121D2EE5] backdrop-blur-[24px] rounded-2xl p-6 border border-[#374151]">
            <div className="flex gap-2 justify-between md:flex-row flex-col">
              <div className="flex items-center gap-4 md:-mt-12 md:mb-4">
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
                <h1 className="text-xl font-bold text-white mb-2">
                  {partnerProjectInfo?.name ||
                    `${partner.firstName} ${partner.lastName}`}
                </h1>
              </div>
              {/* Compatibility Score - Blue border with dark green number bg */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-400 text-sm">
                  Compatibility Score
                </span>
                <CircularProgressbar
                  value={48}
                  text={`${48}%`}
                  styles={{
                    ...buildStyles({
                      textColor: "#fff",
                    }),
                    root: { width: 60, height: 60 },
                  }}
                />
              </div>
            </div>
            <div className="flex items-start gap-6">
              {/* Profile Info */}
              <div className="flex-1">
                {/* Stats */}
                <div className="flex items-center gap-6 mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">👤</span>
                    <span className="text-white font-medium">
                      {partner.firstName} {partner.lastName}
                    </span>
                    <span className="text-gray-400">owner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📅</span>
                    <span className="text-white font-medium">
                      {partnerProject?.foundedYear || "N/A"}
                    </span>
                    <span className="text-gray-400">founded</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 mb-4 max-w-2xl text-sm">
                  {partnerProject?.description ||
                    partnership.description ||
                    `${
                      partnerProjectInfo?.name ||
                      partner.firstName + " " + partner.lastName
                    } is looking to establish partnerships in the ${
                      partnerProject?.projectType || "Web3"
                    } space.`}
                </p>

                {/* Request Type */}
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⚡</span>
                  <span className="text-white text-sm">
                    Request Type: {partnership.partnershipType}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-5 items-center justify-between flex-wrap">
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
              {/* Right Side Actions - Row layout instead of column */}
              <div className="flex gap-3">
                {/* Show Cancel button only if user is the requester and partnership is pending */}
                {partnership.requesterId === user?.id &&
                  partnership.status === "PENDING" && (
                    <button
                      onClick={handleCancelPartnership}
                      disabled={cancellingPartnership}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingPartnership
                        ? "Cancelling..."
                        : "Cancel Request"}
                    </button>
                  )}

                {/* Show status for non-pending partnerships */}
                {partnership.status !== "PENDING" && (
                  <div className="px-4 py-2 rounded-lg text-sm border border-synqit-border">
                    <span
                      className={`font-medium ${
                        partnership.status === "ACCEPTED"
                          ? "text-green-400"
                          : partnership.status === "REJECTED"
                          ? "text-red-400"
                          : partnership.status === "CANCELLED"
                          ? "text-gray-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {partnership.status === "CANCELLED"
                        ? "Request Cancelled"
                        : partnership.status === "ACCEPTED"
                        ? "Partnership Active"
                        : partnership.status === "REJECTED"
                        ? "Request Declined"
                        : partnership.status}
                    </span>
                  </div>
                )}

                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  Following ✓
                </button>
              </div>
            </div>

            {/* Partners Icons - Using actual images instead of gradients */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-white text-sm mr-2">Partners</span>
              <div className="flex gap-1">
                {/* These would be actual partner images */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gray-600 rounded-full overflow-hidden"
                  >
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
              <span className="bg-[#374151] text-gray-300 px-3 py-1 rounded-full text-sm">
                RWA
              </span>
              <span className="bg-[#374151] text-gray-300 px-3 py-1 rounded-full text-sm">
                DeFi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links Section */}
      <div className="px-6 mt-8">
        <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
          {partnerProject?.twitterHandle && (
            <a
              href={`https://twitter.com/${partnerProject.twitterHandle.replace(
                "@",
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1E2837] border border-[#374151] rounded-xl p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#374151] rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">Twitter</div>
                  <div className="text-sm text-blue-400">
                    {partnerProject.twitterHandle}
                  </div>
                </div>
              </div>
            </a>
          )}

          {partnerProject?.discordServer && (
            <a
              href={partnerProject.discordServer}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1E2837] border border-[#374151] rounded-xl p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#374151] rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">Discord</div>
                  <div className="text-sm text-indigo-400">Join Server</div>
                </div>
              </div>
            </a>
          )}

          {partnerProject?.telegramGroup && (
            <a
              href={partnerProject.telegramGroup}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1E2837] border border-[#374151] rounded-xl p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#374151] rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">Telegram</div>
                  <div className="text-sm text-blue-400">Join Group</div>
                </div>
              </div>
            </a>
          )}

          {partnerProject?.website && (
            <a
              href={partnerProject.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1E2837] border border-[#374151] rounded-xl p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#374151] rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium">Website</div>
                  <div className="text-sm text-green-400">Visit Site</div>
                </div>
              </div>
            </a>
          )}

          {/* Fill remaining slots with placeholders if less than 4 social links */}
          {[
            ...Array(
              Math.max(
                0,
                4 -
                  [
                    partnerProject?.twitterHandle,
                    partnerProject?.discordServer,
                    partnerProject?.telegramGroup,
                    partnerProject?.website,
                  ].filter(Boolean).length
              )
            ),
          ].map((_, index) => (
            <div
              key={index}
              className="bg-[#1E2837] border border-[#374151] rounded-xl p-4 opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#374151] rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-500 font-medium">Not Available</div>
                  <div className="text-sm text-gray-600">-</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rest of the content remains the same... */}
      {/* Two Column Layout */}
      <div className="px-6 mt-8 grid md:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="col-span-2 space-y-8">
          {/* About Project */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              About{" "}
              {partnerProjectInfo?.name ||
                `${partner.firstName} ${partner.lastName}`}
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Project Description:
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {partnerProject?.description ||
                    partnership.description ||
                    `${
                      partnerProjectInfo?.name ||
                      `${partner.firstName} ${partner.lastName}`
                    } is a Web3 project focused on building innovative solutions in the blockchain space. They are looking to collaborate with like-minded projects to create meaningful partnerships and drive the ecosystem forward.`}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  What We Offer for Partnerships:
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  {partnership.proposedTerms ||
                    `This partnership request aims to explore collaboration opportunities in the ${
                      partnerProject?.projectType || "Web3"
                    } space. We're looking for strategic partnerships that can benefit both projects and create value for our communities.`}
                </p>
                <div className="space-y-1 text-gray-400">
                  {partnerProject?.blockchainPreferences &&
                    partnerProject.blockchainPreferences.length > 0 && (
                      <p>
                        <strong>Blockchain Used:</strong>{" "}
                        {partnerProject.blockchainPreferences
                          .map((bp) => bp.blockchain)
                          .join(", ")}
                      </p>
                    )}
                  <p>
                    <strong>Industry Focus:</strong>{" "}
                    {partnerProject?.projectType || "Web3"} |{" "}
                    {partnerProject?.projectStage || "Development"}
                  </p>
                  {partnerProject?.totalFunding && (
                    <p>
                      <strong>Funding Stage:</strong> $
                      {Number(partnerProject.totalFunding).toLocaleString()}{" "}
                      raised
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Project Banner Section */}
          <div className="bg-[#1E2837] border border-[#374151] rounded-xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 relative rounded-full flex items-center justify-center overflow-hidden">
                {partnerProject?.logoUrl ? (
                  <Image
                    src={partnerProject.logoUrl}
                    alt="Project Logo"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {(partnerProjectInfo?.name || partner.firstName)
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {partnerProjectInfo?.name ||
                    `${partner.firstName} ${partner.lastName}`}
                </h3>
                <p className="text-blue-400">
                  {partnership.title ||
                    `Partnership opportunity in ${
                      partnerProject?.projectType || "Web3"
                    } development`}
                </p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              {partnerProject?.description ||
                partnership.description ||
                `Explore partnership opportunities with ${
                  partnerProjectInfo?.name ||
                  `${partner.firstName} ${partner.lastName}`
                }. This collaboration aims to create synergies between our projects and drive innovation in the Web3 space.`}
            </p>
            {partnerProject?.website && (
              <a
                href={partnerProject.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Visit {partnerProjectInfo?.name || "Project"} Website →
              </a>
            )}
          </div>

          {/* Partnership Details */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Partnership Details
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  💼 Partnership Type:
                </h4>
                <div className="space-y-2 text-gray-400">
                  <p>
                    {partnership.partnershipType.replace(/_/g, " ")} Partnership
                  </p>
                  <p>
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        partnership.status === "PENDING"
                          ? "text-yellow-400"
                          : partnership.status === "ACCEPTED"
                          ? "text-green-400"
                          : partnership.status === "REJECTED"
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {partnership.status}
                    </span>
                  </p>
                  <p>
                    Created:{" "}
                    {new Date(partnership.createdAt).toLocaleDateString()}
                  </p>
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
            <h2 className="text-xl font-bold text-white mb-4">
              Eligibility & Requirements
            </h2>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-3">
                  📋 Requirements to Join:
                </h4>
                <div className="space-y-2 text-gray-400">
                  <p>✅ Must be a verified Web3 project</p>
                  <p>
                    ✅ Have an active community (Telegram, Discord, Twitter)
                  </p>
                  <p>✅ Must align with Mintrise's ecosystem goals</p>
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">
                  📞 How to Apply:
                </h4>
                <div className="space-y-1 text-gray-400">
                  <p>
                    Click "Request Partnership" to send a connection request
                  </p>
                  <p>Mintrise will review and approve based on alignment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Partnership Status & Activity */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Partnership Status & Activity
            </h2>

            <div className="space-y-4">
              <p className="text-gray-400">
                📅 Upcoming Joint Events: (Event List)
              </p>
              <p className="text-gray-400">
                📢 Recent Announcements: Follow social media account to get
                updated
              </p>

              <div>
                <h4 className="text-white font-medium mb-3">
                  🤝 Active Collaborations:
                </h4>
                <div className="flex gap-4 flex-wrap">
                  {[
                    "ShortLegagos",
                    "Mintrise",
                    "We3oost",
                    "TechExplore",
                    "We3oost",
                  ].map((name, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-[#1E2837] rounded-full px-3 py-1 border border-[#374151]"
                    >
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
              🚀 Partnership Status
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl">
              {partnership.status === "PENDING"
                ? `Your partnership request with ${
                    partnerProjectInfo?.name ||
                    `${partner.firstName} ${partner.lastName}`
                  } is pending review.`
                : partnership.status === "ACCEPTED"
                ? `Your partnership with ${
                    partnerProjectInfo?.name ||
                    `${partner.firstName} ${partner.lastName}`
                  } has been accepted! Start collaborating now.`
                : partnership.status === "REJECTED"
                ? `Unfortunately, your partnership request with ${
                    partnerProjectInfo?.name ||
                    `${partner.firstName} ${partner.lastName}`
                  } was not accepted at this time.`
                : partnership.status === "CANCELLED"
                ? `You have cancelled your partnership request with ${
                    partnerProjectInfo?.name ||
                    `${partner.firstName} ${partner.lastName}`
                  }.`
                : `Partnership status: ${partnership.status}`}
            </p>

            {partnership.status === "ACCEPTED" && (
              <div className="flex gap-4 mb-6">
                <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Start Collaboration
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                  Send Message
                </button>
              </div>
            )}

            {partnership.status === "PENDING" && (
              <div className="flex gap-4 mb-6">
                <button
                  className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium cursor-not-allowed"
                  disabled
                >
                  Waiting for Response
                </button>
              </div>
            )}

            <p className="text-gray-400 mb-6">
              Stay connected with{" "}
              {partnerProjectInfo?.name ||
                `${partner.firstName} ${partner.lastName}`}{" "}
              for updates!
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              {partnerProject?.twitterHandle && (
                <a
                  href={`https://twitter.com/${partnerProject.twitterHandle.replace(
                    "@",
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {partnerProject?.discordServer && (
                <a
                  href={partnerProject.discordServer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
                  </svg>
                </a>
              )}
              {partnerProject?.telegramGroup && (
                <a
                  href={partnerProject.telegramGroup}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              )}
              {partnerProject?.website && (
                <a
                  href={partnerProject.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                    />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* How to Apply */}
          <div className="bg-[#1E2837] border border-[#374151] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              How to Apply for Partnership
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <p className="text-gray-300 text-sm">
                  Apply to Collaborate Above
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <p className="text-gray-300 text-sm">
                  Wait for an email if you match our preferences
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <p className="text-gray-300 text-sm">Complete the onboarding</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  4
                </div>
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
                <h4 className="text-white font-medium">
                  Follow{" "}
                  {partnerProjectInfo?.name ||
                    `${partner.firstName} ${partner.lastName}`}{" "}
                  on SynQit
                </h4>
                <p className="text-gray-400 text-sm">
                  Stay updated with their news & trends
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-sm">+</span>
              </div>
            </div>
          </div>

          {/* Partnership Info */}
          <div className="bg-[#1E2837] border border-[#374151] rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Partnership Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span
                  className={`font-medium ${
                    partnership.status === "PENDING"
                      ? "text-yellow-400"
                      : partnership.status === "ACCEPTED"
                      ? "text-green-400"
                      : partnership.status === "REJECTED"
                      ? "text-red-400"
                      : partnership.status === "CANCELLED"
                      ? "text-gray-400"
                      : "text-gray-400"
                  }`}
                >
                  {partnership.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white">
                  {partnership.partnershipType.replace(/_/g, " ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Created:</span>
                <span className="text-white">
                  {new Date(partnership.createdAt).toLocaleDateString()}
                </span>
              </div>
              {partnership.respondedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Responded:</span>
                  <span className="text-white">
                    {new Date(partnership.respondedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
