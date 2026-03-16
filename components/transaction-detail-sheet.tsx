"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MapPin, CreditCard, ArrowDownLeft, ArrowUpRight, Copy } from "lucide-react"
import { MorphIcon } from '@/components/ui/morph-icon'
import { useState } from "react"

export interface TransactionDetail {
  id: string
  icon: string
  title: string
  date: string
  amount: string
  isPositive: boolean
  subtitle?: string
  // Extended info for Apple Wallet-style detail
  fullDate?: string
  method?: string
  cardLast4?: string
  category?: string
  reference?: string
  location?: {
    name: string
    address: string
    lat: number
    lng: number
  }
}

interface TransactionDetailSheetProps {
  open: boolean
  transaction: TransactionDetail | null
  onClose: () => void
}

export default function TransactionDetailSheet({ open, transaction, onClose }: TransactionDetailSheetProps) {
  const [copiedRef, setCopiedRef] = useState(false)

  const handleCopyRef = () => {
    if (transaction?.reference) {
      navigator.clipboard.writeText(transaction.reference)
      setCopiedRef(true)
      setTimeout(() => setCopiedRef(false), 2000)
    }
  }

  if (!transaction) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 z-50"
            style={{ background: "rgba(28,28,26,0.25)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 38 }}
            className="absolute inset-x-0 bottom-0 z-60 flex flex-col overflow-hidden"
            style={{
              height: transaction.location ? "85%" : "65%",
              background: "#f5f4f1",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              boxShadow: "0 -4px 30px rgba(0,0,0,0.12)",
            }}
          >
            {/* Handle + close */}
            <div className="flex items-center justify-between px-5 pt-3 pb-2">
              <div className="w-8" />
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(28,28,26,0.12)" }} />
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full active:scale-95 transition-transform"
                style={{ background: "rgba(28,28,26,0.06)" }}
              >
                <MorphIcon icon="close" size={16} color="#1c1c1a" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Hero section */}
              <div className="flex flex-col items-center px-5 pt-2 pb-5">
                {/* Icon */}
                <div
                  className="w-14 h-14 flex items-center justify-center text-2xl rounded-full mb-3"
                  style={{ background: transaction.isPositive ? "rgba(68,110,12,0.1)" : "rgba(28,28,26,0.06)" }}
                >
                  {transaction.icon}
                </div>
                {/* Title */}
                <p className="text-[15px] font-medium" style={{ color: "rgba(28,28,26,0.5)" }}>
                  {transaction.title}
                </p>
                {/* Merchant / subtitle */}
                {transaction.subtitle && (
                  <p className="text-[14px] font-semibold mt-0.5" style={{ color: "#1c1c1a" }}>
                    {transaction.subtitle}
                  </p>
                )}
                {/* Amount */}
                <p
                  className="text-[32px] font-bold tracking-tight mt-2"
                  style={{
                    color: transaction.isPositive ? "#446e0c" : "#1c1c1a",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {transaction.amount}
                </p>
                {/* Date */}
                <p className="text-[13px] mt-1" style={{ color: "rgba(28,28,26,0.4)" }}>
                  {transaction.fullDate || transaction.date}
                </p>
              </div>

              {/* Map for physical purchases */}
              {transaction.location && (
                <div className="px-5 mb-4">
                  <div
                    className="overflow-hidden rounded-2xl"
                    style={{ border: "1px solid rgba(28,28,26,0.06)" }}
                  >
                    {/* Static map image */}
                    <div className="relative w-full" style={{ height: 160 }}>
                      <img
                        src={`https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-s+1c1c1a(${transaction.location.lng},${transaction.location.lat})/${transaction.location.lng},${transaction.location.lat},15,0/400x160@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''}`}
                        alt={`Mapa de ${transaction.location.name}`}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          // Fallback if mapbox fails
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          const parent = target.parentElement
                          if (parent) {
                            parent.style.background = "#e5e4e1"
                            parent.innerHTML = `<div class="flex items-center justify-center h-full"><div class="text-center"><div style="color:rgba(28,28,26,0.3)" class="flex justify-center mb-1"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div><p style="color:rgba(28,28,26,0.3);font-size:12px">${transaction.location.name}</p></div></div>`
                          }
                        }}
                      />
                    </div>
                    {/* Location info */}
                    <div className="flex items-center gap-2.5 px-3.5 py-3" style={{ background: "#f5f4f1" }}>
                      <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(28,28,26,0.35)" }} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold" style={{ color: "#1c1c1a" }}>
                          {transaction.location.name}
                        </p>
                        <p className="text-[11px] truncate" style={{ color: "rgba(28,28,26,0.4)" }}>
                          {transaction.location.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Detail rows */}
              <div className="px-5">
                {transaction.method && (
                  <div
                    className="flex items-center justify-between py-3"
                    style={{ borderBottom: "1px solid rgba(28,28,26,0.06)" }}
                  >
                    <span className="text-[13px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                      {"M\u00E9todo"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" style={{ color: "rgba(28,28,26,0.4)" }} />
                      <span className="text-[13px] font-medium" style={{ color: "#1c1c1a" }}>
                        {transaction.method}
                      </span>
                    </div>
                  </div>
                )}

                {transaction.cardLast4 && (
                  <div
                    className="flex items-center justify-between py-3"
                    style={{ borderBottom: "1px solid rgba(28,28,26,0.06)" }}
                  >
                    <span className="text-[13px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                      Tarjeta
                    </span>
                    <span className="text-[13px] font-medium tabular-nums" style={{ color: "#1c1c1a" }}>
                      **** {transaction.cardLast4}
                    </span>
                  </div>
                )}

                {transaction.category && (
                  <div
                    className="flex items-center justify-between py-3"
                    style={{ borderBottom: "1px solid rgba(28,28,26,0.06)" }}
                  >
                    <span className="text-[13px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                      {"Categor\u00EDa"}
                    </span>
                    <span className="text-[13px] font-medium" style={{ color: "#1c1c1a" }}>
                      {transaction.category}
                    </span>
                  </div>
                )}

                <div
                  className="flex items-center justify-between py-3"
                  style={{ borderBottom: "1px solid rgba(28,28,26,0.06)" }}
                >
                  <span className="text-[13px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                    Tipo
                  </span>
                  <div className="flex items-center gap-1.5">
                    {transaction.isPositive
                      ? <ArrowDownLeft className="w-3.5 h-3.5" style={{ color: "#446e0c" }} />
                      : <ArrowUpRight className="w-3.5 h-3.5" style={{ color: "rgba(28,28,26,0.4)" }} />
                    }
                    <span className="text-[13px] font-medium" style={{ color: "#1c1c1a" }}>
                      {transaction.isPositive ? "Ingreso" : "Gasto"}
                    </span>
                  </div>
                </div>

                {transaction.reference && (
                  <div
                    className="flex items-center justify-between py-3"
                    style={{ borderBottom: "1px solid rgba(28,28,26,0.06)" }}
                  >
                    <span className="text-[13px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                      Referencia
                    </span>
                    <button
                      onClick={handleCopyRef}
                      className="flex items-center gap-1.5 active:opacity-60 transition-opacity"
                    >
                      <span className="text-[13px] font-mono font-medium tabular-nums" style={{ color: "#1c1c1a" }}>
                        {transaction.reference}
                      </span>
                      {copiedRef
                        ? <MorphIcon icon="check" size={14} color="#446e0c" />
                        : <Copy className="w-3.5 h-3.5" style={{ color: "rgba(28,28,26,0.3)" }} />
                      }
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between py-3">
                  <span className="text-[13px]" style={{ color: "rgba(28,28,26,0.45)" }}>
                    Estado
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-[6px] h-[6px] rounded-full" style={{ background: "#446e0c" }} />
                    <span className="text-[13px] font-medium" style={{ color: "#446e0c" }}>
                      Confirmado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
