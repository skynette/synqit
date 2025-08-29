"use client"
import React from "react"
import {
  Infinity as InfinityIcon,
  Star,
  Pin,
  MessageSquareText,
  Send,
  Image as ImageIcon,
  Smile,
  Mic,
  Search,
  CheckCircle,
} from "lucide-react"

// Small avatar circle with optional status dot
function Avatar({
  label,
  status,
}: {
  label: string
  status?: "online" | "offline"
}) {
  return (
    <div className="relative flex items-center gap-2">
      <div className="grid size-8 place-items-center rounded-full bg-white/10 text-white/80 border border-white/15">
        <span className="text-[10px] font-bold">{label}</span>
      </div>
      {status === "online" && (
        <span className="absolute -right-1 -bottom-1 size-3 rounded-full bg-emerald-400 ring-2 ring-[#0A0F1A]" />
      )}
    </div>
  )
}

// Right sidebar row
function SidebarRow({
  icon,
  title,
  snippet,
  badge,
}: {
  icon: React.ReactNode
  title: string
  snippet: string
  badge?: { text: string; color: "green" | "yellow" | "gray" }
}) {
  const badgeColor =
    badge?.color === "green"
      ? "bg-emerald-500/15 text-emerald-400"
      : badge?.color === "yellow"
      ? "bg-amber-500/15 text-amber-400"
      : "bg-white/10 text-white/70"
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="grid size-10 place-items-center rounded-xl bg-[#5B7CFF] text-white">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-[13px] font-semibold text-white">
            {title}
          </div>
          {badge && (
            <span className={`rounded px-1.5 py-0.5 text-[10px] ${badgeColor}`}>
              {badge.text}
            </span>
          )}
        </div>
        <div className="truncate text-xs text-white/60">{snippet}</div>
      </div>
    </div>
  )
}

// Message bubble line
function Msg({
  user,
  time,
  text,
  self,
}: {
  user: string
  time: string
  text: React.ReactNode
  self?: boolean
}) {
  return (
    <div className="flex items-start gap-3">
      <Avatar
        label={user[0].toUpperCase()}
        status={self ? "online" : undefined}
      />
      <div>
        <div className="text-sm">
          <span className="font-semibold text-[#4CA1FF] cursor-pointer hover:underline">
            {user}
          </span>
          <span className="ml-2 text-xs text-white/50">{time}</span>
        </div>
        <div className="mt-1 whitespace-pre-wrap text-[13px] leading-relaxed text-white/90">
          {text}
        </div>
      </div>
    </div>
  )
}

// Link preview card at bottom of chat
function LinkPreview() {
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="flex gap-3 p-3">
        <div className="h-24 w-48 overflow-hidden rounded-lg bg-gradient-to-br from-slate-400 to-slate-700">
          <div className="h-full w-full grid place-items-center text-2xl font-semibold text-black/70 bg-white/30">
            http://
          </div>
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-white">
            A Web3-powered investment platform transforming r…
          </div>
          <p className="mt-1 line-clamp-3 text-xs leading-5 text-white/70">
            ShortletLagos enables users to invest in tokenized real estate,
            allowing them to own a fraction of premium properties with minimal
            capital. By leveraging blockchain, …
          </p>
        </div>
      </div>
    </div>
  )
}

