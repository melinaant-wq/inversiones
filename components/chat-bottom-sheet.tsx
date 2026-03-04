"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send } from "lucide-react"

interface Contact {
  username: string
  name: string
  color: string
}

interface Message {
  id: number
  text: string
  fromMe: boolean
  time: string
}

interface ChatBottomSheetProps {
  open: boolean
  contact: Contact | null
  onClose: () => void
}

export default function ChatBottomSheet({ open, contact, onClose }: ChatBottomSheetProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setMessages([])
      setInput("")
      setTimeout(() => inputRef.current?.focus(), 400)
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    const now = new Date()
    const time = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0")
    setMessages((prev) => [...prev, { id: Date.now(), text, fromMe: true, time }])
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!contact) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 400, damping: 38 }}
          className="absolute inset-x-0 bottom-0 z-60 flex flex-col overflow-hidden"
          style={{
            height: "75%",
            background: "#f5f4f1",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            boxShadow: "0 -4px 30px rgba(0,0,0,0.12)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: "1px solid rgba(28,28,26,0.08)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex-shrink-0"
              style={{ background: contact.color }}
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[15px] font-semibold" style={{ color: "#1c1c1a" }}>
                {contact.name}
              </span>
              <span className="text-[12px]" style={{ color: "rgba(28,28,26,0.4)" }}>
                {contact.username}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full active:scale-95 transition-transform"
              style={{ background: "rgba(28,28,26,0.06)" }}
            >
              <X className="w-4 h-4" style={{ color: "#1c1c1a" }} />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-[13px] font-medium text-center" style={{ color: "rgba(28,28,26,0.25)" }}>
                  {"Escrib\u00ED un mensaje a " + contact.name.split(" ")[0]}
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[75%] px-3.5 py-2.5 rounded-2xl"
                  style={{
                    background: msg.fromMe ? "#1c1c1a" : "#e5e4e1",
                    borderBottomRightRadius: msg.fromMe ? 6 : 16,
                    borderBottomLeftRadius: msg.fromMe ? 16 : 6,
                  }}
                >
                  <p
                    className="text-[14px] leading-snug"
                    style={{ color: msg.fromMe ? "#f5f4f1" : "#1c1c1a" }}
                  >
                    {msg.text}
                  </p>
                  <p
                    className="text-[10px] mt-1 text-right"
                    style={{ color: msg.fromMe ? "rgba(255,255,255,0.4)" : "rgba(28,28,26,0.3)" }}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div
            className="flex items-center gap-2 px-4 py-3"
            style={{ borderTop: "1px solid rgba(28,28,26,0.08)" }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Mensaje..."
              className="flex-1 text-[14px] px-4 py-3 rounded-full outline-none"
              style={{
                background: "#e5e4e1",
                color: "#1c1c1a",
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-all"
              style={{
                background: input.trim() ? "#1c1c1a" : "rgba(28,28,26,0.1)",
              }}
            >
              <Send
                className="w-4 h-4"
                style={{ color: input.trim() ? "#f5f4f1" : "rgba(28,28,26,0.3)" }}
              />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
