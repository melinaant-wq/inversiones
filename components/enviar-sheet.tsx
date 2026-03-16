"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface SendContact {
  username: string
  name: string
  color: string
  lastAmountDisplay: string
  lastAmountRaw: string
}

export const SEND_CONTACTS: SendContact[] = [
  { username: "$chaco", name: "Lucas N. Peréz", color: "#b8a832", lastAmountDisplay: "$5.000", lastAmountRaw: "5000" },
  { username: "$cryptobel", name: "Belén Nuñez", color: "#9e6b6b", lastAmountDisplay: "US$20,00", lastAmountRaw: "20,00" },
  { username: "$slayer666", name: "Sebastián Susnik", color: "#7ed4e0", lastAmountDisplay: "$12.000", lastAmountRaw: "12000" },
]

interface EnviarSheetProps {
  open: boolean
  onClose: () => void
  onSelectContact: (contact: SendContact) => void
}

export default function EnviarSheet({ open, onClose, onSelectContact }: EnviarSheetProps) {
  const [query, setQuery] = useState("")

  const filtered = SEND_CONTACTS.filter(
    (c) =>
      c.username.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[60]"
            style={{ background: "rgba(28,28,26,0.4)" }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="absolute bottom-0 left-0 right-0 z-[60] overflow-hidden"
            style={{
              background: "#f5f4f1",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full" style={{ background: "rgba(28,28,26,0.15)" }} />
            </div>

            {/* Title */}
            <p className="text-[20px] font-bold px-5 pt-3 pb-4" style={{ color: "#0A0A0A" }}>
              Enviar
            </p>

            {/* Search */}
            <div className="px-4 mb-4">
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                style={{ background: "rgba(28,28,26,0.06)" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(10,10,10,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar contacto..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[rgba(10,10,10,0.35)]"
                  style={{ color: "#0A0A0A" }}
                />
              </div>
            </div>

            {/* Section label */}
            <p className="px-5 text-[11px] font-semibold tracking-wider mb-2" style={{ color: "rgba(10,10,10,0.35)" }}>
              RECIENTES
            </p>

            {/* Contacts */}
            <div className="px-4 flex flex-col gap-2 pb-12">
              {filtered.map((c) => (
                <button
                  key={c.username}
                  onClick={() => { onSelectContact(c); onClose() }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-transform"
                  style={{ background: "#ffffff" }}
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold flex-shrink-0"
                    style={{ background: c.color, color: "#0A0A0A" }}
                  >
                    {c.name[0]}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[14px] font-semibold" style={{ color: "#0A0A0A" }}>{c.username}</p>
                    <p className="text-[12px]" style={{ color: "rgba(10,10,10,0.45)" }}>{c.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px]" style={{ color: "rgba(10,10,10,0.35)" }}>{"Último envío"}</p>
                    <p className="text-[13px] font-medium" style={{ color: "rgba(10,10,10,0.55)" }}>{c.lastAmountDisplay}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
