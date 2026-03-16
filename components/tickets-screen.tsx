"use client"

import { motion } from "framer-motion"
import { MorphIcon } from '@/components/ui/morph-icon'

interface TicketsScreenProps {
  onClose: () => void
}

export default function TicketsScreen({ onClose }: TicketsScreenProps) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="absolute inset-0 z-[70] flex flex-col"
      style={{ background: "#f5f4f1" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4 flex-shrink-0">
        <button onClick={onClose}>
            <MorphIcon icon="arrow-left" size={20} color="#fff" />
        </button>
        <h1 className="text-[22px] font-bold" style={{ color: "#1c1c1a" }}>
          Tickets
        </h1>
      </div>
    </motion.div>
  )
}
