// ProjectCard.tsx
"use client"

import { Project } from "@/lib/api-client"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { Zap } from "lucide-react"

type CardVariant =
  | "tech-fit"
  | "performance"
  | "marketing"
  | "token-performance"

function clampPct(n: number) {
  return Math.max(0, Math.min(100, n))
}

function ProgressBar({
  value,
  track = "#D9DEE7",
  fill = "#37C27F",
}: {
  value: number
  track?: string
  fill?: string
}) {
  const v = clampPct(value)
  return (
    <div className="mb-4 h-2 w-full rounded-full" style={{ background: track }}>
      <div
        className="h-2 rounded-full"
        style={{ width: `${v}%`, background: fill }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
      />
    </div>
  )
}

/* ----- TECH-FIT ----- */
function TechFitCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1f2e] transition-colors hover:border-gray-700">
      {/* <div className="relative h-20 w-full bg-[#5D93FF99]r from-blue-600 to-purple-600">
        {project.bannerUrl ? (
          <Image
            src={project.bannerUrl}
            alt={`${project.name} banner`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {project.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div> */}

      <div className="flex flex-grow flex-col p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-full bg-[#5D93FF99]r from-blue-600 to-purple-600 p-1">
            {project.logoUrl ? (
              <Image
                src={project.logoUrl}
                alt={`${project.name} logo`}
                fill
                className="rounded-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-bold text-white">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <h3 className="font-semibold text-white">{project.name}</h3>
        </div>

        <p className="mb-4 line-clamp-3 flex-grow text-sm text-gray-400">
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
              {project.isLookingForFunding && project.isLookingForPartners
                ? "Seeking Funding & Partners"
                : project.isLookingForFunding
                ? "Seeking Funding"
                : project.isLookingForPartners
                ? "Seeking Partners"
                : "Not actively seeking"}
            </span>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {project.tags?.slice(0, 3).map((tag, i) => (
            <span
              key={typeof tag === "string" ? tag : tag.id || tag.tag || i}
              className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-400"
            >
              {typeof tag === "string" ? tag : tag.tag}
            </span>
          )) ||
            project.blockchainPreferences?.slice(0, 3).map((b) => (
              <span
                key={b.id || b.blockchain}
                className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-400"
              >
                {b.blockchain}
              </span>
            ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex h-18 w-full items-center justify-center rounded-[22px] border border-[#7EA0FF] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] px-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
            <div className="text-center">
              <div className="text-[20px] font-extrabold leading-none tracking-tight">
                234
              </div>
              <div className="mt-2 text-[14px] leading-none opacity-95">
                Github Stars
              </div>
            </div>
          </div>
          <div className="flex h-18 w-full items-center justify-center rounded-[22px] border border-[#7EA0FF] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] px-6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
            <div className="text-center">
              <div className="text-[20px] font-extrabold leading-none tracking-tight">
                542
              </div>
              <div className="mt-2 text-[14px] leading-none opacity-95">
                Github Forks
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-[16px]">
          <span className="text-white/90">Tech Alignment Score</span>
          <span className="font-semibold">87/100</span>
        </div>

        <div className="mt-2">
          <ProgressBar value={87} />
        </div>

        <Link href={`/dashboard/matchmaking/${project.id}`} className="mt-auto">
          <button className="w-full rounded-lg bg-blue-600/20 py-3 text-sm font-medium text-blue-400 transition-colors duration-200 hover:bg-blue-600/30">
            View Details
          </button>
        </Link>
      </div>
    </div>
  )
}

/* ----- PERFORMANCE ----- */
function PerformanceCard({
  project,
  totals = {
    followers: "125K",
    likes30d: "15.4K",
    comments30d: "8.9K",
    shares30d: "4.6K",
    sentimentPct: 32,
  },
}: {
  project: Project
  totals?: {
    followers: string | number
    likes30d: string | number
    comments30d: string | number
    shares30d: string | number
    sentimentPct: number
  }
}) {
  const pct = clampPct(totals.sentimentPct)
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#1C2736] bg-[#0F1720] p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-[#0B1320] text-white">
          {project.logoUrl ? (
            <div className="relative h-6 w-6">
              <Image
                src={project.logoUrl}
                alt={`${project.name} logo`}
                fill
                className="object-cover rounded-full w-full h-full"
              />
            </div>
          ) : (
            <span className="text-base font-semibold">
              {project.name?.charAt(0)?.toLowerCase() || "?"}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold text-white">
            {project.name}
          </h3>
        </div>
      </div>

      <p className="mb-3 line-clamp-1 text-sm text-white/70">
        {project.description || "—"}
      </p>

      <div className="mb-2 flex items-center gap-2 text-sm text-white/85">
        <Zap className="h-4 w-4 text-white/90" />
        <span>Social Media Performance</span>
      </div>

      {/* Big followers tile */}
      <div className="mb-3 flex h-16 w-full items-center justify-center rounded-[18px] border border-[#5F7EE6] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
        <div className="text-center">
          <div className="text-[20px] font-extrabold leading-none tracking-tight">
            {totals.followers}
          </div>
          <div className="mt-1 text-[12.5px] leading-none opacity-95">
            Total Followers
          </div>
        </div>
      </div>

      {/* Three tiles */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          { v: totals.likes30d, l: "Likes (30d)" },
          { v: totals.comments30d, l: "Comments (30d)" },
          { v: totals.shares30d, l: "Shares (30d)" },
        ].map((m) => (
          <div
            key={m.l}
            className="flex h-16 items-center justify-center rounded-[18px] border border-[#5F7EE6] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]"
          >
            <div className="text-center">
              <div className="text-[18px] font-extrabold leading-none tracking-tight">
                {m.v}
              </div>
              <div className="mt-1 text-[11.5px] leading-none opacity-95">
                {m.l}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sentiment */}
      <div className="mb-1 flex items-center justify-between text-[13.5px]">
        <span className="text-white/85">Sentiment Score</span>
        <span className="font-semibold text-white/95">{pct}%</span>
      </div>
      <ProgressBar value={pct} track="#E6EAF2" fill="#30B26F" />

      <Link href={`/dashboard/matchmaking/${project.id}`} className="mt-auto">
        <button className="w-full rounded-[14px] border border-[#5F7EE6] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] px-4 py-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-opacity hover:opacity-95">
          View Details
        </button>
      </Link>
    </div>
  )
}

/* ------------ MARKETING ------------ */
type MarketingMetrics = {
  audienceOverlapPct: number // 0-100
  sharedChannels: string[] // e.g., ['Twitter','Medium','Discord']
  brandToneSimilarityPct: number // 0-100
  marketingScore: number // 0-100
}

function MarketingCard({
  project,
  metrics = {
    audienceOverlapPct: 64,
    sharedChannels: ["Twitter", "Medium", "Discord"],
    brandToneSimilarityPct: 32,
    marketingScore: 79,
  },
}: {
  project: Project
  metrics?: MarketingMetrics
}) {
  const overlap = clampPct(metrics.audienceOverlapPct)
  const tone = clampPct(metrics.brandToneSimilarityPct)
  const mscore = clampPct(metrics.marketingScore)

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#1C2736] bg-[#0F1720] p-4 sm:p-5">
      {/* Header */}
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-[#0B1320] text-white">
          {project.logoUrl ? (
            <div className="relative h-6 w-6">
              <Image
                src={project.logoUrl}
                alt={`${project.name} logo`}
                fill
                className="object-cover rounded-full w-full h-full"
              />
            </div>
          ) : (
            <span className="text-base font-semibold">
              {project.name?.charAt(0)?.toLowerCase() || "?"}
            </span>
          )}
        </div>
        <h3 className="truncate text-[15px] font-semibold text-white">
          {project.name}
        </h3>
      </div>

      <p className="mb-3 line-clamp-1 text-sm text-white/70">
        {project.description || "—"}
      </p>

      <div className="mb-2 flex items-center gap-2 text-sm text-white/85">
        <Zap className="h-4 w-4 text-white/90" />
        <span>Marketing Compatibility</span>
      </div>

      {/* Audience Overlap big tile */}
      <div className="mb-4 flex h-16 w-full items-center justify-center rounded-[18px] border border-[#5F7EE6] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
        <div className="text-center">
          <div className="text-[20px] font-extrabold leading-none tracking-tight">
            {overlap}%
          </div>
          <div className="mt-1 text-[12.5px] leading-none opacity-95">
            Audience Overlap
          </div>
        </div>
      </div>

      {/* Shared Channels */}
      <div className="mb-2 text-[13.5px] text-white/85">Shared Channels</div>
      <div className="mb-4 flex flex-wrap gap-2">
        {metrics.sharedChannels.map((c) => (
          <span
            key={c}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/90"
          >
            {c}
          </span>
        ))}
      </div>

      {/* Brand Tone Similarity */}
      <div className="mb-1 flex items-center justify-between text-[13.5px]">
        <span className="text-white/85">Brand Tone Similarity</span>
        <span className="font-semibold text-white/95">{tone}%</span>
      </div>
      <ProgressBar value={tone} />

      {/* Marketing Score */}
      <div className="mt-2 mb-1 flex items-center justify-between text-[13.5px]">
        <span className="text-white/85">Marketing Score</span>
        <span className="font-semibold text-white/95">{mscore}/100</span>
      </div>
      <ProgressBar value={mscore} />

      <Link href={`/dashboard/matchmaking/${project.id}`} className="mt-auto">
        <button className="w-full rounded-[14px] border border-[#5F7EE6] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] px-4 py-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-opacity hover:opacity-95">
          View Details
        </button>
      </Link>
    </div>
  )
}

/* ------------ TOKEN PERFORMANCE  ------------ */
type TokenMetrics = {
  currentPrice: string | number
  marketCap: string | number
  volume24h: string | number
  ath: string | number
  atl: string | number
  compatibilityScore: number // 0-100
}

function TokenPerformanceCard({
  project,
  metrics = {
    currentPrice: "$2.45",
    marketCap: "$950M",
    volume24h: "$12.5M",
    ath: "$4.2",
    atl: "$0.15",
    compatibilityScore: 30,
  },
}: {
  project: Project
  metrics?: TokenMetrics
}) {
  const comp = clampPct(metrics.compatibilityScore)
  const compDeg = `${(comp / 100) * 360}deg`

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#1C2736] bg-[#0F1720] p-4 sm:p-5">
      {/* header */}
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-[#0B1320] text-white">
          {project.logoUrl ? (
            <div className="relative h-6 w-6">
              <Image
                src={project.logoUrl}
                alt={`${project.name} logo`}
                fill
                className="object-cover rounded-full w-full h-full"
              />
            </div>
          ) : (
            <span className="text-base font-semibold">
              {project.name?.charAt(0)?.toLowerCase() || "?"}
            </span>
          )}
        </div>
        <h3 className="truncate text-[15px] font-semibold text-white">
          {project.name}
        </h3>
      </div>

      <p className="mb-3 line-clamp-1 text-sm text-white/70">
        {project.description || "—"}
      </p>

      <div className="mb-2 flex items-center gap-2 text-sm text-white/85">
        <Zap className="h-4 w-4 text-white/90" />
        <span>Token Performance</span>
      </div>

      {/* first row */}
      <div className="mb-2 grid grid-cols-2 gap-2">
        {/* Current Price */}
        <div className="flex h-16 items-center justify-center rounded-[18px] border border-[#5F7EE6] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
          <div className="text-center">
            <div className="text-[19px] font-extrabold leading-none tracking-tight text-[#F7D66B]">
              {metrics.currentPrice}
            </div>
            <div className="mt-1 text-[11.5px] leading-none opacity-95">
              Current Price
            </div>
          </div>
        </div>
        {/* Market Cap */}
        <div className="flex h-16 items-center justify-center rounded-[18px] border border-[#5F7EE6] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
          <div className="text-center">
            <div className="text-[19px] font-extrabold leading-none tracking-tight">
              {metrics.marketCap}
            </div>
            <div className="mt-1 text-[11.5px] leading-none opacity-95">
              Market Cap
            </div>
          </div>
        </div>
      </div>

      {/* second row */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {/* Volume */}
        <div className="flex h-16 items-center justify-center rounded-[18px] border border-[#5F7EE6] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
          <div className="text-center">
            <div className="text-[17px] font-extrabold leading-none tracking-tight">
              {metrics.volume24h}
            </div>
            <div className="mt-1 text-[11px] leading-none opacity-95">
              Volume (24h)
            </div>
          </div>
        </div>

        {/* ATH */}
        <div className="flex h-16 items-center justify-center rounded-[18px] border border-[#5F7EE6] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
          <div className="text-center">
            <div className="text-[17px] font-extrabold leading-none tracking-tight text-white">
              <span className="text-[#30B26F]">{metrics.ath}</span>
            </div>
            <div className="mt-1 text-[11px] leading-none opacity-95">ATH</div>
          </div>
        </div>

        {/* ATL */}
        <div className="flex h-16 items-center justify-center rounded-[18px] border border-[#5F7EE6] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
          <div className="text-center">
            <div className="text-[17px] font-extrabold leading-none tracking-tight">
              <span className="text-[#E25F62]">{metrics.atl}</span>
            </div>
            <div className="mt-1 text-[11px] leading-none opacity-95">ATL</div>
          </div>
        </div>
      </div>

      {/* compatibility score */}
      <div className="my-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="relative h-9 w-9 rounded-full"
            style={{
              background: `conic-gradient(#5E7EE6 ${compDeg}, rgba(255,255,255,0.08) 0deg)`,
            }}
            aria-label="Compatibility Score"
          >
            <div className="absolute inset-[4px] rounded-full bg-[#0F1720]" />
          </div>
          <span className="text-[13.5px] text-white/85">
            Compatibility Score
          </span>
        </div>
        <span className="text-[13.5px] font-semibold text-white/95">
          {comp}/100
        </span>
      </div>

      <Link href={`/dashboard/matchmaking/${project.id}`} className="mt-auto">
        <button className="w-full rounded-[14px] border border-[#5F7EE6] bg-[#5D93FF99] from-[#5E7EE6] to-[#4968D1] px-4 py-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-opacity hover:opacity-95">
          View Details
        </button>
      </Link>
    </div>
  )
}

/* ------------ PUBLIC API ------------ */
export function ProjectCard({
  project,
  variant = "tech-fit",
  performanceTotals,
  marketingMetrics,
  tokenMetrics,
}: {
  project: Project
  variant?: CardVariant
  performanceTotals?: React.ComponentProps<typeof PerformanceCard>["totals"]
  marketingMetrics?: React.ComponentProps<typeof MarketingCard>["metrics"]
  tokenMetrics?: React.ComponentProps<typeof TokenPerformanceCard>["metrics"]
}) {
  if (variant === "performance")
    return <PerformanceCard project={project} totals={performanceTotals} />
  if (variant === "marketing")
    return <MarketingCard project={project} metrics={marketingMetrics} />
  if (variant === "token-performance")
    return <TokenPerformanceCard project={project} metrics={tokenMetrics} />
  return <TechFitCard project={project} />
}
