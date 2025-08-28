import { Verified } from "lucide-react"
import React, { useState } from "react"

// --- Icons ---
const ShieldCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 2l7 3v6c0 5.3-3.7 9.9-7 11-3.3-1.1-7-5.7-7-11V5l7-3z"
      fill="#0E2AFA"
      opacity=".25"
    />
    <path
      d="M10.2 13.8l-2.2-2.2-1.4 1.4 3.6 3.6 6.4-6.4-1.4-1.4-5 5z"
      fill="#0E2AFA"
    />
  </svg>
)

const SmileBadge = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
    <circle cx="28" cy="28" r="28" fill="#1972FF" />
    <circle cx="20.5" cy="24" r="3" fill="#fff" />
    <circle cx="35.5" cy="24" r="3" fill="#fff" />
    <path
      d="M18 33c2.4 3.4 6 5 10 5s7.6-1.6 10-5"
      stroke="#fff"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
)

const GraphMark = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <circle
      cx="10"
      cy="10"
      r="6.5"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <circle cx="17" cy="17" r="2" fill="currentColor" />
    <path
      d="M18 6l3-3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

// --- Gauge ---
function Gauge({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value))
  const width = 344
  const height = 188 // semicircle height
  const r = 132
  const cx = width / 2
  const cy = height // arc sits on bottom edge
  const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      aria-label={`Gauge ${v}%`}
    >
      <defs>
        <linearGradient id="gaugeStroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#13A8FF" />
          <stop offset="100%" stopColor="#6F46FF" />
        </linearGradient>
        <linearGradient id="gaugeTrack" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0C1424" />
          <stop offset="100%" stopColor="#0B1120" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Track */}
      <path
        d={d}
        pathLength={100}
        stroke="url(#gaugeTrack)"
        strokeWidth={18}
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Progress */}
      <path
        d={d}
        pathLength={100}
        stroke="url(#gaugeStroke)"
        strokeWidth={18}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${v} 100`}
        filter="url(#glow)"
      />
    </svg>
  )
}

// --- Card ---
export function CompatibilityScore({
  value = 95,
  suggested = { name: "The Graph" },
  onFinish,
  onViewProfile,
}: {
  value?: number
  suggested?: { name: string }
  onFinish?: () => void
  onViewProfile?: () => void
}) {
  return (
    <div className="w-full rounded-[28px] bg-gradient-to-r from-[#030816] to-[#0A0E237D] p-6 text-white">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="grid place-items-center rounded-xl bg-white/5 size-9">
          <Verified className="text-[#4C82ED] bg-[#4C82ED]/10 rounded-full" />
        </div>
        <div>
          <div className="text-[18px] leading-6 font-semibold">
            Compatibility Score
          </div>
          <div className="text-[12px] leading-4 text-white/60">
            From all projects
          </div>
        </div>
      </div>

      {/* Gauge */}
      <div className="relative mt-6">
        <Gauge value={value} />
        <div className="absolute left-1/2 top-[72%] -translate-x-1/2 -translate-y-1/2">
          <div className="rounded-full p-1 bg-[#0B1626] shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
            <SmileBadge />
          </div>
        </div>
      </div>

      {/* Score strip */}
      <div className="relative mt-4 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-white/50">
          0%
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/50">
          100%
        </div>
        <div className="text-center">
          <div className="text-[44px] leading-none font-extrabold tracking-tight">
            {value}%
          </div>
          <div className="mt-2 text-sm text-white/70">
            Based on profile Match
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-5 flex items-center justify-center">
        <button
          onClick={onFinish}
          className=" rounded-xl bg-[#5D93FF99]/10 border-1 px-5 py-3 text-sm font-semibold  hover:brightness-110 transition"
        >
          Finsish Profile Setup
        </button>
      </div>

      {/* Suggested */}
      <div className="mt-6 text-sm text-white/60 italic text-center mb-2">
        Top Suggested Match
      </div>
      <div className="mt-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-3">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-full bg-white/[0.04] border border-white/10 text-white/80">
            <GraphMark />
          </div>
          <div className="text-white">{suggested.name}</div>
        </div>
        <button
          onClick={onViewProfile}
          className="rounded-xl bg-[#5D93FF99]/60 px-4 py-2 text-sm font-semibold hover:brightness-110 transition"
        >
          View Profile
        </button>
      </div>
    </div>
  )
}

// --- Dev test cases (visual) ---
function DevCases() {
  const cases = [0, 50, 95, 100]
  return (
    <details className="mt-6 open:mt-6">
      <summary className="cursor-pointer text-sm text-white/70">
        Test cases
      </summary>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {cases.map((v) => (
          <div
            key={v}
            className="rounded-2xl border border-white/10 p-3 bg-white/[0.02]"
          >
            <div className="text-xs text-white/60 mb-2">value = {v}</div>
            <CompatibilityScore value={v} suggested={{ name: "The Graph" }} />
          </div>
        ))}
      </div>
    </details>
  )
}
