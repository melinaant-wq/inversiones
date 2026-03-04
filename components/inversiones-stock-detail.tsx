"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft, ArrowUpRight, ArrowDownRight,
  ShoppingCart, TrendingDown, DollarSign,
  Newspaper, BarChart2, Layers,
} from "lucide-react"
import {
  getStockById,
  getHolding,
  calcCurrentValue,
  calcPnL,
  generatePrices,
  toSvgPoints,
  smoothLinePath,
  areaPath,
  ARS_RATE,
} from "./inversiones-flow"

interface Props {
  stockId: string
  onClose: () => void
  onOpenBuy: (id: string) => void
  onOpenSell: (id: string) => void
}

const PERIODS = ["Histórico", "YTD", "MTD", "1M", "1D"] as const
type Period = typeof PERIODS[number]

// Mapeo al formato que entiende generatePrices
const PERIOD_GEN_KEY: Record<Period, string> = {
  "Histórico": "1Y",
  "YTD":       "3M",
  "MTD":       "1W",
  "1M":        "1M",
  "1D":        "1D",
}

// Etiquetas eje X por período
const PERIOD_X_LABELS: Record<Period, string[]> = {
  "Histórico": ["2020", "2021", "2022", "2023", "2024"],
  "YTD":       ["Ene", "Mar", "May", "Jul", "Sep"],
  "MTD":       ["S1", "S2", "S3", "S4"],
  "1M":        ["S1", "S2", "S3", "S4"],
  "1D":        ["9am", "12pm", "3pm", "Cierre"],
}

type Tab = "posicion" | "resumen" | "noticias"

const CHART_W = 280
const CHART_H = 110

// Mock news data
const MOCK_NEWS = [
  {
    id: 1,
    title: "Wall Street cierra en máximos históricos impulsado por resultados de tecnológicas",
    source: "Bloomberg",
    time: "Hace 2h",
    tag: "Mercados",
  },
  {
    id: 2,
    title: "La Fed mantiene tasas estables y señala posibles recortes para el segundo semestre",
    source: "Reuters",
    time: "Hace 5h",
    tag: "Macro",
  },
  {
    id: 3,
    title: "Inversores institucionales aumentan exposición a acciones de inteligencia artificial",
    source: "Financial Times",
    time: "Hace 8h",
    tag: "Tendencias",
  },
]

