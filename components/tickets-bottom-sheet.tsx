"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface TicketsBottomSheetProps {
  open: boolean
  onClose: () => void
}

export default function TicketsBottomSheet({ open, onClose }: TicketsBottomSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-[60]"
            style={{ background: "rgba(28,28,26,0.4)" }}
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="absolute bottom-0 left-0 right-0 z-[60] flex flex-col overflow-hidden"
            style={{
              height: "80%",
              background: "#f5f4f1",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-9 h-1 rounded-full" style={{ background: "rgba(28,28,26,0.15)" }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3 pt-1">
              <h2 className="text-[18px] font-bold" style={{ color: "#1c1c1a" }}>
                Tickets
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full active:scale-95 transition-transform"
                style={{ background: "rgba(28,28,26,0.06)" }}
              >
                <X className="w-4 h-4" style={{ color: "#1c1c1a" }} />
              </button>
            </div>

            {/* Empty content */}
            <div className="flex-1 overflow-y-auto px-5 pb-8" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
