import React from "react"

type Props = {
  integrations?: string[]
  followers?: number
  likes?: number
  shares?: number
  comments?: number
  avgPerPost?: number
  score?: number // 0-100
}

const Chip: React.FC<{ label: string }> = ({ label }) => (
  <span className="mr-2 mb-2 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
    {label}
  </span>
)

const StatBox: React.FC<{ value: string; label: string }> = ({
  value,
  label,
}) => (
  <div className="flex h-24 w-full items-center justify-center rounded-xl border border-white/10 bg-[#5D93FF]/60">
    <div className="text-center">
      <div className="text-3xl font-semibold tracking-tight text-white">
        {value}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-white/70">
        {label}
      </div>
    </div>
  </div>
)

const CheckSquare: React.FC<{ checked: boolean }> = ({ checked }) => (
  <span
    className={[
      "ml-2 inline-flex h-5 w-5 items-center justify-center rounded-[6px] border",
      checked
        ? "border-[#3aa6ff] bg-[#3aa6ff]"
        : "border-white/20 bg-transparent",
    ].join(" ")}
  >
    {checked ? (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 12.5l6 6 10-13"
          stroke="#0b1224"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : null}
  </span>
)

export const SocialMediaPerformance: React.FC<Props> = ({
  followers = 1247,
  likes = 342,
  comments = 40,
  shares = 20,
  avgPerPost = 234,
  score = 87,
}) => {
  const scoreClamped = Math.max(0, Math.min(100, score))

  return (
    <div className="w-full rounded-2xl bg-white/5 backdrop-blur-2xl p-5 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset] md:space-y-7">
      {/* Title */}
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white">
        <span>Social media performance</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatBox value={followers.toLocaleString()} label="Total Followers" />
        <StatBox value={likes.toLocaleString()} label="Likes(30d)" />
        <StatBox value={`${comments}`} label="Comments(30d)" />
        <StatBox value={`${shares}`} label="Shares(30d)" />
      </div>

      {/* <div className="mt-2 text-center text-xs text-white/60">
        <span className="font-medium text-white/80">
          {avgPerPost.toLocaleString()}
        </span>{" "}
        Avg. Per Post
      </div> */}

      {/* Score */}
      <div className="mt-6 flex items-center justify-between text-[13px] text-white/80">
        <span>Sentimnet score</span>
        <span className="text-white/70">{scoreClamped}/100</span>
      </div>
      <div className="-mt-4 h-2 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#23c56d] to-[#7ae28f]"
          style={{ width: `${scoreClamped}%` }}
        />
      </div>
    </div>
  )
}
