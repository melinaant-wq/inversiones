"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import TutorialTooltip from "./tutorial-tooltip"

interface OnboardingStepProps {
  step: {
    emoji?: string
    emojis?: string[]
    title: string
    subtitle?: string
    highlight?: boolean
    description: string
    isBalanceScreen?: boolean
    showSavings?: boolean
    showInvestments?: boolean
    showBorrow?: boolean
    showCards?: boolean
    isComplete?: boolean
    apy?: string
    initialBalance?: number
    savingsBalance?: number
    savingsApy?: string
    investmentsBalance?: number
    borrowLimit?: number
    activeCards?: number
  }
}

function HolographicOverlay({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <>
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[28px]"
        style={{
          background:
            "linear-gradient(105deg, transparent 20%, rgba(255,100,200,0.15) 30%, rgba(100,200,255,0.15) 40%, rgba(200,255,100,0.15) 50%, rgba(255,200,100,0.15) 60%, transparent 80%)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["200% 0%", "-200% 0%"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[28px] opacity-50"
        style={{
          background:
            "linear-gradient(195deg, transparent 30%, rgba(150,100,255,0.12) 45%, rgba(100,255,200,0.12) 55%, transparent 70%)",
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["-100% -100%", "200% 200%"],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,100,150,0.1), rgba(100,150,255,0.1), rgba(150,255,100,0.1), rgba(255,200,100,0.1))",
          padding: "1px",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />
    </>
  )
}

function SmallHolographicOverlay({
  active,
  color = "green",
}: { active: boolean; color?: "green" | "blue" | "purple" }) {
  if (!active) return null

  const colorMaps = {
    green: {
      primary: "rgba(34,197,94,0.2)",
      secondary: "rgba(16,185,129,0.2)",
      tertiary: "rgba(20,184,166,0.2)",
    },
    blue: {
      primary: "rgba(59,130,246,0.2)",
      secondary: "rgba(147,51,234,0.2)",
      tertiary: "rgba(34,197,94,0.2)",
    },
    purple: {
      primary: "rgba(168,85,247,0.2)",
      secondary: "rgba(249,115,22,0.2)",
      tertiary: "rgba(236,72,153,0.2)",
    },
  }

  const colors = colorMaps[color]

  return (
    <>
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[20px]"
        style={{
          background: `linear-gradient(105deg, transparent 20%, ${colors.primary} 35%, ${colors.secondary} 50%, ${colors.tertiary} 65%, transparent 80%)`,
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["200% 0%", "-200% 0%"],
        }}
        transition={{
          duration: 2.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[20px] opacity-60"
        style={{
          background: `linear-gradient(195deg, transparent 25%, ${colors.primary.replace("0.2", "0.15")} 40%, ${colors.secondary.replace("0.2", "0.15")} 60%, transparent 75%)`,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["-100% -100%", "200% 200%"],
        }}
        transition={{
          duration: 3.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </>
  )
}

function MiniChart() {
  const points = [20, 35, 28, 45, 40, 55, 48, 62, 58, 72, 68, 78]
  const width = 120
  const height = 40
  const padding = 4

  const xStep = (width - padding * 2) / (points.length - 1)
  const maxY = Math.max(...points)
  const minY = Math.min(...points)
  const yScale = (height - padding * 2) / (maxY - minY)

  const pathData = points
    .map((point, i) => {
      const x = padding + i * xStep
      const y = height - padding - (point - minY) * yScale
      return `${i === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  const areaPath = `${pathData} L ${padding + (points.length - 1) * xStep} ${height} L ${padding} ${height} Z`

  return (
    <svg width={width} height={height} className="absolute bottom-2 right-2 opacity-30">
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#chartGradient)" />
      <path d={pathData} fill="none" stroke="rgb(34, 197, 94)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CreditHealthMeter() {
  return (
    <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
      <svg width="100" height="60" viewBox="0 0 100 60">
        <defs>
          <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="25%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="75%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        {/* Meter arc background */}
        <path
          d="M 10 55 A 40 40 0 0 1 90 55"
          fill="none"
          stroke="url(#meterGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Meter arc filled (showing good credit) */}
        <path
          d="M 10 55 A 40 40 0 0 1 75 20"
          fill="none"
          stroke="url(#meterGradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Needle */}
        <motion.g
          initial={{ rotate: -45 }}
          animate={{ rotate: 35 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: "50px 55px" }}
        >
          <line x1="50" y1="55" x2="50" y2="25" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
          <circle cx="50" cy="55" r="5" fill="#1f2937" />
        </motion.g>
      </svg>
    </div>
  )
}

const tutorialConfig: Record<
  string,
  { message: string; emoji: string; position: "top" | "bottom" | "left" | "right" }
> = {
  balance: {
    message: "This is your balance. Your money always grows",
    emoji: "🌱",
    position: "bottom",
  },
  savings: {
    message: "Save in dollars. Earn 10% APY on your savings",
    emoji: "💵",
    position: "top", // Changed from "bottom" to "top" so it points down at the savings card
  },
  investments: {
    message: "Grow your wealth. Invest in stocks and crypto",
    emoji: "📊",
    position: "top", // Changed from "bottom" to "top" so it points down at the investments card
  },
  borrow: {
    message: "Fulfill your dreams with augmented capital",
    emoji: "💸",
    position: "top",
  },
  cards: {
    message: "Your Lemon Card. Pay anywhere, anytime",
    emoji: "💳",
    position: "top",
  },
}

export default function OnboardingStep({ step }: OnboardingStepProps) {
  const [balance, setBalance] = useState(step.initialBalance || 1000)
  const balanceRef = useRef(step.initialBalance || 1000)

  const [savingsBalance, setSavingsBalance] = useState(step.savingsBalance || 1300)
  const savingsRef = useRef(step.savingsBalance || 1300)

  const balanceCardRef = useRef<HTMLDivElement>(null)
  const savingsCardRef = useRef<HTMLDivElement>(null)
  const investmentsCardRef = useRef<HTMLDivElement>(null)
  const borrowCardRef = useRef<HTMLDivElement>(null)
  const cardsCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (step.isBalanceScreen) {
      const interval = setInterval(() => {
        const arsIncrement = 0.001 + Math.random() * 0.002
        balanceRef.current += arsIncrement
        setBalance(balanceRef.current)

        const savingsIncrement = 0.0003 + Math.random() * 0.0006
        savingsRef.current += savingsIncrement
        setSavingsBalance(savingsRef.current)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [step.isBalanceScreen])

  const formatBalance = (value: number) => {
    const dollars = Math.floor(value)
    const cents = value - dollars
    const centsStr = cents.toFixed(4).slice(2)
    return { dollars, centsStr }
  }

  const formatSavingsBalance = (value: number) => {
    const dollars = Math.floor(value)
    const cents = value - dollars
    const centsStr = cents.toFixed(2).slice(2)
    return { dollars, centsStr }
  }

  if (step.isBalanceScreen) {
    const { dollars, centsStr } = formatBalance(balance)
    const { dollars: savingsDollars, centsStr: savingsCentsStr } = formatSavingsBalance(savingsBalance)

    const highlightBalance =
      !step.isComplete && !step.showSavings && !step.showInvestments && !step.showBorrow && !step.showCards
    const highlightSavings =
      !step.isComplete && step.showSavings && !step.showInvestments && !step.showBorrow && !step.showCards
    const highlightInvestments = !step.isComplete && step.showInvestments && !step.showBorrow && !step.showCards
    const highlightBorrow = !step.isComplete && step.showBorrow && !step.showCards
    const highlightCards = !step.isComplete && step.showCards

    const activeTutorial = highlightBalance
      ? "balance"
      : highlightSavings
        ? "savings"
        : highlightInvestments
          ? "investments"
          : highlightBorrow
            ? "borrow"
            : highlightCards
              ? "cards"
              : null

    const activeRef =
      activeTutorial === "balance"
        ? balanceCardRef
        : activeTutorial === "savings"
          ? savingsCardRef
          : activeTutorial === "investments"
            ? investmentsCardRef
            : activeTutorial === "borrow"
              ? borrowCardRef
              : activeTutorial === "cards"
                ? cardsCardRef
                : null

    return (
      <div className="flex flex-col items-center justify-start pt-8 px-6 text-center h-full relative overflow-visible">
        {activeTutorial && activeRef && (
          <TutorialTooltip
            targetRef={activeRef}
            message={tutorialConfig[activeTutorial].message}
            emoji={tutorialConfig[activeTutorial].emoji}
            position={tutorialConfig[activeTutorial].position}
            show={true}
          />
        )}

        {/* Balance Card */}
        <motion.div
          ref={balanceCardRef}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-[280px] rounded-[28px] p-8 mb-4 relative overflow-hidden"
          style={{
            background: highlightBalance || step.isComplete ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow:
              highlightBalance || step.isComplete
                ? "0 12px 40px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 0 rgba(0, 0, 0, 0.02)"
                : "0 8px 24px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
            border:
              highlightBalance || step.isComplete
                ? "1px solid rgba(255, 255, 255, 0.6)"
                : "1px solid rgba(255, 255, 255, 0.3)",
            opacity: highlightBalance || step.isComplete ? 1 : 0.7,
          }}
        >
          <HolographicOverlay active={highlightBalance} />

          <div className="relative z-10">
            <p className="text-xs font-medium text-muted-foreground/60 tracking-wide mb-2 text-left">Cash</p>
            <div className="flex items-baseline justify-start gap-1 mb-3">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="flex items-baseline"
              >
                <span className="text-[38px] font-bold text-foreground tracking-tight">
                  ${dollars.toLocaleString()}.
                </span>
                <span
                  className="text-[28px] font-bold text-foreground tracking-tight tabular-nums"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {centsStr}
                </span>
              </motion.div>
              <span className="text-base text-muted-foreground font-medium ml-1">{step.subtitle}</span>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold"
              style={{
                background: "rgba(34, 197, 94, 0.12)",
                color: "rgb(22, 163, 74)",
              }}
            >
              <span>📈</span>
              {step.apy}
            </motion.div>
          </div>
        </motion.div>

        {/* Cards Row - Investments and Savings */}
        {(step.showSavings || step.showInvestments || step.showBorrow || step.showCards) && (
          <div className="flex flex-col gap-3 w-full max-w-[280px]">
            {/* Top Row: Investments and Savings */}
            <div className="flex gap-3 w-full">
              {/* Investments Card */}
              {step.showInvestments && (
                <motion.div
                  ref={investmentsCardRef}
                  initial={{ scale: 0.9, opacity: 0, x: -20 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="flex-1 rounded-[20px] p-4 relative overflow-hidden"
                  style={{
                    background:
                      highlightInvestments || step.isComplete
                        ? "rgba(255, 255, 255, 0.75)"
                        : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(30px)",
                    WebkitBackdropFilter: "blur(30px)",
                    boxShadow:
                      highlightInvestments || step.isComplete
                        ? "0 12px 40px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)"
                        : "0 8px 24px rgba(0, 0, 0, 0.04)",
                    border:
                      highlightInvestments || step.isComplete
                        ? "1px solid rgba(255, 255, 255, 0.6)"
                        : "1px solid rgba(255, 255, 255, 0.3)",
                    opacity: highlightInvestments || step.isComplete ? 1 : 0.7,
                  }}
                >
                  <SmallHolographicOverlay active={highlightInvestments} color="green" />
                  <MiniChart />

                  <div className="relative z-10">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-xs font-medium text-muted-foreground/70 tracking-wide">Investments</span>
                      <span className="text-sm">📊</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-[20px] font-bold text-foreground tracking-tight">
                        ${(step.investmentsBalance || 2500).toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">USD</span>
                    </div>
                    <div
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: "rgba(34, 197, 94, 0.12)",
                        color: "rgb(22, 163, 74)",
                      }}
                    >
                      +12.5%
                    </div>
                  </div>
                </motion.div>
              )}

              {!step.showInvestments && <div className="flex-1" />}

              {/* Savings Card */}
              <motion.div
                ref={savingsCardRef}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: step.showInvestments ? 0.3 : 0.3, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="flex-1 rounded-[20px] p-4 relative overflow-hidden"
                style={{
                  background:
                    highlightSavings || step.isComplete ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(30px)",
                  WebkitBackdropFilter: "blur(30px)",
                  boxShadow:
                    highlightSavings || step.isComplete
                      ? "0 12px 40px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)"
                      : "0 8px 24px rgba(0, 0, 0, 0.04)",
                  border:
                    highlightSavings || step.isComplete
                      ? "1px solid rgba(255, 255, 255, 0.6)"
                      : "1px solid rgba(255, 255, 255, 0.3)",
                  opacity: highlightSavings || step.isComplete ? 1 : 0.7,
                }}
              >
                <SmallHolographicOverlay active={highlightSavings} color="blue" />

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-medium text-muted-foreground/70 tracking-wide">Savings</span>
                    <span className="text-sm">🏦</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[20px] font-bold text-foreground tracking-tight">
                      ${savingsDollars.toLocaleString()}.
                    </span>
                    <span
                      className="text-[14px] font-bold text-foreground tracking-tight tabular-nums"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {savingsCentsStr}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">USD</span>
                  </div>
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{
                      background: "rgba(59, 130, 246, 0.12)",
                      color: "rgb(37, 99, 235)",
                    }}
                  >
                    {step.savingsApy}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom Row: Borrow and Cards */}
            {(step.showBorrow || step.showCards) && (
              <div className="flex gap-3 w-full">
                {/* Borrow Card */}
                <motion.div
                  ref={borrowCardRef}
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="flex-1 rounded-[20px] p-4 relative overflow-hidden"
                  style={{
                    background:
                      highlightBorrow || step.isComplete ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(30px)",
                    WebkitBackdropFilter: "blur(30px)",
                    boxShadow:
                      highlightBorrow || step.isComplete
                        ? "0 12px 40px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)"
                        : "0 8px 24px rgba(0, 0, 0, 0.04)",
                    border:
                      highlightBorrow || step.isComplete
                        ? "1px solid rgba(255, 255, 255, 0.6)"
                        : "1px solid rgba(255, 255, 255, 0.3)",
                    opacity: highlightBorrow || step.isComplete ? 1 : 0.7,
                  }}
                >
                  <SmallHolographicOverlay active={highlightBorrow} color="purple" />
                  <CreditHealthMeter />

                  <div className="relative z-10">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-xs font-medium text-muted-foreground/70 tracking-wide">Borrow</span>
                      <span className="text-sm">💸</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-[20px] font-bold text-foreground tracking-tight">
                        ${(step.borrowLimit || 5000).toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">USD</span>
                    </div>
                    <div
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: "rgba(168, 85, 247, 0.12)",
                        color: "rgb(147, 51, 234)",
                      }}
                    >
                      Excellent
                    </div>
                  </div>
                </motion.div>

                {/* Cards Card */}
                {step.showCards ? (
                  <motion.div
                    ref={cardsCardRef}
                    initial={{ scale: 0.9, opacity: 0, x: 20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="flex-1 rounded-[20px] p-4 relative overflow-hidden"
                    style={{
                      background:
                        highlightCards || step.isComplete ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.5)",
                      backdropFilter: "blur(30px)",
                      WebkitBackdropFilter: "blur(30px)",
                      boxShadow:
                        highlightCards || step.isComplete
                          ? "0 12px 40px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)"
                          : "0 8px 24px rgba(0, 0, 0, 0.04)",
                      border:
                        highlightCards || step.isComplete
                          ? "1px solid rgba(255, 255, 255, 0.6)"
                          : "1px solid rgba(255, 255, 255, 0.3)",
                      opacity: highlightCards || step.isComplete ? 1 : 0.7,
                    }}
                  >
                    <SmallHolographicOverlay active={highlightCards} color="green" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-xs font-medium text-muted-foreground/70 tracking-wide">Cards</span>
                        <Image
                          src="/images/image.png"
                          alt="Lemon Card"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-[20px] font-bold text-foreground tracking-tight">
                          {step.activeCards || 2}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">Active</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center px-8 text-center">
      {step.emojis ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="flex flex-col items-center gap-2 mb-10"
        >
          {step.emojis.map((emoji, index) => (
            <motion.span
              key={index}
              initial={{ y: -30, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.12,
                duration: 0.4,
                type: "spring",
                stiffness: 200,
              }}
              className="text-4xl"
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      ) : step.emoji ? (
        <motion.span
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 15 }}
          className="text-8xl mb-10"
        >
          {step.emoji}
        </motion.span>
      ) : null}

      <motion.h1
        initial={{ y: 25, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.45 }}
        className="text-[26px] font-semibold text-foreground mb-1 tracking-tight"
      >
        {step.title}
      </motion.h1>

      {step.subtitle && (
        <motion.h2
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className={`text-[32px] font-bold tracking-tight ${
            step.highlight
              ? "bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent"
              : "text-foreground"
          }`}
        >
          {step.subtitle} {step.highlight && <span className="text-amber-400">✨</span>}
        </motion.h2>
      )}

      {step.description && (
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="text-muted-foreground mt-5 text-base max-w-[240px] leading-relaxed"
        >
          {step.description}
        </motion.p>
      )}
    </div>
  )
}
