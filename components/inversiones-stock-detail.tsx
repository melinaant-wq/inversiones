"use client"

import { useState, useMemo, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ShoppingCart,
  DollarSign,
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

const PERIODS = ["1D", "MTD", "3M", "YTD"] as const
type Period = typeof PERIODS[number]
type Tab = "mercado" | "posicion"
type SubTab = "descripcion" | "noticias" | "valoracion"

const CHART_W = 280
const CHART_H = 110

const MOCK_NEWS = [
  {
    id: 1,
    title: "Wall Street cierra en máximos históricos impulsado por resultados de tecnológicas",
    source: "Bloomberg",
    time: "Hace 2h",
    sentiment: "positive",
  },
  {
    id: 2,
    title: "La Fed mantiene tasas estables y señala posibles recortes para el segundo semestre",
    source: "Reuters",
    time: "Hace 5h",
    sentiment: "neutral",
  },
  {
    id: 3,
    title: "Inversores institucionales aumentan exposición a acciones de inteligencia artificial",
    source: "Financial Times",
    time: "Hace 8h",
    sentiment: "positive",
  },
]

// ── Sentiment dot for news ────────────────────────────────────
function SentimentDot({ sentiment }: { sentiment: string }) {
  const color = sentiment === "positive" ? "#446e0c" : sentiment === "negative" ? "#E63946" : "#f59e0b"
  return <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: color }} />
}

// ── Stat card for grids ───────────────────────────────────────
function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="p-3.5 rounded-2xl" style={{ background: "rgba(255,255,255,0.6)" }}>
      <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "rgba(28,28,26,0.35)" }}>
        {label}
      </p>
      <p className="text-[15px] font-semibold mt-1" style={{ color: accent ?? "#1c1c1a" }}>
        {value}
      </p>
    </div>
  )
}

// ── 52-week range bar ─────────────────────────────────────────
function Range52({ low, high, current }: { low: number; high: number; current: number }) {
  const pct = Math.max(0, Math.min(100, ((current - low) / (high - low)) * 100))
  return (
    <div>
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(28,28,26,0.08)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#446e0c" }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px]" style={{ color: "rgba(28,28,26,0.4)" }}>${low.toFixed(2)}</span>
        <span className="text-[10px]" style={{ color: "rgba(28,28,26,0.4)" }}>${high.toFixed(2)}</span>
      </div>
    </div>
  )
}

// ── Stock Avatar: clearbit → Google favicon → initials ────────
function StockAvatar({ stock }: { stock: NonNullable<ReturnType<typeof getStockById>> }) {
  const [imgState, setImgState] = useState<"primary" | "fallback" | "error">("primary")
  const domain = stock.logo?.replace("https://logo.clearbit.com/", "")
  const fallbackSrc = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null
  const showInitials = imgState === "error" || (!stock.logo && !fallbackSrc)
  const src = imgState === "fallback" && fallbackSrc ? fallbackSrc : stock.logo
  return (
    <div
      className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
      style={{ background: showInitials ? stock.color : "#ffffff", border: `1.5px solid ${stock.color}30` }}
    >
      {!showInitials && src ? (
        <img src={src} alt={stock.symbol} className="w-5 h-5 object-contain"
          onError={() => setImgState(s => s === "primary" ? "fallback" : "error")} />
      ) : (
        <span className="text-[9px] font-bold" style={{ color: "#ffffff" }}>{stock.symbol.slice(0, 2)}</span>
      )}
    </div>
  )
}