export default function InversionesStockDetail({ stockId, onClose, onOpenBuy, onOpenSell }: Props) {
  const stock = getStockById(stockId)
  const holding = getHolding(stockId)

  const [period, setPeriod] = useState<Period>("1M")
  const [scrubIdx, setScrubIdx] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>(() => (holding ? "posicion" : "resumen"))
  const [logoState, setLogoState] = useState<"primary" | "fallback" | "error">("primary")
  const svgRef = useRef<SVGSVGElement>(null)

  const prices = useMemo(
    () => generatePrices(stockId, PERIOD_GEN_KEY[period], stock?.price ?? 100),
    [stockId, period, stock?.price]
  )

  const points = useMemo(() => toSvgPoints(prices, CHART_W, CHART_H), [prices])
  const linePath = useMemo(() => smoothLinePath(points), [points])
  const fillPath = useMemo(() => areaPath(points, CHART_H), [points])

  const isUp = prices[prices.length - 1] >= prices[0]
  const lineColor = isUp ? "#446e0c" : "#E63946"

  const buyMarkerIdx = Math.floor(prices.length * 0.28)
  const divMarkerIdx = Math.floor(prices.length * 0.65)
  const buyPt = points[buyMarkerIdx]
  const divPt = points[divMarkerIdx]

  const scrubberPrice = scrubIdx !== null ? prices[scrubIdx] : stock?.price ?? 0
  const scrubberPt = scrubIdx !== null ? points[scrubIdx] : null

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault()
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const x = e.touches[0].clientX - rect.left
      const idx = Math.round((x / CHART_W) * (prices.length - 1))
      setScrubIdx(Math.max(0, Math.min(prices.length - 1, idx)))
    },
    [prices.length]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const x = e.clientX - rect.left
      const idx = Math.round((x / CHART_W) * (prices.length - 1))
      setScrubIdx(Math.max(0, Math.min(prices.length - 1, idx)))
    },
    [prices.length]
  )

  if (!stock) return null

  const currentVal = holding ? calcCurrentValue(holding, stock) : null
  const pnl = holding ? calcPnL(holding, stock) : null
  const totalChangeAmt = prices[prices.length - 1] - prices[0]
  const totalChangePct = (totalChangeAmt / prices[0]) * 100

  // Tabs config
  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    ...(holding ? [{ id: "posicion" as Tab, label: "Posición", icon: Layers }] : []),
    { id: "resumen", label: "Resumen", icon: BarChart2 },
    { id: "noticias", label: "Noticias", icon: Newspaper },
  ]

  // Mock market stats
  const hi52 = (stock.price * 1.38).toFixed(2)
  const lo52 = (stock.price * 0.71).toFixed(2)
  const marketCap = stock.price > 400
    ? `$${(stock.price * 2.4).toFixed(0)}B`
    : `$${(stock.price * 8.1).toFixed(0)}B`

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Fixed Header: Stock Info + Price + Chart ─────────── */}
      <div className="px-5 pt-2 pb-0 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform flex-shrink-0"
            style={{ background: "rgba(28,28,26,0.06)" }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {(() => {
                const logoDomain = stock.logo?.replace("https://logo.clearbit.com/", "")
                const logoFallback = logoDomain ? `https://www.google.com/s2/favicons?domain=${logoDomain}&sz=128` : null
                const showLogoInitials = logoState === "error" || (!stock.logo && !logoFallback)
                const logoSrc = logoState === "fallback" && logoFallback ? logoFallback : stock.logo
                return (
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
                    style={{
                      background: showLogoInitials ? stock.color : "#ffffff",
                      border: `1.5px solid ${stock.color}30`,
                    }}
                  >
                    {!showLogoInitials && logoSrc ? (
                      <img
                        src={logoSrc}
                        alt={stock.symbol}
                        className="w-5 h-5 object-contain"
                        onError={() => setLogoState((s) => s === "primary" ? "fallback" : "error")}
                      />
                    ) : (
                      <span className="text-[9px] font-bold" style={{ color: "#ffffff" }}>
                        {stock.symbol.slice(0, 2)}
                      </span>
                    )}
                  </div>
                )
              })()}
              <p className="text-[15px] font-semibold" style={{ color: "#1c1c1a" }}>
                {stock.name}
              </p>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: "rgba(28,28,26,0.07)", color: "rgba(28,28,26,0.5)" }}
              >
                {stock.symbol}
              </span>
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(28,28,26,0.4)" }}>
              {stock.sector}
            </p>
          </div>
        </div>

        {/* Price hero */}
        <div className="mb-3">
          <div className="flex items-end gap-2">
            <span
              className="text-[32px] font-bold tracking-tight leading-none"
              style={{ color: "#1c1c1a" }}
            >
              ${scrubberPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-0.5 pb-1">
              {isUp ? (
                <ArrowUpRight className="w-4 h-4" style={{ color: "#446e0c" }} />
              ) : (
                <ArrowDownRight className="w-4 h-4" style={{ color: "#E63946" }} />
              )}
              <span className="text-[14px] font-semibold" style={{ color: isUp ? "#446e0c" : "#E63946" }}>
                {totalChangePct >= 0 ? "+" : ""}{totalChangePct.toFixed(2)}%
              </span>
              <span className="text-[12px]" style={{ color: "rgba(28,28,26,0.35)" }}>
                {" · "}{period}
              </span>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          <AnimatePresence>
            {scrubberPt && scrubIdx !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.1 }}
                className="absolute z-10 px-2 py-1 rounded-xl text-[11px] font-bold"
                style={{
                  background: "#1c1c1a",
                  color: "#ddf74c",
                  left: Math.min(Math.max(scrubberPt[0] - 32, 0), CHART_W - 64),
                  top: Math.max(scrubberPt[1] - 30, 0),
                  pointerEvents: "none",
                }}
              >
                ${prices[scrubIdx].toFixed(2)}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="flex items-center gap-3 mb-1.5">
            {holding && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: "#446e0c" }} />
                <span className="text-[10px]" style={{ color: "rgba(28,28,26,0.4)" }}>Compra</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full border-2" style={{ background: "#ddf74c", borderColor: "#446e0c" }} />
              <span className="text-[10px]" style={{ color: "rgba(28,28,26,0.4)" }}>Dividendo</span>
            </div>
          </div>

          <svg
            ref={svgRef}
            width={CHART_W}
            height={CHART_H}
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="w-full touch-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setScrubIdx(null)}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setScrubIdx(null)}
            style={{ cursor: "crosshair" }}
          >
            <defs>
              <linearGradient id={`grad-${stock.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity="0.18" />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={fillPath} fill={`url(#grad-${stock.id})`} />
            <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {holding && buyPt && (
              <>
                <line x1={buyPt[0]} y1={buyPt[1]} x2={buyPt[0]} y2={CHART_H} stroke="#446e0c" strokeWidth="1" strokeDasharray="2,3" strokeOpacity="0.4" />
                <circle cx={buyPt[0]} cy={buyPt[1]} r={5} fill="#446e0c" />
                <circle cx={buyPt[0]} cy={buyPt[1]} r={3} fill="#ffffff" />
              </>
            )}
            {divPt && (
              <circle cx={divPt[0]} cy={divPt[1]} r={5} fill="#ddf74c" stroke="#446e0c" strokeWidth="1.5" />
            )}
            {scrubberPt && (
              <>
                <line x1={scrubberPt[0]} y1={0} x2={scrubberPt[0]} y2={CHART_H} stroke="rgba(28,28,26,0.2)" strokeWidth="1.5" strokeDasharray="3,3" />
                <circle cx={scrubberPt[0]} cy={scrubberPt[1]} r={5} fill={lineColor} />
                <circle cx={scrubberPt[0]} cy={scrubberPt[1]} r={3} fill="#ffffff" />
              </>
            )}
          </svg>

          {/* Eje X */}
          <div className="flex justify-between px-1 mt-0.5">
            {PERIOD_X_LABELS[period].map((label) => (
              <span key={label} className="text-[9px]" style={{ color: "rgba(28,28,26,0.30)" }}>{label}</span>
            ))}
          </div>

          {/* Period tabs */}
          <div className="flex gap-0.5 mt-1.5">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => { setPeriod(p); setScrubIdx(null) }}
                className="flex-1 py-1.5 rounded-xl text-center active:scale-95 transition-all"
                style={{ background: period === p ? "#1c1c1a" : "transparent" }}
              >
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: period === p ? "#ddf74c" : "rgba(28,28,26,0.4)" }}
                >
                  {p}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Content Tabs ─────────────────────────────────────── */}
        <div
          className="flex mt-3 border-b"
          style={{ borderColor: "rgba(28,28,26,0.08)" }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-2.5 relative active:opacity-60 transition-opacity"
              >
                <Icon
                  className="w-3.5 h-3.5"
                  style={{ color: isActive ? "#1c1c1a" : "rgba(28,28,26,0.35)" }}
                />
                <span
                  className="text-[13px] font-semibold"
                  style={{ color: isActive ? "#1c1c1a" : "rgba(28,28,26,0.4)" }}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "#1c1c1a" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Scrollable Tab Content ───────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 pb-2">
        <AnimatePresence mode="wait" initial={false}>

          {/* ── Posición tab ─────────────────────────────────── */}
          {activeTab === "posicion" && holding && currentVal !== null && pnl !== null && (
            <motion.div
              key="posicion"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {/* P&L highlight */}
              <div
                className="p-4 rounded-2xl mb-3"
                style={{ background: "#e5e4e1" }}
              >
                <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: "1px solid rgba(28,28,26,0.08)" }}>
                  <div>
                    <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.45)" }}>Ganancia / Pérdida</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {pnl.amount >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" style={{ color: "#446e0c" }} />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" style={{ color: "#E63946" }} />
                      )}
                      <span
                        className="text-[18px] font-bold"
                        style={{ color: pnl.amount >= 0 ? "#446e0c" : "#E63946" }}
                      >
                        {pnl.amount >= 0 ? "+" : ""}${Math.abs(pnl.amount).toFixed(2)}
                      </span>
                      <span
                        className="text-[13px] font-medium"
                        style={{ color: pnl.amount >= 0 ? "#446e0c" : "#E63946" }}
                      >
                        ({pnl.pct >= 0 ? "+" : ""}{pnl.pct.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  {[
                    { label: "Cantidad",       value: `${holding.quantity} acc.` },
                    { label: "Precio compra",  value: `$${holding.avgPrice.toFixed(2)}` },
                    { label: "Precio actual",  value: `$${stock.price.toFixed(2)}` },
                    { label: "Total invertido",value: `$${holding.totalInvested.toFixed(2)}` },
                    { label: "Valor actual",   value: `$${currentVal.toFixed(2)}` },
                    { label: "En pesos",       value: `$${(currentVal * ARS_RATE).toLocaleString("es-AR", { maximumFractionDigits: 0 })}` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[11px]" style={{ color: "rgba(28,28,26,0.4)" }}>{label}</p>
                      <p className="text-[13px] font-semibold mt-0.5" style={{ color: "#1c1c1a" }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <p className="text-[12px] font-semibold mb-2 uppercase tracking-wide" style={{ color: "rgba(28,28,26,0.35)" }}>
                Actividad reciente
              </p>
              <div className="flex flex-col gap-1.5">
                {[
                  { type: "buy", label: "Compra", qty: `${parseFloat((holding.quantity * 0.6).toFixed(4))} ${stock.symbol}`, price: `$${(holding.avgPrice * 0.98).toFixed(2)}`, date: "18 ene" },
                  { type: "buy", label: "Compra", qty: `${parseFloat((holding.quantity * 0.4).toFixed(4))} ${stock.symbol}`, price: `$${(holding.avgPrice * 1.02).toFixed(2)}`, date: "3 feb" },
                  { type: "dividend", label: "Dividendo", qty: `+$${(stock.price * 0.005).toFixed(2)}`, price: "Acreditado", date: "15 feb" },
                ].map((act, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-2xl"
                    style={{ background: "rgba(28,28,26,0.04)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: act.type === "buy" ? "rgba(68,110,12,0.12)" : "rgba(221,247,76,0.3)",
                      }}
                    >
                      {act.type === "buy" ? (
                        <ShoppingCart className="w-3.5 h-3.5" style={{ color: "#446e0c" }} />
                      ) : (
                        <DollarSign className="w-3.5 h-3.5" style={{ color: "#446e0c" }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold" style={{ color: "#1c1c1a" }}>{act.label}</p>
                      <p className="text-[11px]" style={{ color: "rgba(28,28,26,0.4)" }}>{act.qty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold" style={{ color: "#1c1c1a" }}>{act.price}</p>
                      <p className="text-[11px]" style={{ color: "rgba(28,28,26,0.4)" }}>{act.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Resumen tab ──────────────────────────────────── */}
          {activeTab === "resumen" && (
            <motion.div
              key="resumen"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-[12px] font-semibold mb-3 uppercase tracking-wide" style={{ color: "rgba(28,28,26,0.35)" }}>
                Datos de mercado
              </p>
              <div
                className="p-4 rounded-2xl mb-3"
                style={{ background: "#e5e4e1" }}
              >
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  {[
                    { label: "Precio actual",    value: `$${stock.price.toFixed(2)}` },
                    { label: "Variación 24h",    value: `${stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)}%`, color: stock.change >= 0 ? "#446e0c" : "#E63946" },
                    { label: "Máx. 52 semanas",  value: `$${hi52}` },
                    { label: "Mín. 52 semanas",  value: `$${lo52}` },
                    { label: "Market cap",       value: marketCap },
                    { label: "P/E ratio",        value: (stock.price / (stock.price * 0.062)).toFixed(1) },
                    { label: "Div. yield",       value: stock.type === "etf" ? "1.8%" : "0.5%" },
                    { label: "Volumen",          value: `${(12.4 + stock.price * 0.01).toFixed(1)}M` },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <p className="text-[11px]" style={{ color: "rgba(28,28,26,0.4)" }}>{label}</p>
                      <p
                        className="text-[13px] font-semibold mt-0.5"
                        style={{ color: color ?? "#1c1c1a" }}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sector tag + about */}
              <div
                className="p-4 rounded-2xl"
                style={{ background: "rgba(28,28,26,0.04)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(28,28,26,0.08)", color: "rgba(28,28,26,0.6)" }}
                  >
                    {stock.sector}
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(28,28,26,0.08)", color: "rgba(28,28,26,0.6)" }}
                  >
                    {stock.type === "etf" ? "ETF" : "Acción"}
                  </span>
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: "rgba(28,28,26,0.5)" }}>
                  {stock.type === "etf"
                    ? `${stock.name} es un fondo cotizado que ofrece exposición diversificada al sector ${stock.sector.toLowerCase()}, con liquidez diaria y bajos costos de gestión.`
                    : `${stock.name} (${stock.symbol}) es una empresa líder en el sector ${stock.sector.toLowerCase()}, cotiza en los principales mercados internacionales.`
                  }
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Noticias tab ─────────────────────────────────── */}
          {activeTab === "noticias" && (
            <motion.div
              key="noticias"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-[12px] font-semibold mb-3 uppercase tracking-wide" style={{ color: "rgba(28,28,26,0.35)" }}>
                Últimas noticias
              </p>
              <div className="flex flex-col gap-2">
                {MOCK_NEWS.map((news, i) => (
                  <motion.div
                    key={news.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i }}
                    className="p-4 rounded-2xl active:opacity-60 transition-opacity cursor-pointer"
                    style={{ background: "#e5e4e1" }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(28,28,26,0.08)", color: "rgba(28,28,26,0.5)" }}
                      >
                        {news.tag}
                      </span>
                      <span className="text-[11px]" style={{ color: "rgba(28,28,26,0.35)" }}>
                        {news.source} · {news.time}
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold leading-snug" style={{ color: "#1c1c1a" }}>
                      {news.title}
                    </p>
                  </motion.div>
                ))}

                <p
                  className="text-center text-[12px] py-3"
                  style={{ color: "rgba(28,28,26,0.3)" }}
                >
                  Noticias proporcionadas con fines informativos
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Fixed Bottom CTAs — estilo main card del inicio ─── */}
      <div
        className="px-5 pt-3 pb-5 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(28,28,26,0.06)" }}
      >
        <div className="flex gap-3">
          <button
            onClick={() => onOpenBuy(stock.id)}
            className="flex-1 py-3.5 rounded-full active:scale-95 transition-transform"
            style={{ background: "#2b2a28" }}
          >
            <span className="text-[15px] font-semibold" style={{ color: "#f5f4f1" }}>Comprar</span>
          </button>
          {holding && (
            <button
              onClick={() => onOpenSell(stock.id)}
              className="flex-1 py-3.5 rounded-full active:scale-95 transition-transform"
              style={{ background: "#d9d9d9" }}
            >
              <span className="text-[15px] font-semibold" style={{ color: "#1c1c1a" }}>Vender</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
