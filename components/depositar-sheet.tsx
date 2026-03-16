"use client"

import { motion, AnimatePresence } from "framer-motion"

export type DepositType = "pesos" | "dolares" | "crypto"

interface DepositarSheetProps {
  open: boolean
  onClose: () => void
  onSelect: (type: DepositType) => void
}

const OPTIONS = [
  {
    id: "pesos" as DepositType,
    dot: "#3b83f7",
    bg: "rgba(59,131,247,0.10)",
    label: "Pesos",
    subtitle: "Transferencia bancaria · Efectivo",
  },
  {
    id: "dolares" as DepositType,
    dot: "#446e0c",
    bg: "rgba(68,110,12,0.10)",
    label: "Dólares",
    subtitle: "USDT · USDC",
  },
  {
    id: "crypto" as DepositType,
    dot: "#ff8700",
    bg: "rgba(255,135,0,0.10)",
    label: "Crypto",
    subtitle: "BTC · ETH · SOL · y más",
  },
]

export default function DepositarSheet({ open, onClose, onSelect }: DepositarSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[60]"
            style={{ background: "rgba(28,28,26,0.4)" }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="absolute bottom-0 left-0 right-0 z-[60] overflow-hidden"
            style={{
              background: "#f5f4f1",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full" style={{ background: "rgba(28,28,26,0.15)" }} />
            </div>

            {/* Title */}
            <p className="text-[20px] font-bold px-5 pt-3 pb-4" style={{ color: "#0A0A0A" }}>
              Depositar
            </p>

            {/* Options */}
            <div className="px-4 flex flex-col gap-2 pb-10">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { onSelect(opt.id); onClose() }}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl active:scale-[0.98] transition-transform"
                  style={{ background: "#ffffff" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: opt.bg }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ background: opt.dot }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[15px] font-semibold" style={{ color: "#0A0A0A" }}>{opt.label}</p>
                    <p className="text-[12px]" style={{ color: "rgba(10,10,10,0.45)" }}>{opt.subtitle}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(10,10,10,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
