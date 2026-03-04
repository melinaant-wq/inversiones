"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"

interface RedPillScreenProps {
  onClose: () => void
  onOpenFincraft?: () => void
}

export default function RedPillScreen({ onClose, onOpenFincraft }: RedPillScreenProps) {
  return (
    <div className="flex-1 min-h-0 px-4 py-4 overflow-y-auto pb-8">
      <div className="w-full max-w-[320px] mx-auto">
      {/* Close button */}
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-[22px] font-black uppercase tracking-tight"
          style={{ color: "#1c1c1a" }}
        >
          Red Pill
        </h1>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center active:scale-95 transition-all"
          style={{
            background: "rgba(28,28,26,0.06)",
            border: "1px solid rgba(28,28,26,0.08)",
          }}
        >
          <X className="w-4 h-4" style={{ color: "#1c1c1a" }} />
        </button>
      </div>

      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-5 mb-4"
        style={{
          background: "#E63946",
          border: "2px solid #1c1c1a",
          boxShadow: "4px 4px 0px #1c1c1a",
        }}
      >
        <p className="text-[13px] font-bold tracking-[0.2em] uppercase font-mono text-white/60 mb-2">
          You chose wisely
        </p>
        <h2 className="text-[28px] font-black uppercase tracking-tight leading-none text-white">
          Welcome to the real world
        </h2>
        <p className="text-[15px] font-mono text-white/70 mt-3 leading-relaxed">
          This is where we show you how deep the rabbit hole goes.
        </p>
      </motion.div>

      {/* Info cards */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="p-4 mb-3"
        style={{
          background: "#e5e4e1",
          border: "2px solid #1c1c1a",
        }}
      >
        <p className="text-[15px] font-bold tracking-[0.2em] uppercase font-mono" style={{ color: "#6b6961" }}>
          Status
        </p>
        <p className="text-[16px] font-black uppercase tracking-tight mt-1" style={{ color: "#1c1c1a" }}>
          Unplugged
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-2 flex-1" style={{ background: "rgba(28,28,26,0.06)" }}>
            <div className="h-full w-[72%]" style={{ background: "#E63946" }} />
          </div>
          <span className="text-[15px] font-bold font-mono" style={{ color: "#6b6961" }}>72%</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="p-4 mb-3"
        style={{
          background: "#e5e4e1",
          border: "2px solid #1c1c1a",
        }}
      >
        <p className="text-[15px] font-bold tracking-[0.2em] uppercase font-mono" style={{ color: "#6b6961" }}>
          Next mission
        </p>
        <p className="text-[15px] font-black uppercase tracking-tight mt-1" style={{ color: "#1c1c1a" }}>
          Break free from traditional banking
        </p>
        <div className="mt-2">
          <span
            className="text-[15px] font-bold font-mono tracking-[0.15em] uppercase px-2 py-1 inline-block"
            style={{
              background: "#ddf74c",
              border: "1px solid #1c1c1a",
              color: "#1c1c1a",
              transform: "skewX(-4deg)",
            }}
          >
            In progress
          </span>
        </div>
      </motion.div>

      {/* Fincraft button */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenFincraft}
        className="w-full mt-4 p-4 flex items-center justify-between active:scale-[0.98] transition-all"
        style={{
          background: "#ddf74c",
          border: "2px solid #1c1c1a",
          boxShadow: "4px 4px 0px #1c1c1a",
          transform: "skewX(-2deg)",
        }}
      >
        <span className="text-[16px] font-black uppercase tracking-[0.1em]" style={{ color: "#1c1c1a" }}>
          Fincraft
        </span>
        <svg className="w-5 h-5" fill="none" stroke="#1c1c1a" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="square" strokeLinejoin="miter" d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </motion.button>
      </div>
    </div>
  )
}
