"use client"

import { useState, useEffect, useRef } from "react"
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
    feedback: [
      "¡Qué bueno que te animás a dar el primer paso! Todos empezamos de cero.",
      "Buenísimo, ya diste tus primeros pasos. Vamos a convertir eso en un hábito.",
      "¡Genial! Ya tenés cancha en esto. Vamos a potenciar lo que ya sabés.",
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
    feedback: [
      "Te entiendo. Cuidar lo que te costó ganar es la prioridad número uno.",
      "Esa es la actitud. Hacer que el dinero trabaje para vos a mediano plazo es la base de todo.",
      "¡Me gusta ese perfil! Busquemos esas oportunidades con mayor potencial.",
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
    feedback: [
      "Claro, mantener la liquidez es clave cuando necesitás el dinero pronto.",
      "Un plazo de 1 a 3 años es ideal para que el interés compuesto empiece a hacer su magia.",
      "¡El tiempo es tu mejor aliado! Con ese horizonte se pueden buscar retornos mucho mejores.",
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
    feedback: [
      "Es normal sentir ese miedo. Por eso armamos un perfil que te permita estar tranquilo.",
      "Tenés temple. Entender que el mercado tiene ciclos es fundamental para invertir bien.",
      "¡Esa es la mirada de oportunidad! Es lo que separa a los inversores estratégicos.",
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
    feedback: [
      "Muy prudente para empezar. Siempre es mejor ir de a poco y ganar confianza.",
      "Un equilibrio sólido. Ese capital bien invertido empieza a mover la aguja de tus finanzas.",
      "¡Estás 100% comprometido con tu futuro! Vamos a asegurarnos de que esté bien diversificado.",
    ],
  },
]

const COMPLIANCE_QUESTIONS = [
  {
    id: "pep",
    question: "Antes de terminar, necesito consultarte un par de cosas.",
    subtitle: "¿Alguna de estas situaciones te aplica?",
    items: [
      "Soy Director Senior de una empresa que cotiza en bolsa",
      "Poseo más del 10% de una empresa que cotiza en bolsa",
      "Trabajo para un corredor de bolsa de EE.UU.",
    ] as readonly string[],
    options: ["Ninguna de las anteriores", "Sí, alguna aplica"] as readonly string[],
    feedback: ["Gracias, anotado. Casi terminamos.", "Entendido, lo tenemos en cuenta."],
  },
  {
    id: "usTax",
    question: "¿Sos ciudadano o residente fiscal de EE.UU.?",
    subtitle: undefined as string | undefined,
    items: undefined as readonly string[] | undefined,
    options: ["No tengo obligaciones fiscales en EE.UU.", "Sí, estoy sujeto a impuestos en EE.UU."] as readonly string[],
    feedback: ["Perfecto. Último paso.", "Registrado. Igual necesitamos el W-8BEN."],
  },
  {
    id: "w8ben",
    question: "Confirmá tu declaración para terminar.",
    subtitle: undefined as string | undefined,
    items: undefined as readonly string[] | undefined,
    certText:
      "Certifico que no soy ciudadano de EE. UU., residente extranjero en EE. UU. ni otra persona sujeta a impuestos en EE. UU., y estoy presentando el formulario W-8BEN para certificar mi condición de extranjero.",
    options: ["Confirmar y continuar"] as readonly string[],
    feedback: ["¡Listo! Ya tengo todo lo que necesito."],
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

// ── Typing dots ────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex gap-1.5 items-center py-1 px-0.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: "rgba(28,28,26,0.35)" }}
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 0.65, delay: i * 0.14, ease: "easeInOut" }}
        />
      ))}
    </div>
  )
}

// ── Limoncito Avatar ───────────────────────────────────────────

function LimAvatar({ size = 72 }: { size?: number }) {
  return (
    <img
      src={LIMONCITO}
      alt="Limoncito"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        mixBlendMode: "multiply",
        flexShrink: 0,
      }}
    />
  )
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

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.05 }}
        >
          <LimAvatar size={96} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="text-center"
        >
          <h1 className="text-[24px] font-extrabold leading-tight mb-2" style={{ color: "#1c1c1a" }}>
            Hola, soy Limoncito 🍋
          </h1>
          <p className="text-[14px] leading-relaxed" style={{ color: "rgba(28,28,26,0.55)" }}>
            Te voy a hacer <strong style={{ color: "#1c1c1a" }}>5 preguntas cortas</strong> para armar
            tu perfil inversor y mostrarte las mejores opciones para vos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2"
        >
          {["Personalizado", "Menos de 2 min"].map((t) => (
            <span
              key={t}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "#ddf74c", color: "#1c1c1a" }}
            >
              ✓ {t}
            </span>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
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

// ── Auto-advance progress bar ──────────────────────────────────

function AutoProgressBar({ duration }: { duration: number }) {
  return (
    <div
      className="w-full h-0.5 rounded-full overflow-hidden"
      style={{ background: "rgba(28,28,26,0.1)" }}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: "#1c1c1a" }}
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
      />
    </div>
  )
}

