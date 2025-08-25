import React from "react"
import {
  Users,
  UserCheck,
  Timer,
  Globe2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

type Metric = {
  id: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  sublabel?: string
  delta: number // positive -> green up, negative -> red down
}

const metricsDefault: Metric[] = [
  {
    id: "visitors",
    icon: Users,
    label: "Visitors",
    value: "18.2k",
    delta: 1.2,
  },
  {
    id: "active",
    icon: UserCheck,
    label: "Active Visitors",
    value: "1430",
    sublabel: "users",
    delta: 1.2,
  },
  {
    id: "engagement",
    icon: Timer,
    label: "Average Engagement time",
    value: "12M 12S",
    delta: 1.2,
  },
  {
    id: "location",
    icon: Globe2,
    label: "Top Location",
    value: "USA",
    delta: -2.84,
  },
]

const IconWrap: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#6f93ff_0%,#5577e6_100%)] text-white">
    {children}
  </div>
)

const Separator: React.FC = () => (
  <div className="my-4 h-px w-full bg-white/10" />
)

const Delta: React.FC<{ value: number }> = ({ value }) => {
  const positive = value >= 0
  return (
    <div
      className={`ml-2 inline-flex items-center gap-1 text-xs ${
        positive ? "text-emerald-400" : "text-red-400"
      }`}
    >
      {positive ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" />
      )}
      <span>{Math.abs(value).toFixed(2)}%</span>
    </div>
  )
}

const Row: React.FC<{ m: Metric }> = ({ m }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <IconWrap>
        <m.icon className="h-6 w-6" />
      </IconWrap>
      <div>
        <div className="text-[13px] text-white/80">{m.label}</div>
        <div className="mt-1 flex items-end gap-2">
          <div className="text-lg font-semibold text-white">{m.value}</div>
          {m.sublabel ? (
            <span className="pb-0.5 text-xs italic text-white/60">
              {m.sublabel}
            </span>
          ) : null}
          <Delta value={m.delta} />
        </div>
      </div>
    </div>
  </div>
)

export const AnalyticsSummary: React.FC<{ metrics?: Metric[] }> = ({
  metrics = metricsDefault,
}) => {
  return (
    <div className="w-full rounded-2xl bg-white/5 backdrop-blur-2xl p-5 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]">
      <div className="mb-1 text-[15px] font-semibold">Google Analytics</div>
      <div className="mb-5 text-xs text-white/60">
        Linked website performance
      </div>

      {metrics.map((m, idx) => (
        <React.Fragment key={m.id}>
          {idx !== 0 ? <Separator /> : null}
          <Row m={m} />
        </React.Fragment>
      ))}
    </div>
  )
}
