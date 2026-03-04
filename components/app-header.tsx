"use client"

interface AppHeaderProps {
  username?: string
  appName?: string
  showBalanceToggle?: boolean
  onToggleBalance?: (hidden: boolean) => void
  onOpenRedPill?: () => void
  onOpenProfile?: () => void
}

export default function AppHeader({ username = "$rawpower", onOpenRedPill, onOpenProfile }: AppHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5">
      {/* Left: Avatar + username (opens profile) */}
      <button
        onClick={onOpenProfile}
        className="flex items-center gap-2 px-1 py-1.5 active:opacity-70 transition-opacity"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#e5e4e1]" />
        <span className="text-[15px] font-bold text-foreground">
          {username}
        </span>
      </button>

      {/* Right: Red Pill */}
      <div className="flex items-center gap-2">
        {onOpenRedPill && (
          <button
            onClick={onOpenRedPill}
            className="h-9 px-5 flex items-center justify-center rounded-full active:scale-95 transition-all"
            style={{ background: "#E63946" }}
          >
            <span className="text-[14px] font-bold text-white">
              Red Pill
            </span>
          </button>
        )}
      </div>
    </div>
  )
}