// ── Quiz Screen ────────────────────────────────────────────────

type QuizPhase = "typing" | "question" | "reaction"
const TYPING_DURATION = 750

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
  const [quizPhase, setQuizPhase] = useState<QuizPhase>("typing")
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const scoresRef = useRef<number[]>([])
  const REACTION_DURATION = 1800

  const isCompliance = stepIndex >= totalProfile
  const currentQ = !isCompliance ? QUESTIONS[stepIndex] : null
  const currentCQ = isCompliance ? COMPLIANCE_QUESTIONS[stepIndex - totalProfile] : null

  const options: readonly string[] = currentQ
    ? currentQ.options.map((o) => o.text)
    : currentCQ?.options ?? []

  const reactionText =
    selectedIdx !== null
      ? currentQ
        ? currentQ.feedback[selectedIdx]
        : currentCQ?.feedback[Math.min(selectedIdx, currentCQ.feedback.length - 1)] ?? ""
      : ""

  const advance = () => {
    const next = stepIndex + 1
    if (next >= totalSteps) {
      const total = scoresRef.current.reduce((a, b) => a + b, 0)
      onResult(total)
    } else {
      setStepIndex(next)
      setSelectedIdx(null)
      setQuizPhase("typing")
    }
  }

  const handleSelect = (optionIdx: number) => {
    if (quizPhase !== "question") return
    if (currentQ) scoresRef.current.push(currentQ.options[optionIdx].score)
    setSelectedIdx(optionIdx)
    setQuizPhase("reaction")
  }

  // Auto-advance from typing → question
  useEffect(() => {
    if (quizPhase !== "typing") return
    const t = setTimeout(() => setQuizPhase("question"), TYPING_DURATION)
    return () => clearTimeout(t)
  }, [quizPhase, stepIndex])

  // Auto-advance from reaction
  useEffect(() => {
    if (quizPhase !== "reaction") return
    const t = setTimeout(advance, REACTION_DURATION)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizPhase, stepIndex])

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
            className="text-[12px] font-semibold flex-shrink-0"
            style={{ color: "rgba(28,28,26,0.35)" }}
          >
            {stepIndex + 1}/{totalProfile}
          </span>
        )}
      </div>

      {/* Main content — animated between typing / question / reaction */}
      <AnimatePresence mode="wait" initial={false}>

        {/* ── TYPING phase ── */}
        {quizPhase === "typing" && (
          <motion.div
            key={`typing-${stepIndex}`}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
            className="flex-1 px-5 pt-2 pb-6"
          >
            <div className="flex items-end gap-3">
              <LimAvatar size={56} />
              <div
                className="px-4 py-3 rounded-2xl"
                style={{ background: "#e5e4e1", borderRadius: "16px 16px 16px 4px" }}
              >
                <TypingDots />
              </div>
            </div>
          </motion.div>
        )}

        {/* ── REACTION phase ── */}
        {quizPhase === "reaction" && (
          <motion.div
            key={`reaction-${stepIndex}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="flex-1 flex flex-col px-5 pt-2 pb-6 gap-4"
            onClick={advance}
            style={{ cursor: "pointer" }}
          >
            <div className="flex items-end gap-3">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <LimAvatar size={72} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="flex-1 px-4 py-3.5 rounded-2xl"
                style={{ background: "#e5e4e1", borderRadius: "16px 16px 16px 4px" }}
              >
                <p className="text-[15px] font-semibold leading-snug" style={{ color: "#1c1c1a" }}>
                  {reactionText}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="ml-[68px]"
            >
              <AutoProgressBar duration={REACTION_DURATION} />
            </motion.div>
          </motion.div>
        )}

        {/* ── QUESTION phase ── */}
        {quizPhase === "question" && (
          <motion.div
            key={`question-${stepIndex}`}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
            className="flex-1 overflow-y-auto px-5 pt-2 pb-6 flex flex-col"
          >
            {/* Limoncito + speech bubble */}
            <div className="flex items-end gap-3 mb-5">
              <div className="flex-shrink-0">
                <LimAvatar size={56} />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
                className="flex-1 px-4 py-3 rounded-2xl"
                style={{
                  background: "#e5e4e1",
                  borderRadius: "16px 16px 16px 4px",
                }}
              >
                {isCompliance && currentCQ && (
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-1" style={{ color: "rgba(28,28,26,0.4)" }}>
                    Cumplimiento regulatorio
                  </p>
                )}
                <p className="text-[15px] font-bold leading-snug" style={{ color: "#1c1c1a" }}>
                  {currentQ?.question ?? currentCQ?.question}
                </p>
                {currentCQ && "subtitle" in currentCQ && currentCQ.subtitle && (
                  <p className="text-[13px] mt-1 leading-snug" style={{ color: "rgba(28,28,26,0.6)" }}>
                    {currentCQ.subtitle}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Compliance bullet items */}
            {currentCQ?.items && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className="mb-4 rounded-2xl overflow-hidden"
                style={{ background: "rgba(28,28,26,0.05)", border: "1.5px solid rgba(28,28,26,0.07)" }}
              >
                {currentCQ.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 px-4 py-2.5"
                    style={{
                      borderBottom: i < (currentCQ.items?.length ?? 0) - 1
                        ? "1px solid rgba(28,28,26,0.07)"
                        : "none",
                    }}
                  >
                    <span className="text-[10px] font-bold mt-1 flex-shrink-0" style={{ color: "rgba(28,28,26,0.3)" }}>•</span>
                    <p className="text-[13px] leading-relaxed" style={{ color: "#1c1c1a" }}>{item}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* W-8BEN cert text */}
            {"certText" in (currentCQ ?? {}) && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                className="mb-4 px-4 py-3.5 rounded-2xl"
                style={{ background: "rgba(28,28,26,0.05)", border: "1.5px solid rgba(28,28,26,0.07)" }}
              >
                <p className="text-[12px] leading-relaxed" style={{ color: "rgba(28,28,26,0.6)" }}>
                  {(currentCQ as typeof COMPLIANCE_QUESTIONS[2]).certText}
                </p>
              </motion.div>
            )}

            {/* Options */}
            <div className="flex flex-col gap-2.5 mt-2">
              {options.map((text, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  onClick={() => handleSelect(i)}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left px-4 py-3.5 rounded-2xl flex items-center justify-between gap-3"
                  style={{
                    background: "#e5e4e1",
                    border: "1.5px solid rgba(28,28,26,0.07)",
                  }}
                >
                  <span className="text-[14px] font-medium leading-snug" style={{ color: "#1c1c1a" }}>
                    {text}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

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

        {/* Limoncito + message */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex items-end gap-3 w-full"
        >
          <LimAvatar size={56} />
          <div
            className="flex-1 px-4 py-3 text-[14px] font-semibold leading-snug"
            style={{ background: "#e5e4e1", borderRadius: "16px 16px 16px 4px", color: "#1c1c1a" }}
          >
            ¡Listo! Según tus respuestas, sos un inversor{" "}
            <strong>{profile.name}</strong> {profile.emoji}
          </div>
        </motion.div>

        {/* Profile badge */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 280, damping: 22 }}
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
          <p className="text-[11px] font-semibold uppercase tracking-widest mt-3" style={{ color: "rgba(28,28,26,0.4)" }}>
            Tu perfil inversor
          </p>
          <h1 className="text-[32px] font-extrabold leading-none" style={{ color: "#1c1c1a" }}>
            {profile.name}
          </h1>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full mt-1" style={{ background: "#e5e4e1" }}>
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
          transition={{ delay: 0.32 }}
          className="rounded-2xl px-4 py-3.5 w-full"
          style={{ background: "#e5e4e1" }}
        >
          <p className="text-[13px] leading-relaxed text-center" style={{ color: "rgba(28,28,26,0.75)" }}>
            {profile.description}
          </p>
        </motion.div>

        {/* Recommended */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.42 }}
          className="w-full"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5 text-center" style={{ color: "rgba(28,28,26,0.4)" }}>
            Te recomendamos
          </p>
          <div className="flex flex-col gap-2">
            {profile.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ x: -8, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.48 + i * 0.07 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: "#e5e4e1" }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: profile.color }} />
                <span className="text-[13px] font-medium" style={{ color: "#1c1c1a" }}>{tip}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
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
