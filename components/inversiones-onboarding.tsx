"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Sparkles, TrendingUp, Shield, Zap } from "lucide-react"

const LIMONCITO = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/limoncito_GIF-rQGFO9shjykrsnsqPJZms7LxyW6w8i.gif"

// ── Data ──────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 1,
    question: "¿Ya invertiste alguna vez?",
    options: [
      { text: "Nunca invertí", score: 1 },
      { text: "Probé alguna vez, pero no lo hago seguido", score: 2 },
      { text: "Invierto regularmente", score: 3 },
    ],
  },
  {
    id: 2,
    question: "¿Cuál es tu objetivo principal al invertir?",
    options: [
      { text: "Proteger mis ahorros de la inflación", score: 1 },
      { text: "Hacer crecer mi dinero a mediano plazo", score: 2 },
      { text: "Maximizar ganancias aunque implique más riesgo", score: 3 },
    ],
  },
  {
    id: 3,
    question: "¿En cuánto tiempo necesitarías ese dinero?",
    options: [
      { text: "Menos de un año", score: 1 },
      { text: "Entre 1 y 3 años", score: 2 },
      { text: "Más de 3 años", score: 3 },
    ],
  },
  {
    id: 4,
    question: "Tu inversión baja un 20% en un mes. ¿Qué hacés?",
    options: [
      { text: "Vendo todo para no perder más", score: 1 },
      { text: "Espero a que se recupere", score: 2 },
      { text: "Aprovecho y compro más barato", score: 3 },
    ],
  },
  {
    id: 5,
    question: "¿Qué parte de tus ahorros pensás destinar?",
    options: [
      { text: "Una parte pequeña (menos del 20%)", score: 1 },
      { text: "Una parte significativa (20% – 50%)", score: 2 },
      { text: "La mayor parte (más del 50%)", score: 3 },
    ],
  },
]

const COMPLIANCE_QUESTIONS = [
  {
    id: "pep",
    question: "¿Alguna de estas situaciones te aplica?",
    items: [
      "Soy Director Senior de una empresa que cotiza en bolsa",
      "Poseo más del 10% de una empresa que cotiza en bolsa",
      "Trabajo para un corredor de bolsa de EE.UU.",
    ] as readonly string[],
    options: ["Ninguna de las anteriores", "Sí, alguna aplica"] as readonly string[],
  },
  {
    id: "usTax",
    question: "¿Sos ciudadano o residente fiscal de EE.UU.?",
    items: undefined as readonly string[] | undefined,
    options: ["No, no tengo obligaciones fiscales en EE.UU.", "Sí, estoy sujeto a impuestos en EE.UU."] as readonly string[],
  },
  {
    id: "w8ben",
    question: "Último paso: confirmá tu declaración",
    items: undefined as readonly string[] | undefined,
    certText:
      "Certifico que no soy ciudadano de EE. UU., residente extranjero en EE. UU. ni otra persona sujeta a impuestos en EE. UU., y estoy presentando el formulario W-8BEN para certificar mi condición de extranjero.",
    options: ["Confirmar y continuar"] as readonly string[],
  },
] as const

// ── Profile Result ─────────────────────────────────────────────

function getProfile(score: number) {
  if (score <= 7) {
    return {
      name: "Conservador",
      emoji: "🛡️",
      color: "#3B82F6",
      bg: "#EFF6FF",
      description: "Priorizás la seguridad sobre la rentabilidad. Te van los instrumentos de bajo riesgo y alta liquidez.",
      tips: ["Fondos de dinero", "Plazos fijos UVA", "Bonos soberanos"],
      icon: Shield,
    }
  } else if (score <= 11) {
    return {
      name: "Moderado",
      emoji: "📈",
      color: "#F59E0B",
      bg: "#FFFBEB",
      description: "Buscás un equilibrio entre seguridad y crecimiento. Podés asumir algo de riesgo a cambio de mejores retornos.",
      tips: ["ETFs diversificados", "Acciones blue chip", "Bonos corporativos"],
      icon: TrendingUp,
    }
  } else {
    return {
      name: "Audaz",
      emoji: "⚡",
      color: "#8B5CF6",
      bg: "#F5F3FF",
      description: "Vas por el máximo retorno. Entendés que la volatilidad es parte del juego y sabés aprovecharla.",
      tips: ["Acciones de crecimiento", "Cripto", "Innovación disruptiva"],
      icon: Zap,
    }
  }
}

// ── Intro Screen ───────────────────────────────────────────────

