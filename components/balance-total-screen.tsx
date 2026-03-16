"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { MorphIcon } from '@/components/ui/morph-icon'

interface BalanceTotalScreenProps {
  onClose: () => void
}

const USD_RATE = 1200

const accounts = [
  { name: "Pesos", amount: 4000000, amountUSD: 4000000 / USD_RATE, change: 32, color: "#ddf74c", currency: "ARS" },
  { name: "D\u00f3lares", amount: 900.62, amountUSD: 900.62, change: 10, color: "#2b2a28", currency: "USD" },
  { name: "Inversiones", amount: 1300, amountUSD: 1300, change: 4.95, color: "#ddf74c", currency: "USD" },
]

const totalBalanceUSD = accounts.reduce((acc, a) => acc + a.amountUSD, 0)

const chartPoints = [
  { month: "Sep", value: 30 },
  { month: "Oct", value: 45 },
  { month: "Nov", value: 38 },
  { month: "Dic", value: 52 },
  { month: "Ene", value: 60 },
  { month: "Feb", value: 75 },
]

export default function BalanceTotalScreen({ onClose }: BalanceTotalScreenProps) {
  const maxVal = Math.max(...chartPoints.map((p) => p.value))
  const polylinePoints = chartPoints
    .map((p, i) => `${(i / (chartPoints.length - 1)) * 100},${100 - (p.value / maxVal) * 80}`)
    .join(" ")

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={onClose}>
              <MorphIcon icon="arrow-left" size={20} color="#fff" />
          </button>
          <h1
            className="text-[16px] font-semibold"
            style={{ color: "#1c1c1a" }}
          >
            Balance total
          </h1>
        </div>

        {/* Balance hero */}
        <div className="p-6 relative overflow-hidden rounded-3xl" style={{ background: "#2b2a28" }}>
          <p
            className="text-[14px] font-medium mb-1"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Balance total
          </p>
          <span
            className="text-[36px] font-bold tracking-tight leading-none block"
            style={{ color: "#FFFFFF" }}
          >
            USD {totalBalanceUSD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4" style={{ color: "#ddf74c" }} />
            <span
              className="text-[14px] font-medium"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              +12,4% este mes
            </span>
          </div>

          {/* Chart */}
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <svg width="100%" height="80" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
              {/* Gradient fill */}
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ddf74c" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ddf74c" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon
                points={`0,100 ${polylinePoints} 100,100`}
                fill="url(#chartGrad)"
              />
              <motion.polyline
                points={polylinePoints}
                fill="none"
                stroke="#ddf74c"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            <div className="flex justify-between mt-2">
              {chartPoints.map((p) => (
                <span key={p.month} className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {p.month}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accounts breakdown */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
        <p
          className="text-[14px] font-semibold mb-3"
          style={{ color: "rgba(28,28,26,0.4)" }}
        >
          Cuentas
        </p>

        {accounts.map((account, index) => (
          <motion.div
            key={account.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 * index, duration: 0.25 }}
            className="flex items-center gap-3 py-4"
            style={{ borderBottom: "1px solid rgba(28,28,26,0.06)" }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center flex-shrink-0 rounded-xl"
              style={{
                background: account.color,
                border: account.color === "#2b2a28" ? "none" : "1px solid rgba(28,28,26,0.06)",
              }}
            >
              <span className="text-[11px] font-bold" style={{ color: account.color === "#2b2a28" ? "#ddf74c" : "#1c1c1a" }}>
                $
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-medium" style={{ color: "#1c1c1a" }}>
                {account.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <ArrowUpRight className="w-3 h-3" style={{ color: "#446e0c" }} />
                <span className="text-[12px] font-medium" style={{ color: "#446e0c" }}>
                  +{account.change}%
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[16px] font-bold tabular-nums" style={{ color: "#1c1c1a" }}>
                USD {account.amountUSD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {account.currency === "ARS" && (
                <p className="text-[11px] font-medium" style={{ color: "rgba(28,28,26,0.35)" }}>
                  ${account.amount.toLocaleString("es-AR")} ARS
                </p>
              )}
            </div>
          </motion.div>
        ))}

        {/* Distribution */}
        <div className="mt-5 p-4 rounded-2xl" style={{ background: "rgba(28,28,26,0.03)" }}>
          <p className="text-[13px] font-semibold mb-3" style={{ color: "rgba(28,28,26,0.4)" }}>
            {"Distribuci\u00f3n"}
          </p>
          <div className="flex gap-1 h-3 w-full rounded-full overflow-hidden">
            {accounts.map((account) => (
              <motion.div
                key={account.name}
                initial={{ width: 0 }}
                animate={{ width: `${(account.amountUSD / totalBalanceUSD) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                className="h-full first:rounded-l-full last:rounded-r-full"
                style={{ background: account.color === "#2b2a28" ? "#2b2a28" : account.color }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {accounts.map((account) => (
              <div key={account.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: account.color === "#2b2a28" ? "#2b2a28" : account.color }}
                  />
                  <span className="text-[12px] font-medium" style={{ color: "rgba(28,28,26,0.5)" }}>
                    {account.name}
                  </span>
                </div>
                <span className="text-[12px] font-medium" style={{ color: "rgba(28,28,26,0.5)" }}>
                  {((account.amountUSD / totalBalanceUSD) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
