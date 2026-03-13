"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TOTAL_PORTFOLIO_USD, TOTAL_PNL, TOTAL_PNL_PCT } from "./inversiones-flow"
import { useUserConfig } from "@/lib/user-config"

type ViewMode = "lista" | "grafico"
type TimeRange = "Todo" | "1A" | "1M" | "1S" | "Live"

const inversionesIsUp = TOTAL_PNL >= 0
const inversionesBalance = `USD ${TOTAL_PORTFOLIO_USD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const inversionesSubtitle = `${inversionesIsUp ? "+" : "-"}USD ${Math.abs(TOTAL_PNL).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}  ${inversionesIsUp ? "▲" : "▼"} ${Math.abs(TOTAL_PNL_PCT).toFixed(2)}%`

const assets = [
  {
    id: "pesos",
    dot: "#3b83f7",
    label: "Pesos",
    balance: "1.000,66",
    subtitle: "+ $1345,78",
    badge: "41,19%",
    badgeBg: "#1c1c1a",
    badgeColor: "#ddf74c",
  },
  {
    id: "dolares",
    dot: "#446e0c",
    label: "Dólares",
    balance: "0,00",
    subtitle: "Compra $1429 | Venta $1478",
    badge: "12,45%",
    badgeBg: "#1c1c1a",
    badgeColor: "#ddf74c",
  },
  {
    id: "bitcoin",
    dot: "#ff8700",
    label: "Bitcoin",
    balance: "0,00",
    subtitle: "US$64.986,78",
    badge: null,
    badgeBg: null,
    badgeColor: null,
  },
  {
    id: "inversiones",
    dot: null,
    label: "Inversiones",
    balance: inversionesBalance,
    subtitle: inversionesSubtitle,
    badge: `${inversionesIsUp ? "▲" : "▼"} ${Math.abs(TOTAL_PNL_PCT).toFixed(2)}%`,
    badgeBg: inversionesIsUp ? "rgba(68,110,12,0.12)" : "rgba(230,57,70,0.10)",
    badgeColor: inversionesIsUp ? "#446e0c" : "#E63946",
    isRainbow: true,
  },
]

// Organic chart points — smooth ups and downs with strong upward trend
const CHART_POINTS: [number, number][] = [
  [0, 82], [8, 72], [15, 76], [22, 58], [30, 68], [37, 44],
  [44, 54], [50, 36], [56, 48], [63, 26], [70, 38], [77, 18],
  [84, 28], [90, 14], [95, 20], [100, 4],
]

function buildSmoothPath(points: [number, number][]): string {
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

function RainbowDot() {
  return (
    <div
      className="w-3 h-3 rounded-full flex-shrink-0"
      style={{
        background: "conic-gradient(from 0deg, #ff8700, #ddf74c, #3b83f7, #db4e5a, #ff8700)",
      }}
    />
  )
}

export default function PortfolioScreen({
  onOpenDollars,
  onOpenInvestments,
  onOpenCash,
}: {
  onOpenDollars?: () => void
  onOpenInvestments?: () => void
  onOpenCash?: () => void
}) {
  const { hasInvestments, profileComplete, profileName } = useUserConfig()
  const [view, setView] = useState<ViewMode>("lista")
  const [timeRange, setTimeRange] = useState<TimeRange>("1M")
  const [scrubX, setScrubX] = useState<number | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const handleAssetTap = (id: string) => {
    if (id === "dolares") onOpenDollars?.()
    else if (id === "inversiones") onOpenInvestments?.()
    else if (id === "pesos") onOpenCash?.()
  }

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

  const linePath = buildSmoothPath(CHART_POINTS)

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2 flex-shrink-0">
        <h1 className="text-[26px] font-bold" style={{ color: "#1c1c1a" }}>
          Portfolio
        </h1>
        {/* View toggle — pill style matching home */}
        <div
          className="flex items-center gap-1 p-1 rounded-full"
          style={{ background: "rgba(28,28,26,0.08)" }}
        >
          {(["lista", "grafico"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="text-[13px] font-medium px-3 py-1 rounded-full transition-all"
              style={{
                background: view === v ? "#1c1c1a" : "transparent",
                color: view === v ? "#ddf74c" : "rgba(28,28,26,0.45)",
              }}
            >
              {v === "lista" ? "Lista" : "Gráfico"}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── LISTA VIEW ── */}
        {view === "lista" && (
          <motion.div
            key="lista"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22 }}
            className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3"
          >
            {assets.map((asset) => {
              const isInv = asset.id === "inversiones"
              const showProfilePrompt = isInv && !hasInvestments
              return (
                <button
                  key={asset.id}
                  onClick={() => handleAssetTap(asset.id)}
                  className="w-full text-left rounded-3xl p-4 active:scale-[0.98] transition-transform"
                  style={{ background: "#e5e4e1" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {asset.isRainbow ? <RainbowDot /> : (
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: asset.dot ?? "#ccc" }} />
                      )}
                      <span className="text-[15px] font-medium" style={{ color: "rgba(28,28,26,0.55)" }}>
                        {asset.label}
                      </span>
                    </div>
                    {!showProfilePrompt && asset.badge && (
                      <span
                        className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: asset.badgeBg ?? "#1c1c1a", color: asset.badgeColor ?? "#ddf74c" }}
                      >
                        {asset.badge}
                      </span>
                    )}
                  </div>

                  {/* New user: profile prompt or start investing CTA */}
                  {showProfilePrompt ? (
                    <div className="flex items-center gap-2.5 mt-2.5">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(28,28,26,0.08)" }}
                      >
                        {profileComplete ? (
                          /* rocket icon */
                          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                            <path d="M10 2.5C10 2.5 6 6 6 11h8c0-5-4-8.5-4-8.5Z" stroke="#1c1c1a" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M7 11v3.5a3 3 0 006 0V11" stroke="#1c1c1a" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="10" cy="7" r="1" fill="#1c1c1a" />
                          </svg>
                        ) : (
                          /* target / radio icon */
                          <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                            <circle cx="10" cy="10" r="7.5" stroke="#1c1c1a" strokeWidth="1.5" />
                            <circle cx="10" cy="10" r="4" stroke="#1c1c1a" strokeWidth="1.5" />
                            <circle cx="10" cy="10" r="1.5" fill="#1c1c1a" />
                          </svg>
                        )}
                      </div>
                      <div>
                        {profileComplete ? (
                          <>
                            <p className="text-[14px] font-semibold" style={{ color: "#1c1c1a" }}>
                              Empezá a invertir
                            </p>
                            <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                              Perfil {profileName || "listo"} · Todo configurado
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-[14px] font-semibold" style={{ color: "#1c1c1a" }}>
                              Completar tu perfil
                            </p>
                            <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                              5 preguntas · menos de 1 min
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-[28px] font-bold mt-2 leading-tight" style={{ color: "#1c1c1a", fontVariantNumeric: "tabular-nums" }}>
                        {asset.balance}
                      </p>
                      <p className="text-[13px] mt-0.5" style={{ color: "rgba(28,28,26,0.45)" }}>
                        {asset.subtitle}
                      </p>
                    </>
                  )}
                </button>
              )
            })}

            {/* Total footer */}
            <div className="flex items-center justify-center pt-1 pb-2">
              <span className="text-[15px] font-semibold" style={{ color: "rgba(28,28,26,0.4)" }}>
                {"≈ $1.000,66"}
              </span>
            </div>
          </motion.div>
        )}

        {/* ── GRÁFICO VIEW ── */}
        {view === "grafico" && (
          <motion.div
            key="grafico"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.22 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Total */}
            <div className="px-5 pt-0 pb-2 flex-shrink-0">
              <p
                className="font-bold leading-tight"
                style={{ color: "#1c1c1a", fontSize: "clamp(30px, 8vw, 40px)", fontVariantNumeric: "tabular-nums" }}
              >
                {scrubX !== null
                  ? `US$${(600 + (scrubX / 100) * 400).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : "US$1.000,66"
                }
              </p>
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-0 w-full select-none">
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
                <path
                  d={linePath}
                  fill="none"
                  stroke="#446e0c"
                  strokeWidth="3"
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
                        cx={scrubX} cy={y} r="2"
                        fill="#446e0c"
                        stroke="#f5f4f1"
                        strokeWidth="0.8"
                        vectorEffect="non-scaling-stroke"
                      />
                    </g>
                  )
                })()}
              </svg>
            </div>

            {/* Allocation tiles — on-brand palette */}
            <div className="flex gap-2 px-4 pb-3 flex-shrink-0" style={{ height: "100px" }}>
              {/* BTC — large */}
              <div
                className="rounded-3xl p-3 flex flex-col justify-between"
                style={{ background: "#ff8700", flex: 2, minWidth: 0 }}
              >
                <p className="text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.65)" }}>BTC</p>
                <div>
                  <p className="text-[22px] font-bold leading-none" style={{ color: "#fff" }}>60%</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>US$4.986,78</p>
                </div>
              </div>
              {/* ETH — medium */}
              <div
                className="rounded-3xl p-3 flex flex-col justify-between"
                style={{ background: "#446e0c", flex: 1.2, minWidth: 0 }}
              >
                <p className="text-[11px] font-semibold" style={{ color: "rgba(221,247,76,0.7)" }}>ETH</p>
                <p className="text-[22px] font-bold leading-none" style={{ color: "#ddf74c" }}>30%</p>
              </div>
              {/* ARS — narrow */}
              <div
                className="rounded-3xl"
                style={{ background: "#db4e5a", flex: 0.6, minWidth: 0 }}
              />
              {/* USD — narrowest */}
              <div
                className="rounded-3xl"
                style={{ background: "#3b83f7", flex: 0.4, minWidth: 0 }}
              />
            </div>

            {/* Time range selector — pill style */}
            <div className="flex items-center justify-around px-4 pb-5 flex-shrink-0">
              {(["Todo", "1A", "1M", "1S", "Live"] as TimeRange[]).map((range) => {
                const isLive = range === "Live"
                const isActive = timeRange === range
                return (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className="text-[13px] px-3 py-1 rounded-full active:scale-90 transition-all"
                    style={{
                      background: isActive
                        ? isLive ? "rgba(230,57,70,0.12)" : "#1c1c1a"
                        : "transparent",
                      color: isActive
                        ? isLive ? "#db4e5a" : "#ddf74c"
                        : "rgba(28,28,26,0.35)",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {range}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
