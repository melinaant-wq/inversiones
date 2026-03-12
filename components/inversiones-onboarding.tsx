"use client"

import { useState, useCallback, useEffect, useRef } from "react"
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
      { text: "Probé alguna vez pero no lo hago seguido", score: 2 },
      { text: "Invierto regularmente (plazos fijos, cripto, acciones, etc.)", score: 3 },
    ],
    feedback: [
      "¡Qué bueno que te animás a dar el primer paso! Todos empezamos de cero y estamos acá para que esa primera vez sea tan simple como comprar un café.",
      "Buenísimo, ya diste tus primeros pasos. Ahora vamos a ayudarte a que invertir se vuelva un hábito natural.",
      "¡Genial! Ya tenés cancha en esto. Vamos a potenciar lo que ya sabés con la agilidad de nuestra plataforma.",
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
      "Te entiendo perfectamente. Cuidar lo que te costó ganar es la prioridad número uno.",
      "Esa es la actitud. Hacer que el dinero trabaje para vos a mediano plazo es la base de una buena salud financiera.",
      "¡Vas por todo! Me gusta ese perfil. Busquemos esas oportunidades con mayor potencial.",
    ],
  },
  {
    id: 3,
    question: "¿Cuál es tu horizonte de inversión?",
    options: [
      { text: "Menos de un año", score: 1 },
      { text: "De 1 a 3 años", score: 2 },
      { text: "De más de 3 años", score: 3 },
    ],
    feedback: [
      "Entendido. Mantener la liquidez es clave cuando necesitás el dinero pronto.",
      "Un plazo de 1 a 3 años es ideal para que el interés compuesto empiece a hacer su magia.",
      "¡Mentalidad de inversor profesional! El tiempo es tu mejor aliado para ganar en grande.",
    ],
  },
  {
    id: 4,
    question: "Si tu inversión bajara un 20% en un mes, ¿qué harías?",
    options: [
      { text: "Vendería todo para no perder más", score: 1 },
      { text: "Esperaría a que se recupere", score: 2 },
      { text: "Aprovecharía para comprar más barato", score: 3 },
    ],
    feedback: [
      "Es normal sentir ese miedo, a nadie le gusta ver rojo. Por eso, vamos a configurar un perfil que te permita dormir tranquilo.",
      "Tenés temple. Entender que el mercado tiene ciclos es fundamental.",
      "¡Esa es la mirada de oportunidad! Comprar en las bajas es lo que separa a los inversores estratégicos.",
    ],
  },
  {
    id: 5,
    question: "¿Qué parte de tus ahorros pensás destinar a inversiones?",
    options: [
      { text: "Una parte pequeña (menos del 20%)", score: 1 },
      { text: "Una parte significativa (20% al 50%)", score: 2 },
      { text: "La mayor parte (más del 50%)", score: 3 },
    ],
    feedback: [
      "Es una decisión muy prudente para empezar. Siempre es mejor ir probando el agua antes de tirarse de cabeza.",
      "Un equilibrio sólido. Destinar una buena parte a inversión es el motor que mueve la aguja de tus finanzas.",
      "¡Wow, estás 100% comprometido con tu futuro! Vamos a asegurarnos de que ese capital esté bien diversificado.",
    ],
  },
]

// ── Compliance Questions ───────────────────────────────────────

const COMPLIANCE_QUESTIONS = [
  {
    id: "pep",
    question: "Antes de terminar, necesito consultarte algunas cosas de cumplimiento regulatorio. ¿Alguna de estas situaciones aplica a vos?",
    items: [
      "Soy Director Senior de una empresa que cotiza en bolsa",
      "Poseo más del 10% de una empresa que cotiza en bolsa",
      "Trabajo para un corredor de bolsa de EE.UU.",
    ],
    options: ["Ninguna de las anteriores", "Sí, alguna aplica"],
    feedback: ["Gracias, anotado. Sigamos.", "Entendido, lo vamos a tener en cuenta."],
  },
  {
    id: "usTax",
    question: "¿Sos ciudadano estadounidense o estás sujeto a impuestos en EE.UU.?",
    items: undefined as string[] | undefined,
    options: ["No estoy sujeto a impuestos en EE.UU.", "Sí, estoy sujeto a impuestos en EE.UU."],
    feedback: [
      "Perfecto. Para finalizar, confirmá tu declaración W-8BEN.",
      "Registrado. Igual necesitamos que confirmes el formulario W-8BEN.",
    ],
  },
  {
    id: "w8ben",
    question: "Último paso. Confirmá tu declaración para completar tu perfil:",
    items: undefined as string[] | undefined,
    certText:
      "Certifico que no soy ciudadano de EE. UU., residente extranjero en EE. UU. ni otra persona sujeta a impuestos en EE. UU., y estoy presentando el formulario W-8BEN para certificar mi condición de extranjero y, si corresponde, reclamar los beneficios de un tratado fiscal.",
    options: ["Confirmar"],
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

// ── Types ─────────────────────────────────────────────────────

type ChatMsg = { id: string; from: "lim" | "user"; text: string; items?: readonly string[] | string[] }

// ── Limoncito Mini Avatar ─────────────────────────────────────

function LimAvatar({ size = 30 }: { size?: number }) {
  return (
    <img
      src={LIMONCITO}
      alt="Limoncito"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        borderRadius: "50%",
        flexShrink: 0,
        mixBlendMode: "multiply",
      }}
    />
  )
}

