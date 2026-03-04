"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check, Ticket } from "lucide-react"
import ChatBottomSheet from "./chat-bottom-sheet"
import SettingsBottomSheet from "./settings-bottom-sheet"
import TicketsBottomSheet from "./tickets-bottom-sheet"

interface Contact {
  username: string
  name: string
  color: string
}

const FAVORITES: Contact[] = [
  { username: "$chaco", name: "Lucas Nahuel Per\u00E9z", color: "#b8a832" },
  { username: "$cryptobel", name: "Bel\u00E9n Nu\u00F1ez", color: "#9e6b6b" },
  { username: "$slayer666", name: "Sebasti\u00E1n Susnik", color: "#7ed4e0" },
]

interface ProfilePanelProps {
  open: boolean
  onClose: () => void
}

export default function ProfilePanel({ open, onClose }: ProfilePanelProps) {
  const [copied, setCopied] = useState(false)
  const [chatContact, setChatContact] = useState<Contact | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showTickets, setShowTickets] = useState(false)

  const handleCopy = () => {
    navigator.clipboard?.writeText("0038274982530739")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenChat = (contact: Contact) => {
    setChatContact(contact)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 z-40"
            style={{ background: "rgba(28,28,26,0.3)" }}
            onClick={onClose}
          />

          {/* Panel sliding from left */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="absolute top-0 left-0 bottom-0 z-50 flex flex-col overflow-hidden"
            style={{
              width: "82%",
              background: "#f5f4f1",
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            {/* Close button */}
            <div className="flex justify-end px-5 pt-14 pb-2">
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full active:scale-95 transition-transform"
                style={{ background: "rgba(28,28,26,0.06)" }}
              >
                <X className="w-4 h-4" style={{ color: "#1c1c1a" }} />
              </button>
            </div>

            {/* Profile content */}
            <div className="flex-1 px-6 pb-6 flex flex-col overflow-y-auto">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-full flex-shrink-0"
                style={{ background: "#ddf74c" }}
              />

              {/* Username */}
              <h1
                className="text-[28px] font-bold mt-5 leading-tight"
                style={{ color: "#1c1c1a" }}
              >
                $rawpower
              </h1>

              {/* Alias */}
              <div className="mt-6">
                <p className="text-[13px] font-medium" style={{ color: "rgba(28,28,26,0.4)" }}>
                  Alias
                </p>
                <p className="text-[16px] font-semibold mt-1" style={{ color: "#1c1c1a" }}>
                  ana.lemonapp
                </p>
              </div>

              {/* CVU */}
              <div className="mt-5">
                <p className="text-[13px] font-medium" style={{ color: "rgba(28,28,26,0.4)" }}>
                  CVU
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[16px] font-semibold" style={{ color: "#1c1c1a" }}>
                    0038274982530739
                  </p>
                  <button
                    onClick={handleCopy}
                    className="w-7 h-7 flex items-center justify-center rounded-md active:scale-95 transition-transform"
                    style={{ background: "rgba(28,28,26,0.06)" }}
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5" style={{ color: "#446e0c" }} />
                    ) : (
                      <Copy className="w-3.5 h-3.5" style={{ color: "rgba(28,28,26,0.5)" }} />
                    )}
                  </button>
                </div>
              </div>

              {/* Favoritos */}
              <div className="mt-8">
                <h2 className="text-[16px] font-bold" style={{ color: "#1c1c1a" }}>
                  Favoritos
                </h2>
                <div className="flex flex-col gap-1 mt-4">
                  {FAVORITES.map((contact) => (
                    <button
                      key={contact.username}
                      onClick={() => handleOpenChat(contact)}
                      className="flex items-center gap-3 py-3 px-1 rounded-xl active:bg-[rgba(28,28,26,0.04)] transition-colors text-left w-full"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex-shrink-0"
                        style={{ background: contact.color }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span
                          className="text-[13px] font-medium"
                          style={{ color: "rgba(28,28,26,0.45)" }}
                        >
                          {contact.username}
                        </span>
                        <span
                          className="text-[15px] font-semibold"
                          style={{ color: "#1c1c1a" }}
                        >
                          {contact.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Bottom buttons */}
              <div className="mt-6 flex items-center gap-2.5">
                <button
                  onClick={() => setShowSettings(true)}
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full active:scale-95 transition-transform"
                  style={{ background: "#d9d9d9" }}
                >
                  <span className="text-[16px] font-semibold" style={{ color: "#1c1c1a" }}>
                    Ana Varela
                  </span>
                </button>
                <button
                  onClick={() => setShowTickets(true)}
                  className="w-[52px] h-[52px] flex items-center justify-center rounded-full active:scale-95 transition-transform"
                  style={{ background: "#d9d9d9" }}
                >
                  <Ticket className="w-5 h-5" strokeWidth={1.8} style={{ color: "#1c1c1a" }} />
                </button>
              </div>
            </div>

            {/* Chat bottom sheet */}
            <ChatBottomSheet
              open={chatContact !== null}
              contact={chatContact}
              onClose={() => setChatContact(null)}
            />

            {/* Settings bottom sheet */}
            <SettingsBottomSheet
              open={showSettings}
              onClose={() => setShowSettings(false)}
            />

            {/* Tickets bottom sheet */}
            <TicketsBottomSheet
              open={showTickets}
              onClose={() => setShowTickets(false)}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
