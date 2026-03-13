"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"
import BottomNav from "./bottom-nav"
import { UserConfigProvider, useUserConfig } from "@/lib/user-config"
import AppHeader from "./app-header"
import HomeScreen from "./home-screen"
import ActivityScreen from "./activity-screen"
import PortfolioScreen from "./portfolio-screen"
import RedPillScreen from "./red-pill-screen"
import FincraftScreen from "./fincraft-screen"
import DollarsScreen from "./dollars-screen"
import InversionesFlow from "./inversiones-flow"
import DevStatePanel from "./dev-state-panel"
import CardsScreen from "./cards-screen"
import CashScreen from "./cash-screen"
import BalanceTotalScreen from "./balance-total-screen"
import ProfilePanel from "./profile-panel"

type Phase = "intro" | "app"

/* ── Emoji sequence for the vertical reel ────────────────── */
const EMOJI_SEQUENCE = [
  "\uD83C\uDF4B", "\uD83E\uDD11", "\uD83D\uDCA3", "\uD83D\uDCC8", "\uD83D\uDCB8",
  "\uD83C\uDFE6", "\uD83D\uDC8E", "\uD83D\uDE80", "\uD83C\uDFB0", "\uD83D\uDCB5",
  "\uD83E\uDE99", "\uD83D\uDCC9", "\uD83C\uDFAF", "\u26A1", "\u2B50",
  "\uD83D\uDCB0", "\u2728",
]