// ── Chat Bubble ────────────────────────────────────────────────

function Bubble({ msg }: { msg: ChatMsg }) {
  const isLim = msg.from === "lim"
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 28 }}
      className={`flex items-end gap-2 ${isLim ? "" : "flex-row-reverse"}`}
    >
      {isLim ? <LimAvatar /> : <div style={{ width: 30, flexShrink: 0 }} />}
      <div className="flex flex-col gap-1.5 max-w-[76%]">
        <div
          className="px-3.5 py-2.5 text-[14px] font-medium leading-relaxed"
          style={{
            background: isLim ? "#e5e4e1" : "#1c1c1a",
            color: isLim ? "#1c1c1a" : "#ffffff",
            borderRadius: isLim ? "16px 16px 16px 4px" : "16px 16px 4px 16px",
          }}
        >
          {msg.text}
        </div>
        {msg.items && (
          <div
            className="overflow-hidden"
            style={{ background: "#e5e4e1", borderRadius: "4px 16px 16px 16px" }}
          >
            {msg.items.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-2 px-3.5 py-2"
                style={{
                  borderBottom: i < msg.items!.length - 1 ? "1px solid rgba(28,28,26,0.08)" : "none",
                }}
              >
                <span className="text-[11px] mt-0.5 flex-shrink-0" style={{ color: "rgba(28,28,26,0.35)" }}>•</span>
                <p className="text-[12px] leading-relaxed" style={{ color: "#1c1c1a" }}>{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Typing Indicator ─────────────────────────────────────────

function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      className="flex items-end gap-2"
    >
      <LimAvatar />
      <div className="px-3.5 py-3.5" style={{ background: "#e5e4e1", borderRadius: "16px 16px 16px 4px" }}>
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "rgba(28,28,26,0.4)" }}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.65, delay: i * 0.16, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Intro Screen ───────────────────────────────────────────────

function IntroScreen({ onStart, onClose }: { onStart: () => void; onClose: () => void }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#f5f4f1" }}>
      <div className="flex justify-end px-5 pt-3 pb-1">
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

      <div className="flex-1 flex flex-col items-center justify-center px-7 gap-5">
        {/* Limoncito big */}
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.1 }}
        >
          <img
            src={LIMONCITO}
            alt="Limoncito"
            className="w-28 h-28 object-contain"
            style={{ mixBlendMode: "multiply" }}
          />
        </motion.div>

        {/* Speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.28, type: "spring", stiffness: 280, damping: 26 }}
          className="w-full relative px-4 py-4 rounded-2xl"
          style={{ background: "#e5e4e1" }}
        >
          {/* bubble tail pointing up towards Limoncito */}
          <div
            className="absolute -top-2.5 left-10 w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "12px solid #e5e4e1",
            }}
          />
          <p className="text-[15px] font-bold mb-1" style={{ color: "#1c1c1a" }}>
            ¡Hola! Soy Limoncito 🍋
          </p>
          <p className="text-[13px] leading-relaxed" style={{ color: "rgba(28,28,26,0.65)" }}>
            Voy a hacerte <strong>5 preguntas cortas</strong> para armar tu perfil
            inversor y mostrarte las mejores opciones para vos.
          </p>
        </motion.div>

        {/* Feature tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="flex gap-2 justify-center"
        >
          {["✓  Personalizado", "✓  2 minutos"].map((t, i) => (
            <span
              key={i}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "#ddf74c", color: "#1c1c1a" }}
            >
              {t}
            </span>
          ))}
        </motion.div>

      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="px-6 pb-7"
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

// ── Chat Screen (Q&A) ─────────────────────────────────────────

function ChatScreen({
  onResult,
  onClose,
}: {
  onResult: (score: number) => void
  onClose: () => void
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [showOptions, setShowOptions] = useState(false)
  const [isTyping, setIsTyping] = useState(true)
  const [locked, setLocked] = useState(false)
  const [complianceStep, setComplianceStep] = useState(-1) // -1 = profile mode
  const scrollRef = useRef<HTMLDivElement>(null)
  const scoresRef = useRef<number[]>([])

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 40)
  }, [])

  const addMsg = useCallback(
    (from: "lim" | "user", text: string, items?: readonly string[] | string[]) => {
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-${Math.random()}`, from, text, items },
      ])
      scrollToBottom()
    },
    [scrollToBottom]
  )

  // Show first question on mount
  useEffect(() => {
    const t = setTimeout(() => {
      setIsTyping(false)
      addMsg("lim", QUESTIONS[0].question)
      setShowOptions(true)
    }, 900)
    return () => clearTimeout(t)
  }, [addMsg])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, showOptions, scrollToBottom])

  const handleAnswer = useCallback(
    (optionIdx: number) => {
      if (locked) return
      setLocked(true)

      const capturedQ = currentQ
      const q = QUESTIONS[capturedQ]
      const score = q.options[optionIdx].score
      scoresRef.current = [...scoresRef.current, score]

      setShowOptions(false)
      addMsg("user", q.options[optionIdx].text)

      // Show typing → feedback
      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          addMsg("lim", q.feedback[optionIdx])

          const nextIdx = capturedQ + 1

          if (nextIdx < QUESTIONS.length) {
            // Next question
            setTimeout(() => {
              setIsTyping(true)
              setTimeout(() => {
                setIsTyping(false)
                addMsg("lim", QUESTIONS[nextIdx].question)
                setCurrentQ(nextIdx)
                setShowOptions(true)
                setLocked(false)
              }, 650)
            }, 950)
          } else {
            // Profile done → start compliance flow
            setTimeout(() => {
              setIsTyping(true)
              setTimeout(() => {
                setIsTyping(false)
                const cq = COMPLIANCE_QUESTIONS[0]
                addMsg("lim", cq.question, cq.items)
                setComplianceStep(0)
                setShowOptions(true)
                setLocked(false)
              }, 700)
            }, 950)
          }
        }, 680)
      }, 220)
    },
    [currentQ, locked, addMsg]
  )

  const handleComplianceAnswer = useCallback(
    (optionIdx: number) => {
      if (locked) return
      setLocked(true)

      const capturedStep = complianceStep
      const cq = COMPLIANCE_QUESTIONS[capturedStep]
      setShowOptions(false)
      addMsg("user", cq.options[optionIdx])

      setTimeout(() => {
        setIsTyping(true)
        setTimeout(() => {
          setIsTyping(false)
          const fbIdx = Math.min(optionIdx, cq.feedback.length - 1)
          addMsg("lim", cq.feedback[fbIdx])

          const nextStep = capturedStep + 1

          if (nextStep < COMPLIANCE_QUESTIONS.length) {
            setTimeout(() => {
              setIsTyping(true)
              setTimeout(() => {
                setIsTyping(false)
                const ncq = COMPLIANCE_QUESTIONS[nextStep]
                addMsg("lim", ncq.question, ncq.items)
                setComplianceStep(nextStep)
                setShowOptions(true)
                setLocked(false)
              }, 650)
            }, 950)
          } else {
            // All compliance done → result
            const total = scoresRef.current.reduce((a, b) => a + b, 0)
            setTimeout(() => {
              setIsTyping(true)
              setTimeout(() => {
                setIsTyping(false)
                const profile = getProfile(total)
                addMsg(
                  "lim",
                  `¡Perfecto! Ya tengo todo lo que necesito. Tu perfil inversor es ${profile.name} ${profile.emoji}`
                )
                setTimeout(() => onResult(total), 1200)
              }, 700)
            }, 950)
          }
        }, 680)
      }, 220)
    },
    [complianceStep, locked, addMsg, onResult]
  )

  return (
    <div className="flex flex-col h-full" style={{ background: "#f5f4f1" }}>
      {/* Chat header */}
      <div
        className="flex items-center justify-between px-4 pt-3 pb-2.5 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(28,28,26,0.07)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <LimAvatar size={38} />
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{ background: "#4ade80", borderColor: "#f5f4f1" }}
            />
          </div>
          <p className="text-[14px] font-bold leading-none" style={{ color: "#1c1c1a" }}>
            Limoncito
          </p>
        </div>
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

      {/* Progress bar */}
      <div className="px-4 pt-2 pb-1 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "#e5e4e1" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#ddf74c" }}
              animate={{
                width: `${((currentQ + (showOptions ? 0 : 1)) / QUESTIONS.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span
            className="text-[11px] font-semibold flex-shrink-0"
            style={{ color: "rgba(28,28,26,0.35)" }}
          >
            {Math.min(currentQ + (showOptions ? 0 : 1), QUESTIONS.length)}/{QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3"
        style={{ scrollbarWidth: "none" }}
      >
        {messages.map((msg) => (
          <Bubble key={msg.id} msg={msg} />
        ))}
        <AnimatePresence>{isTyping && <TypingBubble />}</AnimatePresence>
      </div>

      {/* Answer options */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 340, damping: 32 }}
            className="flex-shrink-0 px-4 pt-2 pb-5 flex flex-col gap-2"
            style={{ borderTop: "1px solid rgba(28,28,26,0.07)" }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-wider pt-1 pb-0.5 text-right"
              style={{ color: "rgba(28,28,26,0.3)" }}
            >
              Tu respuesta
            </p>

            {complianceStep === -1 ? (
              /* ── Profile question options ── */
              QUESTIONS[currentQ].options.map((opt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => handleAnswer(i)}
                  whileTap={{ scale: 0.97 }}
                  className="w-full text-left px-4 py-3 text-[13px] font-medium leading-snug"
                  style={{
                    background: "#e5e4e1",
                    color: "#1c1c1a",
                    borderRadius: "14px 14px 4px 14px",
                    border: "1.5px solid rgba(28,28,26,0.08)",
                  }}
                >
                  {opt.text}
                </motion.button>
              ))
            ) : (
              /* ── Compliance options ── */
              <>
                {/* W-8BEN cert text card */}
                {"certText" in COMPLIANCE_QUESTIONS[complianceStep] && (
                  <div
                    className="px-3.5 py-3 mb-1 rounded-2xl"
                    style={{ background: "#e5e4e1", border: "1.5px solid rgba(28,28,26,0.08)" }}
                  >
                    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(28,28,26,0.65)" }}>
                      {(COMPLIANCE_QUESTIONS[complianceStep] as typeof COMPLIANCE_QUESTIONS[2]).certText}
                    </p>
                  </div>
                )}
                {COMPLIANCE_QUESTIONS[complianceStep].options.map((opt, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => handleComplianceAnswer(i)}
                    whileTap={{ scale: 0.97 }}
                    className="w-full text-left px-4 py-3 text-[13px] font-medium leading-snug"
                    style={{
                      background: i === 0 ? "#1c1c1a" : "#e5e4e1",
                      color: i === 0 ? "#ffffff" : "#1c1c1a",
                      borderRadius: "14px 14px 4px 14px",
                      border: "1.5px solid rgba(28,28,26,0.08)",
                    }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </>
            )}
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
      <div className="flex flex-col items-center px-6 pt-6 pb-6 gap-4 min-h-full">
        {/* Limoncito + speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="flex items-end gap-3 w-full"
        >
          <img
            src={LIMONCITO}
            alt="Limoncito"
            className="w-16 h-16 object-contain flex-shrink-0"
            style={{ mixBlendMode: "multiply" }}
          />
          <div
            className="flex-1 px-4 py-3 text-[14px] leading-relaxed font-medium"
            style={{
              background: "#e5e4e1",
              color: "#1c1c1a",
              borderRadius: "16px 16px 16px 4px",
            }}
          >
            ¡Listo! Según tus respuestas, sos un inversor{" "}
            <strong>{profile.name}</strong> {profile.emoji}
          </div>
        </motion.div>

        {/* Profile badge */}
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 280, damping: 24 }}
          className="flex flex-col items-center gap-1"
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl relative"
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
            className="text-[11px] font-semibold uppercase tracking-widest mt-2"
            style={{ color: "rgba(28,28,26,0.4)" }}
          >
            Tu perfil inversor
          </p>
          <h1
            className="text-[30px] font-extrabold leading-none"
            style={{ color: "#1c1c1a" }}
          >
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
          transition={{ delay: 0.4, duration: 0.35 }}
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
          transition={{ delay: 0.5, duration: 0.35 }}
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
                transition={{ delay: 0.55 + i * 0.07 }}
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
          transition={{ delay: 0.75, duration: 0.4 }}
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

export type OnboardingScreen =
  | { type: "intro" }
  | { type: "question"; index: number; scores: number[] }
  | { type: "result"; score: number }

interface Props {
  onComplete: () => void
  onGoToMercado: (profileName: string) => void
  onClose: () => void
}

type Phase = "intro" | "chat" | "result"

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
            transition={{ duration: 0.26 }}
            className="absolute inset-0"
          >
            <IntroScreen onStart={() => setPhase("chat")} onClose={onClose} />
          </motion.div>
        )}

        {phase === "chat" && (
          <motion.div
            key="chat"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-40%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            className="absolute inset-0"
          >
            <ChatScreen
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
