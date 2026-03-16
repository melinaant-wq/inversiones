"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import InversionesHome from "./inversiones-home"
import InversionesMercado from "./inversiones-mercado"
import InversionesStockDetail from "./inversiones-stock-detail"
import InversionesBuy from "./inversiones-buy"
import InversionesSell from "./inversiones-sell"
import InversionesPackDetail from "./inversiones-pack-detail"
import InversionesHistorial from "./inversiones-historial"
import InversionesOnboarding, { type InvestorProfile } from "./inversiones-onboarding"

// ── Shared Data Types ────────────────────────────────────────

export interface Stock {
  id: string
  name: string
  symbol: string
  price: number // USD
  change: number // % 24h
  color: string
  sector: string
  type: "stock" | "etf"
  logo?: string
}

export interface Pack {
  id: string
  name: string
  description: string
  returnY: number // % 12m
  volatility: "Baja" | "Media" | "Alta"
  color: string
  stocks: string[] // stock ids
  darkText?: boolean // true when background is light (e.g. yellow)
}

export interface Holding {
  stockId: string
  quantity: number
  avgPrice: number // USD
  totalInvested: number // USD
}

// ── Mock Data ─────────────────────────────────────────────────

export const STOCKS: Stock[] = [
  { id: "AAPL", name: "Apple Inc.", symbol: "AAPL", price: 182.52, change: 1.24, color: "#3B82F6", sector: "Tecnología", type: "stock", logo: "https://logo.clearbit.com/apple.com" },
  { id: "TSLA", name: "Tesla", symbol: "TSLA", price: 248.30, change: -0.82, color: "#F97316", sector: "Automotriz", type: "stock", logo: "https://logo.clearbit.com/tesla.com" },
  { id: "NVDA", name: "NVIDIA", symbol: "NVDA", price: 875.20, change: 3.41, color: "#22C55E", sector: "Semiconductores", type: "stock", logo: "https://logo.clearbit.com/nvidia.com" },
  { id: "MSFT", name: "Microsoft", symbol: "MSFT", price: 415.80, change: 0.64, color: "#00A4EF", sector: "Tecnología", type: "stock", logo: "https://logo.clearbit.com/microsoft.com" },
  { id: "AMZN", name: "Amazon", symbol: "AMZN", price: 186.42, change: 2.13, color: "#FF9900", sector: "E-commerce", type: "stock", logo: "https://logo.clearbit.com/amazon.com" },
  { id: "GOOGL", name: "Alphabet", symbol: "GOOGL", price: 167.20, change: 1.82, color: "#4285F4", sector: "Tecnología", type: "stock", logo: "https://logo.clearbit.com/google.com" },
  { id: "META", name: "Meta", symbol: "META", price: 524.50, change: 2.28, color: "#0467DF", sector: "Social Media", type: "stock", logo: "https://logo.clearbit.com/meta.com" },
  { id: "AMD", name: "AMD", symbol: "AMD", price: 157.90, change: -1.15, color: "#ED1C24", sector: "Semiconductores", type: "stock", logo: "https://logo.clearbit.com/amd.com" },
  { id: "SPY", name: "S&P 500 ETF", symbol: "SPY", price: 512.30, change: 0.38, color: "#2c5f2e", sector: "ETF Diversificado", type: "etf", logo: "https://logo.clearbit.com/ssga.com" },
  { id: "QQQ", name: "Nasdaq 100 ETF", symbol: "QQQ", price: 448.20, change: 0.91, color: "#1c3c8c", sector: "ETF Tecnología", type: "etf", logo: "https://logo.clearbit.com/invesco.com" },
  { id: "VTI", name: "Vanguard Total Market", symbol: "VTI", price: 234.60, change: 0.44, color: "#8B0000", sector: "ETF Mercado Total", type: "etf", logo: "https://logo.clearbit.com/vanguard.com" },
  { id: "EEM", name: "Emerging Markets ETF", symbol: "EEM", price: 43.80, change: 1.12, color: "#8B4513", sector: "ETF Emergentes", type: "etf", logo: "https://logo.clearbit.com/blackrock.com" },
]

