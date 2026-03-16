"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MorphIcon } from "@/components/ui/morph-icon"
import type { SendContact } from "./enviar-sheet"

type MethodType = "lemon" | "transferencia"
type CurrencyType = "pesos" | "dolares" | "crypto"

interface SendScreenProps {
  contact: SendContact
  onClose: () => void
}

const CURRENCY_CONFIG: Record<CurrencyType, { label: string; prefix: string; color: string; bg: string }> = {
  pesos: { label: "Pesos", prefix: "$", color: "#3b83f7", bg: "rgba(59,131,247,0.10)" },
  dolares: { label: "Dólares", prefix: "US$", color: "#446e0c", bg: "rgba(68,110,12,0.10)" },
  crypto: { label: "Crypto", prefix: "", color: "#ff8700", bg: "rgba(255,135,0,0.10)" },
}

const CURRENCY_ORDER: CurrencyType[] = ["pesos", "dolares", "crypto"]

const NUMPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0", "⌫"]

function formatDisplayAmount(raw: string): string {
  if (!raw) return "0"
  const [intPart, decPart] = raw.split(",")
  const intNum = parseInt(intPart || "0", 10)
  const formatted = isNaN(intNum) ? "0" : intNum.toLocaleString("es-AR")
  return decPart !== undefined ? `${formatted},${decPart}` : formatted
}

export default function SendScreen({ contact, onClose }: SendScreenProps) {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState<MethodType>("lemon")
  const [currency, setCurrency] = useState<CurrencyType>("pesos")
  const [sent, setSent] = useState(false)

  const cfg = CURRENCY_CONFIG[currency]
  const displayAmount = formatDisplayAmount(amount)
  const hasAmount = amount.length > 0 && amount !== "0"
  const isLong = displayAmount.replace(",", "").length > 7

  const handleKey = (key: string) => {
    if (key === "⌫") {
      setAmount((prev) => prev.slice(0, -1))
    } else if (key === ",") {
      if (!amount.includes(",")) setAmount((prev) => (prev || "0") + ",")
    } else {
      setAmount((prev) => (prev === "0" ? key : prev + key))
    }
  }

  const handlePreset = () => {
    setAmount(contact.lastAmountRaw)
  }

  const handleSend = () => {
    if (!hasAmount) return
    setSent(true)
    setTimeout(onClose, 1400)
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 380, damping: 40 }}
      className="absolute inset-0 z-[55] flex flex-col"
      style={{ background: "#f5f4f1" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2">
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: "rgba(28,28,26,0.07)" }}
        >
          <MorphIcon icon="close" size={16} color="#0A0A0A" />
        </button>

        {/* Recipient */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold"
            style={{ background: contact.color, color: "#0A0A0A" }}
          >
            {contact.name[0]}
          </div>
          <span className="text-[13px] font-semibold" style={{ color: "#0A0A0A" }}>
            {contact.username}
          </span>
        </div>

        {/* Spacer */}
        <div className="w-9" />
      </div>

      {/* Amount area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
        {/* Amount display */}
        <div className="flex items-baseline gap-0.5">
          {cfg.prefix && (
            <span
              className="font-bold"
              style={{
                color: "rgba(10,10,10,0.3)",
                fontSize: isLong ? "22px" : "28px",
                lineHeight: 1,
              }}
            >
              {cfg.prefix}
            </span>
          )}
          <span
            className="font-bold leading-none"
            style={{
              color: "#0A0A0A",
              fontSize: isLong ? "44px" : "60px",
            }}
          >
            {displayAmount}
          </span>
        </div>

        {/* Method + Currency toggles */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => setMethod((m) => (m === "lemon" ? "transferencia" : "lemon"))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium active:scale-95 transition-all"
            style={{ background: "rgba(28,28,26,0.07)", color: "#0A0A0A" }}
          >
            <span>{method === "lemon" ? "🍋" : "🏦"}</span>
            <span>{method === "lemon" ? "LemonTag" : "Transferencia"}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(10,10,10,0.35)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          <button
            onClick={() => {
              const next = CURRENCY_ORDER[(CURRENCY_ORDER.indexOf(currency) + 1) % CURRENCY_ORDER.length]
              setCurrency(next)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium active:scale-95 transition-all"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            <span>{cfg.label}</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>

        {/* Preset chip */}
        <AnimatePresence>
          {!hasAmount && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              onClick={handlePreset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium active:scale-95 transition-transform"
              style={{ background: "rgba(28,28,26,0.06)", color: "rgba(10,10,10,0.55)" }}
            >
              Última vez {contact.lastAmountDisplay}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Numpad */}
      <div className="px-6 pb-1">
        <div className="grid grid-cols-3 gap-2.5">
          {NUMPAD_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className="h-14 rounded-2xl flex items-center justify-center text-[22px] font-medium active:scale-95 transition-transform"
              style={{
                background: key === "⌫" ? "transparent" : "rgba(28,28,26,0.07)",
                color: key === "⌫" ? "rgba(10,10,10,0.5)" : "#0A0A0A",
              }}
            >
              {key === "⌫" ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              ) : key}
            </button>
          ))}
        </div>
      </div>

      {/* Send CTA */}
      <div className="px-5 pb-8 pt-3">
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div
              key="sent"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full h-14 rounded-full flex items-center justify-center gap-2"
              style={{ background: "#DBFF00" }}
            >
              <MorphIcon icon="check" size={18} color="#0A0A0A" />
              <span className="text-[16px] font-bold" style={{ color: "#0A0A0A" }}>
                Enviado
              </span>
            </motion.div>
          ) : (
            <motion.button
              key="send"
              onClick={handleSend}
              whileTap={{ scale: 0.97 }}
              className="w-full h-14 rounded-full flex items-center justify-center text-[16px] font-bold"
              style={{
                background: hasAmount ? "#0A0A0A" : "rgba(28,28,26,0.10)",
                color: hasAmount ? "#DBFF00" : "rgba(10,10,10,0.30)",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {hasAmount
                ? `Enviar ${cfg.prefix}${displayAmount}`
                : "Enviar"}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
