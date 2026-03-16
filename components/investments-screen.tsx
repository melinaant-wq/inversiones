"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react"
import { MorphIcon } from '@/components/ui/morph-icon'

interface InvestmentsScreenProps {
  onClose: () => void
}

const cryptoHoldings = [
  { id: 1, name: "Bitcoin", symbol: "BTC", amount: 0.0052, value: 310, change: 3.2, color: "#F7931A" },
  { id: 2, name: "Ethereum", symbol: "ETH", amount: 0.12, value: 265, change: -1.4, color: "#627EEA" },
  { id: 3, name: "Solana", symbol: "SOL", amount: 1.2, value: 95, change: 5.8, color: "#9945FF" },
]

const stockHoldings = [
  { id: 1, name: "Apple", symbol: "AAPL", shares: 1, value: 245, change: 1.1, color: "#555555" },
  { id: 2, name: "Tesla", symbol: "TSLA", shares: 1, value: 210, change: -2.3, color: "#E31937" },
  { id: 3, name: "NVIDIA", symbol: "NVDA", shares: 1, value: 175, change: 4.5, color: "#76B900" },
]

const cryptoTotal = cryptoHoldings.reduce((acc, h) => acc + h.value, 0)
const stocksTotal = stockHoldings.reduce((acc, h) => acc + h.value, 0)
const totalBalance = cryptoTotal + stocksTotal

