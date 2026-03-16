"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  List,
  PieChart,
  ChevronRight,
  ChevronDown,
  Trophy,
  X,
} from "lucide-react"
import {
  PORTFOLIO,
  getStockById,
  calcCurrentValue,
  calcPnL,
  TOTAL_PORTFOLIO_USD,
  TOTAL_PNL,
  TOTAL_PNL_PCT,
} from "./inversiones-flow"
import type { Stock } from "./inversiones-flow"

type GroupBy = "Todos" | "Sectores" | "Tipo" | "Dividendos"

interface Props {
  onClose: () => void
  onOpenMercado: (ctx: "buy" | "search") => void
  onOpenSell: () => void
  onOpenStockDetail: (id: string) => void
  onOpenResultados?: () => void
  investorProfile?: string | null
  emptyPortfolio?: boolean
}

// ── Stock Avatar: clearbit → Google favicon → initials ───────
function StockAvatar({ stock }: { stock: Stock }) {
  const [imgState, setImgState] = useState<"primary" | "fallback" | "error">("primary")
  const domain = stock.logo?.replace("https://logo.clearbit.com/", "")
  const fallbackSrc = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null
  const showInitials = imgState === "error" || (!stock.logo && !fallbackSrc)
  const src = imgState === "fallback" && fallbackSrc ? fallbackSrc : stock.logo
  return (
    <div
      className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center"
      style={{
        background: showInitials ? stock.color : "#ffffff",
        border: `1.5px solid ${stock.color}30`,
      }}
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

// ── Donut arc helper ─────────────────────────────────────────
function donutArc(
  cx: number, cy: number,
  outerR: number, innerR: number,
  startDeg: number, endDeg: number,
  gapDeg = 2.5
): string {
  const toRad = (d: number) => (d - 90) * (Math.PI / 180)
  const s = toRad(startDeg + gapDeg / 2)
  const e = toRad(endDeg - gapDeg / 2)
  const large = endDeg - startDeg - gapDeg > 180 ? 1 : 0
  const c = Math.cos, si = Math.sin
  return [
    `M ${(cx + outerR * c(s)).toFixed(3)} ${(cy + outerR * si(s)).toFixed(3)}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${(cx + outerR * c(e)).toFixed(3)} ${(cy + outerR * si(e)).toFixed(3)}`,
    `L ${(cx + innerR * c(e)).toFixed(3)} ${(cy + innerR * si(e)).toFixed(3)}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${(cx + innerR * c(s)).toFixed(3)} ${(cy + innerR * si(s)).toFixed(3)}`,
    "Z",
  ].join(" ")
}

// ── Evolution chart ──────────────────────────────────────────
const CHART_POINTS: [number, number][] = [
  [0, 84], [8, 74], [15, 78], [22, 60], [30, 70], [37, 46],
  [44, 56], [50, 37], [56, 49], [63, 27], [70, 39], [77, 19],
  [84, 29], [90, 14], [95, 21], [100, 5],
]

function buildLinePath(points: [number, number][]): string {
  if (points.length < 2) return ""
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]
    const [x1, y1] = points[i]
    const cpX = (x0 + x1) / 2
    d += ` C ${cpX} ${y0}, ${cpX} ${y1}, ${x1} ${y1}`
  }
  return d
}

function buildAreaPath(points: [number, number][]): string {
  const line = buildLinePath(points)
  const last = points[points.length - 1]
  const first = points[0]
  return `${line} L ${last[0]} 100 L ${first[0]} 100 Z`
}

function buildGainAreaPath(points: [number, number][], refY: number): string {
  const line = buildLinePath(points)
  if (!line) return ""
  const last = points[points.length - 1]
  const first = points[0]
  return `${line} L ${last[0]} ${refY} L ${first[0]} ${refY} Z`
}

const INV_REF_Y = CHART_POINTS[0][1] // Starting balance Y (= 84 in this dataset)

// ── Period P&L Data — ordered Histórico → Hoy ────────────────
const PERIODS_PNL = ["Histórico", "Año", "Mes", "Semana", "Hoy"] as const
type PeriodPnL = typeof PERIODS_PNL[number]

const PERIOD_LABELS: Record<PeriodPnL, string> = {
  "Histórico": "rendimiento total",
  "Año":       "este año",
  "Mes":       "este mes",
  "Semana":    "esta semana",
  "Hoy":       "hoy",
}

