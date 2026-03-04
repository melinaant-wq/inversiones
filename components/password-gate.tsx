"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const PASSWORD = "lemon2026"
const STORAGE_KEY = "inv_proto_auth"

interface Props {
  children: React.ReactNode
}

export default function PasswordGate({ children }: Props) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState("")
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === PASSWORD) setUnlocked(true)
    setChecking(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, PASSWORD)
      setUnlocked(true)
    } else {
      setError(true)
      setInput("")
      setTimeout(() => setError(false), 1800)
    }
  }

  if (checking) return null

  if (unlocked) return <>{children}</>

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#f5f4f1" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[320px]"
      >
        {/* Logo / Brand */}
        <div className="flex justify-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "#ddf74c" }}
          >
            <span className="text-[22px] font-black" style={{ color: "#1c1c1a" }}>L</span>
          </div>
        </div>

        <h1
          className="text-[22px] font-bold text-center mb-1"
          style={{ color: "#1c1c1a" }}
        >
          Prototipo interno
        </h1>
        <p
          className="text-[14px] text-center mb-8"
          style={{ color: "rgba(28,28,26,0.45)" }}
        >
          Ingresá la contraseña para acceder
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={error ? "error" : "normal"}
              animate={error ? { x: [-6, 6, -5, 5, 0] } : { x: 0 }}
              transition={{ duration: 0.35 }}
            >
              <input
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Contraseña"
                autoFocus
                className="w-full px-4 py-3.5 rounded-2xl text-[15px] outline-none transition-all"
                style={{
                  background: error ? "rgba(230,57,70,0.08)" : "#e5e4e1",
                  color: "#1c1c1a",
                  border: error ? "1.5px solid rgba(230,57,70,0.4)" : "1.5px solid transparent",
                }}
              />
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[13px] text-center"
              style={{ color: "#E63946" }}
            >
              Contraseña incorrecta
            </motion.p>
          )}

          <button
            type="submit"
            disabled={!input}
            className="w-full py-3.5 rounded-2xl text-[15px] font-semibold transition-all active:scale-95"
            style={{
              background: input ? "#1c1c1a" : "rgba(28,28,26,0.1)",
              color: input ? "#ddf74c" : "rgba(28,28,26,0.3)",
            }}
          >
            Acceder
          </button>
        </form>

        <p
          className="text-[12px] text-center mt-6"
          style={{ color: "rgba(28,28,26,0.25)" }}
        >
          Uso interno · No compartir
        </p>
      </motion.div>
    </div>
  )
}