export default function InversionesStockDetail({ stockId, onClose, onOpenBuy, onOpenSell }: Props) {
  const stock = getStockById(stockId)
  const holding = getHolding(stockId)

  const [period, setPeriod] = useState<Period>("1D")
  const [scrubIdx, setScrubIdx] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>(() => (holding ? "posicion" : "mercado"))
  const [subTab, setSubTab] = useState<SubTab>("descripcion")
  const svgRef = useRef<SVGSVGElement>(null)

  const prices = useMemo(
    () => generatePrices(stockId, period, stock?.price ?? 100),
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

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const idx = Math.round((x / CHART_W) * (prices.length - 1))
    setScrubIdx(Math.max(0, Math.min(prices.length - 1, idx)))
  }, [prices.length])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const x = e.clientX - rect.left
    const idx = Math.round((x / CHART_W) * (prices.length - 1))
    setScrubIdx(Math.max(0, Math.min(prices.length - 1, idx)))
  }, [prices.length])

  if (!stock) return null

  const currentVal = holding ? calcCurrentValue(holding, stock) : null
  const pnl = holding ? calcPnL(holding, stock) : null
  const totalChangeAmt = prices[prices.length - 1] - prices[0]
  const totalChangePct = (totalChangeAmt / prices[0]) * 100

  // Market stats
  const hi52 = stock.price * 1.38
  const lo52 = stock.price * 0.71
  const marketCap = stock.price > 400
    ? `$${(stock.price * 2.4).toFixed(0)}B`
    : `$${(stock.price * 8.1).toFixed(0)}B`
  const pe = (1 / 0.062).toFixed(1)
  const eps = `$${(stock.price * 0.062).toFixed(2)}`
  const divYield = stock.type === "etf" ? "1.8%" : "0.5%"

  // Operations mock data (only used when holding exists)
  const operations = holding ? [
    {
      type: "buy",
      desc: `Compra ${parseFloat((holding.quantity * 0.6).toFixed(4))} ${stock.symbol}`,
      date: "18 ene",
      amount: `$${(holding.avgPrice * 0.98).toFixed(2)}`,
    },
    {
      type: "buy",
      desc: `Compra ${parseFloat((holding.quantity * 0.4).toFixed(4))} ${stock.symbol}`,
      date: "3 feb",
      amount: `$${(holding.avgPrice * 1.02).toFixed(2)}`,
    },
    {
      type: "dividend",
      desc: "Dividendo acreditado",
      date: "15 feb",
      amount: `+$${(stock.price * 0.005).toFixed(2)}`,
    },
  ] : []

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Fixed Header: Stock info + Pill toggle ────────────── */}
      <div className="px-5 pt-2 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform flex-shrink-0"
            style={{ background: "rgba(28,28,26,0.06)" }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
          </button>
          <StockAvatar stock={stock} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[15px] font-semibold truncate" style={{ color: "#1c1c1a" }}>
                {stock.name}
              </p>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0"
                style={{ background: "rgba(28,28,26,0.07)", color: "rgba(28,28,26,0.5)" }}
              >
                {stock.symbol}
              </span>
            </div>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(28,28,26,0.4)" }}>
              {stock.symbol} · {stock.type === "etf" ? "ETF" : "NASDAQ"}
            </p>
          </div>
        </div>

        {/* Pill toggle: Mercado | Mi posición */}
        <div className="flex justify-center">
          <div className="inline-flex p-0.5 rounded-full" style={{ background: "rgba(28,28,26,0.06)" }}>
            {(["mercado", "posicion"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className="py-1 px-5 rounded-full transition-all active:scale-95"
                style={{
                  background: activeTab === t ? "#1c1c1a" : "transparent",
                  boxShadow: activeTab === t ? "0 1px 4px rgba(0,0,0,0.18)" : "none",
                }}
              >
                <span
                  className="text-[12px] font-semibold"
                  style={{ color: activeTab === t ? "#f5f4f1" : "rgba(28,28,26,0.4)" }}
                >
                  {t === "mercado" ? "Mercado" : "Mi posición"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Scrollable Tab Content ───────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-3 pb-2">
        <AnimatePresence mode="wait" initial={false}>

          {/* ── MERCADO TAB ──────────────────────────────────── */}
          {activeTab === "mercado" && (
            <motion.div
              key="mercado"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {/* Price header */}
              <div className="mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(28,28,26,0.35)" }}>
                  Valor de la unidad
                </p>
                <span className="text-[36px] font-bold tracking-tight leading-none" style={{ color: "#1c1c1a" }}>
                  ${scrubberPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="text-[13px] font-semibold px-2.5 py-1 rounded-lg"
                    style={{
                      background: isUp ? "rgba(68,110,12,0.10)" : "rgba(230,57,70,0.10)",
                      color: isUp ? "#446e0c" : "#E63946",
                    }}
                  >
                    {totalChangePct >= 0 ? "+" : ""}{totalChangePct.toFixed(2)}%
                  </span>
                  <span className="text-[13px] font-medium" style={{ color: "rgba(28,28,26,0.4)" }}>
                    {period}
                  </span>
                </div>

                {/* Period selector */}
                <div className="flex gap-0.5 mt-3">
                  {PERIODS.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPeriod(p); setScrubIdx(null) }}
                      className="flex-1 py-1.5 rounded-xl text-center active:scale-95 transition-all"
                      style={{ background: period === p ? "rgba(28,28,26,0.09)" : "transparent" }}
                    >
                      <span className="text-[11px] font-semibold" style={{ color: period === p ? "#1c1c1a" : "rgba(28,28,26,0.40)" }}>
                        {p}
                      </span>
                    </button>
                  ))}
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

                {/* Chart legend */}
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
              </div>

              {/* Sub-tabs: Descripción | Noticias | Valoración */}
              <div className="flex mt-4 mb-1" style={{ borderBottom: "1px solid rgba(28,28,26,0.08)" }}>
                {(["descripcion", "noticias", "valoracion"] as SubTab[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSubTab(st)}
                    className="flex-1 pb-2.5 text-center transition-all active:opacity-60 relative"
                    style={{ background: "transparent" }}
                  >
                    <span
                      className="text-[13px] font-semibold"
                      style={{ color: subTab === st ? "#1c1c1a" : "rgba(28,28,26,0.35)" }}
                    >
                      {st === "descripcion" ? "Descripción" : st === "noticias" ? "Noticias" : "Valoración"}
                    </span>
                    {subTab === st && (
                      <motion.span
                        layoutId="sub-tab-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                        style={{ background: "#1c1c1a" }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Sub-tab content */}
              <AnimatePresence mode="wait" initial={false}>
                {subTab === "descripcion" && (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="pt-3 pb-6"
                  >
                    <p className="text-[13px] leading-relaxed mb-4" style={{ color: "rgba(28,28,26,0.6)" }}>
                      {stock.type === "etf"
                        ? `${stock.name} es un fondo cotizado que ofrece exposición diversificada al sector ${stock.sector.toLowerCase()}, con liquidez diaria y bajos costos de gestión. Está diseñado para inversores que buscan retornos de mercado con diversificación automática, sin necesidad de seleccionar acciones individuales ni gestionar una cartera activamente.`
                        : `${stock.name} (${stock.symbol}) es una empresa líder en el sector ${stock.sector.toLowerCase()}, con presencia global y un historial sólido de crecimiento. Cotiza en los principales mercados internacionales y se posiciona como referencia de su industria, con una estrategia enfocada en innovación y retorno de valor al accionista.`}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[stock.sector, stock.type === "etf" ? "ETF" : "Acción", "S&P 500", "NASDAQ 100"].map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2.5 py-1 rounded-lg font-medium"
                          style={{ background: "rgba(28,28,26,0.06)", color: "rgba(28,28,26,0.5)" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {subTab === "noticias" && (
                  <motion.div
                    key="news"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="pt-3 pb-6"
                  >
                    <div className="flex flex-col">
                      {MOCK_NEWS.map((news, i) => (
                        <div
                          key={news.id}
                          className="flex items-start gap-3 py-3"
                          style={{ borderBottom: i < MOCK_NEWS.length - 1 ? "1px solid rgba(28,28,26,0.06)" : "none" }}
                        >
                          <SentimentDot sentiment={news.sentiment} />
                          <div className="flex-1">
                            <p className="text-[13px] leading-snug" style={{ color: "#1c1c1a" }}>{news.title}</p>
                            <p className="text-[11px] mt-1" style={{ color: "rgba(28,28,26,0.35)" }}>
                              {news.source} · {news.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {subTab === "valoracion" && (
                  <motion.div
                    key="val"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18 }}
                    className="pt-3 pb-6"
                  >
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <StatCard label="Market Cap" value={marketCap} />
                      <StatCard label="P/E" value={pe} accent="rgba(124,58,237,0.9)" />
                      <StatCard label="EPS" value={eps} accent="#446e0c" />
                      <StatCard label="Div. Yield" value={divYield} />
                    </div>
                    <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.6)" }}>
                      <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(28,28,26,0.35)" }}>
                        Rango 52 semanas
                      </p>
                      <Range52 low={lo52} high={hi52} current={stock.price} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── POSICIÓN TAB — con holding ───────────────────── */}
          {activeTab === "posicion" && holding && currentVal !== null && pnl !== null && (
            <motion.div
              key="posicion"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {/* Valor actual */}
              <div className="mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(28,28,26,0.35)" }}>
                  Valor actual
                </p>
                <p className="text-[36px] font-bold tracking-tight leading-none mb-2.5" style={{ color: "#1c1c1a" }}>
                  ${currentVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[13px] font-semibold px-2.5 py-1 rounded-lg"
                    style={{
                      background: pnl.amount >= 0 ? "rgba(68,110,12,0.10)" : "rgba(230,57,70,0.10)",
                      color: pnl.amount >= 0 ? "#446e0c" : "#E63946",
                    }}
                  >
                    {pnl.amount >= 0 ? "+" : ""}${Math.abs(pnl.amount).toFixed(2)}
                  </span>
                  <span className="text-[13px] font-medium" style={{ color: pnl.amount >= 0 ? "#446e0c" : "#E63946" }}>
                    {pnl.pct >= 0 ? "+" : ""}{pnl.pct.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <StatCard label="Unidades" value={`${holding.quantity}`} />
                <StatCard label="Total portfolio" value={`$${holding.totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
                <StatCard label="Precio de compra" value={`$${holding.avgPrice.toFixed(2)}`} />
                <StatCard label="Precio actual" value={`$${stock.price.toFixed(2)}`} accent="#446e0c" />
              </div>

              {/* Historial de operaciones */}
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-3 mt-2" style={{ color: "rgba(28,28,26,0.35)" }}>
                Historial de operaciones
              </p>
              <div className="flex flex-col gap-2 pb-6">
                {operations.map((op, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                    className="flex items-center gap-3 p-3.5 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.6)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: op.type === "buy" ? "rgba(68,110,12,0.12)" : "rgba(221,247,76,0.3)" }}
                    >
                      {op.type === "buy"
                        ? <ShoppingCart className="w-3.5 h-3.5" style={{ color: "#446e0c" }} />
                        : <DollarSign className="w-3.5 h-3.5" style={{ color: "#446e0c" }} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.5)" }}>{op.desc}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "rgba(28,28,26,0.35)" }}>{op.date}</p>
                    </div>
                    <p className="text-[13px] font-semibold flex-shrink-0" style={{ color: "#1c1c1a" }}>
                      {op.amount}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── POSICIÓN TAB — sin holding ───────────────────── */}
          {activeTab === "posicion" && !holding && (
            <motion.div
              key="sin-pos"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <p className="text-[15px] font-semibold mb-1" style={{ color: "#1c1c1a" }}>Sin posición</p>
              <p className="text-[13px]" style={{ color: "rgba(28,28,26,0.4)" }}>
                Comprá tu primera acción de {stock.name}
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Fixed Bottom CTAs ─────────────────────────────────── */}
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