export default function InvestmentsScreen({ onClose }: InvestmentsScreenProps) {
  const [activeTab, setActiveTab] = useState<"crypto" | "stocks">("crypto")
  const [selectedAsset, setSelectedAsset] = useState<number | null>(null)

  const holdings = activeTab === "crypto" ? cryptoHoldings : stockHoldings

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
            <MorphIcon icon="arrow-left" size={16} color="#1c1c1a" />
          </button>
          <h1
            className="text-[16px] font-semibold"
            style={{ color: "#1c1c1a" }}
          >
            Inversiones
          </h1>
        </div>

        {/* Balance hero */}
        <div className="p-6 relative overflow-hidden rounded-3xl" style={{ background: "#ddf74c" }}>
          <p
            className="text-[14px] font-medium mb-1"
            style={{ color: "rgba(28,28,26,0.5)" }}
          >
            Portfolio
          </p>
          <span
            className="text-[38px] font-bold tracking-tight leading-none block"
            style={{ color: "#1c1c1a" }}
          >
            ${totalBalance.toLocaleString("es-AR")}
          </span>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-4 h-4" style={{ color: "#1c1c1a" }} />
            <span
              className="text-[14px] font-medium"
              style={{ color: "rgba(28,28,26,0.6)" }}
            >
              +2,8% total
            </span>
          </div>

          {/* Split bar */}
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid rgba(28,28,26,0.1)" }}>
            <div className="flex gap-1 h-2 w-full rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(cryptoTotal / totalBalance) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="rounded-full"
                style={{ background: "#1c1c1a" }}
              />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stocksTotal / totalBalance) * 100}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                className="rounded-full"
                style={{ background: "rgba(28,28,26,0.25)" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[13px] font-medium" style={{ color: "rgba(28,28,26,0.5)" }}>
                Crypto ${cryptoTotal.toLocaleString("es-AR")}
              </span>
              <span className="text-[13px] font-medium" style={{ color: "rgba(28,28,26,0.35)" }}>
                Acciones ${stocksTotal.toLocaleString("es-AR")}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => { setActiveTab("crypto"); setSelectedAsset(null) }}
            className="flex-1 py-3 text-center rounded-2xl active:scale-95 transition-all"
            style={{
              background: activeTab === "crypto" ? "#1c1c1a" : "rgba(28,28,26,0.04)",
            }}
          >
            <span
              className="text-[14px] font-semibold"
              style={{ color: activeTab === "crypto" ? "#ddf74c" : "#1c1c1a" }}
            >
              Crypto
            </span>
          </button>
          <button
            onClick={() => { setActiveTab("stocks"); setSelectedAsset(null) }}
            className="flex-1 py-3 text-center rounded-2xl active:scale-95 transition-all"
            style={{
              background: activeTab === "stocks" ? "#1c1c1a" : "rgba(28,28,26,0.04)",
            }}
          >
            <span
              className="text-[14px] font-semibold"
              style={{ color: activeTab === "stocks" ? "#ddf74c" : "#1c1c1a" }}
            >
              Acciones
            </span>
          </button>
        </div>
      </div>

      {/* Holdings list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
        <p
          className="text-[14px] font-semibold mb-3"
          style={{ color: "rgba(28,28,26,0.4)" }}
        >
          {activeTab === "crypto" ? "Tu Crypto" : "Tus Acciones"}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {holdings.map((asset, index) => (
              <motion.button
                key={asset.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.25 }}
                onClick={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
                className="w-full text-left active:opacity-60 transition-opacity"
                style={{ borderBottom: "1px solid rgba(28,28,26,0.06)" }}
              >
                <div className="flex items-center gap-3 py-3.5">
                  {/* Asset icon */}
                  <div
                    className="w-9 h-9 flex items-center justify-center flex-shrink-0 rounded-full"
                    style={{ background: asset.color }}
                  >
                    <span className="text-[12px] font-bold text-white">
                      {asset.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium" style={{ color: "#1c1c1a" }}>
                      {asset.name}
                    </p>
                    <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.35)" }}>
                      {activeTab === "crypto"
                        ? `${(asset as typeof cryptoHoldings[0]).amount} ${asset.symbol}`
                        : `${(asset as typeof stockHoldings[0]).shares} ${(asset as typeof stockHoldings[0]).shares > 1 ? "acciones" : "accion"}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[15px] font-bold tabular-nums" style={{ color: "#1c1c1a" }}>
                      ${asset.value.toLocaleString("es-AR")}
                    </p>
                    <div className="flex items-center justify-end gap-0.5">
                      {asset.change >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" style={{ color: "#446e0c" }} />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" style={{ color: "#E63946" }} />
                      )}
                      <span
                        className="text-[12px] font-medium"
                        style={{ color: asset.change >= 0 ? "#446e0c" : "#E63946" }}
                      >
                        {asset.change >= 0 ? "+" : ""}{asset.change}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {selectedAsset === asset.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-3 flex gap-2">
                        <div className="flex-1 p-3 rounded-xl" style={{ background: "rgba(28,28,26,0.03)" }}>
                          <p className="text-[11px] font-medium" style={{ color: "rgba(28,28,26,0.35)" }}>
                            Costo prom.
                          </p>
                          <p className="text-[14px] font-bold mt-1" style={{ color: "#1c1c1a" }}>
                            ${(asset.value * 0.92).toFixed(0)}
                          </p>
                        </div>
                        <div className="flex-1 p-3 rounded-xl" style={{ background: "rgba(28,28,26,0.03)" }}>
                          <p className="text-[11px] font-medium" style={{ color: "rgba(28,28,26,0.35)" }}>
                            G/P
                          </p>
                          <p
                            className="text-[14px] font-bold mt-1"
                            style={{ color: asset.change >= 0 ? "#446e0c" : "#E63946" }}
                          >
                            {asset.change >= 0 ? "+" : "-"}${Math.abs(asset.value * (asset.change / 100)).toFixed(0)}
                          </p>
                        </div>
                        <div className="flex-1 p-3 rounded-xl" style={{ background: "rgba(28,28,26,0.03)" }}>
                          <p className="text-[11px] font-medium" style={{ color: "rgba(28,28,26,0.35)" }}>
                            24h
                          </p>
                          <div className="flex items-center gap-0.5 mt-1">
                            <TrendingUp className="w-3 h-3" style={{ color: "rgba(28,28,26,0.35)" }} />
                            <span className="text-[13px] font-medium" style={{ color: "rgba(28,28,26,0.5)" }}>
                              {(asset.change * 0.3).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Buy/Sell buttons */}
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 py-3 text-center rounded-2xl active:scale-95 transition-transform"
            style={{ background: "#ddf74c" }}
          >
            <span className="text-[14px] font-semibold" style={{ color: "#1c1c1a" }}>
              Comprar
            </span>
          </button>
          <button
            className="flex-1 py-3 text-center rounded-2xl active:scale-95 transition-transform"
            style={{ background: "rgba(28,28,26,0.04)" }}
          >
            <span className="text-[14px] font-semibold" style={{ color: "#1c1c1a" }}>
              Vender
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
