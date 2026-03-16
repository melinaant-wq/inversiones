"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
} from "lucide-react"
import { PORTFOLIO, getStockById, calcCurrentValue, calcPnL, ARS_RATE } from "./inversiones-flow"

interface Props {
  stockId?: string
  onClose: () => void
  onDone: () => void
}

type Step = "select" | "amount" | "receive" | "confirm" | "complete" | "pending" | "cancel"
type ReceiveMethod = "ars" | "usd" | "btc"

const COMMISSION_RATE = 0.01
const BTC_PRICE_USD = 65000

const RECEIVE_OPTIONS: { id: ReceiveMethod; label: string; sublabel: string; icon: string }[] = [
  { id: "ars", label: "Pesos argentinos",   sublabel: "ARS · Acreditación en 24hs hábiles", icon: "🇦🇷" },
  { id: "usd", label: "Dólares",            sublabel: "USD · Ingresa a tu billetera digital",  icon: "💵" },
  { id: "btc", label: "Bitcoin",            sublabel: "BTC · Conversión automática",           icon: "₿" },
]

const SELL_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Todo", "0", "⌫"]

export default function InversionesSell({ stockId: initialStockId, onClose, onDone }: Props) {
  const [step, setStep] = useState<Step>(initialStockId ? "amount" : "select")
  const [selectedStockId, setSelectedStockId] = useState<string | undefined>(initialStockId)
  const [rawDigits, setRawDigits] = useState("")
  const [receiveMethod, setReceiveMethod] = useState<ReceiveMethod>("ars")

  const stock = selectedStockId ? getStockById(selectedStockId) : null
  const holding = selectedStockId ? PORTFOLIO.find((h) => h.stockId === selectedStockId) : null

  const totalCurrentValueUSD = stock && holding ? calcCurrentValue(holding, stock) : 0
  const totalCurrentValueARS = Math.floor(totalCurrentValueUSD * ARS_RATE)
  const pnl = stock && holding ? calcPnL(holding, stock) : null

  const numericARS = parseInt(rawDigits) || 0
  const numericUSD = numericARS / ARS_RATE
  const sharesSelecting = stock ? numericUSD / stock.price : 0
  const commission = numericARS * COMMISSION_RATE
  const netReceiveARS = numericARS - commission
  const netReceiveUSD = netReceiveARS / ARS_RATE
  const netReceiveBTC = netReceiveUSD / BTC_PRICE_USD

  const isAmountValid = numericARS >= 100 && numericARS <= totalCurrentValueARS

  const displayAmt = numericARS > 0 ? numericARS.toLocaleString("es-AR") : "0"
  const fontPx = displayAmt.length <= 4 ? 60 : displayAmt.length <= 7 ? 46 : 34

  const handleKey = (key: string) => {
    if (key === "Todo") {
      setRawDigits(totalCurrentValueARS.toString())
      return
    }
    if (key === "⌫") {
      setRawDigits((p) => p.slice(0, -1))
      return
    }
    if (!key) return
    setRawDigits((p) => {
      const next = p + key
      if (parseInt(next) > 9999999) return p
      return next
    })
  }

  const backFromStep = () => {
    if (step === "amount" && !initialStockId) setStep("select")
    else if (step === "amount") onClose()
    else if (step === "receive") setStep("amount")
    else if (step === "confirm") setStep("receive")
    else onClose()
  }

  // Format the "receive" amount based on selected method
  const receiveDisplay = () => {
    switch (receiveMethod) {
      case "ars": return `$${netReceiveARS.toLocaleString("es-AR", { maximumFractionDigits: 0 })} ARS`
      case "usd": return `USD ${netReceiveUSD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      case "btc": return `≈ ${netReceiveBTC.toFixed(6)} BTC`
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>

        {/* ── Step 1: Select Asset ──────────────────────────────── */}
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-30%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 42 }}
            className="flex flex-col h-full"
          >
            <div className="px-5 pt-2 pb-3 flex-shrink-0">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
                  style={{ background: "rgba(28,28,26,0.06)" }}
                >
                  <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
                </button>
                <h1 className="text-[16px] font-semibold" style={{ color: "#1c1c1a" }}>
                  ¿Qué querés vender?
                </h1>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-4">
              <p
                className="text-[12px] font-semibold mb-3 uppercase tracking-wide"
                style={{ color: "rgba(28,28,26,0.35)" }}
              >
                Tu portfolio
              </p>

              {PORTFOLIO.length === 0 && (
                <div className="flex flex-col items-center py-12">
                  <p className="text-[15px] font-medium" style={{ color: "rgba(28,28,26,0.4)" }}>
                    No tenés posiciones para vender
                  </p>
                </div>
              )}

              {PORTFOLIO.map((h, i) => {
                const s = getStockById(h.stockId)
                if (!s) return null
                const val = calcCurrentValue(h, s)
                const p = calcPnL(h, s)
                return (
                  <motion.button
                    key={h.stockId}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    onClick={() => {
                      setSelectedStockId(h.stockId)
                      setStep("amount")
                    }}
                    className="w-full p-4 rounded-2xl mb-2 active:scale-[0.98] transition-transform text-left"
                    style={{ background: "#e5e4e1" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: s.color }}
                      >
                        <span className="text-[11px] font-bold text-white">{s.symbol.slice(0, 2)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[14px] font-semibold" style={{ color: "#1c1c1a" }}>
                          {s.name}
                        </p>
                        <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.4)" }}>
                          {h.quantity} {h.quantity === 1 ? "acción" : "acciones"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[15px] font-bold" style={{ color: "#1c1c1a" }}>
                          USD {val.toFixed(2)}
                        </p>
                        <div className="flex items-center justify-end gap-0.5">
                          {p.amount >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" style={{ color: "#446e0c" }} />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" style={{ color: "#E63946" }} />
                          )}
                          <span
                            className="text-[12px] font-medium"
                            style={{ color: p.amount >= 0 ? "#446e0c" : "#E63946" }}
                          >
                            {p.pct >= 0 ? "+" : ""}{p.pct.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Amount + Keypad ──────────────────────────── */}
        {step === "amount" && stock && holding && (
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
              <button
                onClick={backFromStep}
                className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
                style={{ background: "rgba(28,28,26,0.06)" }}
              >
                <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
              </button>

              <button
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full"
                style={{ background: "#e5e4e1" }}
              >
                <span className="text-[13px] font-semibold" style={{ color: "#1c1c1a" }}>
                  Orden de mercado
                </span>
                <ChevronDown className="w-3.5 h-3.5" style={{ color: "rgba(28,28,26,0.45)" }} />
              </button>

              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: stock.color }}
              >
                <span className="text-[10px] font-bold text-white">{stock.symbol.slice(0, 2)}</span>
              </div>
            </div>

            {/* Amount display */}
            <div className="flex-1 flex flex-col items-center justify-center px-5 min-h-0">
              <div className="flex items-baseline gap-2">
                <span
                  className="font-bold tabular-nums leading-none"
                  style={{
                    fontSize: fontPx,
                    color: numericARS > 0 ? "#1c1c1a" : "rgba(28,28,26,0.18)",
                    transition: "font-size 0.1s",
                  }}
                >
                  {displayAmt}
                </span>
                <span className="text-[19px] font-semibold" style={{ color: "rgba(28,28,26,0.3)" }}>
                  ARS
                </span>
              </div>
              <div className="mt-3 h-6 flex items-center">
                <p className="text-[14px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                  Vendés{" "}
                  <span
                    className="font-semibold"
                    style={{ color: numericARS > 0 ? "#1c1c1a" : "rgba(28,28,26,0.3)" }}
                  >
                    {numericARS > 0
                      ? sharesSelecting < 1
                        ? sharesSelecting.toFixed(4)
                        : sharesSelecting.toFixed(3)
                      : "0"}{" "}
                    {stock.symbol}
                  </span>
                </p>
              </div>
            </div>

            {/* Holding info pill */}
            <div className="px-5 pb-4 flex justify-center flex-shrink-0">
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-full"
                style={{ background: "#e5e4e1" }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: stock.color }}
                >
                  <span className="text-[7px] font-bold text-white">{stock.symbol.slice(0, 2)}</span>
                </div>
                <span className="text-[13px] font-semibold" style={{ color: "#1c1c1a" }}>
                  {stock.symbol} · USD {totalCurrentValueUSD.toFixed(2)} disponible
                </span>
                {pnl && (
                  <span
                    className="text-[12px] font-semibold"
                    style={{ color: pnl.amount >= 0 ? "#446e0c" : "#E63946" }}
                  >
                    {pnl.pct >= 0 ? "+" : ""}{pnl.pct.toFixed(2)}%
                  </span>
                )}
              </div>
            </div>

            {/* Keypad */}
            <div className="px-4 pb-3 grid grid-cols-3 gap-1.5 flex-shrink-0">
              {SELL_KEYS.map((key, i) => (
                <button
                  key={i}
                  onClick={() => handleKey(key)}
                  className="h-[58px] flex items-center justify-center rounded-2xl active:scale-[0.88] transition-transform select-none"
                  style={{
                    background: "rgba(28,28,26,0.07)",
                    color: "#1c1c1a",
                    fontSize: key === "⌫" ? 18 : key === "Todo" ? 13 : 21,
                    fontWeight: key === "Todo" ? 700 : 600,
                  }}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="px-4 pb-5 flex-shrink-0">
              <button
                onClick={() => isAmountValid && setStep("receive")}
                className="w-full py-4 rounded-2xl active:scale-95 transition-all text-[16px] font-semibold"
                style={{
                  background: isAmountValid ? "#ddf74c" : "rgba(28,28,26,0.08)",
                  color: isAmountValid ? "#1c1c1a" : "rgba(28,28,26,0.3)",
                }}
              >
                {numericARS === 0
                  ? "Ingresá un monto"
                  : numericARS < 100
                  ? "Mínimo $100 ARS"
                  : numericARS > totalCurrentValueARS
                  ? "Saldo insuficiente"
                  : "Continuar"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: ¿Qué querés recibir? ─────────────────────── */}
        {step === "receive" && stock && holding && (
          <motion.div
            key="receive"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-30%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 42 }}
            className="flex flex-col h-full px-5 pt-3 pb-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 flex-shrink-0">
              <button
                onClick={backFromStep}
                className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
                style={{ background: "rgba(28,28,26,0.06)" }}
              >
                <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
              </button>
              <h1 className="text-[16px] font-semibold" style={{ color: "#1c1c1a" }}>
                ¿Cómo querés recibir?
              </h1>
            </div>

            {/* Amount summary */}
            <div
              className="flex items-center gap-3 p-4 rounded-2xl mb-5 flex-shrink-0"
              style={{ background: "#e5e4e1" }}
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: stock.color }}
              >
                <span className="text-[12px] font-bold text-white">{stock.symbol.slice(0, 2)}</span>
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold" style={{ color: "#1c1c1a" }}>
                  {sharesSelecting < 1 ? sharesSelecting.toFixed(4) : sharesSelecting.toFixed(3)}{" "}
                  {stock.symbol}
                </p>
                <p className="text-[12px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                  Monto bruto: ${numericARS.toLocaleString("es-AR")} ARS
                </p>
              </div>
            </div>

            {/* Receive options */}
            <div className="flex-1 flex flex-col gap-2">
              {RECEIVE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setReceiveMethod(opt.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl active:scale-[0.98] transition-transform"
                  style={{
                    background: receiveMethod === opt.id ? "rgba(221,247,76,0.2)" : "rgba(28,28,26,0.05)",
                    border: receiveMethod === opt.id ? "1.5px solid rgba(221,247,76,0.8)" : "1.5px solid transparent",
                  }}
                >
                  <span className="text-[28px]">{opt.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="text-[15px] font-semibold" style={{ color: "#1c1c1a" }}>
                      {opt.label}
                    </p>
                    <p className="text-[12px] mt-0.5" style={{ color: "rgba(28,28,26,0.45)" }}>
                      {opt.sublabel}
                    </p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor: receiveMethod === opt.id ? "#1c1c1a" : "rgba(28,28,26,0.2)",
                      background: receiveMethod === opt.id ? "#1c1c1a" : "transparent",
                    }}
                  >
                    {receiveMethod === opt.id && (
                      <span className="text-[9px] font-bold" style={{ color: "#ddf74c" }}>✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Net receive preview */}
            <div
              className="mt-4 p-4 rounded-2xl flex-shrink-0"
              style={{ background: "rgba(68,110,12,0.08)" }}
            >
              <p className="text-[12px] mb-0.5" style={{ color: "rgba(28,28,26,0.5)" }}>
                Recibís (aprox.)
              </p>
              <p className="text-[18px] font-bold" style={{ color: "#446e0c" }}>
                {receiveDisplay()}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(28,28,26,0.35)" }}>
                Neto de comisión del 1%
              </p>
            </div>

            <button
              onClick={() => setStep("confirm")}
              className="w-full py-4 rounded-2xl active:scale-95 transition-transform text-[16px] font-semibold mt-4 flex-shrink-0"
              style={{ background: "#ddf74c", color: "#1c1c1a" }}
            >
              Revisar venta
            </button>
          </motion.div>
        )}

        {/* ── Step 4: Confirm ─────────────────────────────────────── */}
        {step === "confirm" && stock && holding && (
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
              <button
                onClick={() => setStep("receive")}
                className="w-9 h-9 flex items-center justify-center rounded-full active:scale-90 transition-transform"
                style={{ background: "rgba(28,28,26,0.06)" }}
              >
                <ArrowLeft className="w-4 h-4" style={{ color: "#1c1c1a" }} />
              </button>
              <h1 className="text-[16px] font-semibold" style={{ color: "#1c1c1a" }}>
                Confirmá la venta
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
                  {sharesSelecting < 1 ? sharesSelecting.toFixed(4) : sharesSelecting.toFixed(3)}{" "}
                  {stock.symbol}
                </p>
              </div>
            </div>

            {/* Big net receive */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="text-[13px] mb-1.5" style={{ color: "rgba(28,28,26,0.45)" }}>
                Recibís
              </p>
              <p
                className="text-[40px] font-bold tabular-nums leading-tight"
                style={{ color: "#446e0c" }}
              >
                {receiveDisplay()}
              </p>
              <p className="text-[13px] mt-3" style={{ color: "rgba(28,28,26,0.4)" }}>
                Comisión del 1%{" "}
                <span style={{ color: "rgba(28,28,26,0.55)" }}>
                  (${commission.toLocaleString("es-AR", { maximumFractionDigits: 0 })} ARS)
                </span>
              </p>

              <p
                className="text-[11px] mt-5 leading-relaxed px-4"
                style={{ color: "rgba(28,28,26,0.3)" }}
              >
                Los fondos estarán disponibles dentro de las próximas 24hs hábiles.
              </p>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0">
              <button
                onClick={() => setStep("complete")}
                className="w-full py-4 rounded-2xl active:scale-95 transition-transform text-[16px] font-semibold"
                style={{ background: "#ddf74c", color: "#1c1c1a" }}
              >
                Confirmar venta
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Step 5: Complete ────────────────────────────────────── */}
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
                ¡Venta exitosa!
              </h2>
              <p className="text-[15px] mb-1" style={{ color: "rgba(28,28,26,0.6)" }}>Vendiste</p>
              <p className="text-[20px] font-bold mb-1" style={{ color: "#1c1c1a" }}>
                {sharesSelecting < 1 ? sharesSelecting.toFixed(4) : sharesSelecting.toFixed(2)}{" "}
                {stock.symbol}
              </p>
              <div
                className="mt-4 px-4 py-3 rounded-2xl"
                style={{ background: "rgba(68,110,12,0.1)" }}
              >
                <p className="text-[15px] font-semibold" style={{ color: "#446e0c" }}>
                  Recibís {receiveDisplay()}
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: "rgba(28,28,26,0.4)" }}>
                  Disponible en{" "}
                  {RECEIVE_OPTIONS.find((o) => o.id === receiveMethod)?.label} dentro de 24hs hábiles
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

        {/* ── Step 6: Pending ─────────────────────────────────────── */}
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
                Tu orden de venta de{" "}
                <span className="font-semibold" style={{ color: "#1c1c1a" }}>
                  {sharesSelecting < 1 ? sharesSelecting.toFixed(4) : sharesSelecting.toFixed(3)} {stock.symbol}
                </span>{" "}
                está siendo procesada.
              </p>
              <div
                className="px-4 py-3 rounded-2xl"
                style={{ background: "rgba(245,158,11,0.1)" }}
              >
                <p className="text-[13px]" style={{ color: "#92400E" }}>
                  Recibirás {receiveDisplay()} cuando se ejecute.
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

        {/* ── Step 7: Cancelled ───────────────────────────────────── */}
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
                No pudimos ejecutar la venta de{" "}
                <span className="font-semibold" style={{ color: "#1c1c1a" }}>
                  {stock.symbol}
                </span>
                . Precio fuera de rango o liquidez insuficiente.
              </p>
              <div
                className="px-4 py-3 rounded-2xl"
                style={{ background: "rgba(230,57,70,0.08)" }}
              >
                <p className="text-[13px]" style={{ color: "#E63946" }}>
                  Tus acciones no fueron vendidas.
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
    </div>
  )
}
