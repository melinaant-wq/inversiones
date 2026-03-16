"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight, Send } from "lucide-react"
import TutorialTooltip from "./tutorial-tooltip"

/* ── Typewriter speech bubble with cycling messages ────────── */
const BUBBLE_MESSAGES = [
  "\u00A1Bienvenido a tu nueva billetera Lemon!",
  "En Lemon, tu dinero crece cada segundo. Como ves arriba \u2191\u2191\u2191",
  "Mientras m\u00E1s dinero deposites, m\u00E1s crece el rendimiento.",
  "Buen d\u00EDa para usar tu Lemon Card, \u00BFno?",
  "El equipo de marketing quiere este espacio.",
  "\u00BFEscuchaste sobre Bitcoin? Es dinero m\u00E1gico.",
  "Hacen 30\u00B0C en Buenos Aires. Buen clima para un pago QR.",
  "Loco, ese asado que compraste estaba car\u00EDsimo. Mejor us\u00E1 la de cr\u00E9dito.",
  "\u00BFCopada la app, no?",
]

function getHumanDelay(char: string, prevChar: string): number {
  const base = 30 + Math.random() * 40
  if (",;:".includes(prevChar)) return base + 80 + Math.random() * 120
  if (".!?".includes(prevChar)) return base + 150 + Math.random() * 200
  if (prevChar === " ") return base + 20 + Math.random() * 60
  if (Math.random() < 0.08) return base + 80 + Math.random() * 100
  return base
}

function TypewriterBubble({ holdTime = 3500, pauseTime = 4000, initialDelay = 3000 }: { holdTime?: number; pauseTime?: number; initialDelay?: number }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [displayed, setDisplayed] = useState("")
  const [typing, setTyping] = useState(true)
  const [visible, setVisible] = useState(false)
  const isFirstMessage = useRef(true)
  const cancelled = useRef(false)

  useEffect(() => {
    cancelled.current = false
    const text = BUBBLE_MESSAGES[msgIndex]
    setDisplayed("")
    setTyping(true)

    const delay = isFirstMessage.current ? initialDelay : 0
    isFirstMessage.current = false

    const startTimer = setTimeout(() => {
      if (cancelled.current) return
      setVisible(true)
    }, delay)

    const typeTimer = setTimeout(() => {
      let i = 0
      const typeNext = () => {
        if (cancelled.current) return
        i++
        if (i > text.length) {
          setTyping(false)
          setTimeout(() => {
            if (cancelled.current) return
            setVisible(false)
            setTimeout(() => {
              if (cancelled.current) return
              setMsgIndex((prev) => (prev + 1) % BUBBLE_MESSAGES.length)
            }, pauseTime)
          }, holdTime)
          return
        }
        setDisplayed(text.slice(0, i))
        const d = getHumanDelay(text[i - 1], i >= 2 ? text[i - 2] : "")
        setTimeout(typeNext, d)
      }
      typeNext()
    }, delay)

    return () => {
      cancelled.current = true
      clearTimeout(startTimer)
      clearTimeout(typeTimer)
    }
  }, [msgIndex, holdTime, pauseTime, initialDelay])

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key={msgIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="relative rounded-2xl px-3 py-2.5 max-w-[140px]"
          style={{ background: "rgba(10,10,10,0.75)" }}
        >
          <p className="text-[13px] font-medium leading-snug" style={{ color: "#FFFFFF" }}>
            {displayed}
            {typing && (
              <span className="inline-block w-[2px] h-[14px] ml-[1px] align-middle animate-pulse" style={{ background: "#DBFF00" }} />
            )}
          </p>
          <div
            className="absolute top-1/2 -right-1.5"
            style={{
              width: 0,
              height: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderLeft: "8px solid rgba(10,10,10,0.75)",
              transform: "translateY(-50%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}


type HomeStage = "balance" | "savings" | "investments" | "cards" | "complete"

interface HomeScreenProps {
  currentStage: HomeStage
  initialPage?: number
  balance?: number
  onOpenCash?: () => void
  onOpenDollars?: () => void
  onOpenInvestments?: () => void
  onOpenCards?: () => void
  onOpenBalanceTotal?: () => void
  onDepositar?: () => void
  onCambiar?: () => void
  onComprar?: () => void
  onEnviar?: () => void
}

const tutorialConfig: Record<
  Exclude<HomeStage, "complete">,
  { message: string; emoji: string; position: "top" | "bottom" | "left" | "right" }
> = {
  balance: { message: "This is your balance. Your money always grows", emoji: "🌱", position: "bottom" },
  savings: { message: "Save in dollars. Earn 10% APY on your dollar account", emoji: "💵", position: "top" },
  investments: { message: "Grow your wealth. Crypto and stocks in one place", emoji: "📊", position: "top" },
  cards: { message: "Your Lemon Card. Pay anywhere, anytime", emoji: "💳", position: "top" },
}

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0, y: 15 },
  visible: {
    scale: 1, opacity: 1, y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30, mass: 0.6 },
  },
  highlight: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 20 },
  },
}

