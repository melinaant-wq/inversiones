"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

interface HomeScreenProps {
  onOpenCards?: () => void
  onOpenProfile?: () => void
}

export default function HomeScreen({ onOpenCards }: HomeScreenProps) {
  const [balance] = useState(1000.66)
  const [balanceVisible, setBalanceVisible] = useState(true)
  const touchStartX = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      // reserved for future swipe actions
    }
  }

  const formatBalance = (v: number) =>
    v.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-2 gap-3 overflow-hidden">
      {/* Main balance card */}
      <div
        className="relative rounded-3xl overflow-hidden flex flex-col"
        style={{ background: "#e5e4e1", minHeight: "290px" }}
      >
        {/* 46% badge */}
        <div className="absolute top-4 right-4 z-10">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold"
            style={{ background: "#446e0c", color: "#f5f4f1" }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: "#ddf74c" }} />
            46%
          </span>
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-10 pb-6 gap-1">
          <p className="text-[16px] font-medium" style={{ color: "rgba(28,28,26,0.5)" }}>
            Total
          </p>

          {/* Balance row */}
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-[42px] font-bold tracking-tight leading-none"
              style={{ color: "#1c1c1a", fontVariantNumeric: "tabular-nums" }}
            >
              {balanceVisible ? `$${formatBalance(balance)}` : "$•••••"}
            </span>
            <button
              onClick={() => setBalanceVisible((v) => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-full active:scale-90 transition-transform"
              style={{ background: "rgba(28,28,26,0.08)" }}
            >
              {balanceVisible
                ? <EyeOff className="w-3.5 h-3.5" style={{ color: "rgba(28,28,26,0.5)" }} strokeWidth={2} />
                : <Eye className="w-3.5 h-3.5" style={{ color: "rgba(28,28,26,0.5)" }} strokeWidth={2} />
              }
            </button>
          </div>

          {/* Limoncito mascot */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/limoncito_GIF-rQGFO9shjykrsnsqPJZms7LxyW6w8i.gif"
            alt="Limoncito"
            className="w-24 h-24 object-contain mt-2"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            className="flex-1 py-3.5 rounded-full text-[15px] font-semibold active:scale-95 transition-transform"
            style={{ background: "#2b2a28", color: "#f5f4f1" }}
          >
            Agregar
          </button>
          <button
            className="flex-1 py-3.5 rounded-full text-[15px] font-semibold active:scale-95 transition-transform"
            style={{ background: "#d9d9d9", color: "#1c1c1a" }}
          >
            Enviar
          </button>
        </div>
      </div>

      {/* Lemon Card virtual strip */}
      <motion.button
        onClick={onOpenCards}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 28 }}
        className="w-full rounded-2xl overflow-hidden text-left active:scale-[0.98] transition-transform"
        style={{ background: "#ddf74c" }}
      >
        <div className="px-5 py-4 flex flex-col gap-0.5">
          <p className="text-[15px] font-bold" style={{ color: "#1c1c1a" }}>
            Lemon Card virtual
          </p>
          <p className="text-[13px] font-medium" style={{ color: "rgba(28,28,26,0.55)" }}>
            4040 **** **** ****
          </p>
          <p className="text-[12px] font-medium mt-1" style={{ color: "rgba(28,28,26,0.45)" }}>
            {"¡Empez\u00E1 a usarla!"}
          </p>
        </div>
      </motion.button>
    </div>
  )
}
