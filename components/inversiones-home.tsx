"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  LayoutList,
  TrendingUp,
  BarChart2,
} from "lucide-react"
import {
  PORTFOLIO,
  getStockById,
  calcCurrentValue,
  calcPnL,
  calcTNA,
  calcPortfolioTNA,
  calcPortfolioAvgDays,
  TOTAL_PORTFOLIO_USD,
  TOTAL_INVESTED_USD,
  TOTAL_PNL,
  TOTAL_PNL_PCT,
  BENCHMARK_TNA,
} from "./inversiones-flow"
import type { Stock } from "./inversiones-flow"

interface Props {
  onClose: () => void
  onOpenMercado: (ctx: "buy" | "search") => void
  onOpenSell: () => void
  onOpenStockDetail: (id: string) => void
}

// ── Stock Avatar ──────────────────────────────────────────────
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
        <img src={src} alt={stock.symbol} className="w-6 h-6 object-contain"
          onError={() => setImgState((s) => s === "primary" ? "fallback" : "error")} />
      ) : (
        <span className="text-[11px] font-bold" style={{ color: "#ffffff" }}>
          {stock.symbol.slice(0, 2)}
        </span>
      )}
    </div>
  )
}

// ── Donut arc ─────────────────────────────────────────────────
function donutArc(cx: number, cy: number, outerR: number, innerR: number, startDeg: number, endDeg: number, gapDeg = 2.5): string {
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

// ── Períodos — lista y gráfico (mismos en ambas vistas) ───────
const PERIODS_PNL = ["Histórico", "YTD", "MTD", "1M", "1D"] as const
type PeriodPnL = typeof PERIODS_PNL[number]
const PERIOD_LABELS: Record<PeriodPnL, string> = {
  "Histórico": "rendimiento total",
  "YTD":       "este año",
  "MTD":       "mes en curso",
  "1M":        "últimos 30 días",
  "1D":        "hoy",
}

const CHART_PERIODS = ["Histórico", "YTD", "MTD", "1M", "1D"] as const
type ChartPeriod = typeof CHART_PERIODS[number]
const CHART_PERIOD_LABEL: Record<ChartPeriod, string> = {
  "Histórico": "histórico",
  "YTD":       "este año",
  "MTD":       "mes en curso",
  "1M":        "último mes",
  "1D":        "hoy",
}

// ── Eje X — etiquetas por período ────────────────────────────
const X_AXIS_LABELS: Record<ChartPeriod, string[]> = {
  "Histórico": ["2020", "2021", "2022", "2023", "2024"],
  "YTD":       ["Ene", "Mar", "May", "Jul", "Sep"],
  "MTD":       ["S1", "S2", "S3", "S4"],
  "1M":        ["S1", "S2", "S3", "S4"],
  "1D":        ["9am", "12pm", "3pm", "Cierre"],
}

// ── Portfolio PnL por período ─────────────────────────────────
const PORTFOLIO_CHART_PNL: Record<ChartPeriod, { amount: number; pct: number }> = {
  "Histórico": { amount: 412.80, pct: 17.26 },
  "YTD":       { amount: 272.40, pct: 11.68 },
  "MTD":       { amount:  52.30, pct:  2.18 },
  "1M":        { amount: 138.60, pct:  5.91 },
  "1D":        { amount:  14.80, pct:  0.62 },
}

// ── Rendimiento por acción y período ─────────────────────────
const ASSET_RETURNS: Record<string, Record<ChartPeriod, number>> = {
  NVDA:       { "Histórico": 46.90, "YTD": 15.50, "MTD":  1.21, "1M":  3.20, "1D":  0.42 },
  AAPL:       { "Histórico": 10.60, "YTD":  6.10, "MTD":  0.52, "1M":  0.80, "1D":  0.18 },
  TSLA:       { "Histórico":-27.10, "YTD": -8.50, "MTD": -1.05, "1M": -2.30, "1D": -0.28 },
  MSFT:       { "Histórico": 18.40, "YTD":  8.20, "MTD":  0.64, "1M":  1.50, "1D":  0.22 },
  AMZN:       { "Histórico": 22.30, "YTD":  9.80, "MTD":  0.85, "1M":  2.10, "1D":  0.31 },
  GOOGL:      { "Histórico": 15.20, "YTD":  7.40, "MTD":  0.71, "1M":  1.20, "1D":  0.19 },
  META:       { "Histórico": 35.60, "YTD": 12.30, "MTD":  1.10, "1M":  2.80, "1D":  0.38 },
  AMD:        { "Histórico":-12.40, "YTD": -4.20, "MTD": -0.65, "1M": -1.15, "1D": -0.18 },
  SPY:        { "Histórico":  9.80, "YTD":  5.20, "MTD":  0.38, "1M":  0.90, "1D":  0.12 },
  QQQ:        { "Histórico": 13.50, "YTD":  7.10, "MTD":  0.52, "1M":  1.20, "1D":  0.15 },
  // Benchmarks externos
  SPYIDX:     { "Histórico": 10.20, "YTD":  5.40, "MTD":  0.40, "1M":  0.95, "1D":  0.13 },
  BTC:        { "Histórico":128.00, "YTD": 28.50, "MTD":  5.20, "1M": 12.80, "1D":  2.10 },
  USDDIGITAL: { "Histórico":  4.50, "YTD":  1.80, "MTD":  0.35, "1M":  0.60, "1D":  0.02 },
}

// ── Generador de curva ────────────────────────────────────────
const CHART_VOLS: Record<string, number>  = {
  portfolio: 1.2, NVDA: 4.5, AAPL: 1.8, TSLA: 6.0,
  MSFT: 2.2, AMZN: 2.8, GOOGL: 2.0, META: 3.5, AMD: 5.0, SPY: 1.0, QQQ: 1.5,
  SPYIDX: 1.0, BTC: 8.0, USDDIGITAL: 0.05,
}
const CHART_SEEDS: Record<string, number> = {
  portfolio: 42, NVDA: 111, AAPL: 222, TSLA: 333,
  MSFT: 444, AMZN: 555, GOOGL: 666, META: 777, AMD: 888, SPY: 999, QQQ: 1110,
  SPYIDX: 1221, BTC: 2222, USDDIGITAL: 3333,
}

// Benchmarks externos para comparar
const COMPARISON_BENCHMARKS = [
  { id: "SPYIDX",     symbol: "S&P 500",  color: "#22C55E" },
  { id: "USDDIGITAL", symbol: "USD·D",    color: "#2775CA" },
  { id: "BTC",        symbol: "BTC",      color: "#F7931A" },
] as const

function makeReturnLine(id: string, period: ChartPeriod, finalPct: number, nPts = 36): [number, number][] {
  const vol = CHART_VOLS[id] ?? 2
  let s = ((CHART_SEEDS[id] ?? 1) + period.charCodeAt(0)) >>> 0
  const rand = () => { s = ((s * 1664525 + 1013904223) >>> 0); return s / 4294967296 }
  const pts: [number, number][] = [[0, 0]]
  for (let i = 1; i < nPts; i++) {
    const t = i / (nPts - 1)
    const target = finalPct * t
    const prev = pts[pts.length - 1][1]
    const drift = (target - prev) * 0.4
    const noise = (rand() - 0.5) * vol * Math.max(0.25, Math.abs(finalPct) / 15)
    pts.push([t * 100, prev + drift + noise])
  }
  pts[nPts - 1] = [100, finalPct]
  return pts
}

function toSvgPath(pts: [number, number][], W: number, yFn: (y: number) => number): string {
  if (pts.length < 2) return ""
  const xFn = (x: number) => (x / 100) * W
  let d = `M ${xFn(pts[0][0]).toFixed(1)},${yFn(pts[0][1]).toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1]
    const [x2, y2] = pts[i]
    const cpx = xFn((x1 + x2) / 2)
    d += ` C ${cpx.toFixed(1)},${yFn(y1).toFixed(1)} ${cpx.toFixed(1)},${yFn(y2).toFixed(1)} ${xFn(x2).toFixed(1)},${yFn(y2).toFixed(1)}`
  }
  return d
}

// ── Main Component ────────────────────────────────────────────
export default function InversionesHome({ onClose, onOpenMercado, onOpenSell, onOpenStockDetail }: Props) {
  const [viewMode, setViewMode] = useState<"list" | "chart" | "tablero">("list")

  // List view
  const [periodPnL, setPeriodPnL] = useState<PeriodPnL>("Histórico")

  // Chart view
  const [chartPeriod, setChartPeriod]     = useState<ChartPeriod>("1M")
  const [selectedStocks, setSelectedStocks] = useState<string[]>([])
  const [scrubX, setScrubX]               = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const MAX_SELECTED = 4
  const toggleStock = (id: string) =>
    setSelectedStocks((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_SELECTED) return prev
      return [...prev, id]
    })

  const PERIOD_PNL_DATA: Record<PeriodPnL, { amount: number; pct: number }> = {
    "Histórico": { amount: TOTAL_PNL,   pct: TOTAL_PNL_PCT },
    "YTD":       { amount: 272.40,      pct: 11.68 },
    "MTD":       { amount:  52.30,      pct:  2.18 },
    "1M":        { amount: 138.60,      pct:  5.91 },
    "1D":        { amount:  14.80,      pct:  0.62 },
  }
  const periodData = PERIOD_PNL_DATA[periodPnL]
  const isUp = periodData.amount >= 0

  // Allocation
  const allocationData = (PORTFOLIO.map((h) => {
    const stock = getStockById(h.stockId)
    if (!stock) return null
    const val = calcCurrentValue(h, stock)
    const pct = (val / TOTAL_PORTFOLIO_USD) * 100
    return { stock, holding: h, val, pct }
  }).filter(Boolean) as Array<{
    stock: NonNullable<ReturnType<typeof getStockById>>
    holding: (typeof PORTFOLIO)[0]
    val: number; pct: number
  }>).sort((a, b) => b.val - a.val)

  // Donut
  const CX = 110, CY = 110, OUTER_R = 92, INNER_R = 60
  let cumDeg = 0
  const segments = allocationData.map((d) => {
    const startDeg = cumDeg
    const spanDeg = (d.pct / 100) * 360
    cumDeg += spanDeg
    return { ...d, path: donutArc(CX, CY, OUTER_R, INNER_R, startDeg, startDeg + spanDeg) }
  })

  // Chart curves
  const chartPnlData  = PORTFOLIO_CHART_PNL[chartPeriod]
  const chartIsUp     = chartPnlData.pct >= 0
  const portPts       = makeReturnLine("portfolio", chartPeriod, chartPnlData.pct)
  const showPortfolio = selectedStocks.length === 0

  // Selected stock curves (portfolio + benchmarks externos, sin duplicar)
  const stockCurves = (() => {
    const seenIds = new Set<string>()
    const entries: { id: string; color: string }[] = [
      ...allocationData
        .filter((item) => selectedStocks.includes(item.stock.id))
        .map((item) => ({ id: item.stock.id, color: item.stock.color })),
      ...COMPARISON_BENCHMARKS
        .filter((b) => selectedStocks.includes(b.id))
        .map((b) => ({ id: b.id, color: b.color })),
    ]
    return entries
      .filter(({ id }) => { if (seenIds.has(id)) return false; seenIds.add(id); return true })
      .map(({ id, color }) => ({
        id,
        color,
        pts: makeReturnLine(id, chartPeriod, ASSET_RETURNS[id]?.[chartPeriod] ?? 0),
      }))
  })()

  const allY      = [
    ...(showPortfolio ? portPts.map((p) => p[1]) : []),
    ...stockCurves.flatMap((sc) => sc.pts.map((p) => p[1])),
    0,
  ]
  const minY      = Math.min(...allY)
  const maxY      = Math.max(...allY)
  const padY      = Math.max(0.8, (maxY - minY) * 0.22)
  const W = 100; const H = 72
  const chartMinY = minY - padY; const chartMaxY = maxY + padY
  const rangeY    = chartMaxY - chartMinY || 1
  const yFn       = (y: number) => H - ((y - chartMinY) / rangeY) * H
  const zeroY     = yFn(0)

  const handleChartTouch = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault()
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    setScrubX(Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100)))
  }, [])

  const handleChartMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    setScrubX(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)))
  }, [])

  const scrubIdx     = scrubX !== null ? Math.max(0, Math.min(portPts.length - 1, Math.round((scrubX / 100) * (portPts.length - 1)))) : null
  const scrubPortVal = scrubIdx !== null && showPortfolio ? portPts[scrubIdx][1] : null

  return (
    <div className="relative flex flex-col h-full overflow-hidden">

      {/* ── Nav Header ───────────────────────────────────────── */}
      <div className="px-5 pt-2 pb-0 flex-shrink-0">
        <div className="flex items-center mb-4">
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform flex-shrink-0"
            style={{ background: "rgba(28,28,26,0.06)" }}>
            <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
          </button>
          <h1 className="text-[16px] font-semibold ml-3" style={{ color: "#1c1c1a" }}>Inversiones</h1>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="flex items-center rounded-xl p-0.5 gap-0.5" style={{ background: "rgba(28,28,26,0.06)" }}>
              {([
                { id: "list",    Icon: LayoutList },
                { id: "chart",   Icon: TrendingUp },
                { id: "tablero", Icon: BarChart2  },
              ] as const).map(({ id, Icon }) => (
                <button key={id} onClick={() => setViewMode(id)}
                  className="w-8 h-7 flex items-center justify-center rounded-[10px] transition-all duration-150"
                  style={{
                    background: viewMode === id ? "#ffffff" : "transparent",
                    boxShadow: viewMode === id ? "0 1px 3px rgba(28,28,26,0.14)" : "none",
                  }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: viewMode === id ? "#1c1c1a" : "rgba(28,28,26,0.35)" }} />
                </button>
              ))}
            </div>
            <button onClick={() => onOpenMercado("search")}
              className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
              style={{ background: "rgba(28,28,26,0.06)" }}>
              <Search className="w-4 h-4" style={{ color: "#1c1c1a" }} />
            </button>
          </div>
        </div>

        {/* ── Hero Card (list view) ─────────────────────────── */}
        {viewMode === "list" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="p-5 rounded-3xl relative overflow-hidden"
            style={{ background: "#ddf74c" }}
          >
            <p className="text-[13px] font-medium mb-0.5 relative z-10" style={{ color: "rgba(28,28,26,0.5)" }}>Total</p>
            <p className="text-[38px] font-bold tracking-tight leading-none mb-2.5 relative z-10" style={{ color: "#1c1c1a" }}>
              USD {TOTAL_PORTFOLIO_USD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.p key={periodPnL} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}
                  className="text-[15px] font-semibold whitespace-nowrap"
                  style={{ color: isUp ? "#446e0c" : "#E63946" }}>
                  {isUp ? "+" : "-"}USD {Math.abs(periodData.amount).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  {"  "}{isUp ? "▲" : "▼"} {Math.abs(periodData.pct).toFixed(2)}%
                </motion.p>
              </AnimatePresence>
              <p className="text-[12px] font-medium mt-0.5" style={{ color: "rgba(28,28,26,0.45)" }}>
                {PERIOD_LABELS[periodPnL]}
              </p>
              {/* Period selector */}
              <div className="flex gap-1 mt-3">
                {PERIODS_PNL.map((p) => (
                  <button key={p} onClick={() => setPeriodPnL(p)}
                    className="px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all active:scale-95"
                    style={{
                      background: periodPnL === p ? "rgba(255,255,255,0.72)" : "rgba(28,28,26,0.10)",
                      color: periodPnL === p ? "#1c1c1a" : "rgba(28,28,26,0.50)",
                      boxShadow: periodPnL === p ? "0 1px 4px rgba(28,28,26,0.10)" : "none",
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <AnimatePresence mode="wait" initial={false}>

        {/* ════════ LIST VIEW ════════ */}
        {viewMode === "list" && (
          <motion.div key="list" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 min-h-0 overflow-y-auto px-5 mt-4" style={{ paddingBottom: "88px" }}>

            {/* Composition bar */}
            <div className="mb-5">
              <div className="flex h-2.5 rounded-full overflow-hidden">
                {allocationData.map((d, i) => (
                  <motion.div key={d.stock.id} initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 0.08 + i * 0.07, duration: 0.4, ease: "easeOut" }}
                    style={{ width: `${d.pct}%`, background: d.stock.color, transformOrigin: "left", marginRight: i < allocationData.length - 1 ? "2px" : 0 }} />
                ))}
              </div>
              <div className="flex items-center gap-4 mt-2.5">
                {allocationData.map((d, i) => (
                  <motion.div key={d.stock.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + i * 0.07 }} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.stock.color }} />
                    <span className="text-[11px] font-semibold" style={{ color: "#1c1c1a" }}>{d.stock.symbol}</span>
                    <span className="text-[11px]" style={{ color: "rgba(28,28,26,0.4)" }}>{d.pct.toFixed(0)}%</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Holdings list */}
            <div className="flex flex-col gap-1.5">
              {allocationData.map((item, i) => {
                const { stock, holding } = item
                const { amount: pnlAmt, pct: pnlPct } = calcPnL(holding, stock)
                const isPositive = pnlAmt >= 0
                return (
                  <motion.button key={stock.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.05, duration: 0.22 }}
                    onClick={() => onOpenStockDetail(stock.id)}
                    className="w-full text-left p-4 rounded-2xl active:scale-[0.98] transition-transform"
                    style={{ background: "#e5e4e1" }}>
                    <div className="flex items-center gap-3">
                      <StockAvatar stock={stock} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-[14px] font-semibold truncate" style={{ color: "#1c1c1a" }}>{stock.name}</p>
                          <p className="text-[15px] font-bold tabular-nums ml-2" style={{ color: "#1c1c1a" }}>USD {item.val.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.4)" }}>
                            {holding.quantity} {holding.quantity === 1 ? "acción" : "acciones"} · {item.pct.toFixed(1)}%
                          </p>
                          <div className="flex items-center gap-0.5">
                            {isPositive
                              ? <ArrowUpRight className="w-3 h-3" style={{ color: "#446e0c" }} />
                              : <ArrowDownRight className="w-3 h-3" style={{ color: "#E63946" }} />}
                            <span className="text-[12px] font-medium" style={{ color: isPositive ? "#446e0c" : "#E63946" }}>
                              {isPositive ? "+" : ""}{pnlPct.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ════════ CHART VIEW ════════ */}
        {viewMode === "chart" && (
          <motion.div key="chart" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 min-h-0 flex flex-col overflow-hidden">

            {/* Balance header */}
            <div className="px-5 pt-3 pb-0 flex-shrink-0">
              <p className="text-[13px] font-medium mb-0.5" style={{ color: "rgba(28,28,26,0.45)" }}>Tu saldo actual</p>
              <p className="font-bold leading-tight tabular-nums"
                style={{ color: "#1c1c1a", fontSize: "clamp(28px,9vw,38px)" }}>
                USD {TOTAL_PORTFOLIO_USD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <AnimatePresence mode="wait">
                <motion.div key={chartPeriod} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5 mt-1">
                  {chartIsUp
                    ? <ArrowUpRight className="w-4 h-4 flex-shrink-0" style={{ color: "#446e0c" }} />
                    : <ArrowDownRight className="w-4 h-4 flex-shrink-0" style={{ color: "#E63946" }} />}
                  <span className="text-[15px] font-semibold" style={{ color: chartIsUp ? "#446e0c" : "#E63946" }}>
                    {chartIsUp ? "+" : "-"}USD {Math.abs(chartPnlData.amount).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    {"  "}({chartIsUp ? "+" : ""}{chartPnlData.pct.toFixed(2)}%)
                  </span>
                  <span className="text-[13px]" style={{ color: "rgba(28,28,26,0.35)" }}>
                    {CHART_PERIOD_LABEL[chartPeriod]}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Period selector */}
              <div className="flex gap-1 mt-3 mb-3">
                {CHART_PERIODS.map((p) => (
                  <button key={p} onClick={() => { setChartPeriod(p); setScrubX(null) }}
                    className="flex-1 py-1.5 rounded-xl text-[11px] font-semibold transition-all active:scale-95"
                    style={{
                      background: chartPeriod === p ? "#1c1c1a" : "rgba(28,28,26,0.06)",
                      color: chartPeriod === p ? "#ddf74c" : "rgba(28,28,26,0.4)",
                    }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Chart card ─────────────────────────────────── */}
            <div className="px-5 flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.div key={chartPeriod}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }}
                  className="rounded-3xl overflow-hidden"
                  style={{ background: "#ffffff", boxShadow: "0 1px 12px rgba(28,28,26,0.07)" }}>

                  {/* Chart header */}
                  <div className="px-4 pt-3 pb-1">
                    <p className="text-[11px] font-medium" style={{ color: "rgba(28,28,26,0.4)" }}>
                      Rendimiento {CHART_PERIOD_LABEL[chartPeriod]}
                    </p>
                    <AnimatePresence mode="wait">
                      <motion.div key={scrubIdx !== null ? "scrub" : "total"}
                        initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.1 }}>
                        {scrubIdx !== null ? (
                          <div>
                            {showPortfolio ? (
                              <p className="text-[18px] font-bold tabular-nums leading-tight"
                                style={{ color: (portPts[scrubIdx]?.[1] ?? 0) >= 0 ? "#446e0c" : "#E63946" }}>
                                {(portPts[scrubIdx]?.[1] ?? 0) >= 0 ? "+" : ""}{(portPts[scrubIdx]?.[1] ?? 0).toFixed(2)}%
                              </p>
                            ) : (
                              <div className="flex flex-col gap-0.5">
                                {stockCurves.map((sc) => {
                                  const val = sc.pts[scrubIdx]?.[1] ?? 0
                                  return (
                                    <p key={sc.id} className="text-[13px] font-bold tabular-nums leading-tight">
                                      <span style={{ color: sc.color }}>● </span>
                                      <span style={{ color: val >= 0 ? "#446e0c" : "#E63946" }}>
                                        {val >= 0 ? "+" : ""}{val.toFixed(2)}%
                                      </span>
                                      <span className="text-[10px] font-medium ml-1" style={{ color: "rgba(28,28,26,0.4)" }}>{sc.id}</span>
                                    </p>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-[27px]" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* SVG */}
                  <div style={{ height: 120, padding: "2px 8px 0" }}>
                    <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}
                      preserveAspectRatio="none"
                      onTouchStart={handleChartTouch} onTouchMove={handleChartTouch} onTouchEnd={() => setScrubX(null)}
                      onMouseMove={handleChartMouseMove} onMouseLeave={() => setScrubX(null)}
                      style={{ cursor: "crosshair", touchAction: "none" }}>
                      <defs>
                        <linearGradient id="port-area-g" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartIsUp ? "#446e0c" : "#E63946"} stopOpacity="0.14" />
                          <stop offset="100%" stopColor={chartIsUp ? "#446e0c" : "#E63946"} stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Zero baseline */}
                      {zeroY >= 0 && zeroY <= H && (
                        <line x1={0} y1={zeroY} x2={W} y2={zeroY} stroke="rgba(28,28,26,0.12)"
                          strokeWidth="0.5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
                      )}

                      {/* Portfolio — solo si nada seleccionado */}
                      {showPortfolio && (
                        <>
                          <path d={`${toSvgPath(portPts, W, yFn)} L ${W},${yFn(0)} L 0,${yFn(0)} Z`} fill="url(#port-area-g)" />
                          <path d={toSvgPath(portPts, W, yFn)} fill="none"
                            stroke={chartIsUp ? "#446e0c" : "#E63946"}
                            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                          {(() => { const lp = portPts[portPts.length - 1]; return <circle cx={(lp[0]/100)*W} cy={yFn(lp[1])} r="2.5" fill={chartIsUp ? "#446e0c" : "#E63946"} /> })()}
                        </>
                      )}

                      {/* Curvas de acciones seleccionadas */}
                      {stockCurves.map((sc) => (
                        <g key={sc.id}>
                          <path d={toSvgPath(sc.pts, W, yFn)} fill="none"
                            stroke={sc.color} strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                          {(() => { const lp = sc.pts[sc.pts.length - 1]; return <circle cx={(lp[0]/100)*W} cy={yFn(lp[1])} r="2" fill={sc.color} /> })()}
                        </g>
                      ))}

                      {/* Scrubber */}
                      {scrubX !== null && scrubIdx !== null && (
                        <g>
                          <line x1={(scrubX/100)*W} y1={0} x2={(scrubX/100)*W} y2={H}
                            stroke="rgba(28,28,26,0.12)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                          {showPortfolio && (
                            <circle cx={(scrubX/100)*W} cy={yFn(portPts[scrubIdx][1])} r="2.5"
                              fill={chartIsUp ? "#446e0c" : "#E63946"} stroke="#ffffff" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                          )}
                          {stockCurves.map((sc) => (
                            <circle key={sc.id} cx={(scrubX/100)*W} cy={yFn(sc.pts[scrubIdx]?.[1] ?? 0)}
                              r="2" fill={sc.color} stroke="#ffffff" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                          ))}
                        </g>
                      )}
                    </svg>
                  </div>

                  {/* Eje X */}
                  <div className="flex justify-between px-3 mt-0.5">
                    {X_AXIS_LABELS[chartPeriod].map((label) => (
                      <span key={label} className="text-[9px]" style={{ color: "rgba(28,28,26,0.32)" }}>{label}</span>
                    ))}
                  </div>

                  {/* Leyenda dentro del card */}
                  <div className="px-3 pt-2 pb-3" style={{ borderTop: "1px solid rgba(28,28,26,0.05)" }}>
                    <AnimatePresence mode="wait">
                      {showPortfolio ? (
                        <motion.div key="port-legend"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                          className="flex items-center gap-2">
                          <svg width="18" height="8" viewBox="0 0 18 8" fill="none">
                            <path d="M 0 4 L 18 4" stroke={chartIsUp ? "#446e0c" : "#E63946"} strokeWidth="2.5" strokeLinecap="round"/>
                          </svg>
                          <span className="text-[11px] font-semibold" style={{ color: "#1c1c1a" }}>Portafolio</span>
                        </motion.div>
                      ) : (
                        <motion.div key="stock-legend"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                          className="flex items-center gap-3 flex-wrap">
                          {stockCurves.map((sc) => (
                            <div key={sc.id} className="flex items-center gap-1.5">
                              <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
                                <path d="M 0 4 L 14 4" stroke={sc.color} strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                              <span className="text-[11px] font-semibold" style={{ color: "#1c1c1a" }}>{sc.id}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Chips — fuera del card, scrollable ── */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 mt-4" style={{ paddingBottom: "24px" }}>

              {/* — Mis acciones — */}
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "rgba(28,28,26,0.35)" }}>
                  Mis acciones
                </p>
                {selectedStocks.length > 0 && (
                  <span className="text-[10px] font-medium" style={{ color: "rgba(28,28,26,0.35)" }}>
                    {selectedStocks.length}/{MAX_SELECTED}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {allocationData.map((item) => {
                  const isSelected = selectedStocks.includes(item.stock.id)
                  const atMax = selectedStocks.length >= MAX_SELECTED && !isSelected
                  const ret = ASSET_RETURNS[item.stock.id]?.[chartPeriod] ?? 0
                  return (
                    <button key={item.stock.id}
                      onClick={() => !atMax && toggleStock(item.stock.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-95"
                      style={{
                        background: isSelected ? `${item.stock.color}15` : "rgba(28,28,26,0.05)",
                        border: `1.5px solid ${isSelected ? item.stock.color + "60" : "transparent"}`,
                        opacity: atMax ? 0.3 : 1,
                        cursor: atMax ? "default" : "pointer",
                      }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: item.stock.color, opacity: isSelected ? 1 : 0.45 }} />
                      <span className="text-[12px] font-semibold"
                        style={{ color: isSelected ? "#1c1c1a" : "rgba(28,28,26,0.5)" }}>
                        {item.stock.symbol}
                      </span>
                      <span className="text-[11px] tabular-nums"
                        style={{ color: ret >= 0 ? "#446e0c" : "#E63946", opacity: isSelected ? 1 : 0.7 }}>
                        {ret >= 0 ? "+" : ""}{ret.toFixed(1)}%
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Separador */}
              <div style={{ height: 1, background: "rgba(28,28,26,0.07)", marginBottom: "16px" }} />

              {/* — Comparar con — */}
              <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: "rgba(28,28,26,0.35)" }}>
                Comparar con
              </p>
              <div className="flex flex-wrap gap-1.5">
                {COMPARISON_BENCHMARKS.map((bench) => {
                  const isSelected = selectedStocks.includes(bench.id)
                  const atMax = selectedStocks.length >= MAX_SELECTED && !isSelected
                  const ret = ASSET_RETURNS[bench.id]?.[chartPeriod] ?? 0
                  return (
                    <button key={bench.id}
                      onClick={() => !atMax && toggleStock(bench.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all active:scale-95"
                      style={{
                        background: isSelected ? `${bench.color}15` : "rgba(28,28,26,0.05)",
                        border: `1.5px solid ${isSelected ? bench.color + "60" : "transparent"}`,
                        opacity: atMax ? 0.3 : 1,
                        cursor: atMax ? "default" : "pointer",
                      }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: bench.color, opacity: isSelected ? 1 : 0.45 }} />
                      <span className="text-[12px] font-semibold"
                        style={{ color: isSelected ? "#1c1c1a" : "rgba(28,28,26,0.5)" }}>
                        {bench.symbol}
                      </span>
                      <span className="text-[11px] tabular-nums"
                        style={{ color: ret >= 0 ? "#446e0c" : "#E63946", opacity: isSelected ? 1 : 0.7 }}>
                        {ret >= 0 ? "+" : ""}{ret.toFixed(1)}%
                      </span>
                    </button>
                  )
                })}
              </div>

            </div>

          </motion.div>
        )}

        {/* ════════ TABLERO VIEW ════════ */}
        {viewMode === "tablero" && (
          <motion.div key="tablero" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 min-h-0 overflow-y-auto px-5 mt-4" style={{ paddingBottom: "24px" }}>
            <div className="mb-4">
              <h2 className="text-[17px] font-bold" style={{ color: "#1c1c1a" }}>Resultados</h2>
              <p className="text-[12px] mt-0.5" style={{ color: "rgba(28,28,26,0.45)" }}>Para evaluar tu portafolio</p>
            </div>
            {(() => {
              const portfolioTNA = calcPortfolioTNA()
              const avgDays = Math.round(calcPortfolioAvgDays())
              const rows = allocationData.map((item) => {
                const { stock, holding } = item
                const { amount: pnlAmt, pct: pnlPct } = calcPnL(holding, stock)
                const tna = calcTNA(holding, stock)
                return { stock, holding, val: item.val, pnlAmt, pnlPct, tna }
              })
              const sep = "1px solid rgba(28,28,26,0.07)"
              return (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }} className="rounded-2xl overflow-hidden mb-4"
                  style={{ background: "#e5e4e1" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ borderCollapse: "collapse", minWidth: "420px", width: "100%" }}>
                      <thead>
                        <tr>
                          {["Activo", "Invertido", "Valor act.", "G / P", "Días", "TNA"].map((h, i) => (
                            <th key={h} style={{ padding: "10px 13px", fontSize: 10, fontWeight: 600, color: "rgba(28,28,26,0.38)", textAlign: i === 0 ? "left" : "right", whiteSpace: "nowrap", borderBottom: sep }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r) => (
                          <tr key={r.stock.id}>
                            <td style={{ padding: "12px 13px", borderBottom: sep }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.stock.color, flexShrink: 0 }} />
                                <div>
                                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1c1c1a" }}>{r.stock.symbol}</div>
                                  <div style={{ fontSize: 10, color: "rgba(28,28,26,0.4)" }}>{r.stock.name.split(" ")[0]}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "12px 13px", fontSize: 11, color: "rgba(28,28,26,0.48)", textAlign: "right", whiteSpace: "nowrap", borderBottom: sep }}>USD {r.holding.totalInvested.toFixed(0)}</td>
                            <td style={{ padding: "12px 13px", fontSize: 12, fontWeight: 600, color: "#1c1c1a", textAlign: "right", whiteSpace: "nowrap", borderBottom: sep }}>USD {r.val.toFixed(0)}</td>
                            <td style={{ padding: "12px 13px", textAlign: "right", whiteSpace: "nowrap", borderBottom: sep }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: r.pnlAmt >= 0 ? "#446e0c" : "#E63946" }}>{r.pnlAmt >= 0 ? "+" : ""}USD {r.pnlAmt.toFixed(0)}</div>
                              <div style={{ fontSize: 10, color: r.pnlAmt >= 0 ? "#446e0c" : "#E63946" }}>{r.pnlPct >= 0 ? "+" : ""}{r.pnlPct.toFixed(1)}%</div>
                            </td>
                            <td style={{ padding: "12px 13px", fontSize: 11, color: "rgba(28,28,26,0.42)", textAlign: "right", whiteSpace: "nowrap", borderBottom: sep }}>{r.holding.holdingDays}d</td>
                            <td style={{ padding: "12px 13px", textAlign: "right", whiteSpace: "nowrap", borderBottom: sep }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: r.tna >= BENCHMARK_TNA ? "#446e0c" : "#E63946" }}>{r.tna >= 0 ? "+" : ""}{r.tna.toFixed(1)}%</div>
                            </td>
                          </tr>
                        ))}
                        <tr><td colSpan={6} style={{ height: 1, background: "rgba(28,28,26,0.18)", padding: 0 }} /></tr>
                        <tr style={{ background: "rgba(28,28,26,0.04)" }}>
                          <td style={{ padding: "12px 13px" }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#1c1c1a" }}>TOTAL</div>
                            <div style={{ fontSize: 10, color: "rgba(28,28,26,0.4)" }}>{avgDays}d prom.</div>
                          </td>
                          <td style={{ padding: "12px 13px", fontSize: 11, color: "rgba(28,28,26,0.48)", textAlign: "right", whiteSpace: "nowrap" }}>USD {TOTAL_INVESTED_USD.toFixed(0)}</td>
                          <td style={{ padding: "12px 13px", fontSize: 13, fontWeight: 700, color: "#1c1c1a", textAlign: "right", whiteSpace: "nowrap" }}>USD {TOTAL_PORTFOLIO_USD.toFixed(0)}</td>
                          <td style={{ padding: "12px 13px", textAlign: "right", whiteSpace: "nowrap" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: TOTAL_PNL >= 0 ? "#446e0c" : "#E63946" }}>{TOTAL_PNL >= 0 ? "+" : ""}USD {TOTAL_PNL.toFixed(0)}</div>
                            <div style={{ fontSize: 10, color: TOTAL_PNL >= 0 ? "#446e0c" : "#E63946" }}>{TOTAL_PNL_PCT >= 0 ? "+" : ""}{TOTAL_PNL_PCT.toFixed(1)}%</div>
                          </td>
                          <td style={{ padding: "12px 13px", fontSize: 11, color: "rgba(28,28,26,0.42)", textAlign: "right", whiteSpace: "nowrap" }}>{avgDays}d</td>
                          <td style={{ padding: "12px 13px", textAlign: "right", whiteSpace: "nowrap" }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: portfolioTNA >= BENCHMARK_TNA ? "#446e0c" : "#E63946" }}>{portfolioTNA >= 0 ? "+" : ""}{portfolioTNA.toFixed(1)}%</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )
            })()}
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Explorar mercado ─────────────────────────────────── */}
      {viewMode === "list" && (
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-4"
          style={{ background: "linear-gradient(to top, #e5e4e1 65%, transparent)" }}>
          <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            onClick={() => onOpenMercado("buy")}
            className="w-full py-3.5 rounded-full active:scale-95 transition-transform"
            style={{ background: "#2b2a28" }}>
            <span className="text-[15px] font-semibold" style={{ color: "#f5f4f1" }}>Explorar mercado</span>
          </motion.button>
        </div>
      )}

    </div>
  )
}
