"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Clock, XCircle, Info } from "lucide-react"
import { MorphIcon } from '@/components/ui/morph-icon'
import { STOCKS, getStockById, ARS_RATE } from "./inversiones-flow"

interface Props {
  stockId?: string
  onClose: () => void
  onDone: () => void
}

type Step = "asset-select" | "amount" | "confirm" | "complete" | "pending" | "cancel"

const PAYMENT_METHODS = [
  { id: "ars",  label: "Pesos ARS", balance: 45230,  currency: "ARS", icon: "🇦🇷" },
  { id: "usd",  label: "Dólares",   balance: 123.45, currency: "USD", icon: "💵" },
]

const COMMISSION_RATE = 0.01
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"]

export default function InversionesBuy({ stockId: initialStockId, onClose, onDone }: Props) {
  const [step, setStep] = useState<Step>(initialStockId ? "amount" : "asset-select")
  const [selectedStockId, setSelectedStockId] = useState<string | undefined>(initialStockId)
  const [rawDigits, setRawDigits] = useState("")
  const [paymentIdx, setPaymentIdx] = useState(0)
  const [showPaymentSheet, setShowPaymentSheet] = useState(false)
  const [showMarketInfo, setShowMarketInfo] = useState(false)

  const stock = selectedStockId ? getStockById(selectedStockId) : null
  const payment = PAYMENT_METHODS[paymentIdx]
  const isUSD = payment.currency === "USD"

  // ── Amount derivations ─────────────────────────────────────────
  // ARS mode: rawDigits = integer pesos
  // USD mode: rawDigits = integer cents (divide by 100 for dollars)
  const rawValue = parseInt(rawDigits) || 0
  const numericUSD = isUSD ? rawValue / 100 : rawValue / ARS_RATE
  const numericARS = isUSD ? (rawValue / 100) * ARS_RATE : rawValue
  const sharesReceived = stock ? numericUSD / stock.price : 0

  // Commission and total in the selected payment currency
  const commission = isUSD ? numericUSD * COMMISSION_RATE : numericARS * COMMISSION_RATE
  const totalToPay  = isUSD ? numericUSD + commission     : numericARS + commission

  // Validity: minimum 100 ARS equivalent, max = available balance in own currency
  const isAmountValid =
    numericARS >= 100 &&
    (isUSD ? numericUSD <= payment.balance : numericARS <= payment.balance)

  // ── Display helpers ────────────────────────────────────────────
  const displayAmt = isUSD
    ? (rawValue / 100).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : rawValue > 0 ? rawValue.toLocaleString("es-AR") : "0"

  const fontPx = displayAmt.length <= 4 ? 60 : displayAmt.length <= 7 ? 46 : 34

  // ── Total display helpers (confirm + complete) ─────────────────
  const totalDisplay = isUSD
    ? `USD ${totalToPay.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${totalToPay.toLocaleString("es-AR", { maximumFractionDigits: 0 })} ARS`

  const commissionDisplay = isUSD
    ? `USD ${commission.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${commission.toLocaleString("es-AR", { maximumFractionDigits: 0 })} ARS`

  const handleKey = (key: string) => {
    if (!key) return
    if (key === "⌫") {
      setRawDigits((p) => p.slice(0, -1))
      return
    }
    setRawDigits((p) => {
      const next = p + key
      if (parseInt(next) > 9999999) return p
      return next
    })
  }

  const selectPayment = (idx: number) => {
    setPaymentIdx(idx)
    setRawDigits("") // reset amount when switching currency
    setShowPaymentSheet(false)
  }

  const backFromStep = () => {
    if (step === "amount" && !initialStockId) setStep("asset-select")
    else if (step === "amount") onClose()
    else if (step === "confirm") setStep("amount")
    else onClose()
  }

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <AnimatePresence mode="wait" initial={false}>

        {/* ── Step 1: Asset Selection ────────────────────────────── */}
        {step === "asset-select" && (
          <motion.div
            key="asset-select"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-30%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 42 }}
            className="flex flex-col h-full"
          >
            <div className="px-5 pt-2 pb-3 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={onClose}>
                    <MorphIcon icon="arrow-left" size={20} color="#fff" />
                </button>
                <h1 className="text-[16px] font-semibold" style={{ color: "#1c1c1a" }}>
                  ¿Qué querés comprar?
                </h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-4">
              <p
                className="text-[12px] font-semibold mb-3 uppercase tracking-wide"
                style={{ color: "rgba(28,28,26,0.35)" }}
              >
                Populares
              </p>
              {STOCKS.slice(0, 6).map((s, i) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  onClick={() => {
                    setSelectedStockId(s.id)
                    setStep("amount")
                  }}
                  className="w-full flex items-center gap-3 py-3.5 active:opacity-60 transition-opacity"
                  style={{ borderBottom: "1px solid rgba(28,28,26,0.06)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: s.color }}
                  >
                    <span className="text-[11px] font-bold text-white">{s.symbol.slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-semibold" style={{ color: "#1c1c1a" }}>{s.name}</p>
                    <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.4)" }}>{s.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-semibold" style={{ color: "#1c1c1a" }}>
                      ${s.price.toFixed(2)}
                    </p>
                    <p className="text-[12px]" style={{ color: s.change >= 0 ? "#446e0c" : "#E63946" }}>
                      {s.change >= 0 ? "+" : ""}{s.change.toFixed(2)}%
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Amount + Keypad ──────────────────────────────── */}
        {step === "amount" && stock && (
          <motion.div
            key="amount"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-30%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 42 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="px-4 pt-3 pb-2 flex items-center justify-between flex-shrink-0">
              <button onClick={backFromStep}>
                  <MorphIcon icon="arrow-left" size={20} color="#fff" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMarketInfo((v) => !v)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full active:scale-95 transition-transform"
                  style={{ background: "#e5e4e1" }}
                >
                  <span className="text-[13px] font-semibold" style={{ color: "#1c1c1a" }}>
                    Precio de mercado actual
                  </span>
                  <Info className="w-3.5 h-3.5" style={{ color: "rgba(28,28,26,0.45)" }} />
                </button>
                <AnimatePresence>
                  {showMarketInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 p-3 rounded-2xl z-20 w-56"
                      style={{ background: "#1c1c1a" }}
                    >
                      <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                        Tu compra se ejecuta al precio vigente en el momento del procesamiento. El precio puede variar levemente.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: stock.color }}
              >
                <span className="text-[10px] font-bold text-white">{stock.symbol.slice(0, 2)}</span>
              </div>
            </div>

            {/* Amount display */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isUSD ? "usd" : "ars"}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-baseline gap-2"
                >
                  <span
                    className="font-bold tabular-nums leading-none"
                    style={{
                      fontSize: fontPx,
                      color: rawValue > 0 ? "#1c1c1a" : "rgba(28,28,26,0.18)",
                      transition: "font-size 0.1s",
                    }}
                  >
                    {displayAmt}
                  </span>
                  <span className="text-[19px] font-semibold" style={{ color: "rgba(28,28,26,0.3)" }}>
                    {isUSD ? "USD" : "ARS"}
                  </span>
                </motion.div>
              </AnimatePresence>

              <div className="mt-3 h-6 flex items-center">
                <p className="text-[14px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                  Obtenés{" "}
                  <span
                    className="font-semibold"
                    style={{ color: rawValue > 0 ? "#1c1c1a" : "rgba(28,28,26,0.3)" }}
                  >
                    {rawValue > 0
                      ? sharesReceived < 1
                        ? sharesReceived.toFixed(4)
                        : sharesReceived.toFixed(3)
                      : "0"}{" "}
                    {stock.symbol}
                  </span>
                </p>
              </div>
            </div>

            {/* Payment pill — opens bottomsheet */}
            <div className="px-5 pb-4 flex justify-center flex-shrink-0">
              <button
                onClick={() => setShowPaymentSheet(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full active:scale-95 transition-transform"
                style={{ background: "#e5e4e1" }}
              >
                <span className="text-[15px]">{payment.icon}</span>
                <span className="text-[13px] font-semibold" style={{ color: "#1c1c1a" }}>
                  {payment.label}
                  {" · "}
                  {payment.currency === "ARS" ? "$" : "USD "}
                  {payment.balance.toLocaleString("es-AR", { maximumFractionDigits: 0 })}
                </span>
                <MorphIcon icon="chevron-down" size={14} color="rgba(28,28,26,0.4)" />
              </button>
            </div>

            {/* Keypad */}
            <div className="px-4 pb-3 grid grid-cols-3 gap-1.5 flex-shrink-0">
              {KEYS.map((key, i) => (
                <button
                  key={i}
                  onClick={() => handleKey(key)}
                  disabled={!key}
                  className="h-[58px] flex items-center justify-center rounded-2xl active:scale-[0.88] transition-transform select-none"
                  style={{
                    background: key === "" ? "transparent" : "rgba(28,28,26,0.07)",
                    color: "#1c1c1a",
                    fontSize: key === "⌫" ? 18 : 21,
                    fontWeight: 600,
                    cursor: key === "" ? "default" : "pointer",
                  }}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="px-4 pb-5 flex-shrink-0">
              <button
                onClick={() => { if (isAmountValid) { setShowPaymentSheet(false); setStep("confirm") } }}
                className="w-full py-4 rounded-2xl active:scale-95 transition-all text-[16px] font-semibold"
                style={{
                  background: isAmountValid ? "#ddf74c" : "rgba(28,28,26,0.08)",
                  color: isAmountValid ? "#1c1c1a" : "rgba(28,28,26,0.3)",
                }}
              >
                {rawValue === 0
                  ? "Ingresá un monto"
                  : numericARS < 100
                  ? "Mínimo $100 ARS"
                  : numericARS > (isUSD ? payment.balance * ARS_RATE : payment.balance)
                  ? "Saldo insuficiente"
                  : "Revisar compra"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Confirm ─────────────────────────────────────── */}
        {step === "confirm" && stock && (
          <motion.div
            key="confirm"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-30%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 42 }}
            className="flex flex-col h-full px-5 pt-3 pb-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 flex-shrink-0">
              <button onClick={() => setStep("amount")}>
                  <MorphIcon icon="arrow-left" size={20} color="#fff" />
              </button>
              <h1 className="text-[16px] font-semibold" style={{ color: "#1c1c1a" }}>
                Confirmá tu compra
              </h1>
            </div>

            {/* Asset block */}
            <div
              className="flex items-center gap-3 p-4 rounded-2xl mb-4 flex-shrink-0"
              style={{ background: "#e5e4e1" }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: stock.color }}
              >
                <span className="text-[12px] font-bold text-white">{stock.symbol.slice(0, 2)}</span>
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold" style={{ color: "#1c1c1a" }}>{stock.name}</p>
                <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                  {sharesReceived < 1 ? sharesReceived.toFixed(4) : sharesReceived.toFixed(3)}{" "}
                  {stock.symbol}
                </p>
              </div>
              {/* Payment badge */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[15px]">{payment.icon}</span>
                <span className="text-[12px] font-semibold" style={{ color: "rgba(28,28,26,0.55)" }}>
                  {payment.label}
                </span>
              </div>
            </div>

            {/* Big total */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="text-[13px] mb-1.5" style={{ color: "rgba(28,28,26,0.45)" }}>
                Total a pagar
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-[48px] font-bold tabular-nums leading-none"
                  style={{ color: "#1c1c1a" }}
                >
                  {isUSD
                    ? totalToPay.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : `$${totalToPay.toLocaleString("es-AR", { maximumFractionDigits: 0 })}`}
                </span>
                <span className="text-[20px] font-semibold" style={{ color: "rgba(28,28,26,0.3)" }}>
                  {isUSD ? "USD" : "ARS"}
                </span>
              </div>
              <p className="text-[13px] mt-3" style={{ color: "rgba(28,28,26,0.4)" }}>
                Incluye comisión del 1%{" "}
                <span style={{ color: "rgba(28,28,26,0.55)" }}>
                  ({commissionDisplay})
                </span>
              </p>

              <p
                className="text-[11px] mt-5 leading-relaxed px-4"
                style={{ color: "rgba(28,28,26,0.3)" }}
              >
                El precio final puede variar levemente por la volatilidad del mercado.
              </p>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <button
                onClick={() => setStep("complete")}
                className="w-full py-4 rounded-2xl active:scale-95 transition-transform text-[16px] font-semibold"
                style={{ background: "#ddf74c", color: "#1c1c1a" }}
              >
                Confirmar compra
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 4: Complete ────────────────────────────────────── */}
        {step === "complete" && stock && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col h-full items-center justify-center px-8 text-center"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="mb-6"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "#ddf74c" }}
              >
                <CheckCircle2 className="w-10 h-10" style={{ color: "#1c1c1a" }} strokeWidth={2.5} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="text-[24px] font-bold mb-2" style={{ color: "#1c1c1a" }}>
                ¡Compra exitosa!
              </h2>
              <p className="text-[15px] mb-1" style={{ color: "rgba(28,28,26,0.6)" }}>Compraste</p>
              <p className="text-[20px] font-bold mb-1" style={{ color: "#1c1c1a" }}>
                {sharesReceived < 1 ? sharesReceived.toFixed(4) : sharesReceived.toFixed(2)}{" "}
                {stock.symbol}
              </p>
              <p className="text-[15px]" style={{ color: "rgba(28,28,26,0.5)" }}>
                por {totalDisplay}
              </p>
              <div
                className="mt-4 px-4 py-3 rounded-2xl"
                style={{ background: "rgba(221,247,76,0.25)" }}
              >
                <p className="text-[13px]" style={{ color: "rgba(28,28,26,0.6)" }}>
                  Precio ejecutado:{" "}
                  <span className="font-semibold" style={{ color: "#1c1c1a" }}>
                    USD {stock.price.toFixed(2)}
                  </span>
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full mt-8 flex flex-col gap-2"
            >
              <button
                onClick={onDone}
                className="w-full py-4 rounded-2xl active:scale-95 transition-transform text-[15px] font-semibold"
                style={{ background: "#1c1c1a", color: "#ddf74c" }}
              >
                Ver mi portfolio
              </button>
              <button
                onClick={onDone}
                className="w-full py-3 rounded-2xl active:scale-95 transition-transform text-[14px] font-medium"
                style={{ color: "rgba(28,28,26,0.5)" }}
              >
                Volver al inicio
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Step 5: Pending ─────────────────────────────────────── */}
        {step === "pending" && stock && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col h-full items-center justify-center px-8 text-center"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="mb-6"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(245,158,11,0.12)" }}
              >
                <Clock className="w-10 h-10" style={{ color: "#D97706" }} strokeWidth={2} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="text-[24px] font-bold mb-2" style={{ color: "#1c1c1a" }}>
                Orden en proceso
              </h2>
              <p className="text-[15px] mb-4 leading-relaxed" style={{ color: "rgba(28,28,26,0.6)" }}>
                Tu orden de{" "}
                <span className="font-semibold" style={{ color: "#1c1c1a" }}>
                  {sharesReceived < 1 ? sharesReceived.toFixed(4) : sharesReceived.toFixed(3)} {stock.symbol}
                </span>{" "}
                está siendo procesada. Cuando se ejecute, te avisamos.
              </p>
              <div
                className="px-4 py-3 rounded-2xl"
                style={{ background: "rgba(245,158,11,0.1)" }}
              >
                <p className="text-[13px]" style={{ color: "#92400E" }}>
                  Monto reservado: {totalDisplay}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full mt-8 flex flex-col gap-2"
            >
              <button
                onClick={onDone}
                className="w-full py-4 rounded-2xl active:scale-95 transition-transform text-[15px] font-semibold"
                style={{ background: "#1c1c1a", color: "#ddf74c" }}
              >
                Entendido
              </button>
              <button
                onClick={onDone}
                className="w-full py-3 rounded-2xl active:scale-95 transition-transform text-[14px] font-medium"
                style={{ color: "rgba(28,28,26,0.5)" }}
              >
                Volver al inicio
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Step 6: Cancelled ───────────────────────────────────── */}
        {step === "cancel" && stock && (
          <motion.div
            key="cancel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col h-full items-center justify-center px-8 text-center"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="mb-6"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(230,57,70,0.1)" }}
              >
                <XCircle className="w-10 h-10" style={{ color: "#E63946" }} strokeWidth={2} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h2 className="text-[24px] font-bold mb-2" style={{ color: "#1c1c1a" }}>
                Orden cancelada
              </h2>
              <p className="text-[15px] mb-4 leading-relaxed" style={{ color: "rgba(28,28,26,0.6)" }}>
                No pudimos ejecutar tu orden de{" "}
                <span className="font-semibold" style={{ color: "#1c1c1a" }}>
                  {stock.symbol}
                </span>
                . Puede deberse a precio fuera de rango o falta de liquidez.
              </p>
              <div
                className="px-4 py-3 rounded-2xl"
                style={{ background: "rgba(230,57,70,0.08)" }}
              >
                <p className="text-[13px]" style={{ color: "#E63946" }}>
                  No se realizaron cargos en tu cuenta.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full mt-8 flex flex-col gap-2"
            >
              <button
                onClick={() => setStep("amount")}
                className="w-full py-4 rounded-2xl active:scale-95 transition-transform text-[15px] font-semibold"
                style={{ background: "#1c1c1a", color: "#ddf74c" }}
              >
                Intentar de nuevo
              </button>
              <button
                onClick={onDone}
                className="w-full py-3 rounded-2xl active:scale-95 transition-transform text-[14px] font-medium"
                style={{ color: "rgba(28,28,26,0.5)" }}
              >
                Volver al inicio
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Payment Bottomsheet (only on amount step) ──────────── */}
      <AnimatePresence>
        {step === "amount" && showPaymentSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentSheet(false)}
              className="absolute inset-0 z-10"
              style={{ background: "rgba(28,28,26,0.45)" }}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="absolute bottom-0 left-0 right-0 z-20 rounded-t-3xl px-5 pt-3 pb-8"
              style={{ background: "#f5f4f1" }}
            >
              {/* Handle */}
              <div
                className="w-10 h-1 rounded-full mx-auto mb-5"
                style={{ background: "rgba(28,28,26,0.15)" }}
              />
              <p className="text-[16px] font-bold mb-4" style={{ color: "#1c1c1a" }}>
                Pagá con
              </p>

              {PAYMENT_METHODS.map((pm, i) => (
                <button
                  key={pm.id}
                  onClick={() => selectPayment(i)}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl mb-2 active:scale-[0.98] transition-transform"
                  style={{
                    background: paymentIdx === i ? "rgba(221,247,76,0.2)" : "rgba(28,28,26,0.05)",
                    border: paymentIdx === i ? "1.5px solid rgba(221,247,76,0.8)" : "1.5px solid transparent",
                  }}
                >
                  <span className="text-[24px]">{pm.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-semibold" style={{ color: "#1c1c1a" }}>
                      {pm.label}
                    </p>
                    <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.4)" }}>
                      {pm.currency === "ARS" ? "$" : "USD "}
                      {pm.balance.toLocaleString("es-AR", { maximumFractionDigits: 0 })} disponible
                    </p>
                  </div>
                  {paymentIdx === i && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: "#1c1c1a" }}
                    >
                      <span className="text-[10px] font-bold" style={{ color: "#ddf74c" }}>✓</span>
                    </div>
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