/* ── Single vertical emoji reel ──────────────────────────── */
function EmojiReel({ started, onCycleComplete }: { started: boolean; onCycleComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!started) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        if (next >= EMOJI_SEQUENCE.length) {
          clearInterval(interval)
          onCycleComplete()
          return EMOJI_SEQUENCE.length - 1
        }
        return next
      })
    }, 90)
    return () => clearInterval(interval)
  }, [started, onCycleComplete])

  return (
    <div
      className="relative overflow-hidden inline-flex items-center justify-center"
      style={{ width: 64, height: 64 }}
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={currentIndex}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.8 }}
          className="text-[48px] leading-none absolute"
        >
          {EMOJI_SEQUENCE[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

/* ── Intro Screen ───────────────────────────────────────── */
function IntroScreen({ onContinue }: { onContinue: () => void }) {
  const [reelStarted, setReelStarted] = useState(false)
  const [showMagicMoney, setShowMagicMoney] = useState(false)

  const handleStart = useCallback(() => setReelStarted(true), [])
  const handleCycleComplete = useCallback(() => {
    setTimeout(() => setShowMagicMoney(true), 300)
  }, [])

  return (
    <div className="relative flex flex-col h-full px-8">
      <div className="absolute inset-x-8 flex flex-col items-center" style={{ top: "28%" }}>
        <span className="text-[24px] font-semibold tracking-wide mb-4" style={{ color: "rgba(28,28,26,0.5)" }}>
          Bienvenido a
        </span>
        <EmojiReel started={reelStarted} onCycleComplete={handleCycleComplete} />
      </div>

      <AnimatePresence>
        {showMagicMoney && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-x-8 flex flex-col items-center"
            style={{ top: "52%" }}
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-[42px] font-bold leading-none px-4 py-1.5 rounded-xl" style={{ background: "#ddf74c", color: "#1c1c1a" }}>
                Dinero
              </span>
              <span className="text-[42px] font-bold leading-none mt-1" style={{ color: "#1c1c1a" }}>
                {"M\u00E1gico"}
              </span>
            </div>
            <span className="text-[14px] font-medium tracking-wide mt-5" style={{ color: "rgba(28,28,26,0.4)" }}>
              {"M\u00E1s fuerte, mejor, m\u00E1s r\u00E1pido"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1" />

      <div className="flex items-center justify-center gap-6 pb-6">
        <div className="flex items-center gap-1.5">
          <div className="rounded-full transition-all duration-300" style={{ width: !showMagicMoney ? 20 : 6, height: 6, background: !showMagicMoney ? "#1c1c1a" : "rgba(28,28,26,0.15)" }} />
          <div className="rounded-full transition-all duration-300" style={{ width: showMagicMoney ? 20 : 6, height: 6, background: showMagicMoney ? "#1c1c1a" : "rgba(28,28,26,0.15)" }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(28,28,26,0.15)" }} />
        </div>
        <motion.button
          onClick={!reelStarted ? handleStart : showMagicMoney ? onContinue : undefined}
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "#1c1c1a", opacity: reelStarted && !showMagicMoney ? 0.3 : 1, pointerEvents: reelStarted && !showMagicMoney ? "none" : "auto" }}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </div>
  )
}

/* ── Root export — wraps with UserConfigProvider ────────── */
export default function OnboardingFlow() {
  return (
    <UserConfigProvider>
      <OnboardingFlowContent />
      <DevStatePanel />
    </UserConfigProvider>
  )
}

/* ── Inner app shell ────────────────────────────────────── */
function OnboardingFlowContent() {
  const {
    hasAccount,
    setHasAccount,
    hasInvestments,
    setHasInvestments,
    setProfileName,
    setProfileComplete,
  } = useUserConfig()
  const [phase, setPhase] = useState<Phase>("intro")
  const [activeTab, setActiveTab] = useState("home")
  const [showRedPill, setShowRedPill] = useState(false)
  const [showFincraft, setShowFincraft] = useState(false)
  const [showDollars, setShowDollars] = useState(false)
  const [showInvestments, setShowInvestments] = useState(false)
  const [showCards, setShowCards] = useState(false)
  const [showCash, setShowCash] = useState(false)
  const [showBalanceTotal, setShowBalanceTotal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const clearOverlays = () => {
    setShowRedPill(false)
    setShowFincraft(false)
    setShowDollars(false)
    setShowInvestments(false)
    setShowCards(false)
    setShowCash(false)
    setShowBalanceTotal(false)
    setShowProfile(false)
  }

  const handleTabChange = (tab: string) => {
    clearOverlays()
    setActiveTab(tab)
  }

  const handleOpenRedPill = () => setShowRedPill(true)
  const handleCloseRedPill = () => setShowRedPill(false)
  const handleOpenFincraft = () => { setShowRedPill(false); setShowFincraft(true) }
  const handleCloseFincraft = () => setShowFincraft(false)
  const handleOpenDollars = () => setShowDollars(true)
  const handleCloseDollars = () => setShowDollars(false)
  const handleOpenInvestments = () => setShowInvestments(true)
  const handleCloseInvestments = () => setShowInvestments(false)
  const handleOpenCards = () => setShowCards(true)
  const handleCloseCards = () => setShowCards(false)
  const handleOpenCash = () => setShowCash(true)
  const handleCloseCash = () => setShowCash(false)
  const handleOpenBalanceTotal = () => setShowBalanceTotal(true)
  const handleCloseBalanceTotal = () => setShowBalanceTotal(false)
  const handleOpenProfile = () => setShowProfile(true)
  const handleCloseProfile = () => setShowProfile(false)

  const goToApp = useCallback(() => setPhase("app"), [])

  const isApp = phase === "app"
  const anyOverlay = showRedPill || showFincraft || showDollars || showInvestments || showCards || showCash || showBalanceTotal
  const isHomePristine = isApp && activeTab === "home" && !anyOverlay

  // Portfolio grafico background
  const isPortfolioGrafico = isApp && activeTab === "portfolio"

  return (
    <div className="flex flex-col items-center gap-4">
    <div
      className="relative w-[360px] h-[800px] rounded-[50px] overflow-hidden transition-colors duration-300"
      style={{
        background: "#f5f4f1",
        boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0,0,0,0.08)",
      }}
    >
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 pt-1 z-10">
        <span className="text-[11px] font-semibold tracking-wider text-foreground/60">12:30</span>
        <div className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-foreground/50" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7l10 10-5 5V2l5 5L7 17" /></svg>
          <svg className="w-3.5 h-3.5 text-foreground/50" fill="currentColor" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" /></svg>
          <svg className="w-4 h-4 text-foreground/50" fill="currentColor" viewBox="0 0 24 24"><path d="M2 20h2V10H2zm5 0h2V7H7zm5 0h2V4h-2zm5 0h2V1h-2z" /></svg>
          <svg className="w-6 h-3.5 text-foreground/50" viewBox="0 0 28 14">
            <rect x="0.5" y="0.5" width="24" height="13" rx="2.5" stroke="currentColor" fill="none" strokeWidth="1" />
            <rect x="2" y="2" width="21" height="10" rx="1.5" fill="currentColor" />
            <rect x="25.5" y="4" width="2" height="6" rx="1" fill="currentColor" />
          </svg>
          <span className="text-[10px] font-semibold text-foreground/50 ml-0.5">100%</span>
        </div>
      </div>

      {/* Notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-foreground rounded-[20px] z-20" />

      {/* Header - only home tab, no overlays */}
      {isHomePristine && (
        <div className="absolute top-12 left-0 right-0 z-10">
          <AppHeader onOpenRedPill={handleOpenRedPill} onOpenProfile={handleOpenProfile} />
        </div>
      )}

      {/* Content */}
      <div
        className={[
          "h-full flex flex-col transition-colors duration-300",
          isApp
            ? (isHomePristine ? "pt-28" : "pt-14") + (anyOverlay ? "" : " pb-28")
            : "pt-14 pb-8",
        ].join(" ")}
      >
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="flex-1 min-h-0 flex flex-col"
            >
              <IntroScreen onContinue={goToApp} />
            </motion.div>
          )}

          {phase === "app" && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex-1 min-h-0 flex flex-col"
            >
              {showBalanceTotal ? (
                <BalanceTotalScreen onClose={handleCloseBalanceTotal} />
              ) : showCash ? (
                <CashScreen onClose={handleCloseCash} />
              ) : showCards ? (
                <CardsScreen onClose={handleCloseCards} />
              ) : showInvestments ? (
                <InversionesFlow onClose={handleCloseInvestments} />
              ) : showDollars ? (
                <DollarsScreen onClose={handleCloseDollars} />
              ) : showFincraft ? (
                <FincraftScreen onClose={handleCloseFincraft} />
              ) : showRedPill ? (
                <RedPillScreen onClose={handleCloseRedPill} onOpenFincraft={handleOpenFincraft} />
              ) : (
                <>
                  {activeTab === "home" && (
                    <HomeScreen onOpenCards={handleOpenCards} />
                  )}
                  {activeTab === "portfolio" && (
                    <PortfolioScreen
                      onOpenDollars={handleOpenDollars}
                      onOpenInvestments={handleOpenInvestments}
                      onOpenCash={handleOpenCash}
                    />
                  )}
                  {activeTab === "activity" && <ActivityScreen />}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isApp && !showInvestments && <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />}

      <ProfilePanel open={showProfile} onClose={handleCloseProfile} />

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-foreground/20" />
    </div>

    {/* ── Dev toggle ── */}
    <div
      className="flex items-center gap-1 p-1 rounded-full"
      style={{ background: "rgba(28,28,26,0.10)" }}
    >
      {/* Estado 1: Sin cuenta abierta */}
      <button
        onClick={() => {
          setHasAccount(false)
          setHasInvestments(false)
          setProfileName("")
          setProfileComplete(false)
        }}
        className="text-[12px] font-semibold px-3 py-1 rounded-full transition-all"
        style={{
          background: !hasAccount && !hasInvestments ? "#1c1c1a" : "transparent",
          color: !hasAccount && !hasInvestments ? "#ddf74c" : "rgba(28,28,26,0.4)",
        }}
      >
        Sin cuenta
      </button>
      {/* Estado 2: Sin inversiones */}
      <button
        onClick={() => {
          setHasAccount(true)
          setHasInvestments(false)
          setProfileName("Moderado")
          setProfileComplete(true)
        }}
        className="text-[12px] font-semibold px-3 py-1 rounded-full transition-all"
        style={{
          background: hasAccount && !hasInvestments ? "#1c1c1a" : "transparent",
          color: hasAccount && !hasInvestments ? "#ddf74c" : "rgba(28,28,26,0.4)",
        }}
      >
        Sin inversiones
      </button>
      {/* Estado 3: Con inversiones */}
      <button
        onClick={() => {
          setHasAccount(true)
          setHasInvestments(true)
          setProfileComplete(true)
        }}
        className="text-[12px] font-semibold px-3 py-1 rounded-full transition-all"
        style={{
          background: hasInvestments ? "#1c1c1a" : "transparent",
          color: hasInvestments ? "#ddf74c" : "rgba(28,28,26,0.4)",
        }}
      >
        Con inversiones
      </button>
    </div>
    </div>
  )
}
