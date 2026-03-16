"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ChevronDown } from "lucide-react"

interface ResultEntry {
  id: string
  symbol: string
  name: string
  color: string
  date: string
  pnlAmount: number
  pnlPct: number
  buyPrice: number
  sellPrice: number
}

const RESULTS: ResultEntry[] = [
  {
    id: "sndl",
    symbol: "SN",
    name: "Sundial Growers",
    color: "#7c3aed",
    date: "03 de mar de 2025",
    pnlAmount: 2.18,
    pnlPct: 21.43,
    buyPrice: 10.15,
    sellPrice: 12.33,
  },
  {
    id: "brka",
    symbol: "BRK.A",
    name: "Berkshire Hathaway A",
    color: "#94a3b8",
    date: "02 de mar de 2025",
    pnlAmount: 0.21,
    pnlPct: 2.11,
    buyPrice: 9.94,
    sellPrice: 10.15,
  },
  {
    id: "googl",
    symbol: "GOOGL",
    name: "Alphabet",
    color: "#4285f4",
    date: "01 de mar de 2025",
    pnlAmount: 163.20,
    pnlPct: 19.43,
    buyPrice: 840.00,
    sellPrice: 1003.20,
  },
]

const TOTAL_PNL = RESULTS.reduce((acc, r) => acc + r.pnlAmount, 0)
const TOTAL_PCT = 11.57

interface Props {
  onClose: () => void
}

function ResultRow({ entry }: { entry: ResultEntry }) {
  const [expanded, setExpanded] = useState(false)
  const isPositive = entry.pnlAmount >= 0

  return (
    <motion.div
      layout
      className="rounded-2xl overflow-hidden"
      style={{ background: "#FEFEFE" }}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-4 active:opacity-70 transition-opacity"
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ background: entry.color }}
          >
            <span className="text-[11px] font-bold" style={{ color: "#ffffff" }}>
              {entry.symbol.slice(0, 2)}
            </span>
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[14px] font-semibold" style={{ color: "#1c1c1a" }}>
                  {entry.symbol}
                </p>
                <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                  {entry.name}
                </p>
              </div>
              <p className="text-[12px] flex-shrink-0" style={{ color: "rgba(28,28,26,0.38)" }}>
                {entry.date}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="text-[14px] font-bold"
                style={{ color: isPositive ? "#446e0c" : "#E63946" }}
              >
                {isPositive ? "+" : "-"}${Math.abs(entry.pnlAmount).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className="text-[12px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: isPositive ? "rgba(68,110,12,0.10)" : "rgba(230,57,70,0.10)",
                  color: isPositive ? "#446e0c" : "#E63946",
                }}
              >
                {isPositive ? "+" : ""}{entry.pnlPct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Expand row */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(28,28,26,0.06)" }}>
          <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.45)" }}>
            Inversión inicial ${entry.buyPrice.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            {"  ·  "}
            Venta ${entry.sellPrice.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </p>
          <ChevronDown
            className="w-4 h-4 flex-shrink-0 transition-transform"
            style={{
              color: "rgba(28,28,26,0.35)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
            strokeWidth={2}
          />
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 flex flex-col gap-2">
              <div className="flex justify-between py-2" style={{ borderTop: "1px solid rgba(28,28,26,0.06)" }}>
                <span className="text-[13px]" style={{ color: "rgba(28,28,26,0.45)" }}>Precio de compra</span>
                <span className="text-[13px] font-semibold" style={{ color: "#1c1c1a" }}>
                  ${entry.buyPrice.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-2" style={{ borderTop: "1px solid rgba(28,28,26,0.06)" }}>
                <span className="text-[13px]" style={{ color: "rgba(28,28,26,0.45)" }}>Precio de venta</span>
                <span className="text-[13px] font-semibold" style={{ color: "#1c1c1a" }}>
                  ${entry.sellPrice.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between py-2" style={{ borderTop: "1px solid rgba(28,28,26,0.06)" }}>
                <span className="text-[13px]" style={{ color: "rgba(28,28,26,0.45)" }}>Resultado</span>
                <span
                  className="text-[13px] font-bold"
                  style={{ color: isPositive ? "#446e0c" : "#E63946" }}
                >
                  {isPositive ? "+" : "-"}${Math.abs(entry.pnlAmount).toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function InversionesHistorial({ onClose }: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-2 pb-0 flex-shrink-0">
        <div className="flex items-center mb-5">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform flex-shrink-0"
            style={{ background: "rgba(28,28,26,0.06)" }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
          </button>
          <h1 className="text-[16px] font-semibold ml-3" style={{ color: "#1c1c1a" }}>
            Historial de resultados
          </h1>
        </div>

        {/* Total summary */}
        <div>
          <p className="text-[11px] font-semibold tracking-wider mb-0.5" style={{ color: "rgba(28,28,26,0.38)" }}>
            TOTAL DE VENTAS Y DIVIDENDOS
          </p>
          <p className="text-[11px]" style={{ color: "rgba(28,28,26,0.38)" }}>
            Cifras expresadas en dólares digitales
          </p>
          <p
            className="text-[38px] font-bold tracking-tight leading-none mt-2 mb-2"
            style={{ color: "#1c1c1a" }}
          >
            +${TOTAL_PNL.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-2 mb-5">
            <span
              className="text-[13px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(68,110,12,0.10)", color: "#446e0c" }}
            >
              +{TOTAL_PCT.toFixed(2)}%
            </span>
            <span className="text-[13px]" style={{ color: "rgba(28,28,26,0.45)" }}>
              sobre precio de compra
            </span>
          </div>

          {/* Date range filters */}
          <div className="flex gap-3 mb-5">
            {["DESDE", "HASTA"].map((label) => (
              <div
                key={label}
                className="flex-1 flex items-center justify-between px-3 py-2.5 rounded-2xl"
                style={{ background: "rgba(28,28,26,0.06)" }}
              >
                <div>
                  <p className="text-[10px] font-semibold tracking-wider" style={{ color: "rgba(28,28,26,0.38)" }}>
                    {label}
                  </p>
                  <p className="text-[13px]" style={{ color: "rgba(28,28,26,0.35)" }}>
                    dd/mm/aaaa
                  </p>
                </div>
                <span className="text-[16px]" style={{ color: "rgba(28,28,26,0.35)" }}>📅</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto px-5 pb-8 flex flex-col gap-3">
        {RESULTS.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i, duration: 0.22 }}
          >
            <ResultRow entry={entry} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
