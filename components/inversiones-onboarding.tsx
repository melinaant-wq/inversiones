"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, X } from "lucide-react"
import { PACKS } from "./inversiones-flow"

// ── Types ────────────────────────────────────────────────────

export type InvestorProfile = "conservador" | "moderado" | "dinamico"

export const PROFILE_CONFIG: Record<
  InvestorProfile,
  {
    label: string
    emoji: string
    color: string
    bgLight: string
    description: string
    packId: string
  }
> = {
  conservador: {
    label: "Conservador",
    emoji: "🛡️",
    color: "#22c55e",
    bgLight: "#f0fdf4",
    description:
      "Priorizás preservar tu capital. Preferís inversiones estables con menor exposición al riesgo.",
    packId: "dividendos",
  },
  moderado: {
    label: "Moderado",
    emoji: "⚖️",
    color: "#3b82f6",
    bgLight: "#eff6ff",
    description:
      "Buscás un balance entre crecimiento y estabilidad. Aceptás cierta volatilidad para hacer crecer tu dinero.",
    packId: "sp500-core",
  },
  dinamico: {
    label: "Dinámico",
    emoji: "⚡",
    color: "#f97316",
    bgLight: "#fff7ed",
    description:
      "Alta tolerancia al riesgo. Apuntás a maximizar el crecimiento a largo plazo sin que los vaivenes te frenen.",
    packId: "tech-leaders",
  },
}

function calcProfile(scores: number[]): InvestorProfile {
  const total = scores.reduce((a, b) => a + b, 0)
  if (total <= 8) return "conservador"
  if (total <= 12) return "moderado"
  return "dinamico"
}

// ── Questions ─────────────────────────────────────────────────

const QUESTIONS = [
  {
    text: "¿Ya invertiste alguna vez?",
    options: [
      { text: "Nunca invertí", score: 1 },
      { text: "Probé alguna vez pero no lo hago seguido", score: 2 },
      { text: "Invierto regularmente (plazos fijos, cripto, acciones…)", score: 3 },
    ],
  },
  {
    text: "Al momento de invertir, ¿cuál es tu objetivo principal?",
    options: [
      { text: "Proteger mis ahorros de la inflación", score: 1 },
      { text: "Hacer crecer mi dinero a mediano plazo", score: 2 },
      { text: "Maximizar ganancias aunque implique más riesgo", score: 3 },
    ],
  },
  {
    text: "¿Cuál es tu horizonte de inversión?",
    options: [
      { text: "Menos de un año", score: 1 },
      { text: "De 1 a 3 años", score: 2 },
      { text: "De más de 3 años", score: 3 },
    ],
  },
  {
    text: "Si tu inversión bajara un 20% en un mes, ¿qué harías?",
    options: [
      { text: "Vendería todo para no perder más", score: 1 },
      { text: "Esperaría a que se recupere", score: 2 },
      { text: "Aprovecharía para comprar más barato", score: 3 },
    ],
  },
  {
    text: "¿Qué parte de tus ahorros pensás destinar a inversiones?",
    options: [
      { text: "Una parte pequeña (menos del 20%)", score: 1 },
      { text: "Una parte significativa (20% al 50%)", score: 2 },
      { text: "La mayor parte (más del 50%)", score: 3 },
    ],
  },
]

// ── Mini chart sparkline ──────────────────────────────────────

function Sparkline({ color = "white" }: { color?: string }) {
  return (
    <svg viewBox="0 0 90 28" fill="none" style={{ width: "100%", height: 28 }}>
      <polyline
        points="0,22 14,17 24,19 34,11 44,15 54,7 64,12 74,5 90,9"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.65"
      />
    </svg>
  )
}

// ── Stage 1: Value Proposition ────────────────────────────────

const BRAND_CARDS = [
  { name: "Nike", symbol: "NKE", bg: "#111111" },
  { name: "GE", symbol: "GE", bg: "#1a6fb5" },
  { name: "Coca‑Cola", symbol: "KO", bg: "#dc1c1c" },
  { name: "Walmart", symbol: "WMT", bg: "#0071CE" },
  { name: "Apple", symbol: "AAPL", bg: "#555555" },
  { name: "Amazon", symbol: "AMZN", bg: "#FF9900" },
]

