"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Eye, EyeOff, Snowflake, Unlock, Copy } from "lucide-react"

interface CardsScreenProps {
  onClose: () => void
}

export default function CardsScreen({ onClose }: CardsScreenProps) {
  const [activeCard, setActiveCard] = useState<"physical" | "virtual">("physical")
  const [showNumber, setShowNumber] = useState(false)
  const [isFrozen, setIsFrozen] = useState(false)

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
            style={{ background: "rgba(28,28,26,0.06)" }}
          >
            <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
          </button>
          <h1
            className="text-[16px] font-semibold"
            style={{ color: "#1c1c1a" }}
          >
            Tarjetas
          </h1>
        </div>

        {/* Card selector tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setActiveCard("physical"); setShowNumber(false) }}
            className="flex-1 py-2.5 text-center rounded-2xl active:scale-95 transition-all"
            style={{
              background: activeCard === "physical" ? "#1c1c1a" : "rgba(28,28,26,0.04)",
            }}
          >
            <span
              className="text-[13px] font-semibold"
              style={{ color: activeCard === "physical" ? "#ddf74c" : "#1c1c1a" }}
            >
              {"F\u00edsica"}
            </span>
          </button>
          <button
            onClick={() => { setActiveCard("virtual"); setShowNumber(false) }}
            className="flex-1 py-2.5 text-center rounded-2xl active:scale-95 transition-all"
            style={{
              background: activeCard === "virtual" ? "#1c1c1a" : "rgba(28,28,26,0.04)",
            }}
          >
            <span
              className="text-[13px] font-semibold"
              style={{ color: activeCard === "virtual" ? "#ddf74c" : "#1c1c1a" }}
            >
              Virtual
            </span>
          </button>
        </div>

        {/* Card visual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden p-6 rounded-3xl"
            style={{
              background: activeCard === "physical" ? "#ddf74c" : "#2b2a28",
              minHeight: "190px",
            }}
          >
            {/* Frozen overlay */}
            {isFrozen && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl"
                style={{ background: activeCard === "physical" ? "rgba(221,247,76,0.9)" : "rgba(28,28,26,0.85)" }}
              >
                <div className="text-center">
                  <Snowflake className="w-8 h-8 mx-auto mb-2" style={{ color: activeCard === "physical" ? "#1c1c1a" : "#6CB4EE" }} />
                  <p className="text-[14px] font-semibold" style={{ color: activeCard === "physical" ? "#1c1c1a" : "#6CB4EE" }}>
                    Tarjeta congelada
                  </p>
                </div>
              </div>
            )}

            {/* Card content */}
            <div className="relative z-0 flex flex-col justify-between h-full" style={{ minHeight: "150px" }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-medium" style={{ color: activeCard === "physical" ? "rgba(28,28,26,0.5)" : "rgba(255,255,255,0.4)" }}>
                    {activeCard === "physical" ? "Tarjeta fisica" : "Tarjeta virtual"}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: activeCard === "physical" ? "rgba(28,28,26,0.3)" : "rgba(255,255,255,0.2)" }}>
                    Lemon Debit
                  </p>
                </div>
                {activeCard === "physical" ? (
                  <div className="w-10 h-7 rounded-sm" style={{ background: "#1c1c1a" }} />
                ) : (
                  <div
                    className="w-10 h-7 flex items-center justify-center rounded-sm"
                    style={{ border: "1px dashed rgba(255,255,255,0.2)" }}
                  >
                    <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>V</span>
                  </div>
                )}
              </div>

              {/* Card number */}
              <div className="mt-5">
                <p className="text-[18px] font-bold tracking-widest" style={{ color: activeCard === "physical" ? "#1c1c1a" : "#FFFFFF" }}>
                  {showNumber
                    ? (activeCard === "physical" ? "4532 8821 0044 4582" : "4532 8821 0071 7291")
                    : (activeCard === "physical" ? "**** **** **** 4582" : "**** **** **** 7291")
                  }
                </p>
              </div>

              {/* Expiry + CVV */}
              <div className="flex items-end justify-between mt-4">
                <div>
                  <p className="text-[10px]" style={{ color: activeCard === "physical" ? "rgba(28,28,26,0.3)" : "rgba(255,255,255,0.2)" }}>
                    Vence
                  </p>
                  <p className="text-[14px] font-semibold" style={{ color: activeCard === "physical" ? "rgba(28,28,26,0.7)" : "rgba(255,255,255,0.6)" }}>
                    {showNumber ? "09/28" : "**/**"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px]" style={{ color: activeCard === "physical" ? "rgba(28,28,26,0.3)" : "rgba(255,255,255,0.2)" }}>
                    CVV
                  </p>
                  <p className="text-[14px] font-semibold" style={{ color: activeCard === "physical" ? "rgba(28,28,26,0.7)" : "rgba(255,255,255,0.6)" }}>
                    {showNumber ? "847" : "***"}
                  </p>
                </div>
                <p className="text-[14px] font-bold" style={{ color: activeCard === "physical" ? "rgba(28,28,26,0.35)" : "rgba(255,255,255,0.25)" }}>
                  VISA
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Card action buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setShowNumber(!showNumber)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl active:scale-95 transition-transform"
            style={{ background: "rgba(28,28,26,0.04)" }}
          >
            {showNumber ? <EyeOff className="w-4 h-4" style={{ color: "#1c1c1a" }} /> : <Eye className="w-4 h-4" style={{ color: "#1c1c1a" }} />}
            <span className="text-[12px] font-medium" style={{ color: "#1c1c1a" }}>
              {showNumber ? "Ocultar" : "Mostrar"}
            </span>
          </button>
          {activeCard === "virtual" && (
            <button
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl active:scale-95 transition-transform"
              style={{ background: "rgba(28,28,26,0.04)" }}
            >
              <Copy className="w-4 h-4" style={{ color: "#1c1c1a" }} />
              <span className="text-[12px] font-medium" style={{ color: "#1c1c1a" }}>
                Copiar
              </span>
            </button>
          )}
          <button
            onClick={() => setIsFrozen(!isFrozen)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl active:scale-95 transition-transform"
            style={{
              background: isFrozen ? "#6CB4EE" : "rgba(28,28,26,0.04)",
            }}
          >
            {isFrozen
              ? <Unlock className="w-4 h-4" style={{ color: "#1c1c1a" }} />
              : <Snowflake className="w-4 h-4" style={{ color: "#1c1c1a" }} />
            }
            <span className="text-[12px] font-medium" style={{ color: "#1c1c1a" }}>
              {isFrozen ? "Activar" : "Congelar"}
            </span>
          </button>
        </div>

        {/* Spending limit */}
        <div className="mt-4 p-4 rounded-2xl" style={{ background: "rgba(28,28,26,0.03)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12px] font-medium" style={{ color: "rgba(28,28,26,0.4)" }}>
              {"L\u00edmite mensual"}
            </span>
            <span className="text-[14px] font-bold" style={{ color: "#1c1c1a" }}>
              ${activeCard === "physical" ? "97,29" : "114,97"} / $500
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(28,28,26,0.06)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: activeCard === "physical" ? "19%" : "23%" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "#ddf74c" }}
            />
          </div>
        </div>
      </div>


    </div>
  )
}
