"use client"

import { Home, Clock, Grid2X2, QrCode, Wallet } from "lucide-react"

interface BottomNavProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const navItems = [
  { icon: Home,     id: "home",      filled: true  },
  { icon: Wallet,   id: "portfolio", filled: false },
  { icon: Clock,    id: "activity",  filled: false },
  { icon: Grid2X2,  id: "more",      filled: false },
]

export default function BottomNav({ activeTab = "home", onTabChange }: BottomNavProps) {
  return (
    <div className="absolute bottom-5 left-4 right-4 z-20 flex items-center gap-3">

      {/* ── Main nav pill ── */}
      <div
        className="flex-1 flex items-center justify-around py-1 px-2 rounded-full"
        style={{
          background: "#ffffff",
          boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
        }}
      >
        {navItems.map((item) => {
          const isActive = item.id === activeTab
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-150 active:scale-95"
            >
              <item.icon
                className="w-[22px] h-[22px]"
                style={{ color: isActive ? "#1c1c1a" : "rgba(28,28,26,0.28)" }}
                strokeWidth={isActive ? 2.5 : 1.8}
                fill={isActive ? "#1c1c1a" : "none"}
              />
            </button>
          )
        })}
      </div>

      {/* ── QR button — right side ── */}
      <button
        className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-full active:scale-95 transition-transform"
        style={{
          background: "#1c1c1a",
          boxShadow: "0 4px 16px rgba(0,0,0,0.20)",
        }}
      >
        <QrCode className="w-6 h-6" style={{ color: "#ddf74c" }} strokeWidth={2} />
      </button>

    </div>
  )
}