function StageValueProp({
  onStart,
  onClose,
}: {
  onStart: () => void
  onClose: () => void
}) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#ffffff" }}>
      {/* Nav */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(28,28,26,0.07)" }}
        >
          <ArrowLeft size={16} color="#1c1c1a" />
        </button>
        <span className="text-[15px] font-semibold" style={{ color: "#1c1c1a" }}>
          Acciones
        </span>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(28,28,26,0.07)" }}
        >
          <span className="text-[12px] font-semibold" style={{ color: "rgba(28,28,26,0.5)" }}>✕✕✕</span>
        </button>
      </div>

      {/* Hero text */}
      <div className="px-6 pt-6">
        <h1 className="text-[34px] font-bold leading-[1.1]" style={{ color: "#1c1c1a" }}>
          Invertí en acciones<br />desde $100
        </h1>
        <p className="text-[15px] mt-3 leading-relaxed" style={{ color: "rgba(28,28,26,0.5)" }}>
          Comprá fracciones de las empresas más grandes del mundo y hacé crecer tu dinero.
        </p>
      </div>

      {/* Brand cards scroll */}
      <div className="mt-6 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-3 px-6 pb-1" style={{ width: "max-content" }}>
          {BRAND_CARDS.map((b) => (
            <div
              key={b.symbol}
              className="rounded-[18px] flex-shrink-0 flex flex-col justify-between"
              style={{ width: 126, height: 138, background: b.bg, padding: "16px 14px 12px" }}
            >
              <span className="text-[17px] font-bold text-white leading-tight">{b.name}</span>
              <div>
                <Sparkline />
                <span className="text-[11px] font-semibold mt-0.5 block" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {b.symbol}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="px-6 mt-5 flex flex-col gap-3">
        {[
          { icon: "💰", text: "Empezá con tan solo $100" },
          { icon: "🌎", text: "Más de 100 acciones y ETFs globales" },
          { icon: "📊", text: "Sin comisiones ocultas" },
        ].map((b) => (
          <div key={b.text} className="flex items-center gap-3">
            <span style={{ fontSize: 20 }}>{b.icon}</span>
            <span className="text-[14px] font-medium" style={{ color: "#1c1c1a" }}>
              {b.text}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="flex-1" />
      <div className="px-6 pb-8 pt-4 flex flex-col gap-3">
        <motion.button
          onClick={onStart}
          whileTap={{ scale: 0.97 }}
          className="w-full h-[52px] rounded-2xl font-semibold text-[16px]"
          style={{ background: "#1c1c1a", color: "white" }}
        >
          Empezar
        </motion.button>
        <button
          onClick={onClose}
          className="w-full h-[44px] rounded-xl text-[14px] font-medium"
          style={{ color: "rgba(28,28,26,0.45)" }}
        >
          Explorar primero
        </button>
      </div>
    </div>
  )
}

// ── Stage 2: Questions ────────────────────────────────────────

function StageQuestion({
  index,
  total,
  onAnswer,
  onBack,
}: {
  index: number
  total: number
  onAnswer: (score: number) => void
  onBack: () => void
}) {
  const q = QUESTIONS[index]
  const [selected, setSelected] = useState<number | null>(null)

  const handleSelect = (i: number, score: number) => {
    setSelected(i)
    setTimeout(() => {
      setSelected(null)
      onAnswer(score)
    }, 220)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#f5f4f1" }}>
      {/* Header + progress */}
      <div className="px-5 pt-5 pb-1">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(28,28,26,0.08)" }}
          >
            <ArrowLeft size={16} color="#1c1c1a" />
          </button>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(28,28,26,0.1)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#1c1c1a" }}
              initial={{ width: `${(index / total) * 100}%` }}
              animate={{ width: `${((index + 1) / total) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          <span className="text-[12px] font-semibold flex-shrink-0" style={{ color: "rgba(28,28,26,0.38)" }}>
            {index + 1}/{total}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="px-6 pt-4 pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(28,28,26,0.35)" }}>
          Pregunta {index + 1}
        </p>
        <h2 className="text-[24px] font-bold leading-[1.25]" style={{ color: "#1c1c1a" }}>
          {q.text}
        </h2>
      </div>

      {/* Options */}
      <div className="px-5 flex flex-col gap-2.5">
        {q.options.map((opt, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(i, opt.score)}
            className="w-full text-left px-5 py-4 rounded-2xl border transition-all"
            style={{
              background: selected === i ? "#1c1c1a" : "#ffffff",
              borderColor: selected === i ? "#1c1c1a" : "rgba(28,28,26,0.1)",
              color: selected === i ? "white" : "#1c1c1a",
            }}
          >
            <span className="text-[15px] font-medium leading-snug">{opt.text}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ── Stage 3: Profile Result ───────────────────────────────────

function StageResult({
  profile,
  onInvestPack,
  onExplore,
}: {
  profile: InvestorProfile
  onInvestPack: (packId: string) => void
  onExplore: () => void
}) {
  const cfg = PROFILE_CONFIG[profile]
  const pack = PACKS.find((p) => p.id === cfg.packId)

  return (
    <div className="flex flex-col h-full" style={{ background: "#f5f4f1" }}>
      {/* Profile hero */}
      <div className="px-6 pt-10 pb-6 flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5 text-[38px]"
          style={{ background: cfg.bgLight }}
        >
          {cfg.emoji}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="flex flex-col items-center"
        >
          <p
            className="text-[11px] font-bold uppercase tracking-widest mb-2"
            style={{ color: "rgba(28,28,26,0.38)" }}
          >
            Tu perfil de inversor
          </p>
          <div
            className="px-5 py-1.5 rounded-full mb-3"
            style={{ background: cfg.color }}
          >
            <span className="text-[22px] font-bold text-white">{cfg.label}</span>
          </div>
          <p className="text-[14px] leading-relaxed" style={{ color: "rgba(28,28,26,0.58)", maxWidth: 270 }}>
            {cfg.description}
          </p>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px" style={{ background: "rgba(28,28,26,0.08)" }} />

      {/* Recommended pack */}
      {pack && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mx-6 mt-4 rounded-2xl overflow-hidden"
        >
          <div className="px-5 py-4" style={{ background: pack.color }}>
            <p
              className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
              style={{ color: pack.darkText ? "rgba(28,28,26,0.45)" : "rgba(255,255,255,0.65)" }}
            >
              Pack recomendado para vos
            </p>
            <h3
              className="text-[20px] font-bold leading-tight"
              style={{ color: pack.darkText ? "#1c1c1a" : "white" }}
            >
              {pack.name}
            </h3>
            <p
              className="text-[13px] mt-1 leading-snug"
              style={{ color: pack.darkText ? "rgba(28,28,26,0.55)" : "rgba(255,255,255,0.75)" }}
            >
              {pack.description}
            </p>
            <div className="flex items-center gap-2.5 mt-3">
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{
                  background: "rgba(255,255,255,0.22)",
                  color: pack.darkText ? "#1c1c1a" : "white",
                }}
              >
                {pack.volatility} volatilidad
              </span>
              <span
                className="text-[12px] font-semibold"
                style={{ color: pack.darkText ? "#1c1c1a" : "rgba(255,255,255,0.9)" }}
              >
                +{pack.returnY}% últimos 12m
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* CTAs */}
      <div className="flex-1" />
      <div className="px-6 pb-8 pt-4 flex flex-col gap-2.5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => pack && onInvestPack(pack.id)}
          className="w-full h-[52px] rounded-2xl font-semibold text-[16px]"
          style={{ background: "#1c1c1a", color: "white" }}
        >
          Invertir en el pack recomendado
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onExplore}
          className="w-full h-[46px] rounded-2xl font-medium text-[15px] border"
          style={{ borderColor: "rgba(28,28,26,0.14)", color: "#1c1c1a", background: "white" }}
        >
          Explorar el mercado
        </motion.button>
      </div>
    </div>
  )
}

// ── Main Onboarding ───────────────────────────────────────────

type OnbStage =
  | { step: "value-prop" }
  | { step: "question"; index: number }
  | { step: "result"; profile: InvestorProfile }

interface Props {
  onComplete: (profile: InvestorProfile, goToPackId?: string) => void
  onSkip: () => void
  onClose: () => void
}

export default function InversionesOnboarding({ onComplete, onSkip, onClose }: Props) {
  const [stage, setStage] = useState<OnbStage>({ step: "value-prop" })
  const [answers, setAnswers] = useState<number[]>([])

  const handleAnswer = (score: number) => {
    const next = [...answers, score]
    setAnswers(next)
    if (next.length === QUESTIONS.length) {
      setStage({ step: "result", profile: calcProfile(next) })
    } else {
      setStage({ step: "question", index: next.length })
    }
  }

  const handleBack = () => {
    if (stage.step === "question") {
      const prev = [...answers]
      prev.pop()
      setAnswers(prev)
      if (stage.index === 0) {
        setStage({ step: "value-prop" })
      } else {
        setStage({ step: "question", index: stage.index - 1 })
      }
    }
  }

  const stageKey =
    stage.step === "question" ? `q${stage.index}` : stage.step

  return (
    <div className="flex-1 min-h-0 relative overflow-hidden" style={{ height: "100%" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={stageKey}
          initial={{ x: "60%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-35%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 40, mass: 0.85 }}
          className="absolute inset-0 flex flex-col overflow-hidden"
        >
          {stage.step === "value-prop" && (
            <StageValueProp
              onStart={() => setStage({ step: "question", index: 0 })}
              onClose={onSkip}
            />
          )}

          {stage.step === "question" && (
            <StageQuestion
              index={stage.index}
              total={QUESTIONS.length}
              onAnswer={handleAnswer}
              onBack={handleBack}
            />
          )}

          {stage.step === "result" && (
            <StageResult
              profile={stage.profile}
              onInvestPack={(packId) => onComplete(stage.profile, packId)}
              onExplore={() => onComplete(stage.profile)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
