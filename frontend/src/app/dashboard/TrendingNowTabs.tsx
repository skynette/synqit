// TrendingNowTabs.tsx
"use client"

import React from "react"
import { GitFork, BarChart3, CandlestickChart, LucideIcon } from "lucide-react"
import { Project } from "@/lib/api-client"
import { ProjectCard } from "./ProjectCard"

type Variant = "tech-fit" | "performance" | "marketing" | "token-performance"

type Tab = { id: Variant; label: string; Icon: LucideIcon }

const TABS: Tab[] = [
  { id: "tech-fit", label: "Tech Fit", Icon: GitFork },
  { id: "performance", label: "Performance", Icon: BarChart3 },
  { id: "marketing", label: "Marketing", Icon: CandlestickChart },
  {
    id: "token-performance",
    label: "Token Performance",
    Icon: CandlestickChart,
  },
]

export default function TrendingNowTabs({ projects }: { projects: Project[] }) {
  const [active, setActive] = React.useState<Variant>("tech-fit")

  return (
    <section className="w-full">
      {/* tabs */}
      <div
        role="tablist"
        aria-label="Sections"
        className="flex w-full items-center gap-3 overflow-x-auto pb-1"
      >
        {TABS.map(({ id, label, Icon }) => {
          const isActive = id === active
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(id)}
              className={[
                "group inline-flex h-9 select-none items-center whitespace-nowrap rounded-md border px-3 pr-2 text-sm transition",
                isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,.15)]"
                  : "bg-[#0F1720] border-[#1F2633] text-slate-200 hover:border-[#223349]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
              ].join(" ")}
            >
              <span className="px-1">{label}</span>
              <span
                className={[
                  "ml-2 grid h-6 w-6 place-items-center rounded-md border",
                  isActive
                    ? "bg-white/18 border-white/25"
                    : "bg-white/8 border-white/15",
                ].join(" ")}
              >
                <Icon
                  className={
                    isActive
                      ? "h-4 w-4 text-white"
                      : "h-4 w-4 text-slate-200/90"
                  }
                  strokeWidth={1.75}
                />
              </span>
            </button>
          )
        })}
      </div>

      {/* cards */}
      <div role="tabpanel" aria-labelledby={active} className="mt-4 w-full">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} variant={active} />
          ))}
        </div>
      </div>
    </section>
  )
}