export default function InversionesHome({ onClose, onOpenMercado, onOpenSell, onOpenStockDetail, onOpenResultados, investorProfile, emptyPortfolio = false }: Props) {
  const [viewMode, setViewMode] = useState<"list" | "chart">("list")
  const [periodPnL, setPeriodPnL] = useState<PeriodPnL>("Hoy")
  const [scrubX, setScrubX] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [groupBy, setGroupBy] = useState<GroupBy>("Todos")
  const [showGroupSheet, setShowGroupSheet] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const PERIOD_PNL_DATA: Record<PeriodPnL, { amount: number; pct: number }> = {
    "Histórico": { amount: TOTAL_PNL,  pct: TOTAL_PNL_PCT },
    "Año":       { amount: 272.40,     pct: 11.68 },
    "Mes":       { amount: 138.60,     pct:  5.91 },
    "Semana":    { amount:  41.30,     pct:  1.74 },
    "Hoy":       { amount:  14.80,     pct:  0.62 },
  }

  const periodData = PERIOD_PNL_DATA[periodPnL]
  const isUp = periodData.amount >= 0

  // Build allocation data sorted by value descending
  const allocationData = (PORTFOLIO.map((h) => {
    const stock = getStockById(h.stockId)
    if (!stock) return null
    const val = calcCurrentValue(h, stock)
    const pct = (val / TOTAL_PORTFOLIO_USD) * 100
    return { stock, holding: h, val, pct }
  }).filter(Boolean) as Array<{
    stock: NonNullable<ReturnType<typeof getStockById>>
    holding: (typeof PORTFOLIO)[0]
    val: number
    pct: number
  }>).sort((a, b) => b.val - a.val)

  // Filtered by search query
  const filteredData = searchQuery.trim()
    ? allocationData.filter((d) =>
        d.stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allocationData

  // Donut segments (used in chart/donut view)
  const CX = 110, CY = 110, OUTER_R = 92, INNER_R = 60
  let cumDeg = 0
  const segments = allocationData.map((d) => {
    const startDeg = cumDeg
    const spanDeg = (d.pct / 100) * 360
    cumDeg += spanDeg
    return { ...d, path: donutArc(CX, CY, OUTER_R, INNER_R, startDeg, startDeg + spanDeg) }
  })

  // Chart scrub
  const getYatX = useCallback((x: number) => {
    for (let i = 1; i < CHART_POINTS.length; i++) {
      const [x0, y0] = CHART_POINTS[i - 1]
      const [x1, y1] = CHART_POINTS[i]
      if (x <= x1) {
        const t = (x - x0) / (x1 - x0)
        return y0 + t * (y1 - y0)
      }
    }
    return CHART_POINTS[CHART_POINTS.length - 1][1]
  }, [])

  const handleChartTouch = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault()
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const touchX = e.touches[0].clientX - rect.left
    const pct = Math.max(0, Math.min(100, (touchX / rect.width) * 100))
    setScrubX(pct)
  }, [])

  const linePath = buildLinePath(CHART_POINTS)
  const areaPath = buildAreaPath(CHART_POINTS)
  const gainAreaPath = buildGainAreaPath(CHART_POINTS, INV_REF_Y)

  // ── Empty portfolio state ─────────────────────────────────
  if (emptyPortfolio) {
    const profileLabel =
      investorProfile === "conservador"
        ? "Conservador"
        : investorProfile === "dinamico"
        ? "Dinámico"
        : "Moderado"

    return (
      <div className="relative flex flex-col h-full overflow-hidden" style={{ background: "#f5f4f1" }}>
        {/* Header */}
        <div className="px-5 pt-2 pb-0 flex-shrink-0">
          <div className="flex items-center mb-4">
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full"
              style={{ background: "rgba(28,28,26,0.06)" }}
            >
              <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
            </button>
            <h1 className="text-[16px] font-semibold ml-3" style={{ color: "#1c1c1a" }}>
              Inversiones
            </h1>
          </div>
        </div>

        {/* Balance 0 */}
        <div className="px-6 pt-2 pb-4">
          <p className="text-[13px] font-medium mb-1" style={{ color: "rgba(28,28,26,0.45)" }}>Total</p>
          <div className="flex items-baseline gap-2">
            <span className="text-[44px] font-bold leading-none" style={{ color: "#1c1c1a" }}>0,00</span>
            <span className="text-[18px] font-medium" style={{ color: "rgba(28,28,26,0.4)" }}>USD</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[14px] font-medium" style={{ color: "#22c55e" }}>+0,00 USD</span>
            <span className="text-[14px]" style={{ color: "#22c55e" }}>▲ 0.00%</span>
            <span className="text-[14px]" style={{ color: "rgba(28,28,26,0.4)" }}>Hoy</span>
          </div>

          {/* Period tabs */}
          <div className="flex gap-2 mt-4">
            {["Histórico", "1a", "1m", "1s", "1d"].map((p, i) => (
              <button
                key={p}
                className="px-3 py-1 rounded-full text-[13px] font-medium"
                style={{
                  background: i === 4 ? "#1c1c1a" : "rgba(28,28,26,0.07)",
                  color: i === 4 ? "white" : "rgba(28,28,26,0.55)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-6 h-px" style={{ background: "rgba(28,28,26,0.08)" }} />

        {/* Step tracker */}
        <div className="px-6 pt-6 flex flex-col gap-0">
          {/* Step 1 — Done */}
          <div className="flex gap-4 items-start">
            <div className="flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#22c55e" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="w-px flex-1 mt-1 mb-1" style={{ minHeight: 32, background: "rgba(28,28,26,0.12)" }} />
            </div>
            <div className="pb-5">
              <p className="text-[15px] font-semibold" style={{ color: "rgba(28,28,26,0.4)" }}>Perfil completado</p>
              <p className="text-[13px] mt-0.5" style={{ color: "rgba(28,28,26,0.35)" }}>
                Perfil {profileLabel} · Cuenta habilitada
              </p>
            </div>
          </div>

          {/* Step 2 — Pending */}
          <div className="flex gap-4 items-start">
            <div className="flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[15px]"
                style={{ background: "#1c1c1a" }}
              >
                2
              </div>
            </div>
            <div>
              <p className="text-[15px] font-bold" style={{ color: "#1c1c1a" }}>Comprá desde $100</p>
              <p className="text-[13px] mt-1 leading-snug" style={{ color: "rgba(28,28,26,0.5)" }}>
                Elegí acciones o un pack recomendado para tu perfil.
              </p>
              <button
                onClick={() => onOpenMercado("buy")}
                className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold"
                style={{ background: "rgba(28,28,26,0.07)", color: "#1c1c1a" }}
              >
                Ir al mercado
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Buy CTA */}
        <div className="flex-1" />
        <div className="px-6 pb-8">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenMercado("buy")}
            className="w-full h-[52px] rounded-2xl font-semibold text-[16px]"
            style={{ background: "#1c1c1a", color: "white" }}
          >
            Comprar
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col h-full overflow-hidden">

      {/* ── Nav Header — always visible ─────────────────────── */}
      <div className="px-5 pt-2 pb-0 flex-shrink-0">
        <div className="flex items-center mb-4">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform flex-shrink-0"
            style={{ background: "rgba(28,28,26,0.06)" }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
          </button>

          <h1 className="text-[16px] font-semibold ml-3" style={{ color: "#1c1c1a" }}>
            Inversiones
          </h1>

          <div className="ml-auto flex items-center gap-1.5">
            {/* View toggle — icon style matching Actividad */}
            <div
              className="flex items-center gap-0.5 p-1 rounded-full"
              style={{ background: "rgba(28,28,26,0.06)" }}
            >
              <button
                onClick={() => setViewMode("list")}
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150"
                style={{
                  background: viewMode === "list" ? "rgba(28,28,26,0.12)" : "transparent",
                  color: viewMode === "list" ? "#1c1c1a" : "rgba(28,28,26,0.35)",
                }}
              >
                <List className="w-4 h-4" strokeWidth={2} />
              </button>
              <button
                onClick={() => setViewMode("chart")}
                className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150"
                style={{
                  background: viewMode === "chart" ? "rgba(28,28,26,0.12)" : "transparent",
                  color: viewMode === "chart" ? "#1c1c1a" : "rgba(28,28,26,0.35)",
                }}
              >
                <PieChart className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            {/* Search */}
            <button
              onClick={() => {
                setSearchOpen(true)
                setTimeout(() => searchInputRef.current?.focus(), 50)
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
              style={{ background: "rgba(28,28,26,0.06)" }}
            >
              <Search className="w-4 h-4" style={{ color: "#1c1c1a" }} />
            </button>
          </div>
        </div>

        {/* ── Inline search bar ───────────────────────────────── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2 mt-3"
            >
              <div
                className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-2xl"
                style={{ background: "rgba(28,28,26,0.07)" }}
              >
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery("") }}
                  className="flex-shrink-0 active:scale-90 transition-transform"
                >
                  <X className="w-4 h-4" style={{ color: "rgba(28,28,26,0.45)" }} />
                </button>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar activo..."
                  className="flex-1 bg-transparent text-[14px] outline-none"
                  style={{ color: "#1c1c1a" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Hero summary — list view only ───────────────────── */}
        {viewMode === "list" && !searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="pt-4 pb-2"
          >
            {/* Balance row + Trophy button */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-medium mb-0.5" style={{ color: "rgba(28,28,26,0.45)" }}>
                  Total dólares
                </p>
                <p
                  className="text-[38px] font-bold tracking-tight leading-none mb-2.5"
                  style={{ color: "#1c1c1a" }}
                >
                  ${TOTAL_PORTFOLIO_USD.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={periodPnL}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="text-[15px] font-semibold whitespace-nowrap"
                    style={{ color: isUp ? "#446e0c" : "#E63946" }}
                  >
                    {isUp ? "+" : "-"}{Math.abs(periodData.amount).toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{"  "}{isUp ? "▲" : "▼"} {Math.abs(periodData.pct).toFixed(2)}%
                  </motion.p>
                </AnimatePresence>
              </div>
              {/* Trophy — acceso a Historial de resultados */}
              <button
                onClick={onOpenResultados}
                className="w-10 h-10 flex items-center justify-center rounded-2xl flex-shrink-0 mt-1 active:scale-90 transition-transform"
                style={{ background: "rgba(28,28,26,0.06)" }}
              >
                <Trophy className="w-5 h-5" style={{ color: "rgba(28,28,26,0.45)" }} strokeWidth={1.8} />
              </button>
            </div>
            {/* Period selector */}
            <div className="flex gap-1 mt-3">
              {PERIODS_PNL.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodPnL(p)}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all active:scale-95"
                  style={{
                    background: periodPnL === p ? "rgba(28,28,26,0.12)" : "rgba(28,28,26,0.06)",
                    color: periodPnL === p ? "#1c1c1a" : "rgba(28,28,26,0.40)",
                    boxShadow: periodPnL === p ? "0 1px 4px rgba(28,28,26,0.08)" : "none",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
            {/* Agrupación dropdown trigger */}
            <button
              onClick={() => setShowGroupSheet(true)}
              className="flex items-center gap-1 mt-3 active:opacity-70 transition-opacity"
            >
              <span className="text-[13px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                Agrupación:
              </span>
              <span className="text-[13px] font-semibold" style={{ color: "#1c1c1a" }}>
                {groupBy}
              </span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" style={{ color: "#1c1c1a" }} strokeWidth={2.5} />
            </button>
          </motion.div>
        )}
      </div>

      {/* ── Content Area ────────────────────────────────────── */}
      <AnimatePresence mode="wait" initial={false}>

        {/* ── LIST VIEW ──────────────────────────────────────── */}
        {viewMode === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 min-h-0 overflow-y-auto px-5 mt-4"
            style={{ paddingBottom: "88px" }}
          >
            {/* ── Composition breadcrumb ─────────────────────── */}
            {!searchOpen && <div className="mb-5">
              {/* Segmented bar */}
              <div className="flex h-2.5 rounded-full overflow-hidden">
                {allocationData.map((d, i) => (
                  <motion.div
                    key={d.stock.id}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.08 + i * 0.07, duration: 0.4, ease: "easeOut" }}
                    style={{
                      width: `${d.pct}%`,
                      background: d.stock.color,
                      transformOrigin: "left",
                      marginRight: i < allocationData.length - 1 ? "2px" : 0,
                    }}
                  />
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 mt-2.5">
                {allocationData.map((d, i) => (
                  <motion.div
                    key={d.stock.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    className="flex items-center gap-1.5"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: d.stock.color }}
                    />
                    <span className="text-[11px] font-semibold" style={{ color: "#1c1c1a" }}>
                      {d.stock.symbol}
                    </span>
                    <span className="text-[11px]" style={{ color: "rgba(28,28,26,0.4)" }}>
                      {d.pct.toFixed(0)}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>}

            {/* Holdings list */}
            <div className="flex flex-col gap-1.5">
              {filteredData.map((item, i) => {
                const { stock, holding } = item
                const { amount: pnlAmt, pct: pnlPct } = calcPnL(holding, stock)
                const isPositive = pnlAmt >= 0

                return (
                  <motion.button
                    key={stock.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.05, duration: 0.22 }}
                    onClick={() => onOpenStockDetail(stock.id)}
                    className="w-full text-left p-4 rounded-2xl active:scale-[0.98] transition-transform"
                    style={{ background: "#FEFEFE" }}
                  >
                    <div className="flex items-center gap-3">
                      <StockAvatar stock={stock} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-[14px] font-semibold truncate" style={{ color: "#1c1c1a" }}>
                            {stock.name}
                          </p>
                          <p className="text-[15px] font-bold tabular-nums ml-2" style={{ color: "#1c1c1a" }}>
                            USD {item.val.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.4)" }}>
                            {holding.quantity} {holding.quantity === 1 ? "acción" : "acciones"}
                          </p>
                          <span
                            className="text-[12px] font-medium"
                            style={{ color: isPositive ? "#446e0c" : "#E63946" }}
                          >
                            {isPositive ? "+" : ""}{pnlPct.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ── CHART VIEW: balance + evolution chart ──────────── */}
        {viewMode === "chart" && (
          <motion.div
            key="chart"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 min-h-0 flex flex-col overflow-hidden"
          >
            {/* Balance display */}
            <div className="px-5 pt-3 pb-2 flex-shrink-0">
              <p
                className="font-bold leading-tight"
                style={{ color: "#1c1c1a", fontSize: "clamp(30px, 9vw, 40px)", fontVariantNumeric: "tabular-nums" }}
              >
                {scrubX !== null
                  ? `$${(TOTAL_PORTFOLIO_USD * 0.85 + (scrubX / 100) * TOTAL_PORTFOLIO_USD * 0.15).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : `$${TOTAL_PORTFOLIO_USD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                }
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={periodPnL}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="text-[14px] font-semibold mt-0.5"
                  style={{ color: isUp ? "#446e0c" : "#E63946" }}
                >
                  {isUp ? "+" : "-"}{Math.abs(periodData.amount).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{"  "}{isUp ? "▲" : "▼"} {Math.abs(periodData.pct).toFixed(2)}%
                </motion.p>
              </AnimatePresence>

            </div>

            {/* Evolution chart */}
            <div className="w-full flex-shrink-0 select-none" style={{ height: "160px" }}>
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                onTouchStart={handleChartTouch}
                onTouchMove={handleChartTouch}
                onTouchEnd={() => setScrubX(null)}
                style={{ cursor: "crosshair", touchAction: "none" }}
              >
                <defs>
                  <linearGradient id="inv-line-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="0">
                    <stop offset="0%"   stopColor="#446e0c" stopOpacity="0" />
                    <stop offset="30%"  stopColor="#446e0c" stopOpacity="0.45" />
                    <stop offset="65%"  stopColor="#446e0c" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ddf74c" stopOpacity="1" />
                  </linearGradient>
                </defs>
                {/* Gain area — fill between reference Y and the curve */}
                <path
                  d={gainAreaPath}
                  fill="rgba(68,110,12,0.07)"
                />

                {/* Reference line — starting balance of the period */}
                <line
                  x1="0" y1={INV_REF_Y} x2="100" y2={INV_REF_Y}
                  stroke="rgba(28,28,26,0.18)"
                  strokeWidth="1"
                  strokeDasharray="2,4"
                  vectorEffect="non-scaling-stroke"
                />

                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#inv-line-grad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                {scrubX !== null && (() => {
                  const y = getYatX(scrubX)
                  return (
                    <g>
                      <line
                        x1={scrubX} y1={0} x2={scrubX} y2={100}
                        stroke="rgba(28,28,26,0.15)"
                        strokeWidth="0.5"
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle
                        cx={scrubX} cy={y} r="2.2"
                        fill="#ddf74c"
                        vectorEffect="non-scaling-stroke"
                      />
                      <circle
                        cx={scrubX} cy={y} r="1.2"
                        fill="#1c1c1a"
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  )
                })()}
              </svg>
            </div>

            {/* Period selector — alpha pill style */}
            <div className="flex items-center justify-around px-4 py-2 flex-shrink-0">
              {PERIODS_PNL.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodPnL(p)}
                  className="text-[13px] px-3 py-1 rounded-full transition-all active:scale-90"
                  style={{
                    background: periodPnL === p ? "rgba(28,28,26,0.10)" : "transparent",
                    color: periodPnL === p ? "#1c1c1a" : "rgba(28,28,26,0.35)",
                    fontWeight: periodPnL === p ? 600 : 400,
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Allocation rows — scrollable */}
            <div
              className="flex-1 min-h-0 overflow-y-auto px-5"
              style={{ borderTop: "1px solid rgba(28,28,26,0.06)", paddingBottom: "88px" }}
            >
              {filteredData.map((d, i) => {
                const { amount: pnlAmt, pct: pnlPct } = calcPnL(d.holding, d.stock)
                const isPositive = pnlAmt >= 0
                return (
                  <motion.button
                    key={d.stock.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + 0.05 * i, duration: 0.22 }}
                    onClick={() => onOpenStockDetail(d.stock.id)}
                    className="w-full flex items-center gap-3 py-3.5 active:opacity-60 transition-opacity"
                    style={{
                      borderBottom: i < allocationData.length - 1 ? "1px solid rgba(28,28,26,0.06)" : "none",
                    }}
                  >
                    <StockAvatar stock={d.stock} />
                    <div className="flex-1 text-left">
                      <p className="text-[14px] font-semibold" style={{ color: "#1c1c1a" }}>
                        {d.stock.name}
                      </p>
                      <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.4)" }}>
                        USD {d.val.toFixed(2)}
                        {"  ·  "}
                        <span style={{ color: isPositive ? "#446e0c" : "#E63946" }}>
                          {isPositive ? "+" : ""}{pnlPct.toFixed(2)}%
                        </span>
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(28,28,26,0.2)" }} />
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Agrupación bottom sheet ───────────────────────────── */}
      <AnimatePresence>
        {showGroupSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-[60]"
              style={{ background: "rgba(28,28,26,0.3)" }}
              onClick={() => setShowGroupSheet(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="absolute bottom-0 left-0 right-0 z-[60] overflow-hidden"
              style={{ background: "#ffffff", borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-9 h-1 rounded-full" style={{ background: "rgba(28,28,26,0.15)" }} />
              </div>
              <p className="px-5 pt-3 pb-4 text-[20px] font-bold" style={{ color: "#1c1c1a" }}>
                Agrupación
              </p>
              {(["Todos", "Sectores", "Tipo", "Dividendos"] as GroupBy[]).map((opt, i, arr) => (
                <button
                  key={opt}
                  onClick={() => { setGroupBy(opt); setShowGroupSheet(false) }}
                  className="w-full flex items-center justify-between px-5 py-4 active:opacity-60 transition-opacity"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(28,28,26,0.06)" : "none" }}
                >
                  <span
                    className="text-[16px]"
                    style={{ color: "#1c1c1a", fontWeight: groupBy === opt ? 700 : 400 }}
                  >
                    {opt}
                  </span>
                  {groupBy === opt && (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#1c1c1a" }} />
                  )}
                </button>
              ))}
              <div style={{ height: "24px" }} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Fixed bottom actions ──────────────────────────────── */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-4"
        style={{ background: "linear-gradient(to top, #e5e4e1 65%, transparent)" }}
      >
        <div className="flex gap-2">
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            onClick={onOpenSell}
            className="flex-1 py-3.5 rounded-full active:scale-95 transition-transform"
            style={{ background: "rgba(28,28,26,0.10)" }}
          >
            <span className="text-[15px] font-semibold" style={{ color: "#1c1c1a" }}>
              Vender
            </span>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            onClick={() => onOpenMercado("buy")}
            className="flex-1 py-3.5 rounded-full active:scale-95 transition-transform"
            style={{ background: "#2b2a28" }}
          >
            <span className="text-[15px] font-semibold" style={{ color: "#f5f4f1" }}>
              Comprar
            </span>
          </motion.button>
        </div>
      </div>

    </div>
  )
}
