import React, { useId } from "react"

// Mini circular gauge used in the pills
function MiniGauge({
  value = 46,
  size = 36,
}: {
  value?: number
  size?: number
}) {
  const id = useId().replace(/:/g, "") // stable unique id for defs
  const stroke = 4.5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = c * (value / 100)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`${value}%`}
    >
      <defs>
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#13A8FF" />
          <stop offset="100%" stopColor="#6F46FF" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#1A2437"
        strokeWidth={stroke}
        fill="none"
      />
      {/* Progress */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={`url(#grad-${id})`}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {/* Center text */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={10}
        fill="#E6EEF9"
        fontWeight={700}
      >
        {value}%
      </text>
    </svg>
  )
}

// Pill component matching the screenshot
export function ScorePill({
  label,
  value = 46,
  selected = false,
}: {
  label: string
  value?: number
  selected?: boolean
}) {
  return (
    <div
      className={
        `flex items-center gap-3 h-12 px-4 rounded-2xl bg-[#0F1A2A] text-white/90 ` +
        (selected
          ? `ring-2 ring-[#2451FF] shadow-[0_0_0_4px_rgba(36,81,255,0.25)]`
          : `border border-white/5`)
      }
    >
      <MiniGauge value={value} />
      <span className="text-sm font-medium tracking-wide">{label}</span>
    </div>
  )
}
