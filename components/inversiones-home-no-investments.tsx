"use client"

import { motion } from "framer-motion"
import {
  ArrowLeft,
  LayoutList,
  TrendingUp,
  BarChart2,
  Search,
  ChevronRight,
} from "lucide-react"

// ── Profile metadata ───────────────────────────────────────────

const PROFILE_EMOJI: Record<string, string> = {
  Conservador: "🛡️",
  Moderado: "📈",
  Audaz: "⚡",
}

const PROFILE_DESC: Record<string, string> = {
  Conservador: "Baja volatilidad · protección del capital",
  Moderado: "Balance entre crecimiento y estabilidad",
  Audaz: "Alto crecimiento · mayor tolerancia al riesgo",
}

const PROFILE_COLOR: Record<string, string> = {
  Conservador: "#ddf74c",
  Moderado: "#ddf74c",
  Audaz: "#ddf74c",
}

// ── Props ──────────────────────────────────────────────────────

interface Props {
  onClose: () => void
  onOpenMercado: (ctx: "buy" | "search", profileFilter?: string) => void
  profileName: string
}

// ── Main Component ─────────────────────────────────────────────

export default function InversionesNoInvestments({
  onClose,
  onOpenMercado,
  profileName,
}: Props) {
  const emoji = PROFILE_EMOJI[profileName] ?? "✦"
  const desc = PROFILE_DESC[profileName] ?? "Tu perfil ya está listo"
  const badgeColor = PROFILE_COLOR[profileName] ?? "#ddf74c"

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

      {/* ── Divider ── */}
      <div className="mx-4 mt-1 mb-4" style={{ height: 1, background: "rgba(28,28,26,0.06)" }} />

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">

        {/* ── Profile badge ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-5 px-4 py-3.5 rounded-2xl flex items-center gap-3"
          style={{ background: badgeColor }}
        >
          <span className="text-[32px] leading-none">{emoji}</span>
          <div className="flex-1 min-w-0">
            <p
              className="text-[11px] font-semibold uppercase tracking-wide leading-tight"
              style={{ color: "rgba(28,28,26,0.5)" }}
            >
              Tu perfil inversor
            </p>
            <p
              className="text-[20px] font-bold leading-tight"
              style={{ color: "#1c1c1a" }}
            >
              {profileName || "Moderado"}
            </p>
            <p
              className="text-[11px] mt-0.5 leading-tight"
              style={{ color: "rgba(28,28,26,0.55)" }}
            >
              {desc}
            </p>
          </div>
        </motion.div>

        {/* ── Empty state ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="rounded-3xl px-5 pt-8 pb-7 flex flex-col items-center text-center"
          style={{ background: "#e5e4e1" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "#f5f4f1" }}
          >
            <TrendingUp className="w-7 h-7" style={{ color: "rgba(28,28,26,0.35)" }} />
          </div>
          <p className="text-[19px] font-bold leading-snug mb-2" style={{ color: "#1c1c1a" }}>
            Tu portafolio está vacío
          </p>
          <p
            className="text-[13px] leading-relaxed"
            style={{ color: "rgba(28,28,26,0.55)" }}
          >
            Ya tenés tu perfil listo. Explorá el mercado y hacé tu primera inversión con opciones recomendadas para vos.
          </p>
        </motion.div>

        {/* ── What you'll find ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mt-4"
        >
          <p
            className="text-[12px] font-semibold uppercase tracking-wide mb-3"
            style={{ color: "rgba(28,28,26,0.35)" }}
          >
            En el mercado vas a encontrar
          </p>
          <div className="flex flex-col gap-2.5">
            {[
              { emoji: "✓", label: "Opciones marcadas para tu perfil" },
              { emoji: "✓", label: "Acciones, ETFs y packs curados" },
              { emoji: "✓", label: "Comprá desde $100, sin complicaciones" },
            ].map(({ emoji, label }, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                  style={{ background: "#ddf74c", color: "#1c1c1a" }}
                >
                  {emoji}
                </span>
                <p className="text-[13px]" style={{ color: "rgba(28,28,26,0.7)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Sticky CTA ── */}
      <div
        className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-3"
        style={{ background: "linear-gradient(to top, #f5f4f1 80%, transparent)" }}
      >
        <motion.button
          onClick={() => onOpenMercado("buy", profileName || undefined)}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2"
          style={{ background: "#1c1c1a", color: "#ffffff", height: 52 }}
        >
          Empezar a invertir
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}
