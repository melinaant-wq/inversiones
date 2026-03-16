"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Sprout, DollarSign, Users, Ticket, FileText, BarChart3, ArrowLeftRight, Bitcoin, Target, Trophy } from "lucide-react"
import { MorphIcon } from '@/components/ui/morph-icon'

const tabs = [
  { id: "my-apps", label: "Mis apps" },
  { id: "discover", label: "Explorar" },
  { id: "dev", label: "Dev" },
]

const miniApps = [
  { name: "Earn", icon: Sprout, bg: "#ddf74c", iconColor: "#446e0c" },
  { name: "Euros", icon: DollarSign, bg: "#ddf74c", iconColor: "#446e0c" },
  { name: "Dollars", icon: DollarSign, bg: "#ddf74c", iconColor: "#446e0c" },
  { name: "Friends", icon: Users, bg: "#e5e4e1", iconColor: "#1c1c1a" },
  { name: "Tickets", icon: Ticket, bg: "#e5e4e1", iconColor: "#1c1c1a" },
  { name: "Servicios", icon: FileText, bg: "#e5e4e1", iconColor: "#1c1c1a" },
  { name: "Analytics", icon: BarChart3, bg: "#e5e4e1", iconColor: "#1c1c1a" },
  { name: "P2P", icon: ArrowLeftRight, bg: "#ddf74c", iconColor: "#446e0c" },
  { name: "Crypto", icon: Bitcoin, bg: "#ddf74c", iconColor: "#446e0c" },
  { name: "Metas", icon: Target, bg: "#e5e4e1", iconColor: "#1c1c1a" },
  { name: "Rewards", icon: Trophy, bg: "#ddf74c", iconColor: "#446e0c" },
]

export default function MiniAppsScreen() {
  const [activeTab, setActiveTab] = useState("my-apps")

  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-4 overflow-y-auto scrollbar-hide">
      <div className="w-full max-w-[320px] mx-auto flex flex-col flex-1">
        {/* Section title */}
        <h1
          className="text-[22px] font-bold mb-4"
          style={{ color: "#1c1c1a" }}
        >
          Mini-Apps
        </h1>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 text-[14px] font-medium rounded-full transition-all"
              style={{
                background: activeTab === tab.id ? "#1c1c1a" : "rgba(28,28,26,0.06)",
                color: activeTab === tab.id ? "#f5f4f1" : "rgba(28,28,26,0.45)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {miniApps.map((app, index) => {
            const Icon = app.icon
            return (
              <motion.button
                key={app.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.025, duration: 0.3 }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: app.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: app.iconColor }} strokeWidth={1.8} />
                </div>
                <span
                  className="text-[11px] font-medium truncate max-w-[56px]"
                  style={{ color: "rgba(28,28,26,0.5)" }}
                >
                  {app.name}
                </span>
              </motion.button>
            )
          })}

          {/* Add button */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: miniApps.length * 0.025, duration: 0.3 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ border: "1.5px dashed rgba(28,28,26,0.15)" }}
            >
              <MorphIcon icon="plus" size={20} color="rgba(28,28,26,0.25)" strokeWidth={1.5} />
            </div>
            <span
              className="text-[11px] font-medium"
              style={{ color: "rgba(28,28,26,0.3)" }}
            >
              Agregar
            </span>
          </motion.button>
        </div>

        {/* Links */}
        <div className="mt-auto">
          <button
            className="w-full flex items-center justify-between py-3.5"
            style={{ borderTop: "1px solid rgba(28,28,26,0.06)" }}
          >
            <span className="text-[14px] font-medium" style={{ color: "rgba(28,28,26,0.4)" }}>
              Developer Docs
            </span>
            <MorphIcon icon="chevron-right" size={16} color="rgba(28,28,26,0.2)" strokeWidth={1.5} />
          </button>
          <button
            className="w-full flex items-center justify-between py-3.5"
            style={{ borderTop: "1px solid rgba(28,28,26,0.06)" }}
          >
            <span className="text-[14px] font-medium" style={{ color: "rgba(28,28,26,0.4)" }}>
              Subir Mini-App
            </span>
            <MorphIcon icon="chevron-right" size={16} color="rgba(28,28,26,0.2)" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
