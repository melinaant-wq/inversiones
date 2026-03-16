"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, ArrowLeft } from "lucide-react"
import { STOCKS, Pack, Stock } from "./inversiones-flow"

interface Props {
  pack: Pack
  onClose: () => void
  onBuy: () => void
}

const PACK_WEIGHTS: Record<string, number[]> = {
  "tech-leaders":   [35, 30, 22, 13],
  "sp500-core":     [30, 28, 22, 20],
  "dividendos":     [32, 28, 22, 18],
  "innovation":     [35, 28, 22, 15],
}

function StockAvatar({ stock }: { stock: Stock }) {
  const [imgState, setImgState] = useState<"primary" | "fallback" | "error">("primary")
  const domain = stock.logo?.replace("https://logo.clearbit.com/", "")
  const fallbackSrc = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null
  const showInitials = imgState === "error" || (!stock.logo && !fallbackSrc)
  const src = imgState === "fallback" && fallbackSrc ? fallbackSrc : stock.logo

  return (
    <div
      className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
      style={{ background: showInitials ? stock.color : "#ffffff", border: `1.5px solid ${stock.color}30` }}
    >
      {!showInitials && src ? (
        <img
          src={src}
          alt={stock.symbol}
          className="w-6 h-6 object-contain"
          onError={() => setImgState((s) => s === "primary" ? "fallback" : "error")}
        />
      ) : (
        <span className="text-[11px] font-bold" style={{ color: "#ffffff" }}>
          {stock.symbol.slice(0, 2)}
        </span>
      )}
    </div>
  )
}

export default function InversionesPackDetail({ pack, onClose, onBuy }: Props) {
  const weights = PACK_WEIGHTS[pack.id] ?? pack.stocks.map(() => Math.floor(100 / pack.stocks.length))

  const packStocks = pack.stocks.map((id, i) => {
    const stock = STOCKS.find((s) => s.id === id)
    return stock ? { stock, weight: weights[i] ?? Math.floor(100 / pack.stocks.length) } : null
  }).filter(Boolean) as Array<{ stock: Stock; weight: number }>

  return (
    <div className="relative flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="px-5 pt-2 pb-3 flex-shrink-0">
        <div className="flex items-center mb-4">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
            style={{ background: "rgba(28,28,26,0.06)" }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
          </button>
          <h1 className="text-[16px] font-semibold ml-3" style={{ color: "#1c1c1a" }}>
            {pack.name}
          </h1>
        </div>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-5 rounded-3xl"
          style={{ background: pack.color }}
        >
          <p className="text-[13px] leading-snug" style={{ color: "rgba(255,255,255,0.6)" }}>
            {pack.description}
          </p>
          <div className="flex items-end justify-between mt-4">
            <div>
              <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                Rendimiento 12 meses
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <ArrowUpRight className="w-4 h-4" style={{ color: "#ddf74c" }} />
                <p className="text-[28px] font-bold leading-none" style={{ color: "#ddf74c" }}>
                  +{pack.returnY}%
                </p>
              </div>
            </div>
            <span
              className="text-[12px] font-semibold px-3 py-1.5 rounded-full self-end mb-1"
              style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}
            >
              Volatilidad {pack.volatility}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Composition */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5" style={{ paddingBottom: "100px" }}>
        <p
          className="text-[11px] font-bold uppercase tracking-wider mb-3"
          style={{ color: "rgba(28,28,26,0.35)" }}
        >
          Composición
        </p>

        {/* Color bar */}
        <div className="flex h-2 rounded-full overflow-hidden mb-4" style={{ gap: "2px" }}>
          {packStocks.map((item) => (
            <div
              key={item.stock.id}
              style={{ width: `${item.weight}%`, background: item.stock.color }}
            />
          ))}
        </div>

        {/* Stock list */}
        <div className="flex flex-col gap-2">
          {packStocks.map((item, i) => {
            const isUp = item.stock.change >= 0
            return (
              <motion.div
                key={item.stock.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i + 0.1, duration: 0.22 }}
                className="flex items-center gap-3 p-3.5 rounded-2xl"
                style={{ background: "#FEFEFE" }}
              >
                <StockAvatar stock={item.stock} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold" style={{ color: "#1c1c1a" }}>
                    {item.stock.name}
                  </p>
                  <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                    {item.stock.symbol} · {item.stock.sector}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                  <span
                    className="text-[14px] font-bold tabular-nums"
                    style={{ color: "#1c1c1a" }}
                  >
                    {item.weight}%
                  </span>
                  <div className="flex items-center gap-0.5">
                    {isUp
                      ? <ArrowUpRight className="w-3 h-3" style={{ color: "#446e0c" }} />
                      : <ArrowDownRight className="w-3 h-3" style={{ color: "#E63946" }} />
                    }
                    <span
                      className="text-[11px] font-medium"
                      style={{ color: isUp ? "#446e0c" : "#E63946" }}
                    >
                      {isUp ? "+" : ""}{item.stock.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* CTA */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-4"
        style={{ background: "linear-gradient(to top, #f5f4f1 65%, transparent)" }}
      >
        <button
          onClick={onBuy}
          className="w-full py-3.5 rounded-full active:scale-95 transition-transform"
          style={{ background: "#2b2a28" }}
        >
          <span className="text-[15px] font-semibold" style={{ color: "#f5f4f1" }}>
            Invertir en este Pack
          </span>
        </button>
      </div>
    </div>
  )
}