function IntroScreen({ onStart, onClose }: { onStart: () => void; onClose: () => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#f5f4f1" }}>
      <div className="flex justify-end px-5 pt-4">
        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "#e5e4e1" }}
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="#1c1c1a" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </motion.button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 gap-6">
        {/* Limoncito mascot — small, not chatty */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.05 }}
          className="flex justify-center"
        >
          <img
            src={LIMONCITO}
            alt="Limoncito"
            className="w-20 h-20 object-contain"
            style={{ mixBlendMode: "multiply" }}
          />
        </motion.div>

        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="text-center"
        >
          <h1 className="text-[26px] font-extrabold leading-tight mb-2" style={{ color: "#1c1c1a" }}>
            Descubrí tu perfil<br />inversor
          </h1>
          <p className="text-[14px] leading-relaxed" style={{ color: "rgba(28,28,26,0.55)" }}>
            5 preguntas para mostrarte las opciones del mercado que mejor se adaptan a vos.
          </p>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32 }}
          className="flex gap-2 justify-center"
        >
          {["5 preguntas", "Menos de 2 min", "Personalizado"].map((t) => (
            <span
              key={t}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "#e5e4e1", color: "rgba(28,28,26,0.65)" }}
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.42 }}
        className="px-6 pb-8"
      >
        <motion.button
          onClick={onStart}
          whileTap={{ scale: 0.97 }}
          className="w-full h-14 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2"
          style={{ background: "#1c1c1a", color: "#ffffff" }}
        >
          Empezar
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </div>
  )
}

// ── Quiz Screen ────────────────────────────────────────────────

function QuizScreen({
  onResult,
  onClose,
}: {
  onResult: (score: number) => void
  onClose: () => void
}) {
  const totalProfile = QUESTIONS.length
  const totalCompliance = COMPLIANCE_QUESTIONS.length
  const totalSteps = totalProfile + totalCompliance

  const [stepIndex, setStepIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const scoresRef = useRef<number[]>([])

  const isCompliance = stepIndex >= totalProfile
  const profileIdx = stepIndex
  const complianceIdx = stepIndex - totalProfile

  const currentQ = !isCompliance ? QUESTIONS[profileIdx] : null
  const currentCQ = isCompliance ? COMPLIANCE_QUESTIONS[complianceIdx] : null
  const options: readonly string[] = currentQ
    ? currentQ.options.map((o) => o.text)
    : currentCQ?.options ?? []

  const handleSelect = (optionIdx: number) => {
    if (selected !== null) return
    setSelected(optionIdx)

    if (currentQ) {
      scoresRef.current.push(currentQ.options[optionIdx].score)
    }

    setTimeout(() => {
      const next = stepIndex + 1
      if (next >= totalSteps) {
        const total = scoresRef.current.reduce((a, b) => a + b, 0)
        onResult(total)
      } else {
        setStepIndex(next)
        setSelected(null)
      }
    }, 280)
  }

  const progressPct = isCompliance ? 100 : ((stepIndex + 1) / totalProfile) * 100

  return (
    <div className="flex flex-col h-full" style={{ background: "#f5f4f1" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3 flex-shrink-0">
        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "#e5e4e1" }}
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="#1c1c1a" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </motion.button>

        {/* Progress bar */}
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#e5e4e1" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "#ddf74c" }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {!isCompliance && (
          <span
            className="text-[12px] font-semibold flex-shrink-0 w-8 text-right"
            style={{ color: "rgba(28,28,26,0.35)" }}
          >
            {stepIndex + 1}/{totalProfile}
          </span>
        )}
      </div>

      {/* Animated question area */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepIndex}
          initial={{ x: 32, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 38 }}
          className="flex-1 overflow-y-auto px-5 pt-2 pb-6 flex flex-col"
        >
          {/* Section label */}
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "rgba(28,28,26,0.35)" }}
          >
            {isCompliance ? "Cumplimiento regulatorio" : `Pregunta ${stepIndex + 1} de ${totalProfile}`}
          </p>

          {/* Question text */}
          <h2 className="text-[22px] font-extrabold leading-snug mb-6" style={{ color: "#1c1c1a" }}>
            {currentQ?.question ?? currentCQ?.question}
          </h2>

          {/* Bullet items (compliance) */}
          {currentCQ?.items && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mb-5 rounded-2xl overflow-hidden"
              style={{ background: "#e5e4e1" }}
            >
              {currentCQ.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 px-4 py-3"
                  style={{
                    borderBottom:
                      i < (currentCQ.items?.length ?? 0) - 1
                        ? "1px solid rgba(28,28,26,0.07)"
                        : "none",
                  }}
                >
                  <span
                    className="text-[10px] font-bold mt-1 flex-shrink-0"
                    style={{ color: "rgba(28,28,26,0.35)" }}
                  >
                    •
                  </span>
                  <p className="text-[13px] leading-relaxed" style={{ color: "#1c1c1a" }}>
                    {item}
                  </p>
                </div>
              ))}
            </motion.div>
          )}

          {/* W-8BEN cert text */}
          {"certText" in (currentCQ ?? {}) && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mb-5 px-4 py-3.5 rounded-2xl"
              style={{ background: "#e5e4e1", border: "1.5px solid rgba(28,28,26,0.08)" }}
            >
              <p className="text-[12px] leading-relaxed" style={{ color: "rgba(28,28,26,0.6)" }}>
                {(currentCQ as typeof COMPLIANCE_QUESTIONS[2]).certText}
              </p>
            </motion.div>
          )}

          {/* Answer options */}
          <div className="flex flex-col gap-2.5 mt-auto">
            {options.map((text, i) => {
              const isSelected = selected === i
              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.06 }}
                  onClick={() => handleSelect(i)}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left px-4 py-4 rounded-2xl flex items-center justify-between gap-3 transition-colors"
                  style={{
                    background: isSelected ? "#1c1c1a" : "#e5e4e1",
                    border: isSelected ? "none" : "1.5px solid rgba(28,28,26,0.07)",
                  }}
                >
                  <span
                    className="text-[14px] font-medium leading-snug"
                    style={{ color: isSelected ? "#ffffff" : "#1c1c1a" }}
                  >
                    {text}
                  </span>
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 28 }}
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "#ddf74c" }}
                      >
                        <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="#1c1c1a"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Result Screen ──────────────────────────────────────────────

