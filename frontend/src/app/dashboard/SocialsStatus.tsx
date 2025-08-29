import React from "react"
import {
  Twitter,
  Gamepad2,
  Sparkles,
  Facebook,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

type Delta = { dir: "up" | "down" | "flat"; value: string }

type Stat = {
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  value: string
  suffix?: string // e.g., " users"
  delta: Delta
}

function Trend({ delta }: { delta: Delta }) {
  if (delta.dir === "flat")
    return <span className="text-xs text-white/60">0%</span>
  const up = delta.dir === "up"
  const Cmp = up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs ${
        up ? "text-emerald-400" : "text-rose-400"
      }`}
    >
      <Cmp size={14} /> {delta.value}
    </span>
  )
}

function StatItem({ s, withDivider }: { s: Stat; withDivider?: boolean }) {
  const Icon = s.icon
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 ${
        withDivider ? "sm:border-l sm:border-white/10" : ""
      }`}
    >
      <div className="grid place-items-center size-10 rounded-xl bg-[#5B7CFF] text-white shadow-[0_6px_18px_rgba(91,124,255,0.35)]">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-white/80 truncate">{s.label}</div>
        <div className="mt-0.5 flex items-baseline gap-2">
          <div className="text-[15px] font-semibold text-white">
            {s.value}
            {s.suffix ? (
              <span className="ml-1 italic font-medium text-white/80">
                {s.suffix}
              </span>
            ) : null}
          </div>
          <Trend delta={s.delta} />
        </div>
      </div>
    </div>
  )
}

function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="w-full rounded-[28px] bg-[#0F1A2A] px-2 py-2 sm:py-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s, i) => (
          <StatItem key={s.label} s={s} withDivider={i !== 0} />
        ))}
      </div>
    </div>
  )
}

// Exact data from the screenshot
const screenshotStats: Stat[] = [
  {
    label: "Twitter",
    icon: Twitter,
    value: "18.2k",
    delta: { dir: "up", value: "1.20%" },
  },
  {
    label: "Discord",
    icon: Gamepad2,
    value: "1430",
    suffix: "users",
    delta: { dir: "up", value: "1.20%" },
  },
  {
    label: "Token Performance",
    icon: Sparkles,
    value: "$240K",
    delta: { dir: "up", value: "1.20%" },
  },
  {
    label: "Facebook",
    icon: Facebook,
    value: "25.4k",
    delta: { dir: "down", value: "2.84%" },
  },
  {
    label: "Website",
    icon: Globe,
    value: "Active",
    delta: { dir: "up", value: "1.20%" },
  },
]

// Visual tests for edge cases
function TestCases() {
  const tests: Stat[] = [
    {
      label: "Zero Delta",
      icon: Globe,
      value: "0",
      delta: { dir: "flat", value: "0%" },
    },
    {
      label: "Long Label Overflow Example To Test Truncation",
      icon: Sparkles,
      value: "$999K",
      delta: { dir: "up", value: "12.34%" },
    },
  ]
  return (
    <div className="mt-4 space-y-3">
      <StatsBar stats={tests} />
    </div>
  )
}

export default function SocialsStatus() {
  return (
    <div className="text-white">
      <div className="w-full mx-auto">
        <StatsBar stats={screenshotStats} />
      </div>
    </div>
  )
}
