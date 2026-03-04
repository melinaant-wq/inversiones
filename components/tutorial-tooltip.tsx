"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"

interface TutorialTooltipProps {
  targetRef: React.RefObject<HTMLElement | null>
  message: string
  emoji?: string
  position?: "top" | "bottom" | "left" | "right"
  show: boolean
}

export default function TutorialTooltip({ targetRef, message, emoji, position = "bottom", show }: TutorialTooltipProps) {
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!show || !targetRef.current) return
    const updatePosition = () => {
      const targetRect = targetRef.current?.getBoundingClientRect()
      if (!targetRect) return
      const tooltipWidth = 220
      const tooltipHeight = 60
      const offset = 10
      let top = 0
      let left = 0
      switch (position) {
        case "top":
          top = targetRect.top - tooltipHeight - offset
          left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2
          break
        case "bottom":
          top = targetRect.bottom + offset
          left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2
          break
        case "left":
          top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2
          left = targetRect.left - tooltipWidth - offset
          break
        case "right":
          top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2
          left = targetRect.right + offset
          break
      }
      const padding = 16
      left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding))
      top = Math.max(padding, Math.min(top, window.innerHeight - tooltipHeight - padding))
      setTooltipPosition({ top, left })
    }
    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition)
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition)
    }
  }, [show, targetRef, position])

  if (!mounted) return null

  const arrowColor = "#ddf74c"

  const getArrowStyles = () => {
    const arrowSize = 7
    switch (position) {
      case "top":
        return {
          bottom: -arrowSize,
          left: "50%",
          transform: "translateX(-50%)",
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderTop: `${arrowSize}px solid ${arrowColor}`,
        }
      case "bottom":
        return {
          top: -arrowSize,
          left: "50%",
          transform: "translateX(-50%)",
          borderLeft: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid ${arrowColor}`,
        }
      case "left":
        return {
          right: -arrowSize,
          top: "50%",
          transform: "translateY(-50%)",
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderLeft: `${arrowSize}px solid ${arrowColor}`,
        }
      case "right":
        return {
          left: -arrowSize,
          top: "50%",
          transform: "translateY(-50%)",
          borderTop: `${arrowSize}px solid transparent`,
          borderBottom: `${arrowSize}px solid transparent`,
          borderRight: `${arrowSize}px solid ${arrowColor}`,
        }
    }
  }

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.2 }}
          className="fixed z-[9999] pointer-events-none"
          style={{ top: tooltipPosition.top, left: tooltipPosition.left, width: 220 }}
        >
          <div
            className="px-4 py-3 text-center relative"
            style={{ background: "#1c1c1a", border: "2px solid #ddf74c" }}
          >
            <p className="text-[13px] font-bold leading-relaxed font-mono" style={{ color: "#ddf74c" }}>
              {message} {emoji && <span className="ml-0.5">{emoji}</span>}
            </p>
            <motion.div
              animate={{
                y: position === "top" || position === "bottom" ? [0, position === "top" ? 3 : -3, 0] : 0,
                x: position === "left" || position === "right" ? [0, position === "left" ? 3 : -3, 0] : 0,
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute w-0 h-0"
              style={getArrowStyles() as React.CSSProperties}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