function ResultScreen({
  score,
  onGoToMercado,
}: {
  score: number
  onGoToMercado: (profileName: string) => void
}) {
  const profile = getProfile(score)
  const ProfileIcon = profile.icon

  return (
    <div className="absolute inset-0 overflow-y-auto" style={{ background: "#f5f4f1" }}>
      <div className="flex flex-col items-center px-6 pt-8 pb-8 gap-5 min-h-full">

        {/* Profile badge */}
        <motion.div
          initial={{ scale: 0.82, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 22 }}
          className="flex flex-col items-center gap-1"
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl relative"
            style={{ background: profile.bg, border: `2px solid ${profile.color}20` }}
          >
            {profile.emoji}
            <div
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "#ddf74c" }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: "#1c1c1a" }} />
            </div>
          </div>
          <p
            className="text-[11px] font-semibold uppercase tracking-widest mt-3"
            style={{ color: "rgba(28,28,26,0.4)" }}
          >
            Tu perfil inversor
          </p>
          <h1 className="text-[32px] font-extrabold leading-none" style={{ color: "#1c1c1a" }}>
            {profile.name}
          </h1>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full mt-1"
            style={{ background: "#e5e4e1" }}
          >
            <ProfileIcon className="w-3.5 h-3.5" style={{ color: profile.color }} />
            <span className="text-[11px] font-semibold" style={{ color: "#1c1c1a" }}>
              Puntaje: {score}/15
            </span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="rounded-2xl px-4 py-3.5 w-full"
          style={{ background: "#e5e4e1" }}
        >
          <p
            className="text-[13px] leading-relaxed text-center"
            style={{ color: "rgba(28,28,26,0.75)" }}
          >
            {profile.description}
          </p>
        </motion.div>

        {/* Recommended */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.38 }}
          className="w-full"
        >
          <p
            className="text-[11px] font-semibold uppercase tracking-wider mb-2.5 text-center"
            style={{ color: "rgba(28,28,26,0.4)" }}
          >
            Te recomendamos
          </p>
          <div className="flex flex-col gap-2">
            {profile.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ x: -8, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.44 + i * 0.07 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: "#e5e4e1" }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: profile.color }}
                />
                <span className="text-[13px] font-medium" style={{ color: "#1c1c1a" }}>
                  {tip}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62 }}
          className="w-full mt-auto pt-2"
        >
          <motion.button
            onClick={() => onGoToMercado(profile.name)}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2"
            style={{ background: "#1c1c1a", color: "#ffffff", height: 52 }}
          >
            Empezar
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────

interface Props {
  onComplete: () => void
  onGoToMercado: (profileName: string) => void
  onClose: () => void
}

type Phase = "intro" | "quiz" | "result"

export default function InversionesOnboarding({ onComplete, onGoToMercado, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("intro")
  const [finalScore, setFinalScore] = useState(0)

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: "#f5f4f1" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        {phase === "intro" && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ x: "-40%", opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="absolute inset-0"
          >
            <IntroScreen onStart={() => setPhase("quiz")} onClose={onClose} />
          </motion.div>
        )}

        {phase === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-40%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="absolute inset-0"
          >
            <QuizScreen
              onResult={(score) => {
                setFinalScore(score)
                setPhase("result")
              }}
              onClose={() => setPhase("intro")}
            />
          </motion.div>
        )}

        {phase === "result" && (
          <motion.div
            key="result"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 40 }}
            className="absolute inset-0"
          >
            <ResultScreen score={finalScore} onGoToMercado={onGoToMercado} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
