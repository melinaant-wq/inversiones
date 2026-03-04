"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Plus, Send, RefreshCw, QrCode } from "lucide-react"

interface CashScreenProps {
  onClose: () => void
}

const transactions = [
  { id: 1, type: "income", label: "Deposito de sueldo", amount: 850000, date: "Feb 15", icon: ArrowDownLeft },
  { id: 2, type: "yield", label: "Rendimiento", amount: 34520, date: "Feb 14", icon: ArrowUpRight },
  { id: 3, type: "expense", label: "Supermercado", amount: -28400, date: "Feb 13", icon: Send },
  { id: 4, type: "expense", label: "Netflix", amount: -4299, date: "Feb 12", icon: Send },
  { id: 5, type: "yield", label: "Rendimiento", amount: 33890, date: "Feb 11", icon: ArrowUpRight },
  { id: 6, type: "income", label: "Pago freelance", amount: 120000, date: "Feb 10", icon: ArrowDownLeft },
  { id: 7, type: "expense", label: "Restaurante", amount: -15600, date: "Feb 8", icon: Send },
  { id: 8, type: "yield", label: "Rendimiento", amount: 33210, date: "Feb 7", icon: ArrowUpRight },
  { id: 9, type: "expense", label: "Uber", amount: -8900, date: "Feb 5", icon: Send },
  { id: 10, type: "income", label: "Transferencia recibida", amount: 200000, date: "Feb 3", icon: ArrowDownLeft },
]

export default function CashScreen({ onClose }: CashScreenProps) {
  const [balance] = useState(4000000.0000)
  const [showDetail, setShowDetail] = useState<number | null>(null)

  const dollars = Math.floor(balance)
  const centsStr = (balance - dollars).toFixed(4).slice(2)

  const monthlyYield = Math.floor(balance * 0.32 / 12)
  const dailyYield = Math.floor(balance * 0.32 / 365)

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
            Pesos
          </h1>
        </div>

        {/* Balance hero */}
        <div className="p-6 relative overflow-hidden rounded-3xl" style={{ background: "#ddf74c" }}>
          <p
            className="text-[14px] font-medium mb-1"
            style={{ color: "rgba(28,28,26,0.5)" }}
          >
            Balance
          </p>
          <div className="flex items-baseline">
            <span
              className="text-[38px] font-bold tracking-tight leading-none"
              style={{ color: "#1c1c1a" }}
            >
              ${dollars.toLocaleString("es-AR")}
            </span>
            <span
              className="text-[16px] font-normal leading-none ml-0.5"
              style={{ color: "rgba(28,28,26,0.35)" }}
            >
              ,{centsStr}
            </span>
          </div>

          {/* APY + Earnings */}
          <div className="flex items-center gap-3 mt-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-full"
              style={{ background: "rgba(28,28,26,0.8)", color: "#ddf74c" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: "#ddf74c" }} />
              32% anual
            </span>
            <span
              className="text-[13px] font-medium"
              style={{ color: "rgba(28,28,26,0.4)" }}
            >
              +${dailyYield.toLocaleString("es-AR")}/dia
            </span>
          </div>

          {/* Monthly projection */}
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(28,28,26,0.1)" }}>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-medium" style={{ color: "rgba(28,28,26,0.4)" }}>
                {"Proyecci\u00f3n mensual"}
              </span>
              <span className="text-[15px] font-bold" style={{ color: "#1c1c1a" }}>
                +${monthlyYield.toLocaleString("es-AR")}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(28,28,26,0.08)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="h-full rounded-full"
                style={{ background: "#1c1c1a" }}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          {[
            { label: "Depositar", icon: Plus },
            { label: "Enviar", icon: Send },
            { label: "QR", icon: QrCode },
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
              transition={{ delay: 0.04 * index, duration: 0.25 }}
              onClick={() => setShowDetail(showDetail === tx.id ? null : tx.id)}
              className="w-full flex items-center gap-3 py-3 text-left active:opacity-60 transition-opacity"
              style={{ borderBottom: "1px solid rgba(28,28,26,0.06)" }}
            >
              <div
                className="w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-full"
                style={{
                  background: tx.type === "yield" ? "rgba(219,255,0,0.2)" : "rgba(28,28,26,0.04)",
                }}
              >
                <tx.icon
                  className="w-4 h-4"
                  style={{ color: tx.type === "yield" ? "#446e0c" : tx.amount > 0 ? "#1c1c1a" : "rgba(28,28,26,0.5)" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px] font-medium truncate"
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
                className="text-[15px] font-bold tabular-nums flex-shrink-0"
                style={{ color: tx.amount > 0 ? "#1c1c1a" : "rgba(28,28,26,0.5)" }}
              >
                {tx.amount > 0 ? "+" : "-"}${Math.abs(tx.amount).toLocaleString("es-AR")}
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
                  0x{showDetail.toString(16).padStart(8, "0")}...b7e3
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