export const PACKS: Pack[] = [
  {
    id: "tech-leaders",
    name: "Tech Leaders",
    description: "Las empresas tech más grandes del mundo en un solo click",
    returnY: 32.4,
    volatility: "Alta",
    color: "#d45c7a",
    stocks: ["AAPL", "NVDA", "MSFT", "META"],
  },
  {
    id: "sp500-core",
    name: "S&P 500 Core",
    description: "Exposición diversificada a las 500 empresas más grandes de EE.UU.",
    returnY: 24.1,
    volatility: "Media",
    color: "#e07c48",
    stocks: ["AAPL", "MSFT", "AMZN", "GOOGL"],
  },
  {
    id: "dividendos",
    name: "Dividendos Estables",
    description: "Empresas con historial consistente de pago de dividendos",
    returnY: 8.4,
    volatility: "Baja",
    color: "#f0c040",
    darkText: true,
    stocks: ["MSFT", "AAPL", "AMZN", "GOOGL"],
  },
  {
    id: "innovation",
    name: "Innovación Disruptiva",
    description: "Compañías que están transformando industrias enteras",
    returnY: 41.2,
    volatility: "Alta",
    color: "#8c4fc8",
    stocks: ["NVDA", "TSLA", "META", "AMD"],
  },
]

export const PORTFOLIO: Holding[] = [
  { stockId: "AAPL", quantity: 1.5, avgPrice: 165.00, totalInvested: 247.50 },
  { stockId: "TSLA", quantity: 1.0, avgPrice: 260.00, totalInvested: 260.00 },
  { stockId: "NVDA", quantity: 0.5, avgPrice: 720.00, totalInvested: 360.00 },
]

// ── Helpers ───────────────────────────────────────────────────

export function getStockById(id: string): Stock | undefined {
  return STOCKS.find((s) => s.id === id)
}

export function getHolding(stockId: string): Holding | undefined {
  return PORTFOLIO.find((h) => h.stockId === stockId)
}

export function calcCurrentValue(holding: Holding, stock: Stock): number {
  return holding.quantity * stock.price
}

export function calcPnL(holding: Holding, stock: Stock): { amount: number; pct: number } {
  const currentValue = calcCurrentValue(holding, stock)
  const amount = currentValue - holding.totalInvested
  const pct = (amount / holding.totalInvested) * 100
  return { amount, pct }
}

export const TOTAL_PORTFOLIO_USD = PORTFOLIO.reduce((acc, h) => {
  const stock = getStockById(h.stockId)
  return acc + (stock ? h.quantity * stock.price : 0)
}, 0)

export const TOTAL_INVESTED_USD = PORTFOLIO.reduce((acc, h) => acc + h.totalInvested, 0)
export const TOTAL_PNL = TOTAL_PORTFOLIO_USD - TOTAL_INVESTED_USD
export const TOTAL_PNL_PCT = (TOTAL_PNL / TOTAL_INVESTED_USD) * 100

export const ARS_RATE = 1200 // 1 USD = 1200 ARS

// ── Chart Data Generation ─────────────────────────────────────

function seededRng(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0
    return s / 4294967296
  }
}

function hashStr(str: string): number {
  let h = 5381
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0
  }
  return h >>> 0
}

export function generatePrices(stockId: string, period: string, currentPrice: number): number[] {
  const rng = seededRng(hashStr(stockId + period))
  const configs: Record<string, [number, number]> = {
    "1D":  [48, 0.0022],
    "MTD": [30, 0.018],
    "3M":  [60, 0.028],
    "YTD": [52, 0.048],
  }
  const [n, vol] = configs[period] ?? [30, 0.02]
  const overallReturn = rng() * 0.45 - 0.12
  const startPrice = currentPrice / (1 + overallReturn)

  const prices: number[] = []
  let p = startPrice
  for (let i = 0; i < n - 1; i++) {
    const noise = (rng() - 0.5) * 2 * vol * p
    const drift = ((currentPrice - p) / (n - i)) * 0.35
    p = Math.max(p + noise + drift, currentPrice * 0.25)
    prices.push(p)
  }
  prices.push(currentPrice)
  return prices
}

export function toSvgPoints(prices: number[], w: number, h: number): [number, number][] {
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const range = max - min || 1
  const padY = h * 0.08
  return prices.map((p, i) => [
    (i / (prices.length - 1)) * w,
    h - padY - ((p - min) / range) * (h - padY * 2),
  ])
}

