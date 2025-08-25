import React from "react"
import { LineChart } from "lucide-react"

type Stat = {
  id: string
  label: string
  value: string
  tone?: "default" | "green" | "red" | "yellow"
}

type Props = {
  title?: string
  stats?: Stat[]
}

const toneClass = (tone: Stat["tone"]) => {
  switch (tone) {
    case "green":
      return "text-emerald-400"
    case "red":
      return "text-red-400"
    case "yellow":
      return "text-amber-300"
    default:
      return "text-white"
  }
}

const defaultStats: Stat[] = [
  { id: "vol", label: "Volume (24h)", value: "$12.5M" },
  { id: "ath", label: "ATH", value: "$4.2", tone: "green" },
  { id: "atl", label: "ATL", value: "$0.15", tone: "red" },
  { id: "price", label: "Current Price", value: "$2.45", tone: "yellow" },
  { id: "cap", label: "Market Cap", value: "$950M" },
]

const Pill: React.FC<{ stat: Stat }> = ({ stat }) => (
  <div className="flex min-w-[180px] items-center justify-center rounded-xl border border-white/10 bg-[#5D93FF]/50  px-6 py-4 shadow-sm">
    <div className="text-center">
      <div className={`text-xl font-semibold ${toneClass(stat.tone)}`}>
        {stat.value}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-white/70">
        {stat.label}
      </div>
    </div>
  </div>
)

export const TokenPerformance: React.FC<Props> = ({
  title = "Token Performance",
  stats = defaultStats,
}) => {
  return (
    <div className="w-full rounded-2xl bg-white/5 backdrop-blur-2xl p-5 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
          <LineChart className="h-3.5 w-3.5 text-white/80" />
        </span>
        <span>{title}</span>
      </div>

      {/* Pills row */}
      <div className="flex flex-wrap gap-4">
        {stats.map((s) => (
          <Pill key={s.id} stat={s} />
        ))}
      </div>
    </div>
  )
}
