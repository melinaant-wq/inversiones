"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowDownLeft, Plus, Send, RefreshCw } from "lucide-react"

interface DollarsScreenProps {
  onClose: () => void
}

const transactions = [
  { id: 1, type: "deposit", label: "Deposito desde ARS", amount: 200, date: "Feb 14", icon: ArrowDownLeft },
  { id: 2, type: "yield", label: "Rendimiento", amount: 2.53, date: "Feb 12", icon: ArrowDownLeft },
  { id: 3, type: "deposit", label: "Deposito desde ARS", amount: 500, date: "Feb 8", icon: ArrowDownLeft },
  { id: 4, type: "yield", label: "Rendimiento", amount: 2.41, date: "Feb 5", icon: ArrowDownLeft },
  { id: 5, type: "withdraw", label: "Enviado a amigo", amount: -150, date: "Feb 1", icon: Send },
  { id: 6, type: "deposit", label: "Deposito desde ARS", amount: 300, date: "Ene 28", icon: ArrowDownLeft },
]

export default function DollarsScreen({ onClose }: DollarsScreenProps) {
  const [balance] = useState(900.62)
  const [showDetail, setShowDetail] = useState<number | null>(null)

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
            style={{ background: "rgba(28,28,26,0.06)" }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
          </button>
          <h1
            className="text-[16px] font-semibold"
            style={{ color: "#1c1c1a" }}
          >
            {"D\u00f3lares"}
          </h1>
        </div>

        {/* Balance hero */}
        <div className="p-6 relative overflow-hidden rounded-3xl" style={{ background: "#2b2a28" }}>
          <p
            className="text-[14px] font-medium mb-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Balance
          </p>
          <span
            className="text-[38px] font-bold tracking-tight leading-none block"
            style={{ color: "#FFFFFF" }}
          >
            ${balance.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <p
            className="text-[13px] font-medium mt-1"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            USD
          </p>

          {/* APY + Earnings row */}
          <div className="flex items-center gap-3 mt-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-full"
              style={{ background: "#ddf74c", color: "#1c1c1a" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: "#446e0c" }} />
              10% anual
            </span>
            <span
              className="text-[13px] font-medium"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              +$2,53/semana
            </span>
          </div>

          {/* Projected growth */}
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
                {"Proyecci\u00f3n 30 d\u00edas"}
              </span>
              <span className="text-[15px] font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>
                +$10,97
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "67%" }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: "#ddf74c" }}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          {[
            { label: "Depositar", icon: Plus },
            { label: "Enviar", icon: Send },
            { label: "Swap", icon: RefreshCw },
          ].map((action) => (
            <button
              key={action.label}
              className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl active:scale-95 transition-transform"
              style={{ background: "rgba(28,28,26,0.04)" }}
            >
              <action.icon className="w-4 h-4" style={{ color: "#1c1c1a" }} />
              <span
                className="text-[11px] font-medium"
                style={{ color: "#1c1c1a" }}
              >
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
        <p
          className="text-[14px] font-semibold mb-3"
          style={{ color: "rgba(28,28,26,0.4)" }}
        >
          Actividad
        </p>
        <div>
          {transactions.map((tx, index) => (
            <motion.button
              key={tx.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.25 }}
              onClick={() => setShowDetail(showDetail === tx.id ? null : tx.id)}
              className="w-full flex items-center gap-3 py-3 text-left active:opacity-60 transition-opacity"
              style={{ borderBottom: "1px solid rgba(28,28,26,0.06)" }}
            >
              <div
                className="w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-full"
                style={{
                  background: tx.type === "yield" ? "rgba(219,255,0,0.15)" : "rgba(28,28,26,0.04)",
                }}
              >
                <tx.icon
                  className="w-4 h-4"
                  style={{ color: tx.type === "yield" ? "#446e0c" : "#1c1c1a" }}
                />
              </div>
              <div className="flex-1">
                <p
                  className="text-[14px] font-medium"
                  style={{ color: "#1c1c1a" }}
                >
                  {tx.label}
                </p>
                <p
                  className="text-[12px]"
                  style={{ color: "rgba(28,28,26,0.35)" }}
                >
                  {tx.date}
                </p>
              </div>
              <span
                className="text-[15px] font-bold tabular-nums"
                style={{ color: tx.amount > 0 ? "#1c1c1a" : "rgba(28,28,26,0.5)" }}
              >
                {tx.amount > 0 ? "+" : ""}{tx.amount < 0 ? "-" : ""}${Math.abs(tx.amount).toFixed(2)}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {showDetail && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 mt-2 rounded-2xl" style={{ background: "rgba(28,28,26,0.03)" }}>
                <p className="text-[12px] font-medium" style={{ color: "rgba(28,28,26,0.35)" }}>
                  ID de transaccion
                </p>
                <p className="text-[13px] font-medium mt-1" style={{ color: "#1c1c1a" }}>
                  0x{showDetail.toString(16).padStart(8, "0")}...a4f2
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