export function smoothLinePath(pts: [number, number][]): string {
  if (pts.length < 2) return ""
  const [x0, y0] = pts[0]
  let d = `M ${x0.toFixed(1)},${y0.toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const [x1, y1] = pts[i - 1]
    const [x2, y2] = pts[i]
    const cpx = ((x1 + x2) / 2).toFixed(1)
    d += ` C ${cpx},${y1.toFixed(1)} ${cpx},${y2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`
  }
  return d
}

export function areaPath(pts: [number, number][], h: number): string {
  const line = smoothLinePath(pts)
  const last = pts[pts.length - 1]
  const first = pts[0]
  return `${line} L ${last[0].toFixed(1)},${h} L ${first[0].toFixed(1)},${h} Z`
}

// ── Navigation Types ─────────────────────────────────────────

export type InvScreen =
  | { type: "home" }
  | { type: "mercado"; context: "buy" | "search" }
  | { type: "stock-detail"; stockId: string }
  | { type: "buy"; stockId?: string }
  | { type: "sell"; stockId?: string }
  | { type: "pack-detail"; packId: string }
  | { type: "historial" }

// ── Main Flow Component ───────────────────────────────────────

interface Props {
  onClose: () => void
}

export default function InversionesFlow({ onClose }: Props) {
  const [onboardingDone, setOnboardingDone] = useState(false)
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(null)
  const [stack, setStack] = useState<InvScreen[]>([{ type: "home" }])
  const current = stack[stack.length - 1]

  const push = (screen: InvScreen) => setStack((s) => [...s, screen])
  const pop = () => {
    if (stack.length <= 1) {
      onClose()
      return
    }
    setStack((s) => s.slice(0, -1))
  }
  const reset = () => setStack([{ type: "home" }])

  const handleOnboardingComplete = (profile: InvestorProfile, packId?: string) => {
    setInvestorProfile(profile)
    setOnboardingDone(true)
    if (packId) {
      setStack([{ type: "home" }, { type: "pack-detail", packId }])
    } else {
      setStack([{ type: "home" }])
    }
  }

  const handleOnboardingSkip = () => {
    setOnboardingDone(true)
    setStack([{ type: "home" }])
  }

  const screenKey =
    current.type +
    (current.type === "stock-detail" ? current.stockId : "") +
    (current.type === "mercado" ? current.context : "") +
    (current.type === "buy" ? (current.stockId ?? "none") : "") +
    (current.type === "sell" ? (current.stockId ?? "none") : "") +
    (current.type === "pack-detail" ? current.packId : "") +
    (current.type === "historial" ? "historial" : "")

  if (!onboardingDone) {
    return (
      <InversionesOnboarding
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
        onClose={onClose}
      />
    )
  }

  return (
    <div className="flex-1 min-h-0 relative overflow-hidden" style={{ height: "100%" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={screenKey}
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-28%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 42, mass: 0.8 }}
          className="absolute inset-0 flex flex-col overflow-hidden"
          style={{ background: "#f5f4f1" }}
        >
          {current.type === "home" && (
            <InversionesHome
              onClose={onClose}
              onOpenMercado={(ctx) => push({ type: "mercado", context: ctx })}
              onOpenSell={() => push({ type: "sell" })}
              onOpenStockDetail={(id) => push({ type: "stock-detail", stockId: id })}
              onOpenResultados={() => push({ type: "historial" })}
              investorProfile={investorProfile}
              emptyPortfolio={true}
            />
          )}
          {current.type === "historial" && (
            <InversionesHistorial onClose={pop} />
          )}
          {current.type === "mercado" && (
            <InversionesMercado
              context={current.context}
              onClose={pop}
              onOpenStockDetail={(id) => push({ type: "stock-detail", stockId: id })}
              onOpenBuy={(id) => push({ type: "buy", stockId: id })}
              onOpenPackDetail={(id) => push({ type: "pack-detail", packId: id })}
            />
          )}
          {current.type === "stock-detail" && (
            <InversionesStockDetail
              stockId={current.stockId}
              onClose={pop}
              onOpenBuy={(id) => push({ type: "buy", stockId: id })}
              onOpenSell={(id) => push({ type: "sell", stockId: id })}
            />
          )}
          {current.type === "buy" && (
            <InversionesBuy
              stockId={current.stockId}
              onClose={pop}
              onDone={reset}
            />
          )}
          {current.type === "sell" && (
            <InversionesSell
              stockId={current.stockId}
              onClose={pop}
              onDone={reset}
            />
          )}
          {current.type === "pack-detail" && (() => {
            const pack = PACKS.find(p => p.id === current.packId)
            if (!pack) return null
            return (
              <InversionesPackDetail
                pack={pack}
                onClose={pop}
                onBuy={() => push({ type: "buy", stockId: pack.stocks[0] })}
              />
            )
          })()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