export default function HomeScreen({ currentStage, balance = 4000000, onOpenCash, onOpenCards, onDepositar, onCambiar, onComprar, onEnviar }: HomeScreenProps) {

  const balanceCardRef = useRef<HTMLDivElement>(null)
  const cardsCardRef = useRef<HTMLDivElement>(null)

  const stageOrder: HomeStage[] = ["balance", "savings", "investments", "cards", "complete"]
  const currentStageIndex = stageOrder.indexOf(currentStage)

  const showBalance = currentStageIndex >= 0
  const showCards = currentStageIndex >= 3
  const isComplete = currentStage === "complete"

  const highlightBalance = currentStage === "balance"
  const highlightCards = currentStage === "cards"
  const cardsActive = highlightCards || isComplete

  const activeTutorial = currentStage !== "complete" ? currentStage : null
  const activeRef = highlightBalance ? balanceCardRef : highlightCards ? cardsCardRef : null

  const formatBalance = (value: number) => {
    const dollars = Math.floor(value)
    const cents = value - dollars
    const centsStr = cents.toFixed(4).slice(2)
    return { dollars, centsStr }
  }

  const { dollars, centsStr } = formatBalance(balance)
  const formatARS = (value: number) => value.toLocaleString("es-AR")

  return (
    <div className="flex flex-col items-center justify-start pt-2 px-4 h-full relative overflow-hidden">
      {activeTutorial && activeRef && (
        <TutorialTooltip
          targetRef={activeRef}
          message={tutorialConfig[activeTutorial].message}
          emoji={tutorialConfig[activeTutorial].emoji}
          position={tutorialConfig[activeTutorial].position}
          show={true}
        />
      )}

      {/* Main balance card — combined with Lemon card header */}
      <div className="w-full max-w-[320px]">
        <AnimatePresence>
          {showBalance && (
            <motion.div
              ref={balanceCardRef}
              variants={cardVariants}
              initial="hidden"
              animate={highlightBalance ? ["visible", "highlight"] : "visible"}
              className="w-full relative"
              style={{ paddingTop: "44px" }}
            >
              {/* Lime card — behind, peeks below */}
              <div
                className="relative z-10 rounded-3xl overflow-hidden p-5 flex flex-col"
                style={{
                  background: "#DBFF00",
                  minHeight: "255px",
                  cursor: isComplete && onOpenCash ? "pointer" : "default",
                }}
                onClick={isComplete && onOpenCash ? onOpenCash : undefined}
              >
                <div>
                  <p className="text-[15px] font-medium" style={{ color: "rgba(10,10,10,0.55)" }}>Pesos</p>
                  <div className="flex items-baseline gap-0 mt-1">
                    <span className="text-[42px] font-bold tracking-tight leading-none" style={{ color: "#0A0A0A", fontVariantNumeric: "tabular-nums" }}>
                      {formatARS(dollars)}
                    </span>
                    <span className="text-[18px] font-normal leading-none" style={{ color: "rgba(10,10,10,0.35)", fontVariantNumeric: "tabular-nums", display: "inline-block", minWidth: "3.6ch" }}>
                      ,{centsStr}
                    </span>
                  </div>
                  <div className="mt-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-full"
                      style={{ background: "rgba(10,10,10,0.8)", color: "#DBFF00" }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ background: "#DBFF00" }} />
                      Crece 32% anual
                    </span>
                  </div>
                </div>

                {/* Limoncito mascot + speech bubble */}
                <div className="flex items-end justify-end gap-2 mt-auto pt-[30px]">
                  <TypewriterBubble />
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/limoncito_GIF-rQGFO9shjykrsnsqPJZms7LxyW6w8i.gif"
                    alt="Limoncito mascot"
                    className="w-28 h-28 object-contain flex-shrink-0"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
              </div>

              {/* Dark card — on top, absolute at top */}
              <div
                className="absolute top-0 inset-x-2 flex items-start justify-between px-5 pt-3 rounded-3xl"
                style={{
                  background: "#1c1c1a",
                  height: "88px",
                  cursor: isComplete && onOpenCards ? "pointer" : "default",
                }}
                onClick={isComplete && onOpenCards ? onOpenCards : undefined}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-4 rounded-[3px] flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <div className="w-3 h-2 rounded-[2px]" style={{ background: "rgba(255,255,255,0.5)" }} />
                  </div>
                  <span className="text-[14px] font-semibold" style={{ color: "#ffffff" }}>Lemon card</span>
                </div>
                <span className="text-[14px] font-medium tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>•• 1234</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        {showBalance && (
          <div className="flex gap-2 mt-5 w-full">
            <button
              onClick={onDepositar}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 font-medium text-[13px] rounded-full active:scale-95 transition-transform"
              style={{ border: "1.5px solid rgba(10,10,10,0.18)", background: "transparent", color: "#0A0A0A" }}
            >
              <ArrowDownLeft className="w-3.5 h-3.5 opacity-50" />
              Depositar
            </button>
            <button
              onClick={onCambiar}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 font-medium text-[13px] rounded-full active:scale-95 transition-transform"
              style={{ border: "1.5px solid rgba(10,10,10,0.18)", background: "transparent", color: "#0A0A0A" }}
            >
              <ArrowRightLeft className="w-3.5 h-3.5 opacity-50" />
              Cambiar
            </button>
            <button
              onClick={onEnviar}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 font-medium text-[13px] rounded-full active:scale-95 transition-transform"
              style={{ border: "1.5px solid rgba(10,10,10,0.18)", background: "transparent", color: "#0A0A0A" }}
            >
              <Send className="w-3.5 h-3.5 opacity-50" />
              Enviar
            </button>
          </div>
        )}
      </div>

    </div>
  )
}
