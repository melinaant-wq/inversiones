"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUserConfig } from "@/lib/user-config"

// ── States ─────────────────────────────────────────────────────

const STATES = [
  {
    id: "no-account",
    label: "Sin cuenta abierta",
    emoji: "🔒",
    desc: "Nuevo usuario, debe hacer onboarding",
    apply: (ctx: ReturnType<typeof useUserConfig>) => {
      ctx.setHasAccount(false)
      ctx.setHasInvestments(false)
      ctx.setProfileName("")
      ctx.setProfileComplete(false)
    },
  },
  {
    id: "no-investments",
    label: "Sin inversiones",
    emoji: "📋",
    desc: "Tiene cuenta pero aún no invirtió",
    apply: (ctx: ReturnType<typeof useUserConfig>) => {
      ctx.setHasAccount(true)
      ctx.setHasInvestments(false)
      ctx.setProfileComplete(true)
    },
  },
  {
    id: "with-investments",
    label: "Con inversiones",
    emoji: "📈",
    desc: "Usuario con portafolio activo",
    apply: (ctx: ReturnType<typeof useUserConfig>) => {
      ctx.setHasAccount(true)
      ctx.setHasInvestments(true)
      ctx.setProfileComplete(true)
    },
  },
] as const

const PROFILES = ["Conservador", "Moderado", "Audaz"] as const

// ── Panel ──────────────────────────────────────────────────────

export default function DevStatePanel() {
  const ctx = useUserConfig()
  const [open, setOpen] = useState(false)

  const activeId = ctx.hasInvestments
    ? "with-investments"
    : ctx.hasAccount
    ? "no-investments"
    : "no-account"

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 500, damping: 36 }}
            className="rounded-2xl overflow-hidden shadow-xl"
            style={{
              background: "#1c1c1a",
              border: "1px solid rgba(255,255,255,0.1)",
              width: 220,
            }}
          >
            {/* Header */}
            <div
              className="px-3.5 py-2.5 border-b"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            >
              <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "#ddf74c" }}>
                Dev · Estado de cuenta
              </p>
            </div>

            {/* State buttons */}
            <div className="p-2 flex flex-col gap-1">
              {STATES.map((s) => {
                const active = activeId === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      s.apply(ctx)
                      if (s.id === "no-investments" && !ctx.profileName) {
                        ctx.setProfileName("Moderado")
                      }
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors"
                    style={{
                      background: active ? "#ddf74c" : "rgba(255,255,255,0.05)",
                    }}
                  >
                    <span className="text-[16px] leading-none">{s.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[12px] font-semibold leading-tight"
                        style={{ color: active ? "#1c1c1a" : "#ffffff" }}
                      >
                        {s.label}
                      </p>
                      <p
                        className="text-[10px] leading-tight mt-0.5"
                        style={{ color: active ? "rgba(28,28,26,0.55)" : "rgba(255,255,255,0.4)" }}
                      >
                        {s.desc}
                      </p>
                    </div>
                    {active && (
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: "rgba(28,28,26,0.15)", color: "#1c1c1a" }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Profile selector — only shown when "sin inversiones" is active */}
            <AnimatePresence>
              {activeId === "no-investments" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="px-3.5 pt-1 pb-3"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p
                      className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      Perfil inversor
                    </p>
                    <div className="flex gap-1.5">
                      {PROFILES.map((p) => {
                        const selected = ctx.profileName === p
                        return (
                          <button
                            key={p}
                            onClick={() => ctx.setProfileName(p)}
                            className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-colors"
                            style={{
                              background: selected ? "#ddf74c" : "rgba(255,255,255,0.08)",
                              color: selected ? "#1c1c1a" : "rgba(255,255,255,0.6)",
                            }}
                          >
                            {p}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.9 }}
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-[16px]"
        style={{ background: open ? "#ddf74c" : "#1c1c1a" }}
        title="Dev: cambiar estado de cuenta"
      >
        {open ? "✕" : "🧪"}
      </motion.button>
    </div>
  )
}
