"use client"

import { motion } from "framer-motion"
import {
  ArrowLeft,
  LayoutList,
  TrendingUp,
  BarChart2,
  Search,
  ChevronRight,
  Zap,
  Globe,
  Smartphone,
} from "lucide-react"
import { STOCKS } from "./inversiones-flow"

// ── Props ──────────────────────────────────────────────────────

interface Props {
  onClose: () => void
  onOpenMercado: (ctx: "buy" | "search") => void
  onStartOnboarding: () => void
}

// ── Feature items ─────────────────────────────────────────────

const FEATURES = [
  {
    icon: Smartphone,
    title: "Tan simple como un pago QR",
    desc: "Interfaz diseñada para la velocidad.",
  },
  {
    icon: Globe,
    title: "Fracciones como en Cripto",
    desc: "Comprá el monto que querés, no necesitás la acción entera.",
  },
  {
    icon: Zap,
    title: "Inmediatez total",
    desc: "Tu dinero trabajando en el mercado global al instante.",
  },
]

// ── Ticker chip ───────────────────────────────────────────────

function TickerChip({ symbol }: { symbol: string }) {
  return (
    <div
      className="flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] font-semibold"
      style={{ background: "#e5e4e1", color: "#1c1c1a" }}
    >
      {symbol}
    </div>
  )
}

// ── Step ──────────────────────────────────────────────────────

function Step({
  number,
  title,
  subtitle,
  active,
  cta,
  onCta,
}: {
  number: number
  title: string
  subtitle: string
  active: boolean
  cta?: string
  onCta?: () => void
}) {
  return (
    <div className="flex gap-3.5 items-start">
      {/* Step circle */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[13px] font-bold"
        style={{
          background: active ? "#1c1c1a" : "rgba(28,28,26,0.08)",
          color: active ? "#ddf74c" : "rgba(28,28,26,0.3)",
          border: active ? "none" : "1.5px solid rgba(28,28,26,0.12)",
        }}
      >
        {active ? (
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
            <circle cx="8" cy="8" r="3" fill="#ddf74c" />
            <circle cx="8" cy="8" r="6.5" stroke="#ddf74c" strokeWidth="1" fill="none" />
          </svg>
        ) : (
          number
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[15px] font-semibold leading-tight"
          style={{ color: active ? "#1c1c1a" : "rgba(28,28,26,0.35)" }}
        >
          {title}
        </p>
        <p
          className="text-[12px] mt-0.5 leading-relaxed"
          style={{ color: active ? "rgba(28,28,26,0.55)" : "rgba(28,28,26,0.25)" }}
        >
          {subtitle}
        </p>
        {cta && active && onCta && (
          <motion.button
            onClick={onCta}
            whileTap={{ scale: 0.95 }}
            className="mt-2.5 flex items-center gap-1 text-[13px] font-semibold px-3 py-1.5 rounded-full"
            style={{ background: "#e5e4e1", color: "#1c1c1a" }}
          >
            {cta}
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────

export default function InversionesEmptyHome({ onClose, onOpenMercado, onStartOnboarding }: Props) {
  const tickerSymbols = STOCKS.slice(0, 8).map((s) => s.symbol)

  return (
    <div className="flex flex-col h-full" style={{ background: "#f5f4f1" }}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-2 pb-3 flex-shrink-0">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "#e5e4e1" }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
        </button>
        <span className="text-[17px] font-bold" style={{ color: "#1c1c1a" }}>
          Inversiones
        </span>
        <div className="flex items-center gap-1">
          {[LayoutList, TrendingUp, BarChart2, Search].map((Icon, i) => (
            <button
              key={i}
              onClick={i === 3 ? () => onOpenMercado("search") : undefined}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ color: "rgba(28,28,26,0.5)" }}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Divider ── */}
        <div className="mx-4 mb-4 mt-1" style={{ height: 1, background: "rgba(28,28,26,0.06)" }} />

        {/* ── Feature highlights ── */}
        <div className="px-5 mb-5">
          <h2 className="text-[20px] font-bold leading-snug mb-3" style={{ color: "#1c1c1a" }}>
            Tus empresas favoritas,
            <br />a un click de distancia.
          </h2>

          {/* ── Ticker row ── */}
          <div
            className="flex gap-2 pb-4 overflow-x-auto -mx-5 px-5"
            style={{ scrollbarWidth: "none", WebkitScrollbarWidth: "none" } as React.CSSProperties}
          >
            {tickerSymbols.map((sym) => (
              <TickerChip key={sym} symbol={sym} />
            ))}
          </div>

          <p className="text-[13px] leading-relaxed mb-4" style={{ color: "rgba(28,28,26,0.55)" }}>
            Invertí en Apple, Google o Tesla con la misma facilidad con la que comprás Bitcoin.
            Desde $100, sin vueltas.
          </p>
          <div className="flex flex-col gap-3.5">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#e5e4e1" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#1c1c1a" }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold" style={{ color: "#1c1c1a" }}>{title}</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: "rgba(28,28,26,0.5)" }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mx-4 mb-4" style={{ height: 1, background: "rgba(28,28,26,0.06)" }} />

        {/* ── Stepper ── */}
        <div className="px-5 pb-4 flex flex-col gap-5">
          {/* Connector line between steps */}
          <div className="relative">
            <div
              className="absolute left-[15px] top-9 w-0.5"
              style={{ height: "calc(100% - 36px)", background: "rgba(28,28,26,0.08)" }}
            />
            <div className="flex flex-col gap-5">
              <Step
                number={1}
                title="Completar tu perfil"
                subtitle="5 preguntas · menos de 1 min"
                active={true}
                cta="Empezar"
                onCta={onStartOnboarding}
              />
              <Step
                number={2}
                title="Comprá desde $100"
                subtitle="Elegí acciones o un pack recomendado para tu perfil."
                active={false}
              />
            </div>
          </div>
        </div>

        {/* Extra bottom space for CTA */}
        <div style={{ height: 80 }} />
      </div>

      {/* ── Sticky CTA ── */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-3"
        style={{
          background: "linear-gradient(to top, #f5f4f1 80%, transparent)",
        }}
      >
        <motion.button
          onClick={() => onOpenMercado("buy")}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2"
          style={{ background: "#1c1c1a", color: "#ffffff", height: 52 }}
        >
          Explorar mercado
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}