// Input bar
function InputBar() {
  return (
    <div className="sticky bottom-0 mt-5 rounded-2xl bg-[#161E2D] p-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2">
        <button className="grid size-9 place-items-center rounded-xl bg-white/5 text-white/80 hover:bg-white/10">
          <ImageIcon size={18} />
        </button>
        <input
          placeholder="Message   # General Chat"
          className="flex-1 rounded-xl bg-[#0E1524] px-4 py-2 text-sm text-white placeholder-white/40 outline-none border border-white/10"
        />
        <button className="grid size-9 place-items-center rounded-xl bg-white/5 text-white/80 hover:bg-white/10">
          <Smile size={18} />
        </button>
        <button className="grid size-9 place-items-center rounded-xl bg-white/5 text-white/80 hover:bg-white/10">
          <Mic size={18} />
        </button>
        <button className="grid size-9 place-items-center rounded-xl bg-[#2753FF] text-white hover:brightness-110">
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

// Date divider
function DateDivider({ text }: { text: string }) {
  return (
    <div className="relative my-6 flex items-center">
      <div className="h-px w-full bg-primary" />
      <div className="mx-4 rounded-full border border-primary bg-[#0A0F1A] px-4 py-2 text-xs text-white/70 min-w-[242px] text-center">
        {text}
      </div>
      <div className="h-px w-full bg-primary" />
    </div>
  )
}

// Main demo
export default function MessagesView() {
  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Left: Chat */}
        <section className="rounded-[22px]  p-4 lg:p-6">
          {/* Top header bar */}
          <div className="mb-6 flex items-center justify-between border border-white/10 bg-white/5 px-3 py-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <span className="size-2 rounded-full bg-[#4CA1FF]" />
              <span className="font-semibold">SynqIt: General Chat</span>
            </div>
            <div className="flex items-center gap-3 text-white/50">
              <Star size={16} />
              <Pin size={16} />
              <MessageSquareText size={16} />
            </div>
          </div>

          {/* Center welcome card */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="grid size-20 place-items-center rounded-full bg-[#2753FF] text-white shadow-[0_15px_40px_rgba(39,83,255,0.35)]">
                <InfinityIcon size={28} />
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-full ring-8 ring-[#2753FF]/15" />
            </div>
            <div className="text-2xl font-bold">SynqIt General Chat</div>
            <div className="mt-2 text-sm text-white/70">
              Welcome to the beginning of the{" "}
              <span className="text-primary">#synqit-general chat</span> channel
            </div>
            <div className="mt-3 inline-flex items-center gap-2 rounded-full  px-3 py-1 text-xs text-white/70">
              <Avatar label="S" /> Started by{" "}
              <span className="text-[#4CA1FF]">ShortletLagos</span>
            </div>
          </div>

          <DateDivider text="Before 16 September 2024" />

          {/* Messages */}
          <div className="space-y-6">
            <Msg
              user="ShortletLagos"
              time="25 Jul 12:34"
              text={
                "That's waku, I'd suggest turning on Light node in settings."
              }
            />

            <Msg
              user="You"
              time="25 Jul 12:34"
              self
              text={
                <>
                  Hi! Added a task for both of you, in the client, when
                  authenticating we want to have a "loading" screen
                  <div className="mt-2 text-xl">🧠</div>
                </>
              }
            />

            <Msg
              user="ShortletLagos"
              time="25 Jul 12:34"
              text={
                "That's waku, I'd suggest turning on Light node in settings."
              }
            />

            <LinkPreview />
          </div>

          <InputBar />
        </section>

        {/* Right: Sidebar */}
        <aside className="rounded-[22px] border border-white/10 bg-[#FFFFFF1A] p-4 lg:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-white/80">
              Other Messages
            </div>
            <CheckCircle size={16} className="text-white/40" />
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <input
              placeholder="Search"
              className="w-full rounded-xl border border-white/10 bg-[#0E1524] px-9 py-2 text-sm text-white placeholder-white/40 outline-none"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#2753FF]/20 px-2 py-0.5 text-[10px] text-[#8FB0FF]">
              500
            </span>
          </div>

          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
            Pinned Chat
          </div>

          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <SidebarRow
              icon={<span className="text-lg">＠</span>}
              title="Arweave"
              snippet="Hi! Added a task for both of you, l…"
              badge={{ text: "Partner", color: "green" }}
            />
            <SidebarRow
              icon={
                <div className="size-5 rounded-full border border-white/20" />
              }
              title="ShortletLagos"
              snippet="Hi! Added a task for both of you, l…"
              badge={{ text: "Partner", color: "green" }}
            />
            <SidebarRow
              icon={
                <div className="size-5 rounded-full border border-white/20" />
              }
              title="ENS"
              snippet="Hi! Added a task for both of you, l…"
              badge={{ text: "Partner", color: "green" }}
            />
            <SidebarRow
              icon={
                <div className="size-5 rounded-full border border-white/20" />
              }
              title="Lens"
              snippet="Hi! Added a task for both of you, l…"
              badge={{ text: "Partner", color: "green" }}
            />
            <SidebarRow
              icon={
                <div className="size-5 rounded-full border border-white/20" />
              }
              title="Polkadot"
              snippet="Hi! Added a task for both of you, l…"
              badge={{ text: "Requested", color: "gray" }}
            />
            <SidebarRow
              icon={
                <div className="size-5 rounded-full border border-white/20" />
              }
              title="TheGraph"
              snippet="Hi! Added a task for both of you, l…"
              badge={{ text: "Requested", color: "gray" }}
            />
            <SidebarRow
              icon={
                <div className="size-5 rounded-full border border-white/20" />
              }
              title="SuperRare"
              snippet="Hi! Added a task for both of you, l…"
              badge={{ text: "Pending", color: "yellow" }}
            />
            <SidebarRow
              icon={
                <div className="size-5 rounded-full border border-white/20" />
              }
              title="Safe"
              snippet="Hi! Added a task for both of you, l…"
              badge={{ text: "Pending", color: "yellow" }}
            />
          </div>
        </aside>
      </div>

      {/* DEV visual tests (collapsed) */}
      {/* <details className="mx-auto mt-6 max-w-screen-2xl text-white/60">
        <summary className="cursor-pointer text-xs">Visual tests</summary>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-[#0A0F1A] p-4">
            <div className="text-xs">Avatar online/offline</div>
            <div className="mt-2 flex gap-4">
              <Avatar label="A" status="online" />
              <Avatar label="B" />
            </div>
          </section>
          <section className="rounded-2xl border border-white/10 bg-[#0A0F1A] p-4">
            <div className="text-xs">Sidebar badges</div>
            <SidebarRow
              icon={<span className="text-lg">＠</span>}
              title="Partner"
              snippet="…"
              badge={{ text: "Partner", color: "green" }}
            />
            <SidebarRow
              icon={<span className="text-lg">＠</span>}
              title="Pending"
              snippet="…"
              badge={{ text: "Pending", color: "yellow" }}
            />
            <SidebarRow
              icon={<span className="text-lg">＠</span>}
              title="Requested"
              snippet="…"
              badge={{ text: "Requested", color: "gray" }}
            />
          </section>
        </div>
      </details> */}
    </div>
  )
}
