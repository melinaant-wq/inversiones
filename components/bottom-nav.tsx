"use client"

import { Home, Layers, Clock } from "lucide-react"

interface BottomNavProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

const navItems = [
  { icon: Home, label: "Inicio", id: "home" },
  { icon: Layers, label: "Portfolio", id: "portfolio" },
  { icon: Clock, label: "Actividad", id: "activity" },
]

export default function BottomNav({ activeTab = "home", onTabChange }: BottomNavProps) {
  return (
    <div className="absolute bottom-7 left-4 right-4">
      <div
        className="flex items-center justify-around py-2 px-4 rounded-full"
        style={{ background: "#f3efe8", border: "1px solid rgba(0,0,0,0.06)" }}
      >
        {navItems.map((item) => {
          const isActive = item.id === activeTab
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className="flex flex-col items-center gap-1 px-5 py-2 rounded-2xl transition-all duration-150 active:scale-95"
            >
              <item.icon
                className="w-[22px] h-[22px]"
                style={{ color: isActive ? "#1c1c1a" : "rgba(28,28,26,0.3)" }}
                strokeWidth={isActive ? 2.2 : 1.5}
              />
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? "#1c1c1a" : "rgba(28,28,26,0.3)" }}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
