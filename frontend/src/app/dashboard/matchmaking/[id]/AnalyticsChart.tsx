// npm i recharts
// save as GoogleAnalyticsCard.tsx

import React from "react"
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts"

// types
type Point = { day: number; blue: number; red: number }

type TooltipPayload = { dataKey?: string; value?: number }

type TooltipPropsLite = {
  active?: boolean
  payload?: TooltipPayload[]
  label?: number | string
}

const data: Point[] = [
  { day: 11, blue: 14, red: 78 },
  { day: 12, blue: 32, red: 62 },
  { day: 13, blue: 26, red: 69 },
  { day: 14, blue: 58, red: 41 },
  { day: 15, blue: 45, red: 44 },
  { day: 16, blue: 92, red: 18 },
  { day: 17, blue: 98, red: 15 },
]

const Card: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="w-full rounded-2xl bg-white/5 backdrop-blur-2xl p-5 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]">
    {children}
  </div>
)

const Title: React.FC = () => (
  <div className="mb-4">
    <div className="text-[15px] font-semibold">Google Analytics</div>
    <div className="text-xs text-white/60">Linked website performance</div>
  </div>
)

const CustomTooltip: React.FC<TooltipPropsLite> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload || !payload.length) return null
  const blue = payload.find((p) => p.dataKey === "blue")?.value ?? null
  const red = payload.find((p) => p.dataKey === "red")?.value ?? null
  return (
    <div className="rounded-lg bg-[#12162a] px-3 py-2 text-xs text-white shadow-lg">
      <div className="mb-1 text-white/70">{label}</div>
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-[#5aa1ff]" />
        <span>{blue}</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-[#8b3a3a]" />
        <span>{red}</span>
      </div>
    </div>
  )
}

export const AnalyticsChart: React.FC = () => {
  return (
    <Card>
      <Title />
      <div className="h-[361px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
          >
            {/* subtle grid */}
            <CartesianGrid stroke="#ffffff10" vertical={false} />

            {/* axes */}
            <XAxis
              dataKey="day"
              tick={{ fill: "#ffffff80", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis hide domain={[0, 100]} />

            {/* gradient strokes */}
            <defs>
              <linearGradient id="blueStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5aa1ff" />
                <stop offset="100%" stopColor="#7fb1ff" />
              </linearGradient>
              <linearGradient id="redStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#9a4848" />
                <stop offset="100%" stopColor="#6b2f2f" />
              </linearGradient>
            </defs>

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#ffffff18" }}
            />

            <Line
              type="monotone"
              dataKey="blue"
              stroke="url(#blueStroke)"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="red"
              stroke="url(#redStroke)"
              strokeWidth={2}
              dot={false}
              activeDot={false}
              opacity={0.6}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
